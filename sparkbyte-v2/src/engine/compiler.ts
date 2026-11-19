/**
 * Arduino C++, OpenSCAD, and G-Code Instruction Compiler & Runtime Interpreter
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 *
 * Features:
 * - Runtime variable memory (vars: Record<string, number | string | boolean | number[]>)
 * - Expression evaluator with live hardware inputs (digitalRead, analogRead, map, constrain, pulseIn)
 * - True if / else if / else conditional branching (jumps past non-matching branches)
 * - User-defined function calling (motorForward, motorReverse, setRGB)
 * - Specialized parsers for Lab 6 (OpenSCAD CAD), Lab 13 (G-Code 3D Slicer), Lab 16 (LCD), Lab 17 (OLED)
 */

import { HardwareState, InstructionNode, InstructionType } from '../types/curriculum';

export function sanitizeCpp(code: string): string {
  if (!code) return '';
  return code
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<;/g, '<=')
    .replace(/<([^a-zA-Z0-9_\s])/g, '<=')
    .replace(/\r\n/g, '\n');
}

export function expandDefines(code: string): string {
  if (!code) return '';
  const defines: Record<string, string> = {};
  const lines = code.split('\n');
  const processedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const defMatch = trimmed.match(/^#define\s+([a-zA-Z_]\w*)\s+(.+)$/);
    if (defMatch) {
      const name = defMatch[1];
      const val = defMatch[2].replace(/\/\/.*$/, '').trim();
      defines[name] = val;
      processedLines.push(`// #define ${name} ${val}`);
    } else {
      processedLines.push(line);
    }
  }

  let result = processedLines.join('\n');
  for (const [name, val] of Object.entries(defines)) {
    result = result.replace(new RegExp(`\\b${name}\\b`, 'g'), val);
  }
  return result;
}

export interface CompiledProgram {
  setupSteps: InstructionNode[];
  loopSteps: InstructionNode[];
  cppLines: string[];
  humanLines: string[];
}

export type VariableValue = number | string | boolean | number[];

export interface UserFunctionDef {
  name: string;
  params: string[];
  body: string[];
}

/**
 * Evaluates an expression against current variable state and live hardware inputs
 */
