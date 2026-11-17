import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9427', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9427/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    res = session.call("Runtime.evaluate", {
        "expression": """
        (() => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/js/simulation.js?v=' + Date.now(), false);
            xhr.send();
            const lines = xhr.responseText.split('\\n');
            // Binary search or line by line prefix check to find where syntax breaks
            for (let i = 1; i <= lines.length; i++) {
                const prefix = lines.slice(0, i).join('\\n');
                try {
                    // wrap in function to check
                    new Function(prefix + '\\n}');
                } catch(e) {
                    if (!e.message.includes('Unexpected end of input') && !e.message.includes('Unexpected token \'}\'')) {
                        return { errorLine: i, lineText: lines[i-1], error: e.message };
                    }
                }
            }
            return 'No prefix syntax error found';
        })()
        """,
        "returnByValue": True
    })
    print("Syntax locator:", res.get("result", {}).get("value"))
finally:
    p.terminate()
