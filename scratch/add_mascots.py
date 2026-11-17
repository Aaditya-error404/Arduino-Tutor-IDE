import re

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Sonar Lessons mascotMsgs
content = content.replace(
    'title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",',
    'title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",\n    mascotMsg: "Just like bats navigate dark caves without eyes, your Arduino uses 40,000Hz ultrasound waves to \'see\' obstacles ahead! 🦇🔊",'
)

content = content.replace(
    'title: "Precision Microsecond Clocks: Measuring Echo Time with pulseIn()",',
    'title: "Precision Microsecond Clocks: Measuring Echo Time with pulseIn()",\n    mascotMsg: "The pulseIn() command measures time down to a single microsecond (one millionth of a second)! That is faster than the blink of an eye! ⏱️⚡",'
)

content = content.replace(
    'title: "Speed of Sound Physics: The Magical 58.2 Formula",',
    'title: "Speed of Sound Physics: The Magical 58.2 Formula",\n    mascotMsg: "Why divide by 58.2? Because sound travels 1 centimeter in 29.1 microseconds. Round trip is 2 × 29.1 = 58.2! Applied acoustics in code! 📏🎯",'
)

content = content.replace(
    'title: "Automotive Reverse Parking Radar & Distance Hazard Zones",',
    'title: "Automotive Reverse Parking Radar & Distance Hazard Zones",\n    mascotMsg: "You have engineered an automotive reverse-parking radar! 🚗 Beep... beep... beep-beep-beep-BEEEEEP! Safety engineering at work!",'
)

# IR Lessons mascotMsgs
content = content.replace(
    'title: "Invisible Light & Optical Physics: How the TCRT5000 Senses Surfaces",',
    'title: "Invisible Light & Optical Physics: How the TCRT5000 Senses Surfaces",\n    mascotMsg: "The human eye cannot see 940nm infrared light, but your smartphone camera and this phototransistor can! Invisible night vision unlocked! 🔦✨",'
)

content = content.replace(
    'title: "Op-Amp Voltage Comparator & Sensitivity Calibration",',
    'title: "Op-Amp Voltage Comparator & Sensitivity Calibration",\n    mascotMsg: "The LM393 chip acts like a digital referee with a whistle! If voltage crosses the threshold, it snaps the output immediately! 🎛️⚡",'
)

content = content.replace(
    'title: "Reading Shades of Gray: Analog Reflectance ADC",',
    'title: "Reading Shades of Gray: Analog Reflectance ADC",\n    mascotMsg: "White paper reflects over 85% of infrared photons, while black tape absorbs almost all of them! That is how self-driving rovers read race tracks! 🏁🚗",'
)

content = content.replace(
    'title: "Autonomous Line Following Rover: Two Sensors, One Arena",',
    'title: "Autonomous Line Following Rover: Two Sensors, One Arena",\n    mascotMsg: "Autonomous robotics activated! 🏎️💨 Two IR sensors working together keep the robot centered on the line, just like self-driving Tesla lane assist!",'
)

# LCD Lessons mascotMsgs
content = content.replace(
    'title: "Taming 16 Wires into 2: The Magic of I2C Bus Protocol",',
    'title: "Taming 16 Wires into 2: The Magic of I2C Bus Protocol",\n    mascotMsg: "Normally a 16x2 screen requires 16 messy jumper wires. With the PCF8574 I2C backpack, we control the entire screen with just TWO data wires (SDA & SCL)! 📟✨",'
)

content = content.replace(
    'title: "Waking the Screen: lcd.init(), backlight(), and Coordinates",',
    'title: "Waking the Screen: lcd.init(), backlight(), and Coordinates",\n    mascotMsg: "Remember: Column goes first (0 to 15), Row comes second (0 or 1)! Zero-based indexing is how computer memory works everywhere! 🎯📐",'
)

content = content.replace(
    'title: "Designing Custom Characters: 5x8 Pixel Matrix Typography",',
    'title: "Designing Custom Characters: 5x8 Pixel Matrix Typography",\n    mascotMsg: "Each character on the LCD is a 5x8 grid of 40 liquid crystal dots. By toggling binary 1s and 0s in CGRAM, you can draw ANY custom icon! 👾❤️",'
)

content = content.replace(
    'title: "The IoT Command Deck: Live Multi-Sensor Telemetry Billboard",',
    'title: "The IoT Command Deck: Live Multi-Sensor Telemetry Billboard",\n    mascotMsg: "🎉 Congratulations, Master Tinkerer! You have completed all 44 lessons of the Atal Tinkering Lab curriculum! The IoT Command Deck brings all sensors together! 🚀🏆",'
)

with open('js/lessons.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated mascotMsgs in js/lessons.js successfully.")
