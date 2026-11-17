/**
 * Web Serial API Bridge & Arduino .ino Exporter
 * Connects directly to real USB Arduino boards in Chrome/Edge, and provides one-click .ino sketch export.
 */

// Serial API Types for environments without full Web Serial DOM lib
export interface SerialPortLike {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

export class WebSerialBridge {
  private port: SerialPortLike | null = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private isConnected: boolean = false;
  private onDataCallback: ((line: string) => void) | null = null;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public onData(cb: (line: string) => void): void {
    this.onDataCallback = cb;
  }

  public async connect(baudRate: number = 9600): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Please use Chrome or Edge.');
    }

    try {
      // Cast navigator to any-safe serial access
      const nav = navigator as unknown as { serial: { requestPort: () => Promise<SerialPortLike> } };
      this.port = await nav.serial.requestPort();
      await this.port.open({ baudRate });
      this.isConnected = true;

      // Start read loop
      this.startReading();
      return true;
    } catch (err) {
      this.isConnected = false;
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        // Ignore abort error
      }
      this.reader = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch {
        // Ignore close error
      }
      this.port = null;
    }
  }

  private async startReading(): Promise<void> {
    if (!this.port || !this.port.readable) return;

    try {
      const textDecoder = new TextDecoderStream();
      (this.port.readable as ReadableStream<BufferSource>).pipeTo(textDecoder.writable).catch(() => {});
      this.reader = textDecoder.readable.getReader();

      let lineBuffer = '';
      while (this.isConnected && this.reader) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          lineBuffer += value;
          const lines = lineBuffer.split('\n');
          lineBuffer = lines.pop() || '';
          for (const line of lines) {
            const clean = line.trim();
            if (clean && this.onDataCallback) {
              this.onDataCallback(clean);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[WebSerial] Read loop ended:', err);
    } finally {
      this.isConnected = false;
    }
  }
}

export const webSerialBridge = new WebSerialBridge();

/**
 * Cleanly export Arduino C++ code as a downloadable .ino sketch file
 */
export function exportInoFile(labName: string, lessonNum: number, cppCode: string): void {
  const safeName = `${labName.replace(/[^a-zA-Z0-9_-]/g, '_')}_lesson${lessonNum}.ino`;
  const banner = `/*
 * =====================================================================
 * SPARKBYTE STUDIO | Physical Computing Engineering Workbench
 * Lab: ${labName} (Lesson ${lessonNum})
 * Target: Arduino Uno / Nano (ATmega328P)
 * Exported: ${new Date().toISOString()}
 * =====================================================================
 */\n\n`;

  const blob = new Blob([banner + cppCode], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
