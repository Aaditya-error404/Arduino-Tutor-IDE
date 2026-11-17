# -*- coding: utf-8 -*-
"""
Live Visual Animation vs Simulation Execution Audit across all 22 Labs in SparkByte Studio v2
Runs via Chrome CDP on http://localhost:5173/
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, tempfile

sys.stdout.reconfigure(encoding='utf-8')

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
temp_dir = tempfile.mkdtemp()
cdp_port = 9698

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1920,1080"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.0)

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

    def recv_exact(self, n):
        data = b""
        while len(data) < n:
            chunk = self.sock.recv(n - len(data))
            if not chunk: raise EOFError()
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
        masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked)
        self.sock.sendall(frame)

    def recv_frame(self):
        h = self.recv_exact(2)
        payload_len = h[1] & 0x7F
        if payload_len == 126:
            payload_len = int.from_bytes(self.recv_exact(2), 'big')
        elif payload_len == 127:
            payload_len = int.from_bytes(self.recv_exact(8), 'big')
        return json.loads(self.recv_exact(payload_len).decode('utf-8', errors='ignore'))

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method}
        if params: msg["params"] = params
        self.send_frame(msg)
        while True:
            frame = self.recv_frame()
            if frame.get("id") == mid:
                return frame.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

ALL_LABS = [
    ('led', 'LED Blink & PWM Fader'),
    ('servo', 'SG90 Micro Servo'),
    ('button', 'Tactile Pushbutton'),
    ('pot', 'Potentiometer Wiper'),
    ('buzzer', 'Piezo Buzzer Siren'),
    ('cad', '3D Parametric CAD CSG'),
    ('dmm', 'Digital Multimeter'),
    ('ldr', 'LDR Photoresistor Nightlight'),
    ('rgb', 'Multi-Channel RGB LED'),
    ('temp', 'TMP36 Temperature Fan'),
    ('sonar', 'HC-SR04 Ultrasonic Radar'),
    ('ir', 'TCRT5000 IR Line Tracker'),
    ('slicer', '3D Slicer Toolpath'),
    ('dht', 'DHT11 Climate Station'),
    ('gas', 'MQ-2 Gas Leak Alarm'),
    ('lcd', '16x2 I2C Display'),
    ('oled', 'SSD1306 128x64 OLED'),
    ('soil', 'Smart Soil Irrigation Pump'),
    ('motor', 'L298N Dual H-Bridge Rover'),
    ('imu', 'MPU-6050 6-DoF Gimbal'),
    ('rfid', 'RC522 RFID Access Latch'),
    ('iot', 'ESP32 MQTT Cloud Telemetry')
]

audit_results = []

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    session = CDPSession(page_tab["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Runtime.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})

    for _ in range(30):
        if session.evaluate("typeof window.useWorkbenchStore !== 'undefined'"):
            break
        time.sleep(0.5)

    print("=================================================================")
    print("  VISUAL ANIMATION VS SIMULATION EXECUTION AUDIT (22 LABS)       ")
    print("=================================================================")

    for lab_id, lab_name in ALL_LABS:
        print(f"\nAUDITING: [{lab_id}] {lab_name}...")
        session.evaluate(f"window.useWorkbenchStore.getState().setActiveLab('{lab_id}');")
        session.evaluate("window.useWorkbenchStore.getState().pauseSimulation();")
        time.sleep(0.3)

        # 1. Inspect Stopped State: does dragging/mutating sliders trigger actuators?
        session.evaluate("window.useWorkbenchStore.getState().pauseSimulation();")
        
        # Test slider bypass on stopped simulation
        slider_bypass = False
        bypass_details = ""
        
        if lab_id == 'temp':
            session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ temperatureC: 60 });")
            # In TempLabView: is fanActive set? No, fanActive is in hw, but is fan animated?
            is_spinning = session.evaluate("document.querySelector('.animate-spin') !== null")
            hw_fan = session.evaluate("window.useWorkbenchStore.getState().hardwareState.fanActive")
            # If fan spins when simulation is NOT running, that's a slider bypass bug!
            if is_spinning and not hw_fan:
                slider_bypass = True
                bypass_details = "Fan spins while simulation is stopped"
        elif lab_id == 'soil':
            session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ soilMoisturePct: 10 });")
            is_pump = session.evaluate("document.body.innerText.includes('PUMP ACTIVE')")
            hw_relay = session.evaluate("window.useWorkbenchStore.getState().hardwareState.relayActive")
            if is_pump and not hw_relay:
                slider_bypass = True
                bypass_details = "Pump shows active while simulation is stopped"
        elif lab_id == 'gas':
            session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ gasPpm: 750 });")
            is_pinging = session.evaluate("document.querySelector('.animate-ping') !== null")
            hw_buzzer = session.evaluate("window.useWorkbenchStore.getState().hardwareState.buzzerActive")
            if is_pinging and not hw_buzzer:
                slider_bypass = True
                bypass_details = "Gas alarm pings while simulation is stopped"
        elif lab_id == 'motor':
            session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ motorSpeed: 200, motorDirection: 'FORWARD' });")
            is_spinning = session.evaluate("document.querySelector('.animate-spin') !== null")
            if is_spinning: # Simulation is stopped, but motor spins!
                is_running = session.evaluate("window.useWorkbenchStore.getState().isRunning")
                if not is_running:
                    slider_bypass = True
                    bypass_details = "Motor spins while simulation is stopped"

        # 2. Inspect Running State: does clicking Start Simulation produce visible dynamic feedback?
        session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
        time.sleep(1.2)

        has_dynamic_animation = session.evaluate("""
            (() => {
                const anims = document.querySelectorAll('.animate-spin, .animate-pulse, .animate-bounce, .animate-ping, canvas, wokwi-led[value="true"], wokwi-led[value="1"]');
                const hasAnimClass = anims.length > 0;
                const svgs = document.querySelectorAll('svg path, svg circle, svg rect');
                return {
                    hasAnims: hasAnimClass,
                    animCount: anims.length,
                    svgCount: svgs.length,
                    isRunning: window.useWorkbenchStore.getState().isRunning,
                    stepIndex: window.useWorkbenchStore.getState().stepIndex
                };
            })()
        """)

        # Check specific dynamic elements
        idle_bug = False
        idle_details = ""
        static_bug = False
        static_details = ""

        if lab_id == 'sonar':
            # Check if sonar has live acoustic waves / radar rings
            has_waves = session.evaluate("document.querySelectorAll('.sonar-wave, [data-sonar-wave]').length > 0")
            if not has_waves:
                static_bug = True
                static_details = "HC-SR04 lacks live pulsing ultrasonic acoustic wave rings"
        elif lab_id == 'ir':
            has_beam = session.evaluate("document.querySelectorAll('.ir-beam, [data-ir-beam]').length > 0")
            if not has_beam:
                static_bug = True
                static_details = "TCRT5000 lacks live 940nm optical reflection beam path"
        elif lab_id == 'soil':
            has_water_flow = session.evaluate("document.querySelectorAll('.water-droplet, [data-water-flow]').length > 0")
            if not has_water_flow:
                static_bug = True
                static_details = "Soil probe lacks live flowing water droplet particles / soil absorption ripples"
        elif lab_id == 'motor':
            has_tread_anim = session.evaluate("document.querySelectorAll('.rover-tread-rolling, [data-tread-rolling]').length > 0")
            if not has_tread_anim:
                static_bug = True
                static_details = "Rover wheels lack genuine rolling tread / current flow animation"
        elif lab_id == 'imu':
            has_horizon = session.evaluate("document.querySelectorAll('.artificial-horizon, [data-pfd]').length > 0")
            if not has_horizon:
                static_bug = True
                static_details = "MPU-6050 lacks live Primary Flight Display (PFD) artificial horizon & gyro vectors"
        elif lab_id == 'rfid':
            has_field = session.evaluate("document.querySelectorAll('.rfid-field, [data-rfid-field]').length > 0")
            if not has_field:
                static_bug = True
                static_details = "RC522 reader lacks 13.56MHz resonant magnetic induction ripple waves"
        elif lab_id == 'iot':
            has_packets = session.evaluate("document.querySelectorAll('.iot-packet-wave, [data-iot-wave]').length > 0")
            if not has_packets:
                static_bug = True
                static_details = "ESP32 lacks live Wi-Fi transmission burst pulses & MQTT telemetry stream visual"
        elif lab_id == 'buzzer':
            has_sound_waves = session.evaluate("document.querySelectorAll('.sound-wave, [data-sound-wave]').length > 0")
            if not has_sound_waves:
                static_bug = True
                static_details = "Piezo buzzer lacks live acoustic compression wave arcs"
        elif lab_id == 'dmm':
            has_probes = session.evaluate("document.querySelectorAll('.probe-current, [data-dmm-current]').length > 0")
            if not has_probes:
                static_bug = True
                static_details = "Multimeter lacks live electron current flow along probes"

        print(f"  Step: {has_dynamic_animation.get('stepIndex')}, Anims: {has_dynamic_animation.get('animCount')}, SliderBypass: {slider_bypass}, StaticBug: {static_bug}")
        audit_results.append({
            "id": lab_id,
            "name": lab_name,
            "sliderBypass": slider_bypass,
            "bypassDetails": bypass_details,
            "staticBug": static_bug,
            "staticDetails": static_details,
            "stepIndex": has_dynamic_animation.get('stepIndex')
        })

    with open("scratch/visual_animation_audit_results.json", "w", encoding="utf-8") as f:
        json.dump(audit_results, f, indent=2)

    print("\nAudit Complete! Saved to scratch/visual_animation_audit_results.json")

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    proc.terminate()
