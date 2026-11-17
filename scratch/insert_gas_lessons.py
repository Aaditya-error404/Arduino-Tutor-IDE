# -*- coding: utf-8 -*-
"""
Script to insert GAS_LESSONS_DATA into js/lessons.js
"""

gas_lessons_code = '''
const GAS_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 61: The Chemical Nose: Tin Dioxide (SnO₂) & Heating Coils",
    shortTitle: "61. Tin Dioxide Chemistry",
    subtitle: "Surface Adsorption: How Heating Coil Activates Oxygen Ions to Sniff Gases",
    summary: "Discover the physical chemistry inside the steel mesh dome! Learn why the MQ-2 sensor requires a 5V internal heater to reach 300°C, and how combustible gas molecules strip away oxygen ions to drop sensor resistance.",
    mascotMsg: "Meet your robot's chemical nose! 🧪 Inside the metal dome is an electrical heating coil that glows red-hot at 300°C! When gas molecules hit the hot ceramic surface, an invisible chemical reaction releases trapped electrons. Let's see how!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "Gas & Environmental",
    labId: "gas",
    analogy: {
      headline: "The Busy Security Guard at the Door",
      story: "Imagine a concert venue door guarded by 10 security guards (oxygen ions). The guards block electrons from flowing through the door, causing high electrical resistance. When smoke or LPG gas molecules arrive, they react with the guards and distract them away from the door! With the guards gone, millions of electrons surge through the door, causing resistance to plunge down! The more gas in the air, the more electrons rush through!",
      hardwareMetaphor: "The metal oxide semiconductor (MOS) element uses Tin Dioxide (SnO2); in clean air, adsorbed oxygen traps free conduction-band electrons."
    },
    jargonBuster: [
      {
        word: "Tin Dioxide (SnO₂)",
        pronunciation: "TIN dye-AHK-syde",
        analogy: "The Chemical Sensor Sponge",
        definition: "A metal oxide semiconductor whose surface electrical conductivity increases when exposed to reducing gases."
      },
      {
        word: "Heating Coil (VH)",
        pronunciation: "HEET-ing Koyl",
        analogy: "The Micro Ceramic Oven",
        definition: "An internal nichrome wire powered by 5V (drawing ~150mA) to maintain the 300°C operating temperature."
      },
      {
        word: "PPM (Parts Per Million)",
        pronunciation: "Pee-pee-em",
        analogy: "Drops of Ink in a Swimming Pool",
        definition: "Unit of gas concentration: 1 PPM means 1 gas molecule per 1,000,000 air molecules."
      },
      {
        word: "Sensor Resistance (Rs)",
        pronunciation: "SEN-sur ri-ZIS-tuns",
        analogy: "The Variable Chemical Resistor",
        definition: "The internal electrical resistance of the SnO2 layer, which drops as gas concentration rises."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Supply 5V Power to Internal Heating Element:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Wait 20 seconds preheat cycle until SnO2 reaches 300°C operating thermal balance", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Read Analog Output Voltage on Pin A0:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Clean Ambient Air: Sensor Resistance Rs = 20,000Ω -> Pin A0 reads 0.65V (ADC 133)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Gas/Smoke Detected: Sensor Resistance Rs drops to 2,000Ω -> Pin A0 jumps to 3.25V (ADC 665)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "STEP 3: Voltage surge detected -> Trigger emergency response!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// MQ Gas Sensor Analog Reading", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const int PIN_MQ_ANALOG = A0;", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "void setup() {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  Serial.begin(9600);", indent: 1, tag: "setup" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "block-end" },
        { id: "c7", line: 7, text: "", indent: 0, tag: "empty" },
        { id: "c8", line: 8, text: "void loop() {", indent: 0, tag: "block-start" },
        { id: "c9", line: 9, text: "  int rawADC = analogRead(PIN_MQ_ANALOG);", indent: 1, tag: "code" },
        { id: "c10", line: 10, text: "  float voltage = rawADC * (5.0 / 1023.0);", indent: 1, tag: "code" },
        { id: "c11", line: 11, text: "  Serial.print(\\"Sensor Voltage: \\"); Serial.println(voltage);", indent: 1, tag: "code" },
        { id: "c12", line: 12, text: "  delay(500);", indent: 1, tag: "code" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Semiconductor Surface Adsorption & Chemi-Resistive Physics",
      pedagogy: "Introduces chemi-resistors and surface catalysis. Explains how chemical reactions modulate electrical bandgaps in solid-state semiconductors.",
      misconceptions: [
        {
          title: "Misconception: 'Why does the MQ sensor feel hot to the touch? Is it broken?'",
          detail: "It is supposed to be hot! The internal heating coil must maintain 300°C for oxygen ions to absorb on the tin dioxide crystal lattice. Without heat, the sensor is completely blind to gas."
        }
      ],
      discussionPrompts: [
        "Why does the sensor have a double stainless-steel mesh dome? (Explosion protection: prevents the 300°C internal coil from igniting surrounding flammable LPG/methane!).",
        "Why must a brand-new MQ sensor undergo a 'burn-in' warm-up of 24-48 hours before calibrated factory measurements?"
      ],
      standards: [
        "NGSS HS-PS1-5: Apply scientific principles and evidence to provide an explanation about the effects of changing the temperature or concentration of reacting particles.",
        "NITI Aayog ATL Equipment Package P3: Chemical Sensors, Explosive Gas Safety, and Air Quality Auditing."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 62: Reading Logarithmic Sensitivity Curves (Rs/R0 Math)",
    shortTitle: "62. Logarithmic Sensitivity",
    subtitle: "Power-Law Math: Converting Analog Volts to Exact Gas Concentration in PPM",
    summary: "Master the mathematics of chemical calibration! Convert raw ADC voltage to sensor resistance (Rs), calibrate clean air baseline (R0), and use logarithmic power-law equations to calculate exact PPM for LPG, Smoke, and CO.",
    mascotMsg: "A voltage of 2.5V doesn't tell us how many PPM of gas are in the room! To calculate real PPM, we must read the sensor datasheet's logarithmic sensitivity curve. Let's unlock the power-law equation!",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Gas & Environmental",
    labId: "gas",
    analogy: {
      headline: "The Earthquake Richter Scale",
      story: "On the Richter scale, an earthquake of magnitude 6 isn't just 1 point bigger than a magnitude 5 — it is 10 times more powerful! That is a logarithmic scale. The human nose and the MQ-2 sensor both perceive gas concentration logarithmically: your nose can smell 1 drop of perfume in a room, but needs 100 drops to smell twice as strong. A power-law formula (PPM = A * (Rs/R0)^B) straightens out this curved response into exact numbers!",
      hardwareMetaphor: "The Rs/R0 ratio normalizes sensor readings against ambient baseline variations, temperature drift, and humidity shifts."
    },
    jargonBuster: [
      {
        word: "Rs/R0 Ratio",
        pronunciation: "R-sub-S over R-sub-zero",
        analogy: "The Relative Deviation Ratio",
        definition: "Sensor resistance in gas (Rs) divided by sensor resistance in clean fresh air (R0)."
      },
      {
        word: "Logarithmic Scale",
        pronunciation: "lawg-uh-RITH-mik Skayl",
        analogy: "Powers of 10 Steps",
        definition: "A scale where each grid division multiplies by 10 (10, 100, 1000, 10000 PPM)."
      },
      {
        word: "Power-Law Formula",
        pronunciation: "POW-er Law",
        analogy: "The Curve Straightener",
        definition: "The algebraic formula: PPM = a * (Rs/R0)^b that calculates gas concentration."
      },
      {
        word: "Load Resistor (RL)",
        pronunciation: "LOHD ri-ZIS-tur",
        analogy: "Voltage Divider Partner",
        definition: "A precision SMD resistor (usually 1kΩ to 10kΩ) wired in series with the sensor to form a voltage divider."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Calibrate Clean Air Baseline (R0):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "In fresh outdoor air, sample voltage and solve for R0 (Base Resistance = 9.83kΩ)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Calculate Active Sensor Resistance (Rs):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Rs = ((5.0 - Vout) * RL) / Vout (where RL = 5.0kΩ)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "STEP 3: Apply MQ-2 LPG Curve Power Law:", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "LPG_PPM = 574.25 * pow(Rs/R0, -2.222);", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "Result: Rs/R0 = 0.52 -> Calculated Gas Density = 245 PPM!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Converting MQ Analog Voltage to Gas PPM", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const float R0 = 9.83; // Calibrated clean air base", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const float RL = 5.0;  // 5k load resistor", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "empty" },
        { id: "c5", line: 5, text: "float calculatePpm(float vOut) {", indent: 0, tag: "block-start" },
        { id: "c6", line: 6, text: "  float rs = ((5.0 - vOut) * RL) / vOut;", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "  float ratio = rs / R0;", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  // MQ-2 LPG datasheet power-law curve: A=574.25, B=-2.222", indent: 1, tag: "comment" },
        { id: "c9", line: 9, text: "  return 574.25 * pow(ratio, -2.222);", indent: 1, tag: "code" },
        { id: "c10", line: 10, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Logarithmic Functions, Power Laws & Non-Linear Calibration",
      pedagogy: "Bridges high-school algebra (logarithms, exponents, power-law regression) to sensor engineering. Shows students that real-world sensors are rarely linear.",
      misconceptions: [
        {
          title: "Misconception: 'If voltage doubles from 1V to 2V, does the gas PPM double?'",
          detail: "No! Because the sensitivity curve is power-law, doubling voltage can represent a 10x or 50x increase in gas PPM depending on the gas species. Linear approximation causes dangerous errors."
        }
      ],
      discussionPrompts: [
        "Why does the MQ-2 sensor respond to multiple gases (LPG, smoke, methane), and how can you distinguish them? (Sensor arrays / e-noses).",
        "Why is calibration in clean fresh air necessary before using the sensor indoors?"
      ],
      standards: [
        "NGSS HS-PS1-7: Use mathematical representations to support the claim that atoms, and therefore mass, are conserved during a chemical reaction.",
        "CSTA 2-AP-14: Create clearly named variables and perform operations on their values."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 63: The Gas Leak & Fire Smoke Alarm System",
    shortTitle: "63. Emergency Alarm Studio",
    subtitle: "Hardware Comparator Interrupts: Digital DO Pin & Dual-Tone Piezo Siren",
    summary: "Build a life-saving disaster warning system! Program the onboard LM393 op-amp comparator on Digital Pin 2 to trigger a hardware interrupt, sounding an instant buzzer siren and flashing a visual hazard strobe.",
    mascotMsg: "When gas leaks in a kitchen or a workshop, every microsecond counts! We can't wait for a slow code loop — we need an instant hardware interrupt that wakes up the Arduino and sounds the alarm immediately! 🚨📢",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Gas & Environmental",
    labId: "gas",
    analogy: {
      headline: "The School Fire Alarm Pull Station",
      story: "If a fire breaks out in a science lab, a student doesn't write an email to the principal and wait for a reply — they run to the wall and pull the red alarm handle! That pull station instantly rings bells throughout the entire school. The LM393 comparator chip on the MQ-2 board is that physical pull handle: when gas crosses your potentiometer threshold, Pin 2 instantly drops to LOW, commanding the Arduino to drop whatever it was doing and sound the siren!",
      hardwareMetaphor: "The LM393 compares analog sensor voltage against a potentiometer reference; when V_in > V_ref, open-collector output pulls Digital Pin 2 to Ground."
    },
    jargonBuster: [
      {
        word: "LM393 Comparator",
        pronunciation: "El-Em three-ninety-three",
        analogy: "The Balance Scale",
        definition: "An integrated circuit that compares two voltages and outputs 1 (Safe) or 0 (Alarm)."
      },
      {
        word: "Hardware Interrupt",
        pronunciation: "HARD-wair IN-ter-upt",
        analogy: "The Emergency Red Phone",
        definition: "A hardware signal that instantly pauses the main code loop to run a high-priority safety routine."
      },
      {
        word: "Threshold Trimmer",
        pronunciation: "THRESH-hohld TRIM-er",
        analogy: "The Sensitivity Dial",
        definition: "A tiny blue potentiometer on the module turned with a screwdriver to adjust alarm trigger sensitivity."
      },
      {
        word: "Siren Strobe",
        pronunciation: "SY-run Strohb",
        analogy: "Ambulance Lights & Horn",
        definition: "Combining auditory frequencies (800Hz-1200Hz sweep) with high-intensity flashing visual alert LEDs."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Wire LM393 Digital Out to Arduino Pin 2 (Interrupt 0):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Attach hardware interrupt routine: attachInterrupt(digitalPinToInterrupt(2), gasAlarmISR, FALLING);", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: In Normal Safe Atmosphere (PPM < 200):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Pin 2 = HIGH (5V) | Green Status LED ON | Buzzer Silent", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "STEP 3: Gas Leak Event Detected (PPM > 400):", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "Pin 2 falls LOW -> Hardware Interrupt fires instantly in 2 microseconds!", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "Sound 2-Tone Emergency Evacuation Siren (800Hz / 1200Hz sweep) + Red Beacon Strobe!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Interrupt-Driven Hazardous Gas Alarm", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const int PIN_GAS_DO = 2;  // Hardware interrupt pin", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const int PIN_BUZZER = 8;  // Piezo alarm siren", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "volatile bool gasAlarm = false;", indent: 0, tag: "setup" },
        { id: "c5", line: 5, text: "", indent: 0, tag: "empty" },
        { id: "c6", line: 6, text: "void gasAlarmISR() {", indent: 0, tag: "block-start" },
        { id: "c7", line: 7, text: "  gasAlarm = true; // High-speed hardware flag", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "block-end" },
        { id: "c9", line: 9, text: "", indent: 0, tag: "empty" },
        { id: "c10", line: 10, text: "void setup() {", indent: 0, tag: "block-start" },
        { id: "c11", line: 11, text: "  pinMode(PIN_GAS_DO, INPUT_PULLUP);", indent: 1, tag: "setup" },
        { id: "c12", line: 12, text: "  pinMode(PIN_BUZZER, OUTPUT);", indent: 1, tag: "setup" },
        { id: "c13", line: 13, text: "  attachInterrupt(digitalPinToInterrupt(PIN_GAS_DO), gasAlarmISR, FALLING);", indent: 1, tag: "setup" },
        { id: "c14", line: 14, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Real-Time Embedded Systems, Hardware Interrupts & Critical Safety Systems",
      pedagogy: "Introduces event-driven programming and asynchronous interrupt service routines (ISRs). Contrasts polling vs interrupts in life-safety avionics and medical devices.",
      misconceptions: [
        {
          title: "Misconception: 'Can you use delay(1000) inside an Interrupt Service Routine (ISR)?'",
          detail: "NO! An ISR pauses all CPU timers and other interrupts. Calling delay() inside an ISR will permanently freeze the microcontroller. An ISR should only set a flag and exit in under 5 microseconds."
        }
      ],
      discussionPrompts: [
        "Why do industrial gas detectors use hardware interrupts instead of checking pins once every second?",
        "If you are designing a gas alarm for a commercial bakery, what happens if the power goes out? (Fail-safe battery backup)."
      ],
      standards: [
        "CSTA 2-CS-03: Systematically identify and fix problems with computing devices.",
        "NITI Aayog ATL Disaster Management Curriculum: Early Warning Systems & Sensor Automation."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 64: National Air Quality Index (AQI) Calculator Studio",
    shortTitle: "64. Air Quality Index (AQI)",
    subtitle: "Categorizing Environmental Toxicity: Good (0-50) to Hazardous (300+) Public Health Telemetry",
    summary: "Become an environmental data scientist! Combine multiple gas readings into the official Central Pollution Control Board (CPCB) and US EPA Air Quality Index (AQI) metric, alerting vulnerable populations.",
    mascotMsg: "Air is invisible, but what's floating inside it matters for everyone! 🍃 Let's program an automated Air Quality Index (AQI) station that categorizes ambient air from 'Good' (Green) to 'Severe Hazardous' (Purple) and broadcasts public advisories!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Gas & Environmental",
    labId: "gas",
    analogy: {
      headline: "The School Report Card Grade",
      story: "If you take tests in Math, Science, English, and History, your school combines all your scores into a single overall GPA grade (A+, B, C, F) so your parents can quickly understand how you are doing. The Air Quality Index (AQI) is a report card for the air you breathe! It combines particulates, CO, nitrogen dioxide, and volatile gases into a single 0-500 scale so people with asthma or elderly grandparents know when it is safe to go outside.",
      hardwareMetaphor: "Linear piecewise breakpoint interpolation formula standardized by the Central Pollution Control Board (CPCB)."
    },
    jargonBuster: [
      {
        word: "AQI (Air Quality Index)",
        pronunciation: "Ay-Kyoo-Eye",
        analogy: "The Clean Air Report Card",
        definition: "A standardized color-coded scale (0 to 500) indicating how clean or polluted the ambient air is."
      },
      {
        word: "CPCB Breakpoints",
        pronunciation: "See-pee-see-bee",
        analogy: "Grade Boundaries",
        definition: "Central Pollution Control Board thresholds: Good (0-50), Satisfactory (51-100), Moderate (101-200), Poor (201-300), Severe (401-500)."
      },
      {
        word: "VOCs",
        pronunciation: "Vee-Oh-Seez (Volatile Organic Compounds)",
        analogy: "Chemical Fumes",
        definition: "Toxic chemical vapors emitted by paints, gasoline, cleaning solvents, and vehicle exhaust."
      },
      {
        word: "Telemetry Broadcast",
        pronunciation: "tuh-LEM-uh-tree Brohd-kast",
        analogy: "Digital Town Crier",
        definition: "Transmitting live environmental data packets to cloud servers and public warning LED billboards."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "AQI COMPUTATION & HEALTH ADVISORY ENGINE:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Sample MQ-135 Air Quality Sensor Analog Pin A0", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "AQI Category 1: 0 - 50 [GREEN - GOOD]: Air quality is ideal for all outdoor activities", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "AQI Category 2: 51 - 100 [YELLOW - MODERATE]: Acceptable; sensitive individuals take precaution", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "AQI Category 3: 101 - 200 [ORANGE - POOR]: Breathing discomfort for children and asthma patients", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "AQI Category 4: 201 - 300+ [RED/PURPLE - SEVERE HAZARD]: Wear N95 masks, trigger indoor air purifiers!", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "AQI METRIC BROADCASTED: Public Health Safety Ensured 100%!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Central Pollution Control Board (CPCB) AQI Categorization", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "String getAqiCategory(int aqi) {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  if (aqi <= 50)  return \\"Good (Green)\\";", indent: 1, tag: "code" },
        { id: "c4", line: 4, text: "  if (aqi <= 100) return \\"Satisfactory (Light Green)\\";", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "  if (aqi <= 200) return \\"Moderate (Yellow)\\";", indent: 1, tag: "code" },
        { id: "c6", line: 6, text: "  if (aqi <= 300) return \\"Poor (Orange)\\";", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "  if (aqi <= 400) return \\"Very Poor (Red)\\";", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  return \\"Severe / Hazardous (Purple)\\";", indent: 1, tag: "code" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Environmental Metrology, Public Health Policy & Civic Tech",
      pedagogy: "Transforms raw engineering data into actionable public health intelligence. Connects classroom electronics directly to real-world national air pollution monitoring stations.",
      misconceptions: [
        {
          title: "Misconception: 'If the air looks clear outside the window, does it mean AQI is Good?'",
          detail: "NO! Invisible gases like Carbon Monoxide (CO), Ozone, and PM2.5 particles are microscopic and completely transparent to the naked human eye. Only calibrated chemical sensors can detect them."
        }
      ],
      discussionPrompts: [
        "Why do metropolitan cities like New Delhi or Beijing experience severe winter smog spikes (temperature inversions)?",
        "How can an ATL student team deploy an array of 5 solar-powered AQI stations across their school campus to map pollution hot-spots?"
      ],
      standards: [
        "NGSS MS-ESS3-3: Apply scientific principles to design a method for monitoring and minimizing a human impact on the environment.",
        "CSTA 2-DA-08: Collect data using computational tools and transform the data to make it more useful and reliable.",
        "NITI Aayog ATL Environmental Capstone: Smart Cities, Pollution Tracking, and Community Action."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "const GAS_LESSONS_DATA =" not in content:
    target = "window.LESSONS_DATA = LESSONS_DATA;"
    new_content = content.replace(target, gas_lessons_code.strip() + "\n\n" + target)
    new_content = new_content.replace(
        "window.DHT_LESSONS_DATA = DHT_LESSONS_DATA;",
        "window.DHT_LESSONS_DATA = DHT_LESSONS_DATA;\nwindow.GAS_LESSONS_DATA = GAS_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("GAS_LESSONS_DATA inserted successfully into js/lessons.js!")
else:
    print("GAS_LESSONS_DATA already in js/lessons.js.")
