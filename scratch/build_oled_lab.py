# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 17: 0.96" SSD1306 Graphic I2C OLED Display (oled)
"""

# -------------------------------------------------------------
# 1. SVG Stage for oled-circuit-view
# -------------------------------------------------------------
oled_svg = '''
              <!-- LAB 17: 0.96" SSD1306 Graphic I2C OLED Display (oled) -->
              <g id="oled-circuit-view" style="display: none;">
                <!-- OLED Breakout Board -->
                <g id="oled-display-board" transform="translate(340, 65)">
                  <!-- Deep Blue PCB Substrate -->
                  <rect x="0" y="0" width="160" height="195" rx="8" fill="#0f172a" stroke="#2563eb" stroke-width="2" />
                  <rect x="4" y="4" width="152" height="187" rx="6" fill="#1e293b" opacity="0.6" />

                  <!-- Mounting Holes at 4 corners -->
                  <circle cx="12" cy="12" r="3.5" fill="#090d16" stroke="#64748b" stroke-width="1" />
                  <circle cx="148" cy="12" r="3.5" fill="#090d16" stroke="#64748b" stroke-width="1" />
                  <circle cx="12" cy="183" r="3.5" fill="#090d16" stroke="#64748b" stroke-width="1" />
                  <circle cx="148" cy="183" r="3.5" fill="#090d16" stroke="#64748b" stroke-width="1" />

                  <!-- 4-Pin I2C Header at top (GND, VCC, SCL, SDA) -->
                  <g transform="translate(25, 10)">
                    <!-- GND -->
                    <rect x="0" y="0" width="22" height="18" rx="2" fill="#090d16" stroke="#334155" stroke-width="1" />
                    <circle cx="11" cy="9" r="3.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2" />
                    <text x="11" y="26" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">GND</text>

                    <!-- VCC -->
                    <rect x="28" y="0" width="22" height="18" rx="2" fill="#090d16" stroke="#334155" stroke-width="1" />
                    <circle cx="39" cy="9" r="3.5" fill="#991b1b" stroke="#fca5a5" stroke-width="1.2" />
                    <text x="39" y="26" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">VCC</text>

                    <!-- SCL -->
                    <rect x="56" y="0" width="22" height="18" rx="2" fill="#090d16" stroke="#334155" stroke-width="1" />
                    <circle cx="67" cy="9" r="3.5" fill="#ca8a04" stroke="#fef08a" stroke-width="1.2" />
                    <text x="67" y="26" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">SCL</text>

                    <!-- SDA -->
                    <rect x="84" y="0" width="22" height="18" rx="2" fill="#090d16" stroke="#334155" stroke-width="1" />
                    <circle cx="95" cy="9" r="3.5" fill="#0284c7" stroke="#7dd3fc" stroke-width="1.2" />
                    <text x="95" y="26" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">SDA</text>
                  </g>

                  <!-- Board Silkscreen Model Label -->
                  <text x="80" y="44" fill="#60a5fa" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="800" text-anchor="middle">0.96" 128×64 OLED • I2C (0x3C)</text>

                  <!-- OLED Glass Module Enclosure & Screen -->
                  <g transform="translate(10, 48)">
                    <!-- Metal Frame / Glass Bezel -->
                    <rect x="0" y="0" width="140" height="135" rx="4" fill="#020617" stroke="#334155" stroke-width="1.5" />

                    <!-- Active OLED Screen Glass (Deep Emissive Black) -->
                    <rect id="oled-glass-screen" x="5" y="5" width="130" height="125" rx="3" fill="#030712" stroke="#0ea5e9" stroke-width="1.2" />

                    <!-- Screen Header Bar -->
                    <rect x="5" y="5" width="130" height="16" fill="#082f49" />
                    <line x1="5" y1="21" x2="135" y2="21" stroke="#0284c7" stroke-width="0.8" />
                    <text id="oled-svg-title" x="10" y="16" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="800">SPARKBYTE OS</text>
                    <text id="oled-svg-badge" x="102" y="16" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700">● LIVE</text>

                    <!-- Screen Dynamic Graphic & Text Content Area -->
                    <g id="oled-svg-screen-content" transform="translate(8, 26)">
                      <!-- Line 1: Primary Status / Title -->
                      <text id="oled-svg-line1" x="4" y="14" fill="#e0f2fe" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="800">TELEMETRY HUD</text>

                      <!-- Line 2: Telemetry Metrics -->
                      <text id="oled-svg-line2" x="4" y="29" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="600">ADC: 512 | CPU: 38%</text>

                      <!-- Live Sparkline Waveform -->
                      <path id="oled-svg-sparkline" d="M 4 58 Q 20 40, 35 58 T 65 58 T 95 58 T 116 58" fill="none" stroke="#38bdf8" stroke-width="1.8" />

                      <!-- Mini Gauge / Progress Bar -->
                      <rect x="4" y="68" width="112" height="8" rx="2" fill="#082f49" stroke="#0284c7" stroke-width="0.8" />
                      <rect id="oled-svg-bar" x="5" y="69" width="68" height="6" rx="1" fill="#38bdf8" />

                      <!-- Interactive Selection Cursor / Menu indicator -->
                      <rect id="oled-svg-cursor" x="2" y="82" width="116" height="12" rx="2" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="0.8" style="display:none;" />
                      <text id="oled-svg-footer" x="4" y="91" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="600">PAGE: [1/3] DASHBOARD</text>
                    </g>
                  </g>
                </g>

                <!-- Circuit Wires back to Arduino Uno -->
                <!-- Wire 1: GND (Black) -> Arduino GND pin (246, 43.5) -->
                <path class="circuit-wire" style="stroke: #1e293b;" d="M 376 75 C 376 30, 246 30, 246 43.5" />
                <circle cx="376" cy="75" r="3.5" fill="#0f172a" />
                <circle cx="246" cy="43.5" r="4" fill="#0f172a" />

                <!-- Wire 2: VCC (Red) -> Arduino 5V/3.3V pin (260, 43.5) -->
                <path class="circuit-wire" style="stroke: #ef4444;" d="M 404 75 C 404 20, 260 20, 260 43.5" />
                <circle cx="404" cy="75" r="3.5" fill="#b91c1c" />
                <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />

                <!-- Wire 3: SCL (Yellow) -> Arduino Pin A5 (346, 43.5) -->
                <path class="circuit-wire" style="stroke: #eab308;" d="M 432 75 C 432 30, 346 30, 346 43.5" />
                <circle cx="432" cy="75" r="3.5" fill="#ca8a04" />
                <circle cx="346" cy="43.5" r="4" fill="#ca8a04" />
                <text x="390" y="26" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">SCL (A5)</text>

                <!-- Wire 4: SDA (Cyan) -> Arduino Pin A4 (332, 43.5) -->
                <path class="circuit-wire" style="stroke: #06b6d4;" d="M 460 75 C 460 38, 332 38, 332 43.5" />
                <circle cx="460" cy="75" r="3.5" fill="#0891b2" />
                <circle cx="332" cy="43.5" r="4" fill="#0891b2" />
                <text x="435" y="38" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">SDA (A4)</text>

                <!-- Floating OLED Diagnostics & Bus HUD -->
                <g transform="translate(520, 75)">
                  <!-- Card 1: VRAM Buffer -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🖥️ VRAM BUFFER</text>
                  <text id="oled-hud-vram" x="12" y="38" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">1,024 B</text>

                  <!-- Card 2: I2C Speed -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#06b6d4" stroke-width="1.2" />
                  <text x="12" y="76" fill="#a5f3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">⚡ I2C CLOCK</text>
                  <text id="oled-hud-clock" x="12" y="98" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">400 kHz</text>

                  <!-- Card 3: Frame Rate -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="136" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">⏱️ REFRESH RATE</text>
                  <text id="oled-hud-fps" x="12" y="158" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">42 FPS</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 16: MQ-2"
if "oled-circuit-view" not in html:
    html = html.replace(target, oled_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("oled-circuit-view SVG inserted into index.html successfully!")
else:
    print("oled-circuit-view already in index.html.")

print("Done step 1.")
