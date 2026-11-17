/**
 * Type declarations for intel-hex module
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

declare module 'intel-hex' {
  export interface IntelHexData {
    data: Uint8Array;
    startOffset: number;
    endOffset: number;
  }

  export function parse(hex: string | Buffer): IntelHexData;
}
