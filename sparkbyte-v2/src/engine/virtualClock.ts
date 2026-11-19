/**
 * Deterministic Delta-Time Virtual Simulation Clock
 * Replaces disconnected setInterval/setTimeout timers with a unified requestAnimationFrame loop.
 */

export type ClockTickCallback = (deltaTimeMs: number, virtualTimeMs: number) => void;
export type UiTickCallback = (virtualTimeMs: number) => void;

export class VirtualSimulationClock {
  private rafId: number | null = null;
  private lastWallTime: number = 0;
  private lastUiDispatchTime: number = 0;
  private uiDispatchIntervalMs: number = 55; // ~18 FPS (50–65ms) to prevent main thread starvation
  private virtualTimeMs: number = 0;
  private speedMultiplier: number = 1.0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private tickCallbacks: Set<ClockTickCallback> = new Set();
  private uiTickCallbacks: Set<UiTickCallback> = new Set();

  constructor(defaultSpeed: number = 1.0) {
    this.speedMultiplier = defaultSpeed;
  }

  public subscribe(cb: ClockTickCallback): () => void {
    this.tickCallbacks.add(cb);
    return () => {
      this.tickCallbacks.delete(cb);
    };
  }

  public subscribeUi(cb: UiTickCallback): () => void {
    this.uiTickCallbacks.add(cb);
    return () => {
      this.uiTickCallbacks.delete(cb);
    };
  }

  public triggerUiSnapshot(): void {
    this.uiTickCallbacks.forEach((cb) => {
      try {
        cb(this.virtualTimeMs);
      } catch (e) {
        console.error('[VirtualClock] UI Subscriber error:', e);
      }
    });
  }

  public setSpeed(speed: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(5.0, speed));
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public start(): void {
    if (this.isRunning && !this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastWallTime = performance.now();

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.onFrame);
    }
  }

  public pause(): void {
    this.isPaused = true;
    this.triggerUiSnapshot();
  }

  public resume(): void {
    if (!this.isRunning) {
      this.start();
      return;
    }
    this.isPaused = false;
    this.lastWallTime = performance.now();
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.triggerUiSnapshot();
  }

  public reset(): void {
    this.stop();
    this.virtualTimeMs = 0;
    this.lastWallTime = 0;
    this.triggerUiSnapshot();
  }

  public getVirtualTime(): number {
    return this.virtualTimeMs;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  private onFrame = (currentWallTime: number): void => {
    if (!this.isRunning) {
      this.rafId = null;
      return;
    }

    if (!this.isPaused) {
      const rawDelta = currentWallTime - this.lastWallTime;
      // Clamp delta to prevent huge jumps on tab switch / backgrounding
      const clampedDelta = Math.min(rawDelta, 100);
      const scaledDelta = clampedDelta * this.speedMultiplier;

      this.virtualTimeMs += scaledDelta;

      // Broadcast to subscribers
      this.tickCallbacks.forEach((cb) => {
        try {
          cb(scaledDelta, this.virtualTimeMs);
        } catch (e) {
          console.error('[VirtualClock] Subscriber error:', e);
        }
      });

      // Throttled UI snapshot dispatcher (~15–20 FPS / every 50–65ms) to update DOM without starving main thread
      if (currentWallTime - this.lastUiDispatchTime >= this.uiDispatchIntervalMs) {
        this.lastUiDispatchTime = currentWallTime;
        this.triggerUiSnapshot();
      }
    }

    this.lastWallTime = currentWallTime;
    this.rafId = requestAnimationFrame(this.onFrame);
  };
}

export const globalVirtualClock = new VirtualSimulationClock(1.0);
