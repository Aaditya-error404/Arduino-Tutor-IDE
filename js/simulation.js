/**
 * Simulation Engine for Arduino Uno Virtual Tutor
 * Supports both LED Blink Lab and Servo Motor Control Lab.
 * Handles virtual pin voltages, PWM pulse width modulation, servo gear dynamics,
 * line-by-line code stepping, and real-time dual-mode oscilloscope graphing.
 */

class CircuitSimulation {
  constructor() {
    this.activeLab = 'servo'; // 'servo' or 'led'
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1.0; // 0.5x, 1.0x, 2.0x
    this.activeLessonId = 1;
    this.currentStepIndex = 0;
    this.loopCount = 0;
    this.stepCount = 0;
    this.stepPhase = 'setup'; // 'setup' then 'loop'
    this.stepPointer = 0;
    this.setupSteps = [];
    this.loopSteps = [];
    this.timerId = null;
    this.stepStartTime = null;
    this.stepTargetDuration = 0;
    this.remainingDelay = 0;

    // Transient Timeout Handles
    this.servoMovingTimeout = null;
    this.sonarPingTimeout = null;
    this.irBeamTimeout = null;

    // Common Electrical State
    this.voltage = 5.0;
    this.currentMa = 45.0;

    // LED Lab Hardware State
    this.pin13Configured = false;
    this.pin13State = false; // true = HIGH (5V), false = LOW (0V)
    this.delayOn = 1000;
    this.delayOff = 1000;

    // Servo Lab Hardware State
    this.servoAttached = false;
    this.servoPin = 9;
    this.servoAngle = 90; // degrees: 0 to 180
    this.servoTargetAngle = 90;
    this.servoPulseWidthMs = 1.50; // 1.0ms to 2.0ms
    this.servoMoving = false;
    this.servoAngle1 = 90;
    this.servoAngle2 = 180;
    this.servoDelay = 1000;

    // Servo Lesson 4 Sweep State
    this.sweepPos = 0;
    this.sweepMin = 0;
    this.sweepMax = 180;
    this.sweepDirection = 1; // 1 = forward, -1 = reverse
    this.sweepStepDelay = 15;
    this.activePreset = null;

    // Potentiometer Lab Hardware State
    this.potVal = 512;
    this.potAngle = 90;
    this.potConnected = false;
    this.potPreset = null;

    // Pushbutton Lab Hardware State
    this.buttonPin = 2;
    this.buttonConfigured = false;
    this.buttonPressed = false;
    this.buttonLedState = false;
    this.buttonMode = 'momentary';

    // Buzzer Lab Hardware State
    this.buzzerPin = 8;
    this.buzzerToneFreq = 0;
    this.buzzerActive = false;
    this.buzzerSong = 'scale';
    this.buzzerNoteIndex = 0;
    this.sirenLowFreq = 650;
    this.sirenHighFreq = 950;
    this.sirenIntervalMs = 250;

    // LDR Light Sensor Lab Hardware State
    this.ldrPin = 'A1';
    this.ldrRaw = 650;
    this.ldrLux = 450;
    this.ldrThreshold = 400;
    this.ldrLightOn = false;

    // RGB Multi-Color LED Lab Hardware State
    this.rgbRedPin = 9;
    this.rgbGreenPin = 10;
    this.rgbBluePin = 11;
    this.rgbR = 255;
    this.rgbG = 0;
    this.rgbB = 0;
    this.rgbHue = 0;
    this.rgbMode = 'manual'; // 'manual' or 'rainbow'

    // 16x2 I2C Character LCD Display State
    this.lcdAddress = '0x27';
    this.lcdCols = 16;
    this.lcdRows = 2;
    this.lcdBacklight = true;
    this.lcdLine0 = 'I2C Bus Ready!  ';
    this.lcdLine1 = 'Address: 0x27   ';
    this.lcdCursorCol = 0;
    this.lcdCursorRow = 0;
    this.lcdCustomChar = [0, 10, 31, 31, 14, 4, 0, 0]; // 5x8 Heart
    this.lcdScreenMode = 0; // 0: Climate, 1: Radar, 2: Solar

    // TCRT5000 / KY-033 IR Reflective Sensor State
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

    // HC-SR04 Ultrasonic Distance Sensor State
    this.sonarTrigPin = 12;
    this.sonarEchoPin = 11;
    this.sonarDistanceCm = 45.0; // cm
    this.sonarDurationUs = Math.round(45.0 * 58.2); // us
    this.sonarAlertZone = 'caution'; // 'safe', 'caution', 'hazard', 'stop'
    this.sonarPingActive = false;
    this.sonarBuzzerBeeping = false;
    this.sonarLedStrobe = false;

    // Temperature Sensor TMP36 & HVAC State
    this.tempPin = 'A2';
    this.tempC = 25.0; // degrees Celsius
    this.tempVolts = 0.75; // 0.75V = 25°C
    this.tempRaw = 154; // (0.75 / 5.0) * 1024
    this.tempThreshold = 30.0; // Overheat alert threshold
    this.tempAlarmActive = false;
    this.fanActive = false;
    this.fanSpeed = 0; // 0 to 255
    this.fanAngle = 0; // rotation angle in degrees

    // Motor Lab Hardware State
    this.motorDirection = 'FORWARD';
    this.motorReverse = false;
    this.motorSpeed = 200;
    this.in1 = false;
    this.in2 = false;
    this.in3 = false;
    this.in4 = false;

    // Soil Moisture & Relay Lab
    this.soilRelayActive = false;
    this.soilPumpActive = false;

    // Gas Sensor Lab
    this.gasPpm = 380;
    this.gasAlarmActive = false;

    // DHT Climate Lab
    this.dhtTemp = 24.5;
    this.dhtHumidity = 55.0;

    // OLED Display Lab
    this.oledPages = 8;

    // IMU MPU-6050 Lab
    this.imuPitch = 12.4;
    this.imuRoll = -3.8;

    // 3D Printing & Toolpath Studio
    this.slicerLayer = 14;

    // Digital Multimeter Lab
    this.dmmVoltage = 4.98;

    // Oscilloscope State
    this.scopeCanvas = null;
    this.scopeCtx = null;
    this.scopeHistory = [];
    this.maxScopePoints = 180;
    this.scopeAnimId = null;
    this.scopePhase = 0;

    // Callbacks
    this.onStepChange = null;
    this.onHardwareChange = null;
  }

  getHardwareState() {
    return this;
  }

  initScope(canvasElement) {
    this.scopeCanvas = canvasElement;
    if (this.scopeCanvas) {
      this.scopeCtx = this.scopeCanvas.getContext('2d');
      for (let i = 0; i < this.maxScopePoints; i++) {
        this.scopeHistory.push(0);
      }
      this.renderScope();
    }
  }

  startScopeLoop() {
    if (!this.scopeCtx || !this.scopeCanvas) return;
    const loop = () => {
      if (!this.isRunning) return;
      if (this.activeLab === 'led') {
        const isHigh = ((this.pin13Configured || this.isRunning) && this.pin13State);
        this.scopeHistory.push(isHigh ? 5.0 : 0.0);
        if (this.scopeHistory.length > this.maxScopePoints) {
          this.scopeHistory.shift();
        }
      }
      this.renderScope();
      this.scopeAnimId = requestAnimationFrame(loop);
    };
    if (this.scopeAnimId) cancelAnimationFrame(this.scopeAnimId);
    this.scopeAnimId = requestAnimationFrame(loop);
  }

  setSpeed(speedVal) {
    const oldSpeed = this.speed || 1.0;
    this.speed = parseFloat(speedVal) || 1.0;
    if (this.isPaused && this.remainingDelay > 0) {
      const ratio = oldSpeed / this.speed;
      this.remainingDelay = Math.max(20, Math.round(this.remainingDelay * ratio));
    }
    if (this.isRunning && !this.isPaused && this.timerId) {
      const elapsed = Date.now() - (this.stepStartTime || Date.now());
      const remainingTime = Math.max(0, (this.stepTargetDuration || 0) - elapsed);
      const ratio = oldSpeed / this.speed;
      const newRemaining = Math.max(10, Math.round(remainingTime * ratio));
      clearTimeout(this.timerId);
      this.stepStartTime = Date.now();
      this.stepTargetDuration = newRemaining;
      this.timerId = setTimeout(() => {
        this.timerId = null;
        this.remainingDelay = 0;
        this.executeStep();
      }, newRemaining);
    }
  }

