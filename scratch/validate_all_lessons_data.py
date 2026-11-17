import json
import re

# We can parse the arrays from lessons.js using regex or node/CDP
# Let's inspect via CDP to get the exact evaluated window.*_LESSONS_DATA objects
import socket, subprocess, time, urllib.request, base64

cdp_port = 9351
proc = subprocess.Popen([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox"
])
time.sleep(1.5)

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    s = socket.create_connection(("127.0.0.1", cdp_port), timeout=5)
    key = base64.b64encode(os.urandom(16)).decode('utf-8') if 'os' in globals() else "dGhlIHNhbXBsZSBub25jZQ=="
    import os
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    handshake = f"GET {urllib.parse.urlparse(ws_url).path} HTTP/1.1\r\nHost: 127.0.0.1:{cdp_port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
    s.sendall(handshake.encode())
    s.recv(4096)

    def cdp(mid, method, params=None):
        pl = json.dumps({"id": mid, "method": method, "params": params or {}}).encode()
        mask = os.urandom(4)
        if len(pl) < 126:
            frame = bytearray([0x81, 0x80 | len(pl)]) + mask + bytearray(pl[i] ^ mask[i % 4] for i in range(len(pl)))
        else:
            frame = bytearray([0x81, 0x80 | 126]) + len(pl).to_bytes(2, 'big') + mask + bytearray(pl[i] ^ mask[i % 4] for i in range(len(pl)))
        s.sendall(frame)
        buf = bytearray()
        while len(buf) < 2:
            buf += s.recv(65536)
        pl_len = buf[1] & 0x7F
        offset = 2
        if pl_len == 126:
            while len(buf) < 4:
                buf += s.recv(65536)
            pl_len = int.from_bytes(buf[2:4], 'big')
            offset = 4
        while len(buf) < offset + pl_len:
            buf += s.recv(65536)
        return json.loads(buf[offset:offset+pl_len].decode('utf-8', errors='ignore'))

    cdp(1, "Page.navigate", {"url": "http://127.0.0.1:8080/?lab=servo"})
    time.sleep(2.0)

    labs = [
        ("led", "LED_LESSONS_DATA"),
        ("servo", "SERVO_LESSONS_DATA"),
        ("button", "BUTTON_LESSONS_DATA"),
        ("pot", "POT_LESSONS_DATA"),
        ("buzzer", "BUZZER_LESSONS_DATA"),
        ("ldr", "LDR_LESSONS_DATA"),
        ("rgb", "RGB_LESSONS_DATA"),
        ("temp", "TEMP_LESSONS_DATA"),
        ("sonar", "SONAR_LESSONS_DATA"),
        ("ir", "IR_LESSONS_DATA"),
        ("lcd", "LCD_LESSONS_DATA")
    ]

    all_data_issues = []

    for lab_id, var_name in labs:
        res = cdp(100, "Runtime.evaluate", {
            "expression": f"window.{var_name}",
            "returnByValue": True
        })
        val = res.get("result", {}).get("result", {}).get("value")
        if not val:
            all_data_issues.append(f"{var_name}: NOT FOUND or EMPTY on window!")
            continue

        if len(val) != 4:
            all_data_issues.append(f"{var_name}: Contains {len(val)} lessons, expected exactly 4!")

        for l_idx, l in enumerate(val):
            l_id = l.get("id")
            title = l.get("title")
            shortTitle = l.get("shortTitle")
            mascot = l.get("mascotMsg")
            teacher = l.get("teacherMode")
            analogy = l.get("analogy")

            if not title:
                all_data_issues.append(f"{var_name}[{l_idx}]: Missing title!")
            if not shortTitle:
                all_data_issues.append(f"{var_name}[{l_idx}]: Missing shortTitle!")
            if not mascot:
                all_data_issues.append(f"{var_name}[{l_idx}]: Missing mascotMsg!")
            if not teacher:
                all_data_issues.append(f"{var_name}[{l_idx}]: Missing teacherMode!")
            else:
                if not teacher.get("pedagogy") and not teacher.get("pedagogyTitle"):
                    all_data_issues.append(f"{var_name}[{l_idx}]: Incomplete teacherMode pedagogy!")
                if not teacher.get("misconceptions"):
                    all_data_issues.append(f"{var_name}[{l_idx}]: Missing teacherMode misconceptions!")

    print(f"\nTotal Data / Schema Issues Found Across 44 Lessons: {len(all_data_issues)}")
    for issue in all_data_issues:
        print("  -", issue)

finally:
    proc.terminate()
    proc.wait()
