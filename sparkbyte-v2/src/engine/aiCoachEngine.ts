/**
 * Sparky AI Coach Engine
 *
 * Dual-Engine Architecture:
 * - Tier 1: Deterministic Circuit & AST Diagnostic Inspector (100% Offline, Zero API Key)
 * - Tier 2: Live LLM Integration (Google Gemini 2.5 Flash / OpenAI-Compatible BYOK)
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

export const DEFAULT_AI_CONFIG: AiCoachConfig = {
  provider: 'deterministic',
  apiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openaiBaseUrl: 'https://api.openai.com/v1',
  openaiModel: 'gpt-4o-mini',
  language: 'en',
  socraticMode: true
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

// ============================================================================
// TIER 1: DETERMINISTIC CIRCUIT & AST DIAGNOSTIC INSPECTOR (OFFLINE)
// ============================================================================

export function runDeterministicDiagnostics(snapshot: WorkbenchStateSnapshot): AiDiagnosticResult {
  const issues: AiIssue[] = [];
  const lines = snapshot.currentCpp.split('\n');
  const code = snapshot.currentCpp;
  const lab = snapshot.activeLabId;
  const hw = snapshot.hardwareState;

  // 1. Simulation Runtime State Check
  if (!snapshot.isRunning) {
    issues.push({
      id: 'sim-not-running',
      type: 'simulationState',
      severity: 'warning',
      title: 'Microcontroller is Stopped',
      message: 'The virtual ATmega328P clock is paused. Click the green "Start Simulation" button (▶) to power on the board and run your code.',
      fixSuggestion: 'Click Start Simulation in the workbench toolbar.'
    });
  }

  // 2. Syntax & Entity Check: HTML entities
  if (/&lt;|&gt;|&amp;|<;|<\/>/.test(code)) {
    issues.push({
      id: 'html-entity-glitch',
      type: 'syntax',
      severity: 'error',
      title: 'Corrupted HTML Entity Detected',
      message: 'Found escaped HTML entities (like <;, &lt;, or </>) inside your sketch. This happens when copying code from certain web tutorials.',
      fixSuggestion: 'Replace "<;" with "<" and remove any stray XML entities.'
    });
  }

  // 3. Syntax Check: Unbalanced braces
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
      message: `Your code has ${openBraces} opening brace(s) '{' but ${closeBraces} closing brace(s) '}'. Every function and loop must have a matching closing brace.`,
      fixSuggestion: openBraces > closeBraces ? 'Add missing "}" at the end of your block.' : 'Remove the extra "}".'
    });
  }

  // 4. Syntax Check: Missing semicolons on key Arduino statements
  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    if (trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(':')) return;
    if (/^(void|int|float|bool|if|else|for|while)/.test(trimmed)) return;

    if (
      /^(pinMode|digitalWrite|analogWrite|delay|Serial\.print|lcd\.|servo\.|tone|noTone)/.test(trimmed) &&
      !trimmed.endsWith(';')
    ) {
      issues.push({
        id: `missing-semi-${idx}`,
        type: 'syntax',
        severity: 'error',
        title: `Missing Semicolon [Line ${idx + 1}]`,
        message: `Line ${idx + 1}: "${trimmed}" is missing a terminating semicolon ';'. In C++, every statement must end with ';'.`,
        lineIndex: idx,
        fixSuggestion: `${trimmed};`
      });
    }
  });

  // 5. Structure Check: pinMode placed inside loop()
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
        message: 'pinMode() should be declared once inside void setup(). Calling it continuously inside void loop() wastes microcontroller clock cycles.',
        lineIndex: idx
      });
    }
  });

  // 6. Lab-Specific Pin & Breadboard Wiring Checks
  const outputPinsDeclared: number[] = [];
  const inputPinsDeclared: number[] = [];
  const pinModeMatches = code.matchAll(/pinMode\s*\(\s*(\d+)\s*,\s*(OUTPUT|INPUT|INPUT_PULLUP)\s*\)/g);
  for (const m of pinModeMatches) {
    const p = parseInt(m[1], 10);
    if (m[2] === 'OUTPUT') outputPinsDeclared.push(p);
    else inputPinsDeclared.push(p);
  }

  // Pin check for LED lab
  if (lab === 'led') {
    const writesToWrongPin = code.match(/digitalWrite\s*\(\s*(\d+)\s*,/g);
    if (writesToWrongPin) {
      for (const m of writesToWrongPin) {
        const pinNum = parseInt(m.replace(/digitalWrite\s*\(\s*/, '').replace(',', ''), 10);
        if (pinNum !== 13) {
          issues.push({
            id: 'led-pin-mismatch',
            type: 'pinMismatch',
            severity: 'error',
            title: `Wrong Pin for LED (Pin ${pinNum})`,
            message: `Your code commands Pin ${pinNum}, but the Arduino on-board LED and workbench breadboard are wired to Pin 13. Change your pin number to 13.`,
            fixSuggestion: 'Use Pin 13: pinMode(13, OUTPUT); digitalWrite(13, HIGH);'
          });
          break;
        }
      }
    }
  }

  // Pin check for Button lab
  if (lab === 'button') {
    if (!inputPinsDeclared.includes(2) && !code.includes('digitalRead(2)')) {
      issues.push({
        id: 'button-pin-mismatch',
        type: 'pinMismatch',
        severity: 'warning',
        title: 'Tactile Button Pin Notice',
        message: 'In this lab, the tactile pushbutton is wired to Pin 2 with internal pullup enabled. Make sure you read Pin 2 with digitalRead(2).',
        fixSuggestion: 'pinMode(2, INPUT_PULLUP); int val = digitalRead(2);'
      });
    }
  }

  // Pin check for Servo lab
  if (lab === 'servo') {
    const attachMatch = code.match(/attach\s*\(\s*(\d+)\s*\)/);
    if (attachMatch && parseInt(attachMatch[1], 10) !== 9) {
      issues.push({
        id: 'servo-pin-mismatch',
        type: 'pinMismatch',
        severity: 'warning',
        title: `Servo Attached to Pin ${attachMatch[1]}`,
        message: `Your servo is attached to Pin ${attachMatch[1]}, but the workbench PWM signal line is wired to Pin 9 (Timer1 PWM).`,
        fixSuggestion: 'myServo.attach(9);'
      });
    }
  }

  // Pin check for Potentiometer lab
  if (lab === 'pot') {
    if (!code.includes('A0') && !code.includes('analogRead(0)')) {
      issues.push({
        id: 'pot-pin-mismatch',
        type: 'pinMismatch',
        severity: 'tip',
        title: 'Potentiometer ADC Channel',
        message: 'The rotary potentiometer wiper is wired to Analog Input Pin A0.',
        fixSuggestion: 'int val = analogRead(A0);'
      });
    }
  }

  // 7. Live Sensor Threshold Mismatches
  // Lab 8: LDR Photoresistor
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
          title: `Light Threshold Not Met (${currentLux} Lux >= ${thresh})`,
          message: `Your C++ condition checks if light < ${thresh}, but your Ambient Light slider is currently set to ${currentLux} Lux (bright room). The nightlight LED will stay OFF until the light drops below ${thresh} Lux.`,
          fixSuggestion: `Drag the Light slider below ${thresh} Lux, or change code threshold to ${currentLux + 100}.`,
          sliderAdjustment: { ldrRaw: Math.max(0, thresh - 100) }
        });
      } else if (op === '>' && currentLux <= thresh) {
        issues.push({
          id: 'ldr-thresh-high',
          type: 'threshold',
          severity: 'tip',
          title: `Light Threshold Not Met (${currentLux} Lux <= ${thresh})`,
          message: `Your condition checks if light > ${thresh}, but current light is ${currentLux} Lux.`,
          fixSuggestion: `Drag the Light slider above ${thresh} Lux.`,
          sliderAdjustment: { ldrRaw: thresh + 100 }
        });
      }
    }
  }

  // Lab 10: TMP36 Temperature
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
          title: `Temperature Alert Inactive (${currentTemp}°C <= ${thresh}°C)`,
          message: `Your cooling fan triggers when temperature > ${thresh}°C, but the sensor slider is currently at ${currentTemp}°C.`,
          fixSuggestion: `Drag the Temperature slider above ${thresh}°C to watch the cooling fan spin!`,
          sliderAdjustment: { temperatureC: thresh + 5 }
        });
      }
    }
  }

  // Lab 15: MQ-2 Gas Sensor
  if (lab === 'gas') {
    const threshMatch = code.match(/if\s*\([^<>]*(>|<)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentGas = hw.gasPpm;

      if (op === '>' && currentGas <= thresh) {
        issues.push({
          id: 'gas-thresh-not-met',
          type: 'threshold',
          severity: 'tip',
          title: `Gas Alarm Inactive (${currentGas} PPM <= ${thresh} PPM)`,
          message: `Your hazardous gas alarm activates when gas > ${thresh} PPM, but current concentration is ${currentGas} PPM.`,
          fixSuggestion: `Drag the Gas Concentration slider up past ${thresh} PPM to test the buzzer alarm!`,
          sliderAdjustment: { gasPpm: thresh + 100 }
        });
      }
    }
  }

  // Lab 18: Soil Moisture Sensor
  if (lab === 'soil') {
    const threshMatch = code.match(/if\s*\([^<>]*(<|>)\s*(\d+)\s*\)/);
    if (threshMatch) {
      const op = threshMatch[1];
      const thresh = parseInt(threshMatch[2], 10);
      const currentSoil = hw.soilMoisturePct;

      if (op === '<' && currentSoil >= thresh) {
        issues.push({
          id: 'soil-thresh-not-met',
          type: 'threshold',
          severity: 'tip',
          title: `Irrigation Pump Inactive (${currentSoil}% >= ${thresh}%)`,
          message: `Your automated water pump relay activates when soil moisture drops below ${thresh}%, but current soil is moist at ${currentSoil}%.`,
          fixSuggestion: `Slide Soil Moisture down below ${thresh}% to simulate dry drought conditions.`,
          sliderAdjustment: { soilMoisturePct: Math.max(5, thresh - 10) }
        });
      }
    }
  }

  // 8. Line-by-Line Breakdown
  const lineExplanations: LineExplanation[] = lines.map((l, i) => {
    const trimmed = l.trim();
    return {
      lineNumber: i + 1,
      cpp: trimmed,
      plainEnglish: generatePlainEnglishForLine(trimmed, snapshot.gradeBand),
      hardwareAction: generateHardwareActionForLine(trimmed, lab)
    };
  }).filter((x) => x.cpp.length > 0 && !x.cpp.startsWith('//'));

  // 9. Safe Experiment Ideas
  const safeExperiments = generateSafeExperiments(lab, snapshot.gradeBand);

  // 10. Summary
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const tipCount = issues.filter((i) => i.severity === 'tip').length;

  let summary = 'Circuit and C++ code are logically synchronized with hardware.';
  if (errorCount > 0) {
    summary = `Found ${errorCount} syntax/circuit error(s) preventing proper execution.`;
  } else if (warningCount > 0) {
    summary = `Code is running with ${warningCount} advisory notice(s).`;
  } else if (tipCount > 0) {
    summary = `Code syntax is clean! ${tipCount} interactive sensor slider tip(s) available.`;
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
      ? 'Boot Room: Runs ONCE when the Arduino turns on.'
      : 'Initial configuration routine executed once at power-on reset.';
  }
  if (line.includes('void loop()')) {
    return grade === '6-8'
      ? 'Infinite Track: Repeats continuously forever.'
      : 'Continuous execution loop running indefinitely at 16 MHz.';
  }
  if (/pinMode\s*\(\s*(\w+)\s*,\s*OUTPUT\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Configures Pin ${pin} as an OUTPUT (Megaphone mode: sends 5V electricity OUT).`;
  }
  if (/pinMode\s*\(\s*(\w+)\s*,\s*INPUT_PULLUP\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '2';
    return `Configures Pin ${pin} with internal 20kΩ pullup resistor (defaults to HIGH until pressed).`;
  }
  if (/digitalWrite\s*\(\s*(\w+)\s*,\s*HIGH\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Switches Pin ${pin} to HIGH (+5.0 Volts) &rarr; powers connected device ON.`;
  }
  if (/digitalWrite\s*\(\s*(\w+)\s*,\s*LOW\s*\)/i.test(line)) {
    const pin = line.match(/\d+/)?.[0] || '13';
    return `Switches Pin ${pin} to LOW (0.0 Volts / Ground) &rarr; turns connected device OFF.`;
  }
  if (/analogWrite\s*\(\s*(\w+)\s*,\s*([^)]+)\s*\)/i.test(line)) {
    return `Sets hardware PWM pulse duty cycle (0–255) for smooth speed or brightness control.`;
  }
  if (/analogRead\s*\(\s*(\w+)\s*\)/i.test(line)) {
    return `Measures incoming analog voltage (0–5V) and converts it to a 10-bit digital number (0–1023).`;
  }
  if (/delay\s*\(\s*(\d+)\s*\)/i.test(line)) {
    const ms = line.match(/\d+/)?.[0] || '1000';
    return `Pauses the microcontroller for ${ms} milliseconds (${(parseInt(ms, 10) / 1000).toFixed(2)} seconds).`;
  }
  if (/myServo\.write\s*\(\s*([^)]+)\s*\)/i.test(line)) {
    return `Sends a precise 50 Hz PWM pulse (1.0ms–2.0ms) commanding servo shaft angle.`;
  }
  if (/Serial\.print/i.test(line)) {
    return `Transmits ASCII text over UART serial bus (TX pin) to the computer monitor.`;
  }
  if (/lcd\.print/i.test(line)) {
    return `Sends character data over 2-wire I2C bus (SDA/SCL) to the 16x2 HD44780 LCD screen.`;
  }
  return line;
}

