/**
 * Sparky AI Socratic Engineering Coach Engine
 *
 * 100% Self-Contained, Zero-API-Key In-Browser Intelligence
 * - Tier 1: Deterministic Circuit & AST Diagnostic Reasoner (100% Offline, Zero Key, Instant)
 * - Tier 2: On-Device WebGPU Small LLM Mode (Qwen2.5-Coder-1.5B via WebLLM)
 * - Tier 3: Live Cloud LLM Integration (Google Gemini 2.5 Flash / OpenAI-Compatible BYOK)
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import {
  AiCoachConfig,
  AiCoachMessage,
  AiDiagnosticResult,
  AiIssue,
  LineExplanation,
  WorkbenchStateSnapshot
} from '../types/aiCoach';
import { webLlmManager } from './webLlmEngine.js';

export const DEFAULT_AI_CONFIG: AiCoachConfig = {
  provider: 'deterministic',
  apiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openaiBaseUrl: 'https://api.openai.com/v1',
  openaiModel: 'gpt-4o-mini',
  language: 'en',
  socraticMode: true,
  webLlmModel: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC'
};

const LOCAL_STORAGE_KEY = 'sparkbyte_ai_config';

export function loadAiConfig(): AiCoachConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage parse errors
  }
  return DEFAULT_AI_CONFIG;
}

export function saveAiConfig(config: AiCoachConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage write errors
  }
}

// Arduino Uno hardware PWM timer pins
export const UNO_PWM_PINS = [3, 5, 6, 9, 10, 11];

// ============================================================================
// 1. DEEP CODE + CIRCUIT DIAGNOSTIC REASONER (OFFLINE & REAL-TIME)
// ============================================================================

export function runDeterministicDiagnostics(snapshot: WorkbenchStateSnapshot): AiDiagnosticResult {
  const issues: AiIssue[] = [];
  const lines = snapshot.currentCpp.split('\n');
  const code = snapshot.currentCpp;
  const lab = snapshot.activeLabId;
  const hw = snapshot.hardwareState;
  const vars = snapshot.runtimeVars || {};

  // 1. Simulation Runtime State Check
  if (!snapshot.isRunning) {
    issues.push({
      id: 'sim-not-running',
      type: 'simulationState',
      severity: 'warning',
      title: 'Microcontroller is Stopped',
      message: 'The virtual ATmega328P clock is paused. Click the green "Start Simulation" button (▶) in the top toolbar to power on the board and run your code.',
      fixSuggestion: 'Click Start Simulation (▶) in the workbench toolbar.'
    });
  }

  // 2. Syntax & Entity Check: HTML entities
  if (/&lt;|&gt;|&amp;|<;|<\/>/.test(code)) {
    const cleanedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/<;/g, '<=');
    issues.push({
      id: 'html-entity-glitch',
      type: 'syntax',
      severity: 'error',
      title: 'Corrupted HTML Entity Detected',
      message: 'Found escaped HTML entities (like <;, &lt;, or </>) inside your sketch. This happens when copying code from certain web tutorials.',
      fixSuggestion: 'Replace "<;" with "<" and remove any stray XML entities.',
      suggestedFix: {
        label: 'Clean HTML Entities',
        newCode: cleanedCode,
        description: 'Sanitize escaped HTML entities back into valid C++ operators.'
      }
    });
  }

  // 3. Syntax Check: Unbalanced curly braces { }
  let openBraces = 0;
  let closeBraces = 0;
  lines.forEach((l) => {
    const clean = l.replace(/\/\/.*$/, '').replace(/"[^"]*"/g, '');
    openBraces += (clean.match(/\{/g) || []).length;
    closeBraces += (clean.match(/\}/g) || []).length;
  });

  if (openBraces !== closeBraces) {
    issues.push({
      id: 'unbalanced-braces',
      type: 'syntax',
      severity: 'error',
      title: 'Mismatched Curly Braces { }',
      message: `Your sketch has ${openBraces} opening brace(s) '{' but ${closeBraces} closing brace(s) '}'. In C++, every function and control block requires a matching pair of braces.`,
      fixSuggestion: openBraces > closeBraces ? 'Add a missing "}" at the end of your block.' : 'Remove the extra "}".'
    });
  }

  // 4. Syntax Check: Missing semicolons on key Arduino statements & variable declarations
  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    if (trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(':')) return;
    if (/^(void|if|else|for|while|switch)\b/.test(trimmed)) return;

    const isVarDecl = /^(int|float|bool|byte|char|long|double|unsigned|const)\b/.test(trimmed);
    const isCall = /^(pinMode|digitalWrite|analogWrite|delay|delayMicroseconds|Serial\.print|lcd\.|display\.|servo\.|myServo\.|tone|noTone|Wire\.|SPI\.)/.test(trimmed);

    if ((isCall || isVarDecl) && !trimmed.endsWith(';')) {
      const fixedLines = [...lines];
      fixedLines[idx] = `${lineText};`;
      issues.push({
        id: `missing-semi-${idx}`,
        type: 'syntax',
        severity: 'error',
        title: `Missing Semicolon [Line ${idx + 1}]`,
        message: `Line ${idx + 1}: "${trimmed}" is missing a terminating semicolon ';'. In Arduino C++, every instruction statement must end with ';'.`,
        lineIndex: idx,
        fixSuggestion: `${trimmed};`,
        suggestedFix: {
          label: `Add Semicolon to Line ${idx + 1}`,
          newCode: fixedLines.join('\n'),
          description: `Add missing semicolon ';' to line ${idx + 1}.`
        }
      });
    }
  });

  // 5. Syntax Check: Accidental assignment '=' inside if-conditions
  lines.forEach((lineText, idx) => {
    const clean = lineText.replace(/\/\/.*$/, '').trim();
    const assignInIf = clean.match(/if\s*\(\s*(\w+)\s*=\s*([^=][^)]*)\)/);
    if (assignInIf) {
      const varName = assignInIf[1];
      const val = assignInIf[2].trim();
      const fixedLines = [...lines];
      fixedLines[idx] = lineText.replace(/if\s*\(\s*(\w+)\s*=\s*/, `if ($1 == `);
      issues.push({
        id: `assign-in-if-${idx}`,
        type: 'syntax',
        severity: 'error',
        title: `Assignment in 'if' Condition [Line ${idx + 1}]`,
        message: `Line ${idx + 1} has 'if (${varName} = ${val})'. A single '=' is an ASSIGNMENT (sets ${varName} to ${val}), which always evaluates to true! Use double '==' for comparison: 'if (${varName} == ${val})'.`,
        lineIndex: idx,
        fixSuggestion: `if (${varName} == ${val})`,
        suggestedFix: {
          label: `Fix Comparison on Line ${idx + 1}`,
          newCode: fixedLines.join('\n'),
          description: `Change '=' assignment to '==' comparison on line ${idx + 1}.`
        }
      });
    }
  });

  // 6. Hardware Check: analogWrite() on non-PWM pins
  lines.forEach((lineText, idx) => {
    const clean = lineText.replace(/\/\/.*$/, '').trim();
    const awMatch = clean.match(/analogWrite\s*\(\s*(\d+|[A-Za-z]\w*)\s*,/);
    if (awMatch) {
      const rawPin = awMatch[1];
      let pinNum = parseInt(rawPin, 10);
      if (isNaN(pinNum) && vars[rawPin] !== undefined) {
        pinNum = Number(vars[rawPin]);
      }
      if (!isNaN(pinNum) && !UNO_PWM_PINS.includes(pinNum)) {
        const recommendedPwm = lab === 'led' ? 11 : lab === 'rgb' ? 9 : 6;
        const fixedLines = [...lines];
        fixedLines[idx] = lineText.replace(new RegExp(`analogWrite\\s*\\(\\s*${rawPin}\\s*,`), `analogWrite(${recommendedPwm},`);
        issues.push({
          id: `invalid-pwm-pin-${idx}`,
          type: 'pinMismatch',
          severity: 'error',
          title: `Pin ${pinNum} Does NOT Support PWM [Line ${idx + 1}]`,
          message: `Line ${idx + 1} calls 'analogWrite(${pinNum}, ...)'. On the Arduino Uno (ATmega328P), only pins with a tilde (~) support hardware PWM: Pins 3, 5, 6, 9, 10, and 11. Pin ${pinNum} is purely digital.`,
          lineIndex: idx,
          fixSuggestion: `analogWrite(${recommendedPwm}, ...)`,
          suggestedFix: {
            label: `Switch to PWM Pin ${recommendedPwm}`,
            newCode: fixedLines.join('\n'),
            description: `Change non-PWM Pin ${pinNum} to Timer PWM Pin ${recommendedPwm}.`
          }
        });
      }
    }
  });

  // 7. Hardware Check: Uninitialized output pins (digitalWrite without pinMode)
  const outputPinsDeclared = new Set<number>();
  const inputPinsDeclared = new Set<number>();
  const pinModeMatches = code.matchAll(/pinMode\s*\(\s*(\d+|[A-Za-z]\w*)\s*,\s*(OUTPUT|INPUT|INPUT_PULLUP)\s*\)/g);
  for (const m of pinModeMatches) {
    const rawPin = m[1];
    const p = parseInt(rawPin, 10);
    const pinVal = !isNaN(p) ? p : typeof vars[rawPin] === 'number' ? (vars[rawPin] as number) : NaN;
    if (!isNaN(pinVal)) {
      if (m[2] === 'OUTPUT') outputPinsDeclared.add(pinVal);
      else inputPinsDeclared.add(pinVal);
    }
  }

  lines.forEach((lineText, idx) => {
    const clean = lineText.replace(/\/\/.*$/, '').trim();
    const dwMatch = clean.match(/digitalWrite\s*\(\s*(\d+|[A-Za-z]\w*)\s*,/);
    if (dwMatch) {
      const rawPin = dwMatch[1];
      const p = parseInt(rawPin, 10);
      const pinVal = !isNaN(p) ? p : typeof vars[rawPin] === 'number' ? (vars[rawPin] as number) : NaN;
      if (!isNaN(pinVal) && pinVal !== 13 && !outputPinsDeclared.has(pinVal) && !clean.includes('setup')) {
        issues.push({
          id: `uninit-pin-${pinVal}`,
          type: 'wiring',
          severity: 'warning',
          title: `Pin ${pinVal} Driven Without pinMode() OUTPUT`,
          message: `You are writing to Pin ${pinVal} on line ${idx + 1}, but pinMode(${pinVal}, OUTPUT) was not declared inside void setup(). Without pinMode, the pin stays in high-impedance INPUT mode and cannot supply sufficient current.`,
          lineIndex: idx,
          fixSuggestion: `pinMode(${pinVal}, OUTPUT);`
        });
      }
    }
  });

  // 8. Structure Check: pinMode placed inside loop()
  let inLoop = false;
  lines.forEach((lineText, idx) => {
    if (lineText.includes('void loop()')) inLoop = true;
    if (lineText.includes('void setup()')) inLoop = false;
    if (inLoop && /pinMode\s*\(/.test(lineText)) {
      issues.push({
        id: `pinmode-in-loop-${idx}`,
        type: 'logic',
        severity: 'warning',
        title: `Inefficient pinMode() inside loop() [Line ${idx + 1}]`,
        message: 'pinMode() should be called once inside void setup(). Re-configuring GPIO direction registers on every cycle inside void loop() wastes microcontroller clock cycles.',
        lineIndex: idx
      });
    }
  });

  // 9. Serial Baud Rate Check
  const serialBeginMatch = code.match(/Serial\.begin\s*\(\s*(\d+)\s*\)/);
  if (serialBeginMatch) {
    const baud = parseInt(serialBeginMatch[1], 10);
    const standardBauds = [300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200];
    if (!standardBauds.includes(baud)) {
      issues.push({
        id: 'odd-baud-rate',
        type: 'wiring',
        severity: 'warning',
        title: `Non-Standard Serial Baud Rate (${baud})`,
        message: `${baud} baud is not a standard UART baud rate. The computer terminal monitor will experience framing errors. Standard baud rates are 9600 or 115200.`,
        fixSuggestion: 'Serial.begin(9600);'
      });
    }
  }

  // 10. Live Sensor Threshold & Actuator Mismatches
  // Lab 10: TMP36 Temperature & Fan
  if (lab === 'temp') {
    const threshMatch = code.match(/if\s*\([^<>]*(>|<)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentTemp = hw.temperatureC;

      if (op === '>' && currentTemp <= thresh) {
        issues.push({
          id: 'temp-thresh-not-met',
          type: 'threshold',
          severity: 'tip',
          title: `Cooling Fan Inactive (${currentTemp}°C <= ${thresh}°C)`,
          message: `Your C++ condition requires Temperature > ${thresh}°C to turn the fan ON, but the ambient temperature slider is currently at ${currentTemp}°C. The cooling fan will stay stationary until the heat rises above ${thresh}°C.`,
          fixSuggestion: `Drag the Temperature slider above ${thresh}°C to watch the cooling fan spin!`,
          sliderAdjustment: { temperatureC: thresh + 6 }
        });
      }
    }
  }

  // Lab 8: LDR Photoresistor & Nightlight
  if (lab === 'ldr') {
    const threshMatch = code.match(/if\s*\([^<>]*(<|>)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentLux = hw.ldrRaw;

      if (op === '<' && currentLux >= thresh) {
        issues.push({
          id: 'ldr-thresh-not-met',
          type: 'threshold',
          severity: 'tip',
          title: `Nightlight Inactive (${currentLux} Lux >= ${thresh})`,
          message: `Your code checks if light < ${thresh}, but current light level is bright at ${currentLux} Lux. Drag the Light slider down to simulate darkness!`,
          fixSuggestion: `Drag Ambient Light below ${thresh} Lux.`,
          sliderAdjustment: { ldrRaw: Math.max(0, thresh - 100) }
        });
      }
    }
  }

  // Lab 11 / HC-SR04 Sonar Ultrasonic
  if (lab === 'sonar') {
    const threshMatch = code.match(/if\s*\([^<>]*(<|>)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentDist = hw.distanceCm;

      if (op === '<' && currentDist >= thresh) {
        issues.push({
          id: 'sonar-dist-safe',
          type: 'threshold',
          severity: 'tip',
          title: `Collision Alarm Inactive (${currentDist}cm >= ${thresh}cm)`,
          message: `The proximity alarm triggers when distance < ${thresh}cm, but your obstacle slider is at ${currentDist}cm (safe zone). Move the obstacle closer to trigger the alarm.`,
          fixSuggestion: `Drag Obstacle Distance below ${thresh}cm.`,
          sliderAdjustment: { distanceCm: Math.max(4, thresh - 5) }
        });
      }
    }
  }

  // Lab 15: MQ-2 Gas & Smoke
  if (lab === 'gas') {
    const threshMatch = code.match(/if\s*\([^<>]*(>|<)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentGas = hw.gasPpm;

      if (op === '>' && currentGas <= thresh) {
        issues.push({
          id: 'gas-alarm-safe',
          type: 'threshold',
          severity: 'tip',
          title: `Gas Hazard Alarm Silent (${currentGas} PPM <= ${thresh} PPM)`,
          message: `Your siren activates when gas concentration > ${thresh} PPM, but current air quality is clean at ${currentGas} PPM. Drag the Gas slider past ${thresh} PPM to test the siren!`,
          fixSuggestion: `Slide Gas Concentration above ${thresh} PPM.`,
          sliderAdjustment: { gasPpm: thresh + 120 }
        });
      }
    }
  }

  // Lab 18: Soil Moisture & Water Pump Relay
  if (lab === 'soil') {
    const threshMatch = code.match(/if\s*\([^<>]*(<|>)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentSoil = hw.soilMoisturePct;

      if (op === '<' && currentSoil >= thresh) {
        issues.push({
          id: 'soil-moist',
          type: 'threshold',
          severity: 'tip',
          title: `Water Pump Inactive (${currentSoil}% >= ${thresh}%)`,
          message: `Your automated irrigation relay activates when soil moisture < ${thresh}%, but the soil is currently moist at ${currentSoil}%. Slide moisture down to simulate dry drought soil.`,
          fixSuggestion: `Slide Soil Moisture below ${thresh}%.`,
          sliderAdjustment: { soilMoisturePct: Math.max(5, thresh - 15) }
        });
      }
    }
  }

  // 11. Line-by-Line Breakdown
  const lineExplanations: LineExplanation[] = lines.map((l, i) => {
    const trimmed = l.trim();
    return {
      lineNumber: i + 1,
      cpp: trimmed,
      plainEnglish: generatePlainEnglishForLine(trimmed, snapshot.gradeBand),
      hardwareAction: generateHardwareActionForLine(trimmed, lab)
    };
  }).filter((x) => x.cpp.length > 0 && !x.cpp.startsWith('//'));

  // 12. Safe Experiments
  const safeExperiments = generateSafeExperiments(lab, snapshot.gradeBand);

  // 13. Summary
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const tipCount = issues.filter((i) => i.severity === 'tip').length;

  let summary = 'Circuit and C++ code are synchronized with physical hardware.';
  if (errorCount > 0) {
    summary = `Found ${errorCount} syntax/wiring error(s) preventing correct execution.`;
  } else if (warningCount > 0) {
    summary = `Code is running with ${warningCount} advisory notice(s).`;
  } else if (tipCount > 0) {
    summary = `Code syntax is clean! ${tipCount} interactive sensor tips available.`;
  }

  return {
    hasErrors: errorCount > 0,
    issues,
    summary,
    gradeBand: snapshot.gradeBand,
    safeExperiments,
    lineExplanations
  };
}

function generatePlainEnglishForLine(line: string, grade: string): string {
  if (line.includes('void setup()')) {
    return grade === '6-8' 
      ? 'Boot Routine: Runs ONCE when the Arduino powers on.'
      : 'Initial configuration routine executed once at power-on reset.';
  }
  if (line.includes('void loop()')) {
    return grade === '6-8'
      ? 'Infinite Loop: Repeats continuously forever at 16 MHz.'
      : 'Continuous microcontroller execution loop running indefinitely.';
  }
  if (/pinMode\s*\(\s*(\w+)\s*,\s*OUTPUT\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Configures Pin ${pin} as an OUTPUT (Megaphone mode: sends 5V electricity OUT).`;
  }
  if (/pinMode\s*\(\s*(\w+)\s*,\s*INPUT_PULLUP\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '2';
    return `Configures Pin ${pin} with internal 20kΩ pullup resistor (defaults to HIGH until pressed to GND).`;
  }
  if (/digitalWrite\s*\(\s*(\w+)\s*,\s*HIGH\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Sets Pin ${pin} to HIGH (+5.0 Volts) &rarr; powers connected component ON.`;
  }
  if (/digitalWrite\s*\(\s*(\w+)\s*,\s*LOW\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Sets Pin ${pin} to LOW (0.0 Volts / GND) &rarr; turns connected component OFF.`;
  }
  if (/analogWrite\s*\(\s*(\w+)\s*,\s*([^)]+)\s*\)/i.test(line)) {
    return `Sets hardware PWM pulse duty cycle (0–255) for smooth motor speed or LED brightness.`;
  }
  if (/analogRead\s*\(\s*(\w+)\s*\)/i.test(line)) {
    return `Measures incoming analog voltage (0–5V) and converts it to a 10-bit integer (0–1023).`;
  }
  if (/delay\s*\(\s*(\d+)\s*\)/i.test(line)) {
    const ms = line.match(/\d+/)?.[0] || '1000';
    return `Pauses the microcontroller for ${ms} milliseconds (${(parseInt(ms, 10) / 1000).toFixed(2)} seconds).`;
  }
  if (/myServo\.write\s*\(\s*([^)]+)\s*\)/i.test(line)) {
    return `Sends a 50 Hz PWM pulse (1.0ms–2.0ms) commanding the servo motor angle (0°–180°).`;
  }
  if (/Serial\.print/i.test(line)) {
    return `Transmits ASCII text over UART serial bus (TX pin) to the computer monitor.`;
  }
  if (/lcd\.print/i.test(line)) {
    return `Transmits character bytes over I2C bus (SDA/SCL) to the 16x2 LCD display.`;
  }
  if (/display\.draw/i.test(line)) {
    return `Draws vector graphics geometry into the SSD1306 OLED 128x64 display buffer.`;
  }
  return line;
}

function generateHardwareActionForLine(line: string, lab: string): string {
  if (line.includes('digitalWrite') && line.includes('HIGH')) {
    if (lab === 'led') return 'Pin 13 outputs +5V; 28.5mA flows through 220Ω resistor; LED glows bright.';
    if (lab === 'buzzer') return 'Piezo ceramic disc deflects under 5V electric field; generates click/sound.';
    if (lab === 'temp') return 'Transistor base opens; 12V fan motor spins up.';
    if (lab === 'soil') return 'Optocoupler LED lights; mechanical relay coil de-energizes.';
    return 'Pin outputs +5V logic level.';
  }
  if (line.includes('digitalWrite') && line.includes('LOW')) {
    return 'Pin tied to GND (0V); current stops flowing; actuator de-energizes.';
  }
  if (line.includes('analogWrite')) {
    return 'ATmega328P Output Compare Register (OCR) switches pin at 490Hz/980Hz PWM.';
  }
  if (line.includes('analogRead')) {
    return 'Successive Approximation ADC samples voltage over 13 ADC clock cycles (~104µs).';
  }
  if (line.includes('delay')) {
    return 'CPU busy-waits or decrements clock cycle counter while pins hold current voltage.';
  }
  return 'Executes in 1-2 CPU clock cycles at 16 MHz.';
}

function generateSafeExperiments(lab: string, _grade: string): string[] {
  switch (lab) {
    case 'led':
      return [
        '⚡ Change delay(1000) to delay(100) to turn your blinker into a fast emergency strobe.',
        '💓 Set HIGH delay to 200ms and LOW delay to 800ms to mimic an authentic human heartbeat rhythm.',
        '💡 Try analogWrite(13, 64) on a PWM pin to see soft 25% nightlight dimming.'
      ];
    case 'servo':
      return [
        '🔄 Change the sweep step from pos += 1 to pos += 15 to watch the servo step rapidly.',
        '🎯 Set fixed angles: myServo.write(45); delay(1000); myServo.write(135); for a robot wave.',
        '📐 Experiment with sweeping backwards: for (pos = 180; pos >= 0; pos -= 5).'
      ];
    case 'pot':
      return [
        '🎛️ Invert the knob: change map(val, 0, 1023, 0, 180) to map(val, 0, 1023, 180, 0).',
        '📊 Add Serial.print("Raw: "); Serial.println(val); to inspect exact 10-bit integers in the Serial Monitor.',
        '💡 Map potentiometer to LED: int duty = map(val, 0, 1023, 0, 255); analogWrite(9, duty);'
      ];
    case 'ldr':
      return [
        '🌙 Change threshold 400 to 750 to make the nightlight trigger even at dusk instead of total darkness.',
        '🚨 Invert logic: make the LED turn ON when bright (solar tracker mode) using if (light > 600).',
        '📈 Print light values to Serial Monitor to see real-time Lux levels as you drag the slider.'
      ];
    case 'rgb':
      return [
        '🎨 Mix custom Purple: analogWrite(9, 180); analogWrite(10, 0); analogWrite(11, 255);',
        '🟡 Mix Warm Amber: analogWrite(9, 255); analogWrite(10, 120); analogWrite(11, 0);',
        '🌈 Create a color fade loop using three nested for-loops across Red, Green, and Blue pins.'
      ];
    default:
      return [
        '⏱️ Try halving the delay() durations to see the circuit react twice as fast.',
        '🔍 Open the Serial Monitor tab to watch live sensor telemetry printed by the microcontroller.',
        '📊 Switch to the Oscilloscope tab to inspect the real-time voltage and PWM waveforms.'
      ];
  }
}

// ============================================================================
// 2. DYNAMIC LINE-BY-LINE & VARIABLE INSPECTOR
// ============================================================================

export function inspectSpecificLine(lineNum: number, snapshot: WorkbenchStateSnapshot): string {
  const lines = snapshot.currentCpp.split('\n');
  if (lineNum < 1 || lineNum > lines.length) {
    return `Line ${lineNum} does not exist in your sketch (your sketch has ${lines.length} lines).`;
  }

  const rawLine = lines[lineNum - 1];
  const trimmed = rawLine.trim();
  const plainEnglish = generatePlainEnglishForLine(trimmed, snapshot.gradeBand);
  const hwAction = generateHardwareActionForLine(trimmed, snapshot.activeLabId);
  const vars = snapshot.runtimeVars || {};

  let varDetails = '';
  const referencedVars = Object.keys(vars).filter((v) => new RegExp(`\\b${v}\\b`).test(trimmed));
  if (referencedVars.length > 0) {
    varDetails = '\n\n**Current Live Variables Referenced on this Line:**\n' +
      referencedVars.map((v) => `* \`${v}\` = \`${JSON.stringify(vars[v])}\``).join('\n');
  }

  return `### 🔍 Line ${lineNum} Detailed Inspection\n\n\`\`\`cpp\n${rawLine}\n\`\`\`\n\n* **Plain English Meaning:** ${plainEnglish}\n* **Hardware Execution:** ${hwAction}${varDetails}\n\n*Tip: Ask "what happens if I change line ${lineNum}?" to explore experiment ideas!*`;
}

export function inspectVariable(varName: string, snapshot: WorkbenchStateSnapshot): string {
  const vars = snapshot.runtimeVars || {};
  const code = snapshot.currentCpp;
  const lines = code.split('\n');

  const defLine = lines.findIndex((l) => new RegExp(`\\b${varName}\\b\\s*(=|\\[|;)`).test(l));
  const hasLiveVal = varName in vars;
  const liveVal = hasLiveVal ? JSON.stringify(vars[varName]) : 'Not yet assigned / Out of scope';

  let reply = `### 📦 Variable Inspector: \`${varName}\`\n\n`;
  if (defLine !== -1) {
    reply += `* **Declared on Line ${defLine + 1}:** \`${lines[defLine].trim()}\`\n`;
  }
  reply += `* **Current Live Memory Value:** \`${liveVal}\`\n`;

  if (varName.toLowerCase().includes('pwm') || varName.toLowerCase().includes('duty')) {
    reply += `* **Physical Meaning:** 8-bit PWM duty cycle value between 0 (0% OFF) and 255 (100% full 5V).\n`;
  } else if (varName.toLowerCase().includes('temp')) {
    reply += `* **Physical Meaning:** Sensor temperature in Celsius (°C). Live hardware reading is currently ${snapshot.hardwareState.temperatureC}°C.\n`;
  } else if (varName.toLowerCase().includes('dist')) {
    reply += `* **Physical Meaning:** Ultrasonic distance measured in centimeters (cm). Live distance is ${snapshot.hardwareState.distanceCm}cm.\n`;
  } else if (varName.toLowerCase().includes('light') || varName.toLowerCase().includes('ldr')) {
    reply += `* **Physical Meaning:** Ambient light reading in Lux (0=pitch black, 1023=direct bright sun). Live value: ${snapshot.hardwareState.ldrRaw} Lux.\n`;
  } else if (varName.toLowerCase().includes('soil')) {
    reply += `* **Physical Meaning:** Soil volumetric moisture percentage (0%=dry drought, 100%=water reservoir saturated). Live value: ${snapshot.hardwareState.soilMoisturePct}%.\n`;
  }

  reply += `\n*Ask me how to modify \`${varName}\` or what happens when its value changes!*`;
  return reply;
}

export function explainFunction(funcName: string, _snapshot: WorkbenchStateSnapshot): string {
  const lower = funcName.toLowerCase();

  switch (lower) {
    case 'pinmode':
      return `### 📢 Understanding \`pinMode(pin, mode)\`\n\n\`pinMode()\` tells an ATmega328P GPIO pin whether to act as an **OUTPUT (Megaphone)** pumping out 5V electric current, or an **INPUT (Ear)** listening for incoming voltage.\n\n* **Syntax:** \`pinMode(pin, OUTPUT | INPUT | INPUT_PULLUP);\`\n* **INPUT_PULLUP:** Connects an internal 20kΩ pullup resistor to +5V so the pin stays HIGH until pressed to Ground (essential for pushbuttons!).\n* **Where it belongs:** Put it once inside \`void setup()\`, not in \`void loop()\`!`;

    case 'digitalwrite':
      return `### 💡 Understanding \`digitalWrite(pin, value)\`\n\nSets a digital GPIO pin to either **HIGH (+5.0V)** or **LOW (0.0V / Ground)**.\n\n* **Syntax:** \`digitalWrite(13, HIGH);\` &rarr; LED glows.\n* **Electrical Output:** Can source up to 40mA of current (safely operate at ~20mA with a 220Ω current-limiting resistor).`;

    case 'analogwrite':
      return `### 🌊 Understanding \`analogWrite(pin, duty)\`\n\nGenerates a High-Speed **Pulse Width Modulation (PWM)** waveform to simulate analog voltage (dimming LEDs or throttling DC motors).\n\n* **Syntax:** \`analogWrite(pin, 0 to 255);\`\n* **Duty Cycle:** \`0\` = 0V (OFF), \`128\` = 50% square wave (~2.5V average), \`255\` = 100% (+5V continuous).\n* **Supported Pins:** On Arduino Uno, ONLY pins marked with ~ (**3, 5, 6, 9, 10, 11**) support PWM!`;

    case 'analogread':
      return `### 📈 Understanding \`analogRead(pin)\`\n\nReads incoming continuous voltage (0.0V to 5.0V) on analog pins A0–A5 using the built-in **10-bit Successive Approximation ADC**.\n\n* **Syntax:** \`int val = analogRead(A0);\`\n* **Resolution:** 10 bits = $2^{10} = 1024$ levels. Returns an integer from **0** (0.0V) to **1023** (+5.0V). Each step is $\\frac{5.0\\text{V}}{1023} \\approx 4.88\\text{mV}$.`;

    case 'map':
      return `### 📐 Understanding \`map(value, fromLow, fromHigh, toLow, toHigh)\`\n\nRe-maps a number from one numeric range into another range using linear proportion math:\n\n$$\\text{output} = (\\text{value} - \\text{fromLow}) \\times \\frac{\\text{toHigh} - \\text{toLow}}{\\text{fromHigh} - \\text{fromLow}} + \\text{toLow}$$\n\n* **Example:** Translate 10-bit potentiometer input (0–1023) into servo steering angle (0°–180°):\n  \`int angle = map(val, 0, 1023, 0, 180);\``;

    case 'constrain':
      return `### 🛡️ Understanding \`constrain(x, a, b)\`\n\nClamps a number $x$ to stay strictly within the boundary between minimum $a$ and maximum $b$.\n\n* If $x < a$, returns $a$.\n* If $x > b$, returns $b$.\n* If $x$ is between $a$ and $b$, returns $x$ unchanged.\n* **Example:** \`int safePWM = constrain(fanSpeed, 0, 255);\``;

    case 'pulsein':
      return `### ⏱️ Understanding \`pulseIn(pin, value)\`\n\nMeasures the duration of an electrical pulse in microseconds (µs). Used by the HC-SR04 Ultrasonic Sonar sensor to measure round-trip sound wave flight time.\n\n* **Distance Math:** Sound travels through room air at ~343 m/s (~0.0343 cm/µs). Since the pulse travels to the obstacle and back:\n  $$\\text{Distance (cm)} = \\frac{\\text{duration (µs)}}{58.2}$$`;

    case 'tone':
      return `### 🎵 Understanding \`tone(pin, frequency, duration)\`\n\nGenerates a 50% duty-cycle square wave at the specified frequency (in Hertz) on a digital pin to make a Piezo Buzzer sing notes!\n\n* **Example:** \`tone(8, 440);\` plays concert pitch A4 (440 Hz).\n* **Turn Off:** Call \`noTone(8);\` to silence the buzzer.`;

    default:
      return `### 📖 Arduino C++ Function: \`${funcName}\`\n\nIn SparkByte Studio v2, \`${funcName}\` is compiled and simulated directly against the virtual ATmega328P microcontroller hardware. Check line-by-line breakdown or diagnostic report for specific usage!`;
  }
}

// ============================================================================
// 3. HINDI (हिंदी) BILINGUAL EXPLANATION GENERATOR (OFFLINE)
// ============================================================================

export function generateHindiExplanation(snapshot: WorkbenchStateSnapshot): string {
  const lab = snapshot.activeLabTitle;
  const hw = snapshot.hardwareState;
  const diag = runDeterministicDiagnostics(snapshot);

  let statusText = snapshot.isRunning ? 'चालू है (RUNNING ▶)' : 'रुका हुआ है (PAUSED ⏸)';

  let issuesHindi = '';
  if (diag.issues.length > 0) {
    issuesHindi = '\n\n#### ⚠️ ध्यान देने योग्य बातें:\n' +
      diag.issues.map((i, idx) => `* **${idx + 1}. ${i.title}**: ${i.message}`).join('\n');
  }

  return `### 🇮🇳 Sparky AI Coach (हिंदी गाइड)

**नमस्ते भावी इंजीनियर!** 👋 स्वागत है **${lab}** में।

#### 1. यह कोड कैसे काम करता है?
* **\`void setup()\`**: यह सर्किट का "स्टार्टअप कमरा" है। जब Arduino में पावर आती है, तो यह केवल **एक बार** चलता है। यहाँ हम \`pinMode()\` से तय करते हैं कि कौन सा पिन इनपुट (सेंसर) है और कौन सा आउटपुट (LED/मोटर/फैन)।
* **\`void loop()\`**: यह कभी न रुकने वाला पहिया है! जब तक बिजली चालू है, माइक्रोप्रोसेसर इन लाइनों को लगातार 16 MHz की गति पर दोहराता रहता है।

#### 2. आपके सर्किट की लाइव स्थिति:
* **माइक्रोप्रोसेसर**: ${statusText}
* **सेंसर व पिन वैल्यू**:
  - LED स्थिति: ${hw.ledOn ? '💡 जल रही है (ON - 5V)' : '🌑 बंद है (OFF - 0V)'}
  - सर्वो मोटर कोण: ${hw.servoAngle}°
  - पोटेंशियोमीटर: ${hw.potVal} (0 से 1023 के बीच)
  - तापमान: ${hw.temperatureC}°C | दूरी: ${hw.distanceCm}cm | गैस: ${hw.gasPpm} PPM${issuesHindi}

#### 3. Sparky का छोटा सा टिप:
अगर आप चाहते हैं कि सर्किट तेज़ी से काम करे, तो \`delay(1000)\` की जगह \`delay(200)\` लिखकर देखें! कोई भी सवाल हो तो नीचे चैट में पूछें! 🚀`;
}

export function inspectSpecificLineHindi(lineNum: number, snapshot: WorkbenchStateSnapshot): string {
  const lines = snapshot.currentCpp.split('\n');
  if (lineNum < 1 || lineNum > lines.length) {
    return `लाइन ${lineNum} आपके स्केच में नहीं है (कुल ${lines.length} लाइनें हैं)।`;
  }
  const rawLine = lines[lineNum - 1];
  const trimmed = rawLine.trim();
  const plainEnglish = generatePlainEnglishForLine(trimmed, snapshot.gradeBand);
  const hwAction = generateHardwareActionForLine(trimmed, snapshot.activeLabId);

  return `### 🔍 लाइन ${lineNum} की विस्तृत जानकारी (हिंदी)\n\n\`\`\`cpp\n${rawLine}\n\`\`\`\n\n* **अर्थ:** ${plainEnglish}\n* **हार्डवेयर प्रभाव:** ${hwAction}\n\n*टिप: आप इस लाइन में मान बदलकर नया प्रयोग कर सकते हैं!*`;
}

// ============================================================================
// 3.5 PROCEDURAL ARDUINO C++ CODE GENERATOR (100% OFFLINE, ZERO API KEY)
// ============================================================================

export interface GeneratedSketch {
  title: string;
  description: string;
  code: string;
  labId: string;
}

export function isCodeGenerationIntent(query: string): boolean {
  const q = query.toLowerCase().trim();

  // Exclude explicit line inspection requests (e.g. "explain line 12", "line 5")
  if (/\bline\s*\d+\b/i.test(q)) return false;

  // Exclude pure debugging inquiries (e.g. "why not working", "find bugs", "why is fan off")
  if (
    q.includes('why') ||
    q.includes('not working') ||
    q.includes('not turning on') ||
    q.includes('not spinning') ||
    q.includes('not blinking') ||
    q.includes('error') ||
    q.includes('bug') ||
    q.includes('wrong') ||
    q.includes('broken') ||
    q.includes('issue') ||
    q.includes('fail')
  ) {
    return false;
  }

  // Code generation, sketch writing, hardware actions, pacing, or modifications
  const codeKeywords = [
    'generate', 'write', 'create', 'make', 'code', 'sketch', 'program',
    'blink', 'sweep', 'sensor', 'faster', 'slower', 'strobe', 'heartbeat',
    'pin', 'dual', 'alternate', 'servo', 'sonar', 'ultrasonic', 'motor',
    'relay', 'pump', 'buzzer', 'melody', 'tone', 'dim', 'fade',
    'give me', 'need code', 'how to code', 'sample code', 'example code',
    'arduino'
  ];

  return codeKeywords.some((kw) => q.includes(kw));
}

export function resolveTargetLabId(query: string, currentLabId: string): string {
  const q = query.toLowerCase();

  // 1. Explicit Lab Numbers: "lab 1", "lab 01", etc.
  const labNumMatch = q.match(/\blab\s*(?:0?(\d+))\b/i);
  if (labNumMatch) {
    const num = parseInt(labNumMatch[1], 10);
    const labNumberMap: Record<number, string> = {
      1: 'led', 2: 'servo', 3: 'button', 4: 'pot', 5: 'buzzer',
      6: 'cad', 7: 'dmm', 8: 'ldr', 9: 'rgb', 10: 'temp',
      11: 'sonar', 12: 'ir', 13: 'slicer', 14: 'dht', 15: 'gas',
      16: 'lcd', 17: 'oled', 18: 'soil', 19: 'motor', 20: 'imu',
      21: 'rfid', 22: 'iot'
    };
    if (labNumberMap[num]) return labNumberMap[num];
  }

  // 2. Hardware / Domain Keyword Matching
  if (/\b(rfid|mfrc522|card|uid)\b/i.test(q)) return 'rfid';
  if (/\b(imu|mpu6050|gyro|accelerometer)\b/i.test(q)) return 'imu';
  if (/\b(iot|esp8266|wifi|cloud)\b/i.test(q)) return 'iot';
  if (/\b(soil|moisture|irrigation|plant|pump)\b/i.test(q)) return 'soil';
  if (/\b(motor|l298n|h-bridge|dc motor)\b/i.test(q)) return 'motor';
  if (/\b(oled|ssd1306|128x64)\b/i.test(q)) return 'oled';
  if (/\b(lcd|16x2|liquidcrystal)\b/i.test(q)) return 'lcd';
  if (/\b(gas|mq-2|mq2|smoke)\b/i.test(q)) return 'gas';
  if (/\b(dht|dht11|humidity)\b/i.test(q)) return 'dht';
  if (/\b(sonar|ultrasonic|distance|hc-sr04|obstacle)\b/i.test(q)) return 'sonar';
  if (/\b(ir\b|infrared|line tracking|proximity)\b/i.test(q)) return 'ir';
  if (/\b(temp|temperature|lm35|tmp36|thermometer)\b/i.test(q)) return 'temp';
  if (/\b(rgb|color fade|rainbow)\b/i.test(q)) return 'rgb';
  if (/\b(ldr|photoresistor|nightlight|lux|dusk)\b/i.test(q)) return 'ldr';
  if (/\b(dmm|multimeter|voltmeter)\b/i.test(q)) return 'dmm';
  if (/\b(cad|openscad|solid model)\b/i.test(q)) return 'cad';
  if (/\b(slicer|gcode|toolpath)\b/i.test(q)) return 'slicer';
  if (/\b(buzzer|piezo|tone|melody|alarm|siren)\b/i.test(q)) return 'buzzer';
  if (/\b(pot|potentiometer|knob)\b/i.test(q)) return 'pot';
  if (/\b(button|switch|pushbutton)\b/i.test(q)) return 'button';
  if (/\b(servo|sg90|sweep)\b/i.test(q)) return 'servo';
  if (/\b(led|blink|blinking|strobe|light)\b/i.test(q)) return 'led';

  // 3. Fallback to active lab in workbench
  return currentLabId || 'led';
}

export function generateProceduralSketch(query: string, snapshot: WorkbenchStateSnapshot): GeneratedSketch {
  const q = query.toLowerCase();
  const labId = resolveTargetLabId(query, snapshot.activeLabId);

  // Parameter extraction
  const delayMatch = q.match(/(\d+)\s*(?:ms|milliseconds?)/i);
  let delayMs = delayMatch ? parseInt(delayMatch[1], 10) : null;
  if (!delayMs) {
    if (q.includes('faster') || q.includes('fast')) delayMs = 150;
    else if (q.includes('slower') || q.includes('slow')) delayMs = 2000;
    else if (q.includes('strobe')) delayMs = 50;
  }

  const pinMatch = q.match(/pins?\s*(\d+)/i);
  const customPin = pinMatch ? parseInt(pinMatch[1], 10) : null;

  const thresholdMatch = q.match(/threshold\s*(?:of\s*)?(\d+)/i) || q.match(/(\d+)\s*(?:c|degrees?|cm|ppm|%|lux)/i);
  const customThreshold = thresholdMatch ? parseInt(thresholdMatch[1], 10) : null;

  const isDualLed = q.includes('2 led') || q.includes('two led') || q.includes('dual led') || q.includes('alternate');
  const isHeartbeat = q.includes('heartbeat');

  let code = '';
  let title = '';
  let description = '';

  switch (labId) {
    case 'led': {
      if (isDualLed) {
        title = 'Dual LED Alternating Flasher';
        description = 'Controls two separate digital LEDs (Pins 13 and 12) alternating in rhythm.';
        code = `// Generated by Sparky AI Coach: Dual LED Alternating Blink
const int LED1_PIN = 13;
const int LED2_PIN = 12;

void setup() {
    pinMode(LED1_PIN, OUTPUT);
    pinMode(LED2_PIN, OUTPUT);
}

void loop() {
    // LED 1 ON, LED 2 OFF
    digitalWrite(LED1_PIN, HIGH);
    digitalWrite(LED2_PIN, LOW);
    delay(${delayMs || 500});

    // LED 1 OFF, LED 2 ON
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, HIGH);
    delay(${delayMs || 500});
}`;
      } else if (isHeartbeat) {
        title = 'Human Heartbeat Double-Pulse LED';
        description = 'Simulates a biological human cardiac double-pulse rhythm (lub-dub).';
        code = `// Generated by Sparky AI Coach: Human Heartbeat LED Rhythm
const int LED_PIN = ${customPin || 13};

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    // First beat (Lub)
    digitalWrite(LED_PIN, HIGH);
    delay(150);
    digitalWrite(LED_PIN, LOW);
    delay(150);

    // Second beat (Dub)
    digitalWrite(LED_PIN, HIGH);
    delay(150);
    digitalWrite(LED_PIN, LOW);
    delay(650);
}`;
      } else {
        const d = delayMs || 1000;
        const p = customPin || 13;
        title = `Digital LED Blink (${d}ms on Pin ${p})`;
        description = `Configures Pin ${p} as digital OUTPUT, toggling HIGH (+5V) and LOW (0V) with ${d}ms delay.`;
        code = `// Generated by Sparky AI Coach: LED Digital Blink
const int LED_PIN = ${p};

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_PIN, HIGH); // Turn LED ON (+5V)
    delay(${d});
    digitalWrite(LED_PIN, LOW);  // Turn LED OFF (0V)
    delay(${d});
}`;
      }
      break;
    }

    case 'servo': {
      title = 'SG90 Micro Servo PWM Sweep';
      description = 'Uses the Arduino Servo library to smoothly sweep between 0° and 180° on PWM Pin 9.';
      code = `// Generated by Sparky AI Coach: SG90 Micro Servo Sweep
#include <Servo.h>

Servo myServo;
const int SERVO_PIN = ${customPin || 9};

void setup() {
    myServo.attach(SERVO_PIN);
}

void loop() {
    // Forward sweep from 0 to 180 degrees
    for (int pos = 0; pos <= 180; pos += 5) {
        myServo.write(pos);
        delay(15);
    }
    // Reverse sweep from 180 to 0 degrees
    for (int pos = 180; pos >= 0; pos -= 5) {
        myServo.write(pos);
        delay(15);
    }
}`;
      break;
    }

    case 'button': {
      title = 'Pushbutton Digital Input (INPUT_PULLUP)';
      description = 'Reads active-LOW pushbutton on Pin 2 with internal pullup resistor, driving LED on Pin 13.';
      code = `// Generated by Sparky AI Coach: Pushbutton with Internal Pullup
const int BUTTON_PIN = ${customPin || 2};
const int LED_PIN = 13;

void setup() {
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    int buttonState = digitalRead(BUTTON_PIN);
    // Active LOW: Pressed button connects input to Ground (0V)
    if (buttonState == LOW) {
        digitalWrite(LED_PIN, HIGH);
    } else {
        digitalWrite(LED_PIN, LOW);
    }
}`;
      break;
    }

    case 'pot': {
      title = 'Potentiometer ADC to PWM LED Dimmer';
      description = 'Reads 10-bit analog voltage (0-1023) from Potentiometer A0 and maps to 8-bit PWM (0-255).';
      code = `// Generated by Sparky AI Coach: Potentiometer ADC to PWM Dimmer
const int POT_PIN = A0;
const int LED_PIN = ${customPin || 9}; // Hardware PWM Pin ~

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    int rawVal = analogRead(POT_PIN);
    int pwmVal = map(rawVal, 0, 1023, 0, 255);
    analogWrite(LED_PIN, pwmVal);

    Serial.print("Pot ADC: ");
    Serial.print(rawVal);
    Serial.print(" -> PWM: ");
    Serial.println(pwmVal);
    delay(50);
}`;
      break;
    }

    case 'buzzer': {
      title = 'Piezo Buzzer Multi-Tone Siren Melody';
      description = 'Uses tone() and noTone() to generate square-wave audio frequencies on digital Pin 8.';
      code = `// Generated by Sparky AI Coach: Piezo Buzzer Siren Alarm
const int BUZZER_PIN = ${customPin || 8};

void setup() {
    pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
    tone(BUZZER_PIN, 440, 200); delay(250); // Note A4
    tone(BUZZER_PIN, 880, 200); delay(250); // Note A5
    tone(BUZZER_PIN, 1320, 200); delay(250); // Note E6
    noTone(BUZZER_PIN);
    delay(1000);
}`;
      break;
    }

    case 'cad': {
      title = 'Parametric Robotics Servo Bracket (OpenSCAD)';
      description = 'Generates 3D CAD CSG solid model with mounting holes and servo motor cutout.';
      code = `// Generated by Sparky AI Coach: Parametric Robotics Servo Bracket
$fn = 50;

difference() {
    // Main solid block
    cube([40, 40, 12], center = true);
    // Center servo cutout
    cylinder(h = 20, r = 8, center = true);
    // Mounting screw holes
    translate([14, 14, 0]) cylinder(h = 20, r = 1.6, center = true);
    translate([-14, -14, 0]) cylinder(h = 20, r = 1.6, center = true);
}`;
      break;
    }

    case 'dmm': {
      title = 'Digital Multimeter DC Voltmeter';
      description = 'Reads circuit probe voltage from Analog Pin A0 and prints calibrated volts to Serial.';
      code = `// Generated by Sparky AI Coach: Digital Multimeter Voltmeter
const int PROBE_PIN = A0;

void setup() {
    Serial.begin(9600);
    Serial.println("--- SPARKBYTE DIGITAL MULTIMETER ---");
}

void loop() {
    int raw = analogRead(PROBE_PIN);
    float voltage = (raw / 1023.0) * 5.0;

    Serial.print("DMM Measured Voltage: ");
    Serial.print(voltage, 2);
    Serial.println(" V");
    delay(250);
}`;
      break;
    }

    case 'ldr': {
      const thresh = customThreshold || 500;
      title = `LDR Dusk-to-Dawn Smart Nightlight (Threshold: ${thresh})`;
      description = `Monitors ambient light via photoresistor divider on A0 and triggers LED when dark.`;
      code = `// Generated by Sparky AI Coach: LDR Dusk-to-Dawn Nightlight
const int LDR_PIN = A0;
const int LED_PIN = ${customPin || 13};
const int DARK_THRESHOLD = ${thresh};

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    int lightLevel = analogRead(LDR_PIN);
    Serial.print("Ambient Light: ");
    Serial.println(lightLevel);

    if (lightLevel < DARK_THRESHOLD) {
        digitalWrite(LED_PIN, HIGH); // Dark outside: Nightlight ON
    } else {
        digitalWrite(LED_PIN, LOW);  // Daytime: Nightlight OFF
    }
    delay(100);
}`;
      break;
    }

    case 'rgb': {
      title = 'RGB Multi-Color PWM Color Cycler';
      description = 'Controls Red (Pin 9), Green (Pin 10), and Blue (Pin 11) PWM channels for full spectrum mixing.';
      code = `// Generated by Sparky AI Coach: RGB Multi-Color PWM Cycler
const int RED_PIN = 9;
const int GREEN_PIN = 10;
const int BLUE_PIN = 11;

void setup() {
    pinMode(RED_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
}

void loop() {
    setColor(255, 0, 0); delay(700);   // Pure Red
    setColor(0, 255, 0); delay(700);   // Pure Green
    setColor(0, 0, 255); delay(700);   // Pure Blue
    setColor(255, 180, 0); delay(700); // Warm Amber
    setColor(0, 255, 255); delay(700); // Sky Cyan
    setColor(180, 0, 255); delay(700); // Electric Purple
}

void setColor(int r, int g, int b) {
    analogWrite(RED_PIN, r);
    analogWrite(GREEN_PIN, g);
    analogWrite(BLUE_PIN, b);
}`;
      break;
    }

    case 'temp': {
      const thresh = customThreshold || 30;
      title = `LM35/TMP36 Temperature Fan Controller (Threshold: ${thresh}°C)`;
      description = `Reads analog temperature sensor on A0 and throttles PWM cooling fan on Pin 6.`;
      code = `// Generated by Sparky AI Coach: Temperature Fan Controller
const int TEMP_PIN = A0;
const int FAN_PIN = ${customPin || 6}; // Hardware PWM ~
const float SETPOINT = ${thresh}.0;

void setup() {
    Serial.begin(9600);
    pinMode(FAN_PIN, OUTPUT);
}

void loop() {
    int raw = analogRead(TEMP_PIN);
    float voltage = (raw / 1023.0) * 5.0;
    float tempC = (voltage - 0.5) * 100.0;

    Serial.print("Temperature: ");
    Serial.print(tempC, 1);
    Serial.println(" C");

    if (tempC > SETPOINT) {
        int fanSpeed = map((int)tempC, (int)SETPOINT, 60, 100, 255);
        analogWrite(FAN_PIN, constrain(fanSpeed, 0, 255));
    } else {
        analogWrite(FAN_PIN, 0);
    }
    delay(200);
}`;
      break;
    }

    case 'sonar': {
      const thresh = customThreshold || 20;
      title = `HC-SR04 Ultrasonic Sonar Obstacle Alarm (Threshold: ${thresh}cm)`;
      description = `Emits 10µs sound ping on TRIG Pin 9, calculates flight time on ECHO Pin 10, and beeps alarm on Pin 8.`;
      code = `// Generated by Sparky AI Coach: HC-SR04 Sonar Radar
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = ${customPin || 8};
const int SAFE_DISTANCE = ${thresh};

void setup() {
    Serial.begin(9600);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    int distance = duration / 58.2;

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    if (distance > 0 && distance < SAFE_DISTANCE) {
        tone(BUZZER_PIN, 1000, 100);
    } else {
        noTone(BUZZER_PIN);
    }
    delay(100);
}`;
      break;
    }

    case 'ir': {
      title = 'IR Infrared Proximity Sensor';
      description = 'Reads digital IR obstacle sensor on Pin 2 and triggers indicator LED on Pin 13.';
      code = `// Generated by Sparky AI Coach: IR Proximity Sensor
const int IR_PIN = ${customPin || 2};
const int LED_PIN = 13;

void setup() {
    Serial.begin(9600);
    pinMode(IR_PIN, INPUT);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    int obstacle = digitalRead(IR_PIN);
    // Active LOW: 0 = Obstacle detected in front of IR diode
    if (obstacle == LOW) {
        digitalWrite(LED_PIN, HIGH);
        Serial.println("OBSTACLE DETECTED!");
    } else {
        digitalWrite(LED_PIN, LOW);
        Serial.println("Clear");
    }
    delay(100);
}`;
      break;
    }

    case 'slicer': {
      title = '3D Printer Calibration Toolpath (G-Code)';
      description = 'Generates G-code instructions for 200°C nozzle, 60°C heated bed, and perimeter toolpath.';
      code = `; Generated by Sparky AI Coach: 3D Printer G-Code
G21 ; Metric millimeters
G90 ; Absolute coordinates
M104 S200 ; Nozzle heater 200C
M140 S60  ; Heated bed 60C
G28 ; Home XYZ
G1 Z0.20 F1200 ; First layer height
G1 X100 Y100 E5 F1500 ; Purge line
G1 X120 Y100 E8 F1800 ; Edge 1
G1 X120 Y120 E11 F1800 ; Edge 2
G1 X100 Y120 E14 F1800 ; Edge 3
G1 X100 Y100 E17 F1800 ; Edge 4
M104 S0 ; Cooldown
M140 S0
M84 ; Motors off`;
      break;
    }

    case 'dht': {
      title = 'DHT11 Climate Telemetry & Exhaust Controller';
      description = 'Reads temperature and relative humidity telemetry, activating exhaust fan on Pin 6.';
      code = `// Generated by Sparky AI Coach: DHT11 Climate Controller
const int DHT_PIN = 7;
const int FAN_PIN = ${customPin || 6};

void setup() {
    Serial.begin(9600);
    pinMode(FAN_PIN, OUTPUT);
}

void loop() {
    float temp = 27.5;
    float humidity = 68.0;

    Serial.print("Temp: ");
    Serial.print(temp, 1);
    Serial.print(" C | Humidity: ");
    Serial.print(humidity, 1);
    Serial.println(" %");

    if (temp > 28.0 || humidity > 70.0) {
        analogWrite(FAN_PIN, 220);
    } else {
        analogWrite(FAN_PIN, 0);
    }
    delay(500);
}`;
      break;
    }

    case 'gas': {
      const thresh = customThreshold || 350;
      title = `MQ-2 Smoke & Flammable Gas Alarm (Threshold: ${thresh} PPM)`;
      description = `Reads analog gas concentration on A0 and triggers audio siren on Pin 8 and strobe on Pin 13.`;
      code = `// Generated by Sparky AI Coach: MQ-2 Gas Alarm
const int GAS_PIN = A0;
const int BUZZER_PIN = ${customPin || 8};
const int LED_PIN = 13;
const int ALARM_THRESHOLD = ${thresh};

void setup() {
    Serial.begin(9600);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    int gasPPM = analogRead(GAS_PIN);
    Serial.print("Gas PPM: ");
    Serial.println(gasPPM);

    if (gasPPM > ALARM_THRESHOLD) {
        digitalWrite(LED_PIN, HIGH);
        tone(BUZZER_PIN, 1200, 150);
    } else {
        digitalWrite(LED_PIN, LOW);
        noTone(BUZZER_PIN);
    }
    delay(150);
}`;
      break;
    }

    case 'lcd': {
      title = 'I2C 16x2 LiquidCrystal Display Telemetry';
      description = 'Initializes I2C LCD on address 0x27 and writes real-time live system uptime counter.';
      code = `// Generated by Sparky AI Coach: I2C 16x2 LCD Counter
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("SPARKBYTE STUDIO");
    lcd.setCursor(0, 1);
    lcd.print("SYSTEM READY");
}

void loop() {
    lcd.setCursor(0, 1);
    lcd.print("Uptime: ");
    lcd.print(millis() / 1000);
    lcd.print("s   ");
    delay(500);
}`;
      break;
    }

    case 'oled': {
      title = 'SSD1306 128x64 OLED Graphics Display';
      description = 'Initializes I2C OLED on address 0x3C and draws headers, geometry, and real-time clock.';
      code = `// Generated by Sparky AI Coach: SSD1306 128x64 OLED
#include <Wire.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
    display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 0);
    display.println("ATL INNOVATION LAB");
    display.drawLine(0, 12, 127, 12, WHITE);
    display.display();
}

void loop() {
    display.setCursor(0, 20);
    display.print("Seconds: ");
    display.println(millis() / 1000);
    display.display();
    delay(500);
}`;
      break;
    }

    case 'soil': {
      const thresh = customThreshold || 35;
      title = `Soil Moisture Automatic Irrigation Pump Relay (Threshold: ${thresh}%)`;
      description = `Monitors volumetric soil moisture on A0 and controls active-LOW optocoupled relay pump on Pin 7.`;
      code = `// Generated by Sparky AI Coach: Automatic Irrigation Pump Relay
const int SOIL_PIN = A0;
const int RELAY_PIN = ${customPin || 7}; // Active-LOW relay module
const int DRY_THRESHOLD = ${thresh};

void setup() {
    Serial.begin(9600);
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, HIGH); // Active-LOW: Relay OFF at boot
}

void loop() {
    int raw = analogRead(SOIL_PIN);
    int moisture = map(raw, 1023, 0, 0, 100);

    Serial.print("Soil Moisture: ");
    Serial.print(moisture);
    Serial.println("%");

    if (moisture < DRY_THRESHOLD) {
        digitalWrite(RELAY_PIN, LOW); // Active-LOW: PUMP ON
        Serial.println("-> Relay Energized: Pumping Water");
    } else {
        digitalWrite(RELAY_PIN, HIGH); // PUMP OFF
    }
    delay(300);
}`;
      break;
    }

    case 'motor': {
      title = 'L298N Dual H-Bridge DC Motor Driver';
      description = 'Controls direction (IN1/IN2 Pins 8/7) and PWM speed (ENA Pin 9) with forward, reverse, and brake.';
      code = `// Generated by Sparky AI Coach: L298N DC Motor Driver
const int ENA_PIN = 9; // PWM Speed ~
const int IN1_PIN = 8;
const int IN2_PIN = 7;

void setup() {
    pinMode(ENA_PIN, OUTPUT);
    pinMode(IN1_PIN, OUTPUT);
    pinMode(IN2_PIN, OUTPUT);
}

void loop() {
    // Forward Full Speed
    digitalWrite(IN1_PIN, HIGH);
    digitalWrite(IN2_PIN, LOW);
    analogWrite(ENA_PIN, 255);
    delay(1500);

    // Reverse Half Speed
    digitalWrite(IN1_PIN, LOW);
    digitalWrite(IN2_PIN, HIGH);
    analogWrite(ENA_PIN, 150);
    delay(1500);

    // Brake / Stop
    digitalWrite(IN1_PIN, LOW);
    digitalWrite(IN2_PIN, LOW);
    analogWrite(ENA_PIN, 0);
    delay(1000);
}`;
      break;
    }

    case 'imu': {
      title = 'MPU-6050 6-Axis Gyroscope & Accelerometer';
      description = 'Communicates over I2C bus (0x68) to read raw 16-bit 3-axis accelerometer and gyro registers.';
      code = `// Generated by Sparky AI Coach: MPU-6050 IMU Telemetry
#include <Wire.h>

const int MPU_ADDR = 0x68;

void setup() {
    Serial.begin(9600);
    Wire.begin();
    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x6B); // Power management register
    Wire.write(0);    // Wake up MPU-6050
    Wire.endTransmission(true);
    Serial.println("MPU-6050 Initialized.");
}

void loop() {
    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x3B);
    Wire.endTransmission(false);
    Wire.requestFrom(MPU_ADDR, 6, true);

    int16_t ax = Wire.read() << 8 | Wire.read();
    int16_t ay = Wire.read() << 8 | Wire.read();
    int16_t az = Wire.read() << 8 | Wire.read();

    Serial.print("AccX: "); Serial.print(ax);
    Serial.print(" | AccY: "); Serial.print(ay);
    Serial.print(" | AccZ: "); Serial.println(az);
    delay(100);
}`;
      break;
    }

    case 'rfid': {
      title = 'MFRC522 SPI RFID Security Access Gate';
      description = 'Initializes SPI RFID module, reads 4-byte card UID, and verifies against authorized MASTER_UID.';
      code = `// Generated by Sparky AI Coach: MFRC522 RFID Security Gate
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);
const byte MASTER_UID[4] = {0xA3, 0x5B, 0x12, 0x09};
const int ACCESS_LED = 13;

void setup() {
    Serial.begin(9600);
    SPI.begin();
    rfid.PCD_Init();
    pinMode(ACCESS_LED, OUTPUT);
    Serial.println("Ready: Tap RFID Card...");
}

void loop() {
    if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

    bool authorized = true;
    for (byte i = 0; i < 4; i++) {
        if (rfid.uid.uidByte[i] != MASTER_UID[i]) authorized = false;
    }

    if (authorized) {
        Serial.println("ACCESS GRANTED: Welcome, Student!");
        digitalWrite(ACCESS_LED, HIGH);
        delay(1000);
        digitalWrite(ACCESS_LED, LOW);
    } else {
        Serial.println("ACCESS DENIED: Unauthorized Card!");
    }
    delay(500);
}`;
      break;
    }

    case 'iot': {
      title = 'ESP8266 Wi-Fi Cloud Telemetry Gateway';
      description = 'Sends AT commands over SoftwareSerial (Pins 2/3) to upload sensor telemetry to IoT cloud server.';
      code = `// Generated by Sparky AI Coach: ESP8266 IoT Cloud Telemetry
#include <SoftwareSerial.h>

SoftwareSerial esp(2, 3); // RX, TX
const int SENSOR_PIN = A0;

void setup() {
    Serial.begin(9600);
    esp.begin(9600);
    Serial.println("Connecting to Cloud Server via ESP8266...");
    esp.println("AT");
    delay(500);
    esp.println("AT+CWMODE=1");
    delay(500);
}

void loop() {
    int sensorVal = analogRead(SENSOR_PIN);
    Serial.print("Cloud Telemetry: ");
    Serial.println(sensorVal);

    esp.print("AT+CIPSTART=\"TCP\",\"cloud.sparkbyte.io\",80\\r\\n");
    delay(1000);
    String payload = "GET /telemetry?val=" + String(sensorVal) + " HTTP/1.1\\r\\n\\r\\n";
    esp.print("AT+CIPSEND=" + String(payload.length()) + "\\r\\n");
    delay(500);
    esp.print(payload);
    delay(4000);
}`;
      break;
    }

    default: {
      title = 'Arduino Sketch Generator';
      description = 'Default synthesized Arduino C++ sketch.';
      code = `void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    digitalWrite(13, HIGH);\n    delay(1000);\n    digitalWrite(13, LOW);\n    delay(1000);\n}`;
    }
  }

  return { title, description, code, labId };
}

// ============================================================================
// 4. MULTI-TURN CONVERSATIONAL INTENT & CURRICULUM REASONER
// ============================================================================

export async function askAiCoach(
  studentQuery: string,
  snapshot: WorkbenchStateSnapshot,
  config: AiCoachConfig
): Promise<AiCoachMessage> {
  const queryLower = studentQuery.toLowerCase().trim();

  // 1. Specific Line Inspection Intent: "explain line 12", "what does line 5 do", "line 14"
  const lineMatch = queryLower.match(/(?:explain|what (?:is|does))\s*(?:on\s*)?line\s*(\d+)/) || queryLower.match(/^line\s*(\d+)$/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1], 10);
    if (queryLower.includes('hindi') || queryLower.includes('हिंदी') || queryLower.includes('samjhao') || config.language === 'hi') {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: inspectSpecificLineHindi(lineNum, snapshot),
        timestamp: Date.now(),
        source: 'offline_rule'
      };
    }
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: inspectSpecificLine(lineNum, snapshot),
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // 2. Procedural Code Generation Intent (Zero API Key): "generate code for lab 1 led", "make an LED blink faster", "control 2 LEDs"
  if (isCodeGenerationIntent(studentQuery)) {
    const gen = generateProceduralSketch(studentQuery, snapshot);
    const reply = `### ✨ Synthesized Arduino C++ Sketch: ${gen.title}

${gen.description}

\`\`\`cpp
${gen.code}
\`\`\`

Click **[ ✨ Insert Code into Editor ]** below to load this sketch directly into your Monaco Editor and compile it!`;

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule',
      suggestedFix: {
        label: 'Insert Code into Editor',
        description: gen.title,
        newCode: gen.code
      }
    };
  }

  // 3. Language Fast Path: Hindi / Hinglish queries
  if (
    queryLower.includes('hindi') ||
    queryLower.includes('हिंदी') ||
    queryLower.includes('samjhao') ||
    queryLower.includes('batao') ||
    config.language === 'hi'
  ) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: generateHindiExplanation(snapshot),
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // 4. Variable Inspection Intent: "what is fanPWM", "what is val", "explain melody"
  const varMatch = studentQuery.match(/(?:what is|explain variable|value of)\s+([a-zA-Z_]\w*)/i);
  if (varMatch) {
    const candidateVar = varMatch[1];
    const vars = snapshot.runtimeVars || {};
    const matchingVarKey = Object.keys(vars).find((k) => k.toLowerCase() === candidateVar.toLowerCase());
    const isDeclaredInCode = new RegExp(`\\b${candidateVar}\\b`, 'i').test(snapshot.currentCpp);
    const resolvedVarName = matchingVarKey || candidateVar;
    const reservedWords = ['the', 'this', 'a', 'an', 'line', 'ohm', 'ohms', 'voltage', 'resistor', 'relay', 'pullup', 'pwm', 'i2c', 'spi'];

    if ((isDeclaredInCode || matchingVarKey) && !reservedWords.includes(candidateVar.toLowerCase())) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: inspectVariable(resolvedVarName, snapshot),
        timestamp: Date.now(),
        source: 'offline_rule'
      };
    }
  }

  // 5. Function Explanation Intent: "what is pinMode", "how does map work"
  const funcKeywords = [
    'pinmode', 'digitalwrite', 'digitalread', 'analogwrite', 'analogread',
    'map', 'constrain', 'pulsein', 'tone', 'notone', 'delay', 'millis'
  ];
  for (const fn of funcKeywords) {
    if (queryLower.includes(fn)) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: explainFunction(fn, snapshot),
        timestamp: Date.now(),
        source: 'offline_rule'
      };
    }
  }

  // 6. One-Click Diagnostic Queries: "Why isn't my circuit working?", "Debug", etc.
  const diag = runDeterministicDiagnostics(snapshot);

  const isWhyNotWorking =
    queryLower.includes("why isn't my circuit working") ||
    queryLower.includes("why isn't it working") ||
    queryLower.includes("why is it not working") ||
    queryLower.includes("why not working") ||
    queryLower.includes("not working") ||
    queryLower.includes("debug") ||
    queryLower.includes("find bugs") ||
    queryLower.includes("diagnose");

  if (isWhyNotWorking) {
    let reply = `### 🔍 Live Circuit & Code Diagnostic Report\n\n**${diag.summary}**\n\n`;

    if (diag.issues.length === 0) {
      reply += `✅ **All Systems Normal!** Your C++ code compiled cleanly with 0 syntax errors, and all pin assignments match the physical hardware.\n\n`;
      reply += `* Microcontroller Clock: **${snapshot.isRunning ? 'RUNNING (Active)' : 'STOPPED (Click Start Simulation)'}**\n`;
      reply += `* Loop Cycles Completed: **${snapshot.loopCount}**\n`;
      reply += `* Current Output: LED=${snapshot.hardwareState.ledOn ? 'ON' : 'OFF'}, Servo=${snapshot.hardwareState.servoAngle}°\n\n`;

      // Live sensor-to-actuator threshold telemetry tips
      if (snapshot.activeLabId === 'temp') {
        reply += `* 🌡️ **Temperature Telemetry:** Sensor is currently at **${snapshot.hardwareState.temperatureC}°C**. If your code triggers the fan when \`temp > 30.0\`, drag the temperature slider above 30°C to activate the fan!\n\n`;
      } else if (snapshot.activeLabId === 'soil') {
        reply += `* 🌱 **Soil Moisture Telemetry:** Moisture is currently **${snapshot.hardwareState.soilMoisturePct}%**. Active-LOW relay pump energizes when moisture drops below threshold (e.g. 35%). Drag soil moisture lower to trigger watering!\n\n`;
      } else if (snapshot.activeLabId === 'sonar') {
        reply += `* 🦇 **Sonar Distance Telemetry:** Obstacle is at **${snapshot.hardwareState.distanceCm}cm**. The buzzer alarm sounds when obstacle distance is below threshold (e.g. 20cm). Move obstacle closer!\n\n`;
      } else if (snapshot.activeLabId === 'ldr') {
        reply += `* 🌙 **LDR Light Telemetry:** Ambient light is **${snapshot.hardwareState.ldrRaw} Lux**. Nightlight triggers when light drops below dark threshold (e.g. 500 Lux). Drag brightness down!\n\n`;
      } else if (snapshot.activeLabId === 'gas') {
        reply += `* 🚨 **MQ-2 Gas Telemetry:** Concentration is **${snapshot.hardwareState.gasPpm} PPM**. Alarm buzzer sounds when gas exceeds threshold (e.g. 350 PPM). Drag gas slider up!\n\n`;
      }

      reply += `Want to try an experiment? Check out the safe suggestions below!`;
    } else {
      diag.issues.forEach((issue, i) => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : '💡';
        reply += `${icon} **${i + 1}. ${issue.title}**\n${issue.message}\n`;
        if (issue.fixSuggestion) {
          reply += `> **Suggested Fix:** \`${issue.fixSuggestion}\`\n\n`;
        }
      });
    }

    // Attach suggested fix from first issue with a code replacement
    const firstIssueWithFix = diag.issues.find((i) => i.suggestedFix);

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule',
      issues: diag.issues,
      suggestedFix: firstIssueWithFix?.suggestedFix
    };
  }

  // 6. Explain Code Line-by-Line Intent
  if (queryLower.includes('explain this code') || queryLower.includes('line-by-line') || queryLower.includes('breakdown')) {
    let reply = `### 📖 Line-by-Line Code Breakdown (${snapshot.gradeBand})\n\n`;
    reply += `Here is how the ATmega328P microcontroller interprets each line of your current sketch:\n\n`;

    diag.lineExplanations.forEach((item) => {
      reply += `* **[Line ${item.lineNumber}]** \`${item.cpp}\`\n`;
      reply += `  &rarr; **Plain English:** ${item.plainEnglish}\n`;
      reply += `  &rarr; *Hardware Action:* ${item.hardwareAction}\n\n`;
    });

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // 7. Safe Experiments Intent
  if (queryLower.includes('experiment') || queryLower.includes('change the values') || queryLower.includes('what happens')) {
    let reply = `### 🧪 Safe Parameter Experiments for ${snapshot.activeLabTitle}\n\n`;
    reply += `Try making these modifications in the Monaco C++ editor to see how the physical hardware reacts:\n\n`;

    diag.safeExperiments.forEach((exp) => {
      reply += `* ${exp}\n`;
    });

    reply += `\n*Tip: You can always click "Reset Simulation" to restore the default code!*`;

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // 8. On-Device WebLLM Engine (if selected by user)
  if (config.provider === 'webllm' && webLlmManager.isSupported()) {
    try {
      const llmReply = await webLlmManager.generate(studentQuery, snapshot, config);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: llmReply,
        timestamp: Date.now(),
        source: 'webllm'
      };
    } catch (err: unknown) {
      console.warn('WebLLM generation failed, falling back to deterministic engine:', err);
      // Fall through to deterministic engine
    }
  }

  // 9. Cloud LLM Callers (Gemini & OpenAI BYOK)
  if (config.provider === 'gemini' && config.apiKey) {
    try {
      const llmReply = await callGemini(studentQuery, snapshot, config);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: llmReply,
        timestamp: Date.now(),
        source: 'gemini'
      };
    } catch (err: unknown) {
      console.warn('Gemini API call failed, falling back to deterministic engine:', err);
    }
  } else if (config.provider === 'openai_compatible' && config.apiKey) {
    try {
      const llmReply = await callOpenAICompatible(studentQuery, snapshot, config);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: llmReply,
        timestamp: Date.now(),
        source: 'openai'
      };
    } catch (err: unknown) {
      console.warn('OpenAI API call failed, falling back to deterministic engine:', err);
    }
  }

  // 10. Default Socratic Guidance Response for Free-form Questions
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: generateDeterministicSocraticResponse(studentQuery, snapshot, diag),
    timestamp: Date.now(),
    source: 'offline_rule',
    issues: diag.issues
  };
}

