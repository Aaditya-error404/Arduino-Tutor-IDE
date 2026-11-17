# -*- coding: utf-8 -*-
"""
Apply Genuine Line-by-Line Stepping Engine to js/simulation.js and js/app.js
- setup() executed once sequentially
- loop() looped continuously
- Both columns highlighted in sync with Lime Green #65A30D
- Smooth scrolling inside code containers
- Hardware state updated in lockstep with each line
"""

import re

# =========================================================================
# 1. UPDATE js/simulation.js
# =========================================================================
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_js = f.read()

# 1A. Add execution plan fields to constructor
if 'this.stepPhase' not in sim_js:
    sim_js = sim_js.replace(
        'this.stepCount = 0;',
        '''this.stepCount = 0;
    this.stepPhase = 'setup'; // 'setup' then 'loop'
    this.stepPointer = 0;
    this.setupSteps = [];
    this.loopSteps = [];'''
    )

# 1B. Replace executeStep and add buildExecutionPlan & applyHardwareStep
old_execute_step = re.search(r'executeStep\(\)\s*\{[\s\S]*?\n    const duration = Math\.max[\s\S]*?\n  \}', sim_js)
if old_execute_step:
    new_stepping_code = """buildExecutionPlan() {
    this.setupSteps = [];
    this.loopSteps = [];

    const cppRows = Array.from(document.querySelectorAll('.code-row-cpp'));
    if (cppRows.length === 0) {
      this.loopSteps.push({ lineIndex: 0, text: "Simulation running...", duration: 600 });
      return;
    }

    let inSetup = false;
    let inLoop = false;
    let setupFound = false;
    let loopFound = false;

    cppRows.forEach((row, idx) => {
      const text = (row.querySelector('.line-content')?.textContent || '').trim();
      if (!text || text === '{' || text === '}') return;

      if (text.includes('void setup') || text.includes('setup()') || text.includes('When power turns ON')) {
        inSetup = true;
        inLoop = false;
        setupFound = true;
        this.setupSteps.push({ lineIndex: idx, text: text, duration: 400 });
        return;
      }
      if (text.includes('void loop') || text.includes('loop()') || text.includes('REPEAT FOREVER')) {
        inSetup = false;
        inLoop = true;
        loopFound = true;
        return;
      }

      if (inSetup) {
        this.setupSteps.push({
          lineIndex: idx,
          text: `setup() > ${text}`,
          duration: 500
        });
      } else if (inLoop) {
        this.loopSteps.push({
          lineIndex: idx,
          text: `loop() > ${text}`,
          duration: text.toLowerCase().includes('delay') ? 800 : 500
        });
      } else if (!setupFound && !loopFound) {
        this.setupSteps.push({
          lineIndex: idx,
          text: text,
          duration: 350
        });
      }
    });

    if (this.loopSteps.length === 0) {
      cppRows.forEach((row, idx) => {
        const text = (row.querySelector('.line-content')?.textContent || '').trim();
        if (!text) return;
        if (idx <= 1 && cppRows.length > 2) {
          this.setupSteps.push({ lineIndex: idx, text: text, duration: 400 });
        } else {
          this.loopSteps.push({ lineIndex: idx, text: text, duration: 600 });
        }
      });
    }

    if (this.loopSteps.length === 0) {
      this.loopSteps.push({ lineIndex: 0, text: "Virtual hardware loop active", duration: 600 });
    }
  }

  applyHardwareStep(step) {
    const text = (step.text || '').toLowerCase();

    if (this.activeLab === 'led') {
      if (text.includes('high') || text.includes('turn pin 13 power on') || text.includes('5v')) {
        this.setPin13(true);
      } else if (text.includes('low') || text.includes('turn pin 13 power off') || text.includes('0v')) {
        this.setPin13(false);
      } else if (this.stepPhase === 'loop') {
        this.setPin13(this.stepCount % 2 === 1);
      }
    } else if (this.activeLab === 'servo') {
      if (text.includes('writeangle1') || (text.includes('write') && text.includes(String(this.servoAngle1)))) {
        this.servoAngle = this.servoAngle1;
      } else if (text.includes('writeangle2') || (text.includes('write') && text.includes(String(this.servoAngle2)))) {
        this.servoAngle = this.servoAngle2;
      } else if (this.activeLessonId === 4) {
        this.servoAngle += this.sweepDirection * 10;
        if (this.servoAngle >= 180) { this.servoAngle = 180; this.sweepDirection = -1; }
        else if (this.servoAngle <= 0) { this.servoAngle = 0; this.sweepDirection = 1; }
      } else {
        this.servoAngle = (this.loopCount % 2 === 0) ? this.servoAngle1 : this.servoAngle2;
      }
      this.updateServoPulse();
    } else if (this.activeLab === 'pot') {
      this.servoAngle = Math.round((this.potVal / 1023.0) * 180);
      this.updateServoPulse();
    } else if (this.activeLab === 'button') {
      this.buttonPressed = (this.loopCount % 2 === 1);
      this.buttonLedState = this.buttonPressed;
    } else if (this.activeLab === 'buzzer') {
      this.buzzerToneFreq = (this.loopCount % 2 === 0) ? 440 : 880;
      this.buzzerActive = true;
    } else if (this.activeLab === 'ldr') {
      this.ldrLightOn = this.ldrRaw < this.ldrThreshold;
    } else if (this.activeLab === 'rgb') {
      this.rgbHue = (this.rgbHue + 15) % 360;
      this.setRgbFromHue(this.rgbHue);
    } else if (this.activeLab === 'temp') {
      this.tempAlarmActive = this.tempC > this.tempThreshold;
      this.fanActive = this.tempC > 28.0;
      this.fanSpeed = this.fanActive ? 220 : 0;
    } else if (this.activeLab === 'sonar') {
      this.fireSonarPing();
    } else if (this.activeLab === 'ir') {
      this.emitIrBeam();
    } else if (this.activeLab === 'lcd') {
      this.lcdBacklight = true;
    } else if (this.activeLab === 'motor') {
      this.voltage = 5.0;
      this.currentMa = 850;
    } else if (this.activeLab === 'imu') {
      this.voltage = 3.3;
    } else if (this.activeLab === 'rfid') {
      this.voltage = 3.3;
    } else if (this.activeLab === 'iot') {
      this.voltage = 3.3;
    }
  }

  executeStep() {
    if (!this.isRunning || this.isPaused) return;

    let step = null;
    if (this.stepPhase === 'setup') {
      if (this.stepPointer < this.setupSteps.length) {
        step = this.setupSteps[this.stepPointer];
        this.stepPointer++;
      } else {
        this.stepPhase = 'loop';
        this.stepPointer = 0;
        this.loopCount++;
        step = this.loopSteps[this.stepPointer];
        this.stepPointer++;
      }
    } else {
      if (this.stepPointer >= this.loopSteps.length) {
        this.stepPointer = 0;
        this.loopCount++;
      }
      step = this.loopSteps[this.stepPointer];
      this.stepPointer++;
    }

    if (!step) return;

    this.stepCount = (this.stepCount || 0) + 1;
    this.currentStepIndex = step.lineIndex;

    this.applyHardwareStep(step);
    this.notifyHardware();

    if (this.onStepChange) {
      this.onStepChange({
        loopCount: this.loopCount,
        text: step.text,
        cppLine: step.lineIndex,
        lineIndex: step.lineIndex,
        stepPhase: this.stepPhase
      });
    }

    const duration = Math.max(100, Math.round((step.duration || 600) / this.speed));
    this.timerId = setTimeout(() => {
      this.executeStep();
    }, duration);
  }"""
    sim_js = sim_js[:old_execute_step.start()] + new_stepping_code + sim_js[old_execute_step.end():]

