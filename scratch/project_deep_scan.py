import os
import sys
import json
import re
import urllib.request
import urllib.parse
import subprocess
import socket
import time
import base64

print("="*70)
print("SPARKBYTE ARDUINO VIRTUAL TUTOR: COMPREHENSIVE PROJECT SCAN")
print("="*70)

issues = []

def report_issue(category, severity, item, message):
    issues.append({
        "category": category,
        "severity": severity,
        "item": item,
        "message": message
    })
    print(f"[{severity.upper()}] [{category}] {item}: {message}")

# =========================================================================
# 1. STATIC SCAN: lessons.js
# =========================================================================
print("\n[Phase 1] Static Scan: js/lessons.js...")

with open("js/lessons.js", "r", encoding="utf-8") as f:
    lessons_raw = f.read()

# Check exports at the bottom
expected_exports = [
    "window.LESSONS_DATA", "window.LED_LESSONS_DATA", "window.SERVO_LESSONS_DATA",
    "window.POT_LESSONS_DATA", "window.BUTTON_LESSONS_DATA", "window.BUZZER_LESSONS_DATA",
    "window.LDR_LESSONS_DATA", "window.RGB_LESSONS_DATA", "window.TEMP_LESSONS_DATA",
    "window.SONAR_LESSONS_DATA", "window.IR_LESSONS_DATA", "window.LCD_LESSONS_DATA"
]
for exp in expected_exports:
    if exp not in lessons_raw:
        report_issue("lessons.js", "HIGH", exp, "Missing global window export in js/lessons.js")

# Check for unexpected string templates or unescaped quotes
suspicious_quotes = re.findall(r'line:\s*"[^\n"]*"[^\n"]*"', lessons_raw)
for sq in suspicious_quotes:
    report_issue("lessons.js", "HIGH", "Syntax", f"Possible unescaped inner quotes in line definition: {sq}")

# =========================================================================
# 2. STATIC SCAN: index.html DOM IDs & Duplicates
# =========================================================================
print("\n[Phase 2] Static Scan: index.html for Duplicate IDs & Integrity...")

with open("index.html", "r", encoding="utf-8") as f:
    html_raw = f.read()

id_matches = re.findall(r'\bid=["\']([^"\']+)["\']', html_raw)
id_counts = {}
for id_val in id_matches:
    id_counts[id_val] = id_counts.get(id_val, 0) + 1

duplicate_ids = {k: v for k, v in id_counts.items() if v > 1}
if duplicate_ids:
    for dup_id, count in duplicate_ids.items():
        report_issue("index.html", "MEDIUM", f"Duplicate ID: #{dup_id}", f"Appears {count} times in index.html (violates HTML spec, breaks document.getElementById)")
else:
    print("  ✓ Zero duplicate IDs found in index.html.")

# Check for missing favicon
if "favicon.ico" not in html_raw and '<link rel="icon"' not in html_raw:
    report_issue("index.html", "LOW", "Favicon", "No favicon link tag found; causes browser 404 request on every initial load")

# =========================================================================
# 3. STATIC SCAN: css/styles.css Brace Balance & Syntax
# =========================================================================
print("\n[Phase 3] Static Scan: css/styles.css Brace Balance...")

with open("css/styles.css", "r", encoding="utf-8") as f:
    css_raw = f.read()

open_braces = css_raw.count("{")
close_braces = css_raw.count("}")
if open_braces != close_braces:
    report_issue("styles.css", "HIGH", "Brace Balance", f"Mismatched braces: {open_braces} open vs {close_braces} close")
else:
    print(f"  ✓ CSS Braces balanced perfectly ({open_braces} rules).")

# =========================================================================
# 4. STATIC SCAN: verifyCondition handling in app.js
# =========================================================================
print("\n[Phase 4] Static Scan: verifyCondition coverage in js/app.js...")

with open("js/app.js", "r", encoding="utf-8") as f:
    app_raw = f.read()

# Extract verifyCondition from lessons.js
verify_conditions = set(re.findall(r'verifyCondition:\s*["\']([^"\']+)["\']', lessons_raw))
print(f"  Found {len(verify_conditions)} unique verification conditions in lessons.js.")

for cond in sorted(verify_conditions):
    if cond not in app_raw:
        report_issue("app.js", "HIGH", f"Verification: {cond}", f"Condition defined in lessons.js but NEVER handled or mentioned in js/app.js! Students cannot pass this task!")

# Check for getElementById references in app.js that don't exist in index.html or generated DOM
app_id_refs = set(re.findall(r'getElementById\(["\']([^"\']+)["\']\)', app_raw))
print(f"  Found {len(app_id_refs)} document.getElementById calls in app.js.")

