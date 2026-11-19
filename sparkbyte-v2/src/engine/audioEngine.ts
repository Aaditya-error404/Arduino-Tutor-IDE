/**
 * Real Web Audio API Synthesizer Engine for Buzzer, Musical Piano & DMM Continuity
 *
 * Features:
 * - Click-free anti-pop linear gain envelope (attack/decay ramping)
 * - Autoplay unlocking on user gesture
 * - Timed note playback for musical keyboards (playNote)
 * - Continuous tone synthesis for Arduino tone() and DMM continuity beeper
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

export class WebAudioBuzzer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private enabled = true;
  private noteTimeout: any = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(en: boolean) {
    this.enabled = en;
    if (!en) this.stopTone();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Plays a continuous tone at specified frequency (Hz).
   */
  public playTone(freq: number, volume: number = 0.05) {
    if (!this.enabled || freq <= 0) {
      this.stopTone();
      return;
    }
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      if (!this.osc) {
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();
        this.osc.type = 'square';
        // Gentle ramp in to avoid loud audio clicks/pops
        this.gain.gain.setValueAtTime(0.0001, now);
        this.gain.gain.linearRampToValueAtTime(Math.min(0.2, volume), now + 0.008);
        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.osc.start();
      } else if (this.gain) {
        this.gain.gain.cancelScheduledValues(now);
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(Math.min(0.2, volume), now + 0.008);
      }
      this.osc.frequency.setValueAtTime(freq, now);
    } catch {
      // AudioContext autoplay restrictions
    }
  }

  /**
   * Plays a single musical note with automatic release after durationMs.
   */
  public playNote(freq: number, durationMs: number = 280, volume: number = 0.06) {
    if (this.noteTimeout) {
      clearTimeout(this.noteTimeout);
      this.noteTimeout = null;
    }
    this.playTone(freq, volume);
    this.noteTimeout = setTimeout(() => {
      this.stopTone();
      this.noteTimeout = null;
    }, durationMs);
  }

  /**
   * Stops active tone with smooth anti-pop release ramp.
   */
  public stopTone() {
    if (this.noteTimeout) {
      clearTimeout(this.noteTimeout);
      this.noteTimeout = null;
    }
    try {
      if (this.gain && this.ctx) {
        const now = this.ctx.currentTime;
        this.gain.gain.cancelScheduledValues(now);
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(0.0001, now + 0.015);
      }
      const currentOsc = this.osc;
      const currentGain = this.gain;
      this.osc = null;
      this.gain = null;
      setTimeout(() => {
        try {
          if (currentOsc) {
            currentOsc.stop();
            currentOsc.disconnect();
          }
          if (currentGain) {
            currentGain.disconnect();
          }
        } catch {}
      }, 20);
    } catch {
      // Ignore
    }
  }
}

export const buzzerAudio = new WebAudioBuzzer();
