import sys

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. DOM Elements
target_dom = "  const labBtnTemp = document.getElementById('lab-btn-temp');"
sonar_dom = """  const labBtnSonar = document.getElementById('lab-btn-sonar');
  const labBtnTemp = document.getElementById('lab-btn-temp');"""

if target_dom in text and 'labBtnSonar' not in text:
    text = text.replace(target_dom, sonar_dom)
    print('Added labBtnSonar DOM element')

target_dom2 = "  const tempCircuitView = document.getElementById('temp-circuit-view');"
sonar_dom2 = """  const sonarCircuitView = document.getElementById('sonar-circuit-view');
  const sonarObstacleTarget = document.getElementById('sonar-obstacle-target');
  const sonarRulerLine = document.getElementById('sonar-ruler-line');
  const sonarRulerEnd = document.getElementById('sonar-ruler-end');
  const sonarDistPill = document.getElementById('sonar-dist-pill');
  const sonarDistText = document.getElementById('sonar-dist-text');
  const sonarLedGlow = document.getElementById('sonar-led-glow');
  const sonarLedBulb = document.getElementById('sonar-led-bulb');
  const sonarBuzzerRing1 = document.getElementById('sonar-buzzer-ring-1');
  const sonarBuzzerRing2 = document.getElementById('sonar-buzzer-ring-2');
  const tempCircuitView = document.getElementById('temp-circuit-view');"""

if target_dom2 in text and 'sonarCircuitView' not in text:
    text = text.replace(target_dom2, sonar_dom2)
    print('Added sonar circuit SVG elements')

# 2. getCurrentLessons
target_gl = "    if (state.activeLab === 'temp') return window.TEMP_LESSONS_DATA;"
sonar_gl = """    if (state.activeLab === 'sonar') return window.SONAR_LESSONS_DATA;
    if (state.activeLab === 'temp') return window.TEMP_LESSONS_DATA;"""

if target_gl in text and "'sonar'" not in text.split('function getCurrentLessons')[1][:200]:
    text = text.replace(target_gl, sonar_gl)
    print('Added sonar to getCurrentLessons')

# 3. switchLab button toggles & names
target_sl1 = "    if (labBtnTemp) labBtnTemp.classList.toggle('active', labName === 'temp');"
sonar_sl1 = """    if (labBtnSonar) labBtnSonar.classList.toggle('active', labName === 'sonar');
    if (labBtnTemp) labBtnTemp.classList.toggle('active', labName === 'temp');"""

if target_sl1 in text and 'labBtnSonar.classList' not in text:
    text = text.replace(target_sl1, sonar_sl1)
    print('Added labBtnSonar toggle in switchLab')

target_sl2 = "      temp: 'Temperature Sensor TMP36 & HVAC Lab',"
sonar_sl2 = """      sonar: 'HC-SR04 Ultrasonic Distance Sensor & Radar Lab',
      temp: 'Temperature Sensor TMP36 & HVAC Lab',"""

if target_sl2 in text and "'sonar':" not in text:
    text = text.replace(target_sl2, sonar_sl2)
    print('Added sonar to labNames')

target_sl3 = "    if (tempCircuitView) tempCircuitView.style.display = labName === 'temp' ? 'block' : 'none';"
sonar_sl3 = """    if (sonarCircuitView) sonarCircuitView.style.display = labName === 'sonar' ? 'block' : 'none';
    if (tempCircuitView) tempCircuitView.style.display = labName === 'temp' ? 'block' : 'none';"""

if target_sl3 in text and 'sonarCircuitView.style.display' not in text:
    text = text.replace(target_sl3, sonar_sl3)
    print('Added sonarCircuitView display toggle')

target_sl4 = "  if (labBtnTemp) labBtnTemp.addEventListener('click', () => switchLab('temp'));"
sonar_sl4 = """  if (labBtnSonar) labBtnSonar.addEventListener('click', () => switchLab('sonar'));
  if (labBtnTemp) labBtnTemp.addEventListener('click', () => switchLab('temp'));"""

if target_sl4 in text and "switchLab('sonar')" not in text:
    text = text.replace(target_sl4, sonar_sl4)
    print('Added labBtnSonar click listener')

# 4. renderHardwareCallouts
target_hc = "    } else if (state.activeLab === 'temp') {"
sonar_hc = """    } else if (state.activeLab === 'sonar') {
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
    } else if (state.activeLab === 'temp') {"""

if target_hc in text and "state.activeLab === 'sonar'" not in text:
    text = text.replace(target_hc, sonar_hc)
    print('Added sonar hardware callouts')

# 5. onHardwareChange telemetry
target_hw = "    // 7. Update LAB 8: Temperature TMP36 & HVAC Visuals"
sonar_hw = """    // 7. Update LAB 9: HC-SR04 Ultrasonic Distance Sensor & Radar Visuals
    if (state.activeLab === 'sonar') {
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
    }

    // 7. Update LAB 8: Temperature TMP36 & HVAC Visuals"""

if target_hw in text and "state.activeLab === 'sonar'" not in text:
    text = text.replace(target_hw, sonar_hw)
    print('Added sonar onHardwareChange')

# 6. renderInteractiveTask routing
target_rt = "    } else if (lesson.labId === 'temp') {"
sonar_rt = """    } else if (lesson.labId === 'sonar') {
      if (lesson.id === 33) renderSonarLesson1(lesson);
      else if (lesson.id === 34) renderSonarLesson2(lesson);
      else if (lesson.id === 35) renderSonarLesson3(lesson);
      else if (lesson.id === 36) renderSonarLesson4(lesson);
    } else if (lesson.labId === 'temp') {"""

if target_rt in text and "lesson.labId === 'sonar'" not in text:
    text = text.replace(target_rt, sonar_rt)
    print('Added sonar renderInteractiveTask routing')

# 7. Renderers for Sonar Lessons 1..4
sonar_renderers = """
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
"""

if 'function renderSonarLesson1' not in text:
    text += sonar_renderers
    print('Appended sonar interactive renderers')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully patched js/app.js!')
