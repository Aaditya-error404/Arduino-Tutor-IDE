# -*- coding: utf-8 -*-
"""
Generate crisp, high-craft, zero-glassmorphism styles.css
Inspired by Linear, Codecademy, and Wokwi.
"""

clean_tokens_and_layout = """/* ==========================================================================
   SparkByte Studio: Zero-Jargon Physical Computing, 3D CAD & IoT Workbench
   Design Philosophy: Crisp, High-Craft EdTech Workbench (Linear / Codecademy / Wokwi)
   ========================================================================== */

:root {
  /* Surface Tokens (Clean High-Contrast Light Mode) */
  --bg-app: #F8FAFC;
  --bg-card: #FFFFFF;
  --border-card: #E2E8F0;
  --border-subtle: #F1F5F9;

  /* Dark Workbench Surfaces (Code Translator & Live Hardware Stages) */
  --bg-dark: #0F172A;
  --bg-dark-surface: #0B1120;
  --bg-dark-card: #1E293B;
  --border-dark: #1E293B;
  --border-dark-highlight: #334155;

  /* Primary Brand & Active Navigation (Electric Blue) */
  --primary: #0066FF;
  --primary-hover: #0052CC;
  --primary-tint: #EFF6FF;
  --primary-border: #BFDBFE;

  /* Verified & Completion State (Lime Green) */
  --success: #65A30D;
  --success-text: #3F6212;
  --success-bg: #ECFCCB;
  --success-border: #BEF264;
  --success-hover: #4D7C0F;

  /* Pedagogical & Misconception Accent (Amber) */
  --amber: #F59E0B;
  --amber-text: #92400E;
  --amber-bg: #FEF3C7;
  --amber-border: #FDE68A;

  /* Danger & Stop Accent (Crimson) */
  --danger: #EF4444;
  --danger-hover: #DC2626;
  --danger-bg: #FEE2E2;
  --danger-border: #FECACA;

  /* Editorial & Code Typography */
  --text-main: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --text-dim: #64748B;
  --text-on-dark: #F8FAFC;
  --text-dim-on-dark: #94A3B8;

  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Crisp Geometric Radii */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Subtle Hairline Drop Shadow for Floating Modals Only (Layout Cards have 0 shadows) */
  --shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

/* Base Reset & Box Sizing */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: var(--bg-app);
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

button, input, select, textarea {
  font-family: inherit;
}

/* Custom Slim Scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

.panel-simulation ::-webkit-scrollbar-thumb,
.code-translator-wrapper ::-webkit-scrollbar-thumb {
  background: #334155;
}
.panel-simulation ::-webkit-scrollbar-thumb:hover,
.code-translator-wrapper ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* Utility Hidden */
.hidden {
  display: none !important;
}

/* ==========================================================================
   TEACHER MODE SUBTLE CALLOUT BANNER
   ========================================================================== */
.teacher-mode-banner {
  background: #FFFBEB;
  border-bottom: 1px solid var(--amber-border);
  border-left: 4px solid var(--amber);
  color: var(--amber-text);
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 101;
}

/* ==========================================================================
   SLIM 52px TOP UTILITY BAR
   ========================================================================== */
.app-header {
  height: 52px;
  max-height: 52px;
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-card);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
}

.header-inner {
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Header Left: Wordmark & Active Lab Pill */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--text-main);
  user-select: none;
}

.brand-icon {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-main);
}
.brand-title .brand-sub {
  font-weight: 500;
  color: var(--text-dim);
}

.lab-explorer-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.15s ease;
}
.lab-explorer-trigger-btn:hover {
  background: var(--bg-app);
  border-color: #CBD5E1;
}
.trigger-icon-svg {
  color: var(--primary);
  flex-shrink: 0;
}
.trigger-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.trigger-chevron-svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Header Center: 4-Step Stepper & Progress Indicator */
.header-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lesson-nav-stepper {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #F1F5F9;
  padding: 3px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
}

.step-nav-btn {
  height: 26px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}
.step-nav-btn:hover:not(:disabled) {
  background: var(--primary-tint);
  border-color: var(--primary-border);
  color: var(--primary);
}
.step-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  background: #F8FAFC;
}

.lesson-nav-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
}

.lesson-tab {
  height: 26px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-dim);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.lesson-tab:hover:not(.active) {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.6);
}
.lesson-tab.active {
  background: #FFFFFF;
  color: var(--primary);
  font-weight: 600;
  border: 1px solid var(--border-card);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.tab-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted);
}
.lesson-tab.active .tab-dot {
  background: var(--primary);
}

.stepper-progress-box {
  display: flex;
  align-items: center;
  gap: 8px;
}
.step-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.lesson-progress-track {
  width: 60px;
  height: 4px;
  background: #E2E8F0;
  border-radius: 2px;
  overflow: hidden;
}
.lesson-progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.25s ease;
}

/* Header Right: Grade Filter Pills, Teacher Mode, Sound, Reset, Guide, Hub */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.grade-filter-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #F1F5F9;
  padding: 2px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
}
.grade-tab-btn {
  height: 26px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-dim);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}
.grade-tab-btn:hover:not(.active) {
  color: var(--text-main);
}
.grade-tab-btn.active {
  background: var(--primary);
  color: #FFFFFF;
  font-weight: 600;
}

/* Teacher Toggle Switch */
.teacher-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
}
.toggle-switch {
  position: relative;
  width: 28px;
  height: 16px;
  display: inline-block;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #CBD5E1;
  border-radius: 16px;
  transition: 0.2s;
}
.toggle-slider::before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: 0.2s;
}
input:checked + .toggle-slider {
  background: var(--primary);
}
input:checked + .toggle-slider::before {
  transform: translateX(12px);
}
.teacher-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
}

/* Utility Action Buttons */
.icon-btn {
  height: 30px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.icon-btn:hover {
  background: var(--bg-app);
  border-color: #CBD5E1;
  color: var(--text-main);
}
.icon-btn.hub-btn {
  background: var(--primary-tint);
  border-color: var(--primary-border);
  color: var(--primary);
}
.icon-btn.hub-btn:hover {
  background: #DBEAFE;
}

/* ==========================================================================
   BALANCED SPLIT-PANE WORKSPACE LAYOUT
   ========================================================================== */
.main-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 52px);
  max-height: calc(100vh - 52px);
  background: var(--bg-app);
  overflow: hidden;
}

/* ==========================================================================
   LEFT COLUMN: LESSON DESK & CODE TRANSLATOR
   ========================================================================== */
.panel-lesson {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--bg-app);
  border-right: 1px solid var(--border-card);
}

.lesson-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.lesson-titles {
  flex: 1;
}
.lesson-titles h2 {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-main);
  margin-bottom: 2px;
}
.lesson-titles .subtitle {
  font-size: 12px;
  color: var(--text-dim);
  font-weight: 400;
}

.desk-view-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #F1F5F9;
  padding: 2px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
}
.desk-view-tab {
  height: 24px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-dim);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}
.desk-view-tab.active {
  background: #FFFFFF;
  color: var(--primary);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Coach Sparky Banner */
.coach-banner {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-left: 3px solid var(--primary);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.mascot-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--primary-tint);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.coach-content {
  flex: 1;
}
.coach-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.coach-header h3 {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-main);
}
.coach-tag {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--primary-tint);
  color: var(--primary);
  border: 1px solid var(--primary-border);
}
.mascot-bubble {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Interactive Lesson Task Area */
#lesson-interactive-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
}
.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}
.step-num {
  font-size: 10px;
  font-weight: 700;
  background: var(--primary-tint);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  padding: 1px 6px;
  border-radius: 999px;
}
.task-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.45;
}

/* Sorter Zones */
.sorter-zones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.sorter-zone {
  border-radius: var(--radius-md);
  padding: 10px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
}
.zone-setup {
  background: #F8FAFC;
  border: 1.5px dashed #CBD5E1;
}
.zone-loop {
  background: #F8FAFC;
  border: 1.5px dashed #CBD5E1;
}
.zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-card);
}
.zone-header small {
  color: var(--text-dim);
  font-size: 10px;
  font-weight: normal;
}
.zone-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

/* Step Advance Card */
.step-advance-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  transition: all 0.2s ease;
}
.step-advance-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.step-advance-status {
  display: flex;
  align-items: center;
  gap: 10px;
}
.step-spark-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--primary-tint);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-advance-texts h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}
.step-advance-desc {
  font-size: 11px;
  color: var(--text-dim);
}
.btn-step-advance {
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  background: var(--success);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease;
  white-space: nowrap;
}
.btn-step-advance:hover {
  background: var(--success-hover);
}

/* ==========================================================================
   DUAL ENGLISH-TO-C++ TRANSLATOR TABLE
   ========================================================================== */
.code-translator-wrapper {
  background: var(--bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.translator-top-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-dark-surface);
  border-bottom: 1px solid var(--border-dark);
}

.col-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim-on-dark);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-header.human {
  border-right: 1px solid var(--border-dark);
}
.col-tag {
  font-size: 9px;
  font-weight: 500;
  font-family: var(--font-mono);
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--bg-dark-card);
  color: #94A3B8;
  border: 1px solid var(--border-dark-highlight);
}

.translator-split-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-height: 290px;
  overflow-y: auto;
}

.translator-column {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.6;
}
.translator-column.human {
  border-right: 1px solid var(--border-dark);
  color: #CBD5E1;
}
.translator-column.cpp {
  color: var(--text-on-dark);
}

.code-row {
  display: flex;
  align-items: flex-start;
  padding: 2px 8px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: background 0.1s ease;
  min-height: 22px;
}
.line-num {
  width: 24px;
  color: #475569;
  font-size: 10px;
  user-select: none;
  text-align: right;
  margin-right: 8px;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.line-content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Indent utility */
.indent-1 { padding-left: 1rem; }
.indent-2 { padding-left: 2rem; }
.indent-3 { padding-left: 3rem; }

/* Synchronized Hover & Active Line Highlighting */
.code-row.sync-hover {
  background: rgba(0, 102, 255, 0.15);
}
.code-row.executing {
  background: rgba(0, 102, 255, 0.28);
  border-left-color: var(--primary);
  color: #FFFFFF;
  font-weight: 500;
}
.code-row.highlight {
  background: rgba(101, 163, 13, 0.22);
  border-left-color: var(--success);
}

/* C++ Syntax Highlighting */
.cpp-kw { color: #38BDF8; font-weight: 600; }
.cpp-fn { color: #818CF8; }
.cpp-val { color: #F59E0B; }
.cpp-str { color: #34D399; }
.cpp-comment { color: #64748B; font-style: italic; }

/* Concept & Analogy Card */
.concept-intro-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 12px;
}
.concept-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 4px;
  display: inline-block;
}
.concept-intro-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}
.concept-intro-card p {
  font-size: 12px;
  color: var(--text-secondary);
}

.analogy-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.jargon-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.jargon-pill {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 11px;
}
.jargon-pill strong {
  color: var(--primary);
  display: block;
  margin-bottom: 2px;
}

/* ==========================================================================
   RIGHT COLUMN: LIVE HARDWARE SIMULATION & OSCILLOSCOPE
   ========================================================================== */
.panel-simulation {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 18px 32px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-dark-surface);
}

/* Docked Hardware Simulation Toolbar */
.sim-controls-card {
  background: var(--bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  padding: 10px 14px;
}

.sim-buttons-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.sim-btn-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-simulate {
  height: 32px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  background: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.btn-simulate:hover {
  background: var(--primary-hover);
}
.btn-simulate.running {
  background: var(--danger);
}
.btn-simulate.running:hover {
  background: var(--danger-hover);
}

.btn-control {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg-dark-card);
  color: #F1F5F9;
  border: 1px solid var(--border-dark-highlight);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
}
.btn-control:hover {
  background: #334155;
}

.speed-control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-dim-on-dark);
}
.speed-select {
  height: 30px;
  padding: 0 8px;
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--bg-dark-card);
  color: #F1F5F9;
  border: 1px solid var(--border-dark-highlight);
  border-radius: var(--radius-sm);
  outline: none;
}

.sim-ticker-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--border-dark);
  font-size: 11px;
}
.ticker-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim-on-dark);
  font-family: var(--font-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  flex-shrink: 0;
}
.cycle-badge {
  background: var(--bg-dark-card);
  color: #38BDF8;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  border: 1px solid var(--border-dark-highlight);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* Circuit Visual Stage */
.circuit-stage {
  background: var(--bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  padding: 12px;
  overflow: hidden;
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circuit-canvas-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circuit-svg-container {
  width: 100%;
  max-width: 680px;
}
.circuit-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Dual-Channel Oscilloscope & Signal HUD */
.scope-container {
  background: var(--bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  padding: 12px;
}
.scope-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.scope-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.scope-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38BDF8;
}
.scope-title {
  font-size: 11px;
  font-weight: 600;
  color: #E2E8F0;
}
.scope-status {
  font-size: 11px;
  font-family: var(--font-mono);
  color: #38BDF8;
  font-variant-numeric: tabular-nums;
}
#scope-canvas {
  width: 100%;
  height: 90px;
  background: var(--bg-dark-surface);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  display: block;
}

/* ==========================================================================
   LAB EXPLORER MODAL (22 LABS MATRIX)
   ========================================================================== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  max-width: 980px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-modal);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-header-titles {
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal-header-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--primary-tint);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-header-titles h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}
.modal-header-titles p {
  font-size: 11px;
  color: var(--text-dim);
}

.modal-close-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-card);
  background: #FFFFFF;
  border-radius: var(--radius-sm);
  font-size: 18px;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close-btn:hover {
  background: var(--bg-app);
}

.explorer-filter-toolbar {
  padding: 12px 20px;
  background: #F8FAFC;
  border-bottom: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.search-box {
  position: relative;
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
}
.search-box .search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}
#lab-search-input {
  width: 100%;
  height: 34px;
  padding: 0 12px 0 32px;
  font-size: 12px;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: var(--radius-md);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.15s ease;
}
#lab-search-input:focus {
  border-color: var(--primary);
}

.explorer-grade-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}
.explorer-grade-pill {
  height: 30px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 500;
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}
.explorer-grade-pill:hover {
  border-color: #CBD5E1;
  color: var(--text-main);
}
.explorer-grade-pill.active {
  background: var(--primary);
  color: #FFFFFF;
  border-color: var(--primary);
  font-weight: 600;
}

.explorer-cards-grid {
  padding: 16px 20px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  flex: 1;
}

.explorer-lab-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.explorer-lab-card:hover {
  border-color: var(--primary);
  background: #FAFCFF;
  transform: translateY(-1px);
}
.explorer-lab-card.active {
  border-color: var(--primary);
  background: var(--primary-tint);
}

.explorer-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.explorer-card-icon {
  font-size: 20px;
}
.explorer-card-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  background: #F1F5F9;
  color: var(--text-secondary);
  border: 1px solid var(--border-card);
}
.explorer-card-badge.badge-l1 {
  background: var(--success-bg);
  color: var(--success-text);
  border-color: var(--success-border);
}
.explorer-card-badge.badge-l2 {
  background: var(--amber-bg);
  color: var(--amber-text);
  border-color: var(--amber-border);
}
.explorer-card-badge.badge-l3 {
  background: var(--primary-tint);
  color: #1E40AF;
  border-color: var(--primary-border);
}

.explorer-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}
.explorer-card-summary {
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.45;
  flex: 1;
}

.explorer-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
  font-size: 11px;
}
.explorer-card-lessons {
  color: var(--text-dim);
  font-size: 10px;
  font-family: var(--font-mono);
}
.btn-open-lab {
  height: 24px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.explorer-lab-card.active .btn-open-lab {
  background: var(--success);
}

.explorer-footer {
  padding: 12px 20px;
  background: #F8FAFC;
  border-top: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-dim);
}
#btn-close-explorer-footer {
  height: 30px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  background: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

/* Teacher Master Plan Modal */
#teacher-modal .modal-card {
  max-width: 720px;
}
#teacher-modal-content {
  padding: 16px 20px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.6;
}
#teacher-modal-content h4 {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin: 12px 0 4px 0;
}
#teacher-modal-content ul {
  padding-left: 18px;
  color: var(--text-secondary);
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-card);
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  height: 30px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  background: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

/* Accessibility hidden lab switcher (preserves 22 buttons in DOM for tests & logic) */
.sr-only-switcher,
.lab-switcher.sr-only-switcher {
  display: none !important;
}
"""

with open('css/styles.css', 'r', encoding='utf-8') as f:
    existing_css = f.read()

# Extract the hardware-specific styling (from SERVO MOTOR to end of hardware components)
# In existing_css, lines 1937 to 3171:
hw_start_marker = "/* ==========================================================================\n   SERVO MOTOR SVG & CIRCUIT STYLING"
hw_end_marker = "/* ==========================================================================\n   SIMPLIFIED & MODERNIZED UI REDESIGN"

if hw_start_marker in existing_css and hw_end_marker in existing_css:
    hw_css = existing_css[existing_css.index(hw_start_marker):existing_css.index(hw_end_marker)]
else:
    # Fallback to lines if markers vary slightly
    lines = existing_css.splitlines(True)
    hw_css = "".join(lines[1936:3172])

full_css = clean_tokens_and_layout + "\n" + hw_css

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(full_css)

print(f"Successfully generated new css/styles.css ({len(full_css.splitlines())} lines)")
