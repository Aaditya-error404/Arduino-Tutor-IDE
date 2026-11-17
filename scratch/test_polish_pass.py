# -*- coding: utf-8 -*-
"""
Test Polish Pass for SparkByte Studio:
1. Top bar declutter & elements check
2. Emoji removal check (active lab pill, headers, explorer)
3. Code translator above-the-fold bounding rect
4. Hover & Execution highlight CSS styles check
5. Lab Explorer modal check
6. 22-lab master smoke test
7. Screenshots capture
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9390

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

    print("[POLISH TEST 1] Loading http://localhost:8080/?lab=servo ...", flush=True)
    cdp.call("Page.navigate", {"url": "http://localhost:8080/?lab=servo"})
    time.sleep(2.0)

    # 1. Top Bar Check & Emoji Check
    t1 = cdp.evaluate(r"""(() => {
        const topBar = document.querySelector('.app-header');
        const activePill = document.getElementById('active-lab-name-pill')?.textContent.trim();
        const utilGroup = document.querySelector('.header-util-group');
        const guideBtn = document.getElementById('teacher-modal-btn');
        const audioBtn = document.getElementById('audio-toggle');
        const resetBtn = document.getElementById('reset-btn');
        const gradeBtnsInDOM = document.querySelectorAll('.grade-tab-btn').length;
        const visibleGradeBar = document.querySelector('.app-header .header-inner .grade-filter-bar');

        const humanHeader = document.querySelector('.col-header.human')?.textContent.trim();
        const cppHeader = document.querySelector('.col-header.cpp')?.textContent.trim();
        const humanSvg = !!document.querySelector('.col-header.human svg');
        const cppSvg = !!document.querySelector('.col-header.cpp svg');

        return {
            bootError: window.__bootError || null,
            headerHeight: topBar?.offsetHeight,
            activePillText: activePill,
            hasEmojiInPill: /[\u{1F300}-\u{1F9FF}]/u.test(activePill),
            utilGroupExists: !!utilGroup,
            guideExists: !!guideBtn,
            audioExists: !!audioBtn,
            resetExists: !!resetBtn,
            gradeBtnsInDOMCount: gradeBtnsInDOM,
            visibleGradeBarInTopBar: !!visibleGradeBar,
            humanHeader: humanHeader,
            cppHeader: cppHeader,
            humanHasSvg: humanSvg,
            cppHasSvg: cppSvg
        };
    })()""")
    print("[POLISH TEST 1 Result]:", json.dumps(t1, indent=2), flush=True)
    assert t1['bootError'] is None
    assert t1['headerHeight'] == 52
    assert t1['hasEmojiInPill'] == False, "Active pill still contains emoji"
    assert t1['utilGroupExists'] == True
    assert t1['guideExists'] == True and t1['audioExists'] == True and t1['resetExists'] == True
    assert t1['gradeBtnsInDOMCount'] == 4, "DOM grade buttons count mismatch"
    assert t1['visibleGradeBarInTopBar'] == False, "Grade bar should be removed from visible top bar"
    assert t1['humanHasSvg'] == True and t1['cppHasSvg'] == True
    print("PASS: Top bar decluttered and Chrome emojis replaced with 1.5px vector SVGs!", flush=True)

    # 2. Check Above-the-Fold Code Translator Visibility
    t2 = cdp.evaluate("""(() => {
        const translator = document.querySelector('.code-translator-wrapper');
        const rect = translator?.getBoundingClientRect();
        const rows = document.querySelectorAll('.code-row');
        const rowDetails = Array.from(rows).slice(0, 8).map((r, i) => {
            const br = r.getBoundingClientRect();
            return { idx: i, top: br.top, bottom: br.bottom, height: br.height, text: r.textContent.trim().slice(0, 30) };
        });

        return {
            translatorTop: rect?.top,
            translatorBottom: rect?.bottom,
            translatorHeight: rect?.height,
            windowHeight: window.innerHeight,
            rowsCount: rows.length,
            rowDetails: rowDetails
        };
    })()""")
    print("[POLISH TEST 2 Above-The-Fold]:", json.dumps(t2, indent=2), flush=True)

    # 3. Check Hover & Execution Highlight Styles
    t3 = cdp.evaluate("""(() => {
        const row0 = document.querySelectorAll('.code-row')[0];
        const row1 = document.querySelectorAll('.code-row')[1];

        // Simulate hover on row0
        row0.classList.add('sync-hover');
        const hoverBorder = window.getComputedStyle(row0).borderLeftColor;
        const hoverBg = window.getComputedStyle(row0).backgroundColor;

        // Simulate execution on row1
        row1.classList.add('executing');
        const execBorder = window.getComputedStyle(row1).borderLeftColor;
        const execBg = window.getComputedStyle(row1).backgroundColor;

        return {
            hoverBorder: hoverBorder,
            hoverBg: hoverBg,
            execBorder: execBorder,
            execBg: execBg
        };
    })()""")
    print("[POLISH TEST 3 Highlight Styles]:", json.dumps(t3, indent=2), flush=True)
    # rgb(0, 102, 255) is #0066FF
    # rgb(101, 163, 13) is #65A30D
    assert "0, 102, 255" in t3['hoverBorder'], f"Hover border should be Electric Blue, got {t3['hoverBorder']}"
    assert "101, 163, 13" in t3['execBorder'], f"Exec border should be Lime Green, got {t3['execBorder']}"
    print("PASS: Line hover is Electric Blue and Simulation execution is Lime Green!", flush=True)

    # Capture polished workspace screenshot
    cdp.capture_screenshot("scratch/redesigned_ui_workspace.png")

    # 4. Lab Explorer Modal Check
    print("\n[POLISH TEST 4] Checking Lab Explorer Modal ...", flush=True)
    t4 = cdp.evaluate(r"""(() => {
        document.getElementById('open-lab-explorer-btn').click();
        const pills = Array.from(document.querySelectorAll('.explorer-grade-pill')).map(p => ({
            text: p.textContent.trim(),
            hasSvg: !!p.querySelector('svg'),
            hasEmoji: /[\u{1F300}-\u{1F9FF}]/u.test(p.textContent)
        }));
        const firstCardIcon = document.querySelector('.explorer-lab-card .explorer-card-icon');
        const firstCardHasSvg = !!firstCardIcon?.querySelector('svg');
        const firstCardHasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(firstCardIcon?.textContent || '');

        return {
            pills: pills,
            firstCardHasSvg: firstCardHasSvg,
            firstCardHasEmoji: firstCardHasEmoji
        };
    })()""")
    print("[POLISH TEST 4 Modal Results]:", json.dumps(t4, indent=2), flush=True)
    for p in t4['pills']:
        assert p['hasSvg'] == True, f"Pill {p['text']} missing SVG"
        assert p['hasEmoji'] == False, f"Pill {p['text']} contains emoji"
    assert t4['firstCardHasSvg'] == True, "Modal card icon should be SVG"
    assert t4['firstCardHasEmoji'] == False, "Modal card icon should not have emoji"
    print("PASS: Lab Explorer modal grade pills and cards use clean vector SVGs!", flush=True)

    cdp.capture_screenshot("scratch/redesigned_ui_lab_explorer_modal.png")

    # Close modal
    cdp.evaluate("document.getElementById('close-lab-explorer').click();")

    # 5. Master Smoke Test across all 22 labs
    print("\n[POLISH TEST 5] Running 22-lab master smoke test ...", flush=True)
    all_labs = [
        "led", "servo", "button", "pot", "buzzer", "cad", "dmm",
        "ldr", "rgb", "temp", "sonar", "ir", "slicer", "dht", "gas",
        "lcd", "oled", "soil", "motor", "imu", "rfid", "iot"
    ]
    for idx, lab in enumerate(all_labs, 1):
        cdp.evaluate(f"window.switchLab('{lab}', true);")
        time.sleep(0.1)
        check = cdp.evaluate(f"""(() => {{
            const curLab = window.circuitSimulation ? window.circuitSimulation.activeLab : null;
            const viewEl = document.getElementById('{lab}-circuit-view');
            const viewVis = viewEl ? (viewEl.style.display !== 'none') : false;
            const tabs = document.querySelectorAll('#lesson-nav-tabs .lesson-tab').length;
            return {{ curLab, viewVis, tabs, err: window.__bootError || null }};
        }})()""")
        assert check['curLab'] == lab
        assert check['tabs'] == 4
        assert check['err'] is None
        print(f"  [{idx:02d}/22] Lab '{lab}': PASS (4 Lessons)", flush=True)

    print("\nALL POLISH TESTS PASSED 100%!", flush=True)
    cdp.close()
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
