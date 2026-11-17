with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Sonar Lesson 1: Add shortTitle
old_sonar_1 = """const SONAR_LESSONS_DATA = [
  {
    id: 1,
    title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",
    mascotMsg: "Just like bats navigate dark caves without eyes, your Arduino uses 40,000Hz ultrasound waves to 'see' obstacles ahead! 🦇🔊",
    subtitle: "Zero-jargon physical principle of ultrasound echolocation and dual transducer cans\","""

new_sonar_1 = """const SONAR_LESSONS_DATA = [
  {
    id: 1,
    title: "Bats, Dolphins and Sonic Pulses: How the HC-SR04 Hears Distance",
    shortTitle: "1. Ultrasound Physics",
    mascotMsg: "Just like bats navigate dark caves without eyes, your Arduino uses 40,000Hz ultrasound waves to 'see' obstacles ahead! 🦇🔊",
    subtitle: "Zero-jargon physical principle of ultrasound echolocation and dual transducer cans\","""

text = text.replace(old_sonar_1, new_sonar_1)

# Sonar Lesson 2: Add shortTitle & mascotMsg
old_sonar_2 = """  {
    id: 2,
    title: "Catching the Echo Wave: pulseIn() and Microsecond Clocks",
    subtitle: "How Arduino measures the flight time of returning acoustic waves\","""

new_sonar_2 = """  {
    id: 2,
    title: "Catching the Echo Wave: pulseIn() and Microsecond Clocks",
    shortTitle: "2. pulseIn() Clock",
    mascotMsg: "The pulseIn() command measures time down to a single microsecond (one millionth of a second)! That is faster than the blink of an eye! ⏱️⚡",
    subtitle: "How Arduino measures the flight time of returning acoustic waves\","""

text = text.replace(old_sonar_2, new_sonar_2)

# Sonar Lesson 3: Add shortTitle & mascotMsg
old_sonar_3 = """  {
    id: 3,
    title: "The Math of Echoes: Dividing by 58.2 to Calculate Distance",
    subtitle: "Converting acoustic flight time into centimeters and inches\","""

new_sonar_3 = """  {
    id: 3,
    title: "The Math of Echoes: Dividing by 58.2 to Calculate Distance",
    shortTitle: "3. 58.2 Math Formula",
    mascotMsg: "Why divide by 58.2? Because sound travels 1 centimeter in 29.1 microseconds. Round trip is 2 × 29.1 = 58.2! Applied acoustics in code! 📏🎯",
    subtitle: "Converting acoustic flight time into centimeters and inches\","""

text = text.replace(old_sonar_3, new_sonar_3)

# Sonar Lesson 4: Add shortTitle & mascotMsg
old_sonar_4 = """  {
    id: 4,
    title: "Automotive Reverse Assistant: Multi-Zone Parking Radar",
    subtitle: "Build a smart car parking radar with distance-dependent beeps and warning LEDs\","""

new_sonar_4 = """  {
    id: 4,
    title: "Automotive Reverse Assistant: Multi-Zone Parking Radar",
    shortTitle: "4. Parking Radar Studio",
    mascotMsg: "You have engineered an automotive reverse-parking radar! 🚗 Beep... beep... beep-beep-beep-BEEEEEP! Safety engineering at work!",
    subtitle: "Build a smart car parking radar with distance-dependent beeps and warning LEDs\","""

text = text.replace(old_sonar_4, new_sonar_4)

# IR Lesson 1: Add mascotMsg
old_ir_1 = """const IR_LESSONS_DATA = [
  {
    id: 1,
    title: "Beams of Invisible Light: Photodiodes & Infrared Reflection",
    shortTitle: "1. Invisible IR Physics",
    subtitle: "How 940nm light waves bounce off white surfaces and vanish into black surfaces\","""

new_ir_1 = """const IR_LESSONS_DATA = [
  {
    id: 1,
    title: "Beams of Invisible Light: Photodiodes & Infrared Reflection",
    shortTitle: "1. Invisible IR Physics",
    mascotMsg: "The human eye cannot see 940nm infrared light, but your smartphone camera and this phototransistor can! Invisible night vision unlocked! 🔦✨",
    subtitle: "How 940nm light waves bounce off white surfaces and vanish into black surfaces\","""

text = text.replace(old_ir_1, new_ir_1)

# IR Lesson 2: Add mascotMsg
old_ir_2 = """  {
    id: 2,
    title: "The Electronic Referee: LM393 Voltage Comparator & Sensitivity Tuning",
    shortTitle: "2. Op-Amp Calibration",
    subtitle: "How the blue potentiometer sets threshold voltage to turn fuzzy analog into crisp 0/1 logic\","""

new_ir_2 = """  {
    id: 2,
    title: "The Electronic Referee: LM393 Voltage Comparator & Sensitivity Tuning",
    shortTitle: "2. Op-Amp Calibration",
    mascotMsg: "The LM393 chip acts like a digital referee with a whistle! If voltage crosses the threshold, it snaps the output immediately! 🎛️⚡",
    subtitle: "How the blue potentiometer sets threshold voltage to turn fuzzy analog into crisp 0/1 logic\","""

text = text.replace(old_ir_2, new_ir_2)

# IR Lesson 3: Add mascotMsg
old_ir_3 = """  {
    id: 3,
    title: "Reading Shades of Gray: 10-Bit Optical Reflectance ADC",
    shortTitle: "3. Grayscale ADC Meter",
    subtitle: "Using analogRead(A0) to measure surface reflectivity from 0 to 1023\","""

new_ir_3 = """  {
    id: 3,
    title: "Reading Shades of Gray: 10-Bit Optical Reflectance ADC",
    shortTitle: "3. Grayscale ADC Meter",
    mascotMsg: "White paper reflects over 85% of infrared photons, while black tape absorbs almost all of them! That is how self-driving rovers read race tracks! 🏁🚗",
    subtitle: "Using analogRead(A0) to measure surface reflectivity from 0 to 1023\","""

text = text.replace(old_ir_3, new_ir_3)

# IR Lesson 4: Add mascotMsg
old_ir_4 = """  {
    id: 4,
    title: "Self-Driving Robot Arena: Dual-Sensor Differential Steering",
    shortTitle: "4. Autonomous Rover Studio",
    subtitle: "Build the brains of an autonomous factory warehouse AGV / line-follower bot!\","""

new_ir_4 = """  {
    id: 4,
    title: "Self-Driving Robot Arena: Dual-Sensor Differential Steering",
    shortTitle: "4. Autonomous Rover Studio",
    mascotMsg: "Autonomous robotics activated! 🏎️💨 Two IR sensors working together keep the robot centered on the line, just like self-driving Tesla lane assist!",
    subtitle: "Build the brains of an autonomous factory warehouse AGV / line-follower bot!\","""

text = text.replace(old_ir_4, new_ir_4)

with open('js/lessons.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch complete!")