  setLab(labName) {
    this.stop();
    this.activeLab = labName;
    if (labName === 'servo') {
      this.voltage = 5.0;
      this.currentMa = 45.0;
      this.setLesson(1);
    } else if (labName === 'pot') {
      this.voltage = 2.50;
      this.currentMa = 55.0;
      this.potVal = 512;
      this.potAngle = 90;
      this.potConnected = true;
      this.servoAttached = true;
      this.servoAngle = 90;
      this.setLesson(1);
    } else if (labName === 'button') {
      this.voltage = 5.0;
      this.currentMa = 35.0;
      this.buttonConfigured = true;
      this.buttonPressed = false;
      this.buttonLedState = false;
      this.setLesson(1);
    } else if (labName === 'buzzer') {
      this.voltage = 5.0;
      this.currentMa = 20.0;
      this.buzzerToneFreq = 440;
      this.buzzerActive = false;
      this.setLesson(1);
    } else if (labName === 'ldr') {
      this.voltage = 3.20;
      this.currentMa = 25.0;
      this.ldrRaw = 650;
      this.ldrLux = 450;
      this.ldrThreshold = 400;
      this.ldrLightOn = false;
      this.setLesson(1);
    } else if (labName === 'rgb') {
      this.voltage = 5.00;
      this.currentMa = 35.0;
      this.rgbR = 255;
      this.rgbG = 255;
      this.rgbB = 0;
      this.rgbHue = 60;
      this.rgbMode = 'manual';
      this.setLesson(1);
    } else if (labName === 'lcd') {
      this.voltage = 5.0;
      this.currentMa = 35.0;
      this.lcdBacklight = true;
      this.lcdLine0 = 'I2C Bus Ready!  ';
      this.lcdLine1 = 'Address: 0x27   ';
      this.lcdCursorCol = 0;
      this.lcdCursorRow = 0;
      this.lcdScreenMode = 0;
      this.setLesson(1);
    } else if (labName === 'ir') {
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
    } else if (labName === 'sonar') {
      this.voltage = 5.0;
      this.currentMa = 15.0;
      this.sonarDistanceCm = 45.0;
      this.sonarDurationUs = Math.round(45.0 * 58.2);
      this.sonarAlertZone = 'caution';
      this.sonarPingActive = false;
      this.sonarBuzzerBeeping = false;
      this.sonarLedStrobe = false;
      this.setLesson(1);
                                                } else if (labName === 'iot') {
      this.voltage = 3.3;
      this.currentMa = 120.0;
      this.iotCpuFreq = 240;
      this.iotWifiConnected = true;
      this.iotIpAddress = '192.168.1.105';
      this.iotMqttConnected = true;
      this.iotPacketsSent = 1248;
      this.iotRemoteFan = true;
      this.iotCloudTemp = 26.4;
      this.iotCloudAqi = 45;
      this.setLesson(1);
    } else if (labName === 'rfid') {
      this.voltage = 3.3;
      this.currentMa = 26.0;
      this.rfidUid = 'A3 7F 4E 12';
      this.rfidAccessStatus = 'STANDBY';
      this.rfidDoorUnlocked = false;
      this.rfidWalletBalance = 150.0;
      this.rfidFluxActive = false;
      this.setLesson(1);
    } else if (labName === 'imu') {
      this.voltage = 3.3;
      this.currentMa = 3.9;
      this.imuPitch = 0.0;
      this.imuRoll = 0.0;
      this.imuGyroRate = 0.0;
      this.imuIntegratedAngle = 0.0;
      this.imuNoiseActive = false;
      this.imuGimbalActive = true;
      this.setLesson(1);
    } else if (labName === 'motor') {
      this.voltage = 12.0;
      this.currentMa = 380.0;
      this.motorMotion = 'FORWARD';
      this.motorLeftPwm = 200;
      this.motorRightPwm = 200;
      this.motorLeftRpm = 185;
      this.motorRightRpm = 185;
      this.motorHeatsinkTemp = 48.0;
      this.motorObstacleDist = 45;
      this.setLesson(1);
    } else if (labName === 'soil') {
      this.voltage = 5.0;
      this.currentMa = 12.0;
      this.soilMoisture = 42;
      this.soilRawAdc = 445;
      this.soilRelayActive = false;
      this.soilPumpActive = false;
      this.soilWaterLevelOk = true;
      this.soilDryLimit = 35;
      this.soilWetLimit = 65;
      this.setLesson(1);
    } else if (labName === 'oled') {
      this.voltage = 3.3;
      this.currentMa = 22.5;
      this.oledCursorX = 64;
      this.oledCursorY = 32;
      this.oledWaveType = 'sine';
      this.oledWaveFreq = 2;
      this.oledMenuPage = 0;
      this.oledSelectedIdx = 0;
      this.oledSpriteMode = 'heart';
      this.setLesson(1);
    } else if (labName === 'gas') {
      this.voltage = 0.85;
      this.currentMa = 155.0;
      this.gasPpm = 120;
      this.gasAqi = 45;
      this.gasAlarmActive = false;
      this.gasHeaterReady = true;
      this.setLesson(1);
    } else if (labName === 'dht') {
      this.voltage = 5.0;
      this.currentMa = 2.5;
      this.dhtTemp = 28.5;
      this.dhtHumidity = 65.0;
      this.dhtHeatIndex = 31.2;
      this.dhtFanState = false;
      this.dhtMistState = false;
      this.setLesson(1);
    } else if (labName === 'slicer') {
      this.voltage = 0.0;
      this.currentMa = 0.0;
      this.slicerLayer = 45;
      this.slicerLayerHeight = 0.20;
      this.slicerInfillDensity = 20;
      this.slicerInfillPattern = 'grid';
      this.slicerSupportsEnabled = false;
      this.slicerHotendTemp = 205;
      this.slicerBedTemp = 60;
      this.setLesson(1);
    } else if (labName === 'dmm') {
      this.voltage = 5.0;
      this.currentMa = 13.4;
      this.dmmMode = 'dcv';
      this.dmmRedNode = '5V';
      this.dmmBlackNode = 'GND';
      this.dmmReading = '5.00 V';
      this.dmmFaultScenario = 'healthy';
      this.setLesson(1);
    } else if (labName === 'cad') {
      this.voltage = 0.0;
      this.currentMa = 0.0;
      this.cadWidth = 20.0;
      this.cadDepth = 20.0;
      this.cadHeight = 20.0;
      this.cadHoleDiameter = 10.0;
      this.cadIsGrouped = false;
      this.cadWallThickness = 2.5;
      this.cadTolerance = 0.4;
      this.setLesson(1);
    } else if (labName === 'temp') {
      this.voltage = 0.75;
      this.currentMa = 28.0;
      this.tempC = 25.0;
      this.tempVolts = 0.75;
      this.tempRaw = 154;
      this.tempThreshold = 30.0;
      this.tempAlarmActive = false;
      this.fanActive = false;
      this.fanSpeed = 0;
      this.setLesson(1);
    } else {
      this.voltage = 0.0;
      this.currentMa = 0.0;
      this.setLesson(1);
    }
    this.notifyHardware();
  }

  setLesson(lessonId) {
    this.stop();
    this.activeLessonId = lessonId;
    this.currentStepIndex = 0;
    this.loopCount = 0;

    if (this.activeLab === 'led') {
      if (lessonId === 1) {
        this.pin13Configured = true;
      } else if (lessonId === 2) {
        this.pin13Configured = false;
      } else {
        this.pin13Configured = true;
      }
      this.setPin13(false);
    } else if (this.activeLab === 'pot') {
      this.servoAttached = true;
      if (lessonId === 1) {
        this.potConnected = true;
        this.potVal = 512;
        this.potAngle = 90;
      } else if (lessonId === 2) {
        this.potConnected = false;
        this.potVal = 512;
        this.potAngle = 90;
      } else if (lessonId === 3) {
        this.potConnected = true;
        this.potVal = 512;
        this.potAngle = 90;
      } else if (lessonId === 4) {
        this.potConnected = true;
        this.potVal = 512;
        this.potAngle = 90;
      }
      this.setServoAngle(this.potAngle, false);
      this.voltage = +((this.potVal * 5.0) / 1023.0).toFixed(2);
    } else if (this.activeLab === 'button') {
      if (lessonId === 1) {
        this.buttonConfigured = true;
        this.buttonPressed = false;
        this.buttonLedState = false;
      } else if (lessonId === 2) {
        this.buttonConfigured = false;
        this.buttonPressed = false;
        this.buttonLedState = false;
      } else if (lessonId === 3) {
        this.buttonConfigured = true;
        this.buttonPressed = false;
        this.buttonLedState = false;
        this.buttonMode = 'momentary';
      } else if (lessonId === 4) {
        this.buttonConfigured = true;
        this.buttonPressed = false;
        this.buttonLedState = false;
        this.buttonMode = 'toggle';
      }
      this.voltage = this.buttonPressed ? 0.0 : 5.0;
    } else if (this.activeLab === 'buzzer') {
      this.buzzerActive = false;
      this.buzzerNoteIndex = 0;
      if (lessonId === 1) {
        this.buzzerToneFreq = 440;
      } else if (lessonId === 2) {
        this.buzzerToneFreq = 650;
      } else if (lessonId === 3) {
        this.buzzerToneFreq = 262; // C4
      } else if (lessonId === 4) {
        this.buzzerToneFreq = 0;
      }
      if (window.soundEngine) {
        window.soundEngine.stopBuzzerTone();
      }
      this.voltage = 5.0;
      this.currentMa = 20.0;
    } else if (this.activeLab === 'ldr') {
      this.ldrThreshold = 400;
      if (lessonId === 1) {
        this.ldrRaw = 650;
        this.ldrLightOn = false;
      } else if (lessonId === 2) {
        this.ldrRaw = 650;
        this.ldrLightOn = false;
      } else if (lessonId === 3) {
        this.ldrRaw = 320; // Dusk demo: triggers streetlamp ON
        this.ldrLightOn = true;
      } else if (lessonId === 4) {
        this.ldrRaw = 650;
        this.ldrLightOn = false;
      }
      this.ldrLux = Math.round((this.ldrRaw / 1023.0) * 1000);
      this.voltage = +((this.ldrRaw * 5.0) / 1023.0).toFixed(2);
      this.currentMa = this.ldrLightOn ? 45.0 : 15.0;
    } else if (this.activeLab === 'rgb') {
      if (lessonId === 1) {
        this.rgbR = 255;
        this.rgbG = 255;
        this.rgbB = 0; // Yellow demo for Lesson 1
      } else if (lessonId === 2) {
        this.rgbR = 128; // 50% PWM Duty Cycle for Lesson 2
        this.rgbG = 0;
        this.rgbB = 0;
      } else if (lessonId === 3) {
        this.rgbR = 180; // Neon Purple
        this.rgbG = 0;
        this.rgbB = 255;
      } else if (lessonId === 4) {
        this.rgbR = 255;
        this.rgbG = 0;
        this.rgbB = 0;
        this.rgbHue = 0;
      }
      this.voltage = 5.00;
      this.currentMa = +(15.0 + ((this.rgbR + this.rgbG + this.rgbB) / 765.0) * 35.0).toFixed(1);
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
    } else if (this.activeLab === 'sonar') {
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
    } else if (this.activeLab === 'temp') {
      this.tempThreshold = 30.0;
      if (lessonId === 1) {
        this.tempC = 25.0;
        this.fanActive = false;
        this.tempAlarmActive = false;
      } else if (lessonId === 2) {
        this.tempC = 25.0;
        this.fanActive = false;
        this.tempAlarmActive = false;
      } else if (lessonId === 3) {
        this.tempC = 34.5; // Overheat demo: triggers alarm!
        this.tempAlarmActive = true;
        this.fanActive = false;
      } else if (lessonId === 4) {
        this.tempC = 35.0; // Warm greenhouse: triggers cooling fan!
        this.tempAlarmActive = false;
        this.fanActive = true;
        this.fanSpeed = 180;
      }
      this.tempVolts = +((this.tempC / 100.0) + 0.5).toFixed(3);
      this.tempRaw = Math.round((this.tempVolts / 5.0) * 1024);
      this.voltage = this.tempVolts;
      this.currentMa = this.fanActive ? 65.0 : 25.0;
    } else {
      // Servo Lab initialization
      if (lessonId === 1) {
        this.servoAttached = true;
        this.servoAngle = 90;
      } else if (lessonId === 2) {
        this.servoAttached = false;
        this.servoAngle = 90;
      } else if (lessonId === 3) {
        this.servoAttached = true;
        this.servoAngle = this.servoAngle1;
      } else if (lessonId === 4) {
        this.servoAttached = true;
        this.sweepPos = 0;
        this.sweepDirection = 1;
        this.servoAngle = 0;
      }
      this.updateServoPulse();
    }
    this.notifyHardware();
  }

