# -*- coding: utf-8 -*-
import re, json

with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_js = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

print("=== getElementById in simulation.js ===")
sim_ids = sorted(set(re.findall(r'getElementById\([\'"]([^\'"]+)[\'"]\)', sim_js)))
for i in sim_ids:
    in_html = f'id="{i}"' in index_html
    print(f"  {i}: {'FOUND' if in_html else 'MISSING IN HTML'}")

print("\n=== querySelector in simulation.js ===")
sim_qs = sorted(set(re.findall(r'querySelector(?:All)?\([\'"]([^\'"]+)[\'"]\)', sim_js)))
for q in sim_qs:
    print(f"  {q}")

print("\n=== Start Simulation buttons in app.js and index.html ===")
# Check Start Simulation event listeners in app.js
start_btn_matches = re.findall(r'[\w\.]*start[\w\.]*|[\w\.]*sim[\w\.]*', app_js, re.I)
for line in app_js.splitlines():
    if 'sim-btn-start' in line or 'btn-sim-start' in line or 'start-sim' in line or 'circuitSimulation.start' in line:
        print("  app.js:", line.strip())

for line in index_html.splitlines():
    if 'sim-btn' in line or 'btn-sim' in line or ('Start' in line and 'Simulation' in line):
        print("  index.html:", line.strip())

print("\n=== Check how simulation.js accesses DOM ===")
dom_access = [l.strip() for l in sim_js.splitlines() if 'document.' in l or 'getElementById' in l or 'querySelector' in l]
for l in dom_access[:30]:
    print("  sim.js:", l)

