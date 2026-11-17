# -*- coding: utf-8 -*-
"""
Fix CSS grid/flexbox layout bugs:
1. Fix Left Column Vertical Flow:
   - Make .desk-view-content and #view-content-lab strictly display: flex; flex-direction: column; gap: 12px; width: 100%
   - Ensure Coach Sparky, interactive challenge (H-bridge, etc.), and Next Lesson banner are 100% width
   - Next Lesson banner as slim horizontal bar (display: flex; justify-content: space-between; align-items: center;)
2. Clean Up Top Utility Bar:
   - Compact numbered tabs (1, 2, 3, 4 with full title tooltips) in index.html & renderLessonTabs() in js/app.js
3. Polish Right Hardware & Oscilloscope Stage:
   - Add visible color-coded jumper wire ribbon between Arduino Uno and L298N driver
   - Enhance contrast of bottom telemetry & oscilloscope status rows (#94A3B8 labels, #F8FAFC values)
"""

import re

# =========================================================================
# 1. UPDATE js/app.js
# =========================================================================
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1A. Update renderLessonTabs to output compact numbered tabs 1, 2, 3, 4 with title tooltips
old_render_tabs = re.search(r'function renderLessonTabs\(\) \{[\s\S]*?lessonNavTabs\.querySelectorAll\(\'\.lesson-tab\'\)\.forEach', app_js)
if old_render_tabs:
    new_render_tabs = """function renderLessonTabs() {
    const lessons = getCurrentLessons();
    if (!lessonNavTabs) return;

    lessonNavTabs.innerHTML = lessons.map((l, idx) => `
      <button class="lesson-tab ${idx === state.activeLessonIndex ? 'active' : ''}" data-lesson="${idx}" title="${l.title || l.shortTitle}">
        <span>${idx + 1}</span>
      </button>
    `).join('');

    // Reattach tab click events
    lessonNavTabs.querySelectorAll('.lesson-tab').forEach"""
    app_js = app_js[:old_render_tabs.start()] + new_render_tabs + app_js[old_render_tabs.end()-len("lessonNavTabs.querySelectorAll('.lesson-tab').forEach"):]

# 1B. Update setDeskView to ensure flexDirection is ALWAYS 'column'
old_set_desk_view = re.search(r'function setDeskView\(viewName\) \{[\s\S]*?if \(viewContentConcept\) viewContentConcept\.style\.display = viewName === \'concept\' \? \'flex\' : \'none\';\s*\}', app_js)
if old_set_desk_view:
    new_set_desk_view = """function setDeskView(viewName) {
    state.activeDeskView = viewName;
    if (window.soundEngine) window.soundEngine.playClick();
    if (viewTabLab) viewTabLab.classList.toggle('active', viewName === 'lab');
    if (viewTabConcept) viewTabConcept.classList.toggle('active', viewName === 'concept');
    if (viewContentLab) {
      viewContentLab.style.display = viewName === 'lab' ? 'flex' : 'none';
      if (viewName === 'lab') {
        viewContentLab.style.flexDirection = 'column';
        viewContentLab.style.gap = '12px';
        viewContentLab.style.width = '100%';
      }
    }
    if (viewContentConcept) {
      viewContentConcept.style.display = viewName === 'concept' ? 'flex' : 'none';
      if (viewName === 'concept') {
        viewContentConcept.style.flexDirection = 'column';
        viewContentConcept.style.gap = '12px';
        viewContentConcept.style.width = '100%';
      }
    }
  }"""
    app_js = app_js[:old_set_desk_view.start()] + new_set_desk_view + app_js[old_set_desk_view.end():]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated js/app.js successfully!")


