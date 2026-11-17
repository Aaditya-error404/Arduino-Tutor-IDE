# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

m = re.search(r'<div class="hud-readouts-grid"[\s\S]*?</div>\s*</div>', html)
if m:
    print("hud-readouts-grid snippet:")
    print(m.group(0))
else:
    print("hud-readouts-grid not found with that regex, searching for hud-item...")
    m2 = re.findall(r'<div class="hud-item"[\s\S]*?</div>', html)
    print(f"Found {len(m2)} hud-item elements:")
    for it in m2:
        print(it)
