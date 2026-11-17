lcd_code = '''
const LCD_LESSONS_DATA = [
  {
    id: 1,
    title: "Taming 16 Wires into 2: The Magic of I2C Bus Protocol",
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
        line: "lcd.print(\"ATL INNOVATE\");",
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
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'window.IR_LESSONS_DATA = IR_LESSONS_DATA;'
export_target = 'window.IR_LESSONS_DATA = IR_LESSONS_DATA;\nwindow.LCD_LESSONS_DATA = LCD_LESSONS_DATA;'

if target in text and 'const LCD_LESSONS_DATA' not in text:
    text = text.replace(target, lcd_code + '\n' + export_target)
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Successfully inserted LCD_LESSONS_DATA into js/lessons.js!')
else:
    print('Target not found or already present')
