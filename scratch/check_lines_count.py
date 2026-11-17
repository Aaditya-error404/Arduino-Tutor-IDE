import json, urllib.request

res = urllib.request.urlopen("http://localhost:8080/index.html")
# We can use CDP to evaluate for each lab how many human lines vs cpp lines exist
from scratch.test_sim_click import CDPSession, proc, cdp_port
