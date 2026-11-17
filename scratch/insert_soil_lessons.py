# -*- coding: utf-8 -*-
"""
Script to insert SOIL_LESSONS_DATA into js/lessons.js
"""

soil_lessons_code = '''
const SOIL_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 69: Resistive vs Capacitive Soil Sensing: Preventing Galvanic Corrosion",
    shortTitle: "69. Soil Capacitance Physics",
    subtitle: "Dielectric Permittivity: Water (εr ≈ 80) vs Air (εr ≈ 1) with High-Frequency AC",
    summary: "Discover why cheap resistive probes corrode and turn green after 2 weeks! Learn how capacitive probes use an onboard 555-timer IC to measure moisture via electric field capacitance without bare copper touching wet dirt.",
    mascotMsg: "Plants get thirsty just like you! 🌿 But did you know sticking bare wires into wet soil creates an electro-chemical battery that eats the metal away? Capacitive sensing uses an insulated plastic shield to measure the water's dielectric charge safely forever! Let's explore the physics!",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Agriculture & Sensors",
    labId: "soil",
    analogy: {
      headline: "The Balloon Against the Window Pane",
      story: "If you touch a wet window with your finger, your skin gets dirty. But if you hold a statically charged rubber balloon against the outside of the glass, the water droplets inside the glass dance and move without the balloon ever touching them! Capacitive sensing measures moisture through an insulated barrier without ever risking metal corrosion!",
      hardwareMetaphor: "The capacitive PCB traces act as the plates of a capacitor; soil moisture acts as the dielectric medium altering oscillator frequency."
    },
    jargonBuster: [
      {
        word: "Capacitive Soil Sensing",
        pronunciation: "kuh-PASS-ih-tiv SOYL",
        analogy: "The Insulated Static Field Detector",
        definition: "Measuring moisture through the electrical capacitance of soil rather than passing direct DC current through bare metal."
      },
      {
        word: "Galvanic Electrolysis",
        pronunciation: "gal-VAN-ik ee-lek-TROL-ih-sis",
        analogy: "The Metal Dissolving Acid Bath",
        definition: "Rapid oxidation and erosion of copper electrodes caused by DC electrical currents flowing through wet soil minerals."
      },
      {
        word: "Dielectric Permittivity (εr)",
        pronunciation: "DYE-ee-LEK-trik",
        analogy: "The Electric Field Sponge Constant",
        definition: "A physical constant: Air has εr=1, dry dirt has εr≈3, but liquid water has a massive εr≈80, multiplying capacitance!"
      },
      {
        word: "NE555 Timer Circuit",
        pronunciation: "Triple-Five TY-mur",
        analogy: "The High-Speed 1.5MHz Pulse Metronome",
        definition: "An onboard timer oscillator that turns capacitance changes into an analog voltage output between 1.2V (wet) and 3.0V (dry)."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 69: Capacitive Soil Moisture Sensor v1.2 Calibration
const int SOIL_PIN = A1; // Capacitive probe analog output

// Calibration Constants (Measure your sensor in free air vs a cup of water)
const int AIR_VALUE = 580;   // Sensor in dry free air (0% moisture)
const int WATER_VALUE = 260; // Sensor submerged in water (100% moisture)

void setup() {
  Serial.begin(115200);
  pinMode(SOIL_PIN, INPUT);
  Serial.println(F("Capacitive Soil Moisture Probe Initialized."));
}

void loop() {
  int rawADC = analogRead(SOIL_PIN);
  
  // Note: Higher capacitance = Lower voltage output!
  // Map raw ADC (580..260) to moisture percentage (0..100%)
  int moisturePct = map(rawADC, AIR_VALUE, WATER_VALUE, 0, 100);
  moisturePct = constrain(moisturePct, 0, 100);

  Serial.print(F("Raw Analog ADC: "));
  Serial.print(rawADC);
  Serial.print(F(" | Calibrated Soil Moisture: "));
  Serial.print(moisturePct);
  Serial.println(F("%"));

  delay(1000);
}`,
      human: `// Plain English Human Translation:
// 1. Connect the capacitive probe's analog pin to Arduino pin A1.
// 2. Set two calibration benchmarks: In dry air the sensor reads ~580; submerged in water it reads ~260.
// 3. Notice that water causes the voltage to DROP because higher capacitance pulls down the 555-timer output.
// 4. Use the map() function to scale the inverted reading into an intuitive 0% to 100% moisture percentage.
// 5. Constrain the percentage so readings never dip below 0% or spike above 100%.
// 6. Print the moisture reading every second to the Serial Monitor.`
    },
    stepCheck: {
      instruction: "Use the Soil Moisture Slider to transition the plant soil from Bone Dry (10%) to Saturated (85%), observe how the dielectric permittivity εr modulates the 555-timer frequency and drops analog voltage, then click 'Confirm Sensor Calibration'.",
      targetCondition: "soilCalibrated"
    }
  },
  {
    id: 2,
    title: "Lesson 70: Optocoupled Relay Isolation & Inductive Flyback Diodes",
    shortTitle: "70. Relays & Galvanic Isolation",
    subtitle: "Galvanic Light Barrier (PC817) & Clamping Inductive Voltage Spikes (1N4007)",
    summary: "Control high-voltage agricultural pumps safely! Learn how an optocoupler fires infrared light across an air gap to protect the Arduino, and why a flyback diode absorbs lethal reverse inductive spikes (V = -L di/dt) when electromagnets turn off.",
    mascotMsg: "Pumps take serious power—often 12V or 240V! ⚡ If that voltage leaked into your Arduino, poof—magic blue smoke! We use an optocoupler to send signals using light beams, and a flyback diode to catch runaway magnetic spikes! Let's trigger the relay!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Power & Actuators",
    labId: "soil",
    analogy: {
      headline: "The Light Flash in the Castle Watchtower",
      story: "Imagine a castle general in the command room (Arduino) needing to signal the heavy catapult crew outside (12V Pump). If the catapult snaps, flying debris could kill the general. Instead, the general flashes a torch through a thick bulletproof glass window. The catapult crew sees the light flash and fires—zero physical connection, total safety!",
      hardwareMetaphor: "The PC817 optocoupler creates 5,000V of galvanic isolation between the low-voltage MCU and noisy motor loads."
    },
    jargonBuster: [
      {
        word: "Galvanic Isolation",
        pronunciation: "gal-VAN-ik eye-soh-LAY-shun",
        analogy: "The Moat and Drawbridge Around the Castle",
        definition: "Electrical separation of circuits with no copper wires sharing electrons, eliminating voltage surges and ground loops."
      },
      {
        word: "Optocoupler (PC817)",
        pronunciation: "OP-toh-cup-ler",
        analogy: "The Flashlight and Light Sensor in a Tube",
        definition: "A chip pairing an internal infrared LED and phototransistor to pass signals purely with light photons."
      },
      {
        word: "Flyback Voltage Spike",
        pronunciation: "FLY-bak VOHL-tij",
        analogy: "The Rubber Band Snapping Back at Your Fingers",
        definition: "A sudden reverse voltage spike (hundreds of volts) generated by collapsing magnetic fields in relay coils."
      },
      {
        word: "1N4007 Flyback Diode",
        pronunciation: "FLY-bak DYE-ohd",
        analogy: "The One-Way Escape Valve",
        definition: "A rectifier diode wired in parallel with the coil to clamp inductive back-EMF spikes safely to 0.7V."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 70: Optocoupled 5V Relay Control with Active-LOW Logic
const int RELAY_PIN = 7; // Digital Pin connected to Relay Module IN

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);

  // Note: Most optocoupled relay modules are ACTIVE-LOW!
  // Setting Pin HIGH turns relay OFF (LED off)
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println(F("Relay Initialized: DE-ENERGIZED (Pump OFF)."));
}

void loop() {
  // Test Actuation Cycle
  Serial.println(F("Energizing Relay (Water Pump ON)..."));
  digitalWrite(RELAY_PIN, LOW); // Pull LOW to sink current through opto-LED
  delay(3000); // Pump water for 3 seconds

  Serial.println(F("De-energizing Relay (Water Pump OFF)..."));
  digitalWrite(RELAY_PIN, HIGH); // Turn off
  delay(5000); // Wait 5 seconds
}`,
      human: `// Plain English Human Translation:
// 1. Assign digital Pin 7 to control the optocoupled relay module's IN pin.
// 2. Configure Pin 7 as an OUTPUT.
// 3. Keep Pin 7 HIGH initially to ensure the water pump starts in the SAFE OFF state (Active-LOW logic).
// 4. In the loop, pull Pin 7 LOW to complete the circuit inside the PC817 optocoupler, clicking the magnetic relay contacts closed!
// 5. Run the 12V water pump for 3 seconds to irrigate the plant.
// 6. Set Pin 7 back to HIGH to collapse the magnetic coil safely through the flyback diode and stop the pump.`
    },
    stepCheck: {
      instruction: "Click 'Toggle Relay Energization' to fire the PC817 optocoupler, observe the optical light barrier bridge, listen to the mechanical relay click, and verify the 1N4007 snubber clamping the back-EMF spike.",
      targetCondition: "relayToggled"
    }
  },
  {
    id: 3,
    title: "Lesson 71: Bang-Bang Control with Deadband Hysteresis (Anti-Chatter)",
    shortTitle: "71. Hysteresis Anti-Chatter",
    subtitle: "Dual-Threshold Switching: Preventing High-Frequency Relay Hunting & Burnout",
    summary: "Eliminate relay chatter! Discover why a single threshold causes mechanical relays to toggle frantically 50 times a second at boundary points, and master dual-threshold hysteresis (Pump ON at 35%, OFF at 65%).",
    mascotMsg: "Click-clack-click-clack! 🔊 Without hysteresis, your relay would machine-gun itself to death at the exact boundary line! Hysteresis gives our system a generous 'cushion zone' so the pump turns on when thirsty and stays on until satisfied. Let's test the cushion!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Control Theory",
    labId: "soil",
    analogy: {
      headline: "The Smart Home Thermostat Cushion",
      story: "Imagine if your home heater turned on at 20.0°C and turned off at 20.1°C. It would click on and off every 3 seconds! Instead, smart thermostats turn on at 19°C and stay on until the room reaches 22°C. That comfortable 3-degree gap is called a 'deadband hysteresis cushion'!",
      hardwareMetaphor: "Two separate comparison thresholds: LOWER_DRY_LIMIT = 35% and UPPER_WET_LIMIT = 65%."
    },
    jargonBuster: [
      {
        word: "Bang-Bang Control",
        pronunciation: "BANG-bang kun-TROHL",
        analogy: "The Light Switch (All ON or All OFF)",
        definition: "A feedback control method that switches abruptly between two states (full power or zero power) with no gradual fading."
      },
      {
        word: "Deadband Hysteresis",
        pronunciation: "DED-band his-tur-EE-sis",
        analogy: "The Neutral Gear Cushion Zone",
        definition: "An operating gap between the turn-on setpoint and turn-off setpoint to prevent unstable rapid switching."
      },
      {
        word: "Relay Hunting / Chatter",
        pronunciation: "REE-lay CHAT-er",
        analogy: "The Jackhammering Switch",
        definition: "Destructive rapid cycling caused by sensor noise fluctuating around a single sharp decision threshold."
      },
      {
        word: "Contact Arc Erosion",
        pronunciation: "KON-takt ARK ee-ROH-zhun",
        analogy: "Pitting and Welding Spark Burn",
        definition: "Physical pitting and degradation of silver relay contacts caused by electric sparks during rapid switching."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 71: Bang-Bang Controller with Deadband Hysteresis
const int SOIL_PIN = A1;
const int RELAY_PIN = 7;

// Dual Hysteresis Thresholds
const int DRY_LIMIT = 35; // Turn pump ON when soil drops below 35%
const int WET_LIMIT = 65; // Keep pumping until soil reaches 65%

bool pumpRunning = false;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Active-LOW: OFF
  Serial.begin(115200);
}

void loop() {
  int rawADC = analogRead(SOIL_PIN);
  int moisturePct = map(rawADC, 580, 260, 0, 100);
  moisturePct = constrain(moisturePct, 0, 100);

  // Hysteresis Decision State Machine
  if (!pumpRunning && moisturePct < DRY_LIMIT) {
    // Soil is genuinely dry -> Start Irrigation!
    pumpRunning = true;
    digitalWrite(RELAY_PIN, LOW); // Turn Relay ON
    Serial.println(F("HYSTERESIS TRIGGER: Soil < 35% -> PUMP STARTED"));
  } 
  else if (pumpRunning && moisturePct >= WET_LIMIT) {
    // Soil is fully hydrated -> Stop Irrigation!
    pumpRunning = false;
    digitalWrite(RELAY_PIN, HIGH); // Turn Relay OFF
    Serial.println(F("HYSTERESIS TARGET: Soil >= 65% -> PUMP STOPPED"));
  }

  delay(500);
}`,
      human: `// Plain English Human Translation:
// 1. Establish two distinct thresholds: DRY_LIMIT at 35% and WET_LIMIT at 65%.
// 2. Track whether the pump is currently running with a boolean variable 'pumpRunning'.
// 3. If the pump is OFF and moisture drops below 35%, activate the relay to start watering.
// 4. While watering, even if moisture rises to 40% or 50%, KEEP PUMPING (inside the deadband).
// 5. Once moisture finally reaches or exceeds 65%, shut the pump OFF!
// 6. This eliminates relay chatter completely and saves the motor from premature burnout!`
    },
    stepCheck: {
      instruction: "Test the Hysteresis Deadband! Adjust the Lower (Dry) and Upper (Wet) threshold sliders, observe how the relay stays firmly ON while moisture climbs through the deadband, and click 'Validate Anti-Chatter Protection'.",
      targetCondition: "hysteresisTested"
    }
  },
  {
    id: 4,
    title: "Lesson 72: Closed-Loop Smart Irrigation Station & Water Safety Cutoff",
    shortTitle: "72. Smart Greenhouse Station",
    subtitle: "Autonomous Environmental Station: Timed Burst Dosing & Dry-Run Reservoir Protection",
    summary: "Engineer a complete autonomous agricultural station! Implement closed-loop soil monitoring, burst-metered irrigation dosing to prevent flooding, and safety dry-run protection to safeguard pumps if the water tank runs empty.",
    mascotMsg: "You're now an agricultural tech pioneer! 🌾 We'll tie together soil capacitance, optocoupled relays, pulsing water doses, and reservoir float sensors to run a real smart greenhouse! Let's deploy the automated irrigation!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Agriculture & Automation",
    labId: "soil",
    analogy: {
      headline: "Sipping Through a Straw Rather than Gulping the Glass",
      story: "If you dump an entire bucket of water on a dry plant all at once, the soil can't absorb it and water overflows onto the floor. Smart irrigation delivers short, metered sips (burst doses of 3 seconds), then pauses to let the water soak deeply into the soil before checking moisture again!",
      hardwareMetaphor: "A state machine: IDLE -> PUMP_PULSE (3 sec) -> SOAK_WAIT (15 sec) -> EVALUATE."
    },
    jargonBuster: [
      {
        word: "Closed-Loop Control",
        pronunciation: "KLOHZD-loop kun-TROHL",
        analogy: "The Driver Keeping the Car in the Center of the Lane",
        definition: "A continuous feedback system where sensor readings continuously update and modify actuator decisions."
      },
      {
        word: "Burst Dosing (Metered Sips)",
        pronunciation: "BURST DOH-sing",
        analogy: "The Controlled Medicine Dropper",
        definition: "Delivering short calibrated water pulses followed by soak delays to avoid over-saturation and root rot."
      },
      {
        word: "Dry-Run Protection",
        pronunciation: "DRY-run proh-TEK-shun",
        analogy: "The Engine Oil Pressure Safety Switch",
        definition: "Automatic hardware/software interlock disabling the pump if the water reservoir is empty, preventing overheating."
      },
      {
        word: "Soil Field Capacity",
        pronunciation: "SOYL FEELD kuh-PASS-ih-tee",
        analogy: "The Fully Loaded Kitchen Sponge",
        definition: "The exact percentage of moisture retained by soil after excess water has naturally drained away."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 72: Closed-Loop Smart Greenhouse Irrigation Controller
const int SOIL_PIN = A1;
const int RELAY_PIN = 7;
const int FLOAT_SWITCH_PIN = 8; // Digital Float Sensor in Water Reservoir

enum StationState { MONITORING, WATERING_PULSE, SOAKING_DELAY, RESERVOIR_EMPTY };
StationState systemState = MONITORING;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // OFF
  pinMode(FLOAT_SWITCH_PIN, INPUT_PULLUP);
  Serial.begin(115200);
}

void loop() {
  bool waterAvailable = (digitalRead(FLOAT_SWITCH_PIN) == LOW);
  int moisture = map(analogRead(SOIL_PIN), 580, 260, 0, 100);

  if (!waterAvailable) {
    systemState = RESERVOIR_EMPTY;
    digitalWrite(RELAY_PIN, HIGH); // Emergency Pump Cutoff
    Serial.println(F("SAFETY ALERT: Water Reservoir Empty! Pump Disabled."));
    delay(2000);
    return;
  }

  switch (systemState) {
    case MONITORING:
      if (moisture < 35) {
        Serial.println(F("Soil Dry -> Delivering 2.5s Metered Water Dose..."));
        digitalWrite(RELAY_PIN, LOW); // Start Pump
        systemState = WATERING_PULSE;
      }
      break;

    case WATERING_PULSE:
      delay(2500); // 2.5 second burst
      digitalWrite(RELAY_PIN, HIGH); // Stop Pump
      Serial.println(F("Dose Complete -> Entering 10s Soil Absorption Phase..."));
      systemState = SOAKING_DELAY;
      break;

    case SOAKING_DELAY:
      delay(10000); // Soak time
      systemState = MONITORING; // Return to closed-loop monitoring
      break;
  }
}`,
      human: `// Plain English Human Translation:
// 1. Monitor both the soil moisture on Pin A1 and a water reservoir float switch on Pin 8.
// 2. If the water tank runs out of water, immediately enter RESERVOIR_EMPTY mode and kill power to the pump!
// 3. If moisture is under 35%, pulse the water pump for exactly 2.5 seconds to deliver a precise dose.
// 4. Immediately shut off the pump and enter a 10-second soak phase, allowing the roots to absorb water.
// 5. Re-measure the soil: if more water is needed, pulse again; if moisture is optimal, return to idle standby.`
    },
    stepCheck: {
      instruction: "Deploy the Smart Greenhouse Controller! Toggle the Water Reservoir Float Switch to test dry-run emergency cutoff, click 'Deliver Metered Irrigation Dose' to simulate watering the pot, and click 'Deploy Smart Greenhouse Automation'.",
      targetCondition: "greenhouseDeployed"
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

if "SOIL_LESSONS_DATA" not in lessons:
    marker = "window.OLED_LESSONS_DATA = OLED_LESSONS_DATA;"
    lessons = lessons.replace(
        marker,
        soil_lessons_code.strip() + "\n\n" + marker + "\nwindow.SOIL_LESSONS_DATA = SOIL_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(lessons)
    print("SOIL_LESSONS_DATA inserted into js/lessons.js successfully!")
else:
    print("SOIL_LESSONS_DATA already in js/lessons.js.")

print("Done step 2.")
