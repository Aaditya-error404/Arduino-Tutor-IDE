# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'executeStep\(\)\s*\{([\s\S]*?)\n  \}', text)
if m:
    lines = m.group(1).splitlines()
    for l in lines:
        if 'activeLab ===' in l or 'activeLine' in l or 'stepText =' in l:
            print(l.strip())
