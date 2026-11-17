# -*- coding: utf-8 -*-
"""
Script to insert OLED_LESSONS_DATA into js/lessons.js
"""

oled_lessons_code = '''
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
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

if "OLED_LESSONS_DATA" not in lessons:
    # insert before window.CAD_LESSONS_DATA
    marker = "window.CAD_LESSONS_DATA = CAD_LESSONS_DATA;"
    lessons = lessons.replace(
        marker,
        oled_lessons_code.strip() + "\n\n" + marker + "\nwindow.OLED_LESSONS_DATA = OLED_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(lessons)
    print("OLED_LESSONS_DATA inserted into js/lessons.js successfully!")
else:
    print("OLED_LESSONS_DATA already in js/lessons.js.")

print("Done step 2.")
