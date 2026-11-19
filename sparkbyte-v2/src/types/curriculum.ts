/**
 * Strict Curriculum and Hardware Simulation Interfaces for SparkByte Studio v2
 * Zero 'any' types across the entire engine and UI.
 */

export type GradeLevel = '6-8' | '9-10' | '11-12';

export type LabCategory = 'basics' | 'sensors' | 'actuators' | 'displays' | 'advanced';

export interface CodeRow {
  id: string;
  line: number;
  text: string;
  indent?: number;
  tag?: string;
}

export type InstructionType = 
  | 'header'
  | 'pinMode'
  | 'digitalWrite'
  | 'analogWrite'
  | 'servoWrite'
  | 'servoAttach'
  | 'tone'
  | 'noTone'
  | 'delay'
  | 'serial'
  | 'serialInit'
  | 'lcd'
  | 'motor'
  | 'wire'
  | 'eeprom'
  | 'peripheral'
  | 'logic'
  | 'comment'
  | 'varDecl'
  | 'assignment'
  | 'if'
  | 'else'
  | 'endif'
  | 'funcCall'
  | 'cad'
  | 'gcode'
  | 'display'
  | 'return'
  | 'other';

export interface InstructionNode {
  id: string;
  lineIndex: number;
  phase: 'setup' | 'loop' | 'global';
  type: InstructionType;
  rawCpp: string;
  plainEnglish: string;
  pin?: number | string;
  value?: number | boolean | string;
  durationMs?: number;
  param?: string | number;
  condition?: string;
  jumpIndex?: number;
  elseJumpIndex?: number;
  varName?: string;
  expr?: string;
  funcName?: string;
  args?: string[];
  cadDims?: { x: number; y: number; z: number; holeR?: number };
  gcodeData?: { cmd: string; x?: number; y?: number; z?: number; e?: number; f?: number; s?: number };
  displayData?: { cmd: string; x?: number; y?: number; x2?: number; y2?: number; w?: number; h?: number; r?: number; text?: string; color?: number };
}

export interface LessonMisconception {
  title: string;
  detail: string;
}

export interface LessonJargon {
  word: string;
  phonetic?: string;
  definition: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  summary?: string;
  mascotMsg?: string;
  instructionKit?: string;
  defaultCode: {
    cpp: string;
    human: string;
  };
  jargon?: LessonJargon[];
  misconceptions?: LessonMisconception[];
  pedagogy?: string;
}

export interface Lab {
  id: string;
  name: string;
  title: string;
  grade: GradeLevel;
  category: LabCategory;
  badge: string;
  iconName: string;
  description: string;
  lessons: Lesson[];
}

export interface HardwareState {
  // Identity & Telemetry
  activeLab: string;
  voltage: number;
  currentMa: number;

  // Digital Output (LED)
  ledOn: boolean;
  ledPin: number;
  ledColor: string;
  pwmDuty: number;

  // Servo Actuator
  servoAngle: number;
  servoTargetAngle: number;
  servoPulseWidthMs: number;
  servoAttached: boolean;
  servoMoving: boolean;

  // Inputs
  buttonPressed: boolean;
  potVal: number; // 0..1023
  ldrRaw: number;

  // Sound
  buzzerActive: boolean;
  buzzerToneFreq: number;

  // Environmental & Distance Sensors
  temperatureC: number;
  humidityPct: number;
  distanceCm: number;
  gasPpm: number;
  soilMoisturePct: number;
  irReflectRaw: number;

  // Motors (L298N)
  motorSpeed: number; // 0..255
  motorDirection: 'FORWARD' | 'BACKWARD' | 'BRAKE';

  // RGB Multi-Channel Output
  rgbR: number; // 0..255
  rgbG: number; // 0..255
  rgbB: number; // 0..255

  // Actuator Relays & Fans
  fanActive: boolean;
  fanSpeed: number; // 0..255
  relayActive: boolean;

  // I2C / Display / Advanced
  lcdRow?: number;
  lcdTextRow0: string;
  lcdTextRow1: string;
  oledBuffer: boolean[][]; // 64 rows x 128 cols
  cadModel: { x: number; y: number; z: number; holeR?: number };
  slicerState: {
    layer: number;
    maxLayers: number;
    nozzleX: number;
    nozzleY: number;
    nozzleZ: number;
    isExtruding: boolean;
    toolpaths: Array<{ x1: number; y1: number; x2: number; y2: number; isExtruding: boolean }>;
  };
  imuPitch: number;
  imuRoll: number;
  rfidScannedUid: string | null;
  rfidAuthorized: boolean;
  iotConnected: boolean;
  iotPacketsSent: number;
  iotPayload: string;
  pinStates: Record<number, boolean>;
  pwmStates: Record<number, number>;
}

export interface ScopeBufferPoint {
  t: number;
  ch1: number; // 0 to 5.0 Volts
  ch2: number; // 0 to 5.0 Volts
}

export interface ExecutionSnapshot {
  loopCount: number;
  activeLineIndex: number;
  activePhase: 'setup' | 'loop';
  activeInstruction: InstructionNode | null;
}
