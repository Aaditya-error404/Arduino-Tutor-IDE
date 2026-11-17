import re

with open("js/simulation.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add stepCount to constructor
code = re.sub(
    r'(this\.loopCount\s*=\s*0;)',
    r'\1\n    this.stepCount = 0;',
    code,
    count=1
)

# 2. Add startScopeLoop method if not present
if "startScopeLoop()" not in code:
    scope_method = """  startScopeLoop() {
    if (!this.scopeCtx || !this.scopeCanvas) return;
    const loop = () => {
      if (!this.isRunning) return;
      this.renderScope();
      this.scopeAnimId = requestAnimationFrame(loop);
    };
    if (this.scopeAnimId) cancelAnimationFrame(this.scopeAnimId);
    this.scopeAnimId = requestAnimationFrame(loop);
  }
"""
    code = re.sub(
        r'(initScope\(canvasElement\)\s*\{[\s\S]*?\n  \})',
        r'\1\n\n' + scope_method,
        code,
        count=1
    )
    print("Added startScopeLoop method!")

# 3. Fix start() method: only check servoAttached if activeLab === 'servo'
old_start = """  start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 2 && !this.pin13Configured) {
        alert("⚠️ First click Pin 13 on the Arduino board to claim it as an OUTPUT pin!");
        return;
      }
    } else {
      if (this.activeLessonId === 2 && !this.servoAttached) {
        alert("⚠️ First click Pin ~9 on the Arduino board to attach your servo's orange signal line!");
        return;
      }
    }

    this.isRunning = true;
    this.isPaused = false;
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playToggle(true);
    }

    this.startScopeLoop();
    this.executeStep();
  }"""

new_start = """  start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 2 && !this.pin13Configured) {
        alert("⚠️ First click Pin 13 on the Arduino board to claim it as an OUTPUT pin!");
        return;
      }
    } else if (this.activeLab === 'servo') {
      if (this.activeLessonId === 2 && !this.servoAttached) {
        alert("⚠️ First click Pin ~9 on the Arduino board to attach your servo's orange signal line!");
        return;
      }
    }

    this.isRunning = true;
    this.isPaused = false;
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playToggle(true);
    }

    this.startScopeLoop();
    this.executeStep();
  }"""

if old_start in code:
    code = code.replace(old_start, new_start)
    print("Fixed start() lab check!")
else:
    print("WARNING: old_start not found!")

# 4. Replace executeStep with full 22-lab implementation with onStepChange & live telemetry
old_execute_step = """  executeStep() {
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
    } else if (this.activeLab === 'lcd') {
      this.lcdBacklight = true;
      if (lessonId === 1) {
        this.lcdLine0 = 'I2C Bus Ready!  ';
        this.lcdLine1 = 'Address: 0x27   ';
      } else if (lessonId === 2) {
        this.lcdLine0 = '  ATL INNOVATE  ';
        this.lcdLine1 = 'COL:0-15 ROW:0-1';
      } else if (lessonId === 3) {
        this.lcdLine0 = 'Arduino + ATL   ';
        this.lcdLine1 = '5x8 Pixel Glyph ';
      } else if (lessonId === 4) {
        this.lcdLine0 = 'CLIMATE MONITOR ';
        this.lcdLine1 = 'Temp: 25.0 C    ';
        this.lcdScreenMode = 0;
      }
      this.voltage = 5.0;
      this.currentMa = 35.0;
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
  }"""

new_execute_step = """  executeStep() {
    if (!this.isRunning) return;

    this.stepCount = (this.stepCount || 0) + 1;
    this.loopCount = Math.floor(this.stepCount / 2);

    let stepText = "Loop cycle executing...";
    let activeLine = 0;

    if (this.activeLab === 'led') {
      const isHigh = (this.stepCount % 2 === 1);
      this.setPin13(isHigh);
      stepText = isHigh ? "digitalWrite(13, HIGH) - 5V Output - LED Lit" : "digitalWrite(13, LOW) - 0V Output - LED Off";
      activeLine = isHigh ? 2 : 4;
    } else if (this.activeLab === 'servo') {
      if (this.activeLessonId === 3) {
        this.servoAngle = (this.stepCount % 2 === 1) ? this.servoAngle1 : this.servoAngle2;
        stepText = `myServo.write(${this.servoAngle}) - PWM Pulse ${((1.0 + (this.servoAngle / 180.0)).toFixed(2))}ms`;
        activeLine = (this.stepCount % 2 === 1) ? 2 : 4;
      } else if (this.activeLessonId === 4) {
        this.servoAngle += this.sweepDirection * 5;
        if (this.servoAngle >= 180) { this.servoAngle = 180; this.sweepDirection = -1; }
        else if (this.servoAngle <= 0) { this.servoAngle = 0; this.sweepDirection = 1; }
        stepText = `Sweep angle: ${this.servoAngle}° (${this.sweepDirection > 0 ? 'Sweeping forward' : 'Returning'})`;
        activeLine = 2;
      } else {
        stepText = `Servo armed at ${this.servoAngle}° on Pin 9 (PWM)`;
        activeLine = 1;
      }
      this.updateServoPulse();
    } else if (this.activeLab === 'pot') {
      this.servoAngle = Math.round((this.potVal / 1023.0) * 180);
      stepText = `analogRead(A0) = ${this.potVal} -> map() to ${this.servoAngle}°`;
      activeLine = 2;
      this.updateServoPulse();
    } else if (this.activeLab === 'button') {
      stepText = `digitalRead(2) = ${this.buttonPressed ? 'LOW (Pressed)' : 'HIGH (Released)'}`;
      activeLine = 2;
    } else if (this.activeLab === 'buzzer') {
      stepText = `tone(8, ${this.buzzerToneFreq || 440}Hz) - Square wave pulsing`;
      activeLine = 2;
    } else if (this.activeLab === 'ldr') {
      this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
      stepText = `analogRead(A1) = ${this.ldrRaw} | Threshold ${this.ldrThreshold} -> Lamp: ${this.ldrLightOn ? 'ON' : 'OFF'}`;
      activeLine = 2;
    } else if (this.activeLab === 'rgb') {
      if (this.activeLessonId === 4) {
        this.rgbHue = (this.rgbHue + 5) % 360;
        this.setRgbFromHue(this.rgbHue);
      }
      stepText = `RGB PWM Output: R=${this.rgbR}, G=${this.rgbG}, B=${this.rgbB}`;
      activeLine = 2;
    } else if (this.activeLab === 'temp') {
      this.tempAlarmActive = this.tempC > this.tempThreshold;
      if (this.tempC > 28.0) {
        this.fanActive = true;
        this.fanSpeed = Math.min(255, Math.round(((this.tempC - 28.0) / 17.0) * 255));
      } else {
        this.fanActive = false;
        this.fanSpeed = 0;
      }
      stepText = `TMP36 reading: ${this.tempC.toFixed(1)}°C | Alarm: ${this.tempAlarmActive ? 'ACTIVE' : 'NORMAL'} | Fan: ${this.fanActive ? this.fanSpeed + ' PWM' : 'OFF'}`;
      activeLine = 2;
    } else if (this.activeLab === 'sonar') {
      this.fireSonarPing();
      stepText = `Ultrasonic Ping: ${this.sonarDistanceCm.toFixed(1)} cm | Echo: ${this.sonarDurationUs}µs | Zone: ${this.sonarAlertZone.toUpperCase()}`;
      activeLine = 2;
    } else if (this.activeLab === 'ir') {
      this.emitIrBeam();
      stepText = `IR Optical Sensor: Raw ${this.irReflectRaw} | Line: ${this.irLineDetected ? 'DETECTED' : 'CLEAR'}`;
      activeLine = 2;
    } else if (this.activeLab === 'lcd') {
      stepText = `I2C LCD Telemetry: [${this.lcdLine0.trim()}] / [${this.lcdLine1.trim()}]`;
      activeLine = 2;
    } else if (this.activeLab === 'cad') {
      stepText = "3D CAD Studio: CSG boolean engine active (Solid + Hole = Parametric Part)";
      activeLine = 1;
    } else if (this.activeLab === 'dmm') {
      stepText = `DMM Virtual Meter: ${this.voltage.toFixed(2)}V across test probes | ${this.currentMa.toFixed(1)}mA`;
      activeLine = 1;
    } else if (this.activeLab === 'slicer') {
      stepText = "3D Slicer Engine: G-code toolpath extruder rendering layer 0.2mm";
      activeLine = 1;
    } else if (this.activeLab === 'dht') {
      stepText = "DHT11 Climate Bus: 40-bit packet decoded (Humidity & Temp valid)";
      activeLine = 2;
    } else if (this.activeLab === 'gas') {
      stepText = "MQ Sensor ADC: Sampling air quality chamber PPM concentrations";
      activeLine = 2;
    } else if (this.activeLab === 'oled') {
      stepText = "SSD1306 OLED: 128x64 Framebuffer refreshed @ 60 FPS over I2C";
      activeLine = 2;
    } else if (this.activeLab === 'soil') {
      stepText = "Soil Moisture Probe: Hysteresis loop monitoring capacitive soil Vout";
      activeLine = 2;
    } else if (this.activeLab === 'motor') {
      stepText = "L298N Motor Driver: Dual H-Bridge PWM speed modulating DC motors";
      activeLine = 2;
    } else if (this.activeLab === 'imu') {
      stepText = "MPU6050 6-Axis IMU: Reading gyro angular velocity & accelerometer vectors";
      activeLine = 2;
    } else if (this.activeLab === 'rfid') {
      stepText = "RC522 RFID: 13.56MHz RF electromagnetic carrier field active";
      activeLine = 2;
    } else if (this.activeLab === 'iot') {
      stepText = "ESP32 Wi-Fi / MQTT: Telemetry JSON packet published to cloud broker";
      activeLine = 2;
    }

    if (this.onStepChange) {
      this.onStepChange({
        loopCount: this.loopCount,
        text: stepText,
        cppLine: activeLine,
        lineIndex: activeLine
      });
    }

    this.notifyHardware();

    const duration = Math.max(300, 1000 / this.speed);
    this.timerId = setTimeout(() => {
      this.executeStep();
    }, duration);
  }"""

if old_execute_step in code:
    code = code.replace(old_execute_step, new_execute_step)
    print("Replaced executeStep successfully!")
else:
    print("WARNING: old_execute_step not found!")

with open("js/simulation.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated js/simulation.js successfully!")
