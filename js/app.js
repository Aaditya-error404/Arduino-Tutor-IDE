/**
 * Main Application Logic for SparkByte: Arduino & C++ Virtual Tutor
 * Coordinates UI, Dual Labs (Servo Motor Control & LED Blink), Lesson progression,
 * Split Code Translator, Virtual Hardware, and Pedagogical Teacher Mode overlays.
 */

window.__appStarted = true;

// Global Timer Registry for Leak-Free Switching
window.activeLabIntervals = new Set();
window.activeLabTimeouts = new Set();

window.registerLabInterval = function (fn, ms) {
  const id = setInterval(fn, ms);
  window.activeLabIntervals.add(id);
  return id;
};

window.clearLabInterval = function (id) {
  if (id) {
    clearInterval(id);
    window.activeLabIntervals.delete(id);
  }
};

window.registerLabTimeout = function (fn, ms) {
  const id = setTimeout(() => {
    window.activeLabTimeouts.delete(id);
    fn();
  }, ms);
  window.activeLabTimeouts.add(id);
  return id;
};

window.clearLabTimeout = function (id) {
  if (id) {
    clearTimeout(id);
    window.activeLabTimeouts.delete(id);
  }
};

window.clearAllLabTimers = function () {
  if (window.activeLabIntervals) {
    window.activeLabIntervals.forEach(id => clearInterval(id));
    window.activeLabIntervals.clear();
  }
  if (window.activeLabTimeouts) {
    window.activeLabTimeouts.forEach(id => clearTimeout(id));
    window.activeLabTimeouts.clear();
  }
  if (window.circuitSimulation && typeof window.circuitSimulation.clearTransientTimers === 'function') {
    window.circuitSimulation.clearTransientTimers();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.__domCallbackFired = true;
  try {
    // Application State
    const state = {
      activeLab: 'servo', // 'servo' (default) or 'led'
      activeLessonIndex: 0,
      teacherMode: false,
      audioEnabled: true,

      // LED Lab state
      claimedPin: null, // 13 when claimed
      pinRole: 'OUTPUT',
      delayOn: 1000,
      delayOff: 1000,
      ledLesson1Solved: false,
      ledSortingState: {},

      // Servo Lab state
      servoAttached: false,
      servoAngle: 90,
      servoAngle1: 90,
      servoAngle2: 180,
      servoDelay: 1000,
      servoLesson1Solved: false,
      servoSortingState: {},
      activeSweepPreset: 'sweep',

      // Potentiometer Lab state
      potVal: 512,
      potAngle: 90,
      potConnected: true,
      potLesson1Solved: false,
      potSortingState: {},

      // Pushbutton Lab state
      buttonPressed: false,
      buttonConfigured: true,
      buttonMode: 'momentary',
      buttonLedState: false,
      buttonLesson1Solved: false,
      buttonSortingState: {},

      // Buzzer Lab state
      buzzerSortingState: {},
      buzzerLesson1Solved: false,
      buzzerToneFreq: 440,
      sirenLowFreq: 650,
      sirenHighFreq: 950,
      sirenIntervalMs: 250,
      activeSirenPreset: 'police',
      activeMelodySong: 'scale',

      // LDR Light Sensor Lab state
      ldrRaw: 650,
      ldrLux: 450,
      ldrThreshold: 400,
      ldrLightOn: false,
      ldrSortingState: {},
      ldrLesson1Solved: false,

      // RGB Multi-Color LED Lab state
      rgbR: 255,
      rgbG: 255,
      rgbB: 0,
      rgbHue: 60,
      rgbMode: 'manual',
      rgbActivePreset: 'yellow',

      // Temperature Sensor TMP36 Lab state
      tempC: 25.0,
      tempThreshold: 30.0,
      fanSpeed: 0,
      fanActive: false,
      tempAlarmActive: false
    };

    // DOM Elements - Navigation & Utilities
    const labBtnServo = document.getElementById('lab-btn-servo');
    const labBtnLed = document.getElementById('lab-btn-led');
    const labBtnPot = document.getElementById('lab-btn-pot');
    const labBtnButton = document.getElementById('lab-btn-button');
    const labBtnBuzzer = document.getElementById('lab-btn-buzzer');
    const labBtnLdr = document.getElementById('lab-btn-ldr');
    const labBtnRgb = document.getElementById('lab-btn-rgb');
    const labBtnLcd = document.getElementById('lab-btn-lcd');
    const labBtnIr = document.getElementById('lab-btn-ir');
    const labBtnSonar = document.getElementById('lab-btn-sonar');
    const labBtnTemp = document.getElementById('lab-btn-temp');
    const currentLabLabel = document.getElementById('current-lab-label');
    const lessonNavTabs = document.getElementById('lesson-nav-tabs');
    const teacherToggle = document.getElementById('teacher-toggle');
    const audioToggle = document.getElementById('audio-toggle');
    const resetBtn = document.getElementById('reset-btn');
    const teacherModalBtn = document.getElementById('teacher-modal-btn');
    const teacherModal = document.getElementById('teacher-modal');
    const closeTeacherModal = document.getElementById('close-teacher-modal');

    // Desk Mode Tabs (Lab & Code vs Concept & Analogy)
    const viewTabLab = document.getElementById('view-tab-lab');
    const viewTabConcept = document.getElementById('view-tab-concept');
    const viewContentLab = document.getElementById('view-content-lab');
    const viewContentConcept = document.getElementById('view-content-concept');

    // Circuit Stage Groups
    const servoCircuitView = document.getElementById('servo-circuit-view');
    const ledCircuitView = document.getElementById('led-circuit-view');
    const potCircuitView = document.getElementById('pot-circuit-view');
    const buttonCircuitView = document.getElementById('button-circuit-view');
    const buzzerCircuitView = document.getElementById('buzzer-circuit-view');
    const ldrCircuitView = document.getElementById('ldr-circuit-view');
    const rgbCircuitView = document.getElementById('rgb-circuit-view');
    const lcdCircuitView = document.getElementById('lcd-circuit-view');
    const lcdBacklightGlass = document.getElementById('lcd-backlight-glass');
    const lcdSvgLine0 = document.getElementById('lcd-svg-line-0');
    const lcdSvgLine1 = document.getElementById('lcd-svg-line-1');
    const irCircuitView = document.getElementById('ir-circuit-view');
    const irSurfaceRect = document.getElementById('ir-surface-rect');
    const irSurfaceLabel = document.getElementById('ir-surface-label');
    const irRayTx = document.getElementById('ir-ray-tx');
    const irRayRx = document.getElementById('ir-ray-rx');
    const irD0Led = document.getElementById('ir-d0-led');
    const irRoverChassis = document.getElementById('ir-rover-chassis');
    const roverSensorLeft = document.getElementById('rover-sensor-left');
    const roverSensorRight = document.getElementById('rover-sensor-right');
    const roverTelemetryText = document.getElementById('rover-telemetry-text');
    const sonarCircuitView = document.getElementById('sonar-circuit-view');
    const sonarObstacleTarget = document.getElementById('sonar-obstacle-target');
    const sonarRulerLine = document.getElementById('sonar-ruler-line');
    const sonarRulerEnd = document.getElementById('sonar-ruler-end');
    const sonarDistPill = document.getElementById('sonar-dist-pill');
    const sonarDistText = document.getElementById('sonar-dist-text');
    const sonarLedGlow = document.getElementById('sonar-led-glow');
    const sonarLedBulb = document.getElementById('sonar-led-bulb');
    const sonarBuzzerRing1 = document.getElementById('sonar-buzzer-ring-1');
    const sonarBuzzerRing2 = document.getElementById('sonar-buzzer-ring-2');
    const tempCircuitView = document.getElementById('temp-circuit-view');

    // Temperature SVG Hardware Elements
    const tmp36SensorUnit = document.getElementById('tmp36-sensor-unit');
    const tempSensorAura = document.getElementById('temp-sensor-aura');
    const hvacFanPropeller = document.getElementById('hvac-fan-propeller');
    const fanAirflowRing = document.getElementById('fan-airflow-ring');
    const fanRpmBadge = document.getElementById('fan-rpm-badge');
    const wireTempVcc = document.getElementById('wire-temp-vcc');
    const wireTempSignal = document.getElementById('wire-temp-signal');
    const wireTempGnd = document.getElementById('wire-temp-gnd');
    const wireTempFan = document.getElementById('wire-temp-fan');

    // RGB SVG Hardware Elements
    const rgbLedBulb = document.getElementById('rgb-led-bulb');
    const rgbLedGlow = document.getElementById('rgb-led-glow');
    const rgbLedAura = document.getElementById('rgb-led-aura');
    const wireRgbRed = document.getElementById('wire-rgb-red');
    const wireRgbGreen = document.getElementById('wire-rgb-green');
    const wireRgbBlue = document.getElementById('wire-rgb-blue');
    const wireRgbGnd = document.getElementById('wire-rgb-gnd');

    // LDR SVG Hardware Elements
    const ldrSensorUnit = document.getElementById('ldr-sensor-unit');
    const ldrAmbientGlow = document.getElementById('ldr-ambient-glow');
    const smartStreetlampPost = document.getElementById('smart-streetlamp-post');
    const streetlampCone = document.getElementById('streetlamp-cone');
    const wireLdrVcc = document.getElementById('wire-ldr-vcc');
    const wireLdrSignal = document.getElementById('wire-ldr-signal');
    const wireLdrGnd = document.getElementById('wire-ldr-gnd');
    const wireStreetlampCtrl = document.getElementById('wire-streetlamp-ctrl');

    // Buzzer SVG Hardware Elements
    const piezoBuzzerUnit = document.getElementById('piezo-buzzer-unit');
    const buzzerSoundWaves = document.getElementById('buzzer-sound-waves');
    const wireBuzzerSignal = document.getElementById('wire-buzzer-signal');
    const wireBuzzerGnd = document.getElementById('wire-buzzer-gnd');

    // Potentiometer SVG Hardware Elements
    const potKnobGroup = document.getElementById('pot-knob-group');
    const potActiveArc = document.getElementById('pot-active-arc');
    const potHudVal = document.getElementById('pot-hud-val');
    const potServoHorn = document.getElementById('pot-servo-horn');
    const potServoArc = document.getElementById('pot-servo-arc');
    const potServoAngleHud = document.getElementById('pot-servo-angle-hud');
    const wirePotVcc = document.getElementById('wire-pot-vcc');
    const wirePotWiper = document.getElementById('wire-pot-wiper');
    const wirePotGnd = document.getElementById('wire-pot-gnd');

    // Pushbutton SVG Hardware Elements
    const tactilePushbuttonUnit = document.getElementById('tactile-pushbutton-unit');
    const pushbuttonCap = document.getElementById('pushbutton-cap');
    const pushbuttonGlow = document.getElementById('pushbutton-glow');
    const buttonTargetLed = document.getElementById('button-target-led');
    const buttonLedGlow = document.getElementById('button-led-glow');
    const wireBtnSignal = document.getElementById('wire-btn-signal');
    const wireBtnGnd = document.getElementById('wire-btn-gnd');
    const wireBtnLed = document.getElementById('wire-btn-led');

    // Servo SVG Hardware Elements
    const servoHornGroup = document.getElementById('servo-horn-group');
    const servoAngleBadgeText = document.getElementById('servo-angle-badge-text');
    const protractorActiveArc = document.getElementById('protractor-active-arc');
    const wireServoSignal = document.getElementById('wire-servo-signal');
    const wireServoVcc = document.getElementById('wire-servo-vcc');
    const wireServoGnd = document.getElementById('wire-servo-gnd');
    const unoPin9Header = document.getElementById('pin-9-header-socket');

    // LED SVG Hardware Elements
    const breadboardLed = document.getElementById('breadboard-led');
    const ledGlow = document.getElementById('led-glow');
    const unoBuiltinLed = document.getElementById('uno-builtin-led');
    const wirePin13 = document.getElementById('wire-pin13');
    const wireGnd = document.getElementById('wire-gnd');
    const unoPin13Header = document.getElementById('pin-13-header-socket');

    // HUD Readout Elements
    const hudLabel1 = document.getElementById('hud-label-1');
    const hudReadout1 = document.getElementById('hud-readout-1');
    const hudLabel2 = document.getElementById('hud-label-2');
    const hudReadout2 = document.getElementById('hud-readout-2');
    const hudLabel3 = document.getElementById('hud-label-3');
    const hudReadout3 = document.getElementById('hud-readout-3');
    const hudLabel4 = document.getElementById('hud-label-4');
    const hudReadout4 = document.getElementById('hud-readout-4');
    const scopeTitle = document.getElementById('scope-title');
    const scopeStatus = document.getElementById('scope-status');
    const hardwareCalloutsContainer = document.getElementById('hardware-callouts-container');
    const loopCycleBadge = document.getElementById('loop-cycle-badge');

    // Simulation Controls DOM
    const btnSimulate = document.getElementById('btn-simulate');
    const btnPause = document.getElementById('btn-pause');
    const btnResetSim = document.getElementById('btn-reset-sim');
    const speedSelect = document.getElementById('speed-select');
    const simStatusText = document.getElementById('sim-status-text');

    // Right Panel Lesson & Translator DOM
    const lessonTitleEl = document.getElementById('lesson-title');
    const lessonSubtitleEl = document.getElementById('lesson-subtitle');
    const mascotBubble = document.getElementById('mascot-bubble');
    const analogyCard = document.getElementById('analogy-card');
    const jargonPills = document.getElementById('jargon-pills');
    const lessonInteractiveArea = document.getElementById('lesson-interactive-area');
    const plainEnglishCodeEl = document.getElementById('plain-english-code');
    const cppCodeEl = document.getElementById('cpp-code');

    // Initialize Canvas Oscilloscope
    const scopeCanvas = document.getElementById('scope-canvas');
    if (window.circuitSimulation && scopeCanvas) {
      window.circuitSimulation.initScope(scopeCanvas);
    }

    // --- Helper to get current lessons list ---
    function getCurrentLessons() {
      if (state.activeLab === 'cad') return window.CAD_LESSONS_DATA;
      if (state.activeLab === 'dmm') return window.DMM_LESSONS_DATA;
      if (state.activeLab === 'slicer') return window.SLICER_LESSONS_DATA;
      if (state.activeLab === 'dht') return window.DHT_LESSONS_DATA;
      if (state.activeLab === 'gas') return window.GAS_LESSONS_DATA;
      if (state.activeLab === 'oled') return window.OLED_LESSONS_DATA;
      if (state.activeLab === 'soil') return window.SOIL_LESSONS_DATA;
      if (state.activeLab === 'motor') return window.MOTOR_LESSONS_DATA;
      if (state.activeLab === 'imu') return window.IMU_LESSONS_DATA;
      if (state.activeLab === 'rfid') return window.RFID_LESSONS_DATA;
      if (state.activeLab === 'iot') return window.IOT_LESSONS_DATA;
      if (state.activeLab === 'servo') return window.SERVO_LESSONS_DATA;
      if (state.activeLab === 'pot') return window.POT_LESSONS_DATA;
      if (state.activeLab === 'button') return window.BUTTON_LESSONS_DATA;
      if (state.activeLab === 'buzzer') return window.BUZZER_LESSONS_DATA;
      if (state.activeLab === 'ldr') return window.LDR_LESSONS_DATA;
      if (state.activeLab === 'rgb') return window.RGB_LESSONS_DATA;
      if (state.activeLab === 'lcd') return window.LCD_LESSONS_DATA;
      if (state.activeLab === 'ir') return window.IR_LESSONS_DATA;
      if (state.activeLab === 'sonar') return window.SONAR_LESSONS_DATA;
      if (state.activeLab === 'temp') return window.TEMP_LESSONS_DATA;
      return window.LED_LESSONS_DATA;
    }

    // --- Audio Toggle ---
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        state.audioEnabled = window.soundEngine.toggle();
        audioToggle.classList.toggle('muted', !state.audioEnabled);
        audioToggle.querySelector('.label').textContent = state.audioEnabled ? 'Sound ON' : 'Sound OFF';
        if (state.audioEnabled) window.soundEngine.playClick();
      });
    }

    // --- Teacher Mode Toggle ---
    if (teacherToggle) {
      teacherToggle.addEventListener('change', (e) => {
        state.teacherMode = e.target.checked;
        document.body.classList.toggle('teacher-mode-active', state.teacherMode);
        if (window.soundEngine) window.soundEngine.playToggle(state.teacherMode);
        renderTeacherInsights();
      });
    }

    // --- Teacher Modal Guide ---
    if (teacherModalBtn && teacherModal) {
      teacherModalBtn.addEventListener('click', () => {
        openTeacherGuide();
      });
    }
    if (closeTeacherModal && teacherModal) {
      closeTeacherModal.addEventListener('click', () => {
        teacherModal.classList.add('hidden');
      });
    }
    if (teacherModal) {
      teacherModal.addEventListener('click', (e) => {
        if (e.target === teacherModal) teacherModal.classList.add('hidden');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !teacherModal.classList.contains('hidden')) {
          teacherModal.classList.add('hidden');
        }
      });
    }

    // --- Reset Button ---
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        resetCurrentLesson();
      });
    }

    // --- Simulation Controls ---
    if (btnSimulate) {
      btnSimulate.addEventListener('click', () => {
        if (window.circuitSimulation.isRunning && !window.circuitSimulation.isPaused) {
          return;
        }
        window.circuitSimulation.start();
        updateSimControlsUI();
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        window.circuitSimulation.pause();
        updateSimControlsUI();
      });
    }

    if (btnResetSim) {
      btnResetSim.addEventListener('click', () => {
        window.circuitSimulation.stop();
        updateSimControlsUI();
      });
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        window.circuitSimulation.setSpeed(e.target.value);
      });
    }

    // =========================================================================
    // HARDWARE TELEMETRY & SIMULATION ENGINE CALLBACKS
    // =========================================================================

    window.circuitSimulation.onHardwareChange = (hw) => {
      if (hw.activeLab === 'servo') {
        // 1. Servo Horn Rotation Physics
        // 0° = full left, 90° = neutral center (pointing straight up), 180° = full right
        // Horn points straight up at rest, so rotate by (angle - 90) degrees
        const rotDeg = hw.servoAngle - 90;
        if (servoHornGroup) {
          servoHornGroup.style.transformOrigin = '0 0';
          servoHornGroup.style.transform = `rotate(${rotDeg}deg)`;
          servoHornGroup.setAttribute('transform', `rotate(${rotDeg})`);
        }

        if (servoAngleBadgeText) {
          servoAngleBadgeText.textContent = `${Math.round(hw.servoAngle)}°`;
        }

        // Update Dynamic Protractor Highlight Arc
        updateProtractorArc(hw.servoAngle);

        // Wire Current Glow
        if (wireServoSignal) wireServoSignal.classList.toggle('flowing', hw.servoAttached);
        if (wireServoVcc) wireServoVcc.classList.add('flowing');
        if (wireServoGnd) wireServoGnd.classList.add('flowing');

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>📐</span> Servo Position`;
        if (hudReadout1) {
          const desc = hw.servoAngle === 90 ? 'Center' : (hw.servoAngle < 90 ? 'Left' : 'Right');
          hudReadout1.textContent = `${Math.round(hw.servoAngle)}° (${desc})`;
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>⏱️</span> PWM Pulse Width`;
        if (hudReadout2) hudReadout2.textContent = `${hw.servoPulseWidthMs.toFixed(2)} ms`;

        if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Supply Voltage`;
        if (hudReadout3) {
          hudReadout3.textContent = `5.00 V`;
          hudReadout3.className = 'hud-value val high';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🌊</span> Motor Current`;
        if (hudReadout4) {
          hudReadout4.textContent = `${hw.currentMa.toFixed(1)} mA ${hw.servoMoving ? '(Moving)' : '(Idle)'}`;
        }

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin ~9 PWM Pulse Train (50 Hz / 20ms Frame)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = `Pulse: ${hw.servoPulseWidthMs.toFixed(2)} ms HIGH @ 50Hz`;
        }

      } else if (hw.activeLab === 'pot') {
        // 1. Potentiometer Knob Angle (-135° at 0, 0° at 512, +135° at 1023)
        const knobRot = Math.round(((hw.potVal / 1023.0) * 270) - 135);
        if (potKnobGroup) {
          potKnobGroup.style.transformOrigin = '0 0';
          potKnobGroup.style.transform = `rotate(${knobRot}deg)`;
          potKnobGroup.setAttribute('transform', `rotate(${knobRot})`);
        }

        updatePotArc(hw.potVal);

        if (potHudVal) {
          potHudVal.textContent = `val: ${hw.potVal} (${hw.voltage.toFixed(2)}V)`;
        }

        // 2. Linked Servo Output Horn
        const potServoRot = hw.potAngle - 90;
        if (potServoHorn) {
          potServoHorn.style.transformOrigin = '0 0';
          potServoHorn.style.transform = `rotate(${potServoRot}deg)`;
          potServoHorn.setAttribute('transform', `rotate(${potServoRot})`);
        }
        if (potServoAngleHud) {
          potServoAngleHud.textContent = `${hw.potAngle}°`;
        }
        updatePotServoArc(hw.potAngle);

        // Wires flowing
        if (wirePotVcc) wirePotVcc.classList.add('flowing');
        if (wirePotWiper) wirePotWiper.classList.toggle('flowing', hw.potConnected);
        if (wirePotGnd) wirePotGnd.classList.add('flowing');

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> Wiper Voltage`;
        if (hudReadout1) {
          hudReadout1.textContent = `${hw.voltage.toFixed(2)} V`;
          hudReadout1.className = 'hud-value val high';
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>🔢</span> ADC 10-Bit Value`;
        if (hudReadout2) hudReadout2.textContent = `${hw.potVal} / 1023`;

        if (hudLabel3) hudLabel3.innerHTML = `<span>📐</span> Mapped Servo Angle`;
        if (hudReadout3) {
          const desc = hw.potAngle === 90 ? 'Center' : (hw.potAngle < 90 ? 'Left' : 'Right');
          hudReadout3.textContent = `${hw.potAngle}° (${desc})`;
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🌊</span> System Current`;
        if (hudReadout4) hudReadout4.textContent = `${hw.currentMa.toFixed(1)} mA (Total)`;

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin A0 Wiper Voltage (${hw.voltage.toFixed(2)}V DC)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = `ADC Input: ${hw.potVal} ➔ Servo: ${hw.potAngle}°`;
        }

      } else if (hw.activeLab === 'button') {
        // Pushbutton visual feedback
        if (pushbuttonCap) {
          pushbuttonCap.style.transform = hw.buttonPressed ? 'scale(0.85)' : 'scale(1)';
          pushbuttonCap.setAttribute('fill', hw.buttonPressed ? '#0369a1' : '#0284c7');
        }
        if (pushbuttonGlow) {
          pushbuttonGlow.style.opacity = hw.buttonPressed ? '1' : '0';
        }

        // Target LED feedback
        if (buttonTargetLed) {
          buttonTargetLed.classList.toggle('illuminated', hw.buttonLedState);
        }
        if (buttonLedGlow) {
          buttonLedGlow.style.opacity = hw.buttonLedState ? '1' : '0';
          buttonLedGlow.style.transform = hw.buttonLedState ? 'scale(1.2)' : 'scale(0.8)';
        }

        // Wires flowing
        if (wireBtnSignal) wireBtnSignal.classList.toggle('flowing', hw.buttonPressed);
        if (wireBtnGnd) wireBtnGnd.classList.add('flowing');
        if (wireBtnLed) wireBtnLed.classList.toggle('flowing', hw.buttonLedState);

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> Pin 2 Input Voltage`;
        if (hudReadout1) {
          hudReadout1.textContent = hw.buttonPressed ? '0.00 V (LOW)' : '5.00 V (HIGH)';
          hudReadout1.className = hw.buttonPressed ? 'hud-value val low' : 'hud-value val high';
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>🔘</span> Button Physical State`;
        if (hudReadout2) {
          hudReadout2.textContent = hw.buttonPressed ? 'PRESSED (Active)' : 'RELEASED (Open)';
        }

        if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Pin 13 LED Output`;
        if (hudReadout3) {
          hudReadout3.textContent = hw.buttonLedState ? 'HIGH (ON)' : 'LOW (OFF)';
          hudReadout3.className = hw.buttonLedState ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Pullup Resistor`;
        if (hudReadout4) hudReadout4.textContent = `20kΩ Internal Spring`;

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin 2 Digital Logic Input (Active LOW)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = hw.buttonPressed ? '0V LOW (GND Pull)' : '5V HIGH (Pullup)';
        }

      } else if (hw.activeLab === 'buzzer') {
        // Buzzer Lab Telemetry
        const isBeeping = hw.buzzerActive && hw.buzzerToneFreq > 0;
        if (buzzerSoundWaves) {
          buzzerSoundWaves.classList.toggle('active', isBeeping);
        }
        if (piezoBuzzerUnit) {
          piezoBuzzerUnit.classList.toggle('active-beep', isBeeping);
        }
        if (wireBuzzerSignal) wireBuzzerSignal.classList.toggle('flowing', isBeeping);
        if (wireBuzzerGnd) wireBuzzerGnd.classList.add('flowing');

        function getNoteName(f) {
          if (!f || f <= 0) return 'Silent';
          if (f >= 250 && f <= 270) return 'C4 (Middle C)';
          if (f >= 280 && f <= 305) return 'D4';
          if (f >= 320 && f <= 340) return 'E4';
          if (f >= 340 && f <= 360) return 'F4';
          if (f >= 380 && f <= 405) return 'G4';
          if (f >= 430 && f <= 455) return 'A4 (Concert A)';
          if (f >= 480 && f <= 505) return 'B4';
          if (f >= 510 && f <= 535) return 'C5 (High C)';
          if (f >= 600 && f <= 700) return 'Low Siren Pitch';
          if (f >= 900 && f <= 1000) return 'High Siren Pitch';
          return `${f} Hz`;
        }

        if (hudLabel1) hudLabel1.innerHTML = `<span>📢</span> Audio Frequency`;
        if (hudReadout1) {
          hudReadout1.textContent = isBeeping ? `${hw.buzzerToneFreq} Hz (Active)` : '0 Hz (Muted)';
          hudReadout1.className = isBeeping ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>🎵</span> Note Pitch`;
        if (hudReadout2) {
          hudReadout2.textContent = isBeeping ? getNoteName(hw.buzzerToneFreq) : 'Silent Rest';
        }

        if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Pin 8 Signal`;
        if (hudReadout3) {
          hudReadout3.textContent = isBeeping ? '5V Square Wave' : '0V (Ground)';
          hudReadout3.className = isBeeping ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🌊</span> Transducer Current`;
        if (hudReadout4) {
          hudReadout4.textContent = `${hw.currentMa.toFixed(1)} mA`;
        }

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin 8 Square Wave Tone Frequency (Hertz)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = isBeeping ? `${hw.buzzerToneFreq} Hz @ 50% Duty Cycle` : 'Silent (noTone)';
        }

      } else if (hw.activeLab === 'ldr') {
        // LDR Light Sensor & Streetlight Telemetry
        if (smartStreetlampPost) {
          smartStreetlampPost.classList.toggle('streetlamp-on', hw.ldrLightOn);
        }
        if (ldrAmbientGlow) {
          const glowOpacity = Math.max(0.05, Math.min(0.9, hw.ldrRaw / 1023.0));
          ldrAmbientGlow.style.opacity = glowOpacity.toString();
          ldrAmbientGlow.style.transform = `scale(${(0.6 + glowOpacity * 0.7).toFixed(2)})`;
        }
        if (wireLdrVcc) wireLdrVcc.classList.add('flowing');
        if (wireLdrSignal) wireLdrSignal.classList.add('flowing');
        if (wireLdrGnd) wireLdrGnd.classList.add('flowing');
        if (wireStreetlampCtrl) wireStreetlampCtrl.classList.toggle('flowing', hw.ldrLightOn);

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>☀️</span> Light Level (Pin A1)`;
        if (hudReadout1) {
          hudReadout1.textContent = `${hw.ldrRaw} / 1023 (${hw.ldrLux} Lux)`;
          hudReadout1.className = hw.ldrLightOn ? 'hud-value val low' : 'hud-value val high';
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Divider Voltage`;
        if (hudReadout2) {
          hudReadout2.textContent = `${hw.voltage.toFixed(2)} V`;
        }

        if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Streetlight (Pin 13)`;
        if (hudReadout3) {
          hudReadout3.textContent = hw.ldrLightOn ? 'HIGH (Streetlamp ON)' : 'LOW (Daylight OFF)';
          hudReadout3.className = hw.ldrLightOn ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>⚖️</span> Nightfall Threshold`;
        if (hudReadout4) {
          hudReadout4.textContent = `${hw.ldrThreshold} (Cutoff)`;
        }

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin A1 Light Divider Voltage vs. Dusk Threshold`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = hw.ldrLightOn
            ? `Darkness Detected (${hw.ldrRaw} < ${hw.ldrThreshold}) ➔ Streetlamp ON 💡`
            : `Daylight Detected (${hw.ldrRaw} >= ${hw.ldrThreshold}) ➔ Streetlamp OFF ☀️`;
        }

      } else if (hw.activeLab === 'rgb') {
        // RGB Multi-Color LED Lab Telemetry
        const hex = `#${hw.rgbR.toString(16).padStart(2, '0')}${hw.rgbG.toString(16).padStart(2, '0')}${hw.rgbB.toString(16).padStart(2, '0')}`.toUpperCase();
        const rgbColorStr = `rgb(${hw.rgbR}, ${hw.rgbG}, ${hw.rgbB})`;
        const totalIntensity = (hw.rgbR + hw.rgbG + hw.rgbB) / 765.0;

        // Update SVG Bulb & Glow
        if (rgbLedBulb) {
          rgbLedBulb.setAttribute('fill', rgbColorStr);
        }
        if (rgbLedGlow) {
          rgbLedGlow.setAttribute('fill', rgbColorStr);
          rgbLedGlow.setAttribute('opacity', (0.15 + totalIntensity * 0.75).toFixed(2));
        }
        if (rgbLedAura) {
          rgbLedAura.setAttribute('fill', rgbColorStr);
          rgbLedAura.setAttribute('opacity', (0.2 + totalIntensity * 0.7).toFixed(2));
        }

        // Wires Flowing State
        if (wireRgbRed) wireRgbRed.classList.toggle('flowing', hw.rgbR > 0);
        if (wireRgbGreen) wireRgbGreen.classList.toggle('flowing', hw.rgbG > 0);
        if (wireRgbBlue) wireRgbBlue.classList.toggle('flowing', hw.rgbB > 0);
        if (wireRgbGnd) wireRgbGnd.classList.toggle('flowing', totalIntensity > 0);

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>🎨</span> Hex Color Code`;
        if (hudReadout1) {
          hudReadout1.textContent = hex;
          hudReadout1.style.color = totalIntensity > 0.1 ? rgbColorStr : '#ffffff';
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>🔴</span> Red PWM (~Pin 9)`;
        if (hudReadout2) {
          hudReadout2.textContent = `${hw.rgbR} (${Math.round((hw.rgbR / 255) * 100)}%)`;
          hudReadout2.style.color = '#ef4444';
        }

        if (hudLabel3) hudLabel3.innerHTML = `<span>🟢</span> Green PWM (~Pin 10)`;
        if (hudReadout3) {
          hudReadout3.textContent = `${hw.rgbG} (${Math.round((hw.rgbG / 255) * 100)}%)`;
          hudReadout3.style.color = '#10b981';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🔵</span> Blue PWM (~Pin 11)`;
        if (hudReadout4) {
          hudReadout4.textContent = `${hw.rgbB} (${Math.round((hw.rgbB / 255) * 100)}%)`;
          hudReadout4.style.color = '#3b82f6';
        }

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> 3-Channel 8-Bit PWM (~490Hz Duty Cycles)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = `Red: ${Math.round((hw.rgbR / 255) * 100)}% | Green: ${Math.round((hw.rgbG / 255) * 100)}% | Blue: ${Math.round((hw.rgbB / 255) * 100)}%`;
        }

        // Live updates for in-lesson widgets
        const liveSwatch = document.getElementById('rgb-live-swatch');
        if (liveSwatch) {
          liveSwatch.style.backgroundColor = rgbColorStr;
          liveSwatch.style.boxShadow = `0 0 25px ${rgbColorStr}`;
        }
        const liveHex = document.getElementById('rgb-live-hex');
        if (liveHex) liveHex.textContent = hex;

        const liveRedVal = document.getElementById('rgb-val-r');
        if (liveRedVal) liveRedVal.textContent = `${hw.rgbR} (${Math.round((hw.rgbR / 255) * 100)}%)`;
        const liveGreenVal = document.getElementById('rgb-val-g');
        if (liveGreenVal) liveGreenVal.textContent = `${hw.rgbG} (${Math.round((hw.rgbG / 255) * 100)}%)`;
        const liveBlueVal = document.getElementById('rgb-val-b');
        if (liveBlueVal) liveBlueVal.textContent = `${hw.rgbB} (${Math.round((hw.rgbB / 255) * 100)}%)`;

      } else if (hw.activeLab === 'lcd' || state.activeLab === 'lcd') {
        const line0 = hw.lcdLine0 || 'I2C Bus Ready!  ';
        const line1 = hw.lcdLine1 || 'Address: 0x27   ';

        if (lcdSvgLine0) lcdSvgLine0.textContent = line0;
        if (lcdSvgLine1) lcdSvgLine1.textContent = line1;
        if (lcdBacklightGlass) {
          lcdBacklightGlass.setAttribute('fill', hw.lcdBacklight ? '#0284c7' : '#0f172a');
        }

        const live0 = document.getElementById('lcd-live-line-0');
        const live1 = document.getElementById('lcd-live-line-1');
        if (live0) live0.textContent = line0;
        if (live1) live1.textContent = line1;

        if (hudLabel1 && hudReadout1) {
          hudLabel1.innerHTML = '<span>🌐</span> I2C Address';
          hudReadout1.textContent = '0x27 (PCF8574)';
          hudReadout1.className = 'hud-value val';
        }
        if (hudLabel2 && hudReadout2) {
          hudLabel2.innerHTML = '<span>💡</span> Backlight';
          hudReadout2.textContent = hw.lcdBacklight ? 'ON (Blue LED)' : 'OFF (Sleep)';
          hudReadout2.className = hw.lcdBacklight ? 'hud-value val ok' : 'hud-value val';
        }
        if (hudLabel3 && hudReadout3) {
          hudLabel3.innerHTML = '<span>🔠</span> Display Buffer';
          hudReadout3.textContent = '16x2 HD44780';
        }
        if (hudLabel4 && hudReadout4) {
          hudLabel4.innerHTML = '<span>📊</span> IoT Deck Channel';
          const ch = hw.lcdScreenMode || 0;
          hudReadout4.textContent = ch === 0 ? 'CH 1: CLIMATE' : ch === 1 ? 'CH 2: RADAR' : 'CH 3: SOLAR';
          hudReadout4.className = 'hud-value val ok';
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'I2C Bus 100kHz: SDA Pin A4 + SCL Pin A5 transmitting text packets to 0x27';
        }
      } else if (hw.activeLab === 'ir' || state.activeLab === 'ir') {
        const isLine = hw.irLineDetected;
        const surf = hw.irSurface || 'white';

        if (irSurfaceRect && irSurfaceLabel) {
          if (surf === 'white') {
            irSurfaceRect.setAttribute('fill', '#f8fafc');
            irSurfaceLabel.textContent = 'WHITE REFLECTIVE SURFACE (High Bounce)';
            irSurfaceLabel.setAttribute('fill', '#0f172a');
          } else if (surf === 'cardboard') {
            irSurfaceRect.setAttribute('fill', '#b45309');
            irSurfaceLabel.textContent = 'CARDBOARD (Medium Reflectance)';
            irSurfaceLabel.setAttribute('fill', '#ffffff');
          } else if (surf === 'dark_tape') {
            irSurfaceRect.setAttribute('fill', '#334155');
            irSurfaceLabel.textContent = 'DARK TAPE (High Absorption)';
            irSurfaceLabel.setAttribute('fill', '#ffffff');
          } else {
            irSurfaceRect.setAttribute('fill', '#000000');
            irSurfaceLabel.textContent = 'PITCH BLACK VOID (Total Absorption)';
            irSurfaceLabel.setAttribute('fill', '#f87171');
          }
        }

        if (irRayTx) {
          irRayTx.setAttribute('opacity', hw.irBeamActive ? '1' : '0.45');
        }
        if (irRayRx) {
          const bounceOpacity = Math.max(0.1, 1.0 - ((hw.irReflectRaw || 145) / 1023.0));
          irRayRx.setAttribute('opacity', bounceOpacity.toFixed(2));
        }

        if (irD0Led) {
          irD0Led.setAttribute('fill', isLine ? '#ef4444' : '#7f1d1d');
        }

        if (roverTelemetryText) {
          const steer = hw.roverSteerState || 'straight';
          if (steer === 'left') roverTelemetryText.textContent = 'ROVER: STEER LEFT ⬅️';
          else if (steer === 'right') roverTelemetryText.textContent = 'ROVER: STEER RIGHT ➡️';
          else if (steer === 'stop') roverTelemetryText.textContent = 'ROVER: STOPPED 🛑';
          else roverTelemetryText.textContent = 'ROVER: CRUISE ⬆️';
        }

        if (roverSensorLeft && roverSensorRight) {
          const steer = hw.roverSteerState || 'straight';
          roverSensorLeft.setAttribute('fill', steer === 'left' ? '#ef4444' : '#22c55e');
          roverSensorRight.setAttribute('fill', steer === 'right' ? '#ef4444' : '#22c55e');
        }

        if (hudLabel1 && hudReadout1) {
          hudLabel1.innerHTML = '<span>⚡</span> Digital DO (Pin 2)';
          hudReadout1.textContent = isLine ? 'HIGH (1 - Line)' : 'LOW (0 - White)';
          hudReadout1.className = isLine ? 'hud-value val warn' : 'hud-value val ok';
        }
        if (hudLabel2 && hudReadout2) {
          hudLabel2.innerHTML = '<span>📊</span> Analog AO (Pin A0)';
          hudReadout2.textContent = `${(hw.irVoltage || 0.71).toFixed(2)}V (ADC ${hw.irReflectRaw || 145})`;
        }
        if (hudLabel3 && hudReadout3) {
          hudLabel3.innerHTML = '<span>🛡️</span> Comparator Vref';
          hudReadout3.textContent = `Thresh: ${hw.irThreshold || 512} (${((hw.irThreshold || 512) / 1023 * 5).toFixed(2)}V)`;
        }
        if (hudLabel4 && hudReadout4) {
          hudLabel4.innerHTML = '<span>🏎️</span> Rover Guidance';
          hudReadout4.textContent = (hw.roverSteerState || 'straight').toUpperCase();
          hudReadout4.className = 'hud-value val';
        }
        if (scopeStatus) {
          scopeStatus.textContent = isLine
            ? 'LINE DETECTED: IR Absorption High -> DO Pin 2 HIGH (5V)'
            : 'CLEAR SURFACE: Reflectance High -> DO Pin 2 LOW (0V)';
        }
      } else if (hw.activeLab === 'sonar') {
        const dist = hw.sonarDistanceCm !== undefined ? hw.sonarDistanceCm : 45.0;
        const targetX = Math.round(380 + (Math.max(2, Math.min(100, dist)) - 2) / 98 * 300);

        if (sonarObstacleTarget) {
          sonarObstacleTarget.setAttribute('transform', `translate(${targetX}, 130)`);
        }
        if (sonarRulerLine) {
          sonarRulerLine.setAttribute('x2', targetX);
        }
        if (sonarRulerEnd) {
          sonarRulerEnd.setAttribute('cx', targetX);
        }
        if (sonarDistPill && sonarDistText) {
          const midX = Math.round(410 + (targetX - 410) / 2);
          sonarDistPill.setAttribute('x', midX - 35);
          sonarDistText.setAttribute('x', midX);
          sonarDistText.textContent = `${dist.toFixed(1)} cm`;
        }
        if (sonarLedGlow && sonarLedBulb) {
          sonarLedGlow.setAttribute('opacity', hw.sonarLedStrobe ? '0.85' : '0');
          sonarLedBulb.setAttribute('fill', hw.sonarLedStrobe ? '#ef4444' : '#7f1d1d');
        }
        if (sonarBuzzerRing1 && sonarBuzzerRing2) {
          sonarBuzzerRing1.setAttribute('opacity', hw.sonarBuzzerBeeping ? '0.8' : '0');
          sonarBuzzerRing2.setAttribute('opacity', hw.sonarAlertZone === 'stop' ? '0.9' : '0');
        }

        if (hudLabel1 && hudReadout1) {
          hudLabel1.innerHTML = '<span>📏</span> Target Distance';
          hudReadout1.textContent = `${dist.toFixed(1)} cm (${(dist / 2.54).toFixed(1)} in)`;
          hudReadout1.className = 'hud-value val';
        }
        if (hudLabel2 && hudReadout2) {
          hudLabel2.innerHTML = '<span>⏱️</span> Echo Duration';
          hudReadout2.textContent = `${hw.sonarDurationUs || 0} µs`;
        }
        if (hudLabel3 && hudReadout3) {
          hudLabel3.innerHTML = '<span>🛡️</span> Radar Zone';
          hudReadout3.textContent = (hw.sonarAlertZone || 'safe').toUpperCase();
          hudReadout3.className = hw.sonarAlertZone === 'stop' ? 'hud-value val high' : hw.sonarAlertZone === 'hazard' ? 'hud-value val warn' : 'hud-value val ok';
        }
        if (hudLabel4 && hudReadout4) {
          hudLabel4.innerHTML = '<span>🔊</span> Parking Alert';
          hudReadout4.textContent = hw.sonarAlertZone === 'stop' ? 'CONTINUOUS SIREN' : hw.sonarBuzzerBeeping ? 'PULSING BEEP' : 'SILENT';
          hudReadout4.className = hw.sonarAlertZone === 'stop' ? 'hud-value val high' : hw.sonarBuzzerBeeping ? 'hud-value val warn' : 'hud-value val';
        }
        if (scopeStatus) {
          scopeStatus.textContent = hw.sonarAlertZone === 'stop'
            ? `EMERGENCY STOP (<8cm): Continuous 3000Hz Siren Active!`
            : hw.sonarBuzzerBeeping
              ? `RADAR ACTIVE: Target at ${dist.toFixed(1)}cm (${hw.sonarAlertZone.toUpperCase()})`
              : `HC-SR04 Radar Ready (Clear Field >50cm)`;
        }
      } else if (hw.activeLab === 'temp') {
        // Temperature Sensor TMP36 & HVAC Telemetry
        const tempC = hw.tempC !== undefined ? hw.tempC : 25.0;
        const tempF = (tempC * 9.0 / 5.0) + 32.0;
        const v = hw.tempVolts !== undefined ? hw.tempVolts : 0.75;

        // Dynamic Thermal Aura Glow color
        let auraColor = '#10b981';
        if (tempC < 15.0) auraColor = '#38bdf8'; // cold blue
        else if (tempC > 32.0) auraColor = '#f43f5e'; // hot red
        else if (tempC > 27.0) auraColor = '#f59e0b'; // warm amber

        if (tempSensorAura) {
          tempSensorAura.setAttribute('fill', auraColor);
          tempSensorAura.setAttribute('opacity', hw.tempAlarmActive ? '0.85' : '0.35');
        }

        // Fan Rotation and Visuals
        if (hvacFanPropeller && hw.fanActive) {
          const rot = hw.fanAngle || ((Date.now() / 3) % 360);
          hvacFanPropeller.setAttribute('transform', `rotate(${rot})`);
        }
        if (fanAirflowRing) {
          fanAirflowRing.style.opacity = hw.fanActive ? '0.8' : '0.1';
        }
        if (fanRpmBadge) {
          fanRpmBadge.textContent = hw.fanActive ? `FAN: ${Math.round(hw.fanSpeed / 255 * 100)}% PWM` : 'FAN: RESTING';
          fanRpmBadge.style.fill = hw.fanActive ? '#38bdf8' : '#64748b';
        }

        // Wires Flowing State
        if (wireTempVcc) wireTempVcc.classList.add('flowing');
        if (wireTempGnd) wireTempGnd.classList.add('flowing');
        if (wireTempSignal) wireTempSignal.classList.add('flowing');
        if (wireTempFan) wireTempFan.classList.toggle('flowing', hw.fanActive);

        // HUD Readouts
        if (hudLabel1) hudLabel1.innerHTML = `<span>🌡️</span> Temperature`;
        if (hudReadout1) {
          hudReadout1.textContent = `${tempC.toFixed(1)}°C (${tempF.toFixed(1)}°F)`;
          hudReadout1.style.color = auraColor;
        }

        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Sensor Voltage (A2)`;
        if (hudReadout2) {
          hudReadout2.textContent = `${v.toFixed(3)} V (${Math.round(v * 1000)} mV)`;
        }

        if (hudLabel3) hudLabel3.innerHTML = `<span>🌬️</span> HVAC Fan (Pin ~6)`;
        if (hudReadout3) {
          hudReadout3.textContent = hw.fanActive ? `SPINNING (${Math.round(hw.fanSpeed / 255 * 100)}%)` : 'RESTING (OFF)';
          hudReadout3.className = hw.fanActive ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🚨</span> Overheat Safety`;
        if (hudReadout4) {
          hudReadout4.textContent = hw.tempAlarmActive ? 'ALARM ACTIVE (30°C+)' : 'NORMAL (<30°C)';
          hudReadout4.className = hw.tempAlarmActive ? 'hud-value val high' : 'hud-value val low';
        }

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> TMP36 Analog Voltage (${v.toFixed(3)}V) vs Overheat Limit`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = hw.tempAlarmActive
            ? `OVERHEAT DETECTED: ${tempC.toFixed(1)}°C > ${hw.tempThreshold.toFixed(1)}°C (Alarm Siren ON 🚨)`
            : (hw.fanActive ? `WARM CLIMATE: ${tempC.toFixed(1)}°C (Cooling Fan Active 🌬️)` : `OPTIMAL CLIMATE: ${tempC.toFixed(1)}°C (Normal 🛡️)`);
        }

        // Live In-Lesson Widget Updates
        const liveTempC = document.getElementById('temp-live-c');
        if (liveTempC) liveTempC.textContent = `${tempC.toFixed(1)}°C`;
        const liveTempF = document.getElementById('temp-live-f');
        if (liveTempF) liveTempF.textContent = `(${tempF.toFixed(1)}°F)`;
        const liveBadge = document.getElementById('temp-live-badge');
        if (liveBadge) {
          let bClass = 'comfort', bText = 'Ideal Climate';
          if (tempC < 15.0) { bClass = 'cold'; bText = 'Cold Frost'; }
          else if (tempC > 32.0) { bClass = 'overheat'; bText = 'Overheat Alert!'; }
          else if (tempC > 27.0) { bClass = 'warm'; bText = 'Warm Greenhouse'; }
          liveBadge.className = `temp-status-badge ${bClass}`;
          liveBadge.textContent = bText;
        }

      } else if (hw.activeLab === 'motor') {
        // 1. Motor Lab Telemetry
        if (hudLabel1) hudLabel1.innerHTML = `<span>🏎️</span> Motor Direction`;
        if (hudReadout1) {
          hudReadout1.textContent = 'FORWARD (IN1=H, IN2=L)';
          hudReadout1.className = 'hud-value val high';
        }
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> PWM Speed (ENA)`;
        if (hudReadout2) hudReadout2.textContent = '255 (100% Duty)';
        if (hudLabel3) hudLabel3.innerHTML = `<span>🌊</span> Peak Current`;
        if (hudReadout3) hudReadout3.textContent = '850 mA (Under Load)';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> H-Bridge State`;
        if (hudReadout4) hudReadout4.textContent = 'Diagonal Q1+Q4 Conduction';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> L298N Dual H-Bridge PWM Motor Speed (Pin 5: 490Hz)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'ENA: 255 (100% PWM) • IN1=HIGH, IN2=LOW';
        }

        // Wheel animations
        const isRev = hw.motorDirection === 'REVERSE' || hw.motorReverse;
        const speed = hw.motorSpeed !== undefined ? hw.motorSpeed : 200;
        const rotStep = speed > 0 ? (Date.now() / (2000 / Math.max(20, speed))) % 360 : 0;
        const rot = isRev ? -rotStep : rotStep;
        ['wheel-fl', 'wheel-rl', 'wheel-fr', 'wheel-rr'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.transformOrigin = 'center';
            el.style.transform = `rotate(${rot}deg)`;
          }
        });

      } else if (hw.activeLab === 'imu') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🧭</span> Pitch Angle`;
        if (hudReadout1) hudReadout1.textContent = '+12.4°';
        if (hudLabel2) hudLabel2.innerHTML = `<span>📐</span> Roll Angle`;
        if (hudReadout2) hudReadout2.textContent = '-3.8°';
        if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Gyro Rate`;
        if (hudReadout3) hudReadout3.textContent = '42.5 °/s';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> I2C DMP Status`;
        if (hudReadout4) hudReadout4.textContent = 'DMP Ready (0x68)';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> MPU6050 6-Axis MEMS I2C DMP Gyro Vectors`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Pitch: +12.4° • Roll: -3.8° • 400kHz I2C';
        }

      } else if (hw.activeLab === 'rfid') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🏷️</span> Card UID`;
        if (hudReadout1) hudReadout1.textContent = '0x4A 0x88 0x3F 0x1B';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> RF Frequency`;
        if (hudReadout2) hudReadout2.textContent = '13.56 MHz (ISO 14443A)';
        if (hudLabel3) hudLabel3.innerHTML = `<span>🔓</span> Access State`;
        if (hudReadout3) hudReadout3.textContent = 'AUTHORIZED (Unlocked)';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> SPI Bus Rate`;
        if (hudReadout4) hudReadout4.textContent = '10 Mbps SCK/MISO';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> RC522 RFID 13.56MHz Carrier Burst & SPI Framing`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Card Detected: 0x4A883F1B • 13.56MHz Active';
        }

      } else if (hw.activeLab === 'iot') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>☁️</span> Cloud Broker`;
        if (hudReadout1) hudReadout1.textContent = 'mqtt.eclipseprojects.io';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Wi-Fi RSSI`;
        if (hudReadout2) hudReadout2.textContent = '-58 dBm (Strong)';
        if (hudLabel3) hudLabel3.innerHTML = `<span>📊</span> Topic Payload`;
        if (hudReadout3) hudReadout3.textContent = 'atl/lab22/telemetry';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> FreeRTOS Core`;
        if (hudReadout4) hudReadout4.textContent = 'Dual Core 0 & Core 1';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> ESP32 Wi-Fi MQTT Telemetry Transmit Burst (2.4GHz)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'MQTT Published: 200 OK • RSSI: -58 dBm';
        }

      } else if (hw.activeLab === 'oled') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🖥️</span> Resolution`;
        if (hudReadout1) hudReadout1.textContent = '128 × 64 Pixels';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Memory Pages`;
        if (hudReadout2) hudReadout2.textContent = '8 Pages (1024 Bytes)';
        if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Active Pixels`;
        if (hudReadout3) hudReadout3.textContent = '4,096 / 8,192 Lit';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> I2C Clock`;
        if (hudReadout4) hudReadout4.textContent = '400 kHz Fast-Mode';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> SSD1306 I2C Framebuffer Stream (SDA/SCL)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Page 0..7 Refreshed @ 60 FPS • 0x3C';
        }

      } else if (hw.activeLab === 'soil') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🌱</span> Soil Moisture`;
        if (hudReadout1) hudReadout1.textContent = '68% (Optimal)';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Sensor Vout`;
        if (hudReadout2) hudReadout2.textContent = '1.85 V Capacitive';
        if (hudLabel3) hudLabel3.innerHTML = `<span>💧</span> 5V Relay State`;
        if (hudReadout3) hudReadout3.textContent = 'RELAY CLOSED (Pump ON)';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Protection`;
        if (hudReadout4) hudReadout4.textContent = 'Optocoupler Isolated';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Capacitive Soil Oscillator Waveform`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Freq: 1.5 MHz • Vout: 1.85V • Pump ACTIVE';
        }

      } else if (hw.activeLab === 'gas') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🧪</span> Gas PPM`;
        if (hudReadout1) hudReadout1.textContent = '380 ppm (Clean)';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> MQ Sensor Vout`;
        if (hudReadout2) hudReadout2.textContent = '1.45 V Analog';
        if (hudLabel3) hudLabel3.innerHTML = `<span>🚨</span> Alarm Limit`;
        if (hudReadout3) hudReadout3.textContent = '600 ppm (Safety)';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Heater Coil`;
        if (hudReadout4) hudReadout4.textContent = '5.0V Steady (Preheated)';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> MQ Gas Chamber Analog Voltage (A0)`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = '380 ppm • Normal Air Quality • Alarm Ready';
        }

      } else if (hw.activeLab === 'dht') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🌡️</span> Ambient Temp`;
        if (hudReadout1) hudReadout1.textContent = '24.5 °C';
        if (hudLabel2) hudLabel2.innerHTML = `<span>💧</span> Humidity`;
        if (hudReadout2) hudReadout2.textContent = '55.0 % RH';
        if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Single-Bus Data`;
        if (hudReadout3) hudReadout3.textContent = '40-Bit Frame Verified';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Checksum`;
        if (hudReadout4) hudReadout4.textContent = '0x3F (Valid)';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> DHT Single-Bus Protocol Pulse Sequence`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Start: 18ms LOW • 40 Bits Decoded OK';
        }

      } else if (hw.activeLab === 'slicer') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>🖨️</span> Layer Height`;
        if (hudReadout1) hudReadout1.textContent = '0.20 mm';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Hotend Temp`;
        if (hudReadout2) hudReadout2.textContent = '205 °C (PLA)';
        if (hudLabel3) hudLabel3.innerHTML = `<span>🧱</span> Infill Pattern`;
        if (hudReadout3) hudReadout3.textContent = '20% Gyroid';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Heated Bed`;
        if (hudReadout4) hudReadout4.textContent = '60 °C (Adhesion Ready)';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> 3D Printer Stepper Motor Pulse Train`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'Extruder: 50 mm/s • Layer 14 of 120';
        }

      } else if (hw.activeLab === 'cad') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>📐</span> Dimensions`;
        if (hudReadout1) hudReadout1.textContent = '50 × 30 × 15 mm';
        if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Operation`;
        if (hudReadout2) hudReadout2.textContent = 'Boolean Difference';
        if (hudLabel3) hudLabel3.innerHTML = `<span>🎯</span> Mesh Polygons`;
        if (hudReadout3) hudReadout3.textContent = '2,480 Triangles';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Export Format`;
        if (hudReadout4) hudReadout4.textContent = 'STL / STEP Ready';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Parametric CAD Math & Vector Coordinates`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = 'CSG Union + Cut Evaluated: 0 Errors';
        }

      } else if (hw.activeLab === 'dmm') {
        if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> DC Voltage`;
        if (hudReadout1) hudReadout1.textContent = `${hw.voltage.toFixed(2)} V`;
        if (hudLabel2) hudLabel2.innerHTML = `<span>🌊</span> Current Draw`;
        if (hudReadout2) hudReadout2.textContent = `${hw.currentMa.toFixed(1)} mA`;
        if (hudLabel3) hudLabel3.innerHTML = `<span>Ω</span> Resistance`;
        if (hudReadout3) hudReadout3.textContent = '220.0 Ω';
        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Probe Mode`;
        if (hudReadout4) hudReadout4.textContent = 'DC Volts & Amps';

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Digital Multimeter Sampling Waveform`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = `Input: ${hw.voltage.toFixed(2)}V DC • True RMS Active`;
        }

      } else if (hw.activeLab === 'led') {
        // LED Lab Telemetry
        if (hw.ledActive) {
          if (breadboardLed) breadboardLed.classList.add('illuminated');
          if (ledGlow) {
            ledGlow.style.opacity = '1';
            ledGlow.style.transform = 'scale(1.2)';
          }
          if (unoBuiltinLed) unoBuiltinLed.classList.add('illuminated');
          if (wirePin13) wirePin13.classList.add('flowing');
          if (wireGnd) wireGnd.classList.add('flowing');
        } else {
          if (breadboardLed) breadboardLed.classList.remove('illuminated');
          if (ledGlow) {
            ledGlow.style.opacity = '0';
            ledGlow.style.transform = 'scale(0.8)';
          }
          if (unoBuiltinLed) unoBuiltinLed.classList.remove('illuminated');
          if (wirePin13) wirePin13.classList.remove('flowing');
          if (wireGnd) wireGnd.classList.remove('flowing');
        }

        if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> Pin 13 Voltage`;
        if (hudReadout1) hudReadout1.textContent = `${hw.voltage.toFixed(2)} V`;

        if (hudLabel2) hudLabel2.innerHTML = `<span>🌊</span> Circuit Current`;
        if (hudReadout2) hudReadout2.textContent = `${hw.currentMa.toFixed(1)} mA`;

        if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Digital Logic State`;
        if (hudReadout3) {
          hudReadout3.textContent = hw.pin13State ? 'HIGH (5V)' : 'LOW (0V)';
          hudReadout3.className = hw.pin13State ? 'hud-value val high' : 'hud-value val low';
        }

        if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Protection Resistor`;
        if (hudReadout4) hudReadout4.textContent = `220 Ω (Steady)`;

        if (scopeTitle) {
          scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin 13 Digital Signal Waveform`;
        }
        if (scopeStatus) {
          scopeStatus.textContent = hw.pin13State ? '5V HIGH (ON)' : '0V LOW (OFF)';
        }
      }
    };

    function updatePotArc(val) {
      if (!potActiveArc) return;
      const cx = 65, cy = 110, r = 38;
      // Map val (0..1023) to sweep angle in degrees (from 180° down to 0°)
      const angleDeg = 180 - (val / 1023.0) * 180.0;
      const rad = (angleDeg * Math.PI) / 180;
      const endX = cx + r * Math.cos(rad);
      const endY = cy - r * Math.sin(rad);
      potActiveArc.setAttribute('d', `M 27 110 A ${r} ${r} 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    }

    function updatePotServoArc(angle) {
      if (!potServoArc) return;
      const cx = 48, cy = 110, r = 38;
      const mathAngle = 180 - Math.max(0, Math.min(180, angle));
      const rad = (mathAngle * Math.PI) / 180;
      const endX = cx + r * Math.cos(rad);
      const endY = cy - r * Math.sin(rad);
      potServoArc.setAttribute('d', `M 10 110 A ${r} ${r} 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    }

    // Helper to draw smooth dynamic protractor arc
    function updateProtractorArc(angle) {
      if (!protractorActiveArc) return;
      const cx = 510, cy = 160, r = 85;
      // Map servo angle (0 to 180) to protractor circle math angle (180 down to 0 degrees)
      const mathAngleDeg = 180 - Math.max(0, Math.min(180, angle));
      const rad = (mathAngleDeg * Math.PI) / 180;
      const endX = cx + r * Math.cos(rad);
      const endY = cy - r * Math.sin(rad);

      // Arc starts from 0° (which is x=425, y=160)
      const largeArcFlag = angle > 180 ? 1 : 0;
      protractorActiveArc.setAttribute('d', `M 425 160 A ${r} ${r} 0 ${largeArcFlag} 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    }

    window.circuitSimulation.onStepChange = (stepInfo) => {
      clearLineHighlights();

      if (!stepInfo) {
        simStatusText.textContent = 'Circuit idle. Press Start Simulation to test!';
        if (loopCycleBadge) loopCycleBadge.textContent = 'Loop Cycles: 0';
        return;
      }

      if (loopCycleBadge) loopCycleBadge.textContent = `Loop Cycles: ${stepInfo.loopCount}`;
      simStatusText.textContent = stepInfo.text;

      highlightLines(stepInfo);
    };

    function updateSimControlsUI() {
      const isRunning = window.circuitSimulation.isRunning;
      const isPaused = window.circuitSimulation.isPaused;

      btnSimulate.classList.toggle('active', isRunning && !isPaused);
      btnPause.classList.toggle('active', isPaused);

      if (isRunning && !isPaused) {
        btnSimulate.innerHTML = `<span>⚡</span> Running...`;
      } else if (isPaused) {
        btnSimulate.innerHTML = `<span>▶</span> Resume`;
      } else {
        btnSimulate.innerHTML = `<span>⚡</span> Start Simulation`;
      }
    }

    function clearLineHighlights() {
      document.querySelectorAll('.code-row').forEach(row => {
        row.classList.remove('executing', 'sync-hover');
      });
    }

    function highlightLines(stepInfo) {
      let lineToHighlight = null;
      if (stepInfo.cppLine !== undefined && stepInfo.cppLine !== null) {
        lineToHighlight = stepInfo.cppLine;
      } else if (stepInfo.lineIndex !== undefined) {
        lineToHighlight = stepInfo.lineIndex;
      }

      if (lineToHighlight !== null) {
        const plainRows = document.querySelectorAll('.code-row-human');
        const cppRows = document.querySelectorAll('.code-row-cpp');

        let targetCpp = document.querySelector(`.code-row-cpp[data-line="${lineToHighlight}"]`);
        if (!targetCpp && cppRows.length > 0) {
          const clampedIndex = Math.min(Math.max(0, lineToHighlight), cppRows.length - 1);
          targetCpp = cppRows[clampedIndex];
        }

        let targetPlain = null;
        if (targetCpp) {
          const tag = targetCpp.getAttribute('data-tag');
          if (tag && tag !== 'blank' && tag !== 'brace' && tag !== 'code') {
            targetPlain = document.querySelector(`.code-row-human[data-tag="${tag}"]`);
          }
        }
        if (!targetPlain) {
          targetPlain = document.querySelector(`.code-row-human[data-line="${lineToHighlight}"]`);
        }
        if (!targetPlain && plainRows.length > 0) {
          if (plainRows.length < cppRows.length) {
            const mappedIndex = Math.min(plainRows.length - 1, Math.floor((lineToHighlight / Math.max(1, cppRows.length)) * plainRows.length));
            targetPlain = plainRows[mappedIndex];
          } else {
            const clampedIndex = Math.min(Math.max(0, lineToHighlight), plainRows.length - 1);
            targetPlain = plainRows[clampedIndex];
          }
        }

        if (targetPlain) {
          targetPlain.classList.add('executing');
          try {
            targetPlain.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) { }
        }
        if (targetCpp) {
          targetCpp.classList.add('executing');
          try {
            targetCpp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) { }
        }
      }
    }

    // =========================================================================
    // LAB SWITCHER (Servo Motor Lab vs LED Blink Lab)
    // =========================================================================

    function switchLab(labName, force = false) {
      if (window.clearAllLabTimers) window.clearAllLabTimers();
      if (!force && state.activeLab === labName) return;
      state.activeLab = labName;
      if (window.soundEngine) window.soundEngine.playClick();

      // Update URL query parameter without full reload
      if (window.history && window.history.replaceState) {
        window.history.replaceState({ lab: labName }, '', `?lab=${labName}`);
      }

      // 1. Update Switcher Buttons
      document.querySelectorAll('.lab-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lab') === labName);
      });

      const labNames = {
        // Level 1: Grades 6-8
        led: 'Level 1 • LED Digital Blink Lab',
        servo: 'Level 1 • SG90 Micro Servo Motor Lab',
        button: 'Level 1 • Tactile Pushbutton & Digital Read Lab',
        pot: 'Level 1 • 10k Potentiometer & Analog Read Lab',
        buzzer: 'Level 1 • Piezo Buzzer & Tone Frequency Lab',
        cad: 'Level 1 • 3D CAD Modeling Studio (Tinkercad CSG)',
        dmm: 'Level 1 • Virtual Multimeter & Circuit Troubleshooting',
        // Level 2: Grades 9-10
        ldr: 'Level 2 • LDR Light Sensor & Smart Streetlight Lab',
        rgb: 'Level 2 • RGB Multi-Color LED & PWM Lab',
        temp: 'Level 2 • TMP36 Precision Temperature & HVAC Lab',
        sonar: 'Level 2 • HC-SR04 Ultrasonic Distance & Radar Lab',
        ir: 'Level 2 • TCRT5000 IR Reflective & Line Follower Lab',
        slicer: 'Level 2 • 3D Slicing & G-Code Toolpath Studio',
        dht: 'Level 2 • DHT11/22 Climate Station & Humidity Lab',
        gas: 'Level 2 • MQ-2/135 Hazardous Gas & Air Quality Lab',
        // Level 3: Grades 11-12
        lcd: 'Level 3 • 16x2 I2C Character LCD Display Lab',
        oled: 'Level 3 • 0.96" SSD1306 Graphic OLED Display Lab',
        soil: 'Level 3 • Soil Moisture & 5V Water Relay Lab',
        motor: 'Level 3 • L298N Dual H-Bridge & 4WD Rover Lab',
        imu: 'Level 3 • MPU6050 6-Axis IMU & Gimbal Lab',
        rfid: 'Level 3 • RC522 13.56MHz RFID Access Control Lab',
        iot: 'Level 3 • ESP32 IoT Cloud Telemetry & MQTT Lab'
      };
      if (currentLabLabel) currentLabLabel.textContent = labNames[labName] || 'Arduino Lab';

      // Update active lab badge in header
      const activeLabNamePill = document.getElementById('active-lab-name-pill');
      if (activeLabNamePill) {
        const shortNames = {
          led: 'LED Blink Lab',
          servo: 'Servo Motor Lab',
          button: 'Pushbutton Lab',
          pot: 'Potentiometer Lab',
          buzzer: 'Piezo Buzzer Lab',
          cad: '3D CAD Studio',
          dmm: 'Multimeter DMM Lab',
          ldr: 'LDR Light Sensor',
          rgb: 'RGB Color LED',
          temp: 'Temperature Sensor',
          sonar: 'Ultrasonic Radar',
          ir: 'IR Line Sensor',
          slicer: '3D Slicer Engine',
          dht: 'DHT Climate Station',
          gas: 'MQ Gas & AQI',
          lcd: '16x2 I2C LCD',
          oled: 'SSD1306 OLED',
          soil: 'Soil & 5V Relay',
          motor: 'L298N Motor Driver',
          imu: 'MPU6050 6-Axis IMU',
          rfid: 'RC522 RFID Access',
          iot: 'ESP32 IoT Cloud'
        };
        activeLabNamePill.textContent = shortNames[labName] || labName;
      }

      // Update active lab card highlight in explorer modal
      document.querySelectorAll('.explorer-lab-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-lab') === labName);
      });

      // 2. Toggle SVG views across all labs
      const allCircuitViews = [
        'servo', 'led', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'lcd', 'ir', 'sonar', 'temp',
        'cad', 'dmm', 'slicer', 'dht', 'gas', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
      ];
      allCircuitViews.forEach(v => {
        const el = document.getElementById(`${v}-circuit-view`);
        if (el) el.style.display = (labName === v) ? 'block' : 'none';
      });

      // 3. Render Lesson Navigation Tabs for the active lab
      renderLessonNavTabs();

      // 4. Update Hardware Callouts
      renderHardwareCallouts();

      // 5. Update Simulation Engine Lab mode
      window.circuitSimulation.setLab(labName);
      updateSimControlsUI();

      // 6. Switch to Lesson 1 of selected lab
      switchLesson(0);
    }

    // --- Right Panel View Tabs (Lab & Code vs Concept & Analogy) ---
    function setDeskView(viewName) {
      state.activeDeskView = viewName;
      if (window.soundEngine) window.soundEngine.playClick();
      if (viewTabLab) viewTabLab.classList.toggle('active', viewName === 'lab');
      if (viewTabConcept) viewTabConcept.classList.toggle('active', viewName === 'concept');
      if (viewContentLab) {
        viewContentLab.style.display = viewName === 'lab' ? 'flex' : 'none';
        if (viewName === 'lab') {
          viewContentLab.style.flexDirection = 'column';
          viewContentLab.style.gap = '12px';
          viewContentLab.style.width = '100%';
        }
      }
      if (viewContentConcept) {
        viewContentConcept.style.display = viewName === 'concept' ? 'flex' : 'none';
        if (viewName === 'concept') {
          viewContentConcept.style.flexDirection = 'column';
          viewContentConcept.style.gap = '12px';
          viewContentConcept.style.width = '100%';
        }
      }
    }

    if (viewTabLab) viewTabLab.addEventListener('click', () => setDeskView('lab'));
    if (viewTabConcept) viewTabConcept.addEventListener('click', () => setDeskView('concept'));

    if (labBtnServo) {
      labBtnServo.addEventListener('click', () => switchLab('servo'));
    }
    if (labBtnLed) {
      labBtnLed.addEventListener('click', () => switchLab('led'));
    }
    if (labBtnPot) {
      labBtnPot.addEventListener('click', () => switchLab('pot'));
    }
    if (labBtnButton) {
      labBtnButton.addEventListener('click', () => switchLab('button'));
    }
    if (labBtnBuzzer) {
      labBtnBuzzer.addEventListener('click', () => switchLab('buzzer'));
    }
    if (labBtnLdr) {
      labBtnLdr.addEventListener('click', () => switchLab('ldr'));
    }
    if (labBtnRgb) {
      labBtnRgb.addEventListener('click', () => switchLab('rgb'));
    }
    if (labBtnLcd) {
      labBtnLcd.addEventListener('click', () => switchLab('lcd'));
    }
    if (labBtnIr) {
      labBtnIr.addEventListener('click', () => switchLab('ir'));
    }
    if (labBtnSonar) {
      labBtnSonar.addEventListener('click', () => switchLab('sonar'));
    }
    if (labBtnTemp) {
      labBtnTemp.addEventListener('click', () => switchLab('temp'));
    }

    window.switchLab = switchLab;
    window.switchLesson = switchLesson;
    window.getCurrentLessons = getCurrentLessons;
    window.state = state;

    function renderLessonNavTabs() {
      const lessons = getCurrentLessons();
      if (!lessonNavTabs) return;

      lessonNavTabs.innerHTML = lessons.map((l, idx) => `
      <button class="lesson-tab ${idx === state.activeLessonIndex ? 'active' : ''}" data-lesson="${idx}" title="${l.title || l.shortTitle}">
        <span>${idx + 1}</span>
      </button>
    `).join('');

      // Reattach tab click events
      lessonNavTabs.querySelectorAll('.lesson-tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          switchLesson(index);
        });
      });
    }

    function renderHardwareCallouts() {
      if (!hardwareCalloutsContainer) return;

      if (state.activeLab === 'servo') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="The servo's orange wire receives 50Hz PWM pulses">
          <span>🌊</span> <strong>PWM Signal (Orange):</strong> Pulse width controls exact angle (1.0ms=0°, 1.5ms=90°, 2.0ms=180°).
        </div>
        <div class="callout-pill" title="Tiny plastic gears convert motor speed into high torque!">
          <span>⚙️</span> <strong>Reduction Gears:</strong> Boosts rotational force so the arm can lift robot mechanisms.
        </div>
        <div class="callout-pill" title="Internal position sensor reports exact angle to the chip!">
          <span>🎛️</span> <strong>Feedback Potentiometer:</strong> Internal sensor tells the servo when it has reached its target angle.
        </div>
      `;
      } else if (state.activeLab === 'pot') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="The sliding wiper contact partitions 5V smoothly">
          <span>🎛️</span> <strong>Resistive Wiper:</strong> Turning the knob partitions 5V smoothly from 0.0V to 5.0V.
        </div>
        <div class="callout-pill" title="10-bit analog-to-digital converter">
          <span>📏</span> <strong>10-Bit ADC Ruler:</strong> Converts 0-5V into 1024 discrete digital steps (0 to 1023).
        </div>
        <div class="callout-pill" title="Translates sensor numbers to actuator degrees">
          <span>🗺️</span> <strong>map() Scaling:</strong> Translates 0..1023 numbers to 0..180° angles for robotic steering.
        </div>
      `;
      } else if (state.activeLab === 'button') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Internal pullup resistor holds pin at 5V">
          <span>🧲</span> <strong>INPUT_PULLUP Spring:</strong> Internal 20kΩ resistor holds Pin 2 at 5V HIGH until pressed.
        </div>
        <div class="callout-pill" title="Active-low completes the ground circuit">
          <span>🔘</span> <strong>Active-LOW Logic:</strong> Pressing the tactile button pulls Pin 2 straight to GND (0V LOW).
        </div>
        <div class="callout-pill" title="Conditional logic makes intelligent choices">
          <span>🚪</span> <strong>if/else Branch:</strong> Arduino reads LOW and turns ON the Pin 13 LED instantly!
        </div>
      `;
      } else if (state.activeLab === 'buzzer') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Ceramic piezo disc flexes with voltage pulses">
          <span>📢</span> <strong>Ceramic Piezo Disc:</strong> Physical disc expands and contracts when pulsed with voltage to produce sound waves.
        </div>
        <div class="callout-pill" title="Hardware timer generates square wave on Pin 8">
          <span>⚡</span> <strong>tone(8, freq):</strong> Generates exact square wave oscillations in Hertz (cycles per second).
        </div>
        <div class="callout-pill" title="Silences square wave generation">
          <span>🤫</span> <strong>noTone(8):</strong> Halts the hardware timer immediately to return to silence.
        </div>
      `;
      } else if (state.activeLab === 'ldr') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Photons knock electrons free in the semiconductor">
          <span>☀️</span> <strong>CdS Photoresistor:</strong> Light energy drops electrical resistance from 100,000Ω down to 500Ω.
        </div>
        <div class="callout-pill" title="Tug-of-war voltage divider converts resistance into voltage">
          <span>⚖️</span> <strong>10kΩ Voltage Divider:</strong> Balances variable LDR resistance against fixed 10k resistor to feed 0-5V to Pin A1.
        </div>
        <div class="callout-pill" title="Pin 13 automatically drives the streetlamp at dusk">
          <span>💡</span> <strong>Autonomous Streetlight:</strong> Code threshold automatically turns ON municipal lighting when darkness sets in.
        </div>
      `;
      } else if (state.activeLab === 'rgb') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Hardware Timer PWM Pin ~9 for Red LED channel">
          <span>🔴</span> <strong>Red Anode (Pin ~9):</strong> 8-bit PWM timer controls red photon brightness from 0 to 255.
        </div>
        <div class="callout-pill" title="Hardware Timer PWM Pin ~10 for Green LED channel">
          <span>🟢</span> <strong>Green Anode (Pin ~10):</strong> 8-bit PWM timer controls green photon brightness from 0 to 255.
        </div>
        <div class="callout-pill" title="Hardware Timer PWM Pin ~11 for Blue LED channel">
          <span>🔵</span> <strong>Blue Anode (Pin ~11):</strong> 8-bit PWM timer controls blue photon brightness from 0 to 255.
        </div>
        <div class="callout-pill" title="Shared Common Cathode longest pin goes to GND">
          <span>🔌</span> <strong>Common Cathode (GND):</strong> Longest leg completes the circular electrical drain for all 3 internal dice.
        </div>
      `;
      } else if (state.activeLab === 'sonar') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Transducer T emits 40kHz ultrasound acoustic burst">
          <span>🔊</span> <strong>Transmitter 'T':</strong> Miniature horn shoots 40kHz ultrasound pulses.
        </div>
        <div class="callout-pill" title="Transducer R listens for returning sound wave echo">
          <span>👂</span> <strong>Receiver 'R':</strong> Directional acoustic microphone detects returning sound.
        </div>
        <div class="callout-pill" title="Arduino Trigger Pin 12 sends 10 microsecond pulse">
          <span>⚡</span> <strong>Trig (Pin 12):</strong> Sends 10µs electrical trigger to fire sound ping.
        </div>
        <div class="callout-pill" title="Arduino Echo Pin 11 measures flight duration in microseconds">
          <span>⏱️</span> <strong>Echo (Pin 11):</strong> Held HIGH for exact duration sound is in flight.
        </div>
      `;
      } else if (state.activeLab === 'temp') {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Analog output from TMP36 sensor to Arduino Pin A2">
          <span>🌡️</span> <strong>TMP36 VOUT (Pin A2):</strong> Linear 10mV/°C silicon transducer with 500mV freezing-point offset.
        </div>
        <div class="callout-pill" title="Arduino PWM Pin ~6 controls cooling fan motor">
          <span>🌬️</span> <strong>PWM Fan Actuator (Pin ~6):</strong> Variable speed motor control based on real-time greenhouse heat.
        </div>
        <div class="callout-pill" title="Digital Pin 13 warning LED and buzzer siren">
          <span>🚨</span> <strong>Overheat Safety System:</strong> Triggers alarm audio beacon if temperature exceeds 30.0°C safety setpoint.
        </div>
      `;
      } else {
        hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Current can only pass through an LED in one direction!">
          <span>💡</span> <strong>LED Anode:</strong> Long leg (+) receives the 5V push.
        </div>
        <div class="callout-pill" title="A resistor limits electrical flow so the LED doesn't burn out!">
          <span>🛡️</span> <strong>220Ω Resistor:</strong> Squeezes the current to protect the LED.
        </div>
        <div class="callout-pill" title="Ground completes the full circular loop of electricity!">
          <span>🔌</span> <strong>GND (Ground):</strong> The return path back to the battery/USB.
        </div>
      `;
      }
    }

    // =========================================================================
    // LESSON SWITCHING & RENDERING
    // =========================================================================

    function switchLesson(index) {
      if (window.clearAllLabTimers) window.clearAllLabTimers();
      const lessons = getCurrentLessons();
      if (!lessons || lessons.length === 0) return;

      // Support both 0-based (0..3) and 1-based (1..4) calls safely
      let targetIndex = Number(index) || 0;
      if (targetIndex >= 1 && targetIndex <= lessons.length && !lessons[targetIndex]) {
        targetIndex = targetIndex - 1;
      }
      targetIndex = Math.max(0, Math.min(lessons.length - 1, targetIndex));
      state.activeLessonIndex = targetIndex;
      const lesson = lessons[targetIndex] || lessons[0];

      // Update active tab class
      if (lessonNavTabs) {
        lessonNavTabs.querySelectorAll('.lesson-tab').forEach((t, i) => {
          t.classList.toggle('active', i === index);
        });
      }

      // Reset Simulation for this lesson
      window.circuitSimulation.setLesson(lesson.id);
      updateSimControlsUI();

      // Render Lesson Components
      renderLessonHeader(lesson);
      renderAnalogy(lesson);
      renderJargonPills(lesson);
      renderInteractiveTask(lesson);
      renderCodeTranslator(lesson);
      renderTeacherInsights();
      setDeskView('lab');

      // Update Stepper Controls & Progress Bar
      const lessonStepIndicator = document.getElementById('lesson-step-indicator');
      if (lessonStepIndicator) {
        lessonStepIndicator.textContent = `Step ${index + 1} of ${lessons.length}`;
      }
      const progressBar = document.getElementById('lesson-progress-bar');
      if (progressBar) {
        const pct = Math.round(((index + 1) / lessons.length) * 100);
        progressBar.style.width = `${pct}%`;
      }
      const prevBtn = document.getElementById('prev-lesson-btn');
      if (prevBtn) {
        prevBtn.disabled = (index === 0);
      }
      const nextBtn = document.getElementById('next-lesson-btn');
      if (nextBtn) {
        nextBtn.disabled = (index >= lessons.length - 1);
      }

      // Update Step Advance Card
      const advanceTitle = document.getElementById('step-advance-title');
      const advanceDesc = document.getElementById('step-advance-desc');
      const advanceBtn = document.getElementById('btn-advance-step');
      if (advanceTitle && advanceDesc && advanceBtn) {
        if (index < lessons.length - 1) {
          const nextLesson = lessons[index + 1];
          advanceTitle.textContent = `Ready for Step ${index + 2}?`;
          advanceDesc.textContent = `Up next: ${nextLesson.title || nextLesson.shortTitle}. Complete this step to advance!`;
          advanceBtn.innerHTML = `<span>Next: ${nextLesson.shortTitle}</span> <span class="arrow">▶</span>`;
        } else {
          advanceTitle.textContent = `🎉 Lab Complete! Outstanding Work!`;
          advanceDesc.textContent = `You've completed all 4 lessons in this lab. Ready for the next adventure?`;
          advanceBtn.innerHTML = `<span>Explore Next Lab</span> <span class="arrow">🚀</span>`;
        }
      }
    }

    function resetCurrentLesson() {
      window.circuitSimulation.stop();
      updateSimControlsUI();
      const lessons = getCurrentLessons();
      const lesson = lessons[state.activeLessonIndex];

      if (state.activeLab === 'servo') {
        if (lesson.id === 1) {
          state.servoSortingState = {};
          state.servoLesson1Solved = false;
        } else if (lesson.id === 2) {
          state.servoAttached = false;
          window.circuitSimulation.attachServoPin(0);
        } else if (lesson.id === 3) {
          state.servoAngle1 = 90;
          state.servoAngle2 = 180;
          state.servoDelay = 1000;
          window.circuitSimulation.setServoAngles(90, 180, 1000);
        }
      } else if (state.activeLab === 'pot') {
        if (lesson.id === 1) {
          state.potSortingState = {};
          state.potLesson1Solved = false;
        } else if (lesson.id === 2) {
          state.potConnected = false;
          window.circuitSimulation.connectPotWiper(false);
        } else if (lesson.id === 3) {
          state.potVal = 512;
          window.circuitSimulation.setPotValue(512);
        } else if (lesson.id === 4) {
          state.potVal = 512;
          window.circuitSimulation.setPotValue(512);
        }
      } else if (state.activeLab === 'button') {
        if (lesson.id === 1) {
          state.buttonSortingState = {};
          state.buttonLesson1Solved = false;
        } else if (lesson.id === 2) {
          state.buttonConfigured = false;
          window.circuitSimulation.configureButtonPin(false);
        } else if (lesson.id === 3) {
          state.buttonPressed = false;
          window.circuitSimulation.setButtonPressed(false);
        } else if (lesson.id === 4) {
          state.buttonPressed = false;
          state.buttonLedState = false;
          state.buttonMode = 'momentary';
          window.circuitSimulation.buttonMode = 'momentary';
          window.circuitSimulation.setButtonPressed(false);
        }
      } else {
        if (lesson.id === 1) {
          state.ledSortingState = {};
          state.ledLesson1Solved = false;
        } else if (lesson.id === 2) {
          state.claimedPin = null;
          window.circuitSimulation.claimPin13(false);
        } else if (lesson.id === 3) {
          state.delayOn = 1000;
          state.delayOff = 1000;
          window.circuitSimulation.setDelays(1000, 1000);
        }
      }
      switchLesson(state.activeLessonIndex);
    }

    function renderLessonHeader(lesson) {
      lessonTitleEl.textContent = lesson.title;
      lessonSubtitleEl.textContent = lesson.subtitle;
      const msg = lesson.mascotMsg || lesson.analogy?.headline || lesson.subtitle || "Ready to build and test together!";
      mascotBubble.innerHTML = `<strong>Coach Sparky:</strong> ${msg}`;
    }

    function renderAnalogy(lesson) {
      if (!lesson.analogy) {
        analogyCard.innerHTML = '';
        return;
      }
      const a = lesson.analogy;
      let detailsHtml = '';

      if (a.setup && a.loop) {
        detailsHtml = `
        <div class="analogy-grid">
          <div class="analogy-item">
            <span class="analogy-badge">void setup()</span>
            <p>${a.setup}</p>
          </div>
          <div class="analogy-item">
            <span class="analogy-badge">void loop()</span>
            <p>${a.loop}</p>
          </div>
        </div>
      `;
      } else if (a.library && a.instance) {
        detailsHtml = `
        <div class="analogy-grid">
          <div class="analogy-item">
            <span class="analogy-badge">#include &lt;Servo.h&gt;</span>
            <p>${a.library}</p>
          </div>
          <div class="analogy-item">
            <span class="analogy-badge">Servo myServo;</span>
            <p>${a.instance}</p>
          </div>
        </div>
      `;
      } else if (a.wires && a.attach) {
        detailsHtml = `
        <div class="analogy-grid">
          <div class="analogy-item">
            <span class="analogy-badge">3-Wire Cable</span>
            <p>${a.wires}</p>
          </div>
          <div class="analogy-item">
            <span class="analogy-badge">myServo.attach(9)</span>
            <p>${a.attach}</p>
          </div>
        </div>
      `;
      } else if (a.write && a.pwmPulse) {
        detailsHtml = `
        <div class="analogy-grid">
          <div class="analogy-item">
            <span class="analogy-badge">myServo.write(angle)</span>
            <p>${a.write}</p>
          </div>
          <div class="analogy-item">
            <span class="analogy-badge">PWM Pulse Width</span>
            <p>${a.pwmPulse}</p>
          </div>
        </div>
      `;
      } else if (a.sweep && a.forLoop) {
        detailsHtml = `
        <div class="analogy-grid">
          <div class="analogy-item">
            <span class="analogy-badge">for loop</span>
            <p>${a.forLoop}</p>
          </div>
          <div class="analogy-item">
            <span class="analogy-badge">Smooth Travel</span>
            <p>${a.sweep}</p>
          </div>
        </div>
      `;
      } else {
        detailsHtml = Object.keys(a).filter(k => k !== 'title').map(k => `
        <p class="analogy-line"><strong>${k}:</strong> ${a[k]}</p>
      `).join('');
      }

      analogyCard.innerHTML = `
      <div class="analogy-header">
        <span class="icon">💡</span>
        <span class="title">Real-World Analogy: <strong>${a.title}</strong></span>
      </div>
      <div class="analogy-body">
        ${detailsHtml}
      </div>
    `;
    }

    function renderJargonPills(lesson) {
      if (!lesson.jargonBuster || !lesson.jargonBuster.length) {
        jargonPills.innerHTML = '';
        return;
      }
      jargonPills.innerHTML = `
      <span class="jargon-title">🔍 Zero-Jargon Decoder:</span>
      <div class="jargon-pill-container">
        ${lesson.jargonBuster.map(item => `
          <button class="jargon-pill" data-word="${item.word}">
            <span>${item.word}</span>
            <small class="pronounce">(${item.pronunciation})</small>
          </button>
        `).join('')}
      </div>
    `;

      jargonPills.querySelectorAll('.jargon-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          const word = btn.getAttribute('data-word');
          const match = lesson.jargonBuster.find(j => j.word === word);
          if (match) showJargonModal(match);
        });
      });
    }

    function showJargonModal(item) {
      const modalHtml = `
      <div class="modal-backdrop" id="jargon-popup-modal">
        <div class="modal-card jargon-card">
          <div class="modal-header">
            <h3>📖 Word Decoder: ${item.word}</h3>
            <button class="modal-close-btn" id="close-jargon-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="jargon-detail-row">
              <span class="pronounce-tag">🗣️ Say it like:</span>
              <strong class="pronounce-word">${item.pronunciation}</strong>
            </div>
            <div class="jargon-analogy-box">
              <span class="icon">💡</span>
              <div>
                <strong>Think of it like:</strong> ${item.analogy}
              </div>
            </div>
            <p class="plain-def">${item.definition}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="dismiss-jargon-btn">Got it! Let's Code 🚀</button>
          </div>
        </div>
      </div>
    `;

      const oldModal = document.getElementById('jargon-popup-modal');
      if (oldModal) oldModal.remove();

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const popup = document.getElementById('jargon-popup-modal');
      const closeBtn = document.getElementById('close-jargon-btn');
      const dismissBtn = document.getElementById('dismiss-jargon-btn');

      const close = () => popup.remove();
      closeBtn.addEventListener('click', close);
      dismissBtn.addEventListener('click', close);
      popup.addEventListener('click', (e) => {
        if (e.target === popup) close();
      });
    }

    // =========================================================================
    // INTERACTIVE LESSON TASK ROUTER
    // =========================================================================

    function renderInteractiveTask(lesson) {
      lessonInteractiveArea.innerHTML = '';

      if (state.activeLab === 'servo') {
        if (lesson.id === 1) renderServoLesson1(lesson);
        else if (lesson.id === 2) renderServoLesson2(lesson);
        else if (lesson.id === 3) renderServoLesson3(lesson);
        else if (lesson.id === 4) renderServoLesson4(lesson);
      } else if (state.activeLab === 'pot') {
        if (lesson.id === 1) renderPotLesson1(lesson);
        else if (lesson.id === 2) renderPotLesson2(lesson);
        else if (lesson.id === 3) renderPotLesson3(lesson);
        else if (lesson.id === 4) renderPotLesson4(lesson);
      } else if (state.activeLab === 'button') {
        if (lesson.id === 1) renderButtonLesson1(lesson);
        else if (lesson.id === 2) renderButtonLesson2(lesson);
        else if (lesson.id === 3) renderButtonLesson3(lesson);
        else if (lesson.id === 4) renderButtonLesson4(lesson);
      } else if (state.activeLab === 'buzzer') {
        if (lesson.id === 1) renderBuzzerLesson1(lesson);
        else if (lesson.id === 2) renderBuzzerLesson2(lesson);
        else if (lesson.id === 3) renderBuzzerLesson3(lesson);
        else if (lesson.id === 4) renderBuzzerLesson4(lesson);
      } else if (state.activeLab === 'ldr') {
        if (lesson.id === 1) renderLdrLesson1(lesson);
        else if (lesson.id === 2) renderLdrLesson2(lesson);
        else if (lesson.id === 3) renderLdrLesson3(lesson);
        else if (lesson.id === 4) renderLdrLesson4(lesson);
      } else if (state.activeLab === 'rgb') {
        if (lesson.id === 1) renderRgbLesson1(lesson);
        else if (lesson.id === 2) renderRgbLesson2(lesson);
        else if (lesson.id === 3) renderRgbLesson3(lesson);
        else if (lesson.id === 4) renderRgbLesson4(lesson);
      } else if (state.activeLab === 'sonar') {
        if (lesson.id === 1) renderSonarLesson1(lesson);
        else if (lesson.id === 2) renderSonarLesson2(lesson);
        else if (lesson.id === 3) renderSonarLesson3(lesson);
        else if (lesson.id === 4) renderSonarLesson4(lesson);
      } else if (state.activeLab === 'ir') {
        if (lesson.id === 1) renderIrLesson1(lesson);
        else if (lesson.id === 2) renderIrLesson2(lesson);
        else if (lesson.id === 3) renderIrLesson3(lesson);
        else if (lesson.id === 4) renderIrLesson4(lesson);
      } else if (state.activeLab === 'cad') {
        if (lesson.id === 1) renderCadLesson1(lesson);
        else if (lesson.id === 2) renderCadLesson2(lesson);
        else if (lesson.id === 3) renderCadLesson3(lesson);
        else if (lesson.id === 4) renderCadLesson4(lesson);
      } else if (state.activeLab === 'iot') {
        if (lesson.id === 1) renderIotLesson1(lesson);
        else if (lesson.id === 2) renderIotLesson2(lesson);
        else if (lesson.id === 3) renderIotLesson3(lesson);
        else if (lesson.id === 4) renderIotLesson4(lesson);
      } else if (state.activeLab === 'rfid') {
        if (lesson.id === 1) renderRfidLesson1(lesson);
        else if (lesson.id === 2) renderRfidLesson2(lesson);
        else if (lesson.id === 3) renderRfidLesson3(lesson);
        else if (lesson.id === 4) renderRfidLesson4(lesson);
      } else if (state.activeLab === 'imu') {
        if (lesson.id === 1) renderImuLesson1(lesson);
        else if (lesson.id === 2) renderImuLesson2(lesson);
        else if (lesson.id === 3) renderImuLesson3(lesson);
        else if (lesson.id === 4) renderImuLesson4(lesson);
      } else if (state.activeLab === 'motor') {
        if (lesson.id === 1) renderMotorLesson1(lesson);
        else if (lesson.id === 2) renderMotorLesson2(lesson);
        else if (lesson.id === 3) renderMotorLesson3(lesson);
        else if (lesson.id === 4) renderMotorLesson4(lesson);
      } else if (state.activeLab === 'soil') {
        if (lesson.id === 1) renderSoilLesson1(lesson);
        else if (lesson.id === 2) renderSoilLesson2(lesson);
        else if (lesson.id === 3) renderSoilLesson3(lesson);
        else if (lesson.id === 4) renderSoilLesson4(lesson);
      } else if (state.activeLab === 'oled') {
        if (lesson.id === 1) renderOledLesson1(lesson);
        else if (lesson.id === 2) renderOledLesson2(lesson);
        else if (lesson.id === 3) renderOledLesson3(lesson);
        else if (lesson.id === 4) renderOledLesson4(lesson);
      } else if (state.activeLab === 'gas') {
        if (lesson.id === 1) renderGasLesson1(lesson);
        else if (lesson.id === 2) renderGasLesson2(lesson);
        else if (lesson.id === 3) renderGasLesson3(lesson);
        else if (lesson.id === 4) renderGasLesson4(lesson);
      } else if (state.activeLab === 'dht') {
        if (lesson.id === 1) renderDhtLesson1(lesson);
        else if (lesson.id === 2) renderDhtLesson2(lesson);
        else if (lesson.id === 3) renderDhtLesson3(lesson);
        else if (lesson.id === 4) renderDhtLesson4(lesson);
      } else if (state.activeLab === 'slicer') {
        if (lesson.id === 1) renderSlicerLesson1(lesson);
        else if (lesson.id === 2) renderSlicerLesson2(lesson);
        else if (lesson.id === 3) renderSlicerLesson3(lesson);
        else if (lesson.id === 4) renderSlicerLesson4(lesson);
      } else if (state.activeLab === 'dmm') {
        if (lesson.id === 1) renderDmmLesson1(lesson);
        else if (lesson.id === 2) renderDmmLesson2(lesson);
        else if (lesson.id === 3) renderDmmLesson3(lesson);
        else if (lesson.id === 4) renderDmmLesson4(lesson);
      } else if (state.activeLab === 'lcd') {
        if (lesson.id === 1) renderLcdLesson1(lesson);
        else if (lesson.id === 2) renderLcdLesson2(lesson);
        else if (lesson.id === 3) renderLcdLesson3(lesson);
        else if (lesson.id === 4) renderLcdLesson4(lesson);
      } else if (state.activeLab === 'temp') {
        if (lesson.id === 1) renderTempLesson1(lesson);
        else if (lesson.id === 2) renderTempLesson2(lesson);
        else if (lesson.id === 3) renderTempLesson3(lesson);
        else if (lesson.id === 4) renderTempLesson4(lesson);
      } else {
        if (lesson.id === 1) renderLedLesson1(lesson);
        else if (lesson.id === 2) renderLedLesson2(lesson);
        else if (lesson.id === 3) renderLedLesson3(lesson);
        else if (lesson.id === 4) renderLedLesson4(lesson);
      }
    }

    // -------------------------------------------------------------------------
    // SERVO LESSON 1: Library vs Built-In Sorter
    // -------------------------------------------------------------------------
    function renderServoLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Library Tools vs Built-In Commands</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>
        <div class="sorter-zones">
          <div class="sorter-zone zone-setup" id="zone-lib">
            <div class="zone-header">
              <span class="icon">📚</span>
              <strong>#include &lt;Library&gt;</strong>
              <small>(Needs specialized toolkit)</small>
            </div>
            <div class="zone-slots" id="slots-lib"></div>
          </div>
          <div class="sorter-zone zone-loop" id="zone-builtin">
            <div class="zone-header">
              <span class="icon">🧰</span>
              <strong>Built-In Arduino</strong>
              <small>(Standard commands)</small>
            </div>
            <div class="zone-slots" id="slots-builtin"></div>
          </div>
        </div>
        <div class="sorter-pool" id="sorter-pool">
          ${act.items.map(item => `
            <div class="sorter-item ${state.servoSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-setup" title="Place in Library">Library</button>
                <button class="sort-btn btn-to-loop" title="Place in Built-in">Built-In</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-${item.id}`);
        if (!itemEl) return;
        const btnLib = itemEl.querySelector('.btn-to-setup');
        const btnBuiltin = itemEl.querySelector('.btn-to-loop');

        btnLib.addEventListener('click', () => handleServoSort(item, 'library'));
        btnBuiltin.addEventListener('click', () => handleServoSort(item, 'builtin'));
      });

      refreshServoSortedSlots();
    }

    function handleServoSort(item, chosenZone) {
      if (window.soundEngine) window.soundEngine.playClick();
      const isCorrect = item.target === chosenZone;
      state.servoSortingState[item.id] = { zone: chosenZone, correct: isCorrect, item };

      refreshServoSortedSlots();
      checkServoLesson1Completion();
    }

    function refreshServoSortedSlots() {
      const slotsLib = document.getElementById('slots-lib');
      const slotsBuiltin = document.getElementById('slots-builtin');
      if (!slotsLib || !slotsBuiltin) return;

      slotsLib.innerHTML = '';
      slotsBuiltin.innerHTML = '';

      Object.keys(state.servoSortingState).forEach(id => {
        const s = state.servoSortingState[id];
        const slotEl = document.createElement('div');
        slotEl.className = `sorted-pill ${s.correct ? 'correct' : 'incorrect'}`;
        slotEl.innerHTML = `
        <span>${s.item.text}</span>
        <span class="mark">${s.correct ? '✓' : '✗'}</span>
      `;
        if (s.zone === 'library') {
          slotsLib.appendChild(slotEl);
        } else {
          slotsBuiltin.appendChild(slotEl);
        }

        const poolItem = document.getElementById(`item-${id}`);
        if (poolItem) poolItem.style.display = 'none';
      });
    }

    function checkServoLesson1Completion() {
      const lesson = window.SERVO_LESSONS_DATA[0];
      const totalItems = lesson.sortingActivity.items.length;
      const sortedKeys = Object.keys(state.servoSortingState);

      if (sortedKeys.length === totalItems) {
        const allCorrect = sortedKeys.every(k => state.servoSortingState[k].correct);
        const feedback = document.getElementById('sorter-feedback');
        if (allCorrect) {
          state.servoLesson1Solved = true;
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          feedback.innerHTML = `
          <div class="feedback-success">
            🎉 <strong>Mastered!</strong> You understand why motors need <code>#include &lt;Servo.h&gt;</code> to generate high-speed timer pulses!
            Now press <strong>⚡ Start Simulation</strong> below to see your robotic arm prepare itself!
          </div>
        `;
        } else {
          feedback.innerHTML = `
          <div class="feedback-warning">
            🤔 Almost there! Remember: motor angles and graphical displays need a specialized Library tool, while standard pin toggling is built-in.
            <button class="btn btn-sm btn-outline" id="retry-servo-sort-btn">Reset & Try Again</button>
          </div>
        `;
          document.getElementById('retry-servo-sort-btn').addEventListener('click', () => {
            state.servoSortingState = {};
            renderServoLesson1(lesson);
          });
        }
      }
    }

    // -------------------------------------------------------------------------
    // SERVO LESSON 2: 3-Wire Plug & Attaching Pin ~9
    // -------------------------------------------------------------------------
    function renderServoLesson2(lesson) {
      const isAttached = state.servoAttached;
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Connect the 3-Wire Ribbon & Attach Pin ~9</strong>
        </div>
        <p class="task-desc">
          The servo has 3 wires: <strong>Brown (GND)</strong>, <strong>Red (5V Power)</strong>, and <strong>Orange (PWM Signal)</strong>.
          Click <strong>Pin ~9</strong> on the virtual Arduino board to lock in the control channel!
        </p>

        <div class="pin-claim-controls">
          <div class="pin-status-box ${isAttached ? 'claimed' : 'unclaimed'}">
            <span class="badge">${isAttached ? 'Pin ~9 Attached! 🦾' : 'Pin ~9 Unattached ⏳'}</span>
            <div class="status-desc">
              ${isAttached
          ? `<code>myServo.attach(9);</code> is active! Orange control line is locked to hardware timer channel ~9.`
          : `Click the blinking Pin ~9 socket on the Arduino Uno board (or click the button below)!`}
            </div>
          </div>
          <div class="role-selector">
            <button class="btn role-btn ${isAttached ? 'active' : ''}" id="btn-attach-pin9">
              🔌 ${isAttached ? 'Signal Attached to Pin ~9 ✓' : 'Click to Attach Pin ~9 (myServo.attach(9))'}
            </button>
          </div>
        </div>
        <div id="servo-attach-feedback"></div>
      </div>
    `;

      const btnAttach = document.getElementById('btn-attach-pin9');
      if (btnAttach) {
        btnAttach.addEventListener('click', () => {
          handlePin9Attach();
        });
      }

      // Highlight Pin 9 header socket
      highlightPin9Header(!isAttached);
    }

    function handlePin9Attach() {
      state.servoAttached = true;
      window.circuitSimulation.attachServoPin(9);
      if (window.soundEngine) window.soundEngine.playSuccess();
      launchConfetti();

      renderServoLesson2(window.SERVO_LESSONS_DATA[1]);
      renderCodeTranslator(window.SERVO_LESSONS_DATA[1]);

      const feedback = document.getElementById('servo-attach-feedback');
      if (feedback) {
        feedback.innerHTML = `
        <div class="feedback-success">
          🎉 <strong>Pin ~9 Locked In!</strong> You just executed <code>myServo.attach(9);</code>.
          Notice how the C++ translator on the right updated. Now press <strong>⚡ Start Simulation</strong> to stream 50Hz pulses!
        </div>
      `;
      }
      highlightPin9Header(false);
    }

    // Interactive Click on Pin 9 Header Socket
    if (unoPin9Header) {
      unoPin9Header.addEventListener('click', () => {
        if (state.activeLab === 'servo' && state.activeLessonIndex === 1) {
          handlePin9Attach();
        }
      });
    }

    function highlightPin9Header(enable) {
      if (unoPin9Header) {
        unoPin9Header.classList.toggle('pulse-target', enable);
      }
    }

    // -------------------------------------------------------------------------
    // SERVO LESSON 3: Direct Angle Commands & Protractor Slider
    // -------------------------------------------------------------------------
    function renderServoLesson3(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Steering Wheel: Command Exact Angles (0° to 180°)</strong>
        </div>
        <p class="task-desc">
          Drag the angle slider below or click the quick presets. Watch the physical servo horn swing live on the protractor dial!
        </p>

        <div class="angle-slider-wrapper">
          <div class="angle-dial-header">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Current Commanded Angle:</span>
              <div style="font-size: 1.15rem; font-weight: 700; color: #fff;">myServo.write(<span id="label-cur-angle">${state.servoAngle1}</span>);</div>
            </div>
            <div class="angle-badge-large" id="badge-cur-angle">${state.servoAngle1}°</div>
          </div>

          <input type="range" class="angle-range-slider" id="angle-live-slider" min="0" max="180" step="1" value="${state.servoAngle1}" />

          <div style="display: flex; justify-content: space-between; font-family: var(--font-code); font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            <span>0° (1.0ms - Left)</span>
            <span>90° (1.5ms - Center)</span>
            <span>180° (2.0ms - Right)</span>
          </div>

          <div class="angle-presets-grid" style="margin-top: 1rem;">
            ${lesson.presets.map((p, idx) => `
              <button class="angle-preset-btn ${idx === 0 ? 'active' : ''}" data-a1="${p.a1}" data-a2="${p.a2}" data-delay="${p.delay}">
                <span>${p.name}</span>
                <small>write(${p.a1})</small>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

      const slider = document.getElementById('angle-live-slider');
      const labelAngle = document.getElementById('label-cur-angle');
      const badgeAngle = document.getElementById('badge-cur-angle');

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value);
          state.servoAngle1 = val;
          labelAngle.textContent = val;
          badgeAngle.textContent = `${val}°`;
          window.circuitSimulation.setServoAngle(val, true);
          window.circuitSimulation.setServoAngles(val, state.servoAngle2, state.servoDelay);
          renderCodeTranslator(lesson);
        });
      }

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const a1 = parseInt(btn.getAttribute('data-a1'));
          const a2 = parseInt(btn.getAttribute('data-a2'));
          const del = parseInt(btn.getAttribute('data-delay'));

          state.servoAngle1 = a1;
          state.servoAngle2 = a2;
          state.servoDelay = del;

          slider.value = a1;
          labelAngle.textContent = a1;
          badgeAngle.textContent = `${a1}°`;

          window.circuitSimulation.setServoAngles(a1, a2, del);
          window.circuitSimulation.setServoAngle(a1, true);
          renderCodeTranslator(lesson);
        });
      });
    }

    // -------------------------------------------------------------------------
    // SERVO LESSON 4: 180° Sweep Dance & Sandbox
    // -------------------------------------------------------------------------
    function renderServoLesson4(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Robotics Preset Studio: Smooth Sweeps & Grippers</strong>
        </div>
        <p class="task-desc">
          Choose a robotics application below, then press <strong>⚡ Start Simulation</strong> to watch the servo smoothly travel with 15ms step timing!
        </p>

        <div class="angle-presets-grid">
          ${lesson.presets.map((p, idx) => `
            <button class="angle-preset-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
              <span>${p.name}</span>
              <small>${p.type === 'sweep' ? 'for (pos=0..180)' : `${p.a1}° ↔ ${p.a2}°`}</small>
            </button>
          `).join('')}
        </div>
      </div>
    `;

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (window.soundEngine) window.soundEngine.playClick();

          const idx = parseInt(btn.getAttribute('data-idx'));
          const preset = lesson.presets[idx];
          window.circuitSimulation.setServoPreset(preset);
        });
      });
    }


    // =========================================================================
    // POTENTIOMETER LAB INTERACTIVE TASKS
    // =========================================================================

    // -------------------------------------------------------------------------
    // POT LESSON 1: Digital Switch vs Analog Dial Sorter
    // -------------------------------------------------------------------------
    function renderPotLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Digital Switch vs. Analog Spectrum</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>
        <div class="sorter-zones">
          <div class="sorter-zone zone-setup" id="zone-digital">
            <div class="zone-header">
              <span class="icon">💡</span>
              <strong>Digital (Strictly ON/OFF)</strong>
              <small>(Only 2 states: 0 or 1)</small>
            </div>
            <div class="zone-slots" id="slots-digital"></div>
          </div>
          <div class="sorter-zone zone-loop" id="zone-analog">
            <div class="zone-header">
              <span class="icon">🎛️</span>
              <strong>Analog (Continuous Spectrum)</strong>
              <small>(Smooth range of 1,024 values)</small>
            </div>
            <div class="zone-slots" id="slots-analog"></div>
          </div>
        </div>
        <div class="sorter-pool" id="sorter-pool-pot">
          ${act.items.map(item => `
            <div class="sorter-item ${state.potSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-pot-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-digital" title="Place in Digital">Digital</button>
                <button class="sort-btn btn-to-analog" title="Place in Analog">Analog</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback-pot"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-pot-${item.id}`);
        if (!itemEl) return;
        const btnDig = itemEl.querySelector('.btn-to-digital');
        const btnAna = itemEl.querySelector('.btn-to-analog');

        btnDig.addEventListener('click', () => handlePotSort(item, 'digital'));
        btnAna.addEventListener('click', () => handlePotSort(item, 'analog'));
      });

      refreshPotSortedSlots();
    }

    function handlePotSort(item, chosenZone) {
      if (window.soundEngine) window.soundEngine.playClick();
      const isCorrect = item.target === chosenZone;
      state.potSortingState[item.id] = { zone: chosenZone, correct: isCorrect, item };

      refreshPotSortedSlots();
      checkPotLesson1Completion();
    }

    function refreshPotSortedSlots() {
      const slotsDig = document.getElementById('slots-digital');
      const slotsAna = document.getElementById('slots-analog');
      if (!slotsDig || !slotsAna) return;

      slotsDig.innerHTML = '';
      slotsAna.innerHTML = '';

      Object.keys(state.potSortingState).forEach(id => {
        const s = state.potSortingState[id];
        const slotEl = document.createElement('div');
        slotEl.className = `sorted-pill ${s.correct ? 'correct' : 'incorrect'}`;
        slotEl.innerHTML = `
        <span>${s.item.text}</span>
        <span class="mark">${s.correct ? '✓' : '✗'}</span>
      `;
        if (s.zone === 'digital') {
          slotsDig.appendChild(slotEl);
        } else {
          slotsAna.appendChild(slotEl);
        }

        const poolItem = document.getElementById(`item-pot-${id}`);
        if (poolItem) poolItem.style.display = 'none';
      });
    }

    function checkPotLesson1Completion() {
      const lesson = window.POT_LESSONS_DATA[0];
      const totalItems = lesson.sortingActivity.items.length;
      const sortedKeys = Object.keys(state.potSortingState);

      if (sortedKeys.length === totalItems) {
        const allCorrect = sortedKeys.every(k => state.potSortingState[k].correct);
        const feedback = document.getElementById('sorter-feedback-pot');
        if (allCorrect) {
          state.potLesson1Solved = true;
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          feedback.innerHTML = `
          <div class="feedback-success">
            🎉 <strong>Mastered!</strong> You clearly distinguish between binary digital states and smooth analog spectrums!
            Press <strong>⚡ Start Simulation</strong> below to see Arduino's 10-bit ADC ruler in action!
          </div>
        `;
        } else {
          feedback.innerHTML = `
          <div class="feedback-warning">
            🤔 Almost there! Remember: simple switches only have two positions (ON/OFF), while knobs, dials, and thermometers glide through continuous values.
            <button class="btn btn-sm btn-outline" id="retry-pot-sort-btn">Reset & Try Again</button>
          </div>
        `;
          document.getElementById('retry-pot-sort-btn').addEventListener('click', () => {
            state.potSortingState = {};
            renderPotLesson1(lesson);
          });
        }
      }
    }

    // -------------------------------------------------------------------------
    // POT LESSON 2: 3-Pin Potentiometer & Voltage Ruler
    // -------------------------------------------------------------------------
    function renderPotLesson2(lesson) {
      const isConn = state.potConnected;
      const currentVolts = ((state.potVal * 5.0) / 1023.0).toFixed(2);

      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Connect the Wiper & Read the Voltage Ruler</strong>
        </div>
        <p class="task-desc">
          The potentiometer has 3 legs: <strong>5V Power (Leg 1)</strong>, <strong>Ground GND (Leg 3)</strong>, and the <strong>Middle Wiper (Leg 2)</strong>.
          Make sure the cyan Wiper line is attached to <strong>Analog Pin A0</strong>!
        </p>

        <div class="pin-claim-controls">
          <div class="pin-status-box ${isConn ? 'claimed' : 'unclaimed'}">
            <span class="badge">${isConn ? 'Wiper Connected to Pin A0! 🔌' : 'Wiper Disconnected ⏳'}</span>
            <div class="status-desc">
              ${isConn
          ? `<code>analogRead(A0);</code> is reading the resistive voltage divider smoothly.`
          : `Click the button below to connect the Middle Wiper to Pin A0!`}
            </div>
          </div>
          <div class="role-selector">
            <button class="btn role-btn ${isConn ? 'active' : ''}" id="btn-toggle-wiper">
              🔌 ${isConn ? 'Wiper Wired to Pin A0 ✓' : 'Click to Wire Wiper to Pin A0'}
            </button>
          </div>
        </div>

        <div class="angle-slider-wrapper" style="margin-top: 1.25rem;">
          <div class="angle-dial-header">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Analog ADC Reading (0 to 1023):</span>
              <div style="font-size: 1.15rem; font-weight: 700; color: #38bdf8;">
                analogRead(A0) = <span id="label-pot-val">${state.potVal}</span>
              </div>
            </div>
            <div class="angle-badge-large" id="badge-pot-volts" style="background: rgba(2, 132, 199, 0.2); border-color: #38bdf8; color: #38bdf8;">
              ${currentVolts} V
            </div>
          </div>

          <input type="range" class="angle-range-slider" id="pot-interactive-slider" min="0" max="1023" step="1" value="${state.potVal}" />

          <div style="display: flex; justify-content: space-between; font-family: var(--font-code); font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            <span>0 (0.0V - Left)</span>
            <span>512 (2.5V - Center)</span>
            <span>1023 (5.0V - Right)</span>
          </div>

          <div class="code-preview-box" style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(15,23,42,0.6); border-radius: 8px; border: 1px solid #334155; font-family: var(--font-code); font-size: 0.82rem;">
            <div style="color: var(--text-muted);">// Live Arduino C++ Calculation:</div>
            <div style="color: #f8fafc; margin-top: 4px;">
              <span style="color: #60a5fa;">float</span> volts = (<span id="math-pot-val" style="color: #38bdf8; font-weight: 700;">${state.potVal}</span> * <span style="color: #f59e0b;">5.0</span>) / <span style="color: #f59e0b;">1023.0</span>; 
              <span style="color: #34d399; font-weight: 700;">// -> <span id="math-volts-result">${currentVolts}</span> V</span>
            </div>
          </div>
        </div>
      </div>
    `;

      const btnWiper = document.getElementById('btn-toggle-wiper');
      if (btnWiper) {
        btnWiper.addEventListener('click', () => {
          state.potConnected = !state.potConnected;
          window.circuitSimulation.connectPotWiper(state.potConnected);
          renderPotLesson2(lesson);
        });
      }

      const slider = document.getElementById('pot-interactive-slider');
      const labelVal = document.getElementById('label-pot-val');
      const badgeVolts = document.getElementById('badge-pot-volts');
      const mathVal = document.getElementById('math-pot-val');
      const mathResult = document.getElementById('math-volts-result');

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value);
          state.potVal = val;
          const v = ((val * 5.0) / 1023.0).toFixed(2);
          if (labelVal) labelVal.textContent = val;
          if (badgeVolts) badgeVolts.textContent = `${v} V`;
          if (mathVal) mathVal.textContent = val;
          if (mathResult) mathResult.textContent = v;

          window.circuitSimulation.setPotValue(val, true);
        });
      }
    }

    // -------------------------------------------------------------------------
    // POT LESSON 3: The map() Function (Number Translator)
    // -------------------------------------------------------------------------
    function renderPotLesson3(lesson) {
      const angle = Math.round((state.potVal / 1023.0) * 180.0);

      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Translator: map(sensorVal, 0, 1023, 0, 180)</strong>
        </div>
        <p class="task-desc">
          Our potentiometer speaks <strong>0 to 1023</strong>, but our servo only understands <strong>0 to 180 degrees</strong>!
          Test the linear number translator below to see how math bridges sensors to motors.
        </p>

        <div class="angle-slider-wrapper">
          <div class="angle-dial-header">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Sensor Input Range (0 to 1023):</span>
              <div style="font-size: 1.15rem; font-weight: 700; color: #38bdf8;">
                val = <span id="label-map-val">${state.potVal}</span>
              </div>
            </div>
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Motor Output Angle (0 to 180°):</span>
              <div class="angle-badge-large" id="badge-map-angle" style="margin-top: 4px;">
                ${angle}°
              </div>
            </div>
          </div>

          <input type="range" class="angle-range-slider" id="map-interactive-slider" min="0" max="1023" step="1" value="${state.potVal}" />

          <div style="display: flex; justify-content: space-between; font-family: var(--font-code); font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            <span>0 ➔ 0°</span>
            <span>256 ➔ 45°</span>
            <span>512 ➔ 90°</span>
            <span>768 ➔ 135°</span>
            <span>1023 ➔ 180°</span>
          </div>

          <!-- Formula Graphic Card -->
          <div style="margin-top: 1.25rem; padding: 1rem; background: rgba(15,23,42,0.8); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.5rem;">
              🗺️ Arduino map() Formula Execution:
            </div>
            <div style="font-family: var(--font-code); font-size: 0.95rem; color: #f8fafc;">
              int angle = map(<span id="formula-val" style="color: #38bdf8; font-weight: 700;">${state.potVal}</span>, <span style="color: #f59e0b;">0</span>, <span style="color: #f59e0b;">1023</span>, <span style="color: #ec4899;">0</span>, <span style="color: #ec4899;">180</span>);
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
              = (<span id="formula-ratio" style="color: #fff;">${(state.potVal / 1023.0).toFixed(3)}</span> of full range) × 180° = <strong id="formula-result" style="color: #fbbf24;">${angle}°</strong>
            </div>
          </div>

          <!-- Quick Test Bench Buttons -->
          <div class="angle-presets-grid" style="margin-top: 1rem;">
            <button class="angle-preset-btn" data-v="0"><span>Left Lock</span><small>0 ➔ 0°</small></button>
            <button class="angle-preset-btn" data-v="256"><span>Quarter</span><small>256 ➔ 45°</small></button>
            <button class="angle-preset-btn active" data-v="512"><span>Center</span><small>512 ➔ 90°</small></button>
            <button class="angle-preset-btn" data-v="768"><span>Three-Quarters</span><small>768 ➔ 135°</small></button>
            <button class="angle-preset-btn" data-v="1023"><span>Right Lock</span><small>1023 ➔ 180°</small></button>
          </div>
        </div>
      </div>
    `;

      const slider = document.getElementById('map-interactive-slider');
      const labelVal = document.getElementById('label-map-val');
      const badgeAngle = document.getElementById('badge-map-angle');
      const formulaVal = document.getElementById('formula-val');
      const formulaRatio = document.getElementById('formula-ratio');
      const formulaResult = document.getElementById('formula-result');

      function applyVal(v) {
        state.potVal = v;
        const deg = Math.round((v / 1023.0) * 180.0);
        if (labelVal) labelVal.textContent = v;
        if (badgeAngle) badgeAngle.textContent = `${deg}°`;
        if (formulaVal) formulaVal.textContent = v;
        if (formulaRatio) formulaRatio.textContent = (v / 1023.0).toFixed(3);
        if (formulaResult) formulaResult.textContent = `${deg}°`;
        if (slider) slider.value = v;

        window.circuitSimulation.setPotValue(v, true);
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          applyVal(parseInt(e.target.value));
        });
      }

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const v = parseInt(btn.getAttribute('data-v'));
          applyVal(v);
        });
      });
    }

    // -------------------------------------------------------------------------
    // POT LESSON 4: Robotic Steering Studio (Knob-to-Servo Live)
    // -------------------------------------------------------------------------
    function renderPotLesson4(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Robotic Steering Studio: Live Drive-by-Wire Control</strong>
        </div>
        <p class="task-desc">
          Rotate the virtual 10k potentiometer dial with your mouse or drag the steering slider below.
          Watch the SG90 micro servo arm dynamically mirror your hand movements in real-time!
        </p>

        <div class="angle-slider-wrapper">
          <div class="angle-dial-header">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Knob Voltage & Angle:</span>
              <div style="font-size: 1.15rem; font-weight: 700; color: #38bdf8;">
                Pot: <span id="label-studio-pot">${state.potVal}</span> (<span id="label-studio-volts">${((state.potVal * 5.0) / 1023.0).toFixed(2)}V</span>)
              </div>
            </div>
            <div class="angle-badge-large" id="badge-studio-angle">
              ${Math.round((state.potVal / 1023.0) * 180.0)}°
            </div>
          </div>

          <input type="range" class="angle-range-slider" id="studio-steering-slider" min="0" max="1023" step="1" value="${state.potVal}" />

          <div style="display: flex; justify-content: space-between; font-family: var(--font-code); font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            <span>0 (0V / 0° Left)</span>
            <span>512 (2.5V / 90° Center)</span>
            <span>1023 (5V / 180° Right)</span>
          </div>

          <div class="angle-presets-grid" style="margin-top: 1.25rem;">
            ${lesson.presets.map((p, idx) => `
              <button class="angle-preset-btn ${idx === 2 ? 'active' : ''}" data-val="${p.potVal}">
                <span>${p.name}</span>
                <small>${p.angle}° Target</small>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

      const slider = document.getElementById('studio-steering-slider');
      const labelPot = document.getElementById('label-studio-pot');
      const labelVolts = document.getElementById('label-studio-volts');
      const badgeAngle = document.getElementById('badge-studio-angle');

      function applyStudioVal(v) {
        state.potVal = v;
        const deg = Math.round((v / 1023.0) * 180.0);
        const volts = ((v * 5.0) / 1023.0).toFixed(2);
        if (labelPot) labelPot.textContent = v;
        if (labelVolts) labelVolts.textContent = `${volts}V`;
        if (badgeAngle) badgeAngle.textContent = `${deg}°`;
        if (slider) slider.value = v;

        window.circuitSimulation.setPotValue(v, true);
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          applyStudioVal(parseInt(e.target.value));
        });
      }

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const v = parseInt(btn.getAttribute('data-val'));
          applyStudioVal(v);
        });
      });
    }

    // =========================================================================
    // PUSHBUTTON LAB INTERACTIVE TASKS
    // =========================================================================

    // -------------------------------------------------------------------------
    // BUTTON LESSON 1: Inputs vs Outputs Sorter
    // -------------------------------------------------------------------------
    function renderButtonLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Inputs (Sensors) vs. Outputs (Actuators)</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>
        <div class="sorter-zones">
          <div class="sorter-zone zone-setup" id="zone-input">
            <div class="zone-header">
              <span class="icon">👁️</span>
              <strong>INPUTS (Sensors)</strong>
              <small>(Observes the world)</small>
            </div>
            <div class="zone-slots" id="slots-input"></div>
          </div>
          <div class="sorter-zone zone-loop" id="zone-output">
            <div class="zone-header">
              <span class="icon">🦾</span>
              <strong>OUTPUTS (Actuators)</strong>
              <small>(Takes physical action)</small>
            </div>
            <div class="zone-slots" id="slots-output"></div>
          </div>
        </div>
        <div class="sorter-pool" id="sorter-pool-btn">
          ${act.items.map(item => `
            <div class="sorter-item ${state.buttonSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-btn-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-input" title="Place in Input">Input</button>
                <button class="sort-btn btn-to-output" title="Place in Output">Output</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback-btn"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-btn-${item.id}`);
        if (!itemEl) return;
        const btnIn = itemEl.querySelector('.btn-to-input');
        const btnOut = itemEl.querySelector('.btn-to-output');

        btnIn.addEventListener('click', () => handleButtonSort(item, 'input'));
        btnOut.addEventListener('click', () => handleButtonSort(item, 'output'));
      });

      refreshButtonSortedSlots();
    }

    function handleButtonSort(item, chosenZone) {
      if (window.soundEngine) window.soundEngine.playClick();
      const isCorrect = item.target === chosenZone;
      state.buttonSortingState[item.id] = { zone: chosenZone, correct: isCorrect, item };

      refreshButtonSortedSlots();
      checkButtonLesson1Completion();
    }

    function refreshButtonSortedSlots() {
      const slotsIn = document.getElementById('slots-input');
      const slotsOut = document.getElementById('slots-output');
      if (!slotsIn || !slotsOut) return;

      slotsIn.innerHTML = '';
      slotsOut.innerHTML = '';

      Object.keys(state.buttonSortingState).forEach(id => {
        const s = state.buttonSortingState[id];
        const slotEl = document.createElement('div');
        slotEl.className = `sorted-pill ${s.correct ? 'correct' : 'incorrect'}`;
        slotEl.innerHTML = `
        <span>${s.item.text}</span>
        <span class="mark">${s.correct ? '✓' : '✗'}</span>
      `;
        if (s.zone === 'input') {
          slotsIn.appendChild(slotEl);
        } else {
          slotsOut.appendChild(slotEl);
        }

        const poolItem = document.getElementById(`item-btn-${id}`);
        if (poolItem) poolItem.style.display = 'none';
      });
    }

    function checkButtonLesson1Completion() {
      const lesson = window.BUTTON_LESSONS_DATA[0];
      const totalItems = lesson.sortingActivity.items.length;
      const sortedKeys = Object.keys(state.buttonSortingState);

      if (sortedKeys.length === totalItems) {
        const allCorrect = sortedKeys.every(k => state.buttonSortingState[k].correct);
        const feedback = document.getElementById('sorter-feedback-btn');
        if (allCorrect) {
          state.buttonLesson1Solved = true;
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          feedback.innerHTML = `
          <div class="feedback-success">
            🎉 <strong>Mastered!</strong> You clearly understand the Input-Processing-Output (IPO) architecture of computing!
            Press <strong>⚡ Start Simulation</strong> below to see digitalRead(2) monitor the tactile button!
          </div>
        `;
        } else {
          feedback.innerHTML = `
          <div class="feedback-warning">
            🤔 Almost there! Remember: sensors (buttons, thermometers) collect data into the Arduino (Inputs), while actuators (LEDs, buzzers, motors) make changes in the room (Outputs).
            <button class="btn btn-sm btn-outline" id="retry-btn-sort">Reset & Try Again</button>
          </div>
        `;
          document.getElementById('retry-btn-sort').addEventListener('click', () => {
            state.buttonSortingState = {};
            renderButtonLesson1(lesson);
          });
        }
      }
    }

    // -------------------------------------------------------------------------
    // BUTTON LESSON 2: Floating Pins & INPUT_PULLUP
    // -------------------------------------------------------------------------
    function renderButtonLesson2(lesson) {
      const isArmed = state.buttonConfigured;

      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Experiment: Floating Ghost Pin vs. INPUT_PULLUP Spring</strong>
        </div>
        <p class="task-desc">
          Without an internal pullup resistor, an open wire acts like an antenna and catches ghost static electricity!
          Arm <strong>pinMode(2, INPUT_PULLUP)</strong> to connect an invisible internal spring holding Pin 2 at 5V.
        </p>

        <div class="pin-claim-controls">
          <div class="pin-status-box ${isArmed ? 'claimed' : 'unclaimed'}">
            <span class="badge">${isArmed ? 'INPUT_PULLUP Armed! 🧲' : 'Floating Pin (Ghost Static!) 👻'}</span>
            <div class="status-desc">
              ${isArmed
          ? `Internal 20kΩ resistor is pulling Pin 2 stably to +5V (HIGH). Pressing button cleanly pulls to GND (LOW).`
          : `Pin 2 is disconnected in the air! Static electricity makes the signal flutter randomly between 0 and 1.`}
            </div>
          </div>
          <div class="role-selector">
            <button class="btn role-btn ${isArmed ? 'active' : ''}" id="btn-toggle-pullup">
              🧲 ${isArmed ? 'INPUT_PULLUP Active (Steady 5V)' : 'Click to Arm pinMode(2, INPUT_PULLUP)'}
            </button>
          </div>
        </div>

        <!-- Interactive Click-and-Hold Button -->
        <div style="margin-top: 1.5rem; text-align: center;">
          <button class="interactive-big-btn" id="btn-test-pullup-press">
            <span>🔘</span>
            <div style="margin-top: 4px; font-size: 0.95rem; font-weight: 700;">PUSH & HOLD TACTILE BUTTON</div>
            <small style="color: var(--text-muted); font-size: 0.75rem;">(Connects Pin 2 to GND)</small>
          </button>
          <div style="margin-top: 0.75rem; font-family: var(--font-code); font-size: 0.85rem; color: #38bdf8;">
            Pin 2 State: <span id="pullup-live-state" style="font-weight: 700; color: #fbbf24;">HIGH (5V)</span>
          </div>
        </div>
      </div>
    `;

      const btnPullup = document.getElementById('btn-toggle-pullup');
      if (btnPullup) {
        btnPullup.addEventListener('click', () => {
          state.buttonConfigured = !state.buttonConfigured;
          window.circuitSimulation.configureButtonPin(state.buttonConfigured);
          renderButtonLesson2(lesson);
        });
      }

      const testBtn = document.getElementById('btn-test-pullup-press');
      const liveState = document.getElementById('pullup-live-state');

      if (testBtn) {
        const pressDown = (e) => {
          e.preventDefault();
          testBtn.classList.add('pressed');
          if (liveState) liveState.textContent = 'LOW (0V - Connected to GND!)';
          window.circuitSimulation.setButtonPressed(true);
        };
        const releaseUp = (e) => {
          e.preventDefault();
          testBtn.classList.remove('pressed');
          if (liveState) liveState.textContent = 'HIGH (5V - Pulled up by spring)';
          window.circuitSimulation.setButtonPressed(false);
        };

        testBtn.addEventListener('mousedown', pressDown);
        testBtn.addEventListener('mouseup', releaseUp);
        testBtn.addEventListener('mouseleave', releaseUp);
        testBtn.addEventListener('touchstart', pressDown);
        testBtn.addEventListener('touchend', releaseUp);
      }
    }

    // -------------------------------------------------------------------------
    // BUTTON LESSON 3: The Doorbell Logic (if / else)
    // -------------------------------------------------------------------------
    function renderButtonLesson3(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Doorbell: Press & Hold to Complete Circuit</strong>
        </div>
        <p class="task-desc">
          When you press the doorbell button, Pin 2 drops to <strong>LOW</strong>.
          The <code>if (button == LOW)</code> condition turns TRUE and activates the Pin 13 LED light!
        </p>

        <div style="text-align: center; margin: 1.5rem 0;">
          <button class="interactive-big-btn" id="doorbell-tactile-btn">
            <span style="font-size: 2.2rem;">🔔</span>
            <div style="font-size: 1.1rem; font-weight: 800; margin-top: 4px;">PRESS & HOLD DOORBELL</div>
            <small style="color: var(--text-muted); font-size: 0.8rem;">Hold mouse button down to ring!</small>
          </button>
        </div>

        <!-- Conditional Trace Box -->
        <div style="padding: 1rem; background: rgba(15,23,42,0.85); border-radius: 8px; border: 1px solid #334155; font-family: var(--font-code); font-size: 0.85rem;">
          <div style="color: var(--text-muted); margin-bottom: 6px;">// Live Conditional Branch Evaluation:</div>
          <div id="code-branch-if" style="padding: 4px 8px; border-radius: 4px; transition: background 0.15s ease;">
            <span style="color: #c084fc; font-weight: 700;">if</span> (button == <span style="color: #fbbf24;">LOW</span>) { <span style="color: #34d399;">digitalWrite(13, HIGH);</span> } <span id="tag-if-status" style="color: #64748b; font-size: 0.75rem;">// (FALSE - Doorbell Released)</span>
          </div>
          <div id="code-branch-else" style="padding: 4px 8px; border-radius: 4px; transition: background 0.15s ease; background: rgba(56, 189, 248, 0.15);">
            <span style="color: #c084fc; font-weight: 700;">else</span> { <span style="color: #f87171;">digitalWrite(13, LOW);</span> } <span id="tag-else-status" style="color: #38bdf8; font-weight: 700; font-size: 0.75rem;">// [ACTIVE BRANCH]</span>
          </div>
        </div>
      </div>
    `;

      const bellBtn = document.getElementById('doorbell-tactile-btn');
      const branchIf = document.getElementById('code-branch-if');
      const branchElse = document.getElementById('code-branch-else');
      const tagIf = document.getElementById('tag-if-status');
      const tagElse = document.getElementById('tag-else-status');

      function updateBranchUI(isPressed) {
        if (isPressed) {
          branchIf.style.background = 'rgba(52, 211, 153, 0.25)';
          branchElse.style.background = 'transparent';
          tagIf.innerHTML = '<strong style="color: #34d399;">// [TRUE! DOORBELL PRESSED -> LIGHT ON 💡]</strong>';
          tagElse.innerHTML = '<span style="color: #64748b;">// (Skipped)</span>';
        } else {
          branchIf.style.background = 'transparent';
          branchElse.style.background = 'rgba(56, 189, 248, 0.15)';
          tagIf.innerHTML = '<span style="color: #64748b;">// (FALSE - Doorbell Released)</span>';
          tagElse.innerHTML = '<span style="color: #38bdf8; font-weight: 700;">// [ACTIVE BRANCH - LIGHT OFF]</span>';
        }
      }

      if (bellBtn) {
        const pressDown = (e) => {
          e.preventDefault();
          bellBtn.classList.add('pressed');
          updateBranchUI(true);
          window.circuitSimulation.setButtonPressed(true);
        };
        const releaseUp = (e) => {
          e.preventDefault();
          bellBtn.classList.remove('pressed');
          updateBranchUI(false);
          window.circuitSimulation.setButtonPressed(false);
        };

        bellBtn.addEventListener('mousedown', pressDown);
        bellBtn.addEventListener('mouseup', releaseUp);
        bellBtn.addEventListener('mouseleave', releaseUp);
        bellBtn.addEventListener('touchstart', pressDown);
        bellBtn.addEventListener('touchend', releaseUp);
      }
    }

    // -------------------------------------------------------------------------
    // BUTTON LESSON 4: The Smart Light Toggle Switch (State Memory)
    // -------------------------------------------------------------------------
    function renderButtonLesson4(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Smart Switch Studio: Tap-to-Toggle with Boolean Memory</strong>
        </div>
        <p class="task-desc">
          Instead of holding the button down forever, smart home devices remember their state!
          Click the push button below to toggle the light <strong>ON</strong> and <strong>OFF</strong>.
        </p>

        <!-- Mode Presets -->
        <div class="angle-presets-grid" style="margin-bottom: 1.25rem;">
          ${lesson.presets.map((p, idx) => `
            <button class="angle-preset-btn ${idx === 1 ? 'active' : ''}" data-mode="${p.mode}">
              <span>${p.name}</span>
              <small>${p.text}</small>
            </button>
          `).join('')}
        </div>

        <div style="text-align: center; margin: 1.5rem 0;">
          <button class="interactive-big-btn" id="smart-toggle-btn">
            <span style="font-size: 2.2rem;">💡</span>
            <div style="font-size: 1.1rem; font-weight: 800; margin-top: 4px;" id="toggle-btn-label">TAP TO TOGGLE SMART LIGHT</div>
            <small style="color: var(--text-muted); font-size: 0.8rem;">Every tap flips the memory flag</small>
          </button>
        </div>

        <!-- State Variable Visualizer -->
        <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; padding: 1rem; background: rgba(15,23,42,0.8); border: 1px solid #334155; border-radius: 8px;">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">State Variable:</span>
            <div style="font-family: var(--font-code); font-size: 1.1rem; font-weight: 700; color: #fff;">
              bool ledState = <span id="val-led-state" style="color: #f87171;">false</span>;
            </div>
          </div>
          <div style="font-size: 1.5rem; color: #64748b;">➔</div>
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Pin 13 LED:</span>
            <div class="angle-badge-large" id="badge-toggle-led" style="background: rgba(15,23,42,0.7); border-color: #64748b; color: #94a3b8;">
              OFF
            </div>
          </div>
        </div>
      </div>
    `;

      const toggleBtn = document.getElementById('smart-toggle-btn');
      const valState = document.getElementById('val-led-state');
      const badgeLed = document.getElementById('badge-toggle-led');

      function updateToggleUI() {
        const isOn = window.circuitSimulation.buttonLedState;
        if (valState) {
          valState.textContent = isOn ? 'true' : 'false';
          valState.style.color = isOn ? '#34d399' : '#f87171';
        }
        if (badgeLed) {
          badgeLed.textContent = isOn ? 'ON 💡' : 'OFF';
          badgeLed.style.borderColor = isOn ? '#ef4444' : '#64748b';
          badgeLed.style.color = isOn ? '#fca5a5' : '#94a3b8';
          badgeLed.style.background = isOn ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15,23,42,0.7)';
        }
      }

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          // Debounce simulation: click momentarily presses and releases
          window.circuitSimulation.setButtonPressed(true);
          updateToggleUI();
          setTimeout(() => {
            window.circuitSimulation.setButtonPressed(false);
            updateToggleUI();
          }, 150);
        });
      }

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mode = btn.getAttribute('data-mode');
          window.circuitSimulation.buttonMode = mode;
          state.buttonMode = mode;
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      // Default to toggle mode for Lesson 4
      window.circuitSimulation.buttonMode = 'toggle';
      state.buttonMode = 'toggle';
    }

    // =========================================================================
    // PIEZO BUZZER LAB INTERACTIVE TASKS (Lab 5)
    // =========================================================================

    // -------------------------------------------------------------------------
    // BUZZER LESSON 1: Sound Waves & Frequency Spectrum Sorter (Bass / Mid / Treble)
    // -------------------------------------------------------------------------
    function renderBuzzerLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Sound Waves & Frequency Spectrum (Hz)</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>

        <!-- Live Audio Tone Previews -->
        <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;">
          <button class="angle-preset-btn" id="btn-preview-bass" title="Click to hear 80 Hz Low Bass">
            <span>🔊 80 Hz</span>
            <small>Deep Bass Hum</small>
          </button>
          <button class="angle-preset-btn" id="btn-preview-mid" title="Click to hear 440 Hz Concert A">
            <span>🎵 440 Hz</span>
            <small>Concert A Mid</small>
          </button>
          <button class="angle-preset-btn" id="btn-preview-treble" title="Click to hear 3500 Hz High Pitch">
            <span>🚨 3500 Hz</span>
            <small>Piercing Treble</small>
          </button>
        </div>

        <div class="sorter-zones" style="grid-template-columns: repeat(3, 1fr);">
          <div class="sorter-zone" id="zone-bass" style="border-color: #3b82f6;">
            <div class="zone-header">
              <span class="icon">🎸</span>
              <strong>BASS (Low)</strong>
              <small>20 Hz – 250 Hz</small>
            </div>
            <div class="zone-slots" id="slots-bass"></div>
          </div>
          <div class="sorter-zone" id="zone-mid" style="border-color: #10b981;">
            <div class="zone-header">
              <span class="icon">🗣️</span>
              <strong>MID (Vocal)</strong>
              <small>250 Hz – 2,000 Hz</small>
            </div>
            <div class="zone-slots" id="slots-mid"></div>
          </div>
          <div class="sorter-zone" id="zone-treble" style="border-color: #f59e0b;">
            <div class="zone-header">
              <span class="icon">🚨</span>
              <strong>TREBLE (High)</strong>
              <small>2,000 Hz – 8,000 Hz</small>
            </div>
            <div class="zone-slots" id="slots-treble"></div>
          </div>
        </div>

        <div class="sorter-pool" id="sorter-pool-buzzer">
          ${act.items.map(item => `
            <div class="sorter-item ${state.buzzerSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-buzzer-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-bass" style="background: rgba(59, 130, 246, 0.2); border-color: #3b82f6; color: #60a5fa;" title="Place in Bass">Bass</button>
                <button class="sort-btn btn-to-mid" style="background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #34d399;" title="Place in Mid">Mid</button>
                <button class="sort-btn btn-to-treble" style="background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; color: #fbbf24;" title="Place in Treble">Treble</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback-buzzer"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      // Attach Tone Preview Buttons
      const btnBass = document.getElementById('btn-preview-bass');
      const btnMid = document.getElementById('btn-preview-mid');
      const btnTreble = document.getElementById('btn-preview-treble');

      if (btnBass) {
        btnBass.addEventListener('click', () => {
          window.circuitSimulation.setBuzzerTone(80, 500);
        });
      }
      if (btnMid) {
        btnMid.addEventListener('click', () => {
          window.circuitSimulation.setBuzzerTone(440, 500);
        });
      }
      if (btnTreble) {
        btnTreble.addEventListener('click', () => {
          window.circuitSimulation.setBuzzerTone(3500, 500);
        });
      }

      // Attach Sort Handlers
      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-buzzer-${item.id}`);
        if (!itemEl) return;
        const bBass = itemEl.querySelector('.btn-to-bass');
        const bMid = itemEl.querySelector('.btn-to-mid');
        const bTreble = itemEl.querySelector('.btn-to-treble');

        bBass.addEventListener('click', () => handleBuzzerSort(item, 'bass'));
        bMid.addEventListener('click', () => handleBuzzerSort(item, 'mid'));
        bTreble.addEventListener('click', () => handleBuzzerSort(item, 'treble'));
      });

      refreshBuzzerSortedSlots();
    }

    function handleBuzzerSort(item, chosenZone) {
      if (chosenZone === item.target) {
        state.buzzerSortingState[item.id] = chosenZone;
        if (window.soundEngine) window.soundEngine.playSuccess();
        const itemEl = document.getElementById(`item-buzzer-${item.id}`);
        if (itemEl) itemEl.classList.add('sorted');
        refreshBuzzerSortedSlots();
        checkBuzzerSortCompletion();
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        const fb = document.getElementById('sorter-feedback-buzzer');
        if (fb) {
          fb.innerHTML = `
          <div class="feedback-alert error">
            <span>❌</span>
            <div>
              <strong>Oops! Not quite right:</strong> "${item.text}" vibrates differently! ${item.explanation}
            </div>
          </div>
        `;
        }
      }
    }

    function refreshBuzzerSortedSlots() {
      const slotsBass = document.getElementById('slots-bass');
      const slotsMid = document.getElementById('slots-mid');
      const slotsTreble = document.getElementById('slots-treble');
      if (!slotsBass || !slotsMid || !slotsTreble) return;

      slotsBass.innerHTML = '';
      slotsMid.innerHTML = '';
      slotsTreble.innerHTML = '';

      const lessons = getCurrentLessons();
      const act = lessons[0].sortingActivity;

      act.items.forEach(item => {
        const zone = state.buzzerSortingState[item.id];
        if (zone) {
          const slotEl = document.createElement('div');
          slotEl.className = 'sorted-slot-item';
          slotEl.innerHTML = `<span>✅ ${item.text}</span>`;
          if (zone === 'bass') slotsBass.appendChild(slotEl);
          else if (zone === 'mid') slotsMid.appendChild(slotEl);
          else if (zone === 'treble') slotsTreble.appendChild(slotEl);
        }
      });
    }

    function checkBuzzerSortCompletion() {
      const lessons = getCurrentLessons();
      const act = lessons[0].sortingActivity;
      const sortedCount = Object.keys(state.buzzerSortingState).length;

      if (sortedCount === act.items.length) {
        state.buzzerLesson1Solved = true;
        const fb = document.getElementById('sorter-feedback-buzzer');
        if (fb) {
          fb.innerHTML = `
          <div class="feedback-alert success">
            <span>🎉</span>
            <div>
              <strong>Acoustics Master! All 6 frequencies correctly identified!</strong>
              <p style="margin: 4px 0 0; font-size: 0.85rem;">You understand how frequency (Hertz) creates pitch. Press <strong>Start Simulation</strong> below to hear Pin 8 play Concert A (440 Hz) in code!</p>
            </div>
          </div>
        `;
        }
        launchConfetti();
      }
    }

    // -------------------------------------------------------------------------
    // BUZZER LESSON 2: Emergency Siren Builder Studio (tone() + delay())
    // -------------------------------------------------------------------------
    function renderBuzzerLesson2(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Emergency Siren Studio: High-Lo Frequency Pitch Alternator</strong>
        </div>
        <p class="task-desc">
          Emergency sirens grab attention by rapidly jumping between two distinct audio frequencies!
          Customize the high and low frequencies and interval speed below, or click any emergency preset.
        </p>

        <!-- Emergency Presets -->
        <div class="siren-presets-grid">
          ${(lesson.sirenPresets || lesson.presets || [
          { name: "🚨 European Police Siren", low: 650, high: 950, stepDelay: 350 },
          { name: "⚡ Fast Cyber Strobe", low: 800, high: 1400, stepDelay: 120 },
          { name: "🛸 Sci-Fi Laser Warp", low: 300, high: 1800, stepDelay: 80 },
          { name: "⚠️ Submarine Dive Alarm", low: 400, high: 600, stepDelay: 500 }
        ]).map((p, idx) => `
            <button class="siren-preset-btn ${idx === 0 ? 'active' : ''}" data-low="${p.low || p.lowFreq}" data-high="${p.high || p.highFreq}" data-int="${p.stepDelay || p.intervalMs || 350}" data-name="${p.name}">
              <span>${p.name}</span>
              <small style="color: var(--text-muted); font-size: 0.7rem;">${p.low || p.lowFreq}Hz ➔ ${p.high || p.highFreq}Hz</small>
            </button>
          `).join('')}
        </div>

        <div class="siren-builder-card">
          <!-- Low Frequency Slider -->
          <div class="siren-slider-row">
            <div class="siren-slider-header">
              <span>Low Frequency (tone 1):</span>
              <span class="siren-slider-val" id="val-siren-low">${state.sirenLowFreq} Hz</span>
            </div>
            <input type="range" class="angle-range-slider" id="slider-siren-low" min="150" max="1200" step="10" value="${state.sirenLowFreq}">
          </div>

          <!-- High Frequency Slider -->
          <div class="siren-slider-row">
            <div class="siren-slider-header">
              <span>High Frequency (tone 2):</span>
              <span class="siren-slider-val" id="val-siren-high">${state.sirenHighFreq} Hz</span>
            </div>
            <input type="range" class="angle-range-slider" id="slider-siren-high" min="500" max="3000" step="25" value="${state.sirenHighFreq}">
          </div>

          <!-- Interval Delay Slider -->
          <div class="siren-slider-row">
            <div class="siren-slider-header">
              <span>Pulse Delay (Interval):</span>
              <span class="siren-slider-val" id="val-siren-int">${state.sirenIntervalMs} ms</span>
            </div>
            <input type="range" class="angle-range-slider" id="slider-siren-int" min="50" max="800" step="25" value="${state.sirenIntervalMs}">
          </div>

          <!-- Live Siren Test Button -->
          <div style="text-align: center; margin-top: 0.5rem;">
            <button class="interactive-big-btn" id="btn-test-siren" style="max-width: 280px; padding: 0.85rem 1.4rem;">
              <span>🚨</span>
              <span>Test Siren Blast (1.5s)</span>
            </button>
          </div>
        </div>
      </div>
    `;

      const sliderLow = document.getElementById('slider-siren-low');
      const sliderHigh = document.getElementById('slider-siren-high');
      const sliderInt = document.getElementById('slider-siren-int');
      const valLow = document.getElementById('val-siren-low');
      const valHigh = document.getElementById('val-siren-high');
      const valInt = document.getElementById('val-siren-int');
      const btnTestSiren = document.getElementById('btn-test-siren');

      function syncSirenParams() {
        const low = parseInt(sliderLow.value);
        const high = parseInt(sliderHigh.value);
        const interval = parseInt(sliderInt.value);

        state.sirenLowFreq = low;
        state.sirenHighFreq = high;
        state.sirenIntervalMs = interval;

        if (valLow) valLow.textContent = `${low} Hz`;
        if (valHigh) valHigh.textContent = `${high} Hz`;
        if (valInt) valInt.textContent = `${interval} ms`;

        window.circuitSimulation.setSirenParams(low, high, interval);
      }

      if (sliderLow) sliderLow.addEventListener('input', syncSirenParams);
      if (sliderHigh) sliderHigh.addEventListener('input', syncSirenParams);
      if (sliderInt) sliderInt.addEventListener('input', syncSirenParams);

      // Preset Buttons
      document.querySelectorAll('.siren-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.siren-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const low = parseInt(btn.getAttribute('data-low'));
          const high = parseInt(btn.getAttribute('data-high'));
          const interval = parseInt(btn.getAttribute('data-int'));

          if (sliderLow) sliderLow.value = low;
          if (sliderHigh) sliderHigh.value = high;
          if (sliderInt) sliderInt.value = interval;
          syncSirenParams();

          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      if (btnTestSiren) {
        btnTestSiren.addEventListener('click', () => {
          syncSirenParams();
          let count = 0;
          const low = state.sirenLowFreq;
          const high = state.sirenHighFreq;
          const intv = state.sirenIntervalMs;

          const sirenInterval = window.registerLabInterval(() => {
            const freq = (count % 2 === 0) ? low : high;
            window.circuitSimulation.setBuzzerTone(freq, intv);
            count++;
            if (count >= 6) {
              window.clearLabInterval(sirenInterval);
              window.registerLabTimeout(() => window.circuitSimulation.stopBuzzer(), intv);
            }
          }, intv);
        });
      }

      syncSirenParams();
    }

    // -------------------------------------------------------------------------
    // BUZZER LESSON 3: Melodies & Note Arrays (Twinkle Little Star / Scale / Mario)
    // -------------------------------------------------------------------------
    function renderBuzzerLesson3(lesson) {
      const scaleNotes = [
        { note: 'C4', name: 'Do', freq: 262 },
        { note: 'D4', name: 'Re', freq: 294 },
        { note: 'E4', name: 'Mi', freq: 330 },
        { note: 'F4', name: 'Fa', freq: 349 },
        { note: 'G4', name: 'Sol', freq: 392 },
        { note: 'A4', name: 'La', freq: 440 },
        { note: 'B4', name: 'Ti', freq: 494 },
        { note: 'C5', name: 'Do High', freq: 523 }
      ];

      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Jukebox Melody Sequencer: C-Major Scale & Melodic Arrays</strong>
        </div>
        <p class="task-desc">
          Computers store songs as arrays of note frequencies and durations!
          Click any note pill below to audition its pitch, or hit <strong>Start Simulation</strong> to hear Arduino play the full sequence in an automated loop!
        </p>

        <!-- Melody Track Visualizer -->
        <div class="melody-jukebox-card">
          <div class="melody-track-display">
            <span style="font-size: 1.5rem;">🎼</span>
            <div>
              <strong style="color: #34d399; font-size: 0.95rem;">C-Major Musical Scale (C4 to C5)</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">8 Notes Array: int melody[] = { 262, 294, 330, 349, 392, 440, 494, 523 };</div>
            </div>
          </div>

          <!-- Note Pills Horizontal Strip -->
          <div class="melody-notes-strip" id="melody-notes-strip">
            ${scaleNotes.map((n, idx) => `
              <button class="melody-note-pill" data-freq="${n.freq}" data-index="${idx}" id="note-pill-${idx}">
                <span>${n.note} (${n.name})</span>
                <small style="display: block; font-size: 0.65rem; color: #64748b;">${n.freq} Hz</small>
              </button>
            `).join('')}
          </div>

          <!-- Quick Audition Full Scale Button -->
          <div style="text-align: center; margin-top: 0.5rem;">
            <button class="interactive-big-btn" id="btn-play-scale" style="max-width: 280px; padding: 0.85rem 1.4rem;">
              <span>🎵</span>
              <span>Play Scale Audition</span>
            </button>
          </div>
        </div>
      </div>
    `;

      scaleNotes.forEach((n, idx) => {
        const pill = document.getElementById(`note-pill-${idx}`);
        if (pill) {
          pill.addEventListener('click', () => {
            document.querySelectorAll('.melody-note-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            window.circuitSimulation.setBuzzerTone(n.freq, 400);
            setTimeout(() => {
              pill.classList.remove('active');
            }, 400);
          });
        }
      });

      const btnPlayScale = document.getElementById('btn-play-scale');
      if (btnPlayScale) {
        btnPlayScale.addEventListener('click', () => {
          let i = 0;
          const interval = window.registerLabInterval(() => {
            if (i >= scaleNotes.length) {
              window.clearLabInterval(interval);
              document.querySelectorAll('.melody-note-pill').forEach(p => p.classList.remove('active'));
              window.registerLabTimeout(() => window.circuitSimulation.stopBuzzer(), 400);
              return;
            }
            const n = scaleNotes[i];
            document.querySelectorAll('.melody-note-pill').forEach(p => p.classList.remove('active'));
            const activePill = document.getElementById(`note-pill-${i}`);
            if (activePill) activePill.classList.add('active');

            window.circuitSimulation.setBuzzerTone(n.freq, 350);
            i++;
          }, 380);
        });
      }
    }

    // -------------------------------------------------------------------------
    // BUZZER LESSON 4: 8-Key Piano Synthesizer Keyboard Studio
    // -------------------------------------------------------------------------
    function renderBuzzerLesson4(lesson) {
      const pianoKeys = [
        { key: '1', note: 'C4', solfege: 'Do', freq: 262 },
        { key: '2', note: 'D4', solfege: 'Re', freq: 294 },
        { key: '3', note: 'E4', solfege: 'Mi', freq: 330 },
        { key: '4', note: 'F4', solfege: 'Fa', freq: 349 },
        { key: '5', note: 'G4', solfege: 'Sol', freq: 392 },
        { key: '6', note: 'A4', solfege: 'La', freq: 440 },
        { key: '7', note: 'B4', solfege: 'Ti', freq: 494 },
        { key: '8', note: 'C5', solfege: 'Do', freq: 523 }
      ];

      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>8-Key Piano Synthesizer Studio: Real-Time Event-Driven Sound</strong>
        </div>
        <p class="task-desc">
          Click and hold any piano key below, or press keyboard number keys <strong>[1] to [8]</strong> on your computer keyboard to play musical notes in real time!
        </p>

        <!-- Piano Studio Widget -->
        <div class="piano-synth-studio">
          <div class="piano-status-banner">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Current Synthesizer Output:</span>
              <div class="piano-status-note" id="piano-live-note">Rest (Silent)</div>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); text-align: right;">
              <div>Use Mouse or Keys <strong>1–8</strong></div>
              <small style="color: #38bdf8;">Low-Latency Web Audio Square Wave</small>
            </div>
          </div>

          <!-- The 8-Key Piano Keyboard -->
          <div class="piano-keyboard" id="piano-keys-row">
            ${pianoKeys.map(k => `
              <div class="piano-key" data-key="${k.key}" data-note="${k.note}" data-freq="${k.freq}" id="pkey-${k.key}">
                <span class="key-shortcut">${k.key}</span>
                <span class="key-note">${k.note}</span>
                <span class="key-solfege">${k.solfege}</span>
                <span class="key-freq">${k.freq}Hz</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

      const liveNoteEl = document.getElementById('piano-live-note');

      function playKeyNote(k) {
        if (liveNoteEl) {
          liveNoteEl.innerHTML = `<span style="color: #34d399;">${k.note} (${k.solfege})</span> &bull; <strong>${k.freq} Hz</strong>`;
        }
        const el = document.getElementById(`pkey-${k.key}`);
        if (el) el.classList.add('playing');
        window.circuitSimulation.setBuzzerTone(k.freq, 0);
      }

      function releaseKeyNote(k) {
        if (liveNoteEl) {
          liveNoteEl.textContent = 'Rest (Silent)';
        }
        const el = document.getElementById(`pkey-${k.key}`);
        if (el) el.classList.remove('playing');
        window.circuitSimulation.stopBuzzer();
      }

      // Attach Mouse & Touch Events to each Piano Key
      pianoKeys.forEach(k => {
        const el = document.getElementById(`pkey-${k.key}`);
        if (!el) return;

        const down = (e) => {
          e.preventDefault();
          playKeyNote(k);
        };
        const up = (e) => {
          e.preventDefault();
          releaseKeyNote(k);
        };

        el.addEventListener('mousedown', down);
        el.addEventListener('mouseup', up);
        el.addEventListener('mouseleave', up);
        el.addEventListener('touchstart', down);
        el.addEventListener('touchend', up);
      });
    }

    // =========================================================================
    // LDR LIGHT SENSOR & SMART STREETLIGHT INTERACTIVE TASKS (Lab 6)
    // =========================================================================

    // -------------------------------------------------------------------------
    // LDR LESSON 1: Ambient Light Levels & Resistance Sorter
    // -------------------------------------------------------------------------
    function renderLdrLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Ambient Light Spectrum & Lux</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>

        <!-- Dynamic Photons Light Dial -->
        <div class="pot-dial-container" style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; width: 100%; max-width: 440px; font-size: 0.85rem; font-weight: 700;">
            <span style="color: #64748b;">🌑 Total Dark (100kΩ)</span>
            <span id="label-ldr-resistance" style="color: #facc15; font-family: var(--font-code);">R = 5,000 Ω (5kΩ)</span>
            <span style="color: #f59e0b;">☀️ Noon Sun (500Ω)</span>
          </div>
          <input type="range" class="pot-slider-track celestial-slider" id="ldr-interactive-slider" min="0" max="1023" step="5" value="${state.ldrRaw}">
          <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            <span>Sensor ADC: <strong id="lbl-ldr-adc" style="color: #38bdf8;">${state.ldrRaw}</strong></span>
            <span>Est. Lux: <strong id="lbl-ldr-lux" style="color: #34d399;">${state.ldrLux} Lux</strong></span>
          </div>
        </div>

        <div class="sorter-zones" style="grid-template-columns: repeat(3, 1fr);">
          <div class="sorter-zone" id="zone-dark" style="border-color: #6366f1;">
            <div class="zone-header">
              <span class="icon">🌙</span>
              <strong>DARKNESS</strong>
              <small>&lt; 10 Lux (100kΩ)</small>
            </div>
            <div class="zone-slots" id="slots-ldr-dark"></div>
          </div>
          <div class="sorter-zone" id="zone-dim" style="border-color: #38bdf8;">
            <div class="zone-header">
              <span class="icon">🛋️</span>
              <strong>INDOOR / DIM</strong>
              <small>100 – 2,000 Lux</small>
            </div>
            <div class="zone-slots" id="slots-ldr-dim"></div>
          </div>
          <div class="sorter-zone" id="zone-bright" style="border-color: #f59e0b;">
            <div class="zone-header">
              <span class="icon">☀️</span>
              <strong>BRIGHT SUN</strong>
              <small>&gt; 10,000 Lux (500Ω)</small>
            </div>
            <div class="zone-slots" id="slots-ldr-bright"></div>
          </div>
        </div>

        <div class="sorter-pool" id="sorter-pool-ldr">
          ${act.items.map(item => `
            <div class="sorter-item ${state.ldrSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-ldr-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-dark" style="background: rgba(99, 102, 241, 0.2); border-color: #6366f1; color: #818cf8;" title="Place in Darkness">Dark</button>
                <button class="sort-btn btn-to-dim" style="background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; color: #7dd3fc;" title="Place in Dim">Dim</button>
                <button class="sort-btn btn-to-bright" style="background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; color: #fbbf24;" title="Place in Bright">Bright</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback-ldr"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const ldrSlider = document.getElementById('ldr-interactive-slider');
      const labelRes = document.getElementById('label-ldr-resistance');
      const labelAdc = document.getElementById('lbl-ldr-adc');
      const labelLux = document.getElementById('lbl-ldr-lux');

      if (ldrSlider) {
        ldrSlider.addEventListener('input', (e) => {
          const raw = parseInt(e.target.value);
          state.ldrRaw = raw;
          state.ldrLux = Math.round((raw / 1023.0) * 1000);
          window.circuitSimulation.setLdrValue(raw);

          // Approximate resistance: low raw = dark = high R, high raw = bright = low R
          const ohms = Math.round(100000 / (1 + (raw / 1023.0) * 199));
          if (labelRes) labelRes.textContent = `R ≈ ${ohms > 1000 ? (ohms / 1000).toFixed(1) + 'k' : ohms} Ω`;
          if (labelAdc) labelAdc.textContent = raw;
          if (labelLux) labelLux.textContent = `${state.ldrLux} Lux`;
        });
      }

      // Attach Sort Event Listeners
      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-ldr-${item.id}`);
        if (!itemEl) return;
        const bDark = itemEl.querySelector('.btn-to-dark');
        const bDim = itemEl.querySelector('.btn-to-dim');
        const bBright = itemEl.querySelector('.btn-to-bright');

        bDark.addEventListener('click', () => handleLdrSort(item, 'dark'));
        bDim.addEventListener('click', () => handleLdrSort(item, 'dim'));
        bBright.addEventListener('click', () => handleLdrSort(item, 'bright'));
      });

      refreshLdrSortedSlots();
    }

    function handleLdrSort(item, chosenZone) {
      if (chosenZone === item.target) {
        state.ldrSortingState[item.id] = chosenZone;
        if (window.soundEngine) window.soundEngine.playSuccess();
        const itemEl = document.getElementById(`item-ldr-${item.id}`);
        if (itemEl) itemEl.classList.add('sorted');
        refreshLdrSortedSlots();
        checkLdrSortCompletion();
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        const fb = document.getElementById('sorter-feedback-ldr');
        if (fb) {
          fb.innerHTML = `
          <div class="feedback-alert error">
            <span>❌</span>
            <div>
              <strong>Not quite:</strong> "${item.text}" has a different light intensity! ${item.explanation}
            </div>
          </div>
        `;
        }
      }
    }

    function refreshLdrSortedSlots() {
      const slotsDark = document.getElementById('slots-ldr-dark');
      const slotsDim = document.getElementById('slots-ldr-dim');
      const slotsBright = document.getElementById('slots-ldr-bright');
      if (!slotsDark || !slotsDim || !slotsBright) return;

      slotsDark.innerHTML = '';
      slotsDim.innerHTML = '';
      slotsBright.innerHTML = '';

      const lessons = getCurrentLessons();
      const act = lessons[0].sortingActivity;

      act.items.forEach(item => {
        const zone = state.ldrSortingState[item.id];
        if (zone) {
          const slotEl = document.createElement('div');
          slotEl.className = 'sorted-slot-item';
          slotEl.innerHTML = `<span>✅ ${item.text}</span>`;
          if (zone === 'dark') slotsDark.appendChild(slotEl);
          else if (zone === 'dim') slotsDim.appendChild(slotEl);
          else if (zone === 'bright') slotsBright.appendChild(slotEl);
        }
      });
    }

    function checkLdrSortCompletion() {
      const lessons = getCurrentLessons();
      const act = lessons[0].sortingActivity;
      const sortedCount = Object.keys(state.ldrSortingState).length;

      if (sortedCount === act.items.length) {
        state.ldrLesson1Solved = true;
        const fb = document.getElementById('sorter-feedback-ldr');
        if (fb) {
          fb.innerHTML = `
          <div class="feedback-alert success">
            <span>🎉</span>
            <div>
              <strong>Optoelectronics Master! All 6 lighting levels classified!</strong>
              <p style="margin: 4px 0 0; font-size: 0.85rem;">You see how light photons change resistance. Next, let's turn this changing resistance into voltage with a 10kΩ divider circuit!</p>
            </div>
          </div>
        `;
        }
        launchConfetti();
      }
    }

    // -------------------------------------------------------------------------
    // LDR LESSON 2: Voltage Divider Playground (LDR + 10k Partner)
    // -------------------------------------------------------------------------
    function renderLdrLesson2(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Voltage Divider Tug-of-War: Resistors in Series</strong>
        </div>
        <p class="task-desc">
          Arduino cannot read resistance directly. Watch how the 5V tug-of-war partitions voltage:
          As light shines on the LDR, its resistance drops, pulling the junction voltage higher toward 5V!
        </p>

        <!-- Interactive Divider Simulation -->
        <div style="background: rgba(15,23,42,0.85); border: 1px solid #334155; border-radius: var(--radius-lg); padding: 1.25rem; margin-top: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span>Simulated Sunlight on LDR:</span>
            <span id="lbl-vd-volts" style="font-family: var(--font-code); font-size: 1.15rem; font-weight: 800; color: #38bdf8;">${state.voltage} V</span>
          </div>
          <input type="range" class="pot-slider-track celestial-slider" id="vd-slider" min="0" max="1023" step="5" value="${state.ldrRaw}">
          
          <!-- Formula Breakdown Card -->
          <div style="display: flex; gap: 0.75rem; justify-content: space-around; margin-top: 1.25rem; flex-wrap: wrap;">
            <div class="lux-metric-box">
              <span class="lux-metric-label">LDR Resistance (R1):</span>
              <span class="lux-metric-value" id="val-r1">5.2 kΩ</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Fixed Resistor (R2):</span>
              <span class="lux-metric-value" style="color: #94a3b8;">10.0 kΩ</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Pin A1 Output Voltage:</span>
              <span class="lux-metric-value" id="val-vout" style="color: #34d399;">3.20 V</span>
            </div>
          </div>
        </div>
      </div>
    `;

      const vdSlider = document.getElementById('vd-slider');
      const lblVolts = document.getElementById('lbl-vd-volts');
      const valR1 = document.getElementById('val-r1');
      const valVout = document.getElementById('val-vout');

      if (vdSlider) {
        vdSlider.addEventListener('input', (e) => {
          const raw = parseInt(e.target.value);
          state.ldrRaw = raw;
          const v = ((raw * 5.0) / 1023.0).toFixed(2);
          state.voltage = parseFloat(v);
          window.circuitSimulation.setLdrValue(raw);

          const ohms = Math.round(100000 / (1 + (raw / 1023.0) * 199));
          const r1Str = ohms > 1000 ? (ohms / 1000).toFixed(1) + ' kΩ' : ohms + ' Ω';

          if (lblVolts) lblVolts.textContent = `${v} V`;
          if (valR1) valR1.textContent = r1Str;
          if (valVout) valVout.textContent = `${v} V`;
        });
      }
    }

    // -------------------------------------------------------------------------
    // LDR LESSON 3: Dark Detector Threshold Comparator (if/else)
    // -------------------------------------------------------------------------
    function renderLdrLesson3(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Dark Detector Threshold Comparator Studio</strong>
        </div>
        <p class="task-desc">
          Compare live ambient light against the automated threshold cutoff line.
          When light falls below your threshold number, the streetlamp turns ON!
        </p>

        <!-- Presets -->
        <div class="angle-presets-grid" style="margin-bottom: 1rem;">
          ${lesson.presets.map((p, idx) => `
            <button class="angle-preset-btn ${idx === 1 ? 'active' : ''}" data-threshold="${p.threshold}">
              <span>${p.name}</span>
              <small>${p.desc} (${p.threshold})</small>
            </button>
          `).join('')}
        </div>

        <div style="background: rgba(15,23,42,0.85); border: 1px solid #334155; border-radius: var(--radius-lg); padding: 1.25rem;">
          <!-- Ambient Light Adjuster -->
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
              <span>Simulated Light Level:</span>
              <span id="lbl-thresh-light" style="color: #38bdf8; font-family: var(--font-code);">${state.ldrRaw} / 1023</span>
            </div>
            <input type="range" class="pot-slider-track celestial-slider" id="slider-thresh-light" min="0" max="1023" step="5" value="${state.ldrRaw}">
          </div>

          <!-- Threshold Cutoff Adjuster -->
          <div style="margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
              <span>Automated Cutoff Threshold:</span>
              <span id="lbl-thresh-cutoff" style="color: #f59e0b; font-family: var(--font-code);">${state.ldrThreshold}</span>
            </div>
            <input type="range" class="angle-range-slider" id="slider-thresh-cutoff" min="100" max="900" step="10" value="${state.ldrThreshold}">
          </div>

          <!-- Live Decision Gate Visualizer -->
          <div style="display: flex; gap: 1rem; align-items: center; justify-content: center; padding: 1rem; background: rgba(30,41,59,0.7); border-radius: var(--radius-md);">
            <div style="font-family: var(--font-code); font-size: 1rem; font-weight: 700;">
              if (<span id="box-light" style="color: #38bdf8;">${state.ldrRaw}</span> &lt; <span id="box-cutoff" style="color: #f59e0b;">${state.ldrThreshold}</span>)
            </div>
            <div style="font-size: 1.3rem;">➔</div>
            <div id="badge-gate-decision" class="angle-badge-large" style="padding: 0.4rem 1rem; font-size: 0.95rem;">
              ${state.ldrLightOn ? '💡 STREETLAMP ON' : '☀️ DAYLIGHT OFF'}
            </div>
          </div>
        </div>
      </div>
    `;

      const sliderLight = document.getElementById('slider-thresh-light');
      const sliderCutoff = document.getElementById('slider-thresh-cutoff');
      const lblLight = document.getElementById('lbl-thresh-light');
      const lblCutoff = document.getElementById('lbl-thresh-cutoff');
      const boxLight = document.getElementById('box-light');
      const boxCutoff = document.getElementById('box-cutoff');
      const badgeDecision = document.getElementById('badge-gate-decision');

      function syncComparatorUI() {
        const raw = parseInt(sliderLight.value);
        const thresh = parseInt(sliderCutoff.value);

        state.ldrRaw = raw;
        state.ldrThreshold = thresh;
        window.circuitSimulation.setLdrThreshold(thresh);
        window.circuitSimulation.setLdrValue(raw);

        const isDark = raw < thresh;

        if (lblLight) lblLight.textContent = `${raw} / 1023`;
        if (lblCutoff) lblCutoff.textContent = `${thresh}`;
        if (boxLight) boxLight.textContent = `${raw}`;
        if (boxCutoff) boxCutoff.textContent = `${thresh}`;

        if (badgeDecision) {
          badgeDecision.textContent = isDark ? '💡 STREETLAMP ON' : '☀️ DAYLIGHT OFF';
          badgeDecision.style.background = isDark ? 'rgba(234, 179, 8, 0.25)' : 'rgba(15, 23, 42, 0.7)';
          badgeDecision.style.borderColor = isDark ? '#facc15' : '#64748b';
          badgeDecision.style.color = isDark ? '#fef08a' : '#94a3b8';
        }
      }

      if (sliderLight) sliderLight.addEventListener('input', syncComparatorUI);
      if (sliderCutoff) sliderCutoff.addEventListener('input', syncComparatorUI);

      document.querySelectorAll('.angle-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const th = parseInt(btn.getAttribute('data-threshold'));
          if (sliderCutoff) sliderCutoff.value = th;
          syncComparatorUI();
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      syncComparatorUI();
    }

    // -------------------------------------------------------------------------
    // LDR LESSON 4: 24-Hour Day/Night Smart Streetlight Studio
    // -------------------------------------------------------------------------
    function renderLdrLesson4(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Smart City 24-Hour Environmental Simulator</strong>
        </div>
        <p class="task-desc">
          Drag the 24-hour celestial dial below: watch the day break, noon blaze, dusk arrive, and midnight fall.
          The autonomous Arduino brain monitors Pin A1 and switches municipal streetlamps ON precisely at twilight!
        </p>

        <!-- Sky Simulator Card -->
        <div class="sky-simulator-card daytime" id="sky-sim-card">
          <div class="sky-display-header">
            <div class="sky-phase-title">
              <span id="celestial-icon" style="font-size: 1.5rem;">☀️</span>
              <div>
                <span id="celestial-time-name">Midday Sun (12:00 PM)</span>
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">Autonomous Smart Grid Sensor</div>
              </div>
            </div>
            <div class="angle-badge-large" id="badge-city-lamp" style="padding: 0.4rem 1rem;">
              STREETLAMP OFF ☀️
            </div>
          </div>

          <!-- 24-Hour Celestial Slider -->
          <div class="celestial-slider-wrapper">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">
              <span>🌙 12:00 AM (Midnight)</span>
              <span>🌅 6:00 AM (Dawn)</span>
              <span>☀️ 12:00 PM (Noon)</span>
              <span>🌇 6:00 PM (Dusk)</span>
              <span>🌙 11:59 PM (Night)</span>
            </div>
            <input type="range" class="celestial-slider" id="celestial-time-slider" min="0" max="24" step="0.25" value="12">
          </div>

          <!-- Live Telemetry Readouts -->
          <div class="lux-readout-row">
            <div class="lux-metric-box">
              <span class="lux-metric-label">Simulated Time:</span>
              <span class="lux-metric-value" id="val-time-display">12:00 PM</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Ambient Light (Lux):</span>
              <span class="lux-metric-value" id="val-lux-display">850 Lux</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Pin A1 ADC Value:</span>
              <span class="lux-metric-value" id="val-adc-display">870 / 1023</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Solar Battery Saved:</span>
              <span class="lux-metric-value" id="val-energy-saved" style="color: #34d399;">100% Active</span>
            </div>
          </div>
        </div>
      </div>
    `;

      const skyCard = document.getElementById('sky-sim-card');
      const timeSlider = document.getElementById('celestial-time-slider');
      const celestialIcon = document.getElementById('celestial-icon');
      const timeName = document.getElementById('celestial-time-name');
      const badgeLamp = document.getElementById('badge-city-lamp');
      const valTime = document.getElementById('val-time-display');
      const valLux = document.getElementById('val-lux-display');
      const valAdc = document.getElementById('val-adc-display');
      const valEnergy = document.getElementById('val-energy-saved');

      function syncCelestialSky(hour) {
        let icon = '☀️';
        let title = 'Noon Daylight';
        let rawLight = 870;
        let skyClass = 'daytime';

        if (hour < 5 || hour >= 21) {
          icon = '🌙';
          title = hour < 5 ? 'Late Night (Pre-Dawn)' : 'Deep Night';
          rawLight = 80; // very dark
          skyClass = 'nighttime';
        } else if (hour >= 5 && hour < 8) {
          icon = '🌅';
          title = 'Golden Sunrise / Dawn';
          rawLight = 420;
          skyClass = 'sunset';
        } else if (hour >= 8 && hour < 17) {
          icon = '☀️';
          title = 'Bright Daytime Sun';
          rawLight = 890;
          skyClass = 'daytime';
        } else if (hour >= 17 && hour < 21) {
          icon = '🌇';
          title = 'Twilight / Sundown';
          rawLight = 310;
          skyClass = 'sunset';
        }

        state.ldrRaw = rawLight;
        window.circuitSimulation.setLdrValue(rawLight);

        const isStreetlampOn = rawLight < state.ldrThreshold;

        if (skyCard) {
          skyCard.className = `sky-simulator-card ${skyClass}`;
        }
        if (celestialIcon) celestialIcon.textContent = icon;
        if (timeName) timeName.textContent = `${title} (${formatHour(hour)})`;
        if (valTime) valTime.textContent = formatHour(hour);
        if (valLux) valLux.textContent = `${Math.round((rawLight / 1023.0) * 1000)} Lux`;
        if (valAdc) valAdc.textContent = `${rawLight} / 1023`;
        if (valEnergy) {
          valEnergy.textContent = isStreetlampOn ? 'Municipal Power ACTIVE 💡' : 'Solar Savings ACTIVE ☀️';
          valEnergy.style.color = isStreetlampOn ? '#facc15' : '#34d399';
        }

        if (badgeLamp) {
          badgeLamp.textContent = isStreetlampOn ? 'STREETLAMP ON 💡' : 'STREETLAMP OFF ☀️';
          badgeLamp.style.background = isStreetlampOn ? 'rgba(234, 179, 8, 0.25)' : 'rgba(15, 23, 42, 0.7)';
          badgeLamp.style.borderColor = isStreetlampOn ? '#facc15' : '#64748b';
          badgeLamp.style.color = isStreetlampOn ? '#fef08a' : '#94a3b8';
        }
      }

      function formatHour(h) {
        const whole = Math.floor(h);
        const mins = Math.round((h - whole) * 60);
        const period = whole >= 12 ? 'PM' : 'AM';
        const dispHour = whole === 0 ? 12 : (whole > 12 ? whole - 12 : whole);
        return `${dispHour}:${mins.toString().padStart(2, '0')} ${period}`;
      }

      if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
          syncCelestialSky(parseFloat(e.target.value));
        });
      }

      syncCelestialSky(12.0);
    }

    // =========================================================================
    // RGB MULTI-COLOR LED LAB INTERACTIVE TASKS
    // =========================================================================

    // RGB Lesson 1: Additive Primary & Secondary Colors
    function renderRgbLesson1(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Additive Color Synthesis (Red, Green, Blue)</strong>
        </div>
        <p class="task-instructions">
          Inside the frosted LED dome, three microscopic sub-pixel dice share one common Ground pin. Toggle each primary color ON or OFF to observe how emitted light beams combine into secondary colors (Yellow, Cyan, Magenta) or pure White!
        </p>

        <div class="rgb-studio-card">
          <div class="rgb-preview-hero">
            <div class="rgb-swatch-display">
              <div id="rgb-live-swatch" class="rgb-swatch-box" style="background-color: rgb(255, 255, 0); box-shadow: 0 0 25px rgba(255, 255, 0, 0.6);"></div>
              <div class="rgb-swatch-info">
                <span id="rgb-live-hex" class="rgb-hex-code">#FFFF00</span>
                <span class="rgb-color-name">Additive Combination</span>
              </div>
            </div>
            <div style="font-family: var(--font-code); font-size: 0.8rem; color: #94a3b8; text-align: right;">
              <div>Common Cathode GND: <span style="color: #64748b; font-weight: 700;">PIN 0V</span></div>
              <div style="color: #22d3ee; margin-top: 2px;">Photons Emitted Additively</div>
            </div>
          </div>

          <!-- 3 Channel Toggles -->
          <div style="display: flex; gap: 0.65rem; margin-top: 0.5rem;">
            <button id="btn-toggle-red" class="rgb-channel-btn btn-red active">
              <span>🔴</span> Red (Pin 9)
            </button>
            <button id="btn-toggle-green" class="rgb-channel-btn btn-green active">
              <span>🟢</span> Green (Pin 10)
            </button>
            <button id="btn-toggle-blue" class="rgb-channel-btn btn-blue">
              <span>🔵</span> Blue (Pin 11)
            </button>
          </div>

          <!-- Additive Color Preset Quick Buttons -->
          <div style="margin-top: 0.5rem;">
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 0.35rem;">Optical Light Blends:</span>
            <div class="preset-color-chips">
              <button class="preset-chip" data-r="255" data-g="0" data-b="0"><span class="preset-chip-dot" style="background: #ef4444;"></span> Red</button>
              <button class="preset-chip" data-r="0" data-g="255" data-b="0"><span class="preset-chip-dot" style="background: #10b981;"></span> Green</button>
              <button class="preset-chip" data-r="0" data-g="0" data-b="255"><span class="preset-chip-dot" style="background: #3b82f6;"></span> Blue</button>
              <button class="preset-chip" data-r="255" data-g="255" data-b="0"><span class="preset-chip-dot" style="background: #eab308;"></span> Yellow (R+G)</button>
              <button class="preset-chip" data-r="255" data-g="0" data-b="255"><span class="preset-chip-dot" style="background: #ec4899;"></span> Magenta (R+B)</button>
              <button class="preset-chip" data-r="0" data-g="255" data-b="255"><span class="preset-chip-dot" style="background: #06b6d4;"></span> Cyan (G+B)</button>
              <button class="preset-chip" data-r="255" data-g="255" data-b="255"><span class="preset-chip-dot" style="background: #ffffff;"></span> White (R+G+B)</button>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const btnRed = document.getElementById('btn-toggle-red');
      const btnGreen = document.getElementById('btn-toggle-green');
      const btnBlue = document.getElementById('btn-toggle-blue');

      function syncChannelButtons() {
        if (btnRed) btnRed.classList.toggle('active', window.circuitSimulation.rgbR > 0);
        if (btnGreen) btnGreen.classList.toggle('active', window.circuitSimulation.rgbG > 0);
        if (btnBlue) btnBlue.classList.toggle('active', window.circuitSimulation.rgbB > 0);
      }

      if (btnRed) {
        btnRed.addEventListener('click', () => {
          window.circuitSimulation.toggleRgbChannel('red');
          syncChannelButtons();
          if (window.soundEngine) window.soundEngine.playClick();
        });
      }
      if (btnGreen) {
        btnGreen.addEventListener('click', () => {
          window.circuitSimulation.toggleRgbChannel('green');
          syncChannelButtons();
          if (window.soundEngine) window.soundEngine.playClick();
        });
      }
      if (btnBlue) {
        btnBlue.addEventListener('click', () => {
          window.circuitSimulation.toggleRgbChannel('blue');
          syncChannelButtons();
          if (window.soundEngine) window.soundEngine.playClick();
        });
      }

      lessonInteractiveArea.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const r = parseInt(chip.getAttribute('data-r'));
          const g = parseInt(chip.getAttribute('data-g'));
          const b = parseInt(chip.getAttribute('data-b'));
          window.circuitSimulation.setRgb(r, g, b);
          syncChannelButtons();
          if (window.soundEngine) window.soundEngine.playSuccess();
        });
      });

      window.circuitSimulation.setRgb(255, 255, 0);
      syncChannelButtons();
    }

    // RGB Lesson 2: 8-Bit PWM Fading & Duty Cycles
    function renderRgbLesson2(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 2</span>
          <strong>8-Bit PWM Brightness Fader (0 to 255)</strong>
        </div>
        <p class="task-instructions">
          Drag the PWM slider from 0 to 255. Observe how Arduino's internal hardware timer widens the square wave duty cycle on the real-time oscilloscope without needing genuine analog voltage!
        </p>

        <div class="rgb-studio-card">
          <div class="rgb-preview-hero">
            <div class="rgb-swatch-display">
              <div id="rgb-live-swatch" class="rgb-swatch-box" style="background-color: rgb(128, 0, 0); box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);"></div>
              <div class="rgb-swatch-info">
                <span id="rgb-live-hex" class="rgb-hex-code">analogWrite(9, 128)</span>
                <span class="rgb-color-name">8-Bit PWM Duty Cycle</span>
              </div>
            </div>
            <div style="font-family: var(--font-code); font-size: 0.8rem; color: #94a3b8; text-align: right;">
              <div>Timer Frequency: <span style="color: #f59e0b; font-weight: 700;">490 Hz</span></div>
              <div id="pwm-duty-label" style="color: #ef4444; font-weight: 700; margin-top: 2px;">50% Duty Cycle</div>
            </div>
          </div>

          <div class="rgb-slider-group" style="margin-top: 0.5rem;">
            <div class="rgb-slider-row">
              <label for="pwm-red-fader" style="color: #ef4444;"><span>🔴</span> Pin ~9:</label>
              <input type="range" id="pwm-red-fader" class="slider-track-red" min="0" max="255" value="128">
              <span id="pwm-red-val" class="rgb-slider-val" style="color: #fca5a5;">128</span>
            </div>
          </div>

          <div class="lux-readout-row" style="margin-top: 0.5rem;">
            <div class="lux-metric-box">
              <span class="lux-metric-label">PWM Output Value:</span>
              <span class="lux-metric-value" id="fader-val-disp">128 / 255</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">High-Pulse Fraction:</span>
              <span class="lux-metric-value" id="fader-pct-disp" style="color: #ef4444;">50.2%</span>
            </div>
            <div class="lux-metric-box">
              <span class="lux-metric-label">Average Voltage:</span>
              <span class="lux-metric-value" id="fader-volt-disp" style="color: #22d3ee;">2.51 V</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const fader = document.getElementById('pwm-red-fader');
      const faderVal = document.getElementById('pwm-red-val');
      const valDisp = document.getElementById('fader-val-disp');
      const pctDisp = document.getElementById('fader-pct-disp');
      const voltDisp = document.getElementById('fader-volt-disp');
      const dutyLabel = document.getElementById('pwm-duty-label');
      const hexLabel = document.getElementById('rgb-live-hex');

      function syncFader(val) {
        window.circuitSimulation.setRgb(val, 0, 0);
        const pct = ((val / 255.0) * 100).toFixed(1);
        const volt = ((val / 255.0) * 5.0).toFixed(2);

        if (faderVal) faderVal.textContent = val;
        if (valDisp) valDisp.textContent = `${val} / 255`;
        if (pctDisp) pctDisp.textContent = `${pct}%`;
        if (voltDisp) voltDisp.textContent = `${volt} V`;
        if (dutyLabel) dutyLabel.textContent = `${Math.round(pct)}% Duty Cycle`;
        if (hexLabel) hexLabel.textContent = `analogWrite(9, ${val})`;
      }

      if (fader) {
        fader.addEventListener('input', (e) => {
          syncFader(parseInt(e.target.value));
        });
      }

      syncFader(128);
    }

    // RGB Lesson 3: 16.7M Colors Function Calls
    function renderRgbLesson3(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 3</span>
          <strong>Secondary & Tertiary Color Studio (16.7M Colors)</strong>
        </div>
        <p class="task-instructions">
          Each channel possesses 256 discrete levels (256 × 256 × 256 = 16,777,216 colors). Click the curated aesthetic mood presets below to inspect the live C++ <code>setRGB(r, g, b)</code> parameters!
        </p>

        <div class="rgb-studio-card">
          <div class="rgb-preview-hero">
            <div class="rgb-swatch-display">
              <div id="rgb-live-swatch" class="rgb-swatch-box" style="background-color: rgb(180, 0, 255); box-shadow: 0 0 25px rgba(180, 0, 255, 0.6);"></div>
              <div class="rgb-swatch-info">
                <span id="rgb-live-hex" class="rgb-hex-code">#B400FF</span>
                <span id="rgb-preset-name" class="rgb-color-name">Cyberpunk Neon Purple</span>
              </div>
            </div>
            <div style="font-family: var(--font-code); font-size: 0.8rem; color: #94a3b8; text-align: right;">
              <div>Active C++ Call:</div>
              <code id="rgb-cpp-call" style="color: #fde047; font-weight: 700; font-size: 0.82rem;">setRGB(180, 0, 255);</code>
            </div>
          </div>

          <div style="margin-top: 0.65rem;">
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 0.4rem;">Curated Aesthetic Presets:</span>
            <div class="preset-color-chips">
              <button class="preset-chip" data-name="Cyberpunk Neon Purple" data-r="180" data-g="0" data-b="255"><span class="preset-chip-dot" style="background: #b400ff;"></span> Neon Purple</button>
              <button class="preset-chip" data-name="Sunset Tangerine" data-r="255" data-g="90" data-b="10"><span class="preset-chip-dot" style="background: #ff5a0a;"></span> Sunset Tangerine</button>
              <button class="preset-chip" data-name="Electric Mint" data-r="0" data-g="255" data-b="160"><span class="preset-chip-dot" style="background: #00ffa0;"></span> Electric Mint</button>
              <button class="preset-chip" data-name="Cyber Gold" data-r="255" data-g="180" data-b="0"><span class="preset-chip-dot" style="background: #ffb400;"></span> Cyber Gold</button>
              <button class="preset-chip" data-name="Deep Ocean Abyss" data-r="10" data-g="80" data-b="255"><span class="preset-chip-dot" style="background: #0a50ff;"></span> Deep Ocean</button>
              <button class="preset-chip" data-name="Cozy Candlelight" data-r="255" data-g="120" data-b="30"><span class="preset-chip-dot" style="background: #ff781e;"></span> Candlelight</button>
              <button class="preset-chip" data-name="Pastel Bubblegum" data-r="255" data-g="105" data-b="180"><span class="preset-chip-dot" style="background: #ff69b4;"></span> Bubblegum</button>
              <button class="preset-chip" data-name="Warm White 2700K" data-r="255" data-g="220" data-b="170"><span class="preset-chip-dot" style="background: #ffdcab;"></span> Warm White</button>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const nameEl = document.getElementById('rgb-preset-name');
      const cppEl = document.getElementById('rgb-cpp-call');

      lessonInteractiveArea.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const name = chip.getAttribute('data-name');
          const r = parseInt(chip.getAttribute('data-r'));
          const g = parseInt(chip.getAttribute('data-g'));
          const b = parseInt(chip.getAttribute('data-b'));

          window.circuitSimulation.setRgb(r, g, b);
          if (nameEl) nameEl.textContent = name;
          if (cppEl) cppEl.textContent = `setRGB(${r}, ${g}, ${b});`;
          if (window.soundEngine) window.soundEngine.playSuccess();
        });
      });

      window.circuitSimulation.setRgb(180, 0, 255);
    }

    // RGB Lesson 4: Rainbow Mood Lamp Studio
    function renderRgbLesson4(lesson) {
      let autoRainbowActive = false;
      let autoInterval = null;

      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 4</span>
          <strong>Rainbow Mood Lamp Studio (Cross-Fade Animation)</strong>
        </div>
        <p class="task-instructions">
          Take full creative command! Drag the 360° circular Hue scrubber to traverse the entire rainbow spectrum, fine-tune individual PWM channel faders, or activate the autonomous smart-lamp Rainbow Cycle!
        </p>

        <div class="rgb-studio-card">
          <div class="rgb-preview-hero">
            <div class="rgb-swatch-display">
              <div id="rgb-live-swatch" class="rgb-swatch-box" style="background-color: rgb(255, 0, 0); box-shadow: 0 0 25px rgba(255, 0, 0, 0.6);"></div>
              <div class="rgb-swatch-info">
                <span id="rgb-live-hex" class="rgb-hex-code">#FF0000</span>
                <span id="rgb-hue-display" class="rgb-color-name">Hue: 0° (Pure Red)</span>
              </div>
            </div>
            <button id="btn-auto-rainbow" class="btn btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.82rem; gap: 0.4rem;">
              <span>🌈</span> Auto Rainbow Cycle
            </button>
          </div>

          <!-- 360 Degree Hue Scrubber -->
          <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; font-family: var(--font-code); color: #ec4899; margin-bottom: 0.35rem;">
              <span>🌈 360° Rainbow Hue Wheel:</span>
              <span id="hue-angle-val">0°</span>
            </div>
            <input type="range" id="rgb-hue-slider" class="hue-slider" min="0" max="360" value="0" style="width: 100%; height: 10px; border-radius: 5px; cursor: pointer;">
          </div>

          <!-- 3 Individual Channel Sliders -->
          <div class="rgb-slider-group" style="margin-top: 0.65rem;">
            <div class="rgb-slider-row">
              <label for="slider-r" style="color: #ef4444;"><span>🔴</span> Red:</label>
              <input type="range" id="slider-r" class="slider-track-red" min="0" max="255" value="255">
              <span id="rgb-val-r" class="rgb-slider-val" style="color: #fca5a5;">255 (100%)</span>
            </div>
            <div class="rgb-slider-row">
              <label for="slider-g" style="color: #10b981;"><span>🟢</span> Green:</label>
              <input type="range" id="slider-g" class="slider-track-green" min="0" max="255" value="0">
              <span id="rgb-val-g" class="rgb-slider-val" style="color: #86efac;">0 (0%)</span>
            </div>
            <div class="rgb-slider-row">
              <label for="slider-b" style="color: #3b82f6;"><span>🔵</span> Blue:</label>
              <input type="range" id="slider-b" class="slider-track-blue" min="0" max="255" value="0">
              <span id="rgb-val-b" class="rgb-slider-val" style="color: #93c5fd;">0 (0%)</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const hueSlider = document.getElementById('rgb-hue-slider');
      const hueAngleVal = document.getElementById('hue-angle-val');
      const hueDisplay = document.getElementById('rgb-hue-display');
      const sliderR = document.getElementById('slider-r');
      const sliderG = document.getElementById('slider-g');
      const sliderB = document.getElementById('slider-b');
      const autoBtn = document.getElementById('btn-auto-rainbow');

      function syncSlidersFromHw() {
        if (sliderR) sliderR.value = window.circuitSimulation.rgbR;
        if (sliderG) sliderG.value = window.circuitSimulation.rgbG;
        if (sliderB) sliderB.value = window.circuitSimulation.rgbB;
      }

      if (hueSlider) {
        hueSlider.addEventListener('input', (e) => {
          stopAutoRainbow();
          const hue = parseInt(e.target.value);
          if (hueAngleVal) hueAngleVal.textContent = `${hue}°`;
          if (hueDisplay) hueDisplay.textContent = `Hue: ${hue}°`;
          window.circuitSimulation.setRgbFromHue(hue);
          syncSlidersFromHw();
        });
      }

      if (sliderR) {
        sliderR.addEventListener('input', (e) => {
          stopAutoRainbow();
          window.circuitSimulation.setRgbChannel('red', parseInt(e.target.value));
        });
      }
      if (sliderG) {
        sliderG.addEventListener('input', (e) => {
          stopAutoRainbow();
          window.circuitSimulation.setRgbChannel('green', parseInt(e.target.value));
        });
      }
      if (sliderB) {
        sliderB.addEventListener('input', (e) => {
          stopAutoRainbow();
          window.circuitSimulation.setRgbChannel('blue', parseInt(e.target.value));
        });
      }

      function stopAutoRainbow() {
        if (autoRainbowActive) {
          autoRainbowActive = false;
          if (autoInterval) {
            window.clearLabInterval(autoInterval);
            autoInterval = null;
          }
          if (autoBtn) {
            autoBtn.innerHTML = `<span>🌈</span> Auto Rainbow Cycle`;
            autoBtn.classList.remove('btn-success');
          }
        }
      }

      if (autoBtn) {
        autoBtn.addEventListener('click', () => {
          autoRainbowActive = !autoRainbowActive;
          if (autoRainbowActive) {
            autoBtn.innerHTML = `<span>⏸️</span> Stop Rainbow`;
            autoBtn.classList.add('btn-success');
            autoInterval = window.registerLabInterval(() => {
              const nextHue = (window.circuitSimulation.rgbHue + 4) % 360;
              window.circuitSimulation.setRgbFromHue(nextHue);
              if (hueSlider) hueSlider.value = nextHue;
              if (hueAngleVal) hueAngleVal.textContent = `${nextHue}°`;
              if (hueDisplay) hueDisplay.textContent = `Hue: ${nextHue}°`;
              syncSlidersFromHw();
            }, 60);
          } else {
            stopAutoRainbow();
          }
        });
      }

      window.circuitSimulation.setRgb(255, 0, 0);
      syncSlidersFromHw();
    }

    // =========================================================================
    // TEMPERATURE SENSOR TMP36 & HVAC STUDIO INTERACTIVE TASKS
    // =========================================================================

    // Temp Lesson 1: Thermoelectric Physics & Voltage Scaling
    function renderTempLesson1(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Thermoelectric Physics: Silicon Junction Voltage Scaling</strong>
        </div>
        <p class="task-instructions">
          Inside the tiny black TO-92 capsule, silicon diode junctions produce an electrical voltage that changes linearly with temperature: exactly 10 millivolts per 1°C. At freezing (0°C), it outputs a 500mV base offset. Test how physical temperatures map to voltages!
        </p>

        <div class="temp-studio-card">
          <div class="temp-meter-hero">
            <div class="temp-meter-display">
              <span id="temp-live-c" class="temp-val-celsius">25.0°C</span>
              <span id="temp-live-f" class="temp-val-fahr">(77.0°F)</span>
            </div>
            <div class="temp-status-badge comfort" id="temp-live-badge">
              <span>🌱</span> Ideal Climate
            </div>
          </div>

          <!-- Environmental Preset Chips -->
          <div style="margin-top: 0.5rem;">
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 0.35rem;">Real-World Thermal Environments:</span>
            <div class="preset-color-chips">
              <button class="preset-chip" data-temp="0.0"><span class="preset-chip-dot" style="background: #38bdf8;"></span> Freezing Ice (0°C / 500mV)</button>
              <button class="preset-chip" data-temp="15.0"><span class="preset-chip-dot" style="background: #06b6d4;"></span> Autumn Breeze (15°C / 650mV)</button>
              <button class="preset-chip" data-temp="25.0"><span class="preset-chip-dot" style="background: #10b981;"></span> Room Comfort (25°C / 750mV)</button>
              <button class="preset-chip" data-temp="37.0"><span class="preset-chip-dot" style="background: #f59e0b;"></span> Human Body (37°C / 870mV)</button>
              <button class="preset-chip" data-temp="50.0"><span class="preset-chip-dot" style="background: #ef4444;"></span> Desert Sun (50°C / 1000mV)</button>
            </div>
          </div>

          <div class="calc-step-row" style="margin-top: 0.5rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Sensor Output:</span>
              <span class="calc-step-val" id="temp-mv-val">750 mV</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">10-Bit ADC Raw:</span>
              <span class="calc-step-val" id="temp-raw-val">154 / 1023</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Silicon Scale:</span>
              <span class="calc-step-val" style="color: #f59e0b;">+10 mV / °C</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const mvVal = document.getElementById('temp-mv-val');
      const rawVal = document.getElementById('temp-raw-val');

      lessonInteractiveArea.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const t = parseFloat(chip.getAttribute('data-temp'));
          window.circuitSimulation.setTemperature(t);
          const v = (t / 100.0) + 0.5;
          const raw = Math.round((v / 5.0) * 1024);
          if (mvVal) mvVal.textContent = `${Math.round(v * 1000)} mV`;
          if (rawVal) rawVal.textContent = `${raw} / 1023`;
          if (window.soundEngine) window.soundEngine.playSuccess();
        });
      });

      window.circuitSimulation.setTemperature(25.0);
    }

    // Temp Lesson 2: The Two-Step Math Formula
    function renderTempLesson2(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 2</span>
          <strong>The Two-Step Mathematical Bridge: ADC ➔ Volts ➔ Celsius</strong>
        </div>
        <p class="task-instructions">
          Drag the thermal slider below. Observe how C++ calculates exact real-world temperature using two clean algebraic steps:
          <code style="color: #38bdf8;">float volts = (raw * 5.0) / 1024.0;</code> then
          <code style="color: #34d399;">float tempC = (volts - 0.5) * 100.0;</code>!
        </p>

        <div class="temp-studio-card">
          <div class="temp-meter-hero">
            <div class="temp-meter-display">
              <span id="temp-live-c" class="temp-val-celsius">25.0°C</span>
              <span id="temp-live-f" class="temp-val-fahr">(77.0°F)</span>
            </div>
            <div style="text-align: right; font-family: var(--font-code); font-size: 0.8rem; color: #94a3b8;">
              <div>Raw ADC Input: <span id="math-raw-val" style="color: #38bdf8; font-weight: 700;">154</span></div>
              <div>Pin A2: <span id="math-volt-val" style="color: #34d399; font-weight: 700;">0.750 V</span></div>
            </div>
          </div>

          <!-- Temperature Slider -->
          <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; font-family: var(--font-code); color: var(--text-muted); margin-bottom: 0.35rem;">
              <span>❄️ -10°C (Cold Frost)</span>
              <span>🔥 +60°C (Hot Desert)</span>
            </div>
            <input type="range" id="temp-math-slider" class="thermal-slider" min="-10" max="60" value="25" step="0.5">
          </div>

          <!-- Formula Step Breakdown -->
          <div class="calc-step-row" style="margin-top: 0.5rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Step 1: ADC to Volts</span>
              <span class="calc-step-val" id="math-step1-disp" style="font-size: 0.88rem; color: #38bdf8;">(154 * 5.0) / 1024 = 0.75V</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Step 2: Volts to Celsius</span>
              <span class="calc-step-val" id="math-step2-disp" style="font-size: 0.88rem; color: #34d399;">(0.75 - 0.5) * 100 = 25.0°C</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const slider = document.getElementById('temp-math-slider');
      const rawDisp = document.getElementById('math-raw-val');
      const voltDisp = document.getElementById('math-volt-val');
      const s1Disp = document.getElementById('math-step1-disp');
      const s2Disp = document.getElementById('math-step2-disp');

      function syncMath(temp) {
        window.circuitSimulation.setTemperature(temp);
        const v = (temp / 100.0) + 0.5;
        const raw = Math.round((v / 5.0) * 1024);

        if (rawDisp) rawDisp.textContent = raw;
        if (voltDisp) voltDisp.textContent = `${v.toFixed(3)} V`;
        if (s1Disp) s1Disp.textContent = `(${raw} * 5.0) / 1024 = ${v.toFixed(2)}V`;
        if (s2Disp) s2Disp.textContent = `(${v.toFixed(2)} - 0.5) * 100 = ${temp.toFixed(1)}°C`;
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          syncMath(parseFloat(e.target.value));
        });
      }

      syncMath(25.0);
    }

    // Temp Lesson 3: Critical Overheat Alarm
    function renderTempLesson3(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 3</span>
          <strong>Critical Overheat Alarms & Closed-Loop Safety Wardens</strong>
        </div>
        <p class="task-instructions">
          Protecting expensive lithium battery banks and computing hardware! Set the safety threshold setpoint below. Drag the temperature above the limit to watch Arduino trigger the Pin 13 warning LED and audio siren!
        </p>

        <div class="temp-studio-card">
          <div class="temp-meter-hero">
            <div class="temp-meter-display">
              <span id="temp-live-c" class="temp-val-celsius">34.5°C</span>
              <span id="temp-live-f" class="temp-val-fahr">(94.1°F)</span>
            </div>
            <div class="temp-status-badge overheat" id="overheat-alarm-badge">
              <span>🚨</span> OVERHEAT ALARM!
            </div>
          </div>

          <!-- Sliders: Ambient Temp vs Alarm Threshold -->
          <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.5rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; font-family: var(--font-code); color: #f59e0b; margin-bottom: 0.35rem;">
                <span>🌡️ Ambient Sensor Temperature:</span>
                <span id="alarm-live-temp-disp">34.5°C</span>
              </div>
              <input type="range" id="alarm-temp-slider" class="thermal-slider" min="15" max="50" value="34.5" step="0.5">
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; font-family: var(--font-code); color: #f43f5e; margin-bottom: 0.35rem;">
                <span>🚨 Safety Cutoff Setpoint (Threshold):</span>
                <span id="alarm-threshold-disp">30.0°C</span>
              </div>
              <input type="range" id="alarm-threshold-slider" min="20" max="45" value="30" step="1" style="width: 100%; accent-color: #f43f5e; height: 8px; border-radius: 4px; cursor: pointer;">
            </div>
          </div>

          <div class="calc-step-row" style="margin-top: 0.5rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Condition:</span>
              <span class="calc-step-val" id="alarm-condition-disp" style="font-size: 0.85rem; color: #f43f5e;">tempC > 30.0 (TRUE!)</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Pin 13 Warning Beacon:</span>
              <span class="calc-step-val" id="alarm-pin13-disp" style="color: #f43f5e;">HIGH (Active 🚨)</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Pin 8 Audio Siren:</span>
              <span class="calc-step-val" id="alarm-buzzer-disp" style="color: #f43f5e;">880 Hz TONE</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const tSlider = document.getElementById('alarm-temp-slider');
      const thSlider = document.getElementById('alarm-threshold-slider');
      const tDisp = document.getElementById('alarm-live-temp-disp');
      const thDisp = document.getElementById('alarm-threshold-disp');
      const badge = document.getElementById('overheat-alarm-badge');
      const condDisp = document.getElementById('alarm-condition-disp');
      const pinDisp = document.getElementById('alarm-pin13-disp');
      const buzDisp = document.getElementById('alarm-buzzer-disp');

      let curTemp = 34.5;
      let curThresh = 30.0;

      function syncAlarmUI() {
        window.circuitSimulation.setTempThreshold(curThresh);
        window.circuitSimulation.setTemperature(curTemp);

        const isOverheat = curTemp > curThresh;

        if (tDisp) tDisp.textContent = `${curTemp.toFixed(1)}°C`;
        if (thDisp) thDisp.textContent = `${curThresh.toFixed(1)}°C`;

        if (badge) {
          badge.className = isOverheat ? 'temp-status-badge overheat' : 'temp-status-badge comfort';
          badge.innerHTML = isOverheat ? '<span>🚨</span> OVERHEAT ALARM!' : '<span>🛡️</span> Normal Safe Zone';
        }

        if (condDisp) {
          condDisp.textContent = `${curTemp.toFixed(1)} > ${curThresh.toFixed(1)} (${isOverheat ? 'TRUE 🚨' : 'FALSE 🛡️'})`;
          condDisp.style.color = isOverheat ? '#f43f5e' : '#10b981';
        }

        if (pinDisp) {
          pinDisp.textContent = isOverheat ? 'HIGH (Active 🚨)' : 'LOW (Inactive)';
          pinDisp.style.color = isOverheat ? '#f43f5e' : '#64748b';
        }

        if (buzDisp) {
          buzDisp.textContent = isOverheat ? '880 Hz SIREN' : 'SILENT';
          buzDisp.style.color = isOverheat ? '#f43f5e' : '#64748b';
        }
      }

      if (tSlider) {
        tSlider.addEventListener('input', (e) => {
          curTemp = parseFloat(e.target.value);
          syncAlarmUI();
        });
      }

      if (thSlider) {
        thSlider.addEventListener('input', (e) => {
          curThresh = parseFloat(e.target.value);
          syncAlarmUI();
        });
      }

      syncAlarmUI();
    }

    // Temp Lesson 4: Smart Greenhouse HVAC Climate Studio
    function renderTempLesson4(lesson) {
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 4</span>
          <strong>Smart Greenhouse Climate Studio (Automated HVAC Control)</strong>
        </div>
        <p class="task-instructions">
          Take command of an automated greenhouse climate system! Drag the environmental temperature dial across the 24-hour growing cycle: when afternoon heat rises above 28°C, the cooling fan spins up via PWM Pin ~6 to protect the crops!
        </p>

        <div class="temp-studio-card">
          <div class="temp-meter-hero">
            <div class="temp-meter-display">
              <span id="temp-live-c" class="temp-val-celsius">35.0°C</span>
              <span id="temp-live-f" class="temp-val-fahr">(95.0°F)</span>
            </div>
            <div class="temp-status-badge warm" id="hvac-status-badge">
              <span>🌬️</span> Active Cooling Fan
            </div>
          </div>

          <!-- Environmental Temperature Dial -->
          <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; font-family: var(--font-code); color: #f59e0b; margin-bottom: 0.35rem;">
              <span>🌱 Greenhouse Ambient Temperature:</span>
              <span id="hvac-temp-disp">35.0°C</span>
            </div>
            <input type="range" id="hvac-temp-slider" class="thermal-slider" min="15" max="50" value="35" step="0.5">
          </div>

          <!-- HVAC Status Readouts -->
          <div class="calc-step-row" style="margin-top: 0.5rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Cooling Exhaust Fan:</span>
              <span class="calc-step-val" id="hvac-fan-disp" style="color: #38bdf8;">ACTIVE (180 / 255)</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Motor Duty Cycle:</span>
              <span class="calc-step-val" id="hvac-duty-disp" style="color: #38bdf8;">70.6% PWM (~6)</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Setpoint Rule:</span>
              <span class="calc-step-val" style="color: #10b981; font-size: 0.85rem;">Fan ON if &gt;28°C</span>
            </div>
          </div>
        </div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      const slider = document.getElementById('hvac-temp-slider');
      const tempDisp = document.getElementById('hvac-temp-disp');
      const fanDisp = document.getElementById('hvac-fan-disp');
      const dutyDisp = document.getElementById('hvac-duty-disp');
      const badge = document.getElementById('hvac-status-badge');

      function syncHvac(temp) {
        window.circuitSimulation.setTemperature(temp);

        if (tempDisp) tempDisp.textContent = `${temp.toFixed(1)}°C`;

        const isFanOn = temp > 28.0;
        const speed = isFanOn ? Math.max(100, Math.min(255, Math.round(((temp - 28.0) / 17.0) * 155 + 100))) : 0;
        const pct = Math.round((speed / 255.0) * 100);

        if (fanDisp) {
          fanDisp.textContent = isFanOn ? `ACTIVE (${speed} / 255)` : 'RESTING (0 / 255)';
          fanDisp.style.color = isFanOn ? '#38bdf8' : '#64748b';
        }

        if (dutyDisp) {
          dutyDisp.textContent = isFanOn ? `${pct}% PWM (~Pin 6)` : '0% (Conserving Energy)';
          dutyDisp.style.color = isFanOn ? '#38bdf8' : '#64748b';
        }

        if (badge) {
          if (temp > 35.0) {
            badge.className = 'temp-status-badge overheat';
            badge.innerHTML = '<span>🚨</span> High Heat Alert';
          } else if (temp > 28.0) {
            badge.className = 'temp-status-badge warm';
            badge.innerHTML = '<span>🌬️</span> Active Cooling Fan';
          } else {
            badge.className = 'temp-status-badge comfort';
            badge.innerHTML = '<span>🌱</span> Optimal Crop Climate';
          }
        }
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          syncHvac(parseFloat(e.target.value));
        });
      }

      syncHvac(35.0);
    }

    // =========================================================================
    // LED LAB INTERACTIVE TASKS (Preserved 100%)
    // =========================================================================

    function renderLedLesson1(lesson) {
      const act = lesson.sortingActivity;
      let html = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Morning Routine vs Continuous Loop</strong>
        </div>
        <p class="task-desc">${act.prompt}</p>
        <div class="sorter-zones">
          <div class="sorter-zone zone-setup" id="zone-setup">
            <div class="zone-header">
              <span class="icon">🌅</span>
              <strong>void setup()</strong>
              <small>(Done ONCE at startup)</small>
            </div>
            <div class="zone-slots" id="slots-setup"></div>
          </div>
          <div class="sorter-zone zone-loop" id="zone-loop">
            <div class="zone-header">
              <span class="icon">🔄</span>
              <strong>void loop()</strong>
              <small>(Repeated FOREVER)</small>
            </div>
            <div class="zone-slots" id="slots-loop"></div>
          </div>
        </div>
        <div class="sorter-pool" id="sorter-pool">
          ${act.items.map(item => `
            <div class="sorter-item ${state.ledSortingState[item.id] ? 'sorted' : ''}" data-id="${item.id}" id="item-${item.id}">
              <span>${item.text}</span>
              <div class="btn-group">
                <button class="sort-btn btn-to-setup" title="Place in setup()">Do Once</button>
                <button class="sort-btn btn-to-loop" title="Place in loop()">Repeat</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sorter-feedback" id="sorter-feedback"></div>
      </div>
    `;

      lessonInteractiveArea.innerHTML = html;

      act.items.forEach(item => {
        const itemEl = document.getElementById(`item-${item.id}`);
        if (!itemEl) return;
        const btnSetup = itemEl.querySelector('.btn-to-setup');
        const btnLoop = itemEl.querySelector('.btn-to-loop');

        btnSetup.addEventListener('click', () => handleLedSort(item, 'setup'));
        btnLoop.addEventListener('click', () => handleLedSort(item, 'loop'));
      });

      refreshLedSortedSlots();
    }

    function handleLedSort(item, chosenZone) {
      if (window.soundEngine) window.soundEngine.playClick();
      const isCorrect = item.target === chosenZone;
      state.ledSortingState[item.id] = { zone: chosenZone, correct: isCorrect, item };

      refreshLedSortedSlots();
      checkLedLesson1Completion();
    }

    function refreshLedSortedSlots() {
      const slotsSetup = document.getElementById('slots-setup');
      const slotsLoop = document.getElementById('slots-loop');
      if (!slotsSetup || !slotsLoop) return;

      slotsSetup.innerHTML = '';
      slotsLoop.innerHTML = '';

      Object.keys(state.ledSortingState).forEach(id => {
        const s = state.ledSortingState[id];
        const slotEl = document.createElement('div');
        slotEl.className = `sorted-pill ${s.correct ? 'correct' : 'incorrect'}`;
        slotEl.innerHTML = `
        <span>${s.item.text}</span>
        <span class="mark">${s.correct ? '✓' : '✗'}</span>
      `;
        if (s.zone === 'setup') {
          slotsSetup.appendChild(slotEl);
        } else {
          slotsLoop.appendChild(slotEl);
        }

        const poolItem = document.getElementById(`item-${id}`);
        if (poolItem) poolItem.style.display = 'none';
      });
    }

    function checkLedLesson1Completion() {
      const lesson = window.LED_LESSONS_DATA[0];
      const totalItems = lesson.sortingActivity.items.length;
      const sortedKeys = Object.keys(state.ledSortingState);

      if (sortedKeys.length === totalItems) {
        const allCorrect = sortedKeys.every(k => state.ledSortingState[k].correct);
        const feedback = document.getElementById('sorter-feedback');
        if (allCorrect) {
          state.ledLesson1Solved = true;
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          feedback.innerHTML = `
          <div class="feedback-success">
            🎉 <strong>Amazing work!</strong> You mastered the difference between <code>setup()</code> and <code>loop()</code>!
            Press <strong>⚡ Start Simulation</strong> below to test!
          </div>
        `;
        } else {
          feedback.innerHTML = `
          <div class="feedback-warning">
            🤔 Almost there! Things you do only ONCE go into <code>setup()</code>; things repeating forever go into <code>loop()</code>.
            <button class="btn btn-sm btn-outline" id="retry-led-sort-btn">Reset & Try Again</button>
          </div>
        `;
          document.getElementById('retry-led-sort-btn').addEventListener('click', () => {
            state.ledSortingState = {};
            renderLedLesson1(lesson);
          });
        }
      }
    }

    function renderLedLesson2(lesson) {
      const isClaimed = state.claimedPin === 13;
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Challenge: Claim Pin 13 on the Arduino</strong>
        </div>
        <p class="task-desc">
          Click <strong>Pin 13</strong> on the virtual Arduino board to claim it. 
          Then assign its job: <strong>OUTPUT (Megaphone)</strong> or <strong>INPUT (Ear)</strong>.
        </p>
        <div class="pin-claim-controls">
          <div class="pin-status-box ${isClaimed ? 'claimed' : 'unclaimed'}">
            <span class="badge">${isClaimed ? 'Pin 13 Claimed! 🎯' : 'Pin 13 Waiting for You ⏳'}</span>
            <div class="status-desc">
              ${isClaimed
          ? `You configured Pin 13 as an <strong>${state.pinRole}</strong>!`
          : `Click the blinking Pin 13 socket on the Arduino to claim it!`}
            </div>
          </div>
          <div class="role-selector ${isClaimed ? '' : 'disabled'}">
            <button class="btn role-btn ${state.pinRole === 'OUTPUT' ? 'active' : ''}" id="btn-role-output">
              📢 OUTPUT (Megaphone / Power)
            </button>
            <button class="btn role-btn ${state.pinRole === 'INPUT' ? 'active' : ''}" id="btn-role-input">
              👂 INPUT (Microphone / Ear)
            </button>
          </div>
        </div>
        <div id="pin-feedback"></div>
      </div>
    `;

      const btnOut = document.getElementById('btn-role-output');
      const btnIn = document.getElementById('btn-role-input');

      if (btnOut) {
        btnOut.addEventListener('click', () => {
          state.pinRole = 'OUTPUT';
          window.circuitSimulation.claimPin13(true);
          if (window.soundEngine) window.soundEngine.playSuccess();
          renderLedLesson2(lesson);
          renderCodeTranslator(lesson);
        });
      }

      if (btnIn) {
        btnIn.addEventListener('click', () => {
          state.pinRole = 'INPUT';
          window.circuitSimulation.claimPin13(false);
          renderLedLesson2(lesson);
          renderCodeTranslator(lesson);
        });
      }

      highlightPin13Header(true);
    }

    // Interactive Click on Pin 13
    if (unoPin13Header) {
      unoPin13Header.addEventListener('click', () => {
        if (state.activeLab === 'led' && state.activeLessonIndex === 1) {
          state.claimedPin = 13;
          state.pinRole = 'OUTPUT';
          window.circuitSimulation.claimPin13(true);
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          renderLedLesson2(window.LED_LESSONS_DATA[1]);
          renderCodeTranslator(window.LED_LESSONS_DATA[1]);
          const feedback = document.getElementById('pin-feedback');
          if (feedback) {
            feedback.innerHTML = `
            <div class="feedback-success">
              🎉 <strong>Pin 13 Claimed!</strong> You just taught Arduino: <code>pinMode(13, OUTPUT);</code>.
            </div>
          `;
          }
        }
      });
    }

    function highlightPin13Header(enable) {
      if (unoPin13Header) {
        unoPin13Header.classList.toggle('pulse-target', enable);
      }
    }

    function renderLedLesson3(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Step 1</span>
          <strong>Interactive Timing Lab: Change the Robot Stopwatch</strong>
        </div>
        <p class="task-desc">
          Type custom numbers into the delay inputs below (or choose a preset) and see the C++ code update instantly!
        </p>
        <div class="delay-control-grid">
          <div class="delay-input-box">
            <label for="input-delay-on">
              <span>💡 LED ON Time:</span>
              <strong id="display-delay-on">${state.delayOn} ms (${(state.delayOn / 1000).toFixed(2)} sec)</strong>
            </label>
            <div class="input-with-stepper">
              <input type="number" id="input-delay-on" min="50" max="5000" step="100" value="${state.delayOn}" />
              <span class="unit">ms</span>
            </div>
            <input type="range" id="range-delay-on" min="50" max="3000" step="50" value="${state.delayOn}" />
          </div>
          <div class="delay-input-box">
            <label for="input-delay-off">
              <span>🌑 LED OFF Time:</span>
              <strong id="display-delay-off">${state.delayOff} ms (${(state.delayOff / 1000).toFixed(2)} sec)</strong>
            </label>
            <div class="input-with-stepper">
              <input type="number" id="input-delay-off" min="50" max="5000" step="100" value="${state.delayOff}" />
              <span class="unit">ms</span>
            </div>
            <input type="range" id="range-delay-off" min="50" max="3000" step="50" value="${state.delayOff}" />
          </div>
        </div>
        <div class="presets-row">
          <span class="presets-label">⚡ Quick Rhythms:</span>
          ${lesson.presets.map(p => `
            <button class="preset-chip" data-on="${p.on}" data-off="${p.off}">
              ${p.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;

      const numOn = document.getElementById('input-delay-on');
      const rangeOn = document.getElementById('range-delay-on');
      const numOff = document.getElementById('input-delay-off');
      const rangeOff = document.getElementById('range-delay-off');

      const updateDelays = (onVal, offVal) => {
        state.delayOn = parseInt(onVal) || 1000;
        state.delayOff = parseInt(offVal) || 1000;
        window.circuitSimulation.setDelays(state.delayOn, state.delayOff);

        document.getElementById('display-delay-on').textContent = `${state.delayOn} ms (${(state.delayOn / 1000).toFixed(2)} sec)`;
        document.getElementById('display-delay-off').textContent = `${state.delayOff} ms (${(state.delayOff / 1000).toFixed(2)} sec)`;

        numOn.value = state.delayOn;
        rangeOn.value = state.delayOn;
        numOff.value = state.delayOff;
        rangeOff.value = state.delayOff;

        renderCodeTranslator(lesson);
        window.circuitSimulation.buildExecutionPlan();
      };

      numOn.addEventListener('input', (e) => updateDelays(e.target.value, state.delayOff));
      rangeOn.addEventListener('input', (e) => updateDelays(e.target.value, state.delayOff));
      numOff.addEventListener('input', (e) => updateDelays(state.delayOn, e.target.value));
      rangeOff.addEventListener('input', (e) => updateDelays(state.delayOn, e.target.value));

      document.querySelectorAll('.preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          const on = parseInt(btn.getAttribute('data-on'));
          const off = parseInt(btn.getAttribute('data-off'));
          updateDelays(on, off);
        });
      });
    }

    function renderLedLesson4(lesson) {
      lessonInteractiveArea.innerHTML = `
      <div class="task-card">
        <div class="task-title">
          <span class="step-num">Sandbox</span>
          <strong>Free Inventor's Studio: Timing & Rhythm Choreography</strong>
        </div>
        <p class="task-desc">
          Test custom blink choreography! This sequence demonstrates a double-pulse heartbeat.
          Choose a rhythm preset below or press <strong>⚡ Start Simulation</strong> to see the logic oscilloscope graph it in real time!
        </p>
        <div class="presets-row" style="margin-top: 10px;">
          <span class="presets-label">⚡ Choreography Presets:</span>
          <button class="preset-chip ${(!state.ledSandboxSeq || state.ledSandboxSeq === 'heartbeat') ? 'active' : ''}" data-seq="heartbeat">Heartbeat (300/800ms)</button>
          <button class="preset-chip ${state.ledSandboxSeq === 'sos' ? 'active' : ''}" data-seq="sos">Morse SOS (200/600ms)</button>
          <button class="preset-chip ${state.ledSandboxSeq === 'strobe' ? 'active' : ''}" data-seq="strobe">Strobe (80ms)</button>
          <button class="preset-chip ${state.ledSandboxSeq === 'slow' ? 'active' : ''}" data-seq="slow">Beacon (1200ms)</button>
        </div>
      </div>
    `;

      document.querySelectorAll('.preset-chip[data-seq]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          document.querySelectorAll('.preset-chip[data-seq]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.ledSandboxSeq = btn.getAttribute('data-seq');
          renderCodeTranslator(lesson);
          window.circuitSimulation.buildExecutionPlan();
        });
      });
    }

    // =========================================================================
    // DUAL-PANEL CODE TRANSLATOR (Human Plain English vs Arduino C++)
    // =========================================================================

    function renderCodeTranslator(lesson) {
      const humanLines = getDynamicHumanCode(lesson);
      const cppLines = getDynamicCppCode(lesson);

      plainEnglishCodeEl.innerHTML = humanLines.map((row, idx) => `
      <div class="code-row code-row-human" data-line="${idx}" data-tag="${row.tag}">
        <span class="line-num">${idx + 1}</span>
        <span class="line-content indent-${row.indent}">${row.text}</span>
      </div>
    `).join('');

      cppCodeEl.innerHTML = cppLines.map((row, idx) => `
      <div class="code-row code-row-cpp" data-line="${idx}" data-tag="${row.tag}">
        <span class="line-num">${idx + 1}</span>
        <span class="line-content indent-${row.indent}">${formatCppSyntax(row.text)}</span>
      </div>
    `).join('');

      // Cross-hover sync between Plain English and C++ rows
      document.querySelectorAll('.code-row').forEach(row => {
        row.addEventListener('mouseenter', () => {
          const line = row.getAttribute('data-line');
          document.querySelectorAll(`.code-row[data-line="${line}"]`).forEach(r => r.classList.add('sync-hover'));
        });
        row.addEventListener('mouseleave', () => {
          const line = row.getAttribute('data-line');
          document.querySelectorAll(`.code-row[data-line="${line}"]`).forEach(r => r.classList.remove('sync-hover'));
        });
      });
    }

    function getDynamicHumanCode(lesson) {
      if (state.activeLab === 'servo') {
        if (lesson.id === 2) {
          return [
            { line: 1, indent: 0, tag: "include", text: "1. Borrow the official Servo instruction kit;" },
            { line: 2, indent: 0, tag: "object", text: "2. Create our robot arm named myServo;" },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
            {
              line: 5, indent: 1, tag: "attach", text: state.servoAttached
                ? "    Attach myServo signal wire to PWM Pin 9;"
                : "    [Click Pin ~9 on the Arduino to attach control line!]"
            },
            { line: 6, indent: 0, tag: "blank", text: "" },
            { line: 7, indent: 0, tag: "header", text: "REPEAT FOREVER:" },
            { line: 8, indent: 1, tag: "comment", text: "    (Pin 9 is actively transmitting hold pulses...)" }
          ];
        } else if (lesson.id === 3) {
          return [
            { line: 1, indent: 0, tag: "include", text: "1. Borrow the official Servo instruction kit;" },
            { line: 2, indent: 0, tag: "object", text: "2. Create our robot arm named myServo;" },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
            { line: 5, indent: 1, tag: "attach", text: "    Attach myServo signal wire to PWM Pin 9;" },
            { line: 6, indent: 0, tag: "blank", text: "" },
            { line: 7, indent: 0, tag: "header", text: "REPEAT FOREVER (Angle Dance):" },
            { line: 8, indent: 1, tag: "writeAngle1", text: `    1. Turn servo arm to [${state.servoAngle1}] degrees;` },
            { line: 9, indent: 1, tag: "delay1", text: `    2. Freeze and hold for [${state.servoDelay}] milliseconds;` },
            { line: 10, indent: 1, tag: "writeAngle2", text: `    3. Turn servo arm to [${state.servoAngle2}] degrees;` },
            { line: 11, indent: 1, tag: "delay2", text: `    4. Freeze and hold for [${state.servoDelay}] milliseconds;` }
          ];
        }
      } else if (state.activeLab === 'led') {
        if (lesson.id === 2) {
          return [
            { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
            {
              line: 2, indent: 1, tag: "pinMode", text: state.claimedPin === 13
                ? `    Tell Pin 13 to act like a Megaphone (${state.pinRole});`
                : `    [Click Pin 13 on the board to claim it!]`
            },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER:" },
            { line: 5, indent: 1, tag: "comment", text: "    (Ready for blinking commands...)" }
          ];
        } else if (lesson.id === 3) {
          return [
            { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
            { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (The Blink Dance):" },
            { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 power ON (Send 5 Volts);" },
            { line: 6, indent: 1, tag: "delayOn", text: `    2. Freeze and wait for [${state.delayOn}] milliseconds;` },
            { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 power OFF (0 Volts);" },
            { line: 8, indent: 1, tag: "delayOff", text: `    4. Freeze and wait for [${state.delayOff}] milliseconds;` }
          ];
        } else if (lesson.id === 4) {
          const seq = state.ledSandboxSeq || 'heartbeat';
          if (seq === 'sos') {
            return [
              { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
              { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
              { line: 3, indent: 0, tag: "blank", text: "" },
              { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (Morse Code SOS):" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 ON;" },
              { line: 6, indent: 1, tag: "delay1", text: "    2. Freeze for [200] ms (Dot);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 OFF;" },
              { line: 8, indent: 1, tag: "delay2", text: "    4. Freeze for [200] ms;" },
              { line: 9, indent: 1, tag: "writeHigh", text: "    5. Turn Pin 13 ON;" },
              { line: 10, indent: 1, tag: "delay3", text: "    6. Freeze for [600] ms (Dash);" },
              { line: 11, indent: 1, tag: "writeLow", text: "    7. Turn Pin 13 OFF;" },
              { line: 12, indent: 1, tag: "delay4", text: "    8. Freeze for [600] ms;" }
            ];
          } else if (seq === 'strobe') {
            return [
              { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
              { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
              { line: 3, indent: 0, tag: "blank", text: "" },
              { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (Emergency Strobe):" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 ON;" },
              { line: 6, indent: 1, tag: "delay1", text: "    2. Freeze for [80] ms (Rapid flash);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 OFF;" },
              { line: 8, indent: 1, tag: "delay2", text: "    4. Freeze for [80] ms;" }
            ];
          } else if (seq === 'slow') {
            return [
              { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
              { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
              { line: 3, indent: 0, tag: "blank", text: "" },
              { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (Lighthouse Beacon):" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 ON;" },
              { line: 6, indent: 1, tag: "delay1", text: "    2. Freeze for [1200] ms (Beacon beam);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 OFF;" },
              { line: 8, indent: 1, tag: "delay2", text: "    4. Freeze for [1200] ms;" }
            ];
          } else {
            return [
              { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
              { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
              { line: 3, indent: 0, tag: "blank", text: "" },
              { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (Heartbeat Sequence):" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 ON;" },
              { line: 6, indent: 1, tag: "delay1", text: "    2. Freeze for [300] ms;" },
              { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 OFF;" },
              { line: 8, indent: 1, tag: "delay2", text: "    4. Freeze for [300] ms;" },
              { line: 9, indent: 1, tag: "writeHigh", text: "    5. Turn Pin 13 ON;" },
              { line: 10, indent: 1, tag: "delay3", text: "    6. Freeze for [800] ms (Long pulse);" },
              { line: 11, indent: 1, tag: "writeLow", text: "    7. Turn Pin 13 OFF;" },
              { line: 12, indent: 1, tag: "delay4", text: "    8. Freeze for [500] ms;" }
            ];
          }
        }
      }
      const rawHuman = (lesson.defaultCode && (lesson.defaultCode.human || lesson.defaultCode.plainEnglish)) || lesson.human || lesson.plainEnglish;
      if (rawHuman) {
        if (Array.isArray(rawHuman)) {
          return rawHuman;
        }
        if (typeof rawHuman === 'string') {
          return rawHuman.split('\n').map((line, idx) => ({
            id: `h${idx + 1}`,
            line: idx + 1,
            text: line,
            indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
            tag: 'code'
          }));
        }
      }
      if (lesson.explanation && Array.isArray(lesson.explanation)) {
        return lesson.explanation.map((e, idx) => ({
          id: `h${idx + 1}`,
          line: idx + 1,
          text: `// ${e.plainEnglish}`,
          indent: 0,
          tag: 'explanation'
        }));
      }
      return [{ id: 'h1', line: 1, text: '// Human explanation', indent: 0, tag: 'header' }];
    }

    function getDynamicCppCode(lesson) {
      if (state.activeLab === 'servo') {
        if (lesson.id === 2) {
          return [
            { line: 1, indent: 0, tag: "include", text: "#include <Servo.h>" },
            { line: 2, indent: 0, tag: "object", text: "Servo myServo;" },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "void setup() {" },
            {
              line: 5, indent: 1, tag: "attach", text: state.servoAttached
                ? "    myServo.attach(9);"
                : "    // Click Pin ~9 to attach servo!"
            },
            { line: 6, indent: 0, tag: "brace", text: "}" },
            { line: 7, indent: 0, tag: "header", text: "void loop() {" },
            { line: 8, indent: 1, tag: "comment", text: "    // Pin 9 is actively transmitting PWM pulses" },
            { line: 9, indent: 0, tag: "brace", text: "}" }
          ];
        } else if (lesson.id === 3) {
          return [
            { line: 1, indent: 0, tag: "include", text: "#include <Servo.h>" },
            { line: 2, indent: 0, tag: "object", text: "Servo myServo;" },
            { line: 3, indent: 0, tag: "blank", text: "" },
            { line: 4, indent: 0, tag: "header", text: "void setup() {" },
            { line: 5, indent: 1, tag: "attach", text: "    myServo.attach(9);" },
            { line: 6, indent: 0, tag: "brace", text: "}" },
            { line: 7, indent: 0, tag: "header", text: "void loop() {" },
            { line: 8, indent: 1, tag: "writeAngle1", text: `    myServo.write(${state.servoAngle1});` },
            { line: 9, indent: 1, tag: "delay1", text: `    delay(${state.servoDelay});` },
            { line: 10, indent: 1, tag: "writeAngle2", text: `    myServo.write(${state.servoAngle2});` },
            { line: 11, indent: 1, tag: "delay2", text: `    delay(${state.servoDelay});` },
            { line: 12, indent: 0, tag: "brace", text: "}" }
          ];
        }
      } else if (state.activeLab === 'led') {
        if (lesson.id === 2) {
          return [
            { line: 1, indent: 0, tag: "header", text: "void setup() {" },
            {
              line: 2, indent: 1, tag: "pinMode", text: state.claimedPin === 13
                ? `    pinMode(13, ${state.pinRole});`
                : `    // Click Pin 13 to set pinMode`
            },
            { line: 3, indent: 0, tag: "brace", text: "}" },
            { line: 4, indent: 0, tag: "header", text: "void loop() {" },
            { line: 5, indent: 1, tag: "comment", text: "    // Pin 13 is configured and ready!" },
            { line: 6, indent: 0, tag: "brace", text: "}" }
          ];
        } else if (lesson.id === 3) {
          return [
            { line: 1, indent: 0, tag: "header", text: "void setup() {" },
            { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
            { line: 3, indent: 0, tag: "brace", text: "}" },
            { line: 4, indent: 0, tag: "header", text: "void loop() {" },
            { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
            { line: 6, indent: 1, tag: "delayOn", text: `    delay(${state.delayOn});` },
            { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
            { line: 8, indent: 1, tag: "delayOff", text: `    delay(${state.delayOff});` },
            { line: 9, indent: 0, tag: "brace", text: "}" }
          ];
        } else if (lesson.id === 4) {
          const seq = state.ledSandboxSeq || 'heartbeat';
          if (seq === 'sos') {
            return [
              { line: 1, indent: 0, tag: "header", text: "void setup() {" },
              { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
              { line: 3, indent: 0, tag: "brace", text: "}" },
              { line: 4, indent: 0, tag: "header", text: "void loop() {" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 6, indent: 1, tag: "delay1", text: "    delay(200);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 8, indent: 1, tag: "delay2", text: "    delay(200);" },
              { line: 9, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 10, indent: 1, tag: "delay3", text: "    delay(600);" },
              { line: 11, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 12, indent: 1, tag: "delay4", text: "    delay(600);" },
              { line: 13, indent: 0, tag: "brace", text: "}" }
            ];
          } else if (seq === 'strobe') {
            return [
              { line: 1, indent: 0, tag: "header", text: "void setup() {" },
              { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
              { line: 3, indent: 0, tag: "brace", text: "}" },
              { line: 4, indent: 0, tag: "header", text: "void loop() {" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 6, indent: 1, tag: "delay1", text: "    delay(80);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 8, indent: 1, tag: "delay2", text: "    delay(80);" },
              { line: 9, indent: 0, tag: "brace", text: "}" }
            ];
          } else if (seq === 'slow') {
            return [
              { line: 1, indent: 0, tag: "header", text: "void setup() {" },
              { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
              { line: 3, indent: 0, tag: "brace", text: "}" },
              { line: 4, indent: 0, tag: "header", text: "void loop() {" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 6, indent: 1, tag: "delay1", text: "    delay(1200);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 8, indent: 1, tag: "delay2", text: "    delay(1200);" },
              { line: 9, indent: 0, tag: "brace", text: "}" }
            ];
          } else {
            return [
              { line: 1, indent: 0, tag: "header", text: "void setup() {" },
              { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
              { line: 3, indent: 0, tag: "brace", text: "}" },
              { line: 4, indent: 0, tag: "header", text: "void loop() {" },
              { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 6, indent: 1, tag: "delay1", text: "    delay(300);" },
              { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 8, indent: 1, tag: "delay2", text: "    delay(300);" },
              { line: 9, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
              { line: 10, indent: 1, tag: "delay3", text: "    delay(800);" },
              { line: 11, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
              { line: 12, indent: 1, tag: "delay4", text: "    delay(500);" },
              { line: 13, indent: 0, tag: "brace", text: "}" }
            ];
          }
        }
      }
      const rawCpp = (lesson.defaultCode && (lesson.defaultCode.cpp || lesson.defaultCode.cplusplus)) || lesson.code || lesson.cplusplus;
      if (rawCpp) {
        if (Array.isArray(rawCpp)) return rawCpp;
        if (typeof rawCpp === 'string') {
          return rawCpp.split('\n').map((line, idx) => ({
            id: `c${idx + 1}`,
            line: idx + 1,
            text: line,
            indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
            tag: 'code'
          }));
        }
      }
      return [{ id: 'c1', line: 1, text: '// Arduino C++', indent: 0, tag: 'code' }];
    }

    function formatCppSyntax(codeLine) {
      let escaped = codeLine
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // C++ Keywords & Library Token Highlighting
      escaped = escaped.replace(/(#include\s+&lt;Servo\.h&gt;)/g, '<span class="token-keyword">#include</span> &lt;<span class="token-builtin">Servo.h</span>&gt;');
      escaped = escaped.replace(/\b(Servo)\b/g, '<span class="token-builtin">$1</span>');
      escaped = escaped.replace(/\b(myServo)\b/g, '<span class="token-function-name">$1</span>');
      escaped = escaped.replace(/\b(attach|write)\b/g, '<span class="token-builtin">$1</span>');
      escaped = escaped.replace(/\b(void|int|for)\b/g, '<span class="token-keyword">$1</span>');
      escaped = escaped.replace(/\b(setup|loop)\b/g, '<span class="token-function-name">$1</span>');
      escaped = escaped.replace(/\b(pinMode|digitalWrite|delay)\b/g, '<span class="token-builtin">$1</span>');
      escaped = escaped.replace(/\b(OUTPUT|INPUT|HIGH|LOW)\b/g, '<span class="token-constant">$1</span>');
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
      escaped = escaped.replace(/(\/\/.*$)/g, '<span class="token-comment">$1</span>');
      escaped = escaped.replace(/([;{}()])/g, '<span class="token-punct">$1</span>');

      return escaped;
    }

    // =========================================================================
    // TEACHER MODE INSIGHTS & MASTER PLAN GUIDE
    // =========================================================================

    function renderTeacherInsights() {
      const existingOverlays = document.querySelectorAll('.teacher-insight-badge');
      existingOverlays.forEach(b => b.remove());

      if (!state.teacherMode) return;

      const lessons = getCurrentLessons();
      const lesson = lessons[state.activeLessonIndex];
      if (!lesson || !lesson.teacherMode) return;

      const tData = lesson.teacherMode;
      const badgeHtml = `
      <div class="teacher-insight-badge">
        <div class="teacher-badge-header">
          <span class="icon">🎓</span>
          <strong>Educator Insight: ${tData.pedagogyTitle}</strong>
        </div>
        <p class="teacher-pedagogy">${tData.pedagogy}</p>
        <div class="teacher-misconceptions">
          <strong>⚠️ Watch Out for These Misconceptions:</strong>
          <ul>
            ${tData.misconceptions.map(m => `
              <li><strong>${m.title}:</strong> ${m.detail}</li>
            `).join('')}
          </ul>
        </div>
        <div class="teacher-standards">
          <small><strong>Standards:</strong> ${tData.standards.join(' | ')}</small>
        </div>
      </div>
    `;

      analogyCard.insertAdjacentHTML('afterend', badgeHtml);
    }

    function openTeacherGuide() {
      if (!teacherModal) return;
      if (window.soundEngine) window.soundEngine.playClick();

      const lessons = getCurrentLessons();
      const lesson = lessons[state.activeLessonIndex];
      const t = lesson.teacherMode;

      const contentEl = document.getElementById('teacher-modal-content');
      contentEl.innerHTML = `
      <div class="teacher-guide-sheet">
        <div class="guide-banner">
          <h2>🎓 Teacher Master Plan: ${lesson.title}</h2>
          <p>Curriculum design, cognitive load management, and discussion triggers for Middle School STEM (Grades 7–8).</p>
        </div>
        
        <div class="guide-section">
          <h3>🧠 Cognitive Science & Metaphor Alignment</h3>
          <p>${t.pedagogy}</p>
        </div>

        <div class="guide-section">
          <h3>⚠️ Anticipated Student Misconceptions & Intervention</h3>
          <div class="misconception-cards">
            ${t.misconceptions.map(m => `
              <div class="m-card">
                <div class="m-title">❌ ${m.title}</div>
                <div class="m-body">💡 <strong>Teacher Tip:</strong> ${m.detail}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="guide-section">
          <h3>💬 Socratic Discussion Questions (Classroom Prompts)</h3>
          <ul class="prompt-list">
            ${t.discussionPrompts.map(p => `<li>🗣️ "${p}"</li>`).join('')}
          </ul>
        </div>

        <div class="guide-section">
          <h3>📜 Standards Alignment (CSTA & NGSS)</h3>
          <ul>
            ${t.standards.map(s => `<li>✓ ${s}</li>`).join('')}
          </ul>
        </div>

        <div class="guide-section">
          <h3>⏱️ Suggested 15-Minute Lesson Flow</h3>
          <ol class="flow-steps">
            <li><strong>Minutes 0-3:</strong> Introduce the physical analogy (Specialized library kit, 3-wire highway, Steering wheel protractor).</li>
            <li><strong>Minutes 3-7:</strong> Have students interact with the Code Translator side-by-side to notice the exact 1:1 translation.</li>
            <li><strong>Minutes 7-12:</strong> Students run simulation, manipulate angle slider, observe live horn movement and oscilloscope pulse.</li>
            <li><strong>Minutes 12-15:</strong> Formative check using the socratic discussion questions above.</li>
          </ol>
        </div>
      </div>
    `;

      teacherModal.classList.remove('hidden');
    }


    // =========================================================================
    // INTERACTIVE SVG CIRCUIT ACTIONS (Direct Breadboard / Component Clicks)
    // =========================================================================

    // Direct Click on Tactile Pushbutton on Circuit Stage
    if (tactilePushbuttonUnit) {
      const onBtnDown = (e) => {
        if (state.activeLab !== 'button') return;
        e.preventDefault();
        if (state.buttonMode === 'toggle') {
          window.circuitSimulation.setButtonPressed(true);
          setTimeout(() => window.circuitSimulation.setButtonPressed(false), 150);
        } else {
          window.circuitSimulation.setButtonPressed(true);
        }
      };

      const onBtnUp = (e) => {
        if (state.activeLab !== 'button') return;
        e.preventDefault();
        if (state.buttonMode !== 'toggle') {
          window.circuitSimulation.setButtonPressed(false);
        }
      };

      tactilePushbuttonUnit.addEventListener('mousedown', onBtnDown);
      tactilePushbuttonUnit.addEventListener('mouseup', onBtnUp);
      tactilePushbuttonUnit.addEventListener('mouseleave', onBtnUp);
      tactilePushbuttonUnit.addEventListener('touchstart', onBtnDown);
      tactilePushbuttonUnit.addEventListener('touchend', onBtnUp);
    }

    // Direct Drag on Potentiometer Knob on Circuit Stage
    if (potKnobGroup) {
      let isDraggingPot = false;
      let startY = 0;
      let startVal = 512;

      potKnobGroup.addEventListener('mousedown', (e) => {
        if (state.activeLab !== 'pot') return;
        isDraggingPot = true;
        startY = e.clientY;
        startVal = state.potVal;
        document.body.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingPot) return;
        const dy = startY - e.clientY; // dragging up increases value
        const newVal = Math.max(0, Math.min(1023, Math.round(startVal + dy * 4)));
        state.potVal = newVal;
        window.circuitSimulation.setPotValue(newVal, true);

        // Also sync active sliders if present
        const potSlider = document.getElementById('pot-interactive-slider')
          || document.getElementById('map-interactive-slider')
          || document.getElementById('studio-steering-slider');
        if (potSlider) potSlider.value = newVal;
      });

      window.addEventListener('mouseup', () => {
        if (isDraggingPot) {
          isDraggingPot = false;
          document.body.style.cursor = 'default';
        }
      });
    }

    // Direct Click on Circuit Stage Piezo Transducer
    if (piezoBuzzerUnit) {
      piezoBuzzerUnit.addEventListener('click', () => {
        if (state.activeLab !== 'buzzer') return;
        window.circuitSimulation.setBuzzerTone(880, 250);
        setTimeout(() => {
          window.circuitSimulation.stopBuzzer();
        }, 260);
      });
    }

    // Global Keyboard Listener for Piano (1-8 and notes)
    const pianoKeyMap = {
      '1': { key: '1', note: 'C4', solfege: 'Do', freq: 262 },
      '2': { key: '2', note: 'D4', solfege: 'Re', freq: 294 },
      '3': { key: '3', note: 'E4', solfege: 'Mi', freq: 330 },
      '4': { key: '4', note: 'F4', solfege: 'Fa', freq: 349 },
      '5': { key: '5', note: 'G4', solfege: 'Sol', freq: 392 },
      '6': { key: '6', note: 'A4', solfege: 'La', freq: 440 },
      '7': { key: '7', note: 'B4', solfege: 'Ti', freq: 494 },
      '8': { key: '8', note: 'C5', solfege: 'Do', freq: 523 },
      'c': { key: '1', note: 'C4', solfege: 'Do', freq: 262 },
      'd': { key: '2', note: 'D4', solfege: 'Re', freq: 294 },
      'e': { key: '3', note: 'E4', solfege: 'Mi', freq: 330 },
      'f': { key: '4', note: 'F4', solfege: 'Fa', freq: 349 },
      'g': { key: '5', note: 'G4', solfege: 'Sol', freq: 392 },
      'a': { key: '6', note: 'A4', solfege: 'La', freq: 440 },
      'b': { key: '7', note: 'B4', solfege: 'Ti', freq: 494 }
    };

    let activePianoKeyPressed = null;

    window.addEventListener('keydown', (e) => {
      if (state.activeLab !== 'buzzer' || state.activeLessonIndex !== 3) return;
      if (e.repeat || activePianoKeyPressed) return;
      const char = e.key.toLowerCase();
      const match = pianoKeyMap[char];
      if (match) {
        activePianoKeyPressed = char;
        const el = document.getElementById(`pkey-${match.key}`);
        if (el) el.classList.add('playing');
        const liveNoteEl = document.getElementById('piano-live-note');
        if (liveNoteEl) {
          liveNoteEl.innerHTML = `<span style="color: #34d399;">${match.note} (${match.solfege})</span> &bull; <strong>${match.freq} Hz</strong>`;
        }
        window.circuitSimulation.setBuzzerTone(match.freq, 0);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (state.activeLab !== 'buzzer' || state.activeLessonIndex !== 3) return;
      const char = e.key.toLowerCase();
      if (activePianoKeyPressed === char) {
        const match = pianoKeyMap[char];
        if (match) {
          const el = document.getElementById(`pkey-${match.key}`);
          if (el) el.classList.remove('playing');
        }
        const liveNoteEl = document.getElementById('piano-live-note');
        if (liveNoteEl) liveNoteEl.textContent = 'Rest (Silent)';
        window.circuitSimulation.stopBuzzer();
        activePianoKeyPressed = null;
      }
    });

    // Direct Click on Circuit Stage LDR Sensor (Cast hand shadow / shine light)
    if (ldrSensorUnit) {
      let shadowActive = false;
      ldrSensorUnit.addEventListener('click', () => {
        if (state.activeLab !== 'ldr') return;
        shadowActive = !shadowActive;
        const raw = shadowActive ? 180 : 750;
        state.ldrRaw = raw;
        window.circuitSimulation.setLdrValue(raw);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    // Direct Click on Circuit Stage RGB LED Bulb (Cycle Optical Colors)
    if (rgbLedBulb) {
      const cycleColors = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 255, b: 0 },
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 255, g: 255, b: 255 }
      ];
      let cycleIdx = 0;
      rgbLedBulb.addEventListener('click', () => {
        if (state.activeLab !== 'rgb') return;
        cycleIdx = (cycleIdx + 1) % cycleColors.length;
        const c = cycleColors[cycleIdx];
        window.circuitSimulation.setRgb(c.r, c.g, c.b);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    // Direct Click on Circuit Stage TMP36 Sensor Unit (Cycle Temperatures)
    if (tmp36SensorUnit) {
      const cycleTemps = [0.0, 15.0, 25.0, 34.5, 48.0];
      let tempIdx = 2; // start at 25.0
      tmp36SensorUnit.addEventListener('click', () => {
        if (state.activeLab !== 'temp') return;
        tempIdx = (tempIdx + 1) % cycleTemps.length;
        const t = cycleTemps[tempIdx];
        window.circuitSimulation.setTemperature(t);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    // --- Confetti Celebration ---
    function launchConfetti() {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);

      const colors = ['#22d3ee', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'];

      for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.top = `-20px`;
        piece.style.animationDelay = `${Math.random() * 0.4}s`;
        piece.style.animationDuration = `${1.2 + Math.random() * 1}s`;
        container.appendChild(piece);
      }

      setTimeout(() => {
        container.remove();
      }, 2500);
    }

    function checkVerification(conditionName) {
      if (!state.completedTasks) {
        state.completedTasks = {};
      }
      state.completedTasks[conditionName] = true;
      if (window.soundEngine) window.soundEngine.playSuccess();
      launchConfetti();
    }

    // =========================================================================
    // LAB 9: HC-SR04 ULTRASONIC SENSOR & RADAR INTERACTIVE RENDERERS
    // =========================================================================

    function renderSonarLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 33</span>
          <h3>Transducer Echolocation & 10µs Ping</h3>
        </div>
        <p class="instruction-text">
          Click <strong>Fire Sonic Ping</strong> to instruct the microcontroller to pulse Pin 12 HIGH for 10 microseconds. 
          Observe the high-frequency acoustic wave ripples on the hardware stage and watch the echo return!
        </p>
        <div class="action-btn-row">
          <button class="primary-btn" id="btn-sonar-ping">
            <span>🦇</span> Fire 10µs Sonic Ping
          </button>
        </div>
        <div id="sonar-ping-feedback" class="status-banner" style="display:none; margin-top:0.75rem;">
          <span class="icon">✅</span>
          <span class="text">Ultrasound pulse fired! 8 cycles of 40kHz sound blasted into the air at 343 m/s!</span>
        </div>
      </div>
    `;

      const btn = document.getElementById('btn-sonar-ping');
      const fb = document.getElementById('sonar-ping-feedback');
      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playTone(2800, 0.08);
          window.circuitSimulation.fireSonarPing();
          if (fb) fb.style.display = 'flex';
          checkVerification('sonarPingFired');
        });
      }
    }

    function renderSonarLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curDist = hw.sonarDistanceCm || 35.0;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 34</span>
          <h3>Measuring Microsecond Flight Time with pulseIn()</h3>
        </div>
        <p class="instruction-text">
          Drag the target slider to move the barrier closer or farther away. Notice how the Echo pulse width on the oscilloscope 
          stretches directly with distance!
        </p>
        <div class="sonar-studio-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">OBSTACLE DISTANCE:</span>
            <span id="sonar-slider-val" style="font-family:var(--font-code); font-weight:800; font-size:1.15rem; color:#06b6d4;">${curDist.toFixed(1)} cm</span>
          </div>
          <input type="range" class="sonar-slider" id="sonar-dist-slider-l2" min="5" max="150" step="1" value="${curDist}" />
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.5rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Echo Pulse Duration:</span>
              <span class="calc-step-val" id="sonar-dur-val-l2">${Math.round(curDist * 58.2)} µs</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">One-Way Travel:</span>
              <span class="calc-step-val" id="sonar-oneway-val-l2">${(curDist * 58.2 / 2).toFixed(1)} µs</span>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-sonar-capture">
            <span>⏱️</span> Capture Echo Pulse
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('sonar-dist-slider-l2');
      const valSpan = document.getElementById('sonar-slider-val');
      const durSpan = document.getElementById('sonar-dur-val-l2');
      const oneWaySpan = document.getElementById('sonar-oneway-val-l2');
      const btn = document.getElementById('btn-sonar-capture');

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          window.circuitSimulation.setSonarDistance(val);
          if (valSpan) valSpan.textContent = `${val.toFixed(1)} cm`;
          const dur = Math.round(val * 58.2);
          if (durSpan) durSpan.textContent = `${dur} µs`;
          if (oneWaySpan) oneWaySpan.textContent = `${(dur / 2).toFixed(1)} µs`;
        });
      }

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playTone(1800, 0.1);
          window.circuitSimulation.fireSonarPing();
          checkVerification('sonarEchoCaptured');
        });
      }
    }

    function renderSonarLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curDist = hw.sonarDistanceCm || 24.5;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 35</span>
          <h3>Acoustic Math: The 58.2 Speed of Sound Formula</h3>
        </div>
        <p class="instruction-text">
          Adjust the obstacle distance. Test extreme close and far distances to verify that the Arduino formula computes metric cm and imperial inches with 100% precision!
        </p>
        <div class="sonar-studio-card">
          <input type="range" class="sonar-slider" id="sonar-dist-slider-l3" min="4" max="120" step="0.5" value="${curDist}" />
          
          <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:0.85rem; font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">
            <div style="color:var(--text-muted);">// Arduino C++ Distance Computation</div>
            <div><span style="color:#f43f5e;">long</span> duration = <span id="math-dur-token" style="color:#f59e0b;">${Math.round(curDist * 58.2)}</span>; <span style="color:#64748b;">// µs</span></div>
            <div><span style="color:#f43f5e;">float</span> cm = duration / <span style="color:#22d3ee;">58.2</span>; ➔ <span id="math-cm-token" style="color:#22c55e; font-weight:800;">${curDist.toFixed(1)} cm</span></div>
            <div><span style="color:#f43f5e;">float</span> in = cm / <span style="color:#22d3ee;">2.54</span>; ➔ <span id="math-in-token" style="color:#a855f7; font-weight:800;">${(curDist / 2.54).toFixed(1)} in</span></div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-sonar-math">
            <span>📐</span> Verify Distance Calculation
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('sonar-dist-slider-l3');
      const durTok = document.getElementById('math-dur-token');
      const cmTok = document.getElementById('math-cm-token');
      const inTok = document.getElementById('math-in-token');
      const btn = document.getElementById('btn-sonar-math');

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          window.circuitSimulation.setSonarDistance(val);
          const dur = Math.round(val * 58.2);
          if (durTok) durTok.textContent = `${dur}`;
          if (cmTok) cmTok.textContent = `${val.toFixed(1)} cm`;
          if (inTok) inTok.textContent = `${(val / 2.54).toFixed(1)} in`;
        });
      }

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('sonarMathVerified');
        });
      }
    }

    function renderSonarLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curDist = hw.sonarDistanceCm || 15.0;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 36 CAPSTONE</span>
          <h3>Reverse Parking Radar Studio</h3>
        </div>
        <p class="instruction-text">
          Back the virtual car closer to the barrier! Experience the 4 safety zones, observe the rapid warning beeps, and test the emergency stop threshold!
        </p>
        <div class="sonar-studio-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">CAR BUMPER DISTANCE:</span>
            <span id="radar-dist-display" style="font-family:var(--font-code); font-weight:800; font-size:1.3rem; color:#f59e0b;">${curDist.toFixed(1)} cm</span>
          </div>

          <!-- Color-Coded Radar Gauge -->
          <div class="radar-gauge-track">
            <div class="radar-needle" id="radar-gauge-needle" style="left:${Math.min(100, (curDist / 80) * 100)}%;"></div>
          </div>
          <div class="radar-zone-legend">
            <span class="zone-stop">STOP (&lt;8cm)</span>
            <span class="zone-hazard">HAZARD (8-20cm)</span>
            <span class="zone-caution">CAUTION (20-50cm)</span>
            <span class="zone-safe">SAFE (&gt;50cm)</span>
          </div>

          <input type="range" class="sonar-slider" id="sonar-radar-slider" min="3" max="80" step="0.5" value="${curDist}" style="margin-top:0.5rem;" />

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.35rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Current Zone:</span>
              <span class="calc-step-val" id="radar-zone-val" style="color:#f59e0b;">${(hw.sonarAlertZone || 'caution').toUpperCase()}</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Buzzer Alert Frequency:</span>
              <span class="calc-step-val" id="radar-freq-val">${curDist < 8 ? '3000 Hz' : curDist < 20 ? '2400 Hz' : curDist < 50 ? '1500 Hz' : 'OFF'}</span>
            </div>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-sonar-radar">
            <span>🛡️</span> Activate Parking Radar
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('sonar-radar-slider');
      const needle = document.getElementById('radar-gauge-needle');
      const distDisp = document.getElementById('radar-dist-display');
      const zoneVal = document.getElementById('radar-zone-val');
      const freqVal = document.getElementById('radar-freq-val');
      const btn = document.getElementById('btn-sonar-radar');

      let beepTimer = null;
      function triggerRadarBeep(dist) {
        if (!window.soundEngine || !state.audioEnabled) return;
        if (dist > 50) return;
        if (dist <= 8) {
          window.soundEngine.playTone(3000, 0.25);
        } else if (dist <= 20) {
          window.soundEngine.playTone(2400, 0.06);
        } else {
          window.soundEngine.playTone(1500, 0.08);
        }
      }

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          window.circuitSimulation.setSonarDistance(val);
          const pct = Math.min(100, Math.max(0, (val / 80) * 100));
          if (needle) needle.style.left = `${pct}%`;
          if (distDisp) distDisp.textContent = `${val.toFixed(1)} cm`;

          let zName = 'SAFE';
          let fText = 'OFF';
          let zColor = '#22c55e';
          if (val <= 8) {
            zName = 'CRITICAL STOP';
            fText = '3000 Hz Solid';
            zColor = '#ef4444';
          } else if (val <= 20) {
            zName = 'URGENT HAZARD';
            fText = '2400 Hz (Fast)';
            zColor = '#f97316';
          } else if (val <= 50) {
            zName = 'CAUTION';
            fText = '1500 Hz (Pulsed)';
            zColor = '#eab308';
          }
          if (zoneVal) {
            zoneVal.textContent = zName;
            zoneVal.style.color = zColor;
          }
          if (freqVal) freqVal.textContent = fText;

          triggerRadarBeep(val);
        });
      }

      if (btn) {
        btn.addEventListener('click', () => {
          const dist = window.circuitSimulation.getHardwareState().sonarDistanceCm || 15.0;
          triggerRadarBeep(dist);
          checkVerification('sonarRadarActive');
        });
      }
    }



    // =========================================================================
    // LAB 10: TCRT5000 IR REFLECTIVE SENSOR INTERACTIVE RENDERERS
    // =========================================================================

    function renderIrLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 37</span>
          <h3>Invisible Light & Infrared Reflection</h3>
        </div>
        <p class="instruction-text">
          Click <strong>Emit 940nm IR Beam</strong> to fire the invisible infrared spotlight down at the test surface. 
          Observe how the blue photodiode shoots photons downward and the black phototransistor catches the bounce!
        </p>
        <div class="action-btn-row">
          <button class="primary-btn" id="btn-ir-beam">
            <span>🔦</span> Emit 940nm IR Beam
          </button>
        </div>
        <div id="ir-beam-feedback" class="status-banner" style="display:none; margin-top:0.75rem;">
          <span class="icon">✅</span>
          <span class="text">940nm Infrared light emitted! Photons reflected cleanly back into phototransistor!</span>
        </div>
      </div>
    `;

      const btn = document.getElementById('btn-ir-beam');
      const fb = document.getElementById('ir-beam-feedback');
      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playTone(2200, 0.08);
          window.circuitSimulation.emitIrBeam();
          if (fb) fb.style.display = 'flex';
          checkVerification('irBeamEmitted');
        });
      }
    }

    function renderIrLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curThresh = hw.irThreshold || 512;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 38</span>
          <h3>Op-Amp Voltage Comparator & Sensitivity Calibration</h3>
        </div>
        <p class="instruction-text">
          Rotate the virtual blue trimmer potentiometer to calibrate the reference threshold (Vref). 
          Notice how the LM393 chip cleanly snaps the Digital DO pin to HIGH or LOW when voltage crosses Vref!
        </p>
        <div class="ir-studio-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">COMPARATOR THRESHOLD (Vref):</span>
            <span id="ir-thresh-val" style="font-family:var(--font-code); font-weight:800; font-size:1.15rem; color:#facc15;">${curThresh} (${((curThresh / 1023) * 5).toFixed(2)}V)</span>
          </div>
          <input type="range" class="sonar-slider" id="ir-thresh-slider" min="100" max="900" step="10" value="${curThresh}" style="accent-color:#facc15;" />
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.35rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Phototransistor Input:</span>
              <span class="calc-step-val" id="ir-comp-in">${hw.irReflectRaw || 145} (${(hw.irVoltage || 0.71).toFixed(2)}V)</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">LM393 DO Output:</span>
              <span class="calc-step-val" id="ir-comp-out" style="color:${(hw.irReflectRaw || 145) > curThresh ? '#ef4444' : '#22c55e'};">${(hw.irReflectRaw || 145) > curThresh ? 'HIGH (1)' : 'LOW (0)'}</span>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-ir-calibrate">
            <span>🎛️</span> Calibrate Threshold
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('ir-thresh-slider');
      const valSpan = document.getElementById('ir-thresh-val');
      const inSpan = document.getElementById('ir-comp-in');
      const outSpan = document.getElementById('ir-comp-out');
      const btn = document.getElementById('btn-ir-calibrate');

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value);
          window.circuitSimulation.setIrThreshold(val);
          const volts = ((val / 1023.0) * 5.0).toFixed(2);
          if (valSpan) valSpan.textContent = `${val} (${volts}V)`;
          const raw = window.circuitSimulation.getHardwareState().irReflectRaw || 145;
          const isHigh = raw > val;
          if (outSpan) {
            outSpan.textContent = isHigh ? 'HIGH (1)' : 'LOW (0)';
            outSpan.style.color = isHigh ? '#ef4444' : '#22c55e';
          }
        });
      }

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('irComparatorCalibrated');
        });
      }
    }

    function renderIrLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curSurf = hw.irSurface || 'white';
      const curRaw = hw.irReflectRaw || 145;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 39</span>
          <h3>Reading Shades of Gray: Analog Reflectance ADC</h3>
        </div>
        <p class="instruction-text">
          Select different floor surface materials to slide under the sensor. Observe the live 10-bit analog voltage 
          and absorption percentage on the ADC meter!
        </p>
        <div class="ir-studio-card">
          <div style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">SELECT TEST SURFACE:</div>
          <div class="surface-chip-grid">
            <button class="surface-chip ${curSurf === 'white' ? 'active' : ''}" data-surface="white">
              <span>⬜</span> White Tile
            </button>
            <button class="surface-chip ${curSurf === 'cardboard' ? 'active' : ''}" data-surface="cardboard">
              <span>📦</span> Cardboard
            </button>
            <button class="surface-chip ${curSurf === 'dark_tape' ? 'active' : ''}" data-surface="dark_tape">
              <span>⬛</span> Dark Tape
            </button>
            <button class="surface-chip ${curSurf === 'black' ? 'active' : ''}" data-surface="black">
              <span>🕳️</span> Black Void
            </button>
          </div>

          <div style="margin-top:0.5rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
              <span style="color:var(--text-muted);">Optical Absorption Meter:</span>
              <span id="ir-adc-text" style="font-family:var(--font-code); font-weight:800; color:#38bdf8;">${curRaw} / 1023 (${((curRaw / 1023) * 100).toFixed(1)}%)</span>
            </div>
            <div class="adc-bar-track">
              <div class="adc-bar-fill" id="ir-adc-fill" style="width:${(curRaw / 1023) * 100}%;"></div>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-ir-sample">
            <span>📊</span> Sample Surface ADC
          </button>
        </div>
      </div>
    `;

      const chips = lessonInteractiveArea.querySelectorAll('.surface-chip');
      const fill = document.getElementById('ir-adc-fill');
      const textSpan = document.getElementById('ir-adc-text');
      const btn = document.getElementById('btn-ir-sample');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const s = chip.getAttribute('data-surface');
          window.circuitSimulation.setIrSurface(s);
          const hwState = window.circuitSimulation.getHardwareState();
          const raw = hwState.irReflectRaw;
          const pct = ((raw / 1023.0) * 100.0).toFixed(1);
          if (fill) fill.style.width = `${pct}%`;
          if (textSpan) textSpan.textContent = `${raw} / 1023 (${pct}%)`;
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('irAnalogSampled');
        });
      }
    }

    function renderIrLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curSteer = hw.roverSteerState || 'straight';

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 40 CAPSTONE</span>
          <h3>Autonomous 2-Sensor Rover Arena Studio</h3>
        </div>
        <p class="instruction-text">
          Control the differential drive of the automated guided vehicle (AGV). Watch how dual infrared sensors 
          detect track drift and command outer wheels to steer autonomously!
        </p>
        <div class="ir-studio-card">
          <div style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">DIFFERENTIAL STEERING COMMANDS:</div>
          <div class="steer-btn-row">
            <button class="steer-btn ${curSteer === 'straight' ? 'active' : ''}" data-steer="straight">
              <span>⬆️</span> Straight
            </button>
            <button class="steer-btn ${curSteer === 'left' ? 'active' : ''}" data-steer="left">
              <span>⬅️</span> Steer Left
            </button>
            <button class="steer-btn ${curSteer === 'right' ? 'active' : ''}" data-steer="right">
              <span>➡️</span> Steer Right
            </button>
            <button class="steer-btn ${curSteer === 'stop' ? 'active' : ''}" data-steer="stop">
              <span>🛑</span> Stop
            </button>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.35rem;">
            <div class="calc-step-box">
              <span class="calc-step-label">Left DC Motor (Pin ~5):</span>
              <span class="calc-step-val" id="rover-left-val">${hw.roverLeftMotor || 200} PWM</span>
            </div>
            <div class="calc-step-box">
              <span class="calc-step-label">Right DC Motor (Pin ~6):</span>
              <span class="calc-step-val" id="rover-right-val">${hw.roverRightMotor || 200} PWM</span>
            </div>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-ir-rover">
            <span>🏁</span> Start Autonomous Rover
          </button>
        </div>
      </div>
    `;

      const btns = lessonInteractiveArea.querySelectorAll('.steer-btn');
      const leftVal = document.getElementById('rover-left-val');
      const rightVal = document.getElementById('rover-right-val');
      const btn = document.getElementById('btn-ir-rover');

      btns.forEach(b => {
        b.addEventListener('click', () => {
          btns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          const st = b.getAttribute('data-steer');
          window.circuitSimulation.setRoverSteering(st);
          const hwState = window.circuitSimulation.getHardwareState();
          if (leftVal) leftVal.textContent = `${hwState.roverLeftMotor} PWM`;
          if (rightVal) rightVal.textContent = `${hwState.roverRightMotor} PWM`;
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          window.circuitSimulation.setRoverSteering('straight');
          checkVerification('irRoverRunning');
        });
      }
    }



    // =========================================================================
    // LAB 11: 16x2 I2C CHARACTER LCD DISPLAY INTERACTIVE RENDERERS
    // =========================================================================

    function renderLcdLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 41</span>
          <h3>Taming 16 Wires: I2C Protocol Initialization</h3>
        </div>
        <p class="instruction-text">
          Click <strong>Initialize I2C Bus (0x27)</strong> to transmit the wake-up handshake packet across Pins A4 (SDA) and A5 (SCL). 
          Toggle the LED backlight to observe power savings!
        </p>
        <div class="lcd-studio-card">
          <div class="lcd-dot-screen" id="lcd-preview-l1">
            <div id="lcd-live-line-0">${hw.lcdLine0 || 'I2C Bus Ready!  '}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1 || 'Address: 0x27   '}</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.35rem;">
            <span style="font-size:0.8rem; color:var(--text-muted);">Backlight State: <strong style="color:#38bdf8;">${hw.lcdBacklight ? 'ON (35mA)' : 'OFF (15mA)'}</strong></span>
            <button class="secondary-btn" id="btn-lcd-backlight" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
              <span>💡</span> Toggle Backlight
            </button>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-init">
            <span>📟</span> Initialize I2C Bus (0x27)
          </button>
        </div>
      </div>
    `;

      const initBtn = document.getElementById('btn-lcd-init');
      const blBtn = document.getElementById('btn-lcd-backlight');

      if (initBtn) {
        initBtn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playTone(1900, 0.1);
          window.circuitSimulation.setLcdText(0, 'I2C Bus Ready!  ');
          window.circuitSimulation.setLcdText(1, 'Address: 0x27   ');
          checkVerification('lcdInitialized');
        });
      }

      if (blBtn) {
        blBtn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          window.circuitSimulation.toggleLcdBacklight();
          renderLcdLesson1(lesson);
        });
      }
    }

    function renderLcdLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 42</span>
          <h3>Screen Coordinates & Cursor Positioning</h3>
        </div>
        <p class="instruction-text">
          Use the coordinate sliders to position custom text on the 16-column by 2-row screen. 
          Remember: computers count starting at index 0!
        </p>
        <div class="lcd-studio-card">
          <div class="lcd-dot-screen">
            <div id="lcd-live-line-0">${hw.lcdLine0}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1}</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.35rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
                <span style="color:var(--text-muted);">Column Position (0 to 15):</span>
                <span id="lcd-col-val" style="font-family:var(--font-code); font-weight:800; color:#38bdf8;">${hw.lcdCursorCol || 0}</span>
              </div>
              <input type="range" class="sonar-slider" id="lcd-col-slider" min="0" max="15" step="1" value="${hw.lcdCursorCol || 0}" />
            </div>

            <div style="display:flex; gap:0.75rem; align-items:center;">
              <span style="font-size:0.8rem; color:var(--text-muted);">Row Selection:</span>
              <button class="dash-tab-btn ${(hw.lcdCursorRow || 0) === 0 ? 'active' : ''}" id="btn-lcd-row-0" style="padding:0.35rem 0.75rem;">Row 0 (Top)</button>
              <button class="dash-tab-btn ${(hw.lcdCursorRow || 0) === 1 ? 'active' : ''}" id="btn-lcd-row-1" style="padding:0.35rem 0.75rem;">Row 1 (Bottom)</button>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-coords">
            <span>📍</span> Verify Text Positioning
          </button>
        </div>
      </div>
    `;

      const colSlider = document.getElementById('lcd-col-slider');
      const colVal = document.getElementById('lcd-col-val');
      const row0Btn = document.getElementById('btn-lcd-row-0');
      const row1Btn = document.getElementById('btn-lcd-row-1');
      const btn = document.getElementById('btn-lcd-coords');

      function updateCoords(col, row) {
        window.circuitSimulation.setLcdCursor(col, row);
        if (colVal) colVal.textContent = `${col}`;
        const prefix = ' '.repeat(col);
        const rowText = (prefix + 'ATL INNOVATE').substring(0, 16);
        if (row === 0) {
          window.circuitSimulation.setLcdText(0, rowText);
          window.circuitSimulation.setLcdText(1, 'COL:0-15 ROW:0-1');
        } else {
          window.circuitSimulation.setLcdText(0, 'ATL INNOVATE    ');
          window.circuitSimulation.setLcdText(1, rowText);
        }
      }

      if (colSlider) {
        colSlider.addEventListener('input', (e) => {
          const c = parseInt(e.target.value);
          const r = window.circuitSimulation.getHardwareState().lcdCursorRow || 0;
          updateCoords(c, r);
        });
      }

      if (row0Btn) {
        row0Btn.addEventListener('click', () => {
          const c = window.circuitSimulation.getHardwareState().lcdCursorCol || 0;
          updateCoords(c, 0);
          renderLcdLesson2(lesson);
        });
      }

      if (row1Btn) {
        row1Btn.addEventListener('click', () => {
          const c = window.circuitSimulation.getHardwareState().lcdCursorCol || 0;
          updateCoords(c, 1);
          renderLcdLesson2(lesson);
        });
      }

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('lcdCoordsVerified');
        });
      }
    }

    function renderLcdLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      let currentBytes = [...(hw.lcdCustomChar || [0, 10, 31, 31, 14, 4, 0, 0])];

      const presets = {
        heart: [0, 10, 31, 31, 14, 4, 0, 0],
        battery: [14, 27, 17, 31, 31, 31, 31, 31],
        smiley: [0, 10, 0, 4, 0, 17, 14, 0],
        bell: [4, 14, 14, 14, 31, 0, 4, 0]
      };

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 43</span>
          <h3>Designing Custom Characters: 5x8 Pixel Typography</h3>
        </div>
        <p class="instruction-text">
          Click pixels on the 5x8 matrix grid to draw a custom icon! Each row represents a 5-bit binary byte. 
          Upload it directly into HD44780 CGRAM memory slot 0!
        </p>
        <div class="lcd-studio-card">
          <div class="glyph-preset-row">
            <span style="font-size:0.8rem; color:var(--text-muted); align-self:center;">PRESETS:</span>
            <button class="glyph-preset-btn" data-preset="heart">❤️ Heart</button>
            <button class="glyph-preset-btn" data-preset="battery">🔋 Battery</button>
            <button class="glyph-preset-btn" data-preset="smiley">😃 Smiley</button>
            <button class="glyph-preset-btn" data-preset="bell">🔔 Bell</button>
          </div>

          <div class="pixel-grid-container">
            <div class="pixel-grid-5x8" id="pixel-matrix-grid">
              ${generatePixelGridHtml(currentBytes)}
            </div>

            <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
              <div class="lcd-dot-screen" style="padding:0.6rem 0.85rem; font-size:1rem;">
                <div id="lcd-live-line-0">Arduino + ATL ♥ </div>
                <div id="lcd-live-line-1">Custom Glyph [0]</div>
              </div>
              <div style="font-family:var(--font-code); font-size:0.75rem; color:var(--text-muted); background:rgba(0,0,0,0.4); padding:0.5rem; border-radius:4px;" id="cgram-byte-preview">
                byte custom[8] = { ${currentBytes.map(b => 'B' + b.toString(2).padStart(5, '0')).join(', ')} };
              </div>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-glyph">
            <span>✨</span> Upload Custom Glyph to Slot 0
          </button>
        </div>
      </div>
    `;

      function generatePixelGridHtml(bytes) {
        let html = '';
        for (let r = 0; r < 8; r++) {
          const rowByte = bytes[r] || 0;
          for (let c = 0; c < 5; c++) {
            const bitOn = (rowByte & (1 << (4 - c))) !== 0;
            html += `<div class="pixel-cell ${bitOn ? 'on' : ''}" data-row="${r}" data-col="${c}"></div>`;
          }
        }
        return html;
      }

      const grid = document.getElementById('pixel-matrix-grid');
      const bytePreview = document.getElementById('cgram-byte-preview');
      const btn = document.getElementById('btn-lcd-glyph');

      if (grid) {
        grid.querySelectorAll('.pixel-cell').forEach(cell => {
          cell.addEventListener('click', () => {
            const r = parseInt(cell.getAttribute('data-row'));
            const c = parseInt(cell.getAttribute('data-col'));
            const mask = 1 << (4 - c);
            currentBytes[r] ^= mask;
            cell.classList.toggle('on');
            window.circuitSimulation.setLcdCustomChar(currentBytes);
            if (bytePreview) {
              bytePreview.textContent = `byte custom[8] = { ${currentBytes.map(b => 'B' + b.toString(2).padStart(5, '0')).join(', ')} };`;
            }
            if (window.soundEngine) window.soundEngine.playTone(2400, 0.04);
          });
        });
      }

      lessonInteractiveArea.querySelectorAll('.glyph-preset-btn').forEach(pb => {
        pb.addEventListener('click', () => {
          const pKey = pb.getAttribute('data-preset');
          if (presets[pKey]) {
            currentBytes = [...presets[pKey]];
            window.circuitSimulation.setLcdCustomChar(currentBytes);
            renderLcdLesson3(lesson);
            if (window.soundEngine) window.soundEngine.playClick();
          }
        });
      });

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          window.circuitSimulation.setLcdText(0, 'Arduino + ATL ♥ ');
          window.circuitSimulation.setLcdText(1, 'Glyph Saved!    ');
          checkVerification('lcdGlyphCreated');
        });
      }
    }

    function renderLcdLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      const curMode = hw.lcdScreenMode || 0;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 44 • GRAND CAPSTONE</span>
          <h3>IoT Multi-Sensor Command Deck Studio</h3>
        </div>
        <p class="instruction-text">
          Congratulations on reaching the Grand Capstone of the entire ATL Curriculum! 
          This project combines TMP36 temperature, HC-SR04 sonar radar, and LDR light sensors into one cycling 16x2 IoT command screen!
        </p>
        <div class="lcd-studio-card">
          <!-- Cycling 16x2 LCD Screen -->
          <div class="lcd-dot-screen">
            <div id="lcd-live-line-0">${hw.lcdLine0}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1}</div>
          </div>

          <div style="font-weight:700; color:var(--text-muted); font-size:0.8rem; margin-top:0.25rem;">MANUAL CHANNEL SWITCHER:</div>
          <div class="dash-tab-row">
            <button class="dash-tab-btn ${curMode === 0 ? 'active' : ''}" data-mode="0">
              <span>🌡️</span> Ch 1: Climate
            </button>
            <button class="dash-tab-btn ${curMode === 1 ? 'active' : ''}" data-mode="1">
              <span>🦇</span> Ch 2: Radar
            </button>
            <button class="dash-tab-btn ${curMode === 2 ? 'active' : ''}" data-mode="2">
              <span>☀️</span> Ch 3: Solar
            </button>
          </div>

          <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:0.75rem; font-size:0.8rem; line-height:1.6;">
            <div style="color:#22d3ee; font-weight:800;">🎉 ATL Curriculum Complete (44 / 44 Lessons Built!):</div>
            <div style="color:var(--text-secondary); margin-top:2px;">
              All 11 hardware labs are operational: Servo, Potentiometer, Button, Buzzer, LDR, RGB LED, TMP36, HC-SR04, TCRT5000 IR, and 16x2 I2C LCD!
            </div>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-deck" style="background:linear-gradient(135deg, #06b6d4, #10b981); border:none;">
            <span>🚀</span> Launch IoT Command Deck (Complete Curriculum)
          </button>
        </div>
      </div>
    `;

      const tabs = lessonInteractiveArea.querySelectorAll('.dash-tab-btn');
      const btn = document.getElementById('btn-lcd-deck');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const m = parseInt(tab.getAttribute('data-mode'));
          window.circuitSimulation.setLcdScreenMode(m);
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          launchConfetti();
          checkVerification('lcdIotDeckActive');
        });
      }
    }



    // =========================================================================
    // CAD LESSONS (Tinkercad CSG 3D Modeling Studio)
    // =========================================================================

    function updateCad3DModel() {
      const hw = window.circuitSimulation.getHardwareState();
      const w = hw.cadWidth || 20.0;
      const d = hw.cadDepth || 20.0;
      const h = hw.cadHeight || 20.0;
      const isGrouped = hw.cadIsGrouped || false;

      const sx = w * 2.25;
      const sy = d * 2.25;
      const sz = h * 2.5;

      const faceLeft = document.getElementById('cad-box-face-left');
      const faceRight = document.getElementById('cad-box-face-right');
      const faceTop = document.getElementById('cad-box-face-top');
      const dimX = document.getElementById('cad-dim-x');
      const dimY = document.getElementById('cad-dim-y');
      const dimZ = document.getElementById('cad-dim-z');
      const groupedCutout = document.getElementById('cad-grouped-cutout');
      const holeElement = document.getElementById('cad-hole-element');
      const statusMesh = document.getElementById('cad-status-mesh');
      const statusCsg = document.getElementById('cad-status-csg');

      if (faceLeft) faceLeft.setAttribute('points', `0,0 -${sy},${sy * 0.5} -${sy},${sy * 0.5 - sz} 0,-${sz}`);
      if (faceRight) faceRight.setAttribute('points', `0,0 ${sx},${sx * 0.5} ${sx},${sx * 0.5 - sz} 0,-${sz}`);
      if (faceTop) faceTop.setAttribute('points', `0,-${sz} ${sx},${sx * 0.5 - sz} ${sx - sy},${(sx + sy) * 0.5 - sz} -${sy},${sy * 0.5 - sz}`);

      if (dimX) dimX.textContent = `${w.toFixed(1)} mm`;
      if (dimY) dimY.textContent = `${d.toFixed(1)} mm`;
      if (dimZ) dimZ.textContent = `${h.toFixed(1)} mm`;

      if (groupedCutout) groupedCutout.style.display = isGrouped ? 'block' : 'none';
      if (holeElement) holeElement.style.display = isGrouped ? 'none' : 'block';

      const vol = Math.round(w * d * h);
      if (statusMesh) statusMesh.textContent = `Solid Box (${w.toFixed(0)}x${d.toFixed(0)}x${h.toFixed(0)}mm) • Vol: ${vol.toLocaleString()} mm³`;
      if (statusCsg) {
        statusCsg.textContent = isGrouped
          ? 'CSG Status: Difference [A - B] Computed! Watertight Mesh Ready'
          : 'CSG Status: Ungrouped Primitives | Ready for Boolean Grouping';
      }

      if (window.circuitSimulation) window.circuitSimulation.notifyHardware();
    }

    function renderCadLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 45</span>
          <h3>Tinkercad 3D Workplane & Metric Coordinate Studio</h3>
        </div>
        <p class="instruction-text">
          Drag the sliders to adjust the solid cube's dimensions along Cartesian axes: 
          <strong>Width (X)</strong>, <strong>Depth (Y)</strong>, and <strong>Height (Z)</strong>.
          Watch the 3D isometric projection scale and calculate volume in real-time!
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span style="color:#ef4444;">🔴 Width X (Left-to-Right):</span>
              <span id="cad-val-x" style="font-family:var(--font-code); color:#ef4444;">${hw.cadWidth || 20.0} mm</span>
            </div>
            <input type="range" id="cad-slider-x" min="10" max="40" step="1" value="${hw.cadWidth || 20}" style="width:100%;">
          </div>

          <div style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span style="color:#10b981;">🟢 Depth Y (Front-to-Back):</span>
              <span id="cad-val-y" style="font-family:var(--font-code); color:#10b981;">${hw.cadDepth || 20.0} mm</span>
            </div>
            <input type="range" id="cad-slider-y" min="10" max="40" step="1" value="${hw.cadDepth || 20}" style="width:100%;">
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span style="color:#38bdf8;">🔵 Height Z (Vertical Elevation):</span>
              <span id="cad-val-z" style="font-family:var(--font-code); color:#38bdf8;">${hw.cadHeight || 20.0} mm</span>
            </div>
            <input type="range" id="cad-slider-z" min="10" max="40" step="1" value="${hw.cadHeight || 20}" style="width:100%;">
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-cad-verify-l1">
            <span>📐</span> Verify 20x20x20mm Cube Geometry
          </button>
        </div>
      </div>
    `;

      const sx = document.getElementById('cad-slider-x');
      const sy = document.getElementById('cad-slider-y');
      const sz = document.getElementById('cad-slider-z');
      const btn = document.getElementById('btn-cad-verify-l1');

      const onSlide = () => {
        hw.cadWidth = parseFloat(sx.value);
        hw.cadDepth = parseFloat(sy.value);
        hw.cadHeight = parseFloat(sz.value);
        const vx = document.getElementById('cad-val-x');
        const vy = document.getElementById('cad-val-y');
        const vz = document.getElementById('cad-val-z');
        if (vx) vx.textContent = `${hw.cadWidth.toFixed(1)} mm`;
        if (vy) vy.textContent = `${hw.cadDepth.toFixed(1)} mm`;
        if (vz) vz.textContent = `${hw.cadHeight.toFixed(1)} mm`;
        updateCad3DModel();
      };

      if (sx) sx.addEventListener('input', onSlide);
      if (sy) sy.addEventListener('input', onSlide);
      if (sz) sz.addEventListener('input', onSlide);

      if (btn) {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('cadDimensionsVerified');
        });
      }

      updateCad3DModel();
    }

    function renderCadLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 46</span>
          <h3>Constructive Solid Geometry (CSG): Boolean Difference</h3>
        </div>
        <p class="instruction-text">
          A "Hole" is a virtual cutting tool! Notice the translucent cyan cylinder penetrating the center of the red solid block.
          Click <strong>Group Primitives (Ctrl+G)</strong> to execute the CSG Boolean subtraction <code>[Solid - Hole]</code>!
        </p>

        <div style="background:rgba(15,23,42,0.6); padding:0.85rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-around; align-items:center;">
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">🟥</span>
              <div style="font-size:0.78rem; font-weight:700; color:#ef4444;">Shape A</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Solid Box</div>
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#f59e0b;">—</div>
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">🕳️</span>
              <div style="font-size:0.78rem; font-weight:700; color:#22d3ee;">Shape B</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Hole Cylinder (Ø10mm)</div>
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#10b981;">=</div>
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">🧰</span>
              <div style="font-size:0.78rem; font-weight:700; color:#10b981;">CSG Part</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">${hw.cadIsGrouped ? 'Bored Block' : 'Awaiting Group'}</div>
            </div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-cad-group">
            <span>⚙️</span> Group Primitives (Execute CSG Boolean)
          </button>
          <button class="secondary-btn" id="btn-cad-ungroup">
            <span>🔄</span> Ungroup
          </button>
        </div>
      </div>
    `;

      const groupBtn = document.getElementById('btn-cad-group');
      const ungroupBtn = document.getElementById('btn-cad-ungroup');

      if (groupBtn) {
        groupBtn.addEventListener('click', () => {
          hw.cadIsGrouped = true;
          updateCad3DModel();
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('cadHoleGrouped');
          renderCadLesson2(lesson);
        });
      }

      if (ungroupBtn) {
        ungroupBtn.addEventListener('click', () => {
          hw.cadIsGrouped = false;
          updateCad3DModel();
          if (window.soundEngine) window.soundEngine.playClick();
          renderCadLesson2(lesson);
        });
      }

      updateCad3DModel();
    }

    function renderCadLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 47</span>
          <h3>Precision Metrology & Concentric Alignment</h3>
        </div>
        <p class="instruction-text">
          Never eyeball mechanical holes! Use Tinkercad's Alignment pins to snap the cutting tool exactly to the geometric center of the solid.
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-cad-align-xy" style="padding:0.65rem 0.5rem; font-size:0.8rem;">
            <span>🎯</span> Align Center (X & Y Axes)
          </button>
          <button class="secondary-btn" id="btn-cad-align-base" style="padding:0.65rem 0.5rem; font-size:0.8rem;">
            <span>📐</span> Drop to Workplane (Z = 0)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-cad-verify-align">
            <span>🔒</span> Lock Concentric Centerline Alignment
          </button>
        </div>
      </div>
    `;

      const alignXy = document.getElementById('btn-cad-align-xy');
      const alignBase = document.getElementById('btn-cad-align-base');
      const verifyBtn = document.getElementById('btn-cad-verify-align');

      if (alignXy) {
        alignXy.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          const hole = document.getElementById('cad-hole-element');
          if (hole) hole.setAttribute('transform', 'translate(0, -35)');
          updateCad3DModel();
        });
      }

      if (alignBase) {
        alignBase.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          updateCad3DModel();
        });
      }

      if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('cadAligned');
        });
      }

      updateCad3DModel();
    }

    function renderCadLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 48 • CAPSTONE</span>
          <h3>SG90 Robot Servo Bracket Engineering & STL Export</h3>
        </div>
        <p class="instruction-text">
          Configure structural parameters for an actual 3D-printable mounting bracket for your SG90 Micro Servo from Lab 2!
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>🛡️ Structural Wall Thickness:</span>
              <span id="cad-wall-val" style="font-family:var(--font-code); color:#38bdf8;">${hw.cadWallThickness || 2.5} mm</span>
            </div>
            <input type="range" id="cad-wall-slider" min="1.5" max="4.0" step="0.5" value="${hw.cadWallThickness || 2.5}" style="width:100%;">
            <span style="font-size:0.72rem; color:var(--text-muted);">Recommended: ≥ 2.0mm to withstand motor torque</span>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>🔩 Fastener Tolerance (+Δmm):</span>
              <span id="cad-tol-val" style="font-family:var(--font-code); color:#10b981;">+${hw.cadTolerance || 0.4} mm</span>
            </div>
            <input type="range" id="cad-tol-slider" min="0.1" max="0.6" step="0.1" value="${hw.cadTolerance || 0.4}" style="width:100%;">
            <span style="font-size:0.72rem; color:var(--text-muted);">Compensates for PLA thermal shrinkage on 3D printer</span>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-cad-export-stl">
            <span>💾</span> Export 3D Printable STL Mesh
          </button>
        </div>
      </div>
    `;

      const wallSlider = document.getElementById('cad-wall-slider');
      const tolSlider = document.getElementById('cad-tol-slider');
      const exportBtn = document.getElementById('btn-cad-export-stl');

      if (wallSlider) {
        wallSlider.addEventListener('input', () => {
          hw.cadWallThickness = parseFloat(wallSlider.value);
          const el = document.getElementById('cad-wall-val');
          if (el) el.textContent = `${hw.cadWallThickness.toFixed(1)} mm`;
        });
      }

      if (tolSlider) {
        tolSlider.addEventListener('input', () => {
          hw.cadTolerance = parseFloat(tolSlider.value);
          const el = document.getElementById('cad-tol-val');
          if (el) el.textContent = `+${hw.cadTolerance.toFixed(1)} mm`;
        });
      }

      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playSuccess();
          checkVerification('cadStlExported');
        });
      }

      updateCad3DModel();
    }


    // --- Grade Band Filtering & Dynamic Lab Button Handling ---
    function initGradeBandAndLabSwitcher() {
      // 1. Bind all lab buttons in switcher
      const labBtns = document.querySelectorAll('.lab-switch-btn');
      labBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const lab = btn.getAttribute('data-lab');
          if (lab) switchLab(lab);
        });
      });

      // 2. Bind grade band filter tabs
      const gradeBtns = document.querySelectorAll('.grade-tab-btn');
      gradeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const grade = btn.getAttribute('data-grade');
          if (window.soundEngine) window.soundEngine.playClick();

          gradeBtns.forEach(b => b.classList.toggle('active', b === btn));

          let firstVisible = null;
          let activeStillVisible = false;

          labBtns.forEach(lb => {
            const lbGrade = lb.getAttribute('data-grade');
            const show = (grade === 'all' || lbGrade === grade);
            lb.classList.toggle('grade-hidden', !show);
            if (show) {
              if (!firstVisible) firstVisible = lb.getAttribute('data-lab');
              if (lb.getAttribute('data-lab') === state.activeLab) activeStillVisible = true;
            }
          });

          if (!activeStillVisible && firstVisible) {
            switchLab(firstVisible);
          }
        });
      });
    }

    initGradeBandAndLabSwitcher();



    // =========================================================================
    // DMM LESSONS (Digital Multimeter & Circuit Troubleshooting)
    // =========================================================================

    const DMM_NODE_COORDS = {
      '5V': { x: 18, y: 35, name: 'Node 1 (+5V Rail)' },
      'R_IN': { x: 60, y: 70, name: 'Node 2 (Resistor In)' },
      'LED_ANODE': { x: 60, y: 122, name: 'Node 3 (LED Anode +)' },
      'LED_CATHODE': { x: 60, y: 170, name: 'Node 4 (LED Cathode -)' },
      'GND': { x: 26, y: 190, name: 'Node 5 (GND Return)' }
    };

    function updateDmmDisplay() {
      const hw = window.circuitSimulation.getHardwareState();
      const mode = hw.dmmMode || 'dcv';
      const rNode = hw.dmmRedNode || '5V';
      const bNode = hw.dmmBlackNode || 'GND';
      const fault = hw.dmmFaultScenario || 'healthy';

      // Calculate reading based on nodes and mode
      let displayVal = '0.00 V';
      let unitLabel = 'VOLTS DC';
      let annun = 'DC  AUTO';
      let isBeep = false;

      if (mode === 'dcv') {
        unitLabel = 'VOLTS DC';
        annun = 'DC  AUTO';
        if (bNode === 'GND') {
          if (rNode === '5V' || rNode === 'R_IN') displayVal = '5.00 V';
          else if (rNode === 'LED_ANODE') {
            if (fault === 'blown_resistor') displayVal = '0.00 V';
            else if (fault === 'reversed_led') displayVal = '5.00 V';
            else if (fault === 'short_circuit') displayVal = '0.00 V';
            else displayVal = '2.05 V';
          } else if (rNode === 'LED_CATHODE' || rNode === 'GND') {
            displayVal = '0.00 V';
          }
        } else if (rNode === 'R_IN' && bNode === 'LED_ANODE') {
          // Drop across resistor
          if (fault === 'blown_resistor') displayVal = '5.00 V';
          else if (fault === 'reversed_led') displayVal = '0.00 V';
          else displayVal = '2.95 V';
        } else if (rNode === 'LED_ANODE' && bNode === 'LED_CATHODE') {
          // Drop across LED
          if (fault === 'reversed_led') displayVal = '5.00 V';
          else if (fault === 'blown_resistor') displayVal = '0.00 V';
          else displayVal = '2.05 V';
        } else {
          displayVal = '0.00 V';
        }
      } else if (mode === 'ohm') {
        unitLabel = 'OHMS Ω';
        annun = 'RES  AUTO';
        if ((rNode === 'R_IN' && bNode === 'LED_ANODE') || (rNode === 'LED_ANODE' && bNode === 'R_IN')) {
          displayVal = (fault === 'blown_resistor') ? 'O.L MΩ' : '220.4 Ω';
        } else if (rNode === bNode) {
          displayVal = '0.1 Ω';
        } else {
          displayVal = 'O.L MΩ';
        }
      } else if (mode === 'cont') {
        unitLabel = 'CONTINUITY';
        annun = '🔊  CONT';
        // Continuous if on same trace or through good resistor
        if (rNode === bNode || (rNode === '5V' && bNode === 'R_IN') || (rNode === 'LED_CATHODE' && bNode === 'GND')) {
          displayVal = '0.02 Ω';
          isBeep = true;
        } else if (fault === 'short_circuit' && ((rNode === '5V' && bNode === 'GND') || (rNode === 'LED_ANODE' && bNode === 'GND'))) {
          displayVal = '0.01 Ω';
          isBeep = true;
        } else {
          displayVal = 'O.L  ';
          isBeep = false;
        }
      } else if (mode === 'dca') {
        unitLabel = 'MILLIAMPS';
        annun = 'DC  mA';
        displayVal = (fault === 'healthy') ? '13.4 mA' : '0.0 mA';
      }

      hw.dmmReading = displayVal;

      // Update SVG LCD
      const lcdEl = document.getElementById('dmm-svg-lcd');
      const unitEl = document.getElementById('dmm-svg-unit');
      const annunEl = document.getElementById('dmm-svg-annun');
      const statusText = document.getElementById('dmm-status-text');
      const statusBeep = document.getElementById('dmm-status-beep');
      const knob = document.getElementById('dmm-svg-knob');

      if (lcdEl) lcdEl.textContent = displayVal;
      if (unitEl) unitEl.textContent = unitLabel;
      if (annunEl) annunEl.textContent = annun;

      if (statusText) {
        statusText.textContent = `Probing: ${DMM_NODE_COORDS[rNode]?.name || rNode} to ${DMM_NODE_COORDS[bNode]?.name || bNode} • ${displayVal}`;
      }

      if (statusBeep) {
        statusBeep.setAttribute('fill', isBeep ? '#eab308' : '#94a3b8');
        if (isBeep && window.soundEngine) {
          window.soundEngine.playTone(2400, 0.12);
        }
      }

      // Move SVG Probe Wires
      const pRed = DMM_NODE_COORDS[rNode] || { x: 18, y: 35 };
      const pBlack = DMM_NODE_COORDS[bNode] || { x: 26, y: 190 };

      const wireRed = document.getElementById('dmm-probe-wire-red');
      const tipRed = document.getElementById('dmm-probe-tip-red');
      const wireBlack = document.getElementById('dmm-probe-wire-black');
      const tipBlack = document.getElementById('dmm-probe-tip-black');

      if (wireRed) {
        wireRed.setAttribute('x2', pRed.x);
        wireRed.setAttribute('y2', pRed.y);
      }
      if (tipRed) {
        tipRed.setAttribute('cx', pRed.x);
        tipRed.setAttribute('cy', pRed.y);
      }
      if (wireBlack) {
        wireBlack.setAttribute('x2', pBlack.x);
        wireBlack.setAttribute('y2', pBlack.y);
      }
      if (tipBlack) {
        tipBlack.setAttribute('cx', pBlack.x);
        tipBlack.setAttribute('cy', pBlack.y);
      }

      // Rotate Dial Knob
      const knobAngles = { dcv: 45, ohm: 80, cont: 180, dca: 270, off: 0 };
      if (knob) {
        knob.setAttribute('transform', `rotate(${knobAngles[mode] || 0})`);
      }

      if (window.circuitSimulation) window.circuitSimulation.notifyHardware();
    }

    function setupDmmClickableNodes() {
      const nodes = document.querySelectorAll('.dmm-node-pin');
      nodes.forEach(node => {
        node.addEventListener('click', (e) => {
          e.stopPropagation();
          const nId = node.getAttribute('data-node');
          const hw = window.circuitSimulation.getHardwareState();
          // Left click moves Red probe, unless Shift is held which moves Black probe
          if (e.shiftKey) {
            hw.dmmBlackNode = nId;
          } else {
            hw.dmmRedNode = nId;
          }
          if (window.soundEngine) window.soundEngine.playClick();
          updateDmmDisplay();
        });
      });
    }

    function renderDmmLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.dmmMode = 'dcv';

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 49</span>
          <h3>DC Voltage Drop & Potential Difference Studio</h3>
        </div>
        <p class="instruction-text">
          Use the Red (+) and Black (-) probes to measure voltage across components.
          Click a breadboard contact node below to reposition the Red probe (Hold <strong>Shift</strong> to move Black probe)!
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-dmm-probe-5v" style="font-size:0.8rem; padding:0.5rem;">
            <span>🔴</span> Probe Node 1 (+5V Rail)
          </button>
          <button class="secondary-btn" id="btn-dmm-probe-led" style="font-size:0.8rem; padding:0.5rem;">
            <span>💡</span> Probe Node 3 (LED Anode)
          </button>
          <button class="secondary-btn" id="btn-dmm-probe-drop" style="font-size:0.8rem; padding:0.5rem;">
            <span>⚡</span> Measure LED Drop (Nodes 3 to 4)
          </button>
          <button class="secondary-btn" id="btn-dmm-probe-rdrop" style="font-size:0.8rem; padding:0.5rem;">
            <span>🛡️</span> Measure 220Ω Drop (Nodes 2 to 3)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dmm-verify-l1">
            <span>⚡</span> Verify 2.05V LED Forward Voltage Drop
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-dmm-probe-5v')?.addEventListener('click', () => {
        hw.dmmRedNode = '5V'; hw.dmmBlackNode = 'GND'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-probe-led')?.addEventListener('click', () => {
        hw.dmmRedNode = 'LED_ANODE'; hw.dmmBlackNode = 'GND'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-probe-drop')?.addEventListener('click', () => {
        hw.dmmRedNode = 'LED_ANODE'; hw.dmmBlackNode = 'LED_CATHODE'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-probe-rdrop')?.addEventListener('click', () => {
        hw.dmmRedNode = 'R_IN'; hw.dmmBlackNode = 'LED_ANODE'; updateDmmDisplay();
      });

      document.getElementById('btn-dmm-verify-l1')?.addEventListener('click', () => {
        hw.dmmRedNode = 'LED_ANODE'; hw.dmmBlackNode = 'LED_CATHODE'; updateDmmDisplay();
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dmmVoltageVerified');
      });

      setupDmmClickableNodes();
      updateDmmDisplay();
    }

    function renderDmmLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.dmmMode = 'ohm';

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 50</span>
          <h3>4-Band Resistor Color Code & Ohmmeter Studio</h3>
        </div>
        <p class="instruction-text">
          In Ohms mode (Ω), the meter measures resistance. Notice the color rings:
          <strong>Red (2)</strong> • <strong>Red (2)</strong> • <strong>Brown (x10)</strong> • <strong>Gold (±5%)</strong> = <strong>220Ω</strong>.
        </p>

        <div style="background:rgba(15,23,42,0.6); padding:0.85rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-code); font-size:0.85rem;">
            <span>Bands: <strong style="color:#ef4444;">RED</strong> <strong style="color:#ef4444;">RED</strong> <strong style="color:#78350f;">BRN</strong> <strong style="color:#eab308;">GLD</strong></span>
            <span style="color:#10b981; font-weight:700;">22 x 10¹ = 220 Ω</span>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dmm-verify-ohm">
            <span>🔍</span> Probe 220Ω Resistor & Verify Tolerance
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-dmm-verify-ohm')?.addEventListener('click', () => {
        hw.dmmRedNode = 'R_IN'; hw.dmmBlackNode = 'LED_ANODE'; updateDmmDisplay();
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dmmResistanceVerified');
      });

      setupDmmClickableNodes();
      updateDmmDisplay();
    }

    function renderDmmLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.dmmMode = 'cont';

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 51</span>
          <h3>The Audio Continuity Buzzer: Sniffing Open & Short Circuits</h3>
        </div>
        <p class="instruction-text">
          Turn on sound! When resistance between probes is under 50Ω, the internal piezo buzzer sings.
          Test breadboard rails and check for dangerous short circuits between +5V and GND!
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-dmm-cont-touch" style="font-size:0.8rem; padding:0.5rem;">
            <span>📢</span> Touch Probes Together (0Ω - BEEP!)
          </button>
          <button class="secondary-btn" id="btn-dmm-cont-gnd" style="font-size:0.8rem; padding:0.5rem;">
            <span>🔌</span> Test Ground Trace (BEEP!)
          </button>
          <button class="secondary-btn" id="btn-dmm-cont-short" style="font-size:0.8rem; padding:0.5rem;">
            <span>🛡️</span> Test +5V to GND (SILENT - Safe)
          </button>
          <button class="secondary-btn" id="btn-dmm-cont-open" style="font-size:0.8rem; padding:0.5rem;">
            <span>💨</span> Open Air Probes (O.L - Silent)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dmm-verify-cont">
            <span>📢</span> Confirm Continuity Verification
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-dmm-cont-touch')?.addEventListener('click', () => {
        hw.dmmRedNode = 'GND'; hw.dmmBlackNode = 'GND'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-cont-gnd')?.addEventListener('click', () => {
        hw.dmmRedNode = 'LED_CATHODE'; hw.dmmBlackNode = 'GND'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-cont-short')?.addEventListener('click', () => {
        hw.dmmRedNode = '5V'; hw.dmmBlackNode = 'GND'; updateDmmDisplay();
      });
      document.getElementById('btn-dmm-cont-open')?.addEventListener('click', () => {
        hw.dmmRedNode = '5V'; hw.dmmBlackNode = 'LED_ANODE'; updateDmmDisplay();
      });

      document.getElementById('btn-dmm-verify-cont')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dmmContinuityVerified');
      });

      setupDmmClickableNodes();
      updateDmmDisplay();
    }

    function renderDmmLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 52 • CAPSTONE</span>
          <h3>The Circuit Doctor: Real-World Fault Diagnostics</h3>
        </div>
        <p class="instruction-text">
          A client brought in 3 malfunctioning breadboards! Choose a mystery board, probe the voltages, and diagnose the root failure.
        </p>

        <div style="display:flex; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn active" id="btn-fault-1" style="font-size:0.8rem; flex:1; padding:0.4rem;">
            Board #1
          </button>
          <button class="secondary-btn" id="btn-fault-2" style="font-size:0.8rem; flex:1; padding:0.4rem;">
            Board #2
          </button>
          <button class="secondary-btn" id="btn-fault-3" style="font-size:0.8rem; flex:1; padding:0.4rem;">
            Board #3
          </button>
        </div>

        <div id="dmm-diagnosis-box" style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:var(--radius-md); font-size:0.8rem; border:1px solid rgba(255,255,255,0.08); margin-bottom:0.75rem;">
          <div>Scenario: <strong id="fault-title" style="color:#38bdf8;">Board #1 - LED Not Lighting Up</strong></div>
          <div style="color:var(--text-muted); font-size:0.75rem; margin-top:0.25rem;">Probe Node 3 (Anode) to find out why!</div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dmm-solve-fault">
            <span>🩺</span> Diagnose & Repair Circuit Fault
          </button>
        </div>
      </div>
    `;

      const b1 = document.getElementById('btn-fault-1');
      const b2 = document.getElementById('btn-fault-2');
      const b3 = document.getElementById('btn-fault-3');
      const fTitle = document.getElementById('fault-title');

      b1?.addEventListener('click', () => {
        hw.dmmFaultScenario = 'reversed_led';
        b1.classList.add('active'); b2.classList.remove('active'); b3.classList.remove('active');
        fTitle.textContent = 'Board #1: LED Inverted (Backwards Polarity)';
        updateDmmDisplay();
      });

      b2?.addEventListener('click', () => {
        hw.dmmFaultScenario = 'blown_resistor';
        b2.classList.add('active'); b1.classList.remove('active'); b3.classList.remove('active');
        fTitle.textContent = 'Board #2: Open-Circuit (Burned/Blown Resistor)';
        updateDmmDisplay();
      });

      b3?.addEventListener('click', () => {
        hw.dmmFaultScenario = 'short_circuit';
        b3.classList.add('active'); b1.classList.remove('active'); b2.classList.remove('active');
        fTitle.textContent = 'Board #3: Accidental Solder Bridge (Dead Short to GND)';
        updateDmmDisplay();
      });

      document.getElementById('btn-dmm-solve-fault')?.addEventListener('click', () => {
        hw.dmmFaultScenario = 'healthy';
        if (fTitle) fTitle.textContent = '✅ Fault Fixed: Healthy 5V Supply & 2.05V LED Forward Bias Restored!';
        updateDmmDisplay();
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dmmFaultSolved');
      });

      setupDmmClickableNodes();
      updateDmmDisplay();
    }



    // =========================================================================
    // SLICER LESSONS (3D Printing Slicing & G-Code Studio)
    // =========================================================================

    function updateSlicerPreview() {
      const hw = window.circuitSimulation.getHardwareState();
      const layer = hw.slicerLayer || 45;
      const lh = hw.slicerLayerHeight || 0.20;
      const infill = hw.slicerInfillDensity || 20;
      const pat = hw.slicerInfillPattern || 'grid';

      // Move active layer highlight and printhead nozzle vertically
      // Layer 1 = bottom (y=88), Layer 100 = top (y=30)
      const yPos = 88 - (layer / 100) * 58;
      const activeLayer = document.getElementById('slicer-active-layer');
      const printhead = document.getElementById('slicer-printhead');
      const telemLayer = document.getElementById('slicer-telemetry-layer');
      const telemTemps = document.getElementById('slicer-telemetry-temps');
      const infillPath = document.querySelector('#slicer-infill-pattern path');

      if (activeLayer) activeLayer.setAttribute('transform', `translate(0, ${yPos})`);
      if (printhead) printhead.setAttribute('transform', `translate(135, ${yPos - 20})`);

      const zMm = (layer * lh).toFixed(2);
      if (telemLayer) {
        telemLayer.textContent = `Layer ${layer} / 100 (Z = ${zMm}mm) • Infill: ${infill}% ${pat.toUpperCase()}`;
      }

      const estMins = Math.round(42 * (0.20 / lh));
      if (telemTemps) {
        telemTemps.textContent = `Hotend: 205°C | Bed: 60°C | Est. Time: ${estMins}m | Filament: 4.8m (14g)`;
      }

      // Infill pattern visuals
      if (infillPath) {
        if (pat === 'gyroid') {
          infillPath.setAttribute('d', 'M 0 35 Q 25 25 50 35 T 100 35 M 0 55 Q 25 45 50 55 T 100 55 M 0 75 Q 25 65 50 75 T 100 75');
        } else if (pat === 'honeycomb') {
          infillPath.setAttribute('d', 'M 20 30 L 30 45 L 20 60 L 30 75 M 50 30 L 60 45 L 50 60 L 60 75 M 80 30 L 90 45 L 80 60 L 90 75');
        } else {
          infillPath.setAttribute('d', 'M 15 30 L 15 90 M 35 30 L 35 90 M 55 30 L 55 90 M 75 30 L 75 90 M 0 45 L 100 45 M 0 65 L 100 65 M 0 80 L 100 80');
        }
      }

      if (window.circuitSimulation) window.circuitSimulation.notifyHardware();
    }

    function renderSlicerLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 53</span>
          <h3>FDM Slicing Engine & Layer Height Optimization</h3>
        </div>
        <p class="instruction-text">
          Drag the <strong>Layer Slider</strong> to scrub through all 100 horizontal G-code toolpath slices from the build plate up!
          Switch between <strong>Fine (0.12mm)</strong> and <strong>Draft (0.28mm)</strong> to compare print times.
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>🥞 Scrub Slicer Layer Height:</span>
              <span id="slicer-layer-val" style="font-family:var(--font-code); color:#38bdf8;">Layer ${hw.slicerLayer || 45} / 100</span>
            </div>
            <input type="range" id="slicer-layer-slider" min="1" max="100" value="${hw.slicerLayer || 45}" style="width:100%;">
          </div>

          <div style="display:flex; gap:0.5rem;">
            <button class="secondary-btn ${hw.slicerLayerHeight === 0.12 ? 'active' : ''}" id="btn-lh-fine" style="font-size:0.78rem; flex:1; padding:0.45rem;">
              Fine (0.12mm)
            </button>
            <button class="secondary-btn ${hw.slicerLayerHeight === 0.20 ? 'active' : ''}" id="btn-lh-std" style="font-size:0.78rem; flex:1; padding:0.45rem;">
              Standard (0.20mm)
            </button>
            <button class="secondary-btn ${hw.slicerLayerHeight === 0.28 ? 'active' : ''}" id="btn-lh-draft" style="font-size:0.78rem; flex:1; padding:0.45rem;">
              Draft (0.28mm)
            </button>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-slicer-verify-l1">
            <span>🖨️</span> Verify 0.20mm Slicing Profile
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('slicer-layer-slider');
      slider?.addEventListener('input', () => {
        hw.slicerLayer = parseInt(slider.value, 10);
        const val = document.getElementById('slicer-layer-val');
        if (val) val.textContent = `Layer ${hw.slicerLayer} / 100`;
        updateSlicerPreview();
      });

      document.getElementById('btn-lh-fine')?.addEventListener('click', () => {
        hw.slicerLayerHeight = 0.12; updateSlicerPreview(); renderSlicerLesson1(lesson);
      });
      document.getElementById('btn-lh-std')?.addEventListener('click', () => {
        hw.slicerLayerHeight = 0.20; updateSlicerPreview(); renderSlicerLesson1(lesson);
      });
      document.getElementById('btn-lh-draft')?.addEventListener('click', () => {
        hw.slicerLayerHeight = 0.28; updateSlicerPreview(); renderSlicerLesson1(lesson);
      });

      document.getElementById('btn-slicer-verify-l1')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('slicerLayerVerified');
      });

      updateSlicerPreview();
    }

    function renderSlicerLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 54</span>
          <h3>Internal Lattice Infill & Strength-to-Weight Optimization</h3>
        </div>
        <p class="instruction-text">
          Compare infill patterns: <strong>Grid</strong> (fast orthogonal boxes), <strong>Gyroid</strong> (equal strength in all axes), and <strong>Honeycomb</strong> (crush resistant).
        </p>

        <div style="display:flex; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn ${hw.slicerInfillPattern === 'grid' ? 'active' : ''}" id="btn-inf-grid" style="font-size:0.8rem; flex:1; padding:0.45rem;">
            Grid Infill
          </button>
          <button class="secondary-btn ${hw.slicerInfillPattern === 'gyroid' ? 'active' : ''}" id="btn-inf-gyroid" style="font-size:0.8rem; flex:1; padding:0.45rem;">
            Gyroid Infill
          </button>
          <button class="secondary-btn ${hw.slicerInfillPattern === 'honeycomb' ? 'active' : ''}" id="btn-inf-honeycomb" style="font-size:0.8rem; flex:1; padding:0.45rem;">
            Honeycomb
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-slicer-verify-inf">
            <span>⚖️</span> Verify 20% Gyroid Infill Optimization
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-inf-grid')?.addEventListener('click', () => {
        hw.slicerInfillPattern = 'grid'; updateSlicerPreview(); renderSlicerLesson2(lesson);
      });
      document.getElementById('btn-inf-gyroid')?.addEventListener('click', () => {
        hw.slicerInfillPattern = 'gyroid'; updateSlicerPreview(); renderSlicerLesson2(lesson);
      });
      document.getElementById('btn-inf-honeycomb')?.addEventListener('click', () => {
        hw.slicerInfillPattern = 'honeycomb'; updateSlicerPreview(); renderSlicerLesson2(lesson);
      });

      document.getElementById('btn-slicer-verify-inf')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('slicerInfillVerified');
      });

      updateSlicerPreview();
    }

    function renderSlicerLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 55</span>
          <h3>Overhang Physics & Tree Support Generation</h3>
        </div>
        <p class="instruction-text">
          Angles steeper than <strong>45°</strong> cannot be printed in thin air without supports.
          Toggle <strong>Tree Supports</strong> on to generate organic breakaway branches!
        </p>

        <div style="background:rgba(15,23,42,0.6); padding:0.85rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Tree Supports: <strong style="color:${hw.slicerSupportsEnabled ? '#10b981' : '#f59e0b'};">${hw.slicerSupportsEnabled ? 'ENABLED (Tree Branches Active)' : 'DISABLED'}</strong></span>
            <button class="secondary-btn" id="btn-toggle-supports" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
              Toggle Supports
            </button>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-slicer-verify-sup">
            <span>🌳</span> Generate & Verify 45° Breakaway Supports
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-toggle-supports')?.addEventListener('click', () => {
        hw.slicerSupportsEnabled = !hw.slicerSupportsEnabled;
        if (window.soundEngine) window.soundEngine.playClick();
        renderSlicerLesson3(lesson);
      });

      document.getElementById('btn-slicer-verify-sup')?.addEventListener('click', () => {
        hw.slicerSupportsEnabled = true;
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('slicerSupportVerified');
        renderSlicerLesson3(lesson);
      });

      updateSlicerPreview();
    }

    function renderSlicerLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 56 • CAPSTONE</span>
          <h3>Executing Raw G-Code & Heated Bed Adhesion</h3>
        </div>
        <p class="instruction-text">
          Execute the G-code machine sequence: <strong>M140 (Heat Bed 60°C)</strong>, 
          <strong>M104 (Heat Nozzle 205°C)</strong>, <strong>G28 (Auto-Home)</strong>, and extrude the first layer purge line!
        </p>

        <div style="background:#020617; padding:0.75rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.75rem; color:#a3e635; margin:0.75rem 0; border:1px solid #1e293b;">
          <div>&gt; M140 S60   ; Heated bed target reached (60°C)</div>
          <div>&gt; M104 S205  ; Nozzle heater active (205°C)</div>
          <div>&gt; G28        ; Homing X, Y, Z axes... OK</div>
          <div>&gt; G1 Z0.20 F1200 ; First layer height 0.20mm squish</div>
          <div>&gt; G1 X100 E5.0 F1500 ; Purge line primed!</div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-slicer-run-gcode">
            <span>▶</span> Send G-Code & Execute First Layer Print
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-slicer-run-gcode')?.addEventListener('click', () => {
        hw.slicerLayer = 1;
        updateSlicerPreview();
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('slicerGCodeExecuted');
      });

      updateSlicerPreview();
    }



    // =========================================================================
    // DHT LESSONS (DHT11/DHT22 Digital Climate Station)
    // =========================================================================

    function calculateHeatIndexC(t, h) {
      const tf = (t * 1.8) + 32.0;
      const hiF = -42.379 + (2.04901523 * tf) + (10.14333127 * h)
        - (0.22475541 * tf * h) - (0.00683783 * tf * tf)
        - (0.05481717 * h * h) + (0.00122874 * tf * tf * h)
        + (0.00085282 * tf * h * h) - (0.00000199 * tf * tf * h * h);
      return (hiF - 32.0) / 1.8;
    }

    function updateDhtAtmosphere() {
      const hw = window.circuitSimulation.getHardwareState();
      const t = hw.dhtTemp || 28.5;
      const h = hw.dhtHumidity || 65.0;
      const hi = calculateHeatIndexC(t, h);
      hw.dhtHeatIndex = hi;

      // Automated Greenhouse logic: fan if t > 30, mist if h < 50
      hw.dhtFanState = (t >= 30.0);
      hw.dhtMistState = (h <= 50.0);

      const svgTemp = document.getElementById('dht-svg-temp');
      const svgRh = document.getElementById('dht-svg-rh');
      const svgHi = document.getElementById('dht-svg-hi');

      if (svgTemp) svgTemp.textContent = `${t.toFixed(1)}°C`;
      if (svgRh) svgRh.textContent = `${h.toFixed(1)}%`;
      if (svgHi) {
        const tag = hi > 38 ? 'Hazard' : (hi > 32 ? 'Caution' : 'Optimal');
        svgHi.textContent = `${hi.toFixed(1)}°C (${tag})`;
      }

      if (window.circuitSimulation) window.circuitSimulation.notifyHardware();
    }

    function renderDhtLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 57</span>
          <h3>The 1-Wire Single-Bus Handshake Protocol</h3>
        </div>
        <p class="instruction-text">
          Click <strong>Trigger 18ms Wake-Up Handshake</strong> to command Arduino Pin 4 to pull the single-bus line LOW, 
          triggering the sensor's 80µs response and receiving 40 bits of digital climate telemetry!
        </p>

        <div style="background:rgba(15,23,42,0.6); padding:0.85rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;">
          <div style="font-family:var(--font-code); font-size:0.8rem; color:#38bdf8;">
            <div>&gt; Host: Pin 4 LOW 18,000 µs (Wake Up)</div>
            <div>&gt; Sensor: 80µs LOW + 80µs HIGH (ACK)</div>
            <div>&gt; Packet: [Humidity 16b] [Temp 16b] [Checksum 8b]</div>
            <div style="color:#a3e635; margin-top:0.25rem;">&gt; Telemetry Status: Handshake Synchronized!</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dht-handshake">
            <span>⚡</span> Trigger 18ms Wake-Up Handshake
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-dht-handshake')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playTone(1800, 0.12);
        checkVerification('dhtHandshakeVerified');
        updateDhtAtmosphere();
      });

      updateDhtAtmosphere();
    }

    function renderDhtLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 58</span>
          <h3>Capacitive Polymer Relative Humidity Sensing</h3>
        </div>
        <p class="instruction-text">
          Drag the <strong>Humidity Chamber Slider</strong> to simulate arid desert (20% RH) up to tropical monsoon (95% RH).
          Observe how the dielectric polymer capacitance shifts in real-time!
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>💧 Simulated Relative Humidity:</span>
              <span id="dht-h-val" style="font-family:var(--font-code); color:#06b6d4;">${(hw.dhtHumidity || 65).toFixed(1)}% RH</span>
            </div>
            <input type="range" id="dht-slider-h" min="20" max="95" step="1" value="${hw.dhtHumidity || 65}" style="width:100%;">
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-dht-verify-l2">
            <span>💧</span> Verify 65.0% Ideal Comfort Target
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('dht-slider-h');
      slider?.addEventListener('input', () => {
        hw.dhtHumidity = parseFloat(slider.value);
        const val = document.getElementById('dht-h-val');
        if (val) val.textContent = `${hw.dhtHumidity.toFixed(1)}% RH`;
        updateDhtAtmosphere();
      });

      document.getElementById('btn-dht-verify-l2')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dhtComfortVerified');
      });

      updateDhtAtmosphere();
    }

    function renderDhtLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 59</span>
          <h3>NOAA Heat Index & The "Feels Like" Discomfort Formula</h3>
        </div>
        <p class="instruction-text">
          Drag both <strong>Temperature</strong> and <strong>Humidity</strong> to see how high moisture prevents sweat evaporation, 
          making 35°C at 80% humidity feel like a scorching <strong>48°C</strong>!
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>🌡️ Ambient Temperature:</span>
              <span id="dht-t-val" style="font-family:var(--font-code); color:#ef4444;">${(hw.dhtTemp || 28.5).toFixed(1)}°C</span>
            </div>
            <input type="range" id="dht-slider-t" min="15" max="45" step="0.5" value="${hw.dhtTemp || 28.5}" style="width:100%;">
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>💧 Relative Humidity:</span>
              <span id="dht-h2-val" style="font-family:var(--font-code); color:#06b6d4;">${(hw.dhtHumidity || 65).toFixed(1)}% RH</span>
            </div>
            <input type="range" id="dht-slider-h2" min="20" max="95" step="1" value="${hw.dhtHumidity || 65}" style="width:100%;">
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-dht-verify-hi">
            <span>☀️</span> Calculate & Verify NOAA Heat Index
          </button>
        </div>
      </div>
    `;

      const st = document.getElementById('dht-slider-t');
      const sh = document.getElementById('dht-slider-h2');

      const onSlide = () => {
        hw.dhtTemp = parseFloat(st.value);
        hw.dhtHumidity = parseFloat(sh.value);
        const vt = document.getElementById('dht-t-val');
        const vh = document.getElementById('dht-h2-val');
        if (vt) vt.textContent = `${hw.dhtTemp.toFixed(1)}°C`;
        if (vh) vh.textContent = `${hw.dhtHumidity.toFixed(1)}% RH`;
        updateDhtAtmosphere();
      };

      st?.addEventListener('input', onSlide);
      sh?.addEventListener('input', onSlide);

      document.getElementById('btn-dht-verify-hi')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dhtHeatIndexVerified');
      });

      updateDhtAtmosphere();
    }

    function renderDhtLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 60 • CAPSTONE</span>
          <h3>Autonomous Smart Greenhouse Climate Regulator</h3>
        </div>
        <p class="instruction-text">
          Test the closed-loop greenhouse feedback brain! 
          Push temperature over 30°C to activate the <strong>Exhaust Fan</strong>, and drop humidity under 50% to trigger the <strong>Misting Atomizer</strong>!
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin:0.75rem 0;">
          <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:0.8rem; font-weight:700; color:#ef4444;">Exhaust Fan (Pin 6)</div>
            <div style="font-size:1.1rem; font-weight:900; color:${hw.dhtFanState ? '#22c55e' : '#94a3b8'}; margin-top:0.25rem;">
              ${hw.dhtFanState ? '🌀 SPINNING (COOLING)' : '⏹️ RESTING (TEMP OK)'}
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem;">Activates when Temp &gt; 30.0°C</div>
          </div>

          <div style="background:rgba(15,23,42,0.6); padding:0.75rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:0.8rem; font-weight:700; color:#06b6d4;">Misting Fog (Pin 7)</div>
            <div style="font-size:1.1rem; font-weight:900; color:${hw.dhtMistState ? '#22c55e' : '#94a3b8'}; margin-top:0.25rem;">
              ${hw.dhtMistState ? '🌫️ MISTING (HUMIDIFY)' : '⏹️ RESTING (RH OK)'}
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem;">Activates when Humidity &lt; 50.0%</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-dht-test-hotdry">
            <span>🔥</span> Test Hot & Dry Alarm (34°C, 35% RH)
          </button>
          <button class="secondary-btn" id="btn-dht-test-ideal">
            <span>🌱</span> Restore Ideal Climate (26°C, 65% RH)
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-dht-test-hotdry')?.addEventListener('click', () => {
        hw.dhtTemp = 34.0;
        hw.dhtHumidity = 35.0;
        updateDhtAtmosphere();
        renderDhtLesson4(lesson);
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('dhtGreenhouseRegulated');
      });

      document.getElementById('btn-dht-test-ideal')?.addEventListener('click', () => {
        hw.dhtTemp = 26.0;
        hw.dhtHumidity = 65.0;
        updateDhtAtmosphere();
        renderDhtLesson4(lesson);
        if (window.soundEngine) window.soundEngine.playClick();
      });

      updateDhtAtmosphere();
    }



    // =========================================================================
    // GAS LESSONS (MQ-2 / MQ-135 Hazardous Gas & Air Quality Studio)
    // =========================================================================

    function updateGasChamber() {
      const hw = window.circuitSimulation.getHardwareState();
      const ppm = hw.gasPpm || 120;

      // Map PPM to AQI: 50ppm ~ 20 AQI, 500ppm ~ 150 AQI, 1000ppm ~ 300 AQI
      const aqi = Math.round((ppm / 1000) * 280 + 15);
      hw.gasAqi = aqi;

      // Alarm triggers if PPM > 400
      hw.gasAlarmActive = (ppm >= 400);

      const svgPpm = document.getElementById('gas-svg-ppm');
      const svgAqi = document.getElementById('gas-svg-aqi');
      const svgAlarm = document.getElementById('gas-svg-alarm');
      const heaterGlow = document.getElementById('gas-heater-glow');

      if (svgPpm) svgPpm.textContent = `${ppm} PPM`;
      if (svgAqi) {
        const cat = aqi <= 50 ? 'Good' : (aqi <= 100 ? 'Moderate' : (aqi <= 200 ? 'Poor' : 'Hazard'));
        svgAqi.textContent = `${aqi} (${cat})`;
      }
      if (svgAlarm) {
        svgAlarm.textContent = hw.gasAlarmActive ? '🚨 HAZARD ALARM!' : 'CLEAR (Safe)';
        svgAlarm.setAttribute('fill', hw.gasAlarmActive ? '#ef4444' : '#38bdf8');
      }

      if (heaterGlow) {
        heaterGlow.setAttribute('opacity', hw.gasAlarmActive ? '1.0' : '0.85');
      }

      if (hw.gasAlarmActive && window.soundEngine) {
        window.soundEngine.playTone(1100, 0.15);
      }

      if (window.circuitSimulation) window.circuitSimulation.notifyHardware();
    }

    function renderGasLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 61</span>
          <h3>Tin Dioxide (SnO₂) Surface Chemistry & 300°C Heating Coil</h3>
        </div>
        <p class="instruction-text">
          Notice the glowing orange heating coil in the center of the metal mesh dome!
          Click <strong>Verify 300°C Preheat Thermal Balance</strong> to check the oxygen adsorption layer.
        </p>

        <div style="background:rgba(15,23,42,0.6); padding:0.85rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-around; align-items:center;">
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">🔥</span>
              <div style="font-size:0.78rem; font-weight:700; color:#f97316;">Internal Coil</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">5.0V / 155mA (300°C)</div>
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#38bdf8;">→</div>
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">🧪</span>
              <div style="font-size:0.78rem; font-weight:700; color:#22d3ee;">SnO₂ Surface</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">O₂⁻ Ion Barrier</div>
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#10b981;">=</div>
            <div style="text-align:center;">
              <span style="font-size:1.5rem;">⚡</span>
              <div style="font-size:0.78rem; font-weight:700; color:#10b981;">Ready to Sniff</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Rs = 20kΩ (Clean)</div>
            </div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-gas-verify-l1">
            <span>🔥</span> Verify 300°C Preheat Thermal Balance
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-gas-verify-l1')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gasHeaterVerified');
      });

      updateGasChamber();
    }

    function renderGasLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 62</span>
          <h3>Reading Logarithmic Sensitivity Curves (Rs/R0 Power Law)</h3>
        </div>
        <p class="instruction-text">
          Drag the <strong>Gas Exposure Slider</strong> to introduce LPG and smoke particles into the virtual chamber.
          Watch the sensor resistance ratio (Rs/R0) drop and compute exact PPM!
        </p>

        <div class="slider-control-card" style="margin-top:0.75rem;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>🧪 Gas Concentration in Chamber:</span>
              <span id="gas-ppm-val" style="font-family:var(--font-code); color:#f59e0b;">${hw.gasPpm || 120} PPM</span>
            </div>
            <input type="range" id="gas-slider-ppm" min="50" max="1500" step="25" value="${hw.gasPpm || 120}" style="width:100%;">
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.85rem;">
          <button class="primary-btn" id="btn-gas-verify-l2">
            <span>📐</span> Verify Rs/R0 Power-Law Mathematical Curve
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('gas-slider-ppm');
      slider?.addEventListener('input', () => {
        hw.gasPpm = parseInt(slider.value, 10);
        const val = document.getElementById('gas-ppm-val');
        if (val) val.textContent = `${hw.gasPpm} PPM`;
        updateGasChamber();
      });

      document.getElementById('btn-gas-verify-l2')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gasLogCurveVerified');
      });

      updateGasChamber();
    }

    function renderGasLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 63</span>
          <h3>LM393 Comparator Interrupt & Emergency Evacuation Siren</h3>
        </div>
        <p class="instruction-text">
          Simulate a dangerous kitchen gas leak or electrical fire!
          Push PPM over the <strong>400 PPM Threshold</strong> to trip Pin 2 and fire the emergency strobe alarm!
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-gas-inject-leak" style="font-size:0.8rem; padding:0.55rem; color:#ef4444; border-color:rgba(239,68,68,0.4);">
            <span>🔥</span> Inject 850 PPM Gas Leak
          </button>
          <button class="secondary-btn" id="btn-gas-vent-air" style="font-size:0.8rem; padding:0.55rem; color:#10b981; border-color:rgba(16,185,129,0.4);">
            <span>💨</span> Purge Clean Air (100 PPM)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-gas-verify-alarm">
            <span>🚨</span> Trigger & Test Hardware Interrupt Alarm
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-gas-inject-leak')?.addEventListener('click', () => {
        hw.gasPpm = 850;
        updateGasChamber();
        if (window.soundEngine) window.soundEngine.playTone(1100, 0.25);
      });

      document.getElementById('btn-gas-vent-air')?.addEventListener('click', () => {
        hw.gasPpm = 100;
        updateGasChamber();
        if (window.soundEngine) window.soundEngine.playClick();
      });

      document.getElementById('btn-gas-verify-alarm')?.addEventListener('click', () => {
        hw.gasPpm = 850;
        updateGasChamber();
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gasAlarmTriggered');
      });

      updateGasChamber();
    }

    function renderGasLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 64 • CAPSTONE</span>
          <h3>National Air Quality Index (AQI) Public Health Deck</h3>
        </div>
        <p class="instruction-text">
          Broadcast civic air quality telemetry! Categorize pollution levels into CPCB color-coded tiers and issue public advisories.
        </p>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-aqi-good" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#22c55e; color:#86efac;">
            Good (35)
          </button>
          <button class="secondary-btn" id="btn-aqi-mod" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#eab308; color:#fde047;">
            Moderate (85)
          </button>
          <button class="secondary-btn" id="btn-aqi-poor" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#f97316; color:#fed7aa;">
            Poor (165)
          </button>
          <button class="secondary-btn" id="btn-aqi-severe" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#dc2626; color:#fca5a5;">
            Severe (350)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-gas-broadcast-aqi">
            <span>📡</span> Broadcast Official AQI Health Advisory
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-aqi-good')?.addEventListener('click', () => {
        hw.gasPpm = 80; updateGasChamber(); renderGasLesson4(lesson);
      });
      document.getElementById('btn-aqi-mod')?.addEventListener('click', () => {
        hw.gasPpm = 250; updateGasChamber(); renderGasLesson4(lesson);
      });
      document.getElementById('btn-aqi-poor')?.addEventListener('click', () => {
        hw.gasPpm = 550; updateGasChamber(); renderGasLesson4(lesson);
      });
      document.getElementById('btn-aqi-severe')?.addEventListener('click', () => {
        hw.gasPpm = 1200; updateGasChamber(); renderGasLesson4(lesson);
      });

      document.getElementById('btn-gas-broadcast-aqi')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gasAqiBroadcasted');
      });

      updateGasChamber();
    }



    // =========================================================================
    // OLED LESSONS (SSD1306 128x64 Graphic Display Studio)
    // =========================================================================

    function updateOledScreen() {
      const hw = window.circuitSimulation.getHardwareState();
      const l1 = document.getElementById('oled-svg-line1');
      const l2 = document.getElementById('oled-svg-line2');
      const footer = document.getElementById('oled-svg-footer');
      const sparkline = document.getElementById('oled-svg-sparkline');
      const bar = document.getElementById('oled-svg-bar');
      const cursor = document.getElementById('oled-svg-cursor');

      const curX = hw.oledCursorX !== undefined ? hw.oledCursorX : 64;
      const curY = hw.oledCursorY !== undefined ? hw.oledCursorY : 32;
      const page = Math.floor(curY / 8);
      const bit = curY % 8;
      const addr = page * 128 + curX;

      if (state.activeLessonId === 1) {
        if (l1) l1.textContent = `PIXEL: (${curX}, ${curY})`;
        if (l2) l2.textContent = `PAGE: ${page} | BIT: ${bit}`;
        if (footer) footer.textContent = `ADDR: 0x${addr.toString(16).toUpperCase()} | 1024B`;
        if (bar) bar.setAttribute('width', Math.min(112, Math.round((curX / 128) * 112)));
        if (cursor) cursor.style.display = 'none';

        // Draw crosshair on sparkline path
        if (sparkline) {
          const sx = 4 + (curX / 128) * 112;
          const sy = 30 + (curY / 64) * 35;
          sparkline.setAttribute('d', `M ${sx - 10} ${sy} L ${sx + 10} ${sy} M ${sx} ${sy - 10} L ${sx} ${sy + 10}`);
        }
      } else if (state.activeLessonId === 2) {
        const mode = hw.oledSpriteMode || 'heart';
        if (l1) l1.textContent = `SPRITE: ${mode.toUpperCase()} (8x8)`;
        if (l2) l2.textContent = 'PROGMEM FLASH: 8 BYTES';
        if (footer) footer.textContent = 'DRAW: drawBitmap(10,10)';
        if (bar) bar.setAttribute('width', 95);
        if (cursor) cursor.style.display = 'none';

        // Shape preview path
        if (sparkline) {
          if (mode === 'heart') {
            sparkline.setAttribute('d', 'M 50 45 C 50 35, 30 35, 30 50 C 30 65, 60 78, 60 78 C 60 78, 90 65, 90 50 C 90 35, 70 35, 70 45 Z');
          } else if (mode === 'invader') {
            sparkline.setAttribute('d', 'M 35 45 H 85 V 65 H 35 Z M 45 40 H 55 V 45 H 45 Z M 65 40 H 75 V 45 H 65 Z');
          } else if (mode === 'star') {
            sparkline.setAttribute('d', 'M 60 35 L 65 50 L 80 50 L 68 60 L 72 75 L 60 65 L 48 75 L 52 60 L 40 50 L 55 50 Z');
          } else {
            sparkline.setAttribute('d', 'M 40 55 L 55 70 L 85 40');
          }
        }
      } else if (state.activeLessonId === 3) {
        const wave = hw.oledWaveType || 'sine';
        const freq = hw.oledWaveFreq || 2;
        if (l1) l1.textContent = `OSCILLOSCOPE: ${wave.toUpperCase()}`;
        if (l2) l2.textContent = `FREQ: ${freq} Hz | 42 FPS`;
        if (footer) footer.textContent = 'RING BUFFER: 128 SAMPLES';
        if (bar) bar.setAttribute('width', Math.min(112, freq * 11));
        if (cursor) cursor.style.display = 'none';

        // Generate dynamic wave path
        if (sparkline) {
          let d = 'M 4 55 ';
          for (let x = 0; x <= 112; x += 3) {
            let y = 55;
            if (wave === 'sine') {
              y = 55 + Math.sin((x / 112) * Math.PI * 2 * freq) * 16;
            } else if (wave === 'ecg') {
              const phase = (x * freq * 0.1) % 1;
              if (phase > 0.4 && phase < 0.5) y = 55 - 20;
              else if (phase >= 0.5 && phase < 0.6) y = 55 + 10;
              else y = 55;
            } else if (wave === 'square') {
              const phase = (x * freq * 0.05) % 1;
              y = phase < 0.5 ? 40 : 70;
            } else {
              // noise
              y = 55 + (Math.sin(x * 12.34) * 0.5 + Math.cos(x * 5.67) * 0.5) * 14;
            }
            d += `L ${4 + x} ${y.toFixed(1)} `;
          }
          sparkline.setAttribute('d', d);
        }
      } else if (state.activeLessonId === 4) {
        const pages = ['1. DASHBOARD', '2. SENSORS', '3. SETTINGS'];
        const pIdx = hw.oledMenuPage !== undefined ? hw.oledMenuPage : 0;
        if (l1) l1.textContent = 'MENU NAV: FSM';
        if (l2) l2.textContent = pages[pIdx];
        if (footer) footer.textContent = `SELECTED: [ITEM ${pIdx + 1}/3]`;
        if (bar) bar.setAttribute('width', (pIdx + 1) * 37);

        if (cursor) {
          cursor.style.display = 'block';
          cursor.setAttribute('y', 20 + pIdx * 16);
        }
        if (sparkline) {
          sparkline.setAttribute('d', `M 4 ${32 + pIdx * 16} L 116 ${32 + pIdx * 16}`);
        }
      }

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderOledLesson1(lesson) {
      const hw = window.circuitSimulation.getHardwareState();
      hw.oledCursorX = hw.oledCursorX !== undefined ? hw.oledCursorX : 64;
      hw.oledCursorY = hw.oledCursorY !== undefined ? hw.oledCursorY : 32;

      const page = Math.floor(hw.oledCursorY / 8);
      const bit = hw.oledCursorY % 8;
      const memOffset = page * 128 + hw.oledCursorX;

      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📍</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">128×64 Pixel Matrix & Memory Page Inspector</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              8,192 Self-Lit OLED Pixels • 8 Vertical Pages • 1,024 Bytes SRAM Framebuffer
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">X Coordinate: <strong id="oled-val-x" style="color:#38bdf8;">${hw.oledCursorX}</strong> / 127</span>
            <span style="color:#cbd5e1;">Horizontal Column</span>
          </div>
          <input type="range" id="oled-slider-x" min="0" max="127" value="${hw.oledCursorX}" style="width:100%; accent-color:#38bdf8;" />

          <div style="display:flex; justify-content:space-between; margin:0.6rem 0 0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Y Coordinate: <strong id="oled-val-y" style="color:#38bdf8;">${hw.oledCursorY}</strong> / 63</span>
            <span style="color:#cbd5e1;">Vertical Row</span>
          </div>
          <input type="range" id="oled-slider-y" min="0" max="63" value="${hw.oledCursorY}" style="width:100%; accent-color:#06b6d4;" />
        </div>

        <!-- Real-time Memory Page breakdown -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SSD1306 PAGE</div>
            <div id="box-page" style="font-size:1rem; font-weight:800; color:#38bdf8;">Page ${page}</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">BYTE BIT (0-7)</div>
            <div id="box-bit" style="font-size:1rem; font-weight:800; color:#06b6d4;">Bit ${bit} (2^${bit}=${1 << bit})</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SRAM OFFSET</div>
            <div id="box-addr" style="font-size:1rem; font-weight:800; color:#10b981;">0x${memOffset.toString(16).toUpperCase()}</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-push-pixel">
            <span>⚡</span> Transmit Framebuffer to OLED Glass (display.display())
          </button>
        </div>
      </div>
    `;

      const sliderX = document.getElementById('oled-slider-x');
      const sliderY = document.getElementById('oled-slider-y');
      const valX = document.getElementById('oled-val-x');
      const valY = document.getElementById('oled-val-y');
      const boxPage = document.getElementById('box-page');
      const boxBit = document.getElementById('box-bit');
      const boxAddr = document.getElementById('box-addr');

      function updateSliders() {
        const x = parseInt(sliderX.value, 10);
        const y = parseInt(sliderY.value, 10);
        hw.oledCursorX = x;
        hw.oledCursorY = y;
        if (valX) valX.textContent = x;
        if (valY) valY.textContent = y;
        const p = Math.floor(y / 8);
        const b = y % 8;
        const a = p * 128 + x;
        if (boxPage) boxPage.textContent = `Page ${p}`;
        if (boxBit) boxBit.textContent = `Bit ${b} (2^${b}=${1 << b})`;
        if (boxAddr) boxAddr.textContent = `0x${a.toString(16).toUpperCase()}`;
        updateOledScreen();
      }

      sliderX?.addEventListener('input', updateSliders);
      sliderY?.addEventListener('input', updateSliders);

      document.getElementById('btn-oled-push-pixel')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('oledPixelPushed');
      });

      updateOledScreen();
    }

    function renderOledLesson2(lesson) {
      const hw = window.circuitSimulation.getHardwareState();
      hw.oledSpriteMode = hw.oledSpriteMode || 'heart';

      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🎨</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Monochrome 8×8 Pixel Sprite Designer (PROGMEM)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Pack 64 Pixels into 8 Hexadecimal Bytes • Stored in Microcontroller Flash ROM
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-sprite-heart" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#ec4899; color:#f472b6;">
            ❤️ Heart
          </button>
          <button class="secondary-btn" id="btn-sprite-invader" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#06b6d4; color:#67e8f9;">
            👾 Invader
          </button>
          <button class="secondary-btn" id="btn-sprite-star" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#eab308; color:#fde047;">
            ⭐ Star
          </button>
          <button class="secondary-btn" id="btn-sprite-check" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#22c55e; color:#86efac;">
            ✓ Check
          </button>
        </div>

        <!-- Generated C++ PROGMEM code box -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#93c5fd; margin-bottom:0.75rem;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.2rem;">// Auto-generated Flash Array:</div>
          <div id="progmem-code-preview" style="color:#7dd3fc; line-height:1.4;">
            const unsigned char PROGMEM icon8x8[] = {<br>
            &nbsp;&nbsp;0x00, 0x66, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C, 0x18<br>
            };
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-stamp-sprite">
            <span>🖌️</span> Stamp Sprite to OLED Display (display.drawBitmap())
          </button>
        </div>
      </div>
    `;

      function setSprite(mode, hexStr) {
        hw.oledSpriteMode = mode;
        const preview = document.getElementById('progmem-code-preview');
        if (preview) {
          preview.innerHTML = `const unsigned char PROGMEM icon8x8[] = {<br>&nbsp;&nbsp;${hexStr}<br>};`;
        }
        updateOledScreen();
      }

      document.getElementById('btn-sprite-heart')?.addEventListener('click', () => {
        setSprite('heart', '0x00, 0x66, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C, 0x18');
      });
      document.getElementById('btn-sprite-invader')?.addEventListener('click', () => {
        setSprite('invader', '0x18, 0x3C, 0x7E, 0xDB, 0xFF, 0x24, 0x5A, 0x81');
      });
      document.getElementById('btn-sprite-star')?.addEventListener('click', () => {
        setSprite('star', '0x10, 0x10, 0x54, 0x38, 0x7C, 0x38, 0x54, 0x10');
      });
      document.getElementById('btn-sprite-check')?.addEventListener('click', () => {
        setSprite('check', '0x00, 0x01, 0x03, 0x06, 0x8C, 0xD8, 0x70, 0x20');
      });

      document.getElementById('btn-oled-stamp-sprite')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('oledSpriteStamped');
      });

      updateOledScreen();
    }

    function renderOledLesson3(lesson) {
      const hw = window.circuitSimulation.getHardwareState();
      hw.oledWaveType = hw.oledWaveType || 'sine';
      hw.oledWaveFreq = hw.oledWaveFreq || 2;

      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📈</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Real-Time Dynamic Telemetry & Oscilloscope Sparklines</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Circular FIFO Ring Buffer (128 Samples) • High-Speed 400kHz I2C Streaming
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-wave-sine" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            ~ Sine Wave
          </button>
          <button class="secondary-btn" id="btn-wave-ecg" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#ec4899; color:#f472b6;">
            💓 ECG Heartbeat
          </button>
          <button class="secondary-btn" id="btn-wave-square" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#eab308; color:#fde047;">
            ⊓ Square Pulse
          </button>
          <button class="secondary-btn" id="btn-wave-noise" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            ⚡ Sensor Noise
          </button>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Oscillation Frequency: <strong id="oled-val-freq" style="color:#38bdf8;">${hw.oledWaveFreq}</strong> Hz</span>
            <span style="color:#86efac;">Buffer Shift: ${(hw.oledWaveFreq * 128 / 10).toFixed(0)} pts/sec</span>
          </div>
          <input type="range" id="oled-slider-freq" min="1" max="10" value="${hw.oledWaveFreq}" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-lock-wave">
            <span>🔒</span> Lock Waveform Capture & Verify Ring Buffer
          </button>
        </div>
      </div>
    `;

      const sliderFreq = document.getElementById('oled-slider-freq');
      const valFreq = document.getElementById('oled-val-freq');

      sliderFreq?.addEventListener('input', (e) => {
        hw.oledWaveFreq = parseInt(e.target.value, 10);
        if (valFreq) valFreq.textContent = hw.oledWaveFreq;
        updateOledScreen();
      });

      document.getElementById('btn-wave-sine')?.addEventListener('click', () => {
        hw.oledWaveType = 'sine'; updateOledScreen();
      });
      document.getElementById('btn-wave-ecg')?.addEventListener('click', () => {
        hw.oledWaveType = 'ecg'; updateOledScreen();
      });
      document.getElementById('btn-wave-square')?.addEventListener('click', () => {
        hw.oledWaveType = 'square'; updateOledScreen();
      });
      document.getElementById('btn-wave-noise')?.addEventListener('click', () => {
        hw.oledWaveType = 'noise'; updateOledScreen();
      });

      document.getElementById('btn-oled-lock-wave')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('oledWaveformCaptured');
      });

      updateOledScreen();
    }

    function renderOledLesson4(lesson) {
      const hw = window.circuitSimulation.getHardwareState();
      hw.oledMenuPage = hw.oledMenuPage !== undefined ? hw.oledMenuPage : 0;

      const pageNames = [
        "1. System Telemetry (CPU, Voltage, Uptime)",
        "2. Sensor Diagnostics (Analog Channels)",
        "3. Network & Cloud Settings (WiFi, MQTT)"
      ];

      if (!lessonInteractiveArea) return;
      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🕹️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Embedded UI Menu: Finite State Machine & Inverted Video</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              XOR Inversion Highlighting (SSD1306_INVERSE) • Tactile Keypad Debounce
            </p>
          </div>
        </div>

        <!-- Embedded Navigation Keypad -->
        <div style="display:flex; justify-content:center; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-menu-up" style="font-size:0.85rem; padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8;">
            ▲ UP
          </button>
          <button class="secondary-btn" id="btn-menu-down" style="font-size:0.85rem; padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8;">
            ▼ DOWN
          </button>
          <button class="secondary-btn" id="btn-menu-select" style="font-size:0.85rem; padding:0.5rem 1.2rem; border-color:#22c55e; color:#86efac; font-weight:800;">
            ● SELECT
          </button>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; margin-bottom:0.75rem;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.3rem;">CURRENT FSM STATE:</div>
          <div id="fsm-status-display" style="color:#38bdf8; font-weight:700;">
            ${pageNames[hw.oledMenuPage]}
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-commit-ui">
            <span>🚀</span> Commit UI Configuration & Launch SparkByte OS
          </button>
        </div>
      </div>
    `;

      function updateMenu(delta) {
        let next = (hw.oledMenuPage + delta) % 3;
        if (next < 0) next = 2;
        hw.oledMenuPage = next;
        const disp = document.getElementById('fsm-status-display');
        if (disp) disp.textContent = pageNames[hw.oledMenuPage];
        if (window.soundEngine) window.soundEngine.playTone(400 + next * 150, 0.05);
        updateOledScreen();
      }

      document.getElementById('btn-menu-up')?.addEventListener('click', () => updateMenu(-1));
      document.getElementById('btn-menu-down')?.addEventListener('click', () => updateMenu(1));
      document.getElementById('btn-menu-select')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        updateMenu(1);
      });

      document.getElementById('btn-oled-commit-ui')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('oledMenuNavigated');
      });

      updateOledScreen();
    }



    // =========================================================================
    // SOIL LESSONS (Smart Agriculture Soil Moisture & Relay Studio)
    // =========================================================================

    function updateSoilSystem() {
      const hw = window.circuitSimulation.getHardwareState();
      const pct = hw.soilMoisture !== undefined ? hw.soilMoisture : 42;
      const relay = hw.soilRelayActive || false;
      const pump = hw.soilPumpActive || false;

      // Update SVG elements
      const wetness = document.getElementById('soil-svg-wetness');
      if (wetness) {
        wetness.setAttribute('opacity', (0.1 + (pct / 100) * 0.75).toFixed(2));
      }

      const relayLed = document.getElementById('relay-active-led');
      if (relayLed) {
        relayLed.setAttribute('fill', relay ? '#22c55e' : '#1e293b');
        relayLed.setAttribute('filter', relay ? 'drop-shadow(0 0 6px #22c55e)' : 'none');
      }

      const pumpLabel = document.getElementById('soil-pump-status-label');
      if (pumpLabel) {
        pumpLabel.textContent = pump ? 'PUMPING...' : 'STANDBY';
        pumpLabel.setAttribute('fill', pump ? '#38bdf8' : '#64748b');
      }

      const waterSpray = document.getElementById('soil-water-spray');
      if (waterSpray) {
        waterSpray.style.display = pump ? 'inline' : 'none';
      }

      // Update Floating HUD cards
      const hudPct = document.getElementById('soil-hud-pct');
      if (hudPct) {
        hudPct.textContent = `${pct}% (${pct < 35 ? 'Dry' : (pct > 65 ? 'Wet' : 'Optimal')})`;
        hudPct.setAttribute('fill', pct < 35 ? '#f59e0b' : (pct > 65 ? '#06b6d4' : '#10b981'));
      }

      const hudRelay = document.getElementById('soil-hud-relay');
      if (hudRelay) {
        hudRelay.textContent = relay ? 'ACTIVE (NO Closed)' : 'OFF (NO Open)';
        hudRelay.setAttribute('fill', relay ? '#22c55e' : '#38bdf8');
      }

      const hudPump = document.getElementById('soil-hud-pump');
      if (hudPump) {
        hudPump.textContent = pump ? 'PUMPING 💧' : 'IDLE';
        hudPump.setAttribute('fill', pump ? '#06b6d4' : '#94a3b8');
      }

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderSoilLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.soilMoisture = hw.soilMoisture !== undefined ? hw.soilMoisture : 42;

      const rawAdc = Math.round(580 - (hw.soilMoisture / 100) * 320);
      const voltage = ((rawAdc / 1023) * 5.0).toFixed(2);
      const dielectric = (1 + (hw.soilMoisture / 100) * 79).toFixed(1);

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🌱</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Capacitive Moisture Physics & Dielectric Permittivity</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              NE555 Timer High-Frequency AC Oscillator • Insulated PCB Traces Prevent Galvanic Corrosion
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#86efac;">Soil Moisture: <strong id="soil-val-pct" style="color:#10b981;">${hw.soilMoisture}%</strong></span>
            <span style="color:#94a3b8;">Water Content in Loam</span>
          </div>
          <input type="range" id="soil-slider-pct" min="5" max="95" value="${hw.soilMoisture}" style="width:100%; accent-color:#10b981;" />
        </div>

        <!-- Real-time Physical Readouts -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">DIELECTRIC (εr)</div>
            <div id="box-dielectric" style="font-size:1rem; font-weight:800; color:#38bdf8;">εr = ${dielectric}</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">RAW ADC (A1)</div>
            <div id="box-adc" style="font-size:1rem; font-weight:800; color:#f59e0b;">${rawAdc}</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">ANALOG VOLTAGE</div>
            <div id="box-volt" style="font-size:1rem; font-weight:800; color:#10b981;">${voltage} V</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-soil-calibrate">
            <span>✨</span> Confirm Sensor Calibration (map(rawADC, 580, 260, 0, 100))
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('soil-slider-pct');
      const valPct = document.getElementById('soil-val-pct');
      const boxDielectric = document.getElementById('box-dielectric');
      const boxAdc = document.getElementById('box-adc');
      const boxVolt = document.getElementById('box-volt');

      slider?.addEventListener('input', (e) => {
        const p = parseInt(e.target.value, 10);
        hw.soilMoisture = p;
        if (valPct) valPct.textContent = `${p}%`;
        const adc = Math.round(580 - (p / 100) * 320);
        const v = ((adc / 1023) * 5.0).toFixed(2);
        const d = (1 + (p / 100) * 79).toFixed(1);
        if (boxDielectric) boxDielectric.textContent = `εr = ${d}`;
        if (boxAdc) boxAdc.textContent = adc;
        if (boxVolt) boxVolt.textContent = `${v} V`;
        updateSoilSystem();
      });

      document.getElementById('btn-soil-calibrate')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('soilCalibrated');
      });

      updateSoilSystem();
    }

    function renderSoilLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Optocoupled Relay Isolation & Inductive Flyback Snubbers</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              PC817 Galvanic Barrier (5,000V Isolation) • 1N4007 Diode Clamps Back-EMF Voltage Spikes
            </p>
          </div>
        </div>

        <!-- Relay Diagnostic Display -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">PC817 Opto-LED Beam:</span>
            <span id="opto-beam-status" style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; font-weight:800; color:${hw.soilRelayActive ? '#22c55e' : '#64748b'};">
              ${hw.soilRelayActive ? '● PHOTONS TRANSMITTING (LOW)' : '○ DARK (HIGH - OFF)'}
            </span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">1N4007 Flyback Clamp:</span>
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; font-weight:800; color:#38bdf8;">
              V_diode = 0.7V Snubber Active
            </span>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-toggle-relay">
            <span>🔘</span> Toggle Relay Energization (digitalWrite(RELAY_PIN, ${hw.soilRelayActive ? 'HIGH' : 'LOW'}))
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-toggle-relay')?.addEventListener('click', () => {
        hw.soilRelayActive = !hw.soilRelayActive;
        hw.soilPumpActive = hw.soilRelayActive;
        if (window.soundEngine) {
          if (hw.soilRelayActive) window.soundEngine.playTone(850, 0.08);
          else window.soundEngine.playTone(420, 0.08);
        }
        updateSoilSystem();
        renderSoilLesson2(lesson);
        checkVerification('relayToggled');
      });

      updateSoilSystem();
    }

    function renderSoilLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.soilDryLimit = hw.soilDryLimit || 35;
      hw.soilWetLimit = hw.soilWetLimit || 65;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🎛️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Bang-Bang Control with Deadband Hysteresis (Anti-Chatter)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Dual-Threshold Cushion Zone: Turn ON at ${hw.soilDryLimit}%, Keep Pumping Until ${hw.soilWetLimit}%
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#f59e0b;">Lower Dry Threshold (Turn ON): <strong id="val-dry">${hw.soilDryLimit}%</strong></span>
            <span style="color:#38bdf8;">Upper Wet Target (Turn OFF): <strong id="val-wet">${hw.soilWetLimit}%</strong></span>
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
            <input type="range" id="slider-dry" min="20" max="45" value="${hw.soilDryLimit}" style="flex:1; accent-color:#f59e0b;" />
            <input type="range" id="slider-wet" min="55" max="80" value="${hw.soilWetLimit}" style="flex:1; accent-color:#38bdf8;" />
          </div>
        </div>

        <!-- Simulation Actions -->
        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-soil-drought" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#f59e0b; color:#fde047;">
            ☀️ Simulate Drought (-15%)
          </button>
          <button class="secondary-btn" id="btn-soil-water" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#7dd3fc;">
            💧 Simulate Watering (+20%)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-soil-validate-hysteresis">
            <span>🛡️</span> Validate Anti-Chatter Protection
          </button>
        </div>
      </div>
    `;

      document.getElementById('slider-dry')?.addEventListener('input', (e) => {
        hw.soilDryLimit = parseInt(e.target.value, 10);
        const v = document.getElementById('val-dry');
        if (v) v.textContent = `${hw.soilDryLimit}%`;
      });

      document.getElementById('slider-wet')?.addEventListener('input', (e) => {
        hw.soilWetLimit = parseInt(e.target.value, 10);
        const v = document.getElementById('val-wet');
        if (v) v.textContent = `${hw.soilWetLimit}%`;
      });

      document.getElementById('btn-soil-drought')?.addEventListener('click', () => {
        hw.soilMoisture = Math.max(10, (hw.soilMoisture || 42) - 15);
        if (hw.soilMoisture < hw.soilDryLimit) {
          hw.soilRelayActive = true;
          hw.soilPumpActive = true;
        }
        updateSoilSystem();
      });

      document.getElementById('btn-soil-water')?.addEventListener('click', () => {
        hw.soilMoisture = Math.min(90, (hw.soilMoisture || 42) + 20);
        if (hw.soilMoisture >= hw.soilWetLimit) {
          hw.soilRelayActive = false;
          hw.soilPumpActive = false;
        }
        updateSoilSystem();
      });

      document.getElementById('btn-soil-validate-hysteresis')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('hysteresisTested');
      });

      updateSoilSystem();
    }

    function renderSoilLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.soilWaterLevelOk = hw.soilWaterLevelOk !== undefined ? hw.soilWaterLevelOk : true;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🌾</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Smart Greenhouse Irrigation Station & Safety Cutoff</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Metered Pulse Dosing (2.5s) • Dry-Run Reservoir Float Switch Emergency Interlock
            </p>
          </div>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">Water Reservoir Float Sensor:</span>
            <button class="secondary-btn" id="btn-toggle-float" style="font-size:0.75rem; padding:0.3rem 0.8rem; border-color:${hw.soilWaterLevelOk ? '#22c55e' : '#ef4444'}; color:${hw.soilWaterLevelOk ? '#86efac' : '#fca5a5'};">
              ${hw.soilWaterLevelOk ? '● FULL (Safe)' : '▲ EMPTY (Cutoff)'}
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">Irrigation Dose State:</span>
            <span id="dose-status-label" style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; font-weight:800; color:#38bdf8;">
              READY FOR METERED DOSE
            </span>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-soil-pulse-dose" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            💧 Deliver 2.5s Metered Water Dose
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-soil-deploy-greenhouse">
            <span>🚀</span> Deploy Smart Greenhouse Automation Station
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-toggle-float')?.addEventListener('click', () => {
        hw.soilWaterLevelOk = !hw.soilWaterLevelOk;
        if (!hw.soilWaterLevelOk) {
          hw.soilRelayActive = false;
          hw.soilPumpActive = false;
        }
        updateSoilSystem();
        renderSoilLesson4(lesson);
      });

      document.getElementById('btn-soil-pulse-dose')?.addEventListener('click', () => {
        if (!hw.soilWaterLevelOk) {
          alert("SAFETY INTERLOCK: Water reservoir is empty! Refill tank first.");
          return;
        }
        hw.soilRelayActive = true;
        hw.soilPumpActive = true;
        const lbl = document.getElementById('dose-status-label');
        if (lbl) lbl.textContent = "PULSING WATER DOSE (2.5s)...";
        updateSoilSystem();

        setTimeout(() => {
          hw.soilRelayActive = false;
          hw.soilPumpActive = false;
          hw.soilMoisture = Math.min(85, (hw.soilMoisture || 42) + 20);
          if (lbl) lbl.textContent = "DOSE COMPLETE • SOIL ABSORBING";
          if (window.soundEngine) window.soundEngine.playSuccess();
          updateSoilSystem();
        }, 2500);
      });

      document.getElementById('btn-soil-deploy-greenhouse')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('greenhouseDeployed');
      });

      updateSoilSystem();
    }



    // =========================================================================
    // MOTOR LESSONS (L298N Dual H-Bridge & 4WD Skid Steer Rover Studio)
    // =========================================================================

    function updateMotorRover() {
      const hw = window.circuitSimulation.getHardwareState();
      const motion = hw.motorMotion || 'FORWARD';
      const lPwm = hw.motorLeftPwm !== undefined ? hw.motorLeftPwm : 200;
      const rPwm = hw.motorRightPwm !== undefined ? hw.motorRightPwm : 200;
      const lRpm = lPwm < 70 ? 0 : Math.round((lPwm / 255) * 220);
      const rRpm = rPwm < 70 ? 0 : Math.round((rPwm / 255) * 220);
      hw.motorLeftRpm = lRpm;
      hw.motorRightRpm = rRpm;

      // Wheel badges
      const flBadge = document.getElementById('fl-rpm-badge');
      const rlBadge = document.getElementById('rl-rpm-badge');
      const frBadge = document.getElementById('fr-rpm-badge');
      const rrBadge = document.getElementById('rr-rpm-badge');

      let leftSymbol = '▲';
      let rightSymbol = '▲';

      if (motion === 'BRAKE' || (lRpm === 0 && rRpm === 0)) {
        leftSymbol = '■';
        rightSymbol = '■';
      } else if (motion === 'REVERSE') {
        leftSymbol = '▼';
        rightSymbol = '▼';
      } else if (motion === 'POINT LEFT') {
        leftSymbol = '▼';
        rightSymbol = '▲';
      } else if (motion === 'POINT RIGHT') {
        leftSymbol = '▲';
        rightSymbol = '▼';
      }

      if (flBadge) flBadge.textContent = leftSymbol;
      if (rlBadge) rlBadge.textContent = leftSymbol;
      if (frBadge) frBadge.textContent = rightSymbol;
      if (rrBadge) rrBadge.textContent = rightSymbol;

      // Floating HUD cards
      const hudMotion = document.getElementById('motor-hud-motion');
      if (hudMotion) {
        hudMotion.textContent = motion;
        hudMotion.setAttribute('fill', motion === 'BRAKE' ? '#ef4444' : '#38bdf8');
      }

      const hudLeft = document.getElementById('motor-hud-left');
      if (hudLeft) {
        hudLeft.textContent = `${lRpm} RPM (${lPwm})`;
      }

      const hudRight = document.getElementById('motor-hud-right');
      if (hudRight) {
        hudRight.textContent = `${rRpm} RPM (${rPwm})`;
      }

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderMotorLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">H-Bridge Transistor Architecture & Current Paths</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              4 Power Transistors (Q1..Q4) • Diagonal Conduction Channels & Shoot-Through Short Hazard
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-hb-fwd" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#22c55e; color:#86efac;">
            FWD (Q1 + Q4)
          </button>
          <button class="secondary-btn" id="btn-hb-rev" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#06b6d4; color:#7dd3fc;">
            REV (Q2 + Q3)
          </button>
          <button class="secondary-btn" id="btn-hb-brake" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#ef4444; color:#fca5a5;">
            Dynamic Brake
          </button>
        </div>

        <!-- Transistor State Matrix -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; text-align:center;">
            <div id="box-q1" style="background:#0f172a; padding:0.4rem; border-radius:4px; border:1px solid #334155; color:#86efac;">
              Q1 (High-Side L): ON
            </div>
            <div id="box-q2" style="background:#0f172a; padding:0.4rem; border-radius:4px; border:1px solid #334155; color:#64748b;">
              Q2 (High-Side R): OFF
            </div>
            <div id="box-q3" style="background:#0f172a; padding:0.4rem; border-radius:4px; border:1px solid #334155; color:#64748b;">
              Q3 (Low-Side L): OFF
            </div>
            <div id="box-q4" style="background:#0f172a; padding:0.4rem; border-radius:4px; border:1px solid #334155; color:#86efac;">
              Q4 (Low-Side R): ON
            </div>
          </div>
          <div id="hb-status-text" style="text-align:center; margin-top:0.6rem; color:#38bdf8; font-weight:700;">
            Current flowing Left-to-Right: MOTOR ROTATING CLOCKWISE
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-hbridge">
            <span>✨</span> Verify H-Bridge Conduction Paths
          </button>
        </div>
      </div>
    `;

      function setBridge(mode) {
        hw.motorMotion = mode;
        const q1 = document.getElementById('box-q1');
        const q2 = document.getElementById('box-q2');
        const q3 = document.getElementById('box-q3');
        const q4 = document.getElementById('box-q4');
        const st = document.getElementById('hb-status-text');

        if (mode === 'FORWARD') {
          if (q1) { q1.textContent = 'Q1: ON (HIGH)'; q1.style.borderColor = '#22c55e'; q1.style.color = '#86efac'; }
          if (q2) { q2.textContent = 'Q2: OFF'; q2.style.borderColor = '#334155'; q2.style.color = '#64748b'; }
          if (q3) { q3.textContent = 'Q3: OFF'; q3.style.borderColor = '#334155'; q3.style.color = '#64748b'; }
          if (q4) { q4.textContent = 'Q4: ON (LOW)'; q4.style.borderColor = '#22c55e'; q4.style.color = '#86efac'; }
          if (st) st.textContent = 'Diagonal Conduction: Current Left -> Right (FORWARD)';
        } else if (mode === 'REVERSE') {
          if (q1) { q1.textContent = 'Q1: OFF'; q1.style.borderColor = '#334155'; q1.style.color = '#64748b'; }
          if (q2) { q2.textContent = 'Q2: ON (HIGH)'; q2.style.borderColor = '#06b6d4'; q2.style.color = '#7dd3fc'; }
          if (q3) { q3.textContent = 'Q3: ON (LOW)'; q3.style.borderColor = '#06b6d4'; q3.style.color = '#7dd3fc'; }
          if (q4) { q4.textContent = 'Q4: OFF'; q4.style.borderColor = '#334155'; q4.style.color = '#64748b'; }
          if (st) st.textContent = 'Reverse Conduction: Current Right -> Left (REVERSE)';
        } else {
          if (q1) { q1.textContent = 'Q1: OFF'; q1.style.borderColor = '#334155'; q1.style.color = '#64748b'; }
          if (q2) { q2.textContent = 'Q2: OFF'; q2.style.borderColor = '#334155'; q2.style.color = '#64748b'; }
          if (q3) { q3.textContent = 'Q3: ON (GND)'; q3.style.borderColor = '#ef4444'; q3.style.color = '#fca5a5'; }
          if (q4) { q4.textContent = 'Q4: ON (GND)'; q4.style.borderColor = '#ef4444'; q4.style.color = '#fca5a5'; }
          if (st) st.textContent = 'Dynamic Braking: Both terminals clamped to GND';
        }
        updateMotorRover();
      }

      document.getElementById('btn-hb-fwd')?.addEventListener('click', () => setBridge('FORWARD'));
      document.getElementById('btn-hb-rev')?.addEventListener('click', () => setBridge('REVERSE'));
      document.getElementById('btn-hb-brake')?.addEventListener('click', () => setBridge('BRAKE'));

      document.getElementById('btn-verify-hbridge')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('hbridgeVerified');
      });

      updateMotorRover();
    }

    function renderMotorLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.motorLeftPwm = hw.motorLeftPwm !== undefined ? hw.motorLeftPwm : 200;

      const isStall = hw.motorLeftPwm < 70;
      const rpm = isStall ? 0 : Math.round((hw.motorLeftPwm / 255) * 220);

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚙️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">PWM Speed Modulation & Mechanical Gearbox Stiction</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Timer 490Hz PWM • Deadband Torque (0-70 PWM Locked) vs Free Cruising
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">PWM Duty Cycle: <strong id="motor-val-pwm" style="color:#38bdf8;">${hw.motorLeftPwm}</strong> / 255</span>
            <span id="motor-stall-badge" style="color:${isStall ? '#ef4444' : '#10b981'}; font-weight:700;">
              ${isStall ? '⚠️ STICTION DEADBAND (STALLED)' : '● GEARS ROLLING'}
            </span>
          </div>
          <input type="range" id="motor-slider-pwm" min="0" max="255" value="${hw.motorLeftPwm}" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <!-- Real-time RPM & Current Metrics -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">WHEEL SPEED</div>
            <div id="box-rpm" style="font-size:1rem; font-weight:800; color:#38bdf8;">${rpm} RPM</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">EFFECTIVE V</div>
            <div id="box-eff-volt" style="font-size:1rem; font-weight:800; color:#f59e0b;">${((hw.motorLeftPwm / 255) * 12.0).toFixed(1)} V</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">MOTOR CURRENT</div>
            <div id="box-motor-ma" style="font-size:1rem; font-weight:800; color:${isStall ? '#ef4444' : '#10b981'};">${isStall ? '850 mA (Stall)' : Math.round(180 + (hw.motorLeftPwm / 255) * 200) + ' mA'}</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-calibrate-pwm">
            <span>🚀</span> Calibrate Minimum Breakaway PWM
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('motor-slider-pwm');
      const valPwm = document.getElementById('motor-val-pwm');
      const stallBadge = document.getElementById('motor-stall-badge');
      const boxRpm = document.getElementById('box-rpm');
      const boxEffVolt = document.getElementById('box-eff-volt');
      const boxMotorMa = document.getElementById('box-motor-ma');

      slider?.addEventListener('input', (e) => {
        const p = parseInt(e.target.value, 10);
        hw.motorLeftPwm = p;
        hw.motorRightPwm = p;
        if (valPwm) valPwm.textContent = p;
        const stall = p < 70;
        const r = stall ? 0 : Math.round((p / 255) * 220);
        if (stallBadge) {
          stallBadge.textContent = stall ? '⚠️ STICTION DEADBAND (STALLED)' : '● GEARS ROLLING';
          stallBadge.style.color = stall ? '#ef4444' : '#10b981';
        }
        if (boxRpm) boxRpm.textContent = `${r} RPM`;
        if (boxEffVolt) boxEffVolt.textContent = `${((p / 255) * 12.0).toFixed(1)} V`;
        if (boxMotorMa) {
          boxMotorMa.textContent = stall ? '850 mA (Stall)' : `${Math.round(180 + (p / 255) * 200)} mA`;
          boxMotorMa.style.color = stall ? '#ef4444' : '#10b981';
        }
        updateMotorRover();
      });

      document.getElementById('btn-calibrate-pwm')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('pwmCalibrated');
      });

      updateMotorRover();
    }

    function renderMotorLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🕹️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Differential Skid Steer Kinematics Control Pad</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Tank-Style Locomotion: Point-Spinning & Velocity Difference Vectors
            </p>
          </div>
        </div>

        <!-- D-Pad Kinematics Driving Pad -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-drive-fwd" style="padding:0.5rem 1.8rem; border-color:#22c55e; color:#86efac; font-weight:800;">
            ▲ FORWARD
          </button>
          <div style="display:flex; gap:0.5rem;">
            <button class="secondary-btn" id="btn-drive-left" style="padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8; font-weight:700;">
              ◄ SPIN LEFT
            </button>
            <button class="secondary-btn" id="btn-drive-brake" style="padding:0.5rem 1rem; border-color:#ef4444; color:#fca5a5; font-weight:800;">
              ● BRAKE
            </button>
            <button class="secondary-btn" id="btn-drive-right" style="padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8; font-weight:700;">
              SPIN RIGHT ►
            </button>
          </div>
          <button class="secondary-btn" id="btn-drive-rev" style="padding:0.5rem 1.8rem; border-color:#f59e0b; color:#fde047; font-weight:800;">
            ▼ REVERSE
          </button>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; text-align:center;">
          <span style="color:#64748b;">ACTIVE KINEMATICS COMMAND: </span>
          <strong id="kinematics-readout" style="color:#38bdf8;">${hw.motorMotion}</strong>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-kinematics">
            <span>🏎️</span> Verify Skid Steer Kinematics Control
          </button>
        </div>
      </div>
    `;

      function setDrive(m, lp, rp) {
        hw.motorMotion = m;
        hw.motorLeftPwm = lp;
        hw.motorRightPwm = rp;
        const r = document.getElementById('kinematics-readout');
        if (r) r.textContent = `${m} [L:${lp} R:${rp}]`;
        if (window.soundEngine) {
          if (m === 'BRAKE') window.soundEngine.playTone(300, 0.05);
          else window.soundEngine.playTone(600, 0.05);
        }
        updateMotorRover();
      }

      document.getElementById('btn-drive-fwd')?.addEventListener('click', () => setDrive('FORWARD', 200, 200));
      document.getElementById('btn-drive-left')?.addEventListener('click', () => setDrive('POINT LEFT', -180, 180));
      document.getElementById('btn-drive-right')?.addEventListener('click', () => setDrive('POINT RIGHT', 180, -180));
      document.getElementById('btn-drive-rev')?.addEventListener('click', () => setDrive('REVERSE', -200, -200));
      document.getElementById('btn-drive-brake')?.addEventListener('click', () => setDrive('BRAKE', 0, 0));

      document.getElementById('btn-verify-kinematics')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('kinematicsVerified');
      });

      updateMotorRover();
    }

    function renderMotorLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.motorObstacleDist = hw.motorObstacleDist !== undefined ? hw.motorObstacleDist : 45;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🤖</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Autonomous Reactive Obstacle Avoidance Course</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              HC-SR04 Sonar Feedback + L298N Skid Steering: Safety Distance Horizon = 25 cm
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Sonar Target Distance: <strong id="obstacle-dist-val" style="color:#38bdf8;">${hw.motorObstacleDist}</strong> cm</span>
            <span id="obstacle-hazard-badge" style="color:${hw.motorObstacleDist <= 25 ? '#ef4444' : '#10b981'}; font-weight:700;">
              ${hw.motorObstacleDist <= 25 ? '⚠️ HAZARD DETECTED (<25cm)' : '✓ PATH CLEAR'}
            </span>
          </div>
          <input type="range" id="obstacle-slider-dist" min="5" max="80" value="${hw.motorObstacleDist}" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; margin-bottom:0.75rem;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.2rem;">AUTONOMOUS SUBSUMPTION STATE:</div>
          <div id="obstacle-state-readout" style="color:#38bdf8; font-weight:700;">
            ${hw.motorObstacleDist > 25 ? 'CRUISING FORWARD (190 PWM)' : 'EMERGENCY BRAKE -> REVERSING -> SPIN ESCAPE (90° RIGHT)'}
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-deploy-rover-course">
            <span>🏁</span> Deploy Autonomous Rover Course
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('obstacle-slider-dist');
      const valDist = document.getElementById('obstacle-dist-val');
      const hazard = document.getElementById('obstacle-hazard-badge');
      const stateReadout = document.getElementById('obstacle-state-readout');

      slider?.addEventListener('input', (e) => {
        const d = parseInt(e.target.value, 10);
        hw.motorObstacleDist = d;
        if (valDist) valDist.textContent = d;
        const isClose = d <= 25;
        if (hazard) {
          hazard.textContent = isClose ? '⚠️ HAZARD DETECTED (<25cm)' : '✓ PATH CLEAR';
          hazard.style.color = isClose ? '#ef4444' : '#10b981';
        }
        if (stateReadout) {
          stateReadout.textContent = isClose ? 'EMERGENCY BRAKE -> REVERSING -> SPIN ESCAPE (90° RIGHT)' : 'CRUISING FORWARD (190 PWM)';
          stateReadout.style.color = isClose ? '#f59e0b' : '#38bdf8';
        }
        if (isClose) {
          hw.motorMotion = 'POINT RIGHT';
          hw.motorLeftPwm = 200;
          hw.motorRightPwm = -200;
        } else {
          hw.motorMotion = 'FORWARD';
          hw.motorLeftPwm = 190;
          hw.motorRightPwm = 190;
        }
        updateMotorRover();
      });

      document.getElementById('btn-deploy-rover-course')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('obstacleCoursePassed');
      });

      updateMotorRover();
    }



    // =========================================================================
    // IMU LESSONS (MPU-6050 6-Axis Accelerometer & Gyroscope Gimbal Studio)
    // =========================================================================

    function updateImuHorizon() {
      const hw = window.circuitSimulation.getHardwareState();
      const p = hw.imuPitch !== undefined ? hw.imuPitch : 0.0;
      const r = hw.imuRoll !== undefined ? hw.imuRoll : 0.0;
      const rate = hw.imuGyroRate !== undefined ? hw.imuGyroRate : 0.0;

      // Update Artificial Horizon SVG transform
      const rotGroup = document.getElementById('imu-horizon-rot');
      if (rotGroup) {
        // In PFD, if aircraft rolls right (+roll), horizon tilts left (-roll)
        // If aircraft pitches up (+pitch), horizon moves down (+pitch * scale)
        const pitchOffset = (p / 45) * 25;
        rotGroup.setAttribute('transform', `rotate(${-r}, 0, 0) translate(0, ${pitchOffset})`);
      }

      // Update Floating HUD Cards
      const hudAngles = document.getElementById('imu-hud-angles');
      if (hudAngles) {
        hudAngles.textContent = `P:${p >= 0 ? '+' : ''}${p.toFixed(1)}° R:${r >= 0 ? '+' : ''}${r.toFixed(1)}°`;
      }

      const hudGyro = document.getElementById('imu-hud-gyro');
      if (hudGyro) {
        hudGyro.textContent = `${rate.toFixed(1)} °/s (${Math.abs(rate) < 0.5 ? 'Rest' : 'Spin'})`;
      }

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderImuLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.imuPitch = hw.imuPitch !== undefined ? hw.imuPitch : 0.0;
      hw.imuRoll = hw.imuRoll !== undefined ? hw.imuRoll : 0.0;

      const pRad = (hw.imuPitch * Math.PI) / 180.0;
      const rRad = (hw.imuRoll * Math.PI) / 180.0;
      const ax = Math.sin(pRad).toFixed(2);
      const ay = Math.sin(rRad).toFixed(2);
      const az = Math.cos(Math.max(Math.abs(pRad), Math.abs(rRad))).toFixed(2);

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📐</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MEMS Accelerometer 1G Gravity Vector & Trigonometric Tilt</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Silicon Cantilever Comb Capacitors • Pitch: atan2(Ax, sqrt(Ay²+Az²)) • Roll: atan2(Ay, sqrt(Ax²+Az²))
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Pitch (Nose Up/Down): <strong id="val-pitch" style="color:#38bdf8;">${hw.imuPitch.toFixed(1)}°</strong></span>
            <span style="color:#cbd5e1;">Lateral Y-Axis</span>
          </div>
          <input type="range" id="slider-pitch" min="-45" max="45" value="${hw.imuPitch}" style="width:100%; accent-color:#38bdf8;" />

          <div style="display:flex; justify-content:space-between; margin:0.6rem 0 0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Roll (Wing Bank): <strong id="val-roll" style="color:#06b6d4;">${hw.imuRoll.toFixed(1)}°</strong></span>
            <span style="color:#cbd5e1;">Longitudinal X-Axis</span>
          </div>
          <input type="range" id="slider-roll" min="-45" max="45" value="${hw.imuRoll}" style="width:100%; accent-color:#06b6d4;" />
        </div>

        <!-- 1G Gravity Vector Breakdown -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">AX (FORWARD)</div>
            <div id="box-ax" style="font-size:1rem; font-weight:800; color:#38bdf8;">${ax} G</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">AY (LATERAL)</div>
            <div id="box-ay" style="font-size:1rem; font-weight:800; color:#06b6d4;">${ay} G</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">AZ (VERTICAL)</div>
            <div id="box-az" style="font-size:1rem; font-weight:800; color:#10b981;">${az} G</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-gravity">
            <span>✨</span> Verify Gravity Vector & Trigonometric Tilt
          </button>
        </div>
      </div>
    `;

      const sPitch = document.getElementById('slider-pitch');
      const sRoll = document.getElementById('slider-roll');
      const vPitch = document.getElementById('val-pitch');
      const vRoll = document.getElementById('val-roll');
      const bAx = document.getElementById('box-ax');
      const bAy = document.getElementById('box-ay');
      const bAz = document.getElementById('box-az');

      function onTiltChange() {
        const p = parseFloat(sPitch.value);
        const r = parseFloat(sRoll.value);
        hw.imuPitch = p;
        hw.imuRoll = r;
        if (vPitch) vPitch.textContent = `${p.toFixed(1)}°`;
        if (vRoll) vRoll.textContent = `${r.toFixed(1)}°`;
        const pr = (p * Math.PI) / 180.0;
        const rr = (r * Math.PI) / 180.0;
        if (bAx) bAx.textContent = `${Math.sin(pr).toFixed(2)} G`;
        if (bAy) bAy.textContent = `${Math.sin(rr).toFixed(2)} G`;
        if (bAz) bAz.textContent = `${Math.cos(Math.max(Math.abs(pr), Math.abs(rr))).toFixed(2)} G`;
        updateImuHorizon();
      }

      sPitch?.addEventListener('input', onTiltChange);
      sRoll?.addEventListener('input', onTiltChange);

      document.getElementById('btn-verify-gravity')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gravityVerified');
      });

      updateImuHorizon();
    }

    function renderImuLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.imuGyroRate = hw.imuGyroRate !== undefined ? hw.imuGyroRate : 0.0;
      hw.imuIntegratedAngle = hw.imuIntegratedAngle !== undefined ? hw.imuIntegratedAngle : 0.0;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🌀</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MEMS Gyroscope: Coriolis Effect & Numerical Integration Drift</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              30kHz Vibrating Tuning Fork • Angle = ∫ ω dt • Zero-Rate Bias Error Accumulation
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#fde047;">Angular Velocity (ω): <strong id="val-gyro-rate" style="color:#f59e0b;">${hw.imuGyroRate.toFixed(1)}</strong> °/s</span>
            <span style="color:#94a3b8;">Rotational Rate</span>
          </div>
          <input type="range" id="slider-gyro-rate" min="-90" max="90" value="${hw.imuGyroRate}" style="width:100%; accent-color:#f59e0b;" />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.5rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">INSTANTANEOUS RATE</div>
            <div id="box-instant-rate" style="font-size:1.1rem; font-weight:800; color:#f59e0b;">${hw.imuGyroRate.toFixed(1)} °/s</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.5rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">INTEGRATED ANGLE (∫ω dt)</div>
            <div id="box-integrated-angle" style="font-size:1.1rem; font-weight:800; color:#38bdf8;">${hw.imuIntegratedAngle.toFixed(1)}°</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-gyro">
            <span>🔄</span> Verify Gyroscope Numerical Integration
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('slider-gyro-rate');
      const valRate = document.getElementById('val-gyro-rate');
      const boxRate = document.getElementById('box-instant-rate');
      const boxAngle = document.getElementById('box-integrated-angle');

      slider?.addEventListener('input', (e) => {
        const r = parseFloat(e.target.value);
        hw.imuGyroRate = r;
        hw.imuIntegratedAngle += r * 0.2; // simulate integration
        hw.imuRoll = hw.imuIntegratedAngle % 360;
        if (valRate) valRate.textContent = r.toFixed(1);
        if (boxRate) boxRate.textContent = `${r.toFixed(1)} °/s`;
        if (boxAngle) boxAngle.textContent = `${hw.imuIntegratedAngle.toFixed(1)}°`;
        updateImuHorizon();
      });

      document.getElementById('btn-verify-gyro')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gyroVerified');
      });

      updateImuHorizon();
    }

    function renderImuLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.imuNoiseActive = hw.imuNoiseActive || false;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚖️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Complementary Filter Sensor Fusion (Alpha = 0.98)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              98% Gyro Fast Response (HPF) + 2% Accel Gravity Reference (LPF)
            </p>
          </div>
        </div>

        <!-- Sensor Comparison Box -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
            <span style="color:#ef4444;">1. Raw Accelerometer:</span>
            <span id="label-accel-trace" style="color:#fca5a5;">${hw.imuNoiseActive ? 'HIGH-FREQ VIBRATION NOISE (±12°)' : 'Stable (+0.0°)'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
            <span style="color:#f59e0b;">2. Raw Gyroscope:</span>
            <span style="color:#fde047;">Slow Long-Term Bias Drift (+0.8°/min)</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px solid #1e293b; padding-top:0.4rem;">
            <span style="color:#10b981; font-weight:800;">3. FUSED COMPLEMENTARY:</span>
            <span style="color:#86efac; font-weight:800;">ROCK-SOLID (+0.0° Clean Telemetry)</span>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-toggle-noise" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:${hw.imuNoiseActive ? '#ef4444' : '#0284c7'}; color:${hw.imuNoiseActive ? '#fca5a5' : '#38bdf8'};">
            ${hw.imuNoiseActive ? '⚠️ Motor Vibration: ACTIVE' : '⚡ Inject Motor Vibration Noise'}
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-fusion">
            <span>🛡️</span> Verify Sensor Fusion Filter
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-toggle-noise')?.addEventListener('click', () => {
        hw.imuNoiseActive = !hw.imuNoiseActive;
        if (hw.imuNoiseActive) {
          hw.imuPitch = (Math.random() - 0.5) * 15;
        } else {
          hw.imuPitch = 0.0;
        }
        updateImuHorizon();
        renderImuLesson3(lesson);
      });

      document.getElementById('btn-verify-fusion')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('fusionVerified');
      });

      updateImuHorizon();
    }

    function renderImuLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🚁</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Closed-Loop 2-Axis Gimbal Flight Horizon Stabilizer</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Counter-Rotation Servos: Pitch Servo = (90° - FusedPitch) • Horizon Locked
            </p>
          </div>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
            <span style="color:#93c5fd;">Quadcopter Attitude:</span>
            <span id="drone-attitude-label" style="color:#38bdf8; font-weight:800;">TILT: 0.0° (Level)</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#93c5fd;">Gimbal Servo Compensation:</span>
            <span id="gimbal-servo-label" style="color:#10b981; font-weight:800;">SERVO: 90.0° (Center)</span>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-inject-gust" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            💨 Inject 25° Turbulence Wind Gust
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-lock-gimbal">
            <span>🔒</span> Lock Gimbal Horizon & Deploy Flight Telemetry
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-inject-gust')?.addEventListener('click', () => {
        hw.imuRoll = 25.0;
        hw.imuPitch = 15.0;
        const att = document.getElementById('drone-attitude-label');
        const gimb = document.getElementById('gimbal-servo-label');
        if (att) att.textContent = "TILT: Roll +25°, Pitch +15° (GUST!)";
        if (gimb) gimb.textContent = "GIMBAL COUNTER-ROTATE: -25° (LOCKED)";
        if (window.soundEngine) window.soundEngine.playTone(550, 0.1);
        updateImuHorizon();

        setTimeout(() => {
          hw.imuRoll = 0.0;
          hw.imuPitch = 0.0;
          if (att) att.textContent = "TILT: 0.0° (Level Flight)";
          if (gimb) gimb.textContent = "SERVO: 90.0° (Center)";
          updateImuHorizon();
        }, 2000);
      });

      document.getElementById('btn-lock-gimbal')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('gimbalLocked');
      });

      updateImuHorizon();
    }



    // =========================================================================
    // RFID LESSONS (RC522 13.56MHz Access Control & Digital Wallet Studio)
    // =========================================================================

    function updateRfidDoor() {
      const hw = window.circuitSimulation.getHardwareState();
      const uid = hw.rfidUid || 'A3 7F 4E 12';
      const unlocked = hw.rfidDoorUnlocked || false;
      const isDenied = hw.rfidAccessStatus === 'DENIED';
      const bal = hw.rfidWalletBalance !== undefined ? hw.rfidWalletBalance : 150.0;

      // Flux waves
      const waves = document.getElementById('rfid-flux-waves');
      if (waves) {
        waves.style.display = hw.rfidFluxActive ? 'inline' : 'none';
      }

      // LEDs
      const ledG = document.getElementById('rfid-led-green');
      if (ledG) {
        ledG.setAttribute('fill', unlocked ? '#22c55e' : '#14532d');
        ledG.setAttribute('filter', unlocked ? 'drop-shadow(0 0 6px #22c55e)' : 'none');
      }

      const ledR = document.getElementById('rfid-led-red');
      if (ledR) {
        ledR.setAttribute('fill', isDenied ? '#ef4444' : '#7f1d1d');
        ledR.setAttribute('filter', isDenied ? 'drop-shadow(0 0 6px #ef4444)' : 'none');
      }

      // Servo Latch bolt
      const bolt = document.getElementById('rfid-latch-bolt');
      if (bolt) {
        bolt.setAttribute('transform', unlocked ? 'translate(19, 72) rotate(90)' : 'translate(19, 72) rotate(0)');
      }

      const latchText = document.getElementById('latch-status-text');
      if (latchText) {
        latchText.textContent = unlocked ? 'UNLOCKED' : (isDenied ? 'DENIED!' : 'LOCKED');
        latchText.setAttribute('fill', unlocked ? '#22c55e' : '#ef4444');
      }

      // HUD cards
      const hudUid = document.getElementById('rfid-hud-uid');
      if (hudUid) hudUid.textContent = uid;

      const hudStatus = document.getElementById('rfid-hud-status');
      if (hudStatus) {
        hudStatus.textContent = unlocked ? 'ACCESS GRANTED' : (isDenied ? 'ACCESS DENIED' : 'READY TO SCAN');
        hudStatus.setAttribute('fill', unlocked ? '#22c55e' : (isDenied ? '#ef4444' : '#10b981'));
      }

      const hudWallet = document.getElementById('rfid-hud-wallet');
      if (hudWallet) hudWallet.textContent = `$${bal.toFixed(2)}`;

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderRfidLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Near-Field Resonant Induction & The 4-Wire SPI Bus</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              13.56MHz Magnetic Flux • Batteryless Transponders • Full-Wave Diode Energy Harvesting
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Transponder Proximity: <strong id="rfid-dist-val" style="color:#38bdf8;">2.5</strong> cm</span>
            <span id="rfid-power-badge" style="color:#22c55e; font-weight:700;">● CARD POWERED (3.3V)</span>
          </div>
          <input type="range" id="rfid-slider-dist" min="0" max="8" step="0.5" value="2.5" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <!-- Real-time Induction Readouts -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">CARRIER FREQ</div>
            <div style="font-size:1rem; font-weight:800; color:#f59e0b;">13.56 MHz</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">HARVESTED V</div>
            <div id="box-harvested-v" style="font-size:1rem; font-weight:800; color:#10b981;">3.30 V</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SPI BUS CLOCK</div>
            <div style="font-size:1rem; font-weight:800; color:#38bdf8;">10.0 MHz</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-induction">
            <span>⚡</span> Verify Resonant Induction Coupling & SPI Link
          </button>
        </div>
      </div>
    `;

      const slider = document.getElementById('rfid-slider-dist');
      const valDist = document.getElementById('rfid-dist-val');
      const badge = document.getElementById('rfid-power-badge');
      const boxV = document.getElementById('box-harvested-v');

      slider?.addEventListener('input', (e) => {
        const d = parseFloat(e.target.value);
        if (valDist) valDist.textContent = d.toFixed(1);
        const isPowered = d <= 4.0;
        hw.rfidFluxActive = isPowered;
        const v = isPowered ? (3.3 * (1 - d / 5.0) + 0.5).toFixed(2) : '0.00';
        if (boxV) boxV.textContent = `${v} V`;
        if (badge) {
          badge.textContent = isPowered ? '● CARD POWERED (3.3V)' : '○ OUT OF RANGE (0V)';
          badge.style.color = isPowered ? '#22c55e' : '#64748b';
        }
        updateRfidDoor();
      });

      document.getElementById('btn-verify-induction')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('inductionVerified');
      });

      hw.rfidFluxActive = true;
      updateRfidDoor();
    }

    function renderRfidLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🗄️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MIFARE Classic 1K Memory Map Architecture</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              1,024-Byte EEPROM • 16 Sectors × 4 Blocks (16 Bytes each) • Crypto-1 Encryption
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-mem-sec0" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            Sector 0 (UID & Mfr)
          </button>
          <button class="secondary-btn" id="btn-mem-sec1" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            Sector 1 (User Wallet)
          </button>
          <button class="secondary-btn" id="btn-mem-sec2" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#f59e0b; color:#fde047;">
            Sector 2 (Access Data)
          </button>
        </div>

        <!-- Hex Memory Dump Preview -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#93c5fd; margin-bottom:0.75rem; line-height:1.5;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.2rem;">// 16-BYTE HEXADECIMAL SECTOR DUMP:</div>
          <div id="hex-dump-content" style="color:#7dd3fc;">
            [Block 0] A3 7F 4E 12 88 08 04 00 62 63 64 65 66 67 68 69 (UID & MFR)<br>
            [Block 1] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
            [Block 2] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
            [Block 3] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Trailer)
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-memory">
            <span>🔍</span> Verify MIFARE Memory Structure & Trailers
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-mem-sec0')?.addEventListener('click', () => {
        const dump = document.getElementById('hex-dump-content');
        if (dump) {
          dump.innerHTML = `[Block 0] A3 7F 4E 12 88 08 04 00 62 63 64 65 66 67 68 69 (UID & MFR)<br>
[Block 1] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
[Block 2] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
[Block 3] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Key A/Bits/Key B)`;
        }
      });

      document.getElementById('btn-mem-sec1')?.addEventListener('click', () => {
        const dump = document.getElementById('hex-dump-content');
        if (dump) {
          dump.innerHTML = `[Block 4] 96 00 00 00 69 FF FF FF 96 00 00 00 04 FB 04 FB (Wallet: $150.00)<br>
[Block 5] 53 70 61 72 6B 42 79 74 65 20 4F 53 20 56 32 2E (ASCII: "SparkByte OS")<br>
[Block 6] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 7] A0 A1 A2 A3 A4 A5 | 7F 07 88 40 | B0 B1 B2 B3 B4 B5 (Secured Trailer)`;
        }
      });

      document.getElementById('btn-mem-sec2')?.addEventListener('click', () => {
        const dump = document.getElementById('hex-dump-content');
        if (dump) {
          dump.innerHTML = `[Block 8] 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F 10 (Access Log)<br>
[Block 9] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 10] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 11] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Default Trailer)`;
        }
      });

      document.getElementById('btn-verify-memory')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('memoryVerified');
      });

      updateRfidDoor();
    }

    function renderRfidLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🔐</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Access Control Security: UID Whitelist & Deadbolt Actuation</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Constant-Time UID Comparison • SG90 Servo Deadbolt Retract (90°) • Intruder Lockout
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-scan-authorized" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#22c55e; color:#86efac; font-weight:800;">
            🔑 Scan Master Keyfob<br><span style="font-size:0.65rem; color:#86efac;">[A3 7F 4E 12] - Authorized</span>
          </button>
          <button class="secondary-btn" id="btn-scan-stranger" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#ef4444; color:#fca5a5; font-weight:800;">
            ⚠️ Scan Stranger Card<br><span style="font-size:0.65rem; color:#fca5a5;">[D9 1C 88 5B] - Unknown</span>
          </button>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; text-align:center;">
          <span style="color:#64748b;">SECURITY LOCK STATUS: </span>
          <strong id="security-status-label" style="color:${hw.rfidDoorUnlocked ? '#22c55e' : '#38bdf8'};">
            ${hw.rfidDoorUnlocked ? 'ACCESS GRANTED • DOOR UNLOCKED' : 'SYSTEM ARMED • DEADBOLT LOCKED'}
          </strong>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-access">
            <span>🛡️</span> Verify Door Access Control Logic
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-scan-authorized')?.addEventListener('click', () => {
        hw.rfidUid = 'A3 7F 4E 12';
        hw.rfidAccessStatus = 'GRANTED';
        hw.rfidDoorUnlocked = true;
        hw.rfidFluxActive = true;
        const lbl = document.getElementById('security-status-label');
        if (lbl) {
          lbl.textContent = 'ACCESS GRANTED • DEADBOLT RETRACTED (90°)';
          lbl.style.color = '#22c55e';
        }
        if (window.soundEngine) {
          window.soundEngine.playTone(880, 0.08);
          setTimeout(() => window.soundEngine.playTone(1320, 0.12), 100);
        }
        updateRfidDoor();

        setTimeout(() => {
          hw.rfidDoorUnlocked = false;
          hw.rfidFluxActive = false;
          if (lbl) {
            lbl.textContent = 'SYSTEM ARMED • DEADBOLT RELOCKED (0°)';
            lbl.style.color = '#38bdf8';
          }
          updateRfidDoor();
        }, 3000);
      });

      document.getElementById('btn-scan-stranger')?.addEventListener('click', () => {
        hw.rfidUid = 'D9 1C 88 5B';
        hw.rfidAccessStatus = 'DENIED';
        hw.rfidDoorUnlocked = false;
        hw.rfidFluxActive = true;
        const lbl = document.getElementById('security-status-label');
        if (lbl) {
          lbl.textContent = 'SECURITY ALERT: ACCESS DENIED • LOCK ENGAGED';
          lbl.style.color = '#ef4444';
        }
        if (window.soundEngine) window.soundEngine.playTone(220, 0.3);
        updateRfidDoor();

        setTimeout(() => {
          hw.rfidFluxActive = false;
          updateRfidDoor();
        }, 1500);
      });

      document.getElementById('btn-verify-access')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('accessVerified');
      });

      updateRfidDoor();
    }

    function renderRfidLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.rfidWalletBalance = hw.rfidWalletBalance !== undefined ? hw.rfidWalletBalance : 150.0;

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">RFID Cashless Digital Wallet Studio (MIFARE Value Blocks)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Atomic Transactions: MIFARE_Decrement() & MIFARE_Increment() on Block 4
            </p>
          </div>
        </div>

        <!-- Digital Wallet Balance Card -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; text-align:center;">
          <div style="font-size:0.7rem; color:#94a3b8; font-family:'JetBrains Mono', monospace;">STORED SMART CARD BALANCE (BLOCK 4)</div>
          <div id="wallet-balance-big" style="font-size:1.8rem; font-weight:900; color:#10b981; font-family:'JetBrains Mono', monospace; margin:0.3rem 0;">
            $${hw.rfidWalletBalance.toFixed(2)}
          </div>
          <div style="font-size:0.65rem; color:#64748b; font-family:'JetBrains Mono', monospace;">ENCRYPTED WITH KEY A: FF FF FF FF FF FF</div>
        </div>

        <!-- POS Terminal Actions -->
        <div style="display:flex; gap:0.5rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-wallet-pay" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#0284c7; color:#38bdf8; font-weight:700;">
            💳 Tap to Pay Fare (-$25)
          </button>
          <button class="secondary-btn" id="btn-wallet-topup" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#22c55e; color:#86efac; font-weight:700;">
            💵 Top-Up Balance (+$50)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-deploy-wallet">
            <span>🚀</span> Deploy RFID Cashless Digital Wallet
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-wallet-pay')?.addEventListener('click', () => {
        if (hw.rfidWalletBalance < 25) {
          alert("INSUFFICIENT FUNDS! Please top up your card.");
          return;
        }
        hw.rfidWalletBalance -= 25.0;
        hw.rfidFluxActive = true;
        const big = document.getElementById('wallet-balance-big');
        if (big) big.textContent = `$${hw.rfidWalletBalance.toFixed(2)}`;
        if (window.soundEngine) window.soundEngine.playSuccess();
        updateRfidDoor();

        setTimeout(() => {
          hw.rfidFluxActive = false;
          updateRfidDoor();
        }, 800);
      });

      document.getElementById('btn-wallet-topup')?.addEventListener('click', () => {
        hw.rfidWalletBalance += 50.0;
        hw.rfidFluxActive = true;
        const big = document.getElementById('wallet-balance-big');
        if (big) big.textContent = `$${hw.rfidWalletBalance.toFixed(2)}`;
        if (window.soundEngine) window.soundEngine.playTone(990, 0.1);
        updateRfidDoor();

        setTimeout(() => {
          hw.rfidFluxActive = false;
          updateRfidDoor();
        }, 800);
      });

      document.getElementById('btn-deploy-wallet')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('walletDeployed');
      });

      updateRfidDoor();
    }



    // =========================================================================
    // IOT LESSONS (ESP32 Cloud Telemetry & MQTT Digital Twin Studio)
    // =========================================================================

    function updateIotCloud() {
      const hw = window.circuitSimulation.getHardwareState();
      const temp = hw.iotCloudTemp !== undefined ? hw.iotCloudTemp : 26.4;
      const aqi = hw.iotCloudAqi !== undefined ? hw.iotCloudAqi : 45;
      const fanOn = hw.iotRemoteFan !== undefined ? hw.iotRemoteFan : true;
      const ip = hw.iotIpAddress || '192.168.1.105';
      const pkts = hw.iotPacketsSent !== undefined ? hw.iotPacketsSent : 1248;

      // Cloud widgets
      const valTemp = document.getElementById('cloud-val-temp');
      if (valTemp) valTemp.textContent = `${temp.toFixed(1)} °C`;

      const valAqi = document.getElementById('cloud-val-aqi');
      if (valAqi) valAqi.textContent = `AQI ${aqi} (${aqi <= 50 ? 'Good' : 'Moderate'})`;

      const swBg = document.getElementById('cloud-switch-bg');
      if (swBg) swBg.setAttribute('fill', fanOn ? '#10b981' : '#475569');

      const swKnob = document.getElementById('cloud-switch-knob');
      if (swKnob) swKnob.setAttribute('cx', fanOn ? '36' : '12');

      const swLabel = document.getElementById('cloud-switch-label');
      if (swLabel) {
        swLabel.textContent = fanOn ? 'FAN: ON' : 'FAN: OFF';
        swLabel.setAttribute('fill', fanOn ? '#86efac' : '#94a3b8');
      }

      // ESP32 Onboard LED
      const blueLed = document.getElementById('esp32-blue-led');
      if (blueLed) {
        blueLed.setAttribute('fill', fanOn ? '#38bdf8' : '#1e293b');
        blueLed.setAttribute('filter', fanOn ? 'drop-shadow(0 0 6px #38bdf8)' : 'none');
      }

      // HUD cards
      const hudIp = document.getElementById('iot-hud-ip');
      if (hudIp) hudIp.textContent = ip;

      const hudPkts = document.getElementById('iot-hud-pkts');
      if (hudPkts) hudPkts.textContent = `${pkts} Pkts`;

      if (window.circuitSimulation) {
        window.circuitSimulation.notifyHardware();
      }
    }

    function renderIotLesson1(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();
      hw.iotCpuFreq = hw.iotCpuFreq || 240;

      const mips = Math.round((hw.iotCpuFreq / 240) * 600);
      const ma = Math.round(40 + (hw.iotCpuFreq / 240) * 80);

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Microcontroller vs IoT SoC: ATmega328P vs Xtensa ESP32</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              32-bit Dual-Core LX6 • 240MHz Turbo • 520KB SRAM • Integrated 802.11 b/g/n Wi-Fi
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">CPU Clock Frequency: <strong id="iot-val-freq" style="color:#38bdf8;">${hw.iotCpuFreq}</strong> MHz</span>
            <span id="iot-mode-badge" style="color:#10b981; font-weight:700;">● TURBO DUAL-CORE</span>
          </div>
          <div style="display:flex; gap:0.4rem; margin-top:0.4rem;">
            <button class="secondary-btn" id="btn-freq-80" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
              80 MHz (Eco)
            </button>
            <button class="secondary-btn" id="btn-freq-160" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
              160 MHz (Standard)
            </button>
            <button class="secondary-btn" id="btn-freq-240" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac; font-weight:800;">
              240 MHz (Max Turbo)
            </button>
          </div>
        </div>

        <!-- Real-time SoC Performance Benchmark -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">COMPUTING SPEED</div>
            <div id="box-mips" style="font-size:1rem; font-weight:800; color:#38bdf8;">${mips} MIPS</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">ACTIVE CURRENT</div>
            <div id="box-ma" style="font-size:1rem; font-weight:800; color:#f59e0b;">${ma} mA</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SRAM CAPACITY</div>
            <div style="font-size:1rem; font-weight:800; color:#10b981;">520 KB (260x)</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-soc">
            <span>🚀</span> Verify Dual-Core SoC Computing Power
          </button>
        </div>
      </div>
    `;

      function setFreq(f, m, c) {
        hw.iotCpuFreq = f;
        const v = document.getElementById('iot-val-freq');
        const bm = document.getElementById('box-mips');
        const bma = document.getElementById('box-ma');
        if (v) v.textContent = f;
        if (bm) bm.textContent = `${m} MIPS`;
        if (bma) bma.textContent = `${c} mA`;
        updateIotCloud();
      }

      document.getElementById('btn-freq-80')?.addEventListener('click', () => setFreq(80, 200, 55));
      document.getElementById('btn-freq-160')?.addEventListener('click', () => setFreq(160, 400, 85));
      document.getElementById('btn-freq-240')?.addEventListener('click', () => setFreq(240, 600, 120));

      document.getElementById('btn-verify-soc')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('socVerified');
      });

      updateIotCloud();
    }

    function renderIotLesson2(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📶</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Wi-Fi Station Mode, WPA2 4-Way Handshake & DHCP Lease</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              802.11 b/g/n Networking • Dynamic Host Configuration • RESTful HTTP Client
            </p>
          </div>
        </div>

        <!-- Connection Handshake Step Trace -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem; line-height:1.5;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.3rem;">WIFI ASSOCIATION LIFECYCLE:</div>
          <div id="wifi-step-log" style="color:#7dd3fc;">
            [1] 802.11 Probe Request -> Found SSID "SparkByte_ATL_Lab"<br>
            [2] WPA2 4-Way Cryptographic Handshake -> Mutual Authentication OK<br>
            [3] DHCP Discover & Offer -> IP Lease: 192.168.1.105 (Subnet: 255.255.255.0)<br>
            [4] RESTful HTTP Client -> Target: http://api.sparkbyte.io [STATUS 200 OK]
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-scan-wifi" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            📡 Scan 2.4GHz Channels
          </button>
          <button class="secondary-btn" id="btn-renew-dhcp" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            🔄 Renew DHCP Lease
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-wifi">
            <span>🌐</span> Verify Wi-Fi Station Mode & RESTful HTTP Link
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-scan-wifi')?.addEventListener('click', () => {
        const log = document.getElementById('wifi-step-log');
        if (log) {
          log.innerHTML = `[SCAN] Channel 1: "SparkByte_ATL_Lab" (-42 dBm, WPA2-PSK)<br>
[SCAN] Channel 6: "ATL_Tinkering_Lab" (-68 dBm, WPA2-Enterprise)<br>
[ASSOCIATE] Connecting to "SparkByte_ATL_Lab"... Associated!<br>
[IP LEASE] Assigned IP: 192.168.1.105 | DNS: 8.8.8.8`;
        }
        if (window.soundEngine) window.soundEngine.playTone(700, 0.08);
      });

      document.getElementById('btn-renew-dhcp')?.addEventListener('click', () => {
        hw.iotIpAddress = '192.168.1.112';
        const log = document.getElementById('wifi-step-log');
        if (log) log.innerHTML += `<br>[DHCP RENEW] New Lease: 192.168.1.112 assigned.`;
        if (window.soundEngine) window.soundEngine.playSuccess();
        updateIotCloud();
      });

      document.getElementById('btn-verify-wifi')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('wifiConnected');
      });

      updateIotCloud();
    }

    function renderIotLesson3(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">☁️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MQTT Publish/Subscribe Telemetry Broker Protocol</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Lightweight 2-Byte Headers • Broker (broker.emqx.io:1883) • QoS 1 Delivery
            </p>
          </div>
        </div>

        <!-- MQTT Live Packet Console -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem; line-height:1.5;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span style="color:#64748b;">MQTT BROKER: broker.emqx.io:1883</span>
            <span style="color:#10b981;">● PING 28ms</span>
          </div>
          <div id="mqtt-packet-log" style="color:#38bdf8;">
            PUB -> "spkbyte/farm/telemetry": {"temp":26.4, "aqi":45, "pkts":${hw.iotPacketsSent || 1248}}<br>
            SUB <- "spkbyte/farm/actuator": {"cmd":"PING_ACK"} (QoS 1)
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-mqtt-publish" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            📤 Publish Telemetry Packet (QoS 1)
          </button>
          <button class="secondary-btn" id="btn-mqtt-downlink" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            📥 Receive Cloud Downlink Command
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-mqtt">
            <span>📡</span> Verify MQTT Telemetry Broker Link
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-mqtt-publish')?.addEventListener('click', () => {
        hw.iotPacketsSent = (hw.iotPacketsSent || 1248) + 1;
        hw.iotCloudTemp = 26.4 + (Math.random() - 0.5) * 1.5;
        const log = document.getElementById('mqtt-packet-log');
        if (log) {
          log.innerHTML = `PUB -> "spkbyte/farm/telemetry": {"temp":${hw.iotCloudTemp.toFixed(1)}, "aqi":45, "pkts":${hw.iotPacketsSent}}<br>` + log.innerHTML;
        }
        if (window.soundEngine) window.soundEngine.playTone(800, 0.05);
        updateIotCloud();
      });

      document.getElementById('btn-mqtt-downlink')?.addEventListener('click', () => {
        const log = document.getElementById('mqtt-packet-log');
        if (log) {
          log.innerHTML = `SUB <- "spkbyte/farm/actuator": {"command":"FAN_TOGGLE", "origin":"cloud_dashboard"}<br>` + log.innerHTML;
        }
        hw.iotRemoteFan = !hw.iotRemoteFan;
        if (window.soundEngine) window.soundEngine.playSuccess();
        updateIotCloud();
      });

      document.getElementById('btn-verify-mqtt')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('mqttVerified');
      });

      updateIotCloud();
    }

    function renderIotLesson4(lesson) {
      if (!lessonInteractiveArea) return;
      const hw = window.circuitSimulation.getHardwareState();

      lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🎓</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Industry 4.0 Capstone: Bi-Directional Cloud Digital Twin</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Live Uplink Sensor Streaming + Sub-50ms Remote Actuator Relay Downlink
            </p>
          </div>
        </div>

        <!-- Digital Twin Remote Control Panel -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">Remote Cloud Actuator Switch:</span>
            <button class="secondary-btn" id="btn-toggle-cloud-fan" style="font-size:0.8rem; padding:0.4rem 1rem; border-color:${hw.iotRemoteFan ? '#22c55e' : '#64748b'}; color:${hw.iotRemoteFan ? '#86efac' : '#94a3b8'}; font-weight:800;">
              ${hw.iotRemoteFan ? 'FAN: ON (Active Downlink)' : 'FAN: OFF (Standby)'}
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; font-family:'JetBrains Mono', monospace; font-size:0.75rem; color:#64748b;">
            <span>Downlink Latency: <strong style="color:#10b981;">32 ms</strong></span>
            <span>Digital Twin Sync: <strong style="color:#38bdf8;">100% Real-Time</strong></span>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-graduate-capstone" style="background:linear-gradient(135deg, #2563eb, #10b981); border:none; padding:0.75rem 1.2rem; font-size:0.9rem; font-weight:900;">
            🎓 Graduate ATL Master Curriculum (88 Lessons Complete!)
          </button>
        </div>
      </div>
    `;

      document.getElementById('btn-toggle-cloud-fan')?.addEventListener('click', () => {
        hw.iotRemoteFan = !hw.iotRemoteFan;
        if (window.soundEngine) {
          if (hw.iotRemoteFan) window.soundEngine.playTone(950, 0.08);
          else window.soundEngine.playTone(450, 0.08);
        }
        updateIotCloud();
        renderIotLesson4(lesson);
      });

      document.getElementById('btn-graduate-capstone')?.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        alert("🏆 CONGRATULATIONS! You have mastered all 22 Atal Tinkering Lab modules and completed all 88 interactive engineering lessons across Grades 6 to 12!");
        checkVerification('capstoneGraduated');
      });

      updateIotCloud();
    }



    // =========================================================================
    // LAB EXPLORER MODAL & STEPPER INITIALIZATION
    // =========================================================================

    const LABS_METADATA = [
      // Level 1: Grades 6-8 (7 Labs)
      { slug: 'led', icon: '💡', title: 'LED Digital Blink', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Learn digital HIGH/LOW states, breadboard circuits, current-limiting resistors, and blinking rhythms.' },
      { slug: 'servo', icon: '🦾', title: 'SG90 Micro Servo', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Command robotic arm angles (0° to 180°) using 50Hz PWM pulses and the Servo library.' },
      { slug: 'button', icon: '🔘', title: 'Tactile Pushbutton', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Connect tactile inputs with internal pullup resistors and control circuits using if/else logic.' },
      { slug: 'pot', icon: '🎛️', title: '10k Potentiometer', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Read analog voltage inputs (0–1023), map numbers, and steer virtual motor positions smoothly.' },
      { slug: 'buzzer', icon: '📢', title: 'Piezo Buzzer', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Generate square wave frequencies, program emergency sirens, and compose 8-note piano tunes.' },
      { slug: 'cad', icon: '🧊', title: '3D CAD Studio', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Design 3D mechanical brackets in Tinkercad CSG with solid shapes, hole booleans, and calipers.' },
      { slug: 'dmm', icon: '⚡', title: 'Multimeter DMM', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Measure voltages, decode resistor color bands, and troubleshoot broken circuits hands-on.' },

      // Level 2: Grades 9-10 (8 Labs)
      { slug: 'ldr', icon: '☀️', title: 'LDR Light Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Build smart streetlamps using photoresistors, voltage dividers, and lux hysteresis thresholds.' },
      { slug: 'rgb', icon: '🌈', title: 'RGB Color LED', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Mix 16 million colors with 8-bit PWM channels (0–255), mood lights, and color pickers.' },
      { slug: 'temp', icon: '🌡️', title: 'Temperature Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Convert analog millivolts to Celsius with TMP36 and automate greenhouse cooling fans.' },
      { slug: 'sonar', icon: '🦇', title: 'Ultrasonic Radar', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Measure obstacle distance via speed of sound echo pulses (HC-SR04) and build reverse parking sensors.' },
      { slug: 'ir', icon: '🏁', title: 'IR Line Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Calibrate optical reflectance and comparator potentiometers for autonomous line-following rovers.' },
      { slug: 'slicer', icon: '🖨️', title: '3D Slicer Engine', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Slice 3D models into G-code layers: customize infill density, hotend temperatures, and print paths.' },
      { slug: 'dht', icon: '💧', title: 'DHT Climate Station', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Decode digital single-bus packets for temperature & humidity, and compute heat index comfort.' },
      { slug: 'gas', icon: '🧪', title: 'MQ Gas & AQI', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Detect hazardous smoke, LPG, and CO air quality concentrations with emergency alarms.' },

      // Level 3: Grades 11-12 (7 Labs)
      { slug: 'lcd', icon: '📟', title: '16x2 I2C LCD', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Display live sensor telemetry, render custom 5x8 pixel characters, and build cockpit dashboards.' },
      { slug: 'oled', icon: '🖥️', title: 'SSD1306 OLED', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Render 128x64 monochrome bitmaps, oscilloscope wave graphs, and high-res telemetry UI.' },
      { slug: 'soil', icon: '🌱', title: 'Soil & 5V Relay', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Automate precision agriculture: monitor soil moisture and drive a 5V pump relay safely.' },
      { slug: 'motor', icon: '🏎️', title: 'L298N Motor Driver', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Master dual H-bridge motor drivers, PWM speed control, and skid-steer rover kinematics.' },
      { slug: 'imu', icon: '🧭', title: 'MPU6050 6-Axis IMU', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Read pitch, roll, and gyro angular rates over I2C to stabilize 3D aircraft and robotic gimbals.' },
      { slug: 'rfid', icon: '🏷️', title: 'RC522 RFID Access', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Read 13.56MHz smart keycards via SPI protocol, whitelist UIDs, and unlock servo security latches.' },
      { slug: 'iot', icon: '☁️', title: 'ESP32 IoT Cloud', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Connect ESP32 Wi-Fi to MQTT cloud brokers, publish live telemetry, and control smart appliances.' }
    ];

    function openLabExplorer() {
      const modal = document.getElementById('lab-explorer-modal');
      if (modal) {
        modal.classList.remove('hidden');
        renderLabExplorerCards('all', '');
        const searchInput = document.getElementById('lab-search-input');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
      }
    }

    function closeLabExplorer() {
      const modal = document.getElementById('lab-explorer-modal');
      if (modal) modal.classList.add('hidden');
    }

    function renderLabExplorerCards(gradeFilter = 'all', query = '') {
      const container = document.getElementById('explorer-cards-grid');
      if (!container) return;

      const levelSvgs = {
        'Level 1': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        'Level 2': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
        'Level 3': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`
      };

      const q = query.trim().toLowerCase();
      const filtered = LABS_METADATA.filter(lab => {
        const matchGrade = (gradeFilter === 'all' || lab.grade === gradeFilter);
        const matchQuery = !q || (
          lab.title.toLowerCase().includes(q) ||
          lab.slug.toLowerCase().includes(q) ||
          lab.summary.toLowerCase().includes(q)
        );
        return matchGrade && matchQuery;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; color: #0F172A;">No matching labs found</p>
          <p style="font-size: 0.85rem;">Try searching for "servo", "CAD", "sonar", "LED", or "sensor".</p>
        </div>
      `;
        return;
      }

      container.innerHTML = filtered.map(lab => {
        const isCurrent = (lab.slug === state.activeLab);
        const levelSvg = levelSvgs[lab.level] || '';
        return `
        <div class="explorer-lab-card ${isCurrent ? 'active' : ''}" data-lab="${lab.slug}">
          <div class="explorer-card-top">
            <span class="explorer-card-icon">${levelSvg}</span>
            <span class="explorer-card-badge ${lab.badge}">Grades ${lab.grade} • ${lab.level}</span>
          </div>
          <h4 class="explorer-card-title">${lab.title}</h4>
          <p class="explorer-card-summary">${lab.summary}</p>
          <div class="explorer-card-footer">
            <span class="explorer-card-lessons">4 Lessons</span>
            <button class="btn-open-lab">${isCurrent ? 'Active Lab ✓' : 'Open Lab →'}</button>
          </div>
        </div>
      `;
      }).join('');

      // Reattach card click listeners
      container.querySelectorAll('.explorer-lab-card').forEach(card => {
        card.addEventListener('click', () => {
          const labSlug = card.getAttribute('data-lab');
          if (labSlug) {
            switchLab(labSlug);
            closeLabExplorer();
          }
        });
      });
    }

    function initLabExplorerAndStepper() {
      // 1. Open/Close Lab Explorer Modal
      const openBtn = document.getElementById('open-lab-explorer-btn');
      if (openBtn) openBtn.addEventListener('click', openLabExplorer);

      const closeBtn = document.getElementById('close-lab-explorer');
      if (closeBtn) closeBtn.addEventListener('click', closeLabExplorer);

      const closeFooterBtn = document.getElementById('btn-close-explorer-footer');
      if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeLabExplorer);

      // Close on backdrop click
      const modalBackdrop = document.getElementById('lab-explorer-modal');
      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) closeLabExplorer();
        });
      }

      // 2. Search Input in Explorer
      const searchInput = document.getElementById('lab-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const activePill = document.querySelector('.explorer-grade-pill.active');
          const grade = activePill ? activePill.getAttribute('data-grade') : 'all';
          renderLabExplorerCards(grade, e.target.value);
        });
      }

      // 3. Grade Filter Pills in Explorer
      const gradePills = document.querySelectorAll('.explorer-grade-pill');
      gradePills.forEach(pill => {
        pill.addEventListener('click', () => {
          gradePills.forEach(p => p.classList.toggle('active', p === pill));
          const grade = pill.getAttribute('data-grade');
          const q = searchInput ? searchInput.value : '';
          renderLabExplorerCards(grade, q);
        });
      });

      // 4. Stepper Prev / Next Buttons in sub-header ribbon
      const prevBtn = document.getElementById('prev-lesson-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (state.activeLessonIndex > 0) {
            if (window.soundEngine) window.soundEngine.playClick();
            switchLesson(state.activeLessonIndex - 1);
          }
        });
      }

      const nextBtn = document.getElementById('next-lesson-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const lessons = getCurrentLessons();
          if (state.activeLessonIndex < lessons.length - 1) {
            if (window.soundEngine) window.soundEngine.playClick();
            switchLesson(state.activeLessonIndex + 1);
          }
        });
      }

      // 5. Frictionless Step Advance Card Button
      const advanceBtn = document.getElementById('btn-advance-step');
      if (advanceBtn) {
        advanceBtn.addEventListener('click', () => {
          const lessons = getCurrentLessons();
          if (state.activeLessonIndex < lessons.length - 1) {
            if (window.soundEngine) window.soundEngine.playSuccess();
            switchLesson(state.activeLessonIndex + 1);
          } else {
            if (window.soundEngine) window.soundEngine.playSuccess();
            openLabExplorer();
          }
        });
      }
    }

    initLabExplorerAndStepper();

    // --- Initial App Boot with Direct URL Parameter Support ---
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLab = (urlParams.get('lab') || window.location.hash.replace('#', '')).toLowerCase();

    const allLabs = [
      'led', 'servo', 'button', 'pot', 'buzzer', 'cad', 'dmm',
      'ldr', 'rgb', 'temp', 'sonar', 'ir', 'slicer', 'dht', 'gas',
      'lcd', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
    ];
    window.allLabs = allLabs;

    if (allLabs.includes(requestedLab)) {
      switchLab(requestedLab, true);
    } else {
      renderLessonNavTabs();
      renderHardwareCallouts();
      switchLesson(0);
    }
  } catch (err) {
    window.__bootError = err.stack || err.message;
    console.error('App boot error:', err);
  }
});