  // --- LED Lab Specific Methods ---
  claimPin13(isOutput) {
    this.pin13Configured = isOutput;
    if (window.soundEngine) {
      window.soundEngine.playPinClaim();
    }
    this.notifyHardware();
  }

  setDelays(onMs, offMs) {
    this.delayOn = Math.max(20, Math.min(10000, parseInt(onMs) || 1000));
    this.delayOff = Math.max(20, Math.min(10000, parseInt(offMs) || 1000));
    this.buildExecutionPlan();
  }

  setPin13(high) {
    this.pin13State = !!high;
    if ((this.pin13Configured || this.isRunning) && this.pin13State) {
      this.voltage = 5.0;
      this.currentMa = 18.2;
    } else {
      this.voltage = 0.0;
      this.currentMa = 0.0;
    }
    this.notifyHardware();
  }


  // --- Potentiometer Lab Specific Methods ---
  setPotValue(val, playSound = false) {
    this.potVal = Math.max(0, Math.min(1023, Math.round(val)));
    this.potAngle = Math.round((this.potVal / 1023.0) * 180.0);
    this.voltage = +((this.potVal * 5.0) / 1023.0).toFixed(2);
    this.setServoAngle(this.potAngle, playSound);
    if (playSound && window.soundEngine) {
      window.soundEngine.playPotTick();
    }
    this.notifyHardware();
  }

  connectPotWiper(connected = true) {
    this.potConnected = connected;
    if (window.soundEngine) window.soundEngine.playPinClaim();
    this.notifyHardware();
  }

  // --- Pushbutton Lab Specific Methods ---
  configureButtonPin(isConfigured = true) {
    this.buttonConfigured = isConfigured;
    if (window.soundEngine) window.soundEngine.playPinClaim();
    this.notifyHardware();
  }

  setButtonPressed(isPressed) {
    this.buttonPressed = !!isPressed;
    if (this.buttonMode === 'toggle') {
      if (isPressed) {
        this.buttonLedState = !this.buttonLedState;
        if (window.soundEngine) window.soundEngine.playToggle(this.buttonLedState);
      }
    } else {
      this.buttonLedState = this.buttonPressed;
      if (window.soundEngine) window.soundEngine.playTactileClick(isPressed);
    }
    this.currentMa = this.buttonLedState ? 65.0 : 35.0;
    this.voltage = this.buttonPressed ? 0.0 : 5.0;
    this.notifyHardware();
  }

  // --- Servo Lab Specific Methods ---
  attachServoPin(pin = 9) {
    this.servoAttached = (pin === 9);
    this.servoPin = pin;
    if (window.soundEngine) {
      window.soundEngine.playServoAttach();
    }
    this.notifyHardware();
  }

  updateServoPulse() {
    this.servoPulseWidthMs = +(1.0 + (this.servoAngle / 180.0) * 1.0).toFixed(2);
  }

  setServoAngle(angle, playSound = true) {
    const clamped = Math.max(0, Math.min(180, Math.round(angle)));
    const diff = Math.abs(clamped - this.servoAngle);
    this.servoAngle = clamped;
    this.updateServoPulse();

    if (diff > 2 && playSound && window.soundEngine) {
      const dur = Math.max(80, Math.min(550, diff * 3.2));
      window.soundEngine.playServoWhirr(dur);
    }

    this.servoMoving = diff > 2;
    this.currentMa = this.servoMoving ? 185.0 : 45.0;
    this.voltage = 5.0;
    this.notifyHardware();

    if (this.servoMoving) {
      if (this.servoMovingTimeout) clearTimeout(this.servoMovingTimeout);
      this.servoMovingTimeout = setTimeout(() => {
        this.servoMovingTimeout = null;
        this.servoMoving = false;
        this.currentMa = 45.0;
        this.notifyHardware();
      }, 250);
    }
  }

  setServoAngles(a1, a2, delayMs) {
    this.servoAngle1 = Math.max(0, Math.min(180, parseInt(a1) || 90));
    this.servoAngle2 = Math.max(0, Math.min(180, parseInt(a2) || 180));
    this.servoDelay = Math.max(100, Math.min(5000, parseInt(delayMs) || 1000));
    this.buildExecutionPlan();
  }

  setServoPreset(preset) {
    this.activePreset = preset;
    if (preset.type === 'sweep') {
      this.sweepMin = preset.a1;
      this.sweepMax = preset.a2;
      this.sweepStepDelay = preset.delay || 15;
      this.sweepPos = preset.a1;
      this.sweepDirection = 1;
      this.setServoAngle(this.sweepPos, false);
    } else {
      this.servoAngle1 = preset.a1;
      this.servoAngle2 = preset.a2;
      this.servoDelay = preset.delay || 500;
      this.setServoAngle(this.servoAngle1, false);
    }
    this.buildExecutionPlan();
  }

  // --- Buzzer Lab Specific Methods ---
  setBuzzerTone(freq, durationMs = 0) {
    this.buzzerToneFreq = Math.max(0, Math.min(10000, Math.round(freq)));
    this.buzzerActive = this.buzzerToneFreq > 0;
    this.currentMa = this.buzzerActive ? 22.5 : 2.0;
    if (window.soundEngine) {
      if (this.buzzerActive) {
        window.soundEngine.playBuzzerTone(this.buzzerToneFreq, durationMs);
      } else {
        window.soundEngine.stopBuzzerTone();
      }
    }
    this.notifyHardware();
  }

  startBuzzer(freq, durationMs = 0) {
    this.setBuzzerTone(freq, durationMs);
  }

  stopBuzzer() {
    this.buzzerToneFreq = 0;
    this.buzzerActive = false;
    this.currentMa = 2.0;
    if (window.soundEngine) {
      window.soundEngine.stopBuzzerTone();
    }
    this.notifyHardware();
  }

  setSirenParams(lowFreq, highFreq, intervalMs) {
    this.sirenLowFreq = Math.max(100, Math.min(4000, parseInt(lowFreq) || 650));
    this.sirenHighFreq = Math.max(100, Math.min(4000, parseInt(highFreq) || 950));
    this.sirenIntervalMs = Math.max(50, Math.min(2000, parseInt(intervalMs) || 250));
  }

  // --- LDR Light Sensor Lab Specific Methods ---
  setLdrValue(rawVal) {
    this.ldrRaw = Math.max(0, Math.min(1023, Math.round(rawVal)));
    this.ldrLux = Math.round((this.ldrRaw / 1023.0) * 1000);
    this.voltage = +((this.ldrRaw * 5.0) / 1023.0).toFixed(2);
    this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
    this.currentMa = this.ldrLightOn ? 45.0 : 15.0;
    this.notifyHardware();
  }