# Filter out dynamically generated IDs
dynamic_prefixes = ["lcd-", "ir-", "sonar-", "pot-", "btn-", "temp-", "rgb-", "ldr-", "buzzer-", "piano-", "step-", "code-row-"]
missing_static_ids = []
for ref_id in app_id_refs:
    if ref_id not in id_counts:
        # Check if it's generated dynamically in app.js
        if not any(f'id="{ref_id}"' in app_raw or f"id='{ref_id}'" in app_raw or f'id=\"{ref_id}\"' in app_raw for _ in [1]):
            missing_static_ids.append(ref_id)

if missing_static_ids:
    for mid in missing_static_ids:
        report_issue("DOM Alignment", "MEDIUM", f"Missing ID: #{mid}", "Referenced in app.js getElementById() but not found in index.html or dynamic templates")
else:
    print("  ✓ All document.getElementById references are accounted for.")

# =========================================================================
# 5. RUNTIME CDP SCAN ACROSS ALL 44 LESSONS
# =========================================================================
print("\n[Phase 5] Headless Chrome CDP Runtime Audit Across All 44 Lessons...")

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)

if not chrome_bin:
    print("  [SKIP] Chrome not found for runtime CDP audit.")
else:
    cdp_port = 9349
    proc = subprocess.Popen([
        chrome_bin,
        f"--remote-debugging-port={cdp_port}",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--window-size=1440,900"
    ])
    time.sleep(2.0)

    try:
        tabs_url = f"http://127.0.0.1:{cdp_port}/json"
        req = urllib.request.urlopen(tabs_url, timeout=5)
        tabs = json.loads(req.read().decode())
        target_tab = next(t for t in tabs if t.get("type") == "page")
        ws_url = target_tab["webSocketDebuggerUrl"]

        key = base64.b64encode(os.urandom(16)).decode('utf-8')
        parsed = urllib.parse.urlparse(ws_url)
        host, port = parsed.hostname, parsed.port
        path = parsed.path

        s = socket.create_connection((host, port), timeout=5)
        handshake = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}:{port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(handshake.encode('utf-8'))
        resp = s.recv(4096)
        if b"101 " not in resp:
            print("  WebSocket handshake failed")
            sys.exit(1)

        msg_counter = 1
        console_errors = []
        network_404s = []

        def send_cdp(method, params=None):
            global msg_counter
            mid = msg_counter
            msg_counter += 1
            payload = json.dumps({"id": mid, "method": method, "params": params or {}}).encode('utf-8')
            frame = bytearray([0x81])
            length = len(payload)
            if length < 126:
                frame.append(0x80 | length)
            elif length < 65536:
                frame.append(0x80 | 126)
                frame.extend(length.to_bytes(2, 'big'))
            else:
                frame.append(0x80 | 127)
                frame.extend(length.to_bytes(8, 'big'))
            mask = os.urandom(4)
            frame.extend(mask)
            masked = bytearray(payload[i] ^ mask[i % 4] for i in range(length))
            frame.extend(masked)
            s.sendall(frame)
            return mid

        def recv_cdp(expected_id=None, timeout=3.0):
            s.settimeout(timeout)
            buf = bytearray()
            start_t = time.time()
            while time.time() - start_t < timeout:
                try:
                    chunk = s.recv(65536)
                    if not chunk:
                        break
                    buf.extend(chunk)
                    while len(buf) >= 2:
                        payload_len = buf[1] & 0x7F
                        offset = 2
                        if payload_len == 126:
                            if len(buf) < 4:
                                break
                            payload_len = int.from_bytes(buf[2:4], 'big')
                            offset = 4
                        elif payload_len == 127:
                            if len(buf) < 10:
                                break
                            payload_len = int.from_bytes(buf[2:10], 'big')
                            offset = 10
                        if len(buf) < offset + payload_len:
                            break
                        payload = buf[offset:offset+payload_len]
                        buf = buf[offset+payload_len:]
                        try:
                            data = json.loads(payload.decode('utf-8', errors='ignore'))
                            # Check console or runtime error events
                            if data.get("method") == "Runtime.exceptionThrown":
                                exc = data.get("params", {}).get("exceptionDetails", {})
                                text = exc.get("exception", {}).get("description") or exc.get("text")
                                console_errors.append(text)
                            elif data.get("method") == "Log.entryAdded":
                                entry = data.get("params", {}).get("entry", {})
                                if entry.get("level") in ["error", "warning"]:
                                    console_errors.append(f"{entry.get('level')}: {entry.get('text')}")
                            elif data.get("method") == "Network.responseReceived":
                                resp_obj = data.get("params", {}).get("response", {})
                                if resp_obj.get("status") >= 400:
                                    network_404s.append(f"{resp_obj.get('status')} {resp_obj.get('url')}")

                            if expected_id is not None and data.get("id") == expected_id:
                                return data
                        except Exception:
                            pass
                except socket.timeout:
                    break
            return {}

        def eval_js(expr):
            mid = send_cdp("Runtime.evaluate", {"expression": expr, "returnByValue": True})
            res = recv_cdp(mid)
            return res.get("result", {}).get("result", {}).get("value")

        # Enable events
        mid = send_cdp("Network.enable")
        recv_cdp(mid)
        mid = send_cdp("Network.clearBrowserCache")
        recv_cdp(mid)
        mid = send_cdp("Network.setCacheDisabled", {"cacheDisabled": True})
        recv_cdp(mid)
        mid = send_cdp("Runtime.enable")
        recv_cdp(mid)
        mid = send_cdp("Log.enable")
        recv_cdp(mid)

        # Navigate
        mid = send_cdp("Page.navigate", {"url": "http://127.0.0.1:8080/?lab=led"})
        recv_cdp(mid)
        time.sleep(2.0)

        labs = ['led', 'servo', 'button', 'pot', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd']
        
        for lab in labs:
            eval_js(f"window.switchLab('{lab}', true)")
            time.sleep(0.4)

            # Check lab label
            lab_label = eval_js("document.getElementById('current-lab-label').textContent")
            svg_disp = eval_js(f"document.getElementById('{lab}-circuit-view') ? document.getElementById('{lab}-circuit-view').style.display : 'missing'")
            
            if svg_disp != "block":
                report_issue("SVG Visibility", "HIGH", f"Lab {lab}", f"SVG view display is '{svg_disp}', expected 'block'")

            # Now test all 4 lessons in this lab
            for l_idx in range(4):
                eval_js(f"document.querySelectorAll('.lesson-tab')[{l_idx}] ? document.querySelectorAll('.lesson-tab')[{l_idx}].click() : false")
                time.sleep(0.3)

                # Check lesson title
                l_title = eval_js("document.getElementById('lesson-title').textContent")
                if not l_title or l_title == "Lesson Title":
                    report_issue("Lesson Title", "HIGH", f"{lab} Lesson {l_idx+1}", "Lesson title is missing or default")

                # Check for 'undefined' in rendered text
                has_undefined = eval_js("""
                    (function() {
                        const body = document.getElementById('lesson-detail-container');
                        return body && body.innerText.includes('undefined');
                    })()
                """)
                if has_undefined:
                    report_issue("UI Text Quality", "MEDIUM", f"{lab} Lesson {l_idx+1}", "Contains literal string 'undefined' in lesson view")

                # Check plain English code translation rows
                plain_rows = eval_js("document.querySelectorAll('.code-row-human').length")
                cpp_rows = eval_js("document.querySelectorAll('.code-row-cpp').length")
                if plain_rows == 0 or cpp_rows == 0:
                    report_issue("Code Translation", "HIGH", f"{lab} Lesson {l_idx+1}", f"Missing translation rows: plain={plain_rows}, cpp={cpp_rows}")

                # Check Teacher Mode modal content
                eval_js("document.getElementById('teacher-modal-btn') ? document.getElementById('teacher-modal-btn').click() : false")
                time.sleep(0.1)
                modal_hidden = eval_js("document.getElementById('teacher-modal').classList.contains('hidden')")
                modal_content_len = eval_js("document.getElementById('teacher-modal-content').textContent.length")
                if modal_hidden or modal_content_len < 20:
                    report_issue("Teacher Mode", "HIGH", f"{lab} Lesson {l_idx+1}", f"Teacher modal did not open or content is empty (len={modal_content_len})")
                eval_js("document.getElementById('close-teacher-modal') ? document.getElementById('close-teacher-modal').click() : false")

                # Check Oscilloscope
                scope_active = eval_js("""
                    (function() {
                        const canvas = document.getElementById('scope-canvas');
                        return canvas && canvas.width > 0 && canvas.height > 0;
                    })()
                """)
                if not scope_active:
                    report_issue("Oscilloscope", "MEDIUM", f"{lab} Lesson {l_idx+1}", "Scope canvas is missing or 0x0")

        # Check collected runtime errors
        for net_err in network_404s:
            report_issue("Network", "LOW", "404 Resource", net_err)

        for c_err in console_errors:
            report_issue("Console Error", "HIGH", "Runtime", c_err)

    finally:
        proc.terminate()
        proc.wait()

print("\n" + "="*70)
print(f"SCAN COMPLETE: Found {len(issues)} potential issue(s).")
print("="*70)

# Save JSON report
with open("scratch/scan_report.json", "w", encoding="utf-8") as f:
    json.dump(issues, f, indent=2)

print("Report saved to scratch/scan_report.json.")
