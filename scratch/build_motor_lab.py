# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 19: L298N Dual H-Bridge & 4WD Skid Steer Rover Kinematics (motor)
"""

# -------------------------------------------------------------
# 1. SVG Stage for motor-circuit-view
# -------------------------------------------------------------
motor_svg = '''
              <!-- LAB 19: L298N Dual H-Bridge & 4WD Skid Steer Rover Kinematics (motor) -->
              <g id="motor-circuit-view" style="display: none;">
                <!-- 4WD Rover Chassis Base Plate -->
                <g id="rover-chassis-group" transform="translate(325, 45)">
                  <!-- Dark Smoked Acrylic Chassis Plate -->
                  <rect x="25" y="15" width="170" height="205" rx="12" fill="#090d16" stroke="#38bdf8" stroke-width="2" opacity="0.9" />
                  <rect x="30" y="20" width="160" height="195" rx="8" fill="#0f172a" opacity="0.6" />

                  <!-- Chassis Center Axis Guidelines -->
                  <line x1="110" y1="20" x2="110" y2="215" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4,4" />
                  <text x="110" y="32" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="800" text-anchor="middle">SPARKBYTE 4WD ROVER</text>

                  <!-- 4 Yellow TT Gearmotors & Treaded Wheels -->
                  <!-- Wheel 1: Front-Left -->
                  <g id="wheel-fl" transform="translate(2, 22)">
                    <rect x="0" y="0" width="22" height="48" rx="4" fill="#0f172a" stroke="#f97316" stroke-width="1.8" />
                    <!-- Rubber Tire Tread Notches -->
                    <line x1="2" y1="12" x2="20" y2="12" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="24" x2="20" y2="24" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="36" x2="20" y2="36" stroke="#334155" stroke-width="2" />
                    <circle cx="11" cy="24" r="5" fill="#facc15" />
                    <!-- Yellow Gearbox Case -->
                    <rect x="22" y="8" width="16" height="32" rx="2" fill="#eab308" stroke="#ca8a04" stroke-width="1" />
                    <text id="fl-rpm-badge" x="11" y="27" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="900" text-anchor="middle">▲</text>
                  </g>

                  <!-- Wheel 2: Rear-Left -->
                  <g id="wheel-rl" transform="translate(2, 160)">
                    <rect x="0" y="0" width="22" height="48" rx="4" fill="#0f172a" stroke="#f97316" stroke-width="1.8" />
                    <line x1="2" y1="12" x2="20" y2="12" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="24" x2="20" y2="24" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="36" x2="20" y2="36" stroke="#334155" stroke-width="2" />
                    <circle cx="11" cy="24" r="5" fill="#facc15" />
                    <rect x="22" y="8" width="16" height="32" rx="2" fill="#eab308" stroke="#ca8a04" stroke-width="1" />
                    <text id="rl-rpm-badge" x="11" y="27" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="900" text-anchor="middle">▲</text>
                  </g>

                  <!-- Wheel 3: Front-Right -->
                  <g id="wheel-fr" transform="translate(196, 22)">
                    <rect x="0" y="0" width="22" height="48" rx="4" fill="#0f172a" stroke="#f97316" stroke-width="1.8" />
                    <line x1="2" y1="12" x2="20" y2="12" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="24" x2="20" y2="24" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="36" x2="20" y2="36" stroke="#334155" stroke-width="2" />
                    <circle cx="11" cy="24" r="5" fill="#facc15" />
                    <rect x="-16" y="8" width="16" height="32" rx="2" fill="#eab308" stroke="#ca8a04" stroke-width="1" />
                    <text id="fr-rpm-badge" x="11" y="27" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="900" text-anchor="middle">▲</text>
                  </g>

                  <!-- Wheel 4: Rear-Right -->
                  <g id="wheel-rr" transform="translate(196, 160)">
                    <rect x="0" y="0" width="22" height="48" rx="4" fill="#0f172a" stroke="#f97316" stroke-width="1.8" />
                    <line x1="2" y1="12" x2="20" y2="12" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="24" x2="20" y2="24" stroke="#334155" stroke-width="2" />
                    <line x1="2" y1="36" x2="20" y2="36" stroke="#334155" stroke-width="2" />
                    <circle cx="11" cy="24" r="5" fill="#facc15" />
                    <rect x="-16" y="8" width="16" height="32" rx="2" fill="#eab308" stroke="#ca8a04" stroke-width="1" />
                    <text id="rr-rpm-badge" x="11" y="27" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="900" text-anchor="middle">▲</text>
                  </g>

                  <!-- Central L298N Dual H-Bridge Driver Module -->
                  <g id="l298n-board" transform="translate(62, 58)">
                    <!-- Crimson Red Industrial PCB -->
                    <rect x="0" y="0" width="96" height="110" rx="5" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.8" />

                    <!-- Finned Black Aluminum Heat Sink (Center) -->
                    <rect x="22" y="8" width="52" height="42" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <!-- Vertical Cooling Fins -->
                    <line x1="32" y1="10" x2="32" y2="48" stroke="#334155" stroke-width="2.5" />
                    <line x1="42" y1="10" x2="42" y2="48" stroke="#334155" stroke-width="2.5" />
                    <line x1="52" y1="10" x2="52" y2="48" stroke="#334155" stroke-width="2.5" />
                    <line x1="62" y1="10" x2="62" y2="48" stroke="#334155" stroke-width="2.5" />
                    <text x="48" y="28" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="900" text-anchor="middle">L298N</text>
                    <text x="48" y="37" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4.5" text-anchor="middle">DUAL H-BRIDGE</text>

                    <!-- Left Screw Terminal (OUT1, OUT2) -->
                    <rect x="2" y="58" width="18" height="26" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <circle cx="11" cy="65" r="2.5" fill="#f8fafc" />
                    <circle cx="11" cy="77" r="2.5" fill="#f8fafc" />
                    <text x="11" y="90" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">MOTOR A</text>

                    <!-- Right Screw Terminal (OUT3, OUT4) -->
                    <rect x="76" y="58" width="18" height="26" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1" />
                    <circle cx="85" cy="65" r="2.5" fill="#f8fafc" />
                    <circle cx="85" cy="77" r="2.5" fill="#f8fafc" />
                    <text x="85" y="90" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">MOTOR B</text>

                    <!-- 6-Pin Logic Input Header (ENA, IN1, IN2, IN3, IN4, ENB) at bottom -->
                    <g transform="translate(14, 96)">
                      <rect x="0" y="0" width="68" height="10" rx="1.5" fill="#0f172a" stroke="#334155" stroke-width="0.8" />
                      <circle cx="6" cy="5" r="2" fill="#ca8a04" />
                      <circle cx="17" cy="5" r="2" fill="#2563eb" />
                      <circle cx="28" cy="5" r="2" fill="#2563eb" />
                      <circle cx="39" cy="5" r="2" fill="#2563eb" />
                      <circle cx="50" cy="5" r="2" fill="#2563eb" />
                      <circle cx="61" cy="5" r="2" fill="#ca8a04" />
                      <text x="34" y="-3" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">ENA IN1 IN2 IN3 IN4 ENB</text>
                    </g>
                  </g>
                </g>

                <!-- Floating Kinematics HUD Cards on Right -->
                <g transform="translate(565, 75)">
                  <!-- Card 1: Rover Kinematics State -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🏎️ KINEMATICS</text>
                  <text id="motor-hud-motion" x="12" y="38" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="900">FORWARD</text>

                  <!-- Card 2: Left Wheels Velocity / PWM -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="76" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">⚙️ LEFT TRACK</text>
                  <text id="motor-hud-left" x="12" y="98" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">185 RPM (200)</text>

                  <!-- Card 3: Right Wheels Velocity / PWM -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="136" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">⚙️ RIGHT TRACK</text>
                  <text id="motor-hud-right" x="12" y="158" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">185 RPM (200)</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 18: Smart Agriculture Soil Moisture & 5V Water Relay Control (soil) -->"
if "motor-circuit-view" not in html:
    html = html.replace(target, motor_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("motor-circuit-view SVG inserted into index.html successfully!")
else:
    print("motor-circuit-view already in index.html.")

print("Done step 1.")
