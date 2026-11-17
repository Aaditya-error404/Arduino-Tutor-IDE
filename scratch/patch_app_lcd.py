with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. DOM Elements
target_dom = "  const labBtnIr = document.getElementById('lab-btn-ir');"
lcd_dom = """  const labBtnLcd = document.getElementById('lab-btn-lcd');
  const labBtnIr = document.getElementById('lab-btn-ir');"""

if target_dom in text and 'labBtnLcd' not in text:
    text = text.replace(target_dom, lcd_dom)
    print('Added labBtnLcd DOM element')

target_dom2 = "  const irCircuitView = document.getElementById('ir-circuit-view');"
lcd_dom2 = """  const lcdCircuitView = document.getElementById('lcd-circuit-view');
  const lcdBacklightGlass = document.getElementById('lcd-backlight-glass');
  const lcdSvgLine0 = document.getElementById('lcd-svg-line-0');
  const lcdSvgLine1 = document.getElementById('lcd-svg-line-1');
  const irCircuitView = document.getElementById('ir-circuit-view');"""

if target_dom2 in text and 'lcdCircuitView' not in text:
    text = text.replace(target_dom2, lcd_dom2)
    print('Added LCD SVG elements')

# 2. getCurrentLessons
target_gl = "    if (state.activeLab === 'ir') return window.IR_LESSONS_DATA;"
lcd_gl = """    if (state.activeLab === 'lcd') return window.LCD_LESSONS_DATA;
    if (state.activeLab === 'ir') return window.IR_LESSONS_DATA;"""

if target_gl in text and "'lcd'" not in text.split('function getCurrentLessons')[1][:200]:
    text = text.replace(target_gl, lcd_gl)
    print('Added LCD to getCurrentLessons')

# 3. switchLab button toggles & names
target_sl1 = "    if (labBtnIr) labBtnIr.classList.toggle('active', labName === 'ir');"
lcd_sl1 = """    if (labBtnLcd) labBtnLcd.classList.toggle('active', labName === 'lcd');
    if (labBtnIr) labBtnIr.classList.toggle('active', labName === 'ir');"""

if target_sl1 in text and 'labBtnLcd.classList' not in text:
    text = text.replace(target_sl1, lcd_sl1)
    print('Added labBtnLcd toggle in switchLab')

target_sl2 = "      ir: 'TCRT5000 IR Reflective & Line Sensor Lab',"
lcd_sl2 = """      lcd: '16x2 I2C Character LCD Display Lab',
      ir: 'TCRT5000 IR Reflective & Line Sensor Lab',"""

if target_sl2 in text and "'lcd':" not in text:
    text = text.replace(target_sl2, lcd_sl2)
    print('Added LCD to labNames')

target_sl3 = "    if (irCircuitView) irCircuitView.style.display = labName === 'ir' ? 'block' : 'none';"
lcd_sl3 = """    if (lcdCircuitView) lcdCircuitView.style.display = labName === 'lcd' ? 'block' : 'none';
    if (irCircuitView) irCircuitView.style.display = labName === 'ir' ? 'block' : 'none';"""

if target_sl3 in text and 'lcdCircuitView.style.display' not in text:
    text = text.replace(target_sl3, lcd_sl3)
    print('Added lcdCircuitView display toggle')

target_sl4 = "  if (labBtnIr) {\n    labBtnIr.addEventListener('click', () => switchLab('ir'));\n  }"
lcd_sl4 = """  if (labBtnLcd) {
    labBtnLcd.addEventListener('click', () => switchLab('lcd'));
  }
  if (labBtnIr) {
    labBtnIr.addEventListener('click', () => switchLab('ir'));
  }"""

if target_sl4 in text and "switchLab('lcd')" not in text:
    text = text.replace(target_sl4, lcd_sl4)
    print('Added labBtnLcd click listener')

