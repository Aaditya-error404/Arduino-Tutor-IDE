/**
 * Real Web Audio API Synthesizer Engine for Buzzer & DMM Continuity
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

export class WebAudioBuzzer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private enabled = true;

  public setEnabled(en: boolean) {
    this.enabled = en;
    if (!en) this.stopTone();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playTone(freq: number) {
    if (!this.enabled || freq <= 0) {
      this.stopTone();
      return;
    }
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.osc) {
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(0.04, this.ctx.currentTime); // gentle, comfortable volume
        this.osc.type = 'square';
        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.osc.start();
      }
      this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    } catch {
      // AudioContext autoplay restrictions
    }
  }

  public stopTone() {
    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
        this.osc = null;
      }
      if (this.gain) {
        this.gain.disconnect();
        this.gain = null;
      }
    } catch {
      // Ignore
    }
  }
}

export const buzzerAudio = new WebAudioBuzzer();
