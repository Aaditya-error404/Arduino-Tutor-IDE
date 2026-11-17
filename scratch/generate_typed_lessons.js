const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('js/lessons.js', 'utf8');
// replace 'const ' with 'var ' so variables are in script scope
code = code.replace(/\bconst\s+/g, 'var ');

const sandbox = { window: {}, console: console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const win = sandbox;
console.log('Evaluated! Total keys:', Object.keys(win).length);

const labMapping = [
  { id: 'led', name: 'LED Digital Blink Lab', title: 'Level 1 • LED Digital Blink Lab', grade: '6-8', category: 'basics', badge: 'Grades 6–8', iconName: 'Lightbulb', desc: 'Master GPIO digital outputs, HIGH/LOW logic levels, and millisecond time delays.' },
  { id: 'servo', name: 'SG90 Micro Servo Lab', title: 'Level 1 • SG90 Micro Servo Motor Lab', grade: '6-8', category: 'actuators', badge: 'Grades 6–8', iconName: 'Cpu', desc: 'Precision angle control with PWM duty cycles and the Arduino Servo library.' },
  { id: 'button', name: 'Tactile Pushbutton Lab', title: 'Level 1 • Tactile Pushbutton Lab', grade: '6-8', category: 'basics', badge: 'Grades 6–8', iconName: 'ToggleLeft', desc: 'Active-LOW digital inputs, internal pull-up resistors, and state debouncing.' },
  { id: 'pot', name: 'Potentiometer Analog Lab', title: 'Level 1 • Rotary Potentiometer Analog Lab', grade: '6-8', category: 'sensors', badge: 'Grades 6–8', iconName: 'Sliders', desc: '10-bit analog-to-digital conversion (ADC), mapping 0-1023 numbers, and voltage dividing.' },
  { id: 'buzzer', name: 'Piezo Buzzer & Tone Lab', title: 'Level 1 • Piezo Buzzer & Sound Wave Lab', grade: '6-8', category: 'actuators', badge: 'Grades 6–8', iconName: 'Volume2', desc: 'Sound waves, audio frequencies, pitch synthesis, and tone() melodies.' },
  { id: 'cad', name: 'Parametric 3D CAD Lab', title: 'Level 1 • 3D Design & Parametric CAD Lab', grade: '6-8', category: 'advanced', badge: 'Grades 6–8', iconName: 'Box', desc: 'Physical computing enclosure engineering, 3D coordinate geometry, and tolerances.' },
  { id: 'dmm', name: 'Digital Multimeter Lab', title: 'Level 1 • DMM Circuit Troubleshooting Lab', grade: '6-8', category: 'basics', badge: 'Grades 6–8', iconName: 'Activity', desc: 'Voltage drops, current loops, continuity testing, and short-circuit troubleshooting.' },
  { id: 'ldr', name: 'Photoresistor Light Lab', title: 'Level 2 • Photoresistor Light Sensor Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'Sun', desc: 'Light-dependent resistance (LDR), dark-activated nightlights, and threshold triggers.' },
  { id: 'rgb', name: 'RGB Color Mixing Lab', title: 'Level 2 • Multi-Channel RGB LED Lab', grade: '9-10', category: 'actuators', badge: 'Grades 9–10', iconName: 'Palette', desc: '3-channel 8-bit PWM color mixing (16 million colors), duty cycles, and analogWrite().' },
  { id: 'temp', name: 'TMP36 Temperature Lab', title: 'Level 2 • TMP36 Analog Temperature Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'Thermometer', desc: 'Analog thermal transducers, millivolt-to-Celsius transfer functions, and HVAC loops.' },
  { id: 'sonar', name: 'Ultrasonic Distance Lab', title: 'Level 2 • HC-SR04 Ultrasonic Sonar Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'Radar', desc: 'Echolocation physics, speed of sound (343 m/s), pulseIn() timing, and obstacle detection.' },
  { id: 'ir', name: 'TCRT5000 Infrared Lab', title: 'Level 2 • TCRT5000 Line Tracker Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'Compass', desc: '940nm phototransistor optical reflectivity, comparator thresholds, and line tracking.' },
  { id: 'slicer', name: '3D Printing Slicer Lab', title: 'Level 2 • 3D Slicing & G-Code Lab', grade: '9-10', category: 'advanced', badge: 'Grades 9–10', iconName: 'Layers', desc: 'Additive manufacturing toolpaths, infill densities, layer heights, and nozzle thermistors.' },
  { id: 'dht', name: 'DHT11 Temp & Humidity Lab', title: 'Level 2 • DHT11 Climate Telemetry Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'CloudRain', desc: 'Capacitive humidity sensing, single-wire digital protocols, and heat index computations.' },
  { id: 'gas', name: 'MQ-2 Combustible Gas Lab', title: 'Level 2 • MQ-2 Gas & Smoke Lab', grade: '9-10', category: 'sensors', badge: 'Grades 9–10', iconName: 'Flame', desc: 'Tin dioxide (SnO2) heating coils, PPM concentration curves, and toxic gas alarms.' },
  { id: 'lcd', name: '16x2 I2C Display Lab', title: 'Level 2 • 16x2 I2C Character Display Lab', grade: '9-10', category: 'displays', badge: 'Grades 9–10', iconName: 'Tv', desc: 'I2C two-wire bus architecture (0x27 address), SDA/SCL lines, and custom CGRAM glyphs.' },
  { id: 'oled', name: 'SSD1306 128x64 OLED Lab', title: 'Level 3 • SSD1306 Monochrome OLED Lab', grade: '11-12', category: 'displays', badge: 'Grades 11–12', iconName: 'Monitor', desc: 'Direct-write graphics buffers, Bresenham line algorithms, bitmaps, and telemetry UI.' },
  { id: 'soil', name: 'Capacitive Soil Lab', title: 'Level 3 • Smart Soil Moisture Lab', grade: '11-12', category: 'sensors', badge: 'Grades 11–12', iconName: 'Sprout', desc: 'Corrosion-resistant capacitance measurement, permittivity, and automated irrigation pumps.' },
  { id: 'motor', name: 'L298N Dual H-Bridge Lab', title: 'Level 3 • L298N DC Motor Driver Lab', grade: '11-12', category: 'actuators', badge: 'Grades 11–12', iconName: 'Cog', desc: 'Transistor H-Bridge topology, inductive kickback flyback diodes, and differential drive.' },
  { id: 'imu', name: 'MPU-6050 6-DoF IMU Lab', title: 'Level 3 • MPU-6050 6-Axis Motion Lab', grade: '11-12', category: 'sensors', badge: 'Grades 11–12', iconName: 'Navigation', desc: 'MEMS capacitive accelerometers, Coriolis gyroscopes, complementary filtering, and pitch/roll.' },
  { id: 'rfid', name: 'RC522 13.56MHz RFID Lab', title: 'Level 3 • RC522 Contactless RFID Lab', grade: '11-12', category: 'advanced', badge: 'Grades 11–12', iconName: 'Radio', desc: '13.56MHz near-field electromagnetic induction, Manchester encoding, and UID door security.' },
  { id: 'iot', name: 'ESP32 Cloud Telemetry Lab', title: 'Level 3 • ESP32 IoT Cloud Station Lab', grade: '11-12', category: 'advanced', badge: 'Grades 11–12', iconName: 'Wifi', desc: 'Wi-Fi 802.11 b/g/n, REST/MQTT pub-sub protocols, payload serialization, and cloud dashboards.' }
];

const varNames = {
  led: 'LESSONS_DATA',
  servo: 'SERVO_LESSONS_DATA',
  button: 'BUTTON_LESSONS_DATA',
  pot: 'POT_LESSONS_DATA',
  buzzer: 'BUZZER_LESSONS_DATA',
  cad: 'CAD_LESSONS_DATA',
  dmm: 'DMM_LESSONS_DATA',
  ldr: 'LDR_LESSONS_DATA',
  rgb: 'RGB_LESSONS_DATA',
  temp: 'TEMP_LESSONS_DATA',
  sonar: 'SONAR_LESSONS_DATA',
  ir: 'IR_LESSONS_DATA',
  slicer: 'SLICER_LESSONS_DATA',
  dht: 'DHT_LESSONS_DATA',
  gas: 'GAS_LESSONS_DATA',
  lcd: 'LCD_LESSONS_DATA',
  oled: 'OLED_LESSONS_DATA',
  soil: 'SOIL_LESSONS_DATA',
  motor: 'MOTOR_LESSONS_DATA',
  imu: 'IMU_LESSONS_DATA',
  rfid: 'RFID_LESSONS_DATA',
  iot: 'IOT_LESSONS_DATA'
};

const labsOutput = [];

for (const mapping of labMapping) {
  const vname = varNames[mapping.id];
  const rawLessons = win[vname] || [];
  
  const formattedLessons = rawLessons.map((l, idx) => {
    let cppCode = '';
    let humanCode = '';

    if (l.defaultCode) {
      const extractText = (r) => {
        if (typeof r === 'string') return r;
        if (r && typeof r === 'object') {
          if (r.text !== undefined) return r.text;
          if (r.code !== undefined) return r.code;
          if (r.plainEnglish !== undefined) return r.plainEnglish;
          if (r.desc !== undefined) return r.desc;
        }
        return '';
      };

      if (typeof l.defaultCode.cplusplus === 'string') cppCode = l.defaultCode.cplusplus;
      else if (typeof l.defaultCode.cpp === 'string') cppCode = l.defaultCode.cpp;
      else if (Array.isArray(l.defaultCode.cplusplus)) cppCode = l.defaultCode.cplusplus.map(extractText).join('\n');
      else if (Array.isArray(l.defaultCode.cpp)) cppCode = l.defaultCode.cpp.map(extractText).join('\n');

      if (typeof l.defaultCode.human === 'string') humanCode = l.defaultCode.human;
      else if (typeof l.defaultCode.plainEnglish === 'string') humanCode = l.defaultCode.plainEnglish;
      else if (Array.isArray(l.defaultCode.human)) humanCode = l.defaultCode.human.map(extractText).join('\n');
      else if (Array.isArray(l.defaultCode.plainEnglish)) humanCode = l.defaultCode.plainEnglish.map(extractText).join('\n');
    }

    if (!cppCode && l.codeLines && l.codeLines.cpp) {
      cppCode = l.codeLines.cpp.map(extractText).join('\n');
    }
    if (!humanCode && l.codeLines && l.codeLines.human) {
      humanCode = l.codeLines.human.map(extractText).join('\n');
    }
    if (!cppCode && l.cplusplus) {
      cppCode = typeof l.cplusplus === 'string' ? l.cplusplus : l.cplusplus.map(r => r.text || r).join('\n');
    }
    if (!humanCode && l.plainEnglish) {
      humanCode = typeof l.plainEnglish === 'string' ? l.plainEnglish : l.plainEnglish.map(r => r.text || r).join('\n');
    }

    if (!cppCode && l.code) {
      cppCode = typeof l.code === 'string' ? l.code : (Array.isArray(l.code) ? l.code.map(r => r.text || r).join('\n') : '');
    }
    if (!humanCode && l.explanation && Array.isArray(l.explanation)) {
      humanCode = l.explanation.map(e => e.plainEnglish || e.text || e.desc || '').join('\n');
    }
    if (!humanCode && cppCode) {
      // Generate clean default plain english lines if explanation is missing
      humanCode = cppCode.split('\n').map(c => {
        const tr = c.trim();
        if (!tr || tr.startsWith('//')) return tr;
        if (tr.includes('void setup()')) return '1. When the board powers on, run setup once:';
        if (tr.includes('void loop()')) return '2. Repeat continuously in the loop:';
        if (tr.includes('pinMode')) return 'Configure pin mode (INPUT/OUTPUT)';
        if (tr.includes('digitalWrite')) return 'Set digital pin voltage level';
        if (tr.includes('delay')) return 'Wait for specified milliseconds';
        return tr;
      }).join('\n');
    }

    return {
      id: l.id || (idx + 1),
      title: l.title || `Lesson ${idx + 1}`,
      subtitle: l.subtitle || '',
      summary: l.summary || '',
      mascotMsg: l.mascotMsg || '',
      instructionKit: l.instructionKit || '',
      defaultCode: {
        cpp: cppCode.trim(),
        human: humanCode.trim()
      },
      jargon: l.jargon || [],
      misconceptions: l.misconceptions || [],
      pedagogy: l.pedagogy || ''
    };
  });

  labsOutput.push({
    id: mapping.id,
    name: mapping.name,
    title: mapping.title,
    grade: mapping.grade,
    category: mapping.category,
    badge: mapping.badge,
    iconName: mapping.iconName,
    description: mapping.desc,
    lessons: formattedLessons
  });
}

console.log(`Generated ${labsOutput.length} labs with ${labsOutput.reduce((acc, l) => acc + l.lessons.length, 0)} total lessons!`);

const fileContent = `/**
 * All 22 ATL Curriculum Labs and 88 Engineering Lessons
 * Converted to strict TypeScript with zero 'any' types.
 */
import { Lab } from '../types/curriculum';

export const ALL_LABS: Lab[] = ${JSON.stringify(labsOutput, null, 2)};

export const LAB_MAP: Record<string, Lab> = ALL_LABS.reduce((acc, lab) => {
  acc[lab.id] = lab;
  return acc;
}, {} as Record<string, Lab>);
`;

fs.writeFileSync('sparkbyte-v2/src/data/lessons.ts', fileContent, 'utf8');
console.log('Successfully wrote sparkbyte-v2/src/data/lessons.ts!');
