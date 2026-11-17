with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Constructor state
target_c = '    // HC-SR04 Ultrasonic Distance Sensor State'
ir_c = '''    // TCRT5000 / KY-033 IR Reflective Sensor State
    this.irDigitalPin = 2;
    this.irAnalogPin = 'A0';
    this.irSurface = 'white'; // 'white', 'cardboard', 'dark_tape', 'black'
    this.irReflectRaw = 145; // 0..1023
    this.irVoltage = 0.71; // 0..5V
    this.irThreshold = 512;
    this.irLineDetected = false;
    this.irBeamActive = false;
    this.roverRunning = false;
    this.roverSteerState = 'straight';
    this.roverLeftMotor = 200;
    this.roverRightMotor = 200;
    this.roverAngle = 0;

    // HC-SR04 Ultrasonic Distance Sensor State'''

if target_c in text and 'this.irDigitalPin' not in text:
    text = text.replace(target_c, ir_c)
    print('Added IR constructor state')

# 2. resetHardwareState
target_r = "} else if (labName === 'sonar') {"
ir_r = """} else if (labName === 'ir') {
      this.voltage = 5.0;
      this.currentMa = 22.0;
      this.irSurface = 'white';
      this.irReflectRaw = 145;
      this.irVoltage = 0.71;
      this.irThreshold = 512;
      this.irLineDetected = false;
      this.irBeamActive = false;
      this.roverRunning = false;
      this.roverSteerState = 'straight';
      this.roverLeftMotor = 200;
      this.roverRightMotor = 200;
      this.setLesson(1);
    } else if (labName === 'sonar') {"""

if target_r in text and "labName === 'ir'" not in text:
    text = text.replace(target_r, ir_r)
    print('Added IR resetHardwareState')

# 3. setLesson default state
target_l = "} else if (this.activeLab === 'sonar') {"
ir_l = """} else if (this.activeLab === 'ir') {
      if (lessonId === 1) {
        this.irSurface = 'white';
        this.irReflectRaw = 135;
      } else if (lessonId === 2) {
        this.irSurface = 'dark_tape';
        this.irReflectRaw = 840;
      } else if (lessonId === 3) {
        this.irSurface = 'cardboard';
        this.irReflectRaw = 460;
      } else if (lessonId === 4) {
        this.irSurface = 'white';
        this.irReflectRaw = 135;
        this.roverRunning = true;
      }
      this.irVoltage = +((this.irReflectRaw / 1023.0) * 5.0).toFixed(2);
      this.irLineDetected = this.irReflectRaw > this.irThreshold;
      this.voltage = 5.0;
      this.currentMa = 22.0;
    } else if (this.activeLab === 'sonar') {"""

if target_l in text and "this.activeLab === 'ir'" not in text:
    text = text.replace(target_l, ir_l)
    print('Added IR setLesson')

# 4. Helper methods for IR
target_m = "  setSonarDistance(cm) {"
ir_m = """  setIrSurface(type) {
    this.irSurface = type;
    if (type === 'white') {
      this.irReflectRaw = 120;
    } else if (type === 'cardboard') {
      this.irReflectRaw = 460;
    } else if (type === 'dark_tape') {
      this.irReflectRaw = 840;
    } else if (type === 'black') {
      this.irReflectRaw = 985;
    }
    this.irVoltage = +((this.irReflectRaw / 1023.0) * 5.0).toFixed(2);
    this.irLineDetected = this.irReflectRaw > this.irThreshold;
    this.notifyHardware();
  }

  setIrThreshold(thresh) {
    this.irThreshold = Math.max(50, Math.min(950, thresh));
    this.irLineDetected = this.irReflectRaw > this.irThreshold;
    this.notifyHardware();
  }

  emitIrBeam() {
    this.irBeamActive = true;
    this.logToSerial("[TCRT5000] 940nm Infrared LED pulsing -> Optical reflection: " + this.irReflectRaw + " (" + this.irVoltage + "V)");
    this.notifyHardware();
    setTimeout(() => {
      this.irBeamActive = false;
      this.notifyHardware();
    }, 500);
  }

  setRoverSteering(state) {
    this.roverSteerState = state;
    if (state === 'straight') {
      this.roverLeftMotor = 200;
      this.roverRightMotor = 200;
    } else if (state === 'left') {
      this.roverLeftMotor = 60;
      this.roverRightMotor = 220;
    } else if (state === 'right') {
      this.roverLeftMotor = 220;
      this.roverRightMotor = 60;
    } else if (state === 'stop') {
      this.roverLeftMotor = 0;
      this.roverRightMotor = 0;
    }
    this.notifyHardware();
  }

  setSonarDistance(cm) {"""

if target_m in text and 'setIrSurface' not in text:
    text = text.replace(target_m, ir_m)
    print('Added IR helper methods')

