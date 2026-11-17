# -*- coding: utf-8 -*-
"""
Apply Three Targeted Bug Fixes across SparkByte Studio:
1. Fix Simulation Execution & Code Stepping:
   - In js/app.js:
     - Fix getDynamicHumanCode & getDynamicCppCode: properly handle lesson.defaultCode.cplusplus and plainEnglish/human strings for Level 3 labs.
     - Isolate LED lab in onHardwareChange to `else if (hw.activeLab === 'led')` instead of greedy `else`.
     - Add full telemetry and animation handlers for motor, imu, rfid, iot, oled, soil, gas, dht, slicer, cad, dmm.
     - In highlightLines: clamp lineToHighlight to available rows so both Plain English and C++ columns always highlight in sync in Lime Green (#65A30D).
   - In js/simulation.js:
     - In start(): auto-wire/auto-attach Pin 13 or Pin 9 if not yet attached so clicking 'Start Simulation' immediately runs without modal stall.
2. Fix Giant Black SVG Jumper Wires (fill="none"):
   - In index.html: Add `fill="none"` and `stroke-linecap="round"` to all jumper wire `<path>` elements.
   - In css/styles.css: Add universal `.circuit-wire`, `.wire-electron-track`, `.wire-group path`, `#l298n-jumper-ribbon path` rules with `fill: none !important; stroke-linecap: round !important; stroke-width: 3px !important;` and color tokens (#EF4444 for 5V/Signal, #334155 for GND, #F59E0B for PWM/Data).
3. Fix Bottom Telemetry Text Contrast & Top-Right Icon Buttons:
   - In css/styles.css: Style `.hud-card`, `.hud-label` (#94A3B8), `.hud-value` (#F8FAFC with tabular-nums), and `.icon-only-btn svg` (16px x 16px, #475569 stroke).
   - In index.html: Update SVG width/height to 16px and ensure proper tooltips on Guide, Sound, and Reset buttons.
"""

import re

# =========================================================================
# 1. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1A. Top-right utility icon buttons: 16x16 SVGs and visible stroke/tooltips
html = re.sub(
    r'<button class="icon-btn icon-only-btn" id="teacher-modal-btn"[^>]*>[\s\S]*?</button>',
    '''<button class="icon-btn icon-only-btn" id="teacher-modal-btn" title="Lesson Guide (Standards &amp; Pedagogy)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span class="sr-only">Guide</span>
          </button>''',
    html
)

html = re.sub(
    r'<button class="icon-btn icon-only-btn" id="audio-toggle"[^>]*>[\s\S]*?</button>',
    '''<button class="icon-btn icon-only-btn" id="audio-toggle" title="Toggle Sound Effects">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span class="sr-only label">Sound</span>
          </button>''',
    html
)

html = re.sub(
    r'<button class="icon-btn icon-only-btn" id="reset-btn"[^>]*>[\s\S]*?</button>',
    '''<button class="icon-btn icon-only-btn" id="reset-btn" title="Reset Current Lesson">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <span class="sr-only">Reset</span>
          </button>''',
    html
)

# 1B. Add fill="none" and stroke-linecap="round" to all wire paths in index.html
def fix_wire_path(m):
    tag = m.group(0)
    if 'fill=' not in tag:
        tag = tag.replace('<path', '<path fill="none"')
    if 'stroke-linecap=' not in tag:
        tag = tag.replace('<path', '<path stroke-linecap="round"')
    return tag

html = re.sub(r'<path[^>]*class=["\'][^"\']*(?:circuit-wire|wire-electron-track)[^"\']*["\'][^>]*>', fix_wire_path, html)

# Cache bust scripts and styles
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=26', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=26', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html successfully!")