export function evaluateExpression(
  expr: string,
  vars: Record<string, VariableValue>,
  hw: HardwareState
): VariableValue {
  if (!expr || typeof expr !== 'string') return 0;
  const trimmed = expr.trim().replace(/;\s*$/, '');
  if (!trimmed) return 0;

  // Direct boolean literals
  if (trimmed === 'true' || trimmed === 'HIGH') return 1;
  if (trimmed === 'false' || trimmed === 'LOW') return 0;

  // Direct numeric literal
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }

  // Quoted string literal
  const quoteMatch = trimmed.match(/^"([^"]*)"$/);
  if (quoteMatch) {
    return quoteMatch[1];
  }

  // Built-in Arduino helper functions provided to eval context
  const digitalRead = (p: number | string): number => {
    const pinNum = typeof p === 'number' ? p : parseInt(String(p), 10);
    if (hw.activeLab === 'button' && (pinNum === 2 || String(p).includes('button'))) {
      return hw.buttonPressed ? 0 : 1; // INPUT_PULLUP: LOW when pressed
    }
    if (hw.activeLab === 'ir' && (pinNum === 2 || pinNum === 7)) {
      return hw.irReflectRaw > 500 ? 1 : 0; // TCRT5000: HIGH on black line
    }
    return hw.pinStates && hw.pinStates[pinNum] ? 1 : 0;
  };

  const analogRead = (p: number | string): number => {
    if (hw.activeLab === 'ldr') return hw.ldrRaw;
    if (hw.activeLab === 'pot') return hw.potVal;
    if (hw.activeLab === 'temp') return Math.max(0, Math.min(1023, Math.round(((hw.temperatureC * 0.01 + 0.5) / 5.0) * 1023)));
    if (hw.activeLab === 'gas') return Math.max(0, Math.min(1023, Math.round((hw.gasPpm / 800) * 1023)));
    if (hw.activeLab === 'soil') return Math.max(0, Math.min(1023, Math.round(580 - ((hw.soilMoisturePct !== undefined ? hw.soilMoisturePct : 50) / 100.0) * (580 - 260))));
    if (hw.activeLab === 'ir') return hw.irReflectRaw;
    if (hw.activeLab === 'dmm') return Math.max(0, Math.min(1023, Math.round((hw.voltage / 5.0) * 1023)));

    const pStr = String(p).toUpperCase();
    if (pStr === 'A0' || pStr === '0' || pStr === '14') return hw.potVal;
    if (pStr === 'A1' || pStr === '1' || pStr === '15') return hw.ldrRaw;
    return 512;
  };

  const map = (v: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    if (inMax === inMin) return outMin;
    return Math.round((v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
  };

  const constrain = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
  const pulseIn = (): number => Math.round(hw.distanceCm * 58.2);
  const isnan = (v: unknown): boolean => typeof v === 'number' && isNaN(v);
  const pow = Math.pow;

  const dht = {
    readTemperature: () => hw.temperatureC,
    readHumidity: () => hw.humidityPct
  };

  const scannedBytes = hw.rfidScannedUid
    ? hw.rfidScannedUid.split(/[\s:-]+/).map(h => parseInt(h, 16) || 0)
    : [0xA3, 0x7F, 0x4E, 0x12];

  const rfid = {
    PICC_IsNewCardPresent: () => hw.rfidScannedUid !== null,
    PICC_ReadCardSerial: () => hw.rfidScannedUid !== null,
    PCD_Init: () => {},
    PICC_HaltA: () => {},
    uid: {
      size: scannedBytes.length,
      uidByte: scannedBytes
    }
  };

  // Mock Wire library with realistic 6-DoF MPU6050 accelerometer & gyro data
  let wireByteIdx = 0;
  const Wire = {
    begin: () => {},
    beginTransmission: () => {},
    write: () => {},
    endTransmission: () => 0,
    requestFrom: () => 6,
    read: () => {
      const pRad = ((hw.imuPitch || 0) * Math.PI) / 180.0;
      const rRad = ((hw.imuRoll || 0) * Math.PI) / 180.0;
      const ax = Math.round(Math.sin(pRad) * 16384);
      const ay = Math.round(-Math.sin(rRad) * 16384);
      const az = Math.round(Math.cos(pRad) * Math.cos(rRad) * 16384);
      const buf = [
        (ax >> 8) & 0xff, ax & 0xff,
        (ay >> 8) & 0xff, ay & 0xff,
        (az >> 8) & 0xff, az & 0xff
      ];
      const val = buf[wireByteIdx % buf.length];
      wireByteIdx++;
      return val;
    }
  };

  if (hw.activeLab === 'imu') {
    if (hw.imuPitch !== undefined) {
      vars.fusedPitch = hw.imuPitch;
      vars.pitch = hw.imuPitch;
      vars.accelPitch = hw.imuPitch;
    }
    if (hw.imuRoll !== undefined) {
      vars.fusedRoll = hw.imuRoll;
      vars.roll = hw.imuRoll;
      vars.accelRoll = hw.imuRoll;
    }
  }

  const fusedPitch = hw.imuPitch !== undefined ? hw.imuPitch : 0;
  const fusedRoll = hw.imuRoll !== undefined ? hw.imuRoll : 0;
  const accelPitch = hw.imuPitch !== undefined ? hw.imuPitch : 0;
  const accelRoll = hw.imuRoll !== undefined ? hw.imuRoll : 0;
  const atan2 = Math.atan2;
  const sqrt = Math.sqrt;
  const PI = Math.PI;
  const millis = () => Date.now();

  // Virtual EEPROM Emulation (1024 bytes ATmega328P with localStorage persistence)
  const getEeprom = (): number[] => {
    try {
      const stored = localStorage.getItem('sparkbyte_eeprom_storage');
      if (stored) return JSON.parse(stored);
    } catch {}
    return new Array(1024).fill(255);
  };
  const saveEeprom = (mem: number[]) => {
    try {
      localStorage.setItem('sparkbyte_eeprom_storage', JSON.stringify(mem));
    } catch {}
  };
  const EEPROM = {
    read: (addr: number): number => {
      const mem = getEeprom();
      const a = Math.max(0, Math.min(1023, Math.round(Number(addr) || 0)));
      return mem[a] !== undefined ? mem[a] : 255;
    },
    write: (addr: number, val: number): void => {
      const mem = getEeprom();
      const a = Math.max(0, Math.min(1023, Math.round(Number(addr) || 0)));
      const v = Math.max(0, Math.min(255, Math.round(Number(val) || 0)));
      mem[a] = v;
      saveEeprom(mem);
    },
    update: (addr: number, val: number): void => {
      EEPROM.write(addr, val);
    },
    length: () => 1024
  };

  const digitalPinToInterrupt = (p: number) => (p === 2 ? 0 : p === 3 ? 1 : -1);
  const attachInterrupt = () => {};
  const detachInterrupt = () => {};

  // Arduino pin constants
  const A0 = 14, A1 = 15, A2 = 16, A3 = 17, A4 = 18, A5 = 19;
  const HIGH = 1, LOW = 0;
  const SSD1306_WHITE = 1, SSD1306_BLACK = 0;

  // Clean C++ casts and types
  let clean = trimmed;
  clean = clean.replace(/\((?:int|float|double|bool|byte|char|uint8_t|int16_t|long)\)/gi, '');
  clean = clean.replace(/\b(static|volatile|unsigned|signed|int|float|double|bool|byte|char|var|const|unsigned\s+long|int16_t|uint8_t|uint16_t|uint32_t|struct)\b\s*/gi, '');
  clean = clean.replace(/F\(([^)]+)\)/g, '$1');

  try {
    const fn = new Function(
      'vars', 'hw', 'digitalRead', 'analogRead', 'map', 'constrain', 'pulseIn', 'isnan', 'pow', 'dht', 'rfid', 'Wire', 'EEPROM', 'digitalPinToInterrupt', 'attachInterrupt', 'detachInterrupt',
      'fusedPitch', 'fusedRoll', 'accelPitch', 'accelRoll', 'atan2', 'sqrt', 'PI', 'millis',
      'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'HIGH', 'LOW', 'SSD1306_WHITE', 'SSD1306_BLACK',
      `with(vars) { return (${clean}); }`
    );
    const result = fn(
      vars, hw, digitalRead, analogRead, map, constrain, pulseIn, isnan, pow, dht, rfid, Wire, EEPROM, digitalPinToInterrupt, attachInterrupt, detachInterrupt,
      fusedPitch, fusedRoll, accelPitch, accelRoll, atan2, sqrt, PI, millis,
      A0, A1, A2, A3, A4, A5, HIGH, LOW, SSD1306_WHITE, SSD1306_BLACK
    );
    if (typeof result === 'boolean') return result ? 1 : 0;
    if (typeof result === 'number') {
      if (!isFinite(result) || isNaN(result)) return 0;
    }
    return result;
  } catch {
    // If expression references variable in vars directly
    if (trimmed in vars) {
      const val = vars[trimmed];
      if (typeof val === 'number' && (!isFinite(val) || isNaN(val))) return 0;
      return val;
    }
    return 0;
  }
}