# 4. renderHardwareCallouts
target_hc = "    } else if (state.activeLab === 'ir') {"
lcd_hc = """    } else if (state.activeLab === 'lcd') {
      hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="16 columns by 2 rows of 5x8 character dot matrix cells">
          <span>📟</span> <strong>16x2 HD44780 Screen:</strong> 32 character blocks rendering ASCII & custom glyphs.
        </div>
        <div class="callout-pill" title="PCF8574 8-bit I2C I/O expander backpack daughterboard">
          <span>🎒</span> <strong>PCF8574 I2C Backpack:</strong> Shrinks 16 parallel pins into 2 serial wires (0x27).
        </div>
        <div class="callout-pill" title="Arduino Analog Pin A4 acts as I2C Serial Data (SDA)">
          <span>📨</span> <strong>SDA (Pin A4):</strong> Carries serial text bytes and command packets.
        </div>
        <div class="callout-pill" title="Arduino Analog Pin A5 acts as I2C Serial Clock (SCL)">
          <span>⏱️</span> <strong>SCL (Pin A5):</strong> Synchronous 100kHz clock pulses clocking every data bit.
        </div>
      `;
    } else if (state.activeLab === 'ir') {"""

if target_hc in text and "state.activeLab === 'lcd'" not in text:
    text = text.replace(target_hc, lcd_hc)
    print('Added LCD hardware callouts')

# 5. onHardwareChange telemetry
target_hw = "    // 8. Update LAB 10: TCRT5000 IR Reflective & Line Sensor Visuals"
lcd_hw = """    // 9. Update LAB 11: 16x2 I2C Character LCD Display Visuals
    if (hw.activeLab === 'lcd' || state.activeLab === 'lcd') {
      const line0 = hw.lcdLine0 || 'I2C Bus Ready!  ';
      const line1 = hw.lcdLine1 || 'Address: 0x27   ';

      if (lcdSvgLine0) lcdSvgLine0.textContent = line0;
      if (lcdSvgLine1) lcdSvgLine1.textContent = line1;
      if (lcdBacklightGlass) {
        lcdBacklightGlass.setAttribute('fill', hw.lcdBacklight ? '#0284c7' : '#0f172a');
      }

      const live0 = document.getElementById('lcd-live-line-0');
      const live1 = document.getElementById('lcd-live-line-1');
      if (live0) live0.textContent = line0;
      if (live1) live1.textContent = line1;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🌐</span> I2C Address';
        hudReadout1.textContent = '0x27 (PCF8574)';
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>💡</span> Backlight';
        hudReadout2.textContent = hw.lcdBacklight ? 'ON (Blue LED)' : 'OFF (Sleep)';
        hudReadout2.className = hw.lcdBacklight ? 'hud-value val ok' : 'hud-value val';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🔠</span> Display Buffer';
        hudReadout3.textContent = '16x2 HD44780';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>📊</span> IoT Deck Channel';
        const ch = hw.lcdScreenMode || 0;
        hudReadout4.textContent = ch === 0 ? 'CH 1: CLIMATE' : ch === 1 ? 'CH 2: RADAR' : 'CH 3: SOLAR';
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeStatus) {
        scopeStatus.textContent = `I2C Bus 100kHz: SDA Pin A4 + SCL Pin A5 transmitting text packets to 0x27`;
      }
    }

    // 8. Update LAB 10: TCRT5000 IR Reflective & Line Sensor Visuals"""

if target_hw in text and "hw.activeLab === 'lcd'" not in text:
    text = text.replace(target_hw, lcd_hw)
    print('Added LCD onHardwareChange')