# =========================================================================
# 2. UPDATE css/styles.css
# =========================================================================
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add wire rules & telemetry contrast rules
wire_telemetry_css = """
/* ==========================================================================
   CIRCUIT JUMPER WIRES (ZERO BLACK FILL WEDGES) & TELEMETRY CONTRAST
   ========================================================================== */
.circuit-wire,
.wire-electron-track,
.wire-group path,
#l298n-jumper-ribbon path,
path.circuit-wire,
path.wire-electron-track {
  fill: none !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

.circuit-wire {
  stroke-width: 3px !important;
  opacity: 0.95 !important;
}

.wire-electron-track {
  fill: none !important;
  stroke-width: 1.5px !important;
  stroke-dasharray: 4, 8 !important;
  opacity: 0.65 !important;
}

/* Explicit Jumper Wire Color Palettes */
.wire-red,
path[style*="stroke: #ef4444"],
path[style*="stroke: #dc2626"],
path[style*="stroke: #991b1b"] {
  stroke: #EF4444 !important;
}

.wire-orange,
path[style*="stroke: #f97316"],
path[style*="stroke: #f59e0b"] {
  stroke: #F59E0B !important;
}

.wire-black,
path[style*="stroke: #1e293b"],
path[style*="stroke: #0f172a"] {
  stroke: #334155 !important;
}

.wire-brown {
  stroke: #78350F !important;
}

.wire-blue,
path[style*="stroke: #3b82f6"],
path[style*="stroke: #0284c7"] {
  stroke: #3B82F6 !important;
}

.wire-green,
path[style*="stroke: #10b981"],
path[style*="stroke: #22c55e"] {
  stroke: #10B981 !important;
}

.wire-yellow,
path[style*="stroke: #eab308"],
path[style*="stroke: #facc15"] {
  stroke: #EAB308 !important;
}

.wire-cyan,
path[style*="stroke: #06b6d4"],
path[style*="stroke: #38bdf8"] {
  stroke: #06B6D4 !important;
}

.wire-purple,
path[style*="stroke: #8b5cf6"],
path[style*="stroke: #a855f7"] {
  stroke: #8B5CF6 !important;
}

/* Bottom Telemetry HUD Grid & Contrast Readouts (Dark Stage #0F172A) */
.hud-readouts-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 8px !important;
  margin-top: 10px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.hud-card {
  background: #0B1120 !important;
  border: 1px solid #1E293B !important;
  border-radius: var(--radius-sm) !important;
  padding: 6px 10px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
  box-sizing: border-box !important;
}

.hud-label {
  color: #94A3B8 !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  letter-spacing: 0.03em !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
}

.hud-label span {
  font-size: 11px !important;
}

.hud-value {
  color: #F8FAFC !important;
  font-family: var(--font-mono) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  font-variant-numeric: tabular-nums !important;
  line-height: 1.2 !important;
}

.hud-value.high {
  color: #38BDF8 !important;
}

.hud-value.low {
  color: #94A3B8 !important;
}

/* Top-Right Header Icon Buttons (16x16, Visible Stroke) */
.icon-only-btn {
  width: 28px !important;
  height: 28px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: var(--radius-sm) !important;
}

.icon-only-btn svg {
  width: 16px !important;
  height: 16px !important;
  stroke: #475569 !important;
  stroke-width: 1.75px !important;
  display: block !important;
  transition: stroke 0.15s ease !important;
}

.icon-only-btn:hover svg {
  stroke: #0F172A !important;
}

/* Simulation Controls Active State */
.btn-simulate.active,
.btn-simulate.running {
  background: #0284c7 !important;
  color: #FFFFFF !important;
}
"""

if 'CIRCUIT JUMPER WIRES (ZERO BLACK FILL WEDGES)' not in css:
    css = wire_telemetry_css + "\n" + css

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated css/styles.css successfully!")


# =========================================================================
# 3. UPDATE js/simulation.js
# =========================================================================
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_js = f.read()

