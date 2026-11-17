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
cdp_port = 9364
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1600,1050"
])

time.sleep(2.0)

class CDPSession:
    def __init__(self, ws_url):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        parsed = urllib.parse.urlparse(ws_url)
        self.sock.connect((parsed.hostname, parsed.port))
        key = base64.b64encode(os.urandom(16)).decode('utf-8')
        handshake = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(handshake.encode('utf-8'))
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(4096)
        self.msg_id = 0
        self.logs = []

    def send_frame(self, data):
        payload = json.dumps(data).encode('utf-8')
        length = len(payload)
        frame = bytearray([0x81])
        mask = os.urandom(4)
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))
        frame.extend(mask)
        masked_payload = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked_payload)
        self.sock.sendall(frame)

    def recv_frame(self):
        head = self.sock.recv(2)
        if not head:
            return None
        length = head[1] & 0x7f
        if length == 126:
            length = int.from_bytes(self.sock.recv(2), 'big')
        elif length == 127:
            length = int.from_bytes(self.sock.recv(8), 'big')
        data = bytearray()
        while len(data) < length:
            chunk = self.sock.recv(min(length - len(data), 65536))
            if not chunk:
                break
            data.extend(chunk)
        return json.loads(data.decode('utf-8', errors='ignore'))

    def call(self, method, params=None):
        self.msg_id += 1
        req = {"id": self.msg_id, "method": method, "params": params or {}}
        self.send_frame(req)
        while True:
            resp = self.recv_frame()
            if not resp:
                return None
            if resp.get("method") == "Runtime.consoleAPICalled":
                self.logs.append(resp["params"])
            elif resp.get("method") == "Runtime.exceptionThrown":
                self.logs.append({"exception": resp["params"]})
            elif resp.get("id") == self.msg_id:
                return resp

    def eval(self, js):
        res = self.call("Runtime.evaluate", {"expression": js, "returnByValue": True})
        if res and "result" in res and "result" in res["result"]:
            val = res["result"]["result"].get("value")
            return val
        return None

    def close(self):
        self.sock.close()

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json/list").read())
    page_tab = next(t for t in tabs if t.get("type") == "page")
    cdp = CDPSession(page_tab["webSocketDebuggerUrl"])
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    cdp.call("Page.navigate", {"url": "http://localhost:8080/?lab=servo"})
    time.sleep(2.0)

    # Inspect what happens step-by-step
    res = cdp.eval("""(() => {
        const btn = document.getElementById('btn-simulate');
        console.log("Found btn-simulate:", !!btn);
        btn.click();
        console.log("After click, sim.isRunning:", window.circuitSimulation.isRunning);
        return {
            btnHtml: btn.innerHTML,
            isRunning: window.circuitSimulation.isRunning
        };
    })()""")
    print("Eval result:", res)
    print("Captured logs:", json.dumps(cdp.logs, indent=2))

    # Now let's test calling start() directly
    res2 = cdp.eval("""(() => {
        try {
            window.circuitSimulation.start();
            return {
                isRunning: window.circuitSimulation.isRunning,
                timerId: !!window.circuitSimulation.timerId,
                activeLab: window.circuitSimulation.activeLab,
                activeLessonId: window.circuitSimulation.activeLessonId
            };
        } catch(e) {
            return { error: e.stack || e.message };
        }
    })()""")
    print("Direct start() result:", res2)
    time.sleep(1.0)
    print("Logs after start():", json.dumps(cdp.logs, indent=2))

    cdp.close()
finally:
    proc.terminate()