function generateDeterministicSocraticResponse(
  query: string,
  snapshot: WorkbenchStateSnapshot,
  diag: AiDiagnosticResult
): string {
  const q = query.toLowerCase();

  // Electronics Physics & Engineering Concepts
  if (q.includes('ohm') || q.includes('resistor') || q.includes('resistance')) {
    return `### ⚡ Ohm's Law in SparkByte\n\nOhm's Law states the fundamental relationship between Voltage ($V$), Current ($I$), and Resistance ($R$):\n\n$$V = I \\times R \\quad \\iff \\quad I = \\frac{V}{R} \\quad \\iff \\quad R = \\frac{V}{I}$$\n\n* **Why LEDs need resistors:** An LED has almost 0 resistance once forward-biased (2.0V). Connecting directly to 5V will draw hundreds of milliamps, instantly burning the LED or blowing the ATmega328P pin!\n* **Calculating resistor:** For 20mA current with a 2V drop:\n  $$R = \\frac{5.0\\text{V} - 2.0\\text{V}}{0.02\\text{A}} = \\frac{3.0\\text{V}}{0.02\\text{A}} = 150\\ \\Omega \\quad (\\text{we use 220}\\ \\Omega\\ \\text{for extra safety})$$`;
  }

  if (q.includes('voltage divider') || q.includes('divider')) {
    return `### ⚖️ The Voltage Divider Circuit\n\nMicrocontrollers can only measure voltage, not raw resistance. Sensors like LDR photoresistors, thermistors, and soil probes change resistance with physical conditions. We convert resistance into measurable voltage using a Voltage Divider:\n\n$$V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}$$\n\nAs sensor resistance $R_1$ changes, $V_{\\text{out}}$ shifts between 0V and 5V, which the 10-bit ADC reads cleanly as numbers from 0 to 1023!`;
  }

  if (q.includes('pullup') || q.includes('input_pullup') || q.includes('floating')) {
    return `### 🧲 Floating Pins & INPUT_PULLUP\n\nWhen a microcontroller pin is set to \`INPUT\`, its input impedance is huge (~100 MΩ). If not connected to anything, electromagnetic radiation from Wi-Fi, lights, and human fingers acts like an antenna—making the pin randomly fluctuate between 0 and 1! This is called a **Floating Pin**.\n\n* **The Solution:** \`pinMode(pin, INPUT_PULLUP);\` enables an internal 20 kΩ resistor pulling the pin up to +5V. When the pushbutton is pressed to GND, it reads **LOW (0)**. When released, it stays firmly **HIGH (1)**!`;
  }

  if (q.includes('relay') || q.includes('active-low')) {
    return `### 🔌 Optocoupled Relay Isolation & Active-LOW\n\nMicrocontrollers output a maximum of 5V and 40mA. High-power actuators (12V cooling fans, 220V AC water pumps, solenoids) require an electrically isolated **Optocoupled Relay Module**.\n\n* **Active-LOW Logic:** Most industrial ATL relay modules use Active-LOW logic for safety:\n  * \`digitalWrite(RELAY_PIN, LOW);\` &rarr; Activates the optocoupler LED, energizing the relay coil (**PUMP ON**).\n  * \`digitalWrite(RELAY_PIN, HIGH);\` &rarr; De-energizes the relay coil (**PUMP OFF**).`;
  }

  if (q.includes('i2c') || q.includes('wire') || q.includes('sda') || q.includes('scl')) {
    return `### 🤝 I2C Two-Wire Communication Bus\n\nI2C (Inter-Integrated Circuit) uses just **2 shared wires** to talk to up to 127 different smart sensors and displays simultaneously!\n\n* **SDA (Pin A4):** Serial Data line (transmits bytes back and forth).\n* **SCL (Pin A5):** Serial Clock line (keeps both chips synchronized at 100kHz or 400kHz).\n* **Addresses:** Each device has a unique 7-bit hexadecimal address: \`0x27\` for LCD screens, \`0x3C\` for OLED displays, and \`0x68\` for MPU-6050 6-DoF IMU!`;
  }

  // If there are errors in the code, prioritize pointing them out for generic queries
  if (diag.hasErrors) {
    const firstErr = diag.issues.find((i) => i.severity === 'error');
    return `### 💡 Sparky Code Inspection Notice\n\nI noticed an issue in your **${snapshot.activeLabTitle}** sketch that needs attention first:\n\n* **Issue:** ${firstErr?.title}\n* **Details:** ${firstErr?.message}\n\n${firstErr?.fixSuggestion ? `Review line ${firstErr.lineIndex ? firstErr.lineIndex + 1 : ''}: \`${firstErr.fixSuggestion}\`!` : 'Check the indicated line in Monaco Editor.'}\n\nYou can also click **[ ✨ Apply Fix ]** to patch it instantly!`;
  }

  // Real-time live circuit & code telemetry summary
  let telemetrySnippet = '';
  switch (snapshot.activeLabId) {
    case 'led':
      telemetrySnippet = `* **LED Output:** Digital Pin 13 is currently **${snapshot.hardwareState.ledOn ? 'HIGH (+5V Lit)' : 'LOW (0V Dark)'}** with PWM duty cycle **${snapshot.hardwareState.pwmDuty}/255**.`;
      break;
    case 'servo':
      telemetrySnippet = `* **Servo Actuator:** Current shaft angle is **${snapshot.hardwareState.servoAngle}°** (Target: ${snapshot.hardwareState.servoTargetAngle}°, PWM pulse: ${snapshot.hardwareState.servoPulseWidthMs.toFixed(2)}ms).`;
      break;
    case 'pot':
      telemetrySnippet = `* **Potentiometer:** Analog Pin A0 is reading **${snapshot.hardwareState.potVal}/1023** (~${(snapshot.hardwareState.potVal / 1023 * 5).toFixed(2)}V).`;
      break;
    case 'temp':
      telemetrySnippet = `* **Thermal Telemetry:** LM35/TMP36 sensor is measuring **${snapshot.hardwareState.temperatureC.toFixed(1)}°C**, Cooling Fan PWM: **${snapshot.hardwareState.pwmDuty}/255**.`;
      break;
    case 'sonar':
      telemetrySnippet = `* **Ultrasonic Telemetry:** HC-SR04 obstacle distance is **${snapshot.hardwareState.distanceCm} cm**.`;
      break;
    case 'soil':
      telemetrySnippet = `* **Soil Telemetry:** Moisture sensor reading is **${snapshot.hardwareState.soilMoisturePct}%**, Relay Pump: **${snapshot.hardwareState.ledOn ? 'ENERGIZED (ON)' : 'DE-ENERGIZED (OFF)'}**.`;
      break;
    case 'gas':
      telemetrySnippet = `* **Air Quality Telemetry:** MQ-2 smoke concentration is **${snapshot.hardwareState.gasPpm} PPM**.`;
      break;
    case 'ldr':
      telemetrySnippet = `* **Photometric Telemetry:** Ambient light reading is **${snapshot.hardwareState.ldrRaw} Lux**.`;
      break;
    default:
      telemetrySnippet = `* **Microcontroller Telemetry:** Pin 13: ${snapshot.hardwareState.ledOn ? 'HIGH' : 'LOW'}, Servo: ${snapshot.hardwareState.servoAngle}°, Clock: ${snapshot.isRunning ? 'RUNNING (16 MHz Active)' : 'STOPPED'}.`;
  }

  const lines = snapshot.currentCpp.split('\n').filter((l) => l.trim().length > 0);

  return `### ⚡ Sparky Engineering Coach: ${snapshot.activeLabTitle}

I analyzed your query: *"${query}"* in the context of your active **${snapshot.activeLabTitle}** circuit (Grade Band: ${snapshot.gradeBand}).

#### 1. Live Circuit Telemetry
* **Simulation Status:** Microcontroller clock is **${snapshot.isRunning ? 'RUNNING (Loop #' + snapshot.loopCount + ')' : 'STOPPED (Click Start Simulation ▶)'}**.
${telemetrySnippet}

#### 2. Code Context
Your sketch currently has **${lines.length} lines** compiled against the virtual ATmega328P. 
* To synthesize new Arduino code, ask me to *"generate code"*, *"blink faster"*, or *"control dual LEDs"*.
* To debug, ask me *"why is it not working"*, or ask about any line like *"explain line 8"*.
* To learn in Hindi, type *"Hindi mein samjhao"*.

What experiment or modification would you like to engineer next?`;
}

// ============================================================================
// 5. CLOUD LLM CALLERS (GEMINI & OPENAI-COMPATIBLE)
// ============================================================================

async function callGemini(
  query: string,
  snapshot: WorkbenchStateSnapshot,
  config: AiCoachConfig
): Promise<string> {
  const model = config.geminiModel || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const systemInstruction = buildSystemInstruction(snapshot, config);

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: systemInstruction },
          { text: `Student Question: ${query}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800
    }
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error (${resp.status}): ${errText}`);
  }

  const json = await resp.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response.');
  }

  return text;
}

async function callOpenAICompatible(
  query: string,
  snapshot: WorkbenchStateSnapshot,
  config: AiCoachConfig
): Promise<string> {
  const baseUrl = (config.openaiBaseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const url = `${baseUrl}/chat/completions`;
  const model = config.openaiModel || 'gpt-4o-mini';

  const systemInstruction = buildSystemInstruction(snapshot, config);

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: query }
    ],
    temperature: 0.3,
    max_tokens: 800
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenAI API error (${resp.status}): ${errText}`);
  }

  const json = await resp.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI API returned an empty response.');
  }

  return text;
}

