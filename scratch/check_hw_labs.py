# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find onHardwareChange function
m = re.search(r'window\.circuitSimulation\.onHardwareChange\s*=\s*\(hw\)\s*=>\s*\{([\s\S]*?)\n  \};', text)
if m:
    body = m.group(1)
    lab_checks = re.findall(r'hw\.activeLab\s*===\s*[\'"](\w+)[\'"]', body)
    print("Labs handled in onHardwareChange:", lab_checks)
else:
    print("onHardwareChange not matched with that pattern")