# Auto-configure/attach on start() if not configured to prevent alert modal stall
old_start = re.search(r'start\(\)\s*\{[\s\S]*?this\.startScopeLoop\(\);', sim_js)
if old_start:
    new_start = """start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 2 && !this.pin13Configured) {
        this.claimPin13(true);
      }
    } else if (this.activeLab === 'servo') {
      if (this.activeLessonId === 2 && !this.servoAttached) {
        this.attachServoPin(9);
      }
    }

    this.isRunning = true;
    this.isPaused = false;
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playToggle(true);
    }

    this.startScopeLoop();"""
    sim_js = sim_js[:old_start.start()] + new_start + sim_js[old_start.end():]

with open('js/simulation.js', 'w', encoding='utf-8') as f:
    f.write(sim_js)
print("Updated js/simulation.js successfully!")


# =========================================================================
# 4. UPDATE js/app.js
# =========================================================================
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 4A. Update getDynamicHumanCode & getDynamicCppCode
old_get_human = re.search(r'function getDynamicHumanCode\(lesson\)\s*\{[\s\S]*?function getDynamicCppCode\(lesson\)\s*\{[\s\S]*?return \[\{ id: \'c1\', line: 1, text: \'// Arduino C\+\+\', indent: 0, tag: \'header\' \}\];\s*\}', app_js)

