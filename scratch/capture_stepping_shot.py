import os, sys, json, time, urllib.request, subprocess, base64, shutil
from test_sim_click import CDPSession

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9440', '--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=1440,900', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9440/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    session = CDPSession(ws_url)

    session.call('Page.enable')
    time.sleep(1)

    # Switch to Servo Lesson 3 and run
    session.call('Runtime.evaluate', {'expression': "window.switchLesson(2); document.getElementById('btn-simulate').click();"})
    time.sleep(1.2)

    shot = session.call('Page.captureScreenshot', {'format': 'png'})
    with open('scratch/line_stepping_verified.png', 'wb') as f:
        f.write(base64.b64decode(shot['data']))

    art_dir = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310"
    shutil.copy('scratch/line_stepping_verified.png', os.path.join(art_dir, 'line_stepping_verified.png'))
    print("Captured line_stepping_verified.png successfully!")
finally:
    p.terminate()
