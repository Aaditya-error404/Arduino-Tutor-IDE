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

cdp_port = 9367
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

    # 1. Check Boot Errors
    boot_err = cdp.eval("window.__bootError")
    print(f"[TEST 1] Boot Error: {boot_err}")
    assert boot_err is None, f"Boot Error detected: {boot_err}"

    # 2. Check Redesigned Header Elements
    header_check = cdp.eval("""(() => {
        return {
            hasExplorerBtn: !!document.getElementById('open-lab-explorer-btn'),
            activeLabTitle: document.getElementById('active-lab-name-pill')?.textContent,
            currentLabLabel: document.getElementById('current-lab-label')?.textContent,
            gradeBtnCount: document.querySelectorAll('.grade-tab-btn').length,
            labBtnCount: document.querySelectorAll('.lab-switch-btn').length,
            stepIndicator: document.getElementById('lesson-step-indicator')?.textContent,
            hasProgressBar: !!document.getElementById('lesson-progress-bar'),
            hasStepAdvanceCard: !!document.getElementById('step-advance-card')
        };
    })()""")
    print(f"[TEST 2] Header Elements: {json.dumps(header_check, indent=2)}")
    assert header_check['hasExplorerBtn'], "Missing open-lab-explorer-btn"
    assert header_check['labBtnCount'] == 22, f"Expected 22 lab buttons, got {header_check['labBtnCount']}"
    assert header_check['hasStepAdvanceCard'], "Missing step-advance-card"

    # Screenshot 1: Redesigned Workspace
    shot1 = cdp.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/redesigned_ui_workspace.png", "wb") as f:
        f.write(base64.b64decode(shot1["result"]["data"]))
    print("Saved scratch/redesigned_ui_workspace.png")

    # 3. Test Grade Band Quick Filter (Grades 6-8 -> 7 visible)
    filter_test = cdp.eval("""(() => {
        const btn68 = document.getElementById('grade-btn-68');
        btn68.click();
        const visible = Array.from(document.querySelectorAll('.lab-switch-btn')).filter(b => !b.classList.contains('grade-hidden'));
        return {
            visibleCount: visible.length,
            visibleLabs: visible.map(b => b.getAttribute('data-lab'))
        };
    })()""")
    print(f"[TEST 3] Grade 6-8 Filter: {json.dumps(filter_test)}")
    assert filter_test['visibleCount'] == 7, f"Expected 7 labs for 6-8, got {filter_test['visibleCount']}"

    # 4. Test Lab Explorer Modal
    explorer_open = cdp.eval("""(() => {
        document.getElementById('open-lab-explorer-btn').click();
        const modal = document.getElementById('lab-explorer-modal');
        const cardCount = document.querySelectorAll('.explorer-lab-card').length;
        return {
            modalVisible: !modal.classList.contains('hidden'),
            cardCount: cardCount
        };
    })()""")
    print(f"[TEST 4] Lab Explorer Open: {json.dumps(explorer_open)}")
    assert explorer_open['modalVisible'], "Lab Explorer modal did not open"
    assert explorer_open['cardCount'] == 22, f"Expected 22 explorer cards, got {explorer_open['cardCount']}"

    time.sleep(0.5)
    # Screenshot 2: Lab Explorer Modal
    shot2 = cdp.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/redesigned_ui_lab_explorer_modal.png", "wb") as f:
        f.write(base64.b64decode(shot2["result"]["data"]))
    print("Saved scratch/redesigned_ui_lab_explorer_modal.png")

    # 5. Test Search inside Explorer (Search 'sonar' -> 1 card -> click -> lab switch)
    search_and_switch = cdp.eval("""(() => {
        const searchInput = document.getElementById('lab-search-input');
        searchInput.value = 'sonar';
        searchInput.dispatchEvent(new Event('input'));
        const visibleCards = document.querySelectorAll('.explorer-lab-card');
        const firstCard = visibleCards[0];
        const cardTitle = firstCard?.querySelector('.explorer-card-title')?.textContent;
        // Click card
        firstCard.click();
        const modal = document.getElementById('lab-explorer-modal');
        return {
            matchedCards: visibleCards.length,
            matchedTitle: cardTitle,
            modalClosed: modal.classList.contains('hidden'),
            newActiveLab: document.getElementById('active-lab-name-pill')?.textContent
        };
    })()""")
    print(f"[TEST 5] Explorer Search & Switch: {json.dumps(search_and_switch)}")
    assert search_and_switch['modalClosed'], "Modal should close on card click"
    assert "Sonar" in search_and_switch['newActiveLab'] or "Radar" in search_and_switch['newActiveLab'] or "Ultrasonic" in search_and_switch['newActiveLab'], f"Active lab was not updated to sonar: {search_and_switch['newActiveLab']}"

    time.sleep(1.0)

    # 6. Test Stepper & Step Advancement
    stepper_test = cdp.eval("""(() => {
        const nextBtn = document.getElementById('next-lesson-btn');
        const prevBtn = document.getElementById('prev-lesson-btn');
        const step1Text = document.getElementById('lesson-step-indicator')?.textContent;
        const progress1 = document.getElementById('lesson-progress-bar')?.style.width;

        // Click next lesson
        nextBtn.click();

        const step2Text = document.getElementById('lesson-step-indicator')?.textContent;
        const progress2 = document.getElementById('lesson-progress-bar')?.style.width;
        const prevEnabled = !prevBtn.disabled;

        // Click advance card button
        const advanceBtn = document.getElementById('btn-advance-step');
        advanceBtn.click();

        const step3Text = document.getElementById('lesson-step-indicator')?.textContent;
        const progress3 = document.getElementById('lesson-progress-bar')?.style.width;

        return {
            step1Text, progress1,
            step2Text, progress2, prevEnabled,
            step3Text, progress3
        };
    })()""")
    print(f"[TEST 6] Stepper & Advance Test: {json.dumps(stepper_test)}")
    assert stepper_test['step2Text'] == "Step 2 of 4", f"Step 2 mismatch: {stepper_test['step2Text']}"
    assert stepper_test['step3Text'] == "Step 3 of 4", f"Step 3 mismatch: {stepper_test['step3Text']}"
    assert stepper_test['prevEnabled'], "Prev button should be enabled on Step 2"

    time.sleep(0.5)
    # Screenshot 3: Stepper Active
    shot3 = cdp.call("Page.captureScreenshot", {"format": "png"})
    with open("scratch/redesigned_ui_stepper_active.png", "wb") as f:
        f.write(base64.b64decode(shot3["result"]["data"]))
    print("Saved scratch/redesigned_ui_stepper_active.png")

    print("\n✅ ALL 6 UI REDESIGN TESTS PASSED PERFECTLY!")

    cdp.close()
finally:
    proc.terminate()