function generateHardwareActionForLine(line: string, lab: string): string {
  if (line.includes('digitalWrite') && line.includes('HIGH')) {
    if (lab === 'led') return 'LED anode receives +5V; current flows through 220Ω resistor; LED glows.';
    if (lab === 'buzzer') return 'Piezo ceramic disc deflects under 5V potential; generates click/sound.';
    return 'Pin outputs +5V logic level.';
  }
  if (line.includes('digitalWrite') && line.includes('LOW')) {
    return 'Pin tied to GND (0V); current stops flowing; device de-energizes.';
  }
  if (line.includes('analogWrite')) {
    return 'Timer output compare register toggles pin at 490Hz/980Hz PWM.';
  }
  if (line.includes('analogRead')) {
    return 'Successive approximation ADC samples voltage; takes 13 ADC clock cycles (~104µs).';
  }
  if (line.includes('delay')) {
    return 'CPU busy-waits or decrements clock cycle count.';
  }
  return 'Executes in 1-2 CPU clock cycles at 16 MHz.';
}

function generateSafeExperiments(lab: string, _grade: string): string[] {
  switch (lab) {
    case 'led':
      return [
        '⚡ Change delay(1000) to delay(100) to turn your blinker into a fast emergency strobe.',
        '💓 Change the HIGH delay to 200ms and LOW delay to 800ms to mimic an authentic human heartbeat rhythm.',
        '💡 Try changing analogWrite(13, 64) to see the LED glow at 25% soft nightlight brightness.'
      ];
    case 'servo':
      return [
        '🔄 Change the loop sweep from pos += 1 to pos += 15 to watch the servo step rapidly.',
        '🎯 Set a fixed angle like myServo.write(45); delay(1000); myServo.write(135); for a robot wave.',
        '📐 Experiment with sweeping backwards: for (pos = 180; pos >= 0; pos -= 5).'
      ];
    case 'pot':
      return [
        '🎛️ Invert the knob: change map(val, 0, 1023, 0, 180) to map(val, 0, 1023, 180, 0).',
        '📊 Add Serial.print("Raw: "); Serial.println(val); to inspect exact 10-bit integers in the Serial Monitor.',
        '💡 Map the potentiometer to an LED on Pin 9: int duty = map(val, 0, 1023, 0, 255); analogWrite(9, duty);'
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
        '🔍 Open the Serial Monitor tab to watch live sensor values printed by the microcontroller.',
        '📊 Switch to the Oscilloscope tab to inspect the real-time voltage and PWM waveforms.'
      ];
  }
}

