# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with IoT lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

iot_sim_state = """    } else if (labName === 'iot') {
      this.voltage = 3.3;
      this.currentMa = 120.0;
      this.iotCpuFreq = 240;
      this.iotWifiConnected = true;
      this.iotIpAddress = '192.168.1.105';
      this.iotMqttConnected = true;
      this.iotPacketsSent = 1248;
      this.iotRemoteFan = true;
      this.iotCloudTemp = 26.4;
      this.iotCloudAqi = 45;
      this.setLesson(1);"""

if "labName === 'iot'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'rfid') {",
        iot_sim_state + "\n    } else if (labName === 'rfid') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with iot state.")
else:
    print("simulation.js already has iot state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add iotCircuitView declaration if missing
if "const iotCircuitView = document.getElementById('iot-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const rfidCircuitView = document.getElementById('rfid-circuit-view');",
        "const rfidCircuitView = document.getElementById('rfid-circuit-view');\n  const iotCircuitView = document.getElementById('iot-circuit-view');"
    )

# Add iot HUD in onHardwareChange
iot_hud = """    } else if (state.activeLab === 'iot') {
      const ip = hw.iotIpAddress || '192.168.1.105';
      const pkts = hw.iotPacketsSent !== undefined ? hw.iotPacketsSent : 1248;
      const freq = hw.iotCpuFreq || 240;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🌐</span> Local IP (STA)';
        hudReadout1.textContent = ip;
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>📡</span> MQTT Broker';
        hudReadout2.textContent = 'CONNECTED (28ms)';
        hudReadout2.className = 'hud-value val ok';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>⚡</span> Xtensa CPU Freq';
        hudReadout3.textContent = `${freq} MHz (Dual-Core)`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>📊</span> Telemetry Uplink';
        hudReadout4.textContent = `${pkts} Packets (QoS 1)`;
        hudReadout4.className = 'hud-value val';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>ESP32 Cloud IoT Studio:</strong> Dual-Core SoC & Bi-Directional Digital Twin';
      if (scopeStatus) scopeStatus.textContent = `STA IP: ${ip} | Broker: broker.emqx.io:1883 | CPU: ${freq}MHz | Packets: ${pkts} | Digital Twin Active`;"""

if "state.activeLab === 'iot'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'rfid') {",
        iot_hud + "\n    } else if (state.activeLab === 'rfid') {"
    )

# Add iot dispatch in renderInteractiveTask
iot_dispatch = """    } else if (state.activeLab === 'iot') {
      if (lesson.id === 1) renderIotLesson1(lesson);
      else if (lesson.id === 2) renderIotLesson2(lesson);
      else if (lesson.id === 3) renderIotLesson3(lesson);
      else if (lesson.id === 4) renderIotLesson4(lesson);"""

if "renderIotLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'rfid') {",
        iot_dispatch + "\n    } else if (state.activeLab === 'rfid') {"
    )

