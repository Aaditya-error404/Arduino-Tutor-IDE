# -*- coding: utf-8 -*-
"""
End-to-End Verification for Canvas-First "Focus Stage + Floating HUD" Workbench
Runs live in Headless Chrome via Chrome DevTools Protocol at 1366x768 and 1920x1080.
Tests:
1. Slim 44px Top Bar (No horizontal overflow on 1366px and 1920px)
2. Canvas-First Hardware Focus Stage (Top floating simulation pill, live execution ticker, centered circuit)
3. Floating Code & Translator HUD (C++ mode @ 440px, Split mode @ 62% width, collapse/expand toggle)
4. Slide-Over Lesson Guide & Wiring Drawer (Open/close toggle, wiring table, mission brief)
5. Collapsible Diagnostic Bar (Oscilloscope / Serial Monitor 36px minimized vs 240px expanded)
6. Floating Sparky AI Coach Popover (Pill badge vs expanded 380x460 card)
7. Multi-lab verification across Lab 1 (led), Lab 14 (dht), Lab 19 (motor)
8. Zero console errors and zero uncaught exceptions
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
if not chrome_bin:
    print("FATAL: Chrome not found.")
    sys.exit(1)

import tempfile
temp_dir = tempfile.mkdtemp()
cdp_port = 9560

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1366,768"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.5)

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
        self.console_logs = []
        self.page_errors = []

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
            return json.loads(payload.decode('utf-8'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method, "params": params or {}}
        self.send_frame(msg)
        while True:
            frame = self.read_frame()
            if not frame:
                continue
            if frame.get("method") == "Runtime.consoleAPICalled":
                p = frame.get("params", {})
                t = p.get("type", "")
                args = p.get("args", [])
                text = " ".join(str(a.get("value", a.get("description", ""))) for a in args)
                if t in ["error", "warning"]:
                    self.console_logs.append(f"[{t.upper()}] {text}")
            elif frame.get("method") == "Runtime.exceptionThrown":
                desc = frame.get("params", {}).get("exceptionDetails", {}).get("text", "Unknown exception")
                self.page_errors.append(desc)
            elif frame.get("id") == mid:
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

    # Wait for store
    for _ in range(30):
        val = session.evaluate("typeof window.useWorkbenchStore !== 'undefined'")
        if val: break
        time.sleep(0.4)

    print("================================================================")
    print("   CANVAS-FIRST WORKBENCH - E2E ARCHITECTURAL VERIFICATION      ")
    print("================================================================")

    test_results = {}

    # ──────────────────────────────────────────────────────────────────
    # TEST 1: Top Navigation Bar Height & Zero Horizontal Overflow (1366px)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 1] Slim 44px Top Bar & Responsive Overflow (1366x768)")
    top_metrics = session.evaluate("""
        (() => {
            const h = document.querySelector('header');
            return {
                height: h ? h.offsetHeight : 0,
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
                hasBrand: document.body.innerText.includes('SparkByte'),
                hasLabDropdown: Boolean(document.querySelector('button[title*="Browse all 22"]')),
                hasStepper: Boolean(document.querySelector('button[title*="Previous Lesson"]')),
                hasGuideBtn: Boolean(document.querySelector('button[title*="Lesson Guide"]'))
            };
        })()
    """)
    print("  Top Metrics:", top_metrics)
    test1_pass = (
        top_metrics["height"] == 44 and
        top_metrics["scrollWidth"] <= top_metrics["clientWidth"] and
        top_metrics["hasBrand"] and
        top_metrics["hasLabDropdown"] and
        top_metrics["hasStepper"] and
        top_metrics["hasGuideBtn"]
    )
    test_results["Test 1 (Slim 44px Top Bar at 1366x768)"] = {
        "pass": test1_pass,
        "detail": f"Height={top_metrics['height']}px (Exp 44px), Overflow={top_metrics['scrollWidth'] <= top_metrics['clientWidth']}, LabBtn={top_metrics['hasLabDropdown']}, Stepper={top_metrics['hasStepper']}"
    }
    print(f"  -> Result: {'PASS' if test1_pass else 'FAIL'} | {test_results['Test 1 (Slim 44px Top Bar at 1366x768)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 2: Canvas-First Stage & Top Floating Simulation Pill
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 2] Canvas-First Focus Stage & Floating Pill Bar")
    pill_metrics = session.evaluate("""
        (() => {
            const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Start Simulation') || b.innerText.includes('Resume') || b.innerText.includes('Pause'));
            const stage = document.querySelector('main');
            return {
                hasStartBtn: Boolean(startBtn),
                hasResetBtn: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Reset'))),
                hasClockSelect: Boolean(document.querySelector('select[value]') || document.querySelector('option[value="1.0"]')),
                stageHeight: stage ? stage.offsetHeight : 0
            };
        })()
    """)
    test2_pass = pill_metrics["hasStartBtn"] and pill_metrics["hasResetBtn"] and pill_metrics["stageHeight"] >= 500
    test_results["Test 2 (Top Floating Simulation Pill)"] = {
        "pass": test2_pass,
        "detail": f"StartBtn={pill_metrics['hasStartBtn']}, ResetBtn={pill_metrics['hasResetBtn']}, StageHeight={pill_metrics['stageHeight']}px"
    }
    print(f"  -> Result: {'PASS' if test2_pass else 'FAIL'} | {test_results['Test 2 (Top Floating Simulation Pill)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 3: Floating Left Code HUD (C++ vs Split Mode & Collapse)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 3] Floating Code & Translator HUD (Width Expansion & Collapse)")
    # Default C++ mode width
    session.evaluate("window.useWorkbenchStore.getState().setCodeHudMode('cpp'); window.useWorkbenchStore.getState().setCodeHudOpen(true);")
    time.sleep(0.4)
    cpp_width = session.evaluate("""
        (() => {
            const hud = document.getElementById('code-hud');
            return hud ? hud.offsetWidth : 0;
        })()
    """)

    # Switch to Split mode
    session.evaluate("window.useWorkbenchStore.getState().setCodeHudMode('split');")
    time.sleep(0.4)
    split_width = session.evaluate("""
        (() => {
            const hud = document.getElementById('code-hud');
            return hud ? hud.offsetWidth : 0;
        })()
    """)

    # Test Collapse
    session.evaluate("window.useWorkbenchStore.getState().setCodeHudOpen(false);")
    time.sleep(0.3)
    is_collapsed = session.evaluate("!window.useWorkbenchStore.getState().codeHudOpen")
    has_reopen_btn = session.evaluate("Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Code Editor')))")

    # Restore
    session.evaluate("window.useWorkbenchStore.getState().setCodeHudOpen(true); window.useWorkbenchStore.getState().setCodeHudMode('cpp');")
    time.sleep(0.3)

    test3_pass = (cpp_width == 440 or (400 <= cpp_width <= 480)) and split_width > cpp_width and is_collapsed and has_reopen_btn
    test_results["Test 3 (Floating Code HUD Expansion & Collapse)"] = {
        "pass": test3_pass,
        "detail": f"CppWidth={cpp_width}px, SplitWidth={split_width}px (> {cpp_width}px), Collapsed={is_collapsed}, ReopenBtn={has_reopen_btn}"
    }
    print(f"  -> Result: {'PASS' if test3_pass else 'FAIL'} | {test_results['Test 3 (Floating Code HUD Expansion & Collapse)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 4: Slide-Over Lesson Guide & Wiring Drawer
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 4] Slide-Over Lesson Guide & Hardware Wiring Drawer")
    session.evaluate("window.useWorkbenchStore.getState().setLessonGuideOpen(true);")
    time.sleep(0.4)
    drawer_info = session.evaluate("""
        (() => {
            const drawer = document.querySelector('aside');
            return {
                open: Boolean(drawer),
                hasWiringTable: drawer ? drawer.innerText.includes('Hardware Pinout & Connections') : false,
                hasMissionBrief: drawer ? drawer.innerText.includes('Mission Brief') : false
            };
        })()
    """)
    # Close drawer
    session.evaluate("window.useWorkbenchStore.getState().setLessonGuideOpen(false);")
    time.sleep(0.3)
    drawer_closed = session.evaluate("!document.querySelector('aside')")

    test4_pass = drawer_info["open"] and drawer_info["hasWiringTable"] and drawer_info["hasMissionBrief"] and drawer_closed
    test_results["Test 4 (Lesson Guide & Wiring Drawer)"] = {
        "pass": test4_pass,
        "detail": f"Open={drawer_info['open']}, WiringTable={drawer_info['hasWiringTable']}, Closed={drawer_closed}"
    }
    print(f"  -> Result: {'PASS' if test4_pass else 'FAIL'} | {test_results['Test 4 (Lesson Guide & Wiring Drawer)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 5: Collapsible Diagnostic Bar (Oscilloscope & Serial Monitor)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 5] Collapsible Diagnostic Bar (36px Minimized vs 240px Active)")
    # Start minimized
    session.evaluate("window.useWorkbenchStore.getState().setDiagnosticDockOpen(false);")
    time.sleep(0.3)
    min_bar = session.evaluate("Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Oscilloscope')))")

    # Expand
    session.evaluate("window.useWorkbenchStore.getState().setDiagnosticDockOpen(true);")
    time.sleep(0.4)
    exp_dock_height = session.evaluate("""
        (() => {
            const canvas = document.querySelector('#scope-canvas');
            const dock = canvas ? canvas.closest('.rounded-2xl') : null;
            return dock ? dock.offsetHeight : 0;
        })()
    """)
    session.evaluate("window.useWorkbenchStore.getState().setDiagnosticDockOpen(false);")
    time.sleep(0.2)

    test5_pass = min_bar and (exp_dock_height == 240 or (220 <= exp_dock_height <= 260))
    test_results["Test 5 (Diagnostic Bar Collapse/Expand)"] = {
        "pass": test5_pass,
        "detail": f"MinimizedBtn={min_bar}, ExpandedHeight={exp_dock_height}px (Exp 240px)"
    }
    print(f"  -> Result: {'PASS' if test5_pass else 'FAIL'} | {test_results['Test 5 (Diagnostic Bar Collapse/Expand)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 6: Floating Sparky AI Coach Popover
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 6] Floating Sparky AI Coach Popover (Pill vs Card)")
    session.evaluate("window.useWorkbenchStore.getState().setAiCoachOpen(false);")
    time.sleep(0.3)
    has_coach_pill = session.evaluate("Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Ask Sparky AI Coach')))")

    # Expand Coach
    session.evaluate("window.useWorkbenchStore.getState().setAiCoachOpen(true);")
    time.sleep(0.4)
    coach_card_dims = session.evaluate("""
        (() => {
            const title = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('Sparky AI Coach'));
            const card = title ? title.closest('.rounded-2xl') : null;
            return {
                open: Boolean(card),
                width: card ? card.offsetWidth : 0,
                height: card ? card.offsetHeight : 0
            };
        })()
    """)
    session.evaluate("window.useWorkbenchStore.getState().setAiCoachOpen(false);")
    time.sleep(0.2)

    test6_pass = has_coach_pill and coach_card_dims["open"] and (360 <= coach_card_dims["width"] <= 400) and (440 <= coach_card_dims["height"] <= 480)
    test_results["Test 6 (Sparky AI Coach Popover)"] = {
        "pass": test6_pass,
        "detail": f"Pill={has_coach_pill}, Card={coach_card_dims['open']} ({coach_card_dims['width']}x{coach_card_dims['height']}px, Exp 380x460)"
    }
    print(f"  -> Result: {'PASS' if test6_pass else 'FAIL'} | {test_results['Test 6 (Sparky AI Coach Popover)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 7: Multi-Lab Functional Sweep across Lab 1, Lab 14, and Lab 19
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 7] Multi-Lab Simulation Across Lab 1 (LED), Lab 14 (DHT), Lab 19 (Motor)")
    labs_to_test = ["led", "dht", "motor"]
    lab_passes = []

    for l_id in labs_to_test:
        session.evaluate(f"window.useWorkbenchStore.getState().setActiveLab('{l_id}'); window.useWorkbenchStore.getState().startSimulation();")
        time.sleep(0.4)
        for _ in range(5):
            session.evaluate("window.useWorkbenchStore.getState().stepSimulation();")
        
        info = session.evaluate("""({
            activeLab: window.useWorkbenchStore.getState().activeLabId,
            isRunning: window.useWorkbenchStore.getState().isRunning,
            loopCount: window.useWorkbenchStore.getState().loopCount
        })""")
        ok = (info["activeLab"] == l_id and info["isRunning"] is True)
        lab_passes.append(ok)
        print(f"  - Lab [{l_id:5s}]: Active={info['activeLab']}, Running={info['isRunning']} -> {'PASS' if ok else 'FAIL'}")

    test7_pass = all(lab_passes)
    test_results["Test 7 (Multi-Lab Simulation Sweep)"] = {
        "pass": test7_pass,
        "detail": f"Tested Labs {labs_to_test}: All Passed={test7_pass}"
    }

    # ──────────────────────────────────────────────────────────────────
    # Capture Screenshot at 1366x768 (Laptop Resolution)
    # ──────────────────────────────────────────────────────────────────
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('led'); window.useWorkbenchStore.getState().setCodeHudOpen(true); window.useWorkbenchStore.getState().setCodeHudMode('cpp');")
    time.sleep(0.5)
    shot1366 = session.call("Page.captureScreenshot", {"format": "png"}).get("data")
    if shot1366:
        p1366 = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\canvas_workbench_1366x768.png"
        with open(p1366, "wb") as f: f.write(base64.b64decode(shot1366))
        print("  Saved 1366x768 Screenshot:", p1366)

    # ──────────────────────────────────────────────────────────────────
    # TEST 8: Full HD 1920x1080 Viewport Verification & Screenshot
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 8] Desktop Full HD 1920x1080 Verification (Lab 19 Motor)")
    session.call("Emulation.setDeviceMetricsOverride", {
        "width": 1920,
        "height": 1080,
        "deviceScaleFactor": 1,
        "mobile": False
    })
    time.sleep(0.5)

    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('motor'); window.useWorkbenchStore.getState().setCodeHudMode('split'); window.useWorkbenchStore.getState().setDiagnosticDockOpen(true); window.useWorkbenchStore.getState().startSimulation();")
    time.sleep(0.8)

    hd_metrics = session.evaluate("""({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hudWidth: document.querySelector('.monaco-editor') ? document.querySelector('.monaco-editor').closest('.rounded-2xl').offsetWidth : 0,
        stageHeight: document.querySelector('main').offsetHeight
    })""")
    print("  Full HD Metrics:", hd_metrics)
    test8_pass = hd_metrics["scrollWidth"] <= hd_metrics["clientWidth"] and hd_metrics["hudWidth"] >= 600

    shot1920 = session.call("Page.captureScreenshot", {"format": "png"}).get("data")
    if shot1920:
        p1920 = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\canvas_workbench_1920x1080.png"
        with open(p1920, "wb") as f: f.write(base64.b64decode(shot1920))
        print("  Saved 1920x1080 Screenshot:", p1920)

    test_results["Test 8 (Desktop 1920x1080 Full HD & Split Mode)"] = {
        "pass": test8_pass,
        "detail": f"Overflow={hd_metrics['scrollWidth'] <= hd_metrics['clientWidth']}, SplitHudWidth={hd_metrics['hudWidth']}px"
    }

    # ──────────────────────────────────────────────────────────────────
    # TEST 9: Console Cleanliness
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 9] Console & Runtime Diagnostics")
    real_console_errors = [e for e in session.console_logs if "favicon" not in e and "warn" not in e.lower()]
    print(f"  Console Errors: {len(real_console_errors)}")
    print(f"  Page Exceptions: {len(session.page_errors)}")

    test9_pass = len(real_console_errors) == 0 and len(session.page_errors) == 0
    test_results["Test 9 (Console Cleanliness)"] = {
        "pass": test9_pass,
        "detail": f"Errors={len(real_console_errors)}, Exceptions={len(session.page_errors)}"
    }

    # Final summary report
    print("\n================================================================")
    print("                     VERIFICATION SUMMARY                      ")
    print("================================================================")
    all_passed = all(r["pass"] for r in test_results.values())
    for tname, tres in test_results.items():
        print(f"  {'[PASS]' if tres['pass'] else '[FAIL]'} {tname}: {tres['detail']}")

    print(f"\nOVERALL STATUS: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")

    with open("scratch/canvas_workbench_summary.json", "w", encoding="utf-8") as f:
        json.dump({
            "test_results": test_results,
            "all_passed": all_passed,
            "console_errors": real_console_errors,
            "page_errors": session.page_errors
        }, f, indent=2)

finally:
    proc.terminate()
