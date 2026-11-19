/**
 * Centralized Deterministic Workbench Zustand Store
 * Manages simulation state, hardware registers, execution pointers, oscilloscope buffers,
 * student curriculum progress persistence, and cycle-accurate AVR emulation.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */
import { create } from 'zustand';
import { HardwareState, InstructionNode, ScopeBufferPoint } from '../types/curriculum';
import { LAB_MAP } from '../data/lessons';
import { compileProgram, CompiledProgram, evaluateExpression, VariableValue } from '../engine/compiler';
import { globalVirtualClock } from '../engine/virtualClock';
import { getAVRRunner } from '../engine/avrRunner';
import { buzzerAudio } from '../engine/audioEngine';

export const MAX_LOOP_STEPS = 10000;

function createEmptyOledBuffer(): boolean[][] {
  const buf: boolean[][] = [];
  for (let r = 0; r < 64; r++) {
    buf.push(new Array(128).fill(false));
  }
  return buf;
}

const INITIAL_HARDWARE_STATE: HardwareState = {
  activeLab: 'servo',
  voltage: 5.0,
  currentMa: 45.0,

  ledOn: false,
  ledPin: 13,
  ledColor: '#ef4444',
  pwmDuty: 0,

  servoAngle: 90,
  servoTargetAngle: 90,
  servoPulseWidthMs: 1.5,
  servoAttached: true,
  servoMoving: false,

  buttonPressed: false,
  potVal: 512,
  ldrRaw: 450,

  buzzerActive: false,
  buzzerToneFreq: 0,

  temperatureC: 24.5,
  humidityPct: 50.0,
  distanceCm: 25.0,
  gasPpm: 120,
  soilMoisturePct: 42.0,
  irReflectRaw: 650,

  motorSpeed: 0,
  motorDirection: 'FORWARD',

  rgbR: 255,
  rgbG: 120,
  rgbB: 0,

  fanActive: false,
  fanSpeed: 0,
  relayActive: false,

  lcdRow: 0,
  lcdTextRow0: 'SparkByte Studio',
  lcdTextRow1: 'System Ready',
  oledBuffer: createEmptyOledBuffer(),
  cadModel: { x: 40, y: 30, z: 20, holeR: 5 },
  slicerState: {
    layer: 45,
    maxLayers: 250,
    nozzleX: 105,
    nozzleY: 105,
    nozzleZ: 9.0,
    isExtruding: true,
    toolpaths: []
  },
  imuPitch: 0,
  imuRoll: 0,
  rfidScannedUid: null,
  rfidAuthorized: false,
  iotConnected: true,
  iotPacketsSent: 12,
  iotPayload: '{"temp": 24.5, "lux": 450, "status": "ONLINE"}',
  pinStates: { 13: false, 2: true, 9: false, 10: false, 11: false },
  pwmStates: {}
};

function loadStoredProgress(): string[] {
  try {
    const raw = localStorage.getItem('sparkbyte_progress');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore localStorage parse errors
  }
  return [];
}

function saveStoredProgress(progress: string[]): void {
  try {
    localStorage.setItem('sparkbyte_progress', JSON.stringify(progress));
  } catch {
    // Ignore quota errors
  }
}

interface WorkbenchStore {
  // Navigation & Content
  activeLabId: string;
  activeLessonId: number; // 1..4
  activeDeskView: 'lab' | 'concept';
  activeDockTab: 'scope' | 'serial' | 'coach';
  teacherMode: boolean;
  explorerModalOpen: boolean;
  aboutModalOpen: boolean;

  // Floating HUD Workbench State
  lessonGuideOpen: boolean;
  codeHudOpen: boolean;
  codeHudMode: 'cpp' | 'split';
  diagnosticDockOpen: boolean;
  aiCoachOpen: boolean;

  // Student Progress
  completedLessons: string[]; // e.g. "servo-1", "led-2"

  // Code & Compilation
  customCode: string | null;
  compiled: CompiledProgram;

  // Simulation Engine State
  vars: Record<string, VariableValue>;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  loopCount: number;
  stepIndex: number;
  activePhase: 'setup' | 'loop';
  activeLineIndex: number;
  activeInstruction: InstructionNode | null;
  stepRemainingDelayMs: number;

  // Hardware State
  hardwareState: HardwareState;
  scopeBuffer: ScopeBufferPoint[];

  // Web Serial Telemetry
  serialConnected: boolean;
  serialLogs: string[];

  // Watchdog & Sandbox Hardening State
  totalExecutedSteps: number;
  watchdogTripped: boolean;
  watchdogError: string | null;
  resetWatchdog: () => void;

  // Actions
  setActiveLab: (labId: string) => void;
  setActiveLesson: (lessonId: number) => void;
  setActiveDeskView: (view: 'lab' | 'concept') => void;
  setActiveDockTab: (tab: 'scope' | 'serial' | 'coach') => void;
  toggleTeacherMode: () => void;
  setExplorerModalOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  setLessonGuideOpen: (open: boolean) => void;
  toggleLessonGuide: () => void;
  setCodeHudOpen: (open: boolean) => void;
  setCodeHudMode: (mode: 'cpp' | 'split') => void;
  setDiagnosticDockOpen: (open: boolean) => void;
  setAiCoachOpen: (open: boolean) => void;
  markLessonComplete: (labId: string, lessonId: number) => void;
  setCustomCode: (code: string | null) => void;
  setCode: (code: string | null) => void;

  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;

