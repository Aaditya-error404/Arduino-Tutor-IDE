import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update CSS version to v19
content = content.replace('href="css/styles.css?v=18"', 'href="css/styles.css?v=19"')

# 2. Modernize the header structure
old_header_target = """      <!-- Navigation Container: Grade Band Filter Bar + Filtered Lab Switcher -->
      <div class="header-nav-container">
        <!-- Grade Band Segmented Filter (Levels 1, 2, 3) -->
        <div class="grade-filter-bar" role="tablist" aria-label="Filter Labs by Grade Band">
          <button class="grade-tab-btn active" data-grade="all" id="grade-btn-all" title="View all 22 ATL labs across Grades 6 to 12">
            <span>🌟</span> All Grades (6–12) <span class="grade-count">22 Labs</span>
          </button>
          <button class="grade-tab-btn" data-grade="6-8" id="grade-btn-68" title="Level 1 (Grades 6–8): Foundations, Digital Logic & 3D CAD">
            <span>🌱</span> Grades 6–8 <span class="grade-count">Level 1 • 7 Labs</span>
          </button>
          <button class="grade-tab-btn" data-grade="9-10" id="grade-btn-910" title="Level 2 (Grades 9–10): Sensors, Robotics, Slicing & Automation">
            <span>⚙️</span> Grades 9–10 <span class="grade-count">Level 2 • 8 Labs</span>
          </button>
          <button class="grade-tab-btn" data-grade="11-12" id="grade-btn-1112" title="Level 3 (Grades 11–12): IoT, Mechatronics, Embedded Cloud & Industry 4.0">
            <span>🚀</span> Grades 11–12 <span class="grade-count">Level 3 • 7 Labs</span>
          </button>
        </div>

        <!-- Lab Switcher Segmented Control (Dynamically Filterable) -->
        <div class="lab-switcher" role="tablist" aria-label="Select Learning Lab">"""

new_header_middle = """      <!-- Center: Active Lab Explorer Trigger + Quick Grade Filter -->
      <div class="header-center-nav">
        <!-- Prominent Active Lab Pill & Explorer Trigger -->
        <button class="lab-explorer-trigger-btn" id="open-lab-explorer-btn" title="Explore all 22 ATL Labs across Levels 1, 2, and 3">
          <span class="trigger-icon">📚</span>
          <div class="trigger-text-group">
            <span class="trigger-tag">ACTIVE LAB</span>
            <span class="trigger-name" id="active-lab-name-pill">🦾 Servo Motor Lab</span>
          </div>
          <span class="trigger-action-pill">Change Lab ▾</span>
        </button>

        <!-- Quick Grade Band Filter (Levels 1, 2, 3) -->
        <div class="grade-filter-bar" role="tablist" aria-label="Filter Labs by Grade Band">
          <button class="grade-tab-btn active" data-grade="all" id="grade-btn-all" title="View all 22 ATL labs across Grades 6 to 12">
            <span>🌟</span> All (22)
          </button>
          <button class="grade-tab-btn" data-grade="6-8" id="grade-btn-68" title="Level 1 (Grades 6–8): Foundations, Digital Logic & 3D CAD">
            <span>🌱</span> 6–8 (7)
          </button>
          <button class="grade-tab-btn" data-grade="9-10" id="grade-btn-910" title="Level 2 (Grades 9–10): Sensors, Robotics, Slicing & Automation">
            <span>⚙️</span> 9–10 (8)
          </button>
          <button class="grade-tab-btn" data-grade="11-12" id="grade-btn-1112" title="Level 3 (Grades 11–12): IoT, Mechatronics & Displays">
            <span>🚀</span> 11–12 (7)
          </button>
        </div>
      </div>"""

if old_header_target in content:
    content = content.replace(old_header_target, new_header_middle + '\n    </div>\n\n    <!-- Secondary Strip: Quick Lab Pills Carousel -->\n    <div class="header-carousel-strip">\n      <div class="lab-switcher" role="tablist" aria-label="Select Learning Lab">')
    print("Replaced header middle successfully!")
else:
    print("WARNING: old_header_target not found!")

