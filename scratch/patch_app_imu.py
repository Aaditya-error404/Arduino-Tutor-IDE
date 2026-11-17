# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with IMU lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

imu_sim_state = """    } else if (labName === 'imu') {
      this.voltage = 3.3;
      this.currentMa = 3.9;
      this.imuPitch = 0.0;
      this.imuRoll = 0.0;
      this.imuGyroRate = 0.0;
      this.imuIntegratedAngle = 0.0;
      this.imuNoiseActive = false;
      this.imuGimbalActive = true;
      this.setLesson(1);"""

if "labName === 'imu'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'motor') {",
        imu_sim_state + "\n    } else if (labName === 'motor') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with imu state.")
else:
    print("simulation.js already has imu state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add imuCircuitView declaration if missing
if "const imuCircuitView = document.getElementById('imu-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const motorCircuitView = document.getElementById('motor-circuit-view');",
        "const motorCircuitView = document.getElementById('motor-circuit-view');\n  const imuCircuitView = document.getElementById('imu-circuit-view');"
    )

# Add imu HUD in onHardwareChange
imu_hud = """    } else if (state.activeLab === 'imu') {
      const p = hw.imuPitch !== undefined ? hw.imuPitch : 0.0;
      const r = hw.imuRoll !== undefined ? hw.imuRoll : 0.0;
      const rate = hw.imuGyroRate !== undefined ? hw.imuGyroRate : 0.0;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>📐</span> Attitude (Pitch/Roll)';
        hudReadout1.textContent = `P:${p >= 0 ? '+' : ''}${p.toFixed(1)}° | R:${r >= 0 ? '+' : ''}${r.toFixed(1)}°`;
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>🌀</span> Gyroscope Rate (ω)';
        hudReadout2.textContent = `${rate.toFixed(1)} °/s (${Math.abs(rate) < 0.5 ? 'Stationary' : 'Spinning'})`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🚀</span> Earth Gravity Vector';
        hudReadout3.textContent = '1.00 G (16,384 LSB)';
        hudReadout3.className = 'hud-value val ok';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>⚖️</span> Sensor Fusion';
        hudReadout4.textContent = 'α = 0.98 Complementary';
        hudReadout4.className = 'hud-value val';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>MPU-6050 6-DOF IMU:</strong> MEMS Accelerometer & Gyroscope Sensor Fusion';
      if (scopeStatus) scopeStatus.textContent = `I2C: 0x68 | Pitch: ${p.toFixed(1)}° | Roll: ${r.toFixed(1)}° | ω: ${rate.toFixed(1)}°/s | PFD Horizon Active`;"""

if "state.activeLab === 'imu'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'motor') {",
        imu_hud + "\n    } else if (state.activeLab === 'motor') {"
    )

# Add imu dispatch in renderInteractiveTask
imu_dispatch = """    } else if (state.activeLab === 'imu') {
      if (lesson.id === 1) renderImuLesson1(lesson);
      else if (lesson.id === 2) renderImuLesson2(lesson);
      else if (lesson.id === 3) renderImuLesson3(lesson);
      else if (lesson.id === 4) renderImuLesson4(lesson);"""

if "renderImuLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'motor') {",
        imu_dispatch + "\n    } else if (state.activeLab === 'motor') {"
    )

# Add IMU Lesson Renderers
imu_renderers = '''
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, imu_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with IMU lab renderers!")
