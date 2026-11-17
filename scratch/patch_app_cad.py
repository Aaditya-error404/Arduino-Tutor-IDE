# -*- coding: utf-8 -*-
"""
Patch app.js and simulation.js to add CAD lab support and grade band filtering.
"""

# 1. Patch simulation.js
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

cad_sim_state = """    } else if (labName === 'cad') {
      this.voltage = 0.0;
      this.currentMa = 0.0;
      this.cadWidth = 20.0;
      this.cadDepth = 20.0;
      this.cadHeight = 20.0;
      this.cadHoleDiameter = 10.0;
      this.cadIsGrouped = false;
      this.cadWallThickness = 2.5;
      this.cadTolerance = 0.4;
      this.setLesson(1);"""

if "labName === 'cad'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'temp') {",
        cad_sim_state + "\n    } else if (labName === 'temp') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with cad state.")
else:
    print("simulation.js already has cad state.")

# 2. Patch app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add cadCircuitView declaration
if "const cadCircuitView = document.getElementById('cad-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const lcdCircuitView = document.getElementById('lcd-circuit-view');",
        "const lcdCircuitView = document.getElementById('lcd-circuit-view');\n  const cadCircuitView = document.getElementById('cad-circuit-view');"
    )

# Add getCurrentLessons mapping for cad
if "state.activeLab === 'cad'" not in app_content:
    app_content = app_content.replace(
        "if (state.activeLab === 'servo') return window.SERVO_LESSONS_DATA;",
        "if (state.activeLab === 'cad') return window.CAD_LESSONS_DATA;\n    if (state.activeLab === 'servo') return window.SERVO_LESSONS_DATA;"
    )

# Add cad to labNames in switchLab
if "cad: '🌱 Level 1 • 3D CAD Modeling Studio (Tinkercad CSG)'" not in app_content:
    app_content = app_content.replace(
        "const labNames = {",
        "const labNames = {\n      cad: '🌱 Level 1 • 3D CAD Modeling Studio (Tinkercad CSG)',"
    )

# Add toggle for cadCircuitView in switchLab
if "if (cadCircuitView) cadCircuitView.style.display = labName === 'cad' ? 'block' : 'none';" not in app_content:
    app_content = app_content.replace(
        "if (lcdCircuitView) lcdCircuitView.style.display = labName === 'lcd' ? 'block' : 'none';",
        "if (lcdCircuitView) lcdCircuitView.style.display = labName === 'lcd' ? 'block' : 'none';\n    if (cadCircuitView) cadCircuitView.style.display = labName === 'cad' ? 'block' : 'none';"
    )

# Add cad HUD readouts in updateCircuitReadouts
cad_hud = """    } else if (state.activeLab === 'cad') {
      const w = hw.cadWidth || 20.0;
      const d = hw.cadDepth || 20.0;
      const h = hw.cadHeight || 20.0;
      const vol = Math.round(w * d * h);
      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>📐</span> Box Width X';
        hudReadout1.textContent = `${w.toFixed(1)} mm`;
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>📏</span> Box Depth Y';
        hudReadout2.textContent = `${d.toFixed(1)} mm`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>📐</span> Box Height Z';
        hudReadout3.textContent = `${h.toFixed(1)} mm`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🧊</span> Solid Volume';
        hudReadout4.textContent = `${vol.toLocaleString()} mm³`;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>3D CAD Metrology:</strong> Watertight Solid CSG Normal Vectors';
      if (scopeStatus) scopeStatus.textContent = hw.cadIsGrouped ? 'CSG Boolean Difference: [A - B] Computed' : 'Dual Primitive Overlay: 8 Vertices, 12 Polygons';"""

if "state.activeLab === 'cad'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'lcd') {",
        cad_hud + "\n    } else if (state.activeLab === 'lcd') {"
    )

# Add cad dispatcher in renderCurrentLesson
cad_dispatch = """    } else if (state.activeLab === 'cad') {
      if (lesson.id === 1) renderCadLesson1(lesson);
      else if (lesson.id === 2) renderCadLesson2(lesson);
      else if (lesson.id === 3) renderCadLesson3(lesson);
      else if (lesson.id === 4) renderCadLesson4(lesson);"""

if "renderCadLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'lcd') {",
        cad_dispatch + "\n    } else if (state.activeLab === 'lcd') {"
    )

# Add CAD Lesson renderers right before end of file
cad_renderers_code = '''
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

    if (faceLeft) faceLeft.setAttribute('points', `0,0 -${sy},${sy*0.5} -${sy},${sy*0.5 - sz} 0,-${sz}`);
    if (faceRight) faceRight.setAttribute('points', `0,0 ${sx},${sx*0.5} ${sx},${sx*0.5 - sz} 0,-${sz}`);
    if (faceTop) faceTop.setAttribute('points', `0,-${sz} ${sx},${sx*0.5 - sz} ${sx - sy},${(sx + sy)*0.5 - sz} -${sy},${sy*0.5 - sz}`);

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

    updateCircuitReadouts();
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
'''

# Dynamic lab switcher listener & Grade filter logic
grade_filter_code = '''
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
'''

if "renderCadLesson1" not in app_content:
    # Insert renderers before app boot
    target_boot = "// --- Initial App Boot with Direct URL Parameter Support ---"
    app_content = app_content.replace(
        target_boot,
        cad_renderers_code + "\n" + grade_filter_code + "\n\n  " + target_boot
    )

    # Also update requestedLab array check
    app_content = app_content.replace(
        "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'led']",
        "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'led', 'cad']"
    )

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_content)
    print("app.js successfully patched with CAD lab and grade filter!")
else:
    print("app.js already has CAD renderers.")