/**
 * Splits semicolon-separated C++ statements while respecting string literals, braces, and parentheses
 */
export function splitStatements(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return [line];

  const stmts: string[] = [];
  let start = 0;
  let inString = false;
  let strChar = '';
  let parenDepth = 0;
  let braceDepth = 0;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inString) {
      if (ch === strChar && line[i - 1] !== '\\') {
        inString = false;
      }
    } else {
      if (ch === '"' || ch === "'") {
        inString = true;
        strChar = ch;
      } else if (ch === '(') {
        parenDepth++;
      } else if (ch === ')') {
        if (parenDepth > 0) parenDepth--;
      } else if (ch === '{') {
        braceDepth++;
      } else if (ch === '}') {
        if (braceDepth > 0) braceDepth--;
      } else if (ch === ';' && parenDepth === 0 && braceDepth === 0) {
        const part = line.slice(start, i + 1).trim();
        if (part) stmts.push(part);
        start = i + 1;
      }
    }
  }
  const tail = line.slice(start).trim();
  if (tail) stmts.push(tail);
  return stmts.length > 0 ? stmts : [line];
}

/**
 * Extracts comma-separated arguments from a function call with balanced parentheses
 * Handles nested calls like analogWrite(6, constrain(fanPWM, 0, 255))
 */
export function extractCallArgs(line: string, funcName: string): string[] | null {
  const trimmed = line.trim();
  const escapedName = funcName.replace(/\./g, '\\.');
  const regex = new RegExp(`^${escapedName}\\s*\\(`, 'i');
  const match = trimmed.match(regex);
  if (!match) return null;

  const startIndex = match[0].length;
  let depth = 1;
  let argStart = startIndex;
  const args: string[] = [];
  let inString = false;
  let strChar = '';

  for (let i = startIndex; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (ch === strChar && trimmed[i - 1] !== '\\') {
        inString = false;
      }
    } else {
      if (ch === '"' || ch === "'") {
        inString = true;
        strChar = ch;
      } else if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
        if (depth === 0) {
          args.push(trimmed.slice(argStart, i).trim());
          return args;
        }
      } else if (ch === ',' && depth === 1) {
        args.push(trimmed.slice(argStart, i).trim());
        argStart = i + 1;
      }
    }
  }
  return null;
}

