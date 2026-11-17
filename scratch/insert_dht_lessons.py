# -*- coding: utf-8 -*-
"""
Script to insert DHT_LESSONS_DATA into js/lessons.js
"""

dht_lessons_code = '''
const DHT_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 57: The 1-Wire Single-Bus Handshake Protocol",
    shortTitle: "57. Single-Bus Handshake",
    subtitle: "How DHT Transmits 40 Bits of Weather Data across a Single Shared Data Wire",
    summary: "Discover why the DHT sensor needs only ONE signal wire (Pin 4)! Explore the microsecond-level timing handshake: the 18ms wake-up call, the 80µs response pulse, and the 40-bit data packet.",
    mascotMsg: "Meet your digital weather station! 💧 Unlike simple analog sensors that output a continuous voltage, the DHT has an internal microchip that speaks a digital single-bus language. Let's master the microsecond handshake!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "Climate Sensors",
    labId: "dht",
    analogy: {
      headline: "The Walkie-Talkie Over-and-Out Protocol",
      story: "If two people share one single radio frequency, they cannot both talk at the exact same second, or their voices will collide into garbled noise! They use a strict protocol: 1) You hold the button down for 18 milliseconds to say 'Wake up, Weather Station!', 2) You release the button and listen, 3) The weather station beeps twice ('I am awake, here is my report!'), 4) It sends 40 rapid beeps of temperature and humidity, then says 'Over and Out!'. That is single-bus bi-directional communication!",
      hardwareMetaphor: "The 4.7kΩ pull-up resistor keeps the signal wire at 5V idle; both Arduino and DHT pull the line LOW to send pulses."
    },
    jargonBuster: [
      {
        word: "Single-Bus Protocol",
        pronunciation: "SING-gul Bus PROH-tuh-kahl",
        analogy: "Single-Lane Reversible Road",
        definition: "A digital communication line where both devices share one wire by taking turns transmitting."
      },
      {
        word: "Pull-Up Resistor",
        pronunciation: "PUL-up ri-ZIS-tur",
        analogy: "Elastic Bungee Cord",
        definition: "A resistor (4.7kΩ) that pulls the signal line up to 5V (HIGH) whenever neither device is transmitting."
      },
      {
        word: "40-Bit Packet",
        pronunciation: "FOR-tee Bit PAK-et",
        analogy: "A 5-Word Telegram",
        definition: "Data stream: 16 bits Humidity + 16 bits Temperature + 8 bits Checksum error detection."
      },
      {
        word: "Checksum",
        pronunciation: "CHEK-sum",
        analogy: "Receipt Verification Math",
        definition: "A mathematical sum added to the end of the packet: if (Byte1 + Byte2 + Byte3 + Byte4 == Checksum), data is 100% error-free!"
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Import DHT Sensor Driver Library:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Connect DHT DATA pin to Arduino Digital Pin 4", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Send 18ms Wake-Up Low Pulse to Sensor:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Arduino pulls Pin 4 LOW for 18,000 microseconds, then switches to INPUT", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "STEP 3: Read 40-Bit Digital Humidity & Temp Stream:", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "Read 16-bit Relative Humidity = 65.0% RH", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "Read 16-bit Ambient Temperature = 28.5°C", indent: 1, tag: "code" },
        { id: "h8", line: 8, text: "Verify 8-bit Checksum byte -> Data verified 100% genuine!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <DHT.h>", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "#define DHTPIN 4     // Digital pin connected to DHT sensor", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "#define DHTTYPE DHT11 // DHT 11 model", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "empty" },
        { id: "c5", line: 5, text: "DHT dht(DHTPIN, DHTTYPE);", indent: 0, tag: "setup" },
        { id: "c6", line: 6, text: "", indent: 0, tag: "empty" },
        { id: "c7", line: 7, text: "void setup() {", indent: 0, tag: "block-start" },
        { id: "c8", line: 8, text: "  Serial.begin(9600);", indent: 1, tag: "setup" },
        { id: "c9", line: 9, text: "  dht.begin(); // Initialize single-bus handshake", indent: 1, tag: "setup" },
        { id: "c10", line: 10, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Single-Wire Serial Protocols, Open-Drain Timing & Checksums",
      pedagogy: "Introduces asynchronous bit-banging and error-detection checksums. Helps students understand why digital sensor signals are immune to analog electrical noise.",
      misconceptions: [
        {
          title: "Misconception: 'Can you read a DHT11 sensor 100 times per second in a fast loop()?'",
          detail: "NO! DHT11 sensors require at least 1.0 to 2.0 seconds between consecutive readings for their internal capacitive polymer to settle. Reading too fast returns NaN (Not a Number) errors."
        }
      ],
      discussionPrompts: [
        "Why is a 4.7kΩ pull-up resistor needed on the DATA wire? (To prevent the wire from floating when neither device is driving).",
        "If an electrical spark flips one bit during transmission, how does the Arduino know using the checksum?"
      ],
      standards: [
        "CSTA 2-CS-02: Design computational models that reflect communication protocols.",
        "NITI Aayog ATL Equipment Package P2: Digital Environmental Sensors and Handshake Protocols."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 58: Capacitive Polymer Humidity Physics",
    shortTitle: "58. Humidity Sensing Physics",
    subtitle: "Dielectric Constant Shifts: How Trapped Water Molecules Change Capacitance",
    summary: "Look inside the blue plastic shell! Discover how a porous hygroscopic polymer sponge traps atmospheric water vapor, altering its electrical capacitance to measure 0% to 100% Relative Humidity.",
    mascotMsg: "How can a solid computer chip know how humid the air is? Inside the blue grill is a microscopic moisture sponge! As moisture increases, it changes electrical storage capacity. Let's see how!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "Climate Sensors",
    labId: "dht",
    analogy: {
      headline: "The Sponge in the Bathroom Shower",
      story: "If you leave a dry dish sponge on your bathroom counter, it feels light and stiff. But take a hot steamy shower, and the invisible water vapor in the air gets soaked up by the sponge's microscopic pores, making it heavy and damp! Inside the DHT sensor is a microscopic capacitor with a moisture-loving polymer dielectric. When humidity rises, water molecules cram into the polymer, boosting its dielectric constant and electrical capacitance!",
      hardwareMetaphor: "The capacitor plates are interdigitated comb fingers; water molecules (high permittivity κ=80) replace dry air (κ=1)."
    },
    jargonBuster: [
      {
        word: "Relative Humidity (RH)",
        pronunciation: "REL-uh-tiv hyoo-MID-ih-tee",
        analogy: "Sponge Fullness Percentage",
        definition: "The amount of moisture in the air compared to the maximum moisture air can hold at that temperature."
      },
      {
        word: "Dielectric Constant",
        pronunciation: "dye-uh-LEK-trik KON-stunt",
        analogy: "Electrical Storage Ability",
        definition: "The property of an insulator that increases capacitance when water molecules are trapped inside."
      },
      {
        word: "NTC Thermistor",
        pronunciation: "EN-tee-see ther-MIS-tur",
        analogy: "Heat-Sensitive Resistor",
        definition: "Negative Temperature Coefficient resistor: its resistance drops as temperature rises."
      },
      {
        word: "Hygroscopic",
        pronunciation: "hye-groh-SKAHP-ik",
        analogy: "Water Magnet",
        definition: "Materials that naturally absorb and hold moisture from the surrounding atmosphere."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Sample Ambient Relative Humidity:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Read capacitive humidity register -> 65.0% RH", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "STEP 2: Classify Human Comfort Zone:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Below 30% RH: Dry / Arid (Chapped skin, static electricity)", indent: 1, tag: "explanation" },
        { id: "h5", line: 5, text: "30% to 60% RH: Ideal Comfort Zone (Healthy respiratory airways)", indent: 1, tag: "explanation" },
        { id: "h6", line: 6, text: "Above 70% RH: Muggy / Tropical (Sweat cannot evaporate)", indent: 1, tag: "explanation" },
        { id: "h7", line: 7, text: "STEP 3: Trigger HVAC Humidifier / Dehumidifier automation!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void loop() {", indent: 0, tag: "block-start" },
        { id: "c2", line: 2, text: "  delay(2000); // 2 second measurement delay", indent: 1, tag: "setup" },
        { id: "c3", line: 3, text: "  float h = dht.readHumidity();", indent: 1, tag: "code" },
        { id: "c4", line: 4, text: "  float t = dht.readTemperature();", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "", indent: 1, tag: "empty" },
        { id: "c6", line: 6, text: "  if (isnan(h) || isnan(t)) {", indent: 1, tag: "block-start" },
        { id: "c7", line: 7, text: "    Serial.println(\"Failed to read from DHT sensor!\");", indent: 2, tag: "code" },
        { id: "c8", line: 8, text: "    return;", indent: 2, tag: "code" },
        { id: "c9", line: 9, text: "  }", indent: 1, tag: "block-end" },
        { id: "c10", line: 10, text: "  Serial.print(\"Humidity: \"); Serial.print(h); Serial.println(\" %\");", indent: 1, tag: "code" },
        { id: "c11", line: 11, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Psychrometrics, Atmospheric Thermodynamics & Capacitance",
      pedagogy: "Links chemistry and physics concepts (relative humidity, partial vapor pressure, dielectric polarization) to practical environmental instrumentation.",
      misconceptions: [
        {
          title: "Misconception: 'Does 100% humidity mean you are underwater?'",
          detail: "No! 100% Relative Humidity means the air holds the absolute maximum amount of water vapor possible at that specific temperature before fog, clouds, or rain condense out."
        }
      ],
      discussionPrompts: [
        "Why does 30°C feel comfortable in a dry desert, but sticky and unbearable in Mumbai or Chennai? (Sweat evaporation rate).",
        "How do museum curators use DHT sensors to protect ancient paper scrolls and oil paintings?"
      ],
      standards: [
        "NGSS MS-ESS2-5: Collect data to provide evidence for how the motions and complex interactions of air masses result in changes in weather conditions.",
        "NITI Aayog ATL Curriculum Module 2: Climate Sensing, Psychrometrics, and Agriculture Monitoring."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 59: Calculating the Heat Index & Discomfort Formula",
    shortTitle: "59. Heat Index Math",
    subtitle: "Why 35°C at 80% Humidity Feels Like 48°C: The Science of Evaporative Cooling",
    summary: "Discover why thermometers lie! Learn how human bodies cool down using evaporative sweating, and program the NOAA Rothfusz Heat Index polynomial formula into Arduino C++.",
    mascotMsg: "Ever step outside and say 'The weather app says 32°C, but it feels like 42°C!'? That is the Heat Index! When humidity is high, your sweat can't evaporate, trapping heat inside your body. Let's calculate the real 'Feels Like' temperature!",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Climate Sensors",
    labId: "dht",
    analogy: {
      headline: "The Wet Swimming Towel in the Wind",
      story: "When you step out of a swimming pool on a windy day, you instantly feel shivering cold! That is evaporative cooling: as water turns into vapor, it steals thermal energy from your skin. But on a muggy, rainy monsoon day, a wet towel will NEVER dry no matter how long you hang it, because the air is already saturated with water! The Heat Index is a mathematical formula that calculates how dangerously hot your body feels when sweating stops working.",
      hardwareMetaphor: "The Rothfusz regression equation: a 9-term polynomial mapping ambient dry-bulb temperature and relative humidity to equivalent perceived heat."
    },
    jargonBuster: [
      {
        word: "Heat Index",
        pronunciation: "HEET IN-deks",
        analogy: "Feels Like Temperature",
        definition: "A combined metric of temperature and humidity that indicates perceived human thermal stress."
      },
      {
        word: "Evaporative Cooling",
        pronunciation: "ih-VAP-ruh-tiv KOOL-ing",
        analogy: "The Pool Shiver",
        definition: "The cooling of a surface that happens when liquid water evaporates into gas."
      },
      {
        word: "Thermal Stress",
        pronunciation: "THUR-mul Stress",
        analogy: "Engine Overheating",
        definition: "When the human body cannot dissipate metabolic heat, risking heat exhaustion or heatstroke."
      },
      {
        word: "Rothfusz Polynomial",
        pronunciation: "ROTH-fooz PAH-lee-noh-mee-ul",
        analogy: "The Weather Bureau Equation",
        definition: "The mathematical formula adopted by NOAA and meteorological agencies to compute Heat Index."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Read Sensor Temperature & Humidity Inputs:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Ambient Temperature = 32.0°C | Relative Humidity = 75.0% RH", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "STEP 2: Compute NOAA Heat Index (Feels Like):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Heat Index = dht.computeHeatIndex(32.0, 75.0, false);", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Result = 43.8°C ('DANGER: Heat Cramps & Exhaustion Likely')", indent: 1, tag: "explanation" },
        { id: "h6", line: 6, text: "STEP 3: Trigger Classroom Warning Alarm & Fans!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// NOAA Heat Index Calculation in Arduino C++", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "float calcHeatIndex(float t, float h) {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  // Convert Celsius to Fahrenheit for Rothfusz formula", indent: 1, tag: "comment" },
        { id: "c4", line: 4, text: "  float tf = (t * 1.8) + 32.0;", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "  float hiF = -42.379 + 2.04901523*tf + 10.14333127*h - 0.22475541*tf*h;", indent: 1, tag: "code" },
        { id: "c6", line: 6, text: "  return (hiF - 32.0) / 1.8; // Return in Celsius", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Applied Polynomial Mathematics, Biometeorology & Public Health",
      pedagogy: "Shows students real-world algebra applied to life safety. Students see how high-degree multi-variable polynomials ($f(T, RH)$) protect outdoor athletes and factory workers from heatstroke.",
      misconceptions: [
        {
          title: "Misconception: 'Does an electric fan actually make the air in a room colder?'",
          detail: "No! A fan moves room-temperature air, but feels cold because the moving air accelerates sweat evaporation from your skin. In high humidity (> 90%), fans lose effectiveness."
        }
      ],
      discussionPrompts: [
        "Why do schools declare sports heat advisories based on the Heat Index rather than just thermometer temperature?",
        "If ambient temp is 25°C, does humidity still make it feel significantly hotter? Why or why not?"
      ],
      standards: [
        "CSTA 2-AP-14: Create clearly named variables that represent different data types and perform operations on their values.",
        "NITI Aayog ATL Weather Station Curriculum: Advanced Biometeorology & Warning Thresholds."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 60: Automated Smart Greenhouse Climate Regulator",
    shortTitle: "60. Smart Greenhouse Studio",
    subtitle: "Closed-Loop Hysteresis Automation: Fans, Misting Atomizers & Crop Health",
    summary: "Build an automated smart greenhouse! Program closed-loop bang-bang and hysteresis control to trigger exhaust ventilation fans when hot, and ultrasonic misting atomizers when dry.",
    mascotMsg: "Plants are living creatures with exact climate requirements! 🌱 Tomatoes need 22°C to 28°C and 60% humidity. Let's build an autonomous climate brain that triggers water misting and cooling fans automatically!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Climate Sensors",
    labId: "dht",
    analogy: {
      headline: "The Automated Thermostat & The Goldilocks Zone",
      story: "If a baby is too hot, you take off a blanket. If they are too cold, you wrap them up. But if you change blankets every 2 seconds, you will exhaust yourself! In engineering, this is called 'Hysteresis Deadband': you turn the fan ON when it hits 30°C, but don't turn it off until it cools down to 26°C. That 4°C buffer prevents the motor relay from buzzing on-and-off rapidly ('chattering') and burning out!",
      hardwareMetaphor: "Relay control deadband prevents relay contact arc erosion caused by high-frequency switching."
    },
    jargonBuster: [
      {
        word: "Closed-Loop Control",
        pronunciation: "KLOHZD-loop kun-TROHL",
        analogy: "Cruise Control in a Car",
        definition: "A system that continuously measures sensor output and adjusts actuators to maintain a target setpoint."
      },
      {
        word: "Hysteresis",
        pronunciation: "his-tuh-REE-sis",
        analogy: "The Buffer Zone",
        definition: "A lag between turning on and turning off that prevents actuators from rapidly flickering."
      },
      {
        word: "Misting Atomizer",
        pronunciation: "MIS-ting AT-uh-my-zur",
        analogy: "Cooling Fog Machine",
        definition: "A piezoelectric transducer that vibrates at 110kHz to turn water into ultra-fine cooling fog."
      },
      {
        word: "Exhaust Fan",
        pronunciation: "eg-ZAWST Fan",
        analogy: "Kitchen Vent Hood",
        definition: "A 12V DC blower fan that expels hot humid air out of the greenhouse roof."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "GREENHOUSE CLOSED-LOOP REGULATION LOGIC:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "RULE 1: Temperature Regulation (Target = 26.0°C):", indent: 0, tag: "header" },
        { id: "h3", line: 3, text: "If Temp > 30.0°C -> Turn ON Roof Exhaust Fan (Pin 6)", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "If Temp < 26.0°C -> Turn OFF Roof Exhaust Fan (Hysteresis buffer)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "RULE 2: Relative Humidity Regulation (Target = 65.0% RH):", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "If Humidity < 50.0% -> Turn ON Ultrasonic Misting Atomizer (Pin 7)", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "If Humidity > 70.0% -> Turn OFF Ultrasonic Misting Atomizer", indent: 1, tag: "code" },
        { id: "h8", line: 8, text: "GREENHOUSE IN BALANCE: Optimal Photosynthesis & Growth Achieved!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Smart Greenhouse Dual Setpoint Regulation", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const int PIN_FAN = 6;  // Exhaust fan relay", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const int PIN_MIST = 7; // Ultrasonic mist relay", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "empty" },
        { id: "c5", line: 5, text: "void regulateClimate(float t, float h) {", indent: 0, tag: "block-start" },
        { id: "c6", line: 6, text: "  // Cooling Fan with Hysteresis", indent: 1, tag: "comment" },
        { id: "c7", line: 7, text: "  if (t >= 30.0) digitalWrite(PIN_FAN, HIGH);", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  else if (t <= 26.0) digitalWrite(PIN_FAN, LOW);", indent: 1, tag: "code" },
        { id: "c9", line: 9, text: "", indent: 1, tag: "empty" },
        { id: "c10", line: 10, text: "  // Misting Atomizer with Hysteresis", indent: 1, tag: "comment" },
        { id: "c11", line: 11, text: "  if (h <= 50.0) digitalWrite(PIN_MIST, HIGH);", indent: 1, tag: "code" },
        { id: "c12", line: 12, text: "  else if (h >= 70.0) digitalWrite(PIN_MIST, LOW);", indent: 1, tag: "code" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Closed-Loop Feedback Systems, Deadband Hysteresis & Precision AgriTech",
      pedagogy: "Bridges environmental science and computer engineering. Teaches students how autonomous feedback loops form the foundation of modern smart farming, vertical hydroponics, and space habitats.",
      misconceptions: [
        {
          title: "Misconception: 'Why can't we just write `if (t > 28) fanON; else fanOFF;` without a buffer?'",
          detail: "If the temperature hovers at 28.01°C, the fan turns on, drops temp to 27.99°C in 1 second, turns off, temp rises to 28.01°C, and turns back on. This rapid flickering ('relay chatter') burns out relays and motors in days."
        }
      ],
      discussionPrompts: [
        "How would an astronaut greenhouse on Mars use this exact closed-loop control system?",
        "What other actuators besides fans and misters could you add? (Grow lights, CO2 injectors, shading screens)."
      ],
      standards: [
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification.",
        "CSTA 2-AP-17: Systematically design and iteratively develop computational artifacts.",
        "NITI Aayog ATL Capstone: Internet of Things (IoT) Precision Agriculture & Food Security."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "const DHT_LESSONS_DATA =" not in content:
    target = "window.LESSONS_DATA = LESSONS_DATA;"
    new_content = content.replace(target, dht_lessons_code.strip() + "\n\n" + target)
    new_content = new_content.replace(
        "window.SLICER_LESSONS_DATA = SLICER_LESSONS_DATA;",
        "window.SLICER_LESSONS_DATA = SLICER_LESSONS_DATA;\nwindow.DHT_LESSONS_DATA = DHT_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("DHT_LESSONS_DATA inserted successfully into js/lessons.js!")
else:
    print("DHT_LESSONS_DATA already in js/lessons.js.")
