import sys

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Click listener
target_btn = "  if (labBtnTemp) {\n    labBtnTemp.addEventListener('click', () => switchLab('temp'));\n  }"
sonar_btn = """  if (labBtnSonar) {
    labBtnSonar.addEventListener('click', () => switchLab('sonar'));
  }
  if (labBtnTemp) {
    labBtnTemp.addEventListener('click', () => switchLab('temp'));
  }"""

if target_btn in text and "switchLab('sonar')" not in text:
    text = text.replace(target_btn, sonar_btn)
    print('Added labBtnSonar click listener')

# 2. Hardware Callouts
target_hc = "    } else if (state.activeLab === 'temp') {"
sonar_hc = """    } else if (state.activeLab === 'sonar') {
      hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Transducer T emits 40kHz ultrasound acoustic burst">
          <span>🔊</span> <strong>Transmitter 'T':</strong> Miniature horn shoots 40kHz ultrasound pulses.
        </div>
        <div class="callout-pill" title="Transducer R listens for returning sound wave echo">
          <span>👂</span> <strong>Receiver 'R':</strong> Directional acoustic microphone detects returning sound.
        </div>
        <div class="callout-pill" title="Arduino Trigger Pin 12 sends 10 microsecond pulse">
          <span>⚡</span> <strong>Trig (Pin 12):</strong> Sends 10µs electrical trigger to fire sound ping.
        </div>
        <div class="callout-pill" title="Arduino Echo Pin 11 measures flight duration in microseconds">
          <span>⏱️</span> <strong>Echo (Pin 11):</strong> Held HIGH for exact duration sound is in flight.
        </div>
      `;
    } else if (state.activeLab === 'temp') {"""

if target_hc in text and "state.activeLab === 'sonar'" not in text:
    text = text.replace(target_hc, sonar_hc)
    print('Added sonar hardware callouts')

# 3. onHardwareChange
target_hw = "    } else if (hw.activeLab === 'temp') {"
sonar_hw = """    } else if (hw.activeLab === 'sonar') {
      const dist = hw.sonarDistanceCm !== undefined ? hw.sonarDistanceCm : 45.0;
      const targetX = Math.round(380 + (Math.max(2, Math.min(100, dist)) - 2) / 98 * 300);

      if (sonarObstacleTarget) {
        sonarObstacleTarget.setAttribute('transform', `translate(${targetX}, 130)`);
      }
      if (sonarRulerLine) {
        sonarRulerLine.setAttribute('x2', targetX);
      }
      if (sonarRulerEnd) {
        sonarRulerEnd.setAttribute('cx', targetX);
      }
      if (sonarDistPill && sonarDistText) {
        const midX = Math.round(410 + (targetX - 410) / 2);
        sonarDistPill.setAttribute('x', midX - 35);
        sonarDistText.setAttribute('x', midX);
        sonarDistText.textContent = `${dist.toFixed(1)} cm`;
      }
      if (sonarLedGlow && sonarLedBulb) {
        sonarLedGlow.setAttribute('opacity', hw.sonarLedStrobe ? '0.85' : '0');
        sonarLedBulb.setAttribute('fill', hw.sonarLedStrobe ? '#ef4444' : '#7f1d1d');
      }
      if (sonarBuzzerRing1 && sonarBuzzerRing2) {
        sonarBuzzerRing1.setAttribute('opacity', hw.sonarBuzzerBeeping ? '0.8' : '0');
        sonarBuzzerRing2.setAttribute('opacity', hw.sonarAlertZone === 'stop' ? '0.9' : '0');
      }

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>📏</span> Target Distance';
        hudReadout1.textContent = `${dist.toFixed(1)} cm (${(dist / 2.54).toFixed(1)} in)`;
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>⏱️</span> Echo Duration';
        hudReadout2.textContent = `${hw.sonarDurationUs || 0} µs`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🛡️</span> Radar Zone';
        hudReadout3.textContent = (hw.sonarAlertZone || 'safe').toUpperCase();
        hudReadout3.className = hw.sonarAlertZone === 'stop' ? 'hud-value val high' : hw.sonarAlertZone === 'hazard' ? 'hud-value val warn' : 'hud-value val ok';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🔊</span> Parking Alert';
        hudReadout4.textContent = hw.sonarAlertZone === 'stop' ? 'CONTINUOUS SIREN' : hw.sonarBuzzerBeeping ? 'PULSING BEEP' : 'SILENT';
        hudReadout4.className = hw.sonarAlertZone === 'stop' ? 'hud-value val high' : hw.sonarBuzzerBeeping ? 'hud-value val warn' : 'hud-value val';
      }
      if (scopeStatus) {
        scopeStatus.textContent = hw.sonarAlertZone === 'stop'
          ? `EMERGENCY STOP (<8cm): Continuous 3000Hz Siren Active!`
          : hw.sonarBuzzerBeeping
          ? `RADAR ACTIVE: Target at ${dist.toFixed(1)}cm (${hw.sonarAlertZone.toUpperCase()})`
          : `HC-SR04 Radar Ready (Clear Field >50cm)`;
      }
    } else if (hw.activeLab === 'temp') {"""

if target_hw in text and "hw.activeLab === 'sonar'" not in text:
    text = text.replace(target_hw, sonar_hw)
    print('Added sonar onHardwareChange')

# 4. renderInteractiveTask
target_rit = "    } else if (state.activeLab === 'temp') {"
sonar_rit = """    } else if (state.activeLab === 'sonar') {
      if (lesson.id === 1) renderSonarLesson1(lesson);
      else if (lesson.id === 2) renderSonarLesson2(lesson);
      else if (lesson.id === 3) renderSonarLesson3(lesson);
      else if (lesson.id === 4) renderSonarLesson4(lesson);
    } else if (state.activeLab === 'temp') {"""

if target_rit in text and "state.activeLab === 'sonar'" not in text:
    text = text.replace(target_rit, sonar_rit)
    print('Added sonar renderInteractiveTask')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated js/app.js successfully!')
