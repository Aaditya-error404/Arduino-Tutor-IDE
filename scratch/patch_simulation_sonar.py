import sys

with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Constructor state
target_c = '    // Temperature Sensor TMP36 & HVAC State'
sonar_c = '''    // HC-SR04 Ultrasonic Distance Sensor State
    this.sonarTrigPin = 12;
    this.sonarEchoPin = 11;
    this.sonarDistanceCm = 45.0; // cm
    this.sonarDurationUs = Math.round(45.0 * 58.2); // us
    this.sonarAlertZone = 'caution'; // 'safe', 'caution', 'hazard', 'stop'
    this.sonarPingActive = false;
    this.sonarBuzzerBeeping = false;
    this.sonarLedStrobe = false;

    // Temperature Sensor TMP36 & HVAC State'''

if target_c in text and 'this.sonarTrigPin' not in text:
    text = text.replace(target_c, sonar_c)
    print('Added constructor state')

# 2. resetHardwareState
target_r = "} else if (labName === 'temp') {"
sonar_r = """} else if (labName === 'sonar') {
      this.voltage = 5.0;
      this.currentMa = 15.0;
      this.sonarDistanceCm = 45.0;
      this.sonarDurationUs = Math.round(45.0 * 58.2);
      this.sonarAlertZone = 'caution';
      this.sonarPingActive = false;
      this.sonarBuzzerBeeping = false;
      this.sonarLedStrobe = false;
      this.setLesson(1);
    } else if (labName === 'temp') {"""

if target_r in text and "labName === 'sonar'" not in text:
    text = text.replace(target_r, sonar_r)
    print('Added resetHardwareState')

# 3. setLesson default state
target_l = "} else if (this.activeLab === 'temp') {"
sonar_l = """} else if (this.activeLab === 'sonar') {
      if (lessonId === 1) {
        this.sonarDistanceCm = 50.0;
      } else if (lessonId === 2) {
        this.sonarDistanceCm = 35.0;
      } else if (lessonId === 3) {
        this.sonarDistanceCm = 24.5;
      } else if (lessonId === 4) {
        this.sonarDistanceCm = 15.0;
      }
      this.sonarDurationUs = Math.round(this.sonarDistanceCm * 58.2);
      this.voltage = 5.0;
      this.currentMa = 15.0;
    } else if (this.activeLab === 'temp') {"""

if target_l in text and "this.activeLab === 'sonar'" not in text:
    text = text.replace(target_l, sonar_l)
    print('Added setLesson')

# 4. Helper methods for sonar
target_m = "  setTemperature(temp) {"
sonar_m = """  setSonarDistance(cm) {
    this.sonarDistanceCm = Math.max(2.0, Math.min(200.0, +cm.toFixed(1)));
    this.sonarDurationUs = Math.round(this.sonarDistanceCm * 58.2);
    if (this.sonarDistanceCm > 50.0) {
      this.sonarAlertZone = 'safe';
      this.sonarBuzzerBeeping = false;
      this.sonarLedStrobe = false;
      this.currentMa = 15.0;
    } else if (this.sonarDistanceCm > 20.0) {
      this.sonarAlertZone = 'caution';
      this.sonarBuzzerBeeping = true;
      this.sonarLedStrobe = true;
      this.currentMa = 22.0;
    } else if (this.sonarDistanceCm > 8.0) {
      this.sonarAlertZone = 'hazard';
      this.sonarBuzzerBeeping = true;
      this.sonarLedStrobe = true;
      this.currentMa = 28.0;
    } else {
      this.sonarAlertZone = 'stop';
      this.sonarBuzzerBeeping = true;
      this.sonarLedStrobe = true;
      this.currentMa = 35.0;
    }
    this.notifyHardware();
  }

  fireSonarPing() {
    this.sonarPingActive = true;
    this.logToSerial(`[HC-SR04] 10µs Trigger pulse fired -> Echo duration: ${this.sonarDurationUs}µs (dist: ${this.sonarDistanceCm.toFixed(1)}cm)`);
    this.notifyHardware();
    setTimeout(() => {
      this.sonarPingActive = false;
      this.notifyHardware();
    }, 600);
  }

  setTemperature(temp) {"""

if target_m in text and 'setSonarDistance' not in text:
    text = text.replace(target_m, sonar_m)
    print('Added helper methods')

# 5. getHardwareState
target_h = "      tempC: this.tempC,"
sonar_h = """      sonarDistanceCm: this.sonarDistanceCm,
      sonarDurationUs: this.sonarDurationUs,
      sonarAlertZone: this.sonarAlertZone,
      sonarPingActive: this.sonarPingActive,
      sonarBuzzerBeeping: this.sonarBuzzerBeeping,
      sonarLedStrobe: this.sonarLedStrobe,
      tempC: this.tempC,"""

if target_h in text and 'sonarDistanceCm:' not in text:
    text = text.replace(target_h, sonar_h)
    print('Added getHardwareState properties')

