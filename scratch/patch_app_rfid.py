# -*- coding: utf-8 -*-
"""
Script to patch simulation.js and app.js with RFID lab logic and interactive renderers.
"""

# -------------------------------------------------------------
# 1. Update js/simulation.js
# -------------------------------------------------------------
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_content = f.read()

rfid_sim_state = """    } else if (labName === 'rfid') {
      this.voltage = 3.3;
      this.currentMa = 26.0;
      this.rfidUid = 'A3 7F 4E 12';
      this.rfidAccessStatus = 'STANDBY';
      this.rfidDoorUnlocked = false;
      this.rfidWalletBalance = 150.0;
      this.rfidFluxActive = false;
      this.setLesson(1);"""

if "labName === 'rfid'" not in sim_content:
    sim_content = sim_content.replace(
        "} else if (labName === 'imu') {",
        rfid_sim_state + "\n    } else if (labName === 'imu') {"
    )
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(sim_content)
    print("simulation.js patched with rfid state.")
else:
    print("simulation.js already has rfid state.")

# -------------------------------------------------------------
# 2. Update js/app.js
# -------------------------------------------------------------
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add rfidCircuitView declaration if missing
if "const rfidCircuitView = document.getElementById('rfid-circuit-view');" not in app_content:
    app_content = app_content.replace(
        "const imuCircuitView = document.getElementById('imu-circuit-view');",
        "const imuCircuitView = document.getElementById('imu-circuit-view');\n  const rfidCircuitView = document.getElementById('rfid-circuit-view');"
    )

# Add rfid HUD in onHardwareChange
rfid_hud = """    } else if (state.activeLab === 'rfid') {
      const uid = hw.rfidUid || 'A3 7F 4E 12';
      const status = hw.rfidAccessStatus || 'STANDBY';
      const bal = hw.rfidWalletBalance !== undefined ? hw.rfidWalletBalance : 150.0;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>💳</span> Transponder UID';
        hudReadout1.textContent = uid;
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>🔐</span> Door Security Lock';
        hudReadout2.textContent = hw.rfidDoorUnlocked ? 'UNLOCKED (Open 3s)' : 'LOCKED (Deadbolt)';
        hudReadout2.className = hw.rfidDoorUnlocked ? 'hud-value val ok' : 'hud-value val warn';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>📡</span> Carrier Frequency';
        hudReadout3.textContent = '13.56 MHz (HF RFID)';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>💰</span> Sector 1 Wallet';
        hudReadout4.textContent = `$${bal.toFixed(2)}`;
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeTitle) scopeTitle.innerHTML = '<strong>RC522 13.56MHz RFID:</strong> Resonant Induction & MIFARE Classic Access Control';
      if (scopeStatus) scopeStatus.textContent = `SPI Bus: 4-Wire @ 10MHz | UID: [${uid}] | Status: ${status} | Balance: $${bal.toFixed(2)}`;"""

if "state.activeLab === 'rfid'" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'imu') {",
        rfid_hud + "\n    } else if (state.activeLab === 'imu') {"
    )

# Add rfid dispatch in renderInteractiveTask
rfid_dispatch = """    } else if (state.activeLab === 'rfid') {
      if (lesson.id === 1) renderRfidLesson1(lesson);
      else if (lesson.id === 2) renderRfidLesson2(lesson);
      else if (lesson.id === 3) renderRfidLesson3(lesson);
      else if (lesson.id === 4) renderRfidLesson4(lesson);"""

if "renderRfidLesson1" not in app_content:
    app_content = app_content.replace(
        "} else if (state.activeLab === 'imu') {",
        rfid_dispatch + "\n    } else if (state.activeLab === 'imu') {"
    )

