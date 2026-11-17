# -*- coding: utf-8 -*-
"""
Apply Targeted UX & Visual Polish Pass:
1. Declutter Top Utility Bar (Remove grade pills from top bar, group Guide/Sound/Reset into compact icon buttons)
2. Replace UI Chrome Emojis with 1.5px Vector SVGs (top lab pill, translator headers, explorer shelves)
3. Keep Code Visible Above the Fold (tighten left column vertical spacing)
4. Distinct Execution Highlight (Electric Blue hover, Lime Green execution tick)
"""

import re

# =========================================================================
# 1. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update version query
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=24', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=24', html)

# 1A. In #active-lab-name-pill, remove default emoji
html = html.replace(
    '<span class="trigger-name" id="active-lab-name-pill">🦾 Servo Motor Lab</span>',
    '<span class="trigger-name" id="active-lab-name-pill">Servo Motor Lab</span>'
)

# 1B. Move grade-filter-bar out of header-right into the hidden sr-only-switcher container
# and replace header-right with Teacher toggle + grouped icon buttons + Hub
old_header_right = re.search(r'<!-- Right: Grade Band Filter, Teacher Mode, Audio, Guide, Hub -->[\s\S]*?</div>\s*</div>\s*<!-- Preserved Accessible', html)
if old_header_right:
    new_header_right = """<!-- Right: Teacher Mode, Grouped Utilities & Hub -->
      <div class="header-right">
        <!-- Teacher Mode Switch -->
        <div class="teacher-toggle-wrapper" title="Show pedagogical notes and teaching tips">
          <label class="toggle-switch" for="teacher-toggle">
            <input type="checkbox" id="teacher-toggle">
            <span class="toggle-slider"></span>
          </label>
          <label for="teacher-toggle" class="teacher-label">Teacher</label>
        </div>

        <!-- Grouped Utility Icon Buttons (Guide, Sound, Reset) -->
        <div class="header-util-group" role="group" aria-label="Studio Utilities">
          <button class="icon-btn icon-only-btn" id="teacher-modal-btn" title="View Full Lesson Plan &amp; Standards">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span class="sr-only">Guide</span>
          </button>

          <button class="icon-btn icon-only-btn" id="audio-toggle" title="Toggle Sound Effects">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span class="sr-only label">Sound</span>
          </button>

          <button class="icon-btn icon-only-btn" id="reset-btn" title="Reset Current Lesson">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <span class="sr-only">Reset</span>
          </button>
        </div>

        <a href="atl_curriculum_hub.html" target="_blank" class="icon-btn hub-btn" title="Open Full ATL Curriculum Hub in New Tab">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>Hub</span>
        </a>
      </div>
    </div>

    <!-- Preserved Accessible Grade Filter & Lab Switcher container (Keeps all 22 buttons + 4 grade tabs in DOM) -->
    <div class="lab-switcher sr-only-switcher" role="tablist" aria-label="Select Learning Lab">
      <div class="grade-filter-bar" role="tablist" aria-label="Filter Labs by Grade Band">
        <button class="grade-tab-btn active" data-grade="all" id="grade-btn-all" title="View all 22 ATL labs across Grades 6 to 12">All</button>
        <button class="grade-tab-btn" data-grade="6-8" id="grade-btn-68" title="Level 1 (Grades 6–8): Foundations &amp; 3D CAD">6–8</button>
        <button class="grade-tab-btn" data-grade="9-10" id="grade-btn-910" title="Level 2 (Grades 9–10): Sensors &amp; Automation">9–10</button>
        <button class="grade-tab-btn" data-grade="11-12" id="grade-btn-1112" title="Level 3 (Grades 11–12): IoT, Mechatronics &amp; Displays">11–12</button>
      </div>
"""
    html = html[:old_header_right.start()] + new_header_right + html[old_header_right.end()-len('<!-- Preserved Accessible'):]

# 1C. Code Translator Headers with 1.5px monochrome SVG icons
old_translator_bar = """          <div class="code-translator-wrapper">
          <div class="translator-top-bar">
            <div class="col-header human">
              <span>Plain English</span>
              <span class="col-tag">What We Want</span>
            </div>
            <div class="col-header cpp">
              <span>Arduino C++</span>
              <span class="col-tag">Robot Code</span>
            </div>
          </div>"""

new_translator_bar = """          <div class="code-translator-wrapper">
          <div class="translator-top-bar">
            <div class="col-header human">
              <div class="col-header-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Plain English</span>
              </div>
              <span class="col-tag">What We Want</span>
            </div>
            <div class="col-header cpp">
              <div class="col-header-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>Arduino C++</span>
              </div>
              <span class="col-tag">Robot Code</span>
            </div>
          </div>"""

if old_translator_bar in html:
    html = html.replace(old_translator_bar, new_translator_bar)
else:
    # Pattern replace if whitespace differs
    html = re.sub(
        r'<div class="code-translator-wrapper">\s*<div class="translator-top-bar">[\s\S]*?</div>\s*</div>\s*<div class="translator-split-body">',
        new_translator_bar + '\n          <div class="translator-split-body">',
        html
    )

