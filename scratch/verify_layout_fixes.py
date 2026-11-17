# -*- coding: utf-8 -*-
"""
Verification Script for Layout Fixes:
1. Left column vertical flow (no horizontal squishing)
2. Compact numbered stepper tabs (1, 2, 3, 4 with full title tooltips)
3. Motor lab H-bridge full-width & jumper ribbon
4. Oscilloscope high-contrast telemetry row
5. Captures screenshots and saves artifacts
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, shutil

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
if not chrome_bin:
    print("Chrome binary not found!")
    sys.exit(1)

cdp_port = 9396

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
        cid = self.msg_id
        self.send_frame({"id": cid, "method": method, "params": params or {}})
        while True:
            resp = self.read_frame()
            if resp and resp.get("id") == cid:
                return resp.get("result", {})

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    session = CDPSession(ws_url)

    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:8080/index.html?lab=servo"})
    time.sleep(2.5)

    def eval_js(expr):
        res = session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    print("\n=== 1. VERIFY LEFT COLUMN VERTICAL FLOW ===")
    v_flow = eval_js("""
    (() => {
        const labView = document.getElementById('view-content-lab');
        const coach = document.querySelector('.coach-banner');
        const interact = document.getElementById('lesson-interactive-area');
        const stepAdv = document.querySelector('.step-advance-card');
        const translator = document.querySelector('.code-translator-wrapper');
        const panel = document.querySelector('.panel-lesson');

        const csLab = window.getComputedStyle(labView);
        const csStepAdv = stepAdv ? window.getComputedStyle(stepAdv) : null;

        const panelRect = panel ? panel.getBoundingClientRect() : {};
        const coachRect = coach ? coach.getBoundingClientRect() : {};
        const stepAdvRect = stepAdv ? stepAdv.getBoundingClientRect() : {};
        const transRect = translator ? translator.getBoundingClientRect() : {};

        return {
            labDisplay: csLab.display,
            labFlexDirection: csLab.flexDirection,
            panelWidth: panelRect.width,
            coachWidth: coachRect.width,
            stepAdvWidth: stepAdvRect.width,
            stepAdvDisplay: csStepAdv ? csStepAdv.display : null,
            stepAdvFlexDir: csStepAdv ? csStepAdv.flexDirection : null,
            translatorTop: transRect.top,
            aboveFold: transRect.top < 450
        };
    })()
    """)
    print("Vertical Flow Inspection:", json.dumps(v_flow, indent=2))

    boxes = eval_js("""
    (() => {
        const els = ['.app-header', '.panel-lesson', '.coach-banner', '#lesson-interactive-area', '.task-card', '.step-advance-card', '.code-translator-wrapper'];
        return els.map(sel => {
            const el = document.querySelector(sel);
            if (!el) return { sel, found: false };
            const r = el.getBoundingClientRect();
            return { sel, top: Math.round(r.top), height: Math.round(r.height), bottom: Math.round(r.bottom) };
        });
    })()
    """)
    print("Element Bounding Boxes:", json.dumps(boxes, indent=2))

    print("\n=== 2. VERIFY COMPACT STEPPER TABS ===")
    stepper_info = eval_js("""
    (() => {
        const tabs = Array.from(document.querySelectorAll('.lesson-tab'));
        return {
            count: tabs.length,
            tabTexts: tabs.map(t => t.textContent.trim()),
            tabTitles: tabs.map(t => t.getAttribute('title')),
            tabWidths: tabs.map(t => Math.round(t.getBoundingClientRect().width)),
            activeTab: tabs.findIndex(t => t.classList.contains('active')) + 1
        };
    })()
    """)
    print("Stepper Tabs Inspection:", json.dumps(stepper_info, indent=2))

    print("\n=== 3. VERIFY OSCILLOSCOPE TELEMETRY ROW & CONTRAST ===")
    scope_info = eval_js("""
    (() => {
        const row = document.querySelector('.scope-telemetry-row');
        const items = document.querySelectorAll('.telemetry-item');
        const label = document.querySelector('.telemetry-label');
        const val = document.querySelector('.telemetry-val');
        const status = document.getElementById('scope-status');

        return {
            hasTelemetryRow: !!row,
            itemCount: items.length,
            labelColor: label ? window.getComputedStyle(label).color : null,
            valColor: val ? window.getComputedStyle(val).color : null,
            statusColor: status ? window.getComputedStyle(status).color : null,
            statusText: status ? status.textContent : null
        };
    })()
    """)
    print("Oscilloscope Telemetry Inspection:", json.dumps(scope_info, indent=2))

    # Capture default view (Servo lab)
    shot_data = session.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/redesigned_ui_workspace.png", "wb") as f:
        f.write(base64.b64decode(shot_data["data"]))
    print("Captured scratch/redesigned_ui_workspace.png")

    print("\n=== 4. SWITCH TO MOTOR LAB & VERIFY H-BRIDGE & JUMPER RIBBON ===")
    eval_js("window.switchLab('motor', true);")
    time.sleep(1.5)

    motor_info = eval_js("""
    (() => {
        const ribbon = document.getElementById('l298n-jumper-ribbon');
        const wires = ribbon ? ribbon.querySelectorAll('path').length : 0;
        const motorCircuit = document.getElementById('motor-circuit-view');
        const panel = document.querySelector('.panel-lesson');
        const interact = document.getElementById('lesson-interactive-area');

        const interactRect = interact ? interact.getBoundingClientRect() : {};
        const panelRect = panel ? panel.getBoundingClientRect() : {};

        return {
            hasJumperRibbon: !!ribbon,
            wireCount: wires,
            motorCircuitVisible: motorCircuit ? window.getComputedStyle(motorCircuit).display !== 'none' : false,
            interactiveWidth: interactRect.width,
            panelWidth: panelRect.width,
            isFullWidth: interactRect.width >= (panelRect.width - 40)
        };
    })()
    """)
    print("Motor Lab Inspection:", json.dumps(motor_info, indent=2))

    # Capture Motor lab screenshot
    shot_motor = session.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/motor_lab_layout_verified.png", "wb") as f:
        f.write(base64.b64decode(shot_motor["data"]))
    print("Captured scratch/motor_lab_layout_verified.png")

    # Copy screenshots to artifact directory
    art_dir = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310"
    shutil.copy("scratch/redesigned_ui_workspace.png", os.path.join(art_dir, "redesigned_ui_workspace.png"))
    shutil.copy("scratch/motor_lab_layout_verified.png", os.path.join(art_dir, "motor_lab_layout_verified.png"))
    print("Artifact screenshots updated successfully!")

finally:
    proc.terminate()
    proc.wait()
