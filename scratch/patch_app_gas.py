# -*- coding: utf-8 -*-
"""
Patch simulation.js and app.js with Gas lab logic and interactive renderers.
"""

# 1. Update simulation.js
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

gas_sim_state = """    } else if (labName === 'gas') {
      this.voltage = 0.85;
      this.currentMa = 155.0;
      this.gasPpm = 120;
      this.gasAqi = 45;
      this.gasAlarmActive = false;
      this.gasHeaterReady = true;
      this.setLesson(1);"""

if "labName === 'gas'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'dht') {",
        gas_sim_state + "\n    } else if (labName === 'dht') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with gas state.")
else:
    print("simulation.js already has gas state.")

# 2. Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add gasCircuitView declaration
if "const gasCircuitView = document.getElementById('gas-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const dhtCircuitView = document.getElementById('dht-circuit-view');",
        "const dhtCircuitView = document.getElementById('dht-circuit-view');\n  const gasCircuitView = document.getElementById('gas-circuit-view');"
    )

# Add gas HUD in onHardwareChange
gas_hud = """    } else if (state.activeLab === 'gas') {
      const ppm = hw.gasPpm || 120;
      const aqi = hw.gasAqi || 45;
      const isAlarm = hw.gasAlarmActive || false;
      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🧪</span> Gas Density (PPM)';
        hudReadout1.textContent = `${ppm} PPM`;
        hudReadout1.className = isAlarm ? 'hud-value val high' : 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>🍃</span> Air Quality Index';
        hudReadout2.textContent = `AQI ${aqi} (${aqi <= 50 ? 'Good' : (aqi <= 100 ? 'Moderate' : 'Poor')})`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🚨</span> Digital DO Pin 2';
        hudReadout3.textContent = isAlarm ? 'LOW (0V - ALARM!)' : 'HIGH (5V - Safe)';
        hudReadout3.className = isAlarm ? 'hud-value val high' : 'hud-value val ok';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🔥</span> Heating Core';
        hudReadout4.textContent = '300°C (155 mA)';
        hudReadout4.className = 'hud-value val warn';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>MQ Chemical Sensor:</strong> Power-Law Sensitivity Curve (Rs/R0)';
      if (scopeStatus) scopeStatus.textContent = `AO Pin A0: Vout = ${((ppm/1000)*3.5 + 0.65).toFixed(2)}V | Rs/R0 = ${(500/ppm).toFixed(2)} | DO Pin 2: ${isAlarm ? 'ALARM' : 'CLEAR'}`;"""

if "state.activeLab === 'gas'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'dht') {",
        gas_hud + "\n    } else if (state.activeLab === 'dht') {"
    )

# Add gas dispatch in renderInteractiveTask
gas_dispatch = """    } else if (state.activeLab === 'gas') {
      if (lesson.id === 1) renderGasLesson1(lesson);
      else if (lesson.id === 2) renderGasLesson2(lesson);
      else if (lesson.id === 3) renderGasLesson3(lesson);
      else if (lesson.id === 4) renderGasLesson4(lesson);"""

if "renderGasLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'dht') {",
        gas_dispatch + "\n    } else if (state.activeLab === 'dht') {"
    )

# Add Gas lesson renderers
gas_renderers_code = '''
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, gas_renderers_code + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)
print("app.js successfully patched with Gas lab renderers!")
