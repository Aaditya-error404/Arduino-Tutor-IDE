/**
 * Lessons, Analogies, Code Translations, and Pedagogical Insights
 * Specially calibrated for 7th & 8th Grade Middle Schoolers and STEM Educators.
 */

const LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: The Brain & The Routine",
    shortTitle: "1. The Brain & Routine",
    subtitle: "How does an Arduino wake up and spend its day?",
    summary: "Learn why Arduino code is split into two rooms: void setup() (things done once at boot) and void loop() (things done forever).",
    mascotMsg: "Hey there, Future Engineer! 👋 Meet your Arduino board. Just like you, it has two big modes: things it does ONCE when it wakes up, and things it keeps doing ALL DAY without stopping!",
    analogy: {
      title: "The Morning Routine vs. Breathing",
      setup: "When you wake up in the morning, you put on your shoes and brush your teeth. You do this ONCE. In Arduino, this is void setup().",
      loop: "Once you are awake, your heart keeps beating and your lungs keep breathing over and over. In Arduino, this is void loop()."
    },
    jargonBuster: [
      {
        word: "Function",
        pronunciation: "FUNGK-shun",
        analogy: "A Recipe Box",
        definition: "A named box of steps the robot can follow. setup() and loop() are two special recipe boxes."
      },
      {
        word: "Void",
        pronunciation: "VOYD",
        analogy: "A Free Worker",
        definition: "It just means this recipe does its job without sending back a gift or a number to us."
      },
      {
        word: "Curly Braces { }",
        pronunciation: "KUR-lee BRAY-sez",
        analogy: "Room Walls",
        definition: "The { is the entrance door and the } is the exit door of a recipe room."
      }
    ],
    sortingActivity: {
      prompt: "Sort these 4 human activities into the right room!",
      items: [
        { id: "shoes", text: "Tie your shoelaces 👟", target: "setup", explanation: "Done ONCE before you head out!" },
        { id: "blink", text: "Blink your eyes 👀", target: "loop", explanation: "Keeps happening over and over!" },
        { id: "backpack", text: "Pack your backpack 🎒", target: "setup", explanation: "Done ONCE at the start of the day!" },
        { id: "heart", text: "Your heartbeat 💓", target: "loop", explanation: "Pumps continuously forever!" }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "ROUTINE 1: When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Prepare the Arduino and check the pins", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "ROUTINE 2: As long as power is plugged in (REPEAT FOREVER):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Step A: Keep checking the sensors", indent: 1, tag: "loop" },
        { id: "h6", line: 6, text: "    Step B: React to the world around you", indent: 1, tag: "loop" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    // Code here runs ONCE when you press reset or plug USB in", indent: 1, tag: "setup" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    // Code here runs OVER and OVER in a continuous cycle", indent: 1, tag: "loop" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Dual-Coding & Schema Construction: setup() vs loop()",
      pedagogy: "Middle schoolers struggle with non-linear execution. In Scratch, blocks run sequentially or on events. In C++, Arduino forces an infinite loop abstraction immediately. Anchoring `setup()` to morning awakening and `loop()` to biological autonomic rhythms gives students an embodied metaphor that prevents 'why did my code stop?' confusion.",
      misconceptions: [
        {
          title: "Misconception: 'loop() runs only once unless told to repeat'",
          detail: "Students used to single-run Python scripts expect code to end at line 6. Explain that Arduino has an invisible outer loop: while(true) { loop(); }."
        },
        {
          title: "Misconception: 'void is the name of the function'",
          detail: "Kids think 'void' is a verb meaning 'empty'. Clarify gently that 'void' is just telling C++: 'This routine performs actions, don't expect a mathematical answer returned'."
        }
      ],
      discussionPrompts: [
        "If you were programming a microwave, what belongs in setup() and what belongs in loop()?",
        "What happens if you accidentally put a blinking light command inside setup() instead of loop()?"
      ],
      standards: [
        "CSTA 2-AP-10: Use flowcharts or pseudocode to address complex problems as algorithms.",
        "CSTA 2-AP-12: Design and iteratively develop programs that combine control structures (loops)."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: Speaking to the Pins",
    shortTitle: "2. Speaking to the Pins",
    subtitle: "Giving the robot a Megaphone or an Ear",
    summary: "Teach pinMode(13, OUTPUT) by claiming Pin 13 on the Arduino board and deciding if it sends electricity out or listens for it.",
    mascotMsg: "Look at all those little metal holes on the Arduino board! Those are called PINS. Think of each pin like a hand that can either PUSH things (OUTPUT) or CATCH things (INPUT). Let's claim Pin 13!",
    analogy: {
      title: "The Megaphone vs. The Microphone",
      output: "OUTPUT is a Megaphone: The Arduino SHOUTS out electrical power (5 Volts) to light up an LED or spin a motor.",
      input: "INPUT is a Microphone / Ear: The Arduino LISTENS quietly to see if a button is pressed or light is shining."
    },
    jargonBuster: [
      {
        word: "pinMode",
        pronunciation: "PIN-mode",
        analogy: "Assigning a Job",
        definition: "Tells the Arduino which pin number you want, and whether it acts like a megaphone (OUTPUT) or an ear (INPUT)."
      },
      {
        word: "Semicolon ;",
        pronunciation: "SEM-ee-koh-lon",
        analogy: "The Robot Period",
        definition: "Just like every English sentence ends with a dot (.), every Arduino instruction must end with a semicolon (;)."
      },
      {
        word: "OUTPUT",
        pronunciation: "OWT-poot",
        analogy: "Pushing Power Out",
        definition: "Tells the pin to push 5 volts of electrical energy out into our circuit."
      }
    ],
    task: "Click Pin 13 on the virtual Arduino board to CLAIM it as an OUTPUT pin!",
    targetPin: 13,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    (Ready for our next command...)", indent: 1, tag: "comment" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    // Pin 13 is configured and ready to drive our LED!", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Configuring Hardware State: pinMode() Pedagogy",
      pedagogy: "In physical computing, software directly drives hardware registers. Middle school students often confuse 'identifying a pin' with 'turning it on'. Teaching `pinMode` as 'assigning a role on a sports team' prevents students from thinking that declaring a pin automatically sends power.",
      misconceptions: [
        {
          title: "Misconception: 'pinMode(13, OUTPUT) turns on the LED'",
          detail: "Students assume telling a pin to be an OUTPUT immediately powers it up. Clarify: it simply unlocks the gate so electricity is permitted to flow when commanded later."
        },
        {
          title: "Misconception: 'Why is OUTPUT all capital letters?'",
          detail: "Students frequently type `output` in lowercase. Explain that in C++, constants that never change are written in capital letters like ALL-CAPS shouts!"
        }
      ],
      discussionPrompts: [
        "If you want to plug in a temperature sensor, should its pin be OUTPUT or INPUT? Why?",
        "Why does pinMode belong inside setup() instead of loop()?"
      ],
      standards: [
        "NGSS MS-PS4-3: Integrate qualitative scientific and technical information to support the claim that digitized signals are a reliable way to encode and transmit information.",
        "CSTA 2-CS-02: Design and evaluate projects that combine hardware and software components."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: The Light Switch & The Clock",
    shortTitle: "3. The Light Switch",
    subtitle: "Turning the LED ON and OFF with exact millisecond timing",
    summary: "Teach digitalWrite() and delay(). Modify the delay number to create custom blink tempos (calm, disco, strobe, or Morse code).",
    mascotMsg: "Time for fireworks! 🎆 Now we teach the Arduino to flip the switch (digitalWrite) and pause between actions (delay). Type your own numbers into the delay boxes to set the rhythm!",
    analogy: {
      title: "The Wall Switch & The Stopwatch",
      digitalWrite: "digitalWrite(13, HIGH) is like flipping your bedroom light switch UP to ON. digitalWrite(13, LOW) flips it DOWN to OFF.",
      delay: "delay(1000) is like telling the robot to freeze and count 1,000 milliseconds (which equals exactly 1 full second!)."
    },
    jargonBuster: [
      {
        word: "digitalWrite",
        pronunciation: "DIJ-ih-tul-ryte",
        analogy: "Flip the Power Switch",
        definition: "Commands a pin to push out full electrical voltage (HIGH = 5 Volts) or zero voltage (LOW = 0 Volts)."
      },
      {
        word: "HIGH and LOW",
        pronunciation: "HY and LOH",
        analogy: "ON and OFF",
        definition: "HIGH means sending electricity (5V). LOW means turning it off (0V, connected to Ground)."
      },
      {
        word: "delay( )",
        pronunciation: "dih-LAY",
        analogy: "Robot Freeze Time",
        definition: "Pauses the Arduino in place for a number of milliseconds (1,000 ms = 1 second)."
      },
      {
        word: "Millisecond (ms)",
        pronunciation: "MIL-ih-sek-und",
        analogy: "A Thousandth of a Second",
        definition: "Computer chips think so fast that 1 second feels like a marathon! 1 second = 1,000 milliseconds."
      }
    ],
    initialDelayOn: 1000,
    initialDelayOff: 1000,
    presets: [
      { name: "Calm Beacon (1000ms / 1000ms)", on: 1000, off: 1000 },
      { name: "Fast Disco (200ms / 200ms)", on: 200, off: 200 },
      { name: "Camera Flash (100ms / 1500ms)", on: 100, off: 1500 },
      { name: "Heartbeat Pulse (150ms / 850ms)", on: 150, off: 850 }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (The Blink Dance):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    1. Turn Pin 13 power ON (Send 5V);", indent: 1, tag: "writeHigh" },
        { id: "h6", line: 6, text: "    2. Freeze and wait for [1000] milliseconds;", indent: 1, tag: "delayOn" },
        { id: "h7", line: 7, text: "    3. Turn Pin 13 power OFF (0V);", indent: 1, tag: "writeLow" },
        { id: "h8", line: 8, text: "    4. Freeze and wait for [1000] milliseconds;", indent: 1, tag: "delayOff" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    digitalWrite(13, HIGH);", indent: 1, tag: "writeHigh" },
        { id: "c6", line: 6, text: "    delay(1000);", indent: 1, tag: "delayOn" },
        { id: "c7", line: 7, text: "    digitalWrite(13, LOW);", indent: 1, tag: "writeLow" },
        { id: "c8", line: 8, text: "    delay(1000);", indent: 1, tag: "delayOff" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Temporal Logic & Millisecond Scale: delay() & digitalWrite()",
      pedagogy: "Students routinely misjudge computational timescales. The concept of 1,000 milliseconds equaling 1 second connects direct math conversion (metric prefixes: milli = 1/1000) with visual confirmation on the circuit board. It also provides immediate kinetic validation when typing 50 vs 2000.",
      misconceptions: [
        {
          title: "Misconception: 'delay(1000) means 1000 seconds'",
          detail: "Students instinctively think in seconds. When their LED doesn't change immediately, they think the Arduino froze forever. Reinforce: 'Computers are so fast they count by thousandths of a second!'."
        },
        {
          title: "Misconception: 'If I delete the second delay, the LED will still blink'",
          detail: "A classic beginner bug: without the second delay after LOW, the loop immediately restarts, turns HIGH back on in microseconds, and the human eye only sees a constantly lit LED! This is a great teachable moment about the speed of light vs human persistence of vision."
        }
      ],
      discussionPrompts: [
        "What would happen if we removed line 8 entirely? Would the LED turn off or stay on?",
        "How many milliseconds would you need for an emergency vehicle strobe flash?"
      ],
      standards: [
        "CSTA 2-AP-13: Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: The Inventor's Sandbox",
    shortTitle: "4. Sandbox Lab",
    subtitle: "Mix and match commands to invent your own light shows & Morse code!",
    summary: "Create your own sequence: customize pins, add steps, make Morse code SOS, or design an emergency siren strobe.",
    mascotMsg: "You're a certified Arduino Coder now! 🚀 Welcome to the Inventor's Sandbox. Design your own sequence, pick your timing, and test it live on the breadboard!",
    analogy: {
      title: "Being the Director of the Orchestra",
      setup: "You tell each instrument what notes it can play (OUTPUT), and then write the musical sheet (loop)!",
      loop: "The Arduino will follow your musical beat over and over until you unplug the power cable."
    },
    jargonBuster: [
      {
        word: "Algorithm",
        pronunciation: "AL-guh-rith-um",
        analogy: "A Step-by-Step Recipe",
        definition: "A set of clear instructions in the exact right order to solve a problem or make a light show."
      },
      {
        word: "Hardware",
        pronunciation: "HARD-wair",
        analogy: "The Robot Body",
        definition: "The physical board, wires, and LED you can touch with your hands."
      },
      {
        word: "Software",
        pronunciation: "SOFT-wair",
        analogy: "The Robot Thoughts",
        definition: "The C++ code instructions that tell the hardware what to do."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Tell Pin 13 to act like a Megaphone (Push power OUT);", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Your Custom Sequence):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    1. Turn Pin 13 ON;", indent: 1, tag: "writeHigh" },
        { id: "h6", line: 6, text: "    2. Freeze for [300] ms;", indent: 1, tag: "delayOn" },
        { id: "h7", line: 7, text: "    3. Turn Pin 13 OFF;", indent: 1, tag: "writeLow" },
        { id: "h8", line: 8, text: "    4. Freeze for [300] ms;", indent: 1, tag: "delayOff" },
        { id: "h9", line: 9, text: "    5. Turn Pin 13 ON;", indent: 1, tag: "writeHigh2" },
        { id: "h10", line: 10, text: "    6. Freeze for [800] ms (Long pulse);", indent: 1, tag: "delayOn2" },
        { id: "h11", line: 11, text: "    7. Turn Pin 13 OFF;", indent: 1, tag: "writeLow2" },
        { id: "h12", line: 12, text: "    8. Freeze for [500] ms;", indent: 1, tag: "delayOff2" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    digitalWrite(13, HIGH);", indent: 1, tag: "writeHigh" },
        { id: "c6", line: 6, text: "    delay(300);", indent: 1, tag: "delayOn" },
        { id: "c7", line: 7, text: "    digitalWrite(13, LOW);", indent: 1, tag: "writeLow" },
        { id: "c8", line: 8, text: "    delay(300);", indent: 1, tag: "delayOff" },
        { id: "c9", line: 9, text: "    digitalWrite(13, HIGH);", indent: 1, tag: "writeHigh2" },
        { id: "c10", line: 10, text: "    delay(800);", indent: 1, tag: "delayOn2" },
        { id: "c11", line: 11, text: "    digitalWrite(13, LOW);", indent: 1, tag: "writeLow2" },
        { id: "c12", line: 12, text: "    delay(500);", indent: 1, tag: "delayOff2" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Open-Ended Synthesis & Computational Pattern Recognition",
      pedagogy: "The sandbox allows students to test boundary conditions (e.g. delay of 1ms vs delay of 5000ms), experiencing how physical sensors and human vision perceive high-frequency switching. It also allows students to write rhythmic codes like SOS (3 short, 3 long, 3 short).",
      misconceptions: [
        {
          title: "Misconception: 'The order of lines in loop doesn't matter'",
          detail: "Students may place two delays together or two HIGH statements together. Use the live simulation execution pointer to visually trace why order of operations dictates circuit behavior."
        }
      ],
      discussionPrompts: [
        "How could we use this LED blink pattern to send secret messages across the room?",
        "If an LED flashes at 10 milliseconds ON and 10 milliseconds OFF, what does it look like to the human eye? Why?"
      ],
      standards: [
        "CSTA 2-AP-17: Systematically test and refine programs using a range of test cases.",
        "CSTA 2-AP-19: Document programs in order to make them easier to follow, test, and debug."
      ]
    }
  }
];

const SERVO_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: The Robot Muscle & The Library",
    shortTitle: "1. Muscle & Library",
    subtitle: "Why does an Arduino need a special toolbox to talk to motors?",
    summary: "Discover why physical motors need #include <Servo.h> and create your named robot motor object with Servo myServo;.",
    mascotMsg: "Welcome to Robotics! 🦾 Unlike a simple LED that is just ON or OFF, a Servo Motor has brains inside—gears, a DC motor, and a position sensor. To command it, we borrow the official Servo.h toolbox from the Arduino library!",
    analogy: {
      title: "The Specialized Tool Rental & The Name Tag",
      library: "Imagine trying to bake a 3-tier wedding cake with just a plastic spoon. You go to the culinary library to check out a specialized Pastry Chef Kit (#include <Servo.h>).",
      instance: "Once you have the kit, you label your new robotic arm: Servo myServo; so the Arduino always knows which motor you are commanding!"
    },
    jargonBuster: [
      {
        word: "#include <Servo.h>",
        pronunciation: "HASH-in-klood SER-voh",
        analogy: "Borrowing a Toolbox",
        definition: "Tells Arduino to open and read a pre-written cookbook of motor instructions before compiling your code."
      },
      {
        word: "Library",
        pronunciation: "LY-brer-ee",
        analogy: "A Knowledge Book",
        definition: "A collection of pre-built code written by expert engineers so you don't have to calculate microsecond electrical pulses yourself."
      },
      {
        word: "Servo myServo;",
        pronunciation: "SER-voh my-SER-voh",
        analogy: "Giving Your Arm a Name Tag",
        definition: "Creates a robot motor in Arduino's memory and gives it a friendly nickname so you can command it later."
      },
      {
        word: "Degrees (°)",
        pronunciation: "dih-GREEZ",
        analogy: "The Protractor Angle",
        definition: "Angles of physical rotation from 0° (extreme left) to 90° (neutral center) to 180° (extreme right)."
      }
    ],
    sortingActivity: {
      prompt: "Sort these 4 Arduino tasks: Does it need a Specialized Library or Standard Built-In tools?",
      items: [
        { id: "servoAngle", text: "Turn motor to exact 90° angle 🦾", target: "library", explanation: "Needs <Servo.h> to calculate 50Hz PWM timer pulses!" },
        { id: "blinkLed", text: "Blink onboard LED ON and OFF 💡", target: "builtin", explanation: "Standard digitalWrite() works straight out of the box!" },
        { id: "oledScreen", text: "Draw graphics on an OLED screen 📺", target: "library", explanation: "Needs a graphics library like Adafruit_SSD1306!" },
        { id: "freezePause", text: "Pause robot for 1000 milliseconds ⏱️", target: "builtin", explanation: "Standard delay() is already built into Arduino!" }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Borrow the official Servo instruction kit from the library;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Create and name our virtual robotic arm: \"myServo\";", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "ROUTINE 1: When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Prepare myServo motor in memory and check settings;", indent: 1, tag: "setup" },
        { id: "h6", line: 6, text: "", indent: 0, tag: "blank" },
        { id: "h7", line: 7, text: "ROUTINE 2: As long as power is plugged in (REPEAT FOREVER):", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "    Keep motor ready to hold its target angle;", indent: 1, tag: "loop" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo myServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "c4", line: 4, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    // myServo is declared and ready for pin attachment!", indent: 1, tag: "setup" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" },
        { id: "c7", line: 7, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c8", line: 8, text: "    // Motor awaits our angle commands", indent: 1, tag: "loop" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Dual-Coding & Object Abstraction: Introducing #include <Servo.h>",
      pedagogy: "Middle schoolers often view programming as a single flat list of commands. Introducing `#include <Servo.h>` and `Servo myServo;` provides their first encounter with modular software architecture and Object-Oriented design. Anchoring the library to a 'specialized tool rental' and the object to a 'physical name tag' prevents syntax intimidation.",
      misconceptions: [
        {
          title: "Misconception: 'Why can't I just use digitalWrite(9, HIGH) to turn the motor?'",
          detail: "Students assume motors turn on just like LEDs. Clarify: a simple digital pin only gives constant 5V, which might spin a toy DC motor wildly, but a servo needs intelligent 50Hz PWM timed pulses to know WHERE to aim and hold position!"
        },
        {
          title: "Misconception: 'Does #include download code from the internet every time?'",
          detail: "Kids think #include is an internet hyperlink. Clarify: the Servo library files are stored locally right inside the Arduino software IDE on your computer."
        }
      ],
      discussionPrompts: [
        "Why did the Arduino creators build a Servo library instead of making everyone write hundreds of lines of pulse code?",
        "If you had a robotic spider with 8 legs, how many `Servo` name tags would you declare at the top of your code?"
      ],
      standards: [
        "CSTA 2-AP-14: Create procedures with parameters to organize code and make it reusable.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process to determine how well they meet criteria."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: The 3 Wires & Attaching Pin 9",
    shortTitle: "2. The 3 Wires & Pin 9",
    subtitle: "Connecting Power, Ground, and PWM Signal to your Arduino",
    summary: "Discover the 3-pin servo cable (Brown = GND, Red = 5V, Orange = PWM Pin 9) and attach it using myServo.attach(9);.",
    mascotMsg: "Check out the ribbon cable coming out of the servo! It has THREE colored wires, not two! Each wire has a critical mission: one feeds it electrical food (+5V), one is the ground return (GND), and the third whispers steering angles. Let's wire it to Pin ~9!",
    analogy: {
      title: "The 3-Lane Highway: Food, Earth, and Walkie-Talkie",
      wires: "Red (+5V) is the Food Buffet (power). Brown (GND) is the Return Earth (drain). Orange (Pin 9) is the Walkie-Talkie (PWM instructions from the brain).",
      attach: "Calling myServo.attach(9) is like tuning your walkie-talkie to Channel 9 so the servo can hear your commands loud and clear!"
    },
    jargonBuster: [
      {
        word: "myServo.attach(9)",
        pronunciation: "uh-TACH",
        analogy: "Plugging in the Walkie-Talkie",
        definition: "Tells the Arduino which digital PWM pin is wired to the servo's orange signal line so it can stream pulse commands."
      },
      {
        word: "PWM (~)",
        pronunciation: "P-W-M",
        analogy: "Rapid Pulse Code",
        definition: "Pulse Width Modulation: sending microsecond electrical bursts 50 times every second to signal exact target angles."
      },
      {
        word: "Tilde (~)",
        pronunciation: "TIL-duh",
        analogy: "The Squiggly Wave",
        definition: "Pins on the Arduino Uno marked with a squiggly line ~ (Pins 3, 5, 6, 9, 10, 11) have special hardware timer circuits for PWM control."
      },
      {
        word: "SG90 Micro Servo",
        pronunciation: "S-G-ninety",
        analogy: "The Mini Muscle",
        definition: "A popular lightweight hobby motor packed with reduction gears, a DC motor, and an internal potentiometer that can rotate 0° to 180°."
      }
    ],
    task: "Click Pin ~9 on the virtual Arduino board to attach your servo's orange signal line!",
    targetPin: 9,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Borrow the official Servo instruction kit;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Create our robot arm named myServo;", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Attach myServo signal wire to PWM Pin 9;", indent: 1, tag: "attach" },
        { id: "h6", line: 6, text: "", indent: 0, tag: "blank" },
        { id: "h7", line: 7, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "    (Pin 9 actively streams holding pulses...)", indent: 1, tag: "comment" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo myServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "c4", line: 4, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    myServo.attach(9);", indent: 1, tag: "attach" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" },
        { id: "c7", line: 7, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c8", line: 8, text: "    // Pin 9 is actively transmitting PWM pulses to hold position", indent: 1, tag: "comment" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Physical Computing Wiring: The 3-Wire Interface & PWM Pins",
      pedagogy: "Students accustomed to 2-wire LEDs are puzzled by the 3rd wire on a servo. Deconstructing the 3-wire harness into: Power (+5V), Ground (GND), and Signal (PWM Pin 9) reinforces circuit loop theory while introducing hardware pulse generation.",
      misconceptions: [
        {
          title: "Misconception: 'Can I plug the signal wire into any Arduino pin?'",
          detail: "While the Arduino Servo library can technically use any pin via software interrupts, using hardware PWM pins marked with ~ (like Pin 9) avoids timing jitter and gives rock-solid motor stability."
        },
        {
          title: "Misconception: 'What happens if I swap the Red and Brown wires?'",
          detail: "Reversing power and ground can damage the servo's internal chip! Always verify: Brown/Black is Ground, Red is +5V, Orange/Yellow is Signal."
        }
      ],
      discussionPrompts: [
        "Why does a motor need both a power wire AND a signal wire, while an LED only needs one positive wire?",
        "Look closely at the Arduino Uno board. Which pins have a little squiggly line ~ next to their numbers?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and evaluate projects that combine hardware and software components.",
        "NGSS MS-PS4-3: Integrate technical information to support the claim that digitized signals encode reliable information."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: The Steering Wheel & Angle Commands",
    shortTitle: "3. Angle Commands",
    subtitle: "Commanding exact positions from 0° (Left) to 180° (Right)",
    summary: "Use myServo.write(angle) to aim the servo horn at any angle. Drag the interactive angle slider or click presets to see live rotation!",
    mascotMsg: "Look at that white plastic arm on top—that's the SERVO HORN! 🎯 In Arduino, we don't say 'spin fast'—we say myServo.write(90); and the motor snaps straight to 90 degrees! Try moving the angle dial below to steer it live!",
    analogy: {
      title: "The Steering Wheel & The Protractor",
      write: "myServo.write(90) is like pointing your steering wheel dead center. myServo.write(0) turns hard left. myServo.write(180) turns hard right.",
      pwmPulse: "Inside the wire, 1.0 millisecond pulse = 0°, 1.5 millisecond pulse = 90°, and 2.0 millisecond pulse = 180°! The servo decodes pulse length into physical angles."
    },
    jargonBuster: [
      {
        word: "myServo.write(angle)",
        pronunciation: "ryte",
        analogy: "Setting the Compass Heading",
        definition: "Commands the servo to rotate its horn to an exact angle between 0 and 180 degrees and hold it firmly."
      },
      {
        word: "Servo Horn",
        pronunciation: "SER-voh horn",
        analogy: "The Robot Wrist / Pointer",
        definition: "The white nylon arm attached to the motor shaft that physically pushes robot grippers, airplane flaps, or steering linkages."
      },
      {
        word: "Pulse Width (1.0ms - 2.0ms)",
        pronunciation: "PULS width",
        analogy: "The Morse Code Width",
        definition: "The length of the electrical HIGH pulse transmitted every 20ms: 1000µs = 0°, 1500µs = 90°, 2000µs = 180°."
      },
      {
        word: "Potentiometer",
        pronunciation: "poh-TEN-shee-OM-ih-ter",
        analogy: "The Internal Protractor Eye",
        definition: "A tiny built-in angle sensor inside the servo that constantly checks if the gears have reached the commanded position."
      }
    ],
    initialAngle1: 90,
    initialAngle2: 180,
    initialDelay: 1000,
    presets: [
      { name: "Full Left (0° / 1.0ms)", a1: 0, a2: 90, delay: 1000 },
      { name: "Neutral Center (90° / 1.5ms)", a1: 90, a2: 90, delay: 1000 },
      { name: "Full Right (180° / 2.0ms)", a1: 180, a2: 90, delay: 1000 },
      { name: "Wave Hello (45° ↔ 135°)", a1: 45, a2: 135, delay: 600 }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Borrow the official Servo instruction kit;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Create our robot arm named myServo;", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Attach myServo signal wire to PWM Pin 9;", indent: 1, tag: "attach" },
        { id: "h6", line: 6, text: "", indent: 0, tag: "blank" },
        { id: "h7", line: 7, text: "REPEAT FOREVER (Angle Dance):", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "    1. Turn servo arm to [90] degrees (Center);", indent: 1, tag: "writeAngle1" },
        { id: "h9", line: 9, text: "    2. Freeze and hold for [1000] milliseconds;", indent: 1, tag: "delay1" },
        { id: "h10", line: 10, text: "    3. Turn servo arm to [180] degrees (Right);", indent: 1, tag: "writeAngle2" },
        { id: "h11", line: 11, text: "    4. Freeze and hold for [1000] milliseconds;", indent: 1, tag: "delay2" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo myServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "c4", line: 4, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    myServo.attach(9);", indent: 1, tag: "attach" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" },
        { id: "c7", line: 7, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c8", line: 8, text: "    myServo.write(90);", indent: 1, tag: "writeAngle1" },
        { id: "c9", line: 9, text: "    delay(1000);", indent: 1, tag: "delay1" },
        { id: "c10", line: 10, text: "    myServo.write(180);", indent: 1, tag: "writeAngle2" },
        { id: "c11", line: 11, text: "    delay(1000);", indent: 1, tag: "delay2" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Kinetic Geometry & Pulse Decoding: myServo.write(angle)",
      pedagogy: "Students often conflate speed commands with position commands. A DC motor takes power to determine speed; a servo motor takes a position parameter (0° to 180°). Linking math geometry (protractor angles) with physical movement anchors mathematical abstraction.",
      misconceptions: [
        {
          title: "Misconception: 'myServo.write(90) means spin around 90 times'",
          detail: "Students used to gaming wheels think 90 means rotations. Clarify: it is an absolute heading on a protractor (0° is left, 90° is straight up, 180° is right)."
        },
        {
          title: "Misconception: 'If I omit the delay, the servo will still reach 180°'",
          detail: "Gears have mechanical inertia! If code commands write(0) and immediately write(180) without delay, the loop flips before the motor physically has time to travel. That's why delay() is essential for giving gears time to turn."
        }
      ],
      discussionPrompts: [
        "If you were programming an automated trash can lid, what angle would be 'CLOSED' and what angle would be 'OPEN'?",
        "Watch the oscilloscope below when we change from 0° to 180°. What happens to the width of the blue pulse?"
      ],
      standards: [
        "CSTA 2-AP-13: Decompose problems and subproblems into parts to facilitate program design.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: The 180° Sweep Dance & Sandbox",
    shortTitle: "4. Sweep Sandbox",
    subtitle: "Smooth automated sweeps, radar scanners, and robot grippers!",
    summary: "Use a smooth for loop to sweep from 0° to 180° and back, or test robotics presets like Radar Scanner, Robot Gripper, and Metronome.",
    mascotMsg: "You're a master roboticist now! 🚀 Let's make the servo dance smoothly like a radar scanner or windshield wiper using a for loop. Choose from cool robotics presets or invent your own sequence!",
    analogy: {
      title: "The Windshield Wiper & The Radar Dish",
      sweep: "Instead of jumping violently from 0° to 180°, we take tiny baby steps of 1 degree at a time, pausing 15 milliseconds between each step so the gears glide like butter!",
      forLoop: "A for loop is like a gym coach counting reps: 'Start at 0, count up by 1, stop when you hit 180!'."
    },
    jargonBuster: [
      {
        word: "for loop",
        pronunciation: "FOR loop",
        analogy: "The Repetition Counter",
        definition: "A loop that counts from a start number to an end number, running instructions for every step along the way."
      },
      {
        word: "pos++ (pos += 1)",
        pronunciation: "pos-PLUS-PLUS",
        analogy: "Take One Baby Step",
        definition: "Increases the position variable by 1 degree on each cycle of the sweep."
      },
      {
        word: "delay(15)",
        pronunciation: "dih-LAY 15",
        analogy: "Gear Breathing Time",
        definition: "Pauses 15 milliseconds so the physical plastic gears have time to catch up with the computer's speed."
      },
      {
        word: "Continuous Rotation",
        pronunciation: "kun-TIN-yoo-us",
        analogy: "A Car Wheel",
        definition: "A modified servo that spins 360° continuously like a wheel, unlike our standard 180° positional servo."
      }
    ],
    presets: [
      { name: "🌊 Radar Sweep (0° ↔ 180° smooth)", a1: 0, a2: 180, delay: 15, type: "sweep" },
      { name: "🦾 Robot Gripper (Open 30° / Grab 120°)", a1: 30, a2: 120, delay: 500, type: "step" },
      { name: "🎵 Metronome Beat (60° ↔ 120°)", a1: 60, a2: 120, delay: 350, type: "step" },
      { name: "🚧 Boom Barrier Gate (0° Down / 90° Up)", a1: 0, a2: 90, delay: 800, type: "step" }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Borrow the official Servo instruction kit;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Create our robot arm named myServo;", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "3. Track angle position in a variable called 'pos';", indent: 0, tag: "var" },
        { id: "h4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "h5", line: 5, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "    Attach myServo signal wire to PWM Pin 9;", indent: 1, tag: "attach" },
        { id: "h7", line: 7, text: "", indent: 0, tag: "blank" },
        { id: "h8", line: 8, text: "REPEAT FOREVER (Smooth Sweep):", indent: 0, tag: "header" },
        { id: "h9", line: 9, text: "    Sweep Forward: 0° to 180° (wait 15ms per degree);", indent: 1, tag: "sweepFwd" },
        { id: "h10", line: 10, text: "    Sweep Backward: 180° down to 0° (wait 15ms per degree);", indent: 1, tag: "sweepRev" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo myServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "int pos = 0;", indent: 0, tag: "var" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "c5", line: 5, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c6", line: 6, text: "    myServo.attach(9);", indent: 1, tag: "attach" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "brace" },
        { id: "c8", line: 8, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c9", line: 9, text: "    for (pos = 0; pos <= 180; pos += 1) {", indent: 1, tag: "sweepFwd" },
        { id: "c10", line: 10, text: "        myServo.write(pos);", indent: 2, tag: "sweepFwd" },
        { id: "c11", line: 11, text: "        delay(15);", indent: 2, tag: "sweepFwd" },
        { id: "c12", line: 12, text: "    }", indent: 1, tag: "brace" },
        { id: "c13", line: 13, text: "    for (pos = 180; pos >= 0; pos -= 1) {", indent: 1, tag: "sweepRev" },
        { id: "c14", line: 14, text: "        myServo.write(pos);", indent: 2, tag: "sweepRev" },
        { id: "c15", line: 15, text: "        delay(15);", indent: 2, tag: "sweepRev" },
        { id: "c16", line: 16, text: "    }", indent: 1, tag: "brace" },
        { id: "c17", line: 17, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Loop Iterations & Physical Mechanical Timing",
      pedagogy: "The classic Arduino `Sweep` sketch is the gold standard for connecting variable bounds (initial value, test condition, increment) with physical travel. Middle school students see code as immediate; seeing the physical arm increment 1 degree every 15ms establishes the connection between code iteration speed and physical mass/acceleration.",
      misconceptions: [
        {
          title: "Misconception: 'If I set delay to 0, it will sweep at the speed of light'",
          detail: "Students try delay(0) thinking it becomes instantaneous. Demonstrate: the loop finishes in less than a millisecond before the servo's physical motor even has time to budge, causing stalled hum and gear strain!"
        }
      ],
      discussionPrompts: [
        "What happens to the sweep speed if we change delay(15) to delay(50)? What about delay(5)?",
        "How would you change the code so the servo sweeps back and forth between 45° and 135° instead of 0° and 180°?"
      ],
      standards: [
        "CSTA 2-AP-12: Design and iteratively develop programs that combine control structures, including loops.",
        "CSTA 2-AP-17: Systematically test and refine programs using a range of test cases."
      ]
    }
  }
];

const POT_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Digital Switch vs. Analog Dial",
    shortTitle: "1. Digital vs Analog",
    subtitle: "Discover how Arduino reads a smooth spectrum of 1,024 values instead of just HIGH/LOW!",
    summary: "Digital signals are strictly ON or OFF (like a light switch). Analog signals represent a continuous smooth range (like a volume knob or water faucet). Learn how Arduino's Analog-to-Digital Converter (ADC) translates voltage into numbers from 0 to 1023.",
    mascotMsg: "Welcome to Analog Sensing! 🎛️ Digital pins only know 0 or 1, but the physical world has infinite shades in between. Can you sort these real-world objects into Digital and Analog?",
    analogy: {
      title: "The Light Switch vs. The Dimmer Knob",
      digital: "A standard light switch is digital: flip it UP and the room is full 5V bright; flip it DOWN and it is 0V pitch black.",
      analog: "A dimmer knob is analog: you can glide smoothly from 1% candle glow to 50% reading light all the way to 100% full brightness!"
    },
    jargonBuster: [
      {
        word: "Analog",
        pronunciation: "AN-uh-log",
        analogy: "A Smooth Ramp",
        definition: "A continuous range of values with infinite smooth steps in between, unlike digital steps."
      },
      {
        word: "ADC (Analog to Digital Converter)",
        pronunciation: "A-D-C",
        analogy: "The Voltage Ruler",
        definition: "An internal sensor inside the Arduino chip that measures incoming voltage (0V to 5V) and assigns it a number from 0 to 1023."
      },
      {
        word: "10-Bit Resolution",
        pronunciation: "TEN-bit rez-oh-LOO-shun",
        analogy: "1,024 Ruler Notches",
        definition: "2 to the power of 10 = 1,024 distinct measurement steps. Every step equals approximately 0.0049 Volts (4.9 millivolts)!"
      }
    ],
    sortingActivity: {
      prompt: "Sort these real-world objects into Digital (Strictly ON/OFF) or Analog (Continuous Spectrum):",
      items: [
        { id: "lightSwitch", text: "Standard Wall Light Switch 💡", target: "digital", explanation: "Only two states: flipped UP (ON) or DOWN (OFF)." },
        { id: "volumeKnob", text: "Stereo Volume Dial 🔊", target: "analog", explanation: "Smooth continuous range from whisper quiet to ear-blasting loud." },
        { id: "doorSensor", text: "Home Security Door Sensor 🚪", target: "digital", explanation: "The door is either closed or open—no in-between!" },
        { id: "thermometer", text: "Mercury Thermometer 🌡️", target: "analog", explanation: "Temperature rises and falls continuously without skipping numbers." },
        { id: "waterFaucet", text: "Kitchen Sink Twist Faucet 🚰", target: "analog", explanation: "Can be turned for a tiny trickle, medium stream, or full blast." },
        { id: "keyboardKey", text: "Computer Keyboard Key ⌨️", target: "digital", explanation: "The key is either pressed down or released." }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Open Serial communication at 9600 baud for telemetry;", indent: 1, tag: "serial" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read the voltage ruler on Analog Pin A0 (0 to 1023);", indent: 1, tag: "read" },
        { id: "h6", line: 6, text: "    Print sensor reading to computer screen;", indent: 1, tag: "print" },
        { id: "h7", line: 7, text: "    Pause 50 milliseconds so humans can read it;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int val = analogRead(A0);", indent: 1, tag: "read" },
        { id: "c6", line: 6, text: "    Serial.println(val);", indent: 1, tag: "print" },
        { id: "c7", line: 7, text: "    delay(50);", indent: 1, tag: "delay" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Discrete Bits vs. Continuous Physics",
      pedagogy: "Middle schoolers naturally categorize their world in binary terms. Transitioning to analog concepts is the foundational threshold in physical computing: computers are discrete, but physics is continuous. The potentiometer makes voltage tactile.",
      misconceptions: [
        {
          title: "Misconception: 'Analog pins need pinMode(A0, INPUT)'",
          detail: "Students assume every pin needs pinMode(). Clarify: Analog pins A0-A5 are dedicated analog input hardware by default—analogRead() configures the internal ADC automatically!"
        }
      ],
      discussionPrompts: [
        "Why do you think Arduino chose 1024 steps instead of 100 or 1000? (Hint: powers of 2 in binary: 2^10 = 1024)",
        "What happens if you plug a digital sensor into an analog pin?"
      ],
      standards: [
        "CSTA 2-DA-07: Represent data using multiple encoding schemes.",
        "NGSS MS-PS4-3: Integrate qualitative scientific and technical information to support the claim that digitized signals are a more reliable way to encode and transmit information."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: The 3-Pin Potentiometer & Pin A0",
    shortTitle: "2. 10k Potentiometer",
    subtitle: "Meet the 3-pin rotary potentiometer: 5V power, GND, and the Analog Wiper Pin A0!",
    summary: "A potentiometer is a resistive track with a sliding contact called a Wiper. As you rotate the knob, the wiper samples voltage from 0.0V (full left GND) up to 5.0V (full right 5V). Learn how to wire all 3 pins and read it with analogRead(A0).",
    mascotMsg: "Inspect the 3 legs of the potentiometer! 🔌 Legs 1 and 3 connect across 5V and Ground, creating a highway of electricity. Leg 2 (the middle Wiper) moves along the track and sends the sampled voltage to Analog Pin A0!",
    analogy: {
      title: "The Sliding Water Dam",
      setup: "Imagine a river flowing from high mountain (5V) down to the sea (GND).",
      wiper: "The middle pin is a sliding dam gate. Slide it all the way down and you catch 0V. Slide it all the way up and you catch 5V!"
    },
    jargonBuster: [
      {
        word: "Potentiometer",
        pronunciation: "po-TEN-shee-OM-ih-ter",
        analogy: "The Rotary Knob",
        definition: "A three-terminal resistor with a rotating contact that forms an adjustable voltage divider."
      },
      {
        word: "Wiper",
        pronunciation: "WYE-per",
        analogy: "The Sliding Finger",
        definition: "The middle electrical contact that sweeps across the resistive material to sample voltage."
      },
      {
        word: "Voltage Divider",
        pronunciation: "VOL-tij dih-VYE-der",
        analogy: "The Sharing Rule",
        definition: "A circuit that produces an output voltage that is a fraction of its input voltage based on resistance."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure computer monitor display (Serial 9600 baud);", indent: 1, tag: "serial" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Sample voltage on Analog Pin A0 (0 to 1023 raw units);", indent: 1, tag: "read" },
        { id: "h6", line: 6, text: "    Calculate true Voltage = (raw * 5.0) / 1023.0;", indent: 1, tag: "math" },
        { id: "h7", line: 7, text: "    Print voltage reading to Serial Monitor;", indent: 1, tag: "print" },
        { id: "h8", line: 8, text: "    Wait 100 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int raw = analogRead(A0);", indent: 1, tag: "read" },
        { id: "c6", line: 6, text: "    float volts = (raw * 5.0) / 1023.0;", indent: 1, tag: "math" },
        { id: "c7", line: 7, text: "    Serial.println(volts);", indent: 1, tag: "print" },
        { id: "c8", line: 8, text: "    delay(100);", indent: 1, tag: "delay" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Ohm's Law in Action: Voltage Division",
      pedagogy: "Students often think potentiometers 'create' voltage. Use this lesson to clarify that the potentiometer is passive: it partitions the existing 5V supply according to the ratio of resistances: Vout = Vin * (R2 / (R1 + R2)).",
      misconceptions: [
        {
          title: "Misconception: 'If I swap the outer wires, the board will fry'",
          detail: "Students fear reversing 5V and GND on the outer pins. Reassure them: reversing the outer pins simply inverts the rotation direction (clockwise becomes 0V instead of 5V), but causes zero electrical harm!"
        }
      ],
      discussionPrompts: [
        "What happens if you disconnect the middle wiper wire?",
        "Why is it important to use a float variable when calculating decimal voltages?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that interface with hardware components."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: The map() Function (Number Translator)",
    shortTitle: "3. map() Translator",
    subtitle: "Convert 0-1023 sensor numbers into 0-180 degree robotic steering angles!",
    summary: "Our analog sensor speaks '0 to 1023', but our servo motor only understands '0 to 180 degrees'! Learn how the Arduino map() function acts as an automatic mathematical translator between completely different number ranges.",
    mascotMsg: "Math superpower unlocked! 🗺️ The map() function translates between two different number languages in a single line of code. Let's convert sensor reading 0–1023 to servo angle 0–180°!",
    analogy: {
      title: "The Currency & Language Exchange",
      problem: "You have 1023 Arcade Tokens, but the Robot Claw Machine only accepts 180 Gold Coins.",
      solution: "The map() function is the automated exchange booth: map(tokens, 0, 1023, 0, 180) perfectly converts your balance without you having to do cross-multiplication in your head!"
    },
    jargonBuster: [
      {
        word: "map()",
        pronunciation: "MAP",
        analogy: "The Proportional Scaler",
        definition: "A built-in Arduino function that linearly remaps a number from one numeric range to another."
      },
      {
        word: "Input Range",
        pronunciation: "IN-put raynj",
        analogy: "Starting Currency",
        definition: "The low and high values of the sensor (fromLow = 0, fromHigh = 1023)."
      },
      {
        word: "Output Range",
        pronunciation: "OUT-put raynj",
        analogy: "Target Currency",
        definition: "The low and high values of the target actuator (toLow = 0, toHigh = 180)."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Borrow the official Servo instruction cookbook;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Create our robot arm named myServo;", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Attach myServo signal line to PWM Pin ~9;", indent: 1, tag: "attach" },
        { id: "h6", line: 6, text: "", indent: 0, tag: "blank" },
        { id: "h7", line: 7, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "    Read the rotary knob on Pin A0 (0 to 1023);", indent: 1, tag: "read" },
        { id: "h9", line: 9, text: "    Translate sensor reading (0..1023) to motor angle (0..180°);", indent: 1, tag: "map" },
        { id: "h10", line: 10, text: "    Command servo horn to rotate to that exact angle;", indent: 1, tag: "write" },
        { id: "h11", line: 11, text: "    Wait 15ms so the plastic gears can travel smoothly;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo myServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "c4", line: 4, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    myServo.attach(9);", indent: 1, tag: "attach" },
        { id: "c6", line: 6, text: "}", indent: 0, tag: "brace" },
        { id: "c7", line: 7, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c8", line: 8, text: "    int val = analogRead(A0);", indent: 1, tag: "read" },
        { id: "c9", line: 9, text: "    int angle = map(val, 0, 1023, 0, 180);", indent: 1, tag: "map" },
        { id: "c10", line: 10, text: "    myServo.write(angle);", indent: 1, tag: "write" },
        { id: "c11", line: 11, text: "    delay(15);", indent: 1, tag: "delay" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Linear Transformations & Mathematical Modeling",
      pedagogy: "The map() function represents a linear equation y = mx + b. For middle schoolers learning slope and ratios in Pre-Algebra, this connects algebra directly to physical steering control.",
      misconceptions: [
        {
          title: "Misconception: 'map() constrains numbers automatically'",
          detail: "Students assume map() will never return numbers outside the toLow..toHigh range. Explain: if the input exceeds bounds, map() will extrapolate beyond the target range! To lock bounds, pair it with constrain()."
        }
      ],
      discussionPrompts: [
        "How would you invert the steering so turning the knob right turns the servo left? (Hint: map(val, 0, 1023, 180, 0))",
        "If the potentiometer reads 512, what angle will map() calculate?"
      ],
      standards: [
        "CCSS.MATH.CONTENT.7.RP.A.2: Recognize and represent proportional relationships between quantities."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: Robotic Steering Studio (Knob-to-Servo Live)",
    shortTitle: "4. Steering Sandbox",
    subtitle: "Turn the interactive rotary dial and watch the physical servo motor track your hand live!",
    summary: "Put everything together in the ultimate physical computing sandbox! Rotate the virtual 10k potentiometer dial with your mouse or finger, and watch the SG90 micro servo horn dynamically mirror your movements with real-time ADC telemetry and 50Hz PWM oscilloscope monitoring.",
    mascotMsg: "You are in the driver seat! 🚗 Turn the volume knob to steer the robotic servo arm. Test quick presets, observe voltage vs PWM duty cycle on the oscilloscope, and build your own steering control!",
    analogy: {
      title: "The Drive-by-Wire Steering Wheel",
      steering: "Modern airplanes and electric cars don't have physical cables connecting the steering wheel to the rudder or tires. Instead, a rotary sensor measures the driver's hand turn, computers translate it with map(), and high-torque servo motors steer the wheels!"
    },
    jargonBuster: [
      {
        word: "Drive-by-Wire",
        pronunciation: "DRIVE-bye-wire",
        analogy: "Electronic Flight Controls",
        definition: "Replacing mechanical linkages with electronic sensors and actuators commanded by software."
      },
      {
        word: "Closed-Loop Feedback",
        pronunciation: "KLOHZD-loop FEED-bak",
        analogy: "Keeping Your Eyes on the Road",
        definition: "A system where sensor measurements are continuously used to adjust the output to maintain a desired state."
      }
    ],
    presets: [
      { name: "🎛️ Live Manual Steering", potVal: 512, angle: 90, type: "manual" },
      { name: "⬅️ Full Left Lock (0V / 0°)", potVal: 0, angle: 0, type: "preset" },
      { name: "🎯 Center Neutral (2.5V / 90°)", potVal: 512, angle: 90, type: "preset" },
      { name: "➡️ Full Right Lock (5.0V / 180°)", potVal: 1023, angle: 180, type: "preset" },
      { name: "🏎️ Half-Range Slalom (45° ↔ 135°)", potVal: 768, angle: 135, type: "preset" }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "1. Include official Servo control library;", indent: 0, tag: "include" },
        { id: "h2", line: 2, text: "2. Declare servo object named steeringServo;", indent: 0, tag: "object" },
        { id: "h3", line: 3, text: "3. Constant: Potentiometer connected to Pin A0;", indent: 0, tag: "const" },
        { id: "h4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "h5", line: 5, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "    Attach steeringServo to PWM Pin 9;", indent: 1, tag: "attach" },
        { id: "h7", line: 7, text: "    Start Serial monitor at 9600 baud;", indent: 1, tag: "serial" },
        { id: "h8", line: 8, text: "", indent: 0, tag: "blank" },
        { id: "h9", line: 9, text: "REPEAT FOREVER (Continuous Control Loop):", indent: 0, tag: "header" },
        { id: "h10", line: 10, text: "    Sample knob voltage (0 to 1023);", indent: 1, tag: "read" },
        { id: "h11", line: 11, text: "    Map raw reading into steering angle (0 to 180 degrees);", indent: 1, tag: "map" },
        { id: "h12", line: 12, text: "    Write target angle to steering servo motor;", indent: 1, tag: "write" },
        { id: "h13", line: 13, text: "    Pause 15ms so servo can physically match position;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "#include <Servo.h>", indent: 0, tag: "include" },
        { id: "c2", line: 2, text: "Servo steeringServo;", indent: 0, tag: "object" },
        { id: "c3", line: 3, text: "const int potPin = A0;", indent: 0, tag: "const" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "c5", line: 5, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c6", line: 6, text: "    steeringServo.attach(9);", indent: 1, tag: "attach" },
        { id: "c7", line: 7, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "brace" },
        { id: "c9", line: 9, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c10", line: 10, text: "    int potVal = analogRead(potPin);", indent: 1, tag: "read" },
        { id: "c11", line: 11, text: "    int angle = map(potVal, 0, 1023, 0, 180);", indent: 1, tag: "map" },
        { id: "c12", line: 12, text: "    steeringServo.write(angle);", indent: 1, tag: "write" },
        { id: "c13", line: 13, text: "    delay(15);", indent: 1, tag: "delay" },
        { id: "c14", line: 14, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Synthesis: Sensor-to-Actuator Robotic Control",
      pedagogy: "This lab completes the input-process-output paradigm. Students have learned digital output (LED), mechanical PWM (Servo), and analog input (Potentiometer). Connecting all three creates an authentic, production-grade robotics controller.",
      misconceptions: [
        {
          title: "Misconception: 'The servo moves by magic without electricity from the board'",
          detail: "Remind students that the servo draws motor current (up to 200mA) while the potentiometer draws negligible sensor current (< 1mA). The Arduino acts as the intelligent controller, not the direct muscle."
        }
      ],
      discussionPrompts: [
        "How would you connect two potentiometers to control a 2-joint robot arm (shoulder and elbow)?",
        "How could we use analogRead() with a light sensor (photocell) instead of a potentiometer?"
      ],
      standards: [
        "CSTA 2-AP-16: Incorporate existing code, libraries, and hardware interfaces into original programs.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed system."
      ]
    }
  }
];

const BUTTON_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Inputs vs. Outputs (Sensors & Actors)",
    shortTitle: "1. Inputs vs Outputs",
    subtitle: "Learn how Arduino uses inputs to observe the world and outputs to take action!",
    summary: "Computers follow the IPO model: Input -> Processing -> Output. Inputs (pushbuttons, temperature sensors, cameras) collect data from the physical world. Outputs (LEDs, buzzers, motors) make physical changes. Learn to classify components and understand digitalRead().",
    mascotMsg: "Meet the senses of the robot! 🔘 Inputs are the eyes, ears, and touch sensors. Outputs are the hands, voice, and lights. Can you sort these hardware pieces into Inputs and Outputs?",
    analogy: {
      title: "The Human Nervous System",
      input: "Touching a hot stove is an INPUT: your fingertips send a signal to your brain.",
      output: "Pulling your hand away is an OUTPUT: your brain tells your arm muscles to contract!"
    },
    jargonBuster: [
      {
        word: "Digital Input",
        pronunciation: "DIJ-ih-tul IN-put",
        analogy: "The Doorbell Push",
        definition: "A pin that reads whether an electrical voltage is present (HIGH / 5V) or grounded (LOW / 0V)."
      },
      {
        word: "digitalRead()",
        pronunciation: "DIJ-ih-tul-REED",
        analogy: "Looking out the window",
        definition: "A function that checks the voltage on a specified pin and returns either HIGH or LOW."
      },
      {
        word: "State",
        pronunciation: "STAYT",
        analogy: "The Light Switch Position",
        definition: "The current condition of a digital signal or variable at any given moment in time."
      }
    ],
    sortingActivity: {
      prompt: "Sort these physical computing components into INPUTS (Sensors) or OUTPUTS (Actuators):",
      items: [
        { id: "pushbutton", text: "Tactile Pushbutton 🔘", target: "input", explanation: "Detects finger presses (INPUT)." },
        { id: "redLed", text: "Red Breadboard LED 💡", target: "output", explanation: "Emits light into the room (OUTPUT)." },
        { id: "servoMotor", text: "Micro Servo Motor 🦾", target: "output", explanation: "Physically moves an arm (OUTPUT)." },
        { id: "tempSensor", text: "Temperature Sensor 🌡️", target: "input", explanation: "Measures heat from the environment (INPUT)." },
        { id: "piezoBuzzer", text: "Audio Buzzer Speaker 📢", target: "output", explanation: "Makes sound waves in the air (OUTPUT)." },
        { id: "lightSensor", text: "Solar Light Sensor (LDR) ☀️", target: "input", explanation: "Measures brightness in the room (INPUT)." }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 2 as an INPUT with internal pullup spring;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "    Configure Pin 13 as an OUTPUT light;", indent: 1, tag: "pinMode" },
        { id: "h4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "h5", line: 5, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "    Check the voltage on Pin 2 (HIGH or LOW);", indent: 1, tag: "read" },
        { id: "h7", line: 7, text: "    Send reading to Pin 13 LED light;", indent: 1, tag: "write" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(2, INPUT_PULLUP);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c4", line: 4, text: "}", indent: 0, tag: "brace" },
        { id: "c5", line: 5, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c6", line: 6, text: "    int buttonState = digitalRead(2);", indent: 1, tag: "read" },
        { id: "c7", line: 7, text: "    digitalWrite(13, buttonState);", indent: 1, tag: "write" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "The IPO Cycle: Input -> Processing -> Output",
      pedagogy: "Before coding conditionals, students must build a clear mental model distinguishing sensors from actuators. This lesson provides the schema: sensors observe, code decides, actuators respond.",
      misconceptions: [
        {
          title: "Misconception: 'If a wire is plugged into a pin, it can do anything'",
          detail: "Remind students: digital pins must be declared with pinMode(). A pin set to OUTPUT drives current; a pin set to INPUT reads voltage without sending current."
        }
      ],
      discussionPrompts: [
        "Can a smartphone screen be both an input and an output at the same time? (Touchscreen input vs. pixel display output)",
        "What are the inputs and outputs of an autonomous robotic vacuum cleaner?"
      ],
      standards: [
        "CSTA 2-CS-01: Recommend improvements to the design of computing devices based on analysis of personal interaction."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: Floating Pins & INPUT_PULLUP",
    shortTitle: "2. INPUT_PULLUP Pin",
    subtitle: "Why unpressed wires catch static electricity, and how the internal spring resistor saves the day!",
    summary: "When a button is not pressed, an open wire is like an antenna—it catches stray electrical noise from the air (a 'Floating Pin')! Learn how Arduino's built-in INPUT_PULLUP resistor connects a gentle internal spring to 5V, keeping the pin stably HIGH until pressed to GND.",
    mascotMsg: "Watch out for ghost signals! 👻 An open input pin drifts randomly between 0 and 1. By declaring pinMode(2, INPUT_PULLUP), Arduino connects an invisible internal resistor that holds the pin at 5V until you push the button!",
    analogy: {
      title: "The Spring-Loaded Trapdoor",
      floating: "Without a spring, a trapdoor swings wildly in the wind (Floating Pin).",
      pullup: "The INPUT_PULLUP resistor is a gentle spring holding the door pulled UP (5V HIGH). When you step on the button, you overcome the spring and push it DOWN to the basement floor (GND LOW)!"
    },
    jargonBuster: [
      {
        word: "INPUT_PULLUP",
        pronunciation: "IN-put PULL-up",
        analogy: "The Internal Spring",
        definition: "A special pinMode mode that activates an internal 20k to 50k ohm resistor inside the chip connected to +5V."
      },
      {
        word: "Floating Pin",
        pronunciation: "FLOH-ting PIN",
        analogy: "Radio Antenna catching static",
        definition: "A disconnected input pin with no defined voltage that fluctuates unpredictably between HIGH and LOW."
      },
      {
        word: "Active-Low Logic",
        pronunciation: "AK-tiv LOH",
        analogy: "Inverted Button",
        definition: "A circuit where unpressed = HIGH (5V) and pressed = LOW (GND 0V)."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Attach internal pullup spring to Pin 2 (Default: HIGH);", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read Pin 2: returns HIGH when open, LOW when pressed;", indent: 1, tag: "read" },
        { id: "h6", line: 6, text: "    Wait 50 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(2, INPUT_PULLUP);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int state = digitalRead(2);", indent: 1, tag: "read" },
        { id: "c6", line: 6, text: "    delay(50);", indent: 1, tag: "delay" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Active-Low Logic & The Pullup Resistor",
      pedagogy: "Active-Low is the #1 stumbling block for beginners. Students intuitively think 'pressed = 1 (HIGH)'. Taking the time to visualize the pull-up resistor holding 5V until connected to GND prevents weeks of inverted logic bugs.",
      misconceptions: [
        {
          title: "Misconception: 'Connecting a pin directly to GND causes a short circuit'",
          detail: "Students worry that pressing the button shorts the board. Explain: the internal 30,000 ohm pull-up resistor safely limits current to a tiny 0.16 milliamps—completely safe!"
        }
      ],
      discussionPrompts: [
        "Why is it cheaper and easier to use INPUT_PULLUP instead of soldering an external resistor on a breadboard?",
        "If button unpressed is HIGH, what condition checks if the button is pressed? (buttonState == LOW)"
      ],
      standards: [
        "CSTA 2-AP-10: Use flowcharts and/or pseudocode to address complex problems as algorithms."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: The Doorbell Logic (if / else)",
    shortTitle: "3. Doorbell If-Else",
    subtitle: "Press the tactile button to complete the circuit and activate the LED or buzzer!",
    summary: "Conditional branching (if/else) gives the computer the power to make choices! If the button is pressed (LOW), turn the LED ON. Otherwise (else), keep it OFF. Master the building block of all computer decision-making.",
    mascotMsg: "Time to make decisions! 🔔 The if/else statement is the fork in the road of code. Press the virtual tactile button and watch the LED light up instantly!",
    analogy: {
      title: "The Fork in the Road",
      condition: "IF it is raining outside -> Put on your raincoat!",
      otherwise: "ELSE -> Wear your sunglasses and enjoy the sunshine!"
    },
    jargonBuster: [
      {
        word: "if Statement",
        pronunciation: "IF STAYT-ment",
        analogy: "The Decision Gate",
        definition: "A programming structure that runs a block of code only when a condition is TRUE."
      },
      {
        word: "else Statement",
        pronunciation: "ELS STAYT-ment",
        analogy: "The Backup Plan",
        definition: "The block of code that runs automatically when the if condition is FALSE."
      },
      {
        word: "Equality Operator (==)",
        pronunciation: "DUB-ul EE-kwuls",
        analogy: "The Balance Scale",
        definition: "A comparison check: 'Does the left side equal the right side?'. Single '=' assigns; double '==' compares!"
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 2 with internal pullup spring (Button);", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "    Configure Pin 13 as output (LED Light);", indent: 1, tag: "pinMode" },
        { id: "h4", line: 4, text: "", indent: 0, tag: "blank" },
        { id: "h5", line: 5, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h6", line: 6, text: "    Read the pushbutton on Pin 2;", indent: 1, tag: "read" },
        { id: "h7", line: 7, text: "    IF button is PRESSED (equals LOW):", indent: 1, tag: "if" },
        { id: "h8", line: 8, text: "        Turn ON the LED light (5V HIGH);", indent: 2, tag: "write" },
        { id: "h9", line: 9, text: "    OTHERWISE (Button is released):", indent: 1, tag: "else" },
        { id: "h10", line: 10, text: "        Turn OFF the LED light (0V LOW);", indent: 2, tag: "write" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(2, INPUT_PULLUP);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c4", line: 4, text: "}", indent: 0, tag: "brace" },
        { id: "c5", line: 5, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c6", line: 6, text: "    int button = digitalRead(2);", indent: 1, tag: "read" },
        { id: "c7", line: 7, text: "    if (button == LOW) {", indent: 1, tag: "if" },
        { id: "c8", line: 8, text: "        digitalWrite(13, HIGH);", indent: 2, tag: "write" },
        { id: "c9", line: 9, text: "    } else {", indent: 1, tag: "else" },
        { id: "c10", line: 10, text: "        digitalWrite(13, LOW);", indent: 2, tag: "write" },
        { id: "c11", line: 11, text: "    }", indent: 1, tag: "brace" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Conditional Branching & Boolean Expressions",
      pedagogy: "Students encounter conditionals across all programming languages. Emphasize the syntax distinction between assignment (=) and comparison (==), which causes 80% of student bugs in C++.",
      misconceptions: [
        {
          title: "Misconception: 'Using if (button = LOW)'",
          detail: "Students accidentally type single '='. In C++, single '=' forcefully overwrites the variable with 0 (LOW), causing the condition to always be FALSE!"
        }
      ],
      discussionPrompts: [
        "How would you change the code so the LED turns OFF when pressed and stays ON when released? (Reverse HIGH and LOW)",
        "Could we connect the servo motor here to open a security door whenever the button is pressed?"
      ],
      standards: [
        "CSTA 2-AP-12: Design and iteratively develop programs that combine control structures, including conditionals."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: The Smart Light Toggle Switch (State Memory)",
    shortTitle: "4. Toggle Switch",
    subtitle: "Program a state-memory toggle: tap once to turn ON, tap again to turn OFF!",
    summary: "A momentary button only stays on while your finger is pressing it down. But real smart switches remember their state! Learn how to use a boolean memory variable to toggle between ON and OFF with every tap.",
    mascotMsg: "Upgrade to smart lighting! 💡 Instead of holding the button down forever, we'll teach Arduino to remember: tap once to turn ON, tap again to turn OFF. Welcome to state memory!",
    analogy: {
      title: "The Push-to-Click Pen",
      pen: "Think of a ballpoint pen: you click it down once, and the pen tip stays locked out even after your thumb leaves! Click it again, and the spring releases it. That is state memory!"
    },
    jargonBuster: [
      {
        word: "State Variable",
        pronunciation: "STAYT VAIR-ee-uh-bul",
        analogy: "The Notepad Memory",
        definition: "A variable (like ledState = true) that remembers what the circuit was doing in the past."
      },
      {
        word: "Boolean (bool)",
        pronunciation: "BOO-lee-un",
        analogy: "True or False Flag",
        definition: "A data type that can only store one of two values: true (1) or false (0)."
      },
      {
        word: "Inversion Operator (!)",
        pronunciation: "NOT OP-er-ay-ter",
        analogy: "The Opposite Switch",
        definition: "Flips true to false, or false to true. Example: ledState = !ledState."
      }
    ],
    presets: [
      { name: "🔘 Push-and-Hold (Momentary)", mode: "momentary", text: "LED only lights while held down" },
      { name: "💡 Tap-to-Toggle (Smart Switch)", mode: "toggle", text: "Tap once = ON, tap again = OFF" },
      { name: "🚨 Security Alarm Trigger", mode: "alarm", text: "Tap once = Continuous siren strobe" }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "Memory: Create boolean flag ledState = false (starts OFF);", indent: 0, tag: "var" },
        { id: "h2", line: 2, text: "", indent: 0, tag: "blank" },
        { id: "h3", line: 3, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "    Configure Pin 2 with internal pullup spring (Button);", indent: 1, tag: "pinMode" },
        { id: "h5", line: 5, text: "    Configure Pin 13 as output (LED Light);", indent: 1, tag: "pinMode" },
        { id: "h6", line: 6, text: "", indent: 0, tag: "blank" },
        { id: "h7", line: 7, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "    IF button is PRESSED (LOW):", indent: 1, tag: "if" },
        { id: "h9", line: 9, text: "        Flip ledState to its opposite: ledState = !ledState;", indent: 2, tag: "math" },
        { id: "h10", line: 10, text: "        Update Pin 13 LED to match ledState;", indent: 2, tag: "write" },
        { id: "h11", line: 11, text: "        Debounce pause: wait 250ms for finger to release;", indent: 2, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "bool ledState = false;", indent: 0, tag: "var" },
        { id: "c2", line: 2, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c3", line: 3, text: "    pinMode(2, INPUT_PULLUP);", indent: 1, tag: "pinMode" },
        { id: "c4", line: 4, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c5", line: 5, text: "}", indent: 0, tag: "brace" },
        { id: "c6", line: 6, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c7", line: 7, text: "    if (digitalRead(2) == LOW) {", indent: 1, tag: "if" },
        { id: "c8", line: 8, text: "        ledState = !ledState;", indent: 2, tag: "math" },
        { id: "c9", line: 9, text: "        digitalWrite(13, ledState);", indent: 2, tag: "write" },
        { id: "c10", line: 10, text: "        delay(250);", indent: 2, tag: "delay" },
        { id: "c11", line: 11, text: "    }", indent: 1, tag: "brace" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "State Machines & Contact Debouncing",
      pedagogy: "Students experience how computers handle mechanical switches. Real metallic switches bounce microscopically over 5-10ms; the simple delay(250) introduces the essential concept of software debouncing.",
      misconceptions: [
        {
          title: "Misconception: 'Without delay, it flips cleanly'",
          detail: "Show students what happens without delay(250): the loop executes thousands of times per second while the finger touches the button, causing the LED to flicker uncontrollably!"
        }
      ],
      discussionPrompts: [
        "Why is the exclamation point (!) called the NOT operator?",
        "How would you connect this toggle code to open and close a garage door?"
      ],
      standards: [
        "CSTA 2-AP-13: Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs."
      ]
    }
  }
];

const BUZZER_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Sound Waves & Frequency (Hz)",
    shortTitle: "1. Waves & Pitch",
    subtitle: "How vibrating a ceramic crystal thousands of times a second creates sound!",
    summary: "Sound is moving air. A Piezo buzzer contains a flexible ceramic crystal disc. When Arduino sends alternating electrical pulses, the crystal bends back and forth, pushing air molecules to create sound waves! Learn how frequency (Hertz / Hz) controls pitch from deep bass to high squeaks.",
    mascotMsg: "Get ready to make some noise! 📢 Unlike an LED that makes photons of light, a buzzer makes physical waves in the air. The faster Arduino flips Pin 8 between 5V and 0V, the higher the pitch sounds!",
    analogy: {
      title: "The Hummingbird Wing vs. The Bumblebee",
      low: "A bumblebee flaps its wings 150 times per second -> Low bass hum (150 Hz).",
      high: "A mosquito flaps its wings 800 times per second -> Piercing high whine (800 Hz)!"
    },
    jargonBuster: [
      {
        word: "Frequency (Hertz / Hz)",
        pronunciation: "FREE-kwen-see (HERTS)",
        analogy: "Flaps per second",
        definition: "The number of complete sound wave cycles vibrating per second. 1 Hz = 1 vibration per second; 440 Hz = 440 vibrations per second."
      },
      {
        word: "tone(pin, frequency)",
        pronunciation: "TOHN",
        analogy: "The Pitch Caller",
        definition: "A built-in Arduino function that generates a 50% duty cycle square wave of the specified frequency on a digital pin."
      },
      {
        word: "noTone(pin)",
        pronunciation: "NO-tohn",
        analogy: "Hitting the Mute Button",
        definition: "Stops the generation of square wave pulses on the specified pin, returning the buzzer to complete silence."
      },
      {
        word: "Piezoelectric Effect",
        pronunciation: "pee-AY-zoh-ee-LEK-trik",
        analogy: "The Bending Crystal",
        definition: "The physical property where certain crystals expand and contract when voltage is applied across them."
      }
    ],
    sortingActivity: {
      prompt: "Sort these real-world sounds by their Audio Frequency Spectrum (Low Bass vs High Treble):",
      items: [
        { id: "thunder", text: "Distant Thunder Rumble ⛈️", target: "bass", explanation: "Low frequencies (20 Hz - 100 Hz)." },
        { id: "humanVoice", text: "Human Speaking Voice 🗣️", target: "mid", explanation: "Middle human speech frequencies (300 Hz - 3,000 Hz)." },
        { id: "smokeAlarm", text: "Kitchen Smoke Alarm Beep 🚨", target: "treble", explanation: "Piercing high-frequency safety alert (3,000 Hz - 4,000 Hz)." },
        { id: "bassGuitar", text: "Bass Guitar Low E-String 🎸", target: "bass", explanation: "Low bass note vibrating at 41 Hz." },
        { id: "whistle", text: "Referee High Whistle ⚽", target: "treble", explanation: "High shrill pitch around 3,500 Hz." },
        { id: "acousticGuitar", text: "Acoustic Guitar Strumming 🎵", target: "mid", explanation: "Rich harmonic mid-range frequencies (200 Hz - 1,200 Hz)." }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure serial monitor for frequency telemetry;", indent: 1, tag: "serial" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Play Concert A note: tone(8, 440 Hz);", indent: 1, tag: "tone" },
        { id: "h6", line: 6, text: "    Hold sound for 1000 milliseconds (1 full second);", indent: 1, tag: "delay" },
        { id: "h7", line: 7, text: "    Silence the buzzer: noTone(8);", indent: 1, tag: "notone" },
        { id: "h8", line: 8, text: "    Pause in quiet for 1000 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    // Pin 8 will automatically generate square waves!", indent: 1, tag: "comment" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    tone(8, 440);", indent: 1, tag: "tone" },
        { id: "c6", line: 6, text: "    delay(1000);", indent: 1, tag: "delay" },
        { id: "c7", line: 7, text: "    noTone(8);", indent: 1, tag: "notone" },
        { id: "c8", line: 8, text: "    delay(1000);", indent: 1, tag: "delay" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Acoustics & Digital Signal Generation",
      pedagogy: "Students intuitively understand sound volume, but frequently conflate volume with pitch. Connecting Hertz (cycles per second) directly to the square-wave oscillation of Pin 8 anchors physics (frequency) to computational timing.",
      misconceptions: [
        {
          title: "Misconception: 'Does tone() need pinMode(8, OUTPUT)?'",
          detail: "Students assume pinMode is required. Clarify: the tone() function automatically configures the internal hardware timer and arms the designated pin as an output!"
        },
        {
          title: "Misconception: 'Can Arduino play multiple chords simultaneously?'",
          detail: "Arduino Uno only has 3 hardware timers. The standard tone() library can only play one frequency at a time (monophonic), not 3-note chords (polyphonic)."
        }
      ],
      discussionPrompts: [
        "Why can dogs hear dog whistles (above 20,000 Hz) while humans hear complete silence?",
        "If you increase the frequency from 440 Hz to 880 Hz, what does the musical note sound like? (Hint: exactly one octave higher!)"
      ],
      standards: [
        "NGSS MS-PS4-1: Use mathematical representations to describe a simple model for waves that includes frequency and wavelength.",
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that interface with hardware components."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: The Emergency Alarm Siren (Alternating Tones)",
    shortTitle: "2. Alarm Siren",
    subtitle: "Program a high-low dual frequency European emergency vehicle siren!",
    summary: "Single beeps are easy for human brains to tune out. Emergency vehicles (police, ambulances) alternate between two distinct frequencies (e.g. 600 Hz and 900 Hz) to demand immediate attention. Learn how to sequence alternating frequencies with precision delay timers.",
    mascotMsg: "Wee-Woo-Wee-Woo! 🚨 Emergency vehicles alternate two frequencies to grab attention instantly. Let's program an authentic two-tone alarm siren using tone() and delay()!",
    analogy: {
      title: "The Two-Step Ladder",
      low: "Step 1: Low Tone (650 Hz) sounds like the deep breath.",
      high: "Step 2: High Tone (950 Hz) sounds like the sharp warning shout!"
    },
    jargonBuster: [
      {
        word: "Siren Alternation",
        pronunciation: "SY-ren ol-ter-NAY-shun",
        analogy: "The Warning Ping-Pong",
        definition: "Switching back and forth between two dissonant acoustic frequencies."
      },
      {
        word: "tone(pin, freq, duration)",
        pronunciation: "DUR-ay-shun",
        analogy: "Self-Stopping Timer",
        definition: "A version of tone() where Arduino automatically turns the sound off after duration milliseconds without needing noTone()."
      }
    ],
    sirenPresets: [
      { name: "🚨 European Police Siren", low: 650, high: 950, stepDelay: 350 },
      { name: "⚡ Fast Cyber Strobe", low: 800, high: 1400, stepDelay: 120 },
      { name: "🛸 Sci-Fi Laser Warp", low: 300, high: 1800, stepDelay: 80 },
      { name: "⚠️ Submarine Dive Alarm", low: 400, high: 600, stepDelay: 500 }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Buzzer is ready on Pin 8;", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Siren Cycle):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    1. Play Low Warning Tone: tone(8, 650 Hz);", indent: 1, tag: "toneLow" },
        { id: "h6", line: 6, text: "    2. Hold for 350 milliseconds;", indent: 1, tag: "delay1" },
        { id: "h7", line: 7, text: "    3. Play High Warning Tone: tone(8, 950 Hz);", indent: 1, tag: "toneHigh" },
        { id: "h8", line: 8, text: "    4. Hold for 350 milliseconds;", indent: 1, tag: "delay2" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    // Hardware timer initialized", indent: 1, tag: "comment" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    tone(8, 650);", indent: 1, tag: "toneLow" },
        { id: "c6", line: 6, text: "    delay(350);", indent: 1, tag: "delay1" },
        { id: "c7", line: 7, text: "    tone(8, 950);", indent: 1, tag: "toneHigh" },
        { id: "c8", line: 8, text: "    delay(350);", indent: 1, tag: "delay2" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Auditory Perception & Safety Engineering",
      pedagogy: "Real-world engineering balances human psychology and electrical constraints. Sirens leverage human psychoacoustics: the human ear is most sensitive between 1,000 Hz and 3,000 Hz. Alternating frequencies prevents auditory habituation.",
      misconceptions: [
        {
          title: "Misconception: 'Calling tone() with a new frequency requires noTone() first'",
          detail: "Students think they must call noTone() before playing a new pitch. In Arduino, calling tone() with a new frequency seamlessly updates the timer register on the fly without silence!"
        }
      ],
      discussionPrompts: [
        "Why do fire trucks use alternating frequencies instead of a steady solid beep?",
        "What happens if you decrease the delay between tones from 350ms to 20ms? (It creates a robotic warble sound!)"
      ],
      standards: [
        "CSTA 2-AP-10: Use flowcharts and/or pseudocode to address complex problems as algorithms."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: Musical Melodies & Note Arrays",
    shortTitle: "3. Song Melodies",
    subtitle: "Store frequencies in arrays to play genuine musical songs!",
    summary: "Instead of writing dozens of repetitive lines of code, real programmers store musical notes inside an Array: a numbered list of values in memory. Discover how a for-loop steps through the array note-by-note to play authentic songs!",
    mascotMsg: "Time to play music! 🎵 Every musical note has a sacred frequency: Middle C is 262 Hz, D is 294 Hz, E is 330 Hz. We'll store them in a single array and let a loop conduct the orchestra!",
    analogy: {
      title: "The Digital Music Box Barrel",
      musicBox: "In an antique mechanical music box, a metal cylinder has little pins sticking out. As it turns, each pin plucks a tooth. An array is the digital cylinder, and a for-loop turns the crank!"
    },
    jargonBuster: [
      {
        word: "Array (int melody[])",
        pronunciation: "uh-RAY",
        analogy: "The Egg Carton",
        definition: "A variable that holds multiple numbered items of the same data type in sequential order."
      },
      {
        word: "for Loop",
        pronunciation: "FOR-loop",
        analogy: "The Step Counter",
        definition: "A loop that repeats a block of code a set number of times (e.g. from note 0 to note 7)."
      },
      {
        word: "Musical Pitch (C4, D4...)",
        pronunciation: "PITCH",
        analogy: "The Piano Key",
        definition: "Standardized frequency values corresponding to the western 12-tone chromatic musical scale."
      }
    ],
    songs: [
      {
        id: "twinkle",
        name: "⭐ Twinkle, Twinkle Little Star",
        notes: [
          { name: "C4", freq: 262, dur: 400 },
          { name: "C4", freq: 262, dur: 400 },
          { name: "G4", freq: 392, dur: 400 },
          { name: "G4", freq: 392, dur: 400 },
          { name: "A4", freq: 440, dur: 400 },
          { name: "A4", freq: 440, dur: 400 },
          { name: "G4", freq: 392, dur: 800 }
        ]
      },
      {
        id: "scale",
        name: "🎹 C-Major Musical Scale",
        notes: [
          { name: "C4", freq: 262, dur: 350 },
          { name: "D4", freq: 294, dur: 350 },
          { name: "E4", freq: 330, dur: 350 },
          { name: "F4", freq: 349, dur: 350 },
          { name: "G4", freq: 392, dur: 350 },
          { name: "A4", freq: 440, dur: 350 },
          { name: "B4", freq: 494, dur: 350 },
          { name: "C5", freq: 523, dur: 600 }
        ]
      },
      {
        id: "mario",
        name: "🍄 Retro Gaming Fanfare",
        notes: [
          { name: "E5", freq: 659, dur: 150 },
          { name: "E5", freq: 659, dur: 150 },
          { name: "rest", freq: 0, dur: 150 },
          { name: "E5", freq: 659, dur: 150 },
          { name: "rest", freq: 0, dur: 150 },
          { name: "C5", freq: 523, dur: 150 },
          { name: "E5", freq: 659, dur: 300 },
          { name: "G5", freq: 784, dur: 500 }
        ]
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "Music Sheet: Define array of 8 frequencies (C-Major Scale);", indent: 0, tag: "array" },
        { id: "h2", line: 2, text: "", indent: 0, tag: "blank" },
        { id: "h3", line: 3, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "    FOR each note in our song (from 0 to 7):", indent: 1, tag: "for" },
        { id: "h5", line: 5, text: "        Play note frequency on Pin 8 for 350 ms;", indent: 2, tag: "tone" },
        { id: "h6", line: 6, text: "        Pause briefly so notes don't blur together;", indent: 2, tag: "delay" },
        { id: "h7", line: 7, text: "", indent: 0, tag: "blank" },
        { id: "h8", line: 8, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h9", line: 9, text: "    (Song has finished playing)", indent: 1, tag: "comment" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "int melody[] = { 262, 294, 330, 349, 392, 440, 494, 523 };", indent: 0, tag: "array" },
        { id: "c2", line: 2, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c3", line: 3, text: "    for (int i = 0; i < 8; i++) {", indent: 1, tag: "for" },
        { id: "c4", line: 4, text: "        tone(8, melody[i], 350);", indent: 2, tag: "tone" },
        { id: "c5", line: 5, text: "        delay(400);", indent: 2, tag: "delay" },
        { id: "c6", line: 6, text: "    }", indent: 1, tag: "brace" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "brace" },
        { id: "c8", line: 8, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c9", line: 9, text: "    // Song plays once at startup", indent: 1, tag: "comment" },
        { id: "c10", line: 10, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Data Structures & Iterative Algorithms",
      pedagogy: "Arrays represent the bridge between basic scalar variables and data structures. Playing melodies connects linear array indexing (index 0 to n-1) directly to auditory gratification.",
      misconceptions: [
        {
          title: "Misconception: 'Array indices start at 1'",
          detail: "Students frequently write melody[1] expecting the first note. Emphasize zero-based indexing: computer scientists always count starting from zero: index 0 is the first item!"
        }
      ],
      discussionPrompts: [
        "How would you change the for-loop so the song plays backwards from high pitch to low pitch? (Hint: for (int i = 7; i >= 0; i--))",
        "Could we store a second array for note durations so some notes play fast and some play long?"
      ],
      standards: [
        "CSTA 2-AP-11: Create clearly named variables that represent different data types and perform operations on their values.",
        "CSTA 2-AP-14: Create procedures with parameters to organize code and make it reusable."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: The 8-Key Synthesizer Studio",
    shortTitle: "4. Piano Studio",
    subtitle: "Play real-time musical notes on an interactive electronic piano synthesizer!",
    summary: "Welcome to the physical computing music studio! Press and hold piano keys with your mouse or keyboard, and watch the virtual piezo buzzer emit genuine Web Audio square waves with live frequency readouts and real-time oscilloscope visualization.",
    mascotMsg: "Unleash your inner musician! 🎹 Click or hold the piano keys below to play real musical scales. Observe how high frequencies compress the square wave on the oscilloscope!",
    analogy: {
      title: "The Electronic Piano Synthesizer",
      keyboard: "Every key on a piano hits a string cut to a precise length. In physical computing, pressing a key tells Arduino to instantly vibrate Pin 8 at that exact scientific frequency!"
    },
    jargonBuster: [
      {
        word: "Synthesizer",
        pronunciation: "SIN-thuh-sy-zer",
        analogy: "The Sound Maker",
        definition: "An electronic musical instrument that generates audio signals by converting electrical voltages into sound."
      },
      {
        word: "Octave",
        pronunciation: "OK-tiv",
        analogy: "The Double Pitch",
        definition: "The interval between one musical pitch and another with double its frequency (e.g. C4 = 262Hz, C5 = 523Hz)."
      }
    ],
    pianoKeys: [
      { note: "C4", name: "Do", freq: 262, key: "A" },
      { note: "D4", name: "Re", freq: 294, key: "S" },
      { note: "E4", name: "Mi", freq: 330, key: "D" },
      { note: "F4", name: "Fa", freq: 349, key: "F" },
      { note: "G4", name: "Sol", freq: 392, key: "G" },
      { note: "A4", name: "La", freq: 440, key: "H" },
      { note: "B4", name: "Ti", freq: 494, key: "J" },
      { note: "C5", name: "Do", freq: 523, key: "K" }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "Constants: Buzzer connected to Pin 8;", indent: 0, tag: "const" },
        { id: "h2", line: 2, text: "", indent: 0, tag: "blank" },
        { id: "h3", line: 3, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "    Initialize Serial monitor at 9600 baud for music telemetry;", indent: 1, tag: "serial" },
        { id: "h5", line: 5, text: "", indent: 0, tag: "blank" },
        { id: "h6", line: 6, text: "REPEAT FOREVER (Interactive Synthesizer):", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "    Check which piano key is pressed down;", indent: 1, tag: "read" },
        { id: "h8", line: 8, text: "    IF a key is held -> Play its note frequency: tone(8, noteFreq);", indent: 1, tag: "if" },
        { id: "h9", line: 9, text: "    OTHERWISE -> Silence the buzzer: noTone(8);", indent: 1, tag: "else" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "const int buzzerPin = 8;", indent: 0, tag: "const" },
        { id: "c2", line: 2, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c3", line: 3, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c4", line: 4, text: "}", indent: 0, tag: "brace" },
        { id: "c5", line: 5, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c6", line: 6, text: "    // Real-time keyboard input listener", indent: 1, tag: "comment" },
        { id: "c7", line: 7, text: "    if (isKeyPressed()) {", indent: 1, tag: "if" },
        { id: "c8", line: 8, text: "        tone(buzzerPin, getActiveFreq());", indent: 2, tag: "tone" },
        { id: "c9", line: 9, text: "    } else {", indent: 1, tag: "else" },
        { id: "c10", line: 10, text: "        noTone(buzzerPin);", indent: 2, tag: "notone" },
        { id: "c11", line: 11, text: "    }", indent: 1, tag: "brace" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Synthesis & Interactive Expressive Computing",
      pedagogy: "This sandbox connects tactile user interface controls to digital sound synthesis. Students experience the real-time responsiveness of event-driven programming, seeing how low-latency computing produces musical art.",
      misconceptions: [
        {
          title: "Misconception: 'Computer audio requires MP3 audio files'",
          detail: "Students assume sound requires large audio recordings. Highlight that pure tone synthesis generates waveforms mathematically using code, costing zero megabytes of storage!"
        }
      ],
      discussionPrompts: [
        "How did early arcade games like Pac-Man and Space Invaders create their music using just simple square wave tone generators?",
        "Could we connect an ultrasonic distance sensor so moving your hand closer or further plays higher or lower notes like a Theremin?"
      ],
      standards: [
        "CSTA 2-AP-16: Incorporate existing code, libraries, and hardware interfaces into original programs.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed system."
      ]
    }
  }
];

const LDR_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Photons & Photoresistance (Lux)",
    shortTitle: "1. Photons & Light",
    subtitle: "How sunlight knocks electrons loose to let electrical current flow!",
    summary: "An LDR (Light Dependent Resistor / Photoresistor) is made of a special semiconductor material (Cadmium Sulfide). In total darkness, its electrons are locked in place, offering massive electrical resistance (up to 100,000 Ohms!). When sunlight shines on it, incoming photons knock electrons free, creating conductive paths that drop its resistance to just 500 Ohms!",
    mascotMsg: "Meet the eyes of your Arduino! ☀️ Unlike a human eye that has retinas, an Arduino uses an LDR to feel how bright or dark a room is. The more photons hit the squiggly ceramic face, the lower its electrical resistance drops!",
    analogy: {
      title: "The Solar Highway Tollbooth",
      dark: "Midnight: Only 1 toll lane is open -> High traffic resistance (100kΩ) -> Barely any cars pass.",
      bright: "Bright Noon Sun: 100 toll lanes fling wide open -> Low traffic resistance (500Ω) -> Cars zoom freely!"
    },
    jargonBuster: [
      {
        word: "LDR (Photoresistor)",
        pronunciation: "EL-dee-ar (FOH-toh-ree-ZIS-ter)",
        analogy: "The Light-Sensitive Sponge",
        definition: "A sensor component whose electrical resistance decreases dramatically as light intensity shining on it increases."
      },
      {
        word: "Lux",
        pronunciation: "LUHKS",
        analogy: "Brightness Thermometer",
        definition: "The scientific unit measuring light intensity hitting a surface. 0 lux is pitch darkness; 100,000 lux is blinding summer sunlight."
      },
      {
        word: "analogRead(A1)",
        pronunciation: "AN-uh-log REED",
        analogy: "The Digital Light Gauge",
        definition: "Reads analog voltage at pin A1 and converts it into a number between 0 (complete darkness) and 1023 (blinding bright)."
      },
      {
        word: "Photons",
        pronunciation: "FOH-tonz",
        analogy: "Light Raindrops",
        definition: "Tiny elementary particles of light that travel at lightspeed and knock electrons free inside the photoresistor."
      }
    ],
    sortingActivity: {
      prompt: "Sort these environments by their Ambient Light Level (Darkness vs Daylight):",
      items: [
        { id: "darkCloset", text: "Pitch-Black Bedroom Closet 🚪", target: "dark", explanation: "Less than 1 lux. Resistance climbs over 100,000 Ohms!" },
        { id: "livingRoom", text: "Cozy Living Room at Sunset 🛋️", target: "dim", explanation: "Roughly 100 to 300 lux. Comfortable indoor lighting." },
        { id: "noonSun", text: "Direct Noon Summer Sunlight ☀️", target: "bright", explanation: "Over 50,000 lux! Resistance drops below 500 Ohms." },
        { id: "moonlitNight", text: "Moonlit Park at Midnight 🌙", target: "dark", explanation: "About 0.1 to 1 lux. Very high resistance." },
        { id: "classroom", text: "Bright Fluorescent Classroom 🏫", target: "bright", explanation: "Roughly 500 to 1,000 lux. Clear, bright study illumination." },
        { id: "cloudySky", text: "Overcast Rainy Afternoon ☁️", target: "dim", explanation: "Roughly 1,000 to 2,000 lux. Diffused moderate sunlight." }
      ]
    },
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Open computer monitor at 9600 baud for light readings;", indent: 1, tag: "serial" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read ambient light voltage from Pin A1 (0 to 1023);", indent: 1, tag: "analogRead" },
        { id: "h6", line: 6, text: "    Print light reading to computer screen;", indent: 1, tag: "serial" },
        { id: "h7", line: 7, text: "    Wait 200 milliseconds before reading again;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int lightVal = analogRead(A1);", indent: 1, tag: "analogRead" },
        { id: "c6", line: 6, text: "    Serial.println(lightVal);", indent: 1, tag: "serial" },
        { id: "c7", line: 7, text: "    delay(200);", indent: 1, tag: "delay" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Semiconductors & Photoelectric Sensing",
      pedagogy: "Students often believe sensors 'generate' electricity like tiny batteries. Clarify: the LDR is a passive resistor whose internal atomic structure alters resistance in response to incoming light energy.",
      misconceptions: [
        {
          title: "Misconception: 'Does an LDR output volts directly?'",
          detail: "An LDR only changes resistance (Ohms), not voltage. To measure it with Arduino's ADC, we MUST pair it with a fixed resistor in a voltage divider circuit!"
        }
      ],
      discussionPrompts: [
        "Why does your smartphone screen automatically dim when you are under bed blankets and brighten when stepping outdoors?",
        "If an LDR's resistance drops in bright light, what happens to current flowing through it according to Ohm's Law (I = V / R)?"
      ],
      standards: [
        "CSTA 2-CS-02: Design projects that combine hardware and software components to collect and exchange data.",
        "NGSS MS-PS4-2: Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: The Voltage Divider Circuit (LDR + 10kΩ)",
    shortTitle: "2. Voltage Divider",
    subtitle: "Turning variable resistance into measurable 0–5V analog voltage!",
    summary: "Arduino's analog pins only understand voltage (0V to 5V), not raw resistance. If you connected an LDR directly between 5V and Pin A1, Pin A1 would always see 5V! By pairing the LDR with a fixed 10,000 Ohm (10kΩ) partner resistor to GND, the two form a tug-of-war voltage divider. When light changes, the balance point between them shifts, creating a changing voltage that Arduino can read!",
    mascotMsg: "Think of a voltage divider as an electrical tug-of-war! 🪢 5V pulls up, GND pulls down. When sunlight makes the LDR super conductive, 5V wins and Pin A1 reads high. When darkness sets in, the 10k resistor pulls Pin A1 down to GND!",
    analogy: {
      title: "The Playground Seesaw",
      bright: "Bright Sun: LDR becomes super light (500Ω) -> 5V side lifts up high -> High voltage (~4.5V).",
      dark: "Dark Night: LDR becomes super heavy (100kΩ) -> GND side pulls down low -> Low voltage (~0.5V)."
    },
    jargonBuster: [
      {
        word: "Voltage Divider",
        pronunciation: "VOHL-tij dih-VY-der",
        analogy: "The Electrical Seesaw",
        definition: "A circuit of two resistors in series that scales a large voltage down to a smaller proportion based on their resistance ratio."
      },
      {
        word: "Fixed Partner Resistor (10kΩ)",
        pronunciation: "FIKST ree-ZIS-ter",
        analogy: "The Anchor Weight",
        definition: "A standard 10,000-Ohm reference resistor connected to GND that gives the changing LDR something steady to balance against."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Start computer serial monitor;", indent: 1, tag: "serial" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read analog voltage divider value from Pin A1;", indent: 1, tag: "analogRead" },
        { id: "h6", line: 6, text: "    Calculate real voltage: volts = (sensorVal * 5.0) / 1023.0;", indent: 1, tag: "math" },
        { id: "h7", line: 7, text: "    Print voltage to screen;", indent: 1, tag: "serial" },
        { id: "h8", line: 8, text: "    Wait 100 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    Serial.begin(9600);", indent: 1, tag: "serial" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int raw = analogRead(A1);", indent: 1, tag: "analogRead" },
        { id: "c6", line: 6, text: "    float volts = (raw * 5.0) / 1023.0;", indent: 1, tag: "math" },
        { id: "c7", line: 7, text: "    Serial.println(volts);", indent: 1, tag: "serial" },
        { id: "c8", line: 8, text: "    delay(100);", indent: 1, tag: "delay" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Ohm's Law in Sensor Interfacing",
      pedagogy: "The voltage divider equation Vout = Vin * (R2 / (R1 + R2)) is one of the most practical formulas in electronics. Showing students how variable resistance creates variable voltage demystifies all analog sensors (temperature, pressure, flex).",
      misconceptions: [
        {
          title: "Misconception: 'Why can't we use a 220Ω resistor instead of 10kΩ?'",
          detail: "If the partner resistor is only 220Ω, when the LDR reaches 100kΩ in the dark, the division is too extreme and the dynamic voltage range collapses. 10kΩ matches the geometric center of the LDR's range!"
        }
      ],
      discussionPrompts: [
        "If you swap the LDR and the 10k resistor positions, does the voltage reading go UP or DOWN when light shines on it?",
        "Where else might voltage dividers be used inside electronic devices like guitars or stereos?"
      ],
      standards: [
        "NGSS MS-PS3-3: Apply scientific principles to design, construct, and test a device that either minimizes or maximizes thermal/electrical transfer."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: The Dark Detector Threshold (if/else)",
    shortTitle: "3. Dark Threshold",
    subtitle: "Setting an intelligent tripwire number for automatic nightfall detection!",
    summary: "Now that Arduino reads ambient light as a number from 0 to 1023, we can program it to make intelligent decisions! A threshold is a boundary line. If the reading drops below our threshold (e.g. 400), night has fallen, so turn ON the streetlight LED. If the reading rises above 400, sunrise has arrived, so turn the light OFF to save electricity!",
    mascotMsg: "You're writing the exact brain logic used in municipal city streetlights! 🏙️ Cities save millions of dollars by using automated LDR threshold circuits instead of human workers driving around flipping switches at dusk.",
    analogy: {
      title: "The Thermostat on the Wall",
      concept: "Just like an AC turns on when temperature crosses 75°F, our streetlight turns on when darkness crosses our light threshold!"
    },
    jargonBuster: [
      {
        word: "Threshold",
        pronunciation: "THRESH-hohld",
        analogy: "The Line in the Sand",
        definition: "A specific cutoff value used in conditional statements (if/else) to trigger an automated action when crossed."
      },
      {
        word: "Comparator Logic",
        pronunciation: "kum-PAIR-uh-ter",
        analogy: "The Security Guard Check",
        definition: "Comparing a live sensor reading against a fixed target number using greater-than (>) or less-than (<) operators."
      }
    ],
    presets: [
      { name: "Sensitive Dusk", threshold: 600, desc: "Turns on early at sundown" },
      { name: "Standard Night", threshold: 400, desc: "Standard city street setting" },
      { name: "Deep Darkness", threshold: 200, desc: "Only lights up in pitch black" }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 13 as LED Streetlight output;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read current ambient light from Pin A1;", indent: 1, tag: "analogRead" },
        { id: "h6", line: 6, text: "    IF light level is LESS THAN 400 (Dusk):", indent: 1, tag: "if" },
        { id: "h7", line: 7, text: "        Turn streetlight ON: digitalWrite(13, HIGH);", indent: 2, tag: "writeHigh" },
        { id: "h8", line: 8, text: "    OTHERWISE (Daylight):", indent: 1, tag: "else" },
        { id: "h9", line: 9, text: "        Turn streetlight OFF: digitalWrite(13, LOW);", indent: 2, tag: "writeLow" },
        { id: "h10", line: 10, text: "    Check again in 100 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int light = analogRead(A1);", indent: 1, tag: "analogRead" },
        { id: "c6", line: 6, text: "    if (light < 400) {", indent: 1, tag: "if" },
        { id: "c7", line: 7, text: "        digitalWrite(13, HIGH);", indent: 2, tag: "writeHigh" },
        { id: "c8", line: 8, text: "    } else {", indent: 1, tag: "else" },
        { id: "c9", line: 9, text: "        digitalWrite(13, LOW);", indent: 2, tag: "writeLow" },
        { id: "c10", line: 10, text: "    }", indent: 1, tag: "brace" },
        { id: "c11", line: 11, text: "    delay(100);", indent: 1, tag: "delay" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Conditional Branching in Automated Systems",
      pedagogy: "Students see the direct cause-and-effect of Boolean logic. The condition (light < 400) evaluates to true or false on every loop cycle, modeling real-time closed-loop control.",
      misconceptions: [
        {
          title: "Misconception: 'Why does street light flicker near the threshold?'",
          detail: "Teach the concept of sensor noise near the boundary. Real industrial systems use 'hysteresis' (e.g. turn on below 380, turn off above 420) to prevent rapid flickering!"
        }
      ],
      discussionPrompts: [
        "What would happen if car headlights shined directly on a streetlight's sensor at night?",
        "How can code ignore temporary light flashes (like lightning strikes) so the streetlights don't turn off in storms?"
      ],
      standards: [
        "CSTA 2-AP-12: Design and iteratively develop programs that combine control structures, including nested loops and compound conditionals."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: Smart City Streetlight Studio (Day/Night Arc)",
    shortTitle: "4. Streetlight Studio",
    subtitle: "Interactive day/night environmental simulator with dynamic sky lighting!",
    summary: "Take the driver's seat of an entire smart city! Drag the celestial Sun/Moon dial through a complete 24-hour day/night cycle: watch dawn break, noon blaze, dusk settle, and midnight fall. Observe the exact analog voltage curve, threshold triggering, and the automated streetlamp lighting up the road when dusk arrives!",
    mascotMsg: "You have created an autonomous green energy system! 🌆 Modern smart cities use millions of these IoT sensors to reduce municipal energy consumption by over 40%.",
    analogy: {
      title: "The Eco-Friendly City",
      concept: "Lights only consume electricity when darkness genuinely demands it—saving power automatically!"
    },
    jargonBuster: [
      {
        word: "Closed-Loop Control",
        pronunciation: "KLOHZD-loop kun-TROHL",
        analogy: "The Self-Driving Car",
        definition: "A system that constantly measures its environment and adjusts its outputs automatically without human intervention."
      },
      {
        word: "Hysteresis",
        pronunciation: "his-tuh-REE-sis",
        analogy: "The Cushion Zone",
        definition: "A buffer gap between the turn-ON and turn-OFF points to prevent annoying rapid flickering near the threshold."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 13 as LED Streetlight output;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Autonomous Monitoring):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    int ambientLux = analogRead(A1);", indent: 1, tag: "analogRead" },
        { id: "h6", line: 6, text: "    IF ambientLux < threshold: Light ON;", indent: 1, tag: "if" },
        { id: "h7", line: 7, text: "    ELSE: Light OFF (Save Solar Battery);", indent: 1, tag: "else" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int lux = analogRead(A1);", indent: 1, tag: "analogRead" },
        { id: "c6", line: 6, text: "    if (lux < threshold) {", indent: 1, tag: "if" },
        { id: "c7", line: 7, text: "        digitalWrite(13, HIGH);", indent: 2, tag: "writeHigh" },
        { id: "c8", line: 8, text: "    } else {", indent: 1, tag: "else" },
        { id: "c9", line: 9, text: "        digitalWrite(13, LOW);", indent: 2, tag: "writeLow" },
        { id: "c10", line: 10, text: "    }", indent: 1, tag: "brace" },
        { id: "c11", line: 11, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Smart Cities & Green IoT Engineering",
      pedagogy: "Connects computer science directly to civil engineering, sustainability, and UN Sustainable Development Goal 11 (Sustainable Cities).",
      misconceptions: [
        {
          title: "Misconception: 'Do microcontrollers sleep when waiting?'",
          detail: "Arduino loop() executes thousands of times per second. Explain how modern low-power microcontrollers can enter deep sleep and wake only when an LDR interrupts!"
        }
      ],
      discussionPrompts: [
        "If every streetlamp in India saved 2 hours of wasted electricity each dawn, how many megawatts of coal power could be conserved?",
        "Could we add a motion sensor (PIR) so streetlights stay at 20% brightness and only jump to 100% when a car or pedestrian approaches?"
      ],
      standards: [
        "CSTA 2-IC-20: Compare tradeoffs associated with computing technologies that affect everyday life and sustainability.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process to determine how well they meet criteria and constraints."
      ]
    }
  }
];


const RGB_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Additive Light Synthesis (Red, Green, Blue)",
    shortTitle: "1. Additive Colors",
    subtitle: "Three sub-pixel LEDs inside one frosted dome: Red, Green, and Blue!",
    summary: "Welcome to the physics of light! Unlike paint where mixing colors absorbs wavelengths to produce murky brown (subtractive mixing), light beams add their photons together (additive mixing). Inside a single 4-pin RGB LED live three microscopic semiconductor crystals sharing one common Ground. When you turn on Red + Green, you get brilliant Yellow! Red + Blue creates vivid Magenta! All three create crisp White light!",
    mascotMsg: "Look at your smartphone or monitor screen with a magnifying glass: every single pixel is made of microscopic Red, Green, and Blue sub-pixels just like this RGB LED! 🔬✨",
    analogy: {
      title: "The Three Stage Spotlights",
      concept: "Imagine three theater spotlights—one pure crimson red, one emerald green, one sapphire blue—shining onto the exact same spot on a dark stage. Where all three overlap, the stage glows pure white!"
    },
    jargonBuster: [
      {
        word: "Additive Color Mixing",
        pronunciation: "AD-ih-tiv KULL-er MIKS-ing",
        analogy: "Flashlights, Not Paint",
        definition: "The optical process of creating colors by combining different wavelengths of emitted light. Adding all primary colors produces white."
      },
      {
        word: "Common Cathode",
        pronunciation: "KOM-un KATH-ohd",
        analogy: "The Shared Drain Pipe",
        definition: "An RGB LED where all three internal LED dice connect their negative legs (cathodes) to a single shared Ground (GND) pin."
      },
      {
        word: "Sub-pixel",
        pronunciation: "SUB-piks-ul",
        analogy: "The Three Little Dice",
        definition: "The three microscopic semiconductor crystals (Red, Green, Blue) sealed together inside the frosted 5mm epoxy lens."
      }
    ],
    task: "Click the Red, Green, and Blue toggles to test primary and secondary additive color combinations!",
    targetPin: 9,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 9 as Red LED channel;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "    Configure Pin 10 as Green LED channel;", indent: 1, tag: "pinMode" },
        { id: "h4", line: 4, text: "    Configure Pin 11 as Blue LED channel;", indent: 1, tag: "pinMode" },
        { id: "h5", line: 5, text: "", indent: 0, tag: "blank" },
        { id: "h6", line: 6, text: "REPEAT FOREVER (Pure Yellow Light):", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "    Turn Red channel ON (+5V);", indent: 1, tag: "writeHigh" },
        { id: "h8", line: 8, text: "    Turn Green channel ON (+5V);", indent: 1, tag: "writeHigh" },
        { id: "h9", line: 9, text: "    Keep Blue channel OFF (0V);", indent: 1, tag: "writeLow" },
        { id: "h10", line: 10, text: "    Wait 1000 milliseconds (Enjoy Yellow!);", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(9, OUTPUT);  // Red Channel", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "    pinMode(10, OUTPUT); // Green Channel", indent: 1, tag: "pinMode" },
        { id: "c4", line: 4, text: "    pinMode(11, OUTPUT); // Blue Channel", indent: 1, tag: "pinMode" },
        { id: "c5", line: 5, text: "}", indent: 0, tag: "brace" },
        { id: "c6", line: 6, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c7", line: 7, text: "    digitalWrite(9, HIGH); // Red ON", indent: 1, tag: "writeHigh" },
        { id: "c8", line: 8, text: "    digitalWrite(10, HIGH);// Green ON (Red+Green = Yellow!)", indent: 1, tag: "writeHigh" },
        { id: "c9", line: 9, text: "    digitalWrite(11, LOW); // Blue OFF", indent: 1, tag: "writeLow" },
        { id: "c10", line: 10, text: "    delay(1000);", indent: 1, tag: "delay" },
        { id: "c11", line: 11, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Physics Meets Electronics: Additive vs Subtractive Color",
      pedagogy: "Students often bring art class intuition (paint mixing) where combining red and green produces muddy brown. Demonstrating that light emissions add photon energies together creates an unforgettable cognitive breakthrough.",
      misconceptions: [
        {
          title: "Misconception: 'Why does Red + Green make Yellow?'",
          detail: "Human eyes have three types of cone photoreceptors sensitive to Red, Green, and Blue light. Stimulating both Red and Green cones simultaneously triggers the exact same neural signal in our brain as monochromatic 580nm yellow sunlight!"
        }
      ],
      discussionPrompts: [
        "What color do you expect if you turn on only Red and Blue together?",
        "Why do all three pins need their own individual 220Ω current-limiting resistors instead of sharing a single resistor on GND?"
      ],
      standards: [
        "NGSS MS-PS4-2: Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials.",
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware interfaces."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: 8-Bit PWM Fading & analogWrite()",
    shortTitle: "2. 8-Bit PWM Fading",
    subtitle: "From digital ON/OFF to 256 silky-smooth brightness levels!",
    summary: "Pure digital ON and OFF only gives you 8 basic colors (2³). But what if you want a soft pastel pink, neon orange, or deep ocean cyan? Enter PWM (Pulse Width Modulation) and the analogWrite() function! By turning a pin ON and OFF hundreds of times per second with varying pulse widths, the Arduino tricks your eye into seeing any brightness level from 0 (completely dark) to 255 (maximum blast)!",
    mascotMsg: "The squiggly tilde (~) next to Pins 9, 10, and 11 means they are connected to internal silicon timers that flick the electrical switch 490 times per second without slowing down your code! ⚡",
    analogy: {
      title: "The Hummingbird Wing",
      concept: "A hummingbird flaps its wings so fast that you don't see individual flaps—you see a smooth, semi-transparent blur. Arduino's PWM flaps at 490 Hz!"
    },
    jargonBuster: [
      {
        word: "analogWrite()",
        pronunciation: "AN-uh-log-RYTE",
        analogy: "The Brightness Dial",
        definition: "An Arduino command that outputs an 8-bit PWM wave with duty cycles ranging from 0 (0% ON) to 255 (100% ON)."
      },
      {
        word: "8-Bit Resolution",
        pronunciation: "AYT-bit rez-oh-LOO-shun",
        analogy: "256 Stairs",
        definition: "An 8-bit number can store 2⁸ = 256 possible values (0 through 255), providing fine control over LED intensity."
      },
      {
        word: "Duty Cycle",
        pronunciation: "DOO-tee SYE-kul",
        analogy: "The Sprint vs Rest Ratio",
        definition: "The percentage of time a square wave signal stays HIGH (+5V) during each repeating pulse period."
      }
    ],
    task: "Drag the Red PWM slider from 0 to 255 to inspect the changing square wave duty cycle on the real-time oscilloscope!",
    targetPin: 9,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 9 as Red LED channel;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Fading Red from 0 to 255):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    FOR brightness from 0 up to 255:", indent: 1, tag: "for" },
        { id: "h6", line: 6, text: "        Set Red Pin 9 PWM intensity to brightness;", indent: 2, tag: "analogWrite" },
        { id: "h7", line: 7, text: "        Wait 10 milliseconds;", indent: 2, tag: "delay" },
        { id: "h8", line: 8, text: "    FOR brightness from 255 down to 0:", indent: 1, tag: "for" },
        { id: "h9", line: 9, text: "        Set Red Pin 9 PWM intensity to brightness;", indent: 2, tag: "analogWrite" },
        { id: "h10", line: 10, text: "        Wait 10 milliseconds;", indent: 2, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(9, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    for (int b = 0; b <= 255; b++) {", indent: 1, tag: "for" },
        { id: "c6", line: 6, text: "        analogWrite(9, b); // 0 to 255 (0% to 100% duty cycle)", indent: 2, tag: "analogWrite" },
        { id: "c7", line: 7, text: "        delay(10);", indent: 2, tag: "delay" },
        { id: "c8", line: 8, text: "    }", indent: 1, tag: "brace" },
        { id: "c9", line: 9, text: "    for (int b = 255; b >= 0; b--) {", indent: 1, tag: "for" },
        { id: "c10", line: 10, text: "        analogWrite(9, b);", indent: 2, tag: "analogWrite" },
        { id: "c11", line: 11, text: "        delay(10);", indent: 2, tag: "delay" },
        { id: "c12", line: 12, text: "    }", indent: 1, tag: "brace" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Deconstructing analogWrite(): A Pseudocode Analogy for Digital Timers",
      pedagogy: "Students often mistakenly assume analogWrite() creates actual analog voltages (like 2.5V steady DC). Demonstrating the 490Hz pulse train on the oscilloscope clarifies the distinction between digital micro-pulses and analog averages.",
      misconceptions: [
        {
          title: "Misconception: 'Does analogWrite() use the analog pins A0-A5?'",
          detail: "No! analogRead() reads from analog input pins A0-A5, but analogWrite() outputs PWM square waves exclusively on digital pins equipped with hardware timers (marked with ~: 3, 5, 6, 9, 10, 11)."
        }
      ],
      discussionPrompts: [
        "What would happen if analogWrite(9, 128) was connected to an audio speaker instead of an LED?",
        "Why is an 8-bit scale from 0 to 255 used rather than 0 to 100%?"
      ],
      standards: [
        "CSTA 2-AP-11: Create clearly named variables that represent different data types and perform operations on their values.",
        "NGSS MS-PS4-3: Integrate qualitative scientific and technical information to support the claim that digitized signals are a more reliable way to encode and transmit information."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: Secondary & Tertiary Color Mixing (16.7M Colors)",
    shortTitle: "3. 16.7M Color Palette",
    subtitle: "Mixing 256 Red × 256 Green × 256 Blue = 16,777,216 distinct hues!",
    summary: "When each of the three color channels can be tuned across 256 distinct levels, the mathematical combination yields 256 × 256 × 256 = 16,777,216 possible colors! In this lesson, learn how to craft rich custom hues like Cyberpunk Neon Purple (R:180, G:0, B:255), Sunset Tangerine (R:255, G:90, B:10), Electric Mint (R:0, G:255, B:160), and Cozy Warm White. Watch the C++ code generator write the exact triplet of analogWrite() calls!",
    mascotMsg: "Every hex color code you see on websites (like #FF5733) is just the hexadecimal notation of these exact three numbers (FF = 255 Red, 57 = 87 Green, 33 = 51 Blue)! 🎨",
    analogy: {
      title: "The Chef's 3-Spice Rack",
      concept: "Think of Red, Green, and Blue as paprika, oregano, and salt. By adjusting the exact pinch of each, a master chef can create millions of mouth-watering flavor profiles!"
    },
    jargonBuster: [
      {
        word: "RGB Triplet",
        pronunciation: "R-G-B TRIP-let",
        analogy: "The Three Recipe Numbers",
        definition: "A set of three numbers (Red, Green, Blue) each between 0 and 255 that mathematically defines an exact color."
      },
      {
        word: "Hex Code",
        pronunciation: "HEKS kohd",
        analogy: "Base-16 Color Shorthand",
        definition: "A 6-character code preceded by '#' where each pair of characters represents the hexadecimal byte (00 to FF) for R, G, and B."
      }
    ],
    task: "Select from the curated color preset chips to instantly generate and inspect the corresponding C++ analogWrite() commands!",
    targetPin: 10,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "FUNCTION: SetRGBColor(redValue, greenValue, blueValue):", indent: 0, tag: "function" },
        { id: "h2", line: 2, text: "    Send redValue (0-255) to Pin 9 PWM;", indent: 1, tag: "analogWrite" },
        { id: "h3", line: 3, text: "    Send greenValue (0-255) to Pin 10 PWM;", indent: 1, tag: "analogWrite" },
        { id: "h4", line: 4, text: "    Send blueValue (0-255) to Pin 11 PWM;", indent: 1, tag: "analogWrite" },
        { id: "h5", line: 5, text: "", indent: 0, tag: "blank" },
        { id: "h6", line: 6, text: "REPEAT FOREVER (Cyberpunk Neon Purple):", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "    SetRGBColor(180, 0, 255); // Intense Purple", indent: 1, tag: "call" },
        { id: "h8", line: 8, text: "    Wait 2000 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setRGB(int r, int g, int b) {", indent: 0, tag: "function" },
        { id: "c2", line: 2, text: "    analogWrite(9, r);  // Red Pin ~9", indent: 1, tag: "analogWrite" },
        { id: "c3", line: 3, text: "    analogWrite(10, g); // Green Pin ~10", indent: 1, tag: "analogWrite" },
        { id: "c4", line: 4, text: "    analogWrite(11, b); // Blue Pin ~11", indent: 1, tag: "analogWrite" },
        { id: "c5", line: 5, text: "}", indent: 0, tag: "brace" },
        { id: "c6", line: 6, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c7", line: 7, text: "    setRGB(180, 0, 255); // Neon Purple", indent: 1, tag: "call" },
        { id: "c8", line: 8, text: "    delay(2000);", indent: 1, tag: "delay" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Modular Programming: Encapsulating Repetitive Logic in Functions",
      pedagogy: "Shows learners how creating a reusable helper function `setRGB(r, g, b)` prevents duplicate boilerplate and makes code clean and expressive.",
      misconceptions: [
        {
          title: "Misconception: 'What happens if you pass a number greater than 255?'",
          detail: "Passing a value greater than 255 causes 8-bit integer rollover (e.g. 256 rolls over to 0). Emphasize input range validation or using `constrain(val, 0, 255)`."
        }
      ],
      discussionPrompts: [
        "How would you create a police siren effect that alternates rapidly between Red and Blue?",
        "Why is white light created by (255, 255, 255) slightly bluer on cheaper RGB LEDs?"
      ],
      standards: [
        "CSTA 2-AP-14: Create procedures with parameters to organize code and make it easier to reuse."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: Rainbow Mood Lamp & Color Studio",
    shortTitle: "4. Mood Lamp Studio",
    subtitle: "Interactive RGB Color Studio with full-spectrum wheel and auto-rainbow loop!",
    summary: "Welcome to the ultimate RGB Lighting Studio! Use the 360° Rainbow Hue dial to cycle through the entire optical spectrum, fine-tune individual Red, Green, and Blue PWM faders, or activate the autonomous 'Rainbow Cycle' mode to watch the virtual lamp smoothly cross-fade like a commercial smart-home mood lamp!",
    mascotMsg: "You have mastered multi-channel PWM control! 🌈 Commercial smart bulbs like Philips Hue and gaming keyboards use this exact algorithm to create ambient room lighting.",
    analogy: {
      title: "The Smart Home Ambient Lamp",
      concept: "A relaxing bedroom lamp that dynamically transitions its colors to match your circadian rhythm or focus state."
    },
    jargonBuster: [
      {
        word: "Cross-fading",
        pronunciation: "KROSS-fayd-ing",
        analogy: "The Seamless Relay Race",
        definition: "Gradually decreasing one color channel while simultaneously increasing another to transition smoothly without turning off."
      },
      {
        word: "HSV / Hue",
        pronunciation: "HYOO",
        analogy: "The 360° Color Wheel",
        definition: "A color representation based on the angular position (0° to 360°) around a circular color wheel."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pins 9, 10, 11 as PWM outputs;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Infinite Rainbow Crossfade):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Phase 1: Fade from Red to Green;", indent: 1, tag: "for" },
        { id: "h6", line: 6, text: "    Phase 2: Fade from Green to Blue;", indent: 1, tag: "for" },
        { id: "h7", line: 7, text: "    Phase 3: Fade from Blue back to Red;", indent: 1, tag: "for" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(9, OUTPUT); pinMode(10, OUTPUT); pinMode(11, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    // Autonomous 3-Phase Rainbow Cycle", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "    for (int i = 0; i < 255; i++) { analogWrite(9, 255-i); analogWrite(10, i); delay(10); }", indent: 1, tag: "for" },
        { id: "c7", line: 7, text: "    for (int i = 0; i < 255; i++) { analogWrite(10, 255-i); analogWrite(11, i); delay(10); }", indent: 1, tag: "for" },
        { id: "c8", line: 8, text: "    for (int i = 0; i < 255; i++) { analogWrite(11, 255-i); analogWrite(9, i); delay(10); }", indent: 1, tag: "for" },
        { id: "c9", line: 9, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Algorithmic Color Sequencing & State Progression",
      pedagogy: "Students see how sequential loops can be chained together to generate continuous cyclic behaviors, forming the basis for game loops and animation engines.",
      misconceptions: [
        {
          title: "Misconception: 'Can human eyes see all 16 million colors?'",
          detail: "While the human eye can distinguish approximately 10 million distinct color variations, 8-bit RGB covers the standard sRGB color space completely for displays and consumer lighting."
        }
      ],
      discussionPrompts: [
        "How would you connect a potentiometer to control the speed of the rainbow cycle in real time?",
        "Could an LDR sensor be combined with the RGB lamp so it automatically turns warm amber at night and cool blue at sunrise?"
      ],
      standards: [
        "CSTA 2-AP-13: Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process."
      ]
    }
  }
];

const TEMP_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 1: Thermoelectric Physics & Silicon Junctions",
    shortTitle: "1. Silicon Thermometer",
    subtitle: "How microscopic silicon diodes measure heat without dangerous mercury!",
    summary: "How does a microchip sense temperature? Inside the tiny black TO-92 capsule of the TMP36 sensor, silicon P-N junctions change their electrical conductivity in direct proportion to thermal energy. The sensor produces an output voltage that scales linearly by exactly 10 millivolts per degree Celsius (10mV/°C). At freezing point (0°C), it outputs exactly 500mV (0.50V), allowing it to measure negative temperatures down to -40°C without needing negative power supplies!",
    mascotMsg: "Old thermometers used toxic liquid mercury. Your Arduino uses solid-state silicon physics to measure atomic thermal vibrations directly! 🌡️⚡",
    analogy: {
      title: "The Microscopic Thermal Ruler",
      concept: "Imagine a tiny metal spring that expands by exactly 10 millimeters for every single degree of heat. The TMP36 does the same with voltage: 10 millivolts per degree Celsius!"
    },
    jargonBuster: [
      {
        word: "TMP36",
        pronunciation: "T-M-P thirty-six",
        analogy: "The Precision Temperature Probe",
        definition: "A low-voltage precision centigrade temperature sensor that outputs a linear voltage proportional to Celsius temperature."
      },
      {
        word: "Linear Scaling",
        pronunciation: "LIN-ee-er SKAY-ling",
        analogy: "The Constant Slope Ramp",
        definition: "A relationship where equal changes in temperature always cause the exact same change in voltage (10mV per 1°C)."
      },
      {
        word: "Zero-Offset (500mV)",
        pronunciation: "ZEE-roh OFF-set",
        analogy: "The Head Start Line",
        definition: "A 0.5V base voltage at 0°C that prevents negative voltages when measuring sub-zero Arctic temperatures down to -40°C."
      }
    ],
    task: "Click the thermal temperature chips to inspect how raw analog ADC voltages scale linearly with Celsius temperatures!",
    targetPin: 'A2',
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Open Serial computer monitor at 9600 baud;", indent: 1, tag: "serialBegin" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Continuous Thermal Sampling):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Read raw electrical voltage from Pin A2;", indent: 1, tag: "analogRead" },
        { id: "h6", line: 6, text: "    Print raw sensor reading to computer screen;", indent: 1, tag: "serialPrint" },
        { id: "h7", line: 7, text: "    Wait 1000 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    Serial.begin(9600);", indent: 1, tag: "serialBegin" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    int rawADC = analogRead(A2); // Read Pin A2", indent: 1, tag: "analogRead" },
        { id: "c6", line: 6, text: "    Serial.println(rawADC);", indent: 1, tag: "serialPrint" },
        { id: "c7", line: 7, text: "    delay(1000);", indent: 1, tag: "delay" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Thermoelectric Physics: Direct Electrical Transduction",
      pedagogy: "Shows learners how physical thermal energy (kinetic motion of molecules) translates directly into electrical potential across a semiconductor bandgap.",
      misconceptions: [
        {
          title: "Misconception: 'Does analogRead() directly return degrees Celsius?'",
          detail: "No! analogRead() returns a raw number between 0 and 1023 representing 0V to 5V. Code must translate this raw number into volts, then into Celsius using mathematical formulas."
        }
      ],
      discussionPrompts: [
        "Why is solid-state silicon temperature sensing safer than traditional mercury thermometers in classrooms and hospitals?",
        "If room temperature is 25°C, what voltage will the TMP36 output? (Hint: 500mV base + 25°C × 10mV/°C = 750mV = 0.75V)."
      ],
      standards: [
        "NGSS MS-PS3-4: Plan an investigation to determine the relationships among the energy transferred, the type of matter, the mass, and the change in the average kinetic energy of the particles as measured by the temperature of the sample.",
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware interfaces."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 2: The Millivolt-to-Celsius Formula",
    shortTitle: "2. Voltage to Celsius Math",
    subtitle: "The double mathematical bridge: ADC to Volts, and Volts to Degrees Celsius!",
    summary: "To convert raw ADC numbers into genuine Celsius degrees, we build a 2-step mathematical bridge in C++: First, convert the 10-bit integer (0..1023) into actual volts: float voltage = (raw * 5.0) / 1024.0;. Second, subtract the 0.5V offset and scale by 100 to get degrees: float tempC = (voltage - 0.5) * 100.0;. Now your Arduino reads temperature with tenth-of-a-degree precision!",
    mascotMsg: "Look at the formula: (voltage - 0.5) * 100. If voltage is 0.75V, (0.75 - 0.5) = 0.25V. Multiplying by 100 gives exactly 25.0°C room temperature! Math in action! 🧮",
    analogy: {
      title: "The Currency Exchange",
      concept: "Like exchanging Indian Rupees to US Dollars, then converting dollars into ounces of gold. Step 1: Raw numbers to Volts. Step 2: Volts to Degrees Celsius!"
    },
    jargonBuster: [
      {
        word: "float (Floating Point)",
        pronunciation: "FLOHT",
        analogy: "Numbers With Decimals",
        definition: "A C++ data type used for decimal numbers (e.g. 24.7°C or 0.75V) rather than whole integers."
      },
      {
        word: "Transfer Function",
        pronunciation: "TRANS-fer FUNGK-shun",
        analogy: "The Translation Rule",
        definition: "The exact mathematical equation that converts a sensor's electrical output voltage into physical engineering units."
      }
    ],
    task: "Use the live formula calculator to test how changing sensor voltages converts into exact Celsius and Fahrenheit temperatures!",
    targetPin: 'A2',
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "REPEAT FOREVER (Celsius Conversion Math):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Read raw integer from Analog Pin A2 (0-1023);", indent: 1, tag: "analogRead" },
        { id: "h3", line: 3, text: "    Convert raw integer into Volts: (raw * 5.0) / 1024.0;", indent: 1, tag: "math" },
        { id: "h4", line: 4, text: "    Convert Volts to Celsius: (volts - 0.5) * 100.0;", indent: 1, tag: "math" },
        { id: "h5", line: 5, text: "    Print Celsius temperature to computer monitor;", indent: 1, tag: "serialPrint" },
        { id: "h6", line: 6, text: "    Wait 500 milliseconds;", indent: 1, tag: "delay" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    int raw = analogRead(A2);", indent: 1, tag: "analogRead" },
        { id: "c3", line: 3, text: "    float volts = (raw * 5.0) / 1024.0;", indent: 1, tag: "math" },
        { id: "c4", line: 4, text: "    float tempC = (volts - 0.5) * 100.0;", indent: 1, tag: "math" },
        { id: "c5", line: 5, text: "    Serial.print(\"Temp: \"); Serial.print(tempC); Serial.println(\" C\");", indent: 1, tag: "serialPrint" },
        { id: "c6", line: 6, text: "    delay(500);", indent: 1, tag: "delay" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Applied Algebra: Translating Linear Equations into Code",
      pedagogy: "Students see linear slope-intercept form (y = mx + b) in action. Here V = 0.010 * T + 0.500. Rearranging for T gives T = (V - 0.500) / 0.010 = (V - 0.5) * 100.",
      misconceptions: [
        {
          title: "Misconception: 'Why 1024 instead of 1023 in the division?'",
          detail: "A 10-bit ADC has 1024 discrete quantization intervals (from 0 to 1023). Dividing by 1024.0 gives the exact voltage per quantum step (4.8828 mV per step)."
        }
      ],
      discussionPrompts: [
        "How would you convert Celsius to Fahrenheit in C++? (Formula: tempF = (tempC * 9.0 / 5.0) + 32.0).",
        "Why must we write 5.0 and 1024.0 with decimal points in C++? (Explain integer division truncation!)."
      ],
      standards: [
        "CSTA 2-AP-11: Create clearly named variables that represent different data types and perform operations on their values.",
        "CCSS.MATH.CONTENT.HSA.CED.A.4: Rearrange formulas to highlight a quantity of interest."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 3: Critical Overheat Alarms & Safety Cutoffs",
    shortTitle: "3. Overheat Alarm",
    subtitle: "Protecting computer servers and greenhouses with automatic threshold alerts!",
    summary: "Overheating destroys lithium batteries, computer CPUs, and greenhouse crops. In this lesson, program a smart safety warden using conditional logic (if / else). When the temperature exceeds a safety limit (e.g. 30.0°C), the Arduino sounds a buzzer siren and illuminates a flashing red warning beacon on Pin 13 to alert technicians immediately!",
    mascotMsg: "Data centers running AI supercomputers use temperature alarms just like this to protect billions of dollars of silicon processors from thermal meltdown! 🚨💻",
    analogy: {
      title: "The Fire Alarm Bell",
      concept: "Like a smoke detector that stays silent while air is clear, but sounds the horn the split second danger exceeds the threshold."
    },
    jargonBuster: [
      {
        word: "Safety Setpoint",
        pronunciation: "SAYF-tee SET-poynt",
        analogy: "The Red Line on the Tachometer",
        definition: "The exact numerical temperature threshold above which safety systems and cooling fans are triggered."
      },
      {
        word: "Closed-Loop Alarm",
        pronunciation: "KLOHZD loop uh-LARM",
        analogy: "The Vigilant Guard",
        definition: "An alert system that constantly samples real-world telemetry and automatically resets itself once conditions return to safe ranges."
      }
    ],
    task: "Adjust the Alarm Threshold slider and heat the sensor above the limit to trigger the emergency audio alarm!",
    targetPin: 13,
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 13 as Warning LED output;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Safety Monitoring):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    Calculate current temperature in Celsius;", indent: 1, tag: "math" },
        { id: "h6", line: 6, text: "    IF tempC > 30.0 degrees Celsius (OVERHEAT!):", indent: 1, tag: "if" },
        { id: "h7", line: 7, text: "        Turn warning LED ON and sound alarm tone;", indent: 2, tag: "writeHigh" },
        { id: "h8", line: 8, text: "    ELSE (Safe Temperature):", indent: 1, tag: "else" },
        { id: "h9", line: 9, text: "        Turn warning LED OFF and silence alarm;", indent: 2, tag: "writeLow" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(13, OUTPUT);", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    float tempC = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;", indent: 1, tag: "math" },
        { id: "c6", line: 6, text: "    if (tempC > 30.0) {", indent: 1, tag: "if" },
        { id: "c7", line: 7, text: "        digitalWrite(13, HIGH); tone(8, 880); // Overheat Alarm!", indent: 2, tag: "writeHigh" },
        { id: "c8", line: 8, text: "    } else {", indent: 1, tag: "else" },
        { id: "c9", line: 9, text: "        digitalWrite(13, LOW);  noTone(8);    // Normal Safe Range", indent: 2, tag: "writeLow" },
        { id: "c10", line: 10, text: "    }", indent: 1, tag: "brace" },
        { id: "c11", line: 11, text: "    delay(100);", indent: 1, tag: "delay" },
        { id: "c12", line: 12, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Safety-Critical Systems & Fail-Safe Design",
      pedagogy: "Introduces learners to safety engineering where automated systems monitor dangerous physical parameters (overheat, overpressure) without human delay.",
      misconceptions: [
        {
          title: "Misconception: 'Can an alarm get stuck ON permanently?'",
          detail: "Emphasize the else block: because loop() evaluates the condition hundreds of times per second, the alarm automatically deactivates as soon as cooling lowers temperature back below 30.0°C."
        }
      ],
      discussionPrompts: [
        "What might happen if the wire connecting the temperature sensor broke completely? (Discuss fail-safe defaults!).",
        "Could we send an SMS message or email using an IoT Wi-Fi shield when the alarm sounds?"
      ],
      standards: [
        "CSTA 2-AP-12: Design and iteratively develop programs that combine control structures, including nested loops and compound conditionals.",
        "NGSS MS-ETS1-1: Define the criteria and constraints of a design problem with sufficient precision to ensure a successful solution."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 4: Smart Greenhouse / HVAC Climate Studio",
    shortTitle: "4. HVAC Climate Studio",
    subtitle: "Interactive temperature environment with automated DC exhaust cooling fan!",
    summary: "Welcome to the Smart Climate Studio! Take command of an automated greenhouse HVAC system. Drag the environmental thermometer from frosty freezing temperatures (-10°C) to scorching desert heat (+50°C). Watch the smart cooling fan spin into action with dynamic rotational physics when temperatures rise, regulating the climate automatically!",
    mascotMsg: "You have built an intelligent thermostat! 🌬️ This is the exact feedback control principle used in modern smart homes (like Google Nest) and industrial greenhouses.",
    analogy: {
      title: "The Sweating Athlete",
      concept: "When your body warms up during a sprint, you automatically sweat and breathe faster to cool down. The greenhouse spins up its fan to maintain optimal growing conditions!"
    },
    jargonBuster: [
      {
        word: "HVAC",
        pronunciation: "H-VAK",
        analogy: "Heating, Ventilation & Air Conditioning",
        definition: "The technology of indoor and vehicular environmental comfort that regulates temperature, humidity, and air quality."
      },
      {
        word: "Proportional Fan Control",
        pronunciation: "pro-POR-shun-ul FAN kun-TROHL",
        analogy: "Spinning Faster as it Gets Hotter",
        definition: "Using PWM analogWrite() to spin the cooling fan faster as the temperature rises higher above the setpoint."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "When power turns ON (Do ONCE):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "    Configure Pin 6 as PWM Cooling Fan Motor;", indent: 1, tag: "pinMode" },
        { id: "h3", line: 3, text: "", indent: 0, tag: "blank" },
        { id: "h4", line: 4, text: "REPEAT FOREVER (Autonomous Greenhouse HVAC):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "    float tempC = readTemperatureCelsius(A2);", indent: 1, tag: "call" },
        { id: "h6", line: 6, text: "    IF tempC > 28.0 (Warm Greenhouse):", indent: 1, tag: "if" },
        { id: "h7", line: 7, text: "        int fanSpeed = map(tempC, 28, 45, 100, 255);", indent: 2, tag: "math" },
        { id: "h8", line: 8, text: "        analogWrite(6, fanSpeed); // Spin Exhaust Fan", indent: 2, tag: "analogWrite" },
        { id: "h9", line: 9, text: "    ELSE: analogWrite(6, 0); // Ideal Temp: Fan Resting", indent: 1, tag: "else" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "void setup() {", indent: 0, tag: "header" },
        { id: "c2", line: 2, text: "    pinMode(6, OUTPUT); // PWM Cooling Fan Pin ~6", indent: 1, tag: "pinMode" },
        { id: "c3", line: 3, text: "}", indent: 0, tag: "brace" },
        { id: "c4", line: 4, text: "void loop() {", indent: 0, tag: "header" },
        { id: "c5", line: 5, text: "    float temp = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;", indent: 1, tag: "math" },
        { id: "c6", line: 6, text: "    if (temp > 28.0) {", indent: 1, tag: "if" },
        { id: "c7", line: 7, text: "        int fanPWM = map(temp, 28, 45, 120, 255);", indent: 2, tag: "math" },
        { id: "c8", line: 8, text: "        analogWrite(6, constrain(fanPWM, 0, 255)); // Cool Down!", indent: 2, tag: "analogWrite" },
        { id: "c9", line: 9, text: "    } else {", indent: 1, tag: "else" },
        { id: "c10", line: 10, text: "        analogWrite(6, 0); // Temperature Normal (Conserve Energy)", indent: 2, tag: "analogWrite" },
        { id: "c11", line: 11, text: "    }", indent: 1, tag: "brace" },
        { id: "c12", line: 12, text: "    delay(100);", indent: 1, tag: "delay" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "brace" }
      ]
    },
    teacherMode: {
      pedagogyTitle: "Feedback Loops & Precision Agriculture Automation",
      pedagogy: "Connects computer science directly to modern agritech, automated greenhouses, and UN Sustainable Development Goal 2 (Zero Hunger & Sustainable Farming).",
      misconceptions: [
        {
          title: "Misconception: 'Can Arduino pins drive heavy high-power AC fans directly?'",
          detail: "Arduino digital pins can only output 40mA. Heavy motors or AC appliances require a transistor, MOSFET, or relay module. Pin 6 signals the gate of the MOSFET!"
        }
      ],
      discussionPrompts: [
        "What happens to tomato plant pollination if temperatures exceed 35°C in a greenhouse?",
        "How would you integrate soil moisture sensing with temperature control for a complete automated farm?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware interfaces.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process."
      ]
    }
  }
];


const SONAR_LESSONS_DATA = [
  {
    id: 1,
    title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",
    shortTitle: "1. Ultrasound Physics",
    mascotMsg: "Just like bats navigate dark caves without eyes, your Arduino uses 40,000Hz ultrasound waves to 'see' obstacles ahead! 🦇🔊",
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
    id: 2,
    title: "Catching the Echo Wave: pulseIn() and Microsecond Clocks",
    shortTitle: "2. pulseIn() Clock",
    mascotMsg: "The pulseIn() command measures time down to a single microsecond (one millionth of a second)! That is faster than the blink of an eye! ⏱️⚡",
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
    id: 3,
    title: "The Math of Echoes: Dividing by 58.2 to Calculate Distance",
    shortTitle: "3. 58.2 Math Formula",
    mascotMsg: "Why divide by 58.2? Because sound travels 1 centimeter in 29.1 microseconds. Round trip is 2 × 29.1 = 58.2! Applied acoustics in code! 📏🎯",
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
    id: 4,
    title: "Automotive Reverse Assistant: Multi-Zone Parking Radar",
    shortTitle: "4. Parking Radar Studio",
    mascotMsg: "You have engineered an automotive reverse-parking radar! 🚗 Beep... beep... beep-beep-beep-BEEEEEP! Safety engineering at work!",
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

window.BUZZER_LESSONS_DATA = BUZZER_LESSONS_DATA;
window.LDR_LESSONS_DATA = LDR_LESSONS_DATA;
window.RGB_LESSONS_DATA = RGB_LESSONS_DATA;
window.TEMP_LESSONS_DATA = TEMP_LESSONS_DATA;

const IR_LESSONS_DATA = [
  {
    id: 1,
    title: "Beams of Invisible Light: Photodiodes & Infrared Reflection",
    shortTitle: "1. Invisible IR Physics",
    mascotMsg: "The human eye cannot see 940nm infrared light, but your smartphone camera and this phototransistor can! Invisible night vision unlocked! 🔦✨",
    subtitle: "How 940nm light waves bounce off white surfaces and vanish into black surfaces",
    difficulty: "Beginner",
    duration: "15 min",
    category: "IR Sensor",
    labId: "ir",
    analogy: {
      headline: "The Flashlight & Black Velvet Curtain: Why Dark Surfaces Swallow Light",
      story: "Imagine walking into a dark room with a flashlight. If you shine it at a shiny white whiteboard, the beam bounces brightly right back into your eyes. But if you shine it directly into a thick, pitch-black velvet curtain, the light simply vanishes! The black fabric absorbs almost all the light photons, reflecting almost nothing. The TCRT5000 infrared sensor uses this exact phenomenon, but with invisible light: its blue LED emits 940-nanometer infrared rays (completely invisible to human eyes), while its black phototransistor sits right next to it, measuring how much infrared light bounces back!",
      hardwareMetaphor: "Clear/blue LED is an invisible 940nm infrared spotlight; dark phototransistor is an ultra-tuned optical eye that only sees infrared reflections!"
    },
    code: `#define IR_SENSOR_PIN 2
#define LED_INDICATOR 13

void setup() {
  Serial.begin(9600);
  // Sensor digital pin is an INPUT
  pinMode(IR_SENSOR_PIN, INPUT);
  // Onboard LED is an OUTPUT
  pinMode(LED_INDICATOR, OUTPUT);
  Serial.println("IR Reflective Sensor Online!");
}

void loop() {
  // Read digital status (LOW = Reflected White, HIGH = Absorbed Black)
  int surfaceStatus = digitalRead(IR_SENSOR_PIN);
  
  if (surfaceStatus == LOW) {
    Serial.println("Surface: WHITE REFLECTIVE (Light bounced back!)");
    digitalWrite(LED_INDICATOR, LOW);
  } else {
    Serial.println("Surface: BLACK LINE / VOID (Light absorbed!)");
    digitalWrite(LED_INDICATOR, HIGH);
  }
  delay(250);
}`,
    explanation: [
      {
        line: "pinMode(IR_SENSOR_PIN, INPUT);",
        plainEnglish: "Pin 2 is configured as an input to receive the high-speed digital state (0 or 1) generated by the sensor's onboard LM393 chip."
      },
      {
        line: "int surfaceStatus = digitalRead(IR_SENSOR_PIN);",
        plainEnglish: "Reads whether infrared photons bounced back: LOW (0V) means strong reflection (white surface), HIGH (5V) means light was absorbed (black track)."
      }
    ],
    task: {
      instruction: "Inspect the TCRT5000 optical pair on the breadboard. Click 'Emit 940nm IR Beam' to trigger the infrared spotlight and observe the optical photon reflection path!",
      buttonText: "Emit 940nm IR Beam",
      verifyCondition: "irBeamEmitted"
    },
    teacherMode: {
      pedagogyTitle: "Electromagnetic Spectrum & Material Absorption Coefficients",
      pedagogy: "Explains non-visible electromagnetic wavelengths (940nm near-infrared), photon scattering versus absorption, and the photoelectric effect in semiconductor phototransistors.",
      misconceptions: [
        {
          title: "Misconception: 'Can human eyes see the IR sensor glowing?'",
          detail: "No! The human retina only perceives visible wavelengths between 380nm (violet) and 700nm (red). At 940nm, infrared is totally invisible to human eyes, though smartphone cameras without an IR cut filter can capture it as a faint purple glow!"
        }
      ],
      discussionPrompts: [
        "Why do TV remote controls use infrared light instead of visible bright flashing LEDs?",
        "If you shine an IR sensor on shiny black acrylic versus matte black paper, why might the acrylic give false readings?"
      ],
      standards: [
        "NGSS MS-PS4-2: Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials.",
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware sensors."
      ]
    }
  },
  {
    id: 2,
    title: "The Electronic Referee: LM393 Voltage Comparator & Sensitivity Tuning",
    shortTitle: "2. Op-Amp Calibration",
    mascotMsg: "The LM393 chip acts like a digital referee with a whistle! If voltage crosses the threshold, it snaps the output immediately! 🎛️⚡",
    subtitle: "How the blue potentiometer sets threshold voltage to turn fuzzy analog into crisp 0/1 logic",
    difficulty: "Intermediate",
    duration: "15 min",
    category: "IR Sensor",
    labId: "ir",
    analogy: {
      headline: "The High Jump Bar: A Binary Decision Boundary",
      story: "In an Olympic high-jump contest, the bar is set at exactly 2.0 meters. If an athlete leaps 2.01 meters, the judge raises a White flag (Pass). If they leap 1.99 meters, the judge raises a Red flag (Fail). There is no in-between! The LM393 dual voltage comparator chip on the TCRT5000 module acts as that strict Olympic referee. It compares the phototransistor's analog voltage against a reference voltage (Vref) chosen by turning the miniature blue potentiometer with a screwdriver!",
      hardwareMetaphor: "The blue trimmer potentiometer moves the high-jump crossbar up or down; the LM393 instantly stamps the result as a crisp 1 or 0!"
    },
    code: `#define IR_DIGITAL_PIN 2

void setup() {
  Serial.begin(9600);
  pinMode(IR_DIGITAL_PIN, INPUT);
}

void loop() {
  // LM393 comparator outputs a clean, noise-free square pulse
  int isLineDetected = digitalRead(IR_DIGITAL_PIN);
  
  if (isLineDetected == HIGH) {
    // Phototransistor voltage exceeded Vref (Black line absorption)
    Serial.println("REF-COMP: LINE DETECTED [LOGIC 1]");
  } else {
    // Phototransistor voltage below Vref (White floor reflection)
    Serial.println("REF-COMP: SURFACE CLEAR [LOGIC 0]");
  }
  delay(150);
}`,
    explanation: [
      {
        line: "int isLineDetected = digitalRead(IR_DIGITAL_PIN);",
        plainEnglish: "The LM393 op-amp strips away electrical noise and analog flicker, providing clean high-speed switching that Arduino can process in fractions of a microsecond."
      }
    ],
    task: {
      instruction: "Turn the blue 10k sensitivity trimpot on the sensor module to adjust the comparator decision threshold (Vref). Find the perfect calibration where white floor gives LOW and black line gives HIGH!",
      buttonText: "Calibrate Threshold",
      verifyCondition: "irComparatorCalibrated"
    },
    teacherMode: {
      pedagogyTitle: "Analog-to-Digital Binarization & Schmitt-Trigger Op-Amps",
      pedagogy: "Demonstrates how mixed-signal embedded hardware bridges continuous real-world optical phenomena into clean boolean computer logic.",
      misconceptions: [
        {
          title: "Misconception: 'Does turning the blue potentiometer make the IR LED brighter?'",
          detail: "No! The IR LED current is fixed by a current-limiting resistor. The potentiometer only adjusts the comparison threshold voltage (Vref) inside the LM393 op-amp chip."
        }
      ],
      discussionPrompts: [
        "Why is it better for the sensor module to do threshold comparison on hardware instead of forcing the Arduino CPU to do it in software?",
        "What happens if ambient sunlight is shining directly on your line-tracking robot arena?"
      ],
      standards: [
        "CSTA 2-CS-03: Systematically identify and fix problems with computing devices and their components.",
        "NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among several design solutions."
      ]
    }
  },
  {
    id: 3,
    title: "Reading Shades of Gray: Analog Reflectance ADC Values",
    shortTitle: "3. Grayscale ADC",
    mascotMsg: "White paper reflects over 85% of infrared photons, while black tape absorbs almost all of them! That is how self-driving rovers read race tracks! 🏁🚗",
    subtitle: "Using analogRead(A0) to measure surface reflectivity from 0 to 1023",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "IR Sensor",
    labId: "ir",
    analogy: {
      headline: "The Dimmer Switch vs The Light Switch: 1024 Shades of Optical Gray",
      story: "A simple wall switch has only two positions: ON or OFF. But a theater dimmer switch can set lights to 10%, 25%, 50%, or 80% glow! In precision robotics, knowing that a robot is 'sort of on the edge of the line' allows smooth, elegant steering instead of jerky zig-zags. By wiring the sensor's AO (Analog Output) pin directly to Arduino Pin A0, we read 1024 fine steps of reflectivity to detect gradual grayscale boundaries!",
      hardwareMetaphor: "Digital pin gives a black-or-white verdict; Analog pin A0 reveals the full 10-bit grayscale gradient of the floor surface!"
    },
    code: `#define IR_ANALOG_PIN A0

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Read 10-bit analog voltage (0 to 1023)
  int rawReflectance = analogRead(IR_ANALOG_PIN);
  float voltage = (rawReflectance / 1023.0) * 5.0;
  
  // Calculate percentage of light absorbed
  float absorptionPct = (rawReflectance / 1023.0) * 100.0;
  
  Serial.print("Reflectance ADC: ");
  Serial.print(rawReflectance);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.print("V | Absorption: ");
  Serial.print(absorptionPct, 1);
  Serial.println("%");
  
  delay(200);
}`,
    explanation: [
      {
        line: "int rawReflectance = analogRead(IR_ANALOG_PIN);",
        plainEnglish: "Measures the phototransistor's exact analog voltage without comparator slicing. Low values (<200) mean brilliant white reflection; high values (>800) mean pitch-black absorption."
      },
      {
        line: "float absorptionPct = (rawReflectance / 1023.0) * 100.0;",
        plainEnglish: "Maps raw 10-bit numbers to a human-friendly 0% to 100% absorption scale."
      }
    ],
    task: {
      instruction: "Slide the surface test material under the sensor: test White Paper (ADC ~120), Cardboard (ADC ~450), Dark Tape (ADC ~880), and Pitch Black Felt (ADC ~990). Watch the live ADC meter respond!",
      buttonText: "Sample Surface ADC",
      verifyCondition: "irAnalogSampled"
    },
    teacherMode: {
      pedagogyTitle: "Optical Surface Metrology & Grayscale Proportional Control",
      pedagogy: "Lays mathematical foundations for PID (Proportional-Integral-Derivative) steering algorithms in robotics competitions (e.g. FIRST LEGO League, Robofest).",
      misconceptions: [
        {
          title: "Misconception: 'Do all black markers absorb infrared light equally?'",
          detail: "No! Some black inks use carbon black pigments which absorb infrared strongly, while other dyes are completely transparent to 940nm IR, reading as white to the sensor even though human eyes see black!"
        }
      ],
      discussionPrompts: [
        "How can a line-following robot use analog values to steer smoothly through high-speed curved tracks?",
        "Why do industrial AGV factory robots use magnetic strips or barcode QR grids instead of painted paper lines?"
      ],
      standards: [
        "CCSS.MATH.CONTENT.7.RP.A.2: Recognize and represent proportional relationships between quantities.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification."
      ]
    }
  },
  {
    id: 4,
    title: "Self-Driving Robot Arena: Dual-Sensor Differential Steering",
    shortTitle: "4. Autonomous Rover Studio",
    mascotMsg: "Autonomous robotics activated! 🏎️💨 Two IR sensors working together keep the robot centered on the line, just like self-driving Tesla lane assist!",
    subtitle: "Build the brains of an autonomous factory warehouse AGV / line-follower bot!",
    difficulty: "Advanced Capstone",
    duration: "25 min",
    category: "IR Sensor",
    labId: "ir",
    analogy: {
      headline: "The Amazon Warehouse Kiva AGV: Dual-Eye Steering Navigation",
      story: "Inside modern automated distribution centers, hundreds of orange robotic rovers glide smoothly across concrete floors carrying shelves of products directly to packing stations. How do they follow navigation paths without human drivers? They use two IR sensors spaced just wider than a black floor tape! As long as both sensors see white concrete, the rover drives straight at full speed. The moment the rover drifts left and the left sensor hits black tape, the computer instantly brakes the left motor and powers the right motor to steer back onto center!",
      hardwareMetaphor: "Left IR eye + Right IR eye = Differential robotic vision steering!"
    },
    code: `#define LEFT_IR_PIN 2
#define RIGHT_IR_PIN 3
#define LEFT_MOTOR_PWM 5
#define RIGHT_MOTOR_PWM 6

void setup() {
  Serial.begin(9600);
  pinMode(LEFT_IR_PIN, INPUT);
  pinMode(RIGHT_IR_PIN, INPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);
}

void loop() {
  int leftVal = digitalRead(LEFT_IR_PIN);
  int rightVal = digitalRead(RIGHT_IR_PIN);
  
  if (leftVal == LOW && rightVal == LOW) {
    // Both on WHITE: Path is centered -> Drive Straight
    analogWrite(LEFT_MOTOR_PWM, 200);
    analogWrite(RIGHT_MOTOR_PWM, 200);
    Serial.println("ROVER: FULL SPEED AHEAD ⬆️");
  } else if (leftVal == HIGH && rightVal == LOW) {
    // Left sensor hit BLACK line -> Turn Left to recenter!
    analogWrite(LEFT_MOTOR_PWM, 50);
    analogWrite(RIGHT_MOTOR_PWM, 220);
    Serial.println("ROVER: DRIFT LEFT detected -> STEER LEFT ⬅️");
  } else if (leftVal == LOW && rightVal == HIGH) {
    // Right sensor hit BLACK line -> Turn Right to recenter!
    analogWrite(LEFT_MOTOR_PWM, 220);
    analogWrite(RIGHT_MOTOR_PWM, 50);
    Serial.println("ROVER: DRIFT RIGHT detected -> STEER RIGHT ➡️");
  } else {
    // Both on BLACK: Crossline / Station Stop
    analogWrite(LEFT_MOTOR_PWM, 0);
    analogWrite(RIGHT_MOTOR_PWM, 0);
    Serial.println("ROVER: INTERSECTION DETECTED -> ALL MOTORS STOP 🛑");
  }
  delay(50);
}`,
    explanation: [
      {
        line: "if (leftVal == LOW && rightVal == LOW) ... else if (leftVal == HIGH) ...",
        plainEnglish: "Four-way differential truth table: White-White = Drive Straight; Black-White = Steer Left; White-Black = Steer Right; Black-Black = Stop."
      },
      {
        line: "analogWrite(LEFT_MOTOR_PWM, 50); analogWrite(RIGHT_MOTOR_PWM, 220);",
        plainEnglish: "Differential steering: spinning the outer wheel faster than the inner wheel creates a tight, controlled pivot turn without mechanical steering racks!"
      }
    ],
    task: {
      instruction: "Welcome to the Autonomous Self-Driving Rover Arena! Toggle track curves, adjust motor speeds, and watch the dual infrared sensors steer the robotic rover autonomously around the circuit track!",
      buttonText: "Start Autonomous Rover",
      verifyCondition: "irRoverRunning"
    },
    teacherMode: {
      pedagogyTitle: "Differential Drive Kinematics & Autonomous Mobile Robotics",
      pedagogy: "Teaches core principles of wheeled mobile robot locomotion, state machine logic, closed-loop feedback control, and cyber-physical automation.",
      misconceptions: [
        {
          title: "Misconception: 'Can a robot follow lines with just 1 sensor?'",
          detail: "With only 1 sensor, the robot can only hug one edge of the line in an oscillating zig-zag (bang-bang control). Dual sensors allow the robot to straddle the line smoothly with minimal hunting jitter!"
        }
      ],
      discussionPrompts: [
        "How do self-driving cars on real highways stay in their lanes when rain or snow covers the painted lane markers?",
        "What happens if a rover drives too fast into a 90-degree hairpin turn? How would a PID controller anticipate the corner?"
      ],
      standards: [
        "CSTA 2-AP-13: Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process."
      ]
    }
  }
];

window.SONAR_LESSONS_DATA = SONAR_LESSONS_DATA;

const LCD_LESSONS_DATA = [
  {
    id: 1,
    title: "Taming 16 Wires into 2: The Magic of I2C Bus Protocol",
    mascotMsg: "Normally a 16x2 screen requires 16 messy jumper wires. With the PCF8574 I2C backpack, we control the entire screen with just TWO data wires (SDA & SCL)! 📟✨",
    shortTitle: "1. I2C Bus Magic",
    subtitle: "How the PCF8574 chip shrinks a nightmare 16-wire LCD into just 2 shared wires",
    difficulty: "Beginner",
    duration: "15 min",
    category: "LCD Display",
    labId: "lcd",
    analogy: {
      headline: "The Postal Carrier vs 16 Private Telephone Lines",
      story: "Imagine living in a 16-room school dormitory. If you had to install a private telephone wire from the principal's office to every single desk, the hallway would become an unusable tangle of wires! That's what traditional parallel LCDs did: they required 16 separate pins (RS, RW, E, D0 through D7, plus contrast and power)! Because an Arduino Uno only has 14 digital pins, plugging in an old LCD used up your entire board! The I2C backpack solves this with a smart postal carrier chip (the PCF8574). Arduino simply addresses 'Apartment 0x27' and sends serial messages using just TWO shared wires: SDA (Serial Data) and SCL (Serial Clock)!",
      hardwareMetaphor: "The PCF8574 backpack is an 8-bit postal mailbox; SDA is the conveyor belt delivering letters, SCL is the clock ticking every delivery beat!"
    },
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  // Initialize the I2C LCD interface
  lcd.init();
  
  // Turn ON the blue LED backlight
  lcd.backlight();
  
  // Print initial greeting on row 0
  lcd.setCursor(0, 0);
  lcd.print("I2C Bus Ready!");
  
  lcd.setCursor(0, 1);
  lcd.print("Address: 0x27");
}

void loop() {
  // Nothing to repeat for static greeting
}`,
    explanation: [
      {
        line: "LiquidCrystal_I2C lcd(0x27, 16, 2);",
        plainEnglish: "Creates the LCD object at hexadecimal I2C bus address 0x27 with 16 columns and 2 rows."
      },
      {
        line: "lcd.init(); lcd.backlight();",
        plainEnglish: "Wakes up the HD44780 controller inside the screen and switches on the LED backlight panel."
      }
    ],
    task: {
      instruction: "Inspect the 16x2 screen on the hardware stage. Notice the I2C backpack wired to Pin A4 (SDA) and Pin A5 (SCL). Click 'Initialize I2C Bus (0x27)' to send the initialization packet and illuminate the blue display!",
      buttonText: "Initialize I2C Bus (0x27)",
      verifyCondition: "lcdInitialized"
    },
    teacherMode: {
      pedagogyTitle: "Synchronous Serial Busses & Addressable Peripherals",
      pedagogy: "Introduces students to the Inter-Integrated Circuit (I2C) master-slave communication protocol, open-drain bus architecture, and hexadecimal hardware addressing.",
      misconceptions: [
        {
          title: "Misconception: 'Can multiple sensors share the same 2 I2C wires?'",
          detail: "YES! That is the superpower of I2C: up to 127 different sensors (LCDs, barometers, gyroscopes, RTC clocks) can share the exact same SDA and SCL wires, as long as each device has a unique hexadecimal address!"
        }
      ],
      discussionPrompts: [
        "Why does I2C need a Clock wire (SCL) in addition to a Data wire (SDA)?",
        "If an I2C scanner reports address 0x3F instead of 0x27, why did the manufacturer change it?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts using hardware peripherals.",
        "NGSS MS-PS4-3: Integrate qualitative scientific and technical information to support the claim that digitized signals are a more reliable way to encode and transmit information."
      ]
    }
  },
  {
    id: 2,
    title: "Waking the Screen: lcd.init(), backlight(), and Coordinates",
    mascotMsg: "Remember: Column goes first (0 to 15), Row comes second (0 or 1)! Zero-based indexing is how computer memory works everywhere! 🎯📐",
    shortTitle: "2. Cursor Coordinates",
    subtitle: "Navigating 16 columns (0-15) by 2 rows (0-1) in zero-indexed memory",
    difficulty: "Intermediate",
    duration: "15 min",
    category: "LCD Display",
    labId: "lcd",
    analogy: {
      headline: "The Typewriter Carriage & Battleship Grid: (Column, Row)",
      story: "Remember playing Battleship? You call out 'Column B, Row 4!' to hit a target. On a 16x2 character LCD, the screen is an exact rectangular grid of 32 character blocks: 16 columns across (numbered 0 to 15) and 2 rows down (Row 0 for the top line, Row 1 for the bottom line). Computer scientists always start counting at zero! Calling `lcd.setCursor(col, row)` is like picking up an invisible typewriter carriage and dropping the typing head directly onto that exact letter box!",
      hardwareMetaphor: "`lcd.setCursor(col, row)` places the invisible printing pen at (X, Y) coordinates before calling `lcd.print()`!"
    },
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
}

void loop() {
  // Top Line: Starts at Column 2
  lcd.setCursor(2, 0);
  lcd.print("ATL INNOVATE");
  
  // Bottom Line: Starts at Column 0
  lcd.setCursor(0, 1);
  lcd.print("COL:0-15  ROW:0-1");
  
  delay(1000);
}`,
    explanation: [
      {
        line: "lcd.setCursor(col, row);",
        plainEnglish: "Sets the print position. Notice the order is (column, row), NOT (row, column)! Column goes 0 to 15; Row is 0 or 1."
      },
      {
        line: 'lcd.print("ATL INNOVATE");',
        plainEnglish: "Sends ASCII character bytes one by one over I2C to be rendered in the 5x8 pixel font matrix."
      }
    ],
    task: {
      instruction: "Use the Column and Row coordinate sliders to reposition the text on the virtual 16x2 screen. Watch the typewriter cursor position update instantly!",
      buttonText: "Verify Text Positioning",
      verifyCondition: "lcdCoordsVerified"
    },
    teacherMode: {
      pedagogyTitle: "2D Cartesian Screen Coordinate Systems & Zero-Indexed Arrays",
      pedagogy: "Reinforces coordinate geometry $(x, y)$, zero-based indexing common across all modern programming languages (C++, Java, Python), and text buffering.",
      misconceptions: [
        {
          title: "Misconception: 'If I print a 20-character sentence, does it wrap to Row 1 automatically?'",
          detail: "No! The HD44780 controller does not perform automatic word wrapping. Characters beyond column 15 overflow into hidden memory, so you must explicitly call `lcd.setCursor(0, 1)` to start the second line!"
        }
      ],
      discussionPrompts: [
        "Why do programming languages start counting array indexes at 0 instead of 1?",
        "How would you create a scrolling text ticker across the 16-character window?"
      ],
      standards: [
        "CSTA 2-AP-11: Create clearly named variables that represent different data types.",
        "CCSS.MATH.CONTENT.6.NS.C.6: Understand signs of numbers in ordered pairs as indicating locations in quadrants of the coordinate plane."
      ]
    }
  },
  {
    id: 3,
    title: "Designing Custom Characters: 5x8 Pixel Matrix Typography",
    mascotMsg: "Each character on the LCD is a 5x8 grid of 40 liquid crystal dots. By toggling binary 1s and 0s in CGRAM, you can draw ANY custom icon! 👾❤️",
    shortTitle: "3. 5x8 Pixel Designer",
    subtitle: "How CGRAM bitmasks let you draw hearts, battery gauges, arrows & degree symbols",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "LCD Display",
    labId: "lcd",
    analogy: {
      headline: "The Lite-Brite Pegboard: 40 Pixels of Custom Art",
      story: "If you look closely at any letter on a 16x2 LCD screen, it isn't smooth ink—it is made of a tiny matrix of 5 columns by 8 rows of rectangular liquid crystal pixels (40 pixels total per character cell). The screen comes with the standard English alphabet built into ROM, but its character generator RAM (CGRAM) has 8 empty memory slots where YOU get to design your own custom glyphs! Each row of 5 pixels is represented by a single byte in binary: 1 means pixel DARK, 0 means pixel CLEAR!",
      hardwareMetaphor: "An array of 8 bytes is an 8-row binary pixel bitmap: 1s turn pixels ON, 0s leave them transparent!"
    },
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// Custom 5x8 Heart Glyph Bitmask
byte heart[8] = {
  B00000,
  B01010,
  B11111,
  B11111,
  B01110,
  B00100,
  B00000,
  B00000
};

void setup() {
  lcd.init();
  lcd.backlight();
  
  // Register custom character in Slot 0 (CGRAM)
  lcd.createChar(0, heart);
  
  lcd.setCursor(0, 0);
  lcd.print("Arduino + ATL ");
  // Print custom character from Slot 0
  lcd.write(byte(0));
}

void loop() {
}`,
    explanation: [
      {
        line: "byte heart[8] = { B01010, B11111, ... };",
        plainEnglish: "An 8-element byte array where each binary number represents one horizontal row of 5 pixels in the custom character."
      },
      {
        line: "lcd.createChar(0, heart);",
        plainEnglish: "Uploads the 8-byte pixel bitmap into the HD44780's CGRAM memory slot 0 (slots 0 to 7 available)."
      },
      {
        line: "lcd.write(byte(0));",
        plainEnglish: "`lcd.write()` outputs raw binary character bytes, displaying the custom glyph stored in slot 0."
      }
    ],
    task: {
      instruction: "Click pixels on the 5x8 interactive pixel designer grid to draw your own custom symbol (or pick a preset Heart, Battery, Smiley, or Bell). Watch the C++ byte array update and render live on the LCD screen!",
      buttonText: "Upload Custom Glyph",
      verifyCondition: "lcdGlyphCreated"
    },
    teacherMode: {
      pedagogyTitle: "Bitmap Graphics, Binary Bitmasks & Font Rasterization",
      pedagogy: "Teaches binary number systems (Base-2), pixel arrays, memory-constrained graphics, and the foundations of raster font typography.",
      misconceptions: [
        {
          title: "Misconception: 'Can I create 50 different custom characters at once?'",
          detail: "No! The HD44780 hardware controller only has 64 bytes of CGRAM, which fits exactly 8 custom characters (numbered 0 to 7) at any one time."
        }
      ],
      discussionPrompts: [
        "Why do retro arcade games like Space Invaders and Pac-Man use pixel bitmasks identical to this 5x8 grid?",
        "How would you create a multi-level battery gauge icon (25%, 50%, 75%, 100%)?"
      ],
      standards: [
        "CSTA 2-DA-07: Represent data using multiple encoding schemes, including binary and hexadecimal.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process."
      ]
    }
  },
  {
    id: 4,
    title: "The IoT Command Deck: Live Multi-Sensor Telemetry Billboard",
    mascotMsg: "🎉 Congratulations, Master Tinkerer! You have completed all 44 lessons of the Atal Tinkering Lab curriculum! The IoT Command Deck brings all sensors together! 🚀🏆",
    shortTitle: "4. IoT Command Deck Studio",
    subtitle: "Combine Temperature, Ultrasonic Radar, and LDR light on a cycling 16x2 screen!",
    difficulty: "Advanced Capstone",
    duration: "25 min",
    category: "LCD Display",
    labId: "lcd",
    analogy: {
      headline: "The Glass Cockpit: Integrating Multiple Sensors onto One Screen",
      story: "Modern fighter jets and Tesla electric cars don't have 50 separate needle dials on the dashboard—they have a unified digital screen that synthesizes navigation, battery state, speed, and radar into one clean HUD! In this Grand Capstone lab of the entire ATL Curriculum, we wire together everything we've built: the TMP36 temperature sensor, the HC-SR04 ultrasonic radar, and the LDR light sensor, cycling live telemetry on the 16x2 LCD display every 2 seconds without freezing the Arduino with delay()!",
      hardwareMetaphor: "The 16x2 LCD is your IoT embedded billboard: a window into physical sensor telemetry!"
    },
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define LDR_PIN A1
#define TEMP_PIN A2
#define TRIG_PIN 12
#define ECHO_PIN 11

unsigned long lastScreenSwitch = 0;
int currentScreen = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Non-blocking timer: switch dashboard screen every 2500ms
  if (millis() - lastScreenSwitch > 2500) {
    lastScreenSwitch = millis();
    currentScreen = (currentScreen + 1) % 3;
    lcd.clear();
  }
  
  if (currentScreen == 0) {
    // Screen 1: Smart Greenhouse Climate
    float tempC = (analogRead(TEMP_PIN) * 5.0 / 1024.0 - 0.5) * 100.0;
    lcd.setCursor(0, 0);
    lcd.print("CLIMATE MONITOR");
    lcd.setCursor(0, 1);
    lcd.print("Temp: ");
    lcd.print(tempC, 1);
    lcd.print(" C");
  } else if (currentScreen == 1) {
    // Screen 2: Ultrasonic Parking Radar
    digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    float dist = pulseIn(ECHO_PIN, HIGH) * 0.0343 / 2.0;
    lcd.setCursor(0, 0);
    lcd.print("RADAR PROXIMITY");
    lcd.setCursor(0, 1);
    lcd.print("Dist: ");
    lcd.print(dist, 1);
    lcd.print(" cm");
  } else {
    // Screen 3: Ambient Light Sensor
    int lightVal = analogRead(LDR_PIN);
    lcd.setCursor(0, 0);
    lcd.print("SOLAR SKY LUX");
    lcd.setCursor(0, 1);
    lcd.print("Light: ");
    lcd.print(lightVal);
    lcd.print(" / 1023");
  }
  delay(100);
}`,
    explanation: [
      {
        line: "if (millis() - lastScreenSwitch > 2500) { ... }",
        plainEnglish: "Non-blocking multitasking timer: switches display channels smoothly every 2.5 seconds without freezing sensor readings."
      },
      {
        line: "lcd.clear();",
        plainEnglish: "Wipes all 32 character blocks clean before writing the next sensor page, preventing ghost characters."
      }
    ],
    task: {
      instruction: "Welcome to the Grand Capstone IoT Command Deck! Switch between Climate, Radar, and Solar screens. Adjust the sensor sliders to see real-time multi-sensor telemetry render dynamically on the 16x2 dot-matrix billboard!",
      buttonText: "Launch IoT Command Deck",
      verifyCondition: "lcdIotDeckActive"
    },
    teacherMode: {
      pedagogyTitle: "Embedded Systems Integration, Finite State Machines & Real-Time HMI",
      pedagogy: "The culminating capstone project synthesizes analog sensing, acoustic timing, serial bus communications, and multimodal human-machine interfaces into a cohesive commercial-grade IoT artifact.",
      misconceptions: [
        {
          title: "Misconception: 'Can Arduino run multiple tasks at the exact same time like a multi-core PC?'",
          detail: "Arduino Uno has a single 16MHz core, but by using `millis()` timing instead of blocking `delay()`, it switches tasks so quickly (cooperative multitasking) that it appears completely simultaneous to humans!"
        }
      ],
      discussionPrompts: [
        "How would you connect this 16x2 LCD command station to an ESP32 or Wi-Fi module to send sensor telemetry to a cloud dashboard?",
        "Looking back across all 11 labs and 44 lessons, which sensor or actuator was your favorite to engineer, and why?"
      ],
      standards: [
        "CSTA 2-AP-17: Systematically design and iteratively develop computational artifacts that incorporate feedback.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process.",
        "NITI Aayog ATL Curriculum Objective: Foster curiosity, creativity, and imagination in young minds; and inculcate skills such as design mindset, computational thinking, adaptive learning, and physical computing."
      ]
    }
  }
];

const CAD_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 45: The 3D World & The Workplane",
    shortTitle: "45. 3D Space & Workplane",
    subtitle: "Navigating 3D Cartesian Coordinates: Width (X), Depth (Y), and Height (Z)",
    summary: "Step out of flat 2D drawings into 3D isometric space! Learn how Tinkercad creates physical objects on a virtual build plate using millimeter coordinates.",
    mascotMsg: "Welcome to the 3D Maker Dimension! 🧊 In real life, physical objects don't just have width and height — they have DEPTH. Let's master the 3D coordinate system and build our first solid primitive!",
    difficulty: "Beginner",
    duration: "15 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The LEGO Gridded Construction Baseplate",
      story: "Imagine sitting down with a brand-new LEGO baseplate. You can build bricks to the left or right (X axis), toward you or away from you (Y axis), and stack bricks upward toward the ceiling (Z axis). Tinkercad's virtual Workplane is exactly like that LEGO plate, measured in precision metric millimeters! Every physical gadget you hold in your hands — your phone, a robot chassis, a game controller — started as simple geometric 3D shapes placed onto a workplane.",
      hardwareMetaphor: "The 3D Workplane is the build bed of a 3D printer; X is the printhead moving left-right, Y is the bed sliding front-back, and Z is the vertical gantry rising layer-by-layer!"
    },
    jargonBuster: [
      {
        word: "Workplane",
        pronunciation: "WURK-playn",
        analogy: "The Desktop Grid",
        definition: "The virtual ground surface where you place, align, and stack 3D objects."
      },
      {
        word: "Cartesian Axes",
        pronunciation: "kar-TEE-zhun AK-seez",
        analogy: "Three City Streets",
        definition: "Three perpendicular directions in space: X (Width/Red), Y (Depth/Green), and Z (Height/Blue)."
      },
      {
        word: "Primitive",
        pronunciation: "PRIM-ih-tiv",
        analogy: "Basic Wooden Building Blocks",
        definition: "Fundamental 3D shapes like cubes, cylinders, spheres, and wedges that form complex models."
      },
      {
        word: "Isometric",
        pronunciation: "eye-soh-MET-rik",
        analogy: "Video Game Bird's-Eye View",
        definition: "A 3D drawing angle where parallel lines never converge, keeping true proportions visible."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Define metric build environment in millimeters:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Set grid resolution to 1.0mm snap increments", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Spawn a Solid Geometric Cube on the Workplane:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Set Width (X) = 20.0 mm (left-to-right)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Set Depth (Y) = 20.0 mm (front-to-back)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Set Height (Z) = 20.0 mm (vertical elevation)", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Calculate resulting solid volume:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Volume = 20 * 20 * 20 = 8,000 cubic millimeters (mm³)", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// OpenSCAD / Procedural C++ CAD Modeling", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "$fn = 64; // High-resolution polygon facets", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "module createSolidBox(x, y, z) {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  // Render parametric solid cube at origin", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "  cube(size = [x, y, z], center = true);", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "block-end" },
        { id: "c8", line: 8, text: "createSolidBox(20.0, 20.0, 20.0);", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Spatial Reasoning, Isometric Projection & Metric Scaling",
      pedagogy: "Transforms abstract Cartesian math (X, Y, Z coordinates) into tangible 3D engineering models. Students develop spatial intuition, volume computation, and metric system fluency.",
      misconceptions: [
        {
          title: "Misconception: 'Can you build a physical 3D object from a single flat 2D picture?'",
          detail: "A flat 2D picture only contains width and height. A 3D CAD model requires depth (Z) and watertight solid volume data (vertices, edges, and polygon face normals) so slicer software can calculate physical toolpaths."
        }
      ],
      discussionPrompts: [
        "Why do mechanical engineers worldwide use metric millimeters (mm) instead of inches for 3D printing and robotics?",
        "If you double all three dimensions of a cube from 10mm to 20mm, why does the volume multiply by 8 times instead of 2?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that model physical objects.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process to determine how well they meet criteria and constraints.",
        "NITI Aayog ATL Curriculum Module 1: Introduction to 3D Design, Spatial Thinking, and Tinkercad Basics."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 46: The Magic of Holes & CSG Booleans",
    shortTitle: "46. Hole Cuts & CSG Booleans",
    subtitle: "Constructive Solid Geometry: Sculpting Real-World Parts with Negative Space",
    summary: "Discover how every complex mechanical component is born! By combining solid shapes with negative 'hole' shapes and grouping them, we carve holes, slots, and grooves.",
    mascotMsg: "Here is the coolest superpower in 3D design: a 'Hole' is a shape made of virtual anti-matter! When you group a solid shape with a hole shape, the hole bites away its exact volume like a cookie cutter! 🍪✨",
    difficulty: "Beginner",
    duration: "18 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Cookie Cutter & Apple Corer",
      story: "Think about making hollow donuts or coring an apple. You start with a solid ball of dough, take a sharp metal tube, and push it straight through the middle. When you pull the tube out, you're left with a perfect hole! In 3D CAD, this mathematical operation is called Constructive Solid Geometry (CSG) Boolean Difference: Shape A (Solid Dough) MINUS Shape B (Hole Cylinder) = Hollow Mechanical Bearing!",
      hardwareMetaphor: "Drilling a hole in a metal robot bracket on a drill press: the rotating drill bit removes solid aluminum chips, leaving an empty cylindrical shaft."
    },
    jargonBuster: [
      {
        word: "CSG",
        pronunciation: "SEE-ess-jee (Constructive Solid Geometry)",
        analogy: "Sculpting with Math",
        definition: "A method of creating complex 3D shapes by adding (Union) or subtracting (Difference) simple solids."
      },
      {
        word: "Boolean Difference",
        pronunciation: "BOO-lee-un DIF-er-ens",
        analogy: "A Cookie Cutter Bite",
        definition: "Subtracting a negative 'hole' shape from a solid shape: Solid A - Hole B."
      },
      {
        word: "Grouping",
        pronunciation: "GROOP-ing",
        analogy: "Melting Bricks Together",
        definition: "Locking multiple shapes together into a single permanent 3D object in Tinkercad."
      },
      {
        word: "Negative Space",
        pronunciation: "NEG-uh-tiv Spayss",
        analogy: "Empty Donut Hole",
        definition: "The hollow or empty volume carved out inside a physical solid."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Create Solid Base Object (Shape A):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Spawn Solid Box: Width = 20mm, Depth = 20mm, Height = 20mm", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "STEP 2: Create Negative Cutting Tool (Shape B):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Spawn Hole Cylinder: Diameter = 10mm, Height = 30mm", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Pass cylinder through the center of the solid box", indent: 1, tag: "setup" },
        { id: "h6", line: 6, text: "STEP 3: Execute CSG Boolean Difference (Group):", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "Result = Solid Box MINUS Hole Cylinder = Bearing Block with Through-Hole!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// CSG Boolean Difference in Procedural CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "difference() {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  // Positive Solid: Base Box (20x20x20mm)", indent: 1, tag: "comment" },
        { id: "c4", line: 4, text: "  cube([20, 20, 20], center = true);", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "", indent: 1, tag: "empty" },
        { id: "c6", line: 6, text: "  // Negative Cutter: Through-Hole Cylinder", indent: 1, tag: "comment" },
        { id: "c7", line: 7, text: "  cylinder(r = 5.0, h = 32.0, center = true, $fn = 64);", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Boolean Set Theory & Constructive Solid Geometry (CSG)",
      pedagogy: "Connects mathematical Venn diagrams and set subtraction ($A \setminus B$) directly to physical computer-aided design and subtractive manufacturing.",
      misconceptions: [
        {
          title: "Misconception: 'If a hole cylinder is shorter than the solid cube, will it make a through-hole?'",
          detail: "No! A hole only cuts where it physically intersects the solid. If a 10mm tall hole is inside a 20mm cube, it creates a blind pocket/recess, not a through-hole. To guarantee a through-hole, always make the hole taller than the solid."
        }
      ],
      discussionPrompts: [
        "Can you name 3 everyday items in your classroom that were made using CSG Boolean subtraction? (e.g., coffee mug handle hole, pencil sharpener opening).",
        "How is CSG subtraction in 3D CAD similar to using an eraser on paper, and how is it different?"
      ],
      standards: [
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object.",
        "NITI Aayog ATL Curriculum Module 2: Grouping, Hole Properties, and CSG Modeling in Tinkercad."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 47: Precision Alignment & Ruler Tools",
    shortTitle: "47. Alignment & Ruler Guides",
    subtitle: "Eliminate Eyeball Guesswork with Center, Edge, and Concentric Alignment",
    summary: "Learn why professional engineers never 'eyeball' parts. Use Tinkercad's Alignment handles and Ruler guides to align screw holes to the exact micrometer center.",
    mascotMsg: "If a robot screw hole is off by even 1 millimeter, your motor screws won't fit through the chassis! Let's lock our shapes together with precision centerline alignment! 📐🎯",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Architect's Magnetic T-Square",
      story: "Try drawing two concentric circles on paper freehand without a compass. It is virtually impossible to get the centers to match! But when an architect uses a T-square and snap guides, lines click into place perfectly. In Tinkercad, the Align Tool shows you 9 alignment pins: left edge, exact center, and right edge across all three dimensions. With a single click, your hole snaps right to the true center of the solid block!",
      hardwareMetaphor: "Centering a drill press workpiece in a machine vise: using an edge finder and dial indicator to locate the exact center of rotation."
    },
    jargonBuster: [
      {
        word: "Align Tool",
        pronunciation: "uh-LYNE Tool",
        analogy: "Magnetic Guide Pins",
        definition: "A tool with 3 pins per axis that shifts objects to share a common center, top, or edge."
      },
      {
        word: "Snap Grid",
        pronunciation: "SNAP Grid",
        analogy: "Invisible Magnetic Pegs",
        definition: "Forces objects and measurements to jump in exact steps (e.g. 1.0mm, 0.5mm, 0.1mm)."
      },
      {
        word: "Concentric",
        pronunciation: "kun-SEN-trik",
        analogy: "Bullseye Rings on a Dartboard",
        definition: "Two or more circular objects that share the exact same center point."
      },
      {
        word: "Ruler Tool",
        pronunciation: "ROO-lur Tool",
        analogy: "Digital Caliper",
        definition: "Locks an origin point (0,0) and displays live numerical distances to every edge of a part."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Select multiple objects on the workplane:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Select Solid Box + Hole Cylinder together", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Engage Precision Alignment tool (Shortcut: 'L'):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Click Center Pin along X axis (Width Centerline)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Click Center Pin along Y axis (Depth Centerline)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Keep Z axis through-hole elevation centered", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Verify Zero-Offset Concentricity:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Both objects now share exact midpoint (X=0.0mm, Y=0.0mm)!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Parametric Alignment Matrix in C++ CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "struct Vec3D { float x, y, z; };", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "Vec3D alignToCenter(const Vec3D& parent, const Vec3D& child) {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  // Calculate exact delta offset for concentric alignment", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "  return { (parent.x - child.x)/2.0f, (parent.y - child.y)/2.0f, 0.0f };", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "block-end" },
        { id: "c8", line: 8, text: "// Offset = {0.0mm, 0.0mm} -> Perfectly Concentric!", indent: 0, tag: "comment" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Precision Metrology, Geometric Constraints & Symmetric Design",
      pedagogy: "Teaches geometric symmetry and coordinate constraints. Reinforces why robotic assemblies require strict mechanical tolerances rather than manual visual positioning.",
      misconceptions: [
        {
          title: "Misconception: 'If it looks centered on my screen, is it accurate enough for 3D printing?'",
          detail: "Screen perspective distortion can easily hide a 1mm misalignment that makes mating gears grind or screw threads bind. Always use numerical snap grids and the Align tool."
        }
      ],
      discussionPrompts: [
        "Why do 3D printers have snap grid resolutions down to 0.1mm or 0.05mm?",
        "If you are designing a wheel and an axle, what happens if the axle hole is 0.5mm off-center? (Eccentric wobble)."
      ],
      standards: [
        "CSTA 2-CS-02: Design computational models that reflect mechanical constraints.",
        "NITI Aayog ATL Curriculum Module 3: Alignment, Mirroring, and Metrology Tools in Tinkercad."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 48: Robot Bracket Engineering: Tolerances & Wall Thickness",
    shortTitle: "48. Robot Bracket & Tolerances",
    subtitle: "Real-World Digital Fabrication: Minimum 2mm Walls, Screw Clearances & STL Export",
    summary: "Design an actual 3D-printable mounting bracket for your SG90 Micro Servo from Lab 2! Factor in plastic thermal shrinkage (+0.3mm tolerance) and export for the 3D printer.",
    mascotMsg: "Awesome job, Maker! Now let's combine physical computing with digital fabrication by engineering a custom bracket for our SG90 servo motor! Let's make sure it's strong and fits like a glove! 🦾🛠️",
    difficulty: "Advanced",
    duration: "25 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Tailored Shoe (Thermal Shrinkage & Clearance Fits)",
      story: "If your foot is exactly 25.0cm long and you buy a steel shoe that is exactly 25.000cm, you will never get your foot inside! You need a 2mm clearance so your foot can slip in comfortably. When a 3D printer lays down hot melted PLA plastic at 200°C, the plastic slightly contracts and shrinks as it cools down! An experienced ATL engineer always adds a 0.2mm to 0.4mm clearance tolerance to holes so screws and motors slide in smoothly without cracking.",
      hardwareMetaphor: "Engineering fit classes: Interference (press-fit), Transition, and Clearance (slide-fit) in mechanical robotics."
    },
    jargonBuster: [
      {
        word: "Clearance Tolerance",
        pronunciation: "KLEER-uns TOL-er-uns",
        analogy: "The Shoe Breathing Room",
        definition: "Intentional extra gap added to holes (+0.3mm) so physical parts fit together after printing."
      },
      {
        word: "Wall Thickness",
        pronunciation: "WAWL THIK-ness",
        analogy: "The Cardboard Box Sturdiness",
        definition: "The solid plastic perimeter thickness. Should always be at least 2.0mm to prevent breaking."
      },
      {
        word: "M3 Screw",
        pronunciation: "EM-three Skroo",
        analogy: "Standard Robot Screw",
        definition: "Metric 3mm screw. Clearance hole should be designed at Ø3.4mm so the screw slides through freely."
      },
      {
        word: "STL File",
        pronunciation: "ESS-tee-el",
        analogy: "A 3D PDF Blueprint",
        definition: "Standard Tessellation Language: 3D file format of triangular facets read by 3D printer slicers."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Define SG90 Servo Pocket Specifications:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Motor Body: 22.8mm Width x 12.0mm Depth x 22.5mm Height", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "Add +0.4mm 3D Printing Tolerance: 23.2mm x 12.4mm pocket", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 2: Define Structural Wall Thickness (Minimum 2.5mm):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Outer Bracket Shell: 28.2mm Width x 17.4mm Depth", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "STEP 3: Bore Dual M3 Chassis Mounting Flange Holes:", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "2x Cylinders at Ø3.4mm spaced 28.0mm center-to-center", indent: 1, tag: "code" },
        { id: "h8", line: 8, text: "STEP 4: Export Watertight STL Mesh for 3D Slicer!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Parametric SG90 Servo Bracket in C++ CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const float TOLERANCE = 0.4; // 3D print thermal compensation", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const float WALL_THICKNESS = 2.5; // Structural rigidity", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "empty" },
        { id: "c5", line: 5, text: "module sg90Bracket() {", indent: 0, tag: "block-start" },
        { id: "c6", line: 6, text: "  difference() {", indent: 1, tag: "block-start" },
        { id: "c7", line: 7, text: "    // Solid Outer Bracket Housing", indent: 2, tag: "comment" },
        { id: "c8", line: 8, text: "    cube([22.8 + 2*WALL_THICKNESS, 12.0 + 2*WALL_THICKNESS, 20]);", indent: 2, tag: "code" },
        { id: "c9", line: 9, text: "    // Motor Pocket with Tolerance", indent: 2, tag: "comment" },
        { id: "c10", line: 10, text: "    translate([WALL_THICKNESS, WALL_THICKNESS, 0])", indent: 2, tag: "code" },
        { id: "c11", line: 11, text: "      cube([22.8 + TOLERANCE, 12.0 + TOLERANCE, 25]);", indent: 3, tag: "code" },
        { id: "c12", line: 12, text: "  }", indent: 1, tag: "block-end" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Design for Additive Manufacturing (DFAM) & Engineering Tolerances",
      pedagogy: "Connects digital virtual CAD to physical reality. Introduces students to material properties, thermal expansion/contraction of thermoplastics, and standardized fasteners.",
      misconceptions: [
        {
          title: "Misconception: 'If a screw is M3 (3mm diameter), should the mounting hole in CAD be exactly 3.0mm?'",
          detail: "No! 3D printer slicers approximate circular arcs with straight polyline segments, and hot molten filament slightly squashes inward. An exact 3.0mm CAD hole will print at roughly 2.7mm, binding the screw! Designing it at 3.3mm to 3.4mm gives an effortless clearance fit."
        }
      ],
      discussionPrompts: [
        "Why is a minimum wall thickness of 2.0mm required for FDM 3D printing of robot parts?",
        "If you want to attach your SG90 servo to an aluminum robot chassis, what fastener is better: an M3 screw with a nylon locknut, or hot glue? Why?"
      ],
      standards: [
        "NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among several design solutions.",
        "CSTA 2-AP-16: Incorporate existing code, media, and design libraries into original computational artifacts.",
        "NITI Aayog ATL Curriculum Module 4: 3D Printing Fundamentals, Slicing Preparation, and Rapid Prototyping."
      ]
    }
  }
];

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
      pedagogy: "Grounds Kirchhoff's Voltage Law ($V_{\\text{supply}} = \\sum V_{\\text{drop}}$) through hands-on virtual probe placement. Students grasp why voltage is always measured in parallel across components.",
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
      pedagogyTitle: "Ohm's Law ($V = I \\times R$) & Resistor Color Decoders",
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

const SLICER_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 53: From 3D Mesh to 2D Slices: Layer Height & Print Time",
    shortTitle: "53. Layer Heights & Slicing",
    subtitle: "The Slicer Engine: Chopping 3D Models into Hundreds of 0.2mm Horizontal Slices",
    summary: "Discover how a 3D printer actually works! Learn how slicer software (Cura, PrusaSlicer) slices a 3D STL mesh into micro-thin horizontal sheets, and balance layer height vs print speed.",
    mascotMsg: "Welcome to the 3D Slicing Studio! 🖨️ A 3D printer can't print a whole 3D shape all at once — it builds objects like a stack of pancakes! Let's slice our robot part into layers and discover the magic of layer heights!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Deli Meat Slicer & The Stack of Post-it Notes",
      story: "Imagine buying a solid block of cheese at a grocery deli. The butcher adjusts a dial and runs the blade back and forth, slicing the block into 100 thin slices. If you stack those 100 slices back together on a plate, you have reconstructed the original 3D block! In 3D printing, a Slicer (like Ultimaker Cura or PrusaSlicer) cuts your virtual CAD model into horizontal slices (0.12mm to 0.28mm thick). The printer then draws slice #1 on the bed, steps up by 0.2mm, draws slice #2, and repeats until your physical part is complete!",
      hardwareMetaphor: "The Z-axis lead screw turns a precise fraction of a degree to elevate the printhead gantry by the exact slice height after every layer."
    },
    jargonBuster: [
      {
        word: "Slicer",
        pronunciation: "SLY-sur",
        analogy: "The Blueprint Translator",
        definition: "Software that converts 3D STL CAD models into layer-by-layer G-code machine instructions."
      },
      {
        word: "Layer Height",
        pronunciation: "LAY-er Hite",
        analogy: "Post-it Note Thickness",
        definition: "The vertical thickness of each deposited plastic layer (0.20mm standard, 0.12mm fine)."
      },
      {
        word: "G-Code",
        pronunciation: "JEE-kohd",
        analogy: "Robot GPS Coordinates",
        definition: "The universal programming language of CNC machines and 3D printers (e.g. G1 X50 Y100 E2.5)."
      },
      {
        word: "Nozzle Diameter",
        pronunciation: "NAH-zul Dye-AM-ih-ter",
        analogy: "Felt-Tip Marker Tip",
        definition: "The opening at the tip of the hotend where molten plastic squirts out (standard = 0.4mm)."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Import 3D CAD Mesh (STL file) into Slicer:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Model Total Height = 20.0 mm", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Select Slicing Resolution Profile:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Profile A: Fine (0.12mm layer height) -> 167 Layers -> 1 hr 18 min", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Profile B: Standard (0.20mm layer height) -> 100 Layers -> 42 min (Recommended)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Profile C: Draft (0.28mm layer height) -> 71 Layers -> 26 min", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Generate G-Code toolpaths for 0.4mm brass extrusion nozzle!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Engine G-Code Layer Initiation", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; LAYER: 45 / 100 (Z = 9.00mm)", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "G0 F7200 X105.000 Y105.000 Z9.000 ; Rapid travel to layer start", indent: 0, tag: "code" },
        { id: "c4", line: 4, text: "G1 F1800 E0.80000 ; Un-retract filament (+0.8mm)", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G1 F2400 X155.000 Y105.000 E2.15000 ; Extrude outer perimeter wall", indent: 0, tag: "code" },
        { id: "c6", line: 6, text: "G1 X155.000 Y155.000 E3.50000 ; Extrude right perimeter wall", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Differential Calculus Analogy: Approximating Volumes with Slices",
      pedagogy: "Introduces students to Riemann sums and numerical integration through physical 3D slicing. Demonstrates the engineering trade-off between surface finish (stair-stepping) and manufacturing time.",
      misconceptions: [
        {
          title: "Misconception: 'If you choose 0.1mm layer height instead of 0.2mm, does the part get twice as strong?'",
          detail: "Actually, parts printed with thinner layers can have slightly lower tensile strength between layers because smaller beads cool faster before bonding. 0.20mm is the sweet spot for structural robot parts."
        }
      ],
      discussionPrompts: [
        "Why can you never print a layer height thicker than your nozzle diameter? (A 0.4mm nozzle cannot lay down a 0.5mm bead without losing pressure).",
        "Look at a 3D printed part under a magnifying glass: why does a curved dome look like tiny miniature stair steps?"
      ],
      standards: [
        "NGSS HS-PS3-3: Design, build, and refine a device that works within given constraints to convert one form of energy into another.",
        "NITI Aayog ATL Equipment Package P4: FDM 3D Printer Operation, Slicer Profiles, and Quality Tuning."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 54: Infill Geometry & Strength-to-Weight Optimization",
    shortTitle: "54. Infill Patterns & Strength",
    subtitle: "Why 100% Solid is a Waste: Engineering Internal Lattice Structures (Grid, Gyroid, Honeycomb)",
    summary: "Look inside a 3D printed object! Learn why 3D prints are hollow honeycombs inside, saving 70% of filament weight while maintaining 90% of structural strength.",
    mascotMsg: "If you cut open an airplane wing or a bird's bone, it isn't solid rock inside — it's a hollow, super-strong honeycomb! Let's explore how internal infill patterns give robot parts maximum strength with minimum weight!",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Honeycomb Hive & The Cardboard Box Fluting",
      story: "If you tear open a shipping cardboard box, you see two flat sheets on the outside, and a wavy zig-zag accordion paper in the middle. That wavy middle takes up 80% air, but allows the box to hold heavy textbooks! In 3D printing, the outer walls are called 'Perimeters', and the internal scaffolding is called 'Infill'. Slicing with 20% infill creates a part that uses 1/5th the plastic of a solid block, prints 4x faster, but holds 85% of the payload!",
      hardwareMetaphor: "Internal lattice structures inspired by biomimicry (bird bone trabeculae and bee honeycombs)."
    },
    jargonBuster: [
      {
        word: "Infill Density",
        pronunciation: "IN-fil DEN-sih-tee",
        analogy: "Scaffolding Density",
        definition: "The percentage of solid plastic inside the part (15%-25% standard for robot parts)."
      },
      {
        word: "Perimeter Walls",
        pronunciation: "puh-RIM-ih-ter Walls",
        analogy: "The Castle Moat Walls",
        definition: "The outer solid plastic shells (usually 2 or 3 perimeters = 0.8mm to 1.2mm total)."
      },
      {
        word: "Gyroid Infill",
        pronunciation: "JYE-royd IN-fil",
        analogy: "Wavy Sea Sponges",
        definition: "A continuous 3D wave pattern that provides equal strength in all three directions (isotropic)."
      },
      {
        word: "Filament Consumption",
        pronunciation: "FIL-uh-munt kun-SUMP-shun",
        analogy: "Grams of Plastic Used",
        definition: "Total length (meters) and weight (grams) of plastic melted for the print."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Configure External Perimeters (Wall Count):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Set Wall Line Count = 3 (3 x 0.4mm nozzle = 1.2mm solid shell)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Select Internal Infill Pattern & Density:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Option A: 20% Grid (Fastest printing, high vertical crush strength)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Option B: 20% Gyroid (Isotropic strength, flexible, best for robot gears)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Option C: 20% Honeycomb (Maximum torsional rigidity)", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Material Savings Calculation:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Solid 100% = 68g filament | 20% Infill = 14g filament (79% Plastic Saved!)", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Infill Raster Generation", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; TYPE: INFILL (20% Gyroid)", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "G1 F3600 X115.200 Y120.400 E0.12500 ; Sinusoidal toolpath curve", indent: 0, tag: "code" },
        { id: "c4", line: 4, text: "G1 X125.600 Y124.800 E0.25000", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G1 X135.100 Y120.200 E0.37500", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Structural Mechanics, Weight Optimization & Biomimicry",
      pedagogy: "Teaches why more material does not automatically mean better design. Connects infill patterns to aerospace engineering where mass reduction saves fuel.",
      misconceptions: [
        {
          title: "Misconception: 'If my 3D printed robot bracket broke, should I increase infill from 20% to 100%?'",
          detail: "No! 80% of a part's stiffness comes from its outer perimeter walls. Adding 1 more wall perimeter (e.g. from 2 to 3 walls) makes a part 3x stronger than bumping infill from 20% to 80%, while using far less filament."
        }
      ],
      discussionPrompts: [
        "Why is Gyroid infill preferred over Grid infill for parts that hold liquids or get bent from multiple angles?",
        "If a 1kg spool of PLA plastic costs ₹1,200, how much money do you save per robot chassis by using 20% infill instead of 100%?"
      ],
      standards: [
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process.",
        "NITI Aayog ATL Curriculum Module 4: Infill Density Optimization and Rapid Prototyping."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 55: Overhang Physics: The 45° Rule & Support Structures",
    shortTitle: "55. Overhangs & Supports",
    subtitle: "Gravity vs Molten Plastic: Why 3D Printers Cannot Print on Thin Air",
    summary: "Master the fundamental physical constraint of FDM 3D printing! Learn why angles steeper than 45° sag into stringy spaghetti, and generate sacrificial tree supports.",
    mascotMsg: "Can you build the roof of a house before building the walls? Of course not — gravity would pull the bricks down! The same rule applies to hot 200°C melted plastic. Let's master the 45-Degree Rule!",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Roman Arch Scaffolding & The Snowman Metaphor",
      story: "When ancient Roman masons built a curved stone archway, they first erected temporary wooden scaffolding underneath. Once the center keystone was locked into place, they took the scaffolding away and the arch stood forever on its own! In 3D printing, each new layer must rest on the layer beneath it. If a feature juts out at less than 45°, each new bead rests on 70% of the previous bead. But at 90° (a horizontal ceiling), molten plastic will fall straight down like spaghetti without temporary supports!",
      hardwareMetaphor: "The 45-degree overhang threshold: determined by the surface tension and glass transition cooling rate of extruded thermoplastics."
    },
    jargonBuster: [
      {
        word: "45° Rule",
        pronunciation: "FOR-tee-fyve Dee-gree Rool",
        analogy: "The Safe Ski Slope",
        definition: "Angles up to 45° can be printed cleanly in mid-air without needing any support structures."
      },
      {
        word: "Tree Supports",
        pronunciation: "TREE Sup-ports",
        analogy: "Tree Branches Reaching In",
        definition: "Organic hollow branch structures that grow from the build plate to touch overhangs delicately."
      },
      {
        word: "Bridging",
        pronunciation: "BRIJ-ing",
        analogy: "A Tightrope Walk",
        definition: "Printing a horizontal line straight across two pillars with fast part-cooling fan at 100%."
      },
      {
        word: "Support Interface",
        pronunciation: "Sup-port IN-ter-fayss",
        analogy: "Perforated Tear-off Paper",
        definition: "A 0.2mm air gap layer that lets you snap supports off by hand without scarring the part."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Analyze Overhang Angles on CAD Geometry:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Green Faces (0° to 45° overhang) -> Printable without supports!", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "Red Faces (> 45° overhang) -> Will sag into molten noodles without support!", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 2: Generate Tree Support Scaffolding:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Set Support Overhang Angle = 50°", indent: 1, tag: "setup" },
        { id: "h6", line: 6, text: "Set Support Z Distance = 0.2mm (Easy snap-off clearance)", indent: 1, tag: "setup" },
        { id: "h7", line: 7, text: "STEP 3: Slice and Verify Clean Breakaway Interface!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Support Generation Routine", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; TYPE: SUPPORT-INTERFACE", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "M106 S255 ; Fan 100% cooling to freeze overhang", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "G1 F1500 X120.000 Y130.000 E1.12000 ; Dense breakaway roof layer", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G0 Z9.200 ; Leave 0.2mm air gap before part layer", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Design for Additive Manufacturing (DFAM) & Orientation Optimization",
      pedagogy: "Teaches students how rotating a 3D model on the build plate by 90° can eliminate 100% of required supports, saving 50% print time and giving pristine surface quality.",
      misconceptions: [
        {
          title: "Misconception: 'Should I always use supports on every single model just in case?'",
          detail: "No! Supports waste plastic, increase print time by 30-50%, and leave rough scars when peeled off. A great CAD designer redesigns steep overhangs into 45° chamfers so no supports are ever needed."
        }
      ],
      discussionPrompts: [
        "If you want to 3D print the letter 'T', how would you orient it on the print bed to avoid supports? (Upside down!).",
        "What is the difference between normal blocky supports and organic tree supports?"
      ],
      standards: [
        "CSTA 2-AP-17: Systematically design and iteratively develop computational artifacts.",
        "NITI Aayog ATL Curriculum Module 4: Overhang Physics, Support Structures, and Part Orientation."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 56: Decoding G-Code & Heated Bed Adhesion",
    shortTitle: "56. G-Code & Bed Adhesion",
    subtitle: "Speaking Robot Language: G0/G1 Cartesian Moves, Nozzle Heat (205°C) & Bed Leveling",
    summary: "Become fluent in the universal language of 3D printers! Decode raw G-code machine commands, master heated bed adhesion physics (60°C), and achieve the perfect first layer squish.",
    mascotMsg: "Look under the hood of your 3D printer! 🤖 G-code is the secret robot code telling the stepper motors where to drive and how much hot plastic to pump. Let's run a full print sequence!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Etch-a-Sketch & The Hot Glue Gun",
      story: "Imagine an automated Etch-a-Sketch attached to a hot glue gun. To draw a square, you tell it: 'Drive to (0,0), heat to 200°C, drive to (50,0) while squeezing 2cm of glue, then drive to (50,50)'. That is G-code! Commands starting with 'G' control motion (G28 = Go to Home Origin, G1 = Extrude while moving). Commands starting with 'M' control machine settings (M104 = Heat Nozzle, M140 = Heat Bed).",
      hardwareMetaphor: "The A4988 / TMC2209 stepper motor drivers convert G-code pulses into magnetic micro-steps for the X, Y, Z axes and extruder."
    },
    jargonBuster: [
      {
        word: "G28 (Auto Home)",
        pronunciation: "JEE twenty-eight",
        analogy: "Returning to Home Base",
        definition: "Commands all 3 axes to hit their physical optical or mechanical limit switches to establish (0,0,0)."
      },
      {
        word: "G1 (Linear Move)",
        pronunciation: "JEE one",
        analogy: "Draw Line with Glue",
        definition: "Moves the nozzle in a straight line while simultaneously extruding plastic (E axis)."
      },
      {
        word: "First Layer Squish",
        pronunciation: "FURST LAY-er Skwish",
        analogy: "Spreading Butter on Toast",
        definition: "The slight flattening of the first plastic line against the heated bed to ensure strong adhesion."
      },
      {
        word: "Warping",
        pronunciation: "WORP-ing",
        analogy: "Curling Edges of Dried Mud",
        definition: "When cooling plastic shrinks unevenly, causing corners of the print to lift off the bed."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "3D PRINTER G-CODE START SEQUENCE:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "M140 S60 ; Set Heated Bed Temperature to 60°C (Prevents PLA warping)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "M104 S205 ; Set Extruder Nozzle Temperature to 205°C (Melts PLA plastic)", indent: 1, tag: "setup" },
        { id: "h4", line: 4, text: "G28 ; Auto-Home all 3 axes to X=0, Y=0, Z=0 endstops", indent: 1, tag: "setup" },
        { id: "h5", line: 5, text: "G1 Z0.20 F1200 ; Lower nozzle to 0.20mm first layer height", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "G1 X100 Y50 E5.0 F1500 ; Extrude purge line to prime nozzle pressure", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "3D PRINT ENGINE RUNNING: First layer squish verified 100%!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Standard Marlin / RepRap Start G-Code", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "M190 S60 ; Wait for bed to reach 60C", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "M109 S205 ; Wait for nozzle to reach 205C", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "G28 ; Home all axes", indent: 0, tag: "setup" },
        { id: "c5", line: 5, text: "G92 E0 ; Reset Extruder position", indent: 0, tag: "code" },
        { id: "c6", line: 6, text: "G1 Z2.0 F3000 ; Move Z Axis up", indent: 0, tag: "code" },
        { id: "c7", line: 7, text: "G1 X10.1 Y20 Z0.28 F5000.0 ; Move to start position", indent: 0, tag: "code" },
        { id: "c8", line: 8, text: "G1 X10.1 Y200.0 Z0.28 F1500.0 E15 ; Draw first prime line", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Numerical Control (CNC), G-Code Syntax & Thermodynamic Adhesion",
      pedagogy: "Bridges software simulation to raw machine control. Demystifies G-code by showing students that industrial factory CNC mills, laser cutters, and 3D printers all obey the exact same motion vocabulary.",
      misconceptions: [
        {
          title: "Misconception: 'If my print comes off the bed halfway through, should I turn up print speed?'",
          detail: "No! That is caused by poor bed adhesion. The bed is either unlevel (nozzle too high), greasy from finger oils, or the heated bed is too cold. Clean the PEI sheet with isopropyl alcohol and level the bed."
        }
      ],
      discussionPrompts: [
        "Why does a 3D printer print a 'purge line' or 'skirt' around the part before starting the actual model?",
        "What happens if you command G1 X200 when your printer's build plate is only 150mm wide? (Limit crash)."
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that model physical objects.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification.",
        "NITI Aayog ATL Curriculum Module 4 Capstone: Digital G-Code Verification & Additive Manufacturing Execution."
      ]
    }
  }
];

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
        { id: "c11", line: 11, text: "  Serial.print(\"Sensor Voltage: \"); Serial.println(voltage);", indent: 1, tag: "code" },
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
        { id: "c3", line: 3, text: "  if (aqi <= 50)  return \"Good (Green)\";", indent: 1, tag: "code" },
        { id: "c4", line: 4, text: "  if (aqi <= 100) return \"Satisfactory (Light Green)\";", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "  if (aqi <= 200) return \"Moderate (Yellow)\";", indent: 1, tag: "code" },
        { id: "c6", line: 6, text: "  if (aqi <= 300) return \"Poor (Orange)\";", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "  if (aqi <= 400) return \"Very Poor (Red)\";", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "  return \"Severe / Hazardous (Purple)\";", indent: 1, tag: "code" },
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

window.LESSONS_DATA = LESSONS_DATA;
window.LED_LESSONS_DATA = LESSONS_DATA;
window.SERVO_LESSONS_DATA = SERVO_LESSONS_DATA;
window.POT_LESSONS_DATA = POT_LESSONS_DATA;
window.BUTTON_LESSONS_DATA = BUTTON_LESSONS_DATA;
window.BUZZER_LESSONS_DATA = BUZZER_LESSONS_DATA;
window.LDR_LESSONS_DATA = LDR_LESSONS_DATA;
window.RGB_LESSONS_DATA = RGB_LESSONS_DATA;
window.TEMP_LESSONS_DATA = TEMP_LESSONS_DATA;
window.SONAR_LESSONS_DATA = SONAR_LESSONS_DATA;
window.IR_LESSONS_DATA = IR_LESSONS_DATA;
window.LCD_LESSONS_DATA = LCD_LESSONS_DATA;
const OLED_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 65: Pixel Coordinates & Memory Pages (SSD1306 Architecture)",
    shortTitle: "65. OLED Pixel Addressing",
    subtitle: "128x64 Matrix: Mapping 8,192 Emissive Pixels into 8 Vertical RAM Pages",
    summary: "Discover how a monochrome OLED display renders graphics without a backlight! Learn how 8,192 individual self-lit organic pixels are packed into 8 vertical memory pages (1KB of SRAM) and controlled over high-speed I2C.",
    mascotMsg: "Welcome to Level 3: Advanced Engineering! 🚀 Unlike LCDs with clunky character blocks, this 0.96-inch OLED lets us control every single dot (8,192 pixels)! Each pixel emits its own crisp cyan light. Let's see how memory pages turn bits into visual art!",
    difficulty: "Advanced",
    duration: "20 min",
    category: "Displays & Visuals",
    labId: "oled",
    analogy: {
      headline: "The 8-Storey Hotel with 128 Rooms per Floor",
      story: "Imagine an 8-storey hotel building where each storey is called a 'Page' (Page 0 at the top, Page 7 at the bottom). Each floor has 128 vertical pillars, and inside each pillar are 8 stacked windows (bits 0 to 7). Instead of sending a telegram for every single window, the Arduino sends 1 byte that turns on/off all 8 windows on that floor at once! 8 floors × 128 pillars = 1,024 bytes (1 KB) of RAM to control the entire city of 8,192 lights!",
      hardwareMetaphor: "The SSD1306 controller maps GFX framebuffer memory as 8 pages of 128 vertical 8-bit columns."
    },
    jargonBuster: [
      {
        word: "OLED (Organic LED)",
        pronunciation: "OH-led",
        analogy: "The Self-Glowing Pixel Lamp",
        definition: "A display technology where every subpixel generates its own light, yielding pure infinite contrast and zero backlight bleed."
      },
      {
        word: "SSD1306",
        pronunciation: "Ess-Ess-Dee-Thirteen-Oh-Six",
        analogy: "The Screen Conductor Chip",
        definition: "The internal CMOS driver/controller IC integrated directly onto the glass substrate of the display."
      },
      {
        word: "Page Addressing",
        pronunciation: "Payj Ad-DRES-ing",
        analogy: "8-Row Hotel Floors",
        definition: "Organizing 64 vertical rows into 8 pages of 8 bits each, where 1 byte writes a vertical 1x8 pixel stripe."
      },
      {
        word: "Framebuffer (1KB)",
        pronunciation: "FRAYM-buf-fer",
        analogy: "The Artist's Practice Sketchpad in RAM",
        definition: "A 1024-byte RAM mirror inside Arduino memory where drawing happens before pulsing `display()` to send it over I2C."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 65: SSD1306 128x64 OLED Pixel Addressing
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);
  // Initialize I2C OLED at 400kHz Fast Mode
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed!"));
    for (;;); // Halt
  }
  Wire.setClock(400000); // 400kHz fast I2C bus

  display.clearDisplay(); // Wipe 1KB SRAM buffer

  // Plot individual pixel at (X=64, Y=32) center
  display.drawPixel(64, 32, SSD1306_WHITE);

  // Draw coordinate boundary crosshairs
  display.drawPixel(0, 0, SSD1306_WHITE);       // Top-Left
  display.drawPixel(127, 0, SSD1306_WHITE);     // Top-Right
  display.drawPixel(0, 63, SSD1306_WHITE);       // Bottom-Left
  display.drawPixel(127, 63, SSD1306_WHITE);   // Bottom-Right

  display.display(); // Blast 1024 bytes over I2C to glass!
  Serial.println(F("OLED Framebuffer Rendered Successfully."));
}

void loop() {
  // Static test pattern
}`,
      human: `// Plain English Human Translation:
// 1. Load the Wire (I2C) and Adafruit Graphics libraries.
// 2. Define screen dimensions as 128 pixels wide by 64 pixels high.
// 3. Connect to the SSD1306 driver chip at I2C address 0x3C with a fast 400kHz clock speed.
// 4. Wipe clean the 1,024-byte RAM buffer (set all 8,192 pixels to OFF).
// 5. Light up a single pixel right at the center of the screen (X=64, Y=32).
// 6. Light up the four extreme corner boundary pixels (0,0), (127,0), (0,63), and (127,63).
// 7. Call display.display() to transmit the entire 1KB buffer across the I2C wires to light up the physical glass!`
    },
    stepCheck: {
      instruction: "Explore the 128×64 matrix! Adjust the X and Y coordinate sliders to navigate the OLED cursor, observe which Memory Page (0–7) and Bit (0–7) your pixel occupies in the 1KB buffer, then click 'Transmit Framebuffer' to pulse it to the screen.",
      targetCondition: "oledPixelPushed"
    }
  },
  {
    id: 2,
    title: "Lesson 66: Graphics Primitives & Custom Monochrome Bitmaps (GFX Engine)",
    shortTitle: "66. Shapes & Bitmap Sprites",
    subtitle: "Bresenham's Line & Circle Algorithms: Storing 1-Bit Glyphs in PROGMEM",
    summary: "Harness the Adafruit_GFX library! Draw razor-sharp vector lines, rounded rectangles, circles, and learn how to convert pixel icons into compact hexadecimal byte arrays stored in Flash memory (PROGMEM).",
    mascotMsg: "Time to draw like a digital architect! 🎨 We can draw circles, boxes, and even custom game sprites! Because RAM is tiny, we stash our custom icons safely in the microcontroller's permanent flash memory using PROGMEM. Let's design a custom icon!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Displays & Visuals",
    labId: "oled",
    analogy: {
      headline: "The Rubber Stamp in the Library Archive",
      story: "If you had to draw a complex robot mascot by hand every time, your desk would run out of paper memory immediately. Instead, you carve a reusable rubber stamp and keep it safely locked in the library archive (Flash PROGMEM). Whenever you want the icon on screen, you dip the stamp in digital ink and press drawBitmap—zero extra RAM wasted!",
      hardwareMetaphor: "Monochrome bitmaps use 1 bit per pixel: 8 pixels packed into one hexadecimal byte in PROGMEM."
    },
    jargonBuster: [
      {
        word: "PROGMEM",
        pronunciation: "PROHG-mem",
        analogy: "The Stone Inscription in Flash ROM",
        definition: "Keyword telling Arduino compiler to store constant array data in 32KB Flash memory instead of precious 2KB SRAM."
      },
      {
        word: "Graphics Primitives",
        pronunciation: "GRAF-iks PRIM-ih-tivz",
        analogy: "The Geometry Stencil Ruler",
        definition: "Basic mathematical geometric shapes: drawPixel, drawLine, drawRect, fillRect, drawCircle, fillCircle."
      },
      {
        word: "Monochrome Bitmap",
        pronunciation: "MON-oh-krome BIT-map",
        analogy: "The Punch-Card Black and White Stamp",
        definition: "A visual graphic where each bit represents 1 pixel (0 = black, 1 = emissive illuminated pixel)."
      },
      {
        word: "drawBitmap()",
        pronunciation: "DRAW-bit-map",
        analogy: "The Automated Sprite Stamper",
        definition: "Adafruit GFX function that unpacks a byte array from PROGMEM and renders it at specified (X, Y) coordinates."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 66: GFX Primitives & PROGMEM Bitmap Sprites
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

// Custom 8x8 Heart Mascot Bitmap stored in PROGMEM Flash
const unsigned char PROGMEM heart_icon8x8[] = {
  0b00000000,
  0b01100110,
  0b11111111,
  0b11111111,
  0b11111111,
  0b01111110,
  0b00111100,
  0b00011000
};

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();

  // 1. Draw Geometric Primitives Frame
  display.drawRoundRect(2, 2, 124, 60, 4, SSD1306_WHITE);
  display.drawCircle(64, 32, 18, SSD1306_WHITE);
  display.fillCircle(64, 32, 4, SSD1306_WHITE);

  // 2. Stamp Custom PROGMEM Bitmap Sprite
  display.drawBitmap(10, 10, heart_icon8x8, 8, 8, SSD1306_WHITE);

  // 3. Render Crisp Vector Typography
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(44, 45);
  display.print(F("RADAR V1"));

  display.display();
}

void loop() {}`,
      human: `// Plain English Human Translation:
// 1. Define an 8-row binary array of 8 bits each (0b01100110) representing a heart shape.
// 2. Put 'PROGMEM' before the array so it stays stored in permanent Flash instead of using up RAM.
// 3. Draw a rounded rectangle border around the screen edges with corner radius of 4 pixels.
// 4. Draw a circle of radius 18 pixels at screen center (64, 32) and fill a tiny target dot in the center.
// 5. Stamp our heart icon at coordinates (10, 10) using display.drawBitmap().
// 6. Print the text 'RADAR V1' and push the finished drawing to the OLED screen with display.display().`
    },
    stepCheck: {
      instruction: "Use the interactive 8×8 Pixel Art Editor! Click pixels to sketch a custom mascot or symbol, see the C++ PROGMEM binary hex array update in real time, and click 'Stamp Sprite to OLED' to burn it onto the display.",
      targetCondition: "oledSpriteStamped"
    }
  },
  {
    id: 3,
    title: "Lesson 67: Real-Time Dynamic Telemetry: Circular Ring Buffers & Sparklines",
    shortTitle: "67. Telemetry & Sparklines",
    subtitle: "Flicker-Free Real-Time Waveforms: Streaming High-Frequency Sensor Signals",
    summary: "Transform your OLED into a pocket digital oscilloscope! Implement a 128-element circular ring buffer to stream analog sensor readings, audio waveforms, or heartbeats as smooth, flicker-free sparklines.",
    mascotMsg: "Beep... beep... beep! 📈 Look at your OLED screen transform into a medical electrocardiogram or rocket telemetry monitor! We'll use a circular buffer so new readings push old ones off the edge in real time!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Displays & Visuals",
    labId: "oled",
    analogy: {
      headline: "The Treadmill Conveyor Belt",
      story: "Think of an airport baggage conveyor belt that only holds 128 suitcases. As new luggage arrives from the sensor chute, the oldest suitcase drops off the far end. The OLED screen draws a line connecting the heights of all 128 suitcases—creating a continuously flowing river of real-time data!",
      hardwareMetaphor: "A FIFO circular buffer array int history[128] updated at 20-50Hz and mapped to the vertical pixel height."
    },
    jargonBuster: [
      {
        word: "Circular Ring Buffer",
        pronunciation: "SER-kyoo-ler BUFFER",
        analogy: "The Carousel That Never Stops Spinning",
        definition: "A fixed-size array where the index wraps back to 0 using modulo math, providing fast O(1) continuous streaming."
      },
      {
        word: "Sparkline",
        pronunciation: "SPARK-lyne",
        analogy: "The Mini Financial Stock Chart",
        definition: "A compact, high-density graphic chart showing trends without axes or grid clutter."
      },
      {
        word: "Double Buffering",
        pronunciation: "DUB-ul BUF-fer-ing",
        analogy: "The Theatre Stage Curtain",
        definition: "Performing all drawing operations in hidden RAM before lifting the curtain to push the whole image to display at once."
      },
      {
        word: "Screen Flicker",
        pronunciation: "SKREEN FLIK-er",
        analogy: "The Rapidly Strobe-Flashing Lightbulb",
        definition: "Unpleasant visual tearing caused by drawing directly to a display while it is scanning."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 67: OLED Real-Time Oscilloscope Sparkline
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

const int BUFFER_LEN = 128;
byte sparkline[BUFFER_LEN]; // 128-point circular buffer

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  // Initialize baseline buffer
  for (int i = 0; i < BUFFER_LEN; i++) sparkline[i] = 32;
}

void loop() {
  // 1. Read Analog Signal (Pin A0)
  int rawVal = analogRead(A0); // 0 to 1023
  // Map 0-1023 to OLED Y-axis: 16 (top) to 58 (bottom)
  byte mappedY = map(rawVal, 0, 1023, 58, 16);

  // 2. Shift Circular Buffer Left by 1 position
  for (int i = 0; i < BUFFER_LEN - 1; i++) {
    sparkline[i] = sparkline[i + 1];
  }
  sparkline[BUFFER_LEN - 1] = mappedY; // Insert newest sample

  // 3. Redraw Screen Framebuffer
  display.clearDisplay();
  // Header Telemetry Bar
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print(F("CH1: "));
  display.print(rawVal);
  display.print(F(" ADC | 42FPS"));
  display.drawLine(0, 10, 127, 10, SSD1306_WHITE);

  // 4. Draw Continuous Vector Sparkline
  for (int x = 0; x < BUFFER_LEN - 1; x++) {
    display.drawLine(x, sparkline[x], x + 1, sparkline[x + 1], SSD1306_WHITE);
  }

  display.display(); // Push frame to screen
  delay(20);         // 50 updates per second
}`,
      human: `// Plain English Human Translation:
// 1. Create an array of 128 numbers to hold the height of the wave at every vertical column across the screen.
// 2. Read the analog sensor from pin A0 (0 to 1023) and scale it to fit inside the OLED screen's bottom graph area (16 to 58).
// 3. Shift every number in the array one step to the left, discarding the oldest reading and appending the fresh reading to the end.
// 4. Wipe the RAM buffer, draw a crisp header bar with the real-time numeric reading, and draw connecting lines between each point.
// 5. Blast the finished drawing to the physical OLED at 50 frames per second with zero flicker!`
    },
    stepCheck: {
      instruction: "Select a signal waveform generator (Sine Wave, ECG Heartbeat, Square Pulse, or Sensor Noise), adjust the frequency slider to watch the live OLED sparkline trace oscillate in real time, and click 'Lock Waveform Capture'.",
      targetCondition: "oledWaveformCaptured"
    }
  },
  {
    id: 4,
    title: "Lesson 68: Multi-Screen Embedded UI Architecture: State Machines & Inverted Menus",
    shortTitle: "68. Embedded UI & Menu Nav",
    subtitle: "Finite State Machine (FSM): Rotary/Button Nav & Inverted Video Highlight",
    summary: "Build commercial-grade embedded menus! Structure your firmware with Finite State Machines (FSM), implement debounce navigation, and render sharp highlighted selection bars with XOR inverted video (SSD1306_INVERSE).",
    mascotMsg: "Now we build the brain of a real handheld device! 🕹️ You'll create a multi-page operating system with a header bar, scrollable menu items, and inverse highlighted buttons! Just like on a 3D printer or smart thermostat!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Displays & Visuals",
    labId: "oled",
    analogy: {
      headline: "The Smart Television Guide with the Glow Cursor",
      story: "When you browse channels on your smart TV, the television doesn't redraw the whole universe. It highlights the selected row by reversing colors (black letters become glowing white, and background becomes dark). Pressing DOWN changes a single pointer variable currentSelection++—clean, instant, and intuitive!",
      hardwareMetaphor: "A state machine switch(currentScreen) paired with fillRect(0, y, 128, 10, SSD1306_INVERSE)."
    },
    jargonBuster: [
      {
        word: "Finite State Machine (FSM)",
        pronunciation: "FY-nyte STAYT muh-SHEEN",
        analogy: "The Traffic Light Controller",
        definition: "A program design where the microcontroller executes distinct code depending on the current active mode or screen."
      },
      {
        word: "SSD1306_INVERSE",
        pronunciation: "In-VERS DRAW-ing",
        analogy: "The Photo Negative Inversion",
        definition: "Drawing mode where pixels flip from black to white, or white to black, creating automatic highlight boxes over text."
      },
      {
        word: "Button Debounce",
        pronunciation: "DEE-bownss",
        analogy: "The Bouncing Rubber Ball Filter",
        definition: "Software timer preventing mechanical button spring vibrations from triggering multiple false menu jumps."
      },
      {
        word: "UI Frame Budget",
        pronunciation: "YOO-eye FRAYM BUD-jet",
        analogy: "The Millisecond Expense Account",
        definition: "The maximum amount of CPU time (e.g. 15ms) allocated to graphics rendering without delaying critical sensors."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 68: Embedded Multi-Screen FSM UI Menu
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

enum ScreenState { DASHBOARD, SENSORS, SETTINGS };
ScreenState currentScreen = DASHBOARD;
int selectedItem = 0;

void drawMenu() {
  display.clearDisplay();
  // Header
  display.fillRect(0, 0, 128, 12, SSD1306_WHITE);
  display.setTextColor(SSD1306_BLACK, SSD1306_WHITE); // Inverted text
  display.setCursor(4, 2);
  display.print(F("SPARKBYTE OS v2.4"));

  // Menu Items
  const char* items[] = { "1. System Telemetry", "2. Sensor Diagnostics", "3. Network Config" };
  display.setTextColor(SSD1306_WHITE);
  for (int i = 0; i < 3; i++) {
    int y = 18 + (i * 14);
    if (i == selectedItem) {
      // Invert background bar for highlighted active selection
      display.fillRect(0, y - 2, 128, 12, SSD1306_WHITE);
      display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
    } else {
      display.setTextColor(SSD1306_WHITE);
    }
    display.setCursor(8, y);
    display.print(items[i]);
  }
  display.display();
}

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  drawMenu();
}

void loop() {
  // Button navigation logic would switch currentScreen and update selectedItem
}`,
      human: `// Plain English Human Translation:
// 1. Create a Finite State Machine with three distinct screen states: DASHBOARD, SENSORS, and SETTINGS.
// 2. Draw a crisp white header bar across the top with black inverted letters reading 'SPARKBYTE OS v2.4'.
// 3. Loop through the three menu items and calculate their vertical Y coordinates on screen.
// 4. For whichever item matches selectedItem, draw a white rectangular cursor bar behind it and invert the letters to black.
// 5. Call display.display() to instantly render the professional handheld user interface!`
    },
    stepCheck: {
      instruction: "Navigate the embedded operating system! Use the [▲ Up], [▼ Down], and [● Select] buttons to navigate between Dashboard, Sensor Diagnostics, and Network Settings, watch the OLED display react with inverted highlight bars, and click 'Commit UI Configuration'.",
      targetCondition: "oledMenuNavigated"
    }
  }
];

window.CAD_LESSONS_DATA = CAD_LESSONS_DATA;
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

window.OLED_LESSONS_DATA = OLED_LESSONS_DATA;
const MOTOR_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 73: The H-Bridge Transistor Architecture & Shoot-Through Protection",
    shortTitle: "73. H-Bridge Transistor Logic",
    subtitle: "4 Bipolar Power Transistors: Diagonal Conduction Paths vs Dead-Short Hazards",
    summary: "Discover how four power transistors arranged in an 'H' formation reverse motor rotation! Learn why turning on diagonal pairs (Q1+Q4 = Forward; Q2+Q3 = Reverse) routes current backward, and why turning on both transistors on the same leg causes catastrophic shoot-through burnouts.",
    mascotMsg: "Engines revving! 🏎️ A motor isn't like a gentle LED; it's a magnetic beast that needs massive electrical current! The L298N chip uses an 'H-Bridge' made of four heavy-duty electronic switches. Let's see how flipping switches steers electrons forward and backward!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Robotics & Actuators",
    labId: "motor",
    analogy: {
      headline: "The 4-Valve Water Canal Lock",
      story: "Imagine a water wheel mounted across a central canal. Surrounding it are 4 water valves arranged in an 'H'. If you open Valve 1 (top-left) and Valve 4 (bottom-right), rushing water spins the wheel FORWARD. If you open Valve 2 (top-right) and Valve 3 (bottom-left), water flows the other way and spins the wheel REVERSE! But if you open Valve 1 and Valve 3 simultaneously, water bypasses the wheel entirely, creating a torrential flood (shoot-through short circuit)!",
      hardwareMetaphor: "The L298N integrates two full H-bridges rated for 2 Amps per channel with internal flyback clamping diodes."
    },
    jargonBuster: [
      {
        word: "H-Bridge Circuit",
        pronunciation: "AYCH-brij",
        analogy: "The 4-Way Electron Reversing Switch",
        definition: "A circuit configuration of 4 transistors allowing DC voltage to be applied across a motor in either forward or reverse polarity."
      },
      {
        word: "Shoot-Through Short",
        pronunciation: "SHOOT-throo",
        analogy: "The Direct Wire from Power to Ground",
        definition: "A catastrophic fault occurring when top and bottom transistors on the same side turn on simultaneously, shorting VCC directly to GND."
      },
      {
        word: "Inductive Back-EMF",
        pronunciation: "BAK ee-em-eff",
        analogy: "The Motor Acting as an Electrical Dynamo",
        definition: "Voltage generated by motor spinning inertia that opposes driving current; spikes up to 40V when suddenly turned off."
      },
      {
        word: "Dynamic Braking",
        pronunciation: "dye-NAM-ik BRAY-king",
        analogy: "The Magnetic Parachute",
        definition: "Connecting both motor terminals to GND (IN1=LOW, IN2=LOW) so the motor's own back-EMF creates opposing magnetic drag."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 73: L298N Dual H-Bridge Transistor Truth Table
// Left Motor (Motor A)
const int ENA = 5; // PWM Speed Control Pin
const int IN1 = 6; // Direction Pin 1
const int IN2 = 4; // Direction Pin 2

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.begin(115200);
  Serial.println(F("L298N H-Bridge Initialized."));
}

void motorForward(int speed) {
  analogWrite(ENA, speed); // 0 to 255 PWM
  digitalWrite(IN1, HIGH);  // Q1 ON
  digitalWrite(IN2, LOW);   // Q4 ON -> Diagonal Conduction
}

void motorReverse(int speed) {
  analogWrite(ENA, speed);
  digitalWrite(IN1, LOW);   // Q3 ON
  digitalWrite(IN2, HIGH);  // Q2 ON -> Reverse Diagonal Conduction
}

void motorBrake() {
  analogWrite(ENA, 255);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);   // Dynamic Brake: Short to GND
}

void loop() {
  Serial.println(F("Motor FORWARD at Speed 200..."));
  motorForward(200);
  delay(3000);

  Serial.println(F("Motor Dynamic BRAKE..."));
  motorBrake();
  delay(1000);

  Serial.println(F("Motor REVERSE at Speed 200..."));
  motorReverse(200);
  delay(3000);

  motorBrake();
  delay(2000);
}`,
      human: `// Plain English Human Translation:
// 1. Assign Pin 5 as PWM speed control (ENA), and Pins 6 and 4 as direction switches (IN1, IN2).
// 2. To drive FORWARD: Turn IN1 HIGH and IN2 LOW. This turns on diagonal transistors Q1 and Q4.
// 3. To drive REVERSE: Flip the polarity—turn IN1 LOW and IN2 HIGH. Electrons rush backward through the motor!
// 4. To BRAKE: Pull both IN1 and IN2 LOW while keeping enable HIGH. This clamps the spinning motor to ground.
// 5. Run the motor forward for 3 seconds, brake for 1 second, reverse for 3 seconds, and repeat!`
    },
    stepCheck: {
      instruction: "Test the H-Bridge Truth Table! Click through [Forward (Q1+Q4)], [Reverse (Q2+Q3)], and [Dynamic Brake], observe the electron flow path through the 4-transistor bridge, and click 'Verify H-Bridge Conduction'.",
      targetCondition: "hbridgeVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 74: PWM Speed Modulation & Overcoming Motor Static Friction",
    shortTitle: "74. PWM Speed & Inertia",
    subtitle: "Timer Duty Cycles: Overcoming Mechanical Gearbox Stiction (Deadband Torque)",
    summary: "Control robot speed with precision! Learn why PWM values under 70 fail to spin due to static friction (stiction), and how pulsed high-frequency bursts overcome inertia to achieve smooth low-speed cruising without stalling.",
    mascotMsg: "Ever tried pushing a heavy stalled car? 🚙 The hardest push is getting the wheels to roll that very first millimeter! In DC motors, gears have static friction. A weak PWM signal hums without moving! We need enough kick to break free. Let's throttle up!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Robotics & Actuators",
    labId: "motor",
    analogy: {
      headline: "The Sledgehammer vs The Feather Tap",
      story: "If you gently rest your finger on a heavy bowling ball, it won't budge. But if you give it a sharp, quick tap with a mallet, it overcomes resting friction and rolls smoothly. PWM pulses deliver sharp full-voltage kicks (5V or 12V) thousands of times a second to keep the motor rolling even at low average speeds!",
      hardwareMetaphor: "Arduino Timer 0/1/2 generates 490Hz or 980Hz PWM waves on enable pins ENA and ENB."
    },
    jargonBuster: [
      {
        word: "PWM Duty Cycle",
        pronunciation: "DYOOT-ee SY-kul",
        analogy: "The Rapid Light Dimmer",
        definition: "The percentage of time in each electrical cycle that the voltage pulse remains fully ON (HIGH)."
      },
      {
        word: "Stiction (Static Friction)",
        pronunciation: "STIK-shun",
        analogy: "The Stuck Jar Lid",
        definition: "The friction that must be overcome before resting mechanical gears can start sliding and rotating."
      },
      {
        word: "Torque Deadband",
        pronunciation: "TORK DED-band",
        analogy: "The Engine Idle Stall Zone",
        definition: "PWM values between 0 and ~70 where magnetic force is insufficient to overcome gear resistance."
      },
      {
        word: "Stall Current",
        pronunciation: "STAWL KUR-rent",
        analogy: "The Overheating Electric Heater",
        definition: "The maximum possible electrical current drawn when a motor shaft is physically locked in place."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 74: PWM Speed Ramp & Stiction Breakaway
const int ENA = 5;
const int IN1 = 6;
const int IN2 = 4;

const int STICTION_THRESHOLD = 75; // Minimum PWM to overcome resting gear friction

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  Serial.begin(115200);
}

void loop() {
  // Slowly ramp speed up from 0 to 255 to observe deadband
  for (int pwm = 0; pwm <= 255; pwm += 15) {
    analogWrite(ENA, pwm);
    Serial.print(F("PWM Duty: "));
    Serial.print(pwm);
    
    if (pwm < STICTION_THRESHOLD) {
      Serial.println(F(" -> [DEADBAND: Motor humming, gears locked by stiction]"));
    } else {
      int estimatedRPM = map(pwm, STICTION_THRESHOLD, 255, 30, 220);
      Serial.print(F(" -> [CRUISING: "));
      Serial.print(estimatedRPM);
      Serial.println(F(" RPM]"));
    }
    delay(400);
  }
  delay(1000);
}`,
      human: `// Plain English Human Translation:
// 1. Configure the motor to run forward on Pins 5, 6, and 4.
// 2. Define the STICTION_THRESHOLD at PWM 75: below this value, gears won't move.
// 3. Slowly ramp the PWM speed up in steps of 15 from 0 up to 255 (maximum power).
// 4. Watch how between PWM 0 and 70 the motor makes a faint electrical whine but cannot spin.
// 5. Once PWM crosses 75, the rotor breaks free and spins smoothly up to 220 RPM!`
    },
    stepCheck: {
      instruction: "Throttle up the DC motors! Move the PWM Speed Slider from 0 to 255, watch the motor transition across the Stiction Deadband into smooth rotation, and click 'Calibrate Minimum Breakaway PWM'.",
      targetCondition: "pwmCalibrated"
    }
  },
  {
    id: 3,
    title: "Lesson 75: Differential Skid Steer Rover Kinematics: Tank Drive Dynamics",
    shortTitle: "75. Skid Steer Kinematics",
    subtitle: "Differential Velocity Vectors: Forward, Pivot, Point Spin & Smooth Arcs",
    summary: "Master tank-style robot locomotion! Discover how varying the speed and direction of the left vs right tracks allows the rover to point-spin on its central axis, perform wide racing arcs, or drive in straight laser lines.",
    mascotMsg: "Tracked tanks and Mars rovers don't have steering wheels like cars! 🚜 Instead, they steer by making one side spin faster than the other. Spinning left wheels forward and right wheels backward makes the rover pirouette like a ballerina on a single spot! Let's take the wheel!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Kinematics & Motion",
    labId: "motor",
    analogy: {
      headline: "Rowing a Two-Oared Rowboat",
      story: "If you row both left and right oars forward with equal muscle, the boat glides straight ahead. If you row only the left oar, the boat pivots right! And if you pull the left oar forward while pushing the right oar backward, the boat spins 360 degrees directly in place!",
      hardwareMetaphor: "Kinematics matrix: Linear velocity v = (vr + vl)/2, Angular velocity w = (vr - vl)/L."
    },
    jargonBuster: [
      {
        word: "Skid Steer Drive",
        pronunciation: "SKID STEER",
        analogy: "The Caterpillar Track Bulldozer",
        definition: "Steering a vehicle by varying the relative speeds of wheels on opposite sides rather than angling the wheels."
      },
      {
        word: "Zero-Radius Point Turn",
        pronunciation: "ZIR-oh RAY-dee-us TURN",
        analogy: "The Spinning Ice Skater",
        definition: "Rotating directly around the geometric center by running left tracks in reverse and right tracks in forward."
      },
      {
        word: "Differential Velocity",
        pronunciation: "dif-er-EN-shul veh-LOS-ih-tee",
        analogy: "The Speed Difference Between Left and Right",
        definition: "The mathematical difference (V_right - V_left) that dictates the turn radius and rotational yaw rate."
      },
      {
        word: "Wheel Slip Angle",
        pronunciation: "WHEEL SLIP",
        analogy: "Tires Drifting Sideways on Wet Asphalt",
        definition: "The scrubbing friction of tires dragging sideways against the floor during a skid steer turn."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 75: 4WD Differential Skid Steer Kinematics Engine
// Left Track: ENA (Pin 5), IN1 (Pin 6), IN2 (Pin 4)
// Right Track: ENB (Pin 9), IN3 (Pin 3), IN4 (Pin 2)
const int ENA = 5, IN1 = 6, IN2 = 4;
const int ENB = 9, IN3 = 3, IN4 = 2;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(115200);
}

void drive(int leftSpeed, int rightSpeed) {
  // Left Motor Direction
  if (leftSpeed >= 0) {
    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  } else {
    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  }
  analogWrite(ENA, abs(leftSpeed));

  // Right Motor Direction
  if (rightSpeed >= 0) {
    digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  } else {
    digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  }
  analogWrite(ENB, abs(rightSpeed));
}

void loop() {
  drive(200, 200);   // FORWARD
  delay(2000);
  drive(200, -200);  // POINT TURN RIGHT (Rotate on spot)
  delay(1000);
  drive(-200, 200);  // POINT TURN LEFT
  delay(1000);
  drive(200, 100);   // GENTLE RIGHT ARC TURN
  delay(2000);
  drive(0, 0);       // FULL STOP
  delay(2000);
}`,
      human: `// Plain English Human Translation:
// 1. Wire up both Left (ENA, IN1, IN2) and Right (ENB, IN3, IN4) motor channels to the Arduino.
// 2. Create a unified drive(leftSpeed, rightSpeed) function that handles speeds from -255 to +255.
// 3. For FORWARD: Set both tracks to +200. The rover advances straight ahead.
// 4. For POINT TURN RIGHT: Set Left to +200 and Right to -200. The rover spins on a dime!
// 5. For ARC TURN: Set Left to 200 and Right to 100. The rover carves a graceful curve like a racecar.`
    },
    stepCheck: {
      instruction: "Drive the virtual 4WD rover! Use the Directional D-Pad ([▲ FWD], [◄ POINT LEFT], [► POINT RIGHT], [▼ REV], [● BRAKE]) to command the skid-steer kinematics, and click 'Verify Kinematics Control'.",
      targetCondition: "kinematicsVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 76: Autonomous Navigation: Reactive Obstacle Avoidance Loop",
    shortTitle: "76. Autonomous Obstacle Rover",
    subtitle: "Ultrasonic + L298N Closed Loop: Cruise, Decelerate, Brake, Reverse & Spin Escape",
    summary: "Combine ultrasonic sonar radar with skid steer kinematics! Build an autonomous reactive obstacle avoidance rover: cruise forward, detect barriers at 25cm, reverse safely, scan left and right, and steer into the open path.",
    mascotMsg: "Give your rover autonomous eyes and autonomous wheels! 🤖 By linking HC-SR04 sonar with our L298N H-Bridge, the rover can navigate through unknown mazes, never crashing into walls! Let's deploy the autonomous navigation firmware!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Autonomous Systems",
    labId: "motor",
    analogy: {
      headline: "The Blindfolded Explorer with a Walking Stick",
      story: "Imagine walking through a dark room tapping a walking stick. As long as the stick touches empty air, you march forward confidently. The moment the stick taps a wall, you stop immediately, take two steps backward, turn 90 degrees, and check again. Simple rules create astonishingly smart navigation!",
      hardwareMetaphor: "A reactive subsumption state machine: CRUISE -> EMERGENCY_BRAKE -> REVERSE_ESCAPE -> POINT_TURN."
    },
    jargonBuster: [
      {
        word: "Reactive Navigation",
        pronunciation: "ree-AK-tiv nav-ih-GAY-shun",
        analogy: "The Knee-Jerk Reflex",
        definition: "A robot control loop where sensory inputs directly trigger immediate motor reflexes without complex internal maps."
      },
      {
        word: "Safety Braking Horizon",
        pronunciation: "BRAY-king huh-RY-zun",
        analogy: "The 3-Second Following Distance",
        definition: "The minimum distance (e.g. 25cm) required to decelerate and halt the rover before physical collision."
      },
      {
        word: "Point-Turn Escape Maneuver",
        pronunciation: "POINT-turn ih-SKAYP",
        analogy: "Spinning Away from a Dead End",
        definition: "Executing a 90-degree on-the-spot rotation after backing away from an impassable barrier."
      },
      {
        word: "Subsumption Architecture",
        pronunciation: "sub-SUMP-shun",
        analogy: "The Survival Instinct Hierarchy",
        definition: "Layered behavioral architecture where higher-priority reflexes (obstacle avoidance) override default goals (cruising)."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 76: Autonomous Rover Obstacle Avoidance Course
// Sonar Sensor Pins
const int TRIG_PIN = 10;
const int ECHO_PIN = 11;

const int SAFE_DISTANCE_CM = 25; // Minimum obstacle avoidance threshold

int getDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 25000);
  if (duration == 0) return 999; // No obstacle
  return duration * 0.0343 / 2;
}

void loop() {
  int distance = getDistance();
  Serial.print(F("Sonar Distance: "));
  Serial.print(distance);
  Serial.println(F(" cm"));

  if (distance > SAFE_DISTANCE_CM) {
    // Path Clear -> Cruise Forward!
    drive(190, 190);
  } else {
    // OBSTACLE DETECTED!
    Serial.println(F("EMERGENCY BRAKE!"));
    drive(0, 0); // Dynamic Brake
    delay(250);

    Serial.println(F("Reversing away from obstacle..."));
    drive(-180, -180); // Reverse
    delay(500);

    Serial.println(F("Executing 90-degree Escape Spin..."));
    drive(200, -200); // Point Turn Right
    delay(600);

    drive(0, 0); // Ready for next cycle
    delay(200);
  }
}`,
      human: `// Plain English Human Translation:
// 1. Measure the distance ahead in real time using the ultrasonic sonar module on Pins 10 and 11.
// 2. If the path ahead has more than 25cm of open clearance, drive straight ahead at cruising speed.
// 3. The instant an obstacle appears within 25cm, trigger the EMERGENCY BRAKE reflex!
// 4. Reverse both motors backward for 0.5 seconds to establish safety clearance.
// 5. Spin the rover 90 degrees to the right in a quick point-turn escape maneuver.
// 6. Resume cruising forward in the newly opened direction!`
    },
    stepCheck: {
      instruction: "Run the Autonomous Navigation Simulator! Adjust the Obstacle Distance Slider to approach the 25cm hazard boundary, observe the autonomous rover execute the Brake -> Reverse -> Spin escape sequence, and click 'Deploy Autonomous Rover Course'.",
      targetCondition: "obstacleCoursePassed"
    }
  }
];

window.SOIL_LESSONS_DATA = SOIL_LESSONS_DATA;
const IMU_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 77: MEMS Accelerometer Physics: Earth's 1G Gravity Vector & Tilt Angles",
    shortTitle: "77. Accel Gravity Physics",
    subtitle: "Micro-Cantilever Springs: Decomposing 1G Vector into Pitch & Roll via Trigonometry",
    summary: "Peek inside a microscopic silicon chip! Discover how microscopic comb capacitors on flexible cantilevers detect Earth's 1G gravity vector, and learn the trigonometry formulas (atan2) used to convert raw X, Y, Z acceleration into pitch and roll angles.",
    mascotMsg: "Ever wondered how your smartphone knows when you flip it sideways? 📱 Inside this tiny MPU-6050 chip are microscopic silicon diving boards that bend under Earth's gravitational pull! Let's tilt the sensor and watch gravity bend the numbers!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Inertial Sensors",
    labId: "imu",
    analogy: {
      headline: "The Hanging Chandelier in the Earthquake Room",
      story: "Imagine a heavy crystal chandelier hanging by a rope from the ceiling. When the house is level, the chandelier points straight down at the floor (1G on Z-axis). If you tilt the entire house 30 degrees to the right, the chandelier swings sideways relative to the room (gravity spills onto the X and Y axes). By measuring how much the chandelier tilts, you know the exact tilt of the house!",
      hardwareMetaphor: "Silicon proof mass suspended by polysilicon springs; movement alters capacitance between fixed and movable comb plates."
    },
    jargonBuster: [
      {
        word: "MEMS (Micro-Electro-Mechanical)",
        pronunciation: "MEMZ",
        analogy: "Microscopic Machines Carved on Silicon",
        definition: "Tiny mechanical structures (cantilever beams, masses, springs) etched directly into silicon computer chips."
      },
      {
        word: "1G Gravity Vector",
        pronunciation: "WUN-jee GRAV-ih-tee",
        analogy: "The Invisible Plumb Line to Earth's Core",
        definition: "The 9.81 m/s² gravitational acceleration constantly pulling toward Earth, reading ~16,384 LSB on the vertical axis."
      },
      {
        word: "Pitch Angle (θ)",
        pronunciation: "PITCH",
        analogy: "Airplane Nose Pointing Up or Down",
        definition: "Rotation around the lateral horizontal axis: calculated as atan2(Ax, sqrt(Ay² + Az²)) * 180 / π."
      },
      {
        word: "Roll Angle (φ)",
        pronunciation: "ROHL",
        analogy: "Airplane Tilting Left or Right Wing Down",
        definition: "Rotation around the longitudinal axis: calculated as atan2(Ay, sqrt(Ax² + Az²)) * 180 / π."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 77: MPU6050 Accelerometer Pitch & Roll Calculation
#include <Wire.h>

const int MPU_ADDR = 0x68; // Default I2C Address

int16_t rawAx, rawAy, rawAz;

void setup() {
  Wire.begin();
  Serial.begin(115200);

  // Wake up MPU6050 (Exit Sleep Mode via Power Management 1 Register 0x6B)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission(true);

  Serial.println(F("MPU6050 Initialized. Reading 1G Gravity Vector..."));
}

void loop() {
  // Read 6 bytes of accelerometer registers starting at 0x3B
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);

  rawAx = (Wire.read() << 8) | Wire.read();
  rawAy = (Wire.read() << 8) | Wire.read();
  rawAz = (Wire.read() << 8) | Wire.read();

  // Convert raw LSB to G-forces (scale ±2g = 16384 LSB/g)
  float ax = rawAx / 16384.0;
  float ay = rawAy / 16384.0;
  float az = rawAz / 16384.0;

  // Compute Pitch & Roll using Trigonometric Arc-Tangent
  float pitch = atan2(ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
  float roll = atan2(ay, sqrt(ax * ax + az * az)) * 180.0 / PI;

  Serial.print(F("Pitch: "));
  Serial.print(pitch, 1);
  Serial.print(F("° | Roll: "));
  Serial.print(roll, 1);
  Serial.println(F("°"));

  delay(100);
}`,
      human: `// Plain English Human Translation:
// 1. Connect to the MPU-6050 sensor at I2C address 0x68.
// 2. Wake up the sensor by clearing its sleep bit in register 0x6B.
// 3. Read the 6 acceleration bytes starting from register 0x3B (X, Y, and Z axes).
// 4. Divide each raw integer by 16,384 to convert into real Earth G-forces.
// 5. Use atan2() trigonometry to decompose the 1G vector into tilt angles: Pitch and Roll.
// 6. Print the Pitch and Roll angles in degrees 10 times a second to the Serial Monitor.`
    },
    stepCheck: {
      instruction: "Tilt the MPU-6050 sensor! Adjust the Pitch and Roll sliders, observe how the 1G gravity vector shifts between the X, Y, and Z axes, watch the artificial horizon rotate, and click 'Verify Gravity Vector'.",
      targetCondition: "gravityVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 78: MEMS Gyroscope Physics: Coriolis Effect & Gyro Drift Integration",
    shortTitle: "78. Gyro Coriolis Drift",
    subtitle: "Vibrating Proof Mass: Measuring Angular Velocity (°/s) & The Accumulating Drift Trap",
    summary: "Master rotational rate dynamics! Understand how the Coriolis force deflects a vibrating mass during rotation, why gyroscopes measure angular velocity (°/s) instead of angle, and discover the famous 'drift' that ruins long-term navigation if left uncorrected.",
    mascotMsg: "Spin me right round! 🌀 A gyroscope doesn't feel gravity; it feels pure rotation speed! When you turn your head, it clocks 90 degrees per second. But there's a catch: tiny electrical offsets add up over time like a clock gaining 5 minutes every hour. Let's see how integration drift happens!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Inertial Sensors",
    labId: "imu",
    analogy: {
      headline: "Walking in a Straight Line on a Spinning Carousel",
      story: "If you try to walk in a straight line from the center of a spinning carousel to the edge, an invisible sideways force pushes you sideways! That is the Coriolis effect. The MPU-6050 vibrates a tiny silicon fork; when you twist the sensor, the Coriolis force deflects the fork sideways, measuring exact rotational speed!",
      hardwareMetaphor: "Tuning fork resonator oscillating at 30kHz; Coriolis acceleration Fc = -2m(w x v) deflects the sensing axis."
    },
    jargonBuster: [
      {
        word: "Coriolis Acceleration",
        pronunciation: "kor-ee-OH-lis",
        analogy: "The Invisible Sideways Push on a Spinning Merry-Go-Round",
        definition: "An inertial force acting on objects in motion within a rotating frame of reference, proportional to rotation speed."
      },
      {
        word: "Angular Velocity (ω)",
        pronunciation: "oh-MEG-uh veh-LOS-ih-tee",
        analogy: "The Speedometer of Twisting",
        definition: "The rate of rotational turn, measured in degrees per second (°/s) or radians per second."
      },
      {
        word: "Numerical Integration",
        pronunciation: "noo-MARE-ih-kul in-teh-GRAY-shun",
        analogy: "Adding Up Speed Over Time to Find Total Distance",
        definition: "Calculating angle by summing velocity slices over time intervals: Angle += Rate * dt."
      },
      {
        word: "Zero-Rate Drift",
        pronunciation: "ZIR-oh RAYT DRIFT",
        analogy: "The Leaky Bucket Error Accumulation",
        definition: "Slight DC sensor biases that accumulate over time, causing a stationary sensor's calculated angle to slowly spin."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 78: Gyroscope Angular Velocity & Integration Drift
#include <Wire.h>

const int MPU_ADDR = 0x68;
float gyroZ_angle = 0.0;
unsigned long prevTime = 0;

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); Wire.write(0x00);
  Wire.endTransmission(true);
  prevTime = millis();
}

void loop() {
  // Read Gyro Z axis register (0x47, 0x48)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x47);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 2, true);

  int16_t rawGz = (Wire.read() << 8) | Wire.read();
  // Sensitivity: 131 LSB / (°/s) for ±250 °/s range
  float gyroZ_rate = rawGz / 131.0;

  unsigned long now = millis();
  float dt = (now - prevTime) / 1000.0; // Time step in seconds
  prevTime = now;

  // Numerical Integration: Angle = Angle + Rate * dt
  gyroZ_angle += gyroZ_rate * dt;

  Serial.print(F("Rate: "));
  Serial.print(gyroZ_rate, 2);
  Serial.print(F(" °/s | Integrated Angle: "));
  Serial.print(gyroZ_angle, 2);
  Serial.println(F("° (Observing Drift!)"));

  delay(20); // 50Hz integration rate
}`,
      human: `// Plain English Human Translation:
// 1. Read the Gyroscope Z-axis registers from the MPU-6050 over I2C.
// 2. Divide raw sensor units by 131 to obtain the exact angular velocity in degrees per second (°/s).
// 3. Measure how much time (dt) elapsed since the last loop iteration in fractions of a second.
// 4. Integrate by adding (Rate * dt) onto our total angle accumulator.
// 5. Notice how even when resting still on a table, small sensor noise slowly makes the angle drift away from zero!`
    },
    stepCheck: {
      instruction: "Explore Gyroscope Integration! Use the Angular Velocity Throttle to rotate the sensor, observe how the angle accumulates smoothly, then leave it at 0°/s to observe zero-rate drift, and click 'Verify Gyroscope Integration'.",
      targetCondition: "gyroVerified"
    }
  },
  {
    id: 3,
    title: "Lesson 79: Sensor Fusion: The Complementary Filter Algorithm (High + Low Pass)",
    shortTitle: "79. Complementary Filter",
    subtitle: "98% Gyro Fast Dynamics + 2% Accel Long-Term Gravity Reference = Rock-Solid Telemetry",
    summary: "Solve the ultimate robotic dilemma! Combine the jittery-but-drift-free accelerometer with the smooth-but-drifting gyroscope using a lightweight mathematical filter: Angle = 0.98 * (Angle + GyroRate * dt) + 0.02 * AccelAngle.",
    mascotMsg: "The two sensors have opposite superpowers! 🦸 The accelerometer knows true down, but goes crazy when the drone motors vibrate. The gyroscope is silky smooth, but slowly loses its mind to drift. Put them together in a Complementary Filter, and you get rock-solid flight balance!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Control Theory",
    labId: "imu",
    analogy: {
      headline: "The Speedometer and the GPS Kilometer Markers",
      story: "Your car speedometer is instantaneous and smooth, but tire wear makes it slightly inaccurate over long trips. A roadside kilometer stone is 100% accurate, but only appears once every kilometer. By trusting your speedometer for quick turns (98%) and nudging it toward the kilometer marker (2%), your navigation is perfect!",
      hardwareMetaphor: "High-pass filter on gyro signals + Low-pass filter on accelerometer gravity vector running at 100Hz."
    },
    jargonBuster: [
      {
        word: "Sensor Fusion",
        pronunciation: "SEN-sor FYOO-zhun",
        analogy: "Two Eyewitnesses Solving a Mystery Together",
        definition: "Mathematically combining data from multiple different sensors to eliminate individual weaknesses and maximize accuracy."
      },
      {
        word: "Complementary Filter",
        pronunciation: "kom-pluh-MEN-tuh-ree",
        analogy: "The 98% Gyro + 2% Accel Blending Recipe",
        definition: "A filter combining a high-pass filter (for fast gyro motions) and a low-pass filter (for steady gravity reference) summing to 1.0."
      },
      {
        word: "Low-Pass Filter (LPF)",
        pronunciation: "LOH-pass",
        analogy: "The Noise-Cancelling Earplugs",
        definition: "Filters out high-frequency vibrations from drone propellers, letting only slow, steady gravitational tilt pass through."
      },
      {
        word: "High-Pass Filter (HPF)",
        pronunciation: "HY-pass",
        analogy: "The Trend Stripper",
        definition: "Passes quick dynamic angle changes while continuously blocking slow, steady DC sensor drift offsets."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 79: Complementary Filter Sensor Fusion (Alpha = 0.98)
#include <Wire.h>

const int MPU_ADDR = 0x68;
const float ALPHA = 0.98; // 98% Gyroscope / 2% Accelerometer

float fusedPitch = 0.0;
unsigned long prevTime = 0;

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); Wire.write(0x00);
  Wire.endTransmission(true);
  prevTime = millis();
}

void loop() {
  // 1. Read Raw 6-DOF Sensor Registers
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  int16_t rawAx = (Wire.read() << 8) | Wire.read();
  int16_t rawAy = (Wire.read() << 8) | Wire.read();
  int16_t rawAz = (Wire.read() << 8) | Wire.read();
  Wire.read(); Wire.read(); // Skip Temperature
  int16_t rawGx = (Wire.read() << 8) | Wire.read();

  // 2. Compute Accel Pitch Angle
  float ax = rawAx / 16384.0, ay = rawAy / 16384.0, az = rawAz / 16384.0;
  float accelPitch = atan2(ax, sqrt(ay * ay + az * az)) * 180.0 / PI;

  // 3. Compute Gyro Angular Rate
  float gyroPitchRate = rawGx / 131.0;

  // 4. Calculate Time Step dt
  unsigned long now = millis();
  float dt = (now - prevTime) / 1000.0;
  prevTime = now;

  // 5. COMPLEMENTARY FILTER SENSOR FUSION
  fusedPitch = ALPHA * (fusedPitch + gyroPitchRate * dt) + (1.0 - ALPHA) * accelPitch;

  Serial.print(F("Raw Accel: ")); Serial.print(accelPitch, 1);
  Serial.print(F("° | FUSED PITCH: ")); Serial.print(fusedPitch, 1);
  Serial.println(F("° (Zero Noise, Zero Drift!)"));

  delay(10); // 100Hz fusion loop
}`,
      human: `// Plain English Human Translation:
// 1. Read all 14 sensor registers from the MPU-6050 in a single fast I2C transaction.
// 2. Compute the accelerometer pitch angle using trigonometry (accurate long-term, noisy short-term).
// 3. Compute the gyroscope rotational velocity in degrees per second (smooth short-term, drifts long-term).
// 4. Apply the magical Complementary Filter formula: fusedAngle = 0.98 * (fusedAngle + rate*dt) + 0.02 * accelAngle.
// 5. Enjoy a rock-solid, vibration-proof, zero-drift orientation angle ready for drone flight!`
    },
    stepCheck: {
      instruction: "Compare Sensor Fusion in action! Toggle the Motor Vibration Noise button, observe how Raw Accel spikes wildly while the Fused Complementary Filter remains smooth and centered, and click 'Verify Sensor Fusion'.",
      targetCondition: "fusionVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 80: Closed-Loop Gimbal Stabilization & Flight Telemetry Studio",
    shortTitle: "80. Gimbal Stabilization",
    subtitle: "2-Axis Pan-Tilt Servo Compensation: Real-Time Primary Flight Display (PFD)",
    summary: "Stabilize a drone camera in heavy turbulence! Build a closed-loop 2-axis servo gimbal controller that inverses IMU pitch and roll angles in real time, keeping the horizon level on the Primary Flight Display.",
    mascotMsg: "Welcome to mission control, pilot! 🚁 When your quadcopter hits an air pocket and tilts 20 degrees, the camera gimbal immediately counter-rotates 20 degrees to keep your video buttery smooth! Let's fly the drone and watch the gimbal lock the horizon!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Avionics & Gimbal",
    labId: "imu",
    analogy: {
      headline: "The Chicken's Head Stabilization",
      story: "Have you ever seen a bird or chicken move? No matter how you tilt, shake, or twist the chicken's body, its head stays perfectly fixed in 3D space like a floating camera! Closed-loop gimbal stabilization uses IMU feedback to give your robot the exact same superhuman stabilization!",
      hardwareMetaphor: "Closed-loop servo command: ServoPitch = 90° - FusedPitch, updated at 50Hz."
    },
    jargonBuster: [
      {
        word: "Gimbal Stabilization",
        pronunciation: "GIM-bul stay-buh-li-ZAY-shun",
        analogy: "The Steadicam Floating Camera Rig",
        definition: "A pivoted mechanical support that counter-rotates servos to keep cameras or sensors level despite vehicle movement."
      },
      {
        word: "Primary Flight Display (PFD)",
        pronunciation: "PFD",
        analogy: "The Airplane Cockpit Glass Horizon",
        definition: "An integrated flight instrument showing artificial horizon, roll angles, pitch ladders, and aircraft attitude."
      },
      {
        word: "Horizon Leveling",
        pronunciation: "huh-RY-zun LEV-el-ing",
        analogy: "The Self-Balancing Spirit Level",
        definition: "Maintaining the video frame orientation parallel to the true Earth ground line at all times."
      },
      {
        word: "Servo Counter-Rotation",
        pronunciation: "SER-voh kown-ter roh-TAY-shun",
        analogy: "Pushing Back with Equal and Opposite Force",
        definition: "Commanding servo angle to exactly equal (-1 * vehicle tilt angle) so net payload rotation is zero."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 80: 2-Axis Closed-Loop Camera Gimbal Stabilizer
#include <Wire.h>
#include <Servo.h>

Servo pitchServo;
Servo rollServo;

float fusedPitch = 0.0;
float fusedRoll = 0.0;

void setup() {
  Wire.begin();
  Serial.begin(115200);

  pitchServo.attach(9); // Pitch servo on Pin 9
  rollServo.attach(10); // Roll servo on Pin 10

  pitchServo.write(90); // Center baseline
  rollServo.write(90);
}

void loop() {
  // Read fused IMU orientation (from Lesson 79 Complementary Filter)
  // Vehicle Tilts +25° Pitch -> Servo Counter-Rotates to (90° - 25°) = 65°!
  int servoPitchCmd = constrain(90 - (int)fusedPitch, 30, 150);
  int servoRollCmd = constrain(90 - (int)fusedRoll, 30, 150);

  pitchServo.write(servoPitchCmd);
  rollServo.write(servoRollCmd);

  Serial.print(F("Drone Pitch: ")); Serial.print(fusedPitch);
  Serial.print(F("° -> Gimbal Compensation: ")); Serial.print(servoPitchCmd);
  Serial.println(F("° [HORIZON LOCKED]"));

  delay(20); // 50Hz servo refresh rate
}`,
      human: `// Plain English Human Translation:
// 1. Connect two SG90 micro servos to digital pins 9 and 10 to control camera Pitch and Roll.
// 2. Set both servos to 90 degrees as the level, centered baseline.
// 3. Read the real-time fused Pitch and Roll angles from the MPU-6050.
// 4. Counter-rotate the servos: If the drone tilts up by +20 degrees, rotate the pitch servo down to 70 degrees!
// 5. Constrain the servo angles between 30 and 150 degrees to protect the mechanical linkage.
// 6. The camera remains perfectly horizontal and steady through loops, rolls, and air pockets!`
    },
    stepCheck: {
      instruction: "Fly the Drone Simulator! Click 'Inject Turbulence Gust' to toss the drone into an aggressive roll, watch the closed-loop servos counteract the disturbance to keep the Artificial Horizon level, and click 'Lock Gimbal Horizon'.",
      targetCondition: "gimbalLocked"
    }
  }
];

window.MOTOR_LESSONS_DATA = MOTOR_LESSONS_DATA;
const RFID_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 81: Near-Field Resonant Induction & The SPI 4-Wire Bus",
    shortTitle: "81. RFID Resonant Induction",
    subtitle: "13.56MHz Magnetic Flux: Batteryless Transponders & High-Speed SPI (10Mbps)",
    summary: "Discover contactless magic! Understand how the RC522 coil antenna emits a 13.56MHz alternating magnetic field that wirelessly powers up the chip inside passive cards through resonant inductive coupling, and how the Arduino reads card responses over the 4-wire SPI bus.",
    mascotMsg: "Tap to pay! 💳 Ever wonder how hotel keycards or Apple Pay work without batteries? The reader coil creates an invisible magnetic forcefield. When you bring your card close, its internal coil harvests electricity directly out of thin air! Let's explore the wireless physics!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Wireless & Security",
    labId: "rfid",
    analogy: {
      headline: "The Acoustic Tuning Fork Symphony",
      story: "If you strike a tuning fork tuned to 440Hz and hold it near an untouched tuning fork across the table, the second fork begins vibrating and singing on its own! That is resonance. The RC522 antenna vibrates magnetic waves at 13.56MHz; the tiny coil inside your card catches that exact magnetic frequency, charging an internal capacitor to boot up its microchip!",
      hardwareMetaphor: "LC resonant tank circuit tuned to 13.56MHz; full-wave diode bridge rectifies AC RF field into 3.3V DC to power MIFARE logic."
    },
    jargonBuster: [
      {
        word: "RFID / NFC (13.56MHz)",
        pronunciation: "AR-eff-eye-dee",
        analogy: "The Invisible Short-Range Wireless Wave",
        definition: "Radio Frequency Identification operating at High Frequency (HF 13.56MHz) with typical communication range under 5 cm."
      },
      {
        word: "Resonant Inductive Coupling",
        pronunciation: "REZ-uh-nunt in-DUK-tiv",
        analogy: "Wireless Energy Catching the Wave",
        definition: "Transfer of electrical energy between two matched LC coil antennas via high-frequency alternating magnetic fields."
      },
      {
        word: "SPI (4-Wire Serial Bus)",
        pronunciation: "Ess-Pee-Eye",
        analogy: "The 4-Lane High-Speed Highway",
        definition: "Synchronous Master-Slave bus using MOSI (Master Out), MISO (Master In), SCK (Clock), and SS (Slave Select) at up to 10Mbps."
      },
      {
        word: "Passive Transponder",
        pronunciation: "PASS-iv tran-SPON-dur",
        analogy: "The Batteryless Energy Harvester",
        definition: "A card or keyfob containing zero batteries that wakes up solely by rectifying power from the reader's RF field."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 81: RC522 RFID SPI Initialization & Card Detection
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10  // Slave Select Pin
#define RST_PIN 9  // Reset Pin

MFRC522 rfid(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(115200);
  SPI.begin();      // Initialize 4-wire SPI bus
  rfid.PCD_Init();  // Initialize MFRC522 reader chip

  Serial.println(F("RC522 13.56MHz Reader Initialized."));
  Serial.println(F("Awaiting contactless transponder..."));
}

void loop() {
  // Check if a new RFID card is within magnetic resonance field
  if (!rfid.PICC_IsNewCardPresent()) return;

  // Read card serial number
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print(F("Transponder Detected! UID: "));
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) Serial.print(F(" 0"));
    else Serial.print(F(" "));
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();

  // Halt PICC to stop repeated reads
  rfid.PICC_HaltA();
  delay(1000);
}`,
      human: `// Plain English Human Translation:
// 1. Include the SPI hardware bus library and the official MFRC522 RFID library.
// 2. Define Pin 10 as Slave Select (SS) and Pin 9 as Reset (RST).
// 3. In setup(), start the SPI bus at high speed and initialize the RC522 antenna coil.
// 4. In loop(), continuously ping the near-field zone: if a card arrives, wake it up!
// 5. Read the card's 4-byte Unique Identifier (UID) over the SPI bus and print in hexadecimal.
// 6. Put the card temporarily to sleep (Halt) so it doesn't trigger 1,000 times a second!`
    },
    stepCheck: {
      instruction: "Tap the RFID Card! Adjust the Carrier Flux Range to bring the card into the 13.56MHz resonant antenna zone, watch the harvested voltage power up the chip, and click 'Verify Resonant Induction'.",
      targetCondition: "inductionVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 82: MIFARE Classic 1K Memory Architecture: Sectors, Blocks & Crypto-1",
    shortTitle: "82. MIFARE Memory Architecture",
    subtitle: "1,024-Byte EEPROM: 16 Sectors x 4 Blocks with Key A, Key B & Access Bits",
    summary: "Master the internal memory map of smart cards! Dive into the 1,024-byte EEPROM organized into 16 independent sectors, inspect the factory-locked Manufacturer Block 0 (4-byte UID), and understand Sector Trailers protected by the Crypto-1 authentication handshake.",
    mascotMsg: "A smart card is a miniature filing cabinet with 16 locked drawers (Sectors)! 🗄️ Drawer 0 holds your birth certificate (UID), while Drawer 1 holds your school lunch money. Each drawer has two secret keys (Key A & Key B). Let's unlock the memory map!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Cybersecurity & Storage",
    labId: "rfid",
    analogy: {
      headline: "The Bank Safe Deposit Vault",
      story: "In a bank vault with 16 safety deposit boxes, Box 0 is the public registry displaying the account number (UID). Boxes 1 through 15 hold private valuables. To open Box 1, you must present the bank's key (Key A) and your personal key (Key B). If the keys match, the access control bits allow you to read or deposit coins!",
      hardwareMetaphor: "1KB EEPROM structured as 16 sectors x 4 data blocks of 16 bytes each; Block 3 of each sector stores encryption keys."
    },
    jargonBuster: [
      {
        word: "UID (Unique Identifier)",
        pronunciation: "YOO-eye-dee",
        analogy: "The Factory Serial Number Inscribed on Stone",
        definition: "A read-only 4-byte or 7-byte serial number burned into Sector 0 Block 0 during factory manufacturing."
      },
      {
        word: "Sector Trailer (Block 3)",
        pronunciation: "SEK-tor TRAY-ler",
        analogy: "The Drawer's Master Keyhole",
        definition: "The 4th block of every sector containing Key A (6 bytes), Access Bits (4 bytes), and Key B (6 bytes)."
      },
      {
        word: "Crypto-1 Cipher",
        pronunciation: "KRIP-toh WUN",
        analogy: "The Secret Handshake Cipher",
        definition: "A proprietary 48-bit stream cipher algorithm implemented in hardware to authenticate MIFARE cards."
      },
      {
        word: "Access Control Bits",
        pronunciation: "AK-sess BITS",
        analogy: "The Read/Write Permission Stamp",
        definition: "3 bits per block that dictate whether data blocks can be read, written, incremented, or decremented."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 82: Reading MIFARE Classic 1K Sector 1 with Key A
#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);
MFRC522::MIFARE_Key key;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();

  // Factory default Key A: FF FF FF FF FF FF
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  byte blockAddr = 4; // Sector 1, Block 0 (Absolute Block 4)
  MFRC522::StatusCode status;

  // 1. Authenticate with Sector 1 using Key A
  status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(rfid.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.println(F("Authentication Failed!"));
    rfid.PICC_HaltA();
    return;
  }

  // 2. Read 16 bytes of data from Block 4
  byte buffer[18];
  byte size = sizeof(buffer);
  status = rfid.MIFARE_Read(blockAddr, buffer, &size);
  if (status == MFRC522::STATUS_OK) {
    Serial.print(F("Sector 1 Data (Block 4): "));
    for (byte i = 0; i < 16; i++) {
      Serial.print(buffer[i], HEX); Serial.print(F(" "));
    }
    Serial.println();
  }

  rfid.PCD_StopCrypto1(); // Close encrypted session
  rfid.PICC_HaltA();
  delay(1500);
}`,
      human: `// Plain English Human Translation:
// 1. Create a 6-byte cryptographic key initialized to the factory default 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF.
// 2. Detect a card and target Block 4 (which is the first data drawer inside Sector 1).
// 3. Perform the Crypto-1 authentication handshake: present Key A to the card.
// 4. Once the card verifies the key, read all 16 bytes stored inside Block 4.
// 5. Print the 16 bytes in hexadecimal format to inspect stored user data!
// 6. Call StopCrypto1() to lock the sector back up safely before releasing the card.`
    },
    stepCheck: {
      instruction: "Inspect the MIFARE Memory Map! Click on Sector 0 (Manufacturer Block with UID) and Sector 1 (Data Block with Sector Trailer), observe the 16-byte hex dump and access bits, and click 'Verify Memory Structure'.",
      targetCondition: "memoryVerified"
    }
  },
  {
    id: 3,
    title: "Lesson 83: Access Control Security: UID Whitelist & Electronic Door Latch",
    shortTitle: "83. Smart Door Access Control",
    subtitle: "Cryptographic UID Matching: Active Verification, SG90 Servo Deadbolt & Tamper Deny",
    summary: "Build a commercial-grade smart security lock! Read card UIDs, compare against an authorized master whitelist, actuate an SG90 servo deadbolt for 3 seconds on valid credentials, and trigger visual/audio alarms on unauthorized access attempts.",
    mascotMsg: "Halt, who goes there? 🏰 We're building a real security access control system! Scan the authorized blue keyfob, and the servo deadbolt retracts with a happy double-beep. Scan an unknown stranger card, and the alarm sounds while the latch stays deadlocked!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Access Control & Actuators",
    labId: "rfid",
    analogy: {
      headline: "The Security Guard with the Guest Whitelist",
      story: "At an exclusive VIP club, the bouncer stands at the door with a VIP list. When you arrive, you flash your badge (UID). If your name is on the VIP list, the velvet rope opens for 3 seconds. If your name is absent, red buzzer flashes and the deadbolt remains firmly locked!",
      hardwareMetaphor: "Constant-time byte comparison memcmp(rfid.uid.uidByte, authorizedUID, 4) == 0 preventing timing attacks."
    },
    jargonBuster: [
      {
        word: "Whitelist Authentication",
        pronunciation: "WYTE-list aw-then-tih-KAY-shun",
        analogy: "The VIP Guest List",
        definition: "A security policy that explicitly authorizes designated identifiers while rejecting everything else by default."
      },
      {
        word: "Electronic Deadbolt",
        pronunciation: "DED-bohlt",
        analogy: "The Heavy Steel Locking Pin",
        definition: "A physical mechanical bolt rotated by a servo motor to latch or unlatch secure door frames."
      },
      {
        word: "Constant-Time Comparison",
        pronunciation: "KON-stunt TYME",
        analogy: "The Poker Face Verifier",
        definition: "A cryptographic comparison routine that always takes the exact same number of clock cycles to prevent timing attacks."
      },
      {
        word: "Tamper Lockout",
        pronunciation: "TAM-pur LOK-owt",
        analogy: "The Alarm Siren After 3 Wrong Passwords",
        definition: "Security cooldown logic locking the system and alerting operators after consecutive unauthorized attempts."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 83: RFID Door Access Control with Servo Deadbolt
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

MFRC522 rfid(10, 9);
Servo lockServo;

const byte MASTER_UID[4] = {0xA3, 0x7F, 0x4E, 0x12}; // Authorized Keyfob
const int GREEN_LED = 6;
const int RED_LED = 5;

void setup() {
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  lockServo.attach(3);
  lockServo.write(0); // 0° = Locked Deadbolt
  SPI.begin();
  rfid.PCD_Init();
  Serial.begin(115200);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // Compare Scanned UID with Authorized Master UID
  bool accessGranted = true;
  for (byte i = 0; i < 4; i++) {
    if (rfid.uid.uidByte[i] != MASTER_UID[i]) {
      accessGranted = false;
      break;
    }
  }

  if (accessGranted) {
    Serial.println(F("ACCESS GRANTED! Unlocking door for 3 seconds..."));
    digitalWrite(GREEN_LED, HIGH);
    lockServo.write(90); // 90° = Unlocked
    delay(3000);
    lockServo.write(0);  // Relock
    digitalWrite(GREEN_LED, LOW);
  } else {
    Serial.println(F("ACCESS DENIED! Unauthorized card detected."));
    digitalWrite(RED_LED, HIGH);
    delay(1500);
    digitalWrite(RED_LED, LOW);
  }

  rfid.PICC_HaltA();
}`,
      human: `// Plain English Human Translation:
// 1. Define the authorized card UID as [0xA3, 0x7F, 0x4E, 0x12] (the blue keyfob).
// 2. Attach an SG90 servo motor on Pin 3 to control the physical door latch (0° = Locked, 90° = Open).
// 3. When a card is scanned, compare all 4 bytes of its UID against the authorized master array.
// 4. If all 4 bytes match: Flash Green LED, rotate servo to 90° to open the door, wait 3 seconds, and relock!
// 5. If bytes mismatch: Flash Red LED, keep the deadbolt locked at 0°, and log the security intrusion!`
    },
    stepCheck: {
      instruction: "Test Door Security! Click 'Scan Authorized Keyfob (A3 7F 4E 12)' to watch the servo deadbolt unlock with a green pass, then click 'Scan Stranger Card (D9 1C 88 5B)' to verify red denial, and click 'Verify Door Security'.",
      targetCondition: "accessVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 84: Read/Write Sector Data & RFID Digital Wallet Studio",
    shortTitle: "84. Digital RFID Wallet",
    subtitle: "Value Blocks: Integer Balance Decrement, Cryptographic Key Authentication & Top-Up",
    summary: "Engineer a cashless digital wallet system! Authenticate with Sector 1 using Key A (0xFF 0xFF 0xFF 0xFF 0xFF 0xFF), format Block 4 as a MIFARE Value Block, and perform authenticated cashless balance deductions and top-ups directly on the smart card.",
    mascotMsg: "Tap your card to ride the metro or buy a juice! 🧃 We're not just reading a serial number anymore—we are writing encrypted money directly into the card's memory! Let's build a cashless digital wallet!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Fintech & Embedded Storage",
    labId: "rfid",
    analogy: {
      headline: "The Stamped Subway Token Card",
      story: "Instead of carrying bulky metal coins, you carry an electronic smart pass. When you tap the turnstile, the computer authenticates your card, subtracts $2.50 from Block 4, and writes the new balance back to the chip before opening the gates—in under 15 milliseconds!",
      hardwareMetaphor: "MIFARE Value Block commands: MIFARE_Decrement(), MIFARE_Increment(), and MIFARE_Transfer()."
    },
    jargonBuster: [
      {
        word: "Value Block",
        pronunciation: "VAL-yoo BLOK",
        analogy: "The Self-Checking Bank Account Ledger",
        definition: "A dedicated 16-byte block storing a 4-byte integer balance alongside its inverted complement to prevent fraud."
      },
      {
        word: "Atomic Transaction",
        pronunciation: "uh-TOM-ik tran-ZAK-shun",
        analogy: "The All-or-Nothing Guarantee",
        definition: "An operation that either completely finishes or completely aborts, preventing partial balance deductions."
      },
      {
        word: "Contactless POS",
        pronunciation: "PAY-ment TER-mi-nul",
        analogy: "The Tap-to-Pay Register",
        definition: "A Point-of-Sale terminal that charges electronic smart cards via RF fields."
      },
      {
        word: "Backup Block Mirroring",
        pronunciation: "BAK-up MIR-or-ing",
        analogy: "The Carbon Copy Receipt",
        definition: "Mirroring balances into a secondary backup block so power loss during write never corrupts the card."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 84: Cashless RFID Digital Wallet (Deduct & Top-Up)
#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);
MFRC522::MIFARE_Key key;

const byte WALLET_BLOCK = 4; // Sector 1, Block 0

void setup() {
  SPI.begin();
  rfid.PCD_Init();
  Serial.begin(115200);
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
}

// Deduct fare from card Value Block
bool deductFare(int32_t amount) {
  rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, WALLET_BLOCK, &key, &(rfid.uid));
  
  MFRC522::StatusCode status;
  status = rfid.MIFARE_Decrement(WALLET_BLOCK, amount);
  if (status != MFRC522::STATUS_OK) return false;

  status = rfid.MIFARE_Transfer(WALLET_BLOCK); // Commit to EEPROM
  return (status == MFRC522::STATUS_OK);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.println(F("Card Tapped! Deducting $25 Metro Fare..."));
  if (deductFare(25)) {
    Serial.println(F("TRANSACTION SUCCESS! Remaining balance updated."));
  } else {
    Serial.println(F("Transaction Error or Insufficient Funds!"));
  }

  rfid.PCD_StopCrypto1();
  rfid.PICC_HaltA();
  delay(2000);
}`,
      human: `// Plain English Human Translation:
// 1. Authenticate with Sector 1 using the 6-byte cryptographic key.
// 2. Format Block 4 as a tamper-proof MIFARE Value Block.
// 3. When the card is tapped at the turnstile, call MIFARE_Decrement() to subtract $25.
// 4. Immediately call MIFARE_Transfer() to commit the new balance atomically to EEPROM.
// 5. If successful, display the updated balance and open the gate; if failed, halt with error!`
    },
    stepCheck: {
      instruction: "Operate the Cashless Digital Wallet! Click 'Tap to Pay (-$25)' to deduct fare from the smart card, or click 'Top-Up Balance (+$50)', observe the encrypted block write confirmation, and click 'Deploy RFID Digital Wallet'.",
      targetCondition: "walletDeployed"
    }
  }
];

window.IMU_LESSONS_DATA = IMU_LESSONS_DATA;
const IOT_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 85: Microcontroller vs IoT SoC: ATmega328P vs Xtensa ESP32 Dual-Core",
    shortTitle: "85. Microcontroller vs SoC",
    subtitle: "8-bit Harvard (16MHz, 2KB RAM) vs 32-bit Dual-Core (240MHz, 520KB RAM, Wi-Fi)",
    summary: "Step into the modern IoT computing revolution! Compare the classic 8-bit ATmega328P with the powerhouse 32-bit ESP32 System-on-Chip (SoC), understand FreeRTOS dual-core task scheduling (Core 0 for Wi-Fi stack, Core 1 for user app), and explore deep sleep microamp modes.",
    mascotMsg: "We started in Lesson 1 with a humble 8-bit Arduino. Now look at what you hold: a 240MHz dual-core supercomputer chip with built-in Wi-Fi and Bluetooth that costs less than a cup of coffee! Let's unleash the dual-core beast!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "IoT & Cloud",
    labId: "iot",
    analogy: {
      headline: "The Bicycle Courier vs The High-Speed Bullet Train",
      story: "The ATmega328P is like a reliable single bicycle messenger (16MHz, carries 2KB of letters, works alone). The ESP32 is a supersonic bullet train with two conductors (Core 0 and Core 1 running at 240MHz) with high-speed internet radio towers and 520KB of cargo space!",
      hardwareMetaphor: "Xtensa dual-core LX6 microprocessor with dedicated hardware cryptographic acceleration (AES, SHA, RSA)."
    },
    jargonBuster: [
      {
        word: "SoC (System-on-Chip)",
        pronunciation: "Ess-Oh-See",
        analogy: "The All-in-One Silicon City",
        definition: "An integrated circuit combining CPU, memory, wireless radios, and peripheral interfaces on a single microchip."
      },
      {
        word: "Dual-Core (Xtensa LX6)",
        pronunciation: "DOO-ul KOR",
        analogy: "Two Brains Working in Parallel",
        definition: "Two 32-bit CPU cores: Core 0 handles the complex Wi-Fi/Bluetooth protocol stacks, while Core 1 runs user code."
      },
      {
        word: "240MHz Clock Speed",
        pronunciation: "KLOK SPEED",
        analogy: "15x Faster Engine RPM",
        definition: "Executes 240,000,000 clock cycles per second compared to 16,000,000 on the classic ATmega328P."
      },
      {
        word: "Deep Sleep (10µA)",
        pronunciation: "DEEP SLEEP",
        analogy: "Hibernating Bear with a Watchdog",
        definition: "Ultra-low-power standby mode drawing just 0.01mA, extending battery life from days to multiple years."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 85: ESP32 Dual-Core Architecture & FreeRTOS Tasks
TaskHandle_t TaskWiFI;
TaskHandle_t TaskSensors;

void TaskWiFICode(void * pvParameters) {
  for (;;) {
    Serial.print(F("Core 0: Wi-Fi Protocol Stack Processing on "));
    Serial.println(xPortGetCoreID());
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void TaskSensorsCode(void * pvParameters) {
  for (;;) {
    Serial.print(F("Core 1: High-Speed Sensor Sampling on "));
    Serial.println(xPortGetCoreID());
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("ESP32 Tensilica Dual-Core 240MHz Booting..."));

  // Pin Task 1 to Core 0 (Wi-Fi Protocol Stack)
  xTaskCreatePinnedToCore(TaskWiFICode, "TaskWiFI", 10000, NULL, 1, &TaskWiFI, 0);

  // Pin Task 2 to Core 1 (User Robotics Code)
  xTaskCreatePinnedToCore(TaskSensorsCode, "TaskSensors", 10000, NULL, 1, &TaskSensors, 1);
}

void loop() {
  // Empty: FreeRTOS handles task scheduling
}`,
      human: `// Plain English Human Translation:
// 1. Create two separate task handles under the FreeRTOS real-time operating system.
// 2. Define TaskWiFI to run dedicated networking code without ever stalling your robot sensors.
// 3. Define TaskSensors to sample analog sensors and compute math at high speed.
// 4. Pin TaskWiFI directly to Core 0 with its own 10KB stack memory.
// 5. Pin TaskSensors directly to Core 1 running independently in parallel!
// 6. Enjoy true simultaneous multiprocessing on modern 32-bit silicon!`
    },
    stepCheck: {
      instruction: "Benchmark the ESP32 SoC! Adjust the CPU Clock Frequency Slider from 80MHz (Power Saver) to 240MHz (Turbo Mode), observe how MIPS computing performance and active current draw scale, and click 'Verify Dual-Core Performance'.",
      targetCondition: "socVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 86: Wi-Fi Station Mode, DHCP Lease & RESTful HTTP Client",
    shortTitle: "86. Wi-Fi & RESTful HTTP",
    subtitle: "802.11 b/g/n Networking: WPA2 4-Way Handshake, Dynamic IP Lease & HTTP GET/POST",
    summary: "Connect your hardware to the world wide web! Master ESP32 Wi-Fi Station (STA) mode, establish secure WPA2 association, negotiate a local IP lease through DHCP, and dispatch RESTful HTTP GET and POST requests to web APIs.",
    mascotMsg: "Radio check: 3... 2... 1... Connected! 📶 Your board just joined the local Wi-Fi router, got its own IP address, and talked to a web server across the ocean! Let's watch the 4-way WPA2 security handshake unfold!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Networking & Protocols",
    labId: "iot",
    analogy: {
      headline: "Checking into a Hotel and Getting a Room Key",
      story: "When you arrive at a hotel, you give your reservation name and password (SSID & WPA2). The front desk hands you room number 105 (DHCP assigning 192.168.1.105). Now you can order room service via the room telephone (HTTP GET requests) and receive freshly baked pizza (JSON API response)!",
      hardwareMetaphor: "ESP32 Wi-Fi baseband hardware managing 802.11 MAC layer frames directly via LwIP TCP/IP stack."
    },
    jargonBuster: [
      {
        word: "Station (STA) Mode",
        pronunciation: "STAY-shun MOHD",
        analogy: "The Wireless Client Laptop",
        definition: "Wi-Fi operational mode where the ESP32 associates as a client to an existing home or school wireless router."
      },
      {
        word: "DHCP Protocol",
        pronunciation: "Dee-Aych-See-Pee",
        analogy: "The Automated IP Address Dispenser",
        definition: "Protocol that automatically assigns a unique local IP address (e.g. 192.168.1.105) and gateway to the ESP32."
      },
      {
        word: "WPA2 4-Way Handshake",
        pronunciation: "W-P-A-Two",
        analogy: "The Cryptographic Secret Knock",
        definition: "Security authentication exchange generating pairwise encryption keys without ever transmitting the cleartext Wi-Fi password."
      },
      {
        word: "RESTful HTTP Client",
        pronunciation: "REST-ful Aych-Tee-Tee-Pee",
        analogy: "The Web Browser in Code",
        definition: "Transmitting standard HTTP GET and POST requests over port 80/443 to retrieve or submit JSON data payloads."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 86: ESP32 Wi-Fi Station Association & HTTP Client
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "SparkByte_ATL_Lab";
const char* password = "InnovationHub2026";

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA); // Set Station mode
  WiFi.begin(ssid, password);

  Serial.print(F("Connecting to Wi-Fi SSID: "));
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }

  Serial.println();
  Serial.println(F("WPA2 Handshake Complete! Wi-Fi Connected."));
  Serial.print(F("Assigned IP Address: "));
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://api.sparkbyte.io/weather/current");

    int httpCode = http.GET(); // Dispatch HTTP GET Request
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print(F("HTTP Code: ")); Serial.println(httpCode);
      Serial.print(F("Payload: ")); Serial.println(payload);
    }
    http.end(); // Free sockets
  }
  delay(10000);
}`,
      human: `// Plain English Human Translation:
// 1. Include the official ESP32 WiFi and HTTPClient libraries.
// 2. Configure Wi-Fi in Station (STA) mode and begin connection with SSID and password.
// 3. Wait for the WPA2 4-way security handshake to complete and print the assigned DHCP IP address.
// 4. In the loop, create an HTTP client targeting an online REST API endpoint.
// 5. Send an HTTP GET request across the internet and read the returned server response payload.
// 6. Close the connection cleanly and repeat every 10 seconds.`
    },
    stepCheck: {
      instruction: "Connect the ESP32 to Wi-Fi! Click 'Scan Wi-Fi Networks', click 'Authenticate WPA2 & Negotiate DHCP', observe the local IP lease assigned (192.168.1.105), and click 'Verify Wi-Fi Station Link'.",
      targetCondition: "wifiConnected"
    }
  },
  {
    id: 3,
    title: "Lesson 87: The MQTT Publish/Subscribe Telemetry Broker Protocol (QoS 0/1/2)",
    shortTitle: "87. MQTT Broker Protocol",
    subtitle: "Lightweight Binary Headers (2 Bytes): Topics, Publishers, Subscribers & Keep-Alives",
    summary: "Discover why MQTT powers millions of smart homes and factories! Learn why bloated HTTP headers waste battery, and master the pub/sub architecture: publish sensor data to hierarchical topics and subscribe to instant cloud commands with Quality of Service (QoS).",
    mascotMsg: "HTTP is like sending a heavy cardboard box through snail mail just to send one word. MQTT is like sending a lightning-fast two-letter text message! ⚡ It uses a central switchboard called a Broker. Let's publish messages to the cloud!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "IoT & Cloud",
    labId: "iot",
    analogy: {
      headline: "The Newspaper Publisher and the Subscriber Mailbox",
      story: "Instead of journalists knocking on 10,000 doors individually (HTTP), they print a newspaper on a topic like 'Sports' and drop it at the central newsstand (MQTT Broker). Anyone who loves sports subscribes to that topic. The moment a new score is published, the broker delivers it to all subscribers simultaneously in 2 milliseconds!",
      hardwareMetaphor: "PubSubClient library maintaining a persistent TCP socket connection on port 1883 with ping keep-alives."
    },
    jargonBuster: [
      {
        word: "MQTT Protocol",
        pronunciation: "Em-Q-Tee-Tee",
        analogy: "The Ultra-Lean Two-Byte Telegram",
        definition: "Message Queuing Telemetry Transport: an ISO-standard pub/sub network protocol designed for low-bandwidth embedded devices."
      },
      {
        word: "MQTT Broker",
        pronunciation: "BROH-kur",
        analogy: "The Central Post Office Switchboard",
        definition: "A server (Mosquitto, EMQX, HiveMQ) that receives messages from publishers and distributes them to subscribed clients."
      },
      {
        word: "Topic Hierarchy",
        pronunciation: "TOP-ik HY-ur-ar-kee",
        analogy: "The Channel Folder Path",
        definition: "Slash-delimited subject channels such as 'spkbyte/greenhouse/temperature' allowing fine-grained subscription filtering."
      },
      {
        word: "QoS (Quality of Service)",
        pronunciation: "Q-o-S",
        analogy: "The Certified Mail Guarantee Level",
        definition: "Reliability guarantee: QoS 0 (Fire and forget), QoS 1 (At least once with ACK), QoS 2 (Exactly once)."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 87: MQTT Publisher & Subscriber Engine
#include <WiFi.h>
#include <PubSubClient.h>

const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char* topicPub = "spkbyte/farm/telemetry";
const char* topicSub = "spkbyte/farm/actuator";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print(F("Message arrived on topic: "));
  Serial.println(topic);
  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.print(F("Command Payload: ")); Serial.println(msg);
}

void setup() {
  Serial.begin(115200);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback); // Set downlink listener
}

void loop() {
  if (!client.connected()) {
    if (client.connect("ESP32_SparkByte_Client")) {
      Serial.println(F("Connected to MQTT Broker!"));
      client.subscribe(topicSub); // Listen for cloud commands
    }
  }
  client.loop();

  // Publish sensor telemetry packet every 3 seconds
  static unsigned long lastPub = 0;
  if (millis() - lastPub > 3000) {
    lastPub = millis();
    char telemetryPayload[64];
    snprintf(telemetryPayload, 64, "{\"temp\":26.4,\"aqi\":45,\"uptime\":%lu}", millis()/1000);
    client.publish(topicPub, telemetryPayload);
    Serial.print(F("Published MQTT: ")); Serial.println(telemetryPayload);
  }
}`,
      human: `// Plain English Human Translation:
// 1. Point the client at a public MQTT Broker at broker.emqx.io on standard port 1883.
// 2. Register a callback function to automatically trigger whenever a cloud command arrives.
// 3. Connect to the broker and subscribe to the actuator downlink topic.
// 4. In the loop, package current sensor readings into a lightweight JSON string.
// 5. Publish the JSON packet to the telemetry topic every 3 seconds with minimal network overhead.
// 6. Any phone, computer, or cloud dashboard subscribed to this topic receives the reading in under 30ms!`
    },
    stepCheck: {
      instruction: "Publish and Subscribe to MQTT! Click 'Publish Telemetry Packet', observe the broker log the payload and broadcast to subscriber nodes, click 'Simulate Cloud Downlink Command', and click 'Verify MQTT Pub/Sub Link'.",
      targetCondition: "mqttVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 88: Cloud IoT Dashboard & Bi-Directional Digital Twin Studio",
    shortTitle: "88. Digital Twin Cloud Studio",
    subtitle: "Industry 4.0: Live Sensor Streaming Uplink + Sub-50ms Remote Actuator Downlink",
    summary: "Build the grand finale of your ATL engineering journey! Create a full Industry 4.0 Digital Twin: stream real-time environmental telemetry to cloud visualizer charts (Uplink), and trigger physical actuators remotely from a web dashboard in under 50 milliseconds (Downlink).",
    mascotMsg: "CONGRATULATIONS, MASTER ENGINEER! 🎓 You have completed all 22 labs and 88 lessons! Here is your crowning capstone project: a living, breathing Digital Twin connecting physical hardware to the global cloud! Flip the cloud switch and watch physical reality obey!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Capstone & Industry 4.0",
    labId: "iot",
    analogy: {
      headline: "The Spacecraft and Mission Control Houston",
      story: "When Apollo or the Artemis rocket flies in space, an exact 3D computer clone of the spacecraft runs on giant screens at Mission Control in Houston. Every drop of fuel, every degree of heat, and every switch toggle reflects back and forth between space and Earth in real time. That is a Digital Twin!",
      hardwareMetaphor: "Bi-directional telemetry: JSON telemetry payload published at 1Hz + MQTT callback function parsing command packets."
    },
    jargonBuster: [
      {
        word: "Digital Twin",
        pronunciation: "DIJ-ih-tul TWIN",
        analogy: "The Real-Time Software Doppelganger",
        definition: "A dynamic, real-time digital software replica of a physical machine continuously synced via IoT telemetry."
      },
      {
        word: "Telemetry Uplink",
        pronunciation: "tel-EM-eh-tree UP-link",
        analogy: "The Sensor Data Pipeline to the Sky",
        definition: "Outbound sensor data streaming from physical edge microcontrollers up to cloud servers for storage and visualization."
      },
      {
        word: "Actuator Downlink",
        pronunciation: "AK-choo-ay-tur DOWN-link",
        analogy: "The Remote Control Beam from Mission Control",
        definition: "Low-latency command messages pushed down from web browsers to physical edge hardware to actuate motors or relays."
      },
      {
        word: "ThingSpeak / Cloud IoT",
        pronunciation: "THING-speak",
        analogy: "The Online Analytics Command Center",
        definition: "Cloud platform aggregating sensor telemetry into live interactive browser charts, gauges, and alert triggers."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 88: Complete Bi-Directional Industry 4.0 Digital Twin
#include <WiFi.h>
#include <PubSubClient.h>

const int ONBOARD_LED = 2; // Blue Onboard LED (Actuator)
const int RELAY_PIN = 4;   // Industrial Greenhouse Fan Relay

WiFiClient espClient;
PubSubClient client(espClient);

// Downlink command receiver: Triggers within 30ms of cloud button click!
void handleCloudCommand(char* topic, byte* payload, unsigned int len) {
  String cmd = "";
  for (int i = 0; i < len; i++) cmd += (char)payload[i];
  
  if (cmd == "FAN_ON") {
    digitalWrite(ONBOARD_LED, HIGH);
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println(F("DIGITAL TWIN DOWNLINK: Greenhouse Fan Activated!"));
  } else if (cmd == "FAN_OFF") {
    digitalWrite(ONBOARD_LED, LOW);
    digitalWrite(RELAY_PIN, LOW);
    Serial.println(F("DIGITAL TWIN DOWNLINK: Greenhouse Fan Deactivated."));
  }
}

void setup() {
  pinMode(ONBOARD_LED, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
  client.setServer("broker.emqx.io", 1883);
  client.setCallback(handleCloudCommand);
}

void loop() {
  // Bi-directional loop: Streams telemetry UP, listens for commands DOWN
  client.loop();
}`,
      human: `// Plain English Human Translation:
// 1. Assign Pin 2 (Blue onboard LED) and Pin 4 (Relay) as physical cloud-controlled actuators.
// 2. Connect to the global MQTT Broker and set handleCloudCommand() as the listener.
// 3. When a user anywhere in the world toggles a switch in their web browser, an MQTT command arrives in milliseconds.
// 4. If the command says "FAN_ON", turn on the physical LED and industrial relay immediately!
// 5. Simultaneously, stream live sensor readings back up to the cloud dashboard so online charts update.
// 6. You have mastered physical computing, embedded firmware, and cloud IoT engineering!`
    },
    stepCheck: {
      instruction: "Deploy the Capstone Digital Twin! Click the 'Remote Relay Downlink' switch on the Cloud Dashboard to trigger the physical ESP32 LED and fan relay, observe sub-50ms latency, and click 'Graduate ATL Master Curriculum (88 Lessons)'.",
      targetCondition: "capstoneGraduated"
    }
  }
];

window.RFID_LESSONS_DATA = RFID_LESSONS_DATA;
window.IOT_LESSONS_DATA = IOT_LESSONS_DATA;
window.DMM_LESSONS_DATA = DMM_LESSONS_DATA;
window.SLICER_LESSONS_DATA = SLICER_LESSONS_DATA;
window.DHT_LESSONS_DATA = DHT_LESSONS_DATA;
window.GAS_LESSONS_DATA = GAS_LESSONS_DATA;