  updateHardwareState: (partial: Partial<HardwareState>) => void;
  setSerialConnected: (connected: boolean) => void;
  addSerialLog: (log: string) => void;

  // Internal clock tick
  onClockTick: (deltaMs: number, virtualTime: number) => void;
}

function extractInitialVars(compiled: CompiledProgram, hw: HardwareState): Record<string, VariableValue> {
  const vars: Record<string, VariableValue> = {};
  for (const step of compiled.setupSteps) {
    if (step.type === 'varDecl' && step.varName) {
      if (step.value && typeof step.value === 'string' && step.value.startsWith('[')) {
        try { vars[step.varName] = JSON.parse(step.value); } catch { vars[step.varName] = []; }
      } else if (step.expr) {
        vars[step.varName] = evaluateExpression(step.expr, vars, hw);
      } else if (step.value !== undefined) {
        vars[step.varName] = step.value;
      }
    }
  }
  return vars;
}

export const useWorkbenchStore = create<WorkbenchStore>((set, get) => {
  const initialLab = LAB_MAP['servo'] || Object.values(LAB_MAP)[0];
  const initialLesson = initialLab.lessons[0];
  const initialCompiled = compileProgram(initialLesson.defaultCode.cpp, initialLesson.defaultCode.human);
  const initialHw: HardwareState = {
    ...INITIAL_HARDWARE_STATE,
    activeLab: initialLab.id
  };
  const initialVars = extractInitialVars(initialCompiled, initialHw);

  // Subscribe virtual clock to store tick
  globalVirtualClock.subscribe((deltaMs, virtualTime) => {
    get().onClockTick(deltaMs, virtualTime);
  });

  // Setup AVR runner USART TX listener
  let serialTextBuffer = '';
  const runner = getAVRRunner();
  runner.onUsartTx((byte) => {
    const char = String.fromCharCode(byte);
    if (char === '\n') {
      get().addSerialLog(serialTextBuffer);
      serialTextBuffer = '';
    } else if (char !== '\r') {
      serialTextBuffer += char;
    }
  });

  return {
    activeLabId: initialLab.id,
    activeLessonId: 1,
    activeDeskView: 'lab',
    activeDockTab: 'scope',
    teacherMode: false,
    explorerModalOpen: false,
    aboutModalOpen: false,

    // Floating HUD State
    lessonGuideOpen: false,
    codeHudOpen: true,
    codeHudMode: 'cpp',
    diagnosticDockOpen: false,
    aiCoachOpen: false,

    completedLessons: loadStoredProgress(),

    customCode: null,
    compiled: initialCompiled,

    vars: initialVars,
    isRunning: false,
    isPaused: false,
    speed: 1.0,
    loopCount: 0,
    stepIndex: 0,
    activePhase: 'setup',
    activeLineIndex: 0,
    activeInstruction: null,
    stepRemainingDelayMs: 0,

    hardwareState: initialHw,
    scopeBuffer: [],

    serialConnected: false,
    serialLogs: [],

    totalExecutedSteps: 0,
    watchdogTripped: false,
    watchdogError: null,
    resetWatchdog: () => set({ totalExecutedSteps: 0, watchdogTripped: false, watchdogError: null }),

    setActiveLab: (labId: string) => {
      const lab = LAB_MAP[labId];
      if (!lab) return;

      buzzerAudio.stopTone();
      const lesson = lab.lessons[0];
      const compiled = compileProgram(lesson.defaultCode.cpp, lesson.defaultCode.human);

      globalVirtualClock.reset();
      getAVRRunner().reset();

      const initialHw: HardwareState = {
        ...INITIAL_HARDWARE_STATE,
        activeLab: labId,
        buzzerActive: false,
        buzzerToneFreq: 0
      };
      const initialVars = extractInitialVars(compiled, initialHw);

      set({
        activeLabId: labId,
        activeLessonId: 1,
        customCode: null,
        compiled,
        vars: initialVars,
        isRunning: false,
        isPaused: false,
        loopCount: 0,
        stepIndex: 0,
        activePhase: 'setup',
        activeLineIndex: 0,
        activeInstruction: null,
        stepRemainingDelayMs: 0,
        hardwareState: initialHw,
        scopeBuffer: [],
        totalExecutedSteps: 0,
        watchdogTripped: false,
        watchdogError: null
      });
    },

    setActiveLesson: (lessonId: number) => {
      const lab = LAB_MAP[get().activeLabId];
      if (!lab) return;

      buzzerAudio.stopTone();
      const clampedId = Math.max(1, Math.min(lab.lessons.length, lessonId));
      const lesson = lab.lessons[clampedId - 1] || lab.lessons[0];
      const compiled = compileProgram(lesson.defaultCode.cpp, lesson.defaultCode.human);

      globalVirtualClock.reset();
      getAVRRunner().reset();

      const currentHw = { ...get().hardwareState, buzzerActive: false, buzzerToneFreq: 0 };
      const initialVars = extractInitialVars(compiled, currentHw);

      set({
        activeLessonId: clampedId,
        customCode: null,
        compiled,
        vars: initialVars,
        isRunning: false,
        isPaused: false,
        loopCount: 0,
        stepIndex: 0,
        activePhase: 'setup',
        activeLineIndex: 0,
        activeInstruction: null,
        stepRemainingDelayMs: 0,
        hardwareState: currentHw,
        scopeBuffer: [],
        totalExecutedSteps: 0,
        watchdogTripped: false,
        watchdogError: null
      });
    },

    setActiveDeskView: (view) => set({ activeDeskView: view }),
    setActiveDockTab: (tab) => set({ activeDockTab: tab }),
    toggleTeacherMode: () => set((s) => ({ teacherMode: !s.teacherMode })),
    setExplorerModalOpen: (open) => set({ explorerModalOpen: open }),
    setAboutModalOpen: (open) => set({ aboutModalOpen: open }),
    setLessonGuideOpen: (open) => set({ lessonGuideOpen: open }),
    toggleLessonGuide: () => set((s) => ({ lessonGuideOpen: !s.lessonGuideOpen })),
    setCodeHudOpen: (open) => set({ codeHudOpen: open }),
    setCodeHudMode: (mode) => set({ codeHudMode: mode }),
    setDiagnosticDockOpen: (open) => set({ diagnosticDockOpen: open }),
    setAiCoachOpen: (open) => set({ aiCoachOpen: open }),

    markLessonComplete: (labId: string, lessonId: number) => {
      const key = `${labId}-${lessonId}`;
      const { completedLessons } = get();
      if (!completedLessons.includes(key)) {
        const next = [...completedLessons, key];
        saveStoredProgress(next);
        set({ completedLessons: next });
      }
    },

    setCustomCode: (code) => {
      const { activeLabId, activeLessonId } = get();
      const lab = LAB_MAP[activeLabId];
      const lesson = lab?.lessons[activeLessonId - 1];
      const human = lesson ? lesson.defaultCode.human : '';
      const compiled = compileProgram(code || lesson?.defaultCode.cpp || '', human);
      const initialVars = extractInitialVars(compiled, get().hardwareState);
      set({
        customCode: code,
        compiled,
        vars: initialVars,
        stepIndex: 0,
        activePhase: compiled.setupSteps.length > 0 ? 'setup' : 'loop',
        stepRemainingDelayMs: 0,
        totalExecutedSteps: 0,
        watchdogTripped: false,
        watchdogError: null
      });
    },

    setCode: (code) => {
      get().setCustomCode(code);
    },

    startSimulation: () => {
      globalVirtualClock.start();
      const avr = getAVRRunner();
      avr.setSpeed(get().speed);
      avr.start();

      set({
        isRunning: true,
        isPaused: false,
        stepRemainingDelayMs: 0
      });
    },

    pauseSimulation: () => {
      globalVirtualClock.pause();
      getAVRRunner().pause();
      set({ isPaused: true });
    },

    resumeSimulation: () => {
      globalVirtualClock.resume();
      getAVRRunner().resume();
      set({ isPaused: false });
    },

    resetSimulation: () => {
      buzzerAudio.stopTone();
      globalVirtualClock.reset();
      getAVRRunner().reset();

      const { activeLabId, compiled } = get();
      const initialHw: HardwareState = {
        ...INITIAL_HARDWARE_STATE,
        activeLab: activeLabId,
        buzzerActive: false,
        buzzerToneFreq: 0
      };
      const initialVars = extractInitialVars(compiled, initialHw);
      set({
        vars: initialVars,
        isRunning: false,
        isPaused: false,
        loopCount: 0,
        stepIndex: 0,
        activePhase: 'setup',
        activeLineIndex: 0,
        activeInstruction: null,
        stepRemainingDelayMs: 0,
        hardwareState: initialHw,
        scopeBuffer: [],
        totalExecutedSteps: 0,
        watchdogTripped: false,
        watchdogError: null
      });
    },

    stepSimulation: () => {
      const state = get();
      if (!state.isRunning) {
        set({ isRunning: true, isPaused: true });
      }
      getAVRRunner().stepOne();
      get().onClockTick(100, globalVirtualClock.getVirtualTime());
    },

    setSpeed: (speed) => {
      globalVirtualClock.setSpeed(speed);
      getAVRRunner().setSpeed(speed);
      set({ speed });
    },

    updateHardwareState: (partial) => {
      const avr = getAVRRunner();
      // Synchronize input pins & ADC channels with AVR CPU
      if (partial.buttonPressed !== undefined) {
        avr.setInputPin(2, !partial.buttonPressed); // Active-low pullup on D2
      }
      if (partial.potVal !== undefined) {
        avr.setADCValue(0, partial.potVal); // Channel A0
      }
      if (partial.temperatureC !== undefined) {
        const adcV = Math.max(0, Math.min(1023, Math.round(((partial.temperatureC * 0.01 + 0.5) / 5.0) * 1023)));
        avr.setADCValue(0, adcV); // Channel A0 (TMP36)
      }
      if (partial.ldrRaw !== undefined) {
        avr.setADCValue(0, partial.ldrRaw); // Channel A0 (LDR)
      }
      if (partial.soilMoisturePct !== undefined) {
        const adcV = Math.max(0, Math.min(1023, Math.round((partial.soilMoisturePct / 100.0) * 1023)));
        avr.setADCValue(1, adcV); // Channel A1 (Soil Moisture)
      }
      if (partial.gasPpm !== undefined) {
        const adcV = Math.max(0, Math.min(1023, Math.round((partial.gasPpm / 800.0) * 1023)));
        avr.setADCValue(2, adcV); // Channel A2 (Gas)
      }
      if (partial.irReflectRaw !== undefined) {
        avr.setADCValue(3, partial.irReflectRaw); // Channel A3 (IR raw)
        avr.setInputPin(7, partial.irReflectRaw > 500); // Digital D7
      }
      if (partial.distanceCm !== undefined) {
        avr.setInputPin(12, partial.distanceCm < 15); // D12 Echo / hazard
      }

      set((s) => ({
        hardwareState: {
          ...s.hardwareState,
          ...partial
        }
      }));
    },

    setSerialConnected: (connected) => set({ serialConnected: connected }),
    addSerialLog: (log) => set((s) => ({ serialLogs: [...s.serialLogs.slice(-100), log] })),

    onClockTick: (deltaMs, virtualTime) => {
      const state = get();
      if (!state.isRunning || (state.isPaused && deltaMs <= 0) || state.watchdogTripped) return;

      const { compiled, hardwareState } = state;
      let remainingDelay = state.stepRemainingDelayMs - deltaMs;

      const newHw = { ...hardwareState };
      if (newHw.activeLab === 'imu') {
        if (newHw.imuPitch !== undefined) state.vars.fusedPitch = newHw.imuPitch;
        if (newHw.imuRoll !== undefined) state.vars.fusedRoll = newHw.imuRoll;
      }
      let newStepIdx = state.stepIndex;
      let newPhase = state.activePhase;
      let newLoopCount = state.loopCount;
      let activeInst = state.activeInstruction;
      let activeLine = state.activeLineIndex;
      let currentSteps = state.totalExecutedSteps || 0;

      // Check if we need to advance to next instruction
      if (remainingDelay <= 0) {
        currentSteps++;
        if (currentSteps > MAX_LOOP_STEPS) {
          globalVirtualClock.pause();
          buzzerAudio.stopTone();
          const alertMsg = 'Watchdog Alert: Execution halted. Sketch exceeded 10,000 steps without yielding. Check for runaway infinite loops (e.g. while(1) or for(;;) without delay).';
          get().addSerialLog(`[WATCHDOG HALT] ${alertMsg}`);
          set({
            isRunning: false,
            isPaused: true,
            totalExecutedSteps: currentSteps,
            watchdogTripped: true,
            watchdogError: alertMsg
          });
          return;
        }

        const pool = newPhase === 'setup' ? compiled.setupSteps : compiled.loopSteps;

        if (pool.length === 0) {
          if (newPhase === 'setup') {
            newPhase = 'loop';
            newStepIdx = 0;
          }
        } else if (newStepIdx < pool.length) {
          const inst = pool[newStepIdx];
          activeInst = inst;
          activeLine = inst.lineIndex;

          let instBaseDuration = 60;

          // 1. Control flow: IF
          if (inst.type === 'if') {
            const condResult = evaluateExpression(inst.condition || '0', state.vars, newHw);
            if (!condResult) {
              // Condition false: jump past matching branch
              newStepIdx = inst.jumpIndex !== undefined ? inst.jumpIndex : newStepIdx + 1;
              remainingDelay = 20;
            } else {
              // Condition true: step to next line inside if
              newStepIdx++;
              remainingDelay = 30;
            }
          }
          // 2. Control flow: ELSE
          else if (inst.type === 'else') {
            // Reached else after completing true branch of if: jump past else
            newStepIdx = inst.jumpIndex !== undefined ? inst.jumpIndex : newStepIdx + 1;
            remainingDelay = 20;
          }
          // 3. Control flow: ENDIF / HEADER / RETURN
          else if (inst.type === 'return') {
            if (newPhase === 'setup') {
              newPhase = 'loop';
              newStepIdx = 0;
            } else {
              newLoopCount++;
              newStepIdx = 0;
            }
            remainingDelay = 40;
          }
          else if (inst.type === 'endif' || inst.type === 'header') {
            newStepIdx++;
            remainingDelay = 30;
          }
          // 4. Delay instruction
          else if (inst.type === 'delay') {
            const delayExpr = inst.expr || String(inst.durationMs || 1000);
            const delayVal = Number(evaluateExpression(delayExpr, state.vars, newHw));
            instBaseDuration = isNaN(delayVal) || !isFinite(delayVal) || delayVal <= 0 ? 1000 : Math.min(delayVal, 30000);
            remainingDelay = instBaseDuration;
            newStepIdx++;
          }
          // 5. Variable declaration / Assignment
          else if (inst.type === 'varDecl' && inst.varName) {
            if (inst.value && typeof inst.value === 'string' && inst.value.startsWith('[')) {
              try { state.vars[inst.varName] = JSON.parse(inst.value); } catch { state.vars[inst.varName] = []; }
            } else {
              const val = evaluateExpression(inst.expr || '0', state.vars, newHw);
              state.vars[inst.varName] = val;
            }
            newStepIdx++;
            remainingDelay = 40;
          }
          else if (inst.type === 'assignment' && inst.varName) {
            const val = evaluateExpression(inst.expr || '0', state.vars, newHw);
            if (inst.param === '+=') {
              state.vars[inst.varName] = Number(state.vars[inst.varName] || 0) + Number(val);
            } else if (inst.param === '-=') {
              state.vars[inst.varName] = Number(state.vars[inst.varName] || 0) - Number(val);
            } else {
              state.vars[inst.varName] = val;
            }
            newStepIdx++;
            remainingDelay = 40;
          }
          // 6. Hardware / Peripheral instructions
          else {
            applyInstructionToHardware(inst, newHw, state.vars, (log) => get().addSerialLog(log));
            newStepIdx++;
            remainingDelay = 60;
          }
        } else {
          // Phase complete
          if (newPhase === 'setup') {
            newPhase = 'loop';
            newStepIdx = 0;
            remainingDelay = 40;
          } else {
            newLoopCount++;
            newStepIdx = 0;
            remainingDelay = 40;
            get().markLessonComplete(state.activeLabId, state.activeLessonId);
          }
        }
      }

      // Generate real-time oscilloscope trace point
      const ch1Volt = computeScopeCh1(newHw, virtualTime);
      const ch2Volt = computeScopeCh2(newHw, virtualTime);

      const newPoint: ScopeBufferPoint = {
        t: virtualTime,
        ch1: ch1Volt,
        ch2: ch2Volt
      };

      const maxScopePoints = 120;
      const updatedScope = [...state.scopeBuffer.slice(-(maxScopePoints - 1)), newPoint];

      set({
        hardwareState: newHw,
        stepIndex: newStepIdx,
        activePhase: newPhase,
        loopCount: newLoopCount,
        activeInstruction: activeInst,
        activeLineIndex: activeLine,
        stepRemainingDelayMs: remainingDelay,
        scopeBuffer: updatedScope,
        totalExecutedSteps: currentSteps
      });
    }
  };
});

