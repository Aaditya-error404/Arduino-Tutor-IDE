# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find all wire groups and inspect their children
wire_groups = re.findall(r'(<g id="wire-[^"]*"[^>]*>[\s\S]*?</g>)', html)
print(f"Wire groups in index.html: {len(wire_groups)}")
for g in wire_groups[:5]:
    print("---")
    print(g)

# Also check js/app.js for dynamic wires
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

dynamic_wires = re.findall(r'(<path[^>]*class=["\'][^"\']*wire[^"\']*["\'][^>]*>)', app_js)
print(f"\nDynamic wire paths in app.js: {len(dynamic_wires)}")
for w in dynamic_wires[:5]:
    print(" ", w)
