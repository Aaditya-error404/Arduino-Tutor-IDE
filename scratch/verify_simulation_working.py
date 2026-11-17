import os
import sys
import json
import time
import base64
import urllib.request
import urllib.parse
import subprocess
import socket

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9360
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1600,1050"
])

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
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(handshake.encode('utf-8'))
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(4096)
        self.msg_id = 0

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
        masked_payload = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked_payload)
        self.sock.sendall(frame)

    def recv_frame(self):
        head = self.sock.recv(2)
        if not head:
            return None
        length = head[1] & 0x7f
        if length == 126:
            length = int.from_bytes(self.sock.recv(2), 'big')
        elif length == 127:
            length = int.from_bytes(self.sock.recv(8), 'big')
        data = bytearray()
        while len(data) < length:
            chunk = self.sock.recv(min(length - len(data), 65536))
            if not chunk:
                break
            data.extend(chunk)
        return json.loads(data.decode('utf-8', errors='ignore'))

    def call(self, method, params=None):
        self.msg_id += 1
        req = {"id": self.msg_id, "method": method, "params": params or {}}
        self.send_frame(req)
        while True:
            resp = self.recv_frame()
            if resp and resp.get("id") == self.msg_id:
                return resp

    def eval(self, js):
        res = self.call("Runtime.evaluate", {"expression": js, "returnByValue": True})
        if res and "result" in res and "result" in res["result"]:
            val = res["result"]["result"].get("value")
            return val
        return None

    def close(self):
        self.sock.close()

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json/list").read())
    page_tab = next(t for t in tabs if t.get("type") == "page")
    cdp = CDPSession(page_tab["webSocketDebuggerUrl"])
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    cdp.call("Page.navigate", {"url": "http://localhost:8080/?lab=servo"})
    time.sleep(2.0)

    # 1. Test Start / Running State
    t1 = cdp.eval("""(() => {
        const btnSim = document.getElementById('btn-simulate');
        btnSim.click();
        return {
            isRunning: window.circuitSimulation.isRunning,
            isPaused: window.circuitSimulation.isPaused,
            btnText: btnSim.textContent.trim(),
            statusText: document.getElementById('sim-status-text')?.textContent
        };
    })()""")
    print("[TEST 1] Start Simulation:", json.dumps(t1))
    assert t1['isRunning'] == True
    assert "Running" in t1['btnText']

    # Wait for a couple of cycles
    time.sleep(2.0)

    # 2. Test Pause
    t2 = cdp.eval("""(() => {
        const btnPause = document.getElementById('btn-pause');
        btnPause.click();
        return {
            isRunning: window.circuitSimulation.isRunning,
            isPaused: window.circuitSimulation.isPaused,
            btnSimText: document.getElementById('btn-simulate')?.textContent.trim(),
            loopCycles: window.circuitSimulation.loopCount
        };
    })()""")
    print("[TEST 2] Pause Simulation:", json.dumps(t2))
    assert t2['isPaused'] == True
    assert "Resume" in t2['btnSimText']
    assert t2['loopCycles'] >= 1

    # 3. Test Resume
    t3 = cdp.eval("""(() => {
        const btnSim = document.getElementById('btn-simulate');
        btnSim.click();
        return {
            isRunning: window.circuitSimulation.isRunning,
            isPaused: window.circuitSimulation.isPaused,
            btnText: btnSim.textContent.trim()
        };
    })()""")
    print("[TEST 3] Resume Simulation:", json.dumps(t3))
    assert t3['isRunning'] == True
    assert t3['isPaused'] == False

    # 4. Test Reset
    t4 = cdp.eval("""(() => {
        const btnReset = document.getElementById('btn-reset-sim');
        btnReset.click();
        return {
            isRunning: window.circuitSimulation.isRunning,
            isPaused: window.circuitSimulation.isPaused,
            btnSimText: document.getElementById('btn-simulate')?.textContent.trim(),
            cycleBadge: document.getElementById('loop-cycle-badge')?.textContent,
            statusText: document.getElementById('sim-status-text')?.textContent
        };
    })()""")
    print("[TEST 4] Reset Simulation:", json.dumps(t4))
    assert t4['isRunning'] == False
    assert "Start Simulation" in t4['btnSimText']
    assert "Cycles: 0" in t4['cycleBadge']

    # 5. Test Live Simulation Across Diverse Labs
    sample_labs = ['led', 'servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot']
    for lab in sample_labs:
        lab_res = cdp.eval(f"""(() => {{
            window.switchLab('{lab}');
            document.getElementById('btn-simulate').click();
            return {{
                activeLab: window.circuitSimulation.activeLab,
                isRunning: window.circuitSimulation.isRunning,
                btnText: document.getElementById('btn-simulate').textContent.trim()
            }};
        }})()""")
        time.sleep(1.5)
        lab_after = cdp.eval("""(() => {
            return {
                statusText: document.getElementById('sim-status-text')?.textContent,
                loopCount: window.circuitSimulation.loopCount
            };
        })()""")
        print(f"[TEST 5] Lab '{lab}': Running={lab_res['isRunning']}, Loops={lab_after['loopCount']}, Status: {lab_after['statusText'][:55]}...")
        assert lab_res['isRunning'] == True
        assert lab_after['loopCount'] >= 1

    # Take screenshot of running simulation
    shot = cdp.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/simulation_working_verified.png", "wb") as f:
        f.write(base64.b64decode(shot["result"]["data"]))
    print("\nSaved scratch/simulation_working_verified.png")
    print("ALL SIMULATION TESTS PASSED!")

    cdp.close()
finally:
    proc.terminate()
