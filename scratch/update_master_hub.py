# -*- coding: utf-8 -*-
"""
Generate complete 22-Lab / 88-Lesson ATL Curriculum Hub Dashboard
"""

hub_html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ATL Curriculum Hub (Grades 6–12 • 22 Labs • 88 Lessons)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 antialiased p-3 m-0 text-xs select-none min-h-screen">
  <div class="space-y-3 max-w-7xl mx-auto">
    <!-- Top Header Ribbon -->
    <div class="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800 gap-2">
      <div class="flex items-center gap-2">
        <span class="flex h-2.5 w-2.5 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="font-extrabold tracking-tight text-white text-sm">SparkByte ATL Curriculum Hub</span>
        <span class="text-[10px] text-cyan-400 font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">AIM NITI Aayog • Grades 6–12</span>
      </div>

      <!-- Grade Band Filters -->
      <div class="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
        <button id="filter-all" onclick="filterLevel('all')" class="lvl-btn active px-2.5 py-1 rounded font-semibold transition-all bg-cyan-600 text-white">All (22 Labs • 88 Lessons)</button>
        <button id="filter-l1" onclick="filterLevel('L1')" class="lvl-btn px-2.5 py-1 rounded font-medium transition-all text-slate-400 hover:text-white">🌱 Grades 6–8 (7 Labs)</button>
        <button id="filter-l2" onclick="filterLevel('L2')" class="lvl-btn px-2.5 py-1 rounded font-medium transition-all text-slate-400 hover:text-white">⚙️ Grades 9–10 (8 Labs)</button>
        <button id="filter-l3" onclick="filterLevel('L3')" class="lvl-btn px-2.5 py-1 rounded font-medium transition-all text-slate-400 hover:text-white">🚀 Grades 11–12 (7 Labs)</button>
      </div>
    </div>

    <!-- Live Progress Banner -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-slate-200">Curriculum Implementation:</span>
        <span class="font-mono text-cyan-400 font-bold text-xs">88 of 88 Interactive Lessons Live Across 22 Labs</span>
      </div>
      <div class="flex-1 min-w-[200px] max-w-md bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
        <div class="bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 100%"></div>
      </div>
      <span class="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">100% Complete & Verified! 🎉</span>
    </div>

    <!-- Labs Grid (22 Labs) -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2" id="labs-container">
      <!-- Injected by JS -->
    </div>

    <!-- Active Lesson Detail Drawer / Inspect Card -->
    <div id="lesson-inspector" class="bg-slate-900 border border-cyan-500/30 rounded-xl p-3.5 transition-all shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div class="flex items-center gap-2">
          <span id="inspect-icon" class="text-2xl">💡</span>
          <div>
            <h4 id="inspect-title" class="font-bold text-sm text-white">Lab 1: LED Blink & Digital Logic</h4>
            <div id="inspect-level" class="text-[10px] text-cyan-400 font-mono">Grades 6–8 • Level 1: Foundations & Digital Logic</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a id="inspect-launch-btn" href="http://localhost:8080/?lab=led" target="_blank" class="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-all flex items-center gap-1">
            <span>🚀</span> Launch Lab in Tutor ↗
          </a>
          <span id="inspect-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">● 100% VERIFIED</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-400 font-bold uppercase text-[9px] block mb-1">Interactive Lesson Sequence (4 Lessons):</span>
          <ol id="inspect-lessons" class="list-decimal list-inside space-y-1 font-mono text-[11px] text-slate-200">
            <!-- Injected by JS -->
          </ol>
        </div>
        <div class="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <span class="text-slate-400 font-bold uppercase text-[9px] block">Real-World Analogies & Hardware Physics:</span>
          <p id="inspect-analogy" class="text-slate-300 italic text-[11px] leading-relaxed">
            <!-- Injected by JS -->
          </p>
          <div class="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
            <span class="text-[9px] text-slate-400 font-bold">Key C++ Command:</span>
            <code id="inspect-code" class="text-[10px] font-mono text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              digitalWrite(13, HIGH);
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const LABS = [
      // --- Level 1: Grades 6-8 (7 Labs) ---
      { id: 1, slug: "led", name: "LED Blink & Digital Logic", icon: "💡", level: "L1", grade: "Grades 6–8", lessons: ["1. Anatomy of Arduino & setup() vs loop()", "2. Speaking to Pins: pinMode(OUTPUT)", "3. The Light Switch: digitalWrite() & delay()", "4. Emergency SOS Signaling Sandbox"], analogy: "Turning a water faucet on and off with clock pauses.", code: "digitalWrite(13, HIGH);" },
      { id: 2, slug: "servo", name: "SG90 Micro Servo 50Hz PWM", icon: "🦾", level: "L1", grade: "Grades 6–8", lessons: ["5. Robot Muscles: #include <Servo.h>", "6. 3-Wire Highway: Attaching Pin 9", "7. Steering Commands: myServo.write(angle)", "8. 180° Automated Sweep Dance"], analogy: "Tuning a walkie-talkie and steering a robotic arm with pulse widths.", code: "myServo.write(90);" },
      { id: 3, slug: "button", name: "Tactile Pushbutton & Pullup", icon: "🔘", level: "L1", grade: "Grades 6–8", lessons: ["9. Inputs vs Outputs (IPO Model)", "10. Floating Pin Trap & INPUT_PULLUP", "11. Doorbell Logic: if / else branches", "12. Toggle Switch Memory State Machine"], analogy: "A spring-loaded trapdoor held shut by a pullup spring until stepped on.", code: "if (digitalRead(2) == LOW)" },
      { id: 4, slug: "pot", name: "10k Potentiometer & ADC", icon: "🎛️", level: "L1", grade: "Grades 6–8", lessons: ["13. Digital vs Analog Smooth Spectrum", "14. 3-Pin Wiper Voltage Divider (0-5V)", "15. The Number Translator: map() function", "16. Drive-by-Wire Steering Studio"], analogy: "A rotary water valve dividing 5 volts into 1,024 discrete pressure notches.", code: "map(raw, 0, 1023, 0, 180);" },
      { id: 5, slug: "buzzer", name: "Piezo Buzzer & Tone Studio", icon: "📢", level: "L1", grade: "Grades 6–8", lessons: ["17. Sound Waves: Frequency (Hertz)", "18. Siren Alarms: tone() and noTone()", "19. Melodic Notes: pitches.h Music Sheet", "20. Interactive 8-Key Piano Synthesizer"], analogy: "A tiny metallic drum vibrating hundreds of times per second.", code: "tone(8, 440, 200);" },
      { id: 6, slug: "cad", name: "3D CAD Modeling Studio", icon: "📐", level: "L1", grade: "Grades 6–8", lessons: ["45. CSG 3D Modeling Primitives", "46. Solid vs Hole Boolean Operations", "47. Precise Dimensions & Align Studio", "48. STL 3D Mesh Export & Prototyping"], analogy: "Carving clay blocks with precision laser cookie-cutters in virtual 3D space.", code: "booleanCut(solidBox, holeCylinder);" },
      { id: 7, slug: "dmm", name: "Virtual Multimeter Studio", icon: "⚡", level: "L1", grade: "Grades 6–8", lessons: ["49. DC Voltage Drop & Water Pressure", "50. Resistance (Ohms) & Resistor Bands", "51. Continuity Buzzer & Short Circuits", "52. Circuit Doctor Diagnostics Sandbox"], analogy: "A master mechanic checking blood pressure, friction, and wire integrity.", code: "float v = analogRead(A0) * (5.0 / 1023.0);" },

      // --- Level 2: Grades 9-10 (8 Labs) ---
      { id: 8, slug: "ldr", name: "LDR Smart Streetlight", icon: "☀️", level: "L2", grade: "Grades 9–10", lessons: ["21. Photons to Resistance Physics", "22. The LDR Voltage Divider Circuit", "23. Darkness Threshold if/else Logic", "24. Automatic City Streetlight Studio"], analogy: "Human eyes dilating at dusk and automatically switching on city streetlights.", code: "if (analogRead(A1) < 300)" },
      { id: 9, slug: "rgb", name: "RGB Multi-Color PWM Fader", icon: "🌈", level: "L2", grade: "Grades 9–10", lessons: ["25. Additive Color Theory & 3 Channels", "26. 8-Bit PWM Mixing: analogWrite(0-255)", "27. Secondary Color Mixing (Hex Codes)", "28. Rainbow Mood Lamp Studio"], analogy: "Mixing red, green, and blue paint nozzles at high electrical frequencies.", code: "analogWrite(RED_PIN, 255);" },
      { id: 10, slug: "temp", name: "TMP36 Temperature & HVAC", icon: "🌡️", level: "L2", grade: "Grades 9–10", lessons: ["29. Thermoelectric Voltage & Bandgaps", "30. Millivolt-to-Celsius Math Formula", "31. Overheat Buzzer Safety Thresholds", "32. Smart Greenhouse Automated HVAC"], analogy: "An electrical thermometer turning voltage fluctuations into degrees Celsius.", code: "float tempC = (mv - 500) / 10.0;" },
      { id: 11, slug: "sonar", name: "HC-SR04 Ultrasonic Radar", icon: "🦇", level: "L2", grade: "Grades 9–10", lessons: ["33. Echolocation Speed-of-Sound Physics", "34. 10μs Trigger Pulse & pulseIn()", "35. Distance Formula: (t * 0.0343) / 2", "36. Reverse Parking Sonar Proximity Alarm"], analogy: "Bats shouting high-frequency ultrasonic clicks and timing the returning echo.", code: "long d = pulseIn(echo, HIGH) * 0.0343 / 2;" },
      { id: 12, slug: "ir", name: "TCRT5000 IR Line Follower", icon: "🏁", level: "L2", grade: "Grades 9–10", lessons: ["37. Infrared Reflectance & LM393 Trimpots", "38. Black vs White Surface Absorption", "39. Table Edge Fall-Off Cliff Sensor", "40. 2-Sensor Autonomous Line Follower"], analogy: "An invisible infrared flashlight inspecting black line tracks on white floor.", code: "if (digitalRead(leftIR) == HIGH)" },
      { id: 13, slug: "slicer", name: "3D Slicing & G-Code Studio", icon: "🖨️", level: "L2", grade: "Grades 9–10", lessons: ["53. Layer Heights & Slicing Geometry", "54. Infill Density & Gyroid Lattices", "55. Overhang Angles & Tree Supports", "56. G-Code CNC Commands (G0/G1/M104)"], analogy: "Slicing an apple into thin 0.2mm sheets and tracing each sheet with hot glue.", code: "G1 X100 Y50 E2.5 F3000" },
      { id: 14, slug: "dht", name: "DHT11/22 Climate Station", icon: "💧", level: "L2", grade: "Grades 9–10", lessons: ["57. 1-Wire Single-Bus Handshake Protocol", "58. Capacitive Relative Humidity (RH%)", "59. NOAA Biometeorology Heat Index", "60. Automated Greenhouse Climate Studio"], analogy: "A telegraph operator tapping precise microsecond pulses over a single wire.", code: "dht.readTemperature();" },
      { id: 15, slug: "gas", name: "MQ-2/135 Hazardous Gas & AQI", icon: "🧪", level: "L2", grade: "Grades 9–10", lessons: ["61. Tin Dioxide (SnO₂) Surface Chemistry", "62. Logarithmic Sensitivity Curves (Rs/R0)", "63. Explosive Gas Leak & Smoke Alarm", "64. National Air Quality Index (AQI) Studio"], analogy: "A heated ceramic nose whose surface resistance plunges when combustible gases touch it.", code: "float rs_ro = (5.0 - v) / v;" },

      // --- Level 3: Grades 11-12 (7 Labs) ---
      { id: 16, slug: "lcd", name: "16x2 I2C LCD Display", icon: "📟", level: "L3", grade: "Grades 11–12", lessons: ["41. Liquid Crystals & I2C Backpack (0x27)", "42. Cursor Coordinates & String Formatting", "43. Live Dynamic Multi-Sensor Dashboard", "44. Custom 5x8 Pixel Bitmap Character Generator"], analogy: "A digital billboard printing real-time sensor telemetry with only 2 I2C wires.", code: "lcd.print(\"Temp: \");" },
      { id: 17, slug: "oled", name: "0.96\" SSD1306 Graphic OLED", icon: "🖥️", level: "L3", grade: "Grades 11–12", lessons: ["65. 128x64 Matrix & 8 Vertical RAM Pages", "66. GFX Primitives & PROGMEM Flash Bitmaps", "67. Real-Time Oscilloscope Sparklines", "68. Embedded UI Menu Finite State Machine"], analogy: "An 8-storey hotel of 8,192 self-glowing blue neon windows controlled with 1KB RAM.", code: "display.drawPixel(64, 32, WHITE);" },
      { id: 18, slug: "soil", name: "Capacitive Soil & 5V Relay", icon: "🌱", level: "L3", grade: "Grades 11–12", lessons: ["69. Soil Capacitance vs Galvanic Corrosion", "70. Optocoupled Relay & Flyback Snubbers", "71. Bang-Bang Control with Deadband Hysteresis", "72. Closed-Loop Smart Irrigation Station"], analogy: "Measuring water dielectric through an insulated shield and switching heavy pumps with light beams.", code: "digitalWrite(RELAY_PIN, LOW);" },
      { id: 19, slug: "motor", name: "L298N Dual H-Bridge Rover", icon: "🏎️", level: "L3", grade: "Grades 11–12", lessons: ["73. H-Bridge Transistors & Shoot-Through", "74. PWM Speed Modulation & Stiction Deadband", "75. 4WD Differential Skid Steer Kinematics", "76. Autonomous Obstacle Avoidance Course"], analogy: "A 4-valve hydraulic lock reversing current through spinning wheels to steer like a tank.", code: "drive(200, 200);" },
      { id: 20, slug: "imu", name: "MPU6050 6-Axis IMU & Gimbal", icon: "🚁", level: "L3", grade: "Grades 11–12", lessons: ["77. MEMS Accelerometer 1G Gravity Vector", "78. MEMS Gyroscope Coriolis Rate & Drift", "79. Complementary Filter Sensor Fusion", "80. Closed-Loop 2-Axis Gimbal Stabilization"], analogy: "A suspended crystal chandelier plus a spinning tuning fork balancing a drone camera.", code: "fused = 0.98*(fused+rate*dt) + 0.02*accel;" },
      { id: 21, slug: "rfid", name: "RC522 13.56MHz RFID Access", icon: "💳", level: "L3", grade: "Grades 11–12", lessons: ["81. Near-Field Resonant Induction & SPI Bus", "82. MIFARE Classic 1K Memory Architecture", "83. UID Whitelist Security & Servo Deadbolt", "84. RFID Cashless Digital Wallet Studio"], analogy: "Wirelessly harvesting power from magnetic flux to authenticate encrypted digital passes.", code: "rfid.PICC_ReadCardSerial();" },
      { id: 22, slug: "iot", name: "ESP32 IoT Cloud Telemetry", icon: "☁️", level: "L3", grade: "Grades 11–12", lessons: ["85. Microcontroller vs Dual-Core 240MHz SoC", "86. Wi-Fi Station Mode & RESTful HTTP Client", "87. MQTT Pub/Sub Telemetry Broker Protocol", "88. Industry 4.0 Bi-Directional Digital Twin"], analogy: "A 240MHz supersonic train broadcasting sensor telemetry to global mission control.", code: "client.publish(\"telemetry\", json);" }
    ];

    let currentFilter = 'all';
    let selectedLabId = 1;

    function renderLabs() {
      const container = document.getElementById('labs-container');
      const filtered = LABS.filter(l => currentFilter === 'all' || l.level === currentFilter);
      
      container.innerHTML = filtered.map(lab => {
        const isSelected = lab.id === selectedLabId;
        const borderCls = isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/40' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700';

        return `
          <div onclick="selectLab(${lab.id})" class="cursor-pointer p-2 rounded-xl border ${borderCls} transition-all flex items-center justify-between gap-2 shadow-sm">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-xl shrink-0 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">${lab.icon}</span>
              <div class="truncate">
                <div class="font-bold text-[11px] truncate text-white">${lab.name}</div>
                <div class="text-[9.5px] text-cyan-400 font-mono">${lab.grade} • 4 Lessons</div>
              </div>
            </div>
            <span class="shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              LIVE
            </span>
          </div>
        `;
      }).join('');
    }

    function selectLab(id) {
      selectedLabId = id;
      const lab = LABS.find(l => l.id === id);
      if (!lab) return;

      document.getElementById('inspect-icon').textContent = lab.icon;
      document.getElementById('inspect-title').textContent = `Lab ${lab.id}: ${lab.name}`;
      document.getElementById('inspect-level').textContent = `${lab.grade} • ${lab.level === 'L1' ? 'Level 1: Foundations, Digital Logic & 3D CAD' : lab.level === 'L2' ? 'Level 2: Physical Computing, Slicing & Robotics' : 'Level 3: IoT, Embedded Cloud & Industry 4.0'}`;
      document.getElementById('inspect-launch-btn').href = `http://localhost:8080/?lab=${lab.slug}`;
      document.getElementById('inspect-lessons').innerHTML = lab.lessons.map(l => `<li>${l}</li>`).join('');
      document.getElementById('inspect-analogy').textContent = `"${lab.analogy}"`;
      document.getElementById('inspect-code').textContent = lab.code;

      renderLabs();
    }

    function filterLevel(lvl) {
      currentFilter = lvl;
      document.querySelectorAll('.lvl-btn').forEach(b => {
        b.className = 'lvl-btn px-2.5 py-1 rounded font-medium transition-all text-slate-400 hover:text-white';
      });
      document.getElementById('filter-' + lvl.toLowerCase()).className = 'lvl-btn active px-2.5 py-1 rounded font-semibold transition-all bg-cyan-600 text-white';
      renderLabs();
    }

    renderLabs();
    selectLab(1);
  </script>
</body>
</html>
'''

art_path = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\atl_curriculum_hub.html"
with open(art_path, "w", encoding="utf-8") as f:
    f.write(hub_html)

print(f"Updated {art_path} with all 22 labs and 88 lessons!")
