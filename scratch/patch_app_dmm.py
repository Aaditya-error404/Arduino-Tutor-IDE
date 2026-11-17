# -*- coding: utf-8 -*-
"""
Patch simulation.js and app.js with DMM lab logic and interactive renderers.
"""

# 1. Update simulation.js
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

dmm_sim_state = """    } else if (labName === 'dmm') {
      this.voltage = 5.0;
      this.currentMa = 13.4;
      this.dmmMode = 'dcv';
      this.dmmRedNode = '5V';
      this.dmmBlackNode = 'GND';
      this.dmmReading = '5.00 V';
      this.dmmFaultScenario = 'healthy';
      this.setLesson(1);"""

if "labName === 'dmm'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'cad') {",
        dmm_sim_state + "\n    } else if (labName === 'cad') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with dmm state.")
else:
    print("simulation.js already has dmm state.")

# 2. Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add dmmCircuitView declaration
if "const dmmCircuitView = document.getElementById('dmm-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const cadCircuitView = document.getElementById('cad-circuit-view');",
        "const cadCircuitView = document.getElementById('cad-circuit-view');\n  const dmmCircuitView = document.getElementById('dmm-circuit-view');"
    )

# Add dmm HUD in onHardwareChange
dmm_hud = """    } else if (state.activeLab === 'dmm') {
      const mode = hw.dmmMode || 'dcv';
      const reading = hw.dmmReading || '5.00 V';
      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>⚡</span> Multimeter Dial Mode';
        hudReadout1.textContent = mode.toUpperCase() + (mode === 'cont' ? ' (Buzzer)' : '');
        hudReadout1.className = 'hud-value val high';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>🔴</span> Red Probe (+)';
        hudReadout2.textContent = hw.dmmRedNode || 'Node 1 (5V)';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>⚫</span> Black Probe (COM)';
        hudReadout3.textContent = hw.dmmBlackNode || 'Node 5 (GND)';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>📟</span> Meter Readout';
        hudReadout4.textContent = reading;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>Multimeter ADC:</strong> Dual-Slope Integrating Converter (2000 Counts)';
      if (scopeStatus) scopeStatus.textContent = `Probing [${hw.dmmRedNode} to ${hw.dmmBlackNode}] -> Result: ${reading}`;"""

if "state.activeLab === 'dmm'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'cad') {",
        dmm_hud + "\n    } else if (state.activeLab === 'cad') {"
    )

# Add dmm dispatch in renderCurrentLesson
dmm_dispatch = """    } else if (state.activeLab === 'dmm') {
      if (lesson.id === 1) renderDmmLesson1(lesson);
      else if (lesson.id === 2) renderDmmLesson2(lesson);
      else if (lesson.id === 3) renderDmmLesson3(lesson);
      else if (lesson.id === 4) renderDmmLesson4(lesson);"""

if "renderDmmLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'cad') {",
        dmm_dispatch + "\n    } else if (state.activeLab === 'cad') {"
    )

# Add DMM lesson renderers
dmm_renderers_code = '''
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
'''

if "renderDmmLesson1" not in app_content:
    # Insert renderers before app boot
    target_boot = "// --- Initial App Boot with Direct URL Parameter Support ---"
    app_content = app_content.replace(
        target_boot,
        dmm_renderers_code + "\n\n  " + target_boot
    )

    # Update requestedLab array check
    app_content = app_content.replace(
        "'cad']",
        "'cad', 'dmm']"
    )

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_content)
    print("app.js successfully patched with DMM lab renderers!")
else:
    print("app.js already has DMM renderers.")
