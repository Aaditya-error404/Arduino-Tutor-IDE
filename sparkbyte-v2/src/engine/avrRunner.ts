/**
 * AVR ATmega328P CPU Runner — Cycle-Accurate 16MHz Emulation Layer
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 *
 * This module wraps avr8js to run real (or deterministic-fallback) ATmega328P
 * firmware at 16 million clock cycles per second, synchronized with the browser's
 * requestAnimationFrame loop.
 *
 * Hardware peripherals wired:
 *   PORTB (PB0-PB5 = D8-D13), PORTC (PC0-PC5 = A0-A5), PORTD (PD0-PD7 = D0-D7)
 *   Timer0 (millis/delay/PWM 5,6), Timer1 (Servo PWM 9,10), Timer2 (PWM 3,11)
 *   USART0 (Serial RX/TX), ADC (A0-A5 10-bit analog)
 */

import {
  CPU,
  avrInstruction,
  AVRIOPort,
  AVRTimer,
  AVRUSART,
  AVRADC,
  portBConfig,
  portCConfig,
  portDConfig,
  timer0Config,
  timer1Config,
  timer2Config,
  usart0Config,
  adcConfig,
  PinState,
} from 'avr8js';
import { parse as parseIntelHex } from 'intel-hex';

// ─── Types ────────────────────────────────────────────────────────────
export type PinChangeCallback = (port: string, pin: number, high: boolean) => void;
export type UsartTxCallback = (byte: number) => void;

export interface AVRRunnerConfig {
  /** Cycles to execute per rAF tick. 16_000_000 / 60 ≈ 266_666 for real-time */
  cyclesPerFrame: number;
  /** Speed multiplier applied to cyclesPerFrame */
  speed: number;
}

export interface ADCChannelValues {
  /** A0 through A5, each 0..1023 */
  [channel: number]: number;
}

// ─── Runner Class ─────────────────────────────────────────────────────
export class AVRRunner {
  public cpu: CPU;
  public portB: AVRIOPort;
  public portC: AVRIOPort;
  public portD: AVRIOPort;
  public timer0: AVRTimer;
  public timer1: AVRTimer;
  public timer2: AVRTimer;
  public usart: AVRUSART;
  public adc: AVRADC;

  private rafId: number | null = null;
  private running = false;
  private paused = false;
  private hasFirmware = false;
  private speed = 1.0;
  private cyclesPerFrame: number;

  // External callbacks
  private pinChangeCallbacks: PinChangeCallback[] = [];
  private usartTxCallbacks: UsartTxCallback[] = [];

  // ADC injection (interactive sensor sliders feed values here)
  private adcChannelValues: ADCChannelValues = {};

  // Flash program memory (32 KB for ATmega328P)
  private readonly FLASH_SIZE = 0x8000; // 32768 bytes
  private readonly RAM_SIZE = 0x900;    // 2304 bytes (2KB SRAM + registers + IO)

  constructor(config: Partial<AVRRunnerConfig> = {}) {
    this.cyclesPerFrame = config.cyclesPerFrame ?? Math.floor(16_000_000 / 60);
    this.speed = config.speed ?? 1.0;

    // Allocate program memory and initialize CPU
    const progMem = new Uint16Array(this.FLASH_SIZE / 2);
    this.cpu = new CPU(progMem, this.RAM_SIZE);

    // Wire IO ports
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);