# 5. getHardwareState
target_h = "      sonarDistanceCm: this.sonarDistanceCm,"
ir_h = """      irSurface: this.irSurface,
      irReflectRaw: this.irReflectRaw,
      irVoltage: this.irVoltage,
      irThreshold: this.irThreshold,
      irLineDetected: this.irLineDetected,
      irBeamActive: this.irBeamActive,
      roverRunning: this.roverRunning,
      roverSteerState: this.roverSteerState,
      roverLeftMotor: this.roverLeftMotor,
      roverRightMotor: this.roverRightMotor,
      sonarDistanceCm: this.sonarDistanceCm,"""

if target_h in text and 'irSurface:' not in text:
    text = text.replace(target_h, ir_h)
    print('Added IR properties to getHardwareState')

# 6. executeStep routing
target_e = "} else if (this.activeLab === 'sonar') {"
ir_e = """} else if (this.activeLab === 'ir') {
      if (this.activeLessonId === 1) this.executeIrLesson1();
      else if (this.activeLessonId === 2) this.executeIrLesson2();
      else if (this.activeLessonId === 3) this.executeIrLesson3();
      else if (this.activeLessonId === 4) this.executeIrLesson4();
    } else if (this.activeLab === 'sonar') {"""

parts = text.split(target_e)
if len(parts) >= 2 and 'executeIrLesson' not in text:
    text = parts[0] + target_e + parts[1] + ir_e + parts[2]
    print('Added executeStep routing for IR')

# 7. executeIrLesson1..4 implementations
target_el = "  executeSonarLesson1() {"
ir_el = """  executeIrLesson1() {
    this.emitIrBeam();
    this.logToSerial("IR Beam (940nm): " + (this.irLineDetected ? "HIGH Absorption (Black surface)" : "LOW Absorption (Reflective surface)"));
    this.stepCount++;
  }

  executeIrLesson2() {
    this.emitIrBeam();
    const verdict = this.irReflectRaw > this.irThreshold ? "LINE DETECTED (HIGH)" : "SURFACE CLEAR (LOW)";
    this.logToSerial("LM393 Comparator: Raw " + this.irReflectRaw + " vs Vref " + this.irThreshold + " -> DO: " + verdict);
    this.stepCount++;
  }

  executeIrLesson3() {
    const raw = this.irReflectRaw;
    const v = this.irVoltage;
    const pct = ((raw / 1023.0) * 100.0).toFixed(1);
    this.logToSerial("Analog A0: ADC " + raw + "/1023 (" + v.toFixed(2) + "V) | Optical Absorption: " + pct + "%");
    this.stepCount++;
  }

  executeIrLesson4() {
    this.logToSerial("Autonomous Rover: LeftMotor " + this.roverLeftMotor + " PWM | RightMotor " + this.roverRightMotor + " PWM | Steer: " + this.roverSteerState.toUpperCase());
    this.stepCount++;
  }

  executeSonarLesson1() {"""

if target_el in text and 'executeIrLesson1' not in text:
    text = text.replace(target_el, ir_el)
    print('Added executeIrLesson methods')

# 8. Oscilloscope trace for IR
target_o = "} else if (this.activeLab === 'sonar') {"
ir_o = """} else if (this.activeLab === 'ir') {
      const doY = h * 0.35;
      const aoY = h * 0.70;

      // Channel 1: Digital Out Pin 2 (LM393 Comparator Output)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, doY);
      const isHigh = this.irLineDetected;
      const pulseY = isHigh ? doY - 30 : doY;
      ctx.lineTo(40, doY);
      ctx.lineTo(40, pulseY);
      ctx.lineTo(120, pulseY);
      ctx.lineTo(120, doY);
      ctx.lineTo(w, doY);
      ctx.stroke();

      // Channel 2: Analog Out Pin A0 (Continuous Voltage)
      const v = this.irVoltage;
      const vY = aoY - ((v / 5.0) * 35);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, vY);
      ctx.lineTo(w, vY);
      ctx.stroke();

      // Comparator Vref threshold line (dotted yellow)
      const vrefY = aoY - ((this.irThreshold / 1023.0) * 35);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, vrefY);
      ctx.lineTo(w, vrefY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('CH1 (DO Pin 2): ' + (this.irLineDetected ? 'HIGH (5V - Line)' : 'LOW (0V - White)'), 10, doY - 36);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('CH2 (AO Pin A0): ' + v.toFixed(2) + 'V (ADC ' + this.irReflectRaw + ')', 10, aoY - 42);

      ctx.fillStyle = '#eab308';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('Vref: ' + ((this.irThreshold / 1023.0) * 5.0).toFixed(2) + 'V', w - 85, vrefY - 4);

    } else if (this.activeLab === 'sonar') {"""

parts_o = text.split(target_o)
if len(parts_o) >= 2 and 'CH1 (DO Pin 2)' not in text:
    text = parts_o[0] + target_o + parts_o[1] + ir_o + parts_o[2]
    print('Added IR oscilloscope trace')

with open('js/simulation.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully patched simulation.js for IR!')