export function transformSwitchCases(code: string): string {
  if (!code || !code.includes('switch')) return code;
  const lines = code.split('\n');
  const result: string[] = [];
  const switchStack: { expr: string; firstCase: boolean }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const switchMatch = trimmed.match(/^switch\s*\((.+)\)\s*\{?$/);
    if (switchMatch) {
      switchStack.push({ expr: switchMatch[1].trim(), firstCase: true });
      result.push(`// ${trimmed}`);
      continue;
    }

    if (switchStack.length > 0) {
      const curSwitch = switchStack[switchStack.length - 1];

      const caseMatch = trimmed.match(/^case\s+([^:]+)\s*:\s*(.*)$/);
      if (caseMatch) {
        const val = caseMatch[1].trim();
        const remainder = caseMatch[2] ? caseMatch[2].trim() : '';
        if (curSwitch.firstCase) {
          result.push(`if ((${curSwitch.expr}) == (${val})) { ${remainder}`);
          curSwitch.firstCase = false;
        } else {
          result.push(`} else if ((${curSwitch.expr}) == (${val})) { ${remainder}`);
        }
        continue;
      }

      const defaultMatch = trimmed.match(/^default\s*:\s*(.*)$/);
      if (defaultMatch) {
        const remainder = defaultMatch[1] ? defaultMatch[1].trim() : '';
        result.push(`} else { ${remainder}`);
        continue;
      }

      if (trimmed === 'break;' || trimmed === 'break') {
        continue;
      }

      if (trimmed === '}') {
        if (!curSwitch.firstCase) {
          result.push('}');
        }
        switchStack.pop();
        continue;
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

export function compileProgram(rawCpp: string, rawHuman: string): CompiledProgram {
  const transformedCpp = transformSwitchCases(expandDefines(sanitizeCpp(rawCpp)));
  const rawLines = transformedCpp.split('\n');
  const humanLines = (rawHuman || '').split('\n');

  // Expand multi-statement lines
  const cppLines: string[] = [];
  const mappedHuman: string[] = [];
  for (let idx = 0; idx < rawLines.length; idx++) {
    const rLine = rawLines[idx];
    const subStmts = splitStatements(rLine);
    for (const s of subStmts) {
      cppLines.push(s);
      mappedHuman.push(humanLines[idx] || s.trim());
    }
  }

  const globalSteps: InstructionNode[] = [];
  const setupSteps: InstructionNode[] = [];
  const loopSteps: InstructionNode[] = [];

  let currentPhase: 'setup' | 'loop' | 'global' = 'global';
  let braceDepth = 0;

  // Parse user-defined helper functions (e.g. motorForward, motorReverse, setRGB)
  const functions: Record<string, UserFunctionDef> = {};
  let currentFunc: UserFunctionDef | null = null;

  for (let idx = 0; idx < cppLines.length; idx++) {
    const rawLine = cppLines[idx];
    const trimmed = rawLine.trim();

    // Check function definition start: void name(...) {
    const funcMatch = trimmed.match(/^(?:void|float|int)\s+(\w+)\s*\(([^)]*)\)\s*\{/);
    if (funcMatch && funcMatch[1] !== 'setup' && funcMatch[1] !== 'loop') {
      const fName = funcMatch[1];
      const params = funcMatch[2].split(',').map((p) => p.trim().split(/\s+/).pop() || '').filter(Boolean);
      currentFunc = { name: fName, params, body: [] };
      continue;
    }

    if (currentFunc) {
      if (trimmed === '}') {
        functions[currentFunc.name] = currentFunc;
        currentFunc = null;
      } else {
        currentFunc.body.push(trimmed);
      }
      continue;
    }

    // Track setup() and loop() structural boundaries
    if (trimmed.includes('void setup()')) {
      currentPhase = 'setup';
      setupSteps.push(createNode(idx, 'setup', 'header', rawLine, mappedHuman[idx] || trimmed));
      continue;
    }
    if (trimmed.includes('void loop()')) {
      currentPhase = 'loop';
      loopSteps.push(createNode(idx, 'loop', 'header', rawLine, mappedHuman[idx] || trimmed));
      continue;
    }

    if (trimmed.includes('{')) braceDepth++;
    if (trimmed.includes('}')) {
      braceDepth = Math.max(0, braceDepth - 1);
    }

    // Ignore blank lines and standalone comments
    if (!trimmed || trimmed.startsWith('//')) {
      continue;
    }

    const humanDesc = mappedHuman[idx] || trimmed;

    // Detect and unroll for-loops (e.g. for (pos = 0; pos <= 180; pos += 1) { ... })
    const forRegex = /^for\s*\(\s*(?:(?:int|var|float|byte)\s+)?(\w+)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\)\s*\{?$/;
    const forMatch = trimmed.match(forRegex);
    if (forMatch) {
      const varName = forMatch[1];
      const startVal = parseFloat(forMatch[2]) || 0;
      const condStr = forMatch[3].trim();
      const stepStr = forMatch[4].trim();

      // Find matching closing brace for this for loop
      const bodyLines: Array<{ lineIdx: number; raw: string; human: string }> = [];
      let forDepth = 1;
      let j = idx + 1;
      while (j < cppLines.length) {
        const jTrimmed = cppLines[j].trim();
        if (jTrimmed.includes('{')) forDepth++;
        if (jTrimmed.includes('}')) {
          forDepth--;
          if (forDepth === 0) break;
        }
        if (jTrimmed && !jTrimmed.startsWith('//')) {
          bodyLines.push({ lineIdx: j, raw: cppLines[j], human: mappedHuman[j] || jTrimmed });
        }
        j++;
      }

      // Compute iteration sequence
      let endVal = startVal;
      const numMatch = condStr.match(/(-?\d+)/);
      if (numMatch) endVal = parseFloat(numMatch[1]);
      const isAscending = endVal >= startVal;
      let rawStep = 1;
      const stepNum = stepStr.match(/(\d+)/);
      if (stepNum) rawStep = parseFloat(stepNum[1]) || 1;
      if (stepStr.includes('--') || stepStr.includes('-=')) rawStep = -Math.abs(rawStep);

      const range = Math.abs(endVal - startVal);
      let effectiveStep = rawStep;
      if (range > 20 && Math.abs(rawStep) <= 2) {
        effectiveStep = isAscending ? Math.ceil(range / 12) : -Math.ceil(range / 12);
      }

      const values: number[] = [];
      const isStrict = (condStr.includes('<') && !condStr.includes('<=')) || (condStr.includes('>') && !condStr.includes('>='));
      let cur = startVal;
      for (let it = 0; it < 50; it++) {
        if (isStrict) {
          if ((isAscending && cur >= endVal) || (!isAscending && cur <= endVal)) break;
        } else {
          if ((isAscending && cur > endVal) || (!isAscending && cur < endVal)) break;
        }
        values.push(cur);
        cur += effectiveStep;
      }

      const phase = currentPhase === 'setup' ? 'setup' : currentPhase === 'loop' ? 'loop' : 'setup';
      const targetPool = phase === 'setup' ? setupSteps : loopSteps;

      for (const val of values) {
        targetPool.push({
          id: `inst-${idx}-for-${val}`,
          lineIndex: idx,
          phase,
          type: 'assignment',
          rawCpp: `${varName} = ${val};`,
          plainEnglish: `${humanDesc} (${varName} = ${val})`,
          varName,
          expr: String(val)
        });

        for (const b of bodyLines) {
          const bodyNodes = parseLineToNodes(b.lineIdx, phase, b.raw, b.human, functions);
          for (const bn of bodyNodes) {
            targetPool.push(bn);
          }
        }
      }

      idx = j; // advance past for loop block
      continue;
    }

    // Detect while loops and infinite for loops (e.g. while (1) { ... }, for(;;) { ... })
    const whileMatch = trimmed.match(/^while\s*\(([^)]*)\)\s*\{?$/);
    const forInfMatch = trimmed.match(/^for\s*\(\s*;\s*;\s*\)\s*\{?$/);
    if (whileMatch || forInfMatch) {
      const bodyLines: Array<{ lineIdx: number; raw: string; human: string }> = [];
      let depth = 1;
      let j = idx + 1;
      while (j < cppLines.length) {
        const jTrimmed = cppLines[j].trim();
        if (jTrimmed.includes('{')) depth++;
        if (jTrimmed.includes('}')) {
          depth--;
          if (depth === 0) break;
        }
        if (jTrimmed && !jTrimmed.startsWith('//')) {
          bodyLines.push({ lineIdx: j, raw: cppLines[j], human: mappedHuman[j] || jTrimmed });
        }
        j++;
      }

      const phase = currentPhase === 'setup' ? 'setup' : currentPhase === 'loop' ? 'loop' : 'setup';
      const targetPool = phase === 'setup' ? setupSteps : loopSteps;

      if (bodyLines.length === 0) {
        // Empty spin loop: inject safe yield step so virtual clock steps without freezing
        targetPool.push({
          id: `inst-${idx}-spin`,
          lineIndex: idx,
          phase,
          type: 'delay',
          rawCpp: trimmed,
          plainEnglish: 'Runaway loop idle yield',
          durationMs: 100
        });
      } else {
        for (const b of bodyLines) {
          const bodyNodes = parseLineToNodes(b.lineIdx, phase, b.raw, b.human, functions);
          for (const bn of bodyNodes) {
            targetPool.push(bn);
          }
        }
      }

      idx = j;
      continue;
    }

    const effectivePhase = currentPhase === 'setup' ? 'setup' : currentPhase === 'loop' ? 'loop' : 'setup';
    const nodes = parseLineToNodes(idx, effectivePhase, rawLine, humanDesc, functions);

    for (const n of nodes) {
      if (currentPhase === 'setup') setupSteps.push(n);
      else if (currentPhase === 'loop') loopSteps.push(n);
      else globalSteps.push(n);
    }
  }

  // Hoist global variable & array declarations before setup steps
  if (globalSteps.length > 0) {
    setupSteps.unshift(...globalSteps.map((s, i) => ({ ...s, id: `global-setup-${i}`, phase: 'setup' as const })));
  }

  // Link if/else/endif jump indices for both phases
  linkControlFlow(setupSteps);
  linkControlFlow(loopSteps);

  return {
    setupSteps,
    loopSteps,
    cppLines,
    humanLines: mappedHuman
  };
}

/**
 * Links if, else, and endif steps with clean jump indices
 */
function linkControlFlow(steps: InstructionNode[]): void {
  const stack: { type: 'if' | 'else'; index: number }[] = [];

  for (let i = 0; i < steps.length; i++) {
    const node = steps[i];

    if (node.type === 'if') {
      stack.push({ type: 'if', index: i });
    } else if (node.type === 'else') {
      const top = stack.pop();
      if (top && top.type === 'if') {
        // If condition false, jump to this else + 1 (the first statement in else)
        steps[top.index].jumpIndex = i + 1;
      }
      stack.push({ type: 'else', index: i });
    } else if (node.type === 'endif') {
      const top = stack.pop();
      if (top) {
        if (top.type === 'if') {
          // If had no else, jump past endif
          steps[top.index].jumpIndex = i;
        } else if (top.type === 'else') {
          // The statement before else should jump over the else body to here
          steps[top.index].jumpIndex = i;
        }
      }
    }
  }
}

function parseLineToNodes(
  lineIndex: number,
  phase: 'setup' | 'loop',
  rawCpp: string,
  plainEnglish: string,
  functions: Record<string, UserFunctionDef>
): InstructionNode[] {
  const trimmed = rawCpp.trim();
  const lower = trimmed.toLowerCase();

  // 1a. Return early statement
  if (trimmed === 'return;' || trimmed === 'return') {
    return [{
      id: `inst-${lineIndex}-return`,
      lineIndex,
      phase,
      type: 'return',
      rawCpp,
      plainEnglish: 'Exit function early'
    }];
  }

  // 1b. Single-line early exit: if (...) return;
  const ifReturnMatch = trimmed.match(/^if\s*\((.+)\)\s*return\s*;?$/i);
  if (ifReturnMatch) {
    return [
      {
        id: `inst-${lineIndex}-if`,
        lineIndex,
        phase,
        type: 'if',
        rawCpp: `if (${ifReturnMatch[1]}) {`,
        plainEnglish: `If ${ifReturnMatch[1]}`,
        condition: ifReturnMatch[1]
      },
      {
        id: `inst-${lineIndex}-return`,
        lineIndex,
        phase,
        type: 'return',
        rawCpp: 'return;',
        plainEnglish: 'Exit loop iteration early'
      },
      {
        id: `inst-${lineIndex}-endif`,
        lineIndex,
        phase,
        type: 'endif',
        rawCpp: '}',
        plainEnglish: 'End check'
      }
    ];
  }

  // 1. Control flow: if (...)
  const ifMatch = trimmed.match(/^if\s*\((.*)\)\s*\{?$/);
  if (ifMatch) {
    return [{
      id: `inst-${lineIndex}-if`,
      lineIndex,
      phase,
      type: 'if',
      rawCpp,
      plainEnglish,
      condition: ifMatch[1]
    }];
  }

  // 2. Control flow: else if (...)
  const elseIfMatch = trimmed.match(/^\}\s*else\s+if\s*\((.*)\)\s*\{?$/);
  if (elseIfMatch) {
    return [
      {
        id: `inst-${lineIndex}-else`,
        lineIndex,
        phase,
        type: 'else',
        rawCpp: '} else',
        plainEnglish: 'Otherwise:'
      },
      {
        id: `inst-${lineIndex}-elseif`,
        lineIndex,
        phase,
        type: 'if',
        rawCpp,
        plainEnglish,
        condition: elseIfMatch[1]
      }
    ];
  }

  // 3. Control flow: else {
  if (trimmed.match(/^\}\s*else\s*\{?$/)) {
    return [{
      id: `inst-${lineIndex}-else`,
      lineIndex,
      phase,
      type: 'else',
      rawCpp,
      plainEnglish
    }];
  }

  // 4. Closing brace } for if/else
  if (trimmed === '}') {
    return [{
      id: `inst-${lineIndex}-endif`,
      lineIndex,
      phase,
      type: 'endif',
      rawCpp,
      plainEnglish: 'End of decision block'
    }];
  }

  // 5. OpenSCAD CAD Procedural Models (Lab 6)
  if (lower.includes('createsolidbox') || lower.includes('cube(') || lower.includes('cylinder(')) {
    const boxMatch = trimmed.match(/(?:createSolidBox|cube)\s*\(\s*(?:size\s*=\s*)?\[?([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)/i);
    const cylMatch = trimmed.match(/cylinder\s*\(\s*r\s*=\s*([0-9.]+)/i);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'cad',
      rawCpp,
      plainEnglish,
      cadDims: {
        x: boxMatch ? parseFloat(boxMatch[1]) : 40,
        y: boxMatch ? parseFloat(boxMatch[2]) : 30,
        z: boxMatch ? parseFloat(boxMatch[3]) : 20,
        holeR: cylMatch ? parseFloat(cylMatch[1]) : undefined
      }
    }];
  }

  // 6. 3D Slicer G-Code (Lab 13)
  if (trimmed.startsWith('G0') || trimmed.startsWith('G1') || trimmed.startsWith('M10')) {
    const cmdMatch = trimmed.match(/^([GM]\d+)/i);
    const xMatch = trimmed.match(/X([0-9.]+)/i);
    const yMatch = trimmed.match(/Y([0-9.]+)/i);
    const zMatch = trimmed.match(/Z([0-9.]+)/i);
    const eMatch = trimmed.match(/E([0-9.]+)/i);
    const fMatch = trimmed.match(/F([0-9.]+)/i);
    const sMatch = trimmed.match(/S([0-9.]+)/i);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'gcode',
      rawCpp,
      plainEnglish,
      gcodeData: {
        cmd: cmdMatch ? cmdMatch[1].toUpperCase() : 'G1',
        x: xMatch ? parseFloat(xMatch[1]) : undefined,
        y: yMatch ? parseFloat(yMatch[1]) : undefined,
        z: zMatch ? parseFloat(zMatch[1]) : undefined,
        e: eMatch ? parseFloat(eMatch[1]) : undefined,
        f: fMatch ? parseFloat(fMatch[1]) : undefined,
        s: sMatch ? parseFloat(sMatch[1]) : undefined
      }
    }];
  }

  // 7. SSD1306 OLED Display (Lab 17)
  if (lower.startsWith('display.')) {
    if (lower.includes('cleardisplay')) {
      return [{ id: `inst-${lineIndex}`, lineIndex, phase, type: 'display', rawCpp, plainEnglish, displayData: { cmd: 'clear' } }];
    }
    const pixelMatch = trimmed.match(/drawPixel\s*\(\s*(\d+)\s*,\s*(\d+)/i);
    if (pixelMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: { cmd: 'pixel', x: parseInt(pixelMatch[1], 10), y: parseInt(pixelMatch[2], 10) }
      }];
    }
    const lineMatch = trimmed.match(/drawLine\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (lineMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'line',
          x: parseInt(lineMatch[1], 10),
          y: parseInt(lineMatch[2], 10),
          x2: parseInt(lineMatch[3], 10),
          y2: parseInt(lineMatch[4], 10)
        }
      }];
    }
    const rectMatch = trimmed.match(/drawRect\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rectMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'rect',
          x: parseInt(rectMatch[1], 10),
          y: parseInt(rectMatch[2], 10),
          w: parseInt(rectMatch[3], 10),
          h: parseInt(rectMatch[4], 10)
        }
      }];
    }
    const roundRectMatch = trimmed.match(/drawRoundRect\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (roundRectMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'roundRect',
          x: parseInt(roundRectMatch[1], 10),
          y: parseInt(roundRectMatch[2], 10),
          w: parseInt(roundRectMatch[3], 10),
          h: parseInt(roundRectMatch[4], 10),
          r: parseInt(roundRectMatch[5], 10)
        }
      }];
    }
    const fillCircleMatch = trimmed.match(/fillCircle\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (fillCircleMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'fillCircle',
          x: parseInt(fillCircleMatch[1], 10),
          y: parseInt(fillCircleMatch[2], 10),
          r: parseInt(fillCircleMatch[3], 10)
        }
      }];
    }
    const circleMatch = trimmed.match(/drawCircle\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (circleMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'circle',
          x: parseInt(circleMatch[1], 10),
          y: parseInt(circleMatch[2], 10),
          r: parseInt(circleMatch[3], 10)
        }
      }];
    }
    const bitmapMatch = trimmed.match(/drawBitmap\s*\(\s*(\d+)\s*,\s*(\d+)/i);
    if (bitmapMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'bitmap',
          x: parseInt(bitmapMatch[1], 10),
          y: parseInt(bitmapMatch[2], 10)
        }
      }];
    }
    const printMatch = trimmed.match(/print(?:ln)?\s*\(\s*(?:F\()?["']?([^"')]+)["']?\)?\s*\)/i);
    if (printMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'display',
        rawCpp,
        plainEnglish,
        displayData: {
          cmd: 'text',
          text: printMatch[1]
        }
      }];
    }
    return [{ id: `inst-${lineIndex}`, lineIndex, phase, type: 'display', rawCpp, plainEnglish, displayData: { cmd: 'display' } }];
  }

  // 8. 16x2 LCD (Lab 16)
  if (lower.startsWith('lcd.')) {
    if (lower.includes('clear')) {
      return [{ id: `inst-${lineIndex}`, lineIndex, phase, type: 'lcd', rawCpp, plainEnglish, param: 'clear' }];
    }
    if (lower.includes('init') || lower.includes('begin') || lower.includes('backlight')) {
      return [{ id: `inst-${lineIndex}`, lineIndex, phase, type: 'lcd', rawCpp, plainEnglish, param: 'init' }];
    }
    const cursorMatch = trimmed.match(/setCursor\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (cursorMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'lcd',
        rawCpp,
        plainEnglish,
        param: `${cursorMatch[1]},${cursorMatch[2]}`
      }];
    }
    const printMatch = trimmed.match(/print\s*\(\s*(?:"([^"]*)"|([^)]+))\s*\)/i);
    if (printMatch) {
      return [{
        id: `inst-${lineIndex}`,
        lineIndex,
        phase,
        type: 'lcd',
        rawCpp,
        plainEnglish,
        expr: printMatch[1] !== undefined ? JSON.stringify(printMatch[1]) : printMatch[2]
      }];
    }
    return [{ id: `inst-${lineIndex}`, lineIndex, phase, type: 'lcd', rawCpp, plainEnglish, param: 'misc' }];
  }

  // 9. Function calls (e.g. motorForward(200), motorReverse(150), setRGB(180, 0, 255))
  const callMatch = trimmed.match(/^(\w+)\s*\(([^)]*)\)\s*;?$/);
  if (callMatch && (functions[callMatch[1]] || ['motorForward', 'motorReverse', 'setRGB'].includes(callMatch[1]))) {
    const fName = callMatch[1];
    const args = callMatch[2].split(',').map((a) => a.trim());
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'funcCall',
      rawCpp,
      plainEnglish,
      funcName: fName,
      args
    }];
  }

  // 10. pinMode(pin, mode)
  const pmArgs = extractCallArgs(trimmed, 'pinMode');
  if (pmArgs && pmArgs.length >= 2) {
    const pin = isNaN(Number(pmArgs[0])) ? pmArgs[0] : Number(pmArgs[0]);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'pinMode',
      rawCpp,
      plainEnglish,
      pin,
      param: pmArgs[1].toUpperCase()
    }];
  }

  // 11. digitalWrite(pin, value)
  const dwArgs = extractCallArgs(trimmed, 'digitalWrite');
  if (dwArgs && dwArgs.length >= 2) {
    const pin = isNaN(Number(dwArgs[0])) ? dwArgs[0] : Number(dwArgs[0]);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'digitalWrite',
      rawCpp,
      plainEnglish,
      pin,
      expr: dwArgs[1].trim()
    }];
  }

  // 12. analogWrite(pin, value)
  const awArgs = extractCallArgs(trimmed, 'analogWrite');
  if (awArgs && awArgs.length >= 2) {
    const pin = isNaN(Number(awArgs[0])) ? awArgs[0] : Number(awArgs[0]);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'analogWrite',
      rawCpp,
      plainEnglish,
      pin,
      expr: awArgs[1].trim()
    }];
  }

  // 12b. EEPROM methods
  if (lower.startsWith('eeprom.write') || lower.startsWith('eeprom.update')) {
    const epArgs = extractCallArgs(trimmed, 'EEPROM.write') || extractCallArgs(trimmed, 'EEPROM.update');
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'eeprom',
      rawCpp,
      plainEnglish: `EEPROM write address ${epArgs ? epArgs[0] : ''} with value ${epArgs ? epArgs[1] : ''}`,
      expr: epArgs ? `${epArgs[0]}, ${epArgs[1]}` : undefined
    }];
  }

  // 13. servo.write(angle)
  const swArgs = trimmed.match(/\.write\s*\(/i) ? extractCallArgs(trimmed.replace(/^\w+\./, ''), 'write') : null;
  if (swArgs && swArgs.length >= 1 && !lower.includes('serial.') && !lower.includes('wire.') && !lower.includes('lcd.') && !lower.includes('eeprom.')) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'servoWrite',
      rawCpp,
      plainEnglish,
      expr: swArgs[0].trim()
    }];
  }

  // 14. servo.attach(pin)
  const saArgs = trimmed.match(/\.attach\s*\(/i) ? extractCallArgs(trimmed.replace(/^\w+\./, ''), 'attach') : null;
  if (saArgs && saArgs.length >= 1) {
    const pin = isNaN(Number(saArgs[0])) ? saArgs[0] : Number(saArgs[0]);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'servoAttach',
      rawCpp,
      plainEnglish,
      pin
    }];
  }

  // 15. tone(pin, freq, duration)
  const toneArgs = extractCallArgs(trimmed, 'tone');
  if (toneArgs && toneArgs.length >= 2) {
    const pin = isNaN(Number(toneArgs[0])) ? toneArgs[0] : Number(toneArgs[0]);
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'tone',
      rawCpp,
      plainEnglish,
      pin,
      expr: toneArgs[1].trim(),
      param: toneArgs[2] ? toneArgs[2].trim() : undefined
    }];
  }

  // 16. noTone(pin)
  const noToneArgs = extractCallArgs(trimmed, 'noTone');
  if (noToneArgs || lower.includes('notone')) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'noTone',
      rawCpp,
      plainEnglish
    }];
  }

  // 17. delay(ms) and delayMicroseconds(us)
  if (lower.startsWith('delaymicroseconds')) {
    const usArgs = extractCallArgs(trimmed, 'delayMicroseconds');
    const usVal = usArgs && usArgs[0] ? Number(usArgs[0]) : 10;
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'delay',
      rawCpp,
      plainEnglish: `Wait ${usVal} microseconds`,
      expr: String(Math.max(1, Math.round(usVal / 1000) || 1))
    }];
  }

  const delArgs = extractCallArgs(trimmed, 'delay');
  if (delArgs && delArgs.length >= 1) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'delay',
      rawCpp,
      plainEnglish,
      expr: delArgs[0].trim()
    }];
  }

  // 18. Serial methods
  if (lower.startsWith('serial.begin')) {
    const sArgs = extractCallArgs(trimmed, 'Serial.begin');
    const baud = sArgs && sArgs[0] ? sArgs[0].trim() : '9600';
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'serialInit',
      rawCpp,
      plainEnglish: `Initialize Serial Monitor at ${baud} baud`,
      expr: baud
    }];
  }

  if (lower.includes('serial.print')) {
    const sArgs = extractCallArgs(trimmed, 'Serial.println') || extractCallArgs(trimmed, 'Serial.print');
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'serial',
      rawCpp,
      plainEnglish,
      expr: sArgs ? sArgs[0].trim() : ''
    }];
  }

  // 18b. Wire (I2C) & Peripheral bus methods
  if (lower.startsWith('wire.')) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'wire',
      rawCpp,
      plainEnglish: `I2C Bus: ${trimmed}`
    }];
  }

  if (lower.startsWith('spi.') || lower.startsWith('rfid.') || lower.startsWith('dht.begin')) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'peripheral',
      rawCpp,
      plainEnglish: `Peripheral Bus: ${trimmed}`
    }];
  }

  // 19. Sized array declaration: byte buffer[18]; byte sparkline[BUFFER_LEN];
  const sizedEmptyArr = trimmed.match(/^(?:var\s+)?(?:int|float|byte|char)\s+(\w+)\s*\[\s*([^\]]+)\s*\]\s*;?$/i);
  if (sizedEmptyArr) {
    const varName = sizedEmptyArr[1];
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'varDecl',
      rawCpp,
      plainEnglish,
      varName,
      value: JSON.stringify([])
    }];
  }

  // 19b. Array declaration: int melody[] = { 262, 294, ... }; byte MASTER_UID[4] = { 0xA3, ... };
  const arrMatch = trimmed.match(/^(?:var\s+)?(?:int|float|byte)\s+(\w+)\s*\[\s*\d*\s*\]\s*=\s*\{([^}]+)\}/i);
  if (arrMatch) {
    const varName = arrMatch[1];
    const elements = arrMatch[2].split(',').map((x) => {
      const s = x.trim();
      if (s.startsWith('0x') || s.startsWith('0X')) {
        return parseInt(s, 16);
      }
      const num = Number(s);
      return isNaN(num) ? 0 : num;
    });
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'varDecl',
      rawCpp,
      plainEnglish,
      varName,
      value: JSON.stringify(elements)
    }];
  }

  // 20. Variable declaration: int val = ...; float tempC = ...; static unsigned long lastPub = ...;
  const declMatch = trimmed.match(/^(?:(?:static|volatile|const|var)\s+)?(?:unsigned\s+)?(?:int|float|double|bool|byte|long|int16_t|uint8_t|uint16_t|uint32_t)\s+(\w+)\s*=\s*(.+);?$/i);
  if (declMatch) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'varDecl',
      rawCpp,
      plainEnglish,
      varName: declMatch[1],
      expr: declMatch[2].replace(/;$/, '').trim()
    }];
  }

  // 21. Variable assignment: val = ...; ledState = !ledState;
  const assignMatch = trimmed.match(/^(\w+)\s*(=|\+=|-=)\s*(.+);?$/);
  if (assignMatch && !lower.startsWith('return') && !lower.startsWith('void')) {
    return [{
      id: `inst-${lineIndex}`,
      lineIndex,
      phase,
      type: 'assignment',
      rawCpp,
      plainEnglish,
      varName: assignMatch[1],
      expr: assignMatch[3].replace(/;$/, '').trim(),
      param: assignMatch[2]
    }];
  }

  return [{
    id: `inst-${lineIndex}`,
    lineIndex,
    phase,
    type: 'other',
    rawCpp,
    plainEnglish
  }];
}

function createNode(
  lineIndex: number,
  phase: 'setup' | 'loop',
  type: InstructionType,
  rawCpp: string,
  plainEnglish: string
): InstructionNode {
  return {
    id: `inst-${lineIndex}`,
    lineIndex,
    phase,
    type,
    rawCpp,
    plainEnglish
  };
}
