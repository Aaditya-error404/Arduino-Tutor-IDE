# -*- coding: utf-8 -*-
import json

for fname in ['js/lessons.js', 'js/simulation.js', 'js/app.js']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"{fname}: {len(content)} bytes")