# 6. executeStep routing
target_e = "} else if (this.activeLab === 'temp') {"
sonar_e = """} else if (this.activeLab === 'sonar') {
      if (this.activeLessonId === 1) this.executeSonarLesson1();
      else if (this.activeLessonId === 2) this.executeSonarLesson2();
      else if (this.activeLessonId === 3) this.executeSonarLesson3();
      else if (this.activeLessonId === 4) this.executeSonarLesson4();
    } else if (this.activeLab === 'temp') {"""

# Replace only the second occurrence of target_e (which is in executeStep)
parts = text.split(target_e)
if len(parts) >= 2 and 'executeSonarLesson' not in text:
    # First occurrence was in setLesson, now in executeStep
    text = parts[0] + target_e + parts[1] + sonar_e + parts[2]
    print('Added executeStep routing')

# 7. executeSonarLesson1..4 implementations
target_el = "  executeTempLesson1() {"
sonar_el = """  executeSonarLesson1() {
    this.fireSonarPing();
    this.logToSerial(`Trig Pin 12: 10µs PULSE -> 8 bursts of 40kHz ultrasound emitted into air.`);
    this.stepCount++;
  }

  executeSonarLesson2() {
    this.fireSonarPing();
    this.logToSerial(`pulseIn(ECHO_PIN, HIGH): Echo wire received return wave! Flight time: ${this.sonarDurationUs} µs`);
    this.stepCount++;
  }

  executeSonarLesson3() {
    const d = this.sonarDistanceCm;
    const dur = this.sonarDurationUs;
    const inVal = (d / 2.54).toFixed(1);
    this.logToSerial(`Acoustic Math: ${dur}µs * 0.0343 / 2 = ${d.toFixed(1)} cm (${inVal} inches) [divisor 58.2]`);
    this.stepCount++;
  }

  executeSonarLesson4() {
    const d = this.sonarDistanceCm;
    let zoneDesc = '';
    if (d > 50.0) {
      zoneDesc = `GREEN ZONE (>50cm): Safe distance (${d.toFixed(1)}cm). Buzzer SILENT.`;
    } else if (d > 20.0) {
      const pause = Math.round(100 + ((d - 20) / 30) * 400);
      zoneDesc = `YELLOW ZONE (20-50cm): Caution (${d.toFixed(1)}cm). Pulsing 1500Hz beep with ${pause}ms delay!`;
    } else if (d > 8.0) {
      zoneDesc = `RED ZONE (8-20cm): Urgent Hazard (${d.toFixed(1)}cm). Rapid 2400Hz alert chirps!`;
    } else {
      zoneDesc = `CRITICAL DANGER (<8cm): STOP IMMEDIATELY! Continuous 3000Hz solid alarm siren!`;
    }
    this.logToSerial(`[Reverse Radar] ${zoneDesc}`);
    this.stepCount++;
  }

  executeTempLesson1() {"""

if target_el in text and 'executeSonarLesson1' not in text:
    text = text.replace(target_el, sonar_el)
    print('Added executeSonarLesson implementations')

# 8. drawOscilloscope trace
target_o = "} else if (this.activeLab === 'temp') {"
sonar_o = """} else if (this.activeLab === 'sonar') {
      const trigY = h * 0.35;
      const echoY = h * 0.70;

      // Draw Trigger Pulse (Channel 1, Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, trigY);
      const trigPulseStart = 30;
      const trigPulseWidth = 8;
      ctx.lineTo(trigPulseStart, trigY);
      ctx.lineTo(trigPulseStart, trigY - 30);
      ctx.lineTo(trigPulseStart + trigPulseWidth, trigY - 30);
      ctx.lineTo(trigPulseStart + trigPulseWidth, trigY);
      ctx.lineTo(w, trigY);
      ctx.stroke();

      // Draw Echo Pulse (Channel 2, Amber)
      const echoPulseStart = 45;
      const echoPulseWidth = Math.max(12, Math.min(140, (this.sonarDistanceCm / 200.0) * 140));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, echoY);
      ctx.lineTo(echoPulseStart, echoY);
      ctx.lineTo(echoPulseStart, echoY - 35);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY - 35);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY);
      ctx.lineTo(w, echoY);
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`CH1 (Trig Pin 12): 10µs Pulse (5V)`, 10, trigY - 36);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`CH2 (Echo Pin 11): ${this.sonarDurationUs}µs Pulse (5V) -> ${this.sonarDistanceCm.toFixed(1)} cm`, 10, echoY - 42);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(echoPulseStart, echoY + 12);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY + 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(`Flight Time: ${this.sonarDurationUs} µs`, echoPulseStart + 4, echoY + 24);
    } else if (this.activeLab === 'temp') {"""

# Replace in drawOscilloscope
parts_o = text.split(target_o)
if len(parts_o) >= 2 and 'CH1 (Trig Pin 12)' not in text:
    # last occurrence is in drawOscilloscope
    text = parts_o[0] + target_o + parts_o[1] + sonar_o + parts_o[2]
    print('Added oscilloscope trace for sonar')

with open('js/simulation.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated js/simulation.js!')
