# -*- coding: utf-8 -*-
"""
Verification of Visual Animations & Actuator Gating across all 22 labs in SparkByte Studio v2
"""

import os, sys, json, time, base64, urllib.request, urllib.parse, subprocess, socket, tempfile

sys.stdout.reconfigure(encoding='utf-8')

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
temp_dir = tempfile.mkdtemp()
cdp_port = 9699

proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    f"--user-data-dir={temp_dir}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1920,1080"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))
        frame.extend(mask)
        masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked)
        self.sock.sendall(frame)

    def recv_frame(self):
        h = self.recv_exact(2)
        payload_len = h[1] & 0x7F
        if payload_len == 126:
            payload_len = int.from_bytes(self.recv_exact(2), 'big')
        elif payload_len == 127:
            payload_len = int.from_bytes(self.recv_exact(8), 'big')
        return json.loads(self.recv_exact(payload_len).decode('utf-8', errors='ignore'))

    def call(self, method, params=None):
        self.msg_id += 1
        mid = self.msg_id
        msg = {"id": mid, "method": method}
        if params: msg["params"] = params
        self.send_frame(msg)
        while True:
            frame = self.recv_frame()
            if frame.get("id") == mid:
                return frame.get("result", {})

    def close(self):
        try: self.sock.close()
        except: pass