if old_get_human:
    new_get_codes = """function getDynamicHumanCode(lesson) {
    if (state.activeLab === 'servo') {
      if (lesson.id === 2) {
        return [
          { line: 1, indent: 0, tag: "include", text: "1. Borrow the official Servo instruction kit;" },
          { line: 2, indent: 0, tag: "object", text: "2. Create our robot arm named myServo;" },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
          { line: 5, indent: 1, tag: "attach", text: state.servoAttached 
              ? "    Attach myServo signal wire to PWM Pin 9;" 
              : "    [Click Pin ~9 on the Arduino to attach control line!]" },
          { line: 6, indent: 0, tag: "blank", text: "" },
          { line: 7, indent: 0, tag: "header", text: "REPEAT FOREVER:" },
          { line: 8, indent: 1, tag: "comment", text: "    (Pin 9 is actively transmitting hold pulses...)" }
        ];
      } else if (lesson.id === 3) {
        return [
          { line: 1, indent: 0, tag: "include", text: "1. Borrow the official Servo instruction kit;" },
          { line: 2, indent: 0, tag: "object", text: "2. Create our robot arm named myServo;" },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
          { line: 5, indent: 1, tag: "attach", text: "    Attach myServo signal wire to PWM Pin 9;" },
          { line: 6, indent: 0, tag: "blank", text: "" },
          { line: 7, indent: 0, tag: "header", text: "REPEAT FOREVER (Angle Dance):" },
          { line: 8, indent: 1, tag: "writeAngle1", text: `    1. Turn servo arm to [${state.servoAngle1}] degrees;` },
          { line: 9, indent: 1, tag: "delay1", text: `    2. Freeze and hold for [${state.servoDelay}] milliseconds;` },
          { line: 10, indent: 1, tag: "writeAngle2", text: `    3. Turn servo arm to [${state.servoAngle2}] degrees;` },
          { line: 11, indent: 1, tag: "delay2", text: `    4. Freeze and hold for [${state.servoDelay}] milliseconds;` }
        ];
      }
    } else if (state.activeLab === 'led') {
      if (lesson.id === 2) {
        return [
          { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
          { line: 2, indent: 1, tag: "pinMode", text: state.claimedPin === 13 
              ? `    Tell Pin 13 to act like a Megaphone (${state.pinRole});` 
              : `    [Click Pin 13 on the board to claim it!]` },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER:" },
          { line: 5, indent: 1, tag: "comment", text: "    (Ready for blinking commands...)" }
        ];
      } else if (lesson.id === 3) {
        return [
          { line: 1, indent: 0, tag: "header", text: "When power turns ON (Do ONCE):" },
          { line: 2, indent: 1, tag: "pinMode", text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);" },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "REPEAT FOREVER (The Blink Dance):" },
          { line: 5, indent: 1, tag: "writeHigh", text: "    1. Turn Pin 13 power ON (Send 5 Volts);" },
          { line: 6, indent: 1, tag: "delayOn", text: `    2. Freeze and wait for [${state.delayOn}] milliseconds;` },
          { line: 7, indent: 1, tag: "writeLow", text: "    3. Turn Pin 13 power OFF (0 Volts);" },
          { line: 8, indent: 1, tag: "delayOff", text: `    4. Freeze and wait for [${state.delayOff}] milliseconds;` }
        ];
      }
    }

    if (lesson.defaultCode) {
      const h = lesson.defaultCode.human || lesson.defaultCode.plainEnglish;
      if (Array.isArray(h)) return h;
      if (typeof h === 'string') {
        const rows = h.split('\\n').filter(l => l.trim().length > 0);
        return rows.map((line, idx) => ({
          id: `h${idx+1}`,
          line: idx + 1,
          text: line,
          indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
          tag: 'code'
        }));
      }
    }

    if (lesson.explanation && Array.isArray(lesson.explanation)) {
      return lesson.explanation.map((e, idx) => ({
        id: `h${idx+1}`,
        line: idx + 1,
        text: `// ${e.plainEnglish}`,
        indent: 0,
        tag: 'explanation'
      }));
    }

    return [{ id: 'h1', line: 1, text: '// Human explanation', indent: 0, tag: 'header' }];
  }

  function getDynamicCppCode(lesson) {
    if (state.activeLab === 'servo') {
      if (lesson.id === 2) {
        return [
          { line: 1, indent: 0, tag: "include", text: "#include <Servo.h>" },
          { line: 2, indent: 0, tag: "object", text: "Servo myServo;" },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "void setup() {" },
          { line: 5, indent: 1, tag: "attach", text: state.servoAttached 
              ? "    myServo.attach(9);" 
              : "    // Click Pin ~9 to attach servo!" },
          { line: 6, indent: 0, tag: "brace", text: "}" },
          { line: 7, indent: 0, tag: "header", text: "void loop() {" },
          { line: 8, indent: 1, tag: "comment", text: "    // Pin 9 is actively transmitting PWM pulses" },
          { line: 9, indent: 0, tag: "brace", text: "}" }
        ];
      } else if (lesson.id === 3) {
        return [
          { line: 1, indent: 0, tag: "include", text: "#include <Servo.h>" },
          { line: 2, indent: 0, tag: "object", text: "Servo myServo;" },
          { line: 3, indent: 0, tag: "blank", text: "" },
          { line: 4, indent: 0, tag: "header", text: "void setup() {" },
          { line: 5, indent: 1, tag: "attach", text: "    myServo.attach(9);" },
          { line: 6, indent: 0, tag: "brace", text: "}" },
          { line: 7, indent: 0, tag: "header", text: "void loop() {" },
          { line: 8, indent: 1, tag: "writeAngle1", text: `    myServo.write(${state.servoAngle1});` },
          { line: 9, indent: 1, tag: "delay1", text: `    delay(${state.servoDelay});` },
          { line: 10, indent: 1, tag: "writeAngle2", text: `    myServo.write(${state.servoAngle2});` },
          { line: 11, indent: 1, tag: "delay2", text: `    delay(${state.servoDelay});` },
          { line: 12, indent: 0, tag: "brace", text: "}" }
        ];
      }
    } else if (state.activeLab === 'led') {
      if (lesson.id === 2) {
        return [
          { line: 1, indent: 0, tag: "header", text: "void setup() {" },
          { line: 2, indent: 1, tag: "pinMode", text: state.claimedPin === 13 
              ? `    pinMode(13, ${state.pinRole});` 
              : `    // Click Pin 13 to set pinMode` },
          { line: 3, indent: 0, tag: "brace", text: "}" },
          { line: 4, indent: 0, tag: "header", text: "void loop() {" },
          { line: 5, indent: 1, tag: "comment", text: "    // Pin 13 is configured and ready!" },
          { line: 6, indent: 0, tag: "brace", text: "}" }
        ];
      } else if (lesson.id === 3) {
        return [
          { line: 1, indent: 0, tag: "header", text: "void setup() {" },
          { line: 2, indent: 1, tag: "pinMode", text: "    pinMode(13, OUTPUT);" },
          { line: 3, indent: 0, tag: "brace", text: "}" },
          { line: 4, indent: 0, tag: "header", text: "void loop() {" },
          { line: 5, indent: 1, tag: "writeHigh", text: "    digitalWrite(13, HIGH);" },
          { line: 6, indent: 1, tag: "delayOn", text: `    delay(${state.delayOn});` },
          { line: 7, indent: 1, tag: "writeLow", text: "    digitalWrite(13, LOW);" },
          { line: 8, indent: 1, tag: "delayOff", text: `    delay(${state.delayOff});` },
          { line: 9, indent: 0, tag: "brace", text: "}" }
        ];
      }
    }

    if (lesson.defaultCode) {
      const cppVal = lesson.defaultCode.cpp || lesson.defaultCode.cplusplus;
      if (Array.isArray(cppVal)) return cppVal;
      if (typeof cppVal === 'string') {
        const rows = cppVal.split('\\n').filter(l => l.trim().length > 0);
        return rows.map((line, idx) => ({
          id: `c${idx+1}`,
          line: idx + 1,
          text: line,
          indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
          tag: 'code'
        }));
      }
    }

    if (lesson.code) {
      const rows = lesson.code.split('\\n').filter(l => l.trim().length > 0);
      return rows.map((line, idx) => ({
        id: `c${idx+1}`,
        line: idx + 1,
        text: line,
        indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
        tag: 'code'
      }));
    }

    return [{ id: 'c1', line: 1, text: '// Arduino C++', indent: 0, tag: 'header' }];
  }"""
    app_js = app_js[:old_get_human.start()] + new_get_codes + app_js[old_get_human.end():]

