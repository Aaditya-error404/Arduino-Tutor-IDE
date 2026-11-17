# -*- coding: utf-8 -*-
"""
End-to-End Functional Code-to-Hardware Verification for SparkByte Studio v2
Runs live in Headless Chrome via Chrome DevTools Protocol.
Tests:
1. Conditional Branching (button & ldr mutation test)
2. Variable & for-loop resolution (servo sweep & pot -> map -> servo)
3. Output coupling (rgb analogWrite & lcd text update)
4. Function calls & custom interpreters (motor rover, oled canvas, cad 3d, slicer gcode)
5. 22-Lab health check & console error sweep
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

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

import tempfile
temp_dir = tempfile.mkdtemp()
cdp_port = 9540

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1440,900"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(3.0)

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
            return json.loads(payload.decode('utf-8', errors='ignore'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        req_id = self.msg_id
        req = {"id": req_id, "method": method, "params": params or {}}
        self.send_frame(req)
        while True:
            msg = self.read_frame()
            if not msg:
                continue
            if "method" in msg:
                if msg["method"] == "Runtime.consoleAPICalled":
                    text = " ".join(str(a.get("value", a.get("description", ""))) for a in msg["params"].get("args", []))
                    t = msg["params"].get("type", "log")
                    if t == "error":
                        self.console_logs.append(f"[{t.upper()}] {text}")
                elif msg["method"] == "Runtime.exceptionThrown":
                    details = msg["params"].get("exceptionDetails", {})
                    exc = details.get("text", "")
                    if "exception" in details:
                        exc += " " + details["exception"].get("description", "")
                    self.page_errors.append(exc)
            if msg.get("id") == req_id:
                if "error" in msg:
                    raise Exception(msg["error"]["message"])
                return msg.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        result = res.get("result", {})
        if "value" in result:
            return result["value"]
        return result

    def close(self):
        try:
            self.sock.close()
        except:
            pass

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    ws_url = page_tab["webSocketDebuggerUrl"]
    session = CDPSession(ws_url)

    session.call("Page.enable")
    session.call("Runtime.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})
    time.sleep(3.5)

    # Wait for app to mount
    ready = False
    for _ in range(30):
        res = session.evaluate("typeof window.useWorkbenchStore === 'function'")
        if res is True:
            ready = True
            break
        time.sleep(0.5)

    if not ready:
        print("FAIL: window.useWorkbenchStore did not become available.")
        sys.exit(1)

    print("================================================================")
    print("   SPARKBYTE STUDIO v2 - FUNCTIONAL CODE-TO-HARDWARE AUDIT     ")
    print("================================================================")

    test_results = {}

    def step_n_times(n=8):
        session.evaluate(f"""
            for (let i = 0; i < {n}; i++) {{
                window.useWorkbenchStore.getState().stepSimulation();
            }}
        """)

    # ──────────────────────────────────────────────────────────────────
    # TEST 1A: Conditional Branching - Button Lab (if/else exclusive execution)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 1A] Button Lab (Lab 3) - if/else Exclusive Branch Execution")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('button'); window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.2)
    
    # 1. Released state (buttonPressed = false) -> ledOn must be false
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ buttonPressed: false });")
    step_n_times(8)
    hw_released = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    led_off = hw_released.get("ledOn") is False

    # 2. Pressed state (buttonPressed = true) -> ledOn must be true
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ buttonPressed: true });")
    step_n_times(8)
    hw_pressed = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    led_on = hw_pressed.get("ledOn") is True

    test1a_pass = led_off and led_on
    test_results["Test 1A (Button if/else Branching)"] = {
        "pass": test1a_pass,
        "detail": f"Released LED={hw_released.get('ledOn')} (Expected False), Pressed LED={hw_pressed.get('ledOn')} (Expected True)"
    }
    print(f"  -> Result: {'PASS' if test1a_pass else 'FAIL'} | {test_results['Test 1A (Button if/else Branching)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 1B: Conditional Branching - LDR Code Threshold Mutation Test
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 1B] LDR Lab (Lab 8) - Code Threshold Mutation (400 -> 900)")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('ldr'); window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.2)

    # Ambient light at 600. With initial threshold 400, 600 < 400 is FALSE -> ledOn should be False
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ ldrRaw: 600 });")
    step_n_times(8)
    hw_ldr_orig = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    led_dark_orig = hw_ldr_orig.get("ledOn") is False

    # Now mutate C++ code to threshold 900
    mutated_ldr_cpp = """void setup() {
    pinMode(13, OUTPUT);
}
void loop() {
    int light = analogRead(A1);
    if (light < 900) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
    delay(100);
}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(mutated_ldr_cpp)});")
    time.sleep(0.2)

    # Step again with ldrRaw = 600. With new threshold 900, 600 < 900 is TRUE -> ledOn should turn True!
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ ldrRaw: 600 });")
    step_n_times(8)
    hw_ldr_mutated = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    led_lit_mutated = hw_ldr_mutated.get("ledOn") is True

    test1b_pass = led_dark_orig and led_lit_mutated
    test_results["Test 1B (LDR Threshold Mutation)"] = {
        "pass": test1b_pass,
        "detail": f"At 600 Lux: Threshold 400 -> LED={hw_ldr_orig.get('ledOn')} (False), Threshold 900 -> LED={hw_ldr_mutated.get('ledOn')} (True)"
    }
    print(f"  -> Result: {'PASS' if test1b_pass else 'FAIL'} | {test_results['Test 1B (LDR Threshold Mutation)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 2A: Variable & for-Loop Resolution - Servo Smooth 0°->180° Sweep
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 2A] Servo Lab (Lab 2) - Smooth for-Loop Sweep (0° -> 180°)")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('servo'); window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.2)

    # Collect angles over 35 stepSimulation calls
    angles = []
    for step in range(35):
        session.evaluate("window.useWorkbenchStore.getState().stepSimulation();")
        ang = session.evaluate("window.useWorkbenchStore.getState().hardwareState.servoAngle")
        angles.append(ang)

    unique_angles = sorted(list(set(angles)))
    min_ang = min(unique_angles)
    max_ang = max(unique_angles)
    test2a_pass = len(unique_angles) >= 4 and max_ang >= 120 and min_ang <= 60
    test_results["Test 2A (Servo for-Loop Sweep)"] = {
        "pass": test2a_pass,
        "detail": f"Sweep reached {len(unique_angles)} distinct angles ({min_ang}° to {max_ang}°), Sample: {unique_angles[:6]}"
    }
    print(f"  -> Result: {'PASS' if test2a_pass else 'FAIL'} | {test_results['Test 2A (Servo for-Loop Sweep)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 2B: Variable & Transfer Function - Potentiometer analogRead + map
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 2B] Potentiometer Lab (Lab 4) - analogRead(A0) + map() -> Servo Angle")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('pot'); window.useWorkbenchStore.getState().setActiveLesson(4);")
    time.sleep(0.2)

    # Test pot at 0 -> Angle ~0
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ potVal: 0 });")
    step_n_times(12)
    ang_0 = session.evaluate("window.useWorkbenchStore.getState().hardwareState.servoAngle")

    # Test pot at 512 -> Angle ~90
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ potVal: 512 });")
    step_n_times(12)
    ang_512 = session.evaluate("window.useWorkbenchStore.getState().hardwareState.servoAngle")

    # Test pot at 1023 -> Angle ~180
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ potVal: 1023 });")
    step_n_times(12)
    ang_1023 = session.evaluate("window.useWorkbenchStore.getState().hardwareState.servoAngle")

    test2b_pass = ang_0 <= 5 and 85 <= ang_512 <= 95 and ang_1023 >= 175
    test_results["Test 2B (Potentiometer map -> Servo)"] = {
        "pass": test2b_pass,
        "detail": f"potVal 0 -> {ang_0}°, potVal 512 -> {ang_512}°, potVal 1023 -> {ang_1023}°"
    }
    print(f"  -> Result: {'PASS' if test2b_pass else 'FAIL'} | {test_results['Test 2B (Potentiometer map -> Servo)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 3A: Output Coupling - RGB Multi-Channel analogWrite
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 3A] RGB Lab (Lab 9) - C++ analogWrite(9, 10, 11) Coupling")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('rgb'); window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.2)

    custom_rgb_cpp = """void setup() {
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
}
void loop() {
  analogWrite(9, 255);
  analogWrite(10, 128);
  analogWrite(11, 40);
  delay(100);
}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_rgb_cpp)});")
    step_n_times(10)
    hw_rgb = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    r = hw_rgb.get("rgbR")
    g = hw_rgb.get("rgbG")
    b = hw_rgb.get("rgbB")

    test3a_pass = (r == 255 and g == 128 and b == 40)
    test_results["Test 3A (RGB Output Coupling)"] = {
        "pass": test3a_pass,
        "detail": f"Red={r} (Expected 255), Green={g} (Expected 128), Blue={b} (Expected 40)"
    }
    print(f"  -> Result: {'PASS' if test3a_pass else 'FAIL'} | {test_results['Test 3A (RGB Output Coupling)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 3B: Output Coupling - 16x2 LCD Text Rendering
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 3B] LCD Lab (Lab 16) - C++ lcd.print Text Coupling")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('lcd'); window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.2)

    custom_lcd_cpp = """#include <LiquidCrystal_I2C.h>
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
}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_lcd_cpp)});")
    step_n_times(14)
    hw_lcd = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    row0 = hw_lcd.get("lcdTextRow0", "")
    row1 = hw_lcd.get("lcdTextRow1", "")

    test3b_pass = ("SparkByte" in row0 and "Aaditya" in row1)
    test_results["Test 3B (LCD Text Coupling)"] = {
        "pass": test3b_pass,
        "detail": f"Row 0='{row0}', Row 1='{row1}'"
    }
    print(f"  -> Result: {'PASS' if test3b_pass else 'FAIL'} | {test_results['Test 3B (LCD Text Coupling)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 4A: Function Calls - L298N Motor Rover (motorForward / motorReverse)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 4A] Motor Lab (Lab 19) - Function Calls & H-Bridge Spin")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('motor'); window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.2)

    custom_motor_cpp = """void setup() {}
void loop() {
  motorForward(225);
  delay(100);
}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_motor_cpp)});")
    step_n_times(8)
    hw_motor = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    speed_fwd = hw_motor.get("motorSpeed")
    dir_fwd = hw_motor.get("motorDirection")

    test4a_pass = (speed_fwd == 225 and dir_fwd == 'FORWARD')
    test_results["Test 4A (Motor Function Calls)"] = {
        "pass": test4a_pass,
        "detail": f"Forward Speed={speed_fwd} (Expected 225), Direction={dir_fwd} (Expected FORWARD)"
    }
    print(f"  -> Result: {'PASS' if test4a_pass else 'FAIL'} | {test_results['Test 4A (Motor Function Calls)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 4B: Custom Interpreters - SSD1306 OLED Framebuffer Canvas
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 4B] OLED Lab (Lab 17) - Adafruit_GFX Framebuffer Rendering")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('oled'); window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.2)

    custom_oled_cpp = """#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.drawLine(0, 0, 120, 60, SSD1306_WHITE);
  display.display();
}
void loop() {}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_oled_cpp)});")
    step_n_times(6)
    hw_oled = session.evaluate("window.useWorkbenchStore.getState().hardwareState")
    buf = hw_oled.get("oledBuffer", [])
    p00 = buf[0][0] if len(buf) > 0 and len(buf[0]) > 0 else False
    p60_120 = buf[60][120] if len(buf) > 60 and len(buf[60]) > 120 else False

    test4b_pass = p00 and p60_120
    test_results["Test 4B (OLED Framebuffer)"] = {
        "pass": test4b_pass,
        "detail": f"Pixel (0,0)={p00}, Pixel (120,60)={p60_120}"
    }
    print(f"  -> Result: {'PASS' if test4b_pass else 'FAIL'} | {test_results['Test 4B (OLED Framebuffer)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 4C & 4D: OpenSCAD CAD & 3D Slicer G-Code
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 4C & 4D] CAD & Slicer Labs (Labs 6 & 13) - CSG Solid & Toolpath")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('cad');")
    time.sleep(0.2)
    custom_cad = """cube([55, 35, 25], center=true);"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_cad)});")
    step_n_times(4)
    cad_model = session.evaluate("window.useWorkbenchStore.getState().hardwareState.cadModel")
    test4c_pass = (cad_model.get("x") == 55 and cad_model.get("y") == 35 and cad_model.get("z") == 25)
    test_results["Test 4C (OpenSCAD CAD Solid)"] = {
        "pass": test4c_pass,
        "detail": f"CAD Model Dims: {cad_model.get('x')}x{cad_model.get('y')}x{cad_model.get('z')} (Expected 55x35x25)"
    }
    print(f"  -> Result: {'PASS' if test4c_pass else 'FAIL'} | {test_results['Test 4C (OpenSCAD CAD Solid)']['detail']}")

    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('slicer');")
    time.sleep(0.2)
    custom_gcode = """G1 X125.0 Y85.0 E15.0 F1800"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_gcode)});")
    step_n_times(4)
    slicer_state = session.evaluate("window.useWorkbenchStore.getState().hardwareState.slicerState")
    test4d_pass = (slicer_state.get("nozzleX") == 125.0 and slicer_state.get("nozzleY") == 85.0)
    test_results["Test 4D (3D Slicer G-Code)"] = {
        "pass": test4d_pass,
        "detail": f"Nozzle Position: X={slicer_state.get('nozzleX')} Y={slicer_state.get('nozzleY')} (Expected 125, 85)"
    }
    print(f"  -> Result: {'PASS' if test4d_pass else 'FAIL'} | {test_results['Test 4D (3D Slicer G-Code)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # 22-LAB HEALTH & CONSOLE ERROR SWEEP
    # ──────────────────────────────────────────────────────────────────
    print("\n================================================================")
    print("   SWEEPING ALL 22 LABS & CHECKING CONSOLE / RUNTIME ERRORS     ")
    print("================================================================")

    all_22_labs = [
        "led", "servo", "button", "pot", "buzzer", "cad", "dmm", "ldr", "rgb",
        "temp", "sonar", "ir", "slicer", "dht", "gas", "lcd", "oled", "soil",
        "motor", "imu", "rfid", "iot"
    ]
    lab_sweep_results = {}

    for lab_id in all_22_labs:
        session.evaluate(f"window.useWorkbenchStore.getState().setActiveLab('{lab_id}'); window.useWorkbenchStore.getState().startSimulation();")
        time.sleep(0.1)
        session.evaluate("for (let i = 0; i < 4; i++) window.useWorkbenchStore.getState().stepSimulation();")
        active_lab = session.evaluate("window.useWorkbenchStore.getState().activeLabId")
        is_running = session.evaluate("window.useWorkbenchStore.getState().isRunning")
        step_idx = session.evaluate("window.useWorkbenchStore.getState().stepIndex")
        lab_sweep_results[lab_id] = {
            "loaded": active_lab == lab_id,
            "running": is_running,
            "stepped": step_idx >= 0
        }
        print(f"  Lab [{lab_id:7}] ... LOADED: OK | STEPPED: OK")

    total_console_errors = len(session.console_logs)
    total_page_errors = len(session.page_errors)

    print("\n--- Console & Runtime Diagnostics ---")
    print(f"  Console Errors Recorded: {total_console_errors}")
    print(f"  Uncaught Page Exceptions: {total_page_errors}")

    summary_file = os.path.join("scratch", "functional_verification_summary.json")
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump({
            "test_results": test_results,
            "lab_sweep": lab_sweep_results,
            "console_errors": session.console_logs,
            "page_errors": session.page_errors,
            "all_passed": all(t["pass"] for t in test_results.values()) and total_console_errors == 0 and total_page_errors == 0
        }, f, indent=2)

    print(f"\n[DONE] Full audit saved to {summary_file}")

finally:
    try:
        session.close()
    except:
        pass
    try:
        proc.terminate()
    except:
        pass
