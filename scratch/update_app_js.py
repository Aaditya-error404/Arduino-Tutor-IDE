import re

with open("js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Enhance switchLab to update active-lab-name-pill and highlight card in modal
old_switch_lab_target = """    if (currentLabLabel) currentLabLabel.textContent = labNames[labName] || 'Arduino Lab';

    // 2. Toggle SVG views across all labs"""

new_switch_lab_snippet = """    if (currentLabLabel) currentLabLabel.textContent = labNames[labName] || 'Arduino Lab';

    // Update active lab badge in header
    const activeLabNamePill = document.getElementById('active-lab-name-pill');
    if (activeLabNamePill) {
      const shortNames = {
        led: '💡 LED Blink',
        servo: '🦾 Servo Motor',
        button: '🔘 Pushbutton',
        pot: '🎛️ Potentiometer',
        buzzer: '📢 Piezo Buzzer',
        cad: '🧊 3D CAD Studio',
        dmm: '⚡ Multimeter DMM',
        ldr: '☀️ LDR Light Sensor',
        rgb: '🌈 RGB Color LED',
        temp: '🌡️ Temperature Sensor',
        sonar: '🦇 Ultrasonic Radar',
        ir: '🏁 IR Line Sensor',
        slicer: '🖨️ 3D Slicer Engine',
        dht: '💧 DHT Climate Station',
        gas: '🧪 MQ Gas & AQI',
        lcd: '📟 16x2 I2C LCD',
        oled: '🖥️ SSD1306 OLED',
        soil: '🌱 Soil & 5V Relay',
        motor: '🏎️ L298N Motor Driver',
        imu: '🧭 MPU6050 6-Axis IMU',
        rfid: '🏷️ RC522 RFID Access',
        iot: '☁️ ESP32 IoT Cloud'
      };
      activeLabNamePill.textContent = shortNames[labName] || labName;
    }

    // Update active lab card highlight in explorer modal
    document.querySelectorAll('.explorer-lab-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-lab') === labName);
    });

    // 2. Toggle SVG views across all labs"""

if old_switch_lab_target in content:
    content = content.replace(old_switch_lab_target, new_switch_lab_snippet)
    print("Enhanced switchLab successfully!")
else:
    print("WARNING: old_switch_lab_target not found!")

# 2. Enhance switchLesson to update stepper, progress bar, and step-advance-card
old_switch_lesson_target = """    // Render Lesson Components
    renderLessonHeader(lesson);
    renderAnalogy(lesson);
    renderJargonPills(lesson);
    renderInteractiveTask(lesson);
    renderCodeTranslator(lesson);
    renderTeacherInsights();
    setDeskView('lab');
  }"""

new_switch_lesson_snippet = """    // Render Lesson Components
    renderLessonHeader(lesson);
    renderAnalogy(lesson);
    renderJargonPills(lesson);
    renderInteractiveTask(lesson);
    renderCodeTranslator(lesson);
    renderTeacherInsights();
    setDeskView('lab');

    // Update Stepper Controls & Progress Bar
    const lessonStepIndicator = document.getElementById('lesson-step-indicator');
    if (lessonStepIndicator) {
      lessonStepIndicator.textContent = `Step ${index + 1} of ${lessons.length}`;
    }
    const progressBar = document.getElementById('lesson-progress-bar');
    if (progressBar) {
      const pct = Math.round(((index + 1) / lessons.length) * 100);
      progressBar.style.width = `${pct}%`;
    }
    const prevBtn = document.getElementById('prev-lesson-btn');
    if (prevBtn) {
      prevBtn.disabled = (index === 0);
    }
    const nextBtn = document.getElementById('next-lesson-btn');
    if (nextBtn) {
      nextBtn.disabled = (index >= lessons.length - 1);
    }

    // Update Step Advance Card
    const advanceTitle = document.getElementById('step-advance-title');
    const advanceDesc = document.getElementById('step-advance-desc');
    const advanceBtn = document.getElementById('btn-advance-step');
    if (advanceTitle && advanceDesc && advanceBtn) {
      if (index < lessons.length - 1) {
        const nextLesson = lessons[index + 1];
        advanceTitle.textContent = `Ready for Step ${index + 2}?`;
        advanceDesc.textContent = `Up next: ${nextLesson.title || nextLesson.shortTitle}. Complete this step to advance!`;
        advanceBtn.innerHTML = `<span>Next: ${nextLesson.shortTitle}</span> <span class="arrow">▶</span>`;
      } else {
        advanceTitle.textContent = `🎉 Lab Complete! Outstanding Work!`;
        advanceDesc.textContent = `You've completed all 4 lessons in this lab. Ready for the next adventure?`;
        advanceBtn.innerHTML = `<span>Explore Next Lab</span> <span class="arrow">🚀</span>`;
      }
    }
  }"""

if old_switch_lesson_target in content:
    content = content.replace(old_switch_lesson_target, new_switch_lesson_snippet)
    print("Enhanced switchLesson successfully!")
else:
    print("WARNING: old_switch_lesson_target not found!")

# 3. Add Lab Explorer Modal & Stepper Initialization before URL parameter handling
lab_explorer_code = """
  // =========================================================================
  // LAB EXPLORER MODAL & STEPPER INITIALIZATION
  // =========================================================================

  const LABS_METADATA = [
    // Level 1: Grades 6-8 (7 Labs)
    { slug: 'led', icon: '💡', title: 'LED Digital Blink', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Learn digital HIGH/LOW states, breadboard circuits, current-limiting resistors, and blinking rhythms.' },
    { slug: 'servo', icon: '🦾', title: 'SG90 Micro Servo', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Command robotic arm angles (0° to 180°) using 50Hz PWM pulses and the Servo library.' },
    { slug: 'button', icon: '🔘', title: 'Tactile Pushbutton', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Connect tactile inputs with internal pullup resistors and control circuits using if/else logic.' },
    { slug: 'pot', icon: '🎛️', title: '10k Potentiometer', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Read analog voltage inputs (0–1023), map numbers, and steer virtual motor positions smoothly.' },
    { slug: 'buzzer', icon: '📢', title: 'Piezo Buzzer', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Generate square wave frequencies, program emergency sirens, and compose 8-note piano tunes.' },
    { slug: 'cad', icon: '🧊', title: '3D CAD Studio', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Design 3D mechanical brackets in Tinkercad CSG with solid shapes, hole booleans, and calipers.' },
    { slug: 'dmm', icon: '⚡', title: 'Multimeter DMM', grade: '6-8', level: 'Level 1', badge: 'badge-g68', summary: 'Measure voltages, decode resistor color bands, and troubleshoot broken circuits hands-on.' },

    // Level 2: Grades 9-10 (8 Labs)
    { slug: 'ldr', icon: '☀️', title: 'LDR Light Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Build smart streetlamps using photoresistors, voltage dividers, and lux hysteresis thresholds.' },
    { slug: 'rgb', icon: '🌈', title: 'RGB Color LED', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Mix 16 million colors with 8-bit PWM channels (0–255), mood lights, and color pickers.' },
    { slug: 'temp', icon: '🌡️', title: 'Temperature Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Convert analog millivolts to Celsius with TMP36 and automate greenhouse cooling fans.' },
    { slug: 'sonar', icon: '🦇', title: 'Ultrasonic Radar', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Measure obstacle distance via speed of sound echo pulses (HC-SR04) and build reverse parking sensors.' },
    { slug: 'ir', icon: '🏁', title: 'IR Line Sensor', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Calibrate optical reflectance and comparator potentiometers for autonomous line-following rovers.' },
    { slug: 'slicer', icon: '🖨️', title: '3D Slicer Engine', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Slice 3D models into G-code layers: customize infill density, hotend temperatures, and print paths.' },
    { slug: 'dht', icon: '💧', title: 'DHT Climate Station', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Decode digital single-bus packets for temperature & humidity, and compute heat index comfort.' },
    { slug: 'gas', icon: '🧪', title: 'MQ Gas & AQI', grade: '9-10', level: 'Level 2', badge: 'badge-g910', summary: 'Detect hazardous smoke, LPG, and CO air quality concentrations with emergency alarms.' },

    // Level 3: Grades 11-12 (7 Labs)
    { slug: 'lcd', icon: '📟', title: '16x2 I2C LCD', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Display live sensor telemetry, render custom 5x8 pixel characters, and build cockpit dashboards.' },
    { slug: 'oled', icon: '🖥️', title: 'SSD1306 OLED', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Render 128x64 monochrome bitmaps, oscilloscope wave graphs, and high-res telemetry UI.' },
    { slug: 'soil', icon: '🌱', title: 'Soil & 5V Relay', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Automate precision agriculture: monitor soil moisture and drive a 5V pump relay safely.' },
    { slug: 'motor', icon: '🏎️', title: 'L298N Motor Driver', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Master dual H-bridge motor drivers, PWM speed control, and skid-steer rover kinematics.' },
    { slug: 'imu', icon: '🧭', title: 'MPU6050 6-Axis IMU', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Read pitch, roll, and gyro angular rates over I2C to stabilize 3D aircraft and robotic gimbals.' },
    { slug: 'rfid', icon: '🏷️', title: 'RC522 RFID Access', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Read 13.56MHz smart keycards via SPI protocol, whitelist UIDs, and unlock servo security latches.' },
    { slug: 'iot', icon: '☁️', title: 'ESP32 IoT Cloud', grade: '11-12', level: 'Level 3', badge: 'badge-g1112', summary: 'Connect ESP32 Wi-Fi to MQTT cloud brokers, publish live telemetry, and control smart appliances.' }
  ];

  function openLabExplorer() {
    const modal = document.getElementById('lab-explorer-modal');
    if (modal) {
      modal.classList.remove('hidden');
      renderLabExplorerCards('all', '');
      const searchInput = document.getElementById('lab-search-input');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
    }
  }

  function closeLabExplorer() {
    const modal = document.getElementById('lab-explorer-modal');
    if (modal) modal.classList.add('hidden');
  }

  function renderLabExplorerCards(gradeFilter = 'all', query = '') {
    const container = document.getElementById('explorer-cards-grid');
    if (!container) return;

    const q = query.trim().toLowerCase();
    const filtered = LABS_METADATA.filter(lab => {
      const matchGrade = (gradeFilter === 'all' || lab.grade === gradeFilter);
      const matchQuery = !q || (
        lab.title.toLowerCase().includes(q) ||
        lab.slug.toLowerCase().includes(q) ||
        lab.summary.toLowerCase().includes(q)
      );
      return matchGrade && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍 No matching labs found</p>
          <p style="font-size: 0.85rem;">Try searching for "servo", "CAD", "sonar", "LED", or "sensor".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(lab => {
      const isCurrent = (lab.slug === state.activeLab);
      return `
        <div class="explorer-lab-card ${isCurrent ? 'active' : ''}" data-lab="${lab.slug}">
          <div class="explorer-card-top">
            <span class="explorer-card-icon">${lab.icon}</span>
            <span class="explorer-card-badge ${lab.badge}">Grades ${lab.grade} • ${lab.level}</span>
          </div>
          <h4 class="explorer-card-title">${lab.title}</h4>
          <p class="explorer-card-summary">${lab.summary}</p>
          <div class="explorer-card-footer">
            <span class="explorer-card-lessons">📚 4 Lessons</span>
            <button class="btn-open-lab">${isCurrent ? 'Active Lab ✓' : 'Open Lab ▶'}</button>
          </div>
        </div>
      `;
    }).join('');

    // Reattach card click listeners
    container.querySelectorAll('.explorer-lab-card').forEach(card => {
      card.addEventListener('click', () => {
        const labSlug = card.getAttribute('data-lab');
        if (labSlug) {
          switchLab(labSlug);
          closeLabExplorer();
        }
      });
    });
  }

  function initLabExplorerAndStepper() {
    // 1. Open/Close Lab Explorer Modal
    const openBtn = document.getElementById('open-lab-explorer-btn');
    if (openBtn) openBtn.addEventListener('click', openLabExplorer);

    const closeBtn = document.getElementById('close-lab-explorer');
    if (closeBtn) closeBtn.addEventListener('click', closeLabExplorer);

    const closeFooterBtn = document.getElementById('btn-close-explorer-footer');
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeLabExplorer);

    // Close on backdrop click
    const modalBackdrop = document.getElementById('lab-explorer-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeLabExplorer();
      });
    }

    // 2. Search Input in Explorer
    const searchInput = document.getElementById('lab-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activePill = document.querySelector('.explorer-grade-pill.active');
        const grade = activePill ? activePill.getAttribute('data-grade') : 'all';
        renderLabExplorerCards(grade, e.target.value);
      });
    }

    // 3. Grade Filter Pills in Explorer
    const gradePills = document.querySelectorAll('.explorer-grade-pill');
    gradePills.forEach(pill => {
      pill.addEventListener('click', () => {
        gradePills.forEach(p => p.classList.toggle('active', p === pill));
        const grade = pill.getAttribute('data-grade');
        const q = searchInput ? searchInput.value : '';
        renderLabExplorerCards(grade, q);
      });
    });

    // 4. Stepper Prev / Next Buttons in sub-header ribbon
    const prevBtn = document.getElementById('prev-lesson-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.activeLessonIndex > 0) {
          if (window.soundEngine) window.soundEngine.playClick();
          switchLesson(state.activeLessonIndex - 1);
        }
      });
    }

    const nextBtn = document.getElementById('next-lesson-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const lessons = getCurrentLessons();
        if (state.activeLessonIndex < lessons.length - 1) {
          if (window.soundEngine) window.soundEngine.playClick();
          switchLesson(state.activeLessonIndex + 1);
        }
      });
    }

    // 5. Frictionless Step Advance Card Button
    const advanceBtn = document.getElementById('btn-advance-step');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        const lessons = getCurrentLessons();
        if (state.activeLessonIndex < lessons.length - 1) {
          if (window.soundEngine) window.soundEngine.playSuccess();
          switchLesson(state.activeLessonIndex + 1);
        } else {
          if (window.soundEngine) window.soundEngine.playSuccess();
          openLabExplorer();
        }
      });
    }
  }

  initLabExplorerAndStepper();
"""

target_before_boot = "  // --- Initial App Boot with Direct URL Parameter Support ---"

if target_before_boot in content:
    content = content.replace(target_before_boot, lab_explorer_code + "\n  " + target_before_boot)
    print("Added lab_explorer_code successfully!")
else:
    print("WARNING: target_before_boot not found!")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated js/app.js successfully!")
