import asyncio
import json
import urllib.request
import subprocess
import time
import os
import sys

# Ensure Chrome is running with remote debugging or start one
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

CDP_PORT = 9245

def check_server():
    print("--- 1. Checking Local Server (http://localhost:8080) ---")
    resources = [
        "/",
        "/index.html",
        "/css/styles.css",
        "/js/app.js",
        "/js/simulation.js",
        "/js/lessons.js",
        "/js/audio.js"
    ]
    for r in resources:
        url = f"http://localhost:8080{r}"
        try:
            req = urllib.request.urlopen(url, timeout=3)
            print(f"  [OK] {r} -> {req.status} (Length: {len(req.read())} bytes)")
        except Exception as e:
            print(f"  [FAIL] {r} -> {e}")

async def run_cdp_audit():
    import websockets
    print(f"\n--- 2. Launching Headless Chrome on CDP port {CDP_PORT} ---")
    proc = subprocess.Popen([
        CHROME_PATH,
        f"--remote-debugging-port={CDP_PORT}",
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=" + os.path.abspath(f"scratch/chrome_audit_profile_{CDP_PORT}"),
        "about:blank"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    try:
        await asyncio.sleep(2)
        # Get websocket debugger url
        version_url = f"http://localhost:{CDP_PORT}/json/version"
        req = urllib.request.urlopen(version_url)
        info = json.loads(req.read().decode())
        ws_url = info["webSocketDebuggerUrl"]

        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def send(method, params=None):
                nonlocal msg_id
                msg_id += 1
                mid = msg_id
                payload = {"id": mid, "method": method}
                if params:
                    payload["params"] = params
                await ws.send(json.dumps(payload))
                while True:
                    res = await ws.recv()
                    data = json.loads(res)
                    if data.get("id") == mid:
                        return data.get("result", {})

            # Create a new target/page
            target = await send("Target.createTarget", {"url": "http://localhost:8080/"})
            target_id = target["targetId"]
            
            # Connect to page target
            page_ws_url = f"http://localhost:{CDP_PORT}/json"
            pages = json.loads(urllib.request.urlopen(page_ws_url).read().decode())
            page_target = [p for p in pages if p["id"] == target_id][0]
            
            async with websockets.connect(page_target["webSocketDebuggerUrl"]) as pws:
                p_id = 0
                console_logs = []
                page_errors = []

                async def psend(method, params=None):
                    nonlocal p_id
                    p_id += 1
                    mid = p_id
                    payload = {"id": mid, "method": method}
                    if params:
                        payload["params"] = params
                    await pws.send(json.dumps(payload))
                    while True:
                        res = await pws.recv()
                        data = json.loads(res)
                        # Capture events
                        if data.get("method") == "Runtime.consoleAPICalled":
                            args = [a.get("value", a.get("description", "")) for a in data["params"]["args"]]
                            console_logs.append((data["params"]["type"], " ".join(str(x) for x in args)))
                        elif data.get("method") == "Runtime.exceptionThrown":
                            exc = data["params"]["exceptionDetails"]
                            desc = exc.get("exception", {}).get("description", exc.get("text", "Unknown error"))
                            page_errors.append(desc)
                        
                        if data.get("id") == mid:
                            return data.get("result", {})

                # Listen to events
                await pws.send(json.dumps({"id": 99991, "method": "Runtime.enable"}))
                await pws.send(json.dumps({"id": 99992, "method": "Page.enable"}))
                
                print("Waiting for page load...")
                await asyncio.sleep(2)

                async def evaluate(expression):
                    res = await psend("Runtime.evaluate", {
                        "expression": expression,
                        "returnByValue": True,
                        "awaitPromise": True
                    })
                    if "exceptionDetails" in res:
                        return {"error": res["exceptionDetails"]}
                    return {"value": res.get("result", {}).get("value")}

                print("\n--- 3. Checking Initial Page State & Core Objects ---")
                init_check = await evaluate("""
                (() => {
                    return {
                        hasState: typeof window.state !== 'undefined',
                        hasSim: typeof window.simulation !== 'undefined',
                        activeLab: window.state ? window.state.activeLab : null,
                        activeLesson: window.state ? window.state.activeLesson : null,
                        allLabs: window.LABS ? Object.keys(window.LABS) : (window.labs ? Object.keys(window.labs) : []),
                        title: document.title,
                        bodyClass: document.body.className
                    };
                })()
                """)
                print("Initial state:", json.dumps(init_check.get("value"), indent=2))

                # Query all registered lab IDs
                labs_eval = await evaluate("""
                (() => {
                    if (window.LABS) return Object.keys(window.LABS);
                    if (window.LAB_CONFIGS) return Object.keys(window.LAB_CONFIGS);
                    // Check select options
                    const sel = document.getElementById('lab-select');
                    if (sel) {
                        return Array.from(sel.options).map(o => o.value);
                    }
                    return [];
                })()
                """)
                all_lab_ids = labs_eval.get("value", [])
                print(f"Found {len(all_lab_ids)} labs to audit: {all_lab_ids}")

                print("\n--- 4. Auditing All Labs & Lessons ---")
                audit_results = {}

                for lab_id in all_lab_ids:
                    print(f"\n[Auditing Lab: {lab_id}]")
                    lab_report = {"lessons": {}, "errors": []}
                    
                    # Switch to lab
                    switch_res = await evaluate(f"""
                    (() => {{
                        try {{
                            if (window.switchLab) {{
                                window.switchLab('{lab_id}');
                                return {{ success: true }};
                            }}
                            const sel = document.getElementById('lab-select');
                            if (sel) {{
                                sel.value = '{lab_id}';
                                sel.dispatchEvent(new Event('change'));
                                return {{ success: true }};
                            }}
                            return {{ error: 'No switch mechanism' }};
                        }} catch (e) {{
                            return {{ error: e.toString() }};
                        }}
                    }})()
                    """)
                    
                    if "error" in switch_res.get("value", {}):
                        print(f"  Switch error: {switch_res['value']['error']}")
                        lab_report["errors"].append(switch_res['value']['error'])
                        audit_results[lab_id] = lab_report
                        continue

                    await asyncio.sleep(0.3)

                    # Test all 4 lessons for this lab
                    for lesson_num in [1, 2, 3, 4]:
                        lesson_res = await evaluate(f"""
                        (() => {{
                            try {{
                                if (window.switchLesson) {{
                                    window.switchLesson({lesson_num});
                                }} else {{
                                    const btn = document.querySelector(`.step-pill[data-lesson="{lesson_num}"]`) ||
                                                document.querySelector(`button[data-lesson="{lesson_num}"]`);
                                    if (btn) btn.click();
                                }}
                                
                                const cppLines = document.querySelectorAll('.cpp-column .code-line, #cpp-code .code-line');
                                const engLines = document.querySelectorAll('.english-column .code-line, #english-code .code-line');
                                const cppText = Array.from(cppLines).map(l => l.innerText.trim()).filter(Boolean);
                                const engText = Array.from(engLines).map(l => l.innerText.trim()).filter(Boolean);
                                
                                const hwContainer = document.getElementById('hardware-view') || document.querySelector('.circuit-view') || document.querySelector('.hardware-view');
                                const svg = hwContainer ? hwContainer.querySelector('svg') : null;
                                
                                return {{
                                    lesson: {lesson_num},
                                    cppCount: cppLines.length,
                                    engCount: engLines.length,
                                    firstCpp: cppText[0] || '',
                                    firstEng: engText[0] || '',
                                    hasSvg: !!svg,
                                    isDummy: (cppLines.length === 1 && cppText[0] && cppText[0].includes('// Arduino C++'))
                                }};
                            }} catch(e) {{
                                return {{ error: e.toString() }};
                            }}
                        }})()
                        """)
                        l_data = lesson_res.get("value", {})
                        lab_report["lessons"][lesson_num] = l_data
                        
                        # Test Simulation Start on Lesson 1
                        if lesson_num == 1:
                            sim_start = await evaluate("""
                            (() => {
                                try {
                                    const startBtn = document.getElementById('btn-sim-start') || document.getElementById('btn-start-sim');
                                    if (startBtn) {
                                        startBtn.click();
                                        return { clicked: true };
                                    } else if (window.simulation && window.simulation.start) {
                                        window.simulation.start();
                                        return { calledSim: true };
                                    }
                                    return { error: 'Start button not found' };
                                } catch(e) {
                                    return { error: e.toString() };
                                }
                            })()
                            """)
                            await asyncio.sleep(1.0)
                            
                            sim_check = await evaluate("""
                            (() => {
                                const sim = window.simulation;
                                const isRunning = sim ? (sim.isRunning || sim.running) : false;
                                const loopCount = sim ? (sim.loopCount || sim.loopCycles || 0) : 0;
                                const stepIdx = sim ? (sim.stepIndex || 0) : 0;
                                const activeCpp = document.querySelectorAll('.code-line.active-line, .code-line.executing').length;
                                
                                // Now stop/reset simulation
                                if (sim && sim.reset) sim.reset();
                                else if (sim && sim.stop) sim.stop();
                                
                                return {
                                    isRunning,
                                    loopCount,
                                    stepIdx,
                                    activeHighlighted: activeCpp
                                };
                            })()
                            """)
                            lab_report["simTest"] = sim_check.get("value", {})

                    status_str = f"L1: {lab_report['lessons'][1].get('cppCount',0)} cpp lines | Sim: {lab_report.get('simTest',{})}"
                    print(f"  -> {status_str}")
                    audit_results[lab_id] = lab_report

                print("\n--- 5. Checking UI Modals & Buttons ---")
                modals_check = await evaluate("""
                (() => {
                    const explorerModal = document.getElementById('lab-explorer-modal') || document.querySelector('.modal-explorer') || document.getElementById('modal-lab-explorer');
                    const guideModal = document.getElementById('guide-modal') || document.getElementById('help-modal');
                    const teacherBtn = document.getElementById('toggle-teacher-mode') || document.getElementById('teacher-mode-btn');
                    const soundBtn = document.getElementById('btn-toggle-sound') || document.getElementById('sound-toggle');
                    const resetBtn = document.getElementById('btn-reset-all') || document.getElementById('btn-reset');
                    
                    return {
                        hasExplorerModal: !!explorerModal,
                        hasGuideModal: !!guideModal,
                        hasTeacherToggle: !!teacherBtn,
                        hasSoundToggle: !!soundBtn,
                        hasResetBtn: !!resetBtn
                    };
                })()
                """)
                print("Modals & Controls:", json.dumps(modals_check.get("value"), indent=2))

                print("\n--- 6. Console Errors & Uncaught Exceptions During Entire Audit ---")
                if page_errors:
                    print(f"CRITICAL PAGE ERRORS FOUND ({len(page_errors)}):")
                    for err in page_errors:
                        print("  [ERROR]", err)
                else:
                    print("  [PASSED] 0 uncaught page exceptions during entire audit!")

                warn_or_error_logs = [log for log in console_logs if log[0] in ['error', 'warning']]
                if warn_or_error_logs:
                    print(f"\nConsole Errors/Warnings ({len(warn_or_error_logs)}):")
                    for ltype, msg in warn_or_error_logs[:15]:
                        print(f"  [{ltype.upper()}] {msg}")
                else:
                    print("  [PASSED] 0 console errors/warnings reported!")

                # Save complete audit report
                with open("scratch/audit_report.json", "w") as f:
                    json.dump({
                        "auditResults": audit_results,
                        "modalsCheck": modals_check.get("value"),
                        "pageErrors": page_errors,
                        "consoleLogs": console_logs
                    }, f, indent=2)
                print("\nWrote full audit to scratch/audit_report.json")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except:
            proc.kill()

if __name__ == "__main__":
    check_server()
    asyncio.run(run_cdp_audit())
