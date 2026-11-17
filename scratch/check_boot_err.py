import os, sys, json, time, base64, urllib.request, socket

cdp_port = 9347
proc = subprocess = __import__('subprocess').Popen([
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
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    handshake = f"GET {urllib.parse.urlparse(ws_url).path} HTTP/1.1\r\nHost: 127.0.0.1:{cdp_port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
    s.sendall(handshake.encode())
    s.recv(4096)

    def cdp(mid, method, params=None):
        pl = json.dumps({"id": mid, "method": method, "params": params or {}}).encode()
        mask = os.urandom(4)
        frame = bytearray([0x81, 0x80 | len(pl)]) + bytearray(pl[i] ^ mask[i % 4] for i in range(len(pl)))
        # fix length
        if len(pl) < 126:
            frame = bytearray([0x81, 0x80 | len(pl)]) + mask + bytearray(pl[i] ^ mask[i % 4] for i in range(len(pl)))
        s.sendall(frame)
        buf = s.recv(65536)
        while len(buf) < 2:
            buf += s.recv(65536)
        pl_len = buf[1] & 0x7F
        offset = 2
        if pl_len == 126:
            pl_len = int.from_bytes(buf[2:4], 'big')
            offset = 4
        while len(buf) < offset + pl_len:
            buf += s.recv(65536)
        return json.loads(buf[offset:offset+pl_len].decode('utf-8', errors='ignore'))

    cdp(1, "Page.navigate", {"url": "http://127.0.0.1:8080/?lab=servo"})
    time.sleep(2.0)
    res = cdp(2, "Runtime.evaluate", {"expression": "window.__bootError"})
    print("Direct window.__bootError:", res.get("result", {}).get("result", {}).get("value"))
finally:
    proc.terminate()