// ============================================================================
// HINDI (हिंदी) EXPLANATION GENERATOR (OFFLINE)
// ============================================================================

export function generateHindiExplanation(snapshot: WorkbenchStateSnapshot): string {
  const lab = snapshot.activeLabTitle;
  const hw = snapshot.hardwareState;

  return `### 🇮🇳 Sparky AI Coach (हिंदी गाइड)

**नमस्ते भावी इंजीनियर!** 👋 स्वागत है **${lab}** में। 

#### 1. यह कोड कैसे काम करता है?
* **\`void setup()\`**: यह कमरे का "स्विच ऑन" हिस्सा है। जब Arduino में पावर आती है, तो यह केवल **एक बार** चलता है। यहाँ हम \`pinMode()\` से तय करते हैं कि कौन सा पिन इनपुट (सेंसर) है और कौन सा आउटपुट (LED/मोटर)।
* **\`void loop()\`**: यह कभी न रुकने वाला चक्र है! जब तक बिजली चालू है, Arduino इन लाइनों को बार-बार लगातार दोहराता रहता है।

#### 2. आपके सर्किट की लाइव स्थिति:
* **माइक्रोप्रोसेसर स्थिति**: ${snapshot.isRunning ? 'चालू है (Running ▶)' : 'रुका हुआ है (Paused ⏸)'}
* **सेंसर व पिन वैल्यू**: 
  - LED स्थिति: ${hw.ledOn ? '💡 जल रही है (ON - 5V)' : '🌑 बंद है (OFF - 0V)'}
  - सर्वो मोटर कोण: ${hw.servoAngle}°
  - पॉट/सेंसर वैल्यू: ${hw.potVal} (0 से 1023 के बीच)

#### 3. Sparky का छोटा सा टिप:
अगर आप चाहते हैं कि सर्किट तेज़ी से काम करे, तो \`delay(1000)\` की जगह \`delay(200)\` लिखकर देखें! कोई भी सवाल हो तो नीचे चैट में पूछें! 🚀`;
}

