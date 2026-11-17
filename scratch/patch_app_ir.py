with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. DOM Elements
target_dom = "  const labBtnSonar = document.getElementById('lab-btn-sonar');"
ir_dom = """  const labBtnIr = document.getElementById('lab-btn-ir');
  const labBtnSonar = document.getElementById('lab-btn-sonar');"""

if target_dom in text and 'labBtnIr' not in text:
    text = text.replace(target_dom, ir_dom)
    print('Added labBtnIr DOM element')

target_dom2 = "  const sonarCircuitView = document.getElementById('sonar-circuit-view');"
ir_dom2 = """  const irCircuitView = document.getElementById('ir-circuit-view');
  const irSurfaceRect = document.getElementById('ir-surface-rect');
  const irSurfaceLabel = document.getElementById('ir-surface-label');
  const irRayTx = document.getElementById('ir-ray-tx');
  const irRayRx = document.getElementById('ir-ray-rx');
  const irD0Led = document.getElementById('ir-d0-led');
  const irRoverChassis = document.getElementById('ir-rover-chassis');
  const roverSensorLeft = document.getElementById('rover-sensor-left');
  const roverSensorRight = document.getElementById('rover-sensor-right');
  const roverTelemetryText = document.getElementById('rover-telemetry-text');
  const sonarCircuitView = document.getElementById('sonar-circuit-view');"""

if target_dom2 in text and 'irCircuitView' not in text:
    text = text.replace(target_dom2, ir_dom2)
    print('Added IR SVG elements')

# 2. getCurrentLessons
target_gl = "    if (state.activeLab === 'sonar') return window.SONAR_LESSONS_DATA;"
ir_gl = """    if (state.activeLab === 'ir') return window.IR_LESSONS_DATA;
    if (state.activeLab === 'sonar') return window.SONAR_LESSONS_DATA;"""

if target_gl in text and "'ir'" not in text.split('function getCurrentLessons')[1][:200]:
    text = text.replace(target_gl, ir_gl)
    print('Added IR to getCurrentLessons')

# 3. switchLab button toggles & names
target_sl1 = "    if (labBtnSonar) labBtnSonar.classList.toggle('active', labName === 'sonar');"
ir_sl1 = """    if (labBtnIr) labBtnIr.classList.toggle('active', labName === 'ir');
    if (labBtnSonar) labBtnSonar.classList.toggle('active', labName === 'sonar');"""

if target_sl1 in text and 'labBtnIr.classList' not in text:
    text = text.replace(target_sl1, ir_sl1)
    print('Added labBtnIr toggle in switchLab')

target_sl2 = "      sonar: 'HC-SR04 Ultrasonic Distance Sensor & Radar Lab',"
ir_sl2 = """      ir: 'TCRT5000 IR Reflective & Line Sensor Lab',
      sonar: 'HC-SR04 Ultrasonic Distance Sensor & Radar Lab',"""

if target_sl2 in text and "'ir':" not in text:
    text = text.replace(target_sl2, ir_sl2)
    print('Added IR to labNames')

target_sl3 = "    if (sonarCircuitView) sonarCircuitView.style.display = labName === 'sonar' ? 'block' : 'none';"
ir_sl3 = """    if (irCircuitView) irCircuitView.style.display = labName === 'ir' ? 'block' : 'none';
    if (sonarCircuitView) sonarCircuitView.style.display = labName === 'sonar' ? 'block' : 'none';"""

if target_sl3 in text and 'irCircuitView.style.display' not in text:
    text = text.replace(target_sl3, ir_sl3)
    print('Added irCircuitView display toggle')

target_sl4 = "  if (labBtnSonar) {\n    labBtnSonar.addEventListener('click', () => switchLab('sonar'));\n  }"
ir_sl4 = """  if (labBtnIr) {
    labBtnIr.addEventListener('click', () => switchLab('ir'));
  }
  if (labBtnSonar) {
    labBtnSonar.addEventListener('click', () => switchLab('sonar'));
  }"""

if target_sl4 in text and "switchLab('ir')" not in text:
    text = text.replace(target_sl4, ir_sl4)
    print('Added labBtnIr click listener')

