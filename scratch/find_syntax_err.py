import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9426', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9426/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    res = session.call("Runtime.evaluate", {
        "expression": """
        (() => {
            try {
                // fetch simulation.js text and new Function(text)
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/js/simulation.js?v=' + Date.now(), false);
                xhr.send();
                try {
                    new Function(xhr.responseText);
                    return 'SIMULATION.JS SYNTAX OK';
                } catch(err) {
                    return 'SIMULATION.JS SYNTAX ERROR: ' + err.stack;
                }
            } catch(e) {
                return 'FETCH ERROR: ' + e.message;
            }
        })()
        """,
        "returnByValue": True
    })
    print("Syntax evaluation:", res.get("result", {}).get("value"))
finally:
    p.terminate()
