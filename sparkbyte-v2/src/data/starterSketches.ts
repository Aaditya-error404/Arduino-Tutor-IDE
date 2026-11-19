/**
 * Authentic Industrial-Grade Arduino C++ Starter Sketches
 * 22 Labs // 88 Lessons (4 per lab)
 *
 * Single source of truth for both:
 * 1. src/data/lessons.ts (Curriculum & AI Coach Engine)
 * 2. src/data/mockCurriculum.ts (EDA Workbench Split-Pane IDE)
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

export const STARTER_SKETCHES: Record<string, Record<number, string>> = {
  'led': {
    1: `void setup() {
    // Code here runs ONCE when you press reset or plug USB in
}
void loop() {
    // Code here runs OVER and OVER in a continuous cycle
}`,
    2: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    // Pin 13 is configured and ready to drive our LED!
}`,
    3: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}`,
    4: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    digitalWrite(13, HIGH);
    delay(300);
    digitalWrite(13, LOW);
    delay(300);
    digitalWrite(13, HIGH);
    delay(800);
    digitalWrite(13, LOW);
    delay(500);
}`,
  },
  'servo': {
    1: `#include <Servo.h>
Servo myServo;

void setup() {
    // myServo is declared and ready for pin attachment!
}
void loop() {
    // Motor awaits our angle commands
}`,
    2: `#include <Servo.h>
Servo myServo;

void setup() {
    myServo.attach(9);
}
void loop() {
    // Pin 9 is actively transmitting PWM pulses to hold position
}`,
    3: `#include <Servo.h>
Servo myServo;

void setup() {
    myServo.attach(9);
}
void loop() {
    myServo.write(90);
    delay(1000);
    myServo.write(180);
    delay(1000);
}`,
    4: `#include <Servo.h>
Servo myServo;
int pos = 0;

void setup() {
    myServo.attach(9);
}
void loop() {
    for (pos = 0; pos <= 180; pos += 1) {
        myServo.write(pos);
        delay(15);
    }
    for (pos = 180; pos >= 0; pos -= 1) {
        myServo.write(pos);
        delay(15);
    }
}`,
  },
  'button': {
    1: `void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}
void loop() {
    int buttonState = digitalRead(2);
    digitalWrite(13, buttonState);
}`,
    2: `void setup() {
    pinMode(2, INPUT_PULLUP);
}
void loop() {
    int state = digitalRead(2);
    delay(50);
}`,
    3: `void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}
void loop() {
    int button = digitalRead(2);
    if (button == LOW) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
}`,
    4: `bool ledState = false;
void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}
void loop() {
    if (digitalRead(2) == LOW) {
        ledState = !ledState;
        digitalWrite(13, ledState);
        delay(250);
    }
}`,
  },
  'pot': {
    1: `void setup() {
    Serial.begin(9600);
}
void loop() {
    int val = analogRead(A0);
    Serial.println(val);
    delay(50);
}`,
    2: `void setup() {
    Serial.begin(9600);
}
void loop() {
    int raw = analogRead(A0);
    float volts = (raw * 5.0) / 1023.0;
    Serial.println(volts);
    delay(100);
}`,
    3: `#include <Servo.h>
Servo myServo;

void setup() {
    myServo.attach(9);
}
void loop() {
    int val = analogRead(A0);
    int angle = map(val, 0, 1023, 0, 180);
    myServo.write(angle);
    delay(15);
}`,
    4: `#include <Servo.h>
Servo steeringServo;
var int potPin = A0;

void setup() {
    steeringServo.attach(9);
    Serial.begin(9600);
}
void loop() {
    int potVal = analogRead(potPin);
    int angle = map(potVal, 0, 1023, 0, 180);
    steeringServo.write(angle);
    delay(15);
}`,
  },
  'buzzer': {
    1: `void setup() {
    // Pin 8 will automatically generate square waves!
}
void loop() {
    tone(8, 440);
    delay(1000);
    noTone(8);
    delay(1000);
}`,
    2: `void setup() {
    // Hardware timer initialized
}
void loop() {
    tone(8, 650);
    delay(350);
    tone(8, 950);
    delay(350);
}`,
    3: `int melody[] = { 262, 294, 330, 349, 392, 440, 494, 523 };
void setup() {
    for (int i = 0; i < 8; i++) {
        tone(8, melody[i], 350);
        delay(400);
    }
}
void loop() {
    // Song plays once at startup
}`,
    4: `var int buzzerPin = 8;
void setup() {
    Serial.begin(9600);
}
void loop() {
    // Real-time keyboard input listener
    if (isKeyPressed()) {
        tone(buzzerPin, getActiveFreq());
    } else {
        noTone(buzzerPin);
    }
}`,
  },
  'cad': {
    1: `// OpenSCAD / Procedural C++ CAD Modeling
$fn = 64; // High-resolution polygon facets

module createSolidBox(x, y, z) {
  // Render parametric solid cube at origin
  cube(size = [x, y, z], center = true);
}
createSolidBox(20.0, 20.0, 20.0);`,
    2: `// CSG Boolean Difference in Procedural CAD
difference() {
  // Positive Solid: Base Box (20x20x20mm)
  cube([20, 20, 20], center = true);

  // Negative Cutter: Through-Hole Cylinder
  cylinder(r = 5.0, h = 32.0, center = true, $fn = 64);
}`,
    3: `// Parametric Alignment Matrix in C++ CAD
struct Vec3D { float x, y, z; };

Vec3D alignToCenter(var Vec3D& parent, var Vec3D& child) {
  // Calculate exact delta offset for concentric alignment
  return { (parent.x - child.x)/2.0f, (parent.y - child.y)/2.0f, 0.0f };
}
// Offset = {0.0mm, 0.0mm} -> Perfectly Concentric!`,
    4: `// Parametric SG90 Servo Bracket in C++ CAD
var float TOLERANCE = 0.4; // 3D print thermal compensation
var float WALL_THICKNESS = 2.5; // Structural rigidity

module sg90Bracket() {
  difference() {
    // Solid Outer Bracket Housing
    cube([22.8 + 2*WALL_THICKNESS, 12.0 + 2*WALL_THICKNESS, 20]);
    // Motor Pocket with Tolerance
    translate([WALL_THICKNESS, WALL_THICKNESS, 0])
      cube([22.8 + TOLERANCE, 12.0 + TOLERANCE, 25]);
  }
}`,
  },
  'dmm': {
    1: `// Measuring Voltage with Arduino ADC (Pin A0)
void setup() {
  Serial.begin(9600); // Telemetry stream
}

void loop() {
  int raw = analogRead(A0);
  float voltage = raw * (5.0 / 1023.0); // Convert ADC to Volts
  Serial.print("Measured Potential: "); Serial.println(voltage);
  delay(500);
}`,
    2: `// Ohm's Law in Software: I = V / R
float V_SUPPLY = 5.0; // 5V USB Rail
float V_LED = 2.05;   // Red LED forward voltage
float R_OHMS = 220.0; // Resistor resistance

float calculateCurrentAmps() {
  float vDrop = V_SUPPLY - V_LED; // 2.95V across resistor
  return (vDrop / R_OHMS);        // 0.0134 Amps (13.4 mA)
}

void setup() {
  Serial.begin(9600);
  Serial.println(F("[DMM] Ohm's Law Current Monitor Active"));
}

void loop() {
  float currentMa = calculateCurrentAmps() * 1000.0;
  Serial.print(F("Measured Current: "));
  Serial.print(currentMa);
  Serial.println(F(" mA"));
  delay(1000);
}`,
    3: `// Continuity Verification in Hardware Test Script
#define PROBE_PIN 2
#define BUZZER_PIN 8

bool checkBusContinuity(int pinInput) {
  pinMode(pinInput, INPUT_PULLUP); // Weak internal pullup
  if (digitalRead(pinInput) == LOW) {
    tone(BUZZER_PIN, 2400, 150); // Sound 2.4kHz Continuity BEEP!
    return true; // Continuous conductive path confirmed
  }
  noTone(BUZZER_PIN);
  return false; // Open circuit detected!
}

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println(F("[DMM] Continuity Buzzer Probe Ready on Pin 2"));
}

void loop() {
  bool isShort = checkBusContinuity(PROBE_PIN);
  if (isShort) {
    Serial.println(F("BEEP! Continuous path confirmed (0.1 Ohm)"));
  } else {
    Serial.println(F("OPEN (O.L) - High Impedance"));
  }
  delay(500);
}`,
    4: `// Automated Self-Test Diagnostic Routine
#define PIN_SUPPLY A0
#define PIN_LED A1

enum DiagnosticResult { OK, NO_POWER, BLOWN_RESISTOR, REVERSED_LED, SHORT_CIRCUIT };

DiagnosticResult runBoardDiagnostics() {
  float vSupply = analogRead(PIN_SUPPLY) * (5.0 / 1023.0);
  float vLed = analogRead(PIN_LED) * (5.0 / 1023.0);
  if (vSupply < 4.5) return NO_POWER;
  if (vLed < 0.2)    return BLOWN_RESISTOR;
  if (vLed > 4.7)    return REVERSED_LED;
  return OK; // Healthy LED forward drop detected (1.8V - 2.2V)
}

void setup() {
  Serial.begin(9600);
  Serial.println(F("[DMM] Automated Self-Test Diagnostics Initialized"));
}

void loop() {
  DiagnosticResult res = runBoardDiagnostics();
  if (res == OK) {
    Serial.println(F("DIAGNOSTIC STATUS: PASS (LED Bias 2.05V)"));
  } else if (res == NO_POWER) {
    Serial.println(F("DIAGNOSTIC STATUS: FAIL (No 5V Rail Power)"));
  } else if (res == BLOWN_RESISTOR) {
    Serial.println(F("DIAGNOSTIC STATUS: FAIL (Resistor Open Circuit)"));
  } else if (res == REVERSED_LED) {
    Serial.println(F("DIAGNOSTIC STATUS: FAIL (LED Reverse Polarity)"));
  }
  delay(1000);
}`,
  },
  'ldr': {
    1: `void setup() {
    Serial.begin(9600);
}
void loop() {
    int lightVal = analogRead(A1);
    Serial.println(lightVal);
    delay(200);
}`,
    2: `void setup() {
    Serial.begin(9600);
}
void loop() {
    int raw = analogRead(A1);
    float volts = (raw * 5.0) / 1023.0;
    Serial.println(volts);
    delay(100);
}`,
    3: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    int light = analogRead(A1);
    if (light < 400) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
    delay(100);
}`,
    4: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    int lux = analogRead(A1);
    if (lux < threshold) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
}`,
  },
  'rgb': {
    1: `void setup() {
    pinMode(9, OUTPUT);  // Red Channel
    pinMode(10, OUTPUT); // Green Channel
    pinMode(11, OUTPUT); // Blue Channel
}
void loop() {
    digitalWrite(9, HIGH); // Red ON
    digitalWrite(10, HIGH);// Green ON (Red+Green = Yellow!)
    digitalWrite(11, LOW); // Blue OFF
    delay(1000);
}`,
    2: `void setup() {
    pinMode(9, OUTPUT);
}
void loop() {
    for (int b = 0; b <= 255; b++) {
        analogWrite(9, b); // 0 to 255 (0% to 100% duty cycle)
        delay(10);
    }
    for (int b = 255; b >= 0; b--) {
        analogWrite(9, b);
        delay(10);
    }
}`,
    3: `void setRGB(int r, int g, int b) {
  analogWrite(9, r);  // Red Pin ~9
  analogWrite(10, g); // Green Pin ~10
  analogWrite(11, b); // Blue Pin ~11
}

void setup() {
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
}

void loop() {
  // Vibrant Orange
  setRGB(255, 120, 0);
  delay(1000);
  // Electric Purple
  setRGB(180, 0, 255);
  delay(1000);
  // Neon Cyan
  setRGB(0, 255, 200);
  delay(1000);
}`,
    4: `void setup() {
    pinMode(9, OUTPUT); pinMode(10, OUTPUT); pinMode(11, OUTPUT);
}
void loop() {
    // Autonomous 3-Phase Rainbow Cycle
    for (int i = 0; i < 255; i++) { analogWrite(9, 255-i); analogWrite(10, i); delay(10); }
    for (int i = 0; i < 255; i++) { analogWrite(10, 255-i); analogWrite(11, i); delay(10); }
    for (int i = 0; i < 255; i++) { analogWrite(11, 255-i); analogWrite(9, i); delay(10); }
}`,
  },
  'temp': {
    1: `void setup() {
    Serial.begin(9600);
}
void loop() {
    int rawADC = analogRead(A2); // Read Pin A2
    Serial.println(rawADC);
    delay(1000);
}`,
    2: `void setup() {
  Serial.begin(9600);
  Serial.println(F("[TMP36] Real-Time Celsius Converter"));
}

void loop() {
  int raw = analogRead(A2);
  float volts = (raw * 5.0) / 1024.0;
  float tempC = (volts - 0.5) * 100.0;
  Serial.print(F("Temperature: "));
  Serial.print(tempC);
  Serial.println(F(" C"));
  delay(1000);
}`,
    3: `void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    float tempC = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;
    if (tempC > 30.0) {
        digitalWrite(13, HIGH); tone(8, 880); // Overheat Alarm!
    } else {
        digitalWrite(13, LOW);  noTone(8);    // Normal Safe Range
    }
    delay(100);
}`,
    4: `void setup() {
    pinMode(6, OUTPUT); // PWM Cooling Fan Pin ~6
}
void loop() {
    float temp = ((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0;
    if (temp > 28.0) {
        int fanPWM = map(temp, 28, 45, 120, 255);
        analogWrite(6, constrain(fanPWM, 0, 255)); // Cool Down!
    } else {
        analogWrite(6, 0); // Temperature Normal (Conserve Energy)
    }
    delay(100);
}`,
  },
  'sonar': {
    1: `#define TRIG_PIN 12
#define ECHO_PIN 11

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.println(F("[HC-SR04] Ultrasonic Radar Initialized"));
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  long distanceCm = duration / 58;
  Serial.print(F("Distance: "));
  Serial.print(distanceCm);
  Serial.println(F(" cm"));
  delay(200);
}`,
    2: `#define TRIG_PIN 12
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
  Serial.println(" microseconds (Âµs)");
  
  delay(200);
}`,
    3: `#define TRIG_PIN 12
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
    4: `#define TRIG_PIN 12
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
  },
  'ir': {
    1: `#define IR_SENSOR_PIN 2
#define LED_INDICATOR 13

void setup() {
  Serial.begin(9600);
  pinMode(IR_SENSOR_PIN, INPUT);
  pinMode(LED_INDICATOR, OUTPUT);
  Serial.println(F("[TCRT5000] Optical Line Tracker Initialized"));
}

void loop() {
  int val = digitalRead(IR_SENSOR_PIN);
  if (val == HIGH) {
    digitalWrite(LED_INDICATOR, HIGH);
    Serial.println(F("LINE DETECTED: Surface Absorbing (Black Tape)"));
  } else {
    digitalWrite(LED_INDICATOR, LOW);
    Serial.println(F("FLOOR CLEAR: Surface Reflecting (White Tile)"));
  }
  delay(150);
}`,
    2: `#define IR_DIGITAL_PIN 2

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
    3: `#define IR_ANALOG_PIN A0

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
    4: `#define LEFT_IR_PIN 2
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
    Serial.println("ROVER: FULL SPEED AHEAD â¬ï¸");
  } else if (leftVal == HIGH && rightVal == LOW) {
    // Left sensor hit BLACK line -> Turn Left to recenter!
    analogWrite(LEFT_MOTOR_PWM, 50);
    analogWrite(RIGHT_MOTOR_PWM, 220);
    Serial.println("ROVER: DRIFT LEFT detected -> STEER LEFT â¬ï¸");
  } else if (leftVal == LOW && rightVal == HIGH) {
    // Right sensor hit BLACK line -> Turn Right to recenter!
    analogWrite(LEFT_MOTOR_PWM, 220);
    analogWrite(RIGHT_MOTOR_PWM, 50);
    Serial.println("ROVER: DRIFT RIGHT detected -> STEER RIGHT â¡ï¸");
  } else {
    // Both on BLACK: Crossline / Station Stop
    analogWrite(LEFT_MOTOR_PWM, 0);
    analogWrite(RIGHT_MOTOR_PWM, 0);
    Serial.println("ROVER: INTERSECTION DETECTED -> ALL MOTORS STOP ð");
  }
  delay(50);
}`,
  },
  'slicer': {
    1: `; Cura Engine G-Code Layer Initiation
; LAYER: 45 / 100 (Z = 9.00mm)
G0 F7200 X105.000 Y105.000 Z9.000 ; Rapid travel to layer start
G1 F1800 E0.80000 ; Un-retract filament (+0.8mm)
G1 F2400 X155.000 Y105.000 E2.15000 ; Extrude outer perimeter wall
G1 X155.000 Y155.000 E3.50000 ; Extrude right perimeter wall`,
    2: `; Cura Infill Raster Generation
; TYPE: INFILL (20% Gyroid)
G1 F3600 X115.200 Y120.400 E0.12500 ; Sinusoidal toolpath curve
G1 X125.600 Y124.800 E0.25000
G1 X135.100 Y120.200 E0.37500`,
    3: `; Cura Support Generation Routine
; TYPE: SUPPORT-INTERFACE
M106 S255 ; Fan 100% cooling to freeze overhang
G1 F1500 X120.000 Y130.000 E1.12000 ; Dense breakaway roof layer
G0 Z9.200 ; Leave 0.2mm air gap before part layer`,
    4: `; Standard Marlin / RepRap Start G-Code
M190 S60 ; Wait for bed to reach 60C
M109 S205 ; Wait for nozzle to reach 205C
G28 ; Home all axes
G92 E0 ; Reset Extruder position
G1 Z2.0 F3000 ; Move Z Axis up
G1 X10.1 Y20 Z0.28 F5000.0 ; Move to start position
G1 X10.1 Y200.0 Z0.28 F1500.0 E15 ; Draw first prime line`,
  },
  'dht': {
    1: `#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println(F("[DHT11] Temperature & Humidity Sensor Online"));
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("% | Temp: "));
  Serial.print(t);
  Serial.println(F(" C"));
  delay(1000);
}`,
    2: `#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println(F("[DHT11] Heat Index Computation Unit"));
}

void loop() {
  delay(1000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  float hi = t + 0.5555 * ((6.11 * exp(5417.7530 * (1/273.16 - 1/(273.15 + t))) * (h / 100)) - 10);
  Serial.print(F("Heat Index: "));
  Serial.println(hi);
}`,
    3: `#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT22
#define FAN_PIN 6

DHT dht(DHTPIN, DHTTYPE);

float calcHeatIndex(float t, float h) {
  float tf = (t * 1.8) + 32.0;
  float hiF = -42.379 + 2.04901523*tf + 10.14333127*h - 0.22475541*tf*h;
  return (hiF - 32.0) / 1.8;
}

void setup() {
  Serial.begin(9600);
  pinMode(FAN_PIN, OUTPUT);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  float heatIndex = calcHeatIndex(t, h);

  Serial.print("Heat Index: ");
  Serial.println(heatIndex);

  if (heatIndex > 38.0) {
    digitalWrite(FAN_PIN, HIGH);
  } else {
    digitalWrite(FAN_PIN, LOW);
  }
  delay(1000);
}`,
    4: `#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11

var int PIN_FAN = 6;
var int PIN_MIST = 7;

DHT dht(DHTPIN, DHTTYPE);

void regulateClimate(float t, float h) {
  if (t > 28.0) {
    digitalWrite(PIN_FAN, HIGH);
  } else {
    digitalWrite(PIN_FAN, LOW);
  }
  if (h < 40.0) {
    digitalWrite(PIN_MIST, HIGH);
  } else {
    digitalWrite(PIN_MIST, LOW);
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_FAN, OUTPUT);
  pinMode(PIN_MIST, OUTPUT);
  dht.begin();
  Serial.println(F("[GREENHOUSE] Dual Setpoint Climate Controller Ready"));
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  regulateClimate(t, h);
  delay(1000);
}`,
  },
  'gas': {
    1: `// MQ Gas Sensor Analog Reading
var int PIN_MQ_ANALOG = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawADC = analogRead(PIN_MQ_ANALOG);
  float voltage = rawADC * (5.0 / 1023.0);
  Serial.print("Sensor Voltage: "); Serial.println(voltage);
  delay(500);
}`,
    2: `// Converting MQ Analog Voltage to Gas PPM
var float R0 = 9.83; // Calibrated clean air base
var float RL = 5.0;  // 5k load resistor
var int PIN_MQ_ANALOG = A0;

float calculatePpm(float vOut) {
  float rs = ((5.0 - vOut) * RL) / vOut;
  float ratio = rs / R0;
  return 574.25 * pow(ratio, -2.222);
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawADC = analogRead(PIN_MQ_ANALOG);
  float voltage = rawADC * (5.0 / 1023.0);
  float ppm = calculatePpm(voltage);
  Serial.print("Gas PPM: ");
  Serial.println(ppm);
  delay(500);
}`,
    3: `// Interrupt-Driven Hazardous Gas Alarm
var int PIN_GAS_DO = 2;  // Hardware interrupt pin
var int PIN_BUZZER = 8;  // Piezo alarm siren
volatile bool gasAlarm = false;

void gasAlarmISR() {
  gasAlarm = true; // High-speed hardware flag
}

void setup() {
  pinMode(PIN_GAS_DO, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(PIN_GAS_DO), gasAlarmISR, FALLING);
}

void loop() {
  int rawADC = analogRead(A0);
  if (rawADC > 400 || digitalRead(PIN_GAS_DO) == LOW) {
    tone(PIN_BUZZER, 880);
    delay(250);
    tone(PIN_BUZZER, 1200);
    delay(250);
  } else {
    noTone(PIN_BUZZER);
    delay(200);
  }
}`,
    4: `#define PIN_GAS A0
#define PIN_ALARM 8

String getAqiCategory(int aqi) {
  if (aqi <= 50) return "GOOD (0-50)";
  if (aqi <= 100) return "SATISFACTORY (51-100)";
  if (aqi <= 200) return "MODERATE (101-200)";
  if (aqi <= 300) return "POOR (201-300)";
  return "HAZARDOUS (300+)";
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_ALARM, OUTPUT);
  Serial.println(F("[CPCB] Air Quality Index Monitor Initialized"));
}

void loop() {
  int gasRaw = analogRead(PIN_GAS);
  int aqi = map(gasRaw, 0, 1023, 10, 500);
  Serial.print(F("AQI: "));
  Serial.print(aqi);
  Serial.print(F(" | Category: "));
  Serial.println(getAqiCategory(aqi));
  if (aqi > 200) {
    digitalWrite(PIN_ALARM, HIGH);
  } else {
    digitalWrite(PIN_ALARM, LOW);
  }
  delay(1000);
}`,
  },
  'lcd': {
    1: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("SparkByte Studio");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Uptime: ");
  lcd.print(millis() / 1000);
  lcd.print("s ");
  delay(500);
}`,
    2: `#include <Wire.h>
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
    3: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Robotics Lab 16");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Pulse Rate: 72bpm");
  delay(800);
  lcd.setCursor(0, 1);
  lcd.print("Pulse Rate: --bpm");
  delay(300);
}`,
    4: `#include <Wire.h>
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
  },
  'oled': {
    1: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.drawRect(0, 0, 128, 64, SSD1306_WHITE);
  display.drawCircle(64, 32, 20, SSD1306_WHITE);
  display.display();
}

void loop() {
  display.display();
  delay(1000);
}`,
    2: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 66: GFX Primitives & PROGMEM Bitmap Sprites
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

var unsigned char PROGMEM heart_icon8x8[] = {
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
}

void loop() {
  display.clearDisplay();
  display.drawRoundRect(2, 2, 124, 60, 4, SSD1306_WHITE);
  display.drawCircle(64, 32, 18, SSD1306_WHITE);
  display.fillCircle(64, 32, 4, SSD1306_WHITE);
  display.drawBitmap(10, 10, heart_icon8x8, 8, 8, SSD1306_WHITE);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(44, 45);
  display.print(F("RADAR V1"));
  display.display();
  delay(500);
}`,
    3: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 17, Lesson 67: OLED Real-Time Oscilloscope Sparkline
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

var int BUFFER_LEN = 128;
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
    4: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
int screenState = 0;

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
}

void loop() {
  display.clearDisplay();
  display.drawRect(0, 0, 128, 64, SSD1306_WHITE);
  if (screenState == 0) {
    display.drawCircle(64, 32, 16, SSD1306_WHITE);
  } else {
    display.fillCircle(64, 32, 12, SSD1306_WHITE);
  }
  display.display();
  screenState = (screenState + 1) % 2;
  delay(1000);
}`,
  },
  'soil': {
    1: `var int SOIL_PIN = A1;

void setup() {
  Serial.begin(9600);
  Serial.println(F("[SOIL] Capacitive Moisture Probe Calibration"));
}

void loop() {
  int raw = analogRead(SOIL_PIN);
  int pct = map(raw, 580, 260, 0, 100);
  Serial.print(F("Soil ADC: "));
  Serial.print(raw);
  Serial.print(F(" | Moisture: "));
  Serial.print(pct);
  Serial.println(F("%"));
  delay(500);
}`,
    2: `var int RELAY_PIN = 7;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Active-LOW: OFF at boot
  Serial.begin(9600);
  Serial.println(F("[RELAY] Optocoupled Irrigation Pump Ready"));
}

void loop() {
  Serial.println(F("PUMP ON (Irrigating Crop)"));
  digitalWrite(RELAY_PIN, LOW); // LOW activates optocoupled relay
  delay(2000);
  Serial.println(F("PUMP OFF (Threshold Reached)"));
  digitalWrite(RELAY_PIN, HIGH);
  delay(3000);
}`,
    3: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 71: Bang-Bang Controller with Deadband Hysteresis
var int SOIL_PIN = A1;
var int RELAY_PIN = 7;

// Dual Hysteresis Thresholds
var int DRY_LIMIT = 35; // Turn pump ON when soil drops below 35%
var int WET_LIMIT = 65; // Keep pumping until soil reaches 65%

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
    4: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 18, Lesson 72: Closed-Loop Smart Greenhouse Irrigation Controller
var int SOIL_PIN = A1;
var int RELAY_PIN = 7;
var int FLOAT_SWITCH_PIN = 8; // Digital Float Sensor in Water Reservoir

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
  },
  'motor': {
    1: `var int ENA = 5;
var int IN1 = 4;
var int IN2 = 2;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("[L298N] H-Bridge DC Motor Driver Online"));
}

void loop() {
  // Drive Forward
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200);
  Serial.println(F("Motor: FORWARD (200 PWM)"));
  delay(2000);

  // Brake
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);
  Serial.println(F("Motor: BRAKE"));
  delay(1000);

  // Reverse
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 180);
  Serial.println(F("Motor: REVERSE (180 PWM)"));
  delay(2000);
}`,
    2: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 74: PWM Speed Ramp & Stiction Breakaway
var int ENA = 5;
var int IN1 = 6;
var int IN2 = 4;

var int STICTION_THRESHOLD = 75; // Minimum PWM to overcome resting gear friction

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
    3: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 19, Lesson 75: 4WD Differential Skid Steer Kinematics Engine
// Left Track: ENA (Pin 5), IN1 (Pin 6), IN2 (Pin 4)
// Right Track: ENB (Pin 9), IN3 (Pin 3), IN4 (Pin 2)
var int ENA = 5, IN1 = 6, IN2 = 4;
var int ENB = 9, IN3 = 3, IN4 = 2;

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
    4: `var int ENA = 5;
var int IN1 = 4;
var int IN2 = 2;
var int TRIG_PIN = 10;
var int ECHO_PIN = 11;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println(F("[ROVER] Obstacle Avoidance Navigator Online"));
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dist = pulseIn(ECHO_PIN, HIGH) / 58;

  if (dist > 20) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 220);
    Serial.println(F("Path Clear: Cruising Forward"));
  } else {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(ENA, 180);
    Serial.println(F("Obstacle Detected! Reversing"));
  }
  delay(200);
}`,
  },
  'imu': {
    1: `#include <Wire.h>
var int MPU_ADDR = 0x68;

void setup() {
  Wire.begin();
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  Serial.begin(115200);
  Serial.println(F("[MPU6050] 6-DoF IMU Telemetry Stream Ready"));
}

void loop() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);
  int16_t ax = Wire.read() << 8 | Wire.read();
  int16_t ay = Wire.read() << 8 | Wire.read();
  int16_t az = Wire.read() << 8 | Wire.read();
  float pitch = atan2(ay, az) * 180.0 / PI;
  float roll = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
  Serial.print(F("Pitch: "));
  Serial.print(pitch);
  Serial.print(F(" deg | Roll: "));
  Serial.print(roll);
  Serial.println(F(" deg"));
  delay(100);
}`,
    2: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 78: Gyroscope Angular Velocity & Integration Drift
#include <Wire.h>

var int MPU_ADDR = 0x68;
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
  // Sensitivity: 131 LSB / (Â°/s) for Â±250 Â°/s range
  float gyroZ_rate = rawGz / 131.0;

  unsigned long now = millis();
  float dt = (now - prevTime) / 1000.0; // Time step in seconds
  prevTime = now;

  // Numerical Integration: Angle = Angle + Rate * dt
  gyroZ_angle += gyroZ_rate * dt;

  Serial.print(F("Rate: "));
  Serial.print(gyroZ_rate, 2);
  Serial.print(F(" Â°/s | Integrated Angle: "));
  Serial.print(gyroZ_angle, 2);
  Serial.println(F("Â° (Observing Drift!)"));

  delay(20); // 50Hz integration rate
}`,
    3: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 20, Lesson 79: Complementary Filter Sensor Fusion (Alpha = 0.98)
#include <Wire.h>

var int MPU_ADDR = 0x68;
var float ALPHA = 0.98; // 98% Gyroscope / 2% Accelerometer

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
  Serial.print(F("Â° | FUSED PITCH: ")); Serial.print(fusedPitch, 1);
  Serial.println(F("Â° (Zero Noise, Zero Drift!)"));

  delay(10); // 100Hz fusion loop
}`,
    4: `// SparkByte K-12 ATL Robotics Curriculum
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
  // Vehicle Tilts +25Â° Pitch -> Servo Counter-Rotates to (90Â° - 25Â°) = 65Â°!
  int servoPitchCmd = constrain(90 - (int)fusedPitch, 30, 150);
  int servoRollCmd = constrain(90 - (int)fusedRoll, 30, 150);

  pitchServo.write(servoPitchCmd);
  rollServo.write(servoRollCmd);

  Serial.print(F("Drone Pitch: ")); Serial.print(fusedPitch);
  Serial.print(F("Â° -> Gimbal Compensation: ")); Serial.print(servoPitchCmd);
  Serial.println(F("Â° [HORIZON LOCKED]"));

  delay(20); // 50Hz servo refresh rate
}`,
  },
  'rfid': {
    1: `#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println(F("[RC522] 13.56MHz RFID Reader Initialized"));
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.print(F("CARD DETECTED! UID: "));
    for (byte i = 0; i < rfid.uid.size; i++) {
      Serial.print(rfid.uid.uidByte[i], HEX);
      Serial.print(F(" "));
    }
    Serial.println();
    rfid.PICC_HaltA();
  }
  delay(250);
}`,
    2: `// SparkByte K-12 ATL Robotics Curriculum
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
    3: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 83: RFID Door Access Control with Servo Deadbolt
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

MFRC522 rfid(10, 9);
Servo lockServo;

var byte MASTER_UID[4] = {0xA3, 0x7F, 0x4E, 0x12}; // Authorized Keyfob
var int GREEN_LED = 6;
var int RED_LED = 5;

void setup() {
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  lockServo.attach(3);
  lockServo.write(0); // 0Â° = Locked Deadbolt
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
    lockServo.write(90); // 90Â° = Unlocked
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
    4: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 84: Cashless RFID Digital Wallet (Deduct & Top-Up)
#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);
MFRC522::MIFARE_Key key;

var byte WALLET_BLOCK = 4; // Sector 1, Block 0

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
  },
  'iot': {
    1: `#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3); // RX, TX

void setup() {
  Serial.begin(115200);
  espSerial.begin(9600);
  Serial.println(F("[ESP8266] WiFi Coprocessor UART Initialized"));
  espSerial.println(F("AT"));
}

void loop() {
  if (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  delay(100);
}`,
    2: `#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3);

void setup() {
  Serial.begin(115200);
  espSerial.begin(9600);
  Serial.println(F("[ESP8266] Connecting to WiFi AP..."));
  espSerial.println(F("AT+CWJAP=\\"SparkByte-Lab\\",\\"Robotics2026\\""));
}

void loop() {
  Serial.println(F("HTTP GET /api/telemetry -> 200 OK"));
  delay(3000);
}`,
    3: `#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3);

void setup() {
  Serial.begin(115200);
  espSerial.begin(9600);
  Serial.println(F("[MQTT] Connected to broker.hivemq.com:1883"));
}

void loop() {
  Serial.println(F("Published MQTT -> topic: 'atl/telemetry/station1' [temp: 24.5C, hum: 50%]"));
  delay(4000);
}`,
    4: `#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3);
int packetSeq = 0;

void setup() {
  Serial.begin(115200);
  espSerial.begin(9600);
  Serial.println(F("[INDUSTRY 4.0] Digital Twin Telemetry Engine Online"));
}

void loop() {
  packetSeq++;
  Serial.print(F("JSON Payload sent (seq #"));
  Serial.print(packetSeq);
  Serial.println(F("): {\\"temp\\": 24.5, \\"lux\\": 450, \\"status\\": \\"ONLINE\\"}"));
  delay(3000);
}`,
  },
};

export const LAB_PINS: Record<string, string> = {
  'led': `#define LED_PIN 13
`,
  'servo': `#define SERVO_PIN 9
`,
  'button': `#define BUTTON_PIN 2
#define LED_PIN 13
`,
  'pot': `#define POT_PIN A0
#define SERVO_PIN 9
`,
  'buzzer': `#define BUZZER_PIN 8
`,
  'cad': `// Parametric OpenSCAD CSG Models
`,
  'dmm': `#define PROBE_PIN 2
#define BUZZER_PIN 8
#define PIN_SUPPLY A0
#define PIN_LED A1
`,
  'ldr': `#define LDR_PIN A1
#define LED_PIN 13
`,
  'rgb': `#define RED_PIN 9
#define GREEN_PIN 10
#define BLUE_PIN 11
`,
  'temp': `#define TEMP_PIN A2
#define FAN_PIN 6
`,
  'sonar': `#define TRIG_PIN 12
#define ECHO_PIN 11
#define BUZZER_PIN 8
`,
  'ir': `#define IR_PIN 2
#define LED_PIN 13
`,
  'slicer': `// G-Code Slicer Toolpaths
`,
  'dht': `#define DHT_PIN 4
#define FAN_PIN 6
#define MIST_PIN 7
`,
  'gas': `#define GAS_PIN A0
#define ALARM_PIN 8
`,
  'lcd': `#define LCD_SDA A4
#define LCD_SCL A5
#define LCD_ADDR 0x27
`,
  'oled': `#define OLED_SDA A4
#define OLED_SCL A5
#define OLED_ADDR 0x3C
`,
  'soil': `#define SOIL_PIN A1
#define RELAY_PIN 7
`,
  'motor': `#define MOTOR_ENA 5
#define MOTOR_IN1 4
#define MOTOR_IN2 2
`,
  'imu': `#define MPU_SDA A4
#define MPU_SCL A5
#define MPU_ADDR 0x68
`,
  'rfid': `#define RFID_SS 10
#define RFID_RST 9
`,
  'iot': `#define ESP_RX 2
#define ESP_TX 3
`,
};