  setLdrThreshold(thresh) {
    this.ldrThreshold = Math.max(50, Math.min(950, Math.round(thresh)));
    this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
    this.notifyHardware();
  }

  // --- RGB Multi-Color LED Lab Specific Methods ---
  setRgb(r, g, b) {
    this.rgbR = Math.max(0, Math.min(255, Math.round(r)));
    this.rgbG = Math.max(0, Math.min(255, Math.round(g)));
    this.rgbB = Math.max(0, Math.min(255, Math.round(b)));
    this.currentMa = +(15.0 + ((this.rgbR + this.rgbG + this.rgbB) / 765.0) * 35.0).toFixed(1);
    this.notifyHardware();
  }

  setRgbChannel(channel, val) {
    val = Math.max(0, Math.min(255, Math.round(val)));
    if (channel === 'r' || channel === 'red') this.rgbR = val;
    else if (channel === 'g' || channel === 'green') this.rgbG = val;
    else if (channel === 'b' || channel === 'blue') this.rgbB = val;
    this.currentMa = +(15.0 + ((this.rgbR + this.rgbG + this.rgbB) / 765.0) * 35.0).toFixed(1);
    this.notifyHardware();
  }

  toggleRgbChannel(channel) {
    if (channel === 'r' || channel === 'red') this.rgbR = this.rgbR > 0 ? 0 : 255;
    else if (channel === 'g' || channel === 'green') this.rgbG = this.rgbG > 0 ? 0 : 255;
    else if (channel === 'b' || channel === 'blue') this.rgbB = this.rgbB > 0 ? 0 : 255;
    this.currentMa = +(15.0 + ((this.rgbR + this.rgbG + this.rgbB) / 765.0) * 35.0).toFixed(1);
    this.notifyHardware();
  }

