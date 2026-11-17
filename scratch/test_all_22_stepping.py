import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9436', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9436/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    def eval_js(expr):
        return session.call('Runtime.evaluate', {'expression': expr, 'returnByValue': True}).get('result', {}).get('value')

    labs = ['servo', 'led', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'dmm', 'cad', 'slicer', 'dht', 'gas', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot']
    results = []
    for lab in labs:
        eval_js(f"window.switchLab('{lab}', true);")
        time.sleep(0.15)
        eval_js("document.getElementById('btn-simulate').click();")
        time.sleep(0.4)
        info = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const plainExec = document.querySelectorAll('.code-row-human.executing');
            const cppExec = document.querySelectorAll('.code-row-cpp.executing');
            return {
                lab: sim.activeLab,
                isRunning: sim.isRunning,
                stepCount: sim.stepCount,
                loopCount: sim.loopCount,
                dualHighlight: (plainExec.length > 0 && cppExec.length > 0)
            };
        })()
        """)
        results.append(info)
    all_ok = all(r['isRunning'] and r['dualHighlight'] and r['stepCount'] > 0 for r in results)
    print('All 22 Labs Line Stepping Passed:', all_ok, f'({len(results)}/22)')
finally:
    p.terminate()
