# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

views = re.findall(r'<g id="(\w+-circuit-view)"[^>]*>([\s\S]*?)(?=<g id="\w+-circuit-view"|</svg>)', html)
for vname, vcontent in views:
    no_fill = [p for p in re.findall(r'<path[^>]*>', vcontent) if 'fill=' not in p]
    if no_fill:
        print(f"=== {vname} ({len(no_fill)} paths) ===")
        for p in no_fill:
            print(" ", p[:100])
