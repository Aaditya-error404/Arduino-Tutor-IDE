with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Constructor state
target_c = '    // TCRT5000 / KY-033 IR Reflective Sensor State'
lcd_c = '''    // 16x2 I2C Character LCD Display State
    this.lcdAddress = '0x27';
    this.lcdCols = 16;
    this.lcdRows = 2;
    this.lcdBacklight = true;
    this.lcdLine0 = 'I2C Bus Ready!  ';
    this.lcdLine1 = 'Address: 0x27   ';
    this.lcdCursorCol = 0;
    this.lcdCursorRow = 0;
    this.lcdCustomChar = [0, 10, 31, 31, 14, 4, 0, 0]; // 5x8 Heart
    this.lcdScreenMode = 0; // 0: Climate, 1: Radar, 2: Solar

    // TCRT5000 / KY-033 IR Reflective Sensor State'''

if target_c in text and 'this.lcdAddress' not in text:
    text = text.replace(target_c, lcd_c)
    print('Added LCD constructor state')

# 2. resetHardwareState
target_r = "} else if (labName === 'ir') {"
lcd_r = """} else if (labName === 'lcd') {
      this.voltage = 5.0;
      this.currentMa = 35.0;
      this.lcdBacklight = true;
      this.lcdLine0 = 'I2C Bus Ready!  ';
      this.lcdLine1 = 'Address: 0x27   ';
      this.lcdCursorCol = 0;
      this.lcdCursorRow = 0;
      this.lcdScreenMode = 0;
      this.setLesson(1);
    } else if (labName === 'ir') {"""

if target_r in text and "labName === 'lcd'" not in text:
    text = text.replace(target_r, lcd_r)
    print('Added LCD resetHardwareState')

# 3. setLesson default state
target_l = "} else if (this.activeLab === 'ir') {"
lcd_l = """} else if (this.activeLab === 'lcd') {
      this.lcdBacklight = true;
      if (lessonId === 1) {
        this.lcdLine0 = 'I2C Bus Ready!  ';
        this.lcdLine1 = 'Address: 0x27   ';
      } else if (lessonId === 2) {
        this.lcdLine0 = '  ATL INNOVATE  ';
        this.lcdLine1 = 'COL:0-15 ROW:0-1';
      } else if (lessonId === 3) {
        this.lcdLine0 = 'Arduino + ATL   ';
        this.lcdLine1 = '5x8 Pixel Glyph ';
      } else if (lessonId === 4) {
        this.lcdLine0 = 'CLIMATE MONITOR ';
        this.lcdLine1 = 'Temp: 25.0 C    ';
        this.lcdScreenMode = 0;
      }
      this.voltage = 5.0;
      this.currentMa = 35.0;
    } else if (this.activeLab === 'ir') {"""

if target_l in text and "this.activeLab === 'lcd'" not in text:
    text = text.replace(target_l, lcd_l)
    print('Added LCD setLesson')

# 4. Helper methods for LCD
target_m = "  setIrSurface(type) {"
lcd_m = """  setLcdText(row, str) {
    const padded = (str + '                ').substring(0, 16);
    if (row === 0) this.lcdLine0 = padded;
    else this.lcdLine1 = padded;
    this.notifyHardware();
  }

  toggleLcdBacklight() {
    this.lcdBacklight = !this.lcdBacklight;
    this.currentMa = this.lcdBacklight ? 35.0 : 15.0;
    this.notifyHardware();
  }

  setLcdCursor(col, row) {
    this.lcdCursorCol = Math.max(0, Math.min(15, col));
    this.lcdCursorRow = Math.max(0, Math.min(1, row));
    this.notifyHardware();
  }

  setLcdCustomChar(bytes) {
    if (Array.isArray(bytes) && bytes.length === 8) {
      this.lcdCustomChar = bytes;
      this.notifyHardware();
    }
  }

  setLcdScreenMode(mode) {
    this.lcdScreenMode = mode % 3;
    if (this.lcdScreenMode === 0) {
      this.setLcdText(0, 'CLIMATE MONITOR ');
      this.setLcdText(1, 'Temp: ' + this.tempC.toFixed(1) + ' C');
    } else if (this.lcdScreenMode === 1) {
      this.setLcdText(0, 'RADAR PROXIMITY ');
      this.setLcdText(1, 'Dist: ' + this.sonarDistanceCm.toFixed(1) + ' cm');
    } else {
      this.setLcdText(0, 'SOLAR SKY LUX   ');
      this.setLcdText(1, 'Light: ' + this.ldrLux + ' Lux');
    }
  }

  setIrSurface(type) {"""

if target_m in text and 'setLcdText' not in text:
    text = text.replace(target_m, lcd_m)
    print('Added LCD helper methods')

