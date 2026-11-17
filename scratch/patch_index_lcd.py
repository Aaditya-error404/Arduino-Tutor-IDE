with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add lab button
btn_target = '<button class="lab-switch-btn" id="lab-btn-ir"'
lcd_btn = '''<button class="lab-switch-btn" id="lab-btn-lcd" data-lab="lcd" title="16x2 I2C Character LCD Display, custom 5x8 pixel typography, and multi-sensor IoT telemetry dashboard">
            <span class="lab-btn-icon">📟</span>
            <span class="lab-btn-text">16x2 I2C LCD</span>
            <span class="lab-btn-badge">L3</span>
          </button>
          <button class="lab-switch-btn" id="lab-btn-ir"'''

if btn_target in text and 'lab-btn-lcd' not in text:
    text = text.replace(btn_target, lcd_btn)
    print('Added lab-btn-lcd')

# 2. Add lcd-circuit-view SVG right after ir-circuit-view
target_circuit = '              </g>\n\n            </svg>'
lcd_circuit = '''              </g>

              <!-- LAB 11: 16x2 I2C Character LCD Display -->
              <g id="lcd-circuit-view" style="display: none;">
                <!-- HD44780 16x2 Character LCD Module Board -->
                <g id="lcd1602-module" transform="translate(320, 115)">
                  <!-- Dark Emerald Green Industrial PCB -->
                  <rect x="0" y="0" width="250" height="135" rx="6" fill="#064e3b" stroke="#047857" stroke-width="2" />
                  <rect x="4" y="4" width="242" height="127" rx="4" fill="none" stroke="#34d399" stroke-width="1" opacity="0.2" />

                  <!-- 4 PCB Corner Mounting Screws -->
                  <circle cx="9" cy="9" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
                  <circle cx="241" cy="9" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
                  <circle cx="9" cy="126" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
                  <circle cx="241" cy="126" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />

                  <!-- Metal Bezel Frame (Matte Black/Silver) -->
                  <rect x="18" y="18" width="214" height="78" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1.5" />

                  <!-- Backlit Liquid Crystal Display Panel -->
                  <g id="lcd-screen-panel">
                    <!-- Glass Background (Dynamic Blue Glow) -->
                    <rect id="lcd-backlight-glass" x="24" y="24" width="202" height="66" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <!-- Subtle Glass Glare Highlight -->
                    <path d="M 24 24 L 226 24 L 180 40 L 24 40 Z" fill="#ffffff" opacity="0.12" />

                    <!-- Monospace Dot-Matrix Display Lines -->
                    <text id="lcd-svg-line-0" x="32" y="52" fill="#ffffff" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="13" font-weight="900" letter-spacing="1.5">I2C Bus Ready!  </text>
                    <text id="lcd-svg-line-1" x="32" y="78" fill="#ffffff" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="13" font-weight="900" letter-spacing="1.5">Address: 0x27   </text>
                  </g>

                  <!-- PCF8574 I2C Backpack Daughterboard (Top Left Pins) -->
                  <g id="pcf8574-backpack" transform="translate(18, 102)">
                    <rect x="0" y="0" width="85" height="26" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1" />
                    <text x="42" y="11" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">PCF8574 I2C</text>
                    <text x="42" y="21" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="600" text-anchor="middle">ADDR: 0x27</text>
                  </g>

                  <!-- 4-Pin I2C Header Connection Block -->
                  <g id="i2c-pins" transform="translate(120, 102)">
                    <!-- Pin 1: GND -->
                    <circle cx="10" cy="13" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
                    <text x="10" y="8" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">GND</text>
                    <!-- Pin 2: VCC -->
                    <circle cx="35" cy="13" r="3.5" fill="#b91c1c" stroke="#fca5a5" stroke-width="1" />
                    <text x="35" y="8" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">VCC</text>
                    <!-- Pin 3: SDA (Data) -->
                    <circle cx="60" cy="13" r="3.5" fill="#0284c7" stroke="#7dd3fc" stroke-width="1" />
                    <text x="60" y="8" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">SDA</text>
                    <!-- Pin 4: SCL (Clock) -->
                    <circle cx="85" cy="13" r="3.5" fill="#ca8a04" stroke="#fef08a" stroke-width="1" />
                    <text x="85" y="8" fill="#fef08a" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">SCL</text>
                  </g>
                </g>

                <!-- Circuit Wires for 2-Wire I2C Bus -->
                <!-- Wire 1: GND (GND Pin -> Arduino GND) -->
                <g id="wire-lcd-gnd" class="wire-group">
                  <path class="circuit-wire" style="stroke: #1e293b;" d="M 450 230 C 450 290, 246 290, 246 43.5" />
                  <circle cx="450" cy="230" r="3.5" fill="#0f172a" />
                  <circle cx="246" cy="43.5" r="4" fill="#0f172a" />
                </g>

                <!-- Wire 2: VCC (+5V Pin -> Arduino 5V) -->
                <g id="wire-lcd-vcc" class="wire-group">
                  <path class="circuit-wire" style="stroke: #ef4444;" d="M 475 230 C 475 310, 260 310, 260 43.5" />
                  <circle cx="475" cy="230" r="3.5" fill="#b91c1c" />
                  <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />
                </g>

                <!-- Wire 3: SDA (I2C Serial Data -> Arduino Pin A4) -->
                <g id="wire-lcd-sda" class="wire-group">
                  <path class="circuit-wire" style="stroke: #06b6d4;" d="M 500 230 C 500 330, 310 330, 310 140 C 310 80, 305 43.5, 305 43.5" />
                  <circle cx="500" cy="230" r="3.5" fill="#0891b2" />
                  <circle cx="305" cy="43.5" r="4" fill="#0891b2" />
                  <text x="390" y="325" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">SDA (Pin A4)</text>
                </g>

                <!-- Wire 4: SCL (I2C Serial Clock -> Arduino Pin A5) -->
                <g id="wire-lcd-scl" class="wire-group">
                  <path class="circuit-wire" style="stroke: #facc15;" d="M 525 230 C 525 345, 325 345, 325 140 C 325 80, 316 43.5, 316 43.5" />
                  <circle cx="525" cy="230" r="3.5" fill="#ca8a04" />
                  <circle cx="316" cy="43.5" r="4" fill="#ca8a04" />
                  <text x="440" y="340" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">SCL (Pin A5)</text>
                </g>
              </g>

            </svg>'''

if target_circuit in text and 'lcd-circuit-view' not in text:
    text = text.replace(target_circuit, lcd_circuit)
    print('Added lcd-circuit-view SVG')

text = text.replace('app.js?v=13', 'app.js?v=14')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated index.html for LCD!')
