# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with OLED lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

oled_sim_state = """    } else if (labName === 'oled') {
      this.voltage = 3.3;
      this.currentMa = 22.5;
      this.oledCursorX = 64;
      this.oledCursorY = 32;
      this.oledWaveType = 'sine';
      this.oledWaveFreq = 2;
      this.oledMenuPage = 0;
      this.oledSelectedIdx = 0;
      this.oledSpriteMode = 'heart';
      this.setLesson(1);"""

if "labName === 'oled'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'gas') {",
        oled_sim_state + "\n    } else if (labName === 'gas') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with oled state.")
else:
    print("simulation.js already has oled state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add oledCircuitView declaration if missing
if "const oledCircuitView = document.getElementById('oled-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const gasCircuitView = document.getElementById('gas-circuit-view');",
        "const gasCircuitView = document.getElementById('gas-circuit-view');\n  const oledCircuitView = document.getElementById('oled-circuit-view');"
    )

# Add oled HUD in onHardwareChange
oled_hud = """    } else if (state.activeLab === 'oled') {
      const curX = hw.oledCursorX !== undefined ? hw.oledCursorX : 64;
      const curY = hw.oledCursorY !== undefined ? hw.oledCursorY : 32;
      const page = Math.floor(curY / 8);
      const bit = curY % 8;
      const memAddr = page * 128 + curX;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🖥️</span> VRAM Buffer';
        hudReadout1.textContent = '1,024 Bytes';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>⚡</span> I2C Clock (0x3C)';
        hudReadout2.textContent = '400 kHz (Fast)';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>📍</span> Pixel Coordinate';
        hudReadout3.textContent = `(${curX}, ${curY}) [P${page}:B${bit}]`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>💡</span> Current Draw';
        hudReadout4.textContent = `${(hw.currentMa || 22.5).toFixed(1)} mA`;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>SSD1306 Graphic OLED:</strong> 128×64 Emissive Matrix (8 Pages × 128 Bytes)';
      if (scopeStatus) scopeStatus.textContent = `I2C Bus: 0x3C | Vout: 3.3V | SRAM Offset: 0x${memAddr.toString(16).toUpperCase()} | Mode: ${hw.oledWaveType || 'Direct Draw'}`;"""

if "state.activeLab === 'oled'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'gas') {",
        oled_hud + "\n    } else if (state.activeLab === 'gas') {"
    )

# Add oled dispatch in renderInteractiveTask
oled_dispatch = """    } else if (state.activeLab === 'oled') {
      if (lesson.id === 1) renderOledLesson1(lesson);
      else if (lesson.id === 2) renderOledLesson2(lesson);
      else if (lesson.id === 3) renderOledLesson3(lesson);
      else if (lesson.id === 4) renderOledLesson4(lesson);"""

if "renderOledLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'gas') {",
        oled_dispatch + "\n    } else if (state.activeLab === 'gas') {"
    )