# Add IoT Lesson Renderers
iot_renderers = '''
  // =========================================================================
  // IOT LESSONS (ESP32 Cloud Telemetry & MQTT Digital Twin Studio)
  // =========================================================================

  function updateIotCloud() {
    const hw = window.circuitSimulation.getHardwareState();
    const temp = hw.iotCloudTemp !== undefined ? hw.iotCloudTemp : 26.4;
    const aqi = hw.iotCloudAqi !== undefined ? hw.iotCloudAqi : 45;
    const fanOn = hw.iotRemoteFan !== undefined ? hw.iotRemoteFan : true;
    const ip = hw.iotIpAddress || '192.168.1.105';
    const pkts = hw.iotPacketsSent !== undefined ? hw.iotPacketsSent : 1248;

    // Cloud widgets
    const valTemp = document.getElementById('cloud-val-temp');
    if (valTemp) valTemp.textContent = `${temp.toFixed(1)} °C`;

    const valAqi = document.getElementById('cloud-val-aqi');
    if (valAqi) valAqi.textContent = `AQI ${aqi} (${aqi <= 50 ? 'Good' : 'Moderate'})`;

    const swBg = document.getElementById('cloud-switch-bg');
    if (swBg) swBg.setAttribute('fill', fanOn ? '#10b981' : '#475569');

    const swKnob = document.getElementById('cloud-switch-knob');
    if (swKnob) swKnob.setAttribute('cx', fanOn ? '36' : '12');

    const swLabel = document.getElementById('cloud-switch-label');
    if (swLabel) {
      swLabel.textContent = fanOn ? 'FAN: ON' : 'FAN: OFF';
      swLabel.setAttribute('fill', fanOn ? '#86efac' : '#94a3b8');
    }

    // ESP32 Onboard LED
    const blueLed = document.getElementById('esp32-blue-led');
    if (blueLed) {
      blueLed.setAttribute('fill', fanOn ? '#38bdf8' : '#1e293b');
      blueLed.setAttribute('filter', fanOn ? 'drop-shadow(0 0 6px #38bdf8)' : 'none');
    }

    // HUD cards
    const hudIp = document.getElementById('iot-hud-ip');
    if (hudIp) hudIp.textContent = ip;

    const hudPkts = document.getElementById('iot-hud-pkts');
    if (hudPkts) hudPkts.textContent = `${pkts} Pkts`;

    if (window.circuitSimulation) {
      window.circuitSimulation.notifyHardware();
    }
  }

  function renderIotLesson1(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();
    hw.iotCpuFreq = hw.iotCpuFreq || 240;

    const mips = Math.round((hw.iotCpuFreq / 240) * 600);
    const ma = Math.round(40 + (hw.iotCpuFreq / 240) * 80);

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">⚡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Microcontroller vs IoT SoC: ATmega328P vs Xtensa ESP32</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              32-bit Dual-Core LX6 • 240MHz Turbo • 520KB SRAM • Integrated 802.11 b/g/n Wi-Fi
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">CPU Clock Frequency: <strong id="iot-val-freq" style="color:#38bdf8;">${hw.iotCpuFreq}</strong> MHz</span>
            <span id="iot-mode-badge" style="color:#10b981; font-weight:700;">● TURBO DUAL-CORE</span>
          </div>
          <div style="display:flex; gap:0.4rem; margin-top:0.4rem;">
            <button class="secondary-btn" id="btn-freq-80" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
              80 MHz (Eco)
            </button>
            <button class="secondary-btn" id="btn-freq-160" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
              160 MHz (Standard)
            </button>
            <button class="secondary-btn" id="btn-freq-240" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac; font-weight:800;">
              240 MHz (Max Turbo)
            </button>
          </div>
        </div>

        <!-- Real-time SoC Performance Benchmark -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">COMPUTING SPEED</div>
            <div id="box-mips" style="font-size:1rem; font-weight:800; color:#38bdf8;">${mips} MIPS</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">ACTIVE CURRENT</div>
            <div id="box-ma" style="font-size:1rem; font-weight:800; color:#f59e0b;">${ma} mA</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SRAM CAPACITY</div>
            <div style="font-size:1rem; font-weight:800; color:#10b981;">520 KB (260x)</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-soc">
            <span>🚀</span> Verify Dual-Core SoC Computing Power
          </button>
        </div>
      </div>
    `;

    function setFreq(f, m, c) {
      hw.iotCpuFreq = f;
      const v = document.getElementById('iot-val-freq');
      const bm = document.getElementById('box-mips');
      const bma = document.getElementById('box-ma');
      if (v) v.textContent = f;
      if (bm) bm.textContent = `${m} MIPS`;
      if (bma) bma.textContent = `${c} mA`;
      updateIotCloud();
    }

    document.getElementById('btn-freq-80')?.addEventListener('click', () => setFreq(80, 200, 55));
    document.getElementById('btn-freq-160')?.addEventListener('click', () => setFreq(160, 400, 85));
    document.getElementById('btn-freq-240')?.addEventListener('click', () => setFreq(240, 600, 120));

    document.getElementById('btn-verify-soc')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('socVerified');
    });

    updateIotCloud();
  }

  function renderIotLesson2(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📶</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Wi-Fi Station Mode, WPA2 4-Way Handshake & DHCP Lease</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              802.11 b/g/n Networking • Dynamic Host Configuration • RESTful HTTP Client
            </p>
          </div>
        </div>

        <!-- Connection Handshake Step Trace -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem; line-height:1.5;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.3rem;">WIFI ASSOCIATION LIFECYCLE:</div>
          <div id="wifi-step-log" style="color:#7dd3fc;">
            [1] 802.11 Probe Request -> Found SSID "SparkByte_ATL_Lab"<br>
            [2] WPA2 4-Way Cryptographic Handshake -> Mutual Authentication OK<br>
            [3] DHCP Discover & Offer -> IP Lease: 192.168.1.105 (Subnet: 255.255.255.0)<br>
            [4] RESTful HTTP Client -> Target: http://api.sparkbyte.io [STATUS 200 OK]
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-scan-wifi" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            📡 Scan 2.4GHz Channels
          </button>
          <button class="secondary-btn" id="btn-renew-dhcp" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            🔄 Renew DHCP Lease
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-wifi">
            <span>🌐</span> Verify Wi-Fi Station Mode & RESTful HTTP Link
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-scan-wifi')?.addEventListener('click', () => {
      const log = document.getElementById('wifi-step-log');
      if (log) {
        log.innerHTML = `[SCAN] Channel 1: "SparkByte_ATL_Lab" (-42 dBm, WPA2-PSK)<br>
[SCAN] Channel 6: "ATL_Tinkering_Lab" (-68 dBm, WPA2-Enterprise)<br>
[ASSOCIATE] Connecting to "SparkByte_ATL_Lab"... Associated!<br>
[IP LEASE] Assigned IP: 192.168.1.105 | DNS: 8.8.8.8`;
      }
      if (window.soundEngine) window.soundEngine.playTone(700, 0.08);
    });

    document.getElementById('btn-renew-dhcp')?.addEventListener('click', () => {
      hw.iotIpAddress = '192.168.1.112';
      const log = document.getElementById('wifi-step-log');
      if (log) log.innerHTML += `<br>[DHCP RENEW] New Lease: 192.168.1.112 assigned.`;
      if (window.soundEngine) window.soundEngine.playSuccess();
      updateIotCloud();
    });

    document.getElementById('btn-verify-wifi')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('wifiConnected');
    });

    updateIotCloud();
  }

  function renderIotLesson3(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">☁️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MQTT Publish/Subscribe Telemetry Broker Protocol</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Lightweight 2-Byte Headers • Broker (broker.emqx.io:1883) • QoS 1 Delivery
            </p>
          </div>
        </div>

        <!-- MQTT Live Packet Console -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; font-family:'JetBrains Mono', monospace; font-size:0.75rem; line-height:1.5;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span style="color:#64748b;">MQTT BROKER: broker.emqx.io:1883</span>
            <span style="color:#10b981;">● PING 28ms</span>
          </div>
          <div id="mqtt-packet-log" style="color:#38bdf8;">
            PUB -> "spkbyte/farm/telemetry": {"temp":26.4, "aqi":45, "pkts":${hw.iotPacketsSent || 1248}}<br>
            SUB <- "spkbyte/farm/actuator": {"cmd":"PING_ACK"} (QoS 1)
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-mqtt-publish" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            📤 Publish Telemetry Packet (QoS 1)
          </button>
          <button class="secondary-btn" id="btn-mqtt-downlink" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            📥 Receive Cloud Downlink Command
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-mqtt">
            <span>📡</span> Verify MQTT Telemetry Broker Link
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-mqtt-publish')?.addEventListener('click', () => {
      hw.iotPacketsSent = (hw.iotPacketsSent || 1248) + 1;
      hw.iotCloudTemp = 26.4 + (Math.random() - 0.5) * 1.5;
      const log = document.getElementById('mqtt-packet-log');
      if (log) {
        log.innerHTML = `PUB -> "spkbyte/farm/telemetry": {"temp":${hw.iotCloudTemp.toFixed(1)}, "aqi":45, "pkts":${hw.iotPacketsSent}}<br>` + log.innerHTML;
      }
      if (window.soundEngine) window.soundEngine.playTone(800, 0.05);
      updateIotCloud();
    });

    document.getElementById('btn-mqtt-downlink')?.addEventListener('click', () => {
      const log = document.getElementById('mqtt-packet-log');
      if (log) {
        log.innerHTML = `SUB <- "spkbyte/farm/actuator": {"command":"FAN_TOGGLE", "origin":"cloud_dashboard"}<br>` + log.innerHTML;
      }
      hw.iotRemoteFan = !hw.iotRemoteFan;
      if (window.soundEngine) window.soundEngine.playSuccess();
      updateIotCloud();
    });

    document.getElementById('btn-verify-mqtt')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('mqttVerified');
    });

    updateIotCloud();
  }

  function renderIotLesson4(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🎓</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Industry 4.0 Capstone: Bi-Directional Cloud Digital Twin</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Live Uplink Sensor Streaming + Sub-50ms Remote Actuator Relay Downlink
            </p>
          </div>
        </div>

        <!-- Digital Twin Remote Control Panel -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#93c5fd;">Remote Cloud Actuator Switch:</span>
            <button class="secondary-btn" id="btn-toggle-cloud-fan" style="font-size:0.8rem; padding:0.4rem 1rem; border-color:${hw.iotRemoteFan ? '#22c55e' : '#64748b'}; color:${hw.iotRemoteFan ? '#86efac' : '#94a3b8'}; font-weight:800;">
              ${hw.iotRemoteFan ? 'FAN: ON (Active Downlink)' : 'FAN: OFF (Standby)'}
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; font-family:'JetBrains Mono', monospace; font-size:0.75rem; color:#64748b;">
            <span>Downlink Latency: <strong style="color:#10b981;">32 ms</strong></span>
            <span>Digital Twin Sync: <strong style="color:#38bdf8;">100% Real-Time</strong></span>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-graduate-capstone" style="background:linear-gradient(135deg, #2563eb, #10b981); border:none; padding:0.75rem 1.2rem; font-size:0.9rem; font-weight:900;">
            🎓 Graduate ATL Master Curriculum (88 Lessons Complete!)
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-toggle-cloud-fan')?.addEventListener('click', () => {
      hw.iotRemoteFan = !hw.iotRemoteFan;
      if (window.soundEngine) {
        if (hw.iotRemoteFan) window.soundEngine.playTone(950, 0.08);
        else window.soundEngine.playTone(450, 0.08);
      }
      updateIotCloud();
      renderIotLesson4(lesson);
    });

    document.getElementById('btn-graduate-capstone')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      alert("🏆 CONGRATULATIONS! You have mastered all 22 Atal Tinkering Lab modules and completed all 88 interactive engineering lessons across Grades 6 to 12!");
      checkVerification('capstoneGraduated');
    });

    updateIotCloud();
  }
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, iot_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with IoT lab renderers!")
