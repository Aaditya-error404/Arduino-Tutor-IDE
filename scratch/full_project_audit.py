# -*- coding: utf-8 -*-
"""
Exhaustive Automated Project Audit for SparkByte Studio (all 22 labs)
Checks:
- Server availability and assets
- JavaScript exceptions / console errors
- All 22 labs: switching, lessons 1-4 rendering, code translation, simulation stepping
- Hardware SVG mounting
- Simulation controls: Start, Pause, Reset, Loop Cycles
- Top bar, Modals, Audio, Oscilloscope
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
cdp_port = 9435

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
    session.call("Page.navigate", {"url": "http://localhost:8080/index.html"})
    time.sleep(2.5)

    def eval_js(expr):
        res = session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    print("==================================================")
    print("      SPARKBYTE STUDIO FULL PROJECT AUDIT        ")
    print("==================================================")

    all_labs = eval_js("window.allLabs || []")
    if not all_labs:
        all_labs = [
            'led', 'servo', 'button', 'pot', 'buzzer', 'cad', 'dmm',
            'ldr', 'rgb', 'temp', 'sonar', 'ir', 'slicer', 'dht', 'gas',
            'lcd', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
        ]
    print(f"Total labs to audit: {len(all_labs)}")

    issues_found = []

    # 1. Iterate through every lab
    print("\n--- Auditing Each Lab (State, Lessons 1-4, Simulation, Hardware) ---")
    for lab_id in all_labs:
        sys.stdout.write(f"Testing [{lab_id:12}] ... ")
        sys.stdout.flush()

        # Switch lab
        sw_res = eval_js(f"""
        (() => {{
            try {{
                window.switchLab('{lab_id}');
                return {{ ok: true, activeLab: window.state ? window.state.activeLab : '{lab_id}' }};
            }} catch(e) {{
                return {{ ok: false, error: e.toString() }};
            }}
        }})()
        """)
        if not sw_res or not sw_res.get('ok'):
            msg = f"Failed to switch to lab '{lab_id}': {sw_res.get('error') if sw_res else 'null'}"
            print(f"[FAIL] {msg}")
            issues_found.append(msg)
            continue

        time.sleep(0.1)

        # Check lessons 1 to 4 (indices 0 to 3)
        lesson_issues = []
        for l_idx in [0, 1, 2, 3]:
            l_info = eval_js(f"""
            (() => {{
                try {{
                    window.switchLesson({l_idx});
                    const cppRows = document.querySelectorAll('#cpp-code .code-row-cpp, .code-row-cpp');
                    const humanRows = document.querySelectorAll('#plain-english-code .code-row-human, .code-row-human');
                    const cppCount = cppRows.length;
                    const humanCount = humanRows.length;
                    const firstCpp = cppRows.length > 0 ? cppRows[0].innerText.trim() : '';
                    
                    const isDummy = (cppCount <= 1 && firstCpp.includes('// Arduino C++'));
                    const hwSvg = document.querySelector('.circuit-stage svg.circuit-svg, svg.circuit-svg');

                    return {{
                        lesson: {l_idx + 1},
                        cppCount,
                        humanCount,
                        firstCpp,
                        isDummy,
                        hasSvg: !!hwSvg
                    }};
                }} catch(e) {{
                    return {{ error: e.toString() }};
                }}
            }})()
            """)
            if not l_info:
                lesson_issues.append(f"L{l_idx+1} eval returned null")
            elif "error" in l_info:
                lesson_issues.append(f"L{l_idx+1} switch threw: {l_info['error']}")
            elif l_info.get("cppCount", 0) == 0:
                lesson_issues.append(f"L{l_idx+1} has 0 C++ lines")
            elif l_info.get("isDummy"):
                lesson_issues.append(f"L{l_idx+1} has dummy fallback C++")
            elif not l_info.get("hasSvg"):
                lesson_issues.append(f"L{l_idx+1} missing Hardware SVG")

        # Now test Simulation Run on Lesson 1 (index 0)
        eval_js("window.switchLesson(0);")
        time.sleep(0.05)
        eval_js("""
        (() => {
            try {
                const btn = document.getElementById('btn-simulate');
                if (btn) btn.click();
                else if (window.circuitSimulation) window.circuitSimulation.start();
            } catch(e) {}
        })()
        """)
        time.sleep(0.6) # let it step

        sim_status = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const isRunning = sim ? (sim.isRunning || sim.running) : false;
            const loopCount = sim ? (sim.loopCount || sim.loopCycles || 0) : 0;
            const activeLines = document.querySelectorAll('.code-row.executing').length;
            
            // Stop and reset simulation for next lab
            if (sim && sim.reset) sim.reset();
            else if (sim && sim.stop) sim.stop();

            return { isRunning, loopCount, activeLines };
        })()
        """)

        if sim_status and not sim_status.get("isRunning") and sim_status.get("loopCount", 0) == 0 and sim_status.get("activeLines", 0) == 0:
            lesson_issues.append(f"Simulation did not execute or step (isRunning={sim_status.get('isRunning')}, loop={sim_status.get('loopCount')}, active={sim_status.get('activeLines')})")

        if lesson_issues:
            print(f"[WARN/FAIL] {', '.join(lesson_issues)}")
            for li in lesson_issues:
                issues_found.append(f"Lab '{lab_id}': {li}")
        else:
            print(f"[PASS] 4 Lessons & Sim OK (loopCycles={sim_status.get('loopCount') if sim_status else 0})")

    # 2. Telemetry, Oscilloscope, Audio & Global Controls
    print("\n--- Auditing Telemetry, Oscilloscope, Audio & Modals ---")
    ui_eval = eval_js("""
    (() => {
        const osc = document.getElementById('scope-canvas');
        const oscCtx = osc ? !!osc.getContext('2d') : false;
        
        const audio = !!window.soundEngine;
        
        const modalExplorer = document.getElementById('lab-explorer-modal');
        const teacherModal = document.getElementById('teacher-modal');
        const speedSelect = document.getElementById('speed-select');
        const cycleBadge = document.getElementById('loop-cycle-badge');

        return {
            hasOscilloscope: oscCtx,
            hasAudioEngine: audio,
            hasExplorerModal: !!modalExplorer,
            hasTeacherModal: !!teacherModal,
            hasSpeedSelect: !!speedSelect,
            hasCycleBadge: !!cycleBadge
        };
    })()
    """)
    if ui_eval:
        for k, v in ui_eval.items():
            status = "[PASS]" if v else "[WARN]"
            print(f"  {status} {k}: {v}")
            if not v:
                issues_found.append(f"Global UI: Missing or incomplete {k}")

    # 3. Check Duplicate IDs
    print("\n--- Auditing Duplicate DOM IDs ---")
    dup_eval = eval_js("""
    (() => {
        const allElements = document.querySelectorAll('[id]');
        const ids = Array.from(allElements).map(el => el.id);
        const counts = {};
        ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
        const dups = {};
        for (const [id, count] of Object.entries(counts)) {
            if (count > 1) dups[id] = count;
        }
        return dups;
    })()
    """)
    if dup_eval:
        print(f"  [WARN] Duplicate IDs found: {dup_eval}")
        for dup_id, cnt in dup_eval.items():
            issues_found.append(f"DOM: Duplicate id='{dup_id}' used {cnt} times in index.html")
    else:
        print("  [PASS] 0 duplicate DOM IDs found!")

    # 4. Check Page Errors & Console Errors
    print("\n--- Console & Runtime Error Summary ---")
    if session.page_errors:
        print(f"CRITICAL: {len(session.page_errors)} uncaught exception(s) detected:")
        for err in session.page_errors:
            print(f"  [ERROR] {err}")
            issues_found.append(f"Uncaught Exception: {err}")
    else:
        print("  [PASS] 0 uncaught JavaScript runtime exceptions across all 22 labs!")

    err_logs = [l for l in session.console_logs if l[0] == 'error']
    if err_logs:
        print(f"\n{len(err_logs)} console.error calls recorded:")
        for _, msg in err_logs:
            print(f"  [console.error] {msg}")
            issues_found.append(f"Console error: {msg}")
    else:
        print("  [PASS] 0 console.error logs recorded across all 22 labs!")

    print("\n==================================================")
    print(f"AUDIT COMPLETE: {len(issues_found)} issue(s) identified.")
    print("==================================================")
    if issues_found:
        print("\nSUMMARY OF ISSUES:")
        for idx, iss in enumerate(issues_found, 1):
            print(f"  {idx}. {iss}")

except Exception as e:
    print(f"CDP Audit Exception: {e}")
    import traceback
    traceback.print_exc()

finally:
    proc.terminate()
    try:
        proc.wait(timeout=3)
    except:
        proc.kill()
