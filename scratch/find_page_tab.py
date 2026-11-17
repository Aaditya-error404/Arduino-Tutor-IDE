import subprocess, time, tempfile, json, urllib.request, socket, base64, os, urllib.parse

chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
temp_dir = tempfile.mkdtemp()
cdp_port = 9615

p = subprocess.Popen([
    chrome_bin,
    f'--remote-debugging-port={cdp_port}',
    f'--user-data-dir={temp_dir}',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox'
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2)

tabs = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{cdp_port}/json').read())
page_tab = next(t for t in tabs if t.get('type') == 'page')
ws_url = page_tab['webSocketDebuggerUrl']

parsed = urllib.parse.urlparse(ws_url)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((parsed.hostname, parsed.port))
key = base64.b64encode(os.urandom(16)).decode('utf-8')
handshake = f'GET {parsed.path} HTTP/1.1\r\nHost: {parsed.hostname}:{parsed.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'
sock.sendall(handshake.encode('utf-8'))
resp = b''
while b'\r\n\r\n' not in resp:
    resp += sock.recv(4096)

def send_frame(data):
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
    sock.sendall(frame)

def read_frame():
    head = sock.recv(2)
    length = head[1] & 0x7F
    if length == 126: length = int.from_bytes(sock.recv(2), 'big')
    elif length == 127: length = int.from_bytes(sock.recv(8), 'big')
    payload = b''
    while len(payload) < length: payload += sock.recv(length - len(payload))
    return json.loads(payload.decode('utf-8', errors='ignore'))

mid = 1
def call(m, params=None):
    global mid
    mid += 1
    cid = mid
    send_frame({'id': cid, 'method': m, 'params': params or {}})
    while True:
        r = read_frame()
        if r.get('id') == cid: return r.get('result', {})

print('Navigating to http://localhost:5173/ ...')
call('Page.navigate', {'url': 'http://localhost:5173/'})
time.sleep(3.0)

print('Evaluating store on page...')
res = call('Runtime.evaluate', {'expression': '!!window.useWorkbenchStore', 'returnByValue': True})
print('Store loaded:', res.get('result', {}).get('value'))

res2 = call('Runtime.evaluate', {'expression': 'window.useWorkbenchStore.getState().activeLabId', 'returnByValue': True})
print('Initial activeLabId:', res2.get('result', {}).get('value'))

# Test startSimulation and stepping
print('Starting simulation...')
call('Runtime.evaluate', {'expression': 'window.useWorkbenchStore.getState().startSimulation()'})
time.sleep(0.5)

res3 = call('Runtime.evaluate', {'expression': 'window.useWorkbenchStore.getState().isRunning', 'returnByValue': True})
print('isRunning after start:', res3.get('result', {}).get('value'))

res4 = call('Runtime.evaluate', {'expression': 'window.useWorkbenchStore.getState().stepIndex', 'returnByValue': True})
print('stepIndex:', res4.get('result', {}).get('value'))

res5 = call('Runtime.evaluate', {'expression': 'window.useWorkbenchStore.getState().completedLessons', 'returnByValue': True})
print('completedLessons:', res5.get('result', {}).get('value'))

p.terminate()
print('Success!')
