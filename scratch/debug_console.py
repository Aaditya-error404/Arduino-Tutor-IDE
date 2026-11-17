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
cdp_port = 9358
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox"
])
time.sleep(2.0)

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json", timeout=5).read().decode())
    target_tab = next(t for t in tabs if t.get("type") == "page")
    parsed = urllib.parse.urlparse(target_tab["webSocketDebuggerUrl"])
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((parsed.hostname, parsed.port))
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    handshake = (
        f"GET {parsed.path} HTTP/1.1\r\n"
        f"Host: {parsed.hostname}:{parsed.port}\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        "Sec-WebSocket-Version: 13\r\n\r\n"
    )
    sock.sendall(handshake.encode('utf-8'))
    resp = b""
    while b"\r\n\r\n" not in resp:
        resp += sock.recv(4096)

    def send_cdp(m, p):
        payload = json.dumps({"id": 1, "method": m, "params": p}).encode('utf-8')
        length = len(payload)
        frame = bytearray([0x81, 0x80 | length])
        mask = os.urandom(4)
        frame.extend(mask)
        frame.extend(payload[i] ^ mask[i % 4] for i in range(length))
        sock.sendall(frame)

    def recv_frames():
        sock.settimeout(2.0)
        frames = []
        try:
            while True:
                h = sock.recv(2)
                if not h: break
                l = h[1] & 0x7F
                if l == 126: l = int.from_bytes(sock.recv(2), 'big')
                d = sock.recv(l)
                frames.append(json.loads(d.decode('utf-8', errors='ignore')))
        except:
            pass
        return frames

    send_cdp("Log.enable", {})
    send_cdp("Runtime.enable", {})
    send_cdp("Page.navigate", {"url": "http://127.0.0.1:8080/?lab=dmm"})
    time.sleep(1.5)
    
    msgs = recv_frames()
    for m in msgs:
        if m.get("method") == "Runtime.exceptionThrown":
            print("EXCEPTION:", json.dumps(m["params"]["exceptionDetails"], indent=2))
        elif m.get("method") == "Log.entryAdded":
            print("LOG:", m["params"]["entry"])

finally:
    proc.terminate()