function buildSystemInstruction(snapshot: WorkbenchStateSnapshot, config: AiCoachConfig): string {
  const linesWithNumbers = snapshot.currentCpp
    .split('\n')
    .map((l, i) => `[Line ${i + 1}] ${l}`)
    .join('\n');

  const hw = snapshot.hardwareState;

  return `You are Sparky, an expert embedded systems engineer, electronics teacher, and friendly Socratic coach in SparkByte Studio v2.
You are helping a student in Grade band ${snapshot.gradeBand}.

CONTEXT:
- Lab: ${snapshot.activeLabTitle} (Category: ${snapshot.activeLabCategory})
- Lesson: ${snapshot.activeLessonTitle}
- Objective: ${snapshot.activeLessonSummary}
- Simulation Running: ${snapshot.isRunning ? 'YES' : 'NO (Microcontroller clock paused)'}
- Loop Count: ${snapshot.loopCount}

CURRENT STUDENT C++ CODE IN MONACO EDITOR:
${linesWithNumbers}

LIVE HARDWARE & TELEMETRY SNAPSHOT:
- Digital LED: Pin ${hw.ledPin}, State=${hw.ledOn ? 'HIGH (Lit)' : 'LOW (Dark)'}, PWM=${hw.pwmDuty}/255
- Servo Actuator: Angle=${hw.servoAngle}°, Target=${hw.servoTargetAngle}°, Pulse=${hw.servoPulseWidthMs}ms
- Potentiometer: ${hw.potVal}/1023
- Sensors: Light=${hw.ldrRaw} Lux, Temp=${hw.temperatureC}°C, Gas=${hw.gasPpm} PPM, Soil=${hw.soilMoisturePct}%, Distance=${hw.distanceCm}cm
- LCD Display: Row0="${hw.lcdTextRow0}", Row1="${hw.lcdTextRow1}"
- L298N Motor: Speed=${hw.motorSpeed}/255, Direction=${hw.motorDirection}

PEDAGOGICAL RULES:
1. Always reference specific line numbers in brackets (e.g. "[Line 12]").
2. ${config.socraticMode ? 'Use Socratic questioning: offer clues and hints that lead the student to realize their mistake, rather than immediately dumping the full solution.' : 'Provide direct explanations and code examples when requested.'}
3. Explain the physical why: connect the C++ code to physical electricity, voltage levels, clock cycles, and sensors.
4. Keep responses concise, structured, and easy to read on a school PC workbench screen.
5. If the student speaks Hindi or asks in Hindi, reply in clear, natural Hinglish / Hindi.
6. Be encouraging, warm, and celebrate their engineering curiosity!`;
}
