with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "    } else if (hw.activeLab === 'ir' || state.activeLab === 'ir') {"
lcd_block = """    } else if (hw.activeLab === 'lcd' || state.activeLab === 'lcd') {
      const line0 = hw.lcdLine0 || 'I2C Bus Ready!  ';
      const line1 = hw.lcdLine1 || 'Address: 0x27   ';

      if (lcdSvgLine0) lcdSvgLine0.textContent = line0;
      if (lcdSvgLine1) lcdSvgLine1.textContent = line1;
      if (lcdBacklightGlass) {
        lcdBacklightGlass.setAttribute('fill', hw.lcdBacklight ? '#0284c7' : '#0f172a');
      }

      const live0 = document.getElementById('lcd-live-line-0');
      const live1 = document.getElementById('lcd-live-line-1');
      if (live0) live0.textContent = line0;
      if (live1) live1.textContent = line1;

      if (hudLabel1 && hudReadout1) {
        hudLabel1.innerHTML = '<span>🌐</span> I2C Address';
        hudReadout1.textContent = '0x27 (PCF8574)';
        hudReadout1.className = 'hud-value val';
      }
      if (hudLabel2 && hudReadout2) {
        hudLabel2.innerHTML = '<span>💡</span> Backlight';
        hudReadout2.textContent = hw.lcdBacklight ? 'ON (Blue LED)' : 'OFF (Sleep)';
        hudReadout2.className = hw.lcdBacklight ? 'hud-value val ok' : 'hud-value val';
      }
      if (hudLabel3 && hudReadout3) {
        hudLabel3.innerHTML = '<span>🔠</span> Display Buffer';
        hudReadout3.textContent = '16x2 HD44780';
      }
      if (hudLabel4 && hudReadout4) {
        hudLabel4.innerHTML = '<span>📊</span> IoT Deck Channel';
        const ch = hw.lcdScreenMode || 0;
        hudReadout4.textContent = ch === 0 ? 'CH 1: CLIMATE' : ch === 1 ? 'CH 2: RADAR' : 'CH 3: SOLAR';
        hudReadout4.className = 'hud-value val ok';
      }
      if (scopeStatus) {
        scopeStatus.textContent = 'I2C Bus 100kHz: SDA Pin A4 + SCL Pin A5 transmitting text packets to 0x27';
      }
    } else if (hw.activeLab === 'ir' || state.activeLab === 'ir') {"""

if target in text:
    text = text.replace(target, lcd_block)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Added LCD block to onHardwareChange!')
else:
    print('Target not found')
