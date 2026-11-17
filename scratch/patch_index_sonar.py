import sys

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '              </g>\n\n            </svg>'
replacement = '''              </g>

              <!-- LAB 9: HC-SR04 Ultrasonic Distance Sensor & Reverse Parking Radar -->
              <g id="sonar-circuit-view" style="display: none;">
                <!-- Acoustic Radar Sweep Beam & Echo Field -->
                <g id="sonar-wave-field">
                  <!-- Emitted 40kHz Ultrasound Ripples (Cyan) -->
                  <path id="sonar-ping-arc-1" class="sonar-wave" d="M 430 150 A 60 60 0 0 1 430 230" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
                  <path id="sonar-ping-arc-2" class="sonar-wave" d="M 460 135 A 95 95 0 0 1 460 245" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
                  <path id="sonar-ping-arc-3" class="sonar-wave" d="M 495 120 A 135 135 0 0 1 495 260" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
                  
                  <!-- Returning Echo Ripples (Amber) -->
                  <path id="sonar-echo-arc-1" class="sonar-echo-wave" d="M 530 125 A 120 120 0 0 0 530 255" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" opacity="0.75" />
                  <path id="sonar-echo-arc-2" class="sonar-echo-wave" d="M 490 140 A 85 85 0 0 0 490 240" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" opacity="0.55" />
                </g>

                <!-- HC-SR04 Ultrasonic Sensor Module -->
                <g id="hcsr04-module" transform="translate(320, 140)">
                  <!-- Blue PCB Board -->
                  <rect x="0" y="0" width="130" height="90" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="2" />
                  <rect x="3" y="3" width="124" height="84" rx="4" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3" />
                  
                  <!-- PCB Mounting Holes -->
                  <circle cx="8" cy="8" r="3.5" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" />
                  <circle cx="122" cy="8" r="3.5" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" />
                  <circle cx="8" cy="82" r="3.5" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" />
                  <circle cx="122" cy="82" r="3.5" fill="#1e293b" stroke="#e2e8f0" stroke-width="1" />

                  <!-- Module Branding Text -->
                  <text x="65" y="16" fill="#ffffff" font-family="'Inter', sans-serif" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="0.5">HC-SR04</text>
                  <text x="65" y="78" fill="#bae6fd" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="600" text-anchor="middle">ULTRASONIC</text>

                  <!-- 16MHz Crystal Oscillator -->
                  <rect x="54" y="26" width="22" height="12" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="1" />
                  <text x="65" y="35" fill="#1e293b" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" text-anchor="middle">16.0M</text>

                  <!-- Ultrasonic Transducer T (Transmitter Can) -->
                  <g id="transducer-t">
                    <circle cx="32" cy="45" r="24" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
                    <circle cx="32" cy="45" r="20" fill="#94a3b8" stroke="#334155" stroke-width="1" />
                    <circle cx="32" cy="45" r="14" fill="#64748b" opacity="0.6" />
                    <circle cx="32" cy="45" r="8" fill="#334155" />
                    <circle cx="32" cy="45" r="6" fill="#0284c7" />
                    <text x="32" y="48.5" fill="#ffffff" font-family="'Inter', sans-serif" font-size="8" font-weight="900" text-anchor="middle">T</text>
                  </g>

                  <!-- Ultrasonic Transducer R (Receiver Can) -->
                  <g id="transducer-r">
                    <circle cx="98" cy="45" r="24" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
                    <circle cx="98" cy="45" r="20" fill="#94a3b8" stroke="#334155" stroke-width="1" />
                    <circle cx="98" cy="45" r="14" fill="#64748b" opacity="0.6" />
                    <circle cx="98" cy="45" r="8" fill="#334155" />
                    <circle cx="98" cy="45" r="6" fill="#059669" />
                    <text x="98" y="48.5" fill="#ffffff" font-family="'Inter', sans-serif" font-size="8" font-weight="900" text-anchor="middle">R</text>
                  </g>

                  <!-- 4-Pin Header Male Solder Pads -->
                  <g id="hcsr04-pins" transform="translate(38, 85)">
                    <circle cx="0" cy="5" r="3.5" fill="#e2e8f0" stroke="#b91c1c" stroke-width="1.5" />
                    <text x="0" y="-1" fill="#fee2e2" font-family="'JetBrains Mono', monospace" font-size="6" text-anchor="middle">VCC</text>
                    <circle cx="18" cy="5" r="3.5" fill="#e2e8f0" stroke="#0284c7" stroke-width="1.5" />
                    <text x="18" y="-1" fill="#e0f2fe" font-family="'JetBrains Mono', monospace" font-size="6" text-anchor="middle">TRIG</text>
                    <circle cx="36" cy="5" r="3.5" fill="#e2e8f0" stroke="#d97706" stroke-width="1.5" />
                    <text x="36" y="-1" fill="#fef3c7" font-family="'JetBrains Mono', monospace" font-size="6" text-anchor="middle">ECHO</text>
                    <circle cx="54" cy="5" r="3.5" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5" />
                    <text x="54" y="-1" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="6" text-anchor="middle">GND</text>
                  </g>
                </g>

                <!-- Movable Target Obstacle / Car Bumper -->
                <g id="sonar-obstacle-target" transform="translate(620, 130)" style="cursor: ew-resize;">
                  <rect x="0" y="0" width="38" height="110" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2" />
                  <path d="M 0 15 L 38 40 M 0 35 L 38 60 M 0 55 L 38 80 M 0 75 L 38 100" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
                  <rect x="4" y="4" width="30" height="102" rx="5" fill="none" stroke="#f8fafc" stroke-width="1.5" />
                  <circle cx="19" cy="55" r="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
                  <text x="19" y="58" fill="#38bdf8" font-family="'Inter', sans-serif" font-size="10" font-weight="900" text-anchor="middle">↔</text>
                </g>

                <!-- Dynamic Acoustic Distance Ruler Dimension Line -->
                <g id="sonar-dimension-ruler">
                  <line id="sonar-ruler-line" x1="450" y1="115" x2="620" y2="115" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" />
                  <circle id="sonar-ruler-start" cx="450" cy="115" r="4" fill="#0284c7" />
                  <circle id="sonar-ruler-end" cx="620" cy="115" r="4" fill="#38bdf8" />
                  <rect id="sonar-dist-pill" x="500" y="98" width="70" height="22" rx="11" fill="#0f172a" stroke="#0284c7" stroke-width="1.5" />
                  <text id="sonar-dist-text" x="535" y="113" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" text-anchor="middle">45.0 cm</text>
                </g>

                <!-- Alert Sub-circuit: Warning LED & Buzzer -->
                <g id="sonar-buzzer-accessory" transform="translate(560, 290)">
                  <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#334155" stroke-width="2" />
                  <circle cx="0" cy="0" r="4" fill="#0284c7" />
                  <text x="0" y="28" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7" text-anchor="middle">RADAR BUZZER</text>
                  <path id="sonar-buzzer-ring-1" d="M -12 -12 A 18 18 0 0 1 12 -12" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0" />
                  <path id="sonar-buzzer-ring-2" d="M -18 -18 A 26 26 0 0 1 18 -18" fill="none" stroke="#ef4444" stroke-width="2" opacity="0" />
                </g>

                <g id="sonar-led-accessory" transform="translate(630, 290)">
                  <circle id="sonar-led-glow" cx="0" cy="0" r="22" fill="#ef4444" opacity="0" />
                  <circle id="sonar-led-bulb" cx="0" cy="0" r="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5" />
                  <text x="0" y="24" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7" text-anchor="middle">ALERT LED</text>
                </g>

                <!-- Circuit Wires -->
                <g id="wire-sonar-vcc" class="wire-group">
                  <path class="circuit-wire" style="stroke: #ef4444;" d="M 358 230 C 358 280, 260 280, 260 200 C 260 140, 260 43.5, 260 43.5" />
                  <circle cx="358" cy="230" r="3.5" fill="#b91c1c" />
                  <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />
                </g>

                <g id="wire-sonar-trig" class="wire-group">
                  <path class="circuit-wire" style="stroke: #06b6d4;" d="M 376 230 C 376 310, 160 310, 160 180 C 160 80, 153 43.5, 153 43.5" />
                  <circle cx="376" cy="230" r="3.5" fill="#0891b2" />
                  <circle cx="153" cy="43.5" r="4" fill="#0891b2" />
                  <text x="230" y="275" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">TRIG (Pin 12)</text>
                </g>

                <g id="wire-sonar-echo" class="wire-group">
                  <path class="circuit-wire" style="stroke: #f59e0b;" d="M 394 230 C 394 290, 175 290, 175 160 C 175 80, 166 43.5, 166 43.5" />
                  <circle cx="394" cy="230" r="3.5" fill="#d97706" />
                  <circle cx="166" cy="43.5" r="4" fill="#d97706" />
                  <text x="280" y="295" fill="#fcd34d" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">ECHO (Pin 11)</text>
                </g>

                <g id="wire-sonar-gnd" class="wire-group">
                  <path class="circuit-wire" style="stroke: #1e293b;" d="M 412 230 C 412 330, 246 330, 246 150 C 246 80, 246 43.5, 246 43.5" />
                  <circle cx="412" cy="230" r="3.5" fill="#0f172a" />
                  <circle cx="246" cy="43.5" r="4" fill="#0f172a" />
                </g>

                <g id="wire-sonar-buzzer" class="wire-group">
                  <path class="circuit-wire" style="stroke: #8b5cf6;" d="M 205 43.5 C 205 120, 560 120, 560 272" />
                  <circle cx="205" cy="43.5" r="4" fill="#6d28d9" />
                  <circle cx="560" cy="272" r="3.5" fill="#6d28d9" />
                  <text x="360" y="75" fill="#c4b5fd" font-family="'JetBrains Mono', monospace" font-size="8">BUZZER (Pin 8)</text>
                </g>

                <g id="wire-sonar-led" class="wire-group">
                  <path class="circuit-wire" style="stroke: #ef4444;" d="M 140 43.5 C 140 100, 630 100, 630 282" />
                  <circle cx="140" cy="43.5" r="4" fill="#b91c1c" />
                  <circle cx="630" cy="282" r="3.5" fill="#b91c1c" />
                  <text x="320" y="95" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="8">LED (Pin 13)</text>
                </g>
              </g>

            </svg>'''

if target in text and 'sonar-circuit-view' not in text:
    text = text.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Inserted sonar-circuit-view successfully!')
else:
    print('Target not matched or already present')