# 1D. Lab Explorer Grade Tabs: Replace with 1.5px monochrome SVG icons
old_modal_tabs = re.search(r'<div class="explorer-grade-tabs">[\s\S]*?</div>', html)
if old_modal_tabs:
    new_modal_tabs = """<div class="explorer-grade-tabs">
          <button class="explorer-grade-pill active" data-grade="all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>All 22 Labs</span>
          </button>
          <button class="explorer-grade-pill" data-grade="6-8">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Level 1 (Grades 6–8)</span>
          </button>
          <button class="explorer-grade-pill" data-grade="9-10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Level 2 (Grades 9–10)</span>
          </button>
          <button class="explorer-grade-pill" data-grade="11-12">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
            <span>Level 3 (Grades 11–12)</span>
          </button>
        </div>"""
    html = html[:old_modal_tabs.start()] + new_modal_tabs + html[old_modal_tabs.end():]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html successfully!")


# =========================================================================
# 2. UPDATE js/app.js (Clean shortNames & Level SVGs in Explorer)
# =========================================================================
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace shortNames with zero-emoji clean text
old_short_names = re.search(r'const shortNames = \{[\s\S]*?\};', app_js)
if old_short_names:
    new_short_names = """const shortNames = {
        led: 'LED Blink Lab',
        servo: 'Servo Motor Lab',
        button: 'Pushbutton Lab',
        pot: 'Potentiometer Lab',
        buzzer: 'Piezo Buzzer Lab',
        cad: '3D CAD Studio',
        dmm: 'Multimeter DMM Lab',
        ldr: 'LDR Light Sensor',
        rgb: 'RGB Color LED',
        temp: 'Temperature Sensor',
        sonar: 'Ultrasonic Radar',
        ir: 'IR Line Sensor',
        slicer: '3D Slicer Engine',
        dht: 'DHT Climate Station',
        gas: 'MQ Gas & AQI',
        lcd: '16x2 I2C LCD',
        oled: 'SSD1306 OLED',
        soil: 'Soil & 5V Relay',
        motor: 'L298N Motor Driver',
        imu: 'MPU6050 6-Axis IMU',
        rfid: 'RC522 RFID Access',
        iot: 'ESP32 IoT Cloud'
      };"""
    app_js = app_js[:old_short_names.start()] + new_short_names + app_js[old_short_names.end():]

# Clean up labNames in switchLab
app_js = app_js.replace("🌱 Level 1 • ", "Level 1 • ")
app_js = app_js.replace("⚙️ Level 2 • ", "Level 2 • ")
app_js = app_js.replace("🚀 Level 3 • ", "Level 3 • ")

# Update renderLabExplorerCards to use 1.5px monochrome SVG icons for the 3 levels
old_explorer_fn = re.search(r'function renderLabExplorerCards\(gradeFilter = \'all\', query = \'\'\) \{([\s\S]*?)\n  \}', app_js)
if old_explorer_fn:
    new_explorer_fn = """function renderLabExplorerCards(gradeFilter = 'all', query = '') {
    const container = document.getElementById('explorer-cards-grid');
    if (!container) return;

    const levelSvgs = {
      'Level 1': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
      'Level 2': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
      'Level 3': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`
    };

    const q = query.trim().toLowerCase();
    const filtered = LABS_METADATA.filter(lab => {
      const matchGrade = (gradeFilter === 'all' || lab.grade === gradeFilter);
      const matchQuery = !q || (
        lab.title.toLowerCase().includes(q) ||
        lab.slug.toLowerCase().includes(q) ||
        lab.summary.toLowerCase().includes(q)
      );
      return matchGrade && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; color: #0F172A;">No matching labs found</p>
          <p style="font-size: 0.85rem;">Try searching for "servo", "CAD", "sonar", "LED", or "sensor".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(lab => {
      const isCurrent = (lab.slug === state.activeLab);
      const levelSvg = levelSvgs[lab.level] || '';
      return `
        <div class="explorer-lab-card ${isCurrent ? 'active' : ''}" data-lab="${lab.slug}">
          <div class="explorer-card-top">
            <span class="explorer-card-icon">${levelSvg}</span>
            <span class="explorer-card-badge ${lab.badge}">Grades ${lab.grade} • ${lab.level}</span>
          </div>
          <h4 class="explorer-card-title">${lab.title}</h4>
          <p class="explorer-card-summary">${lab.summary}</p>
          <div class="explorer-card-footer">
            <span class="explorer-card-lessons">4 Lessons</span>
            <button class="btn-open-lab">${isCurrent ? 'Active Lab ✓' : 'Open Lab →'}</button>
          </div>
        </div>
      `;
    }).join('');

    // Reattach card click listeners
    container.querySelectorAll('.explorer-lab-card').forEach(card => {
      card.addEventListener('click', () => {
        const labSlug = card.getAttribute('data-lab');
        if (labSlug) {
          switchLab(labSlug);
          closeLabExplorer();
        }
      });
    });
  }"""
    app_js = app_js[:old_explorer_fn.start()] + new_explorer_fn + app_js[old_explorer_fn.end():]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Updated js/app.js successfully!")
