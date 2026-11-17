# -*- coding: utf-8 -*-
import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9385

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

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    def capture_screenshot(self, filename):
        res = self.call("Page.captureScreenshot", {"format": "png"})
        data = res.get("data")
        if data:
            with open(filename, "wb") as f:
                f.write(base64.b64decode(data))
            print(f"Captured screenshot: {filename}", flush=True)

    def close(self):
        self.sock.close()

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json/list").read())
    page_tab = next(t for t in tabs if t.get("type") == "page")
    cdp = CDPSession(page_tab["webSocketDebuggerUrl"])
    cdp.call("Page.enable")

    print("[TEST 1] Loading http://localhost:8080/?lab=servo ...", flush=True)
    cdp.call("Page.navigate", {"url": "http://localhost:8080/?lab=servo"})
    time.sleep(2.0)

    # 1. Check Boot & Top Bar Dimensions
    res1 = cdp.evaluate("""(() => {
        return {
            bootError: window.__bootError || null,
            headerHeight: document.querySelector('.app-header')?.offsetHeight,
            activeLabPill: document.getElementById('active-lab-name-pill')?.textContent.trim(),
            stepIndicator: document.getElementById('lesson-step-indicator')?.textContent.trim(),
            stepperTabsCount: document.querySelectorAll('#lesson-nav-tabs .lesson-tab').length,
            panelLessonWidth: document.querySelector('.panel-lesson')?.offsetWidth,
            panelSimWidth: document.querySelector('.panel-simulation')?.offsetWidth,
            simBtnExists: !!document.getElementById('btn-simulate'),
            scopeCanvasExists: !!document.getElementById('scope-canvas')
        };
    })()""")
    print("[TEST 1 Result]:", json.dumps(res1, indent=2), flush=True)
    assert res1['bootError'] is None, f"Boot error: {res1['bootError']}"
    assert res1['headerHeight'] == 52, f"Expected 52px, got {res1['headerHeight']}"
    assert res1['stepperTabsCount'] == 4
    print("PASS: Slim 52px top bar and balanced workspace verified!", flush=True)

    cdp.capture_screenshot("scratch/redesigned_ui_workspace.png")

    # 2. Stepper Navigation
    print("\n[TEST 2] Testing Stepper Advancement (Step 1 -> Step 2) ...", flush=True)
    res2 = cdp.evaluate("""(() => {
        const nextBtn = document.getElementById('next-lesson-btn');
        nextBtn.click();
        return {
            stepIndicator: document.getElementById('lesson-step-indicator')?.textContent.trim(),
            progressBarWidth: document.getElementById('lesson-progress-bar')?.style.width,
            prevDisabled: document.getElementById('prev-lesson-btn')?.disabled,
            lessonTitle: document.getElementById('lesson-title')?.textContent.trim()
        };
    })()""")
    print("[TEST 2 Result]:", json.dumps(res2, indent=2), flush=True)
    assert "Step 2" in res2['stepIndicator']
    assert res2['progressBarWidth'] == "50%"
    assert res2['prevDisabled'] == False
    print("PASS: Stepper advanced to Step 2 with 50% progress!", flush=True)

    cdp.capture_screenshot("scratch/redesigned_ui_stepper_active.png")

    # 3. Lab Explorer Modal (Open, Count, Search, Switch)
    print("\n[TEST 3] Testing Lab Explorer Modal ...", flush=True)
    res3 = cdp.evaluate("""(() => {
        document.getElementById('open-lab-explorer-btn').click();
        const modal = document.getElementById('lab-explorer-modal');
        const isVisible = !modal.classList.contains('hidden');
        const cardsCount = document.querySelectorAll('.explorer-lab-card').length;
        return { isVisible, cardsCount };
    })()""")
    print("[TEST 3 Modal Open]:", json.dumps(res3), flush=True)
    assert res3['isVisible'] == True
    assert res3['cardsCount'] == 22

    cdp.capture_screenshot("scratch/redesigned_ui_lab_explorer_modal.png")

    # 4. Test Search in Modal
    print("\n[TEST 4] Testing Search in Modal ('sonar') ...", flush=True)
    res4 = cdp.evaluate("""(() => {
        const input = document.getElementById('lab-search-input');
        input.value = 'sonar';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const cards = document.querySelectorAll('.explorer-lab-card');
        return {
            cardsCount: cards.length,
            firstCardTitle: cards[0]?.querySelector('.explorer-card-title')?.textContent.trim()
        };
    })()""")
    print("[TEST 4 Search Result]:", json.dumps(res4), flush=True)
    assert res4['cardsCount'] == 1

    # 5. Click Sonar Card
    print("\n[TEST 5] Clicking Sonar Card to Switch Lab ...", flush=True)
    res5 = cdp.evaluate("""(() => {
        const card = document.querySelector('.explorer-lab-card');
        card.click();
        return {
            modalHidden: document.getElementById('lab-explorer-modal').classList.contains('hidden'),
            activeLab: window.circuitSimulation.activeLab,
            pillText: document.getElementById('active-lab-name-pill')?.textContent.trim()
        };
    })()""")
    print("[TEST 5 Switch Result]:", json.dumps(res5), flush=True)
    assert res5['modalHidden'] == True
    assert res5['activeLab'] == 'sonar'

    # 6. Master Smoke Test across all 22 Labs
    print("\n[TEST 6] Running Master Smoke Test across all 22 labs ...", flush=True)
    all_labs = [
        "led", "servo", "button", "pot", "buzzer", "cad", "dmm",
        "ldr", "rgb", "temp", "sonar", "ir", "slicer", "dht", "gas",
        "lcd", "oled", "soil", "motor", "imu", "rfid", "iot"
    ]
    for idx, lab in enumerate(all_labs, 1):
        cdp.evaluate(f"window.switchLab('{lab}', true);")
        time.sleep(0.12)
        check = cdp.evaluate(f"""(() => {{
            const curLab = window.circuitSimulation ? window.circuitSimulation.activeLab : null;
            const viewEl = document.getElementById('{lab}-circuit-view');
            const viewVis = viewEl ? (viewEl.style.display !== 'none') : false;
            const tabs = document.querySelectorAll('#lesson-nav-tabs .lesson-tab').length;
            return {{ curLab, viewVis, tabs, err: window.__bootError || null }};
        }})()""")
        assert check['curLab'] == lab, f"Lab {lab} not active"
        assert check['tabs'] == 4, f"Lab {lab} has {check['tabs']} tabs instead of 4"
        assert check['err'] is None, f"Lab {lab} generated boot error: {check['err']}"
        print(f"  [{idx:02d}/22] Lab '{lab}': OK (View={'VIS' if check['viewVis'] else 'HID'}, 4 Tabs)", flush=True)

    print("\nALL 6 TESTS PASSED WITH 100% SUCCESS!", flush=True)

    cdp.close()
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