# 5. getHardwareState
target_h = "      irSurface: this.irSurface,"
lcd_h = """      lcdBacklight: this.lcdBacklight,
      lcdLine0: this.lcdLine0,
      lcdLine1: this.lcdLine1,
      lcdCursorCol: this.lcdCursorCol,
      lcdCursorRow: this.lcdCursorRow,
      lcdCustomChar: this.lcdCustomChar,
      lcdScreenMode: this.lcdScreenMode,
      irSurface: this.irSurface,"""

if target_h in text and 'lcdBacklight:' not in text:
    text = text.replace(target_h, lcd_h)
    print('Added LCD properties to getHardwareState')

# 6. executeStep routing & step engines & oscilloscope
# Let's check where executeIrLesson4 is in simulation.js
marker_ir_engine = '  executeIrLesson4() {'
lcd_step_engines = """  executeLcdLesson1() {
    this.stepCount++;
    this.logToSerial("[I2C Bus] Master Arduino -> Slave 0x27: Handshake ACK received! 16x2 HD44780 initialized.");
    this.notifyHardware();
  }
  executeLcdLesson2() {
    this.stepCount++;
    this.logToSerial("[I2C LCD] setCursor(" + this.lcdCursorCol + ", " + this.lcdCursorRow + ") -> Write: '" + (this.lcdCursorRow === 0 ? this.lcdLine0 : this.lcdLine1).trim() + "'");
    this.notifyHardware();
  }
  executeLcdLesson3() {
    this.stepCount++;
    this.logToSerial("[CGRAM 5x8] Custom glyph uploaded to slot 0: [B" + this.lcdCustomChar[1].toString(2).padStart(5, '0') + ", B" + this.lcdCustomChar[2].toString(2).padStart(5, '0') + "...]");
    this.notifyHardware();
  }
  executeLcdLesson4() {
    if (this.stepCount % 6 === 0) {
      this.setLcdScreenMode(this.lcdScreenMode + 1);
      this.logToSerial("[IoT Command Deck] Page switch -> " + (this.lcdScreenMode === 0 ? "CLIMATE" : this.lcdScreenMode === 1 ? "RADAR" : "SOLAR"));
    }
    this.stepCount++;
  }

  executeIrLesson4() {"""

if marker_ir_engine in text and 'executeLcdLesson1' not in text:
    text = text.replace(marker_ir_engine, lcd_step_engines)
    print('Added LCD step engines')

# 7. executeStep routing
target_es = "} else if (this.activeLab === 'ir') {"
lcd_es = """} else if (this.activeLab === 'lcd') {
      if (this.activeLessonId === 1) this.executeLcdLesson1();
      else if (this.activeLessonId === 2) this.executeLcdLesson2();
      else if (this.activeLessonId === 3) this.executeLcdLesson3();
      else if (this.activeLessonId === 4) this.executeLcdLesson4();
    } else if (this.activeLab === 'ir') {"""

if target_es in text and "this.activeLab === 'lcd'" not in text:
    text = text.replace(target_es, lcd_es)
    print('Added LCD executeStep routing')

# 8. Oscilloscope trace for LCD
target_scope = "    } else if (this.activeLab === 'ir') {"
lcd_scope = """    } else if (this.activeLab === 'lcd') {
      const sdaY = h * 0.35;
      const sclY = h * 0.70;

      // Channel 1: SDA Serial Data Pin A4 (Cyan I2C Packet Bursts)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, sdaY);
      const packetW = 20;
      for (let i = 0; i < 6; i++) {
        const startX = 25 + (i * packetW * 1.5);
        ctx.lineTo(startX, sdaY);
        ctx.lineTo(startX, sdaY - 26);
        ctx.lineTo(startX + packetW * 0.6, sdaY - 26);
        ctx.lineTo(startX + packetW * 0.6, sdaY);
        ctx.lineTo(startX + packetW, sdaY);
      }
      ctx.lineTo(w, sdaY);
      ctx.stroke();

      // Channel 2: SCL Serial Clock Pin A5 (Yellow 100kHz Synchronous Clock Train)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, sclY);
      const clockCycle = 10;
      for (let x = 20; x < w - 20; x += clockCycle) {
        ctx.lineTo(x, sclY);
        ctx.lineTo(x, sclY - 22);
        ctx.lineTo(x + clockCycle / 2, sclY - 22);
        ctx.lineTo(x + clockCycle / 2, sclY);
      }
      ctx.lineTo(w, sclY);
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('CH1 (SDA Pin A4): I2C Data Packets (Addr 0x27)', 10, sdaY - 32);

      ctx.fillStyle = '#facc15';
      ctx.fillText('CH2 (SCL Pin A5): 100kHz Synchronous Clock Train', 10, sclY - 28);

    } else if (this.activeLab === 'ir') {"""

if target_scope in text and "this.activeLab === 'lcd'" not in text:
    text = text.replace(target_scope, lcd_scope)
    print('Added LCD oscilloscope trace')

with open('js/simulation.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated simulation.js for LCD!')