function applyInstructionToHardware(
  inst: InstructionNode,
  hw: HardwareState,
  vars: Record<string, VariableValue>,
  addSerial: (log: string) => void
): void {
  let pin: number;
  if (typeof inst.pin === 'number') {
    pin = inst.pin;
  } else if (inst.pin !== undefined && inst.pin !== null) {
    const rawPin = String(inst.pin).trim();
    if (vars[rawPin] !== undefined && typeof vars[rawPin] === 'number') {
      pin = vars[rawPin] as number;
    } else {
      const u = rawPin.toUpperCase();
      if (u === 'A0' || u === '14') pin = 14;
      else if (u === 'A1' || u === '15') pin = 15;
      else if (u === 'A2' || u === '16') pin = 16;
      else if (u === 'A3' || u === '17') pin = 17;
      else if (u === 'A4' || u === '18') pin = 18;
      else if (u === 'A5' || u === '19') pin = 19;
      else if (u === 'LED_BUILTIN') pin = 13;
      else {
        const evalPin = evaluateExpression(rawPin, vars, hw);
        if (typeof evalPin === 'number' && !isNaN(evalPin)) {
          pin = evalPin;
        } else {
          pin = parseInt(rawPin, 10);
        }
      }
    }
  } else {
    pin = NaN;
  }

  // Validate Arduino Uno Pin Range: 0..19 (D0..D13 and A0..A5 mapped to 14..19)
  const isPinValid = !isNaN(pin) && pin >= 0 && pin <= 19;

  switch (inst.type) {
    case 'pinMode': {
      if (!isPinValid) {
        addSerial(`[Warning] Out-of-bounds pin ${pin} in pinMode(). Arduino Uno pins are 0-19.`);
        break;
      }
      if (hw.activeLab === 'led' && inst.param === 'OUTPUT' && typeof pin === 'number' && !isNaN(pin)) {
        hw.ledPin = pin;
      }
      break;
    }

    case 'digitalWrite': {
      if (!isPinValid) {
        addSerial(`[Warning] Out-of-bounds pin ${pin} in digitalWrite(). Arduino Uno pins are 0-19.`);
        break;
      }
      const exprVal = inst.expr !== undefined ? evaluateExpression(inst.expr, vars, hw) : (inst.value ? 1 : 0);
      const isHigh = Boolean(Number(exprVal) > 0 || exprVal === true || exprVal === 'HIGH');
      if (!hw.pinStates) hw.pinStates = {};
      hw.pinStates[pin] = isHigh;

      if (pin === 13 || pin === hw.ledPin || (hw.activeLab === 'led' && (hw.ledPin === undefined || hw.ledPin === 13))) {
        hw.ledOn = isHigh;
        hw.currentMa = isHigh ? 28.5 : 8.0;
      }
      // RGB Pins: 9 (Red), 10 (Green), 11 (Blue)
      if (pin === 9) hw.rgbR = isHigh ? 255 : 0;
      if (pin === 10) hw.rgbG = isHigh ? 255 : 0;
      if (pin === 11) hw.rgbB = isHigh ? 255 : 0;

      // Lab 10: Cooling fan on Pin 6
      if (pin === 6) hw.fanActive = isHigh;

      // Lab 18: Water pump relay on Pin 7 or 8 (Active-LOW optocoupled relay module)
      if (pin === 7 || pin === 8) {
        if (hw.activeLab === 'soil') {
          hw.relayActive = !isHigh; // Active-LOW: LOW = ON (pump running), HIGH = OFF
        } else {
          hw.relayActive = isHigh;
        }
      }

      // Lab 19: L298N Motor Pins IN1 (D4/D6), IN2 (D5/D4)
      if (pin === 4 || pin === 5 || pin === 6 || pin === 7) {
        if ((pin === 4 || pin === 6) && isHigh) {
          hw.motorDirection = 'FORWARD';
          if (hw.motorSpeed === 0) hw.motorSpeed = 200;
        } else if ((pin === 5 || pin === 7) && isHigh) {
          hw.motorDirection = 'BACKWARD';
          if (hw.motorSpeed === 0) hw.motorSpeed = 200;
        } else if (!isHigh && (pin === 4 || pin === 5)) {
          hw.motorDirection = 'BRAKE';
        }
      }

      // Buzzer pin D8 or D12
      if ((pin === 8 || pin === 12) && (hw.activeLab === 'buzzer' || hw.activeLab === 'gas' || hw.activeLab === 'sonar')) {
        hw.buzzerActive = isHigh;
        if (isHigh && (!hw.buzzerToneFreq || hw.buzzerToneFreq === 0)) {
          hw.buzzerToneFreq = 1500;
        }
      }

      // RFID Door Access: Pin 6 (Green LED / Latch Unlock), Pin 5 (Red LED / Alarm)
      if (hw.activeLab === 'rfid') {
        if (pin === 6 && isHigh) hw.rfidAuthorized = true;
        if (pin === 5 && isHigh) hw.rfidAuthorized = false;
      }
      break;
    }

    case 'analogWrite': {
      if (!isPinValid) {
        addSerial(`[Warning] Out-of-bounds pin ${pin} in analogWrite(). Arduino Uno pins are 0-19.`);
        break;
      }
      const exprVal = inst.expr !== undefined ? evaluateExpression(inst.expr, vars, hw) : Number(inst.value);
      const pwm = Math.max(0, Math.min(255, Math.round(Number(exprVal) || 0)));
      if (!hw.pwmStates) hw.pwmStates = {};
      hw.pwmStates[pin] = pwm;

      if (pin === 13 || pin === hw.ledPin || (hw.activeLab === 'led' && (hw.ledPin === undefined || hw.ledPin === 13))) {
        hw.pwmDuty = pwm;
        hw.ledOn = pwm > 0;
        hw.currentMa = 8.0 + (pwm / 255.0) * 20.5;
      }
      if (pin === 9) hw.rgbR = pwm;
      if (pin === 10) hw.rgbG = pwm;
      if (pin === 11) hw.rgbB = pwm;
      if (pin === 3 || pin === 5) {
        hw.motorSpeed = pwm;
      }
      if (pin === 6) {
        hw.fanSpeed = pwm;
        hw.fanActive = pwm > 0;
      }
      break;
    }

    case 'servoWrite': {
      const exprVal = inst.expr !== undefined ? evaluateExpression(inst.expr, vars, hw) : Number(inst.value);
      const num = Number(exprVal);
      const angle = Math.max(0, Math.min(180, Math.round(!isNaN(num) ? num : 90)));
      if (hw.activeLab === 'imu') {
        if (!inst.rawCpp.toLowerCase().includes('rollservo')) {
          hw.servoTargetAngle = angle;
          hw.servoAngle = angle;
        }
      } else {
        hw.servoTargetAngle = angle;
        hw.servoAngle = angle;
      }
      hw.servoPulseWidthMs = +(1.0 + (angle / 180.0) * 1.0).toFixed(2);
      hw.currentMa = 185.0;
      if (hw.activeLab === 'rfid') {
        hw.rfidAuthorized = angle > 45;
      }
      break;
    }

    case 'servoAttach':
      hw.servoAttached = true;
      break;

    case 'tone': {
      const freqVal = inst.expr !== undefined ? evaluateExpression(inst.expr, vars, hw) : Number(inst.value);
      const freq = Math.max(20, Math.min(10000, Math.round(Number(freqVal) || 440)));
      hw.buzzerActive = true;
      hw.buzzerToneFreq = freq;
      hw.currentMa = 22.5;
      break;
    }

    case 'noTone':
      hw.buzzerActive = false;
      hw.buzzerToneFreq = 0;
      hw.currentMa = 2.0;
      break;

    case 'lcd': {
      if (inst.param === 'clear') {
        hw.lcdTextRow0 = '';
        hw.lcdTextRow1 = '';
      } else if (inst.param && typeof inst.param === 'string' && inst.param.includes(',')) {
        const parts = inst.param.split(',');
        hw.lcdRow = parseInt(parts[1], 10) || 0;
      }
      if (inst.expr) {
        const text = String(evaluateExpression(inst.expr, vars, hw));
        const row = hw.lcdRow || 0;
        if (row === 0) hw.lcdTextRow0 = text;
        else hw.lcdTextRow1 = text;
      }
      break;
    }

    case 'cad': {
      if (inst.cadDims) {
        hw.cadModel = {
          x: inst.cadDims.x ?? hw.cadModel.x,
          y: inst.cadDims.y ?? hw.cadModel.y,
          z: inst.cadDims.z ?? hw.cadModel.z,
          holeR: inst.cadDims.holeR ?? hw.cadModel.holeR
        };
      }
      break;
    }

    case 'gcode': {
      if (inst.gcodeData) {
        const { x, y, z, e } = inst.gcodeData;
        const oldX = hw.slicerState.nozzleX;
        const oldY = hw.slicerState.nozzleY;
        const newX = x !== undefined ? x : oldX;
        const newY = y !== undefined ? y : oldY;
        const newZ = z !== undefined ? z : hw.slicerState.nozzleZ;
        const isExtruding = e !== undefined && e > 0;

        hw.slicerState = {
          ...hw.slicerState,
          nozzleX: newX,
          nozzleY: newY,
          nozzleZ: newZ,
          isExtruding,
          toolpaths: [
            ...hw.slicerState.toolpaths.slice(-40),
            { x1: oldX, y1: oldY, x2: newX, y2: newY, isExtruding }
          ]
        };
      }
      break;
    }

    case 'display': {
      if (inst.displayData) {
        const { cmd, x, y, x2, y2, w, h } = inst.displayData;
        if (cmd === 'clear') {
          hw.oledBuffer = createEmptyOledBuffer();
        } else if (cmd === 'pixel' && x !== undefined && y !== undefined) {
          if (y >= 0 && y < 64 && x >= 0 && x < 128) {
            hw.oledBuffer[y][x] = true;
          }
        } else if (cmd === 'line' && x !== undefined && y !== undefined && x2 !== undefined && y2 !== undefined) {
          let x0 = Math.round(x), y0 = Math.round(y), x1 = Math.round(x2), y1 = Math.round(y2);
          const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
          let err = dx - dy;
          while (true) {
            if (y0 >= 0 && y0 < 64 && x0 >= 0 && x0 < 128) hw.oledBuffer[y0][x0] = true;
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
          }
        } else if (cmd === 'rect' && x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
          for (let col = x; col < x + w && col < 128; col++) {
            if (y < 64) hw.oledBuffer[y][col] = true;
            if (y + h - 1 < 64) hw.oledBuffer[y + h - 1][col] = true;
          }
          for (let row = y; row < y + h && row < 64; row++) {
            if (x < 128) hw.oledBuffer[row][x] = true;
            if (x + w - 1 < 128) hw.oledBuffer[row][x + w - 1] = true;
          }
        } else if (cmd === 'circle' && x !== undefined && y !== undefined && inst.displayData.r !== undefined) {
          const r = inst.displayData.r;
          for (let angle = 0; angle < 360; angle += 4) {
            const rad = (angle * Math.PI) / 180;
            const px = Math.round(x + r * Math.cos(rad));
            const py = Math.round(y + r * Math.sin(rad));
            if (py >= 0 && py < 64 && px >= 0 && px < 128) hw.oledBuffer[py][px] = true;
          }
        } else if (cmd === 'fillCircle' && x !== undefined && y !== undefined && inst.displayData.r !== undefined) {
          const r = inst.displayData.r;
          for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
              if (dx * dx + dy * dy <= r * r) {
                const px = Math.round(x + dx);
                const py = Math.round(y + dy);
                if (py >= 0 && py < 64 && px >= 0 && px < 128) hw.oledBuffer[py][px] = true;
              }
            }
          }
        } else if (cmd === 'roundRect' && x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
          for (let col = x + 2; col < x + w - 2 && col < 128; col++) {
            if (y < 64) hw.oledBuffer[y][col] = true;
            if (y + h - 1 < 64) hw.oledBuffer[y + h - 1][col] = true;
          }
          for (let row = y + 2; row < y + h - 2 && row < 64; row++) {
            if (x < 128) hw.oledBuffer[row][x] = true;
            if (x + w - 1 < 128) hw.oledBuffer[row][x + w - 1] = true;
          }
        } else if (cmd === 'bitmap') {
          const bx = x !== undefined ? x : 10;
          const by = y !== undefined ? y : 10;
          const heartBmp = [0x00, 0x66, 0xff, 0xff, 0xff, 0x7e, 0x3c, 0x18];
          for (let rIdx = 0; rIdx < 8; rIdx++) {
            const rowVal = heartBmp[rIdx];
            for (let cIdx = 0; cIdx < 8; cIdx++) {
              if ((rowVal >> (7 - cIdx)) & 1) {
                const px = bx + cIdx;
                const py = by + rIdx;
                if (py >= 0 && py < 64 && px >= 0 && px < 128) hw.oledBuffer[py][px] = true;
              }
            }
          }
        }
      }
      break;
    }

    case 'serialInit': {
      const baud = inst.expr || '9600';
      addSerial(`[UART] Serial Port opened at ${baud} baud.`);
      break;
    }

    case 'wire': {
      hw.currentMa = Math.max(hw.currentMa, 22.0);
      break;
    }

    case 'eeprom': {
      if (inst.expr) {
        try {
          evaluateExpression(`EEPROM.write(${inst.expr})`, vars, hw);
        } catch {}
      }
      break;
    }

    case 'peripheral': {
      hw.currentMa = Math.max(hw.currentMa, 25.0);
      break;
    }

    case 'funcCall': {
      if (inst.funcName === 'motorForward') {
        const spd = inst.args && inst.args[0] ? Number(evaluateExpression(inst.args[0], vars, hw)) : 200;
        hw.motorSpeed = Math.max(0, Math.min(255, spd));
        hw.motorDirection = 'FORWARD';
        hw.currentMa = 380.0;
      } else if (inst.funcName === 'motorReverse') {
        const spd = inst.args && inst.args[0] ? Number(evaluateExpression(inst.args[0], vars, hw)) : 200;
        hw.motorSpeed = Math.max(0, Math.min(255, spd));
        hw.motorDirection = 'BACKWARD';
        hw.currentMa = 380.0;
      } else if (inst.funcName === 'setRGB' && inst.args && inst.args.length >= 3) {
        hw.rgbR = Math.max(0, Math.min(255, Number(evaluateExpression(inst.args[0], vars, hw))));
        hw.rgbG = Math.max(0, Math.min(255, Number(evaluateExpression(inst.args[1], vars, hw))));
        hw.rgbB = Math.max(0, Math.min(255, Number(evaluateExpression(inst.args[2], vars, hw))));
      }
      break;
    }

    case 'serial': {
      if (inst.expr) {
        const val = evaluateExpression(inst.expr, vars, hw);
        addSerial(String(val));
        const valStr = String(val);
        if (hw.activeLab === 'iot' || valStr.includes('MQTT') || valStr.includes('telemetry') || valStr.includes('Published') || valStr.includes('Publish')) {
          hw.iotPacketsSent++;
          hw.iotPayload = `{"temp": ${hw.temperatureC}, "lux": ${hw.ldrRaw}, "seq": ${hw.iotPacketsSent}}`;
        }
      }
      break;
    }

    default:
      break;
  }
}

