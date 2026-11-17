lcd_css = '''
/* =========================================================================
   LAB 11: 16x2 I2C CHARACTER LCD DISPLAY STYLING
   ========================================================================= */

.lcd-studio-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: var(--radius-lg);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lcd-dot-screen {
  background: #0284c7;
  border: 4px solid #0f172a;
  border-radius: var(--radius-md);
  padding: 0.85rem 1.1rem;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 2px;
  line-height: 1.5;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 0 15px rgba(2, 132, 199, 0.4);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
  user-select: none;
}

.pixel-grid-container {
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.pixel-grid-5x8 {
  display: grid;
  grid-template-columns: repeat(5, 22px);
  grid-template-rows: repeat(8, 22px);
  gap: 3px;
  background: #0f172a;
  padding: 8px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.pixel-cell {
  background: #1e293b;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.pixel-cell.on {
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
}

.glyph-preset-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.glyph-preset-btn {
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-md);
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.glyph-preset-btn:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #06b6d4;
}

.dash-tab-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.dash-tab-btn {
  padding: 0.6rem;
  border-radius: var(--radius-md);
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.dash-tab-btn.active {
  background: rgba(6, 182, 212, 0.25);
  border-color: #06b6d4;
  color: #38bdf8;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}
'''

with open('css/styles.css', 'a', encoding='utf-8') as f:
    f.write(lcd_css)
print('Appended LCD styles to styles.css')
