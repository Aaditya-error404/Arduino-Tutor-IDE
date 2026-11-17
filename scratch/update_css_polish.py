# -*- coding: utf-8 -*-
"""
Update css/styles.css with UX & visual polish:
- Decluttered top bar styles (.header-util-group, .icon-only-btn, .sr-only)
- Tightened left column vertical spacing to keep code visible above the fold
- Distinct execution highlighting (Blue hover vs. Lime Green execution)
- 1.5px vector SVG header & icon styling
"""

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Add .sr-only and utility group styling
util_group_css = """
/* Screen reader and DOM-preserved element hiding */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Header Compact Utility Group (Guide, Sound, Reset) */
.header-util-group {
  display: flex;
  align-items: center;
  background: #F1F5F9;
  padding: 2px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
  gap: 2px;
}

.icon-only-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}
.icon-only-btn:hover {
  background: #FFFFFF;
  color: var(--primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.icon-only-btn.muted {
  color: var(--text-muted);
}
"""

if '.header-util-group' not in css:
    css = css.replace('/* Utility Action Buttons */', util_group_css + '\n/* Utility Action Buttons */')

# 2. Tighten Left Column for above-the-fold visibility
# Replace .panel-lesson padding and gap
css = css.replace(
    """padding: 16px 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;""",
    """padding: 10px 16px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;"""
)

# Tighten lesson-titles
css = css.replace(
    """  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-main);
  margin-bottom: 2px;""",
    """  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-main);
  margin: 0;
  line-height: 1.25;"""
)
css = css.replace(
    """  font-size: 12px;
  color: var(--text-dim);
  font-weight: 400;""",
    """  font-size: 11px;
  color: var(--text-dim);
  font-weight: 400;
  line-height: 1.2;"""
)

# Tighten coach-banner
css = css.replace(
    """  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-left: 3px solid var(--primary);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;""",
    """  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-left: 3px solid var(--primary);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;"""
)
css = css.replace(
    """  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);""",
    """  width: 20px;
  height: 20px;
  border-radius: 3px;"""
)
css = css.replace(
    """  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;""",
    """  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;"""
)
css = css.replace(
    """  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;""",
    """  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.35;
  margin: 0;"""
)

# Tighten #lesson-interactive-area & task-card
css = css.replace(
    """#lesson-interactive-area {
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
}""",
    """#lesson-interactive-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-card {
  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 8px 12px;
}
.task-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2px;
}"""
)

css = css.replace(
    """  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.45;""",
    """  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  line-height: 1.35;"""
)

css = css.replace(
    """  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;""",
    """  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 6px;"""
)

css = css.replace(
    """  border-radius: var(--radius-md);
  padding: 10px;
  min-height: 110px;""",
    """  border-radius: var(--radius-sm);
  padding: 6px 8px;
  min-height: 65px;"""
)

# Tighten step-advance-card
css = css.replace(
    """  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 12px 16px;""",
    """  background: #FFFFFF;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 6px 12px;"""
)
css = css.replace(
    """  width: 26px;
  height: 26px;""",
    """  width: 22px;
  height: 22px;"""
)
css = css.replace(
    """  height: 32px;
  padding: 0 14px;
  font-size: 12px;""",
    """  height: 26px;
  padding: 0 10px;
  font-size: 11px;"""
)

# 3. Code Translator Header SVG and Distinct Execution Highlight
old_translator_css = """/* Synchronized Hover & Active Line Highlighting */
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
}"""

new_translator_css = """/* Col Header Title with SVG */
.col-header-title {
  display: flex;
  align-items: center;
  gap: 6px;
}
.col-header-title svg {
  color: #94A3B8;
  flex-shrink: 0;
}

/* Synchronized Hover: Electric Blue (#0066FF) Left Border */
.code-row.sync-hover {
  background: rgba(0, 102, 255, 0.12) !important;
  border-left: 2px solid var(--primary) !important;
  color: #FFFFFF !important;
}

/* Active Simulation Step Execution: Lime Green (#65A30D) Left Border + Green Tint */
.code-row.executing {
  background: rgba(101, 163, 13, 0.22) !important;
  border-left: 3px solid var(--success) !important;
  color: #FFFFFF !important;
  font-weight: 600;
}
.code-row.executing .line-num {
  color: #BEF264 !important;
  font-weight: 700;
}

/* Static Highlight (Verified Target Step) */
.code-row.highlight {
  background: rgba(101, 163, 13, 0.15);
  border-left: 2px solid var(--success);
}"""

if old_translator_css in css:
    css = css.replace(old_translator_css, new_translator_css)
else:
    # Pattern replace
    css = re.sub(
        r'/\* Synchronized Hover & Active Line Highlighting \*/[\s\S]*?border-left-color: var\(--success\);\s*\}',
        new_translator_css,
        css
    )

# Tighten code translator rows
css = css.replace(
    """  max-height: 290px;
  overflow-y: auto;""",
    """  max-height: 360px;
  overflow-y: auto;"""
)
css = css.replace(
    """  min-height: 22px;""",
    """  min-height: 20px;
  font-size: 11px;
  line-height: 1.5;
  padding: 1px 8px;"""
)

# Modal card SVG icon
if '.level-icon-svg' not in css:
    css += """
/* Modal Grade Pills & Level Card SVGs */
.explorer-grade-pill {
  display: flex;
  align-items: center;
  gap: 6px;
}
.explorer-grade-pill svg {
  color: currentColor;
  flex-shrink: 0;
}
.explorer-card-icon .level-icon-svg {
  color: var(--primary);
  display: block;
}
.explorer-lab-card[data-lab="led"] .explorer-card-icon,
.explorer-lab-card[data-lab="servo"] .explorer-card-icon,
.explorer-lab-card[data-lab="button"] .explorer-card-icon,
.explorer-lab-card[data-lab="pot"] .explorer-card-icon,
.explorer-lab-card[data-lab="buzzer"] .explorer-card-icon,
.explorer-lab-card[data-lab="cad"] .explorer-card-icon,
.explorer-lab-card[data-lab="dmm"] .explorer-card-icon {
  color: var(--success);
}
"""

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated css/styles.css successfully!")