// ============================================================================
// TIER 2: LIVE LLM INTEGRATION (GEMINI 2.5 FLASH / OPENAI-COMPATIBLE)
// ============================================================================

export async function askAiCoach(
  studentQuery: string,
  snapshot: WorkbenchStateSnapshot,
  config: AiCoachConfig
): Promise<AiCoachMessage> {
  const queryLower = studentQuery.toLowerCase().trim();

  // Fast Path 1: "Explain in Hindi" or query containing hindi
  if (queryLower.includes('hindi') || queryLower.includes('हिंदी') || config.language === 'hi') {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: generateHindiExplanation(snapshot),
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // Fast Path 2: One-click diagnostic queries handled deterministically if no API key
  const diag = runDeterministicDiagnostics(snapshot);

  if (queryLower.includes("why isn't my circuit working") || queryLower.includes('why not working') || queryLower.includes('debug')) {
    let reply = `### 🔍 Live Circuit & Code Diagnostic Report\n\n**${diag.summary}**\n\n`;

    if (diag.issues.length === 0) {
      reply += `✅ **All Systems Normal!** Your C++ code compiled cleanly with 0 syntax errors, and all pin assignments match the physical hardware.\n\n`;
      reply += `* Microcontroller Clock: **${snapshot.isRunning ? 'RUNNING (Active)' : 'STOPPED (Click Start Simulation)'}**\n`;
      reply += `* Loop Cycles Completed: **${snapshot.loopCount}**\n`;
      reply += `* Current Output: LED=${snapshot.hardwareState.ledOn ? 'ON' : 'OFF'}, Servo=${snapshot.hardwareState.servoAngle}°\n\n`;
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

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule',
      issues: diag.issues
    };
  }

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

  if (queryLower.includes('experiment') || queryLower.includes('change the values') || queryLower.includes('what happens')) {
    let reply = `### 🧪 Safe Parameter Experiments for ${snapshot.activeLabTitle}\n\n`;
    reply += `Try making these modifications in the Monaco C++ editor to see how the physical hardware reacts:\n\n`;

    diag.safeExperiments.forEach((exp) => {
      reply += `* ${exp}\n`;
    });

    reply += `\n*Tip: You can always click "Reset Simulation" if you want to restore the default code!*`;

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      source: 'offline_rule'
    };
  }

  // If Cloud LLM is configured with an API key, use it!
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
      // Fall through to deterministic fallback with error notice
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
      // Fall through
    }
  }

  // Tier 1 Default Socratic Response for freeform queries
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

  // If there are errors in the code, prioritize pointing them out
  if (diag.hasErrors) {
    const firstErr = diag.issues.find((i) => i.severity === 'error');
    return `### 💡 Sparky Hint\n\nI noticed an issue that needs your attention first:\n\n**${firstErr?.title}**\n${firstErr?.message}\n\n${firstErr?.fixSuggestion ? `Take a look at your code and see if you can add \`${firstErr.fixSuggestion}\`!` : 'Check the indicated line to fix the syntax before continuing.'}`;
  }

  if (q.includes('pinmode') || q.includes('pin mode') || q.includes('output') || q.includes('input')) {
    return `###  Megaphone vs. Ear: Understanding pinMode()\n\nIn Arduino, pins are bidirectional GPIOs (General Purpose Input/Output). By default, pins are like **Ears (INPUT)** listening for voltage. When you write:\n\`\`\`cpp\npinMode(13, OUTPUT);\n\`\`\`\nyou are telling Pin 13 to act like a **Megaphone (OUTPUT)** that can pump +5V current outwards to light an LED or turn on a transistor!\n\n*Question for you:* If you wired a pushbutton switch, would you set that pin to \`INPUT\` or \`OUTPUT\`?`;
  }

  if (q.includes('delay') || q.includes('millisecond') || q.includes('time')) {
    return `### ⏱️ How delay() Works\n\n\`delay(1000)\` tells the 16 MHz microcontroller to stop advancing code for exactly **1,000 milliseconds** (1 full second). During this time, the output pins hold whatever voltage state you previously set.\n\n*Try this:* What happens if you change \`delay(1000)\` to \`delay(50)\`? Give it a try in the Monaco editor and watch the Oscilloscope!`;
  }

  if (q.includes('analog') || q.includes('pwm') || q.includes('analogwrite') || q.includes('analogread')) {
    return `### 🌊 Digital vs. Analog in SparkByte\n\n* **\`digitalWrite(pin, HIGH/LOW)\`**: Only two states &mdash; 0V or 5V (like an on/off light switch).\n* **\`analogRead(A0)\`**: Measures input voltage (0–5V) using a 10-bit ADC, returning a number from **0 to 1023**.\n* **\`analogWrite(pin, 0–255)\`**: Uses High-Speed Pulse Width Modulation (PWM) at 490Hz to fake analog output by rapidly pulsing between 0V and 5V.\n\nNotice that \`analogRead\` has 1024 steps, but \`analogWrite\` has 256 steps! That's why we use \`map(val, 0, 1023, 0, 255)\` to translate between them!`;
  }

  // Fallback helpful coach message
  return `### 🤖 Sparky AI Coach\n\nYou are working on **${snapshot.activeLabTitle}** (Grade Band: ${snapshot.gradeBand}).\n\n* **Current Objective:** ${snapshot.activeLessonTitle}\n* **Simulation Status:** Microcontroller is ${snapshot.isRunning ? 'running' : 'stopped'}, Loop Cycle #${snapshot.loopCount}.\n\nTry clicking one of the one-click diagnostic chips above (like **"Why isn't my circuit working?"** or **"Explain this code line-by-line"**), or configure your Gemini API Key in Settings (⚙️) for conversational AI tutoring!`;
}

// ============================================================================
// CLOUD LLM CALLERS (GEMINI & OPENAI-COMPATIBLE)
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
