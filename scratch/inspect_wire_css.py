# -*- coding: utf-8 -*-
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

matches = re.findall(r'([^{}]*wire[^{}]*\{[^{}]*\})', css)
print(f"Wire CSS rules ({len(matches)}):")
for m in matches[:15]:
    print("---")
    print(m.strip())
