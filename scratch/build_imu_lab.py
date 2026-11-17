# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 20: MPU6050 6-Axis IMU (imu)
"""

# -------------------------------------------------------------
# 1. SVG Stage for imu-circuit-view
# -------------------------------------------------------------
imu_svg = '''
              <!-- LAB 20: MPU6050 6-Axis IMU (Gyro + Accel, Pitch/Roll Gimbal) (imu) -->
              <g id="imu-circuit-view" style="display: none;">
                <!-- MPU-6050 Breakout Board -->
                <g id="mpu6050-board" transform="translate(325, 65)">
                  <!-- Deep Royal Blue PCB -->
                  <rect x="0" y="0" width="85" height="120" rx="5" fill="#1e3a8a" stroke="#2563eb" stroke-width="1.8" />
                  <rect x="4" y="4" width="77" height="112" rx="3" fill="#172554" opacity="0.6" />

                  <!-- Mounting Hole -->
                  <circle cx="70" cy="15" r="4.5" fill="#0f172a" stroke="#64748b" stroke-width="1.2" />

                  <!-- MPU-6050 QFN-24 IC Package (InvenSense) -->
                  <g transform="translate(35, 55)">
                    <rect x="-18" y="-18" width="36" height="36" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <circle cx="-12" cy="-12" r="1.5" fill="#f59e0b" /> <!-- Pin 1 Dot -->
                    <text x="0" y="-3" fill="#f8fafc" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="900" text-anchor="middle">MPU</text>
                    <text x="0" y="5" fill="#f8fafc" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="900" text-anchor="middle">6050</text>
                    <text x="0" y="13" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">6-DOF MEMS</text>
                  </g>

                  <!-- 8-Pin Header on Left (VCC, GND, SCL, SDA, XDA, XCL, AD0, INT) -->
                  <g transform="translate(10, 10)">
                    <circle cx="0" cy="8" r="2.5" fill="#991b1b" stroke="#fca5a5" stroke-width="0.8" />
                    <text x="6" y="10" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">VCC</text>

                    <circle cx="0" cy="21" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.8" />
                    <text x="6" y="23" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">GND</text>

                    <circle cx="0" cy="34" r="2.5" fill="#ca8a04" stroke="#fef08a" stroke-width="0.8" />
                    <text x="6" y="36" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">SCL</text>

                    <circle cx="0" cy="47" r="2.5" fill="#0284c7" stroke="#7dd3fc" stroke-width="0.8" />
                    <text x="6" y="49" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">SDA</text>

                    <circle cx="0" cy="60" r="2.2" fill="#334155" />
                    <text x="6" y="62" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4">XDA</text>

                    <circle cx="0" cy="73" r="2.2" fill="#334155" />
                    <text x="6" y="75" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4">XCL</text>

                    <circle cx="0" cy="86" r="2.2" fill="#334155" />
                    <text x="6" y="88" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4">AD0</text>

                    <circle cx="0" cy="99" r="2.5" fill="#16a34a" stroke="#86efac" stroke-width="0.8" />
                    <text x="6" y="101" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">INT</text>
                  </g>

                  <!-- Board Axis Reference Silkscreen -->
                  <g transform="translate(62, 95)">
                    <path d="M 0 0 V -18 M 0 0 H 18" stroke="#38bdf8" stroke-width="1.2" />
                    <text x="12" y="-4" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="800">+X</text>
                    <text x="-6" y="-12" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="800">+Y</text>
                  </g>
                </g>

                <!-- Primary Flight Display (PFD) / Artificial Horizon Instrument -->
                <g id="pfd-instrument" transform="translate(485, 125)">
                  <!-- Instrument Outer Metal Bezel -->
                  <circle cx="0" cy="0" r="62" fill="#0b1329" stroke="#334155" stroke-width="5" />
                  <circle cx="0" cy="0" r="58" fill="none" stroke="#38bdf8" stroke-width="1.5" />

                  <!-- Rotating Artificial Horizon Ball (Group rotated by Pitch/Roll) -->
                  <g id="imu-horizon-rot" clip-path="url(#pfd-clip)">
                    <clipPath id="pfd-clip">
                      <circle cx="0" cy="0" r="56" />
                    </clipPath>

                    <!-- Sky Hemisphere (Cyan Blue) -->
                    <rect id="imu-horizon-sky" x="-70" y="-70" width="140" height="70" fill="#0284c7" />
                    <!-- Ground Hemisphere (Earthy Brown) -->
                    <rect id="imu-horizon-ground" x="-70" y="0" width="140" height="70" fill="#78350f" />
                    <!-- White Horizon Separator Line -->
                    <line x1="-70" y1="0" x2="70" y2="0" stroke="#ffffff" stroke-width="2.5" />

                    <!-- Pitch Ladder Graduations (+10°, +20°, -10°, -20°) -->
                    <line x1="-18" y1="-15" x2="18" y2="-15" stroke="#ffffff" stroke-width="1.5" />
                    <text x="22" y="-13" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">10</text>
                    <line x1="-12" y1="-30" x2="12" y2="-30" stroke="#ffffff" stroke-width="1.5" />
                    <text x="16" y="-28" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">20</text>
                    <line x1="-18" y1="15" x2="18" y2="15" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,2" />
                    <text x="22" y="17" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">-10</text>
                    <line x1="-12" y1="30" x2="12" y2="30" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,2" />
                    <text x="16" y="32" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">-20</text>
                  </g>

                  <!-- Fixed Center Aircraft Reticle (Yellow Wings) -->
                  <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                  <path d="M -24 0 H -8 V 5 M 24 0 H 8 V 5" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" fill="none" />

                  <!-- Roll Arc Index at Top -->
                  <polygon points="0,-52 -4,-46 4,-46" fill="#facc15" />
                  <text x="0" y="50" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="800" text-anchor="middle">ARTIFICIAL HORIZON</text>
                </g>

                <!-- Circuit Wires to Arduino Uno -->
                <!-- SCL Wire (Yellow) -> Arduino Pin A5 -->
                <path class="circuit-wire" style="stroke: #eab308;" d="M 325 99 C 325 35, 346 35, 346 43.5" />
                <circle cx="325" cy="99" r="3" fill="#ca8a04" />
                <circle cx="346" cy="43.5" r="4" fill="#ca8a04" />

                <!-- SDA Wire (Cyan) -> Arduino Pin A4 -->
                <path class="circuit-wire" style="stroke: #06b6d4;" d="M 325 112 C 325 42, 332 42, 332 43.5" />
                <circle cx="325" cy="112" r="3" fill="#0891b2" />
                <circle cx="332" cy="43.5" r="4" fill="#0891b2" />

                <!-- Floating 6-DOF HUD Cards on Right -->
                <g transform="translate(570, 75)">
                  <!-- Card 1: Pitch & Roll -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">📐 PITCH & ROLL</text>
                  <text id="imu-hud-angles" x="12" y="38" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">P:+0.0° R:+0.0°</text>

                  <!-- Card 2: Gyro Angular Rates -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="76" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🌀 GYROSCOPE RATE</text>
                  <text id="imu-hud-gyro" x="12" y="98" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">0.0 °/s (Rest)</text>

                  <!-- Card 3: Accel Gravity Vector -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="136" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🚀 GRAVITY VECTOR</text>
                  <text id="imu-hud-accel" x="12" y="158" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">1.00G (Az ~ 1G)</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 19: L298N Dual H-Bridge & 4WD Skid Steer Rover Kinematics (motor) -->"
if "imu-circuit-view" not in html:
    html = html.replace(target, imu_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("imu-circuit-view SVG inserted into index.html successfully!")
else:
    print("imu-circuit-view already in index.html.")

print("Done step 1.")
