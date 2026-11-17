# -*- coding: utf-8 -*-
"""
Deep Behavioral & Interactive Simulation Audit for SparkByte Studio v2
Runs live in Headless Chrome via CDP.
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, tempfile

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
if not chrome_bin:
    print("FATAL: Chrome not found.")
    sys.exit(1)

temp_dir = tempfile.mkdtemp()
cdp_port = 9648

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1920,1080"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.5)

class CDPSession:
    def __init__(self, ws_url):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        parsed = urllib.parse.urlparse(ws_url)
        self.sock.connect((parsed.hostname, parsed.port))
        key = base64.b64encode(os.urandom(16)).decode('utf-8')
        handshake = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(handshake.encode('utf-8'))
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(4096)
        self.msg_id = 0
        self.console_logs = []
        self.page_errors = []

    def recv_exact(self, n):
        data = b""
        while len(data) < n:
            chunk = self.sock.recv(n - len(data))
            if not chunk:
                raise EOFError("Socket closed")
            data += chunk
        return data

    def send_frame(self, data):
        payload = json.dumps(data).encode('utf-8')
        length = len(payload)
        frame = bytearray([0x81])
        mask = os.urandom(4)
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))
        frame.extend(mask)
        frame.extend(payload[i] ^ mask[i % 4] for i in range(length))
        self.sock.sendall(frame)

    def read_frame(self):
        head = self.recv_exact(2)
        opcode = head[0] & 0x0F
        length = head[1] & 0x7F
        if length == 126:
            length = int.from_bytes(self.recv_exact(2), 'big')
        elif length == 127:
            length = int.from_bytes(self.recv_exact(8), 'big')
        payload = self.recv_exact(length)
        if opcode == 0x1:
            try:
                return json.loads(payload.decode('utf-8'))
            except:
                return None
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method, "params": params or {}}
        self.send_frame(msg)
        while True:
            frame = self.read_frame()
            if not frame:
                continue
            if frame.get("method") == "Runtime.consoleAPICalled":
                p = frame.get("params", {})
                t = p.get("type", "")
                args = p.get("args", [])
                text = " ".join(str(a.get("value", a.get("description", ""))) for a in args)
                if t in ["error"]:
                    self.console_logs.append(f"[{t.upper()}] {text}")
            elif frame.get("method") == "Runtime.exceptionThrown":
                desc = frame.get("params", {}).get("exceptionDetails", {}).get("text", "Unknown exception")
                self.page_errors.append(desc)
            elif frame.get("id") == mid:
                return frame.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    session = CDPSession(page_tab["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Runtime.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})

    # Wait for workbench store
    ready = False
    for _ in range(30):
        val = session.evaluate("typeof window.useWorkbenchStore !== 'undefined'")
        if val:
            ready = True
            break
        time.sleep(0.5)

    if not ready:
        print("FAIL: window.useWorkbenchStore not ready")
        sys.exit(1)

    print("=================================================================")
    print("   SPARKBYTE STUDIO V2 - DEEP BEHAVIORAL & SIMULATION AUDIT      ")
    print("=================================================================")

    findings = []

    def record_finding(lab_id, category, summary, detail, severity="MEDIUM"):
        findings.append({
            "lab": lab_id,
            "category": category,
            "severity": severity,
            "summary": summary,
            "detail": detail
        })
        print(f"[{severity}] Lab '{lab_id}' ({category}): {summary}")

    # =================================================================
    # PART 1: SENSOR-TO-CODE LOOP AUDIT
    # =================================================================
    print("\n--- AUDITING SENSOR LABS ---")

    # 1. LAB 10: TMP36 Temperature Lab
    print("\n[LAB 10: temp] Testing TMP36 Temperature Sensor & Fan Trigger...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('temp');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    # Low temp: 22C (below 30C alarm)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ temperatureC: 22 });")
    time.sleep(1.0)
    hw_low_temp = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Temp at 22C -> Fan Active:", hw_low_temp.get("fanActive"))

    # High temp: 45C (above 30C alarm)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ temperatureC: 45 });")
    time.sleep(1.2)
    hw_high_temp = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Temp at 45C -> Fan Active:", hw_high_temp.get("fanActive"))

    if not hw_high_temp.get("fanActive"):
        record_finding(
            "temp", "Sensor Logic",
            "Fan does not activate when temperature exceeds 30°C in Lesson 4",
            f"Set temperatureC=45, but fanActive remains {hw_high_temp.get('fanActive')}. In temp lesson 4, let's inspect what pin controls the fan and what threshold is set.",
            "HIGH"
        )
    else:
        print("PASS: Temp sensor successfully triggers fanActive on high temperature!")

    # 2. LAB 11: HC-SR04 Ultrasonic Sonar Lab
    print("\n[LAB 11: sonar] Testing Sonar Distance & Obstacle Alarm...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('sonar');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    # Test clear distance (100cm) vs obstacle distance (8cm)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ distanceCm: 100 });")
    time.sleep(0.8)
    hw_sonar_far = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Sonar at 100cm -> buzzerActive:", hw_sonar_far.get("buzzerActive"), "ledOn:", hw_sonar_far.get("ledOn"))

    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ distanceCm: 8 });")
    time.sleep(1.2)
    hw_sonar_near = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Sonar at 8cm -> buzzerActive:", hw_sonar_near.get("buzzerActive"), "ledOn:", hw_sonar_near.get("ledOn"))

    if not (hw_sonar_near.get("buzzerActive") or hw_sonar_near.get("ledOn")):
        record_finding(
            "sonar", "Sensor Logic",
            "Buzzer / Warning LED does not trigger when obstacle is within 8cm in Lesson 4",
            f"distanceCm=8, buzzerActive={hw_sonar_near.get('buzzerActive')}, ledOn={hw_sonar_near.get('ledOn')}. Check compiler pulseIn() and pin output mapping.",
            "HIGH"
        )
    else:
        print("PASS: Sonar obstacle correctly triggered warning buzzer/LED!")

    # 3. LAB 12: TCRT5000 IR Sensor Lab
    print("\n[LAB 12: ir] Testing TCRT5000 Line Tracker Reflectivity...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('ir');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    # White floor (irReflectRaw: 120)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ irReflectRaw: 120 });")
    time.sleep(1.0)
    hw_ir_white = session.evaluate("window.useWorkbenchStore.getState().hardwareState")

    # Black line (irReflectRaw: 850)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ irReflectRaw: 850 });")
    time.sleep(1.2)
    hw_ir_black = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("IR White (120) ledOn:", hw_ir_white.get("ledOn"), "vs Black (850) ledOn:", hw_ir_black.get("ledOn"))

    if hw_ir_white.get("ledOn") == hw_ir_black.get("ledOn"):
        record_finding(
            "ir", "Sensor Logic",
            "IR sensor surface change between White and Black does not alter LED indicator in Lesson 3",
            f"White ledOn: {hw_ir_white.get('ledOn')}, Black ledOn: {hw_ir_black.get('ledOn')}",
            "MEDIUM"
        )
    else:
        print("PASS: IR sensor surface change toggled LED correctly!")

    # 4. LAB 14: DHT11 Climate Telemetry Lab
    print("\n[LAB 14: dht] Testing DHT11 Climate Sensor Reading...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('dht');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ temperatureC: 38.5, humidityPct: 82 });")
    time.sleep(1.5)
    logs_dht = session.evaluate("window.useWorkbenchStore.getState().serialLogs")
    print("DHT Serial logs:", logs_dht[-4:] if logs_dht else "None")

    # 5. LAB 15: MQ-2 Gas & Smoke Lab
    print("\n[LAB 15: gas] Testing MQ-2 Gas PPM Alarm...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('gas');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ gasPpm: 80 });")
    time.sleep(1.0)
    hw_gas_low = session.evaluate("window.useWorkbenchStore.getState().hardwareState")

    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ gasPpm: 650 });")
    time.sleep(1.5)
    hw_gas_high = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Gas 80 PPM alarm:", hw_gas_low.get("buzzerActive"), "Gas 650 PPM alarm:", hw_gas_high.get("buzzerActive"))

    if not hw_gas_high.get("buzzerActive"):
        record_finding(
            "gas", "Sensor Logic",
            "MQ-2 gas alarm does not trigger buzzerActive when gas PPM is 650 in Lesson 4",
            f"gasPpm=650, buzzerActive={hw_gas_high.get('buzzerActive')}, ledOn={hw_gas_high.get('ledOn')}",
            "HIGH"
        )
    else:
        print("PASS: Gas hazard successfully triggers buzzerActive!")

    # 6. LAB 18: Capacitive Soil Moisture Lab
    print("\n[LAB 18: soil] Testing Soil Moisture Relay Activation...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('soil');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ soilMoisturePct: 80 });")
    time.sleep(1.0)
    hw_soil_wet = session.evaluate("window.useWorkbenchStore.getState().hardwareState")

    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ soilMoisturePct: 15 });")
    time.sleep(1.5)
    hw_soil_dry = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Soil Wet (80%) relayActive:", hw_soil_wet.get("relayActive"), "Dry (15%) relayActive:", hw_soil_dry.get("relayActive"))

    if not hw_soil_dry.get("relayActive"):
        record_finding(
            "soil", "Sensor Logic",
            "Irrigation relay does not activate when soil moisture drops to 15% in Lesson 4",
            f"soilMoisturePct=15, relayActive={hw_soil_dry.get('relayActive')}, ledOn={hw_soil_dry.get('ledOn')}",
            "HIGH"
        )
    else:
        print("PASS: Dry soil successfully activated irrigation pump relay!")

    # =================================================================
    # PART 2: PROTOCOL & ACTUATOR AUDIT
    # =================================================================
    print("\n--- AUDITING PROTOCOL & ACTUATOR LABS ---")

    # 7. LAB 7: Digital Multimeter (DMM) Lab
    print("\n[LAB 7: dmm] Testing DMM Probes & Mode Switching...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('dmm');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.5)
    dmm_view_check = session.evaluate("""
      (() => {
        const text = document.body.innerText;
        return {
          hasDmmTitle: text.includes('DCV MODE') || text.includes('Digital Multimeter'),
          hasDcvBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('DCV')),
          hasOhmBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('OHM')),
          hasContBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('CONT'))
        };
      })()
    """)
    print("DMM View Check:", dmm_view_check)

    # 8. LAB 20: MPU-6050 IMU Lab
    print("\n[LAB 20: imu] Testing MPU-6050 3D Gimbal & Orientation Sliders...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('imu');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ imuPitch: 45, imuRoll: -30 });")
    time.sleep(0.3)
    hw_imu = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("IMU Pitch:", hw_imu.get("imuPitch"), "Roll:", hw_imu.get("imuRoll"))

    # 9. LAB 21: RC522 RFID Access Control Lab
    print("\n[LAB 21: rfid] Testing RC522 RFID Whitelist & Door Solenoid...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('rfid');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)

    # Test Master Fob scan: "A3 7F 4E 12"
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ rfidScannedUid: 'A3 7F 4E 12' });")
    time.sleep(1.2)
    hw_rfid_master = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("RFID Master (A3 7F 4E 12) -> Authorized:", hw_rfid_master.get("rfidAuthorized"), "Servo Angle:", hw_rfid_master.get("servoAngle"))

    # Test Unauthorized scan: "99 00 AA FF"
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ rfidScannedUid: '99 00 AA FF' });")
    time.sleep(1.2)
    hw_rfid_unauth = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("RFID Unauthorized (99 00 AA FF) -> Authorized:", hw_rfid_unauth.get("rfidAuthorized"), "Servo Angle:", hw_rfid_unauth.get("servoAngle"))

    if hw_rfid_unauth.get("rfidAuthorized") == True:
        record_finding(
            "rfid", "Security Logic",
            "Unauthorized RFID tag '99 00 AA FF' unlocked the door deadbolt",
            f"Expected rfidAuthorized=false, but got true. Check UID byte comparison in compiler.ts and Lesson 3 code.",
            "HIGH"
        )
    elif hw_rfid_master.get("rfidAuthorized") != True:
        record_finding(
            "rfid", "Access Control Logic",
            "Master RFID tag 'A3 7F 4E 12' failed to authorize access",
            f"Expected rfidAuthorized=true, but got {hw_rfid_master.get('rfidAuthorized')}.",
            "HIGH"
        )
    else:
        print("PASS: RFID access control correctly distinguishes Master UID from Unauthorized UID!")

    # 10. LAB 22: ESP32 IoT Cloud Telemetry Lab
    print("\n[LAB 22: iot] Testing ESP32 MQTT Telemetry...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('iot');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.5)
    packets_before = session.evaluate("window.useWorkbenchStore.getState().hardwareState.iotPacketsSent")
    time.sleep(1.5)
    packets_after = session.evaluate("window.useWorkbenchStore.getState().hardwareState.iotPacketsSent")
    print("IoT Packets Before:", packets_before, "After 1.5s simulation:", packets_after)

    # 11. LAB 5: Piezo Buzzer Melody Array
    print("\n[LAB 5: buzzer] Testing Melody Array unrolling & tone(8, melody[i])...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('buzzer');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.8)
    hw_buzzer = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    vars_buzzer = session.evaluate("window.useWorkbenchStore.getState().vars")
    print("Buzzer Tone Freq:", hw_buzzer.get("buzzerToneFreq"), "Buzzer Active:", hw_buzzer.get("buzzerActive"))
    print("Buzzer Vars melody:", vars_buzzer.get("melody"))

    # 12. LAB 1: Non-13 LED Pins
    print("\n[LAB 1: led] Testing Non-Pin 13 C++ Pin Mutation...")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('led');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    # Mutate C++ to use Pin 12
    session.evaluate("""
      window.useWorkbenchStore.getState().setCustomCode(`
        void setup() {
          pinMode(12, OUTPUT);
        }
        void loop() {
          digitalWrite(12, HIGH);
          delay(500);
          digitalWrite(12, LOW);
          delay(500);
        }
      `);
    """)
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(1.2)
    hw_pin12 = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    print("Pin 12 state in pinStates:", hw_pin12.get("pinStates", {}).get("12"), "ledOn:", hw_pin12.get("ledOn"))

    if not hw_pin12.get("ledOn") and not hw_pin12.get("pinStates", {}).get("12"):
        record_finding(
            "led", "Pin Assignment",
            "Editing LED pin from 13 to 12 did not illuminate the LED or set pinStates[12]",
            f"pinStates[12] is {hw_pin12.get('pinStates', {}).get('12')}. In useWorkbenchStore.ts, ledOn only responds to pin 13 or hw.ledPin.",
            "MEDIUM"
        )
    else:
        print("PASS: Pin 12 mutation correctly handled!")

    # =================================================================
    # PART 3: OPTION B LAYOUT & UI CLIPPING CHECK
    # =================================================================
    print("\n--- AUDITING OPTION B FOCUS STAGE & FLOATING HUD LAYOUT ---")
    layout_1920 = session.evaluate("""
      (() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const hasHOverflow = docWidth > vw || bodyWidth > vw;

        return { vw, vh, docWidth, bodyWidth, hasHOverflow };
      })()
    """)
    print("Layout audit at 1920x1080:", layout_1920)

    # Test 1366x768 resolution
    session.call("Emulation.setDeviceMetricsOverride", {
        "width": 1366,
        "height": 768,
        "deviceScaleFactor": 1,
        "mobile": False
    })
    time.sleep(1.0)
    layout_1366 = session.evaluate("""
      (() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const hasHOverflow = docWidth > vw || bodyWidth > vw;

        return { vw, vh, docWidth, bodyWidth, hasHOverflow };
      })()
    """)
    print("Layout audit at 1366x768:", layout_1366)

    # Check page console errors
    print("\nTotal Page Console Errors logged:", len(session.page_errors))
    print("Total Warning/Error Console Messages:", len(session.console_logs))

    # Save complete audit report to JSON
    report_data = {
        "total_findings": len(findings),
        "findings": findings,
        "page_errors": session.page_errors,
        "console_logs": session.console_logs,
        "layout_1920": layout_1920,
        "layout_1366": layout_1366
    }

    with open("scratch/deep_behavioral_audit_report.json", "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    print("\nSaved comprehensive audit report to scratch/deep_behavioral_audit_report.json")

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    try:
        proc.terminate()
    except:
        pass