# Add OLED Lesson Renderers
oled_renderers = '''
  // =========================================================================
  // OLED LESSONS (SSD1306 128x64 Graphic Display Studio)
  // =========================================================================

  function updateOledScreen() {
    const hw = window.circuitSimulation.getHardwareState();
    const l1 = document.getElementById('oled-svg-line1');
    const l2 = document.getElementById('oled-svg-line2');
    const footer = document.getElementById('oled-svg-footer');
    const sparkline = document.getElementById('oled-svg-sparkline');
    const bar = document.getElementById('oled-svg-bar');
    const cursor = document.getElementById('oled-svg-cursor');

    const curX = hw.oledCursorX !== undefined ? hw.oledCursorX : 64;
    const curY = hw.oledCursorY !== undefined ? hw.oledCursorY : 32;
    const page = Math.floor(curY / 8);
    const bit = curY % 8;
    const addr = page * 128 + curX;

    if (state.activeLessonId === 1) {
      if (l1) l1.textContent = `PIXEL: (${curX}, ${curY})`;
      if (l2) l2.textContent = `PAGE: ${page} | BIT: ${bit}`;
      if (footer) footer.textContent = `ADDR: 0x${addr.toString(16).toUpperCase()} | 1024B`;
      if (bar) bar.setAttribute('width', Math.min(112, Math.round((curX / 128) * 112)));
      if (cursor) cursor.style.display = 'none';

      // Draw crosshair on sparkline path
      if (sparkline) {
        const sx = 4 + (curX / 128) * 112;
        const sy = 30 + (curY / 64) * 35;
        sparkline.setAttribute('d', `M ${sx-10} ${sy} L ${sx+10} ${sy} M ${sx} ${sy-10} L ${sx} ${sy+10}`);
      }
    } else if (state.activeLessonId === 2) {
      const mode = hw.oledSpriteMode || 'heart';
      if (l1) l1.textContent = `SPRITE: ${mode.toUpperCase()} (8x8)`;
      if (l2) l2.textContent = 'PROGMEM FLASH: 8 BYTES';
      if (footer) footer.textContent = 'DRAW: drawBitmap(10,10)';
      if (bar) bar.setAttribute('width', 95);
      if (cursor) cursor.style.display = 'none';

      // Shape preview path
      if (sparkline) {
        if (mode === 'heart') {
          sparkline.setAttribute('d', 'M 50 45 C 50 35, 30 35, 30 50 C 30 65, 60 78, 60 78 C 60 78, 90 65, 90 50 C 90 35, 70 35, 70 45 Z');
        } else if (mode === 'invader') {
          sparkline.setAttribute('d', 'M 35 45 H 85 V 65 H 35 Z M 45 40 H 55 V 45 H 45 Z M 65 40 H 75 V 45 H 65 Z');
        } else if (mode === 'star') {
          sparkline.setAttribute('d', 'M 60 35 L 65 50 L 80 50 L 68 60 L 72 75 L 60 65 L 48 75 L 52 60 L 40 50 L 55 50 Z');
        } else {
          sparkline.setAttribute('d', 'M 40 55 L 55 70 L 85 40');
        }
      }
    } else if (state.activeLessonId === 3) {
      const wave = hw.oledWaveType || 'sine';
      const freq = hw.oledWaveFreq || 2;
      if (l1) l1.textContent = `OSCILLOSCOPE: ${wave.toUpperCase()}`;
      if (l2) l2.textContent = `FREQ: ${freq} Hz | 42 FPS`;
      if (footer) footer.textContent = 'RING BUFFER: 128 SAMPLES';
      if (bar) bar.setAttribute('width', Math.min(112, freq * 11));
      if (cursor) cursor.style.display = 'none';

      // Generate dynamic wave path
      if (sparkline) {
        let d = 'M 4 55 ';
        for (let x = 0; x <= 112; x += 3) {
          let y = 55;
          if (wave === 'sine') {
            y = 55 + Math.sin((x / 112) * Math.PI * 2 * freq) * 16;
          } else if (wave === 'ecg') {
            const phase = (x * freq * 0.1) % 1;
            if (phase > 0.4 && phase < 0.5) y = 55 - 20;
            else if (phase >= 0.5 && phase < 0.6) y = 55 + 10;
            else y = 55;
          } else if (wave === 'square') {
            const phase = (x * freq * 0.05) % 1;
            y = phase < 0.5 ? 40 : 70;
          } else {
            // noise
            y = 55 + (Math.sin(x * 12.34) * 0.5 + Math.cos(x * 5.67) * 0.5) * 14;
          }
          d += `L ${4 + x} ${y.toFixed(1)} `;
        }
        sparkline.setAttribute('d', d);
      }
    } else if (state.activeLessonId === 4) {
      const pages = ['1. DASHBOARD', '2. SENSORS', '3. SETTINGS'];
      const pIdx = hw.oledMenuPage !== undefined ? hw.oledMenuPage : 0;
      if (l1) l1.textContent = 'MENU NAV: FSM';
      if (l2) l2.textContent = pages[pIdx];
      if (footer) footer.textContent = `SELECTED: [ITEM ${pIdx + 1}/3]`;
      if (bar) bar.setAttribute('width', (pIdx + 1) * 37);

      if (cursor) {
        cursor.style.display = 'block';
        cursor.setAttribute('y', 20 + pIdx * 16);
      }
      if (sparkline) {
        sparkline.setAttribute('d', `M 4 ${32 + pIdx * 16} L 116 ${32 + pIdx * 16}`);
      }
    }

    if (window.circuitSimulation) {
      window.circuitSimulation.notifyHardware();
    }
  }

  function renderOledLesson1(lesson) {
    const hw = window.circuitSimulation.getHardwareState();
    hw.oledCursorX = hw.oledCursorX !== undefined ? hw.oledCursorX : 64;
    hw.oledCursorY = hw.oledCursorY !== undefined ? hw.oledCursorY : 32;

    const page = Math.floor(hw.oledCursorY / 8);
    const bit = hw.oledCursorY % 8;
    const memOffset = page * 128 + hw.oledCursorX;

    taskInteractiveContainer.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📍</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">128×64 Pixel Matrix & Memory Page Inspector</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              8,192 Self-Lit OLED Pixels • 8 Vertical Pages • 1,024 Bytes SRAM Framebuffer
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">X Coordinate: <strong id="oled-val-x" style="color:#38bdf8;">${hw.oledCursorX}</strong> / 127</span>
            <span style="color:#cbd5e1;">Horizontal Column</span>
          </div>
          <input type="range" id="oled-slider-x" min="0" max="127" value="${hw.oledCursorX}" style="width:100%; accent-color:#38bdf8;" />

          <div style="display:flex; justify-content:space-between; margin:0.6rem 0 0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Y Coordinate: <strong id="oled-val-y" style="color:#38bdf8;">${hw.oledCursorY}</strong> / 63</span>
            <span style="color:#cbd5e1;">Vertical Row</span>
          </div>
          <input type="range" id="oled-slider-y" min="0" max="63" value="${hw.oledCursorY}" style="width:100%; accent-color:#06b6d4;" />
        </div>

        <!-- Real-time Memory Page breakdown -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SSD1306 PAGE</div>
            <div id="box-page" style="font-size:1rem; font-weight:800; color:#38bdf8;">Page ${page}</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">BYTE BIT (0-7)</div>
            <div id="box-bit" style="font-size:1rem; font-weight:800; color:#06b6d4;">Bit ${bit} (2^${bit}=${1<<bit})</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SRAM OFFSET</div>
            <div id="box-addr" style="font-size:1rem; font-weight:800; color:#10b981;">0x${memOffset.toString(16).toUpperCase()}</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-push-pixel">
            <span>⚡</span> Transmit Framebuffer to OLED Glass (display.display())
          </button>
        </div>
      </div>
    `;

    const sliderX = document.getElementById('oled-slider-x');
    const sliderY = document.getElementById('oled-slider-y');
    const valX = document.getElementById('oled-val-x');
    const valY = document.getElementById('oled-val-y');
    const boxPage = document.getElementById('box-page');
    const boxBit = document.getElementById('box-bit');
    const boxAddr = document.getElementById('box-addr');

    function updateSliders() {
      const x = parseInt(sliderX.value, 10);
      const y = parseInt(sliderY.value, 10);
      hw.oledCursorX = x;
      hw.oledCursorY = y;
      if (valX) valX.textContent = x;
      if (valY) valY.textContent = y;
      const p = Math.floor(y / 8);
      const b = y % 8;
      const a = p * 128 + x;
      if (boxPage) boxPage.textContent = `Page ${p}`;
      if (boxBit) boxBit.textContent = `Bit ${b} (2^${b}=${1<<b})`;
      if (boxAddr) boxAddr.textContent = `0x${a.toString(16).toUpperCase()}`;
      updateOledScreen();
    }

    sliderX?.addEventListener('input', updateSliders);
    sliderY?.addEventListener('input', updateSliders);

    document.getElementById('btn-oled-push-pixel')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('oledPixelPushed');
    });

    updateOledScreen();
  }

  function renderOledLesson2(lesson) {
    const hw = window.circuitSimulation.getHardwareState();
    hw.oledSpriteMode = hw.oledSpriteMode || 'heart';

    taskInteractiveContainer.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🎨</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Monochrome 8×8 Pixel Sprite Designer (PROGMEM)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Pack 64 Pixels into 8 Hexadecimal Bytes • Stored in Microcontroller Flash ROM
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-sprite-heart" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#ec4899; color:#f472b6;">
            ❤️ Heart
          </button>
          <button class="secondary-btn" id="btn-sprite-invader" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#06b6d4; color:#67e8f9;">
            👾 Invader
          </button>
          <button class="secondary-btn" id="btn-sprite-star" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#eab308; color:#fde047;">
            ⭐ Star
          </button>
          <button class="secondary-btn" id="btn-sprite-check" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#22c55e; color:#86efac;">
            ✓ Check
          </button>
        </div>

        <!-- Generated C++ PROGMEM code box -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#93c5fd; margin-bottom:0.75rem;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.2rem;">// Auto-generated Flash Array:</div>
          <div id="progmem-code-preview" style="color:#7dd3fc; line-height:1.4;">
            const unsigned char PROGMEM icon8x8[] = {<br>
            &nbsp;&nbsp;0x00, 0x66, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C, 0x18<br>
            };
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-stamp-sprite">
            <span>🖌️</span> Stamp Sprite to OLED Display (display.drawBitmap())
          </button>
        </div>
      </div>
    `;

    function setSprite(mode, hexStr) {
      hw.oledSpriteMode = mode;
      const preview = document.getElementById('progmem-code-preview');
      if (preview) {
        preview.innerHTML = `const unsigned char PROGMEM icon8x8[] = {<br>&nbsp;&nbsp;${hexStr}<br>};`;
      }
      updateOledScreen();
    }

    document.getElementById('btn-sprite-heart')?.addEventListener('click', () => {
      setSprite('heart', '0x00, 0x66, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C, 0x18');
    });
    document.getElementById('btn-sprite-invader')?.addEventListener('click', () => {
      setSprite('invader', '0x18, 0x3C, 0x7E, 0xDB, 0xFF, 0x24, 0x5A, 0x81');
    });
    document.getElementById('btn-sprite-star')?.addEventListener('click', () => {
      setSprite('star', '0x10, 0x10, 0x54, 0x38, 0x7C, 0x38, 0x54, 0x10');
    });
    document.getElementById('btn-sprite-check')?.addEventListener('click', () => {
      setSprite('check', '0x00, 0x01, 0x03, 0x06, 0x8C, 0xD8, 0x70, 0x20');
    });

    document.getElementById('btn-oled-stamp-sprite')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('oledSpriteStamped');
    });

    updateOledScreen();
  }

  function renderOledLesson3(lesson) {
    const hw = window.circuitSimulation.getHardwareState();
    hw.oledWaveType = hw.oledWaveType || 'sine';
    hw.oledWaveFreq = hw.oledWaveFreq || 2;

    taskInteractiveContainer.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📈</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Real-Time Dynamic Telemetry & Oscilloscope Sparklines</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Circular FIFO Ring Buffer (128 Samples) • High-Speed 400kHz I2C Streaming
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-wave-sine" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            ~ Sine Wave
          </button>
          <button class="secondary-btn" id="btn-wave-ecg" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#ec4899; color:#f472b6;">
            💓 ECG Heartbeat
          </button>
          <button class="secondary-btn" id="btn-wave-square" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#eab308; color:#fde047;">
            ⊓ Square Pulse
          </button>
          <button class="secondary-btn" id="btn-wave-noise" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            ⚡ Sensor Noise
          </button>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Oscillation Frequency: <strong id="oled-val-freq" style="color:#38bdf8;">${hw.oledWaveFreq}</strong> Hz</span>
            <span style="color:#86efac;">Buffer Shift: ${(hw.oledWaveFreq * 128 / 10).toFixed(0)} pts/sec</span>
          </div>
          <input type="range" id="oled-slider-freq" min="1" max="10" value="${hw.oledWaveFreq}" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-lock-wave">
            <span>🔒</span> Lock Waveform Capture & Verify Ring Buffer
          </button>
        </div>
      </div>
    `;

    const sliderFreq = document.getElementById('oled-slider-freq');
    const valFreq = document.getElementById('oled-val-freq');

    sliderFreq?.addEventListener('input', (e) => {
      hw.oledWaveFreq = parseInt(e.target.value, 10);
      if (valFreq) valFreq.textContent = hw.oledWaveFreq;
      updateOledScreen();
    });

    document.getElementById('btn-wave-sine')?.addEventListener('click', () => {
      hw.oledWaveType = 'sine'; updateOledScreen();
    });
    document.getElementById('btn-wave-ecg')?.addEventListener('click', () => {
      hw.oledWaveType = 'ecg'; updateOledScreen();
    });
    document.getElementById('btn-wave-square')?.addEventListener('click', () => {
      hw.oledWaveType = 'square'; updateOledScreen();
    });
    document.getElementById('btn-wave-noise')?.addEventListener('click', () => {
      hw.oledWaveType = 'noise'; updateOledScreen();
    });

    document.getElementById('btn-oled-lock-wave')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('oledWaveformCaptured');
    });

    updateOledScreen();
  }

  function renderOledLesson4(lesson) {
    const hw = window.circuitSimulation.getHardwareState();
    hw.oledMenuPage = hw.oledMenuPage !== undefined ? hw.oledMenuPage : 0;

    const pageNames = [
      "1. System Telemetry (CPU, Voltage, Uptime)",
      "2. Sensor Diagnostics (Analog Channels)",
      "3. Network & Cloud Settings (WiFi, MQTT)"
    ];

    taskInteractiveContainer.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🕹️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Embedded UI Menu: Finite State Machine & Inverted Video</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              XOR Inversion Highlighting (SSD1306_INVERSE) • Tactile Keypad Debounce
            </p>
          </div>
        </div>

        <!-- Embedded Navigation Keypad -->
        <div style="display:flex; justify-content:center; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-menu-up" style="font-size:0.85rem; padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8;">
            ▲ UP
          </button>
          <button class="secondary-btn" id="btn-menu-down" style="font-size:0.85rem; padding:0.5rem 1rem; border-color:#0284c7; color:#38bdf8;">
            ▼ DOWN
          </button>
          <button class="secondary-btn" id="btn-menu-select" style="font-size:0.85rem; padding:0.5rem 1.2rem; border-color:#22c55e; color:#86efac; font-weight:800;">
            ● SELECT
          </button>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; margin-bottom:0.75rem;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.3rem;">CURRENT FSM STATE:</div>
          <div id="fsm-status-display" style="color:#38bdf8; font-weight:700;">
            ${pageNames[hw.oledMenuPage]}
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-oled-commit-ui">
            <span>🚀</span> Commit UI Configuration & Launch SparkByte OS
          </button>
        </div>
      </div>
    `;

    function updateMenu(delta) {
      let next = (hw.oledMenuPage + delta) % 3;
      if (next < 0) next = 2;
      hw.oledMenuPage = next;
      const disp = document.getElementById('fsm-status-display');
      if (disp) disp.textContent = pageNames[hw.oledMenuPage];
      if (window.soundEngine) window.soundEngine.playTone(400 + next * 150, 0.05);
      updateOledScreen();
    }

    document.getElementById('btn-menu-up')?.addEventListener('click', () => updateMenu(-1));
    document.getElementById('btn-menu-down')?.addEventListener('click', () => updateMenu(1));
    document.getElementById('btn-menu-select')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      updateMenu(1);
    });

    document.getElementById('btn-oled-commit-ui')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('oledMenuNavigated');
    });

    updateOledScreen();
  }
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, oled_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with OLED lab renderers!")
