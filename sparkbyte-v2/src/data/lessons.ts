/**
 * All 22 ATL Curriculum Labs and 88 Engineering Lessons
 * Converted to strict TypeScript with zero 'any' types.
 */
import { Lab } from '../types/curriculum';

export const ALL_LABS: Lab[] = [
  {
    "id": "led",
    "name": "LED Digital Blink Lab",
    "title": "Level 1 • LED Digital Blink Lab",
    "grade": "6-8",
    "category": "basics",
    "badge": "Grades 6–8",
    "iconName": "Lightbulb",
    "description": "Master GPIO digital outputs, HIGH/LOW logic levels, and millisecond time delays.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: The Brain & The Routine",
        "subtitle": "How does an Arduino wake up and spend its day?",
        "summary": "Learn why Arduino code is split into two rooms: void setup() (things done once at boot) and void loop() (things done forever).",
        "mascotMsg": "Hey there, Future Engineer! 👋 Meet your Arduino board. Just like you, it has two big modes: things it does ONCE when it wakes up, and things it keeps doing ALL DAY without stopping!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    // Code here runs ONCE when you press reset or plug USB in\n}\nvoid loop() {\n    // Code here runs OVER and OVER in a continuous cycle\n}",
          "human": "ROUTINE 1: When power turns ON (Do ONCE):\n    Prepare the Arduino and check the pins\n\nROUTINE 2: As long as power is plugged in (REPEAT FOREVER):\n    Step A: Keep checking the sensors\n    Step B: React to the world around you"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: Speaking to the Pins",
        "subtitle": "Giving the robot a Megaphone or an Ear",
        "summary": "Teach pinMode(13, OUTPUT) by claiming Pin 13 on the Arduino board and deciding if it sends electricity out or listens for it.",
        "mascotMsg": "Look at all those little metal holes on the Arduino board! Those are called PINS. Think of each pin like a hand that can either PUSH things (OUTPUT) or CATCH things (INPUT). Let's claim Pin 13!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    // Pin 13 is configured and ready to drive our LED!\n}",
          "human": "When power turns ON (Do ONCE):\n    Tell Pin 13 to act like a Megaphone (Push power OUT);\n\nREPEAT FOREVER:\n    (Ready for our next command...)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: The Light Switch & The Clock",
        "subtitle": "Turning the LED ON and OFF with exact millisecond timing",
        "summary": "Teach digitalWrite() and delay(). Modify the delay number to create custom blink tempos (calm, disco, strobe, or Morse code).",
        "mascotMsg": "Time for fireworks! 🎆 Now we teach the Arduino to flip the switch (digitalWrite) and pause between actions (delay). Type your own numbers into the delay boxes to set the rhythm!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    digitalWrite(13, HIGH);\n    delay(1000);\n    digitalWrite(13, LOW);\n    delay(1000);\n}",
          "human": "When power turns ON (Do ONCE):\n    Tell Pin 13 to act like a Megaphone (Push power OUT);\n\nREPEAT FOREVER (The Blink Dance):\n    1. Turn Pin 13 power ON (Send 5V);\n    2. Freeze and wait for [1000] milliseconds;\n    3. Turn Pin 13 power OFF (0V);\n    4. Freeze and wait for [1000] milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: The Inventor's Sandbox",
        "subtitle": "Mix and match commands to invent your own light shows & Morse code!",
        "summary": "Create your own sequence: customize pins, add steps, make Morse code SOS, or design an emergency siren strobe.",
        "mascotMsg": "You're a certified Arduino Coder now! 🚀 Welcome to the Inventor's Sandbox. Design your own sequence, pick your timing, and test it live on the breadboard!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    digitalWrite(13, HIGH);\n    delay(300);\n    digitalWrite(13, LOW);\n    delay(300);\n    digitalWrite(13, HIGH);\n    delay(800);\n    digitalWrite(13, LOW);\n    delay(500);\n}",
          "human": "When power turns ON (Do ONCE):\n    Tell Pin 13 to act like a Megaphone (Push power OUT);\n\nREPEAT FOREVER (Your Custom Sequence):\n    1. Turn Pin 13 ON;\n    2. Freeze for [300] ms;\n    3. Turn Pin 13 OFF;\n    4. Freeze for [300] ms;\n    5. Turn Pin 13 ON;\n    6. Freeze for [800] ms (Long pulse);\n    7. Turn Pin 13 OFF;\n    8. Freeze for [500] ms;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "servo",
    "name": "SG90 Micro Servo Lab",
    "title": "Level 1 • SG90 Micro Servo Motor Lab",
    "grade": "6-8",
    "category": "actuators",
    "badge": "Grades 6–8",
    "iconName": "Cpu",
    "description": "Precision angle control with PWM duty cycles and the Arduino Servo library.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: The Robot Muscle & The Library",
        "subtitle": "Why does an Arduino need a special toolbox to talk to motors?",
        "summary": "Discover why physical motors need #include <Servo.h> and create your named robot motor object with Servo myServo;.",
        "mascotMsg": "Welcome to Robotics! 🦾 Unlike a simple LED that is just ON or OFF, a Servo Motor has brains inside—gears, a DC motor, and a position sensor. To command it, we borrow the official Servo.h toolbox from the Arduino library!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n    // myServo is declared and ready for pin attachment!\n}\nvoid loop() {\n    // Motor awaits our angle commands\n}",
          "human": "1. Borrow the official Servo instruction kit from the library;\n2. Create and name our virtual robotic arm: \"myServo\";\n\nROUTINE 1: When power turns ON (Do ONCE):\n    Prepare myServo motor in memory and check settings;\n\nROUTINE 2: As long as power is plugged in (REPEAT FOREVER):\n    Keep motor ready to hold its target angle;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: The 3 Wires & Attaching Pin 9",
        "subtitle": "Connecting Power, Ground, and PWM Signal to your Arduino",
        "summary": "Discover the 3-pin servo cable (Brown = GND, Red = 5V, Orange = PWM Pin 9) and attach it using myServo.attach(9);.",
        "mascotMsg": "Check out the ribbon cable coming out of the servo! It has THREE colored wires, not two! Each wire has a critical mission: one feeds it electrical food (+5V), one is the ground return (GND), and the third whispers steering angles. Let's wire it to Pin ~9!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n    myServo.attach(9);\n}\nvoid loop() {\n    // Pin 9 is actively transmitting PWM pulses to hold position\n}",
          "human": "1. Borrow the official Servo instruction kit;\n2. Create our robot arm named myServo;\n\nWhen power turns ON (Do ONCE):\n    Attach myServo signal wire to PWM Pin 9;\n\nREPEAT FOREVER:\n    (Pin 9 actively streams holding pulses...)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: The Steering Wheel & Angle Commands",
        "subtitle": "Commanding exact positions from 0° (Left) to 180° (Right)",
        "summary": "Use myServo.write(angle) to aim the servo horn at any angle. Drag the interactive angle slider or click presets to see live rotation!",
        "mascotMsg": "Look at that white plastic arm on top—that's the SERVO HORN! 🎯 In Arduino, we don't say 'spin fast'—we say myServo.write(90); and the motor snaps straight to 90 degrees! Try moving the angle dial below to steer it live!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n    myServo.attach(9);\n}\nvoid loop() {\n    myServo.write(90);\n    delay(1000);\n    myServo.write(180);\n    delay(1000);\n}",
          "human": "1. Borrow the official Servo instruction kit;\n2. Create our robot arm named myServo;\n\nWhen power turns ON (Do ONCE):\n    Attach myServo signal wire to PWM Pin 9;\n\nREPEAT FOREVER (Angle Dance):\n    1. Turn servo arm to [90] degrees (Center);\n    2. Freeze and hold for [1000] milliseconds;\n    3. Turn servo arm to [180] degrees (Right);\n    4. Freeze and hold for [1000] milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: The 180° Sweep Dance & Sandbox",
        "subtitle": "Smooth automated sweeps, radar scanners, and robot grippers!",
        "summary": "Use a smooth for loop to sweep from 0° to 180° and back, or test robotics presets like Radar Scanner, Robot Gripper, and Metronome.",
        "mascotMsg": "You're a master roboticist now! 🚀 Let's make the servo dance smoothly like a radar scanner or windshield wiper using a for loop. Choose from cool robotics presets or invent your own sequence!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo myServo;\nint pos = 0;\n\nvoid setup() {\n    myServo.attach(9);\n}\nvoid loop() {\n    for (pos = 0; pos <= 180; pos += 1) {\n        myServo.write(pos);\n        delay(15);\n    }\n    for (pos = 180; pos >= 0; pos -= 1) {\n        myServo.write(pos);\n        delay(15);\n    }\n}",
          "human": "1. Borrow the official Servo instruction kit;\n2. Create our robot arm named myServo;\n3. Track angle position in a variable called 'pos';\n\nWhen power turns ON (Do ONCE):\n    Attach myServo signal wire to PWM Pin 9;\n\nREPEAT FOREVER (Smooth Sweep):\n    Sweep Forward: 0° to 180° (wait 15ms per degree);\n    Sweep Backward: 180° down to 0° (wait 15ms per degree);"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "button",
    "name": "Tactile Pushbutton Lab",
    "title": "Level 1 • Tactile Pushbutton Lab",
    "grade": "6-8",
    "category": "basics",
    "badge": "Grades 6–8",
    "iconName": "ToggleLeft",
    "description": "Active-LOW digital inputs, internal pull-up resistors, and state debouncing.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Inputs vs. Outputs (Sensors & Actors)",
        "subtitle": "Learn how Arduino uses inputs to observe the world and outputs to take action!",
        "summary": "Computers follow the IPO model: Input -> Processing -> Output. Inputs (pushbuttons, temperature sensors, cameras) collect data from the physical world. Outputs (LEDs, buzzers, motors) make physical changes. Learn to classify components and understand digitalRead().",
        "mascotMsg": "Meet the senses of the robot! 🔘 Inputs are the eyes, ears, and touch sensors. Outputs are the hands, voice, and lights. Can you sort these hardware pieces into Inputs and Outputs?",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(2, INPUT_PULLUP);\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    int buttonState = digitalRead(2);\n    digitalWrite(13, buttonState);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 2 as an INPUT with internal pullup spring;\n    Configure Pin 13 as an OUTPUT light;\n\nREPEAT FOREVER:\n    Check the voltage on Pin 2 (HIGH or LOW);\n    Send reading to Pin 13 LED light;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: Floating Pins & INPUT_PULLUP",
        "subtitle": "Why unpressed wires catch static electricity, and how the internal spring resistor saves the day!",
        "summary": "When a button is not pressed, an open wire is like an antenna—it catches stray electrical noise from the air (a 'Floating Pin')! Learn how Arduino's built-in INPUT_PULLUP resistor connects a gentle internal spring to 5V, keeping the pin stably HIGH until pressed to GND.",
        "mascotMsg": "Watch out for ghost signals! 👻 An open input pin drifts randomly between 0 and 1. By declaring pinMode(2, INPUT_PULLUP), Arduino connects an invisible internal resistor that holds the pin at 5V until you push the button!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(2, INPUT_PULLUP);\n}\nvoid loop() {\n    int state = digitalRead(2);\n    delay(50);\n}",
          "human": "When power turns ON (Do ONCE):\n    Attach internal pullup spring to Pin 2 (Default: HIGH);\n\nREPEAT FOREVER:\n    Read Pin 2: returns HIGH when open, LOW when pressed;\n    Wait 50 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: The Doorbell Logic (if / else)",
        "subtitle": "Press the tactile button to complete the circuit and activate the LED or buzzer!",
        "summary": "Conditional branching (if/else) gives the computer the power to make choices! If the button is pressed (LOW), turn the LED ON. Otherwise (else), keep it OFF. Master the building block of all computer decision-making.",
        "mascotMsg": "Time to make decisions! 🔔 The if/else statement is the fork in the road of code. Press the virtual tactile button and watch the LED light up instantly!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(2, INPUT_PULLUP);\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    int button = digitalRead(2);\n    if (button == LOW) {\n        digitalWrite(13, HIGH);\n    } else {\n        digitalWrite(13, LOW);\n    }\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 2 with internal pullup spring (Button);\n    Configure Pin 13 as output (LED Light);\n\nREPEAT FOREVER:\n    Read the pushbutton on Pin 2;\n    IF button is PRESSED (equals LOW):\n        Turn ON the LED light (5V HIGH);\n    OTHERWISE (Button is released):\n        Turn OFF the LED light (0V LOW);"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: The Smart Light Toggle Switch (State Memory)",
        "subtitle": "Program a state-memory toggle: tap once to turn ON, tap again to turn OFF!",
        "summary": "A momentary button only stays on while your finger is pressing it down. But real smart switches remember their state! Learn how to use a boolean memory variable to toggle between ON and OFF with every tap.",
        "mascotMsg": "Upgrade to smart lighting! 💡 Instead of holding the button down forever, we'll teach Arduino to remember: tap once to turn ON, tap again to turn OFF. Welcome to state memory!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "bool ledState = false;\nvoid setup() {\n    pinMode(2, INPUT_PULLUP);\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    if (digitalRead(2) == LOW) {\n        ledState = !ledState;\n        digitalWrite(13, ledState);\n        delay(250);\n    }\n}",
          "human": "Memory: Create boolean flag ledState = false (starts OFF);\n\nWhen power turns ON (Do ONCE):\n    Configure Pin 2 with internal pullup spring (Button);\n    Configure Pin 13 as output (LED Light);\n\nREPEAT FOREVER:\n    IF button is PRESSED (LOW):\n        Flip ledState to its opposite: ledState = !ledState;\n        Update Pin 13 LED to match ledState;\n        Debounce pause: wait 250ms for finger to release;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "pot",
    "name": "Potentiometer Analog Lab",
    "title": "Level 1 • Rotary Potentiometer Analog Lab",
    "grade": "6-8",
    "category": "sensors",
    "badge": "Grades 6–8",
    "iconName": "Sliders",
    "description": "10-bit analog-to-digital conversion (ADC), mapping 0-1023 numbers, and voltage dividing.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Digital Switch vs. Analog Dial",
        "subtitle": "Discover how Arduino reads a smooth spectrum of 1,024 values instead of just HIGH/LOW!",
        "summary": "Digital signals are strictly ON or OFF (like a light switch). Analog signals represent a continuous smooth range (like a volume knob or water faucet). Learn how Arduino's Analog-to-Digital Converter (ADC) translates voltage into numbers from 0 to 1023.",
        "mascotMsg": "Welcome to Analog Sensing! 🎛️ Digital pins only know 0 or 1, but the physical world has infinite shades in between. Can you sort these real-world objects into Digital and Analog?",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    int val = analogRead(A0);\n    Serial.println(val);\n    delay(50);\n}",
          "human": "When power turns ON (Do ONCE):\n    Open Serial communication at 9600 baud for telemetry;\n\nREPEAT FOREVER:\n    Read the voltage ruler on Analog Pin A0 (0 to 1023);\n    Print sensor reading to computer screen;\n    Pause 50 milliseconds so humans can read it;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: The 3-Pin Potentiometer & Pin A0",
        "subtitle": "Meet the 3-pin rotary potentiometer: 5V power, GND, and the Analog Wiper Pin A0!",
        "summary": "A potentiometer is a resistive track with a sliding contact called a Wiper. As you rotate the knob, the wiper samples voltage from 0.0V (full left GND) up to 5.0V (full right 5V). Learn how to wire all 3 pins and read it with analogRead(A0).",
        "mascotMsg": "Inspect the 3 legs of the potentiometer! 🔌 Legs 1 and 3 connect across 5V and Ground, creating a highway of electricity. Leg 2 (the middle Wiper) moves along the track and sends the sampled voltage to Analog Pin A0!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    int raw = analogRead(A0);\n    float volts = (raw * 5.0) / 1023.0;\n    Serial.println(volts);\n    delay(100);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure computer monitor display (Serial 9600 baud);\n\nREPEAT FOREVER:\n    Sample voltage on Analog Pin A0 (0 to 1023 raw units);\n    Calculate true Voltage = (raw * 5.0) / 1023.0;\n    Print voltage reading to Serial Monitor;\n    Wait 100 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: The map() Function (Number Translator)",
        "subtitle": "Convert 0-1023 sensor numbers into 0-180 degree robotic steering angles!",
        "summary": "Our analog sensor speaks '0 to 1023', but our servo motor only understands '0 to 180 degrees'! Learn how the Arduino map() function acts as an automatic mathematical translator between completely different number ranges.",
        "mascotMsg": "Math superpower unlocked! 🗺️ The map() function translates between two different number languages in a single line of code. Let's convert sensor reading 0–1023 to servo angle 0–180°!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n    myServo.attach(9);\n}\nvoid loop() {\n    int val = analogRead(A0);\n    int angle = map(val, 0, 1023, 0, 180);\n    myServo.write(angle);\n    delay(15);\n}",
          "human": "1. Borrow the official Servo instruction cookbook;\n2. Create our robot arm named myServo;\n\nWhen power turns ON (Do ONCE):\n    Attach myServo signal line to PWM Pin ~9;\n\nREPEAT FOREVER:\n    Read the rotary knob on Pin A0 (0 to 1023);\n    Translate sensor reading (0..1023) to motor angle (0..180°);\n    Command servo horn to rotate to that exact angle;\n    Wait 15ms so the plastic gears can travel smoothly;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: Robotic Steering Studio (Knob-to-Servo Live)",
        "subtitle": "Turn the interactive rotary dial and watch the physical servo motor track your hand live!",
        "summary": "Put everything together in the ultimate physical computing sandbox! Rotate the virtual 10k potentiometer dial with your mouse or finger, and watch the SG90 micro servo horn dynamically mirror your movements with real-time ADC telemetry and 50Hz PWM oscilloscope monitoring.",
        "mascotMsg": "You are in the driver seat! 🚗 Turn the volume knob to steer the robotic servo arm. Test quick presets, observe voltage vs PWM duty cycle on the oscilloscope, and build your own steering control!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Servo.h>\nServo steeringServo;\nvar int potPin = A0;\n\nvoid setup() {\n    steeringServo.attach(9);\n    Serial.begin(9600);\n}\nvoid loop() {\n    int potVal = analogRead(potPin);\n    int angle = map(potVal, 0, 1023, 0, 180);\n    steeringServo.write(angle);\n    delay(15);\n}",
          "human": "1. Include official Servo control library;\n2. Declare servo object named steeringServo;\n3. Constant: Potentiometer connected to Pin A0;\n\nWhen power turns ON (Do ONCE):\n    Attach steeringServo to PWM Pin 9;\n    Start Serial monitor at 9600 baud;\n\nREPEAT FOREVER (Continuous Control Loop):\n    Sample knob voltage (0 to 1023);\n    Map raw reading into steering angle (0 to 180 degrees);\n    Write target angle to steering servo motor;\n    Pause 15ms so servo can physically match position;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "buzzer",
    "name": "Piezo Buzzer & Tone Lab",
    "title": "Level 1 • Piezo Buzzer & Sound Wave Lab",
    "grade": "6-8",
    "category": "actuators",
    "badge": "Grades 6–8",
    "iconName": "Volume2",
    "description": "Sound waves, audio frequencies, pitch synthesis, and tone() melodies.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Sound Waves & Frequency (Hz)",
        "subtitle": "How vibrating a ceramic crystal thousands of times a second creates sound!",
        "summary": "Sound is moving air. A Piezo buzzer contains a flexible ceramic crystal disc. When Arduino sends alternating electrical pulses, the crystal bends back and forth, pushing air molecules to create sound waves! Learn how frequency (Hertz / Hz) controls pitch from deep bass to high squeaks.",
        "mascotMsg": "Get ready to make some noise! 📢 Unlike an LED that makes photons of light, a buzzer makes physical waves in the air. The faster Arduino flips Pin 8 between 5V and 0V, the higher the pitch sounds!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    // Pin 8 will automatically generate square waves!\n}\nvoid loop() {\n    tone(8, 440);\n    delay(1000);\n    noTone(8);\n    delay(1000);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure serial monitor for frequency telemetry;\n\nREPEAT FOREVER:\n    Play Concert A note: tone(8, 440 Hz);\n    Hold sound for 1000 milliseconds (1 full second);\n    Silence the buzzer: noTone(8);\n    Pause in quiet for 1000 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: The Emergency Alarm Siren (Alternating Tones)",
        "subtitle": "Program a high-low dual frequency European emergency vehicle siren!",
        "summary": "Single beeps are easy for human brains to tune out. Emergency vehicles (police, ambulances) alternate between two distinct frequencies (e.g. 600 Hz and 900 Hz) to demand immediate attention. Learn how to sequence alternating frequencies with precision delay timers.",
        "mascotMsg": "Wee-Woo-Wee-Woo! 🚨 Emergency vehicles alternate two frequencies to grab attention instantly. Let's program an authentic two-tone alarm siren using tone() and delay()!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    // Hardware timer initialized\n}\nvoid loop() {\n    tone(8, 650);\n    delay(350);\n    tone(8, 950);\n    delay(350);\n}",
          "human": "When power turns ON (Do ONCE):\n    Buzzer is ready on Pin 8;\n\nREPEAT FOREVER (Siren Cycle):\n    1. Play Low Warning Tone: tone(8, 650 Hz);\n    2. Hold for 350 milliseconds;\n    3. Play High Warning Tone: tone(8, 950 Hz);\n    4. Hold for 350 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: Musical Melodies & Note Arrays",
        "subtitle": "Store frequencies in arrays to play genuine musical songs!",
        "summary": "Instead of writing dozens of repetitive lines of code, real programmers store musical notes inside an Array: a numbered list of values in memory. Discover how a for-loop steps through the array note-by-note to play authentic songs!",
        "mascotMsg": "Time to play music! 🎵 Every musical note has a sacred frequency: Middle C is 262 Hz, D is 294 Hz, E is 330 Hz. We'll store them in a single array and let a loop conduct the orchestra!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "int melody[] = { 262, 294, 330, 349, 392, 440, 494, 523 };\nvoid setup() {\n    for (int i = 0; i < 8; i++) {\n        tone(8, melody[i], 350);\n        delay(400);\n    }\n}\nvoid loop() {\n    // Song plays once at startup\n}",
          "human": "Music Sheet: Define array of 8 frequencies (C-Major Scale);\n\nWhen power turns ON (Do ONCE):\n    FOR each note in our song (from 0 to 7):\n        Play note frequency on Pin 8 for 350 ms;\n        Pause briefly so notes don't blur together;\n\nREPEAT FOREVER:\n    (Song has finished playing)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: The 8-Key Synthesizer Studio",
        "subtitle": "Play real-time musical notes on an interactive electronic piano synthesizer!",
        "summary": "Welcome to the physical computing music studio! Press and hold piano keys with your mouse or keyboard, and watch the virtual piezo buzzer emit genuine Web Audio square waves with live frequency readouts and real-time oscilloscope visualization.",
        "mascotMsg": "Unleash your inner musician! 🎹 Click or hold the piano keys below to play real musical scales. Observe how high frequencies compress the square wave on the oscilloscope!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "var int buzzerPin = 8;\nvoid setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    // Real-time keyboard input listener\n    if (isKeyPressed()) {\n        tone(buzzerPin, getActiveFreq());\n    } else {\n        noTone(buzzerPin);\n    }\n}",
          "human": "Constants: Buzzer connected to Pin 8;\n\nWhen power turns ON (Do ONCE):\n    Initialize Serial monitor at 9600 baud for music telemetry;\n\nREPEAT FOREVER (Interactive Synthesizer):\n    Check which piano key is pressed down;\n    IF a key is held -> Play its note frequency: tone(8, noteFreq);\n    OTHERWISE -> Silence the buzzer: noTone(8);"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "cad",
    "name": "Parametric 3D CAD Lab",
    "title": "Level 1 • 3D Design & Parametric CAD Lab",
    "grade": "6-8",
    "category": "advanced",
    "badge": "Grades 6–8",
    "iconName": "Box",
    "description": "Physical computing enclosure engineering, 3D coordinate geometry, and tolerances.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 45: The 3D World & The Workplane",
        "subtitle": "Navigating 3D Cartesian Coordinates: Width (X), Depth (Y), and Height (Z)",
        "summary": "Step out of flat 2D drawings into 3D isometric space! Learn how Tinkercad creates physical objects on a virtual build plate using millimeter coordinates.",
        "mascotMsg": "Welcome to the 3D Maker Dimension! 🧊 In real life, physical objects don't just have width and height — they have DEPTH. Let's master the 3D coordinate system and build our first solid primitive!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// OpenSCAD / Procedural C++ CAD Modeling\n$fn = 64; // High-resolution polygon facets\n\nmodule createSolidBox(x, y, z) {\n  // Render parametric solid cube at origin\n  cube(size = [x, y, z], center = true);\n}\ncreateSolidBox(20.0, 20.0, 20.0);",
          "human": "STEP 1: Define metric build environment in millimeters:\nSet grid resolution to 1.0mm snap increments\nSTEP 2: Spawn a Solid Geometric Cube on the Workplane:\nSet Width (X) = 20.0 mm (left-to-right)\nSet Depth (Y) = 20.0 mm (front-to-back)\nSet Height (Z) = 20.0 mm (vertical elevation)\nSTEP 3: Calculate resulting solid volume:\nVolume = 20 * 20 * 20 = 8,000 cubic millimeters (mm³)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 46: The Magic of Holes & CSG Booleans",
        "subtitle": "Constructive Solid Geometry: Sculpting Real-World Parts with Negative Space",
        "summary": "Discover how every complex mechanical component is born! By combining solid shapes with negative 'hole' shapes and grouping them, we carve holes, slots, and grooves.",
        "mascotMsg": "Here is the coolest superpower in 3D design: a 'Hole' is a shape made of virtual anti-matter! When you group a solid shape with a hole shape, the hole bites away its exact volume like a cookie cutter! 🍪✨",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// CSG Boolean Difference in Procedural CAD\ndifference() {\n  // Positive Solid: Base Box (20x20x20mm)\n  cube([20, 20, 20], center = true);\n\n  // Negative Cutter: Through-Hole Cylinder\n  cylinder(r = 5.0, h = 32.0, center = true, $fn = 64);\n}",
          "human": "STEP 1: Create Solid Base Object (Shape A):\nSpawn Solid Box: Width = 20mm, Depth = 20mm, Height = 20mm\nSTEP 2: Create Negative Cutting Tool (Shape B):\nSpawn Hole Cylinder: Diameter = 10mm, Height = 30mm\nPass cylinder through the center of the solid box\nSTEP 3: Execute CSG Boolean Difference (Group):\nResult = Solid Box MINUS Hole Cylinder = Bearing Block with Through-Hole!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 47: Precision Alignment & Ruler Tools",
        "subtitle": "Eliminate Eyeball Guesswork with Center, Edge, and Concentric Alignment",
        "summary": "Learn why professional engineers never 'eyeball' parts. Use Tinkercad's Alignment handles and Ruler guides to align screw holes to the exact micrometer center.",
        "mascotMsg": "If a robot screw hole is off by even 1 millimeter, your motor screws won't fit through the chassis! Let's lock our shapes together with precision centerline alignment! 📐🎯",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Parametric Alignment Matrix in C++ CAD\nstruct Vec3D { float x, y, z; };\n\nVec3D alignToCenter(var Vec3D& parent, var Vec3D& child) {\n  // Calculate exact delta offset for concentric alignment\n  return { (parent.x - child.x)/2.0f, (parent.y - child.y)/2.0f, 0.0f };\n}\n// Offset = {0.0mm, 0.0mm} -> Perfectly Concentric!",
          "human": "STEP 1: Select multiple objects on the workplane:\nSelect Solid Box + Hole Cylinder together\nSTEP 2: Engage Precision Alignment tool (Shortcut: 'L'):\nClick Center Pin along X axis (Width Centerline)\nClick Center Pin along Y axis (Depth Centerline)\nKeep Z axis through-hole elevation centered\nSTEP 3: Verify Zero-Offset Concentricity:\nBoth objects now share exact midpoint (X=0.0mm, Y=0.0mm)!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 48: Robot Bracket Engineering: Tolerances & Wall Thickness",
        "subtitle": "Real-World Digital Fabrication: Minimum 2mm Walls, Screw Clearances & STL Export",
        "summary": "Design an actual 3D-printable mounting bracket for your SG90 Micro Servo from Lab 2! Factor in plastic thermal shrinkage (+0.3mm tolerance) and export for the 3D printer.",
        "mascotMsg": "Awesome job, Maker! Now let's combine physical computing with digital fabrication by engineering a custom bracket for our SG90 servo motor! Let's make sure it's strong and fits like a glove! 🦾🛠️",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Parametric SG90 Servo Bracket in C++ CAD\nvar float TOLERANCE = 0.4; // 3D print thermal compensation\nvar float WALL_THICKNESS = 2.5; // Structural rigidity\n\nmodule sg90Bracket() {\n  difference() {\n    // Solid Outer Bracket Housing\n    cube([22.8 + 2*WALL_THICKNESS, 12.0 + 2*WALL_THICKNESS, 20]);\n    // Motor Pocket with Tolerance\n    translate([WALL_THICKNESS, WALL_THICKNESS, 0])\n      cube([22.8 + TOLERANCE, 12.0 + TOLERANCE, 25]);\n  }\n}",
          "human": "STEP 1: Define SG90 Servo Pocket Specifications:\nMotor Body: 22.8mm Width x 12.0mm Depth x 22.5mm Height\nAdd +0.4mm 3D Printing Tolerance: 23.2mm x 12.4mm pocket\nSTEP 2: Define Structural Wall Thickness (Minimum 2.5mm):\nOuter Bracket Shell: 28.2mm Width x 17.4mm Depth\nSTEP 3: Bore Dual M3 Chassis Mounting Flange Holes:\n2x Cylinders at Ø3.4mm spaced 28.0mm center-to-center\nSTEP 4: Export Watertight STL Mesh for 3D Slicer!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "dmm",
    "name": "Digital Multimeter Lab",
    "title": "Level 1 • DMM Circuit Troubleshooting Lab",
    "grade": "6-8",
    "category": "basics",
    "badge": "Grades 6–8",
    "iconName": "Activity",
    "description": "Voltage drops, current loops, continuity testing, and short-circuit troubleshooting.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 49: DC Voltage Drop & The Water Pressure Metaphor",
        "subtitle": "Measuring Electrical Potential Across Circuit Loads with Red (+) and Black (-) Probes",
        "summary": "Discover why electricity flows! Use the digital multimeter in DC Volts mode (DCV) to measure electrical pressure differences between battery terminals, resistors, and LEDs.",
        "mascotMsg": "Meet your most trusted diagnostic tool: the Digital Multimeter! ⚡ Think of voltage as water pressure in a pipe. Let's touch our probes to different nodes and see how pressure drops across every load!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Measuring Voltage with Arduino ADC (Pin A0)\nvoid setup() {\n  Serial.begin(9600); // Telemetry stream\n}\n\nvoid loop() {\n  int raw = analogRead(A0);\n  float voltage = raw * (5.0 / 1023.0); // Convert ADC to Volts\n  Serial.print(\"Measured Potential: \"); Serial.println(voltage);\n  delay(500);\n}",
          "human": "STEP 1: Configure Digital Multimeter for DC Voltage measurement:\nTurn rotary dial to 'DCV 20V' range (suitable for 0V to 5V systems)\nPlug Black probe into COM jack, Red probe into V/Ω jack\nSTEP 2: Measure Circuit Supply Potential:\nProbe between Node 1 (+5V Rail) and Node 5 (GND) -> Readout = 5.00V\nSTEP 3: Measure LED Forward Voltage Drop:\nProbe between Node 3 (LED Anode) and Node 4 (LED Cathode) -> Readout = 2.05V\nKirchhoff's Law: 5.00V Supply = 2.95V (Resistor) + 2.05V (LED)!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 50: Resistance, Ohm's Law & 4-Band Color Codes",
        "subtitle": "De-coding Resistor Bands (Red-Red-Brown = 220Ω) and Measuring Ohms without Power",
        "summary": "Learn how resistors restrict electron traffic to protect fragile components. Read standard EIA 4-band color rings and verify values using the DMM Ohmmeter range (Ω).",
        "mascotMsg": "Those tiny colored rings on resistors aren't for decoration — they're a secret color code invented by engineers! Let's decode them and verify the exact resistance in Ohms! 🎨🔍",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Ohm's Law in Software: I = V / R\nvar float V_SUPPLY = 5.0; // 5V USB Rail\nvar float V_LED = 2.05;   // Red LED forward voltage\nvar float R_OHMS = 220.0; // Resistor resistance\n\nfloat calculateCurrentAmps() {\n  float vDrop = V_SUPPLY - V_LED; // 2.95V across resistor\n  return (vDrop / R_OHMS);        // 0.0134 Amps (13.4 mA)\n}",
          "human": "STEP 1: IMPORTANT SAFETY RULE FOR OHMMETERS:\nALWAYS disconnect circuit power before measuring resistance in Ohms!\nSTEP 2: Read EIA 4-Band Color Code for 220Ω Resistor:\nBand 1: RED = 2 | Band 2: RED = 2 | Band 3: BROWN = x10 | Band 4: GOLD = ±5%\nCalculated Value: 22 x 10 = 220 Ohms (Acceptable: 209Ω to 231Ω)\nSTEP 3: Verify with DMM Probes across Resistor leads:\nMultimeter LCD Readout = 220.4 Ω (PASS - Within 5% Tolerance!)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 51: The Continuity Buzzer: Sniffing Short Circuits",
        "subtitle": "The Beeping Superhero: Finding Hidden Breaks, Cold Solders, and Accidental Bridges",
        "summary": "Why look at the screen when your multimeter can sing? In continuity mode (🔊), the meter beeps loudly if two points have zero resistance (< 50Ω), proving a continuous unbroken path.",
        "mascotMsg": "BEEEEEP! 📢 That high-pitched sound is music to an engineer's ears. It means electrons have a smooth, unbroken copper bridge. If it stays silent, you've found a broken wire!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Continuity Verification in Hardware Test Script\nbool checkBusContinuity(int pinInput) {\n  pinMode(pinInput, INPUT_PULLUP); // Weak internal pullup\n  // If jumper connects pin to GND, read will drop to LOW (0V)\n  if (digitalRead(pinInput) == LOW) {\n    tone(8, 2400, 150); // Sound 2.4kHz Continuity BEEP!\n    return true; // Continuous conductive path confirmed\n  }\n  return false; // Open circuit detected!\n}",
          "human": "STEP 1: Select Continuity / Diode Test Mode:\nTurn rotary dial to '🔊 CONT' buzzer symbol\nTouch Red and Black probe tips together -> BEEP! (0.1Ω - Verified meter works)\nSTEP 2: Test Breadboard Ground Track Continuity:\nProbe between Arduino GND pin and Breadboard Blue Rail -> BEEP! (Unbroken path)\nSTEP 3: Test for Dangerous Power-to-Ground Shorts:\nProbe between +5V Red Rail and GND Blue Rail -> SILENT / O.L (PASS - No short circuit!)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 52: The Circuit Doctor: Troubleshooting Diagnostics",
        "subtitle": "Systematic Troubleshooting: Diagnosing Reversed LEDs, Blown Resistors & Power Shorts",
        "summary": "Become a certified Circuit Doctor! When a project fails to power on, don't guess: use a systematic multimeter checklist (Power, Ground, Drop, Continuity) to locate the exact fault.",
        "mascotMsg": "Doctor Sparky to the emergency room! 🩺 This robot circuit isn't turning on. Grab your DMM probes, test the suspect nodes, diagnose the illness, and revive the circuit!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Automated Self-Test Diagnostic Routine\nenum DiagnosticResult { OK, NO_POWER, BLOWN_RESISTOR, REVERSED_LED, SHORT_CIRCUIT };\n\nDiagnosticResult runBoardDiagnostics() {\n  float vSupply = analogRead(A0) * (5.0 / 1023.0);\n  float vLed = analogRead(A1) * (5.0 / 1023.0);\n  if (vSupply < 4.5) return NO_POWER;\n  if (vLed < 0.2)    return BLOWN_RESISTOR;\n  if (vLed > 4.7)    return REVERSED_LED;\n  return OK; // Healthy LED forward drop detected (1.8V - 2.2V)\n}",
          "human": "THE 4-STEP CIRCUIT DOCTOR DIAGNOSTIC CHECKLIST:\nSTEP 1: Verify Main Power Rail Potential (+5V to GND) -> Must read 4.9V to 5.1V\nSTEP 2: Check Resistor Input (Node 2) -> Must match 5.0V supply rail\nSTEP 3: Check Resistor Output / LED Anode (Node 3):\nIf Node 3 reads 5.0V (no drop) -> LED is open or backwards!\nIf Node 3 reads 0.0V -> Resistor is blown open or Node 3 shorted to ground!\nIf Node 3 reads 2.05V -> Circuit healthy, LED forward bias confirmed!\nDIAGNOSIS COMPLETE: Fault isolated and circuit restored to 100% operation!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "ldr",
    "name": "Photoresistor Light Lab",
    "title": "Level 2 • Photoresistor Light Sensor Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "Sun",
    "description": "Light-dependent resistance (LDR), dark-activated nightlights, and threshold triggers.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Photons & Photoresistance (Lux)",
        "subtitle": "How sunlight knocks electrons loose to let electrical current flow!",
        "summary": "An LDR (Light Dependent Resistor / Photoresistor) is made of a special semiconductor material (Cadmium Sulfide). In total darkness, its electrons are locked in place, offering massive electrical resistance (up to 100,000 Ohms!). When sunlight shines on it, incoming photons knock electrons free, creating conductive paths that drop its resistance to just 500 Ohms!",
        "mascotMsg": "Meet the eyes of your Arduino! ☀️ Unlike a human eye that has retinas, an Arduino uses an LDR to feel how bright or dark a room is. The more photons hit the squiggly ceramic face, the lower its electrical resistance drops!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    int lightVal = analogRead(A1);\n    Serial.println(lightVal);\n    delay(200);\n}",
          "human": "When power turns ON (Do ONCE):\n    Open computer monitor at 9600 baud for light readings;\n\nREPEAT FOREVER:\n    Read ambient light voltage from Pin A1 (0 to 1023);\n    Print light reading to computer screen;\n    Wait 200 milliseconds before reading again;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: The Voltage Divider Circuit (LDR + 10kΩ)",
        "subtitle": "Turning variable resistance into measurable 0–5V analog voltage!",
        "summary": "Arduino's analog pins only understand voltage (0V to 5V), not raw resistance. If you connected an LDR directly between 5V and Pin A1, Pin A1 would always see 5V! By pairing the LDR with a fixed 10,000 Ohm (10kΩ) partner resistor to GND, the two form a tug-of-war voltage divider. When light changes, the balance point between them shifts, creating a changing voltage that Arduino can read!",
        "mascotMsg": "Think of a voltage divider as an electrical tug-of-war! 🪢 5V pulls up, GND pulls down. When sunlight makes the LDR super conductive, 5V wins and Pin A1 reads high. When darkness sets in, the 10k resistor pulls Pin A1 down to GND!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    int raw = analogRead(A1);\n    float volts = (raw * 5.0) / 1023.0;\n    Serial.println(volts);\n    delay(100);\n}",
          "human": "When power turns ON (Do ONCE):\n    Start computer serial monitor;\n\nREPEAT FOREVER:\n    Read analog voltage divider value from Pin A1;\n    Calculate real voltage: volts = (sensorVal * 5.0) / 1023.0;\n    Print voltage to screen;\n    Wait 100 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: The Dark Detector Threshold (if/else)",
        "subtitle": "Setting an intelligent tripwire number for automatic nightfall detection!",
        "summary": "Now that Arduino reads ambient light as a number from 0 to 1023, we can program it to make intelligent decisions! A threshold is a boundary line. If the reading drops below our threshold (e.g. 400), night has fallen, so turn ON the streetlight LED. If the reading rises above 400, sunrise has arrived, so turn the light OFF to save electricity!",
        "mascotMsg": "You're writing the exact brain logic used in municipal city streetlights! 🏙️ Cities save millions of dollars by using automated LDR threshold circuits instead of human workers driving around flipping switches at dusk.",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    int light = analogRead(A1);\n    if (light < 400) {\n        digitalWrite(13, HIGH);\n    } else {\n        digitalWrite(13, LOW);\n    }\n    delay(100);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 13 as LED Streetlight output;\n\nREPEAT FOREVER:\n    Read current ambient light from Pin A1;\n    IF light level is LESS THAN 400 (Dusk):\n        Turn streetlight ON: digitalWrite(13, HIGH);\n    OTHERWISE (Daylight):\n        Turn streetlight OFF: digitalWrite(13, LOW);\n    Check again in 100 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: Smart City Streetlight Studio (Day/Night Arc)",
        "subtitle": "Interactive day/night environmental simulator with dynamic sky lighting!",
        "summary": "Take the driver's seat of an entire smart city! Drag the celestial Sun/Moon dial through a complete 24-hour day/night cycle: watch dawn break, noon blaze, dusk settle, and midnight fall. Observe the exact analog voltage curve, threshold triggering, and the automated streetlamp lighting up the road when dusk arrives!",
        "mascotMsg": "You have created an autonomous green energy system! 🌆 Modern smart cities use millions of these IoT sensors to reduce municipal energy consumption by over 40%.",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    int lux = analogRead(A1);\n    if (lux < threshold) {\n        digitalWrite(13, HIGH);\n    } else {\n        digitalWrite(13, LOW);\n    }\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 13 as LED Streetlight output;\n\nREPEAT FOREVER (Autonomous Monitoring):\n    int ambientLux = analogRead(A1);\n    IF ambientLux < threshold: Light ON;\n    ELSE: Light OFF (Save Solar Battery);"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "rgb",
    "name": "RGB Color Mixing Lab",
    "title": "Level 2 • Multi-Channel RGB LED Lab",
    "grade": "9-10",
    "category": "actuators",
    "badge": "Grades 9–10",
    "iconName": "Palette",
    "description": "3-channel 8-bit PWM color mixing (16 million colors), duty cycles, and analogWrite().",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Additive Light Synthesis (Red, Green, Blue)",
        "subtitle": "Three sub-pixel LEDs inside one frosted dome: Red, Green, and Blue!",
        "summary": "Welcome to the physics of light! Unlike paint where mixing colors absorbs wavelengths to produce murky brown (subtractive mixing), light beams add their photons together (additive mixing). Inside a single 4-pin RGB LED live three microscopic semiconductor crystals sharing one common Ground. When you turn on Red + Green, you get brilliant Yellow! Red + Blue creates vivid Magenta! All three create crisp White light!",
        "mascotMsg": "Look at your smartphone or monitor screen with a magnifying glass: every single pixel is made of microscopic Red, Green, and Blue sub-pixels just like this RGB LED! 🔬✨",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(9, OUTPUT);  // Red Channel\n    pinMode(10, OUTPUT); // Green Channel\n    pinMode(11, OUTPUT); // Blue Channel\n}\nvoid loop() {\n    digitalWrite(9, HIGH); // Red ON\n    digitalWrite(10, HIGH);// Green ON (Red+Green = Yellow!)\n    digitalWrite(11, LOW); // Blue OFF\n    delay(1000);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 9 as Red LED channel;\n    Configure Pin 10 as Green LED channel;\n    Configure Pin 11 as Blue LED channel;\n\nREPEAT FOREVER (Pure Yellow Light):\n    Turn Red channel ON (+5V);\n    Turn Green channel ON (+5V);\n    Keep Blue channel OFF (0V);\n    Wait 1000 milliseconds (Enjoy Yellow!);"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: 8-Bit PWM Fading & analogWrite()",
        "subtitle": "From digital ON/OFF to 256 silky-smooth brightness levels!",
        "summary": "Pure digital ON and OFF only gives you 8 basic colors (2³). But what if you want a soft pastel pink, neon orange, or deep ocean cyan? Enter PWM (Pulse Width Modulation) and the analogWrite() function! By turning a pin ON and OFF hundreds of times per second with varying pulse widths, the Arduino tricks your eye into seeing any brightness level from 0 (completely dark) to 255 (maximum blast)!",
        "mascotMsg": "The squiggly tilde (~) next to Pins 9, 10, and 11 means they are connected to internal silicon timers that flick the electrical switch 490 times per second without slowing down your code! ⚡",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(9, OUTPUT);\n}\nvoid loop() {\n    for (int b = 0; b <= 255; b++) {\n        analogWrite(9, b); // 0 to 255 (0% to 100% duty cycle)\n        delay(10);\n    }\n    for (int b = 255; b >= 0; b--) {\n        analogWrite(9, b);\n        delay(10);\n    }\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 9 as Red LED channel;\n\nREPEAT FOREVER (Fading Red from 0 to 255):\n    FOR brightness from 0 up to 255:\n        Set Red Pin 9 PWM intensity to brightness;\n        Wait 10 milliseconds;\n    FOR brightness from 255 down to 0:\n        Set Red Pin 9 PWM intensity to brightness;\n        Wait 10 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: Secondary & Tertiary Color Mixing (16.7M Colors)",
        "subtitle": "Mixing 256 Red × 256 Green × 256 Blue = 16,777,216 distinct hues!",
        "summary": "When each of the three color channels can be tuned across 256 distinct levels, the mathematical combination yields 256 × 256 × 256 = 16,777,216 possible colors! In this lesson, learn how to craft rich custom hues like Cyberpunk Neon Purple (R:180, G:0, B:255), Sunset Tangerine (R:255, G:90, B:10), Electric Mint (R:0, G:255, B:160), and Cozy Warm White. Watch the C++ code generator write the exact triplet of analogWrite() calls!",
        "mascotMsg": "Every hex color code you see on websites (like #FF5733) is just the hexadecimal notation of these exact three numbers (FF = 255 Red, 57 = 87 Green, 33 = 51 Blue)! 🎨",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setRGB(int r, int g, int b) {\n    analogWrite(9, r);  // Red Pin ~9\n    analogWrite(10, g); // Green Pin ~10\n    analogWrite(11, b); // Blue Pin ~11\n}\nvoid loop() {\n    setRGB(180, 0, 255); // Neon Purple\n    delay(2000);\n}",
          "human": "FUNCTION: SetRGBColor(redValue, greenValue, blueValue):\n    Send redValue (0-255) to Pin 9 PWM;\n    Send greenValue (0-255) to Pin 10 PWM;\n    Send blueValue (0-255) to Pin 11 PWM;\n\nREPEAT FOREVER (Cyberpunk Neon Purple):\n    SetRGBColor(180, 0, 255); // Intense Purple\n    Wait 2000 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: Rainbow Mood Lamp & Color Studio",
        "subtitle": "Interactive RGB Color Studio with full-spectrum wheel and auto-rainbow loop!",
        "summary": "Welcome to the ultimate RGB Lighting Studio! Use the 360° Rainbow Hue dial to cycle through the entire optical spectrum, fine-tune individual Red, Green, and Blue PWM faders, or activate the autonomous 'Rainbow Cycle' mode to watch the virtual lamp smoothly cross-fade like a commercial smart-home mood lamp!",
        "mascotMsg": "You have mastered multi-channel PWM control! 🌈 Commercial smart bulbs like Philips Hue and gaming keyboards use this exact algorithm to create ambient room lighting.",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(9, OUTPUT); pinMode(10, OUTPUT); pinMode(11, OUTPUT);\n}\nvoid loop() {\n    // Autonomous 3-Phase Rainbow Cycle\n    for (int i = 0; i < 255; i++) { analogWrite(9, 255-i); analogWrite(10, i); delay(10); }\n    for (int i = 0; i < 255; i++) { analogWrite(10, 255-i); analogWrite(11, i); delay(10); }\n    for (int i = 0; i < 255; i++) { analogWrite(11, 255-i); analogWrite(9, i); delay(10); }\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pins 9, 10, 11 as PWM outputs;\n\nREPEAT FOREVER (Infinite Rainbow Crossfade):\n    Phase 1: Fade from Red to Green;\n    Phase 2: Fade from Green to Blue;\n    Phase 3: Fade from Blue back to Red;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "temp",
    "name": "TMP36 Temperature Lab",
    "title": "Level 2 • TMP36 Analog Temperature Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "Thermometer",
    "description": "Analog thermal transducers, millivolt-to-Celsius transfer functions, and HVAC loops.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 1: Thermoelectric Physics & Silicon Junctions",
        "subtitle": "How microscopic silicon diodes measure heat without dangerous mercury!",
        "summary": "How does a microchip sense temperature? Inside the tiny black TO-92 capsule of the TMP36 sensor, silicon P-N junctions change their electrical conductivity in direct proportion to thermal energy. The sensor produces an output voltage that scales linearly by exactly 10 millivolts per degree Celsius (10mV/°C). At freezing point (0°C), it outputs exactly 500mV (0.50V), allowing it to measure negative temperatures down to -40°C without needing negative power supplies!",
        "mascotMsg": "Old thermometers used toxic liquid mercury. Your Arduino uses solid-state silicon physics to measure atomic thermal vibrations directly! 🌡️⚡",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    Serial.begin(9600);\n}\nvoid loop() {\n    int rawADC = analogRead(A2); // Read Pin A2\n    Serial.println(rawADC);\n    delay(1000);\n}",
          "human": "When power turns ON (Do ONCE):\n    Open Serial computer monitor at 9600 baud;\n\nREPEAT FOREVER (Continuous Thermal Sampling):\n    Read raw electrical voltage from Pin A2;\n    Print raw sensor reading to computer screen;\n    Wait 1000 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 2: The Millivolt-to-Celsius Formula",
        "subtitle": "The double mathematical bridge: ADC to Volts, and Volts to Degrees Celsius!",
        "summary": "To convert raw ADC numbers into genuine Celsius degrees, we build a 2-step mathematical bridge in C++: First, convert the 10-bit integer (0..1023) into actual volts: float voltage = (raw * 5.0) / 1024.0;. Second, subtract the 0.5V offset and scale by 100 to get degrees: float tempC = (voltage - 0.5) * 100.0;. Now your Arduino reads temperature with tenth-of-a-degree precision!",
        "mascotMsg": "Look at the formula: (voltage - 0.5) * 100. If voltage is 0.75V, (0.75 - 0.5) = 0.25V. Multiplying by 100 gives exactly 25.0°C room temperature! Math in action! 🧮",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void loop() {\n    int raw = analogRead(A2);\n    float volts = (raw * 5.0) / 1024.0;\n    float tempC = (volts - 0.5) * 100.0;\n    Serial.print(\"Temp: \"); Serial.print(tempC); Serial.println(\" C\");\n    delay(500);\n}",
          "human": "REPEAT FOREVER (Celsius Conversion Math):\n    Read raw integer from Analog Pin A2 (0-1023);\n    Convert raw integer into Volts: (raw * 5.0) / 1024.0;\n    Convert Volts to Celsius: (volts - 0.5) * 100.0;\n    Print Celsius temperature to computer monitor;\n    Wait 500 milliseconds;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 3: Critical Overheat Alarms & Safety Cutoffs",
        "subtitle": "Protecting computer servers and greenhouses with automatic threshold alerts!",
        "summary": "Overheating destroys lithium batteries, computer CPUs, and greenhouse crops. In this lesson, program a smart safety warden using conditional logic (if / else). When the temperature exceeds a safety limit (e.g. 30.0°C), the Arduino sounds a buzzer siren and illuminates a flashing red warning beacon on Pin 13 to alert technicians immediately!",
        "mascotMsg": "Data centers running AI supercomputers use temperature alarms just like this to protect billions of dollars of silicon processors from thermal meltdown! 🚨💻",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(13, OUTPUT);\n}\nvoid loop() {\n    float tempC = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;\n    if (tempC > 30.0) {\n        digitalWrite(13, HIGH); tone(8, 880); // Overheat Alarm!\n    } else {\n        digitalWrite(13, LOW);  noTone(8);    // Normal Safe Range\n    }\n    delay(100);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 13 as Warning LED output;\n\nREPEAT FOREVER (Safety Monitoring):\n    Calculate current temperature in Celsius;\n    IF tempC > 30.0 degrees Celsius (OVERHEAT!):\n        Turn warning LED ON and sound alarm tone;\n    ELSE (Safe Temperature):\n        Turn warning LED OFF and silence alarm;"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 4: Smart Greenhouse / HVAC Climate Studio",
        "subtitle": "Interactive temperature environment with automated DC exhaust cooling fan!",
        "summary": "Welcome to the Smart Climate Studio! Take command of an automated greenhouse HVAC system. Drag the environmental thermometer from frosty freezing temperatures (-10°C) to scorching desert heat (+50°C). Watch the smart cooling fan spin into action with dynamic rotational physics when temperatures rise, regulating the climate automatically!",
        "mascotMsg": "You have built an intelligent thermostat! 🌬️ This is the exact feedback control principle used in modern smart homes (like Google Nest) and industrial greenhouses.",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void setup() {\n    pinMode(6, OUTPUT); // PWM Cooling Fan Pin ~6\n}\nvoid loop() {\n    float temp = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;\n    if (temp > 28.0) {\n        int fanPWM = map(temp, 28, 45, 120, 255);\n        analogWrite(6, constrain(fanPWM, 0, 255)); // Cool Down!\n    } else {\n        analogWrite(6, 0); // Temperature Normal (Conserve Energy)\n    }\n    delay(100);\n}",
          "human": "When power turns ON (Do ONCE):\n    Configure Pin 6 as PWM Cooling Fan Motor;\n\nREPEAT FOREVER (Autonomous Greenhouse HVAC):\n    float tempC = readTemperatureCelsius(A2);\n    IF tempC > 28.0 (Warm Greenhouse):\n        int fanSpeed = map(tempC, 28, 45, 100, 255);\n        analogWrite(6, fanSpeed); // Spin Exhaust Fan\n    ELSE: analogWrite(6, 0); // Ideal Temp: Fan Resting"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "sonar",
    "name": "Ultrasonic Distance Lab",
    "title": "Level 2 • HC-SR04 Ultrasonic Sonar Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "Radar",
    "description": "Echolocation physics, speed of sound (343 m/s), pulseIn() timing, and obstacle detection.",
    "lessons": [
      {
        "id": 1,
        "title": "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",
        "subtitle": "Zero-jargon physical principle of ultrasound echolocation and dual transducer cans",
        "summary": "",
        "mascotMsg": "Just like bats navigate dark caves without eyes, your Arduino uses 40,000Hz ultrasound waves to 'see' obstacles ahead! 🦇🔊",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define TRIG_PIN 12\n#define ECHO_PIN 11\n\nvoid setup() {\n  // Start serial communications at 9600 baud\n  Serial.begin(9600);\n  \n  // Set Trigger as OUTPUT (we shoot sound)\n  pinMode(TRIG_PIN, OUTPUT);\n  // Set Echo as INPUT (we listen for sound)\n  pinMode(ECHO_PIN, INPUT);\n  \n  // Keep trigger quiet to start\n  digitalWrite(TRIG_PIN, LOW);\n  Serial.println(\"Ultrasonic Radar Initialized!\");\n}\n\nvoid loop() {\n  // Lesson 33 focuses on pin configuration and test ping\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  \n  // Fire a clean 10-microsecond ultrasound trigger pulse\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  \n  Serial.println(\"Sonic ping fired!\");\n  delay(1000);\n}",
          "human": "Pins 12 and 11 act as our acoustic radar station: Pin 12 sends the trigger sound burst, Pin 11 listens for the reflected echo pulse.\nTrigger is configured as an OUTPUT because the Arduino controls when to fire sound waves; Echo is an INPUT because the sensor signals Arduino when sound arrives.\nHC-SR04 requires an exact 10-microsecond HIGH pulse on the trigger pin. This triggers its onboard microchip to blast 8 cycles of 40 kHz ultrasound into the air."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Catching the Echo Wave: pulseIn() and Microsecond Clocks",
        "subtitle": "How Arduino measures the flight time of returning acoustic waves",
        "summary": "",
        "mascotMsg": "The pulseIn() command measures time down to a single microsecond (one millionth of a second)! That is faster than the blink of an eye! ⏱️⚡",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define TRIG_PIN 12\n#define ECHO_PIN 11\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n}\n\nvoid loop() {\n  // 1. Clear trigger pin\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  \n  // 2. Fire 10us trigger pulse\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  \n  // 3. Read the echo flight time in microseconds\n  // pulseIn waits for pin to go HIGH, starts timing, then stops when LOW\n  long durationUs = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout (~5m)\n  \n  Serial.print(\"Sound Round-Trip Duration: \");\n  Serial.print(durationUs);\n  Serial.println(\" microseconds (µs)\");\n  \n  delay(200);\n}",
          "human": "`pulseIn()` pauses execution, waits for ECHO_PIN to rise HIGH, counts microseconds with internal hardware timers, and returns when it drops back to LOW. The 30,000µs (30ms) timeout prevents code from freezing if no echo returns.\nMicroseconds (µs) are one-millionth of a second! While standard `delay()` takes milliseconds (10^-3 s), sound moves 34 centimeters in a single millisecond, so we need microsecond (10^-6 s) precision!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "The Math of Echoes: Dividing by 58.2 to Calculate Distance",
        "subtitle": "Converting acoustic flight time into centimeters and inches",
        "summary": "",
        "mascotMsg": "Why divide by 58.2? Because sound travels 1 centimeter in 29.1 microseconds. Round trip is 2 × 29.1 = 58.2! Applied acoustics in code! 📏🎯",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define TRIG_PIN 12\n#define ECHO_PIN 11\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n}\n\nvoid loop() {\n  // Fire 10us trigger pulse\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  \n  // Measure round-trip time in microseconds\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  \n  // Convert duration to distance in centimeters\n  // Formula: Distance (cm) = Duration (us) * 0.0343 / 2\n  // Or: Distance (cm) = Duration (us) / 58.2\n  float distanceCm = duration * 0.0343 / 2.0;\n  float distanceIn = distanceCm / 2.54; // Convert to inches\n  \n  Serial.print(\"Distance: \");\n  Serial.print(distanceCm, 1);\n  Serial.print(\" cm  |  \");\n  Serial.print(distanceIn, 1);\n  Serial.println(\" inches\");\n  \n  delay(300);\n}",
          "human": "Sound travels through air at 343 meters per second, which equals 0.0343 centimeters per microsecond. We multiply flight duration by 0.0343, then divide by 2 because sound traveled there and back!\nConverts metric centimeters to standard inches using the international conversion factor of 2.54 cm per inch."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Automotive Reverse Assistant: Multi-Zone Parking Radar",
        "subtitle": "Build a smart car parking radar with distance-dependent beeps and warning LEDs",
        "summary": "",
        "mascotMsg": "You have engineered an automotive reverse-parking radar! 🚗 Beep... beep... beep-beep-beep-BEEEEEP! Safety engineering at work!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define TRIG_PIN 12\n#define ECHO_PIN 11\n#define BUZZER_PIN 8\n#define LED_PIN 13\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT);\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  // 1. Measure distance in cm\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  \n  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distance = duration * 0.0343 / 2.0;\n  \n  // 2. Multi-Zone Alert Logic\n  if (distance > 50.0 || distance <= 0.0) {\n    // Green Zone: Safe (>50 cm) - Silent, LED off\n    noTone(BUZZER_PIN);\n    digitalWrite(LED_PIN, LOW);\n  } else if (distance > 20.0) {\n    // Yellow Zone: Caution (20-50 cm) - Medium beeps\n    tone(BUZZER_PIN, 1500, 50);\n    digitalWrite(LED_PIN, HIGH);\n    int pauseTime = map(distance, 20, 50, 100, 500);\n    delay(pauseTime);\n    digitalWrite(LED_PIN, LOW);\n  } else if (distance > 8.0) {\n    // Red Zone: Critical Hazard (8-20 cm) - Rapid urgent beeps\n    tone(BUZZER_PIN, 2400, 30);\n    digitalWrite(LED_PIN, HIGH);\n    delay(70);\n    digitalWrite(LED_PIN, LOW);\n    delay(70);\n  } else {\n    // Danger Stop Zone (<8 cm) - Continuous solid alarm\n    tone(BUZZER_PIN, 3000);\n    digitalWrite(LED_PIN, HIGH);\n  }\n}",
          "human": "Multi-tier conditional branches divide physical space into 4 safety zones: Safe Green (>50cm), Caution Yellow (20-50cm), Hazard Red (8-20cm), and Emergency Stop (<8cm).\nDynamic chirp spacing: as distance drops from 50cm down to 20cm, the pause between beeps shrinks from 500ms down to 100ms, naturally speeding up the auditory alert cadence!\nWhen the bumper is less than 8 cm away, calling `tone()` without a duration keeps the buzzer ringing continuously, warning the driver of imminent collision."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "ir",
    "name": "TCRT5000 Infrared Lab",
    "title": "Level 2 • TCRT5000 Line Tracker Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "Compass",
    "description": "940nm phototransistor optical reflectivity, comparator thresholds, and line tracking.",
    "lessons": [
      {
        "id": 1,
        "title": "Beams of Invisible Light: Photodiodes & Infrared Reflection",
        "subtitle": "How 940nm light waves bounce off white surfaces and vanish into black surfaces",
        "summary": "",
        "mascotMsg": "The human eye cannot see 940nm infrared light, but your smartphone camera and this phototransistor can! Invisible night vision unlocked! 🔦✨",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define IR_SENSOR_PIN 2\n#define LED_INDICATOR 13\n\nvoid setup() {\n  Serial.begin(9600);\n  // Sensor digital pin is an INPUT\n  pinMode(IR_SENSOR_PIN, INPUT);\n  // Onboard LED is an OUTPUT\n  pinMode(LED_INDICATOR, OUTPUT);\n  Serial.println(\"IR Reflective Sensor Online!\");\n}\n\nvoid loop() {\n  // Read digital status (LOW = Reflected White, HIGH = Absorbed Black)\n  int surfaceStatus = digitalRead(IR_SENSOR_PIN);\n  \n  if (surfaceStatus == LOW) {\n    Serial.println(\"Surface: WHITE REFLECTIVE (Light bounced back!)\");\n    digitalWrite(LED_INDICATOR, LOW);\n  } else {\n    Serial.println(\"Surface: BLACK LINE / VOID (Light absorbed!)\");\n    digitalWrite(LED_INDICATOR, HIGH);\n  }\n  delay(250);\n}",
          "human": "Pin 2 is configured as an input to receive the high-speed digital state (0 or 1) generated by the sensor's onboard LM393 chip.\nReads whether infrared photons bounced back: LOW (0V) means strong reflection (white surface), HIGH (5V) means light was absorbed (black track)."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "The Electronic Referee: LM393 Voltage Comparator & Sensitivity Tuning",
        "subtitle": "How the blue potentiometer sets threshold voltage to turn fuzzy analog into crisp 0/1 logic",
        "summary": "",
        "mascotMsg": "The LM393 chip acts like a digital referee with a whistle! If voltage crosses the threshold, it snaps the output immediately! 🎛️⚡",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define IR_DIGITAL_PIN 2\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(IR_DIGITAL_PIN, INPUT);\n}\n\nvoid loop() {\n  // LM393 comparator outputs a clean, noise-free square pulse\n  int isLineDetected = digitalRead(IR_DIGITAL_PIN);\n  \n  if (isLineDetected == HIGH) {\n    // Phototransistor voltage exceeded Vref (Black line absorption)\n    Serial.println(\"REF-COMP: LINE DETECTED [LOGIC 1]\");\n  } else {\n    // Phototransistor voltage below Vref (White floor reflection)\n    Serial.println(\"REF-COMP: SURFACE CLEAR [LOGIC 0]\");\n  }\n  delay(150);\n}",
          "human": "The LM393 op-amp strips away electrical noise and analog flicker, providing clean high-speed switching that Arduino can process in fractions of a microsecond."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Reading Shades of Gray: Analog Reflectance ADC Values",
        "subtitle": "Using analogRead(A0) to measure surface reflectivity from 0 to 1023",
        "summary": "",
        "mascotMsg": "White paper reflects over 85% of infrared photons, while black tape absorbs almost all of them! That is how self-driving rovers read race tracks! 🏁🚗",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define IR_ANALOG_PIN A0\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  // Read 10-bit analog voltage (0 to 1023)\n  int rawReflectance = analogRead(IR_ANALOG_PIN);\n  float voltage = (rawReflectance / 1023.0) * 5.0;\n  \n  // Calculate percentage of light absorbed\n  float absorptionPct = (rawReflectance / 1023.0) * 100.0;\n  \n  Serial.print(\"Reflectance ADC: \");\n  Serial.print(rawReflectance);\n  Serial.print(\" | Voltage: \");\n  Serial.print(voltage, 2);\n  Serial.print(\"V | Absorption: \");\n  Serial.print(absorptionPct, 1);\n  Serial.println(\"%\");\n  \n  delay(200);\n}",
          "human": "Measures the phototransistor's exact analog voltage without comparator slicing. Low values (<200) mean brilliant white reflection; high values (>800) mean pitch-black absorption.\nMaps raw 10-bit numbers to a human-friendly 0% to 100% absorption scale."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Self-Driving Robot Arena: Dual-Sensor Differential Steering",
        "subtitle": "Build the brains of an autonomous factory warehouse AGV / line-follower bot!",
        "summary": "",
        "mascotMsg": "Autonomous robotics activated! 🏎️💨 Two IR sensors working together keep the robot centered on the line, just like self-driving Tesla lane assist!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#define LEFT_IR_PIN 2\n#define RIGHT_IR_PIN 3\n#define LEFT_MOTOR_PWM 5\n#define RIGHT_MOTOR_PWM 6\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(LEFT_IR_PIN, INPUT);\n  pinMode(RIGHT_IR_PIN, INPUT);\n  pinMode(LEFT_MOTOR_PWM, OUTPUT);\n  pinMode(RIGHT_MOTOR_PWM, OUTPUT);\n}\n\nvoid loop() {\n  int leftVal = digitalRead(LEFT_IR_PIN);\n  int rightVal = digitalRead(RIGHT_IR_PIN);\n  \n  if (leftVal == LOW && rightVal == LOW) {\n    // Both on WHITE: Path is centered -> Drive Straight\n    analogWrite(LEFT_MOTOR_PWM, 200);\n    analogWrite(RIGHT_MOTOR_PWM, 200);\n    Serial.println(\"ROVER: FULL SPEED AHEAD ⬆️\");\n  } else if (leftVal == HIGH && rightVal == LOW) {\n    // Left sensor hit BLACK line -> Turn Left to recenter!\n    analogWrite(LEFT_MOTOR_PWM, 50);\n    analogWrite(RIGHT_MOTOR_PWM, 220);\n    Serial.println(\"ROVER: DRIFT LEFT detected -> STEER LEFT ⬅️\");\n  } else if (leftVal == LOW && rightVal == HIGH) {\n    // Right sensor hit BLACK line -> Turn Right to recenter!\n    analogWrite(LEFT_MOTOR_PWM, 220);\n    analogWrite(RIGHT_MOTOR_PWM, 50);\n    Serial.println(\"ROVER: DRIFT RIGHT detected -> STEER RIGHT ➡️\");\n  } else {\n    // Both on BLACK: Crossline / Station Stop\n    analogWrite(LEFT_MOTOR_PWM, 0);\n    analogWrite(RIGHT_MOTOR_PWM, 0);\n    Serial.println(\"ROVER: INTERSECTION DETECTED -> ALL MOTORS STOP 🛑\");\n  }\n  delay(50);\n}",
          "human": "Four-way differential truth table: White-White = Drive Straight; Black-White = Steer Left; White-Black = Steer Right; Black-Black = Stop.\nDifferential steering: spinning the outer wheel faster than the inner wheel creates a tight, controlled pivot turn without mechanical steering racks!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "slicer",
    "name": "3D Printing Slicer Lab",
    "title": "Level 2 • 3D Slicing & G-Code Lab",
    "grade": "9-10",
    "category": "advanced",
    "badge": "Grades 9–10",
    "iconName": "Layers",
    "description": "Additive manufacturing toolpaths, infill densities, layer heights, and nozzle thermistors.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 53: From 3D Mesh to 2D Slices: Layer Height & Print Time",
        "subtitle": "The Slicer Engine: Chopping 3D Models into Hundreds of 0.2mm Horizontal Slices",
        "summary": "Discover how a 3D printer actually works! Learn how slicer software (Cura, PrusaSlicer) slices a 3D STL mesh into micro-thin horizontal sheets, and balance layer height vs print speed.",
        "mascotMsg": "Welcome to the 3D Slicing Studio! 🖨️ A 3D printer can't print a whole 3D shape all at once — it builds objects like a stack of pancakes! Let's slice our robot part into layers and discover the magic of layer heights!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "; Cura Engine G-Code Layer Initiation\n; LAYER: 45 / 100 (Z = 9.00mm)\nG0 F7200 X105.000 Y105.000 Z9.000 ; Rapid travel to layer start\nG1 F1800 E0.80000 ; Un-retract filament (+0.8mm)\nG1 F2400 X155.000 Y105.000 E2.15000 ; Extrude outer perimeter wall\nG1 X155.000 Y155.000 E3.50000 ; Extrude right perimeter wall",
          "human": "STEP 1: Import 3D CAD Mesh (STL file) into Slicer:\nModel Total Height = 20.0 mm\nSTEP 2: Select Slicing Resolution Profile:\nProfile A: Fine (0.12mm layer height) -> 167 Layers -> 1 hr 18 min\nProfile B: Standard (0.20mm layer height) -> 100 Layers -> 42 min (Recommended)\nProfile C: Draft (0.28mm layer height) -> 71 Layers -> 26 min\nSTEP 3: Generate G-Code toolpaths for 0.4mm brass extrusion nozzle!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 54: Infill Geometry & Strength-to-Weight Optimization",
        "subtitle": "Why 100% Solid is a Waste: Engineering Internal Lattice Structures (Grid, Gyroid, Honeycomb)",
        "summary": "Look inside a 3D printed object! Learn why 3D prints are hollow honeycombs inside, saving 70% of filament weight while maintaining 90% of structural strength.",
        "mascotMsg": "If you cut open an airplane wing or a bird's bone, it isn't solid rock inside — it's a hollow, super-strong honeycomb! Let's explore how internal infill patterns give robot parts maximum strength with minimum weight!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "; Cura Infill Raster Generation\n; TYPE: INFILL (20% Gyroid)\nG1 F3600 X115.200 Y120.400 E0.12500 ; Sinusoidal toolpath curve\nG1 X125.600 Y124.800 E0.25000\nG1 X135.100 Y120.200 E0.37500",
          "human": "STEP 1: Configure External Perimeters (Wall Count):\nSet Wall Line Count = 3 (3 x 0.4mm nozzle = 1.2mm solid shell)\nSTEP 2: Select Internal Infill Pattern & Density:\nOption A: 20% Grid (Fastest printing, high vertical crush strength)\nOption B: 20% Gyroid (Isotropic strength, flexible, best for robot gears)\nOption C: 20% Honeycomb (Maximum torsional rigidity)\nSTEP 3: Material Savings Calculation:\nSolid 100% = 68g filament | 20% Infill = 14g filament (79% Plastic Saved!)"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 55: Overhang Physics: The 45° Rule & Support Structures",
        "subtitle": "Gravity vs Molten Plastic: Why 3D Printers Cannot Print on Thin Air",
        "summary": "Master the fundamental physical constraint of FDM 3D printing! Learn why angles steeper than 45° sag into stringy spaghetti, and generate sacrificial tree supports.",
        "mascotMsg": "Can you build the roof of a house before building the walls? Of course not — gravity would pull the bricks down! The same rule applies to hot 200°C melted plastic. Let's master the 45-Degree Rule!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "; Cura Support Generation Routine\n; TYPE: SUPPORT-INTERFACE\nM106 S255 ; Fan 100% cooling to freeze overhang\nG1 F1500 X120.000 Y130.000 E1.12000 ; Dense breakaway roof layer\nG0 Z9.200 ; Leave 0.2mm air gap before part layer",
          "human": "STEP 1: Analyze Overhang Angles on CAD Geometry:\nGreen Faces (0° to 45° overhang) -> Printable without supports!\nRed Faces (> 45° overhang) -> Will sag into molten noodles without support!\nSTEP 2: Generate Tree Support Scaffolding:\nSet Support Overhang Angle = 50°\nSet Support Z Distance = 0.2mm (Easy snap-off clearance)\nSTEP 3: Slice and Verify Clean Breakaway Interface!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 56: Decoding G-Code & Heated Bed Adhesion",
        "subtitle": "Speaking Robot Language: G0/G1 Cartesian Moves, Nozzle Heat (205°C) & Bed Leveling",
        "summary": "Become fluent in the universal language of 3D printers! Decode raw G-code machine commands, master heated bed adhesion physics (60°C), and achieve the perfect first layer squish.",
        "mascotMsg": "Look under the hood of your 3D printer! 🤖 G-code is the secret robot code telling the stepper motors where to drive and how much hot plastic to pump. Let's run a full print sequence!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "; Standard Marlin / RepRap Start G-Code\nM190 S60 ; Wait for bed to reach 60C\nM109 S205 ; Wait for nozzle to reach 205C\nG28 ; Home all axes\nG92 E0 ; Reset Extruder position\nG1 Z2.0 F3000 ; Move Z Axis up\nG1 X10.1 Y20 Z0.28 F5000.0 ; Move to start position\nG1 X10.1 Y200.0 Z0.28 F1500.0 E15 ; Draw first prime line",
          "human": "3D PRINTER G-CODE START SEQUENCE:\nM140 S60 ; Set Heated Bed Temperature to 60°C (Prevents PLA warping)\nM104 S205 ; Set Extruder Nozzle Temperature to 205°C (Melts PLA plastic)\nG28 ; Auto-Home all 3 axes to X=0, Y=0, Z=0 endstops\nG1 Z0.20 F1200 ; Lower nozzle to 0.20mm first layer height\nG1 X100 Y50 E5.0 F1500 ; Extrude purge line to prime nozzle pressure\n3D PRINT ENGINE RUNNING: First layer squish verified 100%!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "dht",
    "name": "DHT11 Temp & Humidity Lab",
    "title": "Level 2 • DHT11 Climate Telemetry Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "CloudRain",
    "description": "Capacitive humidity sensing, single-wire digital protocols, and heat index computations.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 57: The 1-Wire Single-Bus Handshake Protocol",
        "subtitle": "How DHT Transmits 40 Bits of Weather Data across a Single Shared Data Wire",
        "summary": "Discover why the DHT sensor needs only ONE signal wire (Pin 4)! Explore the microsecond-level timing handshake: the 18ms wake-up call, the 80µs response pulse, and the 40-bit data packet.",
        "mascotMsg": "Meet your digital weather station! 💧 Unlike simple analog sensors that output a continuous voltage, the DHT has an internal microchip that speaks a digital single-bus language. Let's master the microsecond handshake!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <DHT.h>\n#define DHTPIN 4     // Digital pin connected to DHT sensor\n#define DHTTYPE DHT11 // DHT 11 model\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin(); // Initialize single-bus handshake\n}",
          "human": "STEP 1: Import DHT Sensor Driver Library:\nConnect DHT DATA pin to Arduino Digital Pin 4\nSTEP 2: Send 18ms Wake-Up Low Pulse to Sensor:\nArduino pulls Pin 4 LOW for 18,000 microseconds, then switches to INPUT\nSTEP 3: Read 40-Bit Digital Humidity & Temp Stream:\nRead 16-bit Relative Humidity = 65.0% RH\nRead 16-bit Ambient Temperature = 28.5°C\nVerify 8-bit Checksum byte -> Data verified 100% genuine!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 58: Capacitive Polymer Humidity Physics",
        "subtitle": "Dielectric Constant Shifts: How Trapped Water Molecules Change Capacitance",
        "summary": "Look inside the blue plastic shell! Discover how a porous hygroscopic polymer sponge traps atmospheric water vapor, altering its electrical capacitance to measure 0% to 100% Relative Humidity.",
        "mascotMsg": "How can a solid computer chip know how humid the air is? Inside the blue grill is a microscopic moisture sponge! As moisture increases, it changes electrical storage capacity. Let's see how!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "void loop() {\n  delay(2000); // 2 second measurement delay\n  float h = dht.readHumidity();\n  float t = dht.readTemperature();\n\n  if (isnan(h) || isnan(t)) {\n    Serial.println(\"Failed to read from DHT sensor!\");\n    return;\n  }\n  Serial.print(\"Humidity: \"); Serial.print(h); Serial.println(\" %\");\n}",
          "human": "STEP 1: Sample Ambient Relative Humidity:\nRead capacitive humidity register -> 65.0% RH\nSTEP 2: Classify Human Comfort Zone:\nBelow 30% RH: Dry / Arid (Chapped skin, static electricity)\n30% to 60% RH: Ideal Comfort Zone (Healthy respiratory airways)\nAbove 70% RH: Muggy / Tropical (Sweat cannot evaporate)\nSTEP 3: Trigger HVAC Humidifier / Dehumidifier automation!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 59: Calculating the Heat Index & Discomfort Formula",
        "subtitle": "Why 35°C at 80% Humidity Feels Like 48°C: The Science of Evaporative Cooling",
        "summary": "Discover why thermometers lie! Learn how human bodies cool down using evaporative sweating, and program the NOAA Rothfusz Heat Index polynomial formula into Arduino C++.",
        "mascotMsg": "Ever step outside and say 'The weather app says 32°C, but it feels like 42°C!'? That is the Heat Index! When humidity is high, your sweat can't evaporate, trapping heat inside your body. Let's calculate the real 'Feels Like' temperature!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <DHT.h>\n#define DHTPIN 2\n#define DHTTYPE DHT22\n#define FAN_PIN 6\n\nDHT dht(DHTPIN, DHTTYPE);\n\nfloat calcHeatIndex(float t, float h) {\n  float tf = (t * 1.8) + 32.0;\n  float hiF = -42.379 + 2.04901523*tf + 10.14333127*h - 0.22475541*tf*h;\n  return (hiF - 32.0) / 1.8;\n}\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(FAN_PIN, OUTPUT);\n  dht.begin();\n}\n\nvoid loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  float heatIndex = calcHeatIndex(t, h);\n\n  Serial.print(\"Heat Index: \");\n  Serial.println(heatIndex);\n\n  if (heatIndex > 38.0) {\n    digitalWrite(FAN_PIN, HIGH);\n  } else {\n    digitalWrite(FAN_PIN, LOW);\n  }\n  delay(1000);\n}",
          "human": "STEP 1: Read Sensor Temperature & Humidity Inputs:\nAmbient Temperature = 32.0°C | Relative Humidity = 75.0% RH\nSTEP 2: Compute NOAA Heat Index (Feels Like):\nHeat Index = dht.computeHeatIndex(32.0, 75.0, false);\nResult = 43.8°C ('DANGER: Heat Cramps & Exhaustion Likely')\nSTEP 3: Trigger Classroom Warning Alarm & Fans!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 60: Automated Smart Greenhouse Climate Regulator",
        "subtitle": "Closed-Loop Hysteresis Automation: Fans, Misting Atomizers & Crop Health",
        "summary": "Build an automated smart greenhouse! Program closed-loop bang-bang and hysteresis control to trigger exhaust ventilation fans when hot, and ultrasonic misting atomizers when dry.",
        "mascotMsg": "Plants are living creatures with exact climate requirements! 🌱 Tomatoes need 22°C to 28°C and 60% humidity. Let's build an autonomous climate brain that triggers water misting and cooling fans automatically!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Smart Greenhouse Dual Setpoint Regulation\nvar int PIN_FAN = 6;  // Exhaust fan relay\nvar int PIN_MIST = 7; // Ultrasonic mist relay\n\nvoid regulateClimate(float t, float h) {\n  // Cooling Fan with Hysteresis\n  if (t >= 30.0) digitalWrite(PIN_FAN, HIGH);\n  else if (t <= 26.0) digitalWrite(PIN_FAN, LOW);\n\n  // Misting Atomizer with Hysteresis\n  if (h <= 50.0) digitalWrite(PIN_MIST, HIGH);\n  else if (h >= 70.0) digitalWrite(PIN_MIST, LOW);\n}",
          "human": "GREENHOUSE CLOSED-LOOP REGULATION LOGIC:\nRULE 1: Temperature Regulation (Target = 26.0°C):\nIf Temp > 30.0°C -> Turn ON Roof Exhaust Fan (Pin 6)\nIf Temp < 26.0°C -> Turn OFF Roof Exhaust Fan (Hysteresis buffer)\nRULE 2: Relative Humidity Regulation (Target = 65.0% RH):\nIf Humidity < 50.0% -> Turn ON Ultrasonic Misting Atomizer (Pin 7)\nIf Humidity > 70.0% -> Turn OFF Ultrasonic Misting Atomizer\nGREENHOUSE IN BALANCE: Optimal Photosynthesis & Growth Achieved!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "gas",
    "name": "MQ-2 Combustible Gas Lab",
    "title": "Level 2 • MQ-2 Gas & Smoke Lab",
    "grade": "9-10",
    "category": "sensors",
    "badge": "Grades 9–10",
    "iconName": "Flame",
    "description": "Tin dioxide (SnO2) heating coils, PPM concentration curves, and toxic gas alarms.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 61: The Chemical Nose: Tin Dioxide (SnO₂) & Heating Coils",
        "subtitle": "Surface Adsorption: How Heating Coil Activates Oxygen Ions to Sniff Gases",
        "summary": "Discover the physical chemistry inside the steel mesh dome! Learn why the MQ-2 sensor requires a 5V internal heater to reach 300°C, and how combustible gas molecules strip away oxygen ions to drop sensor resistance.",
        "mascotMsg": "Meet your robot's chemical nose! 🧪 Inside the metal dome is an electrical heating coil that glows red-hot at 300°C! When gas molecules hit the hot ceramic surface, an invisible chemical reaction releases trapped electrons. Let's see how!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// MQ Gas Sensor Analog Reading\nvar int PIN_MQ_ANALOG = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int rawADC = analogRead(PIN_MQ_ANALOG);\n  float voltage = rawADC * (5.0 / 1023.0);\n  Serial.print(\"Sensor Voltage: \"); Serial.println(voltage);\n  delay(500);\n}",
          "human": "STEP 1: Supply 5V Power to Internal Heating Element:\nWait 20 seconds preheat cycle until SnO2 reaches 300°C operating thermal balance\nSTEP 2: Read Analog Output Voltage on Pin A0:\nClean Ambient Air: Sensor Resistance Rs = 20,000Ω -> Pin A0 reads 0.65V (ADC 133)\nGas/Smoke Detected: Sensor Resistance Rs drops to 2,000Ω -> Pin A0 jumps to 3.25V (ADC 665)\nSTEP 3: Voltage surge detected -> Trigger emergency response!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 62: Reading Logarithmic Sensitivity Curves (Rs/R0 Math)",
        "subtitle": "Power-Law Math: Converting Analog Volts to Exact Gas Concentration in PPM",
        "summary": "Master the mathematics of chemical calibration! Convert raw ADC voltage to sensor resistance (Rs), calibrate clean air baseline (R0), and use logarithmic power-law equations to calculate exact PPM for LPG, Smoke, and CO.",
        "mascotMsg": "A voltage of 2.5V doesn't tell us how many PPM of gas are in the room! To calculate real PPM, we must read the sensor datasheet's logarithmic sensitivity curve. Let's unlock the power-law equation!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Converting MQ Analog Voltage to Gas PPM\nvar float R0 = 9.83; // Calibrated clean air base\nvar float RL = 5.0;  // 5k load resistor\nvar int PIN_MQ_ANALOG = A0;\n\nfloat calculatePpm(float vOut) {\n  float rs = ((5.0 - vOut) * RL) / vOut;\n  float ratio = rs / R0;\n  return 574.25 * pow(ratio, -2.222);\n}\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int rawADC = analogRead(PIN_MQ_ANALOG);\n  float voltage = rawADC * (5.0 / 1023.0);\n  float ppm = calculatePpm(voltage);\n  Serial.print(\"Gas PPM: \");\n  Serial.println(ppm);\n  delay(500);\n}",
          "human": "STEP 1: Calibrate Clean Air Baseline (R0):\nIn fresh outdoor air, sample voltage and solve for R0 (Base Resistance = 9.83kΩ)\nSTEP 2: Calculate Active Sensor Resistance (Rs):\nRs = ((5.0 - Vout) * RL) / Vout (where RL = 5.0kΩ)\nSTEP 3: Apply MQ-2 LPG Curve Power Law:\nLPG_PPM = 574.25 * pow(Rs/R0, -2.222);\nResult: Rs/R0 = 0.52 -> Calculated Gas Density = 245 PPM!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 63: The Gas Leak & Fire Smoke Alarm System",
        "subtitle": "Hardware Comparator Interrupts: Digital DO Pin & Dual-Tone Piezo Siren",
        "summary": "Build a life-saving disaster warning system! Program the onboard LM393 op-amp comparator on Digital Pin 2 to trigger a hardware interrupt, sounding an instant buzzer siren and flashing a visual hazard strobe.",
        "mascotMsg": "When gas leaks in a kitchen or a workshop, every microsecond counts! We can't wait for a slow code loop — we need an instant hardware interrupt that wakes up the Arduino and sounds the alarm immediately! 🚨📢",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Interrupt-Driven Hazardous Gas Alarm\nvar int PIN_GAS_DO = 2;  // Hardware interrupt pin\nvar int PIN_BUZZER = 8;  // Piezo alarm siren\nvolatile bool gasAlarm = false;\n\nvoid gasAlarmISR() {\n  gasAlarm = true; // High-speed hardware flag\n}\n\nvoid setup() {\n  pinMode(PIN_GAS_DO, INPUT_PULLUP);\n  pinMode(PIN_BUZZER, OUTPUT);\n  attachInterrupt(digitalPinToInterrupt(PIN_GAS_DO), gasAlarmISR, FALLING);\n}\n\nvoid loop() {\n  int rawADC = analogRead(A0);\n  if (rawADC > 400 || digitalRead(PIN_GAS_DO) == LOW) {\n    tone(PIN_BUZZER, 880);\n    delay(250);\n    tone(PIN_BUZZER, 1200);\n    delay(250);\n  } else {\n    noTone(PIN_BUZZER);\n    delay(200);\n  }\n}",
          "human": "STEP 1: Wire LM393 Digital Out to Arduino Pin 2 (Interrupt 0):\nAttach hardware interrupt routine: attachInterrupt(digitalPinToInterrupt(2), gasAlarmISR, FALLING);\nSTEP 2: In Normal Safe Atmosphere (PPM < 200):\nPin 2 = HIGH (5V) | Green Status LED ON | Buzzer Silent\nSTEP 3: Gas Leak Event Detected (PPM > 400):\nPin 2 falls LOW -> Hardware Interrupt fires instantly in 2 microseconds!\nSound 2-Tone Emergency Evacuation Siren (800Hz / 1200Hz sweep) + Red Beacon Strobe!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 64: National Air Quality Index (AQI) Calculator Studio",
        "subtitle": "Categorizing Environmental Toxicity: Good (0-50) to Hazardous (300+) Public Health Telemetry",
        "summary": "Become an environmental data scientist! Combine multiple gas readings into the official Central Pollution Control Board (CPCB) and US EPA Air Quality Index (AQI) metric, alerting vulnerable populations.",
        "mascotMsg": "Air is invisible, but what's floating inside it matters for everyone! 🍃 Let's program an automated Air Quality Index (AQI) station that categorizes ambient air from 'Good' (Green) to 'Severe Hazardous' (Purple) and broadcasts public advisories!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// Central Pollution Control Board (CPCB) AQI Categorization\nvar int PIN_GAS = A0;\nvar int PIN_ALARM = 8;\n\nString getAqiCategory(int aqi) {\n  if (aqi <= 50)  return \"Good (Green)\";\n  if (aqi <= 100) return \"Satisfactory (Light Green)\";\n  if (aqi <= 200) return \"Moderate (Yellow)\";\n  if (aqi <= 300) return \"Poor (Orange)\";\n  if (aqi <= 400) return \"Very Poor (Red)\";\n  return \"Severe / Hazardous (Purple)\";\n}\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(PIN_ALARM, OUTPUT);\n}\n\nvoid loop() {\n  int aqi = map(analogRead(PIN_GAS), 50, 800, 20, 500);\n  String category = getAqiCategory(aqi);\n  Serial.print(\"AQI: \"); Serial.print(aqi);\n  Serial.print(\" - \"); Serial.println(category);\n  if (aqi > 300) {\n    tone(PIN_ALARM, 1000);\n  } else {\n    noTone(PIN_ALARM);\n  }\n  delay(500);\n}",
          "human": "AQI COMPUTATION & HEALTH ADVISORY ENGINE:\nSample MQ-135 Air Quality Sensor Analog Pin A0\nAQI Category 1: 0 - 50 [GREEN - GOOD]: Air quality is ideal for all outdoor activities\nAQI Category 2: 51 - 100 [YELLOW - MODERATE]: Acceptable; sensitive individuals take precaution\nAQI Category 3: 101 - 200 [ORANGE - POOR]: Breathing discomfort for children and asthma patients\nAQI Category 4: 201 - 300+ [RED/PURPLE - SEVERE HAZARD]: Wear N95 masks, trigger indoor air purifiers!\nAQI METRIC BROADCASTED: Public Health Safety Ensured 100%!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "lcd",
    "name": "16x2 I2C Display Lab",
    "title": "Level 2 • 16x2 I2C Character Display Lab",
    "grade": "9-10",
    "category": "displays",
    "badge": "Grades 9–10",
    "iconName": "Tv",
    "description": "I2C two-wire bus architecture (0x27 address), SDA/SCL lines, and custom CGRAM glyphs.",
    "lessons": [
      {
        "id": 1,
        "title": "Taming 16 Wires into 2: The Magic of I2C Bus Protocol",
        "subtitle": "How the PCF8574 chip shrinks a nightmare 16-wire LCD into just 2 shared wires",
        "summary": "",
        "mascotMsg": "Normally a 16x2 screen requires 16 messy jumper wires. With the PCF8574 I2C backpack, we control the entire screen with just TWO data wires (SDA & SCL)! 📟✨",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\n// Set the LCD address to 0x27 for a 16 chars and 2 line display\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  // Initialize the I2C LCD interface\n  lcd.init();\n  \n  // Turn ON the blue LED backlight\n  lcd.backlight();\n  \n  // Print initial greeting on row 0\n  lcd.setCursor(0, 0);\n  lcd.print(\"I2C Bus Ready!\");\n  \n  lcd.setCursor(0, 1);\n  lcd.print(\"Address: 0x27\");\n}\n\nvoid loop() {\n  // Nothing to repeat for static greeting\n}",
          "human": "Creates the LCD object at hexadecimal I2C bus address 0x27 with 16 columns and 2 rows.\nWakes up the HD44780 controller inside the screen and switches on the LED backlight panel."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Waking the Screen: lcd.init(), backlight(), and Coordinates",
        "subtitle": "Navigating 16 columns (0-15) by 2 rows (0-1) in zero-indexed memory",
        "summary": "",
        "mascotMsg": "Remember: Column goes first (0 to 15), Row comes second (0 or 1)! Zero-based indexing is how computer memory works everywhere! 🎯📐",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n}\n\nvoid loop() {\n  // Top Line: Starts at Column 2\n  lcd.setCursor(2, 0);\n  lcd.print(\"ATL INNOVATE\");\n  \n  // Bottom Line: Starts at Column 0\n  lcd.setCursor(0, 1);\n  lcd.print(\"COL:0-15  ROW:0-1\");\n  \n  delay(1000);\n}",
          "human": "Sets the print position. Notice the order is (column, row), NOT (row, column)! Column goes 0 to 15; Row is 0 or 1.\nSends ASCII character bytes one by one over I2C to be rendered in the 5x8 pixel font matrix."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Designing Custom Characters: 5x8 Pixel Matrix Typography",
        "subtitle": "How CGRAM bitmasks let you draw hearts, battery gauges, arrows & degree symbols",
        "summary": "",
        "mascotMsg": "Each character on the LCD is a 5x8 grid of 40 liquid crystal dots. By toggling binary 1s and 0s in CGRAM, you can draw ANY custom icon! 👾❤️",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\n// Custom 5x8 Heart Glyph Bitmask\nbyte heart[8] = {\n  B00000,\n  B01010,\n  B11111,\n  B11111,\n  B01110,\n  B00100,\n  B00000,\n  B00000\n};\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  \n  // Register custom character in Slot 0 (CGRAM)\n  lcd.createChar(0, heart);\n  \n  lcd.setCursor(0, 0);\n  lcd.print(\"Arduino + ATL \");\n  // Print custom character from Slot 0\n  lcd.write(byte(0));\n}\n\nvoid loop() {\n}",
          "human": "An 8-element byte array where each binary number represents one horizontal row of 5 pixels in the custom character.\nUploads the 8-byte pixel bitmap into the HD44780's CGRAM memory slot 0 (slots 0 to 7 available).\n`lcd.write()` outputs raw binary character bytes, displaying the custom glyph stored in slot 0."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "The IoT Command Deck: Live Multi-Sensor Telemetry Billboard",
        "subtitle": "Combine Temperature, Ultrasonic Radar, and LDR light on a cycling 16x2 screen!",
        "summary": "",
        "mascotMsg": "🎉 Congratulations, Master Tinkerer! You have completed all 44 lessons of the Atal Tinkering Lab curriculum! The IoT Command Deck brings all sensors together! 🚀🏆",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\n#define LDR_PIN A1\n#define TEMP_PIN A2\n#define TRIG_PIN 12\n#define ECHO_PIN 11\n\nunsigned long lastScreenSwitch = 0;\nint currentScreen = 0;\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n}\n\nvoid loop() {\n  // Non-blocking timer: switch dashboard screen every 2500ms\n  if (millis() - lastScreenSwitch > 2500) {\n    lastScreenSwitch = millis();\n    currentScreen = (currentScreen + 1) % 3;\n    lcd.clear();\n  }\n  \n  if (currentScreen == 0) {\n    // Screen 1: Smart Greenhouse Climate\n    float tempC = (analogRead(TEMP_PIN) * 5.0 / 1024.0 - 0.5) * 100.0;\n    lcd.setCursor(0, 0);\n    lcd.print(\"CLIMATE MONITOR\");\n    lcd.setCursor(0, 1);\n    lcd.print(\"Temp: \");\n    lcd.print(tempC, 1);\n    lcd.print(\" C\");\n  } else if (currentScreen == 1) {\n    // Screen 2: Ultrasonic Parking Radar\n    digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);\n    digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);\n    digitalWrite(TRIG_PIN, LOW);\n    float dist = pulseIn(ECHO_PIN, HIGH) * 0.0343 / 2.0;\n    lcd.setCursor(0, 0);\n    lcd.print(\"RADAR PROXIMITY\");\n    lcd.setCursor(0, 1);\n    lcd.print(\"Dist: \");\n    lcd.print(dist, 1);\n    lcd.print(\" cm\");\n  } else {\n    // Screen 3: Ambient Light Sensor\n    int lightVal = analogRead(LDR_PIN);\n    lcd.setCursor(0, 0);\n    lcd.print(\"SOLAR SKY LUX\");\n    lcd.setCursor(0, 1);\n    lcd.print(\"Light: \");\n    lcd.print(lightVal);\n    lcd.print(\" / 1023\");\n  }\n  delay(100);\n}",
          "human": "Non-blocking multitasking timer: switches display channels smoothly every 2.5 seconds without freezing sensor readings.\nWipes all 32 character blocks clean before writing the next sensor page, preventing ghost characters."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "oled",
    "name": "SSD1306 128x64 OLED Lab",
    "title": "Level 3 • SSD1306 Monochrome OLED Lab",
    "grade": "11-12",
    "category": "displays",
    "badge": "Grades 11–12",
    "iconName": "Monitor",
    "description": "Direct-write graphics buffers, Bresenham line algorithms, bitmaps, and telemetry UI.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 65: Pixel Coordinates & Memory Pages (SSD1306 Architecture)",
        "subtitle": "128x64 Matrix: Mapping 8,192 Emissive Pixels into 8 Vertical RAM Pages",
        "summary": "Discover how a monochrome OLED display renders graphics without a backlight! Learn how 8,192 individual self-lit organic pixels are packed into 8 vertical memory pages (1KB of SRAM) and controlled over high-speed I2C.",
        "mascotMsg": "Welcome to Level 3: Advanced Engineering! 🚀 Unlike LCDs with clunky character blocks, this 0.96-inch OLED lets us control every single dot (8,192 pixels)! Each pixel emits its own crisp cyan light. Let's see how memory pages turn bits into visual art!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 17, Lesson 65: SSD1306 128x64 OLED Pixel Addressing\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\n#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\n#define OLED_RESET -1\n#define SCREEN_ADDRESS 0x3C\n\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);\n\nvoid setup() {\n  Serial.begin(115200);\n  // Initialize I2C OLED at 400kHz Fast Mode\n  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {\n    Serial.println(F(\"SSD1306 allocation failed!\"));\n    for (;;); // Halt\n  }\n  Wire.setClock(400000); // 400kHz fast I2C bus\n\n  display.clearDisplay(); // Wipe 1KB SRAM buffer\n\n  // Plot individual pixel at (X=64, Y=32) center\n  display.drawPixel(64, 32, SSD1306_WHITE);\n\n  // Draw coordinate boundary crosshairs\n  display.drawPixel(0, 0, SSD1306_WHITE);       // Top-Left\n  display.drawPixel(127, 0, SSD1306_WHITE);     // Top-Right\n  display.drawPixel(0, 63, SSD1306_WHITE);       // Bottom-Left\n  display.drawPixel(127, 63, SSD1306_WHITE);   // Bottom-Right\n\n  display.display(); // Blast 1024 bytes over I2C to glass!\n  Serial.println(F(\"OLED Framebuffer Rendered Successfully.\"));\n}\n\nvoid loop() {\n  // Static test pattern\n}",
          "human": "// Plain English Human Translation:\n// 1. Load the Wire (I2C) and Adafruit Graphics libraries.\n// 2. Define screen dimensions as 128 pixels wide by 64 pixels high.\n// 3. Connect to the SSD1306 driver chip at I2C address 0x3C with a fast 400kHz clock speed.\n// 4. Wipe clean the 1,024-byte RAM buffer (set all 8,192 pixels to OFF).\n// 5. Light up a single pixel right at the center of the screen (X=64, Y=32).\n// 6. Light up the four extreme corner boundary pixels (0,0), (127,0), (0,63), and (127,63).\n// 7. Call display.display() to transmit the entire 1KB buffer across the I2C wires to light up the physical glass!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 66: Graphics Primitives & Custom Monochrome Bitmaps (GFX Engine)",
        "subtitle": "Bresenham's Line & Circle Algorithms: Storing 1-Bit Glyphs in PROGMEM",
        "summary": "Harness the Adafruit_GFX library! Draw razor-sharp vector lines, rounded rectangles, circles, and learn how to convert pixel icons into compact hexadecimal byte arrays stored in Flash memory (PROGMEM).",
        "mascotMsg": "Time to draw like a digital architect! 🎨 We can draw circles, boxes, and even custom game sprites! Because RAM is tiny, we stash our custom icons safely in the microcontroller's permanent flash memory using PROGMEM. Let's design a custom icon!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 17, Lesson 66: GFX Primitives & PROGMEM Bitmap Sprites\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\n\nvar unsigned char PROGMEM heart_icon8x8[] = {\n  0b00000000,\n  0b01100110,\n  0b11111111,\n  0b11111111,\n  0b11111111,\n  0b01111110,\n  0b00111100,\n  0b00011000\n};\n\nvoid setup() {\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n}\n\nvoid loop() {\n  display.clearDisplay();\n  display.drawRoundRect(2, 2, 124, 60, 4, SSD1306_WHITE);\n  display.drawCircle(64, 32, 18, SSD1306_WHITE);\n  display.fillCircle(64, 32, 4, SSD1306_WHITE);\n  display.drawBitmap(10, 10, heart_icon8x8, 8, 8, SSD1306_WHITE);\n  display.setTextSize(1);\n  display.setTextColor(SSD1306_WHITE);\n  display.setCursor(44, 45);\n  display.print(F(\"RADAR V1\"));\n  display.display();\n  delay(500);\n}",
          "human": "// Plain English Human Translation:\n// 1. Define an 8-row binary array of 8 bits each (0b01100110) representing a heart shape.\n// 2. Put 'PROGMEM' before the array so it stays stored in permanent Flash instead of using up RAM.\n// 3. Draw a rounded rectangle border around the screen edges with corner radius of 4 pixels.\n// 4. Draw a circle of radius 18 pixels at screen center (64, 32) and fill a tiny target dot in the center.\n// 5. Stamp our heart icon at coordinates (10, 10) using display.drawBitmap().\n// 6. Print the text 'RADAR V1' and push the finished drawing to the OLED screen with display.display()."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 67: Real-Time Dynamic Telemetry: Circular Ring Buffers & Sparklines",
        "subtitle": "Flicker-Free Real-Time Waveforms: Streaming High-Frequency Sensor Signals",
        "summary": "Transform your OLED into a pocket digital oscilloscope! Implement a 128-element circular ring buffer to stream analog sensor readings, audio waveforms, or heartbeats as smooth, flicker-free sparklines.",
        "mascotMsg": "Beep... beep... beep! 📈 Look at your OLED screen transform into a medical electrocardiogram or rocket telemetry monitor! We'll use a circular buffer so new readings push old ones off the edge in real time!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 17, Lesson 67: OLED Real-Time Oscilloscope Sparkline\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\n\nvar int BUFFER_LEN = 128;\nbyte sparkline[BUFFER_LEN]; // 128-point circular buffer\n\nvoid setup() {\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  display.clearDisplay();\n  // Initialize baseline buffer\n  for (int i = 0; i < BUFFER_LEN; i++) sparkline[i] = 32;\n}\n\nvoid loop() {\n  // 1. Read Analog Signal (Pin A0)\n  int rawVal = analogRead(A0); // 0 to 1023\n  // Map 0-1023 to OLED Y-axis: 16 (top) to 58 (bottom)\n  byte mappedY = map(rawVal, 0, 1023, 58, 16);\n\n  // 2. Shift Circular Buffer Left by 1 position\n  for (int i = 0; i < BUFFER_LEN - 1; i++) {\n    sparkline[i] = sparkline[i + 1];\n  }\n  sparkline[BUFFER_LEN - 1] = mappedY; // Insert newest sample\n\n  // 3. Redraw Screen Framebuffer\n  display.clearDisplay();\n  // Header Telemetry Bar\n  display.setTextSize(1);\n  display.setTextColor(SSD1306_WHITE);\n  display.setCursor(0, 0);\n  display.print(F(\"CH1: \"));\n  display.print(rawVal);\n  display.print(F(\" ADC | 42FPS\"));\n  display.drawLine(0, 10, 127, 10, SSD1306_WHITE);\n\n  // 4. Draw Continuous Vector Sparkline\n  for (int x = 0; x < BUFFER_LEN - 1; x++) {\n    display.drawLine(x, sparkline[x], x + 1, sparkline[x + 1], SSD1306_WHITE);\n  }\n\n  display.display(); // Push frame to screen\n  delay(20);         // 50 updates per second\n}",
          "human": "// Plain English Human Translation:\n// 1. Create an array of 128 numbers to hold the height of the wave at every vertical column across the screen.\n// 2. Read the analog sensor from pin A0 (0 to 1023) and scale it to fit inside the OLED screen's bottom graph area (16 to 58).\n// 3. Shift every number in the array one step to the left, discarding the oldest reading and appending the fresh reading to the end.\n// 4. Wipe the RAM buffer, draw a crisp header bar with the real-time numeric reading, and draw connecting lines between each point.\n// 5. Blast the finished drawing to the physical OLED at 50 frames per second with zero flicker!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 68: Multi-Screen Embedded UI Architecture: State Machines & Inverted Menus",
        "subtitle": "Finite State Machine (FSM): Rotary/Button Nav & Inverted Video Highlight",
        "summary": "Build commercial-grade embedded menus! Structure your firmware with Finite State Machines (FSM), implement debounce navigation, and render sharp highlighted selection bars with XOR inverted video (SSD1306_INVERSE).",
        "mascotMsg": "Now we build the brain of a real handheld device! 🕹️ You'll create a multi-page operating system with a header bar, scrollable menu items, and inverse highlighted buttons! Just like on a 3D printer or smart thermostat!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 17, Lesson 68: Embedded Multi-Screen FSM UI Menu\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\n\nenum ScreenState { DASHBOARD, SENSORS, SETTINGS };\nScreenState currentScreen = DASHBOARD;\nint selectedItem = 0;\n\nvoid drawMenu() {\n  display.clearDisplay();\n  // Header\n  display.fillRect(0, 0, 128, 12, SSD1306_WHITE);\n  display.setTextColor(SSD1306_BLACK, SSD1306_WHITE); // Inverted text\n  display.setCursor(4, 2);\n  display.print(F(\"SPARKBYTE OS v2.4\"));\n\n  // Menu Items\n  var char* items[] = { \"1. System Telemetry\", \"2. Sensor Diagnostics\", \"3. Network Config\" };\n  display.setTextColor(SSD1306_WHITE);\n  for (int i = 0; i < 3; i++) {\n    int y = 18 + (i * 14);\n    if (i == selectedItem) {\n      // Invert background bar for highlighted active selection\n      display.fillRect(0, y - 2, 128, 12, SSD1306_WHITE);\n      display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);\n    } else {\n      display.setTextColor(SSD1306_WHITE);\n    }\n    display.setCursor(8, y);\n    display.print(items[i]);\n  }\n  display.display();\n}\n\nvoid setup() {\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  drawMenu();\n}\n\nvoid loop() {\n  // Button navigation logic would switch currentScreen and update selectedItem\n}",
          "human": "// Plain English Human Translation:\n// 1. Create a Finite State Machine with three distinct screen states: DASHBOARD, SENSORS, and SETTINGS.\n// 2. Draw a crisp white header bar across the top with black inverted letters reading 'SPARKBYTE OS v2.4'.\n// 3. Loop through the three menu items and calculate their vertical Y coordinates on screen.\n// 4. For whichever item matches selectedItem, draw a white rectangular cursor bar behind it and invert the letters to black.\n// 5. Call display.display() to instantly render the professional handheld user interface!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "soil",
    "name": "Capacitive Soil Lab",
    "title": "Level 3 • Smart Soil Moisture Lab",
    "grade": "11-12",
    "category": "sensors",
    "badge": "Grades 11–12",
    "iconName": "Sprout",
    "description": "Corrosion-resistant capacitance measurement, permittivity, and automated irrigation pumps.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 69: Resistive vs Capacitive Soil Sensing: Preventing Galvanic Corrosion",
        "subtitle": "Dielectric Permittivity: Water (εr ≈ 80) vs Air (εr ≈ 1) with High-Frequency AC",
        "summary": "Discover why cheap resistive probes corrode and turn green after 2 weeks! Learn how capacitive probes use an onboard 555-timer IC to measure moisture via electric field capacitance without bare copper touching wet dirt.",
        "mascotMsg": "Plants get thirsty just like you! 🌿 But did you know sticking bare wires into wet soil creates an electro-chemical battery that eats the metal away? Capacitive sensing uses an insulated plastic shield to measure the water's dielectric charge safely forever! Let's explore the physics!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 18, Lesson 69: Capacitive Soil Moisture Sensor v1.2 Calibration\nvar int SOIL_PIN = A1; // Capacitive probe analog output\n\n// Calibration Constants (Measure your sensor in free air vs a cup of water)\nvar int AIR_VALUE = 580;   // Sensor in dry free air (0% moisture)\nvar int WATER_VALUE = 260; // Sensor submerged in water (100% moisture)\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(SOIL_PIN, INPUT);\n  Serial.println(F(\"Capacitive Soil Moisture Probe Initialized.\"));\n}\n\nvoid loop() {\n  int rawADC = analogRead(SOIL_PIN);\n  \n  // Note: Higher capacitance = Lower voltage output!\n  // Map raw ADC (580..260) to moisture percentage (0..100%)\n  int moisturePct = map(rawADC, AIR_VALUE, WATER_VALUE, 0, 100);\n  moisturePct = constrain(moisturePct, 0, 100);\n\n  Serial.print(F(\"Raw Analog ADC: \"));\n  Serial.print(rawADC);\n  Serial.print(F(\" | Calibrated Soil Moisture: \"));\n  Serial.print(moisturePct);\n  Serial.println(F(\"%\"));\n\n  delay(1000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Connect the capacitive probe's analog pin to Arduino pin A1.\n// 2. Set two calibration benchmarks: In dry air the sensor reads ~580; submerged in water it reads ~260.\n// 3. Notice that water causes the voltage to DROP because higher capacitance pulls down the 555-timer output.\n// 4. Use the map() function to scale the inverted reading into an intuitive 0% to 100% moisture percentage.\n// 5. Constrain the percentage so readings never dip below 0% or spike above 100%.\n// 6. Print the moisture reading every second to the Serial Monitor."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 70: Optocoupled Relay Isolation & Inductive Flyback Diodes",
        "subtitle": "Galvanic Light Barrier (PC817) & Clamping Inductive Voltage Spikes (1N4007)",
        "summary": "Control high-voltage agricultural pumps safely! Learn how an optocoupler fires infrared light across an air gap to protect the Arduino, and why a flyback diode absorbs lethal reverse inductive spikes (V = -L di/dt) when electromagnets turn off.",
        "mascotMsg": "Pumps take serious power—often 12V or 240V! ⚡ If that voltage leaked into your Arduino, poof—magic blue smoke! We use an optocoupler to send signals using light beams, and a flyback diode to catch runaway magnetic spikes! Let's trigger the relay!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 18, Lesson 70: Optocoupled 5V Relay Control with Active-LOW Logic\nvar int RELAY_PIN = 7; // Digital Pin connected to Relay Module IN\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(RELAY_PIN, OUTPUT);\n\n  // Note: Most optocoupled relay modules are ACTIVE-LOW!\n  // Setting Pin HIGH turns relay OFF (LED off)\n  digitalWrite(RELAY_PIN, HIGH);\n  Serial.println(F(\"Relay Initialized: DE-ENERGIZED (Pump OFF).\"));\n}\n\nvoid loop() {\n  // Test Actuation Cycle\n  Serial.println(F(\"Energizing Relay (Water Pump ON)...\"));\n  digitalWrite(RELAY_PIN, LOW); // Pull LOW to sink current through opto-LED\n  delay(3000); // Pump water for 3 seconds\n\n  Serial.println(F(\"De-energizing Relay (Water Pump OFF)...\"));\n  digitalWrite(RELAY_PIN, HIGH); // Turn off\n  delay(5000); // Wait 5 seconds\n}",
          "human": "// Plain English Human Translation:\n// 1. Assign digital Pin 7 to control the optocoupled relay module's IN pin.\n// 2. Configure Pin 7 as an OUTPUT.\n// 3. Keep Pin 7 HIGH initially to ensure the water pump starts in the SAFE OFF state (Active-LOW logic).\n// 4. In the loop, pull Pin 7 LOW to complete the circuit inside the PC817 optocoupler, clicking the magnetic relay contacts closed!\n// 5. Run the 12V water pump for 3 seconds to irrigate the plant.\n// 6. Set Pin 7 back to HIGH to collapse the magnetic coil safely through the flyback diode and stop the pump."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 71: Bang-Bang Control with Deadband Hysteresis (Anti-Chatter)",
        "subtitle": "Dual-Threshold Switching: Preventing High-Frequency Relay Hunting & Burnout",
        "summary": "Eliminate relay chatter! Discover why a single threshold causes mechanical relays to toggle frantically 50 times a second at boundary points, and master dual-threshold hysteresis (Pump ON at 35%, OFF at 65%).",
        "mascotMsg": "Click-clack-click-clack! 🔊 Without hysteresis, your relay would machine-gun itself to death at the exact boundary line! Hysteresis gives our system a generous 'cushion zone' so the pump turns on when thirsty and stays on until satisfied. Let's test the cushion!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 18, Lesson 71: Bang-Bang Controller with Deadband Hysteresis\nvar int SOIL_PIN = A1;\nvar int RELAY_PIN = 7;\n\n// Dual Hysteresis Thresholds\nvar int DRY_LIMIT = 35; // Turn pump ON when soil drops below 35%\nvar int WET_LIMIT = 65; // Keep pumping until soil reaches 65%\n\nbool pumpRunning = false;\n\nvoid setup() {\n  pinMode(RELAY_PIN, OUTPUT);\n  digitalWrite(RELAY_PIN, HIGH); // Active-LOW: OFF\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  int rawADC = analogRead(SOIL_PIN);\n  int moisturePct = map(rawADC, 580, 260, 0, 100);\n  moisturePct = constrain(moisturePct, 0, 100);\n\n  // Hysteresis Decision State Machine\n  if (!pumpRunning && moisturePct < DRY_LIMIT) {\n    // Soil is genuinely dry -> Start Irrigation!\n    pumpRunning = true;\n    digitalWrite(RELAY_PIN, LOW); // Turn Relay ON\n    Serial.println(F(\"HYSTERESIS TRIGGER: Soil < 35% -> PUMP STARTED\"));\n  } \n  else if (pumpRunning && moisturePct >= WET_LIMIT) {\n    // Soil is fully hydrated -> Stop Irrigation!\n    pumpRunning = false;\n    digitalWrite(RELAY_PIN, HIGH); // Turn Relay OFF\n    Serial.println(F(\"HYSTERESIS TARGET: Soil >= 65% -> PUMP STOPPED\"));\n  }\n\n  delay(500);\n}",
          "human": "// Plain English Human Translation:\n// 1. Establish two distinct thresholds: DRY_LIMIT at 35% and WET_LIMIT at 65%.\n// 2. Track whether the pump is currently running with a boolean variable 'pumpRunning'.\n// 3. If the pump is OFF and moisture drops below 35%, activate the relay to start watering.\n// 4. While watering, even if moisture rises to 40% or 50%, KEEP PUMPING (inside the deadband).\n// 5. Once moisture finally reaches or exceeds 65%, shut the pump OFF!\n// 6. This eliminates relay chatter completely and saves the motor from premature burnout!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 72: Closed-Loop Smart Irrigation Station & Water Safety Cutoff",
        "subtitle": "Autonomous Environmental Station: Timed Burst Dosing & Dry-Run Reservoir Protection",
        "summary": "Engineer a complete autonomous agricultural station! Implement closed-loop soil monitoring, burst-metered irrigation dosing to prevent flooding, and safety dry-run protection to safeguard pumps if the water tank runs empty.",
        "mascotMsg": "You're now an agricultural tech pioneer! 🌾 We'll tie together soil capacitance, optocoupled relays, pulsing water doses, and reservoir float sensors to run a real smart greenhouse! Let's deploy the automated irrigation!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 18, Lesson 72: Closed-Loop Smart Greenhouse Irrigation Controller\nvar int SOIL_PIN = A1;\nvar int RELAY_PIN = 7;\nvar int FLOAT_SWITCH_PIN = 8; // Digital Float Sensor in Water Reservoir\n\nenum StationState { MONITORING, WATERING_PULSE, SOAKING_DELAY, RESERVOIR_EMPTY };\nStationState systemState = MONITORING;\n\nvoid setup() {\n  pinMode(RELAY_PIN, OUTPUT);\n  digitalWrite(RELAY_PIN, HIGH); // OFF\n  pinMode(FLOAT_SWITCH_PIN, INPUT_PULLUP);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  bool waterAvailable = (digitalRead(FLOAT_SWITCH_PIN) == LOW);\n  int moisture = map(analogRead(SOIL_PIN), 580, 260, 0, 100);\n\n  if (!waterAvailable) {\n    systemState = RESERVOIR_EMPTY;\n    digitalWrite(RELAY_PIN, HIGH); // Emergency Pump Cutoff\n    Serial.println(F(\"SAFETY ALERT: Water Reservoir Empty! Pump Disabled.\"));\n    delay(2000);\n    return;\n  }\n\n  switch (systemState) {\n    case MONITORING:\n      if (moisture < 35) {\n        Serial.println(F(\"Soil Dry -> Delivering 2.5s Metered Water Dose...\"));\n        digitalWrite(RELAY_PIN, LOW); // Start Pump\n        systemState = WATERING_PULSE;\n      }\n      break;\n\n    case WATERING_PULSE:\n      delay(2500); // 2.5 second burst\n      digitalWrite(RELAY_PIN, HIGH); // Stop Pump\n      Serial.println(F(\"Dose Complete -> Entering 10s Soil Absorption Phase...\"));\n      systemState = SOAKING_DELAY;\n      break;\n\n    case SOAKING_DELAY:\n      delay(10000); // Soak time\n      systemState = MONITORING; // Return to closed-loop monitoring\n      break;\n  }\n}",
          "human": "// Plain English Human Translation:\n// 1. Monitor both the soil moisture on Pin A1 and a water reservoir float switch on Pin 8.\n// 2. If the water tank runs out of water, immediately enter RESERVOIR_EMPTY mode and kill power to the pump!\n// 3. If moisture is under 35%, pulse the water pump for exactly 2.5 seconds to deliver a precise dose.\n// 4. Immediately shut off the pump and enter a 10-second soak phase, allowing the roots to absorb water.\n// 5. Re-measure the soil: if more water is needed, pulse again; if moisture is optimal, return to idle standby."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "motor",
    "name": "L298N Dual H-Bridge Lab",
    "title": "Level 3 • L298N DC Motor Driver Lab",
    "grade": "11-12",
    "category": "actuators",
    "badge": "Grades 11–12",
    "iconName": "Cog",
    "description": "Transistor H-Bridge topology, inductive kickback flyback diodes, and differential drive.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 73: The H-Bridge Transistor Architecture & Shoot-Through Protection",
        "subtitle": "4 Bipolar Power Transistors: Diagonal Conduction Paths vs Dead-Short Hazards",
        "summary": "Discover how four power transistors arranged in an 'H' formation reverse motor rotation! Learn why turning on diagonal pairs (Q1+Q4 = Forward; Q2+Q3 = Reverse) routes current backward, and why turning on both transistors on the same leg causes catastrophic shoot-through burnouts.",
        "mascotMsg": "Engines revving! 🏎️ A motor isn't like a gentle LED; it's a magnetic beast that needs massive electrical current! The L298N chip uses an 'H-Bridge' made of four heavy-duty electronic switches. Let's see how flipping switches steers electrons forward and backward!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 19, Lesson 73: L298N Dual H-Bridge Transistor Truth Table\n// Left Motor (Motor A)\nvar int ENA = 5; // PWM Speed Control Pin\nvar int IN1 = 6; // Direction Pin 1\nvar int IN2 = 4; // Direction Pin 2\n\nvoid setup() {\n  pinMode(ENA, OUTPUT);\n  pinMode(IN1, OUTPUT);\n  pinMode(IN2, OUTPUT);\n  Serial.begin(115200);\n  Serial.println(F(\"L298N H-Bridge Initialized.\"));\n}\n\nvoid motorForward(int speed) {\n  analogWrite(ENA, speed); // 0 to 255 PWM\n  digitalWrite(IN1, HIGH);  // Q1 ON\n  digitalWrite(IN2, LOW);   // Q4 ON -> Diagonal Conduction\n}\n\nvoid motorReverse(int speed) {\n  analogWrite(ENA, speed);\n  digitalWrite(IN1, LOW);   // Q3 ON\n  digitalWrite(IN2, HIGH);  // Q2 ON -> Reverse Diagonal Conduction\n}\n\nvoid motorBrake() {\n  analogWrite(ENA, 255);\n  digitalWrite(IN1, LOW);\n  digitalWrite(IN2, LOW);   // Dynamic Brake: Short to GND\n}\n\nvoid loop() {\n  Serial.println(F(\"Motor FORWARD at Speed 200...\"));\n  motorForward(200);\n  delay(3000);\n\n  Serial.println(F(\"Motor Dynamic BRAKE...\"));\n  motorBrake();\n  delay(1000);\n\n  Serial.println(F(\"Motor REVERSE at Speed 200...\"));\n  motorReverse(200);\n  delay(3000);\n\n  motorBrake();\n  delay(2000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Assign Pin 5 as PWM speed control (ENA), and Pins 6 and 4 as direction switches (IN1, IN2).\n// 2. To drive FORWARD: Turn IN1 HIGH and IN2 LOW. This turns on diagonal transistors Q1 and Q4.\n// 3. To drive REVERSE: Flip the polarity—turn IN1 LOW and IN2 HIGH. Electrons rush backward through the motor!\n// 4. To BRAKE: Pull both IN1 and IN2 LOW while keeping enable HIGH. This clamps the spinning motor to ground.\n// 5. Run the motor forward for 3 seconds, brake for 1 second, reverse for 3 seconds, and repeat!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 74: PWM Speed Modulation & Overcoming Motor Static Friction",
        "subtitle": "Timer Duty Cycles: Overcoming Mechanical Gearbox Stiction (Deadband Torque)",
        "summary": "Control robot speed with precision! Learn why PWM values under 70 fail to spin due to static friction (stiction), and how pulsed high-frequency bursts overcome inertia to achieve smooth low-speed cruising without stalling.",
        "mascotMsg": "Ever tried pushing a heavy stalled car? 🚙 The hardest push is getting the wheels to roll that very first millimeter! In DC motors, gears have static friction. A weak PWM signal hums without moving! We need enough kick to break free. Let's throttle up!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 19, Lesson 74: PWM Speed Ramp & Stiction Breakaway\nvar int ENA = 5;\nvar int IN1 = 6;\nvar int IN2 = 4;\n\nvar int STICTION_THRESHOLD = 75; // Minimum PWM to overcome resting gear friction\n\nvoid setup() {\n  pinMode(ENA, OUTPUT);\n  pinMode(IN1, OUTPUT);\n  pinMode(IN2, OUTPUT);\n  digitalWrite(IN1, HIGH);\n  digitalWrite(IN2, LOW);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  // Slowly ramp speed up from 0 to 255 to observe deadband\n  for (int pwm = 0; pwm <= 255; pwm += 15) {\n    analogWrite(ENA, pwm);\n    Serial.print(F(\"PWM Duty: \"));\n    Serial.print(pwm);\n    \n    if (pwm < STICTION_THRESHOLD) {\n      Serial.println(F(\" -> [DEADBAND: Motor humming, gears locked by stiction]\"));\n    } else {\n      int estimatedRPM = map(pwm, STICTION_THRESHOLD, 255, 30, 220);\n      Serial.print(F(\" -> [CRUISING: \"));\n      Serial.print(estimatedRPM);\n      Serial.println(F(\" RPM]\"));\n    }\n    delay(400);\n  }\n  delay(1000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Configure the motor to run forward on Pins 5, 6, and 4.\n// 2. Define the STICTION_THRESHOLD at PWM 75: below this value, gears won't move.\n// 3. Slowly ramp the PWM speed up in steps of 15 from 0 up to 255 (maximum power).\n// 4. Watch how between PWM 0 and 70 the motor makes a faint electrical whine but cannot spin.\n// 5. Once PWM crosses 75, the rotor breaks free and spins smoothly up to 220 RPM!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 75: Differential Skid Steer Rover Kinematics: Tank Drive Dynamics",
        "subtitle": "Differential Velocity Vectors: Forward, Pivot, Point Spin & Smooth Arcs",
        "summary": "Master tank-style robot locomotion! Discover how varying the speed and direction of the left vs right tracks allows the rover to point-spin on its central axis, perform wide racing arcs, or drive in straight laser lines.",
        "mascotMsg": "Tracked tanks and Mars rovers don't have steering wheels like cars! 🚜 Instead, they steer by making one side spin faster than the other. Spinning left wheels forward and right wheels backward makes the rover pirouette like a ballerina on a single spot! Let's take the wheel!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 19, Lesson 75: 4WD Differential Skid Steer Kinematics Engine\n// Left Track: ENA (Pin 5), IN1 (Pin 6), IN2 (Pin 4)\n// Right Track: ENB (Pin 9), IN3 (Pin 3), IN4 (Pin 2)\nvar int ENA = 5, IN1 = 6, IN2 = 4;\nvar int ENB = 9, IN3 = 3, IN4 = 2;\n\nvoid setup() {\n  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);\n  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);\n  Serial.begin(115200);\n}\n\nvoid drive(int leftSpeed, int rightSpeed) {\n  // Left Motor Direction\n  if (leftSpeed >= 0) {\n    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);\n  } else {\n    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);\n  }\n  analogWrite(ENA, abs(leftSpeed));\n\n  // Right Motor Direction\n  if (rightSpeed >= 0) {\n    digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);\n  } else {\n    digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);\n  }\n  analogWrite(ENB, abs(rightSpeed));\n}\n\nvoid loop() {\n  drive(200, 200);   // FORWARD\n  delay(2000);\n  drive(200, -200);  // POINT TURN RIGHT (Rotate on spot)\n  delay(1000);\n  drive(-200, 200);  // POINT TURN LEFT\n  delay(1000);\n  drive(200, 100);   // GENTLE RIGHT ARC TURN\n  delay(2000);\n  drive(0, 0);       // FULL STOP\n  delay(2000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Wire up both Left (ENA, IN1, IN2) and Right (ENB, IN3, IN4) motor channels to the Arduino.\n// 2. Create a unified drive(leftSpeed, rightSpeed) function that handles speeds from -255 to +255.\n// 3. For FORWARD: Set both tracks to +200. The rover advances straight ahead.\n// 4. For POINT TURN RIGHT: Set Left to +200 and Right to -200. The rover spins on a dime!\n// 5. For ARC TURN: Set Left to 200 and Right to 100. The rover carves a graceful curve like a racecar."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 76: Autonomous Navigation: Reactive Obstacle Avoidance Loop",
        "subtitle": "Ultrasonic + L298N Closed Loop: Cruise, Decelerate, Brake, Reverse & Spin Escape",
        "summary": "Combine ultrasonic sonar radar with skid steer kinematics! Build an autonomous reactive obstacle avoidance rover: cruise forward, detect barriers at 25cm, reverse safely, scan left and right, and steer into the open path.",
        "mascotMsg": "Give your rover autonomous eyes and autonomous wheels! 🤖 By linking HC-SR04 sonar with our L298N H-Bridge, the rover can navigate through unknown mazes, never crashing into walls! Let's deploy the autonomous navigation firmware!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 19, Lesson 76: Autonomous Rover Obstacle Avoidance Course\n// Sonar Sensor Pins\nvar int TRIG_PIN = 10;\nvar int ECHO_PIN = 11;\n\nvar int SAFE_DISTANCE_CM = 25; // Minimum obstacle avoidance threshold\n\nint getDistance() {\n  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH, 25000);\n  if (duration == 0) return 999; // No obstacle\n  return duration * 0.0343 / 2;\n}\n\nvoid loop() {\n  int distance = getDistance();\n  Serial.print(F(\"Sonar Distance: \"));\n  Serial.print(distance);\n  Serial.println(F(\" cm\"));\n\n  if (distance > SAFE_DISTANCE_CM) {\n    // Path Clear -> Cruise Forward!\n    drive(190, 190);\n  } else {\n    // OBSTACLE DETECTED!\n    Serial.println(F(\"EMERGENCY BRAKE!\"));\n    drive(0, 0); // Dynamic Brake\n    delay(250);\n\n    Serial.println(F(\"Reversing away from obstacle...\"));\n    drive(-180, -180); // Reverse\n    delay(500);\n\n    Serial.println(F(\"Executing 90-degree Escape Spin...\"));\n    drive(200, -200); // Point Turn Right\n    delay(600);\n\n    drive(0, 0); // Ready for next cycle\n    delay(200);\n  }\n}",
          "human": "// Plain English Human Translation:\n// 1. Measure the distance ahead in real time using the ultrasonic sonar module on Pins 10 and 11.\n// 2. If the path ahead has more than 25cm of open clearance, drive straight ahead at cruising speed.\n// 3. The instant an obstacle appears within 25cm, trigger the EMERGENCY BRAKE reflex!\n// 4. Reverse both motors backward for 0.5 seconds to establish safety clearance.\n// 5. Spin the rover 90 degrees to the right in a quick point-turn escape maneuver.\n// 6. Resume cruising forward in the newly opened direction!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "imu",
    "name": "MPU-6050 6-DoF IMU Lab",
    "title": "Level 3 • MPU-6050 6-Axis Motion Lab",
    "grade": "11-12",
    "category": "sensors",
    "badge": "Grades 11–12",
    "iconName": "Navigation",
    "description": "MEMS capacitive accelerometers, Coriolis gyroscopes, complementary filtering, and pitch/roll.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 77: MEMS Accelerometer Physics: Earth's 1G Gravity Vector & Tilt Angles",
        "subtitle": "Micro-Cantilever Springs: Decomposing 1G Vector into Pitch & Roll via Trigonometry",
        "summary": "Peek inside a microscopic silicon chip! Discover how microscopic comb capacitors on flexible cantilevers detect Earth's 1G gravity vector, and learn the trigonometry formulas (atan2) used to convert raw X, Y, Z acceleration into pitch and roll angles.",
        "mascotMsg": "Ever wondered how your smartphone knows when you flip it sideways? 📱 Inside this tiny MPU-6050 chip are microscopic silicon diving boards that bend under Earth's gravitational pull! Let's tilt the sensor and watch gravity bend the numbers!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 20, Lesson 77: MPU6050 Accelerometer Pitch & Roll Calculation\n#include <Wire.h>\n\nvar int MPU_ADDR = 0x68; // Default I2C Address\n\nint16_t rawAx, rawAy, rawAz;\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(115200);\n\n  // Wake up MPU6050 (Exit Sleep Mode via Power Management 1 Register 0x6B)\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x6B);\n  Wire.write(0x00);\n  Wire.endTransmission(true);\n\n  Serial.println(F(\"MPU6050 Initialized. Reading 1G Gravity Vector...\"));\n}\n\nvoid loop() {\n  // Read 6 bytes of accelerometer registers starting at 0x3B\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x3B);\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU_ADDR, 6, true);\n\n  rawAx = (Wire.read() << 8) | Wire.read();\n  rawAy = (Wire.read() << 8) | Wire.read();\n  rawAz = (Wire.read() << 8) | Wire.read();\n\n  // Convert raw LSB to G-forces (scale ±2g = 16384 LSB/g)\n  float ax = rawAx / 16384.0;\n  float ay = rawAy / 16384.0;\n  float az = rawAz / 16384.0;\n\n  // Compute Pitch & Roll using Trigonometric Arc-Tangent\n  float pitch = atan2(ax, sqrt(ay * ay + az * az)) * 180.0 / PI;\n  float roll = atan2(ay, sqrt(ax * ax + az * az)) * 180.0 / PI;\n\n  Serial.print(F(\"Pitch: \"));\n  Serial.print(pitch, 1);\n  Serial.print(F(\"° | Roll: \"));\n  Serial.print(roll, 1);\n  Serial.println(F(\"°\"));\n\n  delay(100);\n}",
          "human": "// Plain English Human Translation:\n// 1. Connect to the MPU-6050 sensor at I2C address 0x68.\n// 2. Wake up the sensor by clearing its sleep bit in register 0x6B.\n// 3. Read the 6 acceleration bytes starting from register 0x3B (X, Y, and Z axes).\n// 4. Divide each raw integer by 16,384 to convert into real Earth G-forces.\n// 5. Use atan2() trigonometry to decompose the 1G vector into tilt angles: Pitch and Roll.\n// 6. Print the Pitch and Roll angles in degrees 10 times a second to the Serial Monitor."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 78: MEMS Gyroscope Physics: Coriolis Effect & Gyro Drift Integration",
        "subtitle": "Vibrating Proof Mass: Measuring Angular Velocity (°/s) & The Accumulating Drift Trap",
        "summary": "Master rotational rate dynamics! Understand how the Coriolis force deflects a vibrating mass during rotation, why gyroscopes measure angular velocity (°/s) instead of angle, and discover the famous 'drift' that ruins long-term navigation if left uncorrected.",
        "mascotMsg": "Spin me right round! 🌀 A gyroscope doesn't feel gravity; it feels pure rotation speed! When you turn your head, it clocks 90 degrees per second. But there's a catch: tiny electrical offsets add up over time like a clock gaining 5 minutes every hour. Let's see how integration drift happens!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 20, Lesson 78: Gyroscope Angular Velocity & Integration Drift\n#include <Wire.h>\n\nvar int MPU_ADDR = 0x68;\nfloat gyroZ_angle = 0.0;\nunsigned long prevTime = 0;\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(115200);\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x6B); Wire.write(0x00);\n  Wire.endTransmission(true);\n  prevTime = millis();\n}\n\nvoid loop() {\n  // Read Gyro Z axis register (0x47, 0x48)\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x47);\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU_ADDR, 2, true);\n\n  int16_t rawGz = (Wire.read() << 8) | Wire.read();\n  // Sensitivity: 131 LSB / (°/s) for ±250 °/s range\n  float gyroZ_rate = rawGz / 131.0;\n\n  unsigned long now = millis();\n  float dt = (now - prevTime) / 1000.0; // Time step in seconds\n  prevTime = now;\n\n  // Numerical Integration: Angle = Angle + Rate * dt\n  gyroZ_angle += gyroZ_rate * dt;\n\n  Serial.print(F(\"Rate: \"));\n  Serial.print(gyroZ_rate, 2);\n  Serial.print(F(\" °/s | Integrated Angle: \"));\n  Serial.print(gyroZ_angle, 2);\n  Serial.println(F(\"° (Observing Drift!)\"));\n\n  delay(20); // 50Hz integration rate\n}",
          "human": "// Plain English Human Translation:\n// 1. Read the Gyroscope Z-axis registers from the MPU-6050 over I2C.\n// 2. Divide raw sensor units by 131 to obtain the exact angular velocity in degrees per second (°/s).\n// 3. Measure how much time (dt) elapsed since the last loop iteration in fractions of a second.\n// 4. Integrate by adding (Rate * dt) onto our total angle accumulator.\n// 5. Notice how even when resting still on a table, small sensor noise slowly makes the angle drift away from zero!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 79: Sensor Fusion: The Complementary Filter Algorithm (High + Low Pass)",
        "subtitle": "98% Gyro Fast Dynamics + 2% Accel Long-Term Gravity Reference = Rock-Solid Telemetry",
        "summary": "Solve the ultimate robotic dilemma! Combine the jittery-but-drift-free accelerometer with the smooth-but-drifting gyroscope using a lightweight mathematical filter: Angle = 0.98 * (Angle + GyroRate * dt) + 0.02 * AccelAngle.",
        "mascotMsg": "The two sensors have opposite superpowers! 🦸 The accelerometer knows true down, but goes crazy when the drone motors vibrate. The gyroscope is silky smooth, but slowly loses its mind to drift. Put them together in a Complementary Filter, and you get rock-solid flight balance!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 20, Lesson 79: Complementary Filter Sensor Fusion (Alpha = 0.98)\n#include <Wire.h>\n\nvar int MPU_ADDR = 0x68;\nvar float ALPHA = 0.98; // 98% Gyroscope / 2% Accelerometer\n\nfloat fusedPitch = 0.0;\nunsigned long prevTime = 0;\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(115200);\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x6B); Wire.write(0x00);\n  Wire.endTransmission(true);\n  prevTime = millis();\n}\n\nvoid loop() {\n  // 1. Read Raw 6-DOF Sensor Registers\n  Wire.beginTransmission(MPU_ADDR);\n  Wire.write(0x3B);\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU_ADDR, 14, true);\n\n  int16_t rawAx = (Wire.read() << 8) | Wire.read();\n  int16_t rawAy = (Wire.read() << 8) | Wire.read();\n  int16_t rawAz = (Wire.read() << 8) | Wire.read();\n  Wire.read(); Wire.read(); // Skip Temperature\n  int16_t rawGx = (Wire.read() << 8) | Wire.read();\n\n  // 2. Compute Accel Pitch Angle\n  float ax = rawAx / 16384.0, ay = rawAy / 16384.0, az = rawAz / 16384.0;\n  float accelPitch = atan2(ax, sqrt(ay * ay + az * az)) * 180.0 / PI;\n\n  // 3. Compute Gyro Angular Rate\n  float gyroPitchRate = rawGx / 131.0;\n\n  // 4. Calculate Time Step dt\n  unsigned long now = millis();\n  float dt = (now - prevTime) / 1000.0;\n  prevTime = now;\n\n  // 5. COMPLEMENTARY FILTER SENSOR FUSION\n  fusedPitch = ALPHA * (fusedPitch + gyroPitchRate * dt) + (1.0 - ALPHA) * accelPitch;\n\n  Serial.print(F(\"Raw Accel: \")); Serial.print(accelPitch, 1);\n  Serial.print(F(\"° | FUSED PITCH: \")); Serial.print(fusedPitch, 1);\n  Serial.println(F(\"° (Zero Noise, Zero Drift!)\"));\n\n  delay(10); // 100Hz fusion loop\n}",
          "human": "// Plain English Human Translation:\n// 1. Read all 14 sensor registers from the MPU-6050 in a single fast I2C transaction.\n// 2. Compute the accelerometer pitch angle using trigonometry (accurate long-term, noisy short-term).\n// 3. Compute the gyroscope rotational velocity in degrees per second (smooth short-term, drifts long-term).\n// 4. Apply the magical Complementary Filter formula: fusedAngle = 0.98 * (fusedAngle + rate*dt) + 0.02 * accelAngle.\n// 5. Enjoy a rock-solid, vibration-proof, zero-drift orientation angle ready for drone flight!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 80: Closed-Loop Gimbal Stabilization & Flight Telemetry Studio",
        "subtitle": "2-Axis Pan-Tilt Servo Compensation: Real-Time Primary Flight Display (PFD)",
        "summary": "Stabilize a drone camera in heavy turbulence! Build a closed-loop 2-axis servo gimbal controller that inverses IMU pitch and roll angles in real time, keeping the horizon level on the Primary Flight Display.",
        "mascotMsg": "Welcome to mission control, pilot! 🚁 When your quadcopter hits an air pocket and tilts 20 degrees, the camera gimbal immediately counter-rotates 20 degrees to keep your video buttery smooth! Let's fly the drone and watch the gimbal lock the horizon!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 20, Lesson 80: 2-Axis Closed-Loop Camera Gimbal Stabilizer\n#include <Wire.h>\n#include <Servo.h>\n\nServo pitchServo;\nServo rollServo;\n\nfloat fusedPitch = 0.0;\nfloat fusedRoll = 0.0;\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(115200);\n\n  pitchServo.attach(9); // Pitch servo on Pin 9\n  rollServo.attach(10); // Roll servo on Pin 10\n\n  pitchServo.write(90); // Center baseline\n  rollServo.write(90);\n}\n\nvoid loop() {\n  // Read fused IMU orientation (from Lesson 79 Complementary Filter)\n  // Vehicle Tilts +25° Pitch -> Servo Counter-Rotates to (90° - 25°) = 65°!\n  int servoPitchCmd = constrain(90 - (int)fusedPitch, 30, 150);\n  int servoRollCmd = constrain(90 - (int)fusedRoll, 30, 150);\n\n  pitchServo.write(servoPitchCmd);\n  rollServo.write(servoRollCmd);\n\n  Serial.print(F(\"Drone Pitch: \")); Serial.print(fusedPitch);\n  Serial.print(F(\"° -> Gimbal Compensation: \")); Serial.print(servoPitchCmd);\n  Serial.println(F(\"° [HORIZON LOCKED]\"));\n\n  delay(20); // 50Hz servo refresh rate\n}",
          "human": "// Plain English Human Translation:\n// 1. Connect two SG90 micro servos to digital pins 9 and 10 to control camera Pitch and Roll.\n// 2. Set both servos to 90 degrees as the level, centered baseline.\n// 3. Read the real-time fused Pitch and Roll angles from the MPU-6050.\n// 4. Counter-rotate the servos: If the drone tilts up by +20 degrees, rotate the pitch servo down to 70 degrees!\n// 5. Constrain the servo angles between 30 and 150 degrees to protect the mechanical linkage.\n// 6. The camera remains perfectly horizontal and steady through loops, rolls, and air pockets!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "rfid",
    "name": "RC522 13.56MHz RFID Lab",
    "title": "Level 3 • RC522 Contactless RFID Lab",
    "grade": "11-12",
    "category": "advanced",
    "badge": "Grades 11–12",
    "iconName": "Radio",
    "description": "13.56MHz near-field electromagnetic induction, Manchester encoding, and UID door security.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 81: Near-Field Resonant Induction & The SPI 4-Wire Bus",
        "subtitle": "13.56MHz Magnetic Flux: Batteryless Transponders & High-Speed SPI (10Mbps)",
        "summary": "Discover contactless magic! Understand how the RC522 coil antenna emits a 13.56MHz alternating magnetic field that wirelessly powers up the chip inside passive cards through resonant inductive coupling, and how the Arduino reads card responses over the 4-wire SPI bus.",
        "mascotMsg": "Tap to pay! 💳 Ever wonder how hotel keycards or Apple Pay work without batteries? The reader coil creates an invisible magnetic forcefield. When you bring your card close, its internal coil harvests electricity directly out of thin air! Let's explore the wireless physics!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 21, Lesson 81: RC522 RFID SPI Initialization & Card Detection\n#include <SPI.h>\n#include <MFRC522.h>\n\n#define SS_PIN 10  // Slave Select Pin\n#define RST_PIN 9  // Reset Pin\n\nMFRC522 rfid(SS_PIN, RST_PIN); // Create MFRC522 instance\n\nvoid setup() {\n  Serial.begin(115200);\n  SPI.begin();      // Initialize 4-wire SPI bus\n  rfid.PCD_Init();  // Initialize MFRC522 reader chip\n\n  Serial.println(F(\"RC522 13.56MHz Reader Initialized.\"));\n  Serial.println(F(\"Awaiting contactless transponder...\"));\n}\n\nvoid loop() {\n  // Check if a new RFID card is within magnetic resonance field\n  if (!rfid.PICC_IsNewCardPresent()) return;\n\n  // Read card serial number\n  if (!rfid.PICC_ReadCardSerial()) return;\n\n  Serial.print(F(\"Transponder Detected! UID: \"));\n  for (byte i = 0; i < rfid.uid.size; i++) {\n    if (rfid.uid.uidByte[i] < 0x10) Serial.print(F(\" 0\"));\n    else Serial.print(F(\" \"));\n    Serial.print(rfid.uid.uidByte[i], HEX);\n  }\n  Serial.println();\n\n  // Halt PICC to stop repeated reads\n  rfid.PICC_HaltA();\n  delay(1000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Include the SPI hardware bus library and the official MFRC522 RFID library.\n// 2. Define Pin 10 as Slave Select (SS) and Pin 9 as Reset (RST).\n// 3. In setup(), start the SPI bus at high speed and initialize the RC522 antenna coil.\n// 4. In loop(), continuously ping the near-field zone: if a card arrives, wake it up!\n// 5. Read the card's 4-byte Unique Identifier (UID) over the SPI bus and print in hexadecimal.\n// 6. Put the card temporarily to sleep (Halt) so it doesn't trigger 1,000 times a second!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 82: MIFARE Classic 1K Memory Architecture: Sectors, Blocks & Crypto-1",
        "subtitle": "1,024-Byte EEPROM: 16 Sectors x 4 Blocks with Key A, Key B & Access Bits",
        "summary": "Master the internal memory map of smart cards! Dive into the 1,024-byte EEPROM organized into 16 independent sectors, inspect the factory-locked Manufacturer Block 0 (4-byte UID), and understand Sector Trailers protected by the Crypto-1 authentication handshake.",
        "mascotMsg": "A smart card is a miniature filing cabinet with 16 locked drawers (Sectors)! 🗄️ Drawer 0 holds your birth certificate (UID), while Drawer 1 holds your school lunch money. Each drawer has two secret keys (Key A & Key B). Let's unlock the memory map!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 21, Lesson 82: Reading MIFARE Classic 1K Sector 1 with Key A\n#include <SPI.h>\n#include <MFRC522.h>\n\nMFRC522 rfid(10, 9);\nMFRC522::MIFARE_Key key;\n\nvoid setup() {\n  Serial.begin(115200);\n  SPI.begin();\n  rfid.PCD_Init();\n\n  // Factory default Key A: FF FF FF FF FF FF\n  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;\n}\n\nvoid loop() {\n  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;\n\n  byte blockAddr = 4; // Sector 1, Block 0 (Absolute Block 4)\n  MFRC522::StatusCode status;\n\n  // 1. Authenticate with Sector 1 using Key A\n  status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(rfid.uid));\n  if (status != MFRC522::STATUS_OK) {\n    Serial.println(F(\"Authentication Failed!\"));\n    rfid.PICC_HaltA();\n    return;\n  }\n\n  // 2. Read 16 bytes of data from Block 4\n  byte buffer[18];\n  byte size = sizeof(buffer);\n  status = rfid.MIFARE_Read(blockAddr, buffer, &size);\n  if (status == MFRC522::STATUS_OK) {\n    Serial.print(F(\"Sector 1 Data (Block 4): \"));\n    for (byte i = 0; i < 16; i++) {\n      Serial.print(buffer[i], HEX); Serial.print(F(\" \"));\n    }\n    Serial.println();\n  }\n\n  rfid.PCD_StopCrypto1(); // Close encrypted session\n  rfid.PICC_HaltA();\n  delay(1500);\n}",
          "human": "// Plain English Human Translation:\n// 1. Create a 6-byte cryptographic key initialized to the factory default 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF.\n// 2. Detect a card and target Block 4 (which is the first data drawer inside Sector 1).\n// 3. Perform the Crypto-1 authentication handshake: present Key A to the card.\n// 4. Once the card verifies the key, read all 16 bytes stored inside Block 4.\n// 5. Print the 16 bytes in hexadecimal format to inspect stored user data!\n// 6. Call StopCrypto1() to lock the sector back up safely before releasing the card."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 83: Access Control Security: UID Whitelist & Electronic Door Latch",
        "subtitle": "Cryptographic UID Matching: Active Verification, SG90 Servo Deadbolt & Tamper Deny",
        "summary": "Build a commercial-grade smart security lock! Read card UIDs, compare against an authorized master whitelist, actuate an SG90 servo deadbolt for 3 seconds on valid credentials, and trigger visual/audio alarms on unauthorized access attempts.",
        "mascotMsg": "Halt, who goes there? 🏰 We're building a real security access control system! Scan the authorized blue keyfob, and the servo deadbolt retracts with a happy double-beep. Scan an unknown stranger card, and the alarm sounds while the latch stays deadlocked!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 21, Lesson 83: RFID Door Access Control with Servo Deadbolt\n#include <SPI.h>\n#include <MFRC522.h>\n#include <Servo.h>\n\nMFRC522 rfid(10, 9);\nServo lockServo;\n\nvar byte MASTER_UID[4] = {0xA3, 0x7F, 0x4E, 0x12}; // Authorized Keyfob\nvar int GREEN_LED = 6;\nvar int RED_LED = 5;\n\nvoid setup() {\n  pinMode(GREEN_LED, OUTPUT);\n  pinMode(RED_LED, OUTPUT);\n  lockServo.attach(3);\n  lockServo.write(0); // 0° = Locked Deadbolt\n  SPI.begin();\n  rfid.PCD_Init();\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;\n\n  // Compare Scanned UID with Authorized Master UID\n  bool accessGranted = true;\n  for (byte i = 0; i < 4; i++) {\n    if (rfid.uid.uidByte[i] != MASTER_UID[i]) {\n      accessGranted = false;\n      break;\n    }\n  }\n\n  if (accessGranted) {\n    Serial.println(F(\"ACCESS GRANTED! Unlocking door for 3 seconds...\"));\n    digitalWrite(GREEN_LED, HIGH);\n    lockServo.write(90); // 90° = Unlocked\n    delay(3000);\n    lockServo.write(0);  // Relock\n    digitalWrite(GREEN_LED, LOW);\n  } else {\n    Serial.println(F(\"ACCESS DENIED! Unauthorized card detected.\"));\n    digitalWrite(RED_LED, HIGH);\n    delay(1500);\n    digitalWrite(RED_LED, LOW);\n  }\n\n  rfid.PICC_HaltA();\n}",
          "human": "// Plain English Human Translation:\n// 1. Define the authorized card UID as [0xA3, 0x7F, 0x4E, 0x12] (the blue keyfob).\n// 2. Attach an SG90 servo motor on Pin 3 to control the physical door latch (0° = Locked, 90° = Open).\n// 3. When a card is scanned, compare all 4 bytes of its UID against the authorized master array.\n// 4. If all 4 bytes match: Flash Green LED, rotate servo to 90° to open the door, wait 3 seconds, and relock!\n// 5. If bytes mismatch: Flash Red LED, keep the deadbolt locked at 0°, and log the security intrusion!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 84: Read/Write Sector Data & RFID Digital Wallet Studio",
        "subtitle": "Value Blocks: Integer Balance Decrement, Cryptographic Key Authentication & Top-Up",
        "summary": "Engineer a cashless digital wallet system! Authenticate with Sector 1 using Key A (0xFF 0xFF 0xFF 0xFF 0xFF 0xFF), format Block 4 as a MIFARE Value Block, and perform authenticated cashless balance deductions and top-ups directly on the smart card.",
        "mascotMsg": "Tap your card to ride the metro or buy a juice! 🧃 We're not just reading a serial number anymore—we are writing encrypted money directly into the card's memory! Let's build a cashless digital wallet!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 21, Lesson 84: Cashless RFID Digital Wallet (Deduct & Top-Up)\n#include <SPI.h>\n#include <MFRC522.h>\n\nMFRC522 rfid(10, 9);\nMFRC522::MIFARE_Key key;\n\nvar byte WALLET_BLOCK = 4; // Sector 1, Block 0\n\nvoid setup() {\n  SPI.begin();\n  rfid.PCD_Init();\n  Serial.begin(115200);\n  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;\n}\n\n// Deduct fare from card Value Block\nbool deductFare(int32_t amount) {\n  rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, WALLET_BLOCK, &key, &(rfid.uid));\n  \n  MFRC522::StatusCode status;\n  status = rfid.MIFARE_Decrement(WALLET_BLOCK, amount);\n  if (status != MFRC522::STATUS_OK) return false;\n\n  status = rfid.MIFARE_Transfer(WALLET_BLOCK); // Commit to EEPROM\n  return (status == MFRC522::STATUS_OK);\n}\n\nvoid loop() {\n  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;\n\n  Serial.println(F(\"Card Tapped! Deducting $25 Metro Fare...\"));\n  if (deductFare(25)) {\n    Serial.println(F(\"TRANSACTION SUCCESS! Remaining balance updated.\"));\n  } else {\n    Serial.println(F(\"Transaction Error or Insufficient Funds!\"));\n  }\n\n  rfid.PCD_StopCrypto1();\n  rfid.PICC_HaltA();\n  delay(2000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Authenticate with Sector 1 using the 6-byte cryptographic key.\n// 2. Format Block 4 as a tamper-proof MIFARE Value Block.\n// 3. When the card is tapped at the turnstile, call MIFARE_Decrement() to subtract $25.\n// 4. Immediately call MIFARE_Transfer() to commit the new balance atomically to EEPROM.\n// 5. If successful, display the updated balance and open the gate; if failed, halt with error!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  },
  {
    "id": "iot",
    "name": "ESP32 Cloud Telemetry Lab",
    "title": "Level 3 • ESP32 IoT Cloud Station Lab",
    "grade": "11-12",
    "category": "advanced",
    "badge": "Grades 11–12",
    "iconName": "Wifi",
    "description": "Wi-Fi 802.11 b/g/n, REST/MQTT pub-sub protocols, payload serialization, and cloud dashboards.",
    "lessons": [
      {
        "id": 1,
        "title": "Lesson 85: Microcontroller vs IoT SoC: ATmega328P vs Xtensa ESP32 Dual-Core",
        "subtitle": "8-bit Harvard (16MHz, 2KB RAM) vs 32-bit Dual-Core (240MHz, 520KB RAM, Wi-Fi)",
        "summary": "Step into the modern IoT computing revolution! Compare the classic 8-bit ATmega328P with the powerhouse 32-bit ESP32 System-on-Chip (SoC), understand FreeRTOS dual-core task scheduling (Core 0 for Wi-Fi stack, Core 1 for user app), and explore deep sleep microamp modes.",
        "mascotMsg": "We started in Lesson 1 with a humble 8-bit Arduino. Now look at what you hold: a 240MHz dual-core supercomputer chip with built-in Wi-Fi and Bluetooth that costs less than a cup of coffee! Let's unleash the dual-core beast!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 22, Lesson 85: ESP32 Dual-Core Architecture & FreeRTOS Tasks\nTaskHandle_t TaskWiFI;\nTaskHandle_t TaskSensors;\n\nvoid TaskWiFICode(void * pvParameters) {\n  for (;;) {\n    Serial.print(F(\"Core 0: Wi-Fi Protocol Stack Processing on \"));\n    Serial.println(xPortGetCoreID());\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid TaskSensorsCode(void * pvParameters) {\n  for (;;) {\n    Serial.print(F(\"Core 1: High-Speed Sensor Sampling on \"));\n    Serial.println(xPortGetCoreID());\n    vTaskDelay(500 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(F(\"ESP32 Tensilica Dual-Core 240MHz Booting...\"));\n\n  // Pin Task 1 to Core 0 (Wi-Fi Protocol Stack)\n  xTaskCreatePinnedToCore(TaskWiFICode, \"TaskWiFI\", 10000, NULL, 1, &TaskWiFI, 0);\n\n  // Pin Task 2 to Core 1 (User Robotics Code)\n  xTaskCreatePinnedToCore(TaskSensorsCode, \"TaskSensors\", 10000, NULL, 1, &TaskSensors, 1);\n}\n\nvoid loop() {\n  // Empty: FreeRTOS handles task scheduling\n}",
          "human": "// Plain English Human Translation:\n// 1. Create two separate task handles under the FreeRTOS real-time operating system.\n// 2. Define TaskWiFI to run dedicated networking code without ever stalling your robot sensors.\n// 3. Define TaskSensors to sample analog sensors and compute math at high speed.\n// 4. Pin TaskWiFI directly to Core 0 with its own 10KB stack memory.\n// 5. Pin TaskSensors directly to Core 1 running independently in parallel!\n// 6. Enjoy true simultaneous multiprocessing on modern 32-bit silicon!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 2,
        "title": "Lesson 86: Wi-Fi Station Mode, DHCP Lease & RESTful HTTP Client",
        "subtitle": "802.11 b/g/n Networking: WPA2 4-Way Handshake, Dynamic IP Lease & HTTP GET/POST",
        "summary": "Connect your hardware to the world wide web! Master ESP32 Wi-Fi Station (STA) mode, establish secure WPA2 association, negotiate a local IP lease through DHCP, and dispatch RESTful HTTP GET and POST requests to web APIs.",
        "mascotMsg": "Radio check: 3... 2... 1... Connected! 📶 Your board just joined the local Wi-Fi router, got its own IP address, and talked to a web server across the ocean! Let's watch the 4-way WPA2 security handshake unfold!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 22, Lesson 86: ESP32 Wi-Fi Station Association & HTTP Client\n#include <WiFi.h>\n#include <HTTPClient.h>\n\nvar char* ssid = \"SparkByte_ATL_Lab\";\nvar char* password = \"InnovationHub2026\";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.mode(WIFI_STA); // Set Station mode\n  WiFi.begin(ssid, password);\n\n  Serial.print(F(\"Connecting to Wi-Fi SSID: \"));\n  Serial.println(ssid);\n\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(F(\".\"));\n  }\n\n  Serial.println();\n  Serial.println(F(\"WPA2 Handshake Complete! Wi-Fi Connected.\"));\n  Serial.print(F(\"Assigned IP Address: \"));\n  Serial.println(WiFi.localIP());\n}\n\nvoid loop() {\n  if (WiFi.status() == WL_CONNECTED) {\n    HTTPClient http;\n    http.begin(\"http://api.sparkbyte.io/weather/current\");\n\n    int httpCode = http.GET(); // Dispatch HTTP GET Request\n    if (httpCode > 0) {\n      String payload = http.getString();\n      Serial.print(F(\"HTTP Code: \")); Serial.println(httpCode);\n      Serial.print(F(\"Payload: \")); Serial.println(payload);\n    }\n    http.end(); // Free sockets\n  }\n  delay(10000);\n}",
          "human": "// Plain English Human Translation:\n// 1. Include the official ESP32 WiFi and HTTPClient libraries.\n// 2. Configure Wi-Fi in Station (STA) mode and begin connection with SSID and password.\n// 3. Wait for the WPA2 4-way security handshake to complete and print the assigned DHCP IP address.\n// 4. In the loop, create an HTTP client targeting an online REST API endpoint.\n// 5. Send an HTTP GET request across the internet and read the returned server response payload.\n// 6. Close the connection cleanly and repeat every 10 seconds."
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 3,
        "title": "Lesson 87: The MQTT Publish/Subscribe Telemetry Broker Protocol (QoS 0/1/2)",
        "subtitle": "Lightweight Binary Headers (2 Bytes): Topics, Publishers, Subscribers & Keep-Alives",
        "summary": "Discover why MQTT powers millions of smart homes and factories! Learn why bloated HTTP headers waste battery, and master the pub/sub architecture: publish sensor data to hierarchical topics and subscribe to instant cloud commands with Quality of Service (QoS).",
        "mascotMsg": "HTTP is like sending a heavy cardboard box through snail mail just to send one word. MQTT is like sending a lightning-fast two-letter text message! ⚡ It uses a central switchboard called a Broker. Let's publish messages to the cloud!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 22, Lesson 87: MQTT Publisher & Subscriber Engine\n#include <WiFi.h>\n#include <PubSubClient.h>\n\nvar char* mqttServer = \"broker.emqx.io\";\nvar int mqttPort = 1883;\nvar char* topicPub = \"spkbyte/farm/telemetry\";\nvar char* topicSub = \"spkbyte/farm/actuator\";\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid callback(char* topic, byte* payload, unsigned int length) {\n  Serial.print(F(\"Message arrived on topic: \"));\n  Serial.println(topic);\n  String msg = \"\";\n  for (int i = 0; i < length; i++) msg += (char)payload[i];\n  Serial.print(F(\"Command Payload: \")); Serial.println(msg);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  client.setServer(mqttServer, mqttPort);\n  client.setCallback(callback); // Set downlink listener\n}\n\nvoid loop() {\n  if (!client.connected()) {\n    if (client.connect(\"ESP32_SparkByte_Client\")) {\n      Serial.println(F(\"Connected to MQTT Broker!\"));\n      client.subscribe(topicSub); // Listen for cloud commands\n    }\n  }\n  client.loop();\n\n  // Publish sensor telemetry packet every 3 seconds\n  static unsigned long lastPub = 0;\n  if (millis() - lastPub > 3000) {\n    lastPub = millis();\n    char telemetryPayload[64];\n    snprintf(telemetryPayload, 64, \"{\\\"temp\\\":26.4,\\\"aqi\\\":45,\\\"uptime\\\":%lu}\", millis()/1000);\n    client.publish(topicPub, telemetryPayload);\n    Serial.print(F(\"Published MQTT: \")); Serial.println(telemetryPayload);\n  }\n}",
          "human": "// Plain English Human Translation:\n// 1. Point the client at a public MQTT Broker at broker.emqx.io on standard port 1883.\n// 2. Register a callback function to automatically trigger whenever a cloud command arrives.\n// 3. Connect to the broker and subscribe to the actuator downlink topic.\n// 4. In the loop, package current sensor readings into a lightweight JSON string.\n// 5. Publish the JSON packet to the telemetry topic every 3 seconds with minimal network overhead.\n// 6. Any phone, computer, or cloud dashboard subscribed to this topic receives the reading in under 30ms!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      },
      {
        "id": 4,
        "title": "Lesson 88: Cloud IoT Dashboard & Bi-Directional Digital Twin Studio",
        "subtitle": "Industry 4.0: Live Sensor Streaming Uplink + Sub-50ms Remote Actuator Downlink",
        "summary": "Build the grand finale of your ATL engineering journey! Create a full Industry 4.0 Digital Twin: stream real-time environmental telemetry to cloud visualizer charts (Uplink), and trigger physical actuators remotely from a web dashboard in under 50 milliseconds (Downlink).",
        "mascotMsg": "CONGRATULATIONS, MASTER ENGINEER! 🎓 You have completed all 22 labs and 88 lessons! Here is your crowning capstone project: a living, breathing Digital Twin connecting physical hardware to the global cloud! Flip the cloud switch and watch physical reality obey!",
        "instructionKit": "",
        "defaultCode": {
          "cpp": "// SparkByte K-12 ATL Robotics Curriculum\n// Lab 22, Lesson 88: Complete Bi-Directional Industry 4.0 Digital Twin\n#include <WiFi.h>\n#include <PubSubClient.h>\n\nvar int ONBOARD_LED = 2; // Blue Onboard LED (Actuator)\nvar int RELAY_PIN = 4;   // Industrial Greenhouse Fan Relay\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\n// Downlink command receiver: Triggers within 30ms of cloud button click!\nvoid handleCloudCommand(char* topic, byte* payload, unsigned int len) {\n  String cmd = \"\";\n  for (int i = 0; i < len; i++) cmd += (char)payload[i];\n  \n  if (cmd == \"FAN_ON\") {\n    digitalWrite(ONBOARD_LED, HIGH);\n    digitalWrite(RELAY_PIN, HIGH);\n    Serial.println(F(\"DIGITAL TWIN DOWNLINK: Greenhouse Fan Activated!\"));\n  } else if (cmd == \"FAN_OFF\") {\n    digitalWrite(ONBOARD_LED, LOW);\n    digitalWrite(RELAY_PIN, LOW);\n    Serial.println(F(\"DIGITAL TWIN DOWNLINK: Greenhouse Fan Deactivated.\"));\n  }\n}\n\nvoid setup() {\n  pinMode(ONBOARD_LED, OUTPUT);\n  pinMode(RELAY_PIN, OUTPUT);\n  Serial.begin(115200);\n  client.setServer(\"broker.emqx.io\", 1883);\n  client.setCallback(handleCloudCommand);\n}\n\nvoid loop() {\n  // Bi-directional loop: Streams telemetry UP, listens for commands DOWN\n  client.loop();\n}",
          "human": "// Plain English Human Translation:\n// 1. Assign Pin 2 (Blue onboard LED) and Pin 4 (Relay) as physical cloud-controlled actuators.\n// 2. Connect to the global MQTT Broker and set handleCloudCommand() as the listener.\n// 3. When a user anywhere in the world toggles a switch in their web browser, an MQTT command arrives in milliseconds.\n// 4. If the command says \"FAN_ON\", turn on the physical LED and industrial relay immediately!\n// 5. Simultaneously, stream live sensor readings back up to the cloud dashboard so online charts update.\n// 6. You have mastered physical computing, embedded firmware, and cloud IoT engineering!"
        },
        "jargon": [],
        "misconceptions": [],
        "pedagogy": ""
      }
    ]
  }
];

export const LAB_MAP: Record<string, Lab> = ALL_LABS.reduce((acc, lab) => {
  acc[lab.id] = lab;
  return acc;
}, {} as Record<string, Lab>);
