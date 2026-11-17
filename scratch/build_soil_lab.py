# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 18: Smart Agriculture Soil Moisture & 5V Water Relay Control (soil)
"""

# -------------------------------------------------------------
# 1. SVG Stage for soil-circuit-view
# -------------------------------------------------------------
soil_svg = '''
              <!-- LAB 18: Smart Agriculture Soil Moisture & 5V Water Relay Control (soil) -->
              <g id="soil-circuit-view" style="display: none;">
                <!-- Plant Pot & Soil Section -->
                <g id="soil-pot-group" transform="translate(325, 60)">
                  <!-- Terracotta Flower Pot -->
                  <polygon points="15,115 35,195 115,195 135,115" fill="#c2410c" stroke="#9a3412" stroke-width="2" />
                  <rect x="10" y="105" width="130" height="15" rx="3" fill="#ea580c" stroke="#9a3412" stroke-width="1.5" />

                  <!-- Soil Fill (Dark Loam) -->
                  <ellipse cx="75" cy="115" rx="58" ry="12" fill="#3e2723" stroke="#271c19" stroke-width="1.5" />

                  <!-- Moisture Visual Wetness Overlay -->
                  <ellipse id="soil-svg-wetness" cx="75" cy="115" rx="56" ry="10" fill="#0284c7" opacity="0.35" />

                  <!-- Green Plant & Leaves -->
                  <g transform="translate(75, 110)">
                    <!-- Central Stem -->
                    <path d="M 0 0 C -5 -25, 5 -45, 0 -70" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round" fill="none" />
                    <!-- Left Leaf -->
                    <path d="M -3 -30 C -25 -38, -35 -20, -38 -45 C -20 -40, -5 -35, -2 -32" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
                    <!-- Right Leaf -->
                    <path d="M 2 -45 C 25 -55, 38 -35, 40 -60 C 22 -55, 5 -50, 1 -47" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
                    <!-- Top Sprout Leaf -->
                    <path d="M 0 -70 C -12 -88, 0 -95, 0 -95 C 0 -95, 12 -88, 0 -70" fill="#4ade80" stroke="#16a34a" stroke-width="1.2" />
                  </g>

                  <!-- Capacitive Moisture Sensor v1.2 inserted into soil -->
                  <g id="soil-sensor-probe" transform="translate(35, 55)">
                    <!-- Sensor Handle / Upper PCB -->
                    <rect x="0" y="0" width="28" height="35" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" />
                    <text x="14" y="10" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700" text-anchor="middle">CAPACITIVE</text>
                    <text x="14" y="17" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700" text-anchor="middle">SOIL v1.2</text>
                    <!-- NE555 Timer Chip -->
                    <rect x="8" y="21" width="12" height="9" rx="1" fill="#0f172a" stroke="#334155" stroke-width="0.8" />

                    <!-- Lower Capacitive Blade / PCB Probes inserted down into soil -->
                    <rect x="4" y="35" width="20" height="75" rx="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" />
                    <!-- Isolated Copper Sensing Traces (No Exposed Metal = Zero Corrosion) -->
                    <path d="M 9 40 V 102 M 19 40 V 102" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" />

                    <!-- Probe 3-Pin Header (VCC, GND, AOUT) -->
                    <circle cx="6" cy="6" r="2.2" fill="#991b1b" stroke="#fca5a5" stroke-width="0.8" />
                    <circle cx="14" cy="6" r="2.2" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.8" />
                    <circle cx="22" cy="6" r="2.2" fill="#0284c7" stroke="#7dd3fc" stroke-width="0.8" />
                  </g>
                </g>

                <!-- 5V Optocoupled Relay Module -->
                <g id="soil-relay-module" transform="translate(475, 65)">
                  <!-- Dark Royal Blue PCB Base -->
                  <rect x="0" y="0" width="85" height="85" rx="5" fill="#1e3a8a" stroke="#2563eb" stroke-width="1.8" />

                  <!-- Blue Cube Electromechanical Relay (SONGLE 5VDC) -->
                  <rect id="relay-cube" x="22" y="8" width="55" height="42" rx="3" fill="#2563eb" stroke="#60a5fa" stroke-width="1.5" />
                  <text x="49" y="24" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="800" text-anchor="middle">SONGLE</text>
                  <text x="49" y="34" fill="#bfdbfe" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="600" text-anchor="middle">SRD-05VDC</text>
                  <text x="49" y="43" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="4.5" text-anchor="middle">10A 250VAC</text>

                  <!-- Status LEDs -->
                  <!-- Red Power LED -->
                  <circle cx="10" cy="15" r="3" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
                  <text x="10" y="24" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="4" text-anchor="middle">PWR</text>
                  <!-- Green Relay Activated LED -->
                  <circle id="relay-active-led" cx="10" cy="35" r="3" fill="#1e293b" stroke="#15803d" stroke-width="0.8" />
                  <text x="10" y="44" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="4" text-anchor="middle">ACT</text>

                  <!-- PC817 Optocoupler IC (Galvanic Isolation Barrier) -->
                  <rect x="8" y="52" width="16" height="12" rx="1.5" fill="#0f172a" stroke="#64748b" stroke-width="0.8" />
                  <text x="16" y="60" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">PC817</text>

                  <!-- 3-Pin Logic Header at bottom (VCC, GND, IN) -->
                  <circle cx="12" cy="74" r="2.5" fill="#991b1b" stroke="#fca5a5" stroke-width="0.8" />
                  <circle cx="24" cy="74" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.8" />
                  <circle cx="36" cy="74" r="2.5" fill="#ca8a04" stroke="#fef08a" stroke-width="0.8" />

                  <!-- High-Voltage / Load Screw Terminals (NO, COM, NC) -->
                  <g transform="translate(48, 56)">
                    <rect x="0" y="0" width="30" height="22" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <circle cx="6" cy="11" r="3" fill="#f8fafc" stroke="#475569" stroke-width="1" />
                    <circle cx="15" cy="11" r="3" fill="#f8fafc" stroke="#475569" stroke-width="1" />
                    <circle cx="24" cy="11" r="3" fill="#f8fafc" stroke="#475569" stroke-width="1" />
                    <text x="6" y="20" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="700" text-anchor="middle">NO</text>
                    <text x="15" y="20" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="700" text-anchor="middle">COM</text>
                    <text x="24" y="20" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="700" text-anchor="middle">NC</text>
                  </g>
                </g>

                <!-- Submersible 12V Water Pump & Irrigation Tube -->
                <g id="soil-pump-group" transform="translate(490, 175)">
                  <!-- Submersible Water Pump Cylinder -->
                  <rect x="0" y="10" width="55" height="42" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
                  <circle cx="12" cy="31" r="9" fill="#1e293b" stroke="#0284c7" stroke-width="1" />
                  <text x="35" y="28" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="800">12V PUMP</text>
                  <text id="soil-pump-status-label" x="35" y="38" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="5">STANDBY</text>

                  <!-- Flexible Irrigation Water Hose running from Pump nozzle to Plant Pot -->
                  <path id="soil-water-hose" d="M 12 10 C 12 -40, -80 -40, -95 -2" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.8" />

                  <!-- Spraying Water Droplets (Animated when pump is active) -->
                  <g id="soil-water-spray" style="display: none;">
                    <circle cx="-95" cy="5" r="2.5" fill="#38bdf8" />
                    <circle cx="-98" cy="14" r="2.2" fill="#60a5fa" />
                    <circle cx="-92" cy="18" r="2.8" fill="#38bdf8" />
                    <circle cx="-96" cy="28" r="3.2" fill="#0284c7" />
                  </g>
                </g>

                <!-- Wires to Arduino Uno -->
                <!-- Capacitive Sensor Signal (AOUT) -> Arduino Pin A1 -->
                <path class="circuit-wire" style="stroke: #06b6d4;" d="M 382 61 C 382 30, 290 30, 290 43.5" />
                <circle cx="382" cy="61" r="3" fill="#0891b2" />
                <circle cx="290" cy="43.5" r="4" fill="#0891b2" />
                <text x="330" y="26" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">AOUT (A1)</text>

                <!-- Relay Logic Trigger (IN) -> Arduino Pin 7 -->
                <path class="circuit-wire" style="stroke: #f59e0b;" d="M 511 139 C 511 260, 480 260, 480 43.5" />
                <circle cx="511" cy="139" r="3" fill="#d97706" />
                <circle cx="480" cy="43.5" r="4" fill="#d97706" />
                <text x="500" y="250" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">RELAY IN (D7)</text>

                <!-- Floating Diagnostics HUD on Right -->
                <g transform="translate(565, 75)">
                  <!-- Card 1: Soil Moisture Percentage -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="16" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🌱 SOIL MOISTURE</text>
                  <text id="soil-hud-pct" x="12" y="38" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">42% (Optimal)</text>

                  <!-- Card 2: Relay Switch State -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="76" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">⚡ 5V RELAY STATE</text>
                  <text id="soil-hud-relay" x="12" y="98" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">OFF (NO Open)</text>

                  <!-- Card 3: Water Pump Status -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#06b6d4" stroke-width="1.2" />
                  <text x="12" y="136" fill="#a5f3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">💧 IRRIGATION PUMP</text>
                  <text id="soil-hud-pump" x="12" y="158" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900">IDLE</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 17: 0.96\" SSD1306 Graphic I2C OLED Display (oled) -->"
if "soil-circuit-view" not in html:
    html = html.replace(target, soil_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("soil-circuit-view SVG inserted into index.html successfully!")
else:
    print("soil-circuit-view already in index.html.")

print("Done step 1.")
