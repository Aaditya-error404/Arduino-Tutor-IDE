---
name: arduino-simulation-engine
description: >-
  Deep technical playbook for the virtual ATmega328P microcontroller simulation engine,
  Arduino C++ compiler/lexer, virtual clock cycle stepper, and 22 sensor/actuator hardware circuits.
  Activate when modifying compiler.ts, avrCompiler.ts, virtualClock.ts, HardwareStage.tsx,
  or any of the 22 interactive lab simulation loops in SparkByte Studio v2.
---

# Arduino Simulation & Virtual Hardware Engine Skill

## Overview
SparkByte Studio v2 simulates an **ATmega328P (16 MHz, 5V CMOS)** microcontroller entirely client-side in the browser. It translates student C++ into simulated execution steps, clocks them against physical milliseconds, and animates SVG/Canvas breadboard circuits with zero external server dependencies.

---

## 1. Engine Architecture & Execution Loop

```
Monaco C++ Code
      │
      ▼
[compiler.ts / avrCompiler.ts] ──► CompiledProgram { setupSteps[], loopSteps[], vars{} }
      │
      ▼
[virtualClock.ts] ───────────────► Ticks deltaMs (10ms steps at 1x–10x speed)
      │
      ▼
[useWorkbenchStore.onClockTick] ─► Evaluates step (pinMode, digitalWrite, analogWrite, delay)
      │
      ▼
[HardwareState] ─────────────────► Mutates pins, servo angles, PWM duties, virtual registers
      │
      ▼
[HardwareStage.tsx] ─────────────► Real-time SVG/Canvas actuation & Oscilloscope waveform
```

---

## 2. Compiler & C++ Syntax Invariants

When modifying `src/engine/compiler.ts` or `src/engine/avrCompiler.ts`:

1. **Parenthesis-Balanced Argument Extraction:**
   Never use greedy or naive `([^)]+)` regexes on nested Arduino calls like `analogWrite(6, constrain(val, 0, 255))`. Always use balanced parenthesis matchers to avoid premature truncation at inner `)`.
2. **Global Variable & Array Hoisting:**
   All global declarations (`int pin = 13;`, `byte MASTER_UID[] = {0xA3, ...}`) MUST hoist into `vars` during phase 0 *before* `setupSteps` execute.
3. **Hexadecimal & Sized Array Parsing:**
   Array matchers must support explicit brackets (`byte UID[4] = {...}`) and parse tokens with `Number(token.trim())` so hex values (`0xA3` -> `163`) do not evaluate to `0`.
4. **Hardware PWM Timer Pin Restrictions (ATmega328P):**
   Only pins with timer compare channels support PWM (`analogWrite`):
   - **Valid PWM Pins:** `3, 5, 6, 9, 10, 11`
   - **Pure Digital Pins:** `2, 4, 7, 8, 12, 13`
   - **Analog In Pins:** `A0, A1, A2, A3, A4, A5` (10-bit ADC, 0–1023)

---

## 3. Circuit & Actuator Invariants

1. **Active-LOW Optocoupled Relays (`soil`, `motor`):**
   Industrial ATL relay modules use optocoupler isolation where `LOW (0V)` energizes the coil (PUMP ON) and `HIGH (+5V)` de-energizes it (PUMP OFF). Ensure `hardwareState.ledOn = (val === 0)` for active-LOW pins.
2. **Animation vs. Simulation Synchronization:**
   Actuators (fans, pumps, servos, DC motors, buzzer sound) MUST be gated strictly on:
   ```typescript
   const isActuated = isRunning && hardwareConditionMet;
   ```
   Never allow raw slider dragging to animate actuators when `isRunning === false` (prevent Slider-Bypass and Idle-Freeze bugs).
3. **Sensor-to-Code Telemetry Loop:**
   - LM35/TMP36: `Vout = (raw / 1023.0) * 5.0; tempC = (Vout - 0.5) * 100.0;`
   - HC-SR04 Sonar: `distanceCm = pulseDurationUs / 58.2;`
   - Soil Moisture: `moisturePct = map(raw, 1023, 0, 0, 100);` (Dry = 1023, Wet = 0)
   - LDR: `lightLux = map(raw, 0, 1023, 0, 1000);`