# 3. Clean up the end of the lab switcher and header actions
old_header_end = """          <button class="lab-switch-btn" id="lab-btn-iot" data-lab="iot" data-grade="11-12"
            title="ESP32 / NodeMCU IoT Wi-Fi telemetry deck, MQTT broker publish/subscribe, and cloud dashboard remote control">
            <span class="icon">☁️</span>
            <span>ESP32 IoT Cloud</span>
          </button>
        </div>
      </div>

      <!-- Utilities: Teacher Mode, Sound, Reset, Guide -->
      <div class="header-actions">
        <!-- Teacher Mode Switch -->
        <div class="teacher-toggle-wrapper" title="Show lesson plans, common student misconceptions, and teaching tips">
          <label class="toggle-switch" for="teacher-toggle">
            <input type="checkbox" id="teacher-toggle">
            <span class="toggle-slider"></span>
          </label>
          <label for="teacher-toggle" class="teacher-label">
            <span>🎓</span> Teacher Mode
          </label>
        </div>

        <!-- Teacher Master Plan Modal Button -->
        <button class="icon-btn" id="teacher-modal-btn" title="View Full Lesson Plan & Standards">
          <span>📋</span> Lesson Guide
        </button>

        <!-- Sound FX Button -->
        <button class="icon-btn" id="audio-toggle" title="Toggle Sound Effects">
          <span>🔊</span> <span class="label">Sound ON</span>
        </button>

        <!-- Reset Button -->
        <button class="icon-btn" id="reset-btn" title="Reset Current Lesson">
          <span>🔄</span> Reset
        </button>
      </div>
    </div>

    <!-- Sub-Header: Dedicated Lesson Ribbon for Uncluttered Navigation -->
    <div class="sub-header-bar">
      <div class="sub-header-inner">
        <div class="curriculum-badge-pill">
          <span class="status-indicator-live"></span>
          <span id="current-lab-label">Servo Motor Lab</span>
          <span class="divider">•</span>
          <span class="step-count">4 Sequential Lessons</span>
        </div>
        <nav class="lesson-nav-tabs" aria-label="Lesson Navigation" id="lesson-nav-tabs">
          <button class="lesson-tab active" data-lesson="0" id="tab-lesson-1">
            <span>🦾</span> 1. Muscle & Library
          </button>
          <button class="lesson-tab" data-lesson="1" id="tab-lesson-2">
            <span>🔌</span> 2. The 3 Wires
          </button>
          <button class="lesson-tab" data-lesson="2" id="tab-lesson-3">
            <span>📐</span> 3. Angle Commands
          </button>
          <button class="lesson-tab" data-lesson="3" id="tab-lesson-4">
            <span>🚀</span> 4. Sweep Sandbox
          </button>
        </nav>
      </div>
    </div>
  </header>"""

new_header_end = """          <button class="lab-switch-btn" id="lab-btn-iot" data-lab="iot" data-grade="11-12"
            title="ESP32 / NodeMCU IoT Wi-Fi telemetry deck, MQTT broker publish/subscribe, and cloud dashboard remote control">
            <span class="icon">☁️</span>
            <span>ESP32 IoT Cloud</span>
          </button>
      </div>
    </div>

    <!-- Sub-Header: Gamified Step Progression Ribbon & Progress Bar -->
    <div class="sub-header-bar">
      <div class="sub-header-inner">
        <div class="curriculum-badge-pill">
          <span class="status-indicator-live"></span>
          <span id="current-lab-label">Servo Motor Lab</span>
          <span class="divider">•</span>
          <span class="step-count" id="lesson-step-indicator">Step 1 of 4</span>
        </div>

        <!-- Step Progression Stepper: Prev, Step Tabs, Next -->
        <div class="lesson-nav-stepper">
          <button class="step-nav-btn prev-btn" id="prev-lesson-btn" title="Go to Previous Lesson" disabled>
            <span>◀</span> Prev
          </button>
          <nav class="lesson-nav-tabs" aria-label="Lesson Navigation" id="lesson-nav-tabs">
            <button class="lesson-tab active" data-lesson="0" id="tab-lesson-1">
              <span>🦾</span> 1. Muscle & Library
            </button>
            <button class="lesson-tab" data-lesson="1" id="tab-lesson-2">
              <span>🔌</span> 2. The 3 Wires
            </button>
            <button class="lesson-tab" data-lesson="2" id="tab-lesson-3">
              <span>📐</span> 3. Angle Commands
            </button>
            <button class="lesson-tab" data-lesson="3" id="tab-lesson-4">
              <span>🚀</span> 4. Sweep Sandbox
            </button>
          </nav>
          <button class="step-nav-btn next-btn" id="next-lesson-btn" title="Go to Next Lesson">
            Next <span>▶</span>
          </button>
        </div>
      </div>
      <!-- Visual Step Progress Bar -->
      <div class="lesson-progress-track">
        <div class="lesson-progress-fill" id="lesson-progress-bar" style="width: 25%;"></div>
      </div>
    </div>
  </header>"""

# Also ensure header-actions are kept in header-inner
actions_html = """      <!-- Utilities: Teacher Mode, Sound, Reset, Guide, Curriculum Hub -->
      <div class="header-actions">
        <!-- Teacher Mode Switch -->
        <div class="teacher-toggle-wrapper" title="Show lesson plans, common student misconceptions, and teaching tips">
          <label class="toggle-switch" for="teacher-toggle">
            <input type="checkbox" id="teacher-toggle">
            <span class="toggle-slider"></span>
          </label>
          <label for="teacher-toggle" class="teacher-label">
            <span>🎓</span> Teacher
          </label>
        </div>

        <!-- Teacher Master Plan Modal Button -->
        <button class="icon-btn" id="teacher-modal-btn" title="View Full Lesson Plan & Standards">
          <span>📋</span> Guide
        </button>

        <!-- Sound FX Button -->
        <button class="icon-btn" id="audio-toggle" title="Toggle Sound Effects">
          <span>🔊</span> <span class="label">Sound</span>
        </button>

        <!-- Reset Button -->
        <button class="icon-btn" id="reset-btn" title="Reset Current Lesson">
          <span>🔄</span> Reset
        </button>

        <!-- Curriculum Hub Link -->
        <a href="atl_curriculum_hub.html" target="_blank" class="icon-btn hub-btn" title="Open Full ATL Curriculum Hub in New Tab">
          <span>🌐</span> Hub
        </a>
      </div>
    </div>"""

