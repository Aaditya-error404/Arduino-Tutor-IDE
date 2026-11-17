import os, sys, json, time, base64, urllib.request, subprocess, socket

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cdp_port = 9401

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "http://localhost:8080/index.html"
])
time.sleep(2.0)

class CDPSession:
    def __init__(self, ws_url):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        import urllib.parse
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

    def recv_exact(self, n):
        data = b""
        while len(data) < n:
            chunk = self.sock.recv(n - len(data))
            if not chunk:
                raise EOFError("Socket closed")
            data += chunk
        return data

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
        frame.extend(payload[i] ^ mask[i % 4] for i in range(length))
        self.sock.sendall(frame)

    def read_frame(self):
        head = self.recv_exact(2)
        opcode = head[0] & 0x0F
        length = head[1] & 0x7F
        if length == 126:
            length = int.from_bytes(self.recv_exact(2), 'big')
        elif length == 127:
            length = int.from_bytes(self.recv_exact(8), 'big')
        payload = self.recv_exact(length)
        if opcode == 0x1:
            return json.loads(payload.decode('utf-8', errors='ignore'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        self.send_frame({"id": cid, "method": method, "params": params or {}})
        while True:
            resp = self.read_frame()
            if resp and resp.get("id") == cid:
                return resp.get("result", {})

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    session = CDPSession(ws_url)

    session.call("Page.enable")
    time.sleep(1.0)

    def eval_js(expr):
        res = session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    labs = [
        'servo', 'led', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp',
        'sonar', 'ir', 'lcd', 'dmm', 'cad', 'slicer', 'dht', 'gas',
        'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
    ]

    results = []
    for lab in labs:
        # Switch lab
        eval_js(f"window.switchLab('{lab}', true);")
        time.sleep(0.3)
        # Ensure stopped
        eval_js("window.circuitSimulation.stop();")
        time.sleep(0.1)

        # Click Start Simulation button
        click_info = eval_js("""
        (() => {
            const btn = document.getElementById('btn-simulate');
            if (btn) btn.click();
            return {
                clicked: !!btn,
                isRunning: window.circuitSimulation ? window.circuitSimulation.isRunning : false
            };
        })()
        """)

        # Wait 0.8s
        time.sleep(0.8)

        # Check status
        stat = eval_js("""
        (() => {
            const sim = window.circuitSimulation;
            const executingRows = document.querySelectorAll('.code-row.executing');
            const plainExec = document.querySelectorAll('.code-row-human.executing');
            const cppExec = document.querySelectorAll('.code-row-cpp.executing');
            const badge = document.getElementById('loop-cycle-badge');

            return {
                isRunning: sim ? sim.isRunning : false,
                stepCount: sim ? sim.stepCount : 0,
                loopCount: sim ? sim.loopCount : 0,
                badgeText: badge ? badge.textContent : '',
                executingTotal: executingRows.length,
                plainExec: plainExec.length,
                cppExec: cppExec.length
            };
        })()
        """)
        results.append({
            "lab": lab,
            "click_ok": click_info.get("isRunning"),
            "stat": stat
        })

    print(json.dumps(results, indent=2))

finally:
    proc.terminate()
    proc.wait()
