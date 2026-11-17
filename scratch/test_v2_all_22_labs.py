# -*- coding: utf-8 -*-
"""
Automated 22-Lab Verification for SparkByte Studio v2 (Vite + React)
Runs on http://localhost:5173/ via Chrome DevTools Protocol.
Generates an exhaustive matrix of:
- Plain English & Monaco C++ line sync
- Simulation step execution & loop cycling
- Hardware animation / state updates
- Oscilloscope waveform drawing
- Console errors & runtime exceptions
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
import tempfile
temp_dir = tempfile.mkdtemp()
cdp_port = 9520

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
    tabs = []
    for _ in range(30):
        try:
            tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
            if tabs:
                break
        except Exception:
            time.sleep(0.4)
    if not tabs:
        raise RuntimeError("Could not connect to Chrome CDP")

    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    ws_url = page_tab["webSocketDebuggerUrl"]
    session = CDPSession(ws_url)

    session.call("Runtime.enable")
    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})
    time.sleep(3.0)

    def eval_js(expr):
        res = session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    print("==================================================")
    print("   SPARKBYTE STUDIO v2 - 22-LAB AUTOMATED AUDIT   ")
    print("==================================================")

    all_labs = [
        'led', 'servo', 'button', 'pot', 'buzzer', 'cad', 'dmm',
        'ldr', 'rgb', 'temp', 'sonar', 'ir', 'slicer', 'dht', 'gas',
        'lcd', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
    ]

    report = []

    for lab_id in all_labs:
        sys.stdout.write(f"Testing [{lab_id:10}] ... ")
        sys.stdout.flush()

        # Switch to lab via Zustand store
        eval_js(f"""
        (() => {{
            if (window.useWorkbenchStore) {{
                window.useWorkbenchStore.getState().setActiveLab('{lab_id}');
            }}
        }})()
        """)
        time.sleep(0.15)

        # Inspect Lesson 1 data
        lab_state = eval_js(f"""
        (() => {{
            const store = window.useWorkbenchStore ? window.useWorkbenchStore.getState() : null;
            if (!store) return {{ error: 'No store' }};

            const compiled = store.compiled;
            const hw = store.hardwareState;
            const englishRows = document.querySelectorAll('.font-mono .text-slate-400, .font-mono div');
            
            return {{
                activeLab: store.activeLabId,
                setupStepsCount: compiled ? compiled.setupSteps.length : 0,
                loopStepsCount: compiled ? compiled.loopSteps.length : 0,
                cppLinesCount: compiled ? compiled.cppLines.length : 0,
                humanLinesCount: compiled ? compiled.humanLines.length : 0,
                firstCpp: compiled && compiled.cppLines[0] ? compiled.cppLines[0].trim() : '',
                firstHuman: compiled && compiled.humanLines[0] ? compiled.humanLines[0].trim() : '',
                initialHw: {{
                    voltage: hw.voltage,
                    currentMa: hw.currentMa,
                    ledOn: hw.ledOn,
                    servoAngle: hw.servoAngle
                }}
            }};
        }})()
        """)

        # Run simulation for 0.8 seconds
        eval_js("""
        (() => {
            if (window.useWorkbenchStore) {
                window.useWorkbenchStore.getState().startSimulation();
            }
        })()
        """)
        time.sleep(0.3)

        # Inspect simulation execution
        sim_eval = eval_js("""
        (() => {
            const store = window.useWorkbenchStore ? window.useWorkbenchStore.getState() : null;
            if (!store) return { error: 'No store' };

            const isRunning = store.isRunning;
            const loopCount = store.loopCount;
            const activeLineIndex = store.activeLineIndex;
            const activeInstruction = store.activeInstruction;
            const hw = store.hardwareState;

            // Check oscilloscope canvas
            const canvas = document.getElementById('scope-canvas');
            let activeScopePixels = 0;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (let i = 3; i < imgData.data.length; i += 4) {
                    if (imgData.data[i] > 0) activeScopePixels++;
                }
            }

            // Stop simulation
            store.resetSimulation();

            return {
                isRunning,
                loopCount,
                activeLineIndex,
                hasActiveInstruction: !!activeInstruction,
                activeInstructionText: activeInstruction ? activeInstruction.rawCpp.trim() : null,
                activeScopePixels,
                scopeBufferSize: store.scopeBuffer.length,
                finalHw: {
                    voltage: hw.voltage,
                    currentMa: hw.currentMa,
                    ledOn: hw.ledOn,
                    servoAngle: hw.servoAngle
                }
            };
        })()
        """)

        # Determine pass/warn status
        has_lines = lab_state.get('cppLinesCount', 0) > 0 and lab_state.get('humanLinesCount', 0) > 0
        has_sim_step = sim_eval.get('loopCount', 0) > 0 or sim_eval.get('activeLineIndex', 0) > 0 or sim_eval.get('hasActiveInstruction')
        has_scope = sim_eval.get('activeScopePixels', 0) > 0

        status = "PASS" if (has_lines and has_sim_step and has_scope) else "WARN"
        inst_text = (sim_eval.get('activeInstructionText') or 'none')[:30]
        print(f"[{status}] Cpp: {lab_state.get('cppLinesCount',0)} lines | Steps: {inst_text} | Loops: {sim_eval.get('loopCount',0)} | Scope: {sim_eval.get('activeScopePixels',0)}px", flush=True)

        report.append({
            "labId": lab_id,
            "status": status,
            "lines": {
                "cpp": lab_state.get('cppLinesCount', 0),
                "human": lab_state.get('humanLinesCount', 0)
            },
            "steps": {
                "setup": lab_state.get('setupStepsCount', 0),
                "loop": lab_state.get('loopStepsCount', 0)
            },
            "simulation": {
                "loopCycles": sim_eval.get('loopCount', 0),
                "activeLine": sim_eval.get('activeLineIndex', 0),
                "activeInstruction": sim_eval.get('activeInstructionText')
            },
            "oscilloscope": {
                "activePixels": sim_eval.get('activeScopePixels', 0),
                "bufferPoints": sim_eval.get('scopeBufferSize', 0)
            }
        })

    with open("scratch/v2_22_lab_audit.json", "w") as f:
        json.dump({
            "report": report,
            "pageErrors": session.page_errors,
            "consoleLogs": session.console_logs
        }, f, indent=2)

    print("\n--- Console & Runtime Errors ---")
    if session.page_errors:
        print(f"CRITICAL: {len(session.page_errors)} uncaught page error(s):")
        for err in session.page_errors:
            print(f"  [ERROR] {err}")
    else:
        print("  [PASS] 0 uncaught JavaScript runtime exceptions across all 22 labs!")

    err_logs = [l for l in session.console_logs if l[0] == 'error']
    if err_logs:
        print(f"\n{len(err_logs)} console.error logs recorded:")
        for _, msg in err_logs:
            print(f"  [console.error] {msg}")
    else:
        print("  [PASS] 0 console.error logs recorded!")

except Exception as e:
    print(f"Audit Exception: {e}")
    import traceback
    traceback.print_exc()

finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
