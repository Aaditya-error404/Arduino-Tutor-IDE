# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'renderScope\(\)\s*\{([\s\S]*?)\n  \}', text)
if m:
    print(m.group(0))
