# -*- coding: utf-8 -*-
"""
End-to-End Automated Verification for Sparky AI Coach in SparkByte Studio v2
Runs live in Headless Chrome via Chrome DevTools Protocol.
Tests:
1. Bottom Dock tab switching (Oscilloscope, Serial Monitor, Sparky AI Coach)
2. One-click diagnostic queries ("Why isn't my circuit working?", "Explain this code line-by-line", "Safe experiment ideas", "Explain in Hindi (हिंदी)")
3. Deterministic AST / syntax mistake detection (missing semicolon, unbalanced braces)
4. Hardware pin & wiring mismatch detection
5. Live sensor threshold mismatch detection (LDR threshold vs live slider)
6. Settings popover UI & provider selection
7. Zero console / runtime errors check
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
cdp_port = 9548

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1440,900"
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

    # Wait for workbench store to load
    ready = False
    for _ in range(30):
        val = session.evaluate("typeof window.useWorkbenchStore !== 'undefined'")
        if val:
            ready = True
            break
        time.sleep(0.5)

    if not ready:
        print("FAIL: window.useWorkbenchStore did not become available.")
        sys.exit(1)

    print("================================================================")
    print("   SPARKY AI COACH - FUNCTIONAL & SOCRATIC VERIFICATION AUDIT    ")
    print("================================================================")

    test_results = {}

    # ──────────────────────────────────────────────────────────────────
    # TEST 1: Bottom Dock Tab Switching
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 1] Workbench Bottom Dock Tab Switching")
    # Switch to 'coach'
    session.evaluate("window.useWorkbenchStore.getState().setActiveDockTab('coach');")
    time.sleep(0.3)
    tab1 = session.evaluate("window.useWorkbenchStore.getState().activeDockTab")
    has_coach_header = session.evaluate("document.body.innerText.includes('Sparky AI Coach')")

    # Switch to 'serial'
    session.evaluate("window.useWorkbenchStore.getState().setActiveDockTab('serial');")
    time.sleep(0.2)
    tab2 = session.evaluate("window.useWorkbenchStore.getState().activeDockTab")
    has_serial_header = session.evaluate("document.body.innerText.includes('Serial Monitor')")

    # Switch to 'scope'
    session.evaluate("window.useWorkbenchStore.getState().setActiveDockTab('scope');")
    time.sleep(0.2)
    tab3 = session.evaluate("window.useWorkbenchStore.getState().activeDockTab")
    has_scope_header = session.evaluate("document.body.innerText.includes('Dual-Channel Oscilloscope')")

    # Switch back to 'coach'
    session.evaluate("window.useWorkbenchStore.getState().setActiveDockTab('coach');")
    time.sleep(0.2)

    test1_pass = (tab1 == 'coach' and has_coach_header and tab2 == 'serial' and has_serial_header and tab3 == 'scope' and has_scope_header)
    test_results["Test 1 (Dock Tab Switching)"] = {
        "pass": test1_pass,
        "detail": f"Coach Tab={has_coach_header}, Serial Tab={has_serial_header}, Scope Tab={has_scope_header}"
    }
    print(f"  -> Result: {'PASS' if test1_pass else 'FAIL'} | {test_results['Test 1 (Dock Tab Switching)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 2: Deterministic Diagnostic Engine (Direct Execution)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 2] Deterministic Circuit & AST Inspector - Rule Evaluation")
    
    # 2A: Syntax check: Missing Semicolon
    broken_code_semi = """void setup() {
    pinMode(13, OUTPUT)
}
void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}"""
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('led');")
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(broken_code_semi)});")
    time.sleep(0.3)

    # Trigger "Why isn't my circuit working?" in coach
    session.evaluate("""
        const chips = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes("Why isn't my circuit working"));
        if (chips.length > 0) chips[0].click();
    """)
    time.sleep(0.5)

    chat_text_semi = session.evaluate("document.body.innerText")
    has_semi_error = "Missing Semicolon" in chat_text_semi or "terminating semicolon" in chat_text_semi
    print(f"  -> 2A. Missing Semicolon Detection: {'PASS' if has_semi_error else 'FAIL'}")

    # 2B: Hardware Pin Mismatch Check: LED on Pin 12 instead of 13
    pin_mismatch_code = """void setup() {
    pinMode(12, OUTPUT);
}
void loop() {
    digitalWrite(12, HIGH);
    delay(1000);
}"""
    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(pin_mismatch_code)});")
    time.sleep(0.3)
    session.evaluate("""
        const chips = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes("Why isn't my circuit working"));
        if (chips.length > 0) chips[0].click();
    """)
    time.sleep(0.5)

    chat_text_pin = session.evaluate("document.body.innerText")
    has_pin_mismatch = "Wrong Pin for LED (Pin 12)" in chat_text_pin or "Pin 13" in chat_text_pin
    print(f"  -> 2B. Pin Mismatch Detection: {'PASS' if has_pin_mismatch else 'FAIL'}")

    # 2C: Live Sensor Threshold Mismatch: LDR Lab at 600 Lux with threshold 400
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('ldr');")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    session.evaluate("window.useWorkbenchStore.getState().updateHardwareState({ ldrRaw: 600 });")
    time.sleep(0.3)

    session.evaluate("""
        (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Why isn't my circuit working"));
            if (btn) btn.click();
        })()
    """)
    time.sleep(1.0)

    chat_text_thresh = session.evaluate("""
        (() => {
            const bubbles = Array.from(document.querySelectorAll('.rounded-xl'));
            return bubbles.length > 0 ? bubbles[bubbles.length - 1].innerText : "";
        })()
    """)
    has_thresh_mismatch = "Light Threshold Not Met" in chat_text_thresh or "600 Lux" in chat_text_thresh
    print(f"  -> 2C. Threshold Mismatch Detection: {'PASS' if has_thresh_mismatch else 'FAIL'}")

    test2_pass = has_semi_error and has_pin_mismatch and has_thresh_mismatch
    test_results["Test 2 (Deterministic Diagnostic Inspector)"] = {
        "pass": test2_pass,
        "detail": f"Missing Semi={has_semi_error}, Pin Mismatch={has_pin_mismatch}, Threshold Mismatch={has_thresh_mismatch}"
    }

    # ──────────────────────────────────────────────────────────────────
    # TEST 3: One-Click Quick Chips (Explain Line-by-Line & Hindi)
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 3] Socratic Pedagogy Chips (Line-by-Line & Hindi)")
    
    # 3A: Line-by-Line Breakdown
    session.evaluate("""
        (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Explain code line-by-line"));
            if (btn) btn.click();
        })()
    """)
    time.sleep(1.0)
    chat_text_lbl = session.evaluate("""
        (() => {
            const bubbles = Array.from(document.querySelectorAll('.rounded-xl'));
            return bubbles.length > 0 ? bubbles[bubbles.length - 1].innerText : "";
        })()
    """)
    has_lbl = "Line-by-Line Code Breakdown" in chat_text_lbl or "Plain English:" in chat_text_lbl
    print(f"  -> 3A. Line-by-Line Breakdown: {'PASS' if has_lbl else 'FAIL'}")

    # 3B: Safe Experiment Ideas
    session.evaluate("""
        (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Safe experiment ideas"));
            if (btn) btn.click();
        })()
    """)
    time.sleep(1.0)
    chat_text_exp = session.evaluate("""
        (() => {
            const bubbles = Array.from(document.querySelectorAll('.rounded-xl'));
            return bubbles.length > 0 ? bubbles[bubbles.length - 1].innerText : "";
        })()
    """)
    has_exp = "Safe Parameter Experiments" in chat_text_exp
    print(f"  -> 3B. Safe Parameter Experiments: {'PASS' if has_exp else 'FAIL'}")

    # 3C: Hindi Explanation
    session.evaluate("""
        (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Explain in Hindi"));
            if (btn) btn.click();
        })()
    """)
    time.sleep(1.0)
    chat_text_hindi = session.evaluate("""
        (() => {
            const bubbles = Array.from(document.querySelectorAll('.rounded-xl'));
            return bubbles.length > 0 ? bubbles[bubbles.length - 1].innerText : "";
        })()
    """)
    has_hindi = "हिंदी गाइड" in chat_text_hindi or "नमस्ते" in chat_text_hindi
    print(f"  -> 3C. Hindi (हिंदी) Translation: {'PASS' if has_hindi else 'FAIL'}")

    test3_pass = has_lbl and has_exp and has_hindi
    test_results["Test 3 (Pedagogical Quick Chips)"] = {
        "pass": test3_pass,
        "detail": f"Line-by-Line={has_lbl}, Experiments={has_exp}, Hindi={has_hindi}"
    }

    # ──────────────────────────────────────────────────────────────────
    # TEST 4: Settings Popover & BYOK UI
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 4] Settings Popover & BYOK Architecture")
    # Click settings gear
    session.evaluate("""
        const gear = document.querySelector('button[title*=\"Gemini API Key\"]');
        if (gear) gear.click();
    """)
    time.sleep(0.3)

    settings_text = session.evaluate("document.body.innerText")
    has_settings_title = "Sparky AI Coach Configuration" in settings_text
    has_provider_opt = "Google Gemini API" in settings_text
    has_socratic_opt = "Socratic Guidance Mode" in settings_text

    test4_pass = has_settings_title and has_provider_opt and has_socratic_opt
    test_results["Test 4 (Settings Popover & BYOK UI)"] = {
        "pass": test4_pass,
        "detail": f"Title={has_settings_title}, Provider Selection={has_provider_opt}, Socratic Mode={has_socratic_opt}"
    }
    print(f"  -> Result: {'PASS' if test4_pass else 'FAIL'} | {test_results['Test 4 (Settings Popover & BYOK UI)']['detail']}")

    # ──────────────────────────────────────────────────────────────────
    # TEST 5: Console & Runtime Errors
    # ──────────────────────────────────────────────────────────────────
    print("\n[TEST 5] Console & Runtime Diagnostics")
    real_console_errors = [e for e in session.console_logs if "favicon" not in e and "warn" not in e.lower()]
    print(f"  Console Errors: {len(real_console_errors)}")
    print(f"  Page Exceptions: {len(session.page_errors)}")

    test5_pass = len(real_console_errors) == 0 and len(session.page_errors) == 0
    test_results["Test 5 (Console Cleanliness)"] = {
        "pass": test5_pass,
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

    with open("scratch/ai_coach_verification_summary.json", "w", encoding="utf-8") as f:
        json.dump({
            "test_results": test_results,
            "all_passed": all_passed,
            "console_errors": real_console_errors,
            "page_errors": session.page_errors
        }, f, indent=2)

finally:
    proc.terminate()
