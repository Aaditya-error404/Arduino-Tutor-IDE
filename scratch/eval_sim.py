import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9429', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9429/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    res = session.call('Runtime.evaluate', {
        'expression': """
        (() => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/js/simulation.js?v=' + Date.now(), false);
            xhr.send();
            try {
                eval(xhr.responseText);
                return 'EVAL OK';
            } catch(e) {
                return { message: e.message, stack: e.stack };
            }
        })()
        """,
        'returnByValue': True
    })
    print(json.dumps(res.get('result', {}).get('value'), indent=2))
finally:
    p.terminate()