# 6. Renderers for LCD
lcd_renderers = """
  // =========================================================================
  // LAB 11: 16x2 I2C CHARACTER LCD DISPLAY INTERACTIVE RENDERERS
  // =========================================================================

  function renderLcdLesson1(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 41</span>
          <h3>Taming 16 Wires: I2C Protocol Initialization</h3>
        </div>
        <p class="instruction-text">
          Click <strong>Initialize I2C Bus (0x27)</strong> to transmit the wake-up handshake packet across Pins A4 (SDA) and A5 (SCL). 
          Toggle the LED backlight to observe power savings!
        </p>
        <div class="lcd-studio-card">
          <div class="lcd-dot-screen" id="lcd-preview-l1">
            <div id="lcd-live-line-0">${hw.lcdLine0 || 'I2C Bus Ready!  '}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1 || 'Address: 0x27   '}</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.35rem;">
            <span style="font-size:0.8rem; color:var(--text-muted);">Backlight State: <strong style="color:#38bdf8;">${hw.lcdBacklight ? 'ON (35mA)' : 'OFF (15mA)'}</strong></span>
            <button class="secondary-btn" id="btn-lcd-backlight" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
              <span>💡</span> Toggle Backlight
            </button>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-init">
            <span>📟</span> Initialize I2C Bus (0x27)
          </button>
        </div>
      </div>
    `;

    const initBtn = document.getElementById('btn-lcd-init');
    const blBtn = document.getElementById('btn-lcd-backlight');

    if (initBtn) {
      initBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playTone(1900, 0.1);
        window.circuitSimulation.setLcdText(0, 'I2C Bus Ready!  ');
        window.circuitSimulation.setLcdText(1, 'Address: 0x27   ');
        checkVerification('lcdInitialized');
      });
    }

    if (blBtn) {
      blBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        window.circuitSimulation.toggleLcdBacklight();
        renderLcdLesson1(lesson);
      });
    }
  }

  function renderLcdLesson2(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 42</span>
          <h3>Screen Coordinates & Cursor Positioning</h3>
        </div>
        <p class="instruction-text">
          Use the coordinate sliders to position custom text on the 16-column by 2-row screen. 
          Remember: computers count starting at index 0!
        </p>
        <div class="lcd-studio-card">
          <div class="lcd-dot-screen">
            <div id="lcd-live-line-0">${hw.lcdLine0}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1}</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.35rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
                <span style="color:var(--text-muted);">Column Position (0 to 15):</span>
                <span id="lcd-col-val" style="font-family:var(--font-code); font-weight:800; color:#38bdf8;">${hw.lcdCursorCol || 0}</span>
              </div>
              <input type="range" class="sonar-slider" id="lcd-col-slider" min="0" max="15" step="1" value="${hw.lcdCursorCol || 0}" />
            </div>

            <div style="display:flex; gap:0.75rem; align-items:center;">
              <span style="font-size:0.8rem; color:var(--text-muted);">Row Selection:</span>
              <button class="dash-tab-btn ${(hw.lcdCursorRow || 0) === 0 ? 'active' : ''}" id="btn-lcd-row-0" style="padding:0.35rem 0.75rem;">Row 0 (Top)</button>
              <button class="dash-tab-btn ${(hw.lcdCursorRow || 0) === 1 ? 'active' : ''}" id="btn-lcd-row-1" style="padding:0.35rem 0.75rem;">Row 1 (Bottom)</button>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-coords">
            <span>📍</span> Verify Text Positioning
          </button>
        </div>
      </div>
    `;

    const colSlider = document.getElementById('lcd-col-slider');
    const colVal = document.getElementById('lcd-col-val');
    const row0Btn = document.getElementById('btn-lcd-row-0');
    const row1Btn = document.getElementById('btn-lcd-row-1');
    const btn = document.getElementById('btn-lcd-coords');

    function updateCoords(col, row) {
      window.circuitSimulation.setLcdCursor(col, row);
      if (colVal) colVal.textContent = `${col}`;
      const prefix = ' '.repeat(col);
      const rowText = (prefix + 'ATL INNOVATE').substring(0, 16);
      if (row === 0) {
        window.circuitSimulation.setLcdText(0, rowText);
        window.circuitSimulation.setLcdText(1, 'COL:0-15 ROW:0-1');
      } else {
        window.circuitSimulation.setLcdText(0, 'ATL INNOVATE    ');
        window.circuitSimulation.setLcdText(1, rowText);
      }
    }

    if (colSlider) {
      colSlider.addEventListener('input', (e) => {
        const c = parseInt(e.target.value);
        const r = window.circuitSimulation.getHardwareState().lcdCursorRow || 0;
        updateCoords(c, r);
      });
    }

    if (row0Btn) {
      row0Btn.addEventListener('click', () => {
        const c = window.circuitSimulation.getHardwareState().lcdCursorCol || 0;
        updateCoords(c, 0);
        renderLcdLesson2(lesson);
      });
    }

    if (row1Btn) {
      row1Btn.addEventListener('click', () => {
        const c = window.circuitSimulation.getHardwareState().lcdCursorCol || 0;
        updateCoords(c, 1);
        renderLcdLesson2(lesson);
      });
    }

    if (btn) {
      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        checkVerification('lcdCoordsVerified');
      });
    }
  }

  function renderLcdLesson3(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();
    let currentBytes = [...(hw.lcdCustomChar || [0, 10, 31, 31, 14, 4, 0, 0])];

    const presets = {
      heart: [0, 10, 31, 31, 14, 4, 0, 0],
      battery: [14, 27, 17, 31, 31, 31, 31, 31],
      smiley: [0, 10, 0, 4, 0, 17, 14, 0],
      bell: [4, 14, 14, 14, 31, 0, 4, 0]
    };

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge">LESSON 43</span>
          <h3>Designing Custom Characters: 5x8 Pixel Typography</h3>
        </div>
        <p class="instruction-text">
          Click pixels on the 5x8 matrix grid to draw a custom icon! Each row represents a 5-bit binary byte. 
          Upload it directly into HD44780 CGRAM memory slot 0!
        </p>
        <div class="lcd-studio-card">
          <div class="glyph-preset-row">
            <span style="font-size:0.8rem; color:var(--text-muted); align-self:center;">PRESETS:</span>
            <button class="glyph-preset-btn" data-preset="heart">❤️ Heart</button>
            <button class="glyph-preset-btn" data-preset="battery">🔋 Battery</button>
            <button class="glyph-preset-btn" data-preset="smiley">😃 Smiley</button>
            <button class="glyph-preset-btn" data-preset="bell">🔔 Bell</button>
          </div>

          <div class="pixel-grid-container">
            <div class="pixel-grid-5x8" id="pixel-matrix-grid">
              ${generatePixelGridHtml(currentBytes)}
            </div>

            <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
              <div class="lcd-dot-screen" style="padding:0.6rem 0.85rem; font-size:1rem;">
                <div id="lcd-live-line-0">Arduino + ATL ♥ </div>
                <div id="lcd-live-line-1">Custom Glyph [0]</div>
              </div>
              <div style="font-family:var(--font-code); font-size:0.75rem; color:var(--text-muted); background:rgba(0,0,0,0.4); padding:0.5rem; border-radius:4px;" id="cgram-byte-preview">
                byte custom[8] = { ${currentBytes.map(b => 'B' + b.toString(2).padStart(5, '0')).join(', ')} };
              </div>
            </div>
          </div>
        </div>
        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-glyph">
            <span>✨</span> Upload Custom Glyph to Slot 0
          </button>
        </div>
      </div>
    `;

    function generatePixelGridHtml(bytes) {
      let html = '';
      for (let r = 0; r < 8; r++) {
        const rowByte = bytes[r] || 0;
        for (let c = 0; c < 5; c++) {
          const bitOn = (rowByte & (1 << (4 - c))) !== 0;
          html += `<div class="pixel-cell ${bitOn ? 'on' : ''}" data-row="${r}" data-col="${c}"></div>`;
        }
      }
      return html;
    }

    const grid = document.getElementById('pixel-matrix-grid');
    const bytePreview = document.getElementById('cgram-byte-preview');
    const btn = document.getElementById('btn-lcd-glyph');

    if (grid) {
      grid.querySelectorAll('.pixel-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          const r = parseInt(cell.getAttribute('data-row'));
          const c = parseInt(cell.getAttribute('data-col'));
          const mask = 1 << (4 - c);
          currentBytes[r] ^= mask;
          cell.classList.toggle('on');
          window.circuitSimulation.setLcdCustomChar(currentBytes);
          if (bytePreview) {
            bytePreview.textContent = `byte custom[8] = { ${currentBytes.map(b => 'B' + b.toString(2).padStart(5, '0')).join(', ')} };`;
          }
          if (window.soundEngine) window.soundEngine.playTone(2400, 0.04);
        });
      });
    }

    lessonInteractiveArea.querySelectorAll('.glyph-preset-btn').forEach(pb => {
      pb.addEventListener('click', () => {
        const pKey = pb.getAttribute('data-preset');
        if (presets[pKey]) {
          currentBytes = [...presets[pKey]];
          window.circuitSimulation.setLcdCustomChar(currentBytes);
          renderLcdLesson3(lesson);
          if (window.soundEngine) window.soundEngine.playClick();
        }
      });
    });

    if (btn) {
      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        window.circuitSimulation.setLcdText(0, 'Arduino + ATL ♥ ');
        window.circuitSimulation.setLcdText(1, 'Glyph Saved!    ');
        checkVerification('lcdGlyphCreated');
      });
    }
  }

  function renderLcdLesson4(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();
    const curMode = hw.lcdScreenMode || 0;

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="step-badge" style="background:#f59e0b; color:#0f172a;">LESSON 44 • GRAND CAPSTONE</span>
          <h3>IoT Multi-Sensor Command Deck Studio</h3>
        </div>
        <p class="instruction-text">
          Congratulations on reaching the Grand Capstone of the entire ATL Curriculum! 
          This project combines TMP36 temperature, HC-SR04 sonar radar, and LDR light sensors into one cycling 16x2 IoT command screen!
        </p>
        <div class="lcd-studio-card">
          <!-- Cycling 16x2 LCD Screen -->
          <div class="lcd-dot-screen">
            <div id="lcd-live-line-0">${hw.lcdLine0}</div>
            <div id="lcd-live-line-1">${hw.lcdLine1}</div>
          </div>

          <div style="font-weight:700; color:var(--text-muted); font-size:0.8rem; margin-top:0.25rem;">MANUAL CHANNEL SWITCHER:</div>
          <div class="dash-tab-row">
            <button class="dash-tab-btn ${curMode === 0 ? 'active' : ''}" data-mode="0">
              <span>🌡️</span> Ch 1: Climate
            </button>
            <button class="dash-tab-btn ${curMode === 1 ? 'active' : ''}" data-mode="1">
              <span>🦇</span> Ch 2: Radar
            </button>
            <button class="dash-tab-btn ${curMode === 2 ? 'active' : ''}" data-mode="2">
              <span>☀️</span> Ch 3: Solar
            </button>
          </div>

          <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:0.75rem; font-size:0.8rem; line-height:1.6;">
            <div style="color:#22d3ee; font-weight:800;">🎉 ATL Curriculum Complete (44 / 44 Lessons Built!):</div>
            <div style="color:var(--text-secondary); margin-top:2px;">
              All 11 hardware labs are operational: Servo, Potentiometer, Button, Buzzer, LDR, RGB LED, TMP36, HC-SR04, TCRT5000 IR, and 16x2 I2C LCD!
            </div>
          </div>
        </div>

        <div class="action-btn-row" style="margin-top:0.75rem;">
          <button class="primary-btn" id="btn-lcd-deck" style="background:linear-gradient(135deg, #06b6d4, #10b981); border:none;">
            <span>🚀</span> Launch IoT Command Deck (Complete Curriculum)
          </button>
        </div>
      </div>
    `;

    const tabs = lessonInteractiveArea.querySelectorAll('.dash-tab-btn');
    const btn = document.getElementById('btn-lcd-deck');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const m = parseInt(tab.getAttribute('data-mode'));
        window.circuitSimulation.setLcdScreenMode(m);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    if (btn) {
      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        triggerCelebrationConfetti();
        checkVerification('lcdIotDeckActive');
      });
    }
  }
"""

boot_marker = '  // --- Initial App Boot with Direct URL Parameter Support ---'
if boot_marker in text and 'function renderLcdLesson1' not in text:
    text = text.replace(boot_marker, lcd_renderers + '\n\n' + boot_marker)
    print('Appended LCD interactive renderers inside DOMContentLoaded')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully patched app.js for LCD!')
