# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find all path elements in SVG that have id with wire, jumper, or are inside wire groups
wire_paths = re.findall(r'<path[^>]*id=["\'][^"\']*wire[^"\']*["\'][^>]*>', html, re.I)
print(f"Wire paths in index.html: {len(wire_paths)}")
for p in wire_paths[:15]:
    print(" ", p)

# Find all <g id="*wire*" or class="*wire*">
wire_groups = re.findall(r'<g[^>]*id=["\'][^"\']*wire[^"\']*["\'][^>]*>', html, re.I)
print(f"\nWire groups in index.html: {len(wire_groups)}")
for g in wire_groups:
    print(" ", g)

# Also check all paths inside the circuit views
all_circuit_paths = re.findall(r'<path[^>]*>', html)
paths_without_fill_none = [p for p in all_circuit_paths if 'fill="none"' not in p and "fill='none'" not in p]
print(f"\nTotal paths in index.html: {len(all_circuit_paths)}")
print(f"Paths without fill=\"none\": {len(paths_without_fill_none)}")
for p in paths_without_fill_none[:20]:
    if any(k in p for k in ['wire', 'ribbon', 'cable', 'lead', 'd=']):
        print("  no fill='none':", p[:120])
