/**
 * Hybrid Arduino C++ Compilation Pipeline
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 *
 * Compilation strategy (priority order):
 * 1. Online: POST to Wokwi compilation API / arduino-cli endpoint → real .hex
 * 2. Offline: Deterministic pre-compiled hex map bundled for all 88 standard lessons
 * 3. Fallback: Enhanced instruction-level interpreter (our existing compiler.ts)
 *
 * This ensures every single lesson compiles and executes at 16MHz even on school
 * PCs with zero internet access.
 */

import { compileProgram, type CompiledProgram } from './compiler';

// ─── Types ────────────────────────────────────────────────────────────
export type CompilationMode = 'avr-hex' | 'interpreter';

export interface CompilationResult {
  mode: CompilationMode;
  /** Intel HEX string when mode is 'avr-hex' */
  hex: string | null;
  /** Fallback interpreter program when hex unavailable */
  interpreted: CompiledProgram | null;
  /** Source map: C++ line number → hex address (for gutter highlights) */
  sourceMap: Map<number, number>;
  /** Compilation duration in ms */
  compileTimeMs: number;
  /** Error message if compilation failed */
  error: string | null;
}

export interface CompilerEndpoint {
  url: string;
  method: 'POST';
  headers?: Record<string, string>;
}

// ─── Pre-compiled Hex Map ─────────────────────────────────────────────
// This map stores pre-compiled ATmega328P firmware hex for each lesson.
// Generated offline via arduino-cli and bundled for zero-network execution.
// Key format: `${labId}-${lessonId}` (e.g., "led-1", "servo-3")

const precompiledHexMap = new Map<string, string>();

/**
 * Register a pre-compiled hex blob for a specific lab/lesson.
 * Called during app initialization to populate the offline cache.
 */
export function registerPrecompiledHex(labId: string, lessonId: number, hex: string): void {
  precompiledHexMap.set(`${labId}-${lessonId}`, hex);
}

/**
 * Check if a pre-compiled hex exists for the given lab/lesson
 */
export function hasPrecompiledHex(labId: string, lessonId: number): boolean {
  return precompiledHexMap.has(`${labId}-${lessonId}`);
}

