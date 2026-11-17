const fs = require('fs');

// Read compiled lessons.ts
const lessonsFile = fs.readFileSync('sparkbyte-v2/src/data/lessons.ts', 'utf8');

// Test pot code:
const potCode = `#include <Servo.h>
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
}`;

console.log("Testing Pot lesson 4 code compile...");
// Let's check compiler.ts logic