# =========================================================================
# 2. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 2A. Update stepper tabs in index.html to compact numbered buttons 1, 2, 3, 4
old_stepper_tabs = re.search(r'<nav class="lesson-nav-tabs" aria-label="Lesson Navigation" id="lesson-nav-tabs">[\s\S]*?</nav>', html)
if old_stepper_tabs:
    new_stepper_tabs = """<nav class="lesson-nav-tabs" aria-label="Lesson Navigation" id="lesson-nav-tabs">
            <button class="lesson-tab active" data-lesson="0" id="tab-lesson-1" title="1. Muscle &amp; Library">
              <span>1</span>
            </button>
            <button class="lesson-tab" data-lesson="1" id="tab-lesson-2" title="2. The 3 Wires">
              <span>2</span>
            </button>
            <button class="lesson-tab" data-lesson="2" id="tab-lesson-3" title="3. Angle Commands">
              <span>3</span>
            </button>
            <button class="lesson-tab" data-lesson="3" id="tab-lesson-4" title="4. Sweep Sandbox">
              <span>4</span>
            </button>
          </nav>"""
    html = html[:old_stepper_tabs.start()] + new_stepper_tabs + html[old_stepper_tabs.end():]

# 2B. Add jumper wire ribbon to motor-circuit-view if not present
if 'l298n-jumper-ribbon' not in html:
    jumper_ribbon = """
                <!-- Color-Coded Jumper Wire Ribbon connecting Arduino to L298N Driver -->
                <g id="l298n-jumper-ribbon">
                  <!-- Wire 1: Orange PWM Pin 5 -> ENA (Speed Left) -->
                  <path d="M 215,14 C 235,70 320,130 388,153" stroke="#f97316" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 2: Yellow Digital Pin 6 -> IN1 (Dir L1) -->
                  <path d="M 206,14 C 225,75 325,135 396,153" stroke="#eab308" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 3: Blue Digital Pin 7 -> IN2 (Dir L2) -->
                  <path d="M 197,14 C 215,80 330,140 404,153" stroke="#3b82f6" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 4: Purple Digital Pin 8 -> IN3 (Dir R1) -->
                  <path d="M 188,14 C 205,85 335,145 412,153" stroke="#a855f7" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 5: Cyan Digital Pin 9 -> IN4 (Dir R2) -->
                  <path d="M 179,14 C 195,90 340,150 420,153" stroke="#06b6d4" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 6: Green PWM Pin 10 -> ENB (Speed Right) -->
                  <path d="M 170,14 C 185,95 345,155 428,153" stroke="#22c55e" stroke-width="2.2" fill="none" opacity="0.9" stroke-linecap="round" />
                  <!-- Wire 7: Red 5V Logic -> VCC -->
                  <path d="M 226,176 C 255,210 330,200 378,165" stroke="#ef4444" stroke-width="2.2" fill="none" opacity="0.85" stroke-linecap="round" />
                  <!-- Wire 8: Black Common Ground -> GND -->
                  <path d="M 235,176 C 265,220 335,210 386,165" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.95" stroke-linecap="round" />
                  <path d="M 235,176 C 265,220 335,210 386,165" stroke="#475569" stroke-width="1.4" fill="none" opacity="0.95" stroke-linecap="round" />
                </g>
"""
    motor_pos = html.find('id="motor-circuit-view"')
    if motor_pos != -1:
        insert_pos = html.find('>', motor_pos) + 1
        html = html[:insert_pos] + jumper_ribbon + html[insert_pos:]

# 2C. Add Telemetry sub-row under oscilloscope canvas
old_scope_container = re.search(r'<div class="scope-container">[\s\S]*?</canvas>\s*</div>', html)
if old_scope_container and 'scope-telemetry-row' not in html:
    new_scope_container = """<div class="scope-container">
        <div class="scope-header">
          <div class="scope-header-left">
            <span class="scope-live-dot"></span>
            <span class="scope-title" id="scope-title">CH1: Pin 9 PWM Signal • CH2: Position Feedback</span>
          </div>
          <span class="scope-status" id="scope-status">50 Hz • 1.50 ms Pulse • 0.0°/s</span>
        </div>
        <canvas id="scope-canvas" width="600" height="75"></canvas>
        <div class="scope-telemetry-row">
          <div class="telemetry-item">
            <span class="telemetry-label">CH1 VPP:</span>
            <span class="telemetry-val" id="scope-vpp">5.00 V</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">FREQUENCY:</span>
            <span class="telemetry-val" id="scope-freq">50.0 Hz</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">DUTY:</span>
            <span class="telemetry-val" id="scope-duty">7.5%</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">TIMEBASE:</span>
            <span class="telemetry-val" id="scope-timebase">2.0 ms/div</span>
          </div>
        </div>
      </div>"""
    html = html[:old_scope_container.start()] + new_scope_container + html[old_scope_container.end():]

