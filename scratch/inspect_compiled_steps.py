import json, urllib.request, time, subprocess, os, tempfile, socket, base64

temp_dir = tempfile.mkdtemp()
cdp_port = 9677

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

    # Wait for workbench store
    ready = False
    for _ in range(30):
        val = session.evaluate("typeof window.useWorkbenchStore !== 'undefined'")
        if val:
            ready = True
            break
        time.sleep(0.5)

    labs_to_inspect = [
        ('temp', 4),
        ('ir', 3),
        ('gas', 4),
        ('soil', 4),
        ('rfid', 3),
        ('iot', 3),
        ('buzzer', 3),
        ('led', 3)
    ]

    for lab_id, lesson_id in labs_to_inspect:
        session.evaluate(f"window.useWorkbenchStore.getState().setActiveLab('{lab_id}');")
        session.evaluate(f"window.useWorkbenchStore.getState().setActiveLesson({lesson_id});")
        time.sleep(0.2)
        info = session.evaluate("""
          (() => {
            const s = window.useWorkbenchStore.getState();
            return {
              labId: s.activeLabId,
              lessonId: s.activeLessonId,
              setupSteps: s.compiled.setupSteps,
              loopSteps: s.compiled.loopSteps,
              vars: s.vars
            };
          })()
        """)
        print(f"\n==================== LAB {lab_id} LESSON {lesson_id} ====================")
        print("Setup steps:", len(info['setupSteps']))
        for idx, st in enumerate(info['setupSteps']):
            print(f"  [setup {idx}] {st.get('type')} | pin:{st.get('pin')} | expr:{st.get('expr')} | val:{st.get('value')}")
        print("Loop steps:", len(info['loopSteps']))
        for idx, st in enumerate(info['loopSteps']):
            print(f"  [loop {idx}] type:{st.get('type')} | cond:{st.get('condition')} | jump:{st.get('jumpIndex')} | pin:{st.get('pin')} | expr:{st.get('expr')} | val:{st.get('value')}")

finally:
    try:
        proc.terminate()
    except:
        pass
