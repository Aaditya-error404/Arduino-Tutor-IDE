# -*- coding: utf-8 -*-
"""
Patch simulation.js and app.js with Slicer lab logic and interactive renderers.
"""

# 1. Update simulation.js
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

slicer_sim_state = """    } else if (labName === 'slicer') {
      this.voltage = 0.0;
      this.currentMa = 0.0;
      this.slicerLayer = 45;
      this.slicerLayerHeight = 0.20;
      this.slicerInfillDensity = 20;
      this.slicerInfillPattern = 'grid';
      this.slicerSupportsEnabled = false;
      this.slicerHotendTemp = 205;
      this.slicerBedTemp = 60;
      this.setLesson(1);"""

if "labName === 'slicer'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'dmm') {",
        slicer_sim_state + "\n    } else if (labName === 'dmm') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with slicer state.")
else:
    print("simulation.js already has slicer state.")

# 2. Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add slicerCircuitView declaration
if "const slicerCircuitView = document.getElementById('slicer-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const dmmCircuitView = document.getElementById('dmm-circuit-view');",
        "const dmmCircuitView = document.getElementById('dmm-circuit-view');\n  const slicerCircuitView = document.getElementById('slicer-circuit-view');"
    )

# Add slicer HUD in onHardwareChange
slicer_hud = """    } else if (state.activeLab === 'slicer') {
      const layer = hw.slicerLayer || 45;
      const lh = hw.slicerLayerHeight || 0.20;
      const infill = hw.slicerInfillDensity || 20;
      const pat = (hw.slicerInfillPattern || 'grid').toUpperCase();
      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>📐</span> Layer Height';
        hudReadout1.textContent = `${lh.toFixed(2)} mm`;
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>🥞</span> Current Layer';
        hudReadout2.textContent = `Layer ${layer} / 100`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🕸️</span> Infill Density';
        hudReadout3.textContent = `${infill}% ${pat}`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>⏱️</span> Estimated Time';
        hudReadout4.textContent = `${Math.round(42 * (0.20 / lh))} mins`;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>Slicer Toolpaths:</strong> G1 Linear Interpolation Raster Vectors';
      if (scopeStatus) scopeStatus.textContent = `Extruding Layer ${layer}: E = ${(layer * 0.48).toFixed(2)}mm PLA @ 205°C (Bed: 60°C)`;"""

if "state.activeLab === 'slicer'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'dmm') {",
        slicer_hud + "\n    } else if (state.activeLab === 'dmm') {"
    )

# Add slicer dispatch in renderInteractiveTask
slicer_dispatch = """    } else if (state.activeLab === 'slicer') {
      if (lesson.id === 1) renderSlicerLesson1(lesson);
      else if (lesson.id === 2) renderSlicerLesson2(lesson);
      else if (lesson.id === 3) renderSlicerLesson3(lesson);
      else if (lesson.id === 4) renderSlicerLesson4(lesson);"""

if "renderSlicerLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'dmm') {",
        slicer_dispatch + "\n    } else if (state.activeLab === 'dmm') {"
    )

# Add Slicer lesson renderers
slicer_renderers_code = '''
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
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, slicer_renderers_code + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)
print("app.js successfully patched with Slicer lab renderers!")
