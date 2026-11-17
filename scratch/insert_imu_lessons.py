# -*- coding: utf-8 -*-
"""
Script to insert IMU_LESSONS_DATA into js/lessons.js
"""

imu_lessons_code = '''
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
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

if "IMU_LESSONS_DATA" not in lessons:
    marker = "window.MOTOR_LESSONS_DATA = MOTOR_LESSONS_DATA;"
    lessons = lessons.replace(
        marker,
        imu_lessons_code.strip() + "\n\n" + marker + "\nwindow.IMU_LESSONS_DATA = IMU_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(lessons)
    print("IMU_LESSONS_DATA inserted into js/lessons.js successfully!")
else:
    print("IMU_LESSONS_DATA already in js/lessons.js.")

print("Done step 2.")
