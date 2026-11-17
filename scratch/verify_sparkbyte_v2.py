# -*- coding: utf-8 -*-
"""
Verification Script for SparkByte Studio v2 (Vite + React + TypeScript):
- Tests initial render of DualCodeDesk, Monaco Editor, HardwareStage, Oscilloscope
- Tests simulation execution & servo animation
- Tests Lab Explorer modal & lab switching
- Captures full-resolution screenshot
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9455

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1440,900"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
            return json.loads(payload.decode('utf-8', errors='ignore'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        self.send_frame({"id": cid, "method": method, "params": params or {}})
        while True:
            resp = self.read_frame()
            if not resp:
                continue
            ev = resp.get("method")
            if ev == "Runtime.consoleAPICalled":
                p = resp.get("params", {})
                args = [a.get("value", a.get("description", "")) for a in p.get("args", [])]
                self.console_logs.append((p.get("type"), " ".join(str(x) for x in args)))
            elif ev == "Runtime.exceptionThrown":
                p = resp.get("params", {})
                exc = p.get("exceptionDetails", {})
                desc = exc.get("exception", {}).get("description", exc.get("text", "Unknown error"))
                self.page_errors.append(desc)
            elif resp.get("id") == cid:
                return resp.get("result", {})

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    session = CDPSession(ws_url)

    session.call("Runtime.enable")
    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})
    time.sleep(3.0)

    def eval_js(expr):
        res = session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    def capture_screenshot(filename):
        res = session.call("Page.captureScreenshot", {"format": "png"})
        if "data" in res:
            with open(filename, "wb") as f:
                f.write(base64.b64decode(res["data"]))
            print(f"  [SCREENSHOT] Saved: {filename}")

    print("==================================================")
    print("      SPARKBYTE STUDIO v2 LIVE VERIFICATION      ")
    print("==================================================")

    # 1. Check Initial Mounting & Elements
    mount_check = eval_js("""
    (() => {
        const topBar = document.querySelector('header');
        const monacoContainer = document.querySelector('.monaco-editor');
        const englishRows = document.querySelectorAll('.font-mono div');
        const hardwareStage = document.getElementById('servo-hardware-stage');
        const scopeCanvas = document.getElementById('scope-canvas');
        const simBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Simulation'));

        return {
            hasTopBar: !!topBar,
            hasMonaco: !!monacoContainer,
            englishRowsCount: englishRows.length,
            hasServoStage: !!hardwareStage,
            hasScopeCanvas: !!scopeCanvas,
            hasSimBtn: !!simBtn,
            simBtnText: simBtn ? simBtn.textContent.trim() : null
        };
    })()
    """)
    print("Mount Check:")
    print(json.dumps(mount_check, indent=2))

    # 2. Test Simulation Execution (Start -> Run -> Check Line Highlight -> Stop)
    print("\n--- Testing Live Simulation Stepping & Line Highlights ---")
    eval_js("""
    (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Simulation'));
        if (btn) btn.click();
    })()
    """)
    time.sleep(1.5) # Let simulation run through setup and into loop

    sim_state = eval_js("""
    (() => {
        try {
            const executingRows = document.querySelectorAll('[class*="border-lime-500"]');
            const monacoLine = document.querySelector('.monaco-executing-line, .monaco-executing-gutter');
            const loopBadge = document.querySelector('.text-sky-400.font-bold');
            const horn = document.getElementById('servo-horn-group');

            return {
                executingHumanLines: executingRows.length,
                hasMonacoHighlight: !!monacoLine,
                loopCyclesText: loopBadge ? loopBadge.textContent : null,
                hornTransform: horn ? horn.getAttribute('transform') : null
            };
        } catch(e) {
            return { error: e.toString() };
        }
    })()
    """)
    print("Simulation Running State:")
    print(json.dumps(sim_state, indent=2))

    # 3. Test Oscilloscope Waveform Active Rendering
    print("\n--- Validating Oscilloscope Real-Time Canvas ---")
    scope_data = eval_js("""
    (() => {
        const canvas = document.getElementById('scope-canvas');
        let nonZero = 0;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            for (let i = 3; i < data.length; i += 4) {
                if (data[i] > 0) nonZero++;
            }
        }
        return {
            canvasWidth: canvas ? canvas.width : 0,
            canvasHeight: canvas ? canvas.height : 0,
            activePixels: nonZero
        };
    })()
    """)
    print(f"Oscilloscope rendered with {scope_data['activePixels']} active pixels ({scope_data['canvasWidth']}x{scope_data['canvasHeight']})")

    # 4. Test Lab Explorer Modal
    print("\n--- Testing 22-Lab Explorer Modal ---")
    eval_js("""
    (() => {
        if (window.useWorkbenchStore) {
            window.useWorkbenchStore.getState().setExplorerModalOpen(true);
        }
    })()
    """)
    time.sleep(0.5) # Wait for React state commit & re-render
    
    modal_test = eval_js("""
    (() => {
        const modal = document.querySelector('input[placeholder*="Search sensors"]');
        const labCards = document.querySelectorAll('.animate-in .grid > div, .animate-in .cursor-pointer');
        return {
            modalOpened: !!modal,
            visibleLabCardsCount: labCards.length
        };
    })()
    """)
    print("Modal Opened:", modal_test)

    # Capture Modal Screenshot
    modal_img = os.path.abspath(r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\sparkbyte_v2_modal_verified.png")
    capture_screenshot(modal_img)

    # Close modal
    eval_js("""
    (() => {
        if (window.useWorkbenchStore) {
            window.useWorkbenchStore.getState().setExplorerModalOpen(false);
        }
    })()
    """)
    time.sleep(0.5)

    # 5. Capture Main Verified Workbench Screenshot
    artifact_img = os.path.abspath(r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\sparkbyte_v2_workbench_verified.png")
    capture_screenshot(artifact_img)

    # 6. Check Console Errors
    print("\n--- Console and Page Errors ---")
    if session.page_errors:
        print(f"CRITICAL: {len(session.page_errors)} page error(s):")
        for err in session.page_errors:
            print(f"  [ERROR] {err}")
    else:
        print("  [PASS] 0 uncaught JavaScript runtime exceptions in SparkByte v2!")

    err_logs = [l for l in session.console_logs if l[0] == 'error']
    if err_logs:
        print(f"\n{len(err_logs)} console.error calls recorded:")
        for _, msg in err_logs:
            print(f"  [console.error] {msg}")
    else:
        print("  [PASS] 0 console.error logs recorded!")

except Exception as e:
    print(f"Verification Error: {e}")
    import traceback
    traceback.print_exc()

finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
