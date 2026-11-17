# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

m = re.search(r'<g id="motor-circuit-view"[\s\S]*?</g>\s*<!--', html)
if m:
    print("motor-circuit-view snippet:")
    for l in m.group(0).splitlines()[:40]:
        print(" ", l)
