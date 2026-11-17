# -*- coding: utf-8 -*-
"""
Assemble crisp, high-craft index.html with slim 52px top bar and balanced split-pane workspace.
"""

with open('index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

lines = orig_html.splitlines(True)

# 1. Extract circuit-stage exactly (starts at <div class="circuit-stage">, ends before </section>)
start_cs = None
end_cs = None
for i, line in enumerate(lines):
    if '<div class="circuit-stage">' in line and start_cs is None:
        start_cs = i
    if '</section>' in line and start_cs is not None and end_cs is None and i > start_cs:
        end_cs = i

circuit_stage_html = "".join(lines[start_cs:end_cs])
print(f"Extracted circuit stage: lines {start_cs+1} to {end_cs} ({len(circuit_stage_html.splitlines())} lines)")

# 2. Extract the 22 lab-switch-btn elements
switcher_start = None
switcher_end = None
for i, line in enumerate(lines):
    if '<div class="lab-switcher"' in line and switcher_start is None:
        switcher_start = i
    if switcher_start is not None and switcher_end is None and '</div>' in line and i > switcher_start + 10:
        switcher_end = i

lab_switcher_buttons_html = "".join(lines[switcher_start+1:switcher_end])
print(f"Extracted lab switcher buttons: lines {switcher_start+2} to {switcher_end} ({len(lab_switcher_buttons_html.splitlines())} lines)")

new_index_template = f"""<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SparkByte Studio | Zero-Jargon Arduino, 3D CAD & IoT Workbench</title>
  <meta name="description"
    content="A crisp, high-craft Arduino Uno, 3D CAD, and C++ code translator virtual lab designed for students in Grades 6-12 and STEM educators.">

  <!-- Cache Control Meta Tags to Force Fresh Load -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">

  <!-- Crisp Typography: Inter (Sans) + JetBrains Mono (Code/Hardware Telemetry) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
    rel="stylesheet">

  <link rel="icon"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  <link rel="stylesheet" href="css/styles.css?v=23">
</head>

<body>

  <!-- Teacher Mode Subtle Callout Banner (Visible when Teacher Mode is ON) -->
  <div class="teacher-mode-banner" id="teacher-banner" style="display: none;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
    <span><strong>TEACHER MODE ACTIVE:</strong> Pedagogical notes, misconception alerts, and classroom discussion prompts are highlighted.</span>
  </div>

  <!-- Slim 52px Top Utility Bar -->
  <header class="app-header">
    <div class="header-inner">
      <!-- Left: Wordmark + Active Lab Selector Pill -->
      <div class="header-left">
        <a href="/" class="brand-link" title="SparkByte Studio">
          <div class="brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span class="brand-title">SparkByte <span class="brand-sub">Studio</span></span>
        </a>

        <!-- Active Lab Selector Pill (Opens Lab Explorer Modal) -->
        <button class="lab-explorer-trigger-btn" id="open-lab-explorer-btn" title="Explore all 22 ATL Labs across Levels 1, 2, and 3">
          <svg class="trigger-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="trigger-name" id="active-lab-name-pill">🦾 Servo Motor Lab</span>
          <svg class="trigger-chevron-svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      <!-- Center: Compact 4-Step Stepper & Progress Indicator -->
      <div class="header-center">
        <div class="lesson-nav-stepper">
          <button class="step-nav-btn prev-btn" id="prev-lesson-btn" title="Go to Previous Lesson" disabled>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Prev</span>
          </button>

          <nav class="lesson-nav-tabs" aria-label="Lesson Navigation" id="lesson-nav-tabs">
            <button class="lesson-tab active" data-lesson="0" id="tab-lesson-1">
              <span class="tab-dot"></span> 1. Muscle &amp; Library
            </button>
            <button class="lesson-tab" data-lesson="1" id="tab-lesson-2">
              <span class="tab-dot"></span> 2. The 3 Wires
            </button>
            <button class="lesson-tab" data-lesson="2" id="tab-lesson-3">
              <span class="tab-dot"></span> 3. Angle Commands
            </button>
            <button class="lesson-tab" data-lesson="3" id="tab-lesson-4">
              <span class="tab-dot"></span> 4. Sweep Sandbox
            </button>
          </nav>

          <button class="step-nav-btn next-btn" id="next-lesson-btn" title="Go to Next Lesson">
            <span>Next</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Inline Step Count & Progress Bar -->
        <div class="stepper-progress-box">
          <span class="step-count" id="lesson-step-indicator">Step 1 of 4</span>
          <div class="lesson-progress-track">
            <div class="lesson-progress-fill" id="lesson-progress-bar" style="width: 25%;"></div>
          </div>
        </div>
      </div>

      <!-- Right: Grade Band Filter, Teacher Mode, Audio, Guide, Hub -->
      <div class="header-right">
        <!-- Grade Band Filter Tabs -->
        <div class="grade-filter-bar" role="tablist" aria-label="Filter Labs by Grade Band">
          <button class="grade-tab-btn active" data-grade="all" id="grade-btn-all" title="View all 22 ATL labs across Grades 6 to 12">All</button>
          <button class="grade-tab-btn" data-grade="6-8" id="grade-btn-68" title="Level 1 (Grades 6–8): Foundations &amp; 3D CAD">6–8</button>
          <button class="grade-tab-btn" data-grade="9-10" id="grade-btn-910" title="Level 2 (Grades 9–10): Sensors &amp; Automation">9–10</button>
          <button class="grade-tab-btn" data-grade="11-12" id="grade-btn-1112" title="Level 3 (Grades 11–12): IoT, Mechatronics &amp; Displays">11–12</button>
        </div>

        <!-- Teacher Mode Switch -->
        <div class="teacher-toggle-wrapper" title="Show pedagogical notes and teaching tips">
          <label class="toggle-switch" for="teacher-toggle">
            <input type="checkbox" id="teacher-toggle">
            <span class="toggle-slider"></span>
          </label>
          <label for="teacher-toggle" class="teacher-label">Teacher</label>
        </div>

        <!-- Utilities -->
        <button class="icon-btn" id="teacher-modal-btn" title="View Full Lesson Plan &amp; Standards">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          <span>Guide</span>
        </button>

        <button class="icon-btn" id="audio-toggle" title="Toggle Sound Effects">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <span class="label">Sound</span>
        </button>

        <button class="icon-btn" id="reset-btn" title="Reset Current Lesson">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          <span>Reset</span>
        </button>

        <a href="atl_curriculum_hub.html" target="_blank" class="icon-btn hub-btn" title="Open Full ATL Curriculum Hub in New Tab">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span>Hub</span>
        </a>
      </div>
    </div>

    <!-- Preserved Accessible Lab Switcher container (Keeps all 22 buttons in DOM for tests & logic) -->
    <div class="lab-switcher sr-only-switcher" role="tablist" aria-label="Select Learning Lab">
{lab_switcher_buttons_html}
    </div>
    <span id="current-lab-label" style="display: none;">Servo Motor Lab</span>
    <span id="grade-badge" style="display: none;">Grades 6–12 • ATL Lab</span>
    <span id="app-tagline" style="display: none;">Zero-Jargon Interactive Arduino, C++, 3D CAD &amp; IoT Studio</span>
  </header>

  <!-- Balanced Split-Pane Workspace -->
  <main class="main-workspace">

    <!-- ====================================================================
         LEFT COLUMN: THE LESSON DESK & DUAL ENGLISH ↔ C++ TRANSLATOR
         ==================================================================== -->
    <section class="panel panel-lesson" aria-label="Code Translator and Interactive Lessons">
      <div class="lesson-panel-header">
        <div class="lesson-titles">
          <h2 id="lesson-title">Lesson 1: The Brain &amp; The Routine</h2>
          <span class="subtitle" id="lesson-subtitle">How does an Arduino wake up and spend its day?</span>
        </div>

        <!-- Segmented Desk View Switcher -->
        <div class="desk-view-tabs" role="tablist">
          <button class="desk-view-tab active" id="view-tab-lab" data-view="lab"
            title="Interactive Step Challenge &amp; Code Simulator">
            <span>Lab &amp; Code</span>
          </button>
          <button class="desk-view-tab" id="view-tab-concept" data-view="concept"
            title="Real-World Analogies &amp; Jargon Definitions">
            <span>Concept</span>
          </button>
        </div>
      </div>

      <!-- VIEW 1: LAB & CODE WORKSPACE -->
      <div class="desk-view-content active" id="view-content-lab">
        <!-- Coach Sparky Mascot Banner -->
        <div class="coach-banner">
          <div class="mascot-avatar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <circle cx="9" cy="9" r="1.5"></circle>
              <circle cx="15" cy="9" r="1.5"></circle>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="coach-content">
            <div class="coach-header">
              <h3>Coach Sparky</h3>
              <span class="coach-tag">Mission</span>
            </div>
            <p class="mascot-bubble" id="mascot-bubble">
              Hey there, Future Engineer! Meet your Arduino board.
            </p>
          </div>
        </div>

        <!-- Interactive Lesson Task Area -->
        <div id="lesson-interactive-area">
          <!-- Populated by JS based on current lesson -->
        </div>

        <!-- Step Advance Card -->
        <div class="step-advance-card" id="step-advance-card">
          <div class="step-advance-inner">
            <div class="step-advance-status">
              <span class="step-spark-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <div class="step-advance-texts">
                <h4 id="step-advance-title">Step 1 in Progress</h4>
                <p id="step-advance-desc">Test the controls above or run simulation to complete this step.</p>
              </div>
            </div>
            <button class="btn-step-advance" id="btn-advance-step" title="Proceed to next step">
              <span>Continue to Next Lesson</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- The Code Translator: Unified Side-by-Side Table -->
        <div class="code-translator-wrapper">
          <div class="translator-top-bar">
            <div class="col-header human">
              <span>Plain English</span>
              <span class="col-tag">What We Want</span>
            </div>
            <div class="col-header cpp">
              <span>Arduino C++</span>
              <span class="col-tag">Robot Code</span>
            </div>
          </div>
          <div class="translator-split-body">
            <!-- Plain English Side -->
            <div class="translator-column human" id="plain-english-code">
              <!-- Dynamically rendered rows -->
            </div>
            <!-- Exact C++ Side -->
            <div class="translator-column cpp" id="cpp-code">
              <!-- Dynamically rendered rows -->
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: CONCEPT & REAL-WORLD ANALOGY -->
      <div class="desk-view-content" id="view-content-concept" style="display: none;">
        <div class="concept-intro-card">
          <span class="concept-badge">Mental Model</span>
          <h3>Intuitive Electronics Without Jargon</h3>
          <p>Read the everyday metaphor and phonetic jargon busters before jumping into code!</p>
        </div>

        <!-- Real-World Analogy Card -->
        <div class="analogy-card" id="analogy-card">
          <!-- Populated by JS -->
        </div>

        <!-- Jargon Buster Pills -->
        <div class="jargon-pills" id="jargon-pills">
          <!-- Populated by JS -->
        </div>
      </div>
    </section>

    <!-- ====================================================================
         RIGHT COLUMN: LIVE HARDWARE SIMULATION & DUAL-CHANNEL OSCILLOSCOPE
         ==================================================================== -->
    <section class="panel panel-simulation" aria-label="Virtual Circuit Stage and Controls">

      <!-- Docked Hardware Simulation Controls Toolbar -->
      <div class="sim-controls-card">
        <div class="sim-buttons-row">
          <div class="sim-btn-group">
            <button class="btn-simulate" id="btn-simulate" title="Run virtual hardware loop">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Start Simulation</span>
            </button>
            <button class="btn-control" id="btn-pause" title="Pause simulation loop">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              <span>Pause</span>
            </button>
            <button class="btn-control" id="btn-reset-sim" title="Reset circuit state">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2"></rect>
              </svg>
              <span>Reset</span>
            </button>
          </div>

          <!-- Speed Control -->
          <div class="speed-control-group">
            <label for="speed-select">Speed:</label>
            <select id="speed-select" class="speed-select">
              <option value="0.5">0.5x Slow</option>
              <option value="1.0" selected>1.0x Realtime</option>
              <option value="2.0">2.0x Fast</option>
            </select>
          </div>
        </div>

        <!-- Live Step Execution Ticker -->
        <div class="sim-ticker-bar">
          <div class="ticker-status">
            <span class="ticker-dot"></span>
            <span id="sim-status-text">Circuit idle. Press Start Simulation to test!</span>
          </div>
          <span class="cycle-badge" id="loop-cycle-badge">Loop Cycles: 0</span>
        </div>
      </div>

      <!-- Circuit Visual Stage (All 17 Hardware Views + CAD + DMM + Slicer) -->
{circuit_stage_html}

      <!-- Dual-Channel Oscilloscope & Signal HUD -->
      <div class="scope-container">
        <div class="scope-header">
          <div class="scope-header-left">
            <span class="scope-live-dot"></span>
            <span class="scope-title" id="scope-title">CH1: Pin 9 PWM Signal • CH2: Micro Servo Position Feedback</span>
          </div>
          <span class="scope-status" id="scope-status">50 Hz • 1.50 ms Pulse • 0.0°/s</span>
        </div>
        <canvas id="scope-canvas" width="600" height="90"></canvas>
      </div>

    </section>

  </main>

  <!-- ====================================================================
       LAB EXPLORER MODAL: 22 LABS MATRIX & INSTANT SEARCH (Grades 6–12)
       ==================================================================== -->
  <div class="modal-backdrop hidden" id="lab-explorer-modal">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-header-titles">
          <div class="modal-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div>
            <h3>ATL Learning Labs Explorer</h3>
            <p>Select any of the 22 zero-jargon hands-on physical computing, CAD, and IoT labs across Grades 6 to 12</p>
          </div>
        </div>
        <button class="modal-close-btn" id="close-lab-explorer" aria-label="Close Explorer">&times;</button>
      </div>

      <div class="explorer-filter-toolbar">
        <div class="search-box">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="lab-search-input" placeholder="Search any sensor, CAD, or lab (e.g. servo, sonar, OLED, 3D CAD, RFID)..." autocomplete="off">
        </div>
        <div class="explorer-grade-tabs">
          <button class="explorer-grade-pill active" data-grade="all">All (22 Labs)</button>
          <button class="explorer-grade-pill" data-grade="6-8">Level 1: Grades 6–8 (7 Labs)</button>
          <button class="explorer-grade-pill" data-grade="9-10">Level 2: Grades 9–10 (8 Labs)</button>
          <button class="explorer-grade-pill" data-grade="11-12">Level 3: Grades 11–12 (7 Labs)</button>
        </div>
      </div>

      <div class="explorer-cards-grid" id="explorer-cards-grid">
        <!-- Rendered dynamically by JS -->
      </div>

      <div class="modal-footer explorer-footer">
        <span class="explorer-footer-hint">Tip: You can switch labs anytime using the top bar or URL parameter (?lab=...).</span>
        <button class="btn btn-primary" id="btn-close-explorer-footer">Back to Workspace</button>
      </div>
    </div>
  </div>

  <!-- TEACHER MASTER PLAN MODAL -->
  <div class="modal-backdrop hidden" id="teacher-modal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-header-titles">
          <div class="modal-header-icon" style="background: #FEF3C7; color: #92400E;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div>
            <h3>Teacher Master Plan &amp; Pedagogical Guide</h3>
            <p>Curriculum standards, misconception busters, and classroom strategies</p>
          </div>
        </div>
        <button class="modal-close-btn" id="close-teacher-modal" aria-label="Close Guide">&times;</button>
      </div>
      <div class="modal-body" id="teacher-modal-content">
        <!-- Rendered by JS -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="document.getElementById('teacher-modal').classList.add('hidden')">
          Close Guide
        </button>
      </div>
    </div>
  </div>

  <!-- App Scripts (Cache-Busted v23) -->
  <script src="js/audio.js?v=23"></script>
  <script src="js/lessons.js?v=23"></script>
  <script src="js/simulation.js?v=23"></script>
  <script src="js/app.js?v=23"></script>

</body>

</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index_template)

print(f"Successfully generated new index.html ({len(new_index_template.splitlines())} lines)")
