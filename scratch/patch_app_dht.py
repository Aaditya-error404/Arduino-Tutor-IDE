# -*- coding: utf-8 -*-
"""
Patch simulation.js and app.js with DHT lab logic and interactive renderers.
"""

# 1. Update simulation.js
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

dht_sim_state = """    } else if (labName === 'dht') {
      this.voltage = 5.0;
      this.currentMa = 2.5;
      this.dhtTemp = 28.5;
      this.dhtHumidity = 65.0;
      this.dhtHeatIndex = 31.2;
      this.dhtFanState = false;
      this.dhtMistState = false;
      this.setLesson(1);"""

if "labName === 'dht'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'slicer') {",
        dht_sim_state + "\n    } else if (labName === 'slicer') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with dht state.")
else:
    print("simulation.js already has dht state.")

# 2. Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add dhtCircuitView declaration
if "const dhtCircuitView = document.getElementById('dht-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const slicerCircuitView = document.getElementById('slicer-circuit-view');",
        "const slicerCircuitView = document.getElementById('slicer-circuit-view');\n  const dhtCircuitView = document.getElementById('dht-circuit-view');"
    )

# Add dht HUD in onHardwareChange
dht_hud = """    } else if (state.activeLab === 'dht') {
      const t = hw.dhtTemp || 28.5;
      const h = hw.dhtHumidity || 65.0;
      const hi = hw.dhtHeatIndex || 31.2;
      const fan = hw.dhtFanState ? 'FAN ON' : 'FAN OFF';
      const mist = hw.dhtMistState ? 'MIST ON' : 'MIST OFF';
      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🌡️</span> Ambient Temperature';
        hudReadout1.textContent = `${t.toFixed(1)}°C (${((t*1.8)+32).toFixed(1)}°F)`;
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>💧</span> Relative Humidity';
        hudReadout2.textContent = `${h.toFixed(1)}% RH`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>☀️</span> Heat Index (Feels Like)';
        hudReadout3.textContent = `${hi.toFixed(1)}°C (${hi > 32 ? 'Caution' : 'Normal'})`;
        hudReadout3.className = hi > 38 ? 'hud-value val high' : (hi > 32 ? 'hud-value val warn' : 'hud-value val ok');
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🌿</span> Greenhouse Climate';
        hudReadout4.textContent = `${fan} | ${mist}`;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>DHT Single-Bus:</strong> 40-Bit Asynchronous Bitstream Handshake';
      if (scopeStatus) scopeStatus.textContent = `Pin 4: 18ms Wake Pulse -> 80µs Low/High ACK -> T=${t.toFixed(1)}°C, H=${h.toFixed(1)}%`;"""

if "state.activeLab === 'dht'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'slicer') {",
        dht_hud + "\n    } else if (state.activeLab === 'slicer') {"
    )

# Add dht dispatch in renderInteractiveTask
dht_dispatch = """    } else if (state.activeLab === 'dht') {
      if (lesson.id === 1) renderDhtLesson1(lesson);
      else if (lesson.id === 2) renderDhtLesson2(lesson);
      else if (lesson.id === 3) renderDhtLesson3(lesson);
      else if (lesson.id === 4) renderDhtLesson4(lesson);"""

if "renderDhtLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'slicer') {",
        dht_dispatch + "\n    } else if (state.activeLab === 'slicer') {"
    )

# Add DHT lesson renderers
dht_renderers_code = '''
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, dht_renderers_code + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)
print("app.js successfully patched with DHT lab renderers!")
