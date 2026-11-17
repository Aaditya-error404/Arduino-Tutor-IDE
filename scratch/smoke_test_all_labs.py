import os
import sys
import json
import time
import base64
import urllib.request
import urllib.parse
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

cdp_port = 9346
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

labs_to_test = [
    ("led", "LED Digital Blink Lab", "led-circuit-view"),
    ("servo", "Servo Motor SG90 Lab", "servo-circuit-view"),
    ("button", "Tactile Pushbutton Lab", "button-circuit-view"),
    ("pot", "10k Potentiometer Lab", "pot-circuit-view"),
    ("buzzer", "Piezo Buzzer & Tone Lab", "buzzer-circuit-view"),
    ("ldr", "LDR Light Sensor & Streetlight Lab", "ldr-circuit-view"),
    ("rgb", "RGB Multi-Color LED & PWM Lab", "rgb-circuit-view"),
    ("temp", "Temperature Sensor TMP36 & HVAC Lab", "temp-circuit-view"),
    ("sonar", "HC-SR04 Ultrasonic Distance Sensor & Radar Lab", "sonar-circuit-view"),
    ("ir", "TCRT5000 IR Reflective & Line Sensor Lab", "ir-circuit-view"),
    ("lcd", "16x2 I2C Character LCD Display Lab", "lcd-circuit-view")
]

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

    msg_counter = 1

    def send_cdp(method, params=None):
        global msg_counter
        mid = msg_counter
        msg_counter += 1
        payload = json.dumps({"id": mid, "method": method, "params": params or {}}).encode('utf-8')
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
        return mid

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

    # Enable network & disable cache
    mid = send_cdp("Network.enable")
    recv_cdp(mid)
    mid = send_cdp("Network.clearBrowserCache")
    recv_cdp(mid)
    mid = send_cdp("Network.setCacheDisabled", {"cacheDisabled": True})
    recv_cdp(mid)
    mid = send_cdp("Runtime.enable")
    recv_cdp(mid)

    # Initial navigate
    mid = send_cdp("Page.navigate", {"url": "http://127.0.0.1:8080/?lab=servo"})
    recv_cdp(mid)
    time.sleep(2.0)

    results = []

    for lab_id, expected_title, circuit_svg_id in labs_to_test:
        print(f"\n--- Testing Lab: {lab_id.upper()} ({expected_title}) ---")
        
        # Click the tab button or invoke window.switchLab
        mid = send_cdp("Runtime.evaluate", {"expression": f"window.switchLab ? (window.switchLab('{lab_id}', true), true) : (document.getElementById('lab-btn-{lab_id}') ? (document.getElementById('lab-btn-{lab_id}').click(), true) : false)"})
        recv_cdp(mid)
        time.sleep(0.6)

        # Check title
        mid = send_cdp("Runtime.evaluate", {"expression": "document.getElementById('current-lab-label').textContent"})
        res = recv_cdp(mid)
        title_val = res.get("result", {}).get("result", {}).get("value", "")

        # Check circuit view visibility
        mid = send_cdp("Runtime.evaluate", {"expression": f"document.getElementById('{circuit_svg_id}') ? document.getElementById('{circuit_svg_id}').style.display : 'missing'"})
        res = recv_cdp(mid)
        svg_display = res.get("result", {}).get("result", {}).get("value", "")

        # Check lesson tab count
        mid = send_cdp("Runtime.evaluate", {"expression": "document.querySelectorAll('.lesson-tab').length"})
        res = recv_cdp(mid)
        tab_count = res.get("result", {}).get("result", {}).get("value", 0)

        # Check first lesson title
        mid = send_cdp("Runtime.evaluate", {"expression": "document.getElementById('lesson-title') ? document.getElementById('lesson-title').textContent : 'missing'"})
        res = recv_cdp(mid)
        lesson_title = res.get("result", {}).get("result", {}).get("value", "")

        # Check boot error
        mid = send_cdp("Runtime.evaluate", {"expression": "window.__bootError || 'NO ERROR'"})
        res = recv_cdp(mid)
        boot_err = res.get("result", {}).get("result", {}).get("value", "")

        passed = (title_val == expected_title) and (svg_display == "block") and (tab_count == 4) and (boot_err == "NO ERROR")
        results.append({
            "lab": lab_id,
            "title": title_val,
            "svg_id": circuit_svg_id,
            "svg_display": svg_display,
            "tab_count": tab_count,
            "lesson_title": lesson_title,
            "boot_error": boot_err,
            "passed": passed
        })

        print(f"  Title: {title_val} (expected: {expected_title})")
        print(f"  SVG Display: {svg_display}")
        print(f"  Lesson Tabs: {tab_count}")
        print(f"  Lesson 1: {lesson_title}")
        print(f"  Status: {'PASS' if passed else 'FAIL'}")

    print("\n" + "="*60)
    print("ALL 11 LABS SMOKE TEST SUMMARY:")
    all_pass = all(r["passed"] for r in results)
    for r in results:
        status_icon = "PASS" if r["passed"] else "FAIL"
        print(f"  [{status_icon}] Lab {r['lab']:<8}: {r['title']} ({r['tab_count']} lessons)")

    print(f"\nFinal Result: {'100% ALL 11 LABS PASSED (44 LESSONS READY)' if all_pass else 'SOME LABS FAILED'}")

    # Switch to LCD lab (capstone) and take full screenshot
    mid = send_cdp("Runtime.evaluate", {"expression": "window.switchLab('lcd', true)"})
    recv_cdp(mid)
    time.sleep(1.0)

    # Capture final comprehensive screenshot
    mid = send_cdp("Page.captureScreenshot", {"format": "png"})
    res = recv_cdp(mid)
    img_data = res.get("result", {}).get("data")
    if img_data:
        screen_path = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\all_labs_verified.png"
        with open(screen_path, "wb") as f:
            f.write(base64.b64decode(img_data))
        print(f"Comprehensive screenshot saved: {screen_path}")

finally:
    proc.terminate()
    proc.wait()
    print("Chrome terminated.")
