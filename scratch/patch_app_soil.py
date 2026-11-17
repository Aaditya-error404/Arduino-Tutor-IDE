# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with Soil lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

soil_sim_state = """    } else if (labName === 'soil') {
      this.voltage = 5.0;
      this.currentMa = 12.0;
      this.soilMoisture = 42;
      this.soilRawAdc = 445;
      this.soilRelayActive = false;
      this.soilPumpActive = false;
      this.soilWaterLevelOk = true;
      this.soilDryLimit = 35;
      this.soilWetLimit = 65;
      this.setLesson(1);"""

if "labName === 'soil'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'oled') {",
        soil_sim_state + "\n    } else if (labName === 'oled') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with soil state.")
else:
    print("simulation.js already has soil state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add soilCircuitView declaration if missing
if "const soilCircuitView = document.getElementById('soil-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const oledCircuitView = document.getElementById('oled-circuit-view');",
        "const oledCircuitView = document.getElementById('oled-circuit-view');\n  const soilCircuitView = document.getElementById('soil-circuit-view');"
    )

# Add soil HUD in onHardwareChange
soil_hud = """    } else if (state.activeLab === 'soil') {
      const pct = hw.soilMoisture !== undefined ? hw.soilMoisture : 42;
      const relay = hw.soilRelayActive || false;
      const pump = hw.soilPumpActive || false;
      const tankOk = hw.soilWaterLevelOk !== undefined ? hw.soilWaterLevelOk : true;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🌱</span> Soil Moisture';
        hudReadout1.textContent = `${pct}% (${pct < 35 ? 'Dry' : (pct > 65 ? 'Wet' : 'Optimal')})`;
        hudReadout1.className = pct < 35 ? 'hud-value val warn' : (pct > 65 ? 'hud-value val ok' : 'hud-value val');
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>⚡</span> 5V Relay State';
        hudReadout2.textContent = relay ? 'ACTIVE (NO Closed)' : 'STANDBY (NO Open)';
        hudReadout2.className = relay ? 'hud-value val ok' : 'hud-value val';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>💧</span> Submersible Pump';
        hudReadout3.textContent = pump ? 'RUNNING (12V • 350mA)' : 'OFF (0 mA)';
        hudReadout3.className = pump ? 'hud-value val high' : 'hud-value val';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🛢️</span> Water Reservoir';
        hudReadout4.textContent = tankOk ? 'FULL (Float HIGH)' : 'EMPTY (Cutoff!)';
        hudReadout4.className = tankOk ? 'hud-value val ok' : 'hud-value val high';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>Capacitive Soil & Relay:</strong> Dielectric Permittivity & Galvanic Isolation';
      if (scopeStatus) scopeStatus.textContent = `AOUT Pin A1: ${((580 - (pct/100)*320)/1023 * 5.0).toFixed(2)}V | ADC: ${Math.round(580 - (pct/100)*320)} | Relay IN: Pin 7 = ${relay ? 'LOW (Active)' : 'HIGH (Off)'} | Float: ${tankOk ? 'OK' : 'ALERT'}`;"""

if "state.activeLab === 'soil'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'oled') {",
        soil_hud + "\n    } else if (state.activeLab === 'oled') {"
    )

# Add soil dispatch in renderInteractiveTask
soil_dispatch = """    } else if (state.activeLab === 'soil') {
      if (lesson.id === 1) renderSoilLesson1(lesson);
      else if (lesson.id === 2) renderSoilLesson2(lesson);
      else if (lesson.id === 3) renderSoilLesson3(lesson);
      else if (lesson.id === 4) renderSoilLesson4(lesson);"""

if "renderSoilLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'oled') {",
        soil_dispatch + "\n    } else if (state.activeLab === 'oled') {"
    )

# Add Soil Lesson Renderers
soil_renderers = '''
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, soil_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with Soil lab renderers!")