# Check if actions need to be inserted before carousel strip
if old_header_end in content:
    content = content.replace(old_header_end, new_header_end)
    # Insert actions before carousel strip
    content = content.replace('    <!-- Secondary Strip: Quick Lab Pills Carousel -->', actions_html + '\n\n    <!-- Secondary Strip: Quick Lab Pills Carousel -->')
    print("Replaced header end & stepper successfully!")
else:
    print("WARNING: old_header_end not found!")

# 4. Add Step Advance card below lesson-interactive-area
old_interactive_area = """          <!-- Interactive Lesson Task Area (Sorting / Pin Claiming / Delay Tweaking) -->
          <div id="lesson-interactive-area">
            <!-- Populated by JS based on current lesson -->
          </div>"""

new_interactive_area = """          <!-- Interactive Lesson Task Area (Sorting / Pin Claiming / Delay Tweaking) -->
          <div id="lesson-interactive-area">
            <!-- Populated by JS based on current lesson -->
          </div>

          <!-- Step Progression & Next Lesson Card -->
          <div class="step-advance-card" id="step-advance-card">
            <div class="step-advance-inner">
              <div class="step-advance-status">
                <span class="step-spark-icon">✨</span>
                <div class="step-advance-texts">
                  <h4 id="step-advance-title">Step 1 in Progress</h4>
                  <p id="step-advance-desc">Test the controls above or run simulation to complete this step.</p>
                </div>
              </div>
              <button class="btn-step-advance" id="btn-advance-step" title="Proceed to next step">
                <span>Continue to Next Lesson</span> <span class="arrow">▶</span>
              </button>
            </div>
          </div>"""

if old_interactive_area in content:
    content = content.replace(old_interactive_area, new_interactive_area)
    print("Added step-advance-card successfully!")
else:
    print("WARNING: old_interactive_area not found!")

# 5. Add Lab Explorer Modal before teacher-modal
lab_explorer_modal_html = """  <!-- ====================================================================
       LAB EXPLORER MODAL: 22 LABS CAROUSEL & SEARCH (Grades 6–12)
       ==================================================================== -->
  <div class="modal-backdrop hidden" id="lab-explorer-modal">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-header-titles">
          <span class="icon">📚</span>
          <div>
            <h3>ATL Learning Labs Explorer</h3>
            <p>Select any of the 22 zero-jargon hands-on labs across Grades 6 to 12</p>
          </div>
        </div>
        <button class="modal-close-btn" id="close-lab-explorer">&times;</button>
      </div>

      <div class="explorer-filter-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="lab-search-input" placeholder="Search any sensor, CAD, or lab (e.g. servo, sonar, OLED, 3D CAD, RFID)..." autocomplete="off">
        </div>
        <div class="explorer-grade-tabs">
          <button class="explorer-grade-pill active" data-grade="all">🌟 All 22 Labs</button>
          <button class="explorer-grade-pill" data-grade="6-8">🌱 Level 1: Grades 6–8 (7 Labs)</button>
          <button class="explorer-grade-pill" data-grade="9-10">⚙️ Level 2: Grades 9–10 (8 Labs)</button>
          <button class="explorer-grade-pill" data-grade="11-12">🚀 Level 3: Grades 11–12 (7 Labs)</button>
        </div>
      </div>

      <div class="explorer-cards-grid" id="explorer-cards-grid">
        <!-- Rendered by JS or populated with 22 rich cards -->
      </div>

      <div class="modal-footer explorer-footer">
        <span class="explorer-footer-hint">💡 Tip: You can switch labs anytime using the top bar or URL parameter (?lab=...).</span>
        <button class="btn btn-primary" id="btn-close-explorer-footer">Back to Workspace</button>
      </div>
    </div>
  </div>\n\n"""

if '<div class="modal-backdrop hidden" id="teacher-modal">' in content:
    content = content.replace('<div class="modal-backdrop hidden" id="teacher-modal">', lab_explorer_modal_html + '  <div class="modal-backdrop hidden" id="teacher-modal">')
    print("Added lab-explorer-modal successfully!")
else:
    print("WARNING: teacher-modal not found!")

# 6. Update Script tags to v19
content = content.replace('src="js/audio.js?v=18"', 'src="js/audio.js?v=19"')
content = content.replace('src="js/lessons.js?v=18"', 'src="js/lessons.js?v=19"')
content = content.replace('src="js/simulation.js?v=18"', 'src="js/simulation.js?v=19"')
content = content.replace('src="js/app.js?v=18"', 'src="js/app.js?v=19"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html successfully!")
