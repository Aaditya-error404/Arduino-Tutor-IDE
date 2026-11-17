# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with Motor lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

motor_sim_state = """    } else if (labName === 'motor') {
      this.voltage = 12.0;
      this.currentMa = 380.0;
      this.motorMotion = 'FORWARD';
      this.motorLeftPwm = 200;
      this.motorRightPwm = 200;
      this.motorLeftRpm = 185;
      this.motorRightRpm = 185;
      this.motorHeatsinkTemp = 48.0;
      this.motorObstacleDist = 45;
      this.setLesson(1);"""

if "labName === 'motor'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'soil') {",
        motor_sim_state + "\n    } else if (labName === 'soil') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with motor state.")
else:
    print("simulation.js already has motor state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add motorCircuitView declaration if missing
if "const motorCircuitView = document.getElementById('motor-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const soilCircuitView = document.getElementById('soil-circuit-view');",
        "const soilCircuitView = document.getElementById('soil-circuit-view');\n  const motorCircuitView = document.getElementById('motor-circuit-view');"
    )

# Add motor HUD in onHardwareChange
motor_hud = """    } else if (state.activeLab === 'motor') {
      const motion = hw.motorMotion || 'FORWARD';
      const lPwm = hw.motorLeftPwm !== undefined ? hw.motorLeftPwm : 200;
      const rPwm = hw.motorRightPwm !== undefined ? hw.motorRightPwm : 200;
      const lRpm = hw.motorLeftRpm !== undefined ? hw.motorLeftRpm : 185;
      const rRpm = hw.motorRightRpm !== undefined ? hw.motorRightRpm : 185;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🏎️</span> Rover Kinematics';
        hudReadout1.textContent = motion;
        hudReadout1.className = motion === 'BRAKE' ? 'hud-value val warn' : 'hud-value val ok';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>⚙️</span> Left Track Velocity';
        hudReadout2.textContent = `${lRpm} RPM (PWM ${lPwm})`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>⚙️</span> Right Track Velocity';
        hudReadout3.textContent = `${rRpm} RPM (PWM ${rPwm})`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🔥</span> Heatsink Thermal';
        hudReadout4.textContent = `${(hw.motorHeatsinkTemp || 48).toFixed(1)}°C (12V • ${Math.round(hw.currentMa || 380)}mA)`;
        hudReadout4.className = 'hud-value val';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>L298N Dual H-Bridge:</strong> 4WD Skid Steer Kinematics & Back-EMF Clamping';
      if (scopeStatus) scopeStatus.textContent = `Left: ENA=PWM${lPwm} | Right: ENB=PWM${rPwm} | Motion: ${motion} | Obstacle: ${hw.motorObstacleDist || 45}cm`;"""

if "state.activeLab === 'motor'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'soil') {",
        motor_hud + "\n    } else if (state.activeLab === 'soil') {"
    )

# Add motor dispatch in renderInteractiveTask
motor_dispatch = """    } else if (state.activeLab === 'motor') {
      if (lesson.id === 1) renderMotorLesson1(lesson);
      else if (lesson.id === 2) renderMotorLesson2(lesson);
      else if (lesson.id === 3) renderMotorLesson3(lesson);
      else if (lesson.id === 4) renderMotorLesson4(lesson);"""

if "renderMotorLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'soil') {",
        motor_dispatch + "\n    } else if (state.activeLab === 'soil') {"
    )

# Add Motor Lesson Renderers
motor_renderers = '''
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
            <div id="box-motor-ma" style="font-size:1rem; font-weight:800; color:${isStall ? '#ef4444' : '#10b981'};">${isStall ? '850 mA (Stall)' : Math.round(180 + (hw.motorLeftPwm/255)*200) + ' mA'}</div>
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
        boxMotorMa.textContent = stall ? '850 mA (Stall)' : `${Math.round(180 + (p/255)*200)} mA`;
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, motor_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with Motor lab renderers!")
