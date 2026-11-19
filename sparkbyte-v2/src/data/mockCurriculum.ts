/**
 * Industrial-Grade Curriculum & Hardware Specifications Data
 * 22 Labs // 88 Lessons (4 per lab)
 * Complete with BOM (Bill of Materials), Pinout Schematics, and Step-by-Step Instructions
 *
 * Anti-"AI Slop" Industrial EDA Architecture
 */

export interface ComponentPart {
  partNumber: string;
  designator: string;
  description: string;
  package: string;
  operatingVoltage: string;
  supplierPn?: string;
}

export interface PinMapping {
  pin: string;
  name: string;
  direction: 'INPUT' | 'OUTPUT' | 'PWM' | 'ANALOG' | 'POWER' | 'BUS';
  signal: string;
  hardwareDestination: string;
}

export interface LessonSpec {
  id: string;
  lessonIndex: number; // 1..4
  globalIndex: number; // 1..88
  title: string;
  codeTitle: string;
  difficulty: 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 3';
  completed: boolean;
  learningObjective: string;
  theorySummary: string;
  steps: string[];
  defaultFiles: {
    'sketch.ino': string;
    'diagram.json': string;
    'pins.h': string;
  };
}

export interface LabSpec {
  id: string;
  number: number;
  code: string; // e.g. "LAB 04"
  title: string;
  category: 'ACTUATORS' | 'DISCRETE GPIO' | 'TRANSDUCERS' | 'PROTOCOLS' | 'ROBOTICS' | 'CAD/CAM';
  subtitle: string;
  summary: string;
  bom: ComponentPart[];
  pinout: PinMapping[];
  lessons: LessonSpec[];
}

export const LAB_CATEGORIES = [
  'ALL CATEGORIES',
  'ACTUATORS',
  'DISCRETE GPIO',
  'TRANSDUCERS',
  'PROTOCOLS',
  'ROBOTICS',
  'CAD/CAM'
] as const;

