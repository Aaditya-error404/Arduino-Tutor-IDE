clean_tail = '''  executeStep() {
    if (!this.isRunning) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 1) this.executeLedLesson1();
      else if (this.activeLessonId === 2) this.executeLedLesson2();
      else if (this.activeLessonId === 3) this.executeLedLesson3();
      else if (this.activeLessonId === 4) this.executeLedSandbox();
    } else if (this.activeLab === 'pot') {
      if (this.activeLessonId === 1) this.executePotLesson1();
      else if (this.activeLessonId === 2) this.executePotLesson2();
      else if (this.activeLessonId === 3) this.executePotLesson3();
      else if (this.activeLessonId === 4) this.executePotLesson4();
    } else if (this.activeLab === 'button') {
      if (this.activeLessonId === 1) this.executeButtonLesson1();
      else if (this.activeLessonId === 2) this.executeButtonLesson2();
      else if (this.activeLessonId === 3) this.executeButtonLesson3();
      else if (this.activeLessonId === 4) this.executeButtonLesson4();
    } else if (this.activeLab === 'buzzer') {
      if (this.activeLessonId === 1) this.executeBuzzerLesson1();
      else if (this.activeLessonId === 2) this.executeBuzzerLesson2();
      else if (this.activeLessonId === 3) this.executeBuzzerLesson3();
      else if (this.activeLessonId === 4) this.executeBuzzerLesson4();
    } else if (this.activeLab === 'ldr') {
      if (this.activeLessonId === 1) this.executeLdrLesson1();
      else if (this.activeLessonId === 2) this.executeLdrLesson2();
      else if (this.activeLessonId === 3) this.executeLdrLesson3();
      else if (this.activeLessonId === 4) this.executeLdrLesson4();
    } else if (this.activeLab === 'rgb') {
      if (this.activeLessonId === 1) this.executeRgbLesson1();
      else if (this.activeLessonId === 2) this.executeRgbLesson2();
      else if (this.activeLessonId === 3) this.executeRgbLesson3();
      else if (this.activeLessonId === 4) this.executeRgbLesson4();
    } else if (this.activeLab === 'temp') {
      if (this.activeLessonId === 1) this.executeTempLesson1();
      else if (this.activeLessonId === 2) this.executeTempLesson2();
      else if (this.activeLessonId === 3) this.executeTempLesson3();
      else if (this.activeLessonId === 4) this.executeTempLesson4();
    } else if (this.activeLab === 'sonar') {
      if (this.activeLessonId === 1) this.executeSonarLesson1();
      else if (this.activeLessonId === 2) this.executeSonarLesson2();
      else if (this.activeLessonId === 3) this.executeSonarLesson3();
      else if (this.activeLessonId === 4) this.executeSonarLesson4();
    } else if (this.activeLab === 'ir') {
      if (this.activeLessonId === 1) this.executeIrLesson1();
      else if (this.activeLessonId === 2) this.executeIrLesson2();
      else if (this.activeLessonId === 3) this.executeIrLesson3();
      else if (this.activeLessonId === 4) this.executeIrLesson4();
    } else {
      if (this.activeLessonId === 1) this.executeServoLesson1();
      else if (this.activeLessonId === 2) this.executeServoLesson2();
      else if (this.activeLessonId === 3) this.executeServoLesson3();
      else if (this.activeLessonId === 4) this.executeServoLesson4();
    }

    const duration = Math.max(30, 80 / this.speed);
    this.timerId = setTimeout(() => {
      this.executeStep();
    }, duration);
  }

  // --- Step Engines ---
  executeServoLesson1() { this.stepCount++; this.notifyHardware(); }
  executeServoLesson2() { this.stepCount++; this.notifyHardware(); }
  executeServoLesson3() {
    this.servoAngle = (this.stepCount % 2 === 0) ? this.servoAngle1 : this.servoAngle2;
    this.updateServoPulse();
    this.stepCount++;
    this.notifyHardware();
  }
  executeServoLesson4() {
    this.servoAngle += this.sweepDirection * 5;
    if (this.servoAngle >= 180) { this.servoAngle = 180; this.sweepDirection = -1; }
    else if (this.servoAngle <= 0) { this.servoAngle = 0; this.sweepDirection = 1; }
    this.updateServoPulse();
    this.stepCount++;
    this.notifyHardware();
  }

  executeLedLesson1() { this.setPin13(this.stepCount % 2 === 0); this.stepCount++; }
  executeLedLesson2() { this.setPin13(this.stepCount % 2 === 0); this.stepCount++; }
  executeLedLesson3() { this.setPin13(this.stepCount % 2 === 0); this.stepCount++; }
  executeLedSandbox() { this.setPin13(this.stepCount % 2 === 0); this.stepCount++; }

  executePotLesson1() { this.stepCount++; this.notifyHardware(); }
  executePotLesson2() { this.stepCount++; this.notifyHardware(); }
  executePotLesson3() {
    this.servoAngle = Math.round((this.potVal / 1023.0) * 180);
    this.updateServoPulse();
    this.stepCount++;
    this.notifyHardware();
  }
  executePotLesson4() { this.executePotLesson3(); }

  executeButtonLesson1() { this.stepCount++; this.notifyHardware(); }
  executeButtonLesson2() { this.stepCount++; this.notifyHardware(); }
  executeButtonLesson3() { this.stepCount++; this.notifyHardware(); }
  executeButtonLesson4() { this.stepCount++; this.notifyHardware(); }

  executeBuzzerLesson1() { this.stepCount++; this.notifyHardware(); }
  executeBuzzerLesson2() { this.stepCount++; this.notifyHardware(); }
  executeBuzzerLesson3() { this.stepCount++; this.notifyHardware(); }
  executeBuzzerLesson4() { this.stepCount++; this.notifyHardware(); }

  executeLdrLesson1() { this.stepCount++; this.notifyHardware(); }
  executeLdrLesson2() { this.stepCount++; this.notifyHardware(); }
  executeLdrLesson3() {
    this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
    this.stepCount++;
    this.notifyHardware();
  }
  executeLdrLesson4() { this.executeLdrLesson3(); }

  executeRgbLesson1() { this.stepCount++; this.notifyHardware(); }
  executeRgbLesson2() { this.stepCount++; this.notifyHardware(); }
  executeRgbLesson3() { this.stepCount++; this.notifyHardware(); }
  executeRgbLesson4() {
    this.rgbHue = (this.rgbHue + 5) % 360;
    this.setRgbFromHue(this.rgbHue);
    this.stepCount++;
  }

  executeTempLesson1() { this.stepCount++; this.notifyHardware(); }
  executeTempLesson2() { this.stepCount++; this.notifyHardware(); }
  executeTempLesson3() {
    this.tempAlarmActive = this.tempC > this.tempThreshold;
    this.stepCount++;
    this.notifyHardware();
  }
  executeTempLesson4() {
    if (this.tempC > 28.0) {
      this.fanActive = true;
      this.fanSpeed = Math.min(255, Math.round(((this.tempC - 28.0) / 17.0) * 255));
    } else {
      this.fanActive = false;
      this.fanSpeed = 0;
    }
    this.stepCount++;
    this.notifyHardware();
  }

  executeSonarLesson1() {
    this.fireSonarPing();
    this.logToSerial("Trig Pin 12: 10µs PULSE -> 8 bursts of 40kHz ultrasound emitted into air.");
    this.stepCount++;
  }
  executeSonarLesson2() {
    this.fireSonarPing();
    this.logToSerial("pulseIn(ECHO_PIN, HIGH): Echo wire received return wave! Flight time: " + this.sonarDurationUs + " µs");
    this.stepCount++;
  }
  executeSonarLesson3() {
    const d = this.sonarDistanceCm;
    const dur = this.sonarDurationUs;
    this.logToSerial("Acoustic Math: " + dur + "µs * 0.0343 / 2 = " + d.toFixed(1) + " cm (" + (d/2.54).toFixed(1) + " in)");
    this.stepCount++;
  }
  executeSonarLesson4() {
    const d = this.sonarDistanceCm;
    this.logToSerial("[Reverse Radar] Target Distance: " + d.toFixed(1) + "cm -> Zone: " + this.sonarAlertZone.toUpperCase());
    this.stepCount++;
  }

  executeIrLesson1() {
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

  // --- Oscilloscope Renderer ---
  renderScope() {
    if (!this.scopeCtx || !this.scopeCanvas) return;
    const ctx = this.scopeCtx;
    const w = this.scopeCanvas.width;
    const h = this.scopeCanvas.height;

    ctx.fillStyle = '#09131d';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 30) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += 20) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    if (this.activeLab === 'sonar') {
      const trigY = h * 0.35;
      const echoY = h * 0.70;

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, trigY);
      ctx.lineTo(30, trigY);
      ctx.lineTo(30, trigY - 30);
      ctx.lineTo(38, trigY - 30);
      ctx.lineTo(38, trigY);
      ctx.lineTo(w, trigY);
      ctx.stroke();

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
      ctx.fillText('CH1 (Trig Pin 12): 10µs Pulse (5V)', 10, trigY - 36);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText('CH2 (Echo Pin 11): ' + this.sonarDurationUs + 'µs Pulse (5V) -> ' + this.sonarDistanceCm.toFixed(1) + ' cm', 10, echoY - 42);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(echoPulseStart, echoY + 12);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY + 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('Flight Time: ' + this.sonarDurationUs + ' µs', echoPulseStart + 4, echoY + 24);

    } else if (this.activeLab === 'ir') {
      const doY = h * 0.35;
      const aoY = h * 0.70;

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

      const v = this.irVoltage;
      const vY = aoY - ((v / 5.0) * 35);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, vY);
      ctx.lineTo(w, vY);
      ctx.stroke();

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

    } else if (this.activeLab === 'temp') {
      const v = this.tempVolts;
      const yLow = h * 0.78;
      const yHigh = h * 0.22;
      const yVal = yLow - ((v / 2.0) * (yLow - yHigh));

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = this.tempAlarmActive ? '#ef4444' : '#22c55e';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('Pin A2: ' + v.toFixed(3) + 'V (' + Math.round(v * 1000) + 'mV) -> ' + this.tempC.toFixed(1) + '°C', 10, yVal - 8);

    } else if (this.activeLab === 'rgb') {
      const chHeight = (h - 18) / 3;
      const channels = [
        { label: 'Red ~9', val: this.rgbR, color: '#ef4444', topY: 6 },
        { label: 'Green ~10', val: this.rgbG, color: '#10b981', topY: 6 + chHeight },
        { label: 'Blue ~11', val: this.rgbB, color: '#3b82f6', topY: 6 + chHeight * 2 }
      ];

      const cycleWidth = 55;
      const numCycles = Math.ceil(w / cycleWidth) + 1;

      channels.forEach(ch => {
        const duty = ch.val / 255.0;
        const highW = cycleWidth * duty;
        const cyHigh = ch.topY + 5;
        const cyLow = ch.topY + chHeight - 5;

        ctx.lineWidth = 1.8;
        ctx.strokeStyle = ch.color;
        ctx.beginPath();
        for (let i = 0; i < numCycles; i++) {
          const startX = i * cycleWidth;
          const pulseEndX = startX + highW;
          const frameEndX = startX + cycleWidth;

          if (i === 0) ctx.moveTo(0, duty > 0 ? cyHigh : cyLow);

          if (duty <= 0) {
            ctx.lineTo(frameEndX, cyLow);
          } else if (duty >= 1) {
            ctx.lineTo(frameEndX, cyHigh);
          } else {
            ctx.lineTo(startX, cyHigh);
            ctx.lineTo(pulseEndX, cyHigh);
            ctx.lineTo(pulseEndX, cyLow);
            ctx.lineTo(frameEndX, cyLow);
          }
        }
        ctx.stroke();

        ctx.fillStyle = ch.color;
        ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
        ctx.fillText(ch.label + ': ' + Math.round(duty * 100) + '% (' + ch.val + ')', 8, cyHigh + 9);
      });

    } else {
      // Default: Servo 50Hz PWM pulse
      const yLow = h * 0.75;
      const yHigh = h * 0.25;
      const pulseWidthMs = 1.0 + (this.servoAngle / 180.0);
      const highPixels = (pulseWidthMs / 20.0) * w * 2.5;

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(0, yLow);
      ctx.lineTo(25, yLow);
      ctx.lineTo(25, yHigh);
      ctx.lineTo(25 + highPixels, yHigh);
      ctx.lineTo(25 + highPixels, yLow);
      ctx.lineTo(w, yLow);
      ctx.stroke();

      ctx.fillStyle = '#f97316';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('PWM: ' + pulseWidthMs.toFixed(2) + 'ms (50Hz / 20ms Frame) -> ' + this.servoAngle + '°', 10, yHigh - 8);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (this.scopeAnimId) cancelAnimationFrame(this.scopeAnimId);
  }
}

// Global Singleton Instance
window.circuitSimulation = new CircuitSimulation();
'''

with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

marker = '  executeStep() {'
pos = text.find(marker)
if pos != -1:
    new_text = text[:pos] + clean_tail
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Successfully reassembled simulation.js cleanly!')
else:
    print('Marker executeStep() not found!')
