# -*- coding: utf-8 -*-
"""
Script to implement Lab 13: Virtual Multimeter & Circuit Troubleshooting Diagnostics (dmm)
"""

dmm_svg = '''
              <!-- LAB 13: Virtual Multimeter & Circuit Troubleshooting (dmm) -->
              <g id="dmm-circuit-view" style="display: none;">
                <!-- Multimeter Enclosure (Yellow Shockproof Rubber Holster) -->
                <g id="dmm-unit" transform="translate(245, 35)">
                  <!-- Outer Yellow Rugged Shell -->
                  <rect x="0" y="0" width="145" height="240" rx="16" fill="#eab308" stroke="#ca8a04" stroke-width="2.5" filter="drop-shadow(0 6px 16px rgba(0,0,0,0.5))" />
                  <!-- Inner Dark Slate Chassis -->
                  <rect x="6" y="6" width="133" height="228" rx="12" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />

                  <!-- Model Brand Label -->
                  <text x="72" y="24" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" text-anchor="middle">ATL-2000 DIGITAL MULTIMETER</text>
                  <text x="72" y="32" fill="#eab308" font-family="'JetBrains Mono', monospace" font-size="6" text-anchor="middle">CAT II 600V • AUTO POLARITY</text>

                  <!-- 4-Digit High-Contrast Liquid Crystal Display -->
                  <g transform="translate(14, 38)">
                    <!-- LCD Glass Bezel -->
                    <rect x="0" y="0" width="117" height="50" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
                    <!-- Backlit Screen (Soft Pale Green Glow) -->
                    <rect x="4" y="4" width="109" height="42" rx="2" fill="#ecfccb" stroke="#a3e635" stroke-width="0.8" />
                    <!-- Segment Readout Display -->
                    <text id="dmm-svg-lcd" x="106" y="35" fill="#14532d" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="22" font-weight="900" text-anchor="end" letter-spacing="1">5.00 V</text>
                    <!-- Small Annunciators -->
                    <text id="dmm-svg-annun" x="10" y="16" fill="#3f6212" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">DC  AUTO</text>
                    <text id="dmm-svg-unit" x="10" y="40" fill="#3f6212" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">VOLTS DC</text>
                  </g>

                  <!-- Rotary Dial Function Switch -->
                  <g transform="translate(72, 135)">
                    <!-- Dial Dial Background Plate -->
                    <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
                    <!-- Range Notches & Labels -->
                    <text x="0" y="-23" fill="#ef4444" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">OFF</text>
                    <text x="24" y="-12" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">DCV</text>
                    <text x="25" y="14" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">Ω</text>
                    <text x="0" y="27" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">🔊 CONT</text>
                    <text x="-24" y="8" fill="#ec4899" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">DCA</text>

                    <!-- Rotating Knob Selector with Center Grip -->
                    <g id="dmm-svg-knob" transform="rotate(45)">
                      <circle cx="0" cy="0" r="22" fill="#334155" stroke="#475569" stroke-width="1.5" />
                      <!-- Knob Ridges -->
                      <line x1="-15" y1="0" x2="15" y2="0" stroke="#1e293b" stroke-width="2" />
                      <line x1="0" y1="-15" x2="0" y2="15" stroke="#1e293b" stroke-width="2" />
                      <!-- Pointer Arrow Notch -->
                      <polygon points="0,-22 4,-14 -4,-14" fill="#ffffff" />
                    </g>
                  </g>

                  <!-- Banana Input Jacks -->
                  <g transform="translate(0, 198)">
                    <!-- COM Ground Jack (Black) -->
                    <circle cx="45" cy="14" r="8" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
                    <circle cx="45" cy="14" r="4" fill="#020617" />
                    <text x="45" y="30" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">COM</text>

                    <!-- V/Ω/mA Input Jack (Red) -->
                    <circle cx="100" cy="14" r="8" fill="#991b1b" stroke="#ef4444" stroke-width="1.5" />
                    <circle cx="100" cy="14" r="4" fill="#450a0a" />
                    <text x="100" y="30" fill="#f87171" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">V Ω mA</text>
                  </g>
                </g>

                <!-- Breadboard Test Stage with Clickable Diagnostic Circuit Nodes -->
                <g id="dmm-test-board" transform="translate(415, 45)">
                  <!-- Mini Breadboard PCB -->
                  <rect x="0" y="0" width="180" height="225" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
                  <rect x="5" y="5" width="170" height="215" rx="5" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />

                  <!-- Power Rails (+ Red, - Blue) -->
                  <line x1="18" y1="15" x2="18" y2="210" stroke="#ef4444" stroke-width="3" />
                  <line x1="26" y1="15" x2="26" y2="210" stroke="#3b82f6" stroke-width="3" />

                  <!-- Circuit Components on Breadboard -->
                  <!-- 1. Jumper Wire from Arduino 5V to Node A -->
                  <path d="M 18 35 C 18 55, 60 55, 60 70" stroke="#ef4444" stroke-width="3" fill="none" />
                  <circle cx="60" cy="70" r="3.5" fill="#ef4444" />

                  <!-- 2. Resistor 220 Ohm (Node A to Node B) -->
                  <g id="dmm-resistor-graphic" transform="translate(60, 70)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#94a3b8" stroke-width="2" />
                    <!-- Resistor Body (Tan Ceramic) -->
                    <rect x="-6" y="12" width="12" height="28" rx="3" fill="#fed7aa" stroke="#f97316" stroke-width="1" />
                    <!-- 4 Color Bands: Red (2), Red (2), Brown (x10), Gold (5%) = 220 Ohm -->
                    <rect x="-6" y="16" width="12" height="3" fill="#dc2626" />
                    <rect x="-6" y="22" width="12" height="3" fill="#dc2626" />
                    <rect x="-6" y="28" width="12" height="3" fill="#78350f" />
                    <rect x="-6" y="34" width="12" height="2.5" fill="#eab308" />
                    <line x1="0" y1="40" x2="0" y2="52" stroke="#94a3b8" stroke-width="2" />
                  </g>

                  <!-- 3. Red LED (Node B to Node C) -->
                  <g id="dmm-led-graphic" transform="translate(60, 122)">
                    <!-- LED Bulb Plastic Dome -->
                    <circle cx="0" cy="18" r="12" fill="#ef4444" opacity="0.9" stroke="#dc2626" stroke-width="1.5" />
                    <ellipse cx="-3" cy="14" rx="4" ry="7" fill="#ffffff" opacity="0.4" />
                    <line x1="0" y1="30" x2="0" y2="48" stroke="#94a3b8" stroke-width="2" />
                  </g>

                  <!-- 4. Ground Return Wire (Node C to GND Rail) -->
                  <path d="M 60 170 C 60 190, 26 190, 26 190" stroke="#1e293b" stroke-width="3" fill="none" />
                  <circle cx="26" cy="190" r="3.5" fill="#0f172a" />

                  <!-- 5 Clickable Test Contact Nodes (A, B, C, D, E) -->
                  <g id="dmm-nodes-group">
                    <!-- Node 1: +5V Rail Contact -->
                    <g class="dmm-node-pin" data-node="5V" transform="translate(18, 35)" cursor="pointer">
                      <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
                      <text x="12" y="3" fill="#b91c1c" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">Node 1 (+5V Rail)</text>
                    </g>

                    <!-- Node 2: Resistor Input -->
                    <g class="dmm-node-pin" data-node="R_IN" transform="translate(60, 70)" cursor="pointer">
                      <circle cx="0" cy="0" r="7" fill="#f97316" stroke="#ffffff" stroke-width="1.5" />
                      <text x="12" y="3" fill="#c2410c" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">Node 2 (Resistor In)</text>
                    </g>

                    <!-- Node 3: Resistor Output / LED Anode -->
                    <g class="dmm-node-pin" data-node="LED_ANODE" transform="translate(60, 122)" cursor="pointer">
                      <circle cx="0" cy="0" r="7" fill="#eab308" stroke="#ffffff" stroke-width="1.5" />
                      <text x="12" y="3" fill="#a16207" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">Node 3 (LED Anode +)</text>
                    </g>

                    <!-- Node 4: LED Cathode Output -->
                    <g class="dmm-node-pin" data-node="LED_CATHODE" transform="translate(60, 170)" cursor="pointer">
                      <circle cx="0" cy="0" r="7" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
                      <text x="12" y="3" fill="#047857" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">Node 4 (LED Cathode -)</text>
                    </g>

                    <!-- Node 5: Ground Rail Return -->
                    <g class="dmm-node-pin" data-node="GND" transform="translate(26, 190)" cursor="pointer">
                      <circle cx="0" cy="0" r="7" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
                      <text x="12" y="3" fill="#1d4ed8" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">Node 5 (GND Return)</text>
                    </g>
                  </g>

                  <!-- Live Test Probes Vector Lines -->
                  <g id="dmm-probes-layer">
                    <!-- Red Positive Probe Line -->
                    <line id="dmm-probe-wire-red" x1="-70" y1="212" x2="60" y2="70" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
                    <!-- Red Needle Tip -->
                    <circle id="dmm-probe-tip-red" cx="60" cy="70" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />

                    <!-- Black Negative Probe Line -->
                    <line id="dmm-probe-wire-black" x1="-125" y1="212" x2="26" y2="190" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
                    <!-- Black Needle Tip -->
                    <circle id="dmm-probe-tip-black" cx="26" cy="190" r="3.5" fill="#0f172a" stroke="#ffffff" stroke-width="1" />
                  </g>
                </g>

                <!-- Floating Diagnostic Status Pill -->
                <g transform="translate(245, 280)">
                  <rect x="0" y="0" width="350" height="26" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="#334155" stroke-width="1" />
                  <text id="dmm-status-text" x="12" y="16" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">Probing: Node 2 (Resistor In) to Node 5 (GND) • V = 5.00V</text>
                  <circle id="dmm-status-beep" cx="335" cy="13" r="4" fill="#94a3b8" />
                </g>
              </g>
'''

# 1. Insert dmm_svg into index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'id="dmm-circuit-view"' not in html:
    target_marker = '              <!-- LAB 12: 3D CAD Modeling Studio (Tinkercad CSG Primitives) -->'
    html = html.replace(target_marker, dmm_svg.strip() + "\n\n" + target_marker)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("dmm-circuit-view SVG inserted into index.html!")
else:
    print("dmm-circuit-view already in index.html.")

print("Step 1 Complete.")
