# -*- coding: utf-8 -*-
import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, tempfile

sys.stdout.reconfigure(encoding='utf-8')

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
temp_dir = tempfile.mkdtemp()
cdp_port = 9696

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox"
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

    print("DIAGNOSTICS 2:")

    # 1. IMU
    print("\n--- IMU ---")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('imu');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ imuPitch: 25, imuRoll: 0 });")
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    for s in range(5):
        time.sleep(0.5)
        st = session.evaluate("""({
            activePhase: window.useWorkbenchStore.getState().activePhase,
            stepIndex: window.useWorkbenchStore.getState().stepIndex,
            activeInstruction: window.useWorkbenchStore.getState().activeInstruction,
            vars: window.useWorkbenchStore.getState().vars,
            hw: window.useWorkbenchStore.getState().hardwareState
        })""")
        print(f"  IMU Tick {s}: step={st['stepIndex']}, inst={st['activeInstruction']}, servoAngle={st['hw'].get('servoAngle')}, vars={st['vars']}")

    # 2. SOIL
    print("\n--- SOIL ---")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('soil');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(4);")
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ soilMoisturePct: 15 });")
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    for s in range(5):
        time.sleep(0.5)
        st = session.evaluate("""({
            stepIndex: window.useWorkbenchStore.getState().stepIndex,
            activeInstruction: window.useWorkbenchStore.getState().activeInstruction,
            vars: window.useWorkbenchStore.getState().vars,
            relayActive: window.useWorkbenchStore.getState().hardwareState.relayActive
        })""")
        print(f"  Soil Dry Tick {s}: step={st['stepIndex']}, inst={st['activeInstruction']}, relay={st['relayActive']}, moisture={st['vars'].get('moisture')}")

    # 3. RFID
    print("\n--- RFID ---")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('rfid');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ rfidScannedUid: 'A3 7F 4E 12' });")
    session.evaluate("window.useWorkbenchStore.getState().startSimulation();")
    for s in range(4):
        time.sleep(0.5)
        st = session.evaluate("""({
            stepIndex: window.useWorkbenchStore.getState().stepIndex,
            activeInstruction: window.useWorkbenchStore.getState().activeInstruction,
            vars: window.useWorkbenchStore.getState().vars,
            rfidAuth: window.useWorkbenchStore.getState().hardwareState.rfidAuthorized,
            servoAngle: window.useWorkbenchStore.getState().hardwareState.servoAngle
        })""")
        print(f"  RFID Master Tick {s}: step={st['stepIndex']}, auth={st['rfidAuth']}, angle={st['servoAngle']}, vars.accessGranted={st['vars'].get('accessGranted')}")

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    proc.terminate()
