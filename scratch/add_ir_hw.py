with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "    } else if (hw.activeLab === 'sonar') {"
ir_block = """    } else if (hw.activeLab === 'ir' || state.activeLab === 'ir') {
      const isLine = hw.irLineDetected;
      const surf = hw.irSurface || 'white';

      if (irSurfaceRect && irSurfaceLabel) {
        if (surf === 'white') {
          irSurfaceRect.setAttribute('fill', '#f8fafc');
          irSurfaceLabel.textContent = 'WHITE REFLECTIVE SURFACE (High Bounce)';
          irSurfaceLabel.setAttribute('fill', '#0f172a');
        } else if (surf === 'cardboard') {
          irSurfaceRect.setAttribute('fill', '#b45309');
          irSurfaceLabel.textContent = 'CARDBOARD (Medium Reflectance)';
          irSurfaceLabel.setAttribute('fill', '#ffffff');
        } else if (surf === 'dark_tape') {
          irSurfaceRect.setAttribute('fill', '#334155');
          irSurfaceLabel.textContent = 'DARK TAPE (High Absorption)';
          irSurfaceLabel.setAttribute('fill', '#ffffff');
        } else {
          irSurfaceRect.setAttribute('fill', '#000000');
          irSurfaceLabel.textContent = 'PITCH BLACK VOID (Total Absorption)';
          irSurfaceLabel.setAttribute('fill', '#f87171');
        }
      }

      if (irRayTx) {
        irRayTx.setAttribute('opacity', hw.irBeamActive ? '1' : '0.45');
      }
      if (irRayRx) {
        const bounceOpacity = Math.max(0.1, 1.0 - ((hw.irReflectRaw || 145) / 1023.0));
        irRayRx.setAttribute('opacity', bounceOpacity.toFixed(2));
      }

      if (irD0Led) {
        irD0Led.setAttribute('fill', isLine ? '#ef4444' : '#7f1d1d');
      }

      if (roverTelemetryText) {
        const steer = hw.roverSteerState || 'straight';
        if (steer === 'left') roverTelemetryText.textContent = 'ROVER: STEER LEFT ⬅️';
        else if (steer === 'right') roverTelemetryText.textContent = 'ROVER: STEER RIGHT ➡️';
        else if (steer === 'stop') roverTelemetryText.textContent = 'ROVER: STOPPED 🛑';
        else roverTelemetryText.textContent = 'ROVER: CRUISE ⬆️';
      }

      if (roverSensorLeft && roverSensorRight) {
        const steer = hw.roverSteerState || 'straight';
        roverSensorLeft.setAttribute('fill', steer === 'left' ? '#ef4444' : '#22c55e');
        roverSensorRight.setAttribute('fill', steer === 'right' ? '#ef4444' : '#22c55e');
      }

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>⚡</span> Digital DO (Pin 2)';
        hudReadout1.textContent = isLine ? 'HIGH (1 - Line)' : 'LOW (0 - White)';
        hudReadout1.className = isLine ? 'hud-value val warn' : 'hud-value val ok';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>📊</span> Analog AO (Pin A0)';
        hudReadout2.textContent = `${(hw.irVoltage || 0.71).toFixed(2)}V (ADC ${hw.irReflectRaw || 145})`;
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🛡️</span> Comparator Vref';
        hudReadout3.textContent = `Thresh: ${hw.irThreshold || 512} (${((hw.irThreshold || 512)/1023*5).toFixed(2)}V)`;
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>🏎️</span> Rover Guidance';
        hudReadout4.textContent = (hw.roverSteerState || 'straight').toUpperCase();
        hudReadout4.className = 'hud-value val';
      }
      if (scopeStatus) {
        scopeStatus.textContent = isLine
          ? 'LINE DETECTED: IR Absorption High -> DO Pin 2 HIGH (5V)'
          : 'CLEAR SURFACE: Reflectance High -> DO Pin 2 LOW (0V)';
      }
    } else if (hw.activeLab === 'sonar') {"""

if target in text:
    text = text.replace(target, ir_block)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Added IR block to onHardwareChange!')
else:
    print('target not found')
