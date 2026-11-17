# -*- coding: utf-8 -*-
"""
Script to insert DMM_LESSONS_DATA into js/lessons.js
"""

dmm_lessons_code = '''
const DMM_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 49: DC Voltage Drop & The Water Pressure Metaphor",
    shortTitle: "49. DC Voltage Drop",
    subtitle: "Measuring Electrical Potential Across Circuit Loads with Red (+) and Black (-) Probes",
    summary: "Discover why electricity flows! Use the digital multimeter in DC Volts mode (DCV) to measure electrical pressure differences between battery terminals, resistors, and LEDs.",
    mascotMsg: "Meet your most trusted diagnostic tool: the Digital Multimeter! ⚡ Think of voltage as water pressure in a pipe. Let's touch our probes to different nodes and see how pressure drops across every load!",
    difficulty: "Beginner",
    duration: "15 min",
    category: "Multimeter & Test",
    labId: "dmm",
    analogy: {
      headline: "The Waterfall & Water Turbine Metaphor",
      story: "Imagine water pumped to the top of a 5-meter tower (5 Volts). At the top, the water has maximum potential pressure. As it plunges down through a water turbine (the resistor), it loses 2.95 meters of pressure. Then it flows over an illuminated waterwheel (the LED), losing the final 2.05 meters, until it hits the ground pool at 0 meters (GND). Voltage Drop is simply measuring how much electrical pressure is consumed as electrons push their way through each component!",
      hardwareMetaphor: "The Red probe is the high-pressure gauge, the Black probe is the zero-reference gauge; the meter subtracts (V_Red - V_Black) to display true differential potential!"
    },
    jargonBuster: [
      {
        word: "DC Voltage",
        pronunciation: "DEE-see VOL-tij",
        analogy: "One-Way Water Pressure",
        definition: "Direct Current electrical potential that pushes electrons in a steady, single direction."
      },
      {
        word: "Voltage Drop",
        pronunciation: "VOL-tij Drop",
        analogy: "Pressure Lost at the Waterwheel",
        definition: "The amount of voltage consumed when current passes through a resistor, LED, or motor."
      },
      {
        word: "COM Port",
        pronunciation: "KOM Port (Common)",
        analogy: "Ground Zero / Home Base",
        definition: "The black reference terminal jack on a multimeter, plugged into circuit Ground (0V)."
      },
      {
        word: "Forward Bias",
        pronunciation: "FOR-werd BY-us",
        analogy: "Turnstile Spinning the Right Way",
        definition: "Connecting positive voltage to the LED Anode (+) so current flows and light is emitted."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Configure Digital Multimeter for DC Voltage measurement:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Turn rotary dial to 'DCV 20V' range (suitable for 0V to 5V systems)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "Plug Black probe into COM jack, Red probe into V/Ω jack", indent: 1, tag: "setup" },
        { id: "h4", line: 4, text: "STEP 2: Measure Circuit Supply Potential:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Probe between Node 1 (+5V Rail) and Node 5 (GND) -> Readout = 5.00V", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "STEP 3: Measure LED Forward Voltage Drop:", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "Probe between Node 3 (LED Anode) and Node 4 (LED Cathode) -> Readout = 2.05V", indent: 1, tag: "code" },
        { id: "h8", line: 8, text: "Kirchhoff's Law: 5.00V Supply = 2.95V (Resistor) + 2.05V (LED)!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Measuring Voltage with Arduino ADC (Pin A0)", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "void setup() {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  Serial.begin(9600); // Telemetry stream", indent: 1, tag: "setup" },
        { id: "c4", line: 4, text: "}", indent: 0, tag: "block-end" },
        { id: "c5", line: 5, text: "", indent: 0, tag: "empty" },
        { id: "c6", line: 6, text: "void loop() {", indent: 0, tag: "block-start" },
        { id: "c7", line: 7, text: "  int raw = analogRead(A0);", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  float voltage = raw * (5.0 / 1023.0); // Convert ADC to Volts", indent: 1, tag: "code" },
        { id: "c9", line: 9, text: "  Serial.print(\"Measured Potential: \"); Serial.println(voltage);", indent: 1, tag: "code" },
        { id: "c10", line: 10, text: "  delay(500);", indent: 1, tag: "code" },
        { id: "c11", line: 11, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Kirchhoff's Voltage Law (KVL) & Potential Difference",
      pedagogy: "Grounds Kirchhoff's Voltage Law ($V_{\\\\text{supply}} = \\\\sum V_{\\\\text{drop}}$) through hands-on virtual probe placement. Students grasp why voltage is always measured in parallel across components.",
      misconceptions: [
        {
          title: "Misconception: 'Should you plug multimeter probes in series or in parallel to measure voltage?'",
          detail: "Always in PARALLEL! Multimeter voltage inputs have massive internal resistance (10 Megohms) so they draw almost zero current while measuring potential difference without altering circuit behavior."
        }
      ],
      discussionPrompts: [
        "What happens to the DMM display if you swap the red and black probes backwards? (Display reads -5.00V negative polarity).",
        "If the supply is 5V and the LED uses 2.05V, where did the remaining 2.95V go? (Turned into microscopic heat by the 220Ω resistor)."
      ],
      standards: [
        "NGSS MS-PS3-2: Develop a model to describe that when the arrangement of objects interacting at a distance changes, different amounts of potential energy are stored.",
        "NITI Aayog ATL Equipment Package P1: Safe Multimeter Operation, Range Selection, and Voltage Drop Diagnostics."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 50: Resistance, Ohm's Law & 4-Band Color Codes",
    shortTitle: "50. Resistance & Color Codes",
    subtitle: "De-coding Resistor Bands (Red-Red-Brown = 220Ω) and Measuring Ohms without Power",
    summary: "Learn how resistors restrict electron traffic to protect fragile components. Read standard EIA 4-band color rings and verify values using the DMM Ohmmeter range (Ω).",
    mascotMsg: "Those tiny colored rings on resistors aren't for decoration — they're a secret color code invented by engineers! Let's decode them and verify the exact resistance in Ohms! 🎨🔍",
    difficulty: "Beginner",
    duration: "18 min",
    category: "Multimeter & Test",
    labId: "dmm",
    analogy: {
      headline: "The Highway Toll Booth Squeeze",
      story: "Imagine a 10-lane superhighway packed with rushing cars (electrons). If the highway suddenly narrows into a single narrow tollbooth, traffic slows down! That tollbooth is a Resistor. Its job is to deliberately squeeze electron traffic so the delicate LED downstream doesn't get flooded and blow up. The narrower the tollbooth, the higher the Ohms (Ω) of resistance!",
      hardwareMetaphor: "The EIA color band code: Black(0), Brown(1), Red(2), Orange(3), Yellow(4), Green(5), Blue(6), Violet(7), Grey(8), White(9), Gold(±5%)."
    },
    jargonBuster: [
      {
        word: "Ohm (Ω)",
        pronunciation: "OHM",
        analogy: "Traffic Restriction Unit",
        definition: "The unit of electrical resistance. Named after physicist Georg Ohm."
      },
      {
        word: "4-Band Color Code",
        pronunciation: "FOR-band KUL-er Kohd",
        analogy: "A Secret Barcode",
        definition: "Band 1 (Digit), Band 2 (Digit), Band 3 (Multiplier x10^n), Band 4 (Tolerance %)."
      },
      {
        word: "Tolerance",
        pronunciation: "TOL-er-uns",
        analogy: "Margin of Error",
        definition: "How close the real resistor is to its rated value (Gold = ±5% accuracy)."
      },
      {
        word: "Open Circuit (O.L)",
        pronunciation: "OH-el (Over Limit)",
        analogy: "A Broken Drawbridge",
        definition: "Infinite resistance (∞Ω) meaning air separates the two probes and no electricity can cross."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: IMPORTANT SAFETY RULE FOR OHMMETERS:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "ALWAYS disconnect circuit power before measuring resistance in Ohms!", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Read EIA 4-Band Color Code for 220Ω Resistor:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Band 1: RED = 2 | Band 2: RED = 2 | Band 3: BROWN = x10 | Band 4: GOLD = ±5%", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Calculated Value: 22 x 10 = 220 Ohms (Acceptable: 209Ω to 231Ω)", indent: 1, tag: "explanation" },
        { id: "h6", line: 6, text: "STEP 3: Verify with DMM Probes across Resistor leads:", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "Multimeter LCD Readout = 220.4 Ω (PASS - Within 5% Tolerance!)", indent: 1, tag: "code" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Ohm's Law in Software: I = V / R", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const float V_SUPPLY = 5.0; // 5V USB Rail", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const float V_LED = 2.05;   // Red LED forward voltage", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "const float R_OHMS = 220.0; // Resistor resistance", indent: 0, tag: "setup" },
        { id: "c5", line: 5, text: "", indent: 0, tag: "empty" },
        { id: "c6", line: 6, text: "float calculateCurrentAmps() {", indent: 0, tag: "block-start" },
        { id: "c7", line: 7, text: "  float vDrop = V_SUPPLY - V_LED; // 2.95V across resistor", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  return (vDrop / R_OHMS);        // 0.0134 Amps (13.4 mA)", indent: 1, tag: "code" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Ohm's Law ($V = I \\\\times R$) & Resistor Color Decoders",
      pedagogy: "Connects mathematical ratios directly to physical color-coded hardware. Emphasizes safety protocols: explaining why measuring resistance on a live powered circuit blows multimeter fuses.",
      misconceptions: [
        {
          title: "Misconception: 'Can you measure resistance while the Arduino is plugged into USB power?'",
          detail: "NO! An ohmmeter works by injecting a tiny calibrated internal battery current and measuring the voltage response. If the circuit is already live, foreign voltages will destroy the meter or blow its ceramic safety fuse!"
        }
      ],
      discussionPrompts: [
        "What mnemonic do engineers use to remember the resistor color order? ('BB ROY of Great Britain had a Very Good Wife').",
        "If you replace a 220Ω resistor with a 10,000Ω (10k) resistor, what happens to the LED brightness? Why?"
      ],
      standards: [
        "NGSS MS-PS3-3: Apply scientific principles to design, construct, and test a device that either minimizes or maximizes thermal or electrical energy transfer.",
        "NITI Aayog ATL Curriculum Module 1: Electronic Components, Resistor Decoders, and Measurement Skills."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 51: The Continuity Buzzer: Sniffing Short Circuits",
    shortTitle: "51. Continuity Buzzer",
    subtitle: "The Beeping Superhero: Finding Hidden Breaks, Cold Solders, and Accidental Bridges",
    summary: "Why look at the screen when your multimeter can sing? In continuity mode (🔊), the meter beeps loudly if two points have zero resistance (< 50Ω), proving a continuous unbroken path.",
    mascotMsg: "BEEEEEP! 📢 That high-pitched sound is music to an engineer's ears. It means electrons have a smooth, unbroken copper bridge. If it stays silent, you've found a broken wire!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "Multimeter & Test",
    labId: "dmm",
    analogy: {
      headline: "The Echo in the Mountain Tunnel",
      story: "If you shout into a clear mountain tunnel and hear an immediate loud echo, you know the tunnel is open and clear from end to end! But if a boulder has collapsed and blocked the middle, your shout gets muffled and lost. The Multimeter Continuity Buzzer shouts a tiny electrical wave through one probe: if it pops out the other probe in less than 1 millisecond, the buzzer SINGS! It lets you test 50 connections on a circuit board in 60 seconds without taking your eyes off the board!",
      hardwareMetaphor: "The internal comparator circuit triggers a piezoelectric buzzer when measured resistance falls below 50 Ohms."
    },
    jargonBuster: [
      {
        word: "Continuity",
        pronunciation: "kon-tuh-NOO-ih-tee",
        analogy: "An Unbroken Bridge",
        definition: "A complete, uninterrupted conductive path allowing electric current to flow freely."
      },
      {
        word: "Short Circuit",
        pronunciation: "SHORT SUR-kit",
        analogy: "An Illegal Shortcut",
        definition: "An accidental direct copper connection between +5V and GND with zero resistance, causing dangerous overheating."
      },
      {
        word: "Cold Solder Joint",
        pronunciation: "KOHLD SAH-der Joynt",
        analogy: "Dry Cracked Glue",
        definition: "A dull, cracked solder connection that looks connected to the eye but is electrically broken."
      },
      {
        word: "Internal Wire Break",
        pronunciation: "in-TUR-nul Wire Brayk",
        analogy: "Broken Lead Inside a Pencil",
        definition: "A jumper wire whose plastic insulation looks perfect outside, but the copper strand inside is snapped."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Select Continuity / Diode Test Mode:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Turn rotary dial to '🔊 CONT' buzzer symbol", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "Touch Red and Black probe tips together -> BEEP! (0.1Ω - Verified meter works)", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 2: Test Breadboard Ground Track Continuity:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Probe between Arduino GND pin and Breadboard Blue Rail -> BEEP! (Unbroken path)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "STEP 3: Test for Dangerous Power-to-Ground Shorts:", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "Probe between +5V Red Rail and GND Blue Rail -> SILENT / O.L (PASS - No short circuit!)", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Continuity Verification in Hardware Test Script", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "bool checkBusContinuity(int pinInput) {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  pinMode(pinInput, INPUT_PULLUP); // Weak internal pullup", indent: 1, tag: "setup" },
        { id: "c4", line: 4, text: "  // If jumper connects pin to GND, read will drop to LOW (0V)", indent: 1, tag: "comment" },
        { id: "c5", line: 5, text: "  if (digitalRead(pinInput) == LOW) {", indent: 1, tag: "block-start" },
        { id: "c6", line: 6, text: "    tone(8, 2400, 150); // Sound 2.4kHz Continuity BEEP!", indent: 2, tag: "code" },
        { id: "c7", line: 7, text: "    return true; // Continuous conductive path confirmed", indent: 2, tag: "code" },
        { id: "c8", line: 8, text: "  }", indent: 1, tag: "block-end" },
        { id: "c9", line: 9, text: "  return false; // Open circuit detected!", indent: 1, tag: "code" },
        { id: "c10", line: 10, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Audio-Assisted Testing, Low-Resistance Diagnostics & Short Detection",
      pedagogy: "Demonstrates sensory feedback in engineering diagnostics. Students learn why audio continuity testing increases debugging speed by 10x by eliminating the need to look back and forth from board to meter.",
      misconceptions: [
        {
          title: "Misconception: 'If two points beep on continuity, does it mean the circuit is wired correctly?'",
          detail: "Not necessarily! If +5V and GND beep on continuity, you have a DEAD SHORT that will melt wires or trigger Arduino USB port shutdown. Continuity is only good when between points meant to be connected."
        }
      ],
      discussionPrompts: [
        "Why does a continuity meter beep on a 0.2Ω wire but stay silent on a 10,000Ω resistor?",
        "If you suspect a wire inside a robot arm is snapped, how would you use the continuity buzzer to prove it?"
      ],
      standards: [
        "CSTA 2-CS-03: Systematically identify and fix problems with computing devices and their components.",
        "NITI Aayog ATL Equipment Package P2: Rapid Continuity Auditing and Cable Harness Testing."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 52: The Circuit Doctor: Troubleshooting Diagnostics",
    shortTitle: "52. Circuit Doctor Sandbox",
    subtitle: "Systematic Troubleshooting: Diagnosing Reversed LEDs, Blown Resistors & Power Shorts",
    summary: "Become a certified Circuit Doctor! When a project fails to power on, don't guess: use a systematic multimeter checklist (Power, Ground, Drop, Continuity) to locate the exact fault.",
    mascotMsg: "Doctor Sparky to the emergency room! 🩺 This robot circuit isn't turning on. Grab your DMM probes, test the suspect nodes, diagnose the illness, and revive the circuit!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Multimeter & Test",
    labId: "dmm",
    analogy: {
      headline: "The Doctor's Stethoscope & Diagnostic Flowchart",
      story: "When you visit a doctor with a fever, they don't immediately perform brain surgery! They follow a methodical checklist: check temperature, check blood pressure, listen to your heartbeat. In electronics, great engineers never 'guess' or rip wires apart at random. They follow the 4 Golden Diagnostic Steps: 1) Verify Supply Voltage (+5V), 2) Verify Ground Return (0V), 3) Check Voltage Drops across loads, 4) Buzz continuity. Within 2 minutes, the culprit is unmasked!",
      hardwareMetaphor: "Fault isolation in complex avionics and automotive electronic control units (ECUs)."
    },
    jargonBuster: [
      {
        word: "Troubleshooting",
        pronunciation: "TRUB-ul-shoot-ing",
        analogy: "Detective Work",
        definition: "A systematic approach to finding and fixing the root cause of an engineering malfunction."
      },
      {
        word: "Reversed Polarity",
        pronunciation: "ri-VERST poh-LAIR-ih-tee",
        analogy: "Batteries Put in Backwards",
        definition: "When a polarized component like an LED or electrolytic capacitor is plugged in backwards."
      },
      {
        word: "Blown Resistor",
        pronunciation: "BLOHN ri-ZIS-tur",
        analogy: "A Burned Out Bridge",
        definition: "A resistor damaged by excessive current, permanently broken into an open circuit (∞Ω)."
      },
      {
        word: "Dead Short",
        pronunciation: "DED SHORT",
        analogy: "A Water Pipe Burst",
        definition: "Zero resistance directly between +5V and Ground, starving all downstream components of power."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "THE 4-STEP CIRCUIT DOCTOR DIAGNOSTIC CHECKLIST:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "STEP 1: Verify Main Power Rail Potential (+5V to GND) -> Must read 4.9V to 5.1V", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "STEP 2: Check Resistor Input (Node 2) -> Must match 5.0V supply rail", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 3: Check Resistor Output / LED Anode (Node 3):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "If Node 3 reads 5.0V (no drop) -> LED is open or backwards!", indent: 1, tag: "explanation" },
        { id: "h6", line: 6, text: "If Node 3 reads 0.0V -> Resistor is blown open or Node 3 shorted to ground!", indent: 1, tag: "explanation" },
        { id: "h7", line: 7, text: "If Node 3 reads 2.05V -> Circuit healthy, LED forward bias confirmed!", indent: 1, tag: "explanation" },
        { id: "h8", line: 8, text: "DIAGNOSIS COMPLETE: Fault isolated and circuit restored to 100% operation!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Automated Self-Test Diagnostic Routine", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "enum DiagnosticResult { OK, NO_POWER, BLOWN_RESISTOR, REVERSED_LED, SHORT_CIRCUIT };", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "DiagnosticResult runBoardDiagnostics() {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  float vSupply = analogRead(A0) * (5.0 / 1023.0);", indent: 1, tag: "code" },
        { id: "c6", line: 6, text: "  float vLed = analogRead(A1) * (5.0 / 1023.0);", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "  if (vSupply < 4.5) return NO_POWER;", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  if (vLed < 0.2)    return BLOWN_RESISTOR;", indent: 1, tag: "code" },
        { id: "c9", line: 9, text: "  if (vLed > 4.7)    return REVERSED_LED;", indent: 1, tag: "code" },
        { id: "c10", line: 10, text: "  return OK; // Healthy LED forward drop detected (1.8V - 2.2V)", indent: 1, tag: "code" },
        { id: "c11", line: 11, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Algorithmic Fault Isolation, Binary Search & Failure Modes",
      pedagogy: "Teaches computational thinking applied to physical systems: transforming a messy broken board into a binary decision tree that pinpoints the single root failure point.",
      misconceptions: [
        {
          title: "Misconception: 'If an LED doesn't light up, is the LED always the broken part?'",
          detail: "Almost never! In 90% of student projects, the LED is completely fine — the real culprit is a loose ground jumper wire, an unseated resistor, or inverted polarity. Always probe voltages before throwing parts away."
        }
      ],
      discussionPrompts: [
        "Why is it better to troubleshoot using a logical flowchart rather than randomly swapping wires?",
        "How do NASA engineers troubleshoot robotic rovers on Mars when they cannot physically touch the hardware?"
      ],
      standards: [
        "CSTA 2-AP-19: Document programs in order to make them easier to follow, test, and debug.",
        "NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among several design solutions.",
        "NITI Aayog ATL Curriculum Capstone: Systematic Electronic System Auditing & Quality Assurance."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "const DMM_LESSONS_DATA =" not in content:
    target = "window.LESSONS_DATA = LESSONS_DATA;"
    new_content = content.replace(target, dmm_lessons_code.strip() + "\n\n" + target)
    new_content = new_content.replace(
        "window.CAD_LESSONS_DATA = CAD_LESSONS_DATA;",
        "window.CAD_LESSONS_DATA = CAD_LESSONS_DATA;\nwindow.DMM_LESSONS_DATA = DMM_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("DMM_LESSONS_DATA inserted successfully into js/lessons.js!")
else:
    print("DMM_LESSONS_DATA already in js/lessons.js.")