# Cache bust scripts & styles
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=25', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=25', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html successfully!")


# =========================================================================
# 3. UPDATE css/styles.css
# =========================================================================
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 3A. Enforce strict vertical column flow on .desk-view-content and #view-content-lab
vertical_flow_css = """
/* ==========================================================================
   DESK VIEW CONTENT & VERTICAL FLOW ENFORCEMENT (PREVENTS SQUISHING)
   ========================================================================== */
.desk-view-content,
#view-content-lab,
#view-content-concept {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.desk-view-content:not(.active) {
  display: none !important;
}

.coach-banner {
  width: 100% !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px !important;
  padding: 8px 12px !important;
}

#lesson-interactive-area {
  width: 100% !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

.task-card {
  width: 100% !important;
  box-sizing: border-box !important;
}

/* Slim Horizontal Step Advance Card */
.step-advance-card {
  width: 100% !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 8px 14px !important;
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
}

.step-advance-inner {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  gap: 12px !important;
}

.step-advance-status {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.step-advance-texts {
  display: flex !important;
  align-items: baseline !important;
  gap: 8px !important;
}

.step-advance-texts h4 {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: var(--text-main) !important;
  margin: 0 !important;
  white-space: nowrap !important;
}

.step-advance-desc {
  font-size: 10px !important;
  color: var(--text-dim) !important;
  margin: 0 !important;
  white-space: nowrap !important;
}

.btn-step-advance {
  height: 26px !important;
  padding: 0 12px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.code-translator-wrapper {
  width: 100% !important;
  box-sizing: border-box !important;
}
"""

if 'DESK VIEW CONTENT & VERTICAL FLOW ENFORCEMENT' not in css:
    css = vertical_flow_css + "\n" + css

# 3B. Stepper Tabs (Compact Numbered Pills 1, 2, 3, 4)
stepper_tabs_css = """
/* Stepper Compact Numbered Tabs (1, 2, 3, 4) */
.lesson-nav-tabs {
  display: flex;
  align-items: center;
  gap: 3px;
}
.lesson-tab {
  width: 26px !important;
  height: 26px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  font-family: var(--font-mono) !important;
  color: var(--text-dim) !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: var(--radius-sm) !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}
.lesson-tab:hover:not(.active) {
  color: var(--text-main) !important;
  background: #FFFFFF !important;
  border-color: var(--border-card) !important;
}
.lesson-tab.active {
  background: #FFFFFF !important;
  color: var(--primary) !important;
  border-color: var(--border-card) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
"""

if 'Stepper Compact Numbered Tabs' not in css:
    css = stepper_tabs_css + "\n" + css

# 3C. Telemetry & Oscilloscope Contrast & Visibility
telemetry_css = """
/* High-Contrast Oscilloscope & Signal Telemetry Readout */
.scope-container {
  background: var(--bg-dark) !important;
  border: 1px solid var(--border-dark) !important;
  border-radius: var(--radius-md) !important;
  padding: 8px 12px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
.scope-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  margin-bottom: 6px !important;
}
.scope-title {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #94A3B8 !important;
}
.scope-status {
  font-size: 11px !important;
  font-family: var(--font-mono) !important;
  color: #F8FAFC !important;
  font-weight: 600 !important;
  font-variant-numeric: tabular-nums !important;
}
#scope-canvas {
  width: 100% !important;
  height: 75px !important;
  background: #060911 !important;
  border: 1px solid var(--border-dark) !important;
  border-radius: var(--radius-sm) !important;
  display: block !important;
}
.scope-telemetry-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding-top: 6px !important;
  margin-top: 6px !important;
  border-top: 1px solid var(--border-dark) !important;
  font-size: 10px !important;
  font-family: var(--font-mono) !important;
}
.telemetry-item {
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
}
.telemetry-label {
  color: #94A3B8 !important;
  font-size: 9px !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
}
.telemetry-val {
  color: #F8FAFC !important;
  font-weight: 600 !important;
  font-variant-numeric: tabular-nums !important;
}
"""

if 'High-Contrast Oscilloscope & Signal Telemetry Readout' not in css:
    css = telemetry_css + "\n" + css

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated css/styles.css successfully!")