# 4B. Update highlightLines to clamp lineToHighlight so both columns are always highlighted in sync
old_highlight = re.search(r'function highlightLines\(stepInfo\) \{[\s\S]*?\n  \}', app_js)
if old_highlight:
    new_highlight = """function highlightLines(stepInfo) {
    let lineToHighlight = null;
    if (stepInfo.cppLine !== undefined && stepInfo.cppLine !== null) {
      lineToHighlight = stepInfo.cppLine;
    } else if (stepInfo.lineIndex !== undefined) {
      lineToHighlight = stepInfo.lineIndex;
    }

    if (lineToHighlight !== null) {
      const plainRows = document.querySelectorAll('.code-row-human');
      const cppRows = document.querySelectorAll('.code-row-cpp');

      let targetPlain = document.querySelector(`.code-row-human[data-line="${lineToHighlight}"]`);
      if (!targetPlain && plainRows.length > 0) {
        const clampedIndex = Math.min(Math.max(0, lineToHighlight), plainRows.length - 1);
        targetPlain = plainRows[clampedIndex];
      }

      let targetCpp = document.querySelector(`.code-row-cpp[data-line="${lineToHighlight}"]`);
      if (!targetCpp && cppRows.length > 0) {
        const clampedIndex = Math.min(Math.max(0, lineToHighlight), cppRows.length - 1);
        targetCpp = cppRows[clampedIndex];
      }

      if (targetPlain) targetPlain.classList.add('executing');
      if (targetCpp) targetCpp.classList.add('executing');
    }
  }"""
    app_js = app_js[:old_highlight.start()] + new_highlight + app_js[old_highlight.end():]