  setRgbFromHue(hue) {
    this.rgbHue = (Math.round(hue) % 360 + 360) % 360;
    const c = 255;
    const x = Math.round(c * (1 - Math.abs((this.rgbHue / 60) % 2 - 1)));
    let r = 0, g = 0, b = 0;
    if (this.rgbHue < 60) { r = c; g = x; b = 0; }
    else if (this.rgbHue < 120) { r = x; g = c; b = 0; }
    else if (this.rgbHue < 180) { r = 0; g = c; b = x; }
    else if (this.rgbHue < 240) { r = 0; g = x; b = c; }
    else if (this.rgbHue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    this.setRgb(r, g, b);
  }

  // --- Temperature Sensor TMP36 & HVAC Methods ---
  setLcdText(row, str) {
    const padded = (str + '                ').substring(0, 16);
    if (row === 0) this.lcdLine0 = padded;
    else this.lcdLine1 = padded;
    this.notifyHardware();
  }

  toggleLcdBacklight() {
    this.lcdBacklight = !this.lcdBacklight;
    this.currentMa = this.lcdBacklight ? 35.0 : 15.0;
    this.notifyHardware();
  }

  setLcdCursor(col, row) {
    this.lcdCursorCol = Math.max(0, Math.min(15, col));
    this.lcdCursorRow = Math.max(0, Math.min(1, row));
    this.notifyHardware();
  }

  setLcdCustomChar(bytes) {
    if (Array.isArray(bytes) && bytes.length === 8) {
      this.lcdCustomChar = bytes;
      this.notifyHardware();
    }
  }

  setLcdScreenMode(mode) {
    this.lcdScreenMode = mode % 3;
    if (this.lcdScreenMode === 0) {
      this.setLcdText(0, 'CLIMATE MONITOR ');
      this.setLcdText(1, 'Temp: ' + this.tempC.toFixed(1) + ' C');
    } else if (this.lcdScreenMode === 1) {
      this.setLcdText(0, 'RADAR PROXIMITY ');
      this.setLcdText(1, 'Dist: ' + this.sonarDistanceCm.toFixed(1) + ' cm');
    } else {
      this.setLcdText(0, 'SOLAR SKY LUX   ');
      this.setLcdText(1, 'Light: ' + this.ldrLux + ' Lux');
    }
  }

  setIrSurface(type) {
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
    if (this.irBeamTimeout) clearTimeout(this.irBeamTimeout);
    this.irBeamTimeout = setTimeout(() => {
      this.irBeamTimeout = null;
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

  setSonarDistance(cm) {
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
    if (this.sonarPingTimeout) clearTimeout(this.sonarPingTimeout);
    this.sonarPingTimeout = setTimeout(() => {
      this.sonarPingTimeout = null;
      this.sonarPingActive = false;
      this.notifyHardware();
    }, 600);
  }

  clearTransientTimers() {
    if (this.servoMovingTimeout) {
      clearTimeout(this.servoMovingTimeout);
      this.servoMovingTimeout = null;
    }
    if (this.sonarPingTimeout) {
      clearTimeout(this.sonarPingTimeout);
      this.sonarPingTimeout = null;
    }
    if (this.irBeamTimeout) {
      clearTimeout(this.irBeamTimeout);
      this.irBeamTimeout = null;
    }
    this.servoMoving = false;
    this.sonarPingActive = false;
    this.irBeamActive = false;
  }

  setTemperature(temp) {
    this.tempC = Math.max(-40.0, Math.min(125.0, +temp.toFixed(1)));
    this.tempVolts = +((this.tempC / 100.0) + 0.5).toFixed(3);
    this.tempRaw = Math.max(0, Math.min(1023, Math.round((this.tempVolts / 5.0) * 1024)));
    this.voltage = this.tempVolts;
    this.tempAlarmActive = this.tempC > this.tempThreshold;

    if (this.tempC > 28.0) {
      this.fanActive = true;
      this.fanSpeed = Math.max(100, Math.min(255, Math.round(((this.tempC - 28.0) / 17.0) * 155 + 100)));
    } else {
      this.fanActive = false;
      this.fanSpeed = 0;
    }

    this.currentMa = this.fanActive ? +(30.0 + (this.fanSpeed / 255.0) * 45.0).toFixed(1) : (this.tempAlarmActive ? 42.0 : 22.0);
    this.notifyHardware();
  }

  setTempThreshold(thresh) {
    this.tempThreshold = Math.max(15.0, Math.min(50.0, +thresh.toFixed(1)));
    this.tempAlarmActive = this.tempC > this.tempThreshold;
    this.notifyHardware();
  }

  logToSerial(msg) {
    if (this.onSerialLog) {
      this.onSerialLog(msg);
    }
  }

  notifyHardware() {
    if (this.onHardwareChange) {
      this.onHardwareChange({
        activeLab: this.activeLab,
        pin13Configured: this.pin13Configured,
        pin13State: this.pin13State,
        voltage: this.voltage,
        currentMa: this.currentMa,
        ledActive: (this.pin13Configured && this.pin13State) || (this.activeLab === 'button' && this.buttonLedState) || (this.activeLab === 'ldr' && this.ldrLightOn) || (this.activeLab === 'temp' && this.tempAlarmActive),
        servoAttached: this.servoAttached,
        servoPin: this.servoPin,
        servoAngle: this.servoAngle,
        servoPulseWidthMs: this.servoPulseWidthMs,
        servoMoving: this.servoMoving,
        potVal: this.potVal,
        potAngle: this.potAngle,
        potConnected: this.potConnected,
        buttonConfigured: this.buttonConfigured,
        buttonPressed: this.buttonPressed,
        buttonLedState: this.buttonLedState,
        buttonMode: this.buttonMode,
        buzzerPin: this.buzzerPin,
        buzzerToneFreq: this.buzzerToneFreq,
        buzzerActive: this.buzzerActive,
        ldrPin: this.ldrPin,
        ldrRaw: this.ldrRaw,
        ldrLux: this.ldrLux,
        ldrThreshold: this.ldrThreshold,
        ldrLightOn: this.ldrLightOn,
        rgbRedPin: this.rgbRedPin,
        rgbGreenPin: this.rgbGreenPin,
        rgbBluePin: this.rgbBluePin,
        rgbR: this.rgbR,
        rgbG: this.rgbG,
        rgbB: this.rgbB,
        rgbHue: this.rgbHue,
        rgbMode: this.rgbMode,
        tempPin: this.tempPin,
        lcdBacklight: this.lcdBacklight,
      lcdLine0: this.lcdLine0,
      lcdLine1: this.lcdLine1,
      lcdCursorCol: this.lcdCursorCol,
      lcdCursorRow: this.lcdCursorRow,
      lcdCustomChar: this.lcdCustomChar,
      lcdScreenMode: this.lcdScreenMode,
      irSurface: this.irSurface,
      irReflectRaw: this.irReflectRaw,
      irVoltage: this.irVoltage,
      irThreshold: this.irThreshold,
      irLineDetected: this.irLineDetected,
      irBeamActive: this.irBeamActive,
      roverRunning: this.roverRunning,
      roverSteerState: this.roverSteerState,
      roverLeftMotor: this.roverLeftMotor,
      roverRightMotor: this.roverRightMotor,
      sonarDistanceCm: this.sonarDistanceCm,
      sonarDurationUs: this.sonarDurationUs,
      sonarAlertZone: this.sonarAlertZone,
      sonarPingActive: this.sonarPingActive,
      sonarBuzzerBeeping: this.sonarBuzzerBeeping,
      sonarLedStrobe: this.sonarLedStrobe,
      tempC: this.tempC,
        tempVolts: this.tempVolts,
        tempRaw: this.tempRaw,
        tempThreshold: this.tempThreshold,
        tempAlarmActive: this.tempAlarmActive,
        fanActive: this.fanActive,
        fanSpeed: this.fanSpeed,
        motorDirection: this.motorDirection,
        motorReverse: this.motorReverse,
        motorSpeed: this.motorSpeed,
        soilRelayActive: this.soilRelayActive,
        soilPumpActive: this.soilPumpActive,
        gasPpm: this.gasPpm,
        gasAlarmActive: this.gasAlarmActive,
        dhtTemp: this.dhtTemp,
        dhtHumidity: this.dhtHumidity,
        oledPages: this.oledPages,
        imuPitch: this.imuPitch,
        imuRoll: this.imuRoll,
        slicerLayer: this.slicerLayer,
        dmmVoltage: this.dmmVoltage
      });
    }
  }

  // --- Simulation Execution Loop ---
  start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 2 && !this.pin13Configured) {
        this.claimPin13(true);
      }
    } else if (this.activeLab === 'servo') {
      if (this.activeLessonId === 2 && !this.servoAttached) {
        this.attachServoPin(9);
      }
    }

    const wasPaused = this.isPaused;
    this.isRunning = true;
    this.isPaused = false;

    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playToggle(true);
    }

    this.startScopeLoop();

    if (wasPaused && this.remainingDelay > 0) {
      this.stepStartTime = Date.now();
      this.stepTargetDuration = this.remainingDelay;
      const rem = this.remainingDelay;
      this.timerId = setTimeout(() => {
        this.timerId = null;
        this.remainingDelay = 0;
        this.executeStep();
      }, rem);
    } else {
      if (!wasPaused) {
        this.stepPhase = 'setup';
        this.stepPointer = 0;
        this.loopCount = 0;
        this.stepCount = 0;
        this.remainingDelay = 0;
        this.buildExecutionPlan();
      }
      this.executeStep();
    }
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
      const elapsed = Date.now() - (this.stepStartTime || Date.now());
      this.remainingDelay = Math.max(0, (this.stepTargetDuration || 0) - elapsed);
    }
    if (this.scopeAnimId) {
      cancelAnimationFrame(this.scopeAnimId);
      this.scopeAnimId = null;
    }
    if (window.soundEngine) {
      window.soundEngine.playToggle(false);
    }
  }

  stop() {
    this.clearTransientTimers();
    if (window.clearAllLabTimers) {
      window.clearAllLabTimers();
    }
    this.isRunning = false;
    this.isPaused = false;
    this.stepPhase = 'setup';
    this.stepPointer = 0;
    this.loopCount = 0;
    this.stepCount = 0;
    this.currentStepIndex = 0;
    this.remainingDelay = 0;
    this.setupSteps = [];
    this.loopSteps = [];
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.scopeAnimId) {
      cancelAnimationFrame(this.scopeAnimId);
      this.scopeAnimId = null;
    }
    this.scopeHistory = new Array(this.maxScopePoints).fill(0);
    if (this.activeLab === 'led') {
      this.setPin13(false);
    } else if (this.activeLab === 'buzzer') {
      this.stopBuzzer();
    } else {
      this.servoMoving = false;
      this.currentMa = 45.0;
    }
    if (this.onStepChange) {
      this.onStepChange(null);
    }
    this.notifyHardware();
    this.renderScope();
  }

  buildExecutionPlan() {
    this.setupSteps = [];
    this.loopSteps = [];

    const cppRows = Array.from(document.querySelectorAll('.code-row-cpp'));
    let lines = [];

    if (cppRows.length > 0) {
      lines = cppRows.map((row, idx) => {
        const lineContent = row.querySelector('.line-content') || row;
        return {
          idx: idx,
          text: (lineContent.textContent || '').trim()
        };
      });
    } else if (window.getCurrentLessons) {
      const lessons = window.getCurrentLessons() || [];
      const curLesson = lessons.find(l => l.id === this.activeLessonId) || lessons[0];
      if (curLesson) {
        const raw = (curLesson.defaultCode && (curLesson.defaultCode.cpp || curLesson.defaultCode.cplusplus)) || curLesson.code || curLesson.cplusplus;
        if (Array.isArray(raw)) {
          lines = raw.map((c, idx) => ({ idx: idx, text: (typeof c === 'string' ? c : c.text).trim() }));
        } else if (typeof raw === 'string') {
          lines = raw.split('\n').map((line, idx) => ({ idx: idx, text: line.trim() }));
        }
      }
    } else if (window.atlCurriculum && window.atlCurriculum[this.activeLab]) {
      const curLesson = (window.atlCurriculum[this.activeLab].lessons || []).find(l => l.id === this.activeLessonId);
      if (curLesson) {
        const raw = (curLesson.defaultCode && (curLesson.defaultCode.cpp || curLesson.defaultCode.cplusplus)) || curLesson.code || curLesson.cplusplus;
        if (Array.isArray(raw)) {
          lines = raw.map((c, idx) => ({ idx: idx, text: (typeof c === 'string' ? c : c.text).trim() }));
        } else if (typeof raw === 'string') {
          lines = raw.split('\n').map((line, idx) => ({ idx: idx, text: line.trim() }));
        }
      }
    }

    if (lines.length === 0) {
      this.loopSteps.push({
        lineIndex: 0,
        text: "Simulation running...",
        type: 'action',
        isDelay: false,
        duration: 500
      });
      return;
    }

    let inSetup = false;
    let inLoop = false;
    let setupFound = false;
    let loopFound = false;

    lines.forEach(({ idx, text }) => {
      if (!text || text === '{' || text === '}') return;
      const lower = text.toLowerCase();

      if (lower.includes('void setup') || lower.includes('setup()') || lower.includes('when power turns on')) {
        inSetup = true;
        inLoop = false;
        setupFound = true;
        this.setupSteps.push({
          lineIndex: idx,
          text: text,
          type: 'header',
          isDelay: false
        });
        return;
      }

      if (lower.includes('void loop') || lower.includes('loop()') || lower.includes('repeat forever')) {
        inSetup = false;
        inLoop = true;
        loopFound = true;
        this.loopSteps.push({
          lineIndex: idx,
          text: text,
          type: 'header',
          isDelay: false
        });
        return;
      }

      const delayMatch = text.match(/delay\s*\(\s*([^)]+)\s*\)/i);
      const isDelay = !!delayMatch;
      const rawParam = delayMatch ? delayMatch[1].trim() : null;

      const isHardwareAction = isDelay ? false : (
        lower.includes('digitalwrite') ||
        lower.includes('analogwrite') ||
        lower.includes('pinmode') ||
        lower.includes('.write(') ||
        lower.includes('.attach(') ||
        lower.includes('tone(') ||
        lower.includes('notone(') ||
        lower.includes('serial.print') ||
        lower.includes('turn pin') ||
        lower.includes('turn servo')
      );

      const stepObj = {
        lineIndex: idx,
        text: text,
        type: isDelay ? 'delay' : (isHardwareAction ? 'action' : 'statement'),
        isDelay: isDelay,
        rawParam: rawParam
      };

      if (inSetup) {
        this.setupSteps.push(stepObj);
      } else if (inLoop) {
        this.loopSteps.push(stepObj);
      } else if (!setupFound && !loopFound) {
        this.setupSteps.push(stepObj);
      } else {
        this.loopSteps.push(stepObj);
      }
    });

    if (this.loopSteps.length === 0) {
      if (this.setupSteps.length > 0) {
        this.loopSteps = [...this.setupSteps];
      } else {
        this.loopSteps.push({
          lineIndex: 0,
          text: "Virtual hardware loop active",
          type: 'action',
          isDelay: false
        });
      }
    }
  }

  resolveDelayDuration(param, lineText) {
    let raw = (param || '').trim();
    if (!raw && lineText) {
      const m = lineText.match(/delay\s*\(\s*([^)]+)\s*\)/i);
      if (m) raw = m[1].trim();
    }
    if (!raw) return 500;

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      return num;
    }

    const lower = raw.toLowerCase();
    if (lower.includes('delayon')) {
      return this.delayOn || 1000;
    }
    if (lower.includes('delayoff')) {
      return this.delayOff || 1000;
    }
    if (lower.includes('servodelay') || lower.includes('delay')) {
      return this.servoDelay || 500;
    }
    if (lower.includes('sweep') || lower.includes('step')) {
      return this.sweepStepDelay || 15;
    }
    return 500;
  }

  executeHardwareInstruction(step) {
    const text = step.text || '';
    const lower = text.toLowerCase();

    // 1. Digital Write
    const dw = text.match(/digitalWrite\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/i);
    if (dw) {
      const pin = dw[1];
      const pinUpper = pin.toUpperCase();
      const val = dw[2].toUpperCase();
      const isHigh = (val === 'HIGH' || val === '1');

      if (this.activeLab === 'led' || pin === '13' || pin === 'LED_BUILTIN') {
        this.setPin13(isHigh);
      } else if (this.activeLab === 'buzzer' || pin === '8') {
        if (isHigh) this.startBuzzer(440); else this.stopBuzzer();
      } else if (this.activeLab === 'button') {
        this.buttonLedState = isHigh;
      } else if (this.activeLab === 'rgb') {
        if (pin === '9' || pinUpper.includes('RED')) this.setRgbChannel('red', isHigh ? 255 : 0);
        else if (pin === '10' || pinUpper.includes('GREEN')) this.setRgbChannel('green', isHigh ? 255 : 0);
        else if (pin === '11' || pinUpper.includes('BLUE')) this.setRgbChannel('blue', isHigh ? 255 : 0);
      } else if (this.activeLab === 'soil' || pinUpper.includes('RELAY') || pin === '7') {
        // Active-low relay: LOW = energized/ON, HIGH = de-energized/OFF
        const pumpOn = !isHigh;
        this.soilRelayActive = pumpOn;
        this.soilPumpActive = pumpOn;
      } else if (this.activeLab === 'motor') {
        if (pinUpper.includes('IN1') || pin === '6') this.in1 = isHigh;
        if (pinUpper.includes('IN2') || pin === '4') this.in2 = isHigh;
        if (pinUpper.includes('IN3')) this.in3 = isHigh;
        if (pinUpper.includes('IN4')) this.in4 = isHigh;
        if (this.in1 && !this.in2) {
          this.motorDirection = 'FORWARD';
          this.motorReverse = false;
        } else if (!this.in1 && this.in2) {
          this.motorDirection = 'REVERSE';
          this.motorReverse = true;
        } else {
          this.motorDirection = 'BRAKE';
        }
      }
      return;
    }

    // 2. Analog Write / PWM
    const aw = text.match(/analogWrite\s*\(\s*(\w+)\s*,\s*([^)]+)\s*\)/i);
    if (aw) {
      const pin = aw[1];
      const pinUpper = pin.toUpperCase();
      const val = parseInt(aw[2].trim(), 10) || 0;
      this.pwmDuty = Math.min(100, Math.round((val / 255.0) * 100));
      this.voltage = (val / 255.0) * 5.0;
      if (this.activeLab === 'led' || pin === '13') {
        this.setPin13(val > 0);
      } else if (this.activeLab === 'rgb') {
        if (pin === '9' || pinUpper.includes('RED')) this.setRgbChannel('red', val);
        else if (pin === '10' || pinUpper.includes('GREEN')) this.setRgbChannel('green', val);
        else if (pin === '11' || pinUpper.includes('BLUE')) this.setRgbChannel('blue', val);
      } else if (this.activeLab === 'motor' || pinUpper.includes('ENA') || pinUpper.includes('ENB')) {
        this.motorSpeed = val;
      } else if (this.activeLab === 'temp') {
        this.fanSpeed = val;
        this.fanActive = val > 0;
      }
      return;
    }

    // 3. Servo Write
    const sw = text.match(/(?:servo|myservo)\.write\s*\(\s*([^)]+)\s*\)/i);
    if (sw) {
      const param = sw[1].trim();
      let angle = parseInt(param, 10);
      if (isNaN(angle)) {
        const pLower = param.toLowerCase();
        if (pLower.includes('angle1')) angle = this.servoAngle1;
        else if (pLower.includes('angle2')) angle = this.servoAngle2;
        else if (pLower.includes('pos')) angle = this.sweepPos;
        else angle = this.servoAngle;
      }
      this.servoAngle = Math.max(0, Math.min(180, angle));
      this.updateServoPulse();
      return;
    }

    // 4. Servo Attach
    const sa = text.match(/(?:servo|myservo)\.attach\s*\(\s*([^)]+)\s*\)/i);
    if (sa) {
      const pin = parseInt(sa[1].trim(), 10) || 9;
      this.attachServoPin(pin);
      return;
    }

    // 5. Tone / noTone
    const tn = text.match(/tone\s*\(\s*(\w+)\s*,\s*([^,\)]+)(?:,\s*([^)]+))?\s*\)/i);
    if (tn) {
      const freq = parseInt(tn[2].trim(), 10) || 440;
      this.buzzerToneFreq = freq;
      this.buzzerActive = true;
      this.startBuzzer(freq);
      return;
    }
    if (lower.includes('notone')) {
      this.buzzerActive = false;
      this.stopBuzzer();
      return;
    }

    // 6. LCD Commands: lcd.print, lcd.setCursor, lcd.clear, lcd.backlight
    if (this.activeLab === 'lcd') {
      const lcdPrint = text.match(/lcd\.print\s*\(\s*(?:"([^"]*)"|F\("([^"]*)"\)|(\w+))\s*\)/i);
      if (lcdPrint) {
        const str = lcdPrint[1] !== undefined ? lcdPrint[1] : (lcdPrint[2] !== undefined ? lcdPrint[2] : lcdPrint[3]);
        if (str !== undefined) {
          const row = this.lcdCursorRow || 0;
          const col = this.lcdCursorCol || 0;
          let current = (row === 0 ? this.lcdLine0 : this.lcdLine1) || ' '.repeat(16);
          while (current.length < 16) current += ' ';
          const before = current.substring(0, col);
          const after = current.substring(Math.min(16, col + str.length));
          const updated = (before + str + after).padEnd(16, ' ').substring(0, 16);
          if (row === 0) this.lcdLine0 = updated; else this.lcdLine1 = updated;
          this.lcdCursorCol = Math.min(15, col + str.length);
        }
        return;
      }
      const lcdCur = text.match(/lcd\.setCursor\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (lcdCur) {
        this.lcdCursorCol = parseInt(lcdCur[1], 10) || 0;
        this.lcdCursorRow = parseInt(lcdCur[2], 10) || 0;
        return;
      }
      if (lower.includes('lcd.clear')) {
        this.lcdLine0 = ' '.repeat(16);
        this.lcdLine1 = ' '.repeat(16);
        this.lcdCursorCol = 0;
        this.lcdCursorRow = 0;
        return;
      }
      if (lower.includes('lcd.backlight')) {
        this.lcdBacklight = true;
        return;
      }
      if (lower.includes('lcd.nobacklight')) {
        this.lcdBacklight = false;
        return;
      }
    }

    // 7. Motor Helper Functions
    if (this.activeLab === 'motor') {
      if (lower.includes('motorforward')) {
        const m = text.match(/motorForward\s*\(\s*(\d+)\s*\)/i);
        this.motorDirection = 'FORWARD';
        this.motorReverse = false;
        this.motorSpeed = m ? parseInt(m[1], 10) : 200;
        this.in1 = true;
        this.in2 = false;
        return;
      }
      if (lower.includes('motorreverse')) {
        const m = text.match(/motorReverse\s*\(\s*(\d+)\s*\)/i);
        this.motorDirection = 'REVERSE';
        this.motorReverse = true;
        this.motorSpeed = m ? parseInt(m[1], 10) : 200;
        this.in1 = false;
        this.in2 = true;
        return;
      }
      if (lower.includes('motorbrake')) {
        this.motorDirection = 'BRAKE';
        this.motorSpeed = 0;
        this.in1 = false;
        this.in2 = false;
        return;
      }
    }

    // 8. Pin Mode
    const pm = text.match(/pinMode\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/i);
    if (pm) {
      const pin = pm[1];
      const mode = pm[2].toUpperCase();
      if (this.activeLab === 'led' || pin === '13') {
        this.claimPin13(mode === 'OUTPUT');
      }
      return;
    }

    // 9. General Lab Specific Fallback
    this.applyHardwareStep(step);
  }

  applyHardwareStep(step) {
    const text = (step.text || '').toLowerCase();

    if (this.activeLab === 'led') {
      if (text.includes('high') || text.includes('turn pin 13 power on') || text.includes('5v')) {
        this.setPin13(true);
      } else if (text.includes('low') || text.includes('turn pin 13 power off') || text.includes('0v')) {
        this.setPin13(false);
      }
      // Structural lines (void setup, void loop, braces) do not mutate Pin 13
    } else if (this.activeLab === 'servo') {
      if (text.includes('writeangle1') || (text.includes('write') && text.includes(String(this.servoAngle1)))) {
        this.servoAngle = this.servoAngle1;
      } else if (text.includes('writeangle2') || (text.includes('write') && text.includes(String(this.servoAngle2)))) {
        this.servoAngle = this.servoAngle2;
      } else if (this.activeLessonId === 4) {
        this.servoAngle += this.sweepDirection * 10;
        if (this.servoAngle >= 180) { this.servoAngle = 180; this.sweepDirection = -1; }
        else if (this.servoAngle <= 0) { this.servoAngle = 0; this.sweepDirection = 1; }
      } else {
        this.servoAngle = (this.loopCount % 2 === 0) ? this.servoAngle1 : this.servoAngle2;
      }
      this.updateServoPulse();
    } else if (this.activeLab === 'pot') {
      this.servoAngle = Math.round((this.potVal / 1023.0) * 180);
      this.updateServoPulse();
    } else if (this.activeLab === 'button') {
      this.buttonPressed = (this.loopCount % 2 === 1);
      this.buttonLedState = this.buttonPressed;
    } else if (this.activeLab === 'buzzer') {
      this.buzzerToneFreq = (this.loopCount % 2 === 0) ? 440 : 880;
      this.buzzerActive = true;
    } else if (this.activeLab === 'ldr') {
      this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
    } else if (this.activeLab === 'rgb') {
      if (text.includes('red') && text.includes('high')) this.rgbR = 255;
      if (text.includes('green') && text.includes('high')) this.rgbG = 255;
      if (text.includes('blue') && text.includes('low')) this.rgbB = 0;
      this.rgbHue = (this.rgbHue + 15) % 360;
    } else if (this.activeLab === 'temp') {
      this.tempAlarmActive = this.tempC > this.tempThreshold;
      this.fanActive = this.tempC > 28.0;
      this.fanSpeed = this.fanActive ? 220 : 0;
    } else if (this.activeLab === 'sonar') {
      this.fireSonarPing();
    } else if (this.activeLab === 'ir') {
      this.emitIrBeam();
    } else if (this.activeLab === 'lcd') {
      this.lcdBacklight = true;
    } else if (this.activeLab === 'motor') {
      if (text.includes('forward')) {
        this.motorDirection = 'FORWARD';
        this.motorReverse = false;
        this.motorSpeed = 200;
      } else if (text.includes('reverse')) {
        this.motorDirection = 'REVERSE';
        this.motorReverse = true;
        this.motorSpeed = 200;
      } else if (text.includes('brake')) {
        this.motorDirection = 'BRAKE';
        this.motorSpeed = 0;
      }
      this.voltage = 5.0;
      this.currentMa = 850;
    } else if (this.activeLab === 'soil') {
      if (text.includes('pump on') || text.includes('energiz')) {
        this.soilRelayActive = true;
        this.soilPumpActive = true;
      } else if (text.includes('pump off') || text.includes('de-energiz')) {
        this.soilRelayActive = false;
        this.soilPumpActive = false;
      }
    } else if (this.activeLab === 'gas') {
      this.gasAlarmActive = this.gasPpm > 500;
    } else if (this.activeLab === 'dht') {
      this.dhtTemp = 24.5 + Math.sin(Date.now() / 3000) * 0.5;
      this.dhtHumidity = 55.0 + Math.cos(Date.now() / 4000) * 1.5;
    } else if (this.activeLab === 'oled') {
      this.oledPages = 8;
    } else if (this.activeLab === 'imu') {
      this.voltage = 3.3;
      this.imuPitch = 12.4 + Math.sin(Date.now() / 2000) * 2.0;
      this.imuRoll = -3.8 + Math.cos(Date.now() / 2000) * 1.5;
    } else if (this.activeLab === 'rfid') {
      this.voltage = 3.3;
    } else if (this.activeLab === 'iot') {
      this.voltage = 3.3;
    } else if (this.activeLab === 'slicer') {
      this.slicerLayer = ((this.stepCount || 1) % 120) + 1;
    } else if (this.activeLab === 'dmm') {
      this.dmmVoltage = 4.98 + Math.sin(Date.now() / 1500) * 0.03;
    } else if (this.activeLab === 'cad') {
      this.voltage = 5.0;
    }
  }

  executeStep() {
    if (!this.isRunning || this.isPaused) return;

    let step = null;
    if (this.stepPhase === 'setup') {
      if (this.stepPointer < this.setupSteps.length) {
        step = this.setupSteps[this.stepPointer];
        this.stepPointer++;
      } else {
        this.stepPhase = 'loop';
        this.stepPointer = 0;
        this.loopCount = 1;
        if (this.loopSteps.length === 0) return;
        step = this.loopSteps[this.stepPointer];
        this.stepPointer++;
      }
    } else {
      if (this.stepPointer >= this.loopSteps.length) {
        this.stepPointer = 0;
        this.loopCount++;
      }
      step = this.loopSteps[this.stepPointer];
      this.stepPointer++;
    }

    if (!step) return;

    this.currentStep = step;
    this.stepCount = (this.stepCount || 0) + 1;
    this.currentStepIndex = step.lineIndex;

    // Mutate live hardware state if action statement
    if (step.type === 'action') {
      this.executeHardwareInstruction(step);
    } else if (step.type === 'delay') {
      // Delay holds current state steady
    } else {
      this.applyHardwareStep(step);
    }
    this.notifyHardware();

    // Immediately highlight that exact line number in both Plain English and Arduino C++
    if (this.onStepChange) {
      this.onStepChange({
        loopCount: this.loopCount,
        text: step.text,
        cppLine: step.lineIndex,
        lineIndex: step.lineIndex,
        stepPhase: this.stepPhase,
        isDelay: step.type === 'delay'
      });
    }

    // Compute duration respecting speedMultiplier
    let baseDuration = 80; // 80ms micro-step for action statements
    if (step.type === 'delay') {
      baseDuration = this.resolveDelayDuration(step.rawParam, step.text);
    } else if (step.type === 'header') {
      baseDuration = 100;
    } else {
      baseDuration = 80;
    }

    const duration = Math.max(30, Math.round(baseDuration / this.speed));
    this.stepStartTime = Date.now();
    this.stepTargetDuration = duration;
    this.remainingDelay = duration;

    // Schedule next instruction
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.remainingDelay = 0;
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
  executeLcdLesson1() {
    this.stepCount++;
    this.logToSerial("[I2C Bus] Master Arduino -> Slave 0x27: Handshake ACK received! 16x2 HD44780 initialized.");
    this.notifyHardware();
  }
  executeLcdLesson2() {
    this.stepCount++;
    this.logToSerial("[I2C LCD] setCursor(" + this.lcdCursorCol + ", " + this.lcdCursorRow + ") -> Write: '" + (this.lcdCursorRow === 0 ? this.lcdLine0 : this.lcdLine1).trim() + "'");
    this.notifyHardware();
  }
  executeLcdLesson3() {
    this.stepCount++;
    this.logToSerial("[CGRAM 5x8] Custom glyph uploaded to slot 0: [B" + this.lcdCustomChar[1].toString(2).padStart(5, '0') + ", B" + this.lcdCustomChar[2].toString(2).padStart(5, '0') + "...]");
    this.notifyHardware();
  }
  executeLcdLesson4() {
    if (this.stepCount % 6 === 0) {
      this.setLcdScreenMode(this.lcdScreenMode + 1);
      this.logToSerial("[IoT Command Deck] Page switch -> " + (this.lcdScreenMode === 0 ? "CLIMATE" : this.lcdScreenMode === 1 ? "RADAR" : "SOLAR"));
    }
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

    if (this.activeLab === 'led') {
      const yLow = h * 0.75;
      const yHigh = h * 0.25;
      const numPoints = this.scopeHistory.length;
      const stepX = w / Math.max(1, this.maxScopePoints - 1);

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#22c55e'; // Lime Green logic wave
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 4;
      ctx.beginPath();

      for (let i = 0; i < numPoints; i++) {
        const val = this.scopeHistory[i];
        const px = i * stepX;
        const py = val > 2.5 ? yHigh : yLow;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          const prevVal = this.scopeHistory[i - 1];
          const prevPy = prevVal > 2.5 ? yHigh : yLow;
          if (prevPy !== py) {
            ctx.lineTo(px, prevPy);
          }
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Channel Readouts
      const isHigh = ((this.pin13Configured || this.isRunning) && this.pin13State);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`CH1 (Pin 13 Logic): ${isHigh ? '5.0V (HIGH)' : '0.0V (LOW)'}`, 10, yHigh - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(`Timebase: 50ms/div | Speed: ${this.speed}x`, w - 165, yLow + 16);

    } else if (this.activeLab === 'sonar') {
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

    } else if (this.activeLab === 'lcd') {
      this.lcdBacklight = true;
      const lessonId = this.activeLessonId || 1;
      this.voltage = 5.0;
      this.currentMa = 35.0;

      // Render 100kHz I2C Bus Waveform on Oscilloscope (SCL Pin A5 / SDA Pin A4)
      const ySCL = h * 0.38;
      const ySDA = h * 0.75;
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      for (let x = 0; x < w; x += 20) {
        ctx.lineTo(x, ySCL - 16);
        ctx.lineTo(x + 10, ySCL + 16);
      }
      ctx.stroke();

      ctx.strokeStyle = '#22c55e';
      ctx.beginPath();
      for (let x = 0; x < w; x += 30) {
        ctx.lineTo(x, ySDA - 16);
        ctx.lineTo(x + 15, ySDA + 16);
      }
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('SCL (Pin A5): 100 kHz Standard I2C Clock (0x27)', 10, ySCL - 20);

      ctx.fillStyle = '#22c55e';
      ctx.fillText(`SDA (Pin A4): "${(this.lcdLine0 || '').trim()}" (Packet Bus)`, 10, ySDA - 20);
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

    } else if (this.activeLab === 'servo') {
      // Servo 50Hz PWM pulse (20ms Frame)
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

    } else if (this.activeLab === 'motor') {
      // L298N Dual H-Bridge PWM Motor Speed & Direction Traces
      const ch1Y = h * 0.40;
      const ch2Y = h * 0.80;
      const speed = this.motorSpeed !== undefined ? this.motorSpeed : 200;
      const duty = speed / 255.0;
      const period = 40;
      const highW = period * duty;

      // CH1: PWM ENA (Pin 5)
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      for (let x = 0; x < w; x += period) {
        if (x === 0) ctx.moveTo(0, ch1Y);
        ctx.lineTo(x, ch1Y - (duty > 0 ? 30 : 0));
        ctx.lineTo(x + highW, ch1Y - (duty > 0 ? 30 : 0));
        ctx.lineTo(x + highW, ch1Y);
        ctx.lineTo(x + period, ch1Y);
      }
      ctx.stroke();

      // CH2: IN1 / IN2 Direction State
      const isFwd = this.motorDirection === 'FORWARD';
      const isRev = this.motorDirection === 'REVERSE';
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = isFwd ? '#22c55e' : (isRev ? '#f97316' : '#94a3b8');
      ctx.beginPath();
      ctx.moveTo(0, ch2Y - (isFwd || isRev ? 25 : 0));
      ctx.lineTo(w, ch2Y - (isFwd || isRev ? 25 : 0));
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`CH1 (ENA Pin 5): 490Hz PWM Duty ${Math.round(duty * 100)}% (${speed}/255)`, 10, ch1Y - 34);

      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(`CH2 (H-Bridge): ${this.motorDirection || 'FORWARD'} (IN1=${isFwd ? 1 : 0}, IN2=${isRev ? 1 : 0})`, 10, ch2Y - 30);

    } else if (this.activeLab === 'led') {
      // Pin 13 Digital Square Wave
      const yLow = h * 0.75;
      const yHigh = h * 0.25;
      const isHigh = this.pin13State;
      const yVal = isHigh ? yHigh : yLow;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isHigh ? '#22c55e' : '#64748b';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Pin 13: ${isHigh ? 'HIGH (+5.0V / 20mA)' : 'LOW (0.0V / 0mA)'}`, 10, yVal - 10);

    } else if (this.activeLab === 'button') {
      // Button Pin 2 Digital Input Trace
      const yLow = h * 0.75;
      const yHigh = h * 0.25;
      const pressed = this.buttonPressed;
      const yVal = pressed ? yHigh : yLow;

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = pressed ? '#38bdf8' : '#64748b';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Pin 2: ${pressed ? 'CLOSED / PRESSED (+5V HIGH)' : 'OPEN / RELEASED (0V LOW)'}`, 10, yVal - 10);

    } else if (this.activeLab === 'buzzer') {
      // Buzzer Tone Audio Waveform
      const yMid = h * 0.50;
      const freq = this.buzzerToneFreq || 440;
      const active = this.buzzerActive;

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = active ? '#ec4899' : '#64748b';
      ctx.beginPath();
      if (active) {
        const period = Math.max(8, Math.min(60, 4400 / freq));
        for (let x = 0; x < w; x += period) {
          ctx.lineTo(x, yMid - 25);
          ctx.lineTo(x + period / 2, yMid - 25);
          ctx.lineTo(x + period / 2, yMid + 25);
          ctx.lineTo(x + period, yMid + 25);
        }
      } else {
        ctx.moveTo(0, yMid);
        ctx.lineTo(w, yMid);
      }
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Pin 8 Buzzer: ${active ? freq + ' Hz Audio Wave (50% Duty)' : 'SILENT (0 Hz / noTone)'}`, 10, yMid - 30);

    } else if (this.activeLab === 'pot') {
      // 10k Potentiometer Analog Voltage (0V to 5V)
      const v = (this.potVal / 1023.0) * 5.0;
      const yLow = h * 0.78;
      const yHigh = h * 0.22;
      const yVal = yLow - ((v / 5.0) * (yLow - yHigh));

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Analog A0: ${v.toFixed(2)}V (ADC ${this.potVal} / 1023) -> Servo Angle ${this.servoAngle}°`, 10, yVal - 8);

    } else if (this.activeLab === 'ldr') {
      // LDR Analog Voltage & Threshold
      const v = (this.ldrRaw / 1023.0) * 5.0;
      const yLow = h * 0.78;
      const yHigh = h * 0.22;
      const yVal = yLow - ((v / 5.0) * (yLow - yHigh));
      const yThresh = yLow - ((this.ldrThreshold / 1023.0) * (yLow - yHigh));

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = this.ldrLightOn ? '#eab308' : '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, yThresh);
      ctx.lineTo(w, yThresh);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`LDR A1: ${v.toFixed(2)}V (${this.ldrLux} Lux) • Streetlight: ${this.ldrLightOn ? 'ON' : 'OFF'}`, 10, yVal - 8);

    } else if (this.activeLab === 'soil') {
      // Soil Moisture 1.5MHz Capacitive Oscillator & Relay Trace
      const y1 = h * 0.40;
      const y2 = h * 0.80;
      const pump = this.soilPumpActive;

      // CH1: Capacitive High Frequency Waveform
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      for (let x = 0; x < w; x += 12) {
        ctx.lineTo(x, y1 - 20);
        ctx.lineTo(x + 6, y1 + 20);
      }
      ctx.stroke();

      // CH2: Relay Logic State
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = pump ? '#06b6d4' : '#64748b';
      ctx.beginPath();
      ctx.moveTo(0, y2 - (pump ? 25 : 0));
      ctx.lineTo(w, y2 - (pump ? 25 : 0));
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('CH1 (Capacitive Soil): 1.5 MHz Resonance • 68% Moisture', 10, y1 - 26);

      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(`CH2 (Relay Pin 7): ${pump ? 'PUMP ACTIVE (Energized LOW)' : 'PUMP OFF (Standby HIGH)'}`, 10, y2 - 28);

    } else if (this.activeLab === 'gas') {
      // MQ Gas Analog Voltage
      const v = (this.gasPpm / 1000.0) * 5.0;
      const yLow = h * 0.78;
      const yHigh = h * 0.22;
      const yVal = yLow - (Math.min(1.0, v / 5.0) * (yLow - yHigh));

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = this.gasAlarmActive ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Gas Chamber A0: ${this.gasPpm} ppm (${v.toFixed(2)}V) • Alarm: ${this.gasAlarmActive ? 'HAZARD TRIGGERED' : 'SAFE'}`, 10, yVal - 8);

    } else if (this.activeLab === 'dht') {
      // DHT Single-Bus Protocol Pulse Sequence
      const y = h * 0.55;
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 10; x < w - 20; x += 30) {
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - 30);
        ctx.lineTo(x + 14, y - 30);
        ctx.lineTo(x + 14, y);
      }
      ctx.lineTo(w, y);
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`DHT11 Bus (Pin 4): Temp ${this.dhtTemp.toFixed(1)}°C • Humidity ${this.dhtHumidity.toFixed(1)}% RH (40-Bit Frame)`, 10, y - 36);

    } else if (this.activeLab === 'oled') {
      // I2C 400kHz Fast-Mode Stream
      const ySCL = h * 0.38;
      const ySDA = h * 0.75;
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      for (let x = 0; x < w; x += 16) {
        ctx.lineTo(x, ySCL - 18);
        ctx.lineTo(x + 8, ySCL + 18);
      }
      ctx.stroke();

      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      for (let x = 0; x < w; x += 24) {
        ctx.lineTo(x, ySDA - 18);
        ctx.lineTo(x + 12, ySDA + 18);
      }
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('SCL (Pin A5): 400 kHz Fast-Mode Clock', 10, ySCL - 22);
      ctx.fillStyle = '#a855f7';
      ctx.fillText('SDA (Pin A4): SSD1306 Framebuffer 128x64 Stream', 10, ySDA - 22);

    } else if (this.activeLab === 'imu') {
      // MPU6050 3-Axis Accelerometer Vector Trace
      const yMid = h * 0.50;
      const pitch = this.imuPitch || 12.4;
      const roll = this.imuRoll || -3.8;

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      for (let x = 0; x < w; x += 5) {
        const y = yMid + Math.sin((x + Date.now() / 20) * 0.05) * (pitch * 1.5);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`MPU6050 I2C: Pitch ${pitch.toFixed(1)}° • Roll ${roll.toFixed(1)}° (1G Earth Gravity Vector)`, 10, yMid - 35);

    } else if (this.activeLab === 'rfid') {
      // 13.56MHz Carrier Burst & SPI Trace
      const y = h * 0.50;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      for (let x = 0; x < w; x += 8) {
        ctx.lineTo(x, y - 22);
        ctx.lineTo(x + 4, y + 22);
      }
      ctx.stroke();

      ctx.fillStyle = '#a855f7';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('RC522 RFID: 13.56 MHz Carrier Resonance & SPI Framing (10 Mbps)', 10, y - 30);

    } else if (this.activeLab === 'iot') {
      // 2.4GHz Wi-Fi MQTT Burst
      const y = h * 0.50;
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(50, y);
      ctx.lineTo(70, y - 30);
      ctx.lineTo(130, y - 30);
      ctx.lineTo(150, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('ESP32 Wi-Fi 2.4GHz: MQTT Telemetry Burst (RSSI: -58 dBm, QoS 1)', 10, y - 36);

    } else {
      // Fallback: Generic DC Voltage Level Trace
      const yVal = h * 0.50;
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`Telemetry Scope: Active Bus (5.0V Steady DC)`, 10, yVal - 10);
    }
  }
}

// Global Singleton Instance
window.circuitSimulation = new CircuitSimulation();