function computeScopeCh1(hw: HardwareState, virtualTime: number): number {
  if (hw.activeLab === 'servo') {
    const period = 20.0;
    const pulseWidth = hw.servoPulseWidthMs || 1.5;
    const phase = virtualTime % period;
    return phase < pulseWidth ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'led') {
    if (hw.pwmDuty > 0 && hw.pwmDuty < 255) {
      const period = 2.04;
      const onTime = (hw.pwmDuty / 255.0) * period;
      return (virtualTime % period) < onTime ? 5.0 : 0.0;
    }
    return hw.ledOn ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'rgb') {
    const period = 2.04;
    const onTime = (hw.rgbR / 255.0) * period;
    return (virtualTime % period) < onTime ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'buzzer' && hw.buzzerActive && hw.buzzerToneFreq > 0) {
    const period = 1000.0 / hw.buzzerToneFreq;
    return (virtualTime % period) < period / 2 ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'motor') {
    const period = 2.04;
    const onTime = (hw.motorSpeed / 255.0) * period;
    return hw.motorSpeed > 0 ? ((virtualTime % period) < onTime ? 5.0 : 0.0) : 0.0;
  }
  if (hw.activeLab === 'sonar') {
    const period = 60.0;
    return (virtualTime % period) < 0.1 ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'soil') {
    return hw.relayActive ? 5.0 : 0.0;
  }
  if (hw.activeLab === 'temp') {
    return hw.fanActive ? 5.0 : 0.0;
  }
  return hw.ledOn ? 5.0 : 0.0;
}

function computeScopeCh2(hw: HardwareState, virtualTime: number): number {
  if (hw.activeLab === 'servo') {
    return +((hw.servoAngle / 180.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'pot') {
    return +((hw.potVal / 1023.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'temp') {
    return +(Math.max(0, Math.min(5.0, hw.temperatureC * 0.01 + 0.5))).toFixed(2);
  }
  if (hw.activeLab === 'sonar') {
    return +(Math.min(5.0, (hw.distanceCm / 100.0) * 5.0)).toFixed(2);
  }
  if (hw.activeLab === 'rgb') {
    return +((hw.rgbB / 255.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'ldr') {
    return +((hw.ldrRaw / 1023.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'soil') {
    return +((hw.soilMoisturePct / 100.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'gas') {
    return +((hw.gasPpm / 800.0) * 5.0).toFixed(2);
  }
  if (hw.activeLab === 'imu') {
    return +(2.5 + (hw.imuPitch / 90.0) * 2.5).toFixed(2);
  }
  return 0.2 + Math.sin(virtualTime / 100) * 0.05;
}
