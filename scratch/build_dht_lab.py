# -*- coding: utf-8 -*-
"""
Script to implement Lab 15: DHT11/DHT22 Digital Climate Station (dht)
"""

dht_svg = '''
              <!-- LAB 15: DHT11/DHT22 Digital Climate Station (dht) -->
              <g id="dht-circuit-view" style="display: none;">
                <!-- DHT Sensor Breakout Module Board -->
                <g id="dht-module-board" transform="translate(350, 75)">
                  <!-- Dark Royal Blue Breakout PCB -->
                  <rect x="0" y="0" width="130" height="175" rx="6" fill="#1e3a8a" stroke="#2563eb" stroke-width="2" />
                  <rect x="4" y="4" width="122" height="167" rx="4" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.3" />

                  <!-- Mounting Screwhole -->
                  <circle cx="65" cy="18" r="4.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2" />

                  <!-- DHT11/22 Signature Blue Perforated Sensor Case -->
                  <g transform="translate(20, 32)">
                    <rect x="0" y="0" width="90" height="90" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />
                    <!-- Humidity Ingestion Grill Slots -->
                    <rect x="15" y="15" width="60" height="6" rx="2" fill="#075985" />
                    <rect x="15" y="28" width="60" height="6" rx="2" fill="#075985" />
                    <rect x="15" y="41" width="60" height="6" rx="2" fill="#075985" />
                    <rect x="15" y="54" width="60" height="6" rx="2" fill="#075985" />
                    <rect x="15" y="67" width="60" height="6" rx="2" fill="#075985" />

                    <!-- Molded Sensor Model Imprint -->
                    <text x="45" y="84" fill="#bae6fd" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">DHT11 SENSOR</text>
                  </g>

                  <!-- SMD Power Indicator LED (Red) & 4.7k Pull-up Resistor -->
                  <g transform="translate(25, 128)">
                    <rect x="0" y="0" width="6" height="4" fill="#22c55e" />
                    <circle cx="3" cy="2" r="1.5" fill="#86efac" />
                    <text x="12" y="5" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="5.5">PWR LED</text>
                    <rect x="55" y="0" width="10" height="4" fill="#1e293b" stroke="#64748b" stroke-width="0.8" />
                    <text x="70" y="5" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="5.5">4.7kΩ PU</text>
                  </g>

                  <!-- 3-Pin Header Block (VCC, DATA, GND) -->
                  <g transform="translate(30, 142)">
                    <!-- Pin 1: VCC (+5V) -->
                    <circle cx="10" cy="18" r="4" fill="#991b1b" stroke="#fca5a5" stroke-width="1.2" />
                    <text x="10" y="10" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">VCC</text>
                    <!-- Pin 2: DATA (Single-Bus) -->
                    <circle cx="35" cy="18" r="4" fill="#0284c7" stroke="#7dd3fc" stroke-width="1.2" />
                    <text x="35" y="10" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">DATA</text>
                    <!-- Pin 3: GND -->
                    <circle cx="60" cy="18" r="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.2" />
                    <text x="60" y="10" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">GND</text>
                  </g>
                </g>

                <!-- Jumper Circuit Wires back to Arduino Uno -->
                <!-- Wire 1: VCC (Pin 1 -> Arduino 5V) -->
                <path class="circuit-wire" style="stroke: #ef4444;" d="M 390 235 C 390 310, 260 310, 260 43.5" />
                <circle cx="390" cy="235" r="3.5" fill="#b91c1c" />
                <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />

                <!-- Wire 2: DATA (Pin 2 -> Arduino Pin 4) -->
                <path class="circuit-wire" style="stroke: #06b6d4;" d="M 415 235 C 415 325, 490 325, 490 140 C 490 80, 520 43.5, 520 43.5" />
                <circle cx="415" cy="235" r="3.5" fill="#0891b2" />
                <circle cx="520" cy="43.5" r="4" fill="#0891b2" />
                <text x="460" y="320" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">DATA (Pin 4)</text>

                <!-- Wire 3: GND (Pin 3 -> Arduino GND) -->
                <path class="circuit-wire" style="stroke: #1e293b;" d="M 440 235 C 440 290, 246 290, 246 43.5" />
                <circle cx="440" cy="235" r="3.5" fill="#0f172a" />
                <circle cx="246" cy="43.5" r="4" fill="#0f172a" />

                <!-- Floating Climate HUD Gauges in Circuit View -->
                <g transform="translate(500, 85)">
                  <!-- Gauge 1: Temperature Readout -->
                  <rect x="0" y="0" width="105" height="58" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#ef4444" stroke-width="1.2" />
                  <text x="12" y="18" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">🌡️ AMBIENT TEMP</text>
                  <text id="dht-svg-temp" x="12" y="44" fill="#ef4444" font-family="'JetBrains Mono', monospace" font-size="19" font-weight="900">28.5°C</text>

                  <!-- Gauge 2: Relative Humidity Readout -->
                  <rect x="0" y="68" width="105" height="58" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#06b6d4" stroke-width="1.2" />
                  <text x="12" y="86" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">💧 REL HUMIDITY</text>
                  <text id="dht-svg-rh" x="12" y="112" fill="#06b6d4" font-family="'JetBrains Mono', monospace" font-size="19" font-weight="900">65.0%</text>

                  <!-- Gauge 3: Heat Index / Perceived Comfort -->
                  <rect x="0" y="136" width="105" height="45" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="152" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">☀️ FEELS LIKE</text>
                  <text id="dht-svg-hi" x="12" y="171" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">31.2°C (Warn)</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'id="dht-circuit-view"' not in html:
    target_marker = '              <!-- LAB 14: 3D Slicing & G-Code Studio (slicer) -->'
    html = html.replace(target_marker, dht_svg.strip() + "\n\n" + target_marker)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("dht-circuit-view SVG inserted into index.html!")
else:
    print("dht-circuit-view already in index.html.")
