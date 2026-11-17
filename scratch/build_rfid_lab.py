# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 21: RC522 13.56MHz RFID Access Control System (rfid)
"""

# -------------------------------------------------------------
# 1. SVG Stage for rfid-circuit-view
# -------------------------------------------------------------
rfid_svg = '''
              <!-- LAB 21: RC522 13.56MHz RFID Access Control System (rfid) -->
              <g id="rfid-circuit-view" style="display: none;">
                <!-- RC522 RFID Reader Board -->
                <g id="rc522-board" transform="translate(325, 55)">
                  <!-- Deep Blue PCB -->
                  <rect x="0" y="0" width="105" height="155" rx="6" fill="#1e3a8a" stroke="#2563eb" stroke-width="1.8" />
                  <rect x="4" y="4" width="97" height="147" rx="4" fill="#172554" opacity="0.6" />

                  <!-- Concentric PCB Trace Antenna Coils (13.56MHz Loop Antenna) -->
                  <g transform="translate(10, 10)">
                    <rect x="0" y="0" width="85" height="70" rx="4" fill="none" stroke="#d97706" stroke-width="1.5" />
                    <rect x="3" y="3" width="79" height="64" rx="3" fill="none" stroke="#f59e0b" stroke-width="1.2" />
                    <rect x="6" y="6" width="73" height="58" rx="2" fill="none" stroke="#d97706" stroke-width="1" />
                    <text x="42" y="38" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="800" text-anchor="middle">13.56MHz ANTENNA</text>
                  </g>

                  <!-- Magnetic Induction Waves (Animated on Card Tap) -->
                  <g id="rfid-flux-waves" transform="translate(52, 45)" style="display: none;">
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.9" />
                    <circle cx="0" cy="0" r="38" fill="none" stroke="#06b6d4" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.6" />
                  </g>

                  <!-- MFRC522 IC Chip & 27.12MHz Crystal Oscillator -->
                  <g transform="translate(38, 92)">
                    <rect x="0" y="0" width="28" height="28" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1" />
                    <text x="14" y="12" fill="#f8fafc" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="900" text-anchor="middle">MFRC</text>
                    <text x="14" y="20" fill="#f8fafc" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="900" text-anchor="middle">522</text>
                    <!-- Metal Can Crystal -->
                    <rect x="-18" y="6" width="12" height="16" rx="2" fill="#94a3b8" stroke="#cbd5e1" stroke-width="0.8" />
                    <text x="-12" y="16" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="3" text-anchor="middle">27M</text>
                  </g>

                  <!-- 8-Pin SPI Connection Header at bottom -->
                  <g transform="translate(10, 136)">
                    <circle cx="5" cy="8" r="2" fill="#0284c7" />
                    <circle cx="16" cy="8" r="2" fill="#ca8a04" />
                    <circle cx="27" cy="8" r="2" fill="#06b6d4" />
                    <circle cx="38" cy="8" r="2" fill="#06b6d4" />
                    <circle cx="49" cy="8" r="2" fill="#334155" />
                    <circle cx="60" cy="8" r="2" fill="#0f172a" />
                    <circle cx="71" cy="8" r="2" fill="#22c55e" />
                    <circle cx="82" cy="8" r="2" fill="#991b1b" />
                    <text x="43" y="1" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="700" text-anchor="middle">SDA SCK MOSI MISO IRQ GND RST 3.3V</text>
                  </g>
                </g>

                <!-- Scannable RFID Transponders & Door Latch -->
                <!-- 1. Blue Teardrop Keyfob -->
                <g id="rfid-keyfob-group" transform="translate(450, 60)">
                  <path d="M 25 0 C 40 0, 50 15, 50 35 C 50 55, 35 68, 25 68 C 15 68, 0 55, 0 35 C 0 15, 10 0, 25 0 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.8" />
                  <circle cx="25" cy="10" r="4.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.2" /> <!-- Keychain Hole -->
                  <circle cx="25" cy="40" r="16" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2" /> <!-- Micro Coil -->
                  <rect x="21" y="36" width="8" height="8" rx="1" fill="#0f172a" stroke="#f59e0b" stroke-width="0.8" />
                  <text x="25" y="60" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="800" text-anchor="middle">A3 7F 4E 12</text>
                  <text x="25" y="49" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">KEYFOB</text>
                </g>

                <!-- 2. White Smart Card -->
                <g id="rfid-card-group" transform="translate(450, 145)">
                  <rect x="0" y="0" width="55" height="42" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2" />
                  <!-- Embedded Chip & Wire Coil Silkscreen -->
                  <rect x="8" y="14" width="10" height="12" rx="1" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" />
                  <text x="8" y="36" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="800">D9 1C 88 5B</text>
                  <text x="8" y="9" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="3.5">MIFARE 1K</text>
                </g>

                <!-- Servo Door Latch & Security Status Group -->
                <g id="door-latch-group" transform="translate(525, 75)">
                  <!-- Dark Metal Door Lock Housing -->
                  <rect x="0" y="0" width="38" height="95" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
                  <text x="19" y="12" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">DOOR LOCK</text>

                  <!-- Status LEDs -->
                  <circle id="rfid-led-green" cx="19" cy="24" r="3.5" fill="#14532d" stroke="#16a34a" stroke-width="0.8" />
                  <text x="19" y="33" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">PASS</text>

                  <circle id="rfid-led-red" cx="19" cy="42" r="3.5" fill="#7f1d1d" stroke="#dc2626" stroke-width="0.8" />
                  <text x="19" y="51" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">DENY</text>

                  <!-- Rotating Mechanical Servo Latch Bolt -->
                  <g id="rfid-latch-bolt" transform="translate(19, 72) rotate(0)">
                    <rect x="-4" y="-12" width="28" height="8" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1" />
                    <circle cx="0" cy="-8" r="3" fill="#f59e0b" />
                  </g>
                  <text id="latch-status-text" x="19" y="90" fill="#ef4444" font-family="'JetBrains Mono', monospace" font-size="3.5" font-weight="800" text-anchor="middle">LOCKED</text>
                </g>

                <!-- Floating Security Diagnostics HUD Cards on Right -->
                <g transform="translate(580, 70)">
                  <!-- Card 1: Card UID -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">💳 TRANSPONDER UID</text>
                  <text id="rfid-hud-uid" x="12" y="38" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="900">A3 7F 4E 12</text>

                  <!-- Card 2: Access Control Status -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="76" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🔐 SECURITY LOCK</text>
                  <text id="rfid-hud-status" x="12" y="98" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">ACCESS GRANTED</text>

                  <!-- Card 3: Wallet Balance -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="136" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">💰 SECTOR 1 WALLET</text>
                  <text id="rfid-hud-wallet" x="12" y="158" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="900">$150.00</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 20: MPU6050 6-Axis IMU (Gyro + Accel, Pitch/Roll Gimbal) (imu) -->"
if "rfid-circuit-view" not in html:
    html = html.replace(target, rfid_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("rfid-circuit-view SVG inserted into index.html successfully!")
else:
    print("rfid-circuit-view already in index.html.")

print("Done step 1.")
