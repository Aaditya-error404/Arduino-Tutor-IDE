import urllib.request, json, time, subprocess, socket, base64, os
chrome_bin = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([chrome_bin, '--remote-debugging-port=9399', '--headless=new', '--disable-gpu', '--no-sandbox', 'http://localhost:8080/index.html?lab=servo'])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9399/json').read())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    s = socket.socket()
    import urllib.parse
    parsed = urllib.parse.urlparse(ws_url)
    s.connect((parsed.hostname, parsed.port))
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    s.sendall(f"GET {parsed.path} HTTP/1.1\r\nHost: {parsed.hostname}:{parsed.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n".encode('utf-8'))
    while b'\r\n\r\n' not in s.recv(4096): pass
    
    cmd = {'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': '''
    (() => {
        const labs = ['servo', 'led', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'dmm', 'cad', 'slicer', 'dht', 'gas', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot'];
        const results = [];
        for (const lab of labs) {
            try {
                window.switchLab(lab, true);
                const banner = document.querySelector('.coach-banner');
                const interact = document.getElementById('lesson-interactive-area');
                const ribbon = lab === 'motor' ? !!document.getElementById('l298n-jumper-ribbon') : true;
                results.push({ lab, ok: true, bannerW: banner ? banner.clientWidth : 0, ribbon });
            } catch(e) {
                results.push({ lab, ok: false, error: e.message });
            }
        }
        return results;
    })()
    ''', 'returnByValue': True}}
    payload = json.dumps(cmd).encode('utf-8')
    frame = bytearray([0x81, 0x80 | len(payload)]) + os.urandom(4)
    frame.extend(payload[i] ^ frame[2 + (i % 4)] for i in range(len(payload)))
    s.sendall(frame)
    time.sleep(1.0)
    resp = b''
    while True:
        chunk = s.recv(4096)
        if not chunk: break
        resp += chunk
        if b'"id":1' in resp: break
    idx = resp.find(b'{"id":1')
    if idx != -1:
        res = json.loads(resp[idx:].decode('utf-8', errors='ignore'))
        val = res.get('result', {}).get('result', {}).get('value', [])
        all_ok = all(r.get('ok') for r in val)
        print('All 22 labs switched with zero errors:', all_ok, f'({len(val)}/22)')
finally:
    p.terminate()
