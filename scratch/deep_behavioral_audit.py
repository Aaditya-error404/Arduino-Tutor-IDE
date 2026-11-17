# -*- coding: utf-8 -*-
"""
Deep Behavioral & Interactive Simulation Audit for SparkByte Studio v2
Audits:
- Sensor-to-Code loops (temp, sonar, ir, dht, gas, soil)
- Protocol & Actuators (dmm, imu, rfid, iot, buzzer, led)
- Floating HUD collision / UI clipping checks
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, tempfile

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

temp_dir = tempfile.mkdtemp()
cdp_port = 9622

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1920,1080"
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
        self.console_logs = []
        self.page_errors = []

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
        mask = self.recv_exact(4)
        payload = bytearray(self.recv_exact(length))
        for i in range(length):
            payload[i] ^= mask[i % 4]
        return opcode, payload

    def call(self, method, params=None, timeout=10.0):
        self.msg_id += 1
        call_id = self.msg_id
        req = {"id": call_id, "method": method, "params": params or {}}
        self.send_frame(req)
        start = time.time()
        while time.time() - start < timeout:
            opcode, payload = self.read_frame()
            if opcode == 0x8:
                raise ConnectionError("CDP closed")
            res = json.loads(payload.decode('utf-8'))
            if res.get("method") == "Runtime.consoleAPICalled":
                args = res.get("params", {}).get("args", [])
                text = " ".join([str(a.get("value", a.get("description", ""))) for a in args])
                self.console_logs.append(text)
            if res.get("method") == "Runtime.exceptionThrown":
                details = res.get("params", {}).get("exceptionDetails", {})
                self.page_errors.append(details.get("text", "") + " " + str(details.get("exception", {})))
            if res.get("id") == call_id:
                if "error" in res:
                    raise RuntimeError(f"CDP error: {res['error']}")
                return res.get("result", {})
        raise TimeoutError(f"CDP call {method} timed out")

    def eval(self, expr):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        return res.get("result", {}).get("value")

try:
    tabs = json.loads(urllib.request.urlopen(f"http://localhost:{cdp_port}/json").read().decode('utf-8'))
    page_tab = next(t for t in tabs if t.get("type") == "page")
    cdp = CDPSession(page_tab["webSocketDebuggerUrl"])
    cdp.call("Runtime.enable")
    cdp.call("Page.enable")

    cdp.call("Page.navigate", {"url": "http://localhost:5173/"})
    time.sleep(3.0)

    print("=== CONNECTED TO SPARKBYTE STUDIO V2 LIVE WORKBENCH ===")

    # Helper function to switch lab and lesson via window.useWorkbenchStore
    cdp.eval("""
      window.testHelper = {
        getStore: () => window.__WORKBENCH_STORE__ || null,
        switchLab: (labId, lessonId = 1) => {
          // Find selector or use store directly
          const state = window.storeAccess ? window.storeAccess.getState() : null;
          if (window.__STORE__) {
            window.__STORE__.getState().setActiveLab(labId);
            window.__STORE__.getState().setActiveLesson(lessonId);
          }
        }
      };
      // Expose store if not already exposed
      const el = document.querySelector('#root');
    """)

    # Let's inspect store availability on window
    store_check = cdp.eval("""
      (() => {
        // Look for zustand store attached to window or window.useWorkbenchStore
        let s = window.useWorkbenchStore ? window.useWorkbenchStore.getState() : null;
        return {
          hasUseWorkbenchStore: !!window.useWorkbenchStore,
          hasWindowStore: !!window.__STORE__,
          activeLab: s ? s.activeLabId : null
        };
      })()
    """)
    print("Store check:", store_check)

    # If store isn't on window, let's expose it via DOM or click the lab selector dropdown!
    # Let's see available DOM elements in the top utility bar:
    dom_topbar = cdp.eval("""
      (() => {
        const topBar = document.querySelector('header') || document.querySelector('nav') || document.querySelector('.bg-slate-900');
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
        const selects = Array.from(document.querySelectorAll('select')).map(s => s.id || s.className);
        return {
          buttons: buttons.slice(0, 20),
          selects: selects
        };
      })()
    """)
    print("DOM elements:", dom_topbar)

    # Let's inspect how the lab selector is implemented in TopUtilityBar.tsx
    # We can select any lab by clicking the lab selector button or triggering its dropdown
    lab_selector = cdp.eval("""
      (() => {
        // Find dropdown button for lab selector
        const allBtns = Array.from(document.querySelectorAll('button'));
        const labBtn = allBtns.find(b => b.innerText.includes('Lab') || b.innerText.includes('Blink') || b.innerText.includes('▾'));
        return labBtn ? labBtn.innerText : 'NOT FOUND';
      })()
    """)
    print("Lab selector button:", lab_selector)

    # Let's test switching labs using the selector dropdown or inspecting the store
    # In App.tsx or main.tsx, let's attach store to window if needed
    cdp.eval("""
      // Hook into zustand if possible or use React Fiber
      const root = document.querySelector('#root');
      let fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'));
      console.log('Fiber key:', fiberKey);
    """)

    audit_results = {}

    # Define the 22 labs to audit
    all_22_labs = [
      'led', 'servo', 'button', 'pot', 'buzzer', 'cad', 'dmm', 'ldr',
      'rgb', 'temp', 'sonar', 'ir', 'slicer', 'dht', 'gas', 'lcd',
      'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'
    ]

    # Let's check how store is accessed in React components
    expose_script = """
      (() => {
        // If window.__WORKBENCH_STORE__ is not present, find it via React internal fiber
        if (window.__STORE__) return true;
        const findStore = (node) => {
          if (!node) return null;
          let key = Object.keys(node).find(k => k.startsWith('__reactFiber$'));
          if (!key) return null;
          let curr = node[key];
          while (curr) {
            if (curr.memoizedProps && curr.memoizedProps.store) return curr.memoizedProps.store;
            if (curr.memoizedState && curr.memoizedState.memoizedState && curr.memoizedState.memoizedState.store) {
              return curr.memoizedState.memoizedState.store;
            }
            curr = curr.return;
          }
          return null;
        };
        // Also check if any button or input onClick has access
        return false;
      })()
    """
    has_store = cdp.eval(expose_script)
    print("Has store:", has_store)

    # Let's test selecting labs via the TopUtilityBar UI:
    # Click the lab selector dropdown
    cdp.eval("""
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const labBtn = btns.find(b => b.innerText.includes('Lab') && (b.innerText.includes('▾') || b.innerText.includes('▼') || b.innerText.includes('Level')));
        if (labBtn) {
          labBtn.click();
          return 'CLICKED_LAB_DROPDOWN';
        }
        return 'NO_LAB_BTN';
      })()
    """)
    time.sleep(0.5)

    dropdown_items = cdp.eval("""
      (() => {
        // Check for menu items
        const menuItems = Array.from(document.querySelectorAll('.cursor-pointer, button')).map(el => el.innerText.trim()).filter(t => t.includes('Lab') || t.includes('Level'));
        return menuItems.slice(0, 15);
      })()
    """)
    print("Dropdown items visible:", dropdown_items)

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    try:
        proc.terminate()
    except:
        pass