# Add RFID Lesson Renderers
rfid_renderers = '''
  // =========================================================================
  // RFID LESSONS (RC522 13.56MHz Access Control & Digital Wallet Studio)
  // =========================================================================

  function updateRfidDoor() {
    const hw = window.circuitSimulation.getHardwareState();
    const uid = hw.rfidUid || 'A3 7F 4E 12';
    const unlocked = hw.rfidDoorUnlocked || false;
    const isDenied = hw.rfidAccessStatus === 'DENIED';
    const bal = hw.rfidWalletBalance !== undefined ? hw.rfidWalletBalance : 150.0;

    // Flux waves
    const waves = document.getElementById('rfid-flux-waves');
    if (waves) {
      waves.style.display = hw.rfidFluxActive ? 'inline' : 'none';
    }

    // LEDs
    const ledG = document.getElementById('rfid-led-green');
    if (ledG) {
      ledG.setAttribute('fill', unlocked ? '#22c55e' : '#14532d');
      ledG.setAttribute('filter', unlocked ? 'drop-shadow(0 0 6px #22c55e)' : 'none');
    }

    const ledR = document.getElementById('rfid-led-red');
    if (ledR) {
      ledR.setAttribute('fill', isDenied ? '#ef4444' : '#7f1d1d');
      ledR.setAttribute('filter', isDenied ? 'drop-shadow(0 0 6px #ef4444)' : 'none');
    }

    // Servo Latch bolt
    const bolt = document.getElementById('rfid-latch-bolt');
    if (bolt) {
      bolt.setAttribute('transform', unlocked ? 'translate(19, 72) rotate(90)' : 'translate(19, 72) rotate(0)');
    }

    const latchText = document.getElementById('latch-status-text');
    if (latchText) {
      latchText.textContent = unlocked ? 'UNLOCKED' : (isDenied ? 'DENIED!' : 'LOCKED');
      latchText.setAttribute('fill', unlocked ? '#22c55e' : '#ef4444');
    }

    // HUD cards
    const hudUid = document.getElementById('rfid-hud-uid');
    if (hudUid) hudUid.textContent = uid;

    const hudStatus = document.getElementById('rfid-hud-status');
    if (hudStatus) {
      hudStatus.textContent = unlocked ? 'ACCESS GRANTED' : (isDenied ? 'ACCESS DENIED' : 'READY TO SCAN');
      hudStatus.setAttribute('fill', unlocked ? '#22c55e' : (isDenied ? '#ef4444' : '#10b981'));
    }

    const hudWallet = document.getElementById('rfid-hud-wallet');
    if (hudWallet) hudWallet.textContent = `$${bal.toFixed(2)}`;

    if (window.circuitSimulation) {
      window.circuitSimulation.notifyHardware();
    }
  }

  function renderRfidLesson1(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">📡</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Near-Field Resonant Induction & The 4-Wire SPI Bus</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              13.56MHz Magnetic Flux • Batteryless Transponders • Full-Wave Diode Energy Harvesting
            </p>
          </div>
        </div>

        <div style="background:rgba(2,6,23,0.7); border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem;">
            <span style="color:#7dd3fc;">Transponder Proximity: <strong id="rfid-dist-val" style="color:#38bdf8;">2.5</strong> cm</span>
            <span id="rfid-power-badge" style="color:#22c55e; font-weight:700;">● CARD POWERED (3.3V)</span>
          </div>
          <input type="range" id="rfid-slider-dist" min="0" max="8" step="0.5" value="2.5" style="width:100%; accent-color:#38bdf8;" />
        </div>

        <!-- Real-time Induction Readouts -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem; font-family:'JetBrains Mono', monospace; text-align:center;">
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">CARRIER FREQ</div>
            <div style="font-size:1rem; font-weight:800; color:#f59e0b;">13.56 MHz</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">HARVESTED V</div>
            <div id="box-harvested-v" style="font-size:1rem; font-weight:800; color:#10b981;">3.30 V</div>
          </div>
          <div style="background:#0f172a; border:1px solid #334155; padding:0.4rem; border-radius:6px;">
            <div style="font-size:0.65rem; color:#94a3b8;">SPI BUS CLOCK</div>
            <div style="font-size:1rem; font-weight:800; color:#38bdf8;">10.0 MHz</div>
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-induction">
            <span>⚡</span> Verify Resonant Induction Coupling & SPI Link
          </button>
        </div>
      </div>
    `;

    const slider = document.getElementById('rfid-slider-dist');
    const valDist = document.getElementById('rfid-dist-val');
    const badge = document.getElementById('rfid-power-badge');
    const boxV = document.getElementById('box-harvested-v');

    slider?.addEventListener('input', (e) => {
      const d = parseFloat(e.target.value);
      if (valDist) valDist.textContent = d.toFixed(1);
      const isPowered = d <= 4.0;
      hw.rfidFluxActive = isPowered;
      const v = isPowered ? (3.3 * (1 - d / 5.0) + 0.5).toFixed(2) : '0.00';
      if (boxV) boxV.textContent = `${v} V`;
      if (badge) {
        badge.textContent = isPowered ? '● CARD POWERED (3.3V)' : '○ OUT OF RANGE (0V)';
        badge.style.color = isPowered ? '#22c55e' : '#64748b';
      }
      updateRfidDoor();
    });

    document.getElementById('btn-verify-induction')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('inductionVerified');
    });

    hw.rfidFluxActive = true;
    updateRfidDoor();
  }

  function renderRfidLesson2(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🗄️</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">MIFARE Classic 1K Memory Map Architecture</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              1,024-Byte EEPROM • 16 Sectors × 4 Blocks (16 Bytes each) • Crypto-1 Encryption
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-mem-sec0" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#0284c7; color:#38bdf8;">
            Sector 0 (UID & Mfr)
          </button>
          <button class="secondary-btn" id="btn-mem-sec1" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#10b981; color:#86efac;">
            Sector 1 (User Wallet)
          </button>
          <button class="secondary-btn" id="btn-mem-sec2" style="font-size:0.75rem; flex:1; padding:0.4rem; border-color:#f59e0b; color:#fde047;">
            Sector 2 (Access Data)
          </button>
        </div>

        <!-- Hex Memory Dump Preview -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:#93c5fd; margin-bottom:0.75rem; line-height:1.5;">
          <div style="color:#64748b; font-size:0.65rem; margin-bottom:0.2rem;">// 16-BYTE HEXADECIMAL SECTOR DUMP:</div>
          <div id="hex-dump-content" style="color:#7dd3fc;">
            [Block 0] A3 7F 4E 12 88 08 04 00 62 63 64 65 66 67 68 69 (UID & MFR)<br>
            [Block 1] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
            [Block 2] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
            [Block 3] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Trailer)
          </div>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-memory">
            <span>🔍</span> Verify MIFARE Memory Structure & Trailers
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-mem-sec0')?.addEventListener('click', () => {
      const dump = document.getElementById('hex-dump-content');
      if (dump) {
        dump.innerHTML = `[Block 0] A3 7F 4E 12 88 08 04 00 62 63 64 65 66 67 68 69 (UID & MFR)<br>
[Block 1] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
[Block 2] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Reserved)<br>
[Block 3] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Key A/Bits/Key B)`;
      }
    });

    document.getElementById('btn-mem-sec1')?.addEventListener('click', () => {
      const dump = document.getElementById('hex-dump-content');
      if (dump) {
        dump.innerHTML = `[Block 4] 96 00 00 00 69 FF FF FF 96 00 00 00 04 FB 04 FB (Wallet: $150.00)<br>
[Block 5] 53 70 61 72 6B 42 79 74 65 20 4F 53 20 56 32 2E (ASCII: "SparkByte OS")<br>
[Block 6] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 7] A0 A1 A2 A3 A4 A5 | 7F 07 88 40 | B0 B1 B2 B3 B4 B5 (Secured Trailer)`;
      }
    });

    document.getElementById('btn-mem-sec2')?.addEventListener('click', () => {
      const dump = document.getElementById('hex-dump-content');
      if (dump) {
        dump.innerHTML = `[Block 8] 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F 10 (Access Log)<br>
[Block 9] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 10] 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 (Empty Data)<br>
[Block 11] FF FF FF FF FF FF | FF 07 80 69 | FF FF FF FF FF FF (Default Trailer)`;
      }
    });

    document.getElementById('btn-verify-memory')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('memoryVerified');
    });

    updateRfidDoor();
  }

  function renderRfidLesson3(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">🔐</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">Access Control Security: UID Whitelist & Deadbolt Actuation</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Constant-Time UID Comparison • SG90 Servo Deadbolt Retract (90°) • Intruder Lockout
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; margin:0.75rem 0;">
          <button class="secondary-btn" id="btn-scan-authorized" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#22c55e; color:#86efac; font-weight:800;">
            🔑 Scan Master Keyfob<br><span style="font-size:0.65rem; color:#86efac;">[A3 7F 4E 12] - Authorized</span>
          </button>
          <button class="secondary-btn" id="btn-scan-stranger" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#ef4444; color:#fca5a5; font-weight:800;">
            ⚠️ Scan Stranger Card<br><span style="font-size:0.65rem; color:#fca5a5;">[D9 1C 88 5B] - Unknown</span>
          </button>
        </div>

        <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:0.6rem; font-family:'JetBrains Mono', monospace; font-size:0.75rem; text-align:center;">
          <span style="color:#64748b;">SECURITY LOCK STATUS: </span>
          <strong id="security-status-label" style="color:${hw.rfidDoorUnlocked ? '#22c55e' : '#38bdf8'};">
            ${hw.rfidDoorUnlocked ? 'ACCESS GRANTED • DOOR UNLOCKED' : 'SYSTEM ARMED • DEADBOLT LOCKED'}
          </strong>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-verify-access">
            <span>🛡️</span> Verify Door Access Control Logic
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-scan-authorized')?.addEventListener('click', () => {
      hw.rfidUid = 'A3 7F 4E 12';
      hw.rfidAccessStatus = 'GRANTED';
      hw.rfidDoorUnlocked = true;
      hw.rfidFluxActive = true;
      const lbl = document.getElementById('security-status-label');
      if (lbl) {
        lbl.textContent = 'ACCESS GRANTED • DEADBOLT RETRACTED (90°)';
        lbl.style.color = '#22c55e';
      }
      if (window.soundEngine) {
        window.soundEngine.playTone(880, 0.08);
        setTimeout(() => window.soundEngine.playTone(1320, 0.12), 100);
      }
      updateRfidDoor();

      setTimeout(() => {
        hw.rfidDoorUnlocked = false;
        hw.rfidFluxActive = false;
        if (lbl) {
          lbl.textContent = 'SYSTEM ARMED • DEADBOLT RELOCKED (0°)';
          lbl.style.color = '#38bdf8';
        }
        updateRfidDoor();
      }, 3000);
    });

    document.getElementById('btn-scan-stranger')?.addEventListener('click', () => {
      hw.rfidUid = 'D9 1C 88 5B';
      hw.rfidAccessStatus = 'DENIED';
      hw.rfidDoorUnlocked = false;
      hw.rfidFluxActive = true;
      const lbl = document.getElementById('security-status-label');
      if (lbl) {
        lbl.textContent = 'SECURITY ALERT: ACCESS DENIED • LOCK ENGAGED';
        lbl.style.color = '#ef4444';
      }
      if (window.soundEngine) window.soundEngine.playTone(220, 0.3);
      updateRfidDoor();

      setTimeout(() => {
        hw.rfidFluxActive = false;
        updateRfidDoor();
      }, 1500);
    });

    document.getElementById('btn-verify-access')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('accessVerified');
    });

    updateRfidDoor();
  }

  function renderRfidLesson4(lesson) {
    if (!lessonInteractiveArea) return;
    const hw = window.circuitSimulation.getHardwareState();
    hw.rfidWalletBalance = hw.rfidWalletBalance !== undefined ? hw.rfidWalletBalance : 150.0;

    lessonInteractiveArea.innerHTML = `
      <div class="interactive-card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <div>
            <h4 style="margin:0; font-size:0.95rem;">RFID Cashless Digital Wallet Studio (MIFARE Value Blocks)</h4>
            <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">
              Atomic Transactions: MIFARE_Decrement() & MIFARE_Increment() on Block 4
            </p>
          </div>
        </div>

        <!-- Digital Wallet Balance Card -->
        <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:0.8rem; margin:0.75rem 0; text-align:center;">
          <div style="font-size:0.7rem; color:#94a3b8; font-family:'JetBrains Mono', monospace;">STORED SMART CARD BALANCE (BLOCK 4)</div>
          <div id="wallet-balance-big" style="font-size:1.8rem; font-weight:900; color:#10b981; font-family:'JetBrains Mono', monospace; margin:0.3rem 0;">
            $${hw.rfidWalletBalance.toFixed(2)}
          </div>
          <div style="font-size:0.65rem; color:#64748b; font-family:'JetBrains Mono', monospace;">ENCRYPTED WITH KEY A: FF FF FF FF FF FF</div>
        </div>

        <!-- POS Terminal Actions -->
        <div style="display:flex; gap:0.5rem; margin-bottom:0.75rem;">
          <button class="secondary-btn" id="btn-wallet-pay" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#0284c7; color:#38bdf8; font-weight:700;">
            💳 Tap to Pay Fare (-$25)
          </button>
          <button class="secondary-btn" id="btn-wallet-topup" style="font-size:0.75rem; flex:1; padding:0.5rem; border-color:#22c55e; color:#86efac; font-weight:700;">
            💵 Top-Up Balance (+$50)
          </button>
        </div>

        <div class="action-btn-row">
          <button class="primary-btn" id="btn-deploy-wallet">
            <span>🚀</span> Deploy RFID Cashless Digital Wallet
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-wallet-pay')?.addEventListener('click', () => {
      if (hw.rfidWalletBalance < 25) {
        alert("INSUFFICIENT FUNDS! Please top up your card.");
        return;
      }
      hw.rfidWalletBalance -= 25.0;
      hw.rfidFluxActive = true;
      const big = document.getElementById('wallet-balance-big');
      if (big) big.textContent = `$${hw.rfidWalletBalance.toFixed(2)}`;
      if (window.soundEngine) window.soundEngine.playSuccess();
      updateRfidDoor();

      setTimeout(() => {
        hw.rfidFluxActive = false;
        updateRfidDoor();
      }, 800);
    });

    document.getElementById('btn-wallet-topup')?.addEventListener('click', () => {
      hw.rfidWalletBalance += 50.0;
      hw.rfidFluxActive = true;
      const big = document.getElementById('wallet-balance-big');
      if (big) big.textContent = `$${hw.rfidWalletBalance.toFixed(2)}`;
      if (window.soundEngine) window.soundEngine.playTone(990, 0.1);
      updateRfidDoor();

      setTimeout(() => {
        hw.rfidFluxActive = false;
        updateRfidDoor();
      }, 800);
    });

    document.getElementById('btn-deploy-wallet')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      checkVerification('walletDeployed');
    });

    updateRfidDoor();
  }
'''

# Insert functions before app boot
target = "// --- Initial App Boot with Direct URL Parameter Support ---"
app_content = app_content.replace(target, rfid_renderers + "\n\n  " + target)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("js/app.js successfully patched with RFID lab renderers!")
