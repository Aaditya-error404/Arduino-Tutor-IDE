import os, sys, json, time, base64, urllib.request, subprocess

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)

import tempfile
temp_dir = tempfile.mkdtemp()
cdp_port = 9556

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1440,900"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.5)

import socket, urllib.parse

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
            if not chunk: raise EOFError()
            data += chunk
        return data

    def send_frame(self, data):
        payload = json.dumps(data).encode('utf-8')
        length = len(payload)
        frame = bytearray([0x81])
        mask = os.urandom(4)
        if length <= 125: frame.append(0x80 | length)
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
        if length == 126: length = int.from_bytes(self.recv_exact(2), 'big')
        elif length == 127: length = int.from_bytes(self.recv_exact(8), 'big')
        payload = self.recv_exact(length)
        if opcode == 0x1: return json.loads(payload.decode('utf-8'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        self.send_frame({"id": mid, "method": method, "params": params or {}})
        while True:
            frame = self.read_frame()
            if frame and frame.get("id") == mid:
                return frame.get("result", {})

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    session = CDPSession(page_tab["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})

    for _ in range(25):
        val = session.call("Runtime.evaluate", {"expression": "typeof window.useWorkbenchStore !== 'undefined'", "returnByValue": True})
        if val.get("result", {}).get("value"): break
        time.sleep(0.4)

    # Set to LDR lab, start simulation, switch to Sparky AI Coach, click "Why isn't my circuit working?"
    session.call("Runtime.evaluate", {"expression": """
        window.useWorkbenchStore.getState().setActiveLab('ldr');
        window.useWorkbenchStore.getState().setActiveLesson(3);
        window.useWorkbenchStore.getState().setActiveDockTab('coach');
        window.useWorkbenchStore.getState().startSimulation();
    """})
    time.sleep(1.0)

    # Trigger diagnostic click
    session.call("Runtime.evaluate", {"expression": """
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Why isn't my circuit working"));
        if (btn) btn.click();
    """})
    time.sleep(1.0)

    # Capture screenshot
    shot = session.call("Page.captureScreenshot", {"format": "png"})
    raw_b64 = shot.get("data")
    if raw_b64:
        artifact_path = r"C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\sparky_ai_coach_verified.png"
        with open(artifact_path, "wb") as f:
            f.write(base64.b64decode(raw_b64))
        print("SAVED SCREENSHOT TO:", artifact_path)

finally:
    proc.terminate()
