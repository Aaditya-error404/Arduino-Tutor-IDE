import json, urllib.request, subprocess, time, base64, socket, os, sys

cdp_port = 9440
proc = subprocess.Popen([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    f"--remote-debugging-port={cdp_port}",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,900"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.0)

from full_project_audit import CDPSession

try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    session = CDPSession(tabs[0]["webSocketDebuggerUrl"])
    session.call("Page.enable")
    session.call("Page.navigate", {"url": "http://localhost:8080/"})
    time.sleep(2.0)

    def eval_js(expr):
        return session.call("Runtime.evaluate", {"expression": expr, "returnByValue": True}).get("result", {}).get("value")

    layout_check = eval_js("""
    (() => {
        const docW = document.documentElement.clientWidth;
        const docH = document.documentElement.clientHeight;
        const scrollW = document.documentElement.scrollWidth;
        const scrollH = document.documentElement.scrollHeight;

        const topBar = document.querySelector('.top-utility-bar') || document.querySelector('header');
        const topBarBox = topBar ? topBar.getBoundingClientRect() : null;

        const leftCol = document.querySelector('.panel-curriculum') || document.querySelector('.left-column') || document.querySelector('section');
        const leftColBox = leftCol ? leftCol.getBoundingClientRect() : null;

        const rightCol = document.querySelector('.panel-simulation') || document.querySelector('.right-column');
        const rightColBox = rightCol ? rightCol.getBoundingClientRect() : null;

        const codeTrans = document.querySelector('.code-translator-wrapper');
        const codeTransBox = codeTrans ? codeTrans.getBoundingClientRect() : null;

        return {
            viewport: { width: docW, height: docH, scrollWidth: scrollW, scrollHeight: scrollH },
            hasHorizontalOverflow: scrollW > docW,
            topBar: topBarBox ? { top: topBarBox.top, height: topBarBox.height, width: topBarBox.width } : null,
            leftCol: leftColBox ? { width: leftColBox.width, height: leftColBox.height } : null,
            rightCol: rightColBox ? { width: rightColBox.width, height: rightColBox.height } : null,
            codeTranslatorVisibleAboveFold: codeTransBox ? (codeTransBox.top < docH) : false,
            codeTranslatorTop: codeTransBox ? codeTransBox.top : null
        };
    })()
    """)
    print("Layout Verification at 1440x900:")
    print(json.dumps(layout_check, indent=2))
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
