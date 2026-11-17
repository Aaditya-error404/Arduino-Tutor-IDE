# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

views = re.findall(r'<g id="(\w+-circuit-view)"[^>]*>([\s\S]*?)(?=<g id="\w+-circuit-view"|</svg>)', html)
print(f"Total circuit views found: {len(views)}")
for vname, vcontent in views:
    wire_paths = re.findall(r'<path[^>]*>', vcontent)
    no_fill = [p for p in wire_paths if 'fill=' not in p]
    print(f"  {vname}: total paths={len(wire_paths)}, paths without fill attribute={len(no_fill)}")