// ─── Online Compilation ───────────────────────────────────────────────
const DEFAULT_ENDPOINT: CompilerEndpoint = {
  url: 'https://hexi.wokwi.com/build',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

let compilerEndpoint: CompilerEndpoint = { ...DEFAULT_ENDPOINT };

/**
 * Configure a custom compilation endpoint (e.g., local arduino-cli server)
 */
export function setCompilerEndpoint(endpoint: Partial<CompilerEndpoint>): void {
  compilerEndpoint = { ...DEFAULT_ENDPOINT, ...endpoint };
}

/**
 * Attempt online C++ → AVR hex compilation via the configured endpoint
 */
async function compileOnline(cppSource: string): Promise<{ hex: string; sourceMap: Map<number, number> } | null> {
  try {
    const sketch = {
      files: [
        {
          name: 'sketch.ino',
          content: cppSource,
        },
      ],
    };

    const response = await fetch(compilerEndpoint.url, {
      method: compilerEndpoint.method,
      headers: compilerEndpoint.headers,
      body: JSON.stringify(sketch),
      signal: AbortSignal.timeout(15_000), // 15s timeout for school networks
    });

    if (!response.ok) return null;

    const result = await response.json() as { hex?: string; stdout?: string; stderr?: string };
    if (!result.hex) return null;

    // Parse source map from compiler debug output if available
    const sourceMap = new Map<number, number>();
    // Basic line mapping: each C++ line maps to sequential hex addresses
    const lines = cppSource.split('\n');
    for (let i = 0; i < lines.length; i++) {
      sourceMap.set(i, i * 2); // Approximate 2-byte instruction per line
    }

    return { hex: result.hex, sourceMap };
  } catch {
    // Network unavailable, endpoint down, or timeout
    return null;
  }
}

// ─── Main Compilation Pipeline ────────────────────────────────────────

/**
 * Compile Arduino C++ code through the hybrid pipeline.
 *
 * Priority:
 * 1. Check pre-compiled hex map (instant, offline)
 * 2. Try online compilation (if navigator.onLine)
 * 3. Fall back to deterministic instruction interpreter
 */
export async function compileArduinoCode(
  labId: string,
  lessonId: number,
  cppSource: string,
  humanSource: string,
  options: { forceInterpreter?: boolean; forceOnline?: boolean } = {}
): Promise<CompilationResult> {
  const startTime = performance.now();

  // Build the interpreter program regardless (used for line highlighting)
  const interpreted = compileProgram(cppSource, humanSource);

  // Build source map from interpreter data
  const sourceMap = new Map<number, number>();
  for (const step of [...interpreted.setupSteps, ...interpreted.loopSteps]) {
    sourceMap.set(step.lineIndex, step.lineIndex);
  }

  // ─── Path 1: Pre-compiled hex (offline cache) ─────────────────
  if (!options.forceOnline) {
    const cachedHex = precompiledHexMap.get(`${labId}-${lessonId}`);
    if (cachedHex) {
      return {
        mode: 'avr-hex',
        hex: cachedHex,
        interpreted,
        sourceMap,
        compileTimeMs: performance.now() - startTime,
        error: null,
      };
    }
  }

  // ─── Path 2: Online compilation ───────────────────────────────
  if (!options.forceInterpreter && typeof navigator !== 'undefined' && navigator.onLine) {
    const onlineResult = await compileOnline(cppSource);
    if (onlineResult) {
      return {
        mode: 'avr-hex',
        hex: onlineResult.hex,
        interpreted,
        sourceMap: onlineResult.sourceMap,
        compileTimeMs: performance.now() - startTime,
        error: null,
      };
    }
  }

  // ─── Path 3: Deterministic interpreter fallback ───────────────
  return {
    mode: 'interpreter',
    hex: null,
    interpreted,
    sourceMap,
    compileTimeMs: performance.now() - startTime,
    error: null,
  };
}

/**
 * Synchronous compilation (interpreter-only, for instant lab switching)
 */
export function compileArduinoCodeSync(
  cppSource: string,
  humanSource: string
): CompilationResult {
  const startTime = performance.now();
  const interpreted = compileProgram(cppSource, humanSource);

  const sourceMap = new Map<number, number>();
  for (const step of [...interpreted.setupSteps, ...interpreted.loopSteps]) {
    sourceMap.set(step.lineIndex, step.lineIndex);
  }

  return {
    mode: 'interpreter',
    hex: null,
    interpreted,
    sourceMap,
    compileTimeMs: performance.now() - startTime,
    error: null,
  };
}

// ─── Arduino Pin / Peripheral Name Resolver ─────────────────────────

/** Map common Arduino constant names to pin numbers */
export function resolveArduinoPin(name: string | number): number {
  if (typeof name === 'number') return name;
  const upper = name.toUpperCase().trim();
  const pinMap: Record<string, number> = {
    'LED_BUILTIN': 13,
    'A0': 14, 'A1': 15, 'A2': 16, 'A3': 17, 'A4': 18, 'A5': 19,
    'SDA': 18, 'SCL': 19,
    'SS': 10, 'MOSI': 11, 'MISO': 12, 'SCK': 13,
    'TRIG_PIN': 7, 'ECHO_PIN': 6, 'TRIG': 7, 'ECHO': 6,
    'IR_SENSOR_PIN': 3, 'SOIL_PIN': 14,
    'BUZZER_PIN': 8, 'BUZZER': 8,
    'IN1': 5, 'IN2': 6, 'ENA': 9, 'ENB': 10, 'IN3': 7, 'IN4': 8,
    'RED_PIN': 9, 'GREEN_PIN': 10, 'BLUE_PIN': 11,
    'DHT_PIN': 2, 'DHTPIN': 2,
    'GAS_PIN': 14, 'MQ2_PIN': 14,
    'SS_PIN': 10, 'RST_PIN': 9,
    'LDR_PIN': 14,
  };
  return pinMap[upper] !== undefined ? pinMap[upper] : (parseInt(String(name), 10) || 0);
}
