import sys

sonar_code = '''
const SONAR_LESSONS_DATA = [
  {
    id: 33,
    title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",
    subtitle: "Zero-jargon physical principle of ultrasound echolocation and dual transducer cans",
    difficulty: "Beginner",
    duration: "15 min",
    category: "Sonar",
    labId: "sonar",
    analogy: {
      headline: "The Canyon Shout and Stopwatch: How Ultrasonic Radar Measures Distance",
      story: "Imagine standing at the edge of the Grand Canyon on a crisp, quiet morning. You shout 'HELLO!' loudly toward the rock wall across the canyon. Exactly 4 seconds later, you hear your echo bounce back: 'HELLO!'. Since sound travels at approximately 340 meters every single second, your voice traveled across the canyon and back in 4 seconds (total distance = 4s * 340 m/s = 1360 meters). Dividing by 2 gives the one-way distance to the rock wall: 680 meters! The HC-SR04 ultrasonic sensor operates identically: its left transducer ('T') sends a silent high-frequency chirp at 40,000 Hertz (far above human hearing), and its right transducer ('R') acts as a supersensitive microphone waiting for the returning sound bounce!",
      hardwareMetaphor: "Transmitter 'T' is a miniature high-frequency speaker horn; Receiver 'R' is an ultra-tuned directional ear microphone; Arduino is the hyper-precise microsecond stopwatch!"
    },
    code: `#define TRIG_PIN 12
#define ECHO_PIN 11

void setup() {
  // Start serial communications at 9600 baud
  Serial.begin(9600);
  
  // Set Trigger as OUTPUT (we shoot sound)
  pinMode(TRIG_PIN, OUTPUT);
  // Set Echo as INPUT (we listen for sound)
  pinMode(ECHO_PIN, INPUT);
  
  // Keep trigger quiet to start
  digitalWrite(TRIG_PIN, LOW);
  Serial.println("Ultrasonic Radar Initialized!");
}

void loop() {
  // Lesson 33 focuses on pin configuration and test ping
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Fire a clean 10-microsecond ultrasound trigger pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  Serial.println("Sonic ping fired!");
  delay(1000);
}`,
    explanation: [
      {
        line: "#define TRIG_PIN 12",
        plainEnglish: "Pins 12 and 11 act as our acoustic radar station: Pin 12 sends the trigger sound burst, Pin 11 listens for the reflected echo pulse."
      },
      {
        line: "pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);",
        plainEnglish: "Trigger is configured as an OUTPUT because the Arduino controls when to fire sound waves; Echo is an INPUT because the sensor signals Arduino when sound arrives."
      },
      {
        line: "digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);",
        plainEnglish: "HC-SR04 requires an exact 10-microsecond HIGH pulse on the trigger pin. This triggers its onboard microchip to blast 8 cycles of 40 kHz ultrasound into the air."
      }
    ],
    task: {
      instruction: "Inspect the dual HC-SR04 metallic cans on the breadboard. Notice the 'T' (Transmitter) and 'R' (Receiver) markings. Click 'Fire Sonic Ping' to emit an ultrasound burst and observe the high-frequency acoustic wave ripples on the hardware stage!",
      buttonText: "Fire Sonic Ping",
      verifyCondition: "sonarPingFired"
    },
    teacherMode: {
      pedagogyTitle: "Acoustic Wave Physics and Speed of Sound Mechanics",
      pedagogy: "Directly connects 7th-grade physics sound propagation concepts (longitudinal compression waves, speed of sound in standard atmosphere ~343 m/s at 20°C) to digital microcontroller microsecond timing.",
      misconceptions: [
        {
          title: "Misconception: 'Does the HC-SR04 emit a laser or infrared light?'",
          detail: "No! The HC-SR04 emits mechanical sound pressure waves at 40 kHz (ultrasound). Unlike light which travels at 300,000 km/s, sound travels at a leisurely 343 m/s, making it simple for a 16MHz Arduino to measure microseconds of flight time!"
        }
      ],
      discussionPrompts: [
        "Why can bats fly through pitch-black caves without bumping into cave walls or stalactites?",
        "If temperature drops from +35°C in the summer to 0°C in winter, what happens to the speed of sound and your distance readings?"
      ],
      standards: [
        "NGSS MS-PS4-2: Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials.",
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware sensors."
      ]
    }
  },
  {
    id: 34,
    title: "Catching the Echo Wave: pulseIn() and Microsecond Clocks",
    subtitle: "How Arduino measures the flight time of returning acoustic waves",
    difficulty: "Intermediate",
    duration: "15 min",
    category: "Sonar",
    labId: "sonar",
    analogy: {
      headline: "The Olympic Stopwatch: Measuring High-Speed Flight Time",
      story: "When you run a 100-meter sprint, a judge clicks a stopwatch the instant the starting pistol fires, and clicks it again the moment your foot crosses the finish line. In Arduino, `pulseIn()` is that hyper-precise stopwatch! The moment the HC-SR04 detects the returning echo reflection, it raises its Echo pin to 5 Volts (HIGH) and holds it HIGH until the sound burst finishes returning. `pulseIn(ECHO_PIN, HIGH)` counts the exact number of microseconds that Echo stayed HIGH!",
      hardwareMetaphor: "The Echo pin is like an electric flag raised into the sky while sound is flying through the air, dropping back to zero the moment sound returns!"
    },
    code: `#define TRIG_PIN 12
#define ECHO_PIN 11

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // 1. Clear trigger pin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // 2. Fire 10us trigger pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // 3. Read the echo flight time in microseconds
  // pulseIn waits for pin to go HIGH, starts timing, then stops when LOW
  long durationUs = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout (~5m)
  
  Serial.print("Sound Round-Trip Duration: ");
  Serial.print(durationUs);
  Serial.println(" microseconds (µs)");
  
  delay(200);
}`,
    explanation: [
      {
        line: "long durationUs = pulseIn(ECHO_PIN, HIGH, 30000);",
        plainEnglish: "`pulseIn()` pauses execution, waits for ECHO_PIN to rise HIGH, counts microseconds with internal hardware timers, and returns when it drops back to LOW. The 30,000µs (30ms) timeout prevents code from freezing if no echo returns."
      },
      {
        line: "delayMicroseconds(10);",
        plainEnglish: "Microseconds (µs) are one-millionth of a second! While standard `delay()` takes milliseconds (10^-3 s), sound moves 34 centimeters in a single millisecond, so we need microsecond (10^-6 s) precision!"
      }
    ],
    task: {
      instruction: "Drag the obstacle obstacle slider to test different distances. Observe how the Echo microsecond pulse duration increases proportionally on the live oscilloscope trace as the target moves farther away!",
      buttonText: "Capture Echo Pulse",
      verifyCondition: "sonarEchoCaptured"
    },
    teacherMode: {
      pedagogyTitle: "Microcontroller Time Quantization and Blocking Function Timeouts",
      pedagogy: "Teaches students how microcontrollers measure sub-millisecond physical phenomena, and why defensive programming (such as timeout parameters) is essential when interfacing with external analog hardware.",
      misconceptions: [
        {
          title: "Misconception: 'Does pulseIn() return the distance in centimeters?'",
          detail: "No! `pulseIn()` returns pure TIME (flight duration in microseconds). We must use physical conversion constants to calculate geometric distance."
        }
      ],
      discussionPrompts: [
        "What happens if you point the HC-SR04 into the open night sky with no ceiling or walls? Why does pulseIn() need a timeout?",
        "Why can't we use a standard stopwatch or human eye to measure the echo flight time?"
      ],
      standards: [
        "CSTA 2-AP-11: Create clearly named variables that represent different data types, including time durations.",
        "NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among several design solutions."
      ]
    }
  },
  {
    id: 35,
    title: "The Math of Echoes: Dividing by 58.2 to Calculate Distance",
    subtitle: "Converting acoustic flight time into centimeters and inches",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "Sonar",
    labId: "sonar",
    analogy: {
      headline: "The 2-Way Toll Road: Dividing Round-Trip Time by 2",
      story: "If you drive to the mall and return home in 60 minutes at a steady pace, the trip to the mall alone only took 30 minutes! Because sound has to travel TO the obstacle and bounce BACK to the receiver, the recorded microsecond duration is a two-way round trip! Since sound travels at 0.0343 cm per microsecond, Distance = (Duration * 0.0343) / 2 = Duration / 58.2. In one clean line of arithmetic, your Arduino converts acoustic flight time into precision metric centimeters!",
      hardwareMetaphor: "58.2 is the magic acoustic constant: sound takes exactly 58.2 microseconds to travel 1 cm out and 1 cm back!"
    },
    code: `#define TRIG_PIN 12
#define ECHO_PIN 11

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Fire 10us trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Measure round-trip time in microseconds
  long duration = pulseIn(ECHO_PIN, HIGH);
  
  // Convert duration to distance in centimeters
  // Formula: Distance (cm) = Duration (us) * 0.0343 / 2
  // Or: Distance (cm) = Duration (us) / 58.2
  float distanceCm = duration * 0.0343 / 2.0;
  float distanceIn = distanceCm / 2.54; // Convert to inches
  
  Serial.print("Distance: ");
  Serial.print(distanceCm, 1);
  Serial.print(" cm  |  ");
  Serial.print(distanceIn, 1);
  Serial.println(" inches");
  
  delay(300);
}`,
    explanation: [
      {
        line: "float distanceCm = duration * 0.0343 / 2.0;",
        plainEnglish: "Sound travels through air at 343 meters per second, which equals 0.0343 centimeters per microsecond. We multiply flight duration by 0.0343, then divide by 2 because sound traveled there and back!"
      },
      {
        line: "float distanceIn = distanceCm / 2.54;",
        plainEnglish: "Converts metric centimeters to standard inches using the international conversion factor of 2.54 cm per inch."
      }
    ],
    task: {
      instruction: "Move the target obstacle closer than 15 cm or farther than 80 cm. Watch the live distance telemetry compute cm and inches in real time on the digital HUD!",
      buttonText: "Verify Distance Calculation",
      verifyCondition: "sonarMathVerified"
    },
    teacherMode: {
      pedagogyTitle: "Applied Dimensional Analysis and Rate-Time-Distance Kinematics",
      pedagogy: "Reinforces core middle-school algebra kinematics (d = r * t), unit cancellation (microseconds to seconds, meters to centimeters), and floating-point arithmetic precision in C++.",
      misconceptions: [
        {
          title: "Misconception: 'Why does the sensor give wild 0cm or 3000cm readings if I point it at a fluffy pillow?'",
          detail: "Soft, fluffy materials (foam, cloth, wool) absorb sound waves rather than reflecting them. Angled flat walls bounce sound away from the receiver like a mirror, producing no return echo! Hard, flat, perpendicular surfaces give the cleanest reflections."
        }
      ],
      discussionPrompts: [
        "Why do recording studios put foam pyramids on the walls instead of flat wooden paneling?",
        "If the temperature rises to 40°C in an Indian summer, sound travels faster (355 m/s). Does an uncalibrated HC-SR04 read objects as closer or farther than they really are?"
      ],
      standards: [
        "CCSS.MATH.CONTENT.7.EE.B.3: Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process."
      ]
    }
  },
  {
    id: 36,
    title: "Automotive Reverse Assistant: Multi-Zone Parking Radar",
    subtitle: "Build a smart car parking radar with distance-dependent beeps and warning LEDs",
    difficulty: "Advanced Capstone",
    duration: "25 min",
    category: "Sonar",
    labId: "sonar",
    analogy: {
      headline: "The Modern Car Bumper: Smart Acoustic Proximity Warnings",
      story: "When a driver puts their car into reverse and backs into a tight parking space, they hear a gentle periodic 'beep... beep... beep...'. As the rear bumper approaches a wall or bollard, the beeps accelerate rapidly: 'beep-beep-beep-beep!'. When within 10 centimeters of impact, the beeps merge into an unbroken continuous screech: 'BEEEEEEEEEP! STOP!'. This capstone lab wires together our HC-SR04 sonar sensor, a warning Piezo buzzer, and a tri-color alert system to build an authentic automotive parking radar!",
      hardwareMetaphor: "Acoustic distance determines the frequency of timer interrupts: closer obstacle = shorter silence interval between warning alert tones!"
    },
    code: `#define TRIG_PIN 12
#define ECHO_PIN 11
#define BUZZER_PIN 8
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // 1. Measure distance in cm
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.0343 / 2.0;
  
  // 2. Multi-Zone Alert Logic
  if (distance > 50.0 || distance <= 0.0) {
    // Green Zone: Safe (>50 cm) - Silent, LED off
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
  } else if (distance > 20.0) {
    // Yellow Zone: Caution (20-50 cm) - Medium beeps
    tone(BUZZER_PIN, 1500, 50);
    digitalWrite(LED_PIN, HIGH);
    int pauseTime = map(distance, 20, 50, 100, 500);
    delay(pauseTime);
    digitalWrite(LED_PIN, LOW);
  } else if (distance > 8.0) {
    // Red Zone: Critical Hazard (8-20 cm) - Rapid urgent beeps
    tone(BUZZER_PIN, 2400, 30);
    digitalWrite(LED_PIN, HIGH);
    delay(70);
    digitalWrite(LED_PIN, LOW);
    delay(70);
  } else {
    // Danger Stop Zone (<8 cm) - Continuous solid alarm
    tone(BUZZER_PIN, 3000);
    digitalWrite(LED_PIN, HIGH);
  }
}`,
    explanation: [
      {
        line: "if (distance > 50.0) ... else if (distance > 20.0) ...",
        plainEnglish: "Multi-tier conditional branches divide physical space into 4 safety zones: Safe Green (>50cm), Caution Yellow (20-50cm), Hazard Red (8-20cm), and Emergency Stop (<8cm)."
      },
      {
        line: "int pauseTime = map(distance, 20, 50, 100, 500); delay(pauseTime);",
        plainEnglish: "Dynamic chirp spacing: as distance drops from 50cm down to 20cm, the pause between beeps shrinks from 500ms down to 100ms, naturally speeding up the auditory alert cadence!"
      },
      {
        line: "tone(BUZZER_PIN, 3000); // Continuous emergency tone",
        plainEnglish: "When the bumper is less than 8 cm away, calling `tone()` without a duration keeps the buzzer ringing continuously, warning the driver of imminent collision."
      }
    ],
    task: {
      instruction: "Enter the Reverse Parking Radar Studio! Slide the virtual obstacle car toward the rear bumper sensor. Experience the 4 color-coded safety zones, observe the animated radar acoustic ripples, and hear the real-time proximity beeps speed up into a continuous collision alert!",
      buttonText: "Activate Parking Radar",
      verifyCondition: "sonarRadarActive"
    },
    teacherMode: {
      pedagogyTitle: "Cyber-Physical Safety Systems and Ergonomic Alert Design",
      pedagogy: "Combines sensor acquisition, arithmetic conversion, multi-tier decision trees, and multimodal human-machine interface (HMI) alerts (visual LED strobe + auditory frequency modulation).",
      misconceptions: [
        {
          title: "Misconception: 'Can self-driving cars rely exclusively on ultrasonic sensors?'",
          detail: "Ultrasonic sensors have a maximum effective range of ~4 meters and sound travels slowly. High-speed highway driving requires LiDAR (light pulses) and RADAR (millimeter radio waves) which travel at the speed of light!"
        }
      ],
      discussionPrompts: [
        "Why do automotive engineers use both visual dashboard displays and audio tones for parking radar?",
        "How would you adapt this code to create a smart navigation cane for visually impaired individuals?"
      ],
      standards: [
        "CSTA 2-CS-03: Systematically identify and fix problems with computing devices and their components.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'window.BUZZER_LESSONS_DATA = BUZZER_LESSONS_DATA;'
if target in content:
    new_content = content.replace(target, sonar_code + '\n' + target)
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully inserted SONAR_LESSONS_DATA!')
else:
    print('Target not found!')
