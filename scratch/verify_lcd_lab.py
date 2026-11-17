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

cdp_port = 9342
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

    # 1. Clear cache and navigate to LCD lab
    send_cdp(98, "Network.enable")
    recv_cdp(98)
    send_cdp(97, "Network.clearBrowserCache")
    recv_cdp(97)
    send_cdp(96, "Network.setCacheDisabled", {"cacheDisabled": True})
    recv_cdp(96)

    test_url = "http://127.0.0.1:8080/?lab=lcd"
    print(f"Navigating to: {test_url}")
    send_cdp(100, "Runtime.enable")
    recv_cdp(100)
    send_cdp(1, "Page.navigate", {"url": test_url})
    recv_cdp(1)

    time.sleep(2.5)

    with open('js/lessons.js', 'r', encoding='utf-8') as f:
        lessons_text = f.read()
    send_cdp(205, "Runtime.compileScript", {"expression": lessons_text, "sourceURL": "lessons.js", "persistScript": False})
    res205 = recv_cdp(205)
    print("Compile lessons.js result:", res205.get("result", {}).get("exceptionDetails") or "Clean syntax!")

    send_cdp(206, "Runtime.evaluate", {"expression": "window.LCD_LESSONS_DATA ? 'loaded' : 'undefined'"})
    res206 = recv_cdp(206)
    print("window.LCD_LESSONS_DATA evaluation:", res206.get("result", {}).get("result", {}).get("value"))

    send_cdp(3, "Runtime.evaluate", {"expression": "document.getElementById('current-lab-label').textContent"})
    res3 = recv_cdp(3)
    print("Current Lab Label:", res3.get("result", {}).get("result", {}).get("value"))

    # 3. Check circuit view display
    send_cdp(4, "Runtime.evaluate", {"expression": "document.getElementById('lcd-circuit-view').style.display"})
    res4 = recv_cdp(4)
    print("LCD Circuit View SVG Display:", res4.get("result", {}).get("result", {}).get("value"))

    # 4. Check lesson 1 title
    send_cdp(5, "Runtime.evaluate", {"expression": "document.getElementById('lesson-title').textContent"})
    res5 = recv_cdp(5)
    print("Lesson 1 Title:", res5.get("result", {}).get("result", {}).get("value"))

    # 5. Check Boot Error
    send_cdp(6, "Runtime.evaluate", {"expression": "window.__bootError || 'NO BOOT ERROR'"})
    res6 = recv_cdp(6)
    print("Boot Error:", res6.get("result", {}).get("result", {}).get("value"))

    # 6. Click "Initialize I2C Bus (0x27)"
    send_cdp(7, "Runtime.evaluate", {"expression": "document.getElementById('btn-lcd-init') ? document.getElementById('btn-lcd-init').click() : false"})
    res7 = recv_cdp(7)
    print("Clicked Initialize I2C Bus:", res7.get("result", {}).get("result", {}).get("value"))

    time.sleep(1.0)

    # 7. Switch to Lesson 4 (Grand Capstone: IoT Command Deck Studio)
    send_cdp(8, "Runtime.evaluate", {"expression": "document.querySelectorAll('.lesson-tab')[3].click()"})
    res8 = recv_cdp(8)
    time.sleep(1.2)

    send_cdp(9, "Runtime.evaluate", {"expression": "document.getElementById('lesson-title').textContent"})
    res9 = recv_cdp(9)
    print("Lesson 4 Title:", res9.get("result", {}).get("result", {}).get("value"))

    # 8. Check SVG LCD Text Lines
    send_cdp(10, "Runtime.evaluate", {"expression": """({
        svg0: document.getElementById('lcd-svg-line-0').textContent,
        svg1: document.getElementById('lcd-svg-line-1').textContent,
        hud1: document.getElementById('hud-readout-1').textContent,
        hud2: document.getElementById('hud-readout-2').textContent,
        hud4: document.getElementById('hud-readout-4').textContent
    })""", "returnByValue": True})
    res10 = recv_cdp(10)
    print("Live LCD & HUD Telemetry:", res10.get("result", {}).get("result", {}).get("value"))

    # 9. Click "Launch IoT Command Deck"
    send_cdp(11, "Runtime.evaluate", {"expression": "document.getElementById('btn-lcd-deck') ? document.getElementById('btn-lcd-deck').click() : false"})
    res11 = recv_cdp(11)
    print("Clicked Launch IoT Command Deck:", res11.get("result", {}).get("result", {}).get("value"))

    time.sleep(1.0)

    # 10. Capture full-page screenshot
    send_cdp(12, "Page.captureScreenshot", {"format": "png"})
    res12 = recv_cdp(12)
    img_data = res12.get("result", {}).get("data")
    if img_data:
        screenshot_path = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\lcd_screen.png"
        with open(screenshot_path, "wb") as f:
            f.write(base64.b64decode(img_data))
        print(f"Screenshot successfully saved to: {screenshot_path}")
    else:
        print("Failed to capture screenshot")

finally:
    proc.terminate()
    proc.wait()
    print("Chrome terminated.")
