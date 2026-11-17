import re

with open("js/app.js", "r", encoding="utf-8") as f:
    app_text = f.read()

with open("js/simulation.js", "r", encoding="utf-8") as f:
    sim_text = f.read()

# Find all calls: window.circuitSimulation.<method>(...) or circuitSimulation.<method>(...)
sim_calls = set(re.findall(r'(?:window\.)?circuitSimulation\.([a-zA-Z0-9_$]+)\s*\(', app_text))
print(f"Total distinct methods called on circuitSimulation in app.js: {len(sim_calls)}")

missing_methods = []
for m in sorted(sim_calls):
    # Check if defined in simulation.js: m(...) {
    if not re.search(r'\b' + m + r'\s*\(', sim_text):
        missing_methods.append(m)

print(f"Methods NOT defined in simulation.js: {len(missing_methods)}")
for mm in missing_methods:
    print("  *", mm)
