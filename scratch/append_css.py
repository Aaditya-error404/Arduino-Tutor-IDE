new_css = """

/* ==========================================================================
   SIMPLIFIED & MODERNIZED UI REDESIGN (Khan Academy / Scratch / Duolingo Inspired)
   ========================================================================== */

/* Header Center Navigation & Lab Explorer Trigger */
.header-center-nav {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
  justify-content: center;
}

.lab-explorer-trigger-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(34, 211, 238, 0.35);
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.lab-explorer-trigger-btn:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.3);
  transform: translateY(-1px);
}

.lab-explorer-trigger-btn .trigger-icon {
  font-size: 1.25rem;
}

.lab-explorer-trigger-btn .trigger-text-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.lab-explorer-trigger-btn .trigger-tag {
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--accent-cyan);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lab-explorer-trigger-btn .trigger-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lab-explorer-trigger-btn .trigger-action-pill {
  font-size: 0.68rem;
  font-weight: 600;
  background: rgba(34, 211, 238, 0.15);
  color: var(--accent-cyan);
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(34, 211, 238, 0.3);
}

/* Secondary Strip: Quick Lab Pills Carousel */
.header-carousel-strip {
  background: rgba(8, 12, 22, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.3rem 1.5rem;
  display: flex;
  justify-content: center;
}

.header-carousel-strip .lab-switcher {
  max-width: 1700px;
  width: 100%;
  justify-content: flex-start;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

/* Hub button in header */
.icon-btn.hub-btn {
  color: var(--accent-cyan);
  border-color: rgba(34, 211, 238, 0.3);
  text-decoration: none;
}
.icon-btn.hub-btn:hover {
  background: rgba(34, 211, 238, 0.15);
  color: #fff;
}

/* Stepper Navigation: Prev, Tabs, Next */
.lesson-nav-stepper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-nav-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-main);
  padding: 0.42rem 0.85rem;
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.step-nav-btn:hover:not(:disabled) {
  background: rgba(34, 211, 238, 0.15);
  border-color: rgba(34, 211, 238, 0.4);
  color: #fff;
  transform: translateY(-1px);
}

.step-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.step-nav-btn.next-btn:not(:disabled) {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(6, 182, 212, 0.3));
  border-color: rgba(34, 211, 238, 0.5);
  color: #fff;
}

/* Visual Step Progress Bar */
.lesson-progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  margin-top: 0.35rem;
  overflow: hidden;
}

.lesson-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #10b981);
  border-radius: 999px;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Step Advance Card (Frictionless next-lesson trigger) */
.step-advance-card {
  margin: 1rem 0;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(34, 211, 238, 0.28);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  animation: fadeInCard 0.3s ease-out;
}

@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-advance-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.step-advance-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-spark-icon {
  font-size: 1.5rem;
  display: inline-block;
  animation: sparkBob 2.5s infinite ease-in-out;
}

@keyframes sparkBob {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(6deg); }
}

.step-advance-texts h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.step-advance-texts p {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.btn-step-advance {
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.55rem 1.25rem;
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-step-advance:hover {
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.55);
  transform: translateY(-2px);
}

.btn-step-advance:active {
  transform: translateY(0);
}

/* Lab Explorer Modal (22 Labs Catalog & Instant Filter) */
.modal-large {
  max-width: 1100px;
  width: 95vw;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.modal-header-titles {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-header-titles .icon {
  font-size: 1.6rem;
}

.modal-header-titles h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.modal-header-titles p {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.explorer-filter-toolbar {
  padding: 0.85rem 1.5rem;
  background: rgba(15, 23, 42, 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-box .search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.7;
}

.search-box input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  background: rgba(10, 15, 29, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  color: #fff;
  font-family: var(--font-main);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.35);
}

.explorer-grade-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.explorer-grade-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-family: var(--font-main);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.explorer-grade-pill:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.explorer-grade-pill.active {
  background: var(--arduino-teal);
  border-color: var(--arduino-teal);
  color: #fff;
  box-shadow: 0 0 10px var(--arduino-teal-glow);
}

.explorer-cards-grid {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1rem;
  max-height: 52vh;
}

.explorer-lab-card {
  background: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-lg);
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.explorer-lab-card:hover {
  border-color: var(--accent-cyan);
  background: rgba(20, 29, 48, 0.95);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 14px rgba(34, 211, 238, 0.25);
}

.explorer-lab-card.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
}

.explorer-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.explorer-card-icon {
  font-size: 2rem;
}

.explorer-card-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-g68 {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-g910 {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-g1112 {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.explorer-card-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.explorer-card-summary {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 0.85rem;
  flex: 1;
}

.explorer-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.65rem;
}

.explorer-card-lessons {
  font-size: 0.72rem;
  color: var(--text-dim);
  font-weight: 600;
}

.btn-open-lab {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 0.28rem 0.75rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.explorer-lab-card:hover .btn-open-lab {
  background: var(--arduino-teal);
  border-color: var(--arduino-teal);
}

.explorer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
}

.explorer-footer-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
}
"""

with open("css/styles.css", "a", encoding="utf-8") as f:
    f.write(new_css)

print("Appended new CSS successfully!")
