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
if not chrome_bin:
    print("Chrome not found")
    sys.exit(1)

cdp_port = 9366
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
        if "result" in res and "result" in res["result"]:
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

    # Check initial simulation state
    init_state = cdp.eval("""(() => {
        return {
            hasSim: !!window.circuitSimulation,
            isRunning: window.circuitSimulation?.isRunning,
            isPaused: window.circuitSimulation?.isPaused,
            activeLab: window.circuitSimulation?.activeLab,
            activeLesson: window.circuitSimulation?.activeLesson,
            btnSimText: document.getElementById('btn-simulate')?.textContent.trim()
        };
    })()""")
    print("Initial Simulation State:", json.dumps(init_state, indent=2))

    # Click #btn-simulate
    click_res = cdp.eval("""(() => {
        try {
            const btn = document.getElementById('btn-simulate');
            btn.click();
            return {
                clicked: true,
                isRunningAfter: window.circuitSimulation.isRunning,
                isPausedAfter: window.circuitSimulation.isPaused,
                btnTextAfter: btn.textContent.trim(),
                statusText: document.getElementById('sim-status-text')?.textContent
            };
        } catch (e) {
            return { error: e.stack || e.message };
        }
    })()""")
    print("Click Simulation Result:", json.dumps(click_res, indent=2))

    # Wait 2 seconds and check cycles
    time.sleep(2.0)
    running_state = cdp.eval("""(() => {
        return {
            isRunning: window.circuitSimulation?.isRunning,
            loopCycles: window.circuitSimulation?.loopCycles,
            cycleBadge: document.getElementById('loop-cycle-badge')?.textContent,
            statusText: document.getElementById('sim-status-text')?.textContent,
            servoAngle: window.circuitSimulation?.hardwareState?.servoAngle
        };
    })()""")
    print("Running State after 2 seconds:", json.dumps(running_state, indent=2))

    # Also test on other labs, e.g. LED lab
    led_test = cdp.eval("""(() => {
        window.switchLab('led');
        const btn = document.getElementById('btn-simulate');
        btn.click();
        return {
            activeLab: window.circuitSimulation.activeLab,
            isRunning: window.circuitSimulation.isRunning,
            btnText: btn.textContent.trim()
        };
    })()""")
    print("LED Lab Simulation Test:", json.dumps(led_test, indent=2))
    time.sleep(2.0)

    led_after = cdp.eval("""(() => {
        return {
            loopCount: window.circuitSimulation.loopCount,
            statusText: document.getElementById('sim-status-text')?.textContent,
            pin13State: window.circuitSimulation.pin13State,
            voltage: window.circuitSimulation.voltage
        };
    })()""")
    print("LED after 2 seconds:", json.dumps(led_after, indent=2))

    cdp.close()
finally:
    proc.terminate()