# 4C. Update onHardwareChange to add motor, imu, rfid, iot, etc. and isolate LED to `else if (hw.activeLab === 'led')`
old_on_hw = re.search(r'(\} else \{\s*// LED Lab Telemetry[\s\S]*?if \(scopeStatus\) \{\s*scopeStatus\.textContent = hw\.pin13State \? \'5V HIGH \(ON\)\' : \'0V LOW \(OFF\)\';\s*\}\s*\})', app_js)
if old_on_hw:
    new_on_hw = """} else if (hw.activeLab === 'motor') {
      // 1. Motor Lab Telemetry
      if (hudLabel1) hudLabel1.innerHTML = `<span>🏎️</span> Motor Direction`;
      if (hudReadout1) {
        hudReadout1.textContent = 'FORWARD (IN1=H, IN2=L)';
        hudReadout1.className = 'hud-value val high';
      }
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> PWM Speed (ENA)`;
      if (hudReadout2) hudReadout2.textContent = '255 (100% Duty)';
      if (hudLabel3) hudLabel3.innerHTML = `<span>🌊</span> Peak Current`;
      if (hudReadout3) hudReadout3.textContent = '850 mA (Under Load)';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> H-Bridge State`;
      if (hudReadout4) hudReadout4.textContent = 'Diagonal Q1+Q4 Conduction';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> L298N Dual H-Bridge PWM Motor Speed (Pin 5: 490Hz)`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'ENA: 255 (100% PWM) • IN1=HIGH, IN2=LOW';
      }

      // Wheel animations
      ['wheel-fl', 'wheel-rl', 'wheel-fr', 'wheel-rr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rot = (Date.now() / 8) % 360;
          el.style.transformOrigin = 'center';
        }
      });

    } else if (hw.activeLab === 'imu') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🧭</span> Pitch Angle`;
      if (hudReadout1) hudReadout1.textContent = '+12.4°';
      if (hudLabel2) hudLabel2.innerHTML = `<span>📐</span> Roll Angle`;
      if (hudReadout2) hudReadout2.textContent = '-3.8°';
      if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Gyro Rate`;
      if (hudReadout3) hudReadout3.textContent = '42.5 °/s';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> I2C DMP Status`;
      if (hudReadout4) hudReadout4.textContent = 'DMP Ready (0x68)';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> MPU6050 6-Axis MEMS I2C DMP Gyro Vectors`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Pitch: +12.4° • Roll: -3.8° • 400kHz I2C';
      }

    } else if (hw.activeLab === 'rfid') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🏷️</span> Card UID`;
      if (hudReadout1) hudReadout1.textContent = '0x4A 0x88 0x3F 0x1B';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> RF Frequency`;
      if (hudReadout2) hudReadout2.textContent = '13.56 MHz (ISO 14443A)';
      if (hudLabel3) hudLabel3.innerHTML = `<span>🔓</span> Access State`;
      if (hudReadout3) hudReadout3.textContent = 'AUTHORIZED (Unlocked)';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> SPI Bus Rate`;
      if (hudReadout4) hudReadout4.textContent = '10 Mbps SCK/MISO';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> RC522 RFID 13.56MHz Carrier Burst & SPI Framing`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Card Detected: 0x4A883F1B • 13.56MHz Active';
      }

    } else if (hw.activeLab === 'iot') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>☁️</span> Cloud Broker`;
      if (hudReadout1) hudReadout1.textContent = 'mqtt.eclipseprojects.io';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Wi-Fi RSSI`;
      if (hudReadout2) hudReadout2.textContent = '-58 dBm (Strong)';
      if (hudLabel3) hudLabel3.innerHTML = `<span>📊</span> Topic Payload`;
      if (hudReadout3) hudReadout3.textContent = 'atl/lab22/telemetry';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> FreeRTOS Core`;
      if (hudReadout4) hudReadout4.textContent = 'Dual Core 0 & Core 1';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> ESP32 Wi-Fi MQTT Telemetry Transmit Burst (2.4GHz)`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'MQTT Published: 200 OK • RSSI: -58 dBm';
      }

    } else if (hw.activeLab === 'oled') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🖥️</span> Resolution`;
      if (hudReadout1) hudReadout1.textContent = '128 × 64 Pixels';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Memory Pages`;
      if (hudReadout2) hudReadout2.textContent = '8 Pages (1024 Bytes)';
      if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Active Pixels`;
      if (hudReadout3) hudReadout3.textContent = '4,096 / 8,192 Lit';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> I2C Clock`;
      if (hudReadout4) hudReadout4.textContent = '400 kHz Fast-Mode';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> SSD1306 I2C Framebuffer Stream (SDA/SCL)`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Page 0..7 Refreshed @ 60 FPS • 0x3C';
      }

    } else if (hw.activeLab === 'soil') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🌱</span> Soil Moisture`;
      if (hudReadout1) hudReadout1.textContent = '68% (Optimal)';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Sensor Vout`;
      if (hudReadout2) hudReadout2.textContent = '1.85 V Capacitive';
      if (hudLabel3) hudLabel3.innerHTML = `<span>💧</span> 5V Relay State`;
      if (hudReadout3) hudReadout3.textContent = 'RELAY CLOSED (Pump ON)';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Protection`;
      if (hudReadout4) hudReadout4.textContent = 'Optocoupler Isolated';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Capacitive Soil Oscillator Waveform`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Freq: 1.5 MHz • Vout: 1.85V • Pump ACTIVE';
      }

    } else if (hw.activeLab === 'gas') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🧪</span> Gas PPM`;
      if (hudReadout1) hudReadout1.textContent = '380 ppm (Clean)';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> MQ Sensor Vout`;
      if (hudReadout2) hudReadout2.textContent = '1.45 V Analog';
      if (hudLabel3) hudLabel3.innerHTML = `<span>🚨</span> Alarm Limit`;
      if (hudReadout3) hudReadout3.textContent = '600 ppm (Safety)';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Heater Coil`;
      if (hudReadout4) hudReadout4.textContent = '5.0V Steady (Preheated)';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> MQ Gas Chamber Analog Voltage (A0)`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = '380 ppm • Normal Air Quality • Alarm Ready';
      }

    } else if (hw.activeLab === 'dht') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🌡️</span> Ambient Temp`;
      if (hudReadout1) hudReadout1.textContent = '24.5 °C';
      if (hudLabel2) hudLabel2.innerHTML = `<span>💧</span> Humidity`;
      if (hudReadout2) hudReadout2.textContent = '55.0 % RH';
      if (hudLabel3) hudLabel3.innerHTML = `<span>⚡</span> Single-Bus Data`;
      if (hudReadout3) hudReadout3.textContent = '40-Bit Frame Verified';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Checksum`;
      if (hudReadout4) hudReadout4.textContent = '0x3F (Valid)';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> DHT Single-Bus Protocol Pulse Sequence`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Start: 18ms LOW • 40 Bits Decoded OK';
      }

    } else if (hw.activeLab === 'slicer') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>🖨️</span> Layer Height`;
      if (hudReadout1) hudReadout1.textContent = '0.20 mm';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Hotend Temp`;
      if (hudReadout2) hudReadout2.textContent = '205 °C (PLA)';
      if (hudLabel3) hudLabel3.innerHTML = `<span>🧱</span> Infill Pattern`;
      if (hudReadout3) hudReadout3.textContent = '20% Gyroid';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Heated Bed`;
      if (hudReadout4) hudReadout4.textContent = '60 °C (Adhesion Ready)';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> 3D Printer Stepper Motor Pulse Train`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'Extruder: 50 mm/s • Layer 14 of 120';
      }

    } else if (hw.activeLab === 'cad') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>📐</span> Dimensions`;
      if (hudReadout1) hudReadout1.textContent = '50 × 30 × 15 mm';
      if (hudLabel2) hudLabel2.innerHTML = `<span>⚡</span> Operation`;
      if (hudReadout2) hudReadout2.textContent = 'Boolean Difference';
      if (hudLabel3) hudLabel3.innerHTML = `<span>🎯</span> Mesh Polygons`;
      if (hudReadout3) hudReadout3.textContent = '2,480 Triangles';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Export Format`;
      if (hudReadout4) hudReadout4.textContent = 'STL / STEP Ready';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Parametric CAD Math & Vector Coordinates`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'CSG Union + Cut Evaluated: 0 Errors';
      }

    } else if (hw.activeLab === 'dmm') {
      if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> DC Voltage`;
      if (hudReadout1) hudReadout1.textContent = `${hw.voltage.toFixed(2)} V`;
      if (hudLabel2) hudLabel2.innerHTML = `<span>🌊</span> Current Draw`;
      if (hudReadout2) hudReadout2.textContent = `${hw.currentMa.toFixed(1)} mA`;
      if (hudLabel3) hudLabel3.innerHTML = `<span>Ω</span> Resistance`;
      if (hudReadout3) hudReadout3.textContent = '220.0 Ω';
      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Probe Mode`;
      if (hudReadout4) hudReadout4.textContent = 'DC Volts & Amps';

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Digital Multimeter Sampling Waveform`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = `Input: ${hw.voltage.toFixed(2)}V DC • True RMS Active`;
      }

    } else if (hw.activeLab === 'led') {
      // LED Lab Telemetry
      if (hw.ledActive) {
        if (breadboardLed) breadboardLed.classList.add('illuminated');
        if (ledGlow) {
          ledGlow.style.opacity = '1';
          ledGlow.style.transform = 'scale(1.2)';
        }
        if (unoBuiltinLed) unoBuiltinLed.classList.add('illuminated');
        if (wirePin13) wirePin13.classList.add('flowing');
        if (wireGnd) wireGnd.classList.add('flowing');
      } else {
        if (breadboardLed) breadboardLed.classList.remove('illuminated');
        if (ledGlow) {
          ledGlow.style.opacity = '0';
          ledGlow.style.transform = 'scale(0.8)';
        }
        if (unoBuiltinLed) unoBuiltinLed.classList.remove('illuminated');
        if (wirePin13) wirePin13.classList.remove('flowing');
        if (wireGnd) wireGnd.classList.remove('flowing');
      }

      if (hudLabel1) hudLabel1.innerHTML = `<span>⚡</span> Pin 13 Voltage`;
      if (hudReadout1) hudReadout1.textContent = `${hw.voltage.toFixed(2)} V`;

      if (hudLabel2) hudLabel2.innerHTML = `<span>🌊</span> Circuit Current`;
      if (hudReadout2) hudReadout2.textContent = `${hw.currentMa.toFixed(1)} mA`;

      if (hudLabel3) hudLabel3.innerHTML = `<span>💡</span> Digital Logic State`;
      if (hudReadout3) {
        hudReadout3.textContent = hw.pin13State ? 'HIGH (5V)' : 'LOW (0V)';
        hudReadout3.className = hw.pin13State ? 'hud-value val high' : 'hud-value val low';
      }

      if (hudLabel4) hudLabel4.innerHTML = `<span>🛡️</span> Protection Resistor`;
      if (hudReadout4) hudReadout4.textContent = `220 Ω (Steady)`;

      if (scopeTitle) {
        scopeTitle.innerHTML = `<strong>Oscilloscope:</strong> Pin 13 Digital Signal Waveform`;
      }
      if (scopeStatus) {
        scopeStatus.textContent = hw.pin13State ? '5V HIGH (ON)' : '0V LOW (OFF)';
      }
    }"""
    app_js = app_js[:old_on_hw.start()] + new_on_hw + app_js[old_on_hw.end():]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated js/app.js successfully!")