# 4. renderHardwareCallouts
target_hc = "    } else if (state.activeLab === 'sonar') {"
ir_hc = """    } else if (state.activeLab === 'ir') {
      hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Invisible 940nm near-infrared LED emitter">
          <span>🔦</span> <strong>940nm IR Emitter:</strong> Shoots invisible optical photon spotlight at surface.
        </div>
        <div class="callout-pill" title="Infrared phototransistor optical detector">
          <span>👁️</span> <strong>IR Phototransistor:</strong> Measures bounced photons (White = High, Black = Zero).
        </div>
        <div class="callout-pill" title="LM393 dual comparator integrated circuit">
          <span>⚖️</span> <strong>LM393 Op-Amp:</strong> Compares analog reflection vs Vref to output clean 0/1.
        </div>
        <div class="callout-pill" title="10k trimmer sensitivity calibration potentiometer">
          <span>🎛️</span> <strong>10k Calibration Trimpot:</strong> Adjusts decision threshold for floor lighting.
        </div>
      `;
    } else if (state.activeLab === 'sonar') {"""

if target_hc in text and "state.activeLab === 'ir'" not in text:
    text = text.replace(target_hc, ir_hc)
    print('Added IR hardware callouts')

# 5. onHardwareChange telemetry
target_hw = "    // 7. Update LAB 9: HC-SR04 Ultrasonic Distance Sensor & Radar Visuals"
ir_hw = """    // 8. Update LAB 10: TCRT5000 IR Reflective & Line Sensor Visuals
    if (hw.activeLab === 'ir' || state.activeLab === 'ir') {
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
        hudReadout3.textContent = `Thresh: ${hw.irThreshold || 512} (${((hw.irThreshold || 512)/1023*5).toFixed(2)}V)`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🏎️</span> Rover Steering';
        hudReadout4.textContent = (hw.roverSteerState || 'straight').toUpperCase();
        hudReadout4.className = 'hud-value val';
      }
      if (scopeStatus) {
        scopeStatus.textContent = isLine
          ? `LINE DETECTED: IR Absorption High -> DO Pin 2 HIGH (5V)`
          : `CLEAR SURFACE: Reflectance High -> DO Pin 2 LOW (0V)`;
      }
    }

    // 7. Update LAB 9: HC-SR04 Ultrasonic Distance Sensor & Radar Visuals"""

if target_hw in text and "hw.activeLab === 'ir'" not in text:
    text = text.replace(target_hw, ir_hw)
    print('Added IR onHardwareChange')

# 6. renderInteractiveTask routing
target_rit = "    } else if (state.activeLab === 'sonar') {"
ir_rit = """    } else if (state.activeLab === 'ir' || lesson.labId === 'ir') {
      if (lesson.id === 1) renderIrLesson1(lesson);
      else if (lesson.id === 2) renderIrLesson2(lesson);
      else if (lesson.id === 3) renderIrLesson3(lesson);
      else if (lesson.id === 4) renderIrLesson4(lesson);
    } else if (state.activeLab === 'sonar') {"""

if target_rit in text and "state.activeLab === 'ir'" not in text:
    text = text.replace(target_rit, ir_rit)
    print('Added IR renderInteractiveTask routing')

# 7. Renderers for IR
ir_renderers = """
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
            <span id="ir-thresh-val" style="font-family:var(--font-code); font-weight:800; font-size:1.15rem; color:#facc15;">${curThresh} (${((curThresh/1023)*5).toFixed(2)}V)</span>
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
              <span id="ir-adc-text" style="font-family:var(--font-code); font-weight:800; color:#38bdf8;">${curRaw} / 1023 (${((curRaw/1023)*100).toFixed(1)}%)</span>
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
"""

# Insert ir_renderers right before the boot marker (inside DOMContentLoaded)
boot_marker = '  // --- Initial App Boot with Direct URL Parameter Support ---'
if boot_marker in text and 'function renderIrLesson1' not in text:
    text = text.replace(boot_marker, ir_renderers + '\n\n' + boot_marker)
    print('Appended IR interactive renderers inside DOMContentLoaded')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully patched app.js for IR!')
