/**
 * Deterministic Delta-Time Virtual Simulation Clock
 * Replaces disconnected setInterval/setTimeout timers with a unified requestAnimationFrame loop.
 */

export type ClockTickCallback = (deltaTimeMs: number, virtualTimeMs: number) => void;

export class VirtualSimulationClock {
  private rafId: number | null = null;
  private lastWallTime: number = 0;
  private virtualTimeMs: number = 0;
  private speedMultiplier: number = 1.0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private tickCallbacks: Set<ClockTickCallback> = new Set();

  constructor(defaultSpeed: number = 1.0) {
    this.speedMultiplier = defaultSpeed;
  }

  public subscribe(cb: ClockTickCallback): () => void {
    this.tickCallbacks.add(cb);
    return () => {
      this.tickCallbacks.delete(cb);
    };
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
  }

  public reset(): void {
    this.stop();
    this.virtualTimeMs = 0;
    this.lastWallTime = 0;
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
    }

    this.lastWallTime = currentWallTime;
    this.rafId = requestAnimationFrame(this.onFrame);
  };
}

export const globalVirtualClock = new VirtualSimulationClock(1.0);
