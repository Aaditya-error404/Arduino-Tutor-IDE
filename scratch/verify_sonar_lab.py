import os
import sys
import json
import time
import base64
import urllib.request
import subprocess
import socket

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
if not chrome_bin:
    print("Chrome not found")
    sys.exit(1)

cdp_port = 9340
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
    tabs_url = f"http://127.0.0.1:{cdp_port}/json"
    req = urllib.request.urlopen(tabs_url, timeout=5)
    tabs = json.loads(req.read().decode())
    target_tab = next(t for t in tabs if t.get("type") == "page")
    ws_url = target_tab["webSocketDebuggerUrl"]
    print(f"Connected to WebSocket: {ws_url}")

    import hashlib
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    parsed = urllib.parse.urlparse(ws_url)
    host, port = parsed.hostname, parsed.port
    path = parsed.path

    s = socket.create_connection((host, port), timeout=5)
    handshake = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        f"Sec-WebSocket-Version: 13\r\n\r\n"
    )
    s.sendall(handshake.encode('utf-8'))
    resp = s.recv(4096)
    if b"101 " not in resp:
        print("WebSocket handshake failed:", resp)
        sys.exit(1)

    def send_cdp(msg_id, method, params=None):
        payload = json.dumps({"id": msg_id, "method": method, "params": params or {}}).encode('utf-8')
        frame = bytearray([0x81])
        length = len(payload)
        if length < 126:
            frame.append(0x80 | length)
        elif length < 65536:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))
        mask = os.urandom(4)
        frame.extend(mask)
        masked = bytearray(payload[i] ^ mask[i % 4] for i in range(length))
        frame.extend(masked)
        s.sendall(frame)

    def recv_cdp(expected_id=None):
        buf = bytearray()
        while True:
            chunk = s.recv(65536)
            if not chunk:
                break
            buf.extend(chunk)
            while len(buf) >= 2:
                payload_len = buf[1] & 0x7F
                offset = 2
                if payload_len == 126:
                    if len(buf) < 4:
                        break
                    payload_len = int.from_bytes(buf[2:4], 'big')
                    offset = 4
                elif payload_len == 127:
                    if len(buf) < 10:
                        break
                    payload_len = int.from_bytes(buf[2:10], 'big')
                    offset = 10
                if len(buf) < offset + payload_len:
                    break
                payload = buf[offset:offset+payload_len]
                buf = buf[offset+payload_len:]
                try:
                    data = json.loads(payload.decode('utf-8', errors='ignore'))
                    if expected_id is None or data.get("id") == expected_id:
                        return data
                except Exception:
                    pass

    # 1. Clear cache and navigate to Sonar lab
    send_cdp(98, "Network.enable")
    recv_cdp(98)
    send_cdp(97, "Network.clearBrowserCache")
    recv_cdp(97)
    send_cdp(96, "Network.setCacheDisabled", {"cacheDisabled": True})
    recv_cdp(96)
    test_url = "http://127.0.0.1:8080/?lab=sonar"
    print(f"Navigating to: {test_url}")
    send_cdp(99, "Log.enable")
    recv_cdp(99)
    send_cdp(100, "Runtime.enable")
    recv_cdp(100)
    send_cdp(1, "Page.navigate", {"url": test_url})
    recv_cdp(1)

    time.sleep(2.5)

    # Check for any JS errors or test direct call
    send_cdp(102, "Runtime.evaluate", {"expression": "window.location.search"})
    res102 = recv_cdp(102)
    print("Window location search:", res102.get("result", {}).get("result", {}).get("value"))

    send_cdp(103, "Runtime.evaluate", {"expression": "typeof switchLab"})
    res103 = recv_cdp(103)
    print("typeof switchLab:", res103.get("result", {}).get("result", {}).get("value"))

    send_cdp(104, "Runtime.evaluate", {"expression": "window.SONAR_LESSONS_DATA ? window.SONAR_LESSONS_DATA.length : 'undefined'"})
    res104 = recv_cdp(104)
    print("SONAR_LESSONS_DATA:", res104.get("result", {}).get("result", {}).get("value"))

    send_cdp(105, "Runtime.evaluate", {"expression": "window.__appStarted ? 'app started' : 'app NOT started'"})
    res105 = recv_cdp(105)
    print("App started:", res105.get("result", {}).get("result", {}).get("value"))

    send_cdp(1051, "Runtime.evaluate", {"expression": "window.__domCallbackFired ? 'DOM callback FIRED' : 'DOM callback NOT FIRED'"})
    res1051 = recv_cdp(1051)
    print("DOM callback status:", res1051.get("result", {}).get("result", {}).get("value"))

    send_cdp(1052, "Runtime.evaluate", {"expression": "window.__bootError || 'NO BOOT ERROR'"})
    res1052 = recv_cdp(1052)
    print("Boot Error:", res1052.get("result", {}).get("result", {}).get("value"))

    with open('js/simulation.js', 'r', encoding='utf-8') as f:
        sim_js_text = f.read()
    send_cdp(201, "Runtime.compileScript", {"expression": sim_js_text, "sourceURL": "simulation.js", "persistScript": False})
    res201 = recv_cdp(201)
    print("Compile simulation.js result:", res201.get("result", {}).get("exceptionDetails") or "Clean syntax!")

    send_cdp(300, "Runtime.evaluate", {"expression": "document.body.innerHTML.includes('lab-btn-sonar')"})
    res300 = recv_cdp(300)
    print("Does DOM have lab-btn-sonar:", res300.get("result", {}).get("result", {}).get("value"))

    send_cdp(301, "Runtime.evaluate", {"expression": "document.getElementById('lab-btn-sonar') ? 'found' : 'not found'"})
    res301 = recv_cdp(301)
    print("getElementById('lab-btn-sonar'):", res301.get("result", {}).get("result", {}).get("value"))

    send_cdp(302, "Runtime.evaluate", {"expression": "document.getElementById('lab-btn-sonar') ? document.getElementById('lab-btn-sonar').click() : 'no btn'"})
    res302 = recv_cdp(302)
    print("Clicking lab-btn-sonar:", res302.get("result", {}).get("result", {}).get("value"))

    time.sleep(1.0)
    send_cdp(303, "Runtime.evaluate", {"expression": "document.getElementById('current-lab-label').textContent"})
    res303 = recv_cdp(303)
    print("After click, Current Lab Label:", res303.get("result", {}).get("result", {}).get("value"))

    # 2. Check document title and current lab
    send_cdp(2, "Runtime.evaluate", {"expression": "document.title"})
    res2 = recv_cdp(2)
    print("Page Title:", res2.get("result", {}).get("result", {}).get("value"))

    send_cdp(3, "Runtime.evaluate", {"expression": "document.getElementById('current-lab-label').textContent"})
    res3 = recv_cdp(3)
    print("Current Lab Label:", res3.get("result", {}).get("result", {}).get("value"))

    # 3. Check circuit view display
    send_cdp(4, "Runtime.evaluate", {"expression": "document.getElementById('sonar-circuit-view').style.display"})
    res4 = recv_cdp(4)
    print("Sonar Circuit View SVG Display:", res4.get("result", {}).get("result", {}).get("value"))

    # 4. Check lesson 33 title
    send_cdp(5, "Runtime.evaluate", {"expression": "document.getElementById('lesson-title').textContent"})
    res5 = recv_cdp(5)
    print("Lesson 1 Title:", res5.get("result", {}).get("result", {}).get("value"))

    # 5. Click "Fire 10us Sonic Ping"
    send_cdp(6, "Runtime.evaluate", {"expression": "document.getElementById('btn-sonar-ping') ? document.getElementById('btn-sonar-ping').click() : false"})
    res6 = recv_cdp(6)
    print("Clicked Fire Ping:", res6.get("result", {}).get("result", {}).get("value"))

    time.sleep(1.0)

    # 6. Switch to Lesson 4 (Capstone Reverse Parking Radar Studio)
    send_cdp(7, "Runtime.evaluate", {"expression": "document.querySelectorAll('.lesson-tab')[3].click()"})
    res7 = recv_cdp(7)
    time.sleep(1.2)

    send_cdp(8, "Runtime.evaluate", {"expression": "document.getElementById('lesson-title').textContent"})
    res8 = recv_cdp(8)
    print("Lesson 4 Title:", res8.get("result", {}).get("result", {}).get("value"))

    # 7. Slide target obstacle to 12cm (Hazard Zone)
    send_cdp(9, "Runtime.evaluate", {"expression": """
        const slider = document.getElementById('sonar-radar-slider');
        if (slider) {
            slider.value = 12.0;
            slider.dispatchEvent(new Event('input'));
        }
        window.circuitSimulation.getHardwareState();
    """, "returnByValue": True})
    res9 = recv_cdp(9)
    print("Hardware State at 12cm:", res9.get("result", {}).get("result", {}).get("value"))

    # 8. Check HUD Readouts
    send_cdp(10, "Runtime.evaluate", {"expression": """({
        dist: document.getElementById('hud-readout-1').textContent,
        echo: document.getElementById('hud-readout-2').textContent,
        zone: document.getElementById('hud-readout-3').textContent,
        alert: document.getElementById('hud-readout-4').textContent
    })""", "returnByValue": True})
    res10 = recv_cdp(10)
    print("HUD Readouts:", res10.get("result", {}).get("result", {}).get("value"))

    # 9. Click "Activate Parking Radar"
    send_cdp(11, "Runtime.evaluate", {"expression": "document.getElementById('btn-sonar-radar') ? document.getElementById('btn-sonar-radar').click() : false"})
    res11 = recv_cdp(11)
    print("Clicked Activate Parking Radar:", res11.get("result", {}).get("result", {}).get("value"))

    time.sleep(1.0)

    # 10. Capture full-page screenshot
    send_cdp(12, "Page.captureScreenshot", {"format": "png"})
    res12 = recv_cdp(12)
    img_data = res12.get("result", {}).get("data")
    if img_data:
        screenshot_path = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\sonar_screen.png"
        with open(screenshot_path, "wb") as f:
            f.write(base64.b64decode(img_data))
        print(f"Screenshot successfully saved to: {screenshot_path}")
    else:
        print("Failed to capture screenshot")

finally:
    proc.terminate()
    proc.wait()
    print("Chrome terminated.")