def main():
    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json")
        targets = json.loads(req.read().decode('utf-8'))
        ws_url = targets[0]["webSocketDebuggerUrl"]
        cdp = CDPSession(ws_url)

        cdp.call("Page.enable")
        cdp.call("Page.navigate", {"url": "http://localhost:5173/"})
        time.sleep(3.0)

        def eval_js(code):
            res = cdp.call("Runtime.evaluate", {
                "expression": code,
                "returnByValue": True,
                "awaitPromise": True
            })
            return res.get("result", {}).get("value")

        results = {}

        # 1. LED Lab: Standby vs Active
        eval_js("window.useWorkbenchStore.getState().setActiveLab('led')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        led_stopped_standby = eval_js("document.body.innerText.includes('STANDBY')")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        led_running_ok = eval_js("document.body.innerText.includes('CONDUCTION') || document.body.innerText.includes('CUTOFF')")
        results['led'] = {"stopped_standby": led_stopped_standby, "running_ok": led_running_ok}

        # 2. Buzzer Lab: data-sound-wave and buzzerActive gating
        eval_js("window.useWorkbenchStore.getState().setActiveLab('buzzer')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        eval_js("window.useWorkbenchStore.getState().updateHardwareState({ buzzerActive: true })")
        time.sleep(0.4)
        buzzer_stopped_sound = eval_js("Boolean(document.querySelector('[data-sound-wave]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        buzzer_running_sound = eval_js("Boolean(document.querySelector('[data-sound-wave]'))")
        results['buzzer'] = {"sound_wave_when_stopped": buzzer_stopped_sound, "sound_wave_when_running": buzzer_running_sound}

        # 3. Temp Lab: Fan gating & thermal waves
        eval_js("window.useWorkbenchStore.getState().setActiveLab('temp')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        eval_js("window.useWorkbenchStore.getState().updateHardwareState({ fanActive: true, temperatureC: 45 })")
        time.sleep(0.4)
        temp_stopped_fan = eval_js("document.body.innerText.includes('FAN STANDBY')")
        temp_stopped_spin = eval_js("Boolean(document.querySelector('.animate-spin'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        temp_running_fan = eval_js("document.body.innerText.includes('FAN COOLING')")
        temp_running_spin = eval_js("Boolean(document.querySelector('.animate-spin'))")
        temp_running_thermal = eval_js("Boolean(document.querySelector('[data-thermal-waves]'))")
        results['temp'] = {
            "stopped_fan_standby": temp_stopped_fan,
            "stopped_fan_spinning": temp_stopped_spin,
            "running_fan_cooling": temp_running_fan,
            "running_fan_spinning": temp_running_spin,
            "running_thermal_waves": temp_running_thermal
        }

        # 4. Sonar Lab: data-sonar-wave
        eval_js("window.useWorkbenchStore.getState().setActiveLab('sonar')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        sonar_stopped_wave = eval_js("Boolean(document.querySelector('[data-sonar-wave]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        sonar_running_wave = eval_js("Boolean(document.querySelector('[data-sonar-wave]'))")
        results['sonar'] = {"wave_when_stopped": sonar_stopped_wave, "wave_when_running": sonar_running_wave}

        # 5. IR Lab: data-ir-beam
        eval_js("window.useWorkbenchStore.getState().setActiveLab('ir')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        ir_stopped_beam = eval_js("Boolean(document.querySelector('[data-ir-beam]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        ir_running_beam = eval_js("Boolean(document.querySelector('[data-ir-beam]'))")
        results['ir'] = {"beam_when_stopped": ir_stopped_beam, "beam_when_running": ir_running_beam}

        # 6. Gas Lab: data-gas-particles & alarm gating
        eval_js("window.useWorkbenchStore.getState().setActiveLab('gas')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        eval_js("window.useWorkbenchStore.getState().updateHardwareState({ gasPpm: 500, buzzerActive: true })")
        time.sleep(0.4)
        gas_stopped_alarm = eval_js("document.body.innerText.includes('STANDBY')")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        gas_running_alarm = eval_js("document.body.innerText.includes('HAZARD LEAK DETECTED')")
        gas_running_particles = eval_js("Boolean(document.querySelector('[data-gas-particles]'))")
        results['gas'] = {
            "stopped_alarm_standby": gas_stopped_alarm,
            "running_alarm_detected": gas_running_alarm,
            "running_particles": gas_running_particles
        }

        # 7. Soil Lab: data-water-flow & pump gating
        eval_js("window.useWorkbenchStore.getState().setActiveLab('soil')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        eval_js("window.useWorkbenchStore.getState().updateHardwareState({ relayActive: true })")
        time.sleep(0.4)
        soil_stopped_pump = eval_js("document.body.innerText.includes('PUMP STANDBY')")
        soil_stopped_water = eval_js("Boolean(document.querySelector('[data-water-flow]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        soil_running_pump = eval_js("document.body.innerText.includes('PUMP ACTIVE')")
        soil_running_water = eval_js("Boolean(document.querySelector('[data-water-flow]'))")
        results['soil'] = {
            "stopped_pump_standby": soil_stopped_pump,
            "stopped_water_flow": soil_stopped_water,
            "running_pump_active": soil_running_pump,
            "running_water_flow": soil_running_water
        }

        # 8. Motor Lab: data-tread-rolling & wheel spin gating
        eval_js("window.useWorkbenchStore.getState().setActiveLab('motor')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        eval_js("window.useWorkbenchStore.getState().updateHardwareState({ motorSpeed: 200, motorDirection: 'FORWARD' })")
        time.sleep(0.4)
        motor_stopped_spin = eval_js("Boolean(document.querySelector('.animate-spin'))")
        motor_stopped_treads = eval_js("Boolean(document.querySelector('[data-tread-rolling]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        motor_running_spin = eval_js("Boolean(document.querySelector('.animate-spin'))")
        motor_running_treads = eval_js("Boolean(document.querySelector('[data-tread-rolling]'))")
        results['motor'] = {
            "stopped_motor_spinning": motor_stopped_spin,
            "stopped_treads_rolling": motor_stopped_treads,
            "running_motor_spinning": motor_running_spin,
            "running_treads_rolling": motor_running_treads
        }

        # 9. IMU Lab: data-pfd horizon
        eval_js("window.useWorkbenchStore.getState().setActiveLab('imu')")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        imu_pfd = eval_js("Boolean(document.querySelector('[data-pfd]'))")
        results['imu'] = {"pfd_horizon_present": imu_pfd}

        # 10. RFID Lab: data-rfid-field
        eval_js("window.useWorkbenchStore.getState().setActiveLab('rfid')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        rfid_stopped_field = eval_js("Boolean(document.querySelector('[data-rfid-field]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        rfid_running_field = eval_js("Boolean(document.querySelector('[data-rfid-field]'))")
        results['rfid'] = {"field_when_stopped": rfid_stopped_field, "field_when_running": rfid_running_field}

        # 11. IoT Lab: data-iot-wave
        eval_js("window.useWorkbenchStore.getState().setActiveLab('iot')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        iot_stopped_wave = eval_js("Boolean(document.querySelector('[data-iot-wave]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        iot_running_wave = eval_js("Boolean(document.querySelector('[data-iot-wave]'))")
        results['iot'] = {"wave_when_stopped": iot_stopped_wave, "wave_when_running": iot_running_wave}

        # 12. DMM Lab: data-dmm-current
        eval_js("window.useWorkbenchStore.getState().setActiveLab('dmm')")
        eval_js("window.useWorkbenchStore.getState().stopSimulation()")
        time.sleep(0.4)
        dmm_stopped_current = eval_js("Boolean(document.querySelector('[data-dmm-current]'))")
        eval_js("window.useWorkbenchStore.getState().startSimulation()")
        time.sleep(0.4)
        dmm_running_current = eval_js("Boolean(document.querySelector('[data-dmm-current]'))")
        results['dmm'] = {"current_when_stopped": dmm_stopped_current, "current_when_running": dmm_running_current}

        print("=== VERIFICATION RESULTS ===")
        print(json.dumps(results, indent=2))

        with open("scratch/verify_visual_animations_results.json", "w", encoding='utf-8') as f:
            json.dump(results, f, indent=2)

        cdp.close()
    finally:
        proc.kill()

if __name__ == '__main__':
    main()
