# -*- coding: utf-8 -*-
"""
Script to implement Lab 16: MQ-2/MQ-135 Hazardous Gas & AQI Air Quality Detector (gas)
"""

gas_svg = '''
              <!-- LAB 16: MQ-2 / MQ-135 Hazardous Gas & AQI Air Quality Detector (gas) -->
              <g id="gas-circuit-view" style="display: none;">
                <!-- MQ Gas Sensor Breakout Board -->
                <g id="gas-sensor-board" transform="translate(340, 70)">
                  <!-- Dark Royal Blue Industrial PCB -->
                  <rect x="0" y="0" width="145" height="185" rx="6" fill="#1e3a8a" stroke="#2563eb" stroke-width="2" />
                  <rect x="4" y="4" width="137" height="177" rx="4" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.3" />

                  <!-- Mounting Hole -->
                  <circle cx="20" cy="20" r="4.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2" />

                  <!-- MQ Metal Mesh Dome (Cylindrical Gas Sniffer) -->
                  <g transform="translate(72, 60)">
                    <!-- Outer Stainless Steel Mesh Cylinder -->
                    <circle cx="0" cy="0" r="38" fill="#475569" stroke="#cbd5e1" stroke-width="2" />
                    <circle cx="0" cy="0" r="32" fill="#334155" stroke="#94a3b8" stroke-width="1.5" />
                    <!-- Fine Wire Mesh Texture Pattern -->
                    <path d="M -22 -22 L 22 22 M -22 22 L 22 -22 M -30 0 L 30 0 M 0 -30 L 0 30" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2,2" />

                    <!-- Internal Heating Element Glow (Orange/Red Thermal Core) -->
                    <circle id="gas-heater-glow" cx="0" cy="0" r="14" fill="#f97316" opacity="0.85" filter="drop-shadow(0 0 8px #f97316)" />
                    <circle cx="0" cy="0" r="7" fill="#fef08a" />

                    <!-- Molded Sensor Model Label -->
                    <text x="0" y="46" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" text-anchor="middle">MQ-2 SENSOR</text>
                  </g>

                  <!-- Onboard Trimpot (Potentiometer Threshold Adjuster) -->
                  <g transform="translate(20, 115)">
                    <rect x="0" y="0" width="22" height="22" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <circle cx="11" cy="11" r="6" fill="#f8fafc" stroke="#64748b" stroke-width="0.8" />
                    <line x1="7" y1="11" x2="15" y2="11" stroke="#0f172a" stroke-width="1.5" />
                    <text x="11" y="30" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" text-anchor="middle">TRIM</text>
                  </g>

                  <!-- LM393 Dual Comparator IC -->
                  <g transform="translate(55, 118)">
                    <rect x="0" y="0" width="34" height="18" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1" />
                    <text x="17" y="12" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">LM393</text>
                  </g>

                  <!-- 4-Pin Connection Header (VCC, GND, DO, AO) -->
                  <g transform="translate(20, 155)">
                    <!-- Pin 1: VCC (+5V) -->
                    <circle cx="14" cy="14" r="3.5" fill="#991b1b" stroke="#fca5a5" stroke-width="1" />
                    <text x="14" y="8" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" text-anchor="middle">VCC</text>
                    <!-- Pin 2: GND -->
                    <circle cx="44" cy="14" r="3.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
                    <text x="44" y="8" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" text-anchor="middle">GND</text>
                    <!-- Pin 3: DO (Digital Out) -->
                    <circle cx="74" cy="14" r="3.5" fill="#ca8a04" stroke="#fef08a" stroke-width="1" />
                    <text x="74" y="8" fill="#fef08a" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" text-anchor="middle">DO</text>
                    <!-- Pin 4: AO (Analog Out) -->
                    <circle cx="104" cy="14" r="3.5" fill="#0284c7" stroke="#7dd3fc" stroke-width="1" />
                    <text x="104" y="8" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" text-anchor="middle">AO</text>
                  </g>
                </g>

                <!-- Circuit Wires back to Arduino Uno -->
                <!-- Wire 1: VCC (+5V) -->
                <path class="circuit-wire" style="stroke: #ef4444;" d="M 374 239 C 374 310, 260 310, 260 43.5" />
                <circle cx="374" cy="239" r="3.5" fill="#b91c1c" />
                <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />

                <!-- Wire 2: GND -->
                <path class="circuit-wire" style="stroke: #1e293b;" d="M 404 239 C 404 290, 246 290, 246 43.5" />
                <circle cx="404" cy="239" r="3.5" fill="#0f172a" />
                <circle cx="246" cy="43.5" r="4" fill="#0f172a" />

                <!-- Wire 3: DO (Pin 2) -->
                <path class="circuit-wire" style="stroke: #facc15;" d="M 434 239 C 434 325, 500 325, 500 140 C 500 80, 540 43.5, 540 43.5" />
                <circle cx="434" cy="239" r="3.5" fill="#ca8a04" />
                <circle cx="540" cy="43.5" r="4" fill="#ca8a04" />
                <text x="470" y="320" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">DO (Pin 2)</text>

                <!-- Wire 4: AO (Pin A0) -->
                <path class="circuit-wire" style="stroke: #06b6d4;" d="M 464 239 C 464 340, 310 340, 310 140 C 310 80, 276 43.5, 276 43.5" />
                <circle cx="464" cy="239" r="3.5" fill="#0891b2" />
                <circle cx="276" cy="43.5" r="4" fill="#0891b2" />
                <text x="360" y="335" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">AO (Pin A0)</text>

                <!-- Floating Gas & AQI Concentration HUD Gauges -->
                <g transform="translate(500, 80)">
                  <!-- Gauge 1: Gas Concentration PPM -->
                  <rect x="0" y="0" width="105" height="58" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="18" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">🧪 GAS DENSITY</text>
                  <text id="gas-svg-ppm" x="12" y="44" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="19" font-weight="900">120 PPM</text>

                  <!-- Gauge 2: Air Quality Index (AQI) -->
                  <rect x="0" y="68" width="105" height="58" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="86" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">🍃 AIR QUALITY (AQI)</text>
                  <text id="gas-svg-aqi" x="12" y="112" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="19" font-weight="900">45 (Good)</text>

                  <!-- Gauge 3: Digital Threshold Alarm -->
                  <rect x="0" y="136" width="105" height="45" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="152" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">🚨 ALARM STATUS</text>
                  <text id="gas-svg-alarm" x="12" y="171" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">CLEAR (Safe)</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 15: DHT11/DHT22 Digital Climate Station (dht) -->"
if "gas-circuit-view" not in html:
    html = html.replace(target, gas_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("gas-circuit-view SVG inserted successfully!")
else:
    print("gas-circuit-view already in index.html.")