# 1C. In start(), buildExecutionPlan() and reset pointers if not paused
old_start_method = re.search(r'start\(\)\s*\{[\s\S]*?this\.startScopeLoop\(\);\s*this\.executeStep\(\);\s*\}', sim_js)
if old_start_method:
    new_start_method = """start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.activeLab === 'led') {
      if (this.activeLessonId === 2 && !this.pin13Configured) {
        this.claimPin13(true);
      }
    } else if (this.activeLab === 'servo') {
      if (this.activeLessonId === 2 && !this.servoAttached) {
        this.attachServoPin(9);
      }
    }

    const wasPaused = this.isPaused;
    this.isRunning = true;
    this.isPaused = false;

    if (!wasPaused) {
      this.stepPhase = 'setup';
      this.stepPointer = 0;
      this.loopCount = 0;
      this.stepCount = 0;
      this.buildExecutionPlan();
    }

    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playToggle(true);
    }

    this.startScopeLoop();
    this.executeStep();
  }"""
    sim_js = sim_js[:old_start_method.start()] + new_start_method + sim_js[old_start_method.end():]

# 1D. In stop(), reset stepPhase and stepPointer
old_stop = re.search(r'stop\(\)\s*\{[\s\S]*?this\.timerId = null;\s*\}', sim_js)
if old_stop:
    new_stop = """stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.stepPhase = 'setup';
    this.stepPointer = 0;
    this.loopCount = 0;
    this.stepCount = 0;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.scopeAnimId) {
      cancelAnimationFrame(this.scopeAnimId);
      this.scopeAnimId = null;
    }
    if (this.onStepChange) {
      this.onStepChange(null);
    }
  }"""
    sim_js = sim_js[:old_stop.start()] + new_stop + sim_js[old_stop.end():]

