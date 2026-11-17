import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket

sys.stdout.reconfigure(encoding='utf-8')

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)
if not chrome_bin:
    print("FATAL: Chrome not found.")
    sys.exit(1)

import tempfile
temp_dir = tempfile.mkdtemp()
cdp_port = 9542

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
            return json.loads(payload.decode('utf-8'))
        return None

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method, "params": params or {}}
        self.send_frame(msg)
        while True:
            frame = self.read_frame()
            if frame and frame.get("id") == mid:
                return frame.get("result", {})

    def evaluate(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    page_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    session = CDPSession(page_tab["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:5173/"})

    # Wait for store to be ready
    for _ in range(20):
        val = session.evaluate("typeof window.useWorkbenchStore !== 'undefined'")
        if val:
            break
        time.sleep(0.5)

    session.evaluate("window.useWorkbenchStore.getState().setActiveLab('lcd'); window.useWorkbenchStore.getState().setActiveLesson(1);")
    time.sleep(0.3)

    custom_lcd_cpp = """#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
}
void loop() {
  lcd.setCursor(0, 0);
  lcd.print("SparkByte v2");
  lcd.setCursor(0, 1);
  lcd.print("Aaditya Joshi");
  delay(500);
}"""

    session.evaluate(f"window.useWorkbenchStore.getState().setCustomCode({json.dumps(custom_lcd_cpp)});")
    time.sleep(0.2)

    compiled = session.evaluate("""({
        setupSteps: window.useWorkbenchStore.getState().compiled.setupSteps.map(s => ({ type: s.type, param: s.param, expr: s.expr, raw: s.rawCpp })),
        loopSteps: window.useWorkbenchStore.getState().compiled.loopSteps.map(s => ({ type: s.type, param: s.param, expr: s.expr, raw: s.rawCpp }))
    })""")
    print("COMPILED SETUP:", json.dumps(compiled.get("setupSteps"), indent=2))
    print("COMPILED LOOP:", json.dumps(compiled.get("loopSteps"), indent=2))

    for i in range(15):
        session.evaluate("window.useWorkbenchStore.getState().stepSimulation();")
        info = session.evaluate("""({
            step: window.useWorkbenchStore.getState().stepIndex,
            phase: window.useWorkbenchStore.getState().activePhase,
            delay: window.useWorkbenchStore.getState().stepRemainingDelayMs,
            lcdRow: window.useWorkbenchStore.getState().hardwareState.lcdRow,
            row0: window.useWorkbenchStore.getState().hardwareState.lcdTextRow0,
            row1: window.useWorkbenchStore.getState().hardwareState.lcdTextRow1,
            inst: window.useWorkbenchStore.getState().activeInstruction ? window.useWorkbenchStore.getState().activeInstruction.rawCpp : null
        })""")
        print(f"Step {i+1:2d}: phase={info['phase']} idx={info['step']} delay={info['delay']} row={info['lcdRow']} | row0='{info['row0']}' | row1='{info['row1']}' | inst={info['inst']}")

finally:
    proc.terminate()
