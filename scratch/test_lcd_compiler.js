// Test how compiler.ts processes custom_lcd_cpp
const fs = require('fs');

const custom_lcd_cpp = `#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
}
void loop() {
  lcd.setCursor(0, 0);
  lcd.print("SparkByte v2");
  lcd.setCursor(0, 1);
  lcd.print("Aaditya Joshi");
  delay(500);
}`;

console.log("Testing compiled steps for custom_lcd_cpp...");
