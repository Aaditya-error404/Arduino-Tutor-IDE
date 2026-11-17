import os, sys, json, time, urllib.request, subprocess
from test_sim_click import CDPSession

with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_lines = f.readlines()

print(f"Total lines in simulation.js: {len(sim_lines)}")

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9430', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9430/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    # Let's check where the class methods are defined
    # Binary search lines to find syntax error
    low = 10
    high = len(sim_lines)
    err_line = None

    for i in range(100, len(sim_lines), 50):
        code_chunk = "".join(sim_lines[:i]) + "\n}\n"
        res = session.call('Runtime.evaluate', {
            'expression': f"""
            (() => {{
                try {{
                    eval({json.dumps(code_chunk)});
                    return 'OK';
                }} catch(e) {{
                    return e.message;
                }}
            }})()
            """,
            'returnByValue': True
        })
        val = res.get('result', {}).get('value')
        if "Unexpected token 'this'" in str(val):
            print(f"Error first occurs before or at line {i}!")
            # narrow down between i-50 and i
            for j in range(max(1, i-55), i+5):
                chunk = "".join(sim_lines[:j]) + "\n}\n"
                r = session.call('Runtime.evaluate', {
                    'expression': f"""
                    (() => {{
                        try {{
                            eval({json.dumps(chunk)});
                            return 'OK';
                        }} catch(e) {{
                            return e.message;
                        }}
                    }})()
                    """,
                    'returnByValue': True
                })
                v = r.get('result', {}).get('value')
                if "Unexpected token 'this'" in str(v):
                    print(f"EXACT LINE: {j}")
                    for k in range(max(0, j-5), min(len(sim_lines), j+5)):
                        print(f"  {k+1}: {sim_lines[k]}", end="")
                    sys.exit(0)
            break
finally:
    p.terminate()
