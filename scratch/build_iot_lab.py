# -*- coding: utf-8 -*-
"""
Script to build and integrate Lab 22: ESP32 IoT Cloud Telemetry & MQTT / ThingSpeak Dashboard (iot)
"""

# -------------------------------------------------------------
# 1. SVG Stage for iot-circuit-view
# -------------------------------------------------------------
iot_svg = '''
              <!-- LAB 22: ESP32 IoT Cloud Telemetry & MQTT Dashboard (iot) -->
              <g id="iot-circuit-view" style="display: none;">
                <!-- ESP-32 DevKit v1 Board -->
                <g id="esp32-board" transform="translate(325, 45)">
                  <!-- Matte Black Dual-Sided PCB -->
                  <rect x="0" y="0" width="105" height="185" rx="6" fill="#090d16" stroke="#0ea5e9" stroke-width="2" />
                  <rect x="4" y="4" width="97" height="177" rx="4" fill="#0f172a" opacity="0.6" />

                  <!-- ESP-WROOM-32 Meandered PCB Trace Antenna (Inverted-F 2.4GHz Antenna) -->
                  <g transform="translate(22, 10)">
                    <rect x="0" y="0" width="60" height="22" rx="2" fill="#78350f" stroke="#d97706" stroke-width="1" />
                    <!-- Gold Meandering Trace Geometry -->
                    <path d="M 5 18 H 15 V 5 H 25 V 18 H 35 V 5 H 45 V 18 H 55" stroke="#facc15" stroke-width="2" stroke-linecap="round" fill="none" />
                    <text x="30" y="30" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="800" text-anchor="middle">2.4GHz Wi-Fi / BLE</text>
                  </g>

                  <!-- ESP-WROOM-32 Nickel-Plated RF Shielding Metal Can -->
                  <g transform="translate(16, 42)">
                    <rect x="0" y="0" width="72" height="78" rx="3" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" />
                    <text x="36" y="24" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="900" text-anchor="middle">ESP-WROOM-32</text>
                    <text x="36" y="36" fill="#1e293b" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700" text-anchor="middle">ESPRESSIF</text>
                    <text x="36" y="48" fill="#334155" font-family="'JetBrains Mono', monospace" font-size="4" text-anchor="middle">XTENSA DUAL-CORE</text>
                    <text x="36" y="58" fill="#475569" font-family="'JetBrains Mono', monospace" font-size="4" text-anchor="middle">240MHz • 520KB SRAM</text>
                    <text x="36" y="68" fill="#2563eb" font-family="'JetBrains Mono', monospace" font-size="4" font-weight="700" text-anchor="middle">FCC ID: 2AC7Z-ESPWROOM32</text>
                  </g>

                  <!-- Micro-USB Jack at Bottom -->
                  <rect x="36" y="172" width="32" height="14" rx="2" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1" />
                  <rect x="42" y="176" width="20" height="7" rx="1" fill="#0f172a" />

                  <!-- Status LEDs -->
                  <circle cx="20" cy="140" r="3" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
                  <text x="20" y="148" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">PWR</text>

                  <circle id="esp32-blue-led" cx="85" cy="140" r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                  <text x="85" y="148" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">IO2</text>

                  <!-- EN and BOOT Buttons -->
                  <rect x="15" y="156" width="12" height="10" rx="1" fill="#334155" />
                  <text x="21" y="153" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">EN</text>

                  <rect x="78" y="156" width="12" height="10" rx="1" fill="#334155" />
                  <text x="84" y="153" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="3.5" text-anchor="middle">BOOT</text>
                </g>

                <!-- Animated Wireless Wi-Fi RF Uplink Beams -->
                <g id="wifi-uplink-beams" transform="translate(435, 75)">
                  <path d="M 0 0 C 15 -10, 20 10, 35 0" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" fill="none" opacity="0.9" />
                  <path d="M 0 15 C 15 5, 20 25, 35 15" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3,3" fill="none" opacity="0.7" />
                  <text x="18" y="-6" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">MQTT 1883</text>
                </g>

                <!-- Cloud IoT Telemetry Dashboard Window (Right Side) -->
                <g id="cloud-dashboard-screen" transform="translate(475, 45)">
                  <!-- Dark Glassmorphic Web Dashboard Container -->
                  <rect x="0" y="0" width="145" height="185" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" stroke-width="1.8" />
                  
                  <!-- Browser Window Top Title Bar -->
                  <rect x="0" y="0" width="145" height="18" rx="8" fill="#1e293b" />
                  <line x1="0" y1="18" x2="145" y2="18" stroke="#334155" stroke-width="1" />
                  <circle cx="8" cy="9" r="2.5" fill="#ef4444" />
                  <circle cx="16" cy="9" r="2.5" fill="#eab308" />
                  <circle cx="24" cy="9" r="2.5" fill="#22c55e" />
                  <text x="75" y="13" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="800" text-anchor="middle">cloud.sparkbyte.io</text>

                  <!-- Cloud Telemetry Widgets -->
                  <g transform="translate(10, 26)">
                    <!-- Status Banner -->
                    <rect x="0" y="0" width="125" height="18" rx="3" fill="#082f49" stroke="#0284c7" stroke-width="0.8" />
                    <text x="8" y="12" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="800">● BROKER CONNECTED</text>
                    <text x="96" y="12" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="5">28ms</text>

                    <!-- Metric 1: Temperature Sensor Sparkline -->
                    <rect x="0" y="24" width="125" height="38" rx="3" fill="#090d16" stroke="#1e293b" stroke-width="1" />
                    <text x="6" y="34" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">TEMPERATURE STREAM (QoS 1)</text>
                    <text id="cloud-val-temp" x="6" y="52" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="900">26.4 °C</text>
                    <path d="M 65 50 Q 80 40, 95 48 T 120 44" stroke="#38bdf8" stroke-width="1.5" fill="none" />

                    <!-- Metric 2: Air Quality Index (AQI) -->
                    <rect x="0" y="68" width="125" height="38" rx="3" fill="#090d16" stroke="#1e293b" stroke-width="1" />
                    <text x="6" y="78" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">AIR QUALITY (AQI PPM)</text>
                    <text id="cloud-val-aqi" x="6" y="96" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="900">AQI 45 (Good)</text>
                    <path d="M 65 94 Q 85 85, 100 92 T 120 88" stroke="#10b981" stroke-width="1.5" fill="none" />

                    <!-- Remote Cloud Actuator Relay Switch -->
                    <rect x="0" y="112" width="125" height="34" rx="3" fill="#082f49" stroke="#0ea5e9" stroke-width="0.8" />
                    <text x="6" y="124" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="4.5" font-weight="700">REMOTE RELAY DOWNLINK</text>
                    <rect id="cloud-switch-bg" x="6" y="130" width="36" height="12" rx="6" fill="#10b981" />
                    <circle id="cloud-switch-knob" cx="36" cy="136" r="5" fill="#ffffff" />
                    <text id="cloud-switch-label" x="48" y="139" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="800">FAN: ON</text>
                  </g>
                </g>

                <!-- Floating IoT Network HUD Cards on Right -->
                <g transform="translate(630, 65)">
                  <!-- Card 1: IP Address -->
                  <rect x="0" y="0" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
                  <text x="12" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">🌐 IP ADDRESS</text>
                  <text id="iot-hud-ip" x="12" y="38" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="900">192.168.1.105</text>

                  <!-- Card 2: MQTT Broker Ping -->
                  <rect x="0" y="60" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.2" />
                  <text x="12" y="76" fill="#86efac" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">📡 MQTT BROKER</text>
                  <text id="iot-hud-mqtt" x="12" y="98" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="900">CONNECTED (28ms)</text>

                  <!-- Card 3: Packets Streamed -->
                  <rect x="0" y="120" width="105" height="52" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.2" />
                  <text x="12" y="136" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">📊 PACKETS SENT</text>
                  <text id="iot-hud-pkts" x="12" y="158" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="900">1,248 Pkts</text>
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 21: RC522 13.56MHz RFID Access Control System (rfid) -->"
if "iot-circuit-view" not in html:
    html = html.replace(target, iot_svg.strip() + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("iot-circuit-view SVG inserted into index.html successfully!")
else:
    print("iot-circuit-view already in index.html.")

print("Done step 1.")