// 22 Lab Specifications
export const CURRICULUM_DATA: LabSpec[] = [
  {
    id: 'lab-01',
    number: 1,
    code: 'LAB 01',
    title: 'DIGITAL GPIO & CURRENT-LIMITING RESISTOR',
    category: 'DISCRETE GPIO',
    subtitle: 'Ohm’s Law & Forward Voltage Drop in Embedded Systems',
    summary: 'Master digital output states, current sinking vs sourcing on ATmega328P Port B, and calculate exact resistor values.',
    bom: [
      { partNumber: 'DEV-UNO-R3', designator: 'U1', description: 'ATmega328P Microcontroller Board 16MHz', package: 'DIP-28', operatingVoltage: '5.0V DC' },
      { partNumber: 'LED-5MM-RED', designator: 'D1', description: 'Gallium Arsenide 5mm Indicator LED (Vf=2.1V, If=20mA)', package: 'Radial Through-Hole', operatingVoltage: '2.1V DC' },
      { partNumber: 'RES-220R-0.25W', designator: 'R1', description: 'Metal Film Resistor 220Ω ±1% 0.25W', package: 'Axial-0.25W', operatingVoltage: '5.0V Max' }
    ],
    pinout: [
      { pin: 'D13', name: 'PB5 (SCK/LED)', direction: 'OUTPUT', signal: 'DIGITAL_OUT', hardwareDestination: 'D1 Anode via R1' },
      { pin: 'GND', name: 'GND', direction: 'POWER', signal: '0.0V', hardwareDestination: 'D1 Cathode' }
    ],
    lessons: [
      {
        id: 'lab-01-les-1',
        lessonIndex: 1,
        globalIndex: 1,
        title: 'GPIO Register Output & Polarity',
        codeTitle: 'LED_PULSE_DIRECT.INO',
        difficulty: 'LEVEL 1',
        completed: true,
        learningObjective: 'Configure DDRB register via pinMode() and drive digital high (+5V).',
        theorySummary: 'ATmega328P pins source up to 40mA absolute maximum (20mA continuous recommended). Direct connection without series resistance burns the I/O substrate.',
        steps: [
          'Verify R1 220Ω resistor is placed between Arduino D13 and LED anode.',
          'Assert Pin 13 HIGH using digitalWrite(13, HIGH).',
          'Measure forward voltage across D1 using simulated DMM.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 01 // LESSON 01: GPIO REGISTER CONFIGURATION
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,
          'diagram.json': `{\n  "version": 1,\n  "parts": [\n    { "type": "wokwi-arduino-uno", "id": "uno" },\n    { "type": "wokwi-led", "id": "led1", "attrs": { "color": "red" } },\n    { "type": "wokwi-resistor", "id": "r1", "attrs": { "value": "220" } }\n  ]\n}`,
          'pins.h': `// Pin Definitions for Lab 01\n#pragma once\n#define PIN_LED 13\n#define RESISTOR_OHMS 220\n#define LED_VF_VOLTS 2.1\n`
        }
      },
      {
        id: 'lab-01-les-2',
        lessonIndex: 2,
        globalIndex: 2,
        title: 'Duty Cycle & PWM Frequency',
        codeTitle: 'PWM_DUTY_CYCLE.INO',
        difficulty: 'LEVEL 1',
        completed: true,
        learningObjective: 'Synthesize average voltage through 490Hz Timer2 PWM wave.',
        theorySummary: 'The ATmega328P utilizes Timer/Counter2 for 490Hz Phase-Correct PWM on pins 3, 9, 10, 11.',
        steps: [
          'Switch target pin to Timer PWM pin D9.',
          'Execute analogWrite(9, 128) to produce 50.2% duty cycle.',
          'Verify RMS voltage on Pin State Inspector is 2.51V.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 01 // LESSON 02: TIMER PWM MODULATION\n#define PWM_PIN 9\n\nvoid setup() {\n  pinMode(PWM_PIN, OUTPUT);\n}\n\nvoid loop() {\n  for (int d = 0; d <= 255; d += 5) {\n    analogWrite(PWM_PIN, d);\n    delay(15);\n  }\n}`,
          'diagram.json': `{\n  "parts": [{ "type": "wokwi-arduino-uno", "id": "uno" }]\n}`,
          'pins.h': `#define PWM_PIN 9\n`
        }
      },
      {
        id: 'lab-01-les-3',
        lessonIndex: 3,
        globalIndex: 3,
        title: 'Non-Blocking Millis Timing Engine',
        codeTitle: 'ASYNC_TICKER.INO',
        difficulty: 'LEVEL 2',
        completed: false,
        learningObjective: 'Eliminate blocking delay() calls using Timer0 millisecond tick counter.',
        theorySummary: 'delay() halts the CPU instruction pipeline. Using millis() allows asynchronous state machines to execute alongside serial polling.',
        steps: [
          'Store previous timestamp using uint32_t lastTick = millis().',
          'Calculate delta time each loop: if (currentMillis - lastTick >= interval).',
          'Observe concurrent telemetry streaming without loop pauses.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 01 // LESSON 03: ASYNCHRONOUS ENGINE\nconst uint8_t LED_PIN = 13;\nunsigned long prevTime = 0;\nconst unsigned long INTERVAL = 250;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  unsigned long now = millis();\n  if (now - prevTime >= INTERVAL) {\n    prevTime = now;\n    digitalWrite(LED_PIN, !digitalRead(LED_PIN));\n  }\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define LED_PIN 13\n`
        }
      },
      {
        id: 'lab-01-les-4',
        lessonIndex: 4,
        globalIndex: 4,
        title: 'Direct Port Manipulation (PORTB)',
        codeTitle: 'BARE_METAL_PORTB.INO',
        difficulty: 'LEVEL 3',
        completed: false,
        learningObjective: 'Bypass Arduino abstraction layer and write directly to ATmega328P PORTB register.',
        theorySummary: 'digitalWrite() requires ~56 clock cycles (~3.5µs). Direct bitwise register access PORTB |= (1 << PB5) takes exactly 1 clock cycle (62.5ns).',
        steps: [
          'Configure Data Direction Register B: DDRB |= (1 << DDB5).',
          'Toggle PINB register directly: PINB = (1 << PINB5).',
          'Measure the ~50x speed increase in loop throughput.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 01 // LESSON 04: BARE-METAL REGISTER OPTIMIZATION\nvoid setup() {\n  DDRB |= (1 << DDB5); // Fast Pin 13 as OUTPUT\n}\n\nvoid loop() {\n  PORTB |= (1 << PORTB5);  // High (62.5ns)\n  delayMicroseconds(100);\n  PORTB &= ~(1 << PORTB5); // Low (62.5ns)\n  delayMicroseconds(100);\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define FAST_PIN PB5\n`
        }
      }
    ]
  },
  {
    id: 'lab-02',
    number: 2,
    code: 'LAB 02',
    title: 'SG90 MICRO SERVO PWM KINEMATICS',
    category: 'ACTUATORS',
    subtitle: '50Hz Pulse-Width Position Modulation & Angular Displacement',
    summary: 'Drive an SG90 nylon-gear servomotor using 50Hz PWM carrier frames with 1.0ms–2.0ms high pulses for closed-loop mechanical positioning.',
    bom: [
      { partNumber: 'TWR-SG90', designator: 'M1', description: 'TowerPro SG90 9g Micro Servo 180° Range', package: 'Sub-Micro Mechanical', operatingVoltage: '4.8V - 6.0V DC' },
      { partNumber: 'DEV-UNO-R3', designator: 'U1', description: 'ATmega328P Microcontroller Board 16MHz', package: 'DIP-28', operatingVoltage: '5.0V DC' },
      { partNumber: 'CAP-100UF-16V', designator: 'C1', description: 'Electrolytic Decoupling Capacitor 100µF 16V', package: 'Radial 6.3x11mm', operatingVoltage: '16V Max' }
    ],
    pinout: [
      { pin: 'D9', name: 'PB1 (OC1A)', direction: 'PWM', signal: '50Hz PWM (1.0ms-2.0ms)', hardwareDestination: 'SG90 Orange Control Lead' },
      { pin: '5V', name: '5V BUS', direction: 'POWER', signal: '+5.0V DC', hardwareDestination: 'SG90 Red Power Lead' },
      { pin: 'GND', name: 'GND', direction: 'POWER', signal: '0.0V Ground', hardwareDestination: 'SG90 Brown Ground Lead' }
    ],
    lessons: [
      {
        id: 'lab-02-les-1',
        lessonIndex: 1,
        globalIndex: 5,
        title: '50Hz PWM Carrier & Neutral Calibration',
        codeTitle: 'SERVO_NEUTRAL_90DEG.INO',
        difficulty: 'LEVEL 1',
        completed: true,
        learningObjective: 'Establish 20.0ms period with 1.50ms pulse to lock servo horn at exact 90° center.',
        theorySummary: 'Servos interpret pulse duration rather than duty cycle percentage. 1.0ms = 0°, 1.5ms = 90°, 2.0ms = 180° regardless of carrier period variance.',
        steps: [
          'Attach Servo object to Timer1 PWM pin 9 via servo.attach(9).',
          'Command servo.write(90) to deliver 1500µs frame.',
          'Inspect CAD Viewport spline alignment and telemetry readout.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 02 // LESSON 01: 50Hz PWM CALIBRATION (90° NEUTRAL)
#include <Servo.h>

Servo microServo;

void setup() {
  Serial.begin(115200);
  microServo.attach(9);
  microServo.write(90); // 1500us neutral pulse
  Serial.println(F("[AVR] SG90 Attached to Pin 9. Neutral Set: 90 deg"));
}

void loop() {
  // Servo holds position under internal feedback loop
  delay(100);
}`,
          'diagram.json': `{\n  "parts": [\n    { "type": "wokwi-arduino-uno", "id": "uno" },\n    { "type": "wokwi-servo", "id": "servo1", "attrs": { "hornColor": "white" } }\n  ],\n  "connections": [\n    [ "uno:9", "servo1:PWM", "orange", [ "v0" ] ],\n    [ "uno:5V", "servo1:V+", "red", [ "v0" ] ],\n    [ "uno:GND.1", "servo1:GND", "black", [ "v0" ] ]\n  ]\n}`,
          'pins.h': `#pragma once\n#define SERVO_PIN 9\n#define MIN_PULSE_WIDTH 544\n#define MAX_PULSE_WIDTH 2400\n`
        }
      },
      {
        id: 'lab-02-les-2',
        lessonIndex: 2,
        globalIndex: 6,
        title: 'Trapezoidal Angular Velocity Sweep',
        codeTitle: 'SERVO_SMOOTH_SWEEP.INO',
        difficulty: 'LEVEL 1',
        completed: true,
        learningObjective: 'Eliminate stall current spikes by rate-limiting angular step deltas.',
        theorySummary: 'Instantaneous 180° step commands cause back-EMF voltage dips that can brown out the ATmega328P 5V regulator.',
        steps: [
          'Loop from 0° to 180° in 1-degree increments with 15ms dwell.',
          'Track live current telemetry during motion (~140mA) vs stall (>350mA).',
          'Reverse sweep direction cleanly.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 02 // LESSON 02: CONTROLLED VELOCITY SWEEP\n#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n}\n\nvoid loop() {\n  for (int pos = 0; pos <= 180; pos += 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n  for (int pos = 180; pos >= 0; pos -= 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define SERVO_PIN 9\n`
        }
      },
      {
        id: 'lab-02-les-3',
        lessonIndex: 3,
        globalIndex: 7,
        title: 'Microsecond Precision Control (writeMicroseconds)',
        codeTitle: 'SERVO_US_PRECISION.INO',
        difficulty: 'LEVEL 2',
        completed: false,
        learningObjective: 'Bypass degree rounding to access 0.1° positioning resolution.',
        theorySummary: 'write(angle) divides 180 degrees into integer steps. writeMicroseconds() allows fine calibration across 1000µs to 2000µs with sub-degree accuracy.',
        steps: [
          'Call writeMicroseconds(1000) for 0° hardstop.',
          'Step in 10µs micro-increments and observe CAD viewport sub-degree rotation.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 02 // LESSON 03: MICROSECOND PRECISION\n#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  Serial.begin(115200);\n  myServo.attach(9);\n}\n\nvoid loop() {\n  // Sweep 1000us to 2000us\n  for (int us = 1000; us <= 2000; us += 20) {\n    myServo.writeMicroseconds(us);\n    Serial.print(F("PWM Pulse: "));\n    Serial.print(us);\n    Serial.println(F(" us"));\n    delay(40);\n  }\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define SERVO_PIN 9\n`
        }
      },
      {
        id: 'lab-02-les-4',
        lessonIndex: 4,
        globalIndex: 8,
        title: 'Potentiometer Closed-Loop Tele-Operation',
        codeTitle: 'SERVO_ANALOG_FOLLOW.INO',
        difficulty: 'LEVEL 2',
        completed: false,
        learningObjective: 'Map 10-bit analog ADC voltage (0–1023) to 0°–180° kinematic angle.',
        theorySummary: 'Using map(adc, 0, 1023, 0, 180) linearly translates 0.0V–5.0V input into real-time servo output.',
        steps: [
          'Read analog input pin A0 using analogRead(A0).',
          'Perform integer mapping: int angle = map(val, 0, 1023, 0, 180).',
          'Verify synchronized CAD horn rotation as ADC slider moves.'
        ],
        defaultFiles: {
          'sketch.ino': `// LAB 02 // LESSON 04: CLOSED-LOOP POTENTIOMETER FOLLOW\n#include <Servo.h>\n\nServo myServo;\nconst int POT_PIN = A0;\n\nvoid setup() {\n  myServo.attach(9);\n  pinMode(POT_PIN, INPUT);\n}\n\nvoid loop() {\n  int rawAdc = analogRead(POT_PIN);\n  int angle = map(rawAdc, 0, 1023, 0, 180);\n  myServo.write(angle);\n  delay(20);\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define SERVO_PIN 9\n#define POT_PIN A0\n`
        }
      }
    ]
  },
  {
    id: 'lab-03',
    number: 3,
    code: 'LAB 03',
    title: 'TACTILE INTERRUPT & HARDWARE DEBOUNCING',
    category: 'DISCRETE GPIO',
    subtitle: 'Pin Change Interrupts (PCINT) & RC Low-Pass Filter Topology',
    summary: 'Eliminate mechanical switch chatter using hardware RC low-pass networks and ATmega328P external hardware interrupts INT0/INT1.',
    bom: [
      { partNumber: 'SW-SPST-MOM', designator: 'SW1', description: 'Tactile Pushbutton 6x6mm SPST-NO', package: 'Through-Hole 4-Pin', operatingVoltage: '12V DC Max' },
      { partNumber: 'RES-10K-0.25W', designator: 'R1', description: 'Pull-Up Resistor 10kΩ ±1%', package: 'Axial-0.25W', operatingVoltage: '5.0V Max' },
      { partNumber: 'CAP-100NF-50V', designator: 'C1', description: 'Ceramic Debounce Capacitor 100nF (0.1µF)', package: 'Radial Disc', operatingVoltage: '50V Max' }
    ],
    pinout: [
      { pin: 'D2', name: 'PD2 (INT0)', direction: 'INPUT', signal: 'EXT_INTERRUPT_0', hardwareDestination: 'SW1 Contact Pin' }
    ],
    lessons: [
      {
        id: 'lab-03-les-1',
        lessonIndex: 1,
        globalIndex: 9,
        title: 'Active-Low Internal Pull-Up Architecture',
        codeTitle: 'INPUT_PULLUP_TEST.INO',
        difficulty: 'LEVEL 1',
        completed: false,
        learningObjective: 'Enable internal 20kΩ pull-up resistor to eliminate high-impedance floating lines.',
        theorySummary: 'CMOS inputs have ~100MΩ input impedance and act as antennae picking up electromagnetic hum if left floating.',
        steps: ['Set pinMode(2, INPUT_PULLUP)', 'Detect falling edge transition on button depression'],
        defaultFiles: {
          'sketch.ino': `void setup() {\n  pinMode(2, INPUT_PULLUP);\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  int pressed = !digitalRead(2);\n  digitalWrite(13, pressed ? HIGH : LOW);\n}`,
          'diagram.json': `{}`,
          'pins.h': `#define BUTTON_PIN 2\n`
        }
      },
      { id: 'lab-03-les-2', lessonIndex: 2, globalIndex: 10, title: 'Hardware Interrupts INT0 (FALLING)', codeTitle: 'ATTACH_INTERRUPT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Execute asynchronous ISR routine in under 1µs.', theorySummary: 'attachInterrupt(digitalPinToInterrupt(2), isr, FALLING) triggers instantly.', steps: ['Register ISR', 'Increment volatile counter'], defaultFiles: { 'sketch.ino': `volatile int count = 0;\nvoid onTrigger() { count++; }\nvoid setup() { attachInterrupt(digitalPinToInterrupt(2), onTrigger, FALLING); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define INT_PIN 2\n` } },
      { id: 'lab-03-les-3', lessonIndex: 3, globalIndex: 11, title: 'Software Millis Debounce Gate', codeTitle: 'MILLIS_DEBOUNCE.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Filter 5ms contact bounce noise.', theorySummary: 'Check delta timestamp > 50ms before validating state change.', steps: ['Filter spurious triggers'], defaultFiles: { 'sketch.ino': `// Debounce filter\nvoid setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-03-les-4', lessonIndex: 4, globalIndex: 12, title: 'Atomic Variable Access in ISR', codeTitle: 'ATOMIC_BLOCK.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Prevent race conditions on 16-bit variables during ISR.', theorySummary: 'ATmega328P is an 8-bit core; 16-bit reads take 2 instructions and can be interrupted mid-word.', steps: ['Use ATOMIC_BLOCK macro'], defaultFiles: { 'sketch.ino': `// Atomic 16-bit ISR access\nvoid setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-04',
    number: 4,
    code: 'LAB 04',
    title: '10-BIT SUCCESSIVE APPROXIMATION ADC',
    category: 'TRANSDUCERS',
    subtitle: 'Successive Approximation ADC Architecture & Voltage Dividers',
    summary: 'Sample continuous 0.0V–5.0V voltages into discrete 10-bit digital values (0–1023) using the ATmega328P internal SAR ADC.',
    bom: [
      { partNumber: 'POT-10K-LIN', designator: 'RV1', description: 'Rotary Carbon Potentiometer 10kΩ Linear (B10K)', package: 'Panel Mount 3-Pin', operatingVoltage: '5.0V DC Max' }
    ],
    pinout: [
      { pin: 'A0', name: 'PC0 (ADC0)', direction: 'ANALOG', signal: 'ANALOG_IN_0', hardwareDestination: 'RV1 Wiper Lead' }
    ],
    lessons: [
      { id: 'lab-04-les-1', lessonIndex: 1, globalIndex: 13, title: '10-Bit ADC Voltage Quantization', codeTitle: 'ADC_QUANTIZE.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Calculate 4.887mV LSB resolution.', theorySummary: '5.0V / 1024 = 0.0048828V per quantization step.', steps: ['Read A0', 'Convert to Volts'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A0); float v = raw * (5.0 / 1023.0); Serial.println(v); delay(100); }`, 'diagram.json': `{}`, 'pins.h': `#define ADC_PIN A0\n` } },
      { id: 'lab-04-les-2', lessonIndex: 2, globalIndex: 14, title: 'ADC Prescaler & Sampling Time', codeTitle: 'ADC_PRESCALER.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Set ADCSRA prescaler to 128 (125kHz ADC clock).', theorySummary: '16MHz / 128 = 125kHz, inside the 50kHz-200kHz maximum accuracy window.', steps: ['Inspect ADCSRA register'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-04-les-3', lessonIndex: 3, globalIndex: 15, title: 'Exponential Moving Average (EMA) Filter', codeTitle: 'EMA_FILTER.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Filter electrical ADC noise via alpha EMA algorithm.', theorySummary: 'filtered = alpha * sample + (1 - alpha) * filtered.', steps: ['Apply smoothing'], defaultFiles: { 'sketch.ino': `float smooth = 0;\nvoid loop() { smooth = 0.1 * analogRead(A0) + 0.9 * smooth; }`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-04-les-4', lessonIndex: 4, globalIndex: 16, title: 'Internal 1.1V Bandgap Reference', codeTitle: 'BANDGAP_1V1.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Enable internal precision 1.1V bandgap voltage.', theorySummary: 'analogReference(INTERNAL) provides power-supply-independent voltage accuracy.', steps: ['Configure 1.1V reference'], defaultFiles: { 'sketch.ino': `void setup() { analogReference(INTERNAL); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  // Labs 5 through 22 specifications
  {
    id: 'lab-05', number: 5, code: 'LAB 05', title: 'PIEZOELECTRIC TRANSDUCER & HARMONIC TONE', category: 'ACTUATORS', subtitle: 'Square-Wave Frequency Synthesis & Acoustic Resonance',
    summary: 'Drive active and passive piezo transducers across 20Hz–20kHz frequencies using Timer2 tone() generation.',
    bom: [{ partNumber: 'BUZ-PASSIVE-5V', designator: 'LS1', description: 'Passive Piezoelectric Ceramic Buzzer 4kHz', package: 'Through-Hole 12mm', operatingVoltage: '3.0V - 12V AC/DC' }],
    pinout: [{ pin: 'D8', name: 'PB0', direction: 'OUTPUT', signal: 'AUDIO_SQUARE_WAVE', hardwareDestination: 'LS1 Positive Lead' }],
    lessons: [
      { id: 'lab-05-les-1', lessonIndex: 1, globalIndex: 17, title: 'Square-Wave Frequency Generation', codeTitle: 'TONE_OCTAVE.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Generate 440Hz Concert A tone.', theorySummary: 'tone(pin, freq) triggers hardware timer toggling.', steps: ['Call tone(8, 440)'], defaultFiles: { 'sketch.ino': `void setup() { tone(8, 440); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define BUZZER_PIN 8\n` } },
      { id: 'lab-05-les-2', lessonIndex: 2, globalIndex: 18, title: 'Musical Note Array Melody Sequencer', codeTitle: 'MELODY_PLAYER.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Iterate melody arrays using notes and durations.', theorySummary: 'Note frequencies stored in Flash PROGMEM.', steps: ['Iterate note array'], defaultFiles: { 'sketch.ino': `int melody[] = { 262, 294, 330, 349, 392 }; void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-05-les-3', lessonIndex: 3, globalIndex: 19, title: 'Dual-Tone Polyphonic Synthesis', codeTitle: 'POLYPHONIC_SYNTH.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Synthesize dual frequencies using Timer1 and Timer2.', theorySummary: 'Independent timer channels produce harmonic chords.', steps: ['Configure multiple timers'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-05-les-4', lessonIndex: 4, globalIndex: 20, title: 'Ultrasonic Deterrent Waveform (25kHz)', codeTitle: 'ULTRASONIC_TONE.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Drive transducer above human hearing threshold.', theorySummary: '25kHz acoustic pressure wave generation.', steps: ['Configure 25000Hz frequency'], defaultFiles: { 'sketch.ino': `void setup() { tone(8, 25000); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-06', number: 6, code: 'LAB 06', title: '3D CSG MOTOR MOUNT & OPENSCAD SOLID', category: 'CAD/CAM', subtitle: 'Parametric CSG Solid Modeling & STL Mesh Tessellation',
    summary: 'Design 3D printable mechanical servo fixtures, motor brackets, and enclosures using Constructive Solid Geometry.',
    bom: [{ partNumber: 'FILAMENT-PLA-BLK', designator: 'RAW-PLA', description: '1.75mm Black Polylactic Acid Filament', package: '1kg Spool', operatingVoltage: 'N/A' }],
    pinout: [],
    lessons: [
      { id: 'lab-06-les-1', lessonIndex: 1, globalIndex: 21, title: 'Constructive Solid Geometry Primitives', codeTitle: 'SERVO_BRACKET.SCAD', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Union, difference, and intersection boolean modeling.', theorySummary: 'CSG builds complex meshes via Boolean operations on pure solids.', steps: ['Define outer cube', 'Subtract servo body cut-out'], defaultFiles: { 'sketch.ino': `// OpenSCAD CAD Model\ndifference() {\n  cube([32, 24, 18], center=true);\n  cube([23, 12.5, 20], center=true);\n}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-06-les-2', lessonIndex: 2, globalIndex: 22, title: 'Parametric Fastener Clearance Holes', codeTitle: 'M3_CLEARANCE.SCAD', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Calculate ISO metric bolt allowances.', theorySummary: 'M3 screw clearance holes require 3.3mm nominal diameter.', steps: ['Subtract bolt cylinders'], defaultFiles: { 'sketch.ino': `// M3 Bolt Holes\n`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-06-les-3', lessonIndex: 3, globalIndex: 23, title: 'Fillet Stress Distribution & Radii', codeTitle: 'FILLET_REINFORCE.SCAD', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Reduce stress concentration factors in 3D prints.', theorySummary: 'Sharp 90-degree internal corners concentrate mechanical shear stresses.', steps: ['Apply bevel fillets'], defaultFiles: { 'sketch.ino': `// Filleted bracket\n`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-06-les-4', lessonIndex: 4, globalIndex: 24, title: 'Binary STL Mesh Tessellation Export', codeTitle: 'STL_EXPORT_PIPELINE.JS', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Export vertex facet coordinates to standard STL format.', theorySummary: 'STL approximates surfaces using normal vectors and triangular vertices.', steps: ['Generate STL mesh'], defaultFiles: { 'sketch.ino': `// STL generation pipeline\n`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-07', number: 7, code: 'LAB 07', title: 'TRUE-RMS DIGITAL MULTIMETER INSTRUMENT', category: 'TRANSDUCERS', subtitle: 'Voltage, Current Shunt & Continuity Diagnostic Measurement',
    summary: 'Measure real-time DC voltage drops, series shunt currents, and circuit continuity with simulated 4.5-digit precision.',
    bom: [{ partNumber: 'INST-DMM-BENCH', designator: 'DMM1', description: 'Virtual 4.5 Digit True-RMS Multimeter', package: 'Benchtop Enclosure', operatingVoltage: '1000V CAT III' }],
    pinout: [{ pin: 'A0', name: 'V_PROBE', direction: 'ANALOG', signal: 'VOLTAGE_PROBE', hardwareDestination: 'Device Under Test' }],
    lessons: [
      { id: 'lab-07-les-1', lessonIndex: 1, globalIndex: 25, title: 'DC Bus Voltage Verification', codeTitle: 'DMM_VOLTS.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Measure +5.0V regulated line under load.', theorySummary: 'DMM input impedance is typically 10MΩ to avoid loading circuits.', steps: ['Probe 5V bus', 'Verify reading is within 4.95V - 5.05V'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-07-les-2', lessonIndex: 2, globalIndex: 26, title: 'High-Side Shunt Current Measurement', codeTitle: 'DMM_CURRENT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Calculate current draw via small 0.1Ω series shunt resistor.', theorySummary: 'Ohm’s law I = V / R converts shunt drop to milliamps.', steps: ['Measure shunt drop'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-07-les-3', lessonIndex: 3, globalIndex: 27, title: 'Continuity & Cold Solder Joint Check', codeTitle: 'DMM_CONTINUITY.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Detect continuous copper traces under 50Ω impedance.', theorySummary: 'Acoustic beeper fires when trace resistance is below threshold.', steps: ['Test low-resistance path'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-07-les-4', lessonIndex: 4, globalIndex: 28, title: 'True-RMS AC Ripple Analysis', codeTitle: 'DMM_AC_RIPPLE.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Analyze power supply switching noise and ripple.', theorySummary: 'RMS calculation integrates squared instantaneous voltages.', steps: ['Measure AC component on DC rail'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-08', number: 8, code: 'LAB 08', title: 'PHOTORESISTOR LUX TRANSDUCER & VOLTAGE DIVIDER', category: 'TRANSDUCERS', subtitle: 'Cadmium Sulfide (CdS) Optical Transduction & Ambient Lux Math',
    summary: 'Quantify ambient illumination from pitch dark (<1 Lux) to direct daylight (>10,000 Lux) using a CdS photoresistor.',
    bom: [{ partNumber: 'OPT-LDR-5MM', designator: 'LDR1', description: 'CdS Photocell LDR 5kΩ-10kΩ Light Resistance', package: 'Radial Epoxy 5mm', operatingVoltage: '100V Max' }],
    pinout: [{ pin: 'A1', name: 'PC1 (ADC1)', direction: 'ANALOG', signal: 'LIGHT_ANALOG', hardwareDestination: 'LDR-10k Divider Junction' }],
    lessons: [
      { id: 'lab-08-les-1', lessonIndex: 1, globalIndex: 29, title: 'LDR Voltage Divider Equation', codeTitle: 'LDR_VOLTAGE.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Derive Vout = Vcc * (R_fixed / (R_ldr + R_fixed)).', theorySummary: 'Photocell resistance decreases logarithmically with increasing light.', steps: ['Read A1 voltage', 'Calculate LDR resistance'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() { int raw = analogRead(A1); Serial.println(raw); delay(100); }`, 'diagram.json': `{}`, 'pins.h': `#define LDR_PIN A1\n` } },
      { id: 'lab-08-les-2', lessonIndex: 2, globalIndex: 30, title: 'Lux Curve Logarithmic Regression', codeTitle: 'LUX_CALCULATOR.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Calculate physical Lux value using gamma power law.', theorySummary: 'Lux = pow(R_ldr / A, -1 / gamma).', steps: ['Compute real lux units'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-08-les-3', lessonIndex: 3, globalIndex: 31, title: 'Hysteresis Twilight Streetlight Switch', codeTitle: 'HYSTERESIS_LIGHT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Implement Schmitt trigger logic to prevent rapid relay fluttering.', theorySummary: 'Dual thresholds (turn ON at 200, turn OFF at 350) prevent oscillation.', steps: ['Implement hysteresis band'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-08-les-4', lessonIndex: 4, globalIndex: 32, title: 'Self-Calibrating Ambient Light Sensor', codeTitle: 'AUTO_CALIBRATE_LUX.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Store minimum and maximum bounds in EEPROM during startup calibration.', theorySummary: 'Adapts dynamically to different room lighting environments.', steps: ['Run 5s calibration sweep'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-09', number: 9, code: 'LAB 09', title: 'RGB LED PWM COLOR MIXING & CIE CHROMA', category: 'ACTUATORS', subtitle: 'Additive Red-Green-Blue Synthesis & Perceptual Gamma Correction',
    summary: 'Mix 16.7 million colors using 3-channel PWM on pins 9, 10, 11 with human eye logarithmic gamma curve correction.',
    bom: [{ partNumber: 'LED-RGB-CC', designator: 'LED1', description: 'Common-Cathode 5mm RGB LED (4-Pin)', package: 'Through-Hole 5mm', operatingVoltage: 'R: 2.0V, G: 3.2V, B: 3.2V' }],
    pinout: [
      { pin: 'D9', name: 'PB1', direction: 'PWM', signal: 'PWM_RED', hardwareDestination: 'Red Anode via 220Ω' },
      { pin: 'D10', name: 'PB2', direction: 'PWM', signal: 'PWM_GREEN', hardwareDestination: 'Green Anode via 150Ω' },
      { pin: 'D11', name: 'PB3', direction: 'PWM', signal: 'PWM_BLUE', hardwareDestination: 'Blue Anode via 150Ω' }
    ],
    lessons: [
      { id: 'lab-09-les-1', lessonIndex: 1, globalIndex: 33, title: 'Additive RGB Primary Spectrum', codeTitle: 'RGB_PRIMARY.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Synthesize Secondary colors: Cyan, Magenta, Yellow.', theorySummary: 'Equal amounts of Red and Green produce Yellow.', steps: ['Set PWM pins', 'Combine channels'], defaultFiles: { 'sketch.ino': `void setup() { pinMode(9, OUTPUT); pinMode(10, OUTPUT); pinMode(11, OUTPUT); }\nvoid loop() { analogWrite(9, 255); analogWrite(10, 255); analogWrite(11, 0); }`, 'diagram.json': `{}`, 'pins.h': `#define PIN_R 9\n#define PIN_G 10\n#define PIN_B 11\n` } },
      { id: 'lab-09-les-2', lessonIndex: 2, globalIndex: 34, title: 'Perceptual Gamma 2.8 Correction Table', codeTitle: 'GAMMA_CORRECTION.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Linearize human eye brightness perception using lookup table.', theorySummary: 'Human eyes perceive light logarithmically. A 50% PWM appears 80% bright without gamma correction.', steps: ['Implement 256-byte gamma lookup table'], defaultFiles: { 'sketch.ino': `const uint8_t PROGMEM gamma8[] = { 0, 0, 0, 1, 1, 2, 3 ... }; void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-09-les-3', lessonIndex: 3, globalIndex: 35, title: 'HSV to RGB Color Space Matrix', codeTitle: 'HSV_WHEEL.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Smooth rainbow rainbow color sweeps using Hue/Saturation/Value algorithm.', theorySummary: 'HSV simplifies smooth hue rotations around 360-degree color wheel.', steps: ['Compute HSV to RGB algorithm'], defaultFiles: { 'sketch.ino': `void setHSV(float h, float s, float v) {} void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-09-les-4', lessonIndex: 4, globalIndex: 36, title: 'Breathe / Heartbeat LED Animator', codeTitle: 'BREATHE_PULSE.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Generate organic breathing curves using sine wave math.', theorySummary: 'sinusoidal PWM modulation creates natural soothing indicators.', steps: ['Calculate sin(t) brightness'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-10', number: 10, code: 'LAB 10', title: 'ANALOG NTC THERMAL TRANSDUCER & PID FAN', category: 'TRANSDUCERS', subtitle: 'Steinhart-Hart Resistance Thermometry & Closed-Loop PWM Cooling',
    summary: 'Measure ambient temperatures via 10k NTC thermistor and drive cooling fans using proportional closed-loop PWM.',
    bom: [{ partNumber: 'SEN-TMP36-TO92', designator: 'U2', description: 'Precision Centigrade Temperature Sensor (10mV/°C)', package: 'TO-92', operatingVoltage: '2.7V - 5.5V DC' }],
    pinout: [{ pin: 'A0', name: 'PC0', direction: 'ANALOG', signal: 'TEMP_VOLTAGE', hardwareDestination: 'TMP36 Vout' }, { pin: 'D6', name: 'PD6', direction: 'PWM', signal: 'FAN_PWM', hardwareDestination: 'MOSFET Gate Driver' }],
    lessons: [
      { id: 'lab-10-les-1', lessonIndex: 1, globalIndex: 37, title: '10mV/°C Linear Thermometry', codeTitle: 'TMP36_READ.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Convert voltage to Celsius: Temp = (V - 0.5) * 100.', theorySummary: 'TMP36 outputs 750mV at 25°C with 500mV offset for sub-zero measurement.', steps: ['Read ADC', 'Convert to Celsius'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(A0); float v = adc * (5.0 / 1023.0); float tempC = (v - 0.5) * 100.0; Serial.println(tempC); delay(200); }`, 'diagram.json': `{}`, 'pins.h': `#define TEMP_PIN A0\n#define FAN_PIN 6\n` } },
      { id: 'lab-10-les-2', lessonIndex: 2, globalIndex: 38, title: 'Proportional Thermal Fan Governor', codeTitle: 'PROP_FAN.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Scale fan PWM speed proportionally with temperature rise.', theorySummary: 'PWM duty cycle ramps from 0% at 25°C to 100% at 45°C.', steps: ['Calculate PWM from temp delta'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-10-les-3', lessonIndex: 3, globalIndex: 39, title: 'Overtemperature Alarm & Watchdog Trip', codeTitle: 'THERMAL_WATCHDOG.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Trigger hardware emergency shutdown on thermal threshold breach.', theorySummary: 'Safeguard power electronics against thermal runaway.', steps: ['Detect > 50°C condition'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-10-les-4', lessonIndex: 4, globalIndex: 40, title: 'PID Thermal Stabilization Loop', codeTitle: 'PID_COOLING.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Tune proportional, integral, and derivative coefficients.', theorySummary: 'PID eliminates steady-state temperature offsets and prevents thermal overshoot.', steps: ['Compute error, integral, derivative'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  // Labs 11 through 22 summary specs for complete 22-lab coverage
  {
    id: 'lab-11', number: 11, code: 'LAB 11', title: 'ULTRASONIC TIME-OF-FLIGHT SONAR TRANSDUCER', category: 'TRANSDUCERS', subtitle: 'HC-SR04 40kHz Speed of Sound Acoustic Echo Ranging',
    summary: 'Measure millimeter distances by calculating acoustic flight times at 343 m/s.',
    bom: [{ partNumber: 'SEN-HC-SR04', designator: 'U3', description: 'Ultrasonic Sonar Transducer Module 2cm-400cm', package: 'Module 4-Pin', operatingVoltage: '5.0V DC' }],
    pinout: [{ pin: 'D12', name: 'TRIG', direction: 'OUTPUT', signal: '10us_PULSE', hardwareDestination: 'HC-SR04 Trig' }, { pin: 'D11', name: 'ECHO', direction: 'INPUT', signal: 'ECHO_PWM', hardwareDestination: 'HC-SR04 Echo' }],
    lessons: [
      { id: 'lab-11-les-1', lessonIndex: 1, globalIndex: 41, title: '10µs Trigger Pulse & Speed of Sound Math', codeTitle: 'SONAR_BASIC.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Distance = (duration / 2) / 29.1.', theorySummary: 'Sound travels at 0.0343 cm/µs in air.', steps: ['Fire trigger', 'Read echo pulse width'], defaultFiles: { 'sketch.ino': `void setup() { pinMode(12, OUTPUT); pinMode(11, INPUT); Serial.begin(115200); }\nvoid loop() { digitalWrite(12, LOW); delayMicroseconds(2); digitalWrite(12, HIGH); delayMicroseconds(10); digitalWrite(12, LOW); long dur = pulseIn(11, HIGH); float cm = (dur / 2.0) / 29.1; Serial.println(cm); delay(100); }`, 'diagram.json': `{}`, 'pins.h': `#define TRIG_PIN 12\n#define ECHO_PIN 11\n` } },
      { id: 'lab-11-les-2', lessonIndex: 2, globalIndex: 42, title: 'Median Filter Outlier Rejection', codeTitle: 'SONAR_MEDIAN.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Reject spurious multipath echoes using 5-sample median window.', theorySummary: 'Median filters discard acoustic noise spikes.', steps: ['Sort 5 readings', 'Pick middle element'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-11-les-3', lessonIndex: 3, globalIndex: 43, title: 'Proximity Parking Radar Audio Beep', codeTitle: 'PARKING_RADAR.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Modulate buzzer beep frequency proportionally with obstacle distance.', theorySummary: 'Frequency increases as distance decreases.', steps: ['Map distance to beep rate'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-11-les-4', lessonIndex: 4, globalIndex: 44, title: 'Hardware Timer Input Capture (ICP1)', codeTitle: 'ICP1_SONAR.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Measure echo width using 16-bit Timer1 Input Capture Register.', theorySummary: 'Zero CPU overhead hardware pulse measurement down to 62.5ns.', steps: ['Configure ICR1'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-12', number: 12, code: 'LAB 12', title: 'INFRARED DETECTOR & REFL. OPTICAL BARRIER', category: 'TRANSDUCERS', subtitle: '940nm Phototransistor & TCRT5000 Edge Detection',
    summary: 'Detect surface reflectivity and black-white transitions for robot line tracking.',
    bom: [{ partNumber: 'OPT-TCRT5000', designator: 'U4', description: 'Reflective Optical Sensor with Transistor Output', package: 'Through-Hole 4-Pin', operatingVoltage: '5.0V DC' }],
    pinout: [{ pin: 'D2', name: 'PD2', direction: 'INPUT', signal: 'IR_DIGITAL', hardwareDestination: 'TCRT5000 Comparator' }],
    lessons: [
      { id: 'lab-12-les-1', lessonIndex: 1, globalIndex: 45, title: '940nm Reflection & Comparator Threshold', codeTitle: 'IR_DETECT.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Distinguish white reflective from black absorbent surfaces.', theorySummary: 'Black surfaces absorb 940nm infrared rays.', steps: ['Read IR state'], defaultFiles: { 'sketch.ino': `void setup() { pinMode(2, INPUT); pinMode(13, OUTPUT); } void loop() { digitalWrite(13, digitalRead(2)); }`, 'diagram.json': `{}`, 'pins.h': `#define IR_PIN 2\n` } },
      { id: 'lab-12-les-2', lessonIndex: 2, globalIndex: 46, title: 'Differential Line Tracking Controller', codeTitle: 'LINE_TRACK.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Maintain robot heading centered on 20mm dark track.', theorySummary: 'Two sensors create differential steering error.', steps: ['Calculate steering vector'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-12-les-3', lessonIndex: 3, globalIndex: 47, title: 'Ambient Light Immunity 38kHz Modulation', codeTitle: 'IR_38KHZ.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Pulsed carrier demodulation eliminates sunlight interference.', theorySummary: 'TSOP38238 receivers reject unmodulated DC light.', steps: ['Modulate at 38kHz'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-12-les-4', lessonIndex: 4, globalIndex: 48, title: 'Rotary Encoder Optical Tachometer', codeTitle: 'TACHOMETER.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Count slotted disc pulses to compute motor RPM.', theorySummary: 'RPM = (pulse_count / slots_per_rev) * (60000 / sample_ms).', steps: ['Count optical ticks'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-13', number: 13, code: 'LAB 13', title: '3D PRINTER G-CODE SLICER & KINEMATICS', category: 'CAD/CAM', subtitle: 'G0/G1 Linear Toolpaths & Extrusion Vector Synthesis',
    summary: 'Parse and simulate 3D printer CNC toolpaths, layer heights, and extrusion volumes.',
    bom: [{ partNumber: 'CNC-3DP-HOTEND', designator: 'E0', description: '0.4mm Brass Extrusion Nozzle & Stepper Kinematics', package: 'Cartesian CoreXY', operatingVoltage: '24V DC' }],
    pinout: [],
    lessons: [
      { id: 'lab-13-les-1', lessonIndex: 1, globalIndex: 49, title: 'G0 Rapid Positioning & G1 Linear Extrusion', codeTitle: 'TOOLPATH_TEST.GCODE', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Interpret Cartesian coordinate moves: G1 X100 Y50 E2.5.', theorySummary: 'G-Code instructs motors to move at precise feedrates (F).', steps: ['Inspect nozzle path'], defaultFiles: { 'sketch.ino': `G21 ; Millimeter units\nG90 ; Absolute coordinates\nG1 X10 Y10 F3000\nG1 X50 Y10 E2.4 F1800\nG1 X50 Y50 E4.8\nG1 X10 Y50 E7.2\nG1 X10 Y10 E9.6`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-13-les-2', lessonIndex: 2, globalIndex: 50, title: 'Volumetric Flow Rate & Layer Height Math', codeTitle: 'FLOW_RATE.CPP', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Calculate mm³ per second extruded filament volume.', theorySummary: 'Flow = Layer_Height * Extrusion_Width * Speed.', steps: ['Calculate volume'], defaultFiles: { 'sketch.ino': `// Flow rate math\n`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-13-les-3', lessonIndex: 3, globalIndex: 51, title: 'Bresenham Stepper Interpolation Algorithm', codeTitle: 'BRESENHAM.CPP', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Synchronize X, Y, and E stepper pulses without floating point.', theorySummary: 'Bresenham algorithm uses fast integer-only error accumulation.', steps: ['Simulate stepper pulses'], defaultFiles: { 'sketch.ino': `// Bresenham step generator\n`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-13-les-4', lessonIndex: 4, globalIndex: 52, title: 'Jerk Limit & S-Curve Acceleration Profiler', codeTitle: 'SCURVE_ACCEL.CPP', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Eliminate mechanical ghosting via 3rd-order trajectory planning.', theorySummary: 'S-curve acceleration limits derivative of acceleration (jerk).', steps: ['Plot motion velocity curve'], defaultFiles: { 'sketch.ino': `// S-Curve acceleration planner\n`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-14', number: 14, code: 'LAB 14', title: 'DHT22 DIGITAL CAPACITIVE HYGROMETER', category: 'TRANSDUCERS', subtitle: 'Single-Bus Proprietary Time-Division Multiplexed Protocol',
    summary: 'Decode 40-bit environmental packets containing 16-bit relative humidity and temperature with CRC check.',
    bom: [{ partNumber: 'SEN-DHT22-AM2302', designator: 'U5', description: 'Capacitive Digital Humidity & Temp Sensor (±2% RH)', package: '4-Pin Single Row', operatingVoltage: '3.3V - 5.5V DC' }],
    pinout: [{ pin: 'D4', name: 'PD4', direction: 'INPUT', signal: 'DHT_DATA_BUS', hardwareDestination: 'DHT22 Pin 2 via 4.7k Pullup' }],
    lessons: [
      { id: 'lab-14-les-1', lessonIndex: 1, globalIndex: 53, title: '40-Bit Bitstream Protocol Handshake', codeTitle: 'DHT22_BITSTREAM.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Decode 28µs ("0") vs 70µs ("1") high pulse widths.', theorySummary: 'Single-wire bidirectional handshake requires microsecond timing.', steps: ['Send 18ms host start signal', 'Decode 40 bits'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define DHT_PIN 4\n` } },
      { id: 'lab-14-les-2', lessonIndex: 2, globalIndex: 54, title: '8-Bit Checksum Integrity Validation', codeTitle: 'DHT_CHECKSUM.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Checksum = (byte1 + byte2 + byte3 + byte4) & 0xFF.', theorySummary: 'Checksum detects transmission noise errors on long cables.', steps: ['Validate packet checksum'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-14-les-3', lessonIndex: 3, globalIndex: 55, title: 'Heat Index & Dew Point Mathematical Models', codeTitle: 'DEW_POINT.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Calculate condensation temperature via Magnus-Tetens formula.', theorySummary: 'Magnus-Tetens formula approximates dew point within ±0.4°C.', steps: ['Calculate dew point'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-14-les-4', lessonIndex: 4, globalIndex: 56, title: 'Non-Blocking FreeRTOS Sensor Polling Task', codeTitle: 'ASYNC_DHT.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Poll DHT sensor strictly every 2000ms without blocking scheduler.', theorySummary: 'DHT22 sensing element requires 2000ms recharge cycle.', steps: ['Implement 2-second rate gate'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-15', number: 15, code: 'LAB 15', title: 'MQ-2 HAZARDOUS GAS & FLAMMABLE SMOKE', category: 'TRANSDUCERS', subtitle: 'Tin Dioxide (SnO2) Semiconductor Chemiresistor Sensing',
    summary: 'Monitor LPG, propane, methane, and smoke concentrations using SnO2 surface conductivity changes.',
    bom: [{ partNumber: 'SEN-MQ2-GAS', designator: 'U6', description: 'Combustible Gas Sensor with Internal 5V Heater', package: '6-Pin Steel Mesh', operatingVoltage: '5.0V DC (Heater 800mW)' }],
    pinout: [{ pin: 'A0', name: 'PC0', direction: 'ANALOG', signal: 'GAS_ANALOG', hardwareDestination: 'MQ-2 Analog Out' }, { pin: 'D7', name: 'PD7', direction: 'INPUT', signal: 'GAS_ALARM', hardwareDestination: 'LM393 Comparator Out' }],
    lessons: [
      { id: 'lab-15-les-1', lessonIndex: 1, globalIndex: 57, title: 'SnO2 Chemiresistor Baseline Calibration (Ro)', codeTitle: 'MQ2_CALIBRATE.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Determine clean air sensor resistance Ro.', theorySummary: 'Clean air baseline ratio Rs/Ro is approximately 9.83.', steps: ['Calculate baseline resistance'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(A0); Serial.println(adc); delay(200); }`, 'diagram.json': `{}`, 'pins.h': `#define MQ2_PIN A0\n` } },
      { id: 'lab-15-les-2', lessonIndex: 2, globalIndex: 58, title: 'PPM Concentration Curve Derivation', codeTitle: 'PPM_CURVES.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Map Rs/Ro ratio to logarithmic parts-per-million.', theorySummary: 'PPM = A * pow(Rs/Ro, B) derived from manufacturer datasheet.', steps: ['Calculate PPM'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-15-les-3', lessonIndex: 3, globalIndex: 59, title: 'Combustible Hazard Audio/Visual Interlock', codeTitle: 'GAS_INTERLOCK.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Assert digital interlock to cut power relay on gas leak.', theorySummary: 'Safety interlocks prevent electric spark ignition.', steps: ['Trip safety relay'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-15-les-4', lessonIndex: 4, globalIndex: 60, title: 'Heater Thermal Stabilization Cycle', codeTitle: 'HEATER_CYCLE.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Manage 20-second preheating cycle before validating readings.', theorySummary: 'SnO2 surface must reach 300°C for catalytic oxidation.', steps: ['Track warmup timer'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-16', number: 16, code: 'LAB 16', title: 'I2C 1602 ALPHANUMERIC LCD CONTROLLER', category: 'PROTOCOLS', subtitle: 'PCF8574 I2C Expander & HD44780 4-Bit Parallel Bus',
    summary: 'Transmit characters, custom graphics, and telemetry across the two-wire I2C bus at 100kHz standard mode.',
    bom: [{ partNumber: 'DIS-LCD-1602-I2C', designator: 'DS1', description: '16x2 Character LCD with PCF8574T I2C Backpack', package: 'Module 16x2', operatingVoltage: '5.0V DC' }],
    pinout: [{ pin: 'A4', name: 'SDA', direction: 'BUS', signal: 'I2C_DATA', hardwareDestination: 'PCF8574 SDA' }, { pin: 'A5', name: 'SCL', direction: 'BUS', signal: 'I2C_CLOCK', hardwareDestination: 'PCF8574 SCL' }],
    lessons: [
      { id: 'lab-16-les-1', lessonIndex: 1, globalIndex: 61, title: 'I2C Bus Addressing (0x27 / 0x3F)', codeTitle: 'I2C_SCANNER.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Scan 7-bit addresses 0x01–0x7F and receive ACK bit.', theorySummary: 'I2C devices respond with ACK (0V pull-down) during 9th clock pulse.', steps: ['Scan bus for device', 'Confirm ACK at 0x27'], defaultFiles: { 'sketch.ino': `#include <Wire.h>\nvoid setup() { Wire.begin(); Serial.begin(115200); }\nvoid loop() { Wire.beginTransmission(0x27); byte err = Wire.endTransmission(); Serial.println(err == 0 ? "Found 0x27" : "Missing"); delay(1000); }`, 'diagram.json': `{}`, 'pins.h': `#define I2C_ADDR 0x27\n` } },
      { id: 'lab-16-les-2', lessonIndex: 2, globalIndex: 62, title: 'HD44780 4-Bit Nibble Protocol Expansion', codeTitle: 'LCD_NIBBLES.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Send upper and lower 4-bit nibbles over 8-bit PCF8574 expander.', theorySummary: '4-bit mode reduces pin count while preserving HD44780 command sets.', steps: ['Transmit high nibble', 'Strobe Enable pin'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-16-les-3', lessonIndex: 3, globalIndex: 63, title: 'Custom 5x8 Bitmap Characters in CGRAM', codeTitle: 'CGRAM_ICONS.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Program battery, heart, and WiFi icons into LCD CGRAM registers.', theorySummary: 'HD44780 permits up to 8 user-defined custom glyphs.', steps: ['Define 8-byte character bitmap'], defaultFiles: { 'sketch.ino': `byte heart[8] = { 0x00, 0x0A, 0x1F, 0x1F, 0x0E, 0x04, 0x00, 0x00 }; void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-16-les-4', lessonIndex: 4, globalIndex: 64, title: 'Circular Buffer Marquee Text Scroller', codeTitle: 'MARQUEE_SCROLL.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Scroll long status text across 16 columns using ring buffer.', theorySummary: 'Ring buffer avoids string reallocation memory leaks.', steps: ['Scroll text window'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-17', number: 17, code: 'LAB 17', title: 'SSD1306 128X64 GRAPHICAL OLED MATRIX', category: 'PROTOCOLS', subtitle: '400kHz Fast I2C Monochrome Bitmapped Framebuffers',
    summary: 'Render waveforms, telemetry gauges, and typography on a 128x64 organic light-emitting diode display.',
    bom: [{ partNumber: 'DIS-OLED-12864', designator: 'DS2', description: '0.96" Monochrome White 128x64 OLED Matrix', package: 'Module 4-Pin I2C', operatingVoltage: '3.3V - 5.0V DC' }],
    pinout: [{ pin: 'A4', name: 'SDA', direction: 'BUS', signal: 'I2C_FAST_SDA', hardwareDestination: 'SSD1306 SDA' }, { pin: 'A5', name: 'SCL', direction: 'BUS', signal: 'I2C_FAST_SCL', hardwareDestination: 'SSD1306 SCL' }],
    lessons: [
      { id: 'lab-17-les-1', lessonIndex: 1, globalIndex: 65, title: '1024-Byte GDDRAM Memory Buffer', codeTitle: 'OLED_INIT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Manage 1-bit-per-pixel RAM: (128 * 64) / 8 = 1024 bytes.', theorySummary: 'Graphic Display Data RAM mirrors physical OLED pixel columns.', steps: ['Initialize display controller'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define OLED_ADDR 0x3C\n` } },
      { id: 'lab-17-les-2', lessonIndex: 2, globalIndex: 66, title: 'Bresenham Circle & Vector Gauge Drawing', codeTitle: 'OLED_GAUGE.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Draw analog dials and needle needles in real time.', theorySummary: 'Bresenham rasterization ensures smooth pixelated curves.', steps: ['Draw circular dial face'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-17-les-3', lessonIndex: 3, globalIndex: 67, title: 'Real-Time Oscilloscope Sparkline Grapher', codeTitle: 'SPARKLINE.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Plot live ADC voltage waveform as a continuous stripchart.', theorySummary: 'Shift buffer array by 1 pixel to create scrolling effect.', steps: ['Plot sparkline series'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-17-les-4', lessonIndex: 4, globalIndex: 68, title: '400kHz Fast-Mode I2C Bus Overclocking', codeTitle: 'I2C_400KHZ.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Set TWBR register to 12 to achieve 400kHz throughput.', theorySummary: 'TWBR = ((16000000 / 400000) - 16) / 2 = 12.', steps: ['Set Wire.setClock(400000)'], defaultFiles: { 'sketch.ino': `void setup() { Wire.begin(); Wire.setClock(400000); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-18', number: 18, code: 'LAB 18', title: 'CAPACITIVE SOIL MOISTURE & IRRIGATION RELAY', category: 'TRANSDUCERS', subtitle: 'Corrosion-Free Capacitive Dielectric Permittivity Measurement',
    summary: 'Measure soil moisture using high-frequency capacitive fringing fields and control 5V optocoupled relays.',
    bom: [{ partNumber: 'SEN-SOIL-CAP-V1.2', designator: 'U7', description: 'Corrosion-Resistant Capacitive Soil Moisture Sensor', package: 'PCB Blade', operatingVoltage: '3.3V - 5.5V DC' }, { partNumber: 'MOD-RELAY-1CH', designator: 'K1', description: '1-Channel 5V Optocoupled Relay Module (10A 250VAC)', package: 'Module SPDT', operatingVoltage: '5.0V DC' }],
    pinout: [{ pin: 'A0', name: 'PC0', direction: 'ANALOG', signal: 'SOIL_ANALOG', hardwareDestination: 'Sensor Output' }, { pin: 'D7', name: 'PD7', direction: 'OUTPUT', signal: 'RELAY_CONTROL', hardwareDestination: 'Relay IN1' }],
    lessons: [
      { id: 'lab-18-les-1', lessonIndex: 1, globalIndex: 69, title: 'Capacitive High-Frequency Dielectric Sensing', codeTitle: 'SOIL_CALIBRATE.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Establish dry air (~520) vs water immersion (~260) ADC calibration.', theorySummary: 'Capacitive probes avoid galvanic electrolysis corrosion that destroys resistive probes.', steps: ['Record air dry baseline', 'Record 100% water saturation'], defaultFiles: { 'sketch.ino': `void setup() { Serial.begin(115200); }\nvoid loop() { int adc = analogRead(A0); int pct = map(adc, 520, 260, 0, 100); Serial.println(pct); delay(200); }`, 'diagram.json': `{}`, 'pins.h': `#define SOIL_PIN A0\n#define RELAY_PIN 7\n` } },
      { id: 'lab-18-les-2', lessonIndex: 2, globalIndex: 70, title: 'Optocoupled Relay Inductive Flyback Safety', codeTitle: 'RELAY_PUMP.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Control 12V water pump while protecting microcontroller from inductive spikes.', theorySummary: 'Freewheeling flyback diode suppresses inductive voltage collapses (V = -L * di/dt).', steps: ['Assert relay control pin'], defaultFiles: { 'sketch.ino': `void setup() { pinMode(7, OUTPUT); } void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-18-les-3', lessonIndex: 3, globalIndex: 71, title: 'Automated Agricultural Water Dosing Engine', codeTitle: 'WATER_DOSING.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Irrigate in discrete 5-second pulses to allow water soil absorption.', theorySummary: 'Continuous pumping causes flooding before water reaches the probe sensor.', steps: ['Implement 5s pulse + 30s soak state machine'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-18-les-4', lessonIndex: 4, globalIndex: 72, title: 'Low-Power Deep Sleep Soil Station', codeTitle: 'LOW_POWER_SOIL.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Put ATmega328P into SLEEP_MODE_PWR_DOWN drawing < 15µA.', theorySummary: 'Watchdog timer wakes processor every 8 seconds to take measurement.', steps: ['Configure power down sleep'], defaultFiles: { 'sketch.ino': `#include <avr/sleep.h>\nvoid setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-19', number: 19, code: 'LAB 19', title: 'L298N DUAL H-BRIDGE MOTOR DRIVER', category: 'ROBOTICS', subtitle: 'Inductive BJT H-Bridge Direction & PWM Speed Regulation',
    summary: 'Drive high-current DC motors bidirectional using dual full-bridge drivers with hardware PWM speed regulation.',
    bom: [{ partNumber: 'MOD-L298N-DUAL', designator: 'U8', description: 'Dual H-Bridge Driver Module (2A peak per channel)', package: 'Heatsink Module', operatingVoltage: '5V - 35V DC' }, { partNumber: 'MOT-DC-TT-130', designator: 'M2', description: 'Geared TT DC Motor 1:48 Ratio (3V-6V)', package: 'Gearbox Assembly', operatingVoltage: '3V - 6V DC' }],
    pinout: [{ pin: 'D5', name: 'ENA (PWM)', direction: 'PWM', signal: 'SPEED_PWM', hardwareDestination: 'L298N ENA' }, { pin: 'D6', name: 'IN1', direction: 'OUTPUT', signal: 'DIR_IN1', hardwareDestination: 'L298N IN1' }, { pin: 'D7', name: 'IN2', direction: 'OUTPUT', signal: 'DIR_IN2', hardwareDestination: 'L298N IN2' }],
    lessons: [
      { id: 'lab-19-les-1', lessonIndex: 1, globalIndex: 73, title: 'H-Bridge Transistor Truth Table', codeTitle: 'MOTOR_TRUTH_TABLE.INO', difficulty: 'LEVEL 1', completed: false, learningObjective: 'Forward, Reverse, Dynamic Brake, and Coast modes.', theorySummary: 'High IN1 + Low IN2 drives forward. High on both produces active dynamic braking.', steps: ['Set IN1 HIGH, IN2 LOW', 'Observe forward spin in CAD viewport'], defaultFiles: { 'sketch.ino': `void setup() { pinMode(5, OUTPUT); pinMode(6, OUTPUT); pinMode(7, OUTPUT); }\nvoid loop() { analogWrite(5, 200); digitalWrite(6, HIGH); digitalWrite(7, LOW); delay(2000); digitalWrite(6, LOW); digitalWrite(7, HIGH); delay(2000); }`, 'diagram.json': `{}`, 'pins.h': `#define MOTOR_ENA 5\n#define MOTOR_IN1 6\n#define MOTOR_IN2 7\n` } },
      { id: 'lab-19-les-2', lessonIndex: 2, globalIndex: 74, title: 'PWM Speed Control & Deadband Compensation', codeTitle: 'MOTOR_SPEED.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Overcome mechanical static friction at low PWM duty cycles.', theorySummary: 'Motors require minimum ~60 PWM duty to overcome gearbox friction.', steps: ['Ramp PWM from 60 to 255'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-19-les-3', lessonIndex: 3, globalIndex: 75, title: 'Emergency E-Stop Dynamic Braking', codeTitle: 'ESTOP_BRAKE.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Short motor leads to GND to generate electromagnetic braking torque.', theorySummary: 'Dynamic braking uses back-EMF current to halt rotation within 50ms.', steps: ['Assert active brake'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-19-les-4', lessonIndex: 4, globalIndex: 76, title: 'Differential Skid-Steer Kinematics', codeTitle: 'SKID_STEER.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Compute left and right wheel velocities for turning arcs.', theorySummary: 'V_left = V - (omega * L / 2), V_right = V + (omega * L / 2).', steps: ['Calculate differential wheel speeds'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-20', number: 20, code: 'LAB 20', title: 'MPU-6050 6-DOF IMU SENSOR FUSION', category: 'TRANSDUCERS', subtitle: 'MEMS Accelerometer & Gyroscope Complementary Filter Matrix',
    summary: 'Track 3D pitch and roll angles in real time combining accelerometer gravity vectors and gyro rates.',
    bom: [{ partNumber: 'SEN-MPU-6050', designator: 'U9', description: '6-Axis MEMS MotionTracking Device (I2C 0x68)', package: 'QFN-24 Module', operatingVoltage: '3.3V - 5.0V DC' }],
    pinout: [{ pin: 'A4', name: 'SDA', direction: 'BUS', signal: 'IMU_SDA', hardwareDestination: 'MPU-6050 SDA' }, { pin: 'A5', name: 'SCL', direction: 'BUS', signal: 'IMU_SCL', hardwareDestination: 'MPU-6050 SCL' }],
    lessons: [
      { id: 'lab-20-les-1', lessonIndex: 1, globalIndex: 77, title: 'Raw Accelerometer Gravity Trigonometry', codeTitle: 'ACCEL_ANGLES.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Pitch = atan2(Ay, Az) * 180 / PI.', theorySummary: 'Gravity vector gives absolute steady-state pitch and roll references.', steps: ['Read raw Accel registers', 'Calculate atan2 angles'], defaultFiles: { 'sketch.ino': `#include <Wire.h>\nvoid setup() { Wire.begin(); Serial.begin(115200); }\nvoid loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define MPU_ADDR 0x68\n` } },
      { id: 'lab-20-les-2', lessonIndex: 2, globalIndex: 78, title: 'Gyroscope Angular Velocity Integration', codeTitle: 'GYRO_INTEGRATE.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Integrate angular rate: angle += gyroRate * dt.', theorySummary: 'Gyroscopes provide fast, noise-free response but suffer from DC drift.', steps: ['Integrate deg/sec over delta time'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-20-les-3', lessonIndex: 3, globalIndex: 79, title: 'Complementary Sensor Fusion Filter (98/2)', codeTitle: 'COMPLEMENTARY_FILTER.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'angle = 0.98 * (angle + gyro * dt) + 0.02 * accelAngle.', theorySummary: 'Complementary filtering combines high-pass gyro and low-pass accel signals.', steps: ['Execute filter loop at 100Hz'], defaultFiles: { 'sketch.ino': `float pitch = 0;\nvoid loop() { /* 98/2 Complementary */ }`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-20-les-4', lessonIndex: 4, globalIndex: 80, title: '3D CAD Orientation Viewport Telemetry', codeTitle: 'CAD_IMU_SYNC.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Stream Euler angles to rotate 3D CAD model synchronously.', theorySummary: 'Real-time attitude orientation display.', steps: ['Stream JSON quaternion/Euler packet'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-21', number: 21, code: 'LAB 21', title: 'MFRC522 13.56MHz RFID SPI PROTOCOL', category: 'PROTOCOLS', subtitle: 'ISO/IEC 14443 Type A Proximity Card Identification & UID Authentication',
    summary: 'Authenticate 13.56MHz RFID cards over high-speed Serial Peripheral Interface (SPI).',
    bom: [{ partNumber: 'MOD-RC522-RFID', designator: 'U10', description: '13.56MHz RFID Card Reader & Keyfob (SPI)', package: 'PCB Antenna Module', operatingVoltage: '3.3V DC' }],
    pinout: [{ pin: 'D10', name: 'SS/SDA', direction: 'OUTPUT', signal: 'SPI_SLAVE_SELECT', hardwareDestination: 'RC522 SDA' }, { pin: 'D11', name: 'MOSI', direction: 'BUS', signal: 'SPI_MOSI', hardwareDestination: 'RC522 MOSI' }, { pin: 'D12', name: 'MISO', direction: 'BUS', signal: 'SPI_MISO', hardwareDestination: 'RC522 MISO' }, { pin: 'D13', name: 'SCK', direction: 'BUS', signal: 'SPI_CLOCK', hardwareDestination: 'RC522 SCK' }],
    lessons: [
      { id: 'lab-21-les-1', lessonIndex: 1, globalIndex: 81, title: 'SPI 4-Wire Master-Slave Bus Architecture', codeTitle: 'RC522_INIT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'MOSI, MISO, SCK, and active-low Chip Select (SS).', theorySummary: 'SPI transfers full-duplex synchronous data up to 4MHz on ATmega328P.', steps: ['Initialize SPI controller', 'Assert CS low'], defaultFiles: { 'sketch.ino': `#include <SPI.h>\nvoid setup() { SPI.begin(); Serial.begin(115200); }\nvoid loop() {}`, 'diagram.json': `{}`, 'pins.h': `#define RFID_SS 10\n#define RFID_RST 9\n` } },
      { id: 'lab-21-les-2', lessonIndex: 2, globalIndex: 82, title: '4-Byte Unique Identifier (UID) Extraction', codeTitle: 'UID_READER.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Capture 32-bit hardware UID byte array: [0xA3, 0x4B, 0x12, 0xF9].', theorySummary: 'Every RFID tag carries a factory laser-burned unique serial number.', steps: ['Read 4-byte serial array'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-21-les-3', lessonIndex: 3, globalIndex: 83, title: 'Access Control Security Interlock', codeTitle: 'ACCESS_AUTH.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Compare UID against authorized master key array.', theorySummary: 'Match unlocks servo deadbolt and signals green LED.', steps: ['Authorize matching UID'], defaultFiles: { 'sketch.ino': `byte masterUID[4] = { 0xA3, 0x4B, 0x12, 0xF9 }; void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-21-les-4', lessonIndex: 4, globalIndex: 84, title: '1KB MIFARE Classic Sector Read/Write', codeTitle: 'MIFARE_SECTOR.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Authenticate Crypto-1 keys and write data blocks.', theorySummary: 'Sectors are protected by Key A and Key B passwords.', steps: ['Write custom data block'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  },
  {
    id: 'lab-22', number: 22, code: 'LAB 22', title: 'ESP8266 UART AT COMMANDS & MQTT CLOUD', category: 'PROTOCOLS', subtitle: 'UART AT Parser & Publish-Subscribe Telemetry Architecture',
    summary: 'Connect Arduino Uno to local 2.4GHz WiFi networks and publish live sensor telemetry to MQTT cloud brokers.',
    bom: [{ partNumber: 'MOD-ESP-01S', designator: 'U11', description: 'ESP8266 WiFi SoC Module with 1MB Flash', package: '2x4 Header Module', operatingVoltage: '3.3V DC (80mA peak)' }],
    pinout: [{ pin: 'D2', name: 'SOFT_RX', direction: 'INPUT', signal: 'UART_RX', hardwareDestination: 'ESP8266 TX' }, { pin: 'D3', name: 'SOFT_TX', direction: 'OUTPUT', signal: 'UART_TX', hardwareDestination: 'ESP8266 RX via Divider' }],
    lessons: [
      { id: 'lab-22-les-1', lessonIndex: 1, globalIndex: 85, title: 'Hayes AT Command State Machine Parser', codeTitle: 'ESP_AT_TEST.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Send "AT" and verify "OK" response at 9600 baud.', theorySummary: 'Hayes AT protocol controls modems and embedded wireless coprocessors.', steps: ['Initialize SoftwareSerial', 'Send AT\\r\\n', 'Assert OK response'], defaultFiles: { 'sketch.ino': `#include <SoftwareSerial.h>\nSoftwareSerial esp(2, 3);\nvoid setup() { Serial.begin(115200); esp.begin(9600); esp.println("AT"); }\nvoid loop() { if (esp.available()) Serial.write(esp.read()); }`, 'diagram.json': `{}`, 'pins.h': `#define ESP_RX 2\n#define ESP_TX 3\n` } },
      { id: 'lab-22-les-2', lessonIndex: 2, globalIndex: 86, title: 'WPA2 WiFi Station Associate (AT+CWJAP)', codeTitle: 'WIFI_CONNECT.INO', difficulty: 'LEVEL 2', completed: false, learningObjective: 'Associate with access point and obtain local DHCP IPv4 address.', theorySummary: 'AT+CWJAP negotiates WPA2 handshake with wireless router.', steps: ['Send AT+CWJAP="SSID","PASS"'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-22-les-3', lessonIndex: 3, globalIndex: 87, title: 'TCP Socket Client Handshake (AT+CIPSTART)', codeTitle: 'TCP_SOCKET.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Open raw TCP socket to port 1883 or HTTP port 80.', theorySummary: 'Establishes three-way TCP SYN/ACK handshake.', steps: ['Open TCP connection to cloud'], defaultFiles: { 'sketch.ino': `void setup() {} void loop() {}`, 'diagram.json': `{}`, 'pins.h': `` } },
      { id: 'lab-22-les-4', lessonIndex: 4, globalIndex: 88, title: 'JSON MQTT Sensor Payload Publishing', codeTitle: 'MQTT_TELEMETRY.INO', difficulty: 'LEVEL 3', completed: false, learningObjective: 'Publish structured telemetry payload: {"temp": 24.5, "lux": 420}.', theorySummary: 'Lightweight MQTT protocol minimizes bandwidth in remote telemetry stations.', steps: ['Publish JSON string', 'Verify message received in broker'], defaultFiles: { 'sketch.ino': `// Capstone Lesson 88: Complete MQTT IoT Station\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(F("[SYSTEM] Lab 22 Capstone Initialized."));\n}\nvoid loop() {\n  // Publish telemetry every 5000ms\n  delay(5000);\n}`, 'diagram.json': `{}`, 'pins.h': `` } }
    ]
  }
];

export const TOTAL_LABS = CURRICULUM_DATA.length; // 22
export const TOTAL_LESSONS = CURRICULUM_DATA.reduce((acc, lab) => acc + lab.lessons.length, 0); // 88

export const LAB_INDEX_TO_STORE_ID: Record<string, string> = {
  'lab-01': 'led',
  'lab-02': 'servo',
  'lab-03': 'button',
  'lab-04': 'pot',
  'lab-05': 'buzzer',
  'lab-06': 'cad',
  'lab-07': 'dmm',
  'lab-08': 'ldr',
  'lab-09': 'rgb',
  'lab-10': 'temp',
  'lab-11': 'sonar',
  'lab-12': 'ir',
  'lab-13': 'slicer',
  'lab-14': 'dht',
  'lab-15': 'gas',
  'lab-16': 'lcd',
  'lab-17': 'oled',
  'lab-18': 'soil',
  'lab-19': 'motor',
  'lab-20': 'imu',
  'lab-21': 'rfid',
  'lab-22': 'iot'
};

export const STORE_ID_TO_LAB_INDEX: Record<string, string> = Object.entries(LAB_INDEX_TO_STORE_ID).reduce(
  (acc, [k, v]) => {
    acc[v] = k;
    return acc;
  },
  {} as Record<string, string>
);

// ─── SYNCHRONIZE STARTER CODE & PINS ACROSS ALL 22 LABS & 88 LESSONS ─────────────
import { STARTER_SKETCHES, LAB_PINS } from './starterSketches';

CURRICULUM_DATA.forEach((lab) => {
  const storeLabKey = LAB_INDEX_TO_STORE_ID[lab.id];
  const labSketches = storeLabKey ? STARTER_SKETCHES[storeLabKey] : undefined;
  const labPins = storeLabKey ? LAB_PINS[storeLabKey] : undefined;
  lab.lessons.forEach((lesson) => {
    if (labSketches && labSketches[lesson.lessonIndex]) {
      lesson.defaultFiles['sketch.ino'] = labSketches[lesson.lessonIndex];
    }
    if (labPins) {
      lesson.defaultFiles['pins.h'] = labPins;
    }
  });
});


