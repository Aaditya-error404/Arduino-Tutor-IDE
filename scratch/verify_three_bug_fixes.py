# -*- coding: utf-8 -*-
"""
Verification Script for Three Target Bug Fixes across all 22 Labs:
1. Simulation Execution & Synchronized Line Highlighting on Both Columns
2. Thin, Clean SVG Wires with fill="none", stroke-linecap="round", explicit colors
3. Bottom Telemetry Contrast (#94A3B8 / #F8FAFC) & Top-Right 16x16 Icon Buttons
4. Capture screenshots of verified simulation
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, shutil

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9405

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

    print("\n=== TEST 1: TOP-RIGHT UTILITY ICON BUTTONS ===")
    btn_info = eval_js("""
    (() => {
        const guideBtn = document.getElementById('teacher-modal-btn');
        const audioBtn = document.getElementById('audio-toggle');
        const resetBtn = document.getElementById('reset-btn');

        const gSvg = guideBtn ? guideBtn.querySelector('svg') : null;
        const aSvg = audioBtn ? audioBtn.querySelector('svg') : null;
        const rSvg = resetBtn ? resetBtn.querySelector('svg') : null;

        const gCs = gSvg ? window.getComputedStyle(gSvg) : {};
        const aCs = aSvg ? window.getComputedStyle(aSvg) : {};
        const rCs = rSvg ? window.getComputedStyle(rSvg) : {};

        return {
            guide: {
                title: guideBtn ? guideBtn.getAttribute('title') : null,
                width: gCs.width,
                height: gCs.height,
                stroke: gCs.stroke
            },
            audio: {
                title: audioBtn ? audioBtn.getAttribute('title') : null,
                width: aCs.width,
                height: aCs.height,
                stroke: aCs.stroke
            },
            reset: {
                title: resetBtn ? resetBtn.getAttribute('title') : null,
                width: rCs.width,
                height: rCs.height,
                stroke: rCs.stroke
            }
        };
    })()
    """)
    print("Top-Right Icon Buttons:", json.dumps(btn_info, indent=2))

    print("\n=== TEST 2: JUMPER WIRE SVG FILL & STROKE INSPECTION ===")
    wire_info = eval_js("""
    (() => {
        const wires = Array.from(document.querySelectorAll('.circuit-wire, .wire-electron-track, #l298n-jumper-ribbon path'));
        const badWires = [];
        wires.forEach(w => {
            const cs = window.getComputedStyle(w);
            if (cs.fill !== 'none') {
                badWires.push({
                    tag: w.tagName,
                    classes: w.className,
                    fill: cs.fill
                });
            }
        });
        const sampleWire = document.querySelector('.circuit-wire');
        const csSample = sampleWire ? window.getComputedStyle(sampleWire) : {};
        return {
            totalWirePaths: wires.length,
            badFillCount: badWires.length,
            sampleFill: csSample.fill,
            sampleStrokeCap: csSample.strokeLinecap,
            sampleStrokeWidth: csSample.strokeWidth,
            sampleStroke: csSample.stroke
        };
    })()
    """)
    print("Jumper Wire SVG Inspection:", json.dumps(wire_info, indent=2))

    print("\n=== TEST 3: BOTTOM TELEMETRY READOUT CONTRAST ===")
    telemetry_info = eval_js("""
    (() => {
        const labels = Array.from(document.querySelectorAll('.hud-label'));
        const values = Array.from(document.querySelectorAll('.hud-value'));
        const firstLabel = labels[0];
        const firstVal = values[0];
        const csLabel = firstLabel ? window.getComputedStyle(firstLabel) : {};
        const csVal = firstVal ? window.getComputedStyle(firstVal) : {};
        return {
            labelCount: labels.length,
            valCount: values.length,
            labelColor: csLabel.color,
            valColor: csVal.color,
            valFontFamily: csVal.fontFamily,
            valFontVariant: csVal.fontVariantNumeric
        };
    })()
    """)
    print("Telemetry Contrast Inspection:", json.dumps(telemetry_info, indent=2))

    print("\n=== TEST 4: RUN SIMULATION & CODE STEPPING ACROSS ALL 22 LABS ===")
    labs = [
        'servo', 'led', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp',
        'sonar', 'ir', 'lcd', 'dmm', 'cad', 'slicer', 'dht', 'gas',
        'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
    ]

    all_labs_results = []
    for lab in labs:
        eval_js(f"window.switchLab('{lab}', true);")
        time.sleep(0.2)
        eval_js("window.circuitSimulation.stop();")
        time.sleep(0.1)

        # Click Start Simulation
        eval_js("document.getElementById('btn-simulate').click();")
        time.sleep(0.8)

        stat = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const plainExec = document.querySelectorAll('.code-row-human.executing');
            const cppExec = document.querySelectorAll('.code-row-cpp.executing');
            const badge = document.getElementById('loop-cycle-badge');
            const simText = document.getElementById('sim-status-text');
            const scopeInit = !!sim.scopeCtx;

            const csPlain = plainExec[0] ? window.getComputedStyle(plainExec[0]) : {};
            const csCpp = cppExec[0] ? window.getComputedStyle(cppExec[0]) : {};

            return {
                isRunning: sim ? sim.isRunning : false,
                stepCount: sim ? sim.stepCount : 0,
                plainExec: plainExec.length,
                cppExec: cppExec.length,
                plainBorderLeft: csPlain.borderLeft,
                cppBorderLeft: csCpp.borderLeft,
                scopeActive: scopeInit,
                badgeText: badge ? badge.textContent : '',
                simText: simText ? simText.textContent : ''
            };
        })()
        """)
        all_labs_results.append({
            "lab": lab,
            "running": stat.get("isRunning"),
            "steps": stat.get("stepCount"),
            "dual_highlight": (stat.get("plainExec", 0) > 0 and stat.get("cppExec", 0) > 0),
            "lime_green_border": ('101, 163, 13' in str(stat.get("plainBorderLeft")) or '65a30d' in str(stat.get("plainBorderLeft")).lower()),
            "scopeActive": stat.get("scopeActive")
        })

    print(json.dumps(all_labs_results, indent=2))
    all_passed = all(r["running"] and r["dual_highlight"] and r["lime_green_border"] and r["scopeActive"] for r in all_labs_results)
    print(f"\nALL 22 LABS SIMULATION EXECUTION PASSED: {all_passed} ({sum(1 for r in all_labs_results if r['running'] and r['dual_highlight'])}/22)")

    # Capture Servo Simulation Running
    eval_js("window.switchLab('servo', true);")
    time.sleep(0.5)
    eval_js("document.getElementById('btn-simulate').click();")
    time.sleep(1.0)
    shot_servo = session.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/simulation_working_verified.png", "wb") as f:
        f.write(base64.b64decode(shot_servo["data"]))

    # Capture Motor Simulation Running
    eval_js("window.switchLab('motor', true);")
    time.sleep(0.5)
    eval_js("document.getElementById('btn-simulate').click();")
    time.sleep(1.0)
    shot_motor = session.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/motor_lab_verified.png", "wb") as f:
        f.write(base64.b64decode(shot_motor["data"]))

    art_dir = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310"
    shutil.copy("scratch/simulation_working_verified.png", os.path.join(art_dir, "simulation_working_verified.png"))
    shutil.copy("scratch/motor_lab_verified.png", os.path.join(art_dir, "motor_lab_verified.png"))
    print("Updated screenshot artifacts successfully!")

finally:
    proc.terminate()
    proc.wait()
