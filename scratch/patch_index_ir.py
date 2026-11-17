with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add lab button
btn_target = '<button class="lab-switch-btn" id="lab-btn-sonar"'
ir_btn = '''<button class="lab-switch-btn" id="lab-btn-ir" data-lab="ir" title="TCRT5000 infrared reflectance, op-amp comparator threshold, and autonomous dual-sensor rover arena">
            <span class="lab-btn-icon">🏁</span>
            <span class="lab-btn-text">IR Line Sensor</span>
            <span class="lab-btn-badge">L3</span>
          </button>
          <button class="lab-switch-btn" id="lab-btn-sonar"'''

if btn_target in text and 'lab-btn-ir' not in text:
    text = text.replace(btn_target, ir_btn)
    print('Added lab-btn-ir')

# 2. Add ir-circuit-view SVG right after sonar-circuit-view
target_circuit = '              </g>\n\n            </svg>'
ir_circuit = '''              </g>

              <!-- LAB 10: TCRT5000 / KY-033 IR Reflective Line & Obstacle Sensor -->
              <g id="ir-circuit-view" style="display: none;">
                <!-- TCRT5000 IR Sensor Module Board -->
                <g id="tcrt5000-module" transform="translate(340, 140)">
                  <!-- Blue PCB -->
                  <rect x="0" y="0" width="120" height="95" rx="5" fill="#1e3a8a" stroke="#2563eb" stroke-width="2" />
                  <rect x="3" y="3" width="114" height="89" rx="3" fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.25" />
                  
                  <!-- PCB Mounting Holes -->
                  <circle cx="8" cy="8" r="3" fill="#0f172a" stroke="#94a3b8" stroke-width="1" />
                  <circle cx="112" cy="8" r="3" fill="#0f172a" stroke="#94a3b8" stroke-width="1" />

                  <!-- Module Branding -->
                  <text x="60" y="15" fill="#ffffff" font-family="'Inter', sans-serif" font-size="8.5" font-weight="800" text-anchor="middle" letter-spacing="0.5">TCRT5000 IR</text>
                  <text x="60" y="24" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="6.5" text-anchor="middle">LINE TRACKER</text>

                  <!-- TCRT5000 Dual Optical Sensor Head (Black Plastic Package) -->
                  <g id="tcrt-sensor-head" transform="translate(42, 28)">
                    <rect x="0" y="0" width="36" height="24" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
                    <!-- IR Emitter Diode (Blue/Cyan tinted lens) -->
                    <circle cx="10" cy="12" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <circle cx="10" cy="12" r="3" fill="#bae6fd" opacity="0.7" />
                    <text x="10" y="22" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">TX</text>
                    <!-- Phototransistor Detector (Dark tint lens) -->
                    <circle cx="26" cy="12" r="6" fill="#1e293b" stroke="#64748b" stroke-width="1" />
                    <circle cx="26" cy="12" r="3" fill="#0f172a" />
                    <text x="26" y="22" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">RX</text>
                  </g>

                  <!-- LM393 Dual Comparator IC -->
                  <g id="tcrt-lm393" transform="translate(14, 56)">
                    <rect x="0" y="0" width="22" height="15" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1" />
                    <text x="11" y="10" fill="#e2e8f0" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">LM393</text>
                  </g>

                  <!-- 10k Blue Trimmer Calibration Potentiometer -->
                  <g id="tcrt-trimpot" transform="translate(78, 52)">
                    <rect x="0" y="0" width="26" height="22" rx="3" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5" />
                    <!-- Brass Trimmer Screw -->
                    <circle cx="13" cy="11" r="7" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
                    <line id="ir-trimpot-cross" x1="8" y1="11" x2="18" y2="11" stroke="#854d0e" stroke-width="1.8" />
                    <text x="13" y="20" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">103</text>
                  </g>

                  <!-- Onboard Indicator LEDs -->
                  <!-- Power LED (Green) -->
                  <circle cx="20" cy="80" r="2.5" fill="#22c55e" />
                  <text x="20" y="88" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">PWR</text>
                  <!-- Digital Out Line LED (Red) -->
                  <circle id="ir-d0-led" cx="45" cy="80" r="2.5" fill="#7f1d1d" stroke="#ef4444" stroke-width="0.5" />
                  <text x="45" y="88" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">D0</text>

                  <!-- 4-Pin Solder Pads -->
                  <g id="tcrt-pins" transform="translate(68, 85)">
                    <!-- VCC -->
                    <circle cx="0" cy="5" r="3" fill="#e2e8f0" stroke="#b91c1c" stroke-width="1" />
                    <text x="0" y="-1" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">VCC</text>
                    <!-- GND -->
                    <circle cx="12" cy="5" r="3" fill="#e2e8f0" stroke="#1e293b" stroke-width="1" />
                    <text x="12" y="-1" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">GND</text>
                    <!-- D0 (Digital Pin 2) -->
                    <circle cx="24" cy="5" r="3" fill="#e2e8f0" stroke="#ef4444" stroke-width="1" />
                    <text x="24" y="-1" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">D0</text>
                    <!-- A0 (Analog Pin A0) -->
                    <circle cx="36" cy="5" r="3" fill="#e2e8f0" stroke="#0284c7" stroke-width="1" />
                    <text x="36" y="-1" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="5" text-anchor="middle">A0</text>
                  </g>
                </g>

                <!-- Optical Infrared Photon Reflection Beams -->
                <g id="ir-beam-field">
                  <!-- Emitted 940nm IR Down-Beam (Red/Pink gradient ray) -->
                  <path id="ir-ray-tx" d="M 392 180 L 392 270" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.85" />
                  <!-- Reflected IR Up-Beam -->
                  <path id="ir-ray-rx" d="M 408 270 L 408 180" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.3" />
                </g>

                <!-- Test Floor Surface Strip -->
                <g id="ir-surface-strip" transform="translate(320, 270)">
                  <rect id="ir-surface-rect" x="0" y="0" width="160" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
                  <text id="ir-surface-label" x="80" y="19" fill="#0f172a" font-family="'Inter', sans-serif" font-size="10" font-weight="800" text-anchor="middle">WHITE REFLECTIVE SURFACE</text>
                </g>

                <!-- Autonomous 2-Sensor Rover Simulation Arena -->
                <g id="ir-rover-arena" transform="translate(530, 130)">
                  <!-- Arena Floor Background -->
                  <rect x="0" y="0" width="170" height="170" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
                  <!-- Looped Oval Black Race Track -->
                  <path d="M 40 40 H 130 A 45 45 0 0 1 130 130 H 40 A 45 45 0 0 1 40 40 Z" fill="none" stroke="#1e293b" stroke-width="24" />
                  <path d="M 40 40 H 130 A 45 45 0 0 1 130 130 H 40 A 45 45 0 0 1 40 40 Z" fill="none" stroke="#000000" stroke-width="16" />
                  
                  <!-- Autonomous Robotic Rover Chassis -->
                  <g id="ir-rover-chassis" transform="translate(85, 30)">
                    <!-- Rover Body -->
                    <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#f97316" stroke="#ea580c" stroke-width="1.5" />
                    <!-- Wheels (Differential Drive) -->
                    <rect x="-18" y="-14" width="6" height="8" rx="2" fill="#1e293b" />
                    <rect x="-18" y="6" width="6" height="8" rx="2" fill="#1e293b" />
                    <rect x="12" y="-14" width="6" height="8" rx="2" fill="#1e293b" />
                    <rect x="12" y="6" width="6" height="8" rx="2" fill="#1e293b" />
                    <!-- Dual IR Sensors on Front Bumper -->
                    <circle id="rover-sensor-left" cx="14" cy="-5" r="3" fill="#22c55e" stroke="#ffffff" stroke-width="1" />
                    <circle id="rover-sensor-right" cx="14" cy="5" r="3" fill="#22c55e" stroke="#ffffff" stroke-width="1" />
                    <!-- Rover Heading Arrow -->
                    <polygon points="4,-3 9,0 4,3" fill="#ffffff" />
                  </g>

                  <!-- Telemetry Badge inside Arena -->
                  <rect x="25" y="70" width="120" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
                  <text id="rover-telemetry-text" x="85" y="89" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" text-anchor="middle">ROVER: CRUISE ⬆️</text>
                </g>

                <!-- Circuit Wires -->
                <!-- Wire 1: VCC (5V -> TCRT VCC) -->
                <g id="wire-ir-vcc" class="wire-group">
                  <path class="circuit-wire" style="stroke: #ef4444;" d="M 408 230 C 408 260, 260 260, 260 43.5" />
                  <circle cx="408" cy="230" r="3" fill="#b91c1c" />
                  <circle cx="260" cy="43.5" r="4" fill="#b91c1c" />
                </g>

                <!-- Wire 2: GND (GND -> TCRT GND) -->
                <g id="wire-ir-gnd" class="wire-group">
                  <path class="circuit-wire" style="stroke: #1e293b;" d="M 420 230 C 420 280, 246 280, 246 43.5" />
                  <circle cx="420" cy="230" r="3" fill="#0f172a" />
                  <circle cx="246" cy="43.5" r="4" fill="#0f172a" />
                </g>

                <!-- Wire 3: D0 Digital Pin 2 (TCRT D0 -> Arduino Pin 2) -->
                <g id="wire-ir-d0" class="wire-group">
                  <path class="circuit-wire" style="stroke: #ef4444;" d="M 432 230 C 432 300, 260 300, 260 120 C 260 60, 256 43.5, 256 43.5" />
                  <circle cx="432" cy="230" r="3" fill="#b91c1c" />
                  <circle cx="256" cy="43.5" r="4" fill="#b91c1c" />
                  <text x="320" y="295" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">D0 (Pin 2)</text>
                </g>

                <!-- Wire 4: A0 Analog Pin A0 (TCRT A0 -> Arduino Pin A0) -->
                <g id="wire-ir-a0" class="wire-group">
                  <path class="circuit-wire" style="stroke: #0284c7;" d="M 444 230 C 444 320, 280 320, 280 140 C 280 80, 276 43.5, 276 43.5" />
                  <circle cx="444" cy="230" r="3" fill="#0369a1" />
                  <circle cx="276" cy="43.5" r="4" fill="#0369a1" />
                  <text x="350" y="315" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">A0 (Analog A0)</text>
                </g>
              </g>

            </svg>'''

if target_circuit in text and 'ir-circuit-view' not in text:
    text = text.replace(target_circuit, ir_circuit)
    print('Added ir-circuit-view SVG')

text = text.replace('app.js?v=10', 'app.js?v=11')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated index.html for IR!')
