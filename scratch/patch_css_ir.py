ir_css = '''
/* =========================================================================
   LAB 10: TCRT5000 / KY-033 IR REFLECTIVE SENSOR STYLING
   ========================================================================= */

.ir-studio-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-lg);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.surface-chip-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.surface-chip {
  padding: 0.65rem 0.5rem;
  border-radius: var(--radius-md);
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.surface-chip.active {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}

.surface-chip:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(51, 65, 85, 0.8);
}

.adc-bar-track {
  width: 100%;
  height: 20px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.adc-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #38bdf8, #f59e0b, #ef4444);
  border-radius: 10px;
  transition: width 0.15s ease;
}

.steer-btn-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.steer-btn {
  padding: 0.55rem;
  border-radius: var(--radius-md);
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.steer-btn.active {
  background: rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
  color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
}
'''

with open('css/styles.css', 'a', encoding='utf-8') as f:
    f.write(ir_css)
print('Appended IR styles to styles.css')
