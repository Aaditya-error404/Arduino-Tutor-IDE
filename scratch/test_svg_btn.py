import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9413', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9413/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    res = session.call("Runtime.evaluate", {
        "expression": """
        (() => {
            const svg = document.querySelector('#teacher-modal-btn svg');
            const rect = svg.getBoundingClientRect();
            const cs = window.getComputedStyle(svg);
            return {
                rectWidth: Math.round(rect.width),
                rectHeight: Math.round(rect.height),
                csWidth: cs.width,
                csHeight: cs.height,
                stroke: cs.stroke
            };
        })()
        """,
        "returnByValue": True
    })
    print("Button SVG Inspection:", json.dumps(res.get("result", {}).get("value"), indent=2))
finally:
    p.terminate()
