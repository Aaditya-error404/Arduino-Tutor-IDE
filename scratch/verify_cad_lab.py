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

cdp_port = 9356
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1440,900"
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
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))
        mask = os.urandom(4)
        frame.extend(mask)
        masked = bytearray(payload[i] ^ mask[i % 4] for i in range(length))
        frame.extend(masked)
        self.sock.sendall(frame)

    def read_frame(self):
        head = self.sock.recv(2)
        if not head:
            return None
        length = head[1] & 0x7F
        if length == 126:
            length = int.from_bytes(self.sock.recv(2), 'big')
        elif length == 127:
            length = int.from_bytes(self.sock.recv(8), 'big')
        payload = b""
        while len(payload) < length:
            chunk = self.sock.recv(length - len(payload))
            if not chunk:
                break
            payload += chunk
        return json.loads(payload.decode('utf-8', errors='ignore'))

    def call(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        req = {"id": cid, "method": method, "params": params or {}}
        self.send_frame(req)
        while True:
            resp = self.read_frame()
            if resp and resp.get("id") == cid:
                return resp.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

try:
    tabs_url = f"http://127.0.0.1:{cdp_port}/json"
    req = urllib.request.urlopen(tabs_url, timeout=5)
    tabs = json.loads(req.read().decode())
    target_tab = next(t for t in tabs if t.get("type") == "page")
    ws_url = target_tab["webSocketDebuggerUrl"]
    print(f"Connected to Chrome CDP: {ws_url}")

    client = CDPSession(ws_url)
    client.call("Page.enable")
    client.call("Runtime.enable")

    print("\nNavigating to http://127.0.0.1:8080/?lab=cad ...")
    client.call("Page.navigate", {"url": "http://127.0.0.1:8080/?lab=cad"})
    time.sleep(2.0)

    val = client.evaluate("""
    JSON.stringify({
        bootError: window.__bootError || null,
        activeLab: window.circuitSimulation ? window.circuitSimulation.activeLab : null,
        labLabel: document.getElementById('current-lab-label') ? document.getElementById('current-lab-label').textContent : null,
        cadDisplay: document.getElementById('cad-circuit-view') ? document.getElementById('cad-circuit-view').style.display : null,
        gradeBadge: document.getElementById('grade-badge') ? document.getElementById('grade-badge').textContent : null,
        gradeButtonsCount: document.querySelectorAll('.grade-tab-btn').length,
        labButtonsCount: document.querySelectorAll('.lab-switch-btn').length,
        cadLessonsCount: (window.CAD_LESSONS_DATA || []).length,
        hudVol: document.getElementById('hud-readout-4') ? document.getElementById('hud-readout-4').textContent : null
    })
    """)
    print("\n--- CAD Lab Load Status ---")
    data = json.loads(val or "{}")
    for k, v in data.items():
        print(f"  {k}: {v}")

    # Test switching lessons 1, 2, 3, 4 of CAD
    for l_idx in range(4):
        client.evaluate(f"window.switchLesson({l_idx});")
        time.sleep(0.3)
        lesson_check = client.evaluate("""
        JSON.stringify({
            title: document.getElementById('lesson-title') ? document.getElementById('lesson-title').textContent : null,
            interactive: !!document.getElementById('lesson-interactive-area'),
            hasControls: !!(document.getElementById('cad-slider-x') || document.getElementById('btn-cad-group') || document.getElementById('btn-cad-align-xy') || document.getElementById('btn-cad-export-stl'))
        })
        """)
        print(f"  Lesson {l_idx+1}: {lesson_check}")

    # Test Grade Filter
    filter_test = client.evaluate("""
    (() => {
        const btn68 = document.getElementById('grade-btn-68');
        if (btn68) btn68.click();
        const visible = Array.from(document.querySelectorAll('.lab-switch-btn')).filter(b => !b.classList.contains('grade-hidden')).map(b => b.getAttribute('data-lab'));
        const allBtn = document.getElementById('grade-btn-all');
        if (allBtn) allBtn.click();
        const visibleAll = Array.from(document.querySelectorAll('.lab-switch-btn')).filter(b => !b.classList.contains('grade-hidden')).length;
        return JSON.stringify({ level1Visible: visible, allVisibleCount: visibleAll });
    })()
    """)
    print(f"\n--- Grade Filter Test ---\n  {filter_test}")

    # Take screenshot of the CAD lab in action!
    shot_res = client.call("Page.captureScreenshot", {"format": "png"})
    img_b64 = shot_res.get("data")
    if img_b64:
        with open("cad_lab_verified.png", "wb") as f:
            f.write(base64.b64decode(img_b64))
        print("\nSaved screenshot: cad_lab_verified.png")

finally:
    proc.terminate()
    print("\nTest completed.")
