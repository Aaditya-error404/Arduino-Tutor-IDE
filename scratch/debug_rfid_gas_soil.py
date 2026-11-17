import os, json, urllib.request, time, subprocess, tempfile, socket, base64

temp_dir = tempfile.mkdtemp()
cdp_port = 9711

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.5)

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
            f"Sec-WebSocket-Version: 13\r\n\r\n"
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
            try:
                return json.loads(payload.decode('utf-8'))
            except:
                return None
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method, "params": params or {}}
        self.send_frame(msg)
        while True:
            frame = self.read_frame()
            if not frame:
                continue
            if frame.get("id") == mid:
                return frame.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    session = CDPSession(page_tab["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Runtime.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})

    time.sleep(2.0)

    # 1. Debug RFID Lesson 3
    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('rfid');")
    session.evaluate("window.useWorkbenchStore.getState().setActiveLesson(3);")
    time.sleep(0.3)
    rfid_steps = session.evaluate("""
      (() => {
        const s = window.useWorkbenchStore.getState();
        return {
          vars: s.vars,
          setupSteps: s.compiled.setupSteps.map(st => ({ type: st.type, pin: st.pin, expr: st.expr, varName: st.varName, val: st.value })),
          loopSteps: s.compiled.loopSteps.map((st, i) => ({ i, type: st.type, cond: st.condition, jump: st.jumpIndex, pin: st.pin, expr: st.expr, varName: st.varName }))
        };
      })()
    """)
    print("=== RFID STEPS ===")
    print("Vars:", rfid_steps['vars'])
    print("Loop steps count:", len(rfid_steps['loopSteps']))
    for st in rfid_steps['loopSteps'][:15]:
        print(" ", st)

finally:
    try:
        proc.terminate()
    except:
        pass
