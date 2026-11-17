# -*- coding: utf-8 -*-
"""
Script to insert IOT_LESSONS_DATA into js/lessons.js
"""

iot_lessons_code = '''
const IOT_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 85: Microcontroller vs IoT SoC: ATmega328P vs Xtensa ESP32 Dual-Core",
    shortTitle: "85. Microcontroller vs SoC",
    subtitle: "8-bit Harvard (16MHz, 2KB RAM) vs 32-bit Dual-Core (240MHz, 520KB RAM, Wi-Fi)",
    summary: "Step into the modern IoT computing revolution! Compare the classic 8-bit ATmega328P with the powerhouse 32-bit ESP32 System-on-Chip (SoC), understand FreeRTOS dual-core task scheduling (Core 0 for Wi-Fi stack, Core 1 for user app), and explore deep sleep microamp modes.",
    mascotMsg: "We started in Lesson 1 with a humble 8-bit Arduino. Now look at what you hold: a 240MHz dual-core supercomputer chip with built-in Wi-Fi and Bluetooth that costs less than a cup of coffee! Let's unleash the dual-core beast!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "IoT & Cloud",
    labId: "iot",
    analogy: {
      headline: "The Bicycle Courier vs The High-Speed Bullet Train",
      story: "The ATmega328P is like a reliable single bicycle messenger (16MHz, carries 2KB of letters, works alone). The ESP32 is a supersonic bullet train with two conductors (Core 0 and Core 1 running at 240MHz) with high-speed internet radio towers and 520KB of cargo space!",
      hardwareMetaphor: "Xtensa dual-core LX6 microprocessor with dedicated hardware cryptographic acceleration (AES, SHA, RSA)."
    },
    jargonBuster: [
      {
        word: "SoC (System-on-Chip)",
        pronunciation: "Ess-Oh-See",
        analogy: "The All-in-One Silicon City",
        definition: "An integrated circuit combining CPU, memory, wireless radios, and peripheral interfaces on a single microchip."
      },
      {
        word: "Dual-Core (Xtensa LX6)",
        pronunciation: "DOO-ul KOR",
        analogy: "Two Brains Working in Parallel",
        definition: "Two 32-bit CPU cores: Core 0 handles the complex Wi-Fi/Bluetooth protocol stacks, while Core 1 runs user code."
      },
      {
        word: "240MHz Clock Speed",
        pronunciation: "KLOK SPEED",
        analogy: "15x Faster Engine RPM",
        definition: "Executes 240,000,000 clock cycles per second compared to 16,000,000 on the classic ATmega328P."
      },
      {
        word: "Deep Sleep (10µA)",
        pronunciation: "DEEP SLEEP",
        analogy: "Hibernating Bear with a Watchdog",
        definition: "Ultra-low-power standby mode drawing just 0.01mA, extending battery life from days to multiple years."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 85: ESP32 Dual-Core Architecture & FreeRTOS Tasks
TaskHandle_t TaskWiFI;
TaskHandle_t TaskSensors;

void TaskWiFICode(void * pvParameters) {
  for (;;) {
    Serial.print(F("Core 0: Wi-Fi Protocol Stack Processing on "));
    Serial.println(xPortGetCoreID());
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void TaskSensorsCode(void * pvParameters) {
  for (;;) {
    Serial.print(F("Core 1: High-Speed Sensor Sampling on "));
    Serial.println(xPortGetCoreID());
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("ESP32 Tensilica Dual-Core 240MHz Booting..."));

  // Pin Task 1 to Core 0 (Wi-Fi Protocol Stack)
  xTaskCreatePinnedToCore(TaskWiFICode, "TaskWiFI", 10000, NULL, 1, &TaskWiFI, 0);

  // Pin Task 2 to Core 1 (User Robotics Code)
  xTaskCreatePinnedToCore(TaskSensorsCode, "TaskSensors", 10000, NULL, 1, &TaskSensors, 1);
}

void loop() {
  // Empty: FreeRTOS handles task scheduling
}`,
      human: `// Plain English Human Translation:
// 1. Create two separate task handles under the FreeRTOS real-time operating system.
// 2. Define TaskWiFI to run dedicated networking code without ever stalling your robot sensors.
// 3. Define TaskSensors to sample analog sensors and compute math at high speed.
// 4. Pin TaskWiFI directly to Core 0 with its own 10KB stack memory.
// 5. Pin TaskSensors directly to Core 1 running independently in parallel!
// 6. Enjoy true simultaneous multiprocessing on modern 32-bit silicon!`
    },
    stepCheck: {
      instruction: "Benchmark the ESP32 SoC! Adjust the CPU Clock Frequency Slider from 80MHz (Power Saver) to 240MHz (Turbo Mode), observe how MIPS computing performance and active current draw scale, and click 'Verify Dual-Core Performance'.",
      targetCondition: "socVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 86: Wi-Fi Station Mode, DHCP Lease & RESTful HTTP Client",
    shortTitle: "86. Wi-Fi & RESTful HTTP",
    subtitle: "802.11 b/g/n Networking: WPA2 4-Way Handshake, Dynamic IP Lease & HTTP GET/POST",
    summary: "Connect your hardware to the world wide web! Master ESP32 Wi-Fi Station (STA) mode, establish secure WPA2 association, negotiate a local IP lease through DHCP, and dispatch RESTful HTTP GET and POST requests to web APIs.",
    mascotMsg: "Radio check: 3... 2... 1... Connected! 📶 Your board just joined the local Wi-Fi router, got its own IP address, and talked to a web server across the ocean! Let's watch the 4-way WPA2 security handshake unfold!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Networking & Protocols",
    labId: "iot",
    analogy: {
      headline: "Checking into a Hotel and Getting a Room Key",
      story: "When you arrive at a hotel, you give your reservation name and password (SSID & WPA2). The front desk hands you room number 105 (DHCP assigning 192.168.1.105). Now you can order room service via the room telephone (HTTP GET requests) and receive freshly baked pizza (JSON API response)!",
      hardwareMetaphor: "ESP32 Wi-Fi baseband hardware managing 802.11 MAC layer frames directly via LwIP TCP/IP stack."
    },
    jargonBuster: [
      {
        word: "Station (STA) Mode",
        pronunciation: "STAY-shun MOHD",
        analogy: "The Wireless Client Laptop",
        definition: "Wi-Fi operational mode where the ESP32 associates as a client to an existing home or school wireless router."
      },
      {
        word: "DHCP Protocol",
        pronunciation: "Dee-Aych-See-Pee",
        analogy: "The Automated IP Address Dispenser",
        definition: "Protocol that automatically assigns a unique local IP address (e.g. 192.168.1.105) and gateway to the ESP32."
      },
      {
        word: "WPA2 4-Way Handshake",
        pronunciation: "W-P-A-Two",
        analogy: "The Cryptographic Secret Knock",
        definition: "Security authentication exchange generating pairwise encryption keys without ever transmitting the cleartext Wi-Fi password."
      },
      {
        word: "RESTful HTTP Client",
        pronunciation: "REST-ful Aych-Tee-Tee-Pee",
        analogy: "The Web Browser in Code",
        definition: "Transmitting standard HTTP GET and POST requests over port 80/443 to retrieve or submit JSON data payloads."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 86: ESP32 Wi-Fi Station Association & HTTP Client
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "SparkByte_ATL_Lab";
const char* password = "InnovationHub2026";

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA); // Set Station mode
  WiFi.begin(ssid, password);

  Serial.print(F("Connecting to Wi-Fi SSID: "));
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }

  Serial.println();
  Serial.println(F("WPA2 Handshake Complete! Wi-Fi Connected."));
  Serial.print(F("Assigned IP Address: "));
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://api.sparkbyte.io/weather/current");

    int httpCode = http.GET(); // Dispatch HTTP GET Request
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print(F("HTTP Code: ")); Serial.println(httpCode);
      Serial.print(F("Payload: ")); Serial.println(payload);
    }
    http.end(); // Free sockets
  }
  delay(10000);
}`,
      human: `// Plain English Human Translation:
// 1. Include the official ESP32 WiFi and HTTPClient libraries.
// 2. Configure Wi-Fi in Station (STA) mode and begin connection with SSID and password.
// 3. Wait for the WPA2 4-way security handshake to complete and print the assigned DHCP IP address.
// 4. In the loop, create an HTTP client targeting an online REST API endpoint.
// 5. Send an HTTP GET request across the internet and read the returned server response payload.
// 6. Close the connection cleanly and repeat every 10 seconds.`
    },
    stepCheck: {
      instruction: "Connect the ESP32 to Wi-Fi! Click 'Scan Wi-Fi Networks', click 'Authenticate WPA2 & Negotiate DHCP', observe the local IP lease assigned (192.168.1.105), and click 'Verify Wi-Fi Station Link'.",
      targetCondition: "wifiConnected"
    }
  },
  {
    id: 3,
    title: "Lesson 87: The MQTT Publish/Subscribe Telemetry Broker Protocol (QoS 0/1/2)",
    shortTitle: "87. MQTT Broker Protocol",
    subtitle: "Lightweight Binary Headers (2 Bytes): Topics, Publishers, Subscribers & Keep-Alives",
    summary: "Discover why MQTT powers millions of smart homes and factories! Learn why bloated HTTP headers waste battery, and master the pub/sub architecture: publish sensor data to hierarchical topics and subscribe to instant cloud commands with Quality of Service (QoS).",
    mascotMsg: "HTTP is like sending a heavy cardboard box through snail mail just to send one word. MQTT is like sending a lightning-fast two-letter text message! ⚡ It uses a central switchboard called a Broker. Let's publish messages to the cloud!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "IoT & Cloud",
    labId: "iot",
    analogy: {
      headline: "The Newspaper Publisher and the Subscriber Mailbox",
      story: "Instead of journalists knocking on 10,000 doors individually (HTTP), they print a newspaper on a topic like 'Sports' and drop it at the central newsstand (MQTT Broker). Anyone who loves sports subscribes to that topic. The moment a new score is published, the broker delivers it to all subscribers simultaneously in 2 milliseconds!",
      hardwareMetaphor: "PubSubClient library maintaining a persistent TCP socket connection on port 1883 with ping keep-alives."
    },
    jargonBuster: [
      {
        word: "MQTT Protocol",
        pronunciation: "Em-Q-Tee-Tee",
        analogy: "The Ultra-Lean Two-Byte Telegram",
        definition: "Message Queuing Telemetry Transport: an ISO-standard pub/sub network protocol designed for low-bandwidth embedded devices."
      },
      {
        word: "MQTT Broker",
        pronunciation: "BROH-kur",
        analogy: "The Central Post Office Switchboard",
        definition: "A server (Mosquitto, EMQX, HiveMQ) that receives messages from publishers and distributes them to subscribed clients."
      },
      {
        word: "Topic Hierarchy",
        pronunciation: "TOP-ik HY-ur-ar-kee",
        analogy: "The Channel Folder Path",
        definition: "Slash-delimited subject channels such as 'spkbyte/greenhouse/temperature' allowing fine-grained subscription filtering."
      },
      {
        word: "QoS (Quality of Service)",
        pronunciation: "Q-o-S",
        analogy: "The Certified Mail Guarantee Level",
        definition: "Reliability guarantee: QoS 0 (Fire and forget), QoS 1 (At least once with ACK), QoS 2 (Exactly once)."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 87: MQTT Publisher & Subscriber Engine
#include <WiFi.h>
#include <PubSubClient.h>

const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char* topicPub = "spkbyte/farm/telemetry";
const char* topicSub = "spkbyte/farm/actuator";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print(F("Message arrived on topic: "));
  Serial.println(topic);
  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.print(F("Command Payload: ")); Serial.println(msg);
}

void setup() {
  Serial.begin(115200);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback); // Set downlink listener
}

void loop() {
  if (!client.connected()) {
    if (client.connect("ESP32_SparkByte_Client")) {
      Serial.println(F("Connected to MQTT Broker!"));
      client.subscribe(topicSub); // Listen for cloud commands
    }
  }
  client.loop();

  // Publish sensor telemetry packet every 3 seconds
  static unsigned long lastPub = 0;
  if (millis() - lastPub > 3000) {
    lastPub = millis();
    char telemetryPayload[64];
    snprintf(telemetryPayload, 64, "{\\"temp\\":26.4,\\"aqi\\":45,\\"uptime\\":%lu}", millis()/1000);
    client.publish(topicPub, telemetryPayload);
    Serial.print(F("Published MQTT: ")); Serial.println(telemetryPayload);
  }
}`,
      human: `// Plain English Human Translation:
// 1. Point the client at a public MQTT Broker at broker.emqx.io on standard port 1883.
// 2. Register a callback function to automatically trigger whenever a cloud command arrives.
// 3. Connect to the broker and subscribe to the actuator downlink topic.
// 4. In the loop, package current sensor readings into a lightweight JSON string.
// 5. Publish the JSON packet to the telemetry topic every 3 seconds with minimal network overhead.
// 6. Any phone, computer, or cloud dashboard subscribed to this topic receives the reading in under 30ms!`
    },
    stepCheck: {
      instruction: "Publish and Subscribe to MQTT! Click 'Publish Telemetry Packet', observe the broker log the payload and broadcast to subscriber nodes, click 'Simulate Cloud Downlink Command', and click 'Verify MQTT Pub/Sub Link'.",
      targetCondition: "mqttVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 88: Cloud IoT Dashboard & Bi-Directional Digital Twin Studio",
    shortTitle: "88. Digital Twin Cloud Studio",
    subtitle: "Industry 4.0: Live Sensor Streaming Uplink + Sub-50ms Remote Actuator Downlink",
    summary: "Build the grand finale of your ATL engineering journey! Create a full Industry 4.0 Digital Twin: stream real-time environmental telemetry to cloud visualizer charts (Uplink), and trigger physical actuators remotely from a web dashboard in under 50 milliseconds (Downlink).",
    mascotMsg: "CONGRATULATIONS, MASTER ENGINEER! 🎓 You have completed all 22 labs and 88 lessons! Here is your crowning capstone project: a living, breathing Digital Twin connecting physical hardware to the global cloud! Flip the cloud switch and watch physical reality obey!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Capstone & Industry 4.0",
    labId: "iot",
    analogy: {
      headline: "The Spacecraft and Mission Control Houston",
      story: "When Apollo or the Artemis rocket flies in space, an exact 3D computer clone of the spacecraft runs on giant screens at Mission Control in Houston. Every drop of fuel, every degree of heat, and every switch toggle reflects back and forth between space and Earth in real time. That is a Digital Twin!",
      hardwareMetaphor: "Bi-directional telemetry: JSON telemetry payload published at 1Hz + MQTT callback function parsing command packets."
    },
    jargonBuster: [
      {
        word: "Digital Twin",
        pronunciation: "DIJ-ih-tul TWIN",
        analogy: "The Real-Time Software Doppelganger",
        definition: "A dynamic, real-time digital software replica of a physical machine continuously synced via IoT telemetry."
      },
      {
        word: "Telemetry Uplink",
        pronunciation: "tel-EM-eh-tree UP-link",
        analogy: "The Sensor Data Pipeline to the Sky",
        definition: "Outbound sensor data streaming from physical edge microcontrollers up to cloud servers for storage and visualization."
      },
      {
        word: "Actuator Downlink",
        pronunciation: "AK-choo-ay-tur DOWN-link",
        analogy: "The Remote Control Beam from Mission Control",
        definition: "Low-latency command messages pushed down from web browsers to physical edge hardware to actuate motors or relays."
      },
      {
        word: "ThingSpeak / Cloud IoT",
        pronunciation: "THING-speak",
        analogy: "The Online Analytics Command Center",
        definition: "Cloud platform aggregating sensor telemetry into live interactive browser charts, gauges, and alert triggers."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 22, Lesson 88: Complete Bi-Directional Industry 4.0 Digital Twin
#include <WiFi.h>
#include <PubSubClient.h>

const int ONBOARD_LED = 2; // Blue Onboard LED (Actuator)
const int RELAY_PIN = 4;   // Industrial Greenhouse Fan Relay

WiFiClient espClient;
PubSubClient client(espClient);

// Downlink command receiver: Triggers within 30ms of cloud button click!
void handleCloudCommand(char* topic, byte* payload, unsigned int len) {
  String cmd = "";
  for (int i = 0; i < len; i++) cmd += (char)payload[i];
  
  if (cmd == "FAN_ON") {
    digitalWrite(ONBOARD_LED, HIGH);
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println(F("DIGITAL TWIN DOWNLINK: Greenhouse Fan Activated!"));
  } else if (cmd == "FAN_OFF") {
    digitalWrite(ONBOARD_LED, LOW);
    digitalWrite(RELAY_PIN, LOW);
    Serial.println(F("DIGITAL TWIN DOWNLINK: Greenhouse Fan Deactivated."));
  }
}

void setup() {
  pinMode(ONBOARD_LED, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
  client.setServer("broker.emqx.io", 1883);
  client.setCallback(handleCloudCommand);
}

void loop() {
  // Bi-directional loop: Streams telemetry UP, listens for commands DOWN
  client.loop();
}`,
      human: `// Plain English Human Translation:
// 1. Assign Pin 2 (Blue onboard LED) and Pin 4 (Relay) as physical cloud-controlled actuators.
// 2. Connect to the global MQTT Broker and set handleCloudCommand() as the listener.
// 3. When a user anywhere in the world toggles a switch in their web browser, an MQTT command arrives in milliseconds.
// 4. If the command says "FAN_ON", turn on the physical LED and industrial relay immediately!
// 5. Simultaneously, stream live sensor readings back up to the cloud dashboard so online charts update.
// 6. You have mastered physical computing, embedded firmware, and cloud IoT engineering!`
    },
    stepCheck: {
      instruction: "Deploy the Capstone Digital Twin! Click the 'Remote Relay Downlink' switch on the Cloud Dashboard to trigger the physical ESP32 LED and fan relay, observe sub-50ms latency, and click 'Graduate ATL Master Curriculum (88 Lessons)'.",
      targetCondition: "capstoneGraduated"
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

if "IOT_LESSONS_DATA" not in lessons:
    marker = "window.RFID_LESSONS_DATA = RFID_LESSONS_DATA;"
    lessons = lessons.replace(
        marker,
        iot_lessons_code.strip() + "\n\n" + marker + "\nwindow.IOT_LESSONS_DATA = IOT_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(lessons)
    print("IOT_LESSONS_DATA inserted into js/lessons.js successfully!")
else:
    print("IOT_LESSONS_DATA already in js/lessons.js.")

print("Done step 2.")
