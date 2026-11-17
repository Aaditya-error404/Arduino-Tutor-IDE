# ⚡ SparkByte Studio v2 — Arduino Virtual Tutor IDE
> **Next-Generation Embedded Systems & Robotics Learning Workbench with Deterministic Simulation, Socratic AI Coach, and Integrated 3D CAD Studio.**  
> *Engineered & Built by Aaditya Joshi*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Overview

**SparkByte Studio v2** is a client-side virtual hardware workbench and curriculum delivery platform designed for high school and university students learning robotics, embedded systems, and digital fabrication without needing physical hardware or an internet connection.

It combines:
1. **22 Interactive Hardware Digital Twin Labs** with 88 step-by-step guided lessons spanning basics, analog/digital sensors, smart actuators, displays, and advanced IoT/robotics.
2. **Sparky AI Socratic Coach:** A hybrid offline/online learning tutor that inspects student C++ code, Monaco editor state, and live AVR hardware registers to diagnose errors deterministically.
3. **Parametric 3D CAD & STL Export Studio:** A full-featured in-browser constructive solid geometry (CSG) modeling studio with live WebGL preview and 1-click 3D print `.stl` export.
4. **4-Channel Virtual Oscilloscope:** Real-time waveform tracing for PWM, analog ADC voltage drops, digital logic transitions, and virtual clock stepping.
5. **WebSerial Direct Flashing:** 1-click compiled HEX upload to real Arduino Uno/Nano boards directly over WebUSB/WebSerial in supported browsers.

---

## 🛠️ Complete 22-Lab Curriculum Catalog

| Level | Lab ID | Lab Name | Core Hardware & Simulation Focus |
|---|---|---|---|
| **Level 1: Fundamentals** | `led` | LED Blink & PWM | Digital output (`pinMode`, `digitalWrite`), analog PWM (`analogWrite`), duty cycles |
| | `button` | Pushbutton & Debounce | `INPUT_PULLUP`, digital read, edge-triggered software debouncing |
| | `pot` | Potentiometer & ADC | 10-bit Analog-to-Digital conversion (A0), voltage divider transfer functions |
| | `servo` | SG90 Micro Servo | 50Hz PWM pulse width control (1.0ms–2.0ms), sweep loops, degree mapping |
| | `buzzer` | Piezo Tone Generator | Square wave frequency synthesis, musical melody arrays, `tone()` / `noTone()` |
| | `cad` | 3D Parametric CAD Studio | OpenSCAD / JSCAD Constructive Solid Geometry, live 3D mesh rendering, STL export |
| | `dmm` | Digital Multimeter | DC voltage drop, circuit current draw (mA), continuity, resistance diagnostics |
| **Level 2: Sensors** | `ldr` | Photoresistor Light Sensor | Light-dependent voltage division, hysteresis, automatic smart nightlight |
| | `rgb` | Multi-Channel RGB LED | 3-channel additive color mixing, 16.7M color gamut, PWM duty ratios |
| | `temp` | TMP36 Analog Temperature | Voltage-to-temperature transfer equation, climate threshold cooling fan |
| | `sonar` | HC-SR04 Ultrasonic Sonar | Speed of sound (343 m/s), time-of-flight echolocation, hazard proximity zones |
| | `ir` | TCRT5000 IR Line Tracker | 940nm infrared reflection vs absorption, phototransistor digital comparator |
| | `slicer` | 3D Slicer & G-Code Preview | Layer height (0.2mm), toolpaths, hotend nozzle kinematics, bed leveling |
| **Level 3: Actuators & Displays**| `dht` | DHT11/DHT22 Temp & Humidity | 1-wire digital protocol, relative humidity %, heat index calculations |
| | `gas` | MQ-2 Combustible Gas/Smoke | Gas concentration PPM, SnO2 semiconductor heating, audible safety alarms |
| | `lcd` | 16x2 I2C Character LCD | HD44780 controller, PCF8574 backpack, I2C addressing (0x27), two-line text |
| | `oled` | SSD1306 128x64 OLED Display | Framebuffer bit-mapping, Adafruit_GFX graphics primitives, I2C bus (0x3C) |
| | `soil` | Capacitive Soil Moisture | Soil moisture % measurement, corrosion-free capacitance, automated 12V pump |
| | `motor` | L298N Dual H-Bridge Rover | 4-wheel rover drive kinematics, H-bridge transistor conduction, bidirectional PWM |
| **Level 4: Advanced Systems** | `imu` | MPU-6050 6-DoF Gyro/Accel | Complementary filtering, pitch/roll attitude estimation, 3D gimbal & PFD horizon |
| | `rfid` | RC522 13.56MHz RFID | SPI bus protocol, contactless UID verification, electronic solenoid lock |
| | `iot` | ESP32 Cloud Telemetry | Wi-Fi networking, MQTT broker publishing, JSON payload serialization |

---

## ⚡ Tech Stack & Architecture

- **Frontend & UI:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Code Editor:** Monaco Editor (`@monaco-editor/react`) with syntax highlighting & error markers
- **3D CAD & WebGL:** Three.js, `@jscad/modeling`, `@jscad/stl-serializer`
- **Circuit Simulation:** AVR8js cycle-accurate ATmega328P execution + deterministic browser compiler
- **State Management:** Zustand with client-side localStorage persistence
- **Bundler & Tooling:** Vite 5, PostCSS, Autoprefixer

---

## 🏁 Quick Start & Local Development

### Prerequisites
- Node.js `v18+` or `v20+`
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Aaditya-error404/Arduino-Tutor-IDE.git
cd Arduino-Tutor-IDE
```

### 2. Install dependencies & run SparkByte Studio v2
```bash
cd sparkbyte-v2
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 3. Open Standalone 3D CAD Studio
Navigate to **`http://localhost:5173/cad-studio`** or click the **`[ 🧊 Open 3D CAD Studio ↗ ]`** button in the workbench navigation bar.

### 4. Build for Production
```bash
npm run build
```
Generates a zero-error, minified, production-ready static bundle in `sparkbyte-v2/dist/`.

---

## 👨‍💻 Author & Maintainer

**Aaditya Joshi**  
GitHub: [@Aaditya-error404](https://github.com/Aaditya-error404)  
Project Repository: [https://github.com/Aaditya-error404/Arduino-Tutor-IDE](https://github.com/Aaditya-error404/Arduino-Tutor-IDE)

---

## 📄 License
© 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi. Distributed under the MIT License.
