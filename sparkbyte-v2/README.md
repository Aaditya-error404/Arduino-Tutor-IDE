# ⚡ SparkByte Studio v2 — Application Core

> **Deterministic Hardware Emulation Workbench, Socratic AI Coach & Parametric 3D CAD Studio**  
> *Engineered & Built by Aaditya Joshi*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)

---

## 🚀 Overview

`sparkbyte-v2` is the primary modern web application for **SparkByte Studio v2**. It delivers an entirely client-side, browser-native digital twin environment for embedded electronics, robotics, and 3D design education.

- **Vite App Root Directory:** `sparkbyte-v2/`
- **Primary Routes:**
  - `/` — Complete 22-Lab & 88-Lesson Virtual Workbench, Monaco C++ Editor, Virtual Oscilloscope & Socratic AI Coach.
  - `/cad-studio` — Dedicated full-viewport Parametric 3D CAD & STL Export Studio with Constructive Solid Geometry (CSG), real-time WebGL orbit rendering, and 1-click 3D print binary `.stl` export.

---

## 🛠️ Curriculum & Lab Architecture (22 Labs · 88 Lessons)

1. **Level 1 — Fundamentals:**
   - `led`: LED Blink & PWM Duty Cycle Control
   - `button`: Pushbutton Switch & Edge-Triggered Software Debounce
   - `pot`: 10-Bit ADC Potentiometer Voltage Divider
   - `servo`: SG90 Micro Servo 50Hz PWM Angle Sweep
   - `buzzer`: Piezo Tone Synthesis & Musical Melody Arrays
   - `cad`: 3D Parametric CAD CSG Modeling & 3D Print STL Studio
   - `dmm`: Circuit Multimeter (DC Voltage, Current Draw mA, Resistance, Continuity)

2. **Level 2 — Environmental & Optical Sensors:**
   - `ldr`: Photoresistor Light Sensor & Smart Nightlight
   - `rgb`: 3-Channel PWM Additive Color Gamut Mixing
   - `temp`: TMP36 Precision Analog Temperature & Cooling HVAC Fan
   - `sonar`: HC-SR04 Ultrasonic Sonar Speed-of-Sound Echolocation
   - `ir`: TCRT5000 940nm Infrared Surface Reflectance Line Tracking
   - `slicer`: 3D Slicer Toolpath Kinematics & G-Code Simulation

3. **Level 3 — Smart Actuators & Telemetry Displays:**
   - `dht`: DHT11/DHT22 1-Wire Digital Humidity & Climate Telemetry
   - `gas`: MQ-2 SnO2 Combustible Gas & Smoke Leak Detection
   - `lcd`: 16x2 HD44780 Character Display via PCF8574 I2C Backpack
   - `oled`: SSD1306 128x64 Monochrome OLED Display (Adafruit_GFX)
   - `soil`: Capacitive Smart Soil Moisture & 12V Irrigation Water Pump
   - `motor`: L298N Dual H-Bridge 4-Wheel Rover Motor Control

4. **Level 4 — Advanced Robotics & Connected Systems:**
   - `imu`: MPU-6050 6-DoF Gyro/Accelerometer, Complementary Filter & Aviation PFD Horizon
   - `rfid`: RC522 13.56MHz Contactless RFID SPI Transponder & Door Solenoid Lock
   - `iot`: ESP32 Wi-Fi Cloud Telemetry & MQTT Broker Streaming

---

## 🧠 Dual-Engine Sparky AI Coach
Integrated context-aware Socratic tutor:
- **Tier 1 (Instant Local AST & Circuit Diagnostics):** Works 100% offline without API keys, catching pin conflicts, threshold mismatches, loop blocking delays, and unconfigured `pinMode` setups in real time.
- **Tier 2 (Live Online LLM):** Guided hints and concept explanations powered by Gemini and Anthropic APIs.

---

## 🌐 Deployment Configuration (Vercel & Cloudflare Pages)

This directory is pre-configured with SPA fallback routing:
- **Vercel (`vercel.json`):**
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Cloudflare Pages (`public/_redirects`):**
  ```
  /* /index.html 200
  ```

### Build Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build (0 errors)
npm run build
```

---

## 👨‍💻 Author & Maintainer
**Aaditya Joshi**  
GitHub: [@Aaditya-error404](https://github.com/Aaditya-error404)  
Project Repository: [https://github.com/Aaditya-error404/Arduino-Tutor-IDE](https://github.com/Aaditya-error404/Arduino-Tutor-IDE)

© 2026 SparkByte Studio · Aaditya Joshi. MIT License.
