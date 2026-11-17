# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

m = re.search(r'<g id="motor-circuit-view"[\s\S]*?</g>\s*(?=<g id="\w+-circuit-view")', html)
if m:
    content = m.group(0)
    ids = re.findall(r'id=["\']([^"\']+)["\']', content)
    print("IDs in motor-circuit-view:", ids)