    // Wire hardware timers for PWM and millis()
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);

    // Wire USART for Serial communication
    this.usart = new AVRUSART(this.cpu, usart0Config, 16_000_000);

    // Wire ADC for analogRead()
    this.adc = new AVRADC(this.cpu, adcConfig);

    this.setupPeripheralHooks();
  }

  /**
   * Load an Intel HEX string into the CPU's program memory
   */
  public loadHex(hexString: string): void {
    const { data } = parseIntelHex(hexString);
    const progData = new Uint8Array(this.cpu.progMem.buffer);
    for (let i = 0; i < data.length && i < progData.length; i++) {
      progData[i] = data[i];
    }
    this.hasFirmware = true;
    this.cpu.reset();
  }

  /**
   * Load raw program bytes directly (for pre-compiled firmware bundles)
   */
  public loadBytes(firmware: Uint8Array): void {
    const progData = new Uint8Array(this.cpu.progMem.buffer);
    for (let i = 0; i < firmware.length && i < progData.length; i++) {
      progData[i] = firmware[i];
    }
    this.hasFirmware = true;
    this.cpu.reset();
  }

  // ─── External Event Hooks ─────────────────────────────────────────
  public onPinChange(cb: PinChangeCallback): () => void {
    this.pinChangeCallbacks.push(cb);
    return () => {
      this.pinChangeCallbacks = this.pinChangeCallbacks.filter((c) => c !== cb);
    };
  }

  public onUsartTx(cb: UsartTxCallback): () => void {
    this.usartTxCallbacks.push(cb);
    return () => {
      this.usartTxCallbacks = this.usartTxCallbacks.filter((c) => c !== cb);
    };
  }

  /**
   * Feed a byte into USART RX (simulates Serial.read() data)
   */
  public feedUsartRx(byte: number): void {
    this.usart.writeByte(byte);
  }

  /**
   * Set an analog channel value that analogRead() will return.
   * channel: 0..5 (A0..A5), value: 0..1023
   */
  public setADCValue(channel: number, value: number): void {
    const clamped = Math.max(0, Math.min(1023, Math.round(value)));
    this.adcChannelValues[channel] = clamped;
    if (this.adc.channelValues && channel < this.adc.channelValues.length) {
      this.adc.channelValues[channel] = (clamped / 1023.0) * 5.0;
    }
  }

  /**
   * Set the state of a digital input pin.
   * arduinoPin: 0..13 (D0-D13) or 14..19 (A0-A5 as digital)
   */
  public setInputPin(arduinoPin: number, high: boolean): void {
    const { port, bit } = this.mapArduinoPin(arduinoPin);
    if (port === 'B') this.portB.setPin(bit, high);
    else if (port === 'C') this.portC.setPin(bit, high);
    else if (port === 'D') this.portD.setPin(bit, high);
  }

  // ─── Simulation Control ───────────────────────────────────────────
  public start(): void {
    if (this.running && !this.paused) return;
    this.running = true;
    this.paused = false;
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.executeFrame);
    }
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    if (!this.running) {
      this.start();
      return;
    }
    this.paused = false;
  }

  public stop(): void {
    this.running = false;
    this.paused = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public reset(): void {
    this.stop();
    this.hasFirmware = false;
    this.cpu.reset();
    this.adcChannelValues = {};
  }

  public setSpeed(speed: number): void {
    this.speed = Math.max(0.1, Math.min(5.0, speed));
  }

  public getSpeed(): number {
    return this.speed;
  }

  public isRunning(): boolean {
    return this.running;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  /**
   * Execute a single CPU instruction (for single-stepping in debug mode)
   */
  public stepOne(): void {
    this.cpu.tick();
  }

  /**
   * Get the current program counter address
   */
  public getPC(): number {
    return this.cpu.pc;
  }

  /**
   * Get the current cycle count (for timing analysis)
   */
  public getCycles(): number {
    return this.cpu.cycles;
  }

  // ─── Internal Execution Loop ──────────────────────────────────────
  private executeFrame = (): void => {
    if (!this.running) {
      this.rafId = null;
      return;
    }

    if (!this.paused && this.hasFirmware) {
      const targetCycles = Math.floor(this.cyclesPerFrame * this.speed);
      const startCycles = this.cpu.cycles;

      // Execute CPU cycles for this frame
      while (this.cpu.cycles - startCycles < targetCycles) {
        avrInstruction(this.cpu);
        this.cpu.tick();
      }
    }

    this.rafId = requestAnimationFrame(this.executeFrame);
  };

  // ─── Peripheral Wiring ────────────────────────────────────────────
  private setupPeripheralHooks(): void {
    // PORTB pin changes (D8-D13) → hardware callbacks
    this.portB.addListener(() => {
      for (let bit = 0; bit < 6; bit++) {
        const high = !!(this.portB.pinState(bit) === PinState.High);
        this.emitPinChange('B', bit, high);
      }
    });

    // PORTC pin changes (A0-A5 as digital) → hardware callbacks
    this.portC.addListener(() => {
      for (let bit = 0; bit < 6; bit++) {
        const high = !!(this.portC.pinState(bit) === PinState.High);
        this.emitPinChange('C', bit, high);
      }
    });

    // PORTD pin changes (D0-D7) → hardware callbacks
    this.portD.addListener(() => {
      for (let bit = 0; bit < 8; bit++) {
        const high = !!(this.portD.pinState(bit) === PinState.High);
        this.emitPinChange('D', bit, high);
      }
    });

    // USART TX → Serial Monitor
    this.usart.onByteTransmit = (byte: number) => {
      for (const cb of this.usartTxCallbacks) {
        cb(byte);
      }
    };
  }

  private emitPinChange(port: string, bit: number, high: boolean): void {
    for (const cb of this.pinChangeCallbacks) {
      cb(port, bit, high);
    }
  }

  /**
   * Map Arduino pin numbers to AVR port/bit pairs
   */
  private mapArduinoPin(pin: number): { port: string; bit: number } {
    if (pin >= 0 && pin <= 7) return { port: 'D', bit: pin };        // D0-D7 → PORTD
    if (pin >= 8 && pin <= 13) return { port: 'B', bit: pin - 8 };   // D8-D13 → PORTB
    if (pin >= 14 && pin <= 19) return { port: 'C', bit: pin - 14 }; // A0-A5 → PORTC
    return { port: 'D', bit: 0 };
  }

  /**
   * Read the current output value of an Arduino pin (for oscilloscope sampling)
   */
  public readOutputPin(arduinoPin: number): boolean {
    const { port, bit } = this.mapArduinoPin(arduinoPin);
    if (port === 'B') return this.portB.pinState(bit) === PinState.High;
    if (port === 'C') return this.portC.pinState(bit) === PinState.High;
    if (port === 'D') return this.portD.pinState(bit) === PinState.High;
    return false;
  }

  /**
   * Read the current Timer1 OCR1A value (for servo pulse width measurement)
   */
  public getTimer1OCRA(): number {
    // Timer1 OCR1A register at 0x88-0x89
    const lo = this.cpu.data[0x88];
    const hi = this.cpu.data[0x89];
    return (hi << 8) | lo;
  }

  /**
   * Read Timer0 counter for PWM duty cycle analysis
   */
  public getTimer0Counter(): number {
    return this.cpu.data[0x46]; // TCNT0
  }
}

// ─── Singleton Factory ─────────────────────────────────────────────
let globalRunner: AVRRunner | null = null;

export function getAVRRunner(config?: Partial<AVRRunnerConfig>): AVRRunner {
  if (!globalRunner) {
    globalRunner = new AVRRunner(config);
  }
  return globalRunner;
}

export function resetAVRRunner(): void {
  if (globalRunner) {
    globalRunner.stop();
    globalRunner = null;
  }
}
