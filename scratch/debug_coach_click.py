import urllib.request, json, time, sys, base64, socket

cdp_port = 9548
try:
    tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{cdp_port}/json").read())
    print("Tabs available:", len(tabs))
except Exception as e:
    print("Error:", e)
