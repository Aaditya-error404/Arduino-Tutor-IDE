import os
import sys
import json
import time
import subprocess
import socket
import urllib.request
import urllib.parse
import base64

chrome_bin = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cdp_port = 9361
proc = subprocess.Popen([
    chrome_bin,
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1600,1050"
])
time.sleep(2.0)

sys.path.append('scratch')
from inspect_sim_error import CDPSession

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json/list").read())
    page_tab = next(t for t in tabs if t.get("type") == "page")
    cdp = CDPSession(page_tab["webSocketDebuggerUrl"])
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    cdp.call("Page.navigate", {"url": "http://localhost:8080/?lab=servo"})
    time.sleep(2.0)

    res = cdp.eval("""(() => {
        const btnSim = document.getElementById('btn-simulate');
        const btnReset = document.getElementById('btn-reset-sim');
        const badge = document.getElementById('loop-cycle-badge');

        btnSim.click();
        const b1 = badge.textContent;

        console.log("Before reset, badge:", b1);
        console.log("Calling window.circuitSimulation.stop()...");
        window.circuitSimulation.stop();
        const b2 = badge.textContent;
        console.log("After window.circuitSimulation.stop(), badge:", b2);

        btnReset.click();
        const b3 = badge.textContent;
        console.log("After btnReset.click(), badge:", b3);

        return { b1, b2, b3 };
    })()""")
    print("Debug Reset result:", json.dumps(res, indent=2))
    print("CDP Logs:", json.dumps(cdp.logs, indent=2))
    cdp.close()
finally:
    proc.terminate()
