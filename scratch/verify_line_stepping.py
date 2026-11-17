import os, sys, json, time, base64, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cdp_port = 9420

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

    print("\n=== TEST 1: SEQUENTIAL LINE STEPPING (SERVO LAB) ===")
    eval_js("window.switchLesson(2);") # Lesson 3 (The Steering Wheel & Angle Commands)
    time.sleep(0.5)

    # Click Start Simulation
    eval_js("document.getElementById('btn-simulate').click();")

    stepped_lines = []
    # Sample every 300ms for 3.5 seconds
    for _ in range(10):
        time.sleep(0.35)
        info = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const plainExec = document.querySelector('.code-row-human.executing');
            const cppExec = document.querySelector('.code-row-cpp.executing');
            const badge = document.getElementById('loop-cycle-badge');

            return {
                isRunning: sim.isRunning,
                stepPhase: sim.stepPhase,
                stepCount: sim.stepCount,
                loopCount: sim.loopCount,
                plainLine: plainExec ? plainExec.getAttribute('data-line') : null,
                cppLine: cppExec ? cppExec.getAttribute('data-line') : null,
                servoAngle: sim.servoAngle,
                badgeText: badge ? badge.textContent : null
            };
        })()
        """)
        stepped_lines.append(info)

    print("Stepped lines sample:", json.dumps(stepped_lines[:6], indent=2))
    unique_lines = set(s['cppLine'] for s in stepped_lines if s['cppLine'] is not None)
    print("Unique lines executed during sequence:", unique_lines)
    assert len(unique_lines) >= 2, "Expected multiple lines executed in sequence!"

    print("\n=== TEST 2: SPEED SELECTOR (0.5x, 1.0x, 2.0x) ===")
    eval_js("document.getElementById('speed-select').value = '2.0'; document.getElementById('speed-select').dispatchEvent(new Event('change'));")
    spd2 = eval_js("window.circuitSimulation.speed")
    print("Speed after 2.0x selector:", spd2)
    assert spd2 == 2.0, "Expected speed to be 2.0"

    print("\n=== TEST 3: PAUSE & RESUME ===")
    eval_js("document.getElementById('btn-pause').click();")
    paused_info = eval_js("({ isRunning: window.circuitSimulation.isRunning, isPaused: window.circuitSimulation.isPaused })")
    print("After Pause click:", paused_info)
    assert paused_info["isPaused"] == True, "Expected simulation to be paused"

    eval_js("document.getElementById('btn-simulate').click();") # Resume
    resumed_info = eval_js("({ isRunning: window.circuitSimulation.isRunning, isPaused: window.circuitSimulation.isPaused })")
    print("After Resume click:", resumed_info)
    assert resumed_info["isRunning"] == True and resumed_info["isPaused"] == False, "Expected simulation to resume"

    print("\n=== TEST 4: RESET ===")
    eval_js("document.getElementById('btn-reset-sim').click();")
    reset_info = eval_js("({ isRunning: window.circuitSimulation.isRunning, loopCount: window.circuitSimulation.loopCount, executingCount: document.querySelectorAll('.code-row.executing').length })")
    print("After Reset click:", reset_info)
    assert reset_info["isRunning"] == False and reset_info["executingCount"] == 0, "Expected simulation stopped and highlights cleared"

    print("\n=== TEST 5: LED BLINK LAB HARDWARE LOCKSTEP ===")
    eval_js("window.switchLab('led', true);")
    time.sleep(0.5)
    eval_js("window.switchLesson(2);") # Lesson 3: The Blink Dance
    time.sleep(0.5)
    eval_js("document.getElementById('btn-simulate').click();")

    led_states = []
    for _ in range(8):
        time.sleep(0.4)
        info = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const led = document.getElementById('breadboard-led');
            const cppExec = document.querySelector('.code-row-cpp.executing');
            return {
                stepCount: sim.stepCount,
                cppLine: cppExec ? cppExec.getAttribute('data-line') : null,
                pin13State: sim.pin13State,
                ledIlluminated: led ? led.classList.contains('illuminated') : false
            };
        })()
        """)
        led_states.append(info)

    print("LED states in lockstep:", json.dumps(led_states[:5], indent=2))
    pin_states = set(s['pin13State'] for s in led_states)
    print("LED Pin 13 toggled between HIGH & LOW:", pin_states)
    assert True in pin_states and False in pin_states, "Expected LED to toggle between HIGH and LOW!"

    print("\n=== TEST 6: LESSON 4 SWEEP SANDBOX ===")
    eval_js("window.switchLab('servo', true);")
    time.sleep(0.5)
    eval_js("window.switchLesson(3);") # Lesson 4: Sweep Sandbox
    time.sleep(0.5)
    eval_js("document.getElementById('btn-simulate').click();")

    sweep_angles = []
    for _ in range(6):
        time.sleep(0.35)
        angle = eval_js("window.circuitSimulation.servoAngle")
        sweep_angles.append(angle)

    print("Sweep angles in sandbox:", sweep_angles)
    assert len(set(sweep_angles)) > 1, "Expected sweep angles to change dynamically!"

    print("\nALL LINE STEPPING & HARDWARE LOCKSTEP TESTS PASSED!")

finally:
    proc.terminate()
    proc.wait()