with open('js/simulation.js', 'w', encoding='utf-8') as f:
    f.write(sim_js)
print("Updated js/simulation.js successfully!")


# =========================================================================
# 2. UPDATE js/app.js
# =========================================================================
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 2A. Update highlightLines to auto-scroll into view smoothly
old_highlight = re.search(r'function highlightLines\(stepInfo\) \{[\s\S]*?\n  \}', app_js)
if old_highlight:
    new_highlight = """function highlightLines(stepInfo) {
    let lineToHighlight = null;
    if (stepInfo.cppLine !== undefined && stepInfo.cppLine !== null) {
      lineToHighlight = stepInfo.cppLine;
    } else if (stepInfo.lineIndex !== undefined) {
      lineToHighlight = stepInfo.lineIndex;
    }

    if (lineToHighlight !== null) {
      const plainRows = document.querySelectorAll('.code-row-human');
      const cppRows = document.querySelectorAll('.code-row-cpp');

      let targetPlain = document.querySelector(`.code-row-human[data-line="${lineToHighlight}"]`);
      if (!targetPlain && plainRows.length > 0) {
        const clampedIndex = Math.min(Math.max(0, lineToHighlight), plainRows.length - 1);
        targetPlain = plainRows[clampedIndex];
      }

      let targetCpp = document.querySelector(`.code-row-cpp[data-line="${lineToHighlight}"]`);
      if (!targetCpp && cppRows.length > 0) {
        const clampedIndex = Math.min(Math.max(0, lineToHighlight), cppRows.length - 1);
        targetCpp = cppRows[clampedIndex];
      }

      if (targetPlain) {
        targetPlain.classList.add('executing');
        try {
          targetPlain.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch(e) {}
      }
      if (targetCpp) {
        targetCpp.classList.add('executing');
        try {
          targetCpp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch(e) {}
      }
    }
  }"""
    app_js = app_js[:old_highlight.start()] + new_highlight + app_js[old_highlight.end():]

# Cache bust in index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'simulation\.js\?v=\d+', 'simulation.js?v=27', html)
html = re.sub(r'app\.js\?v=\d+', 'app.js?v=27', html)
html = re.sub(r'styles\.css\?v=\d+', 'styles.css?v=27', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html cache bust!")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated js/app.js successfully!")
