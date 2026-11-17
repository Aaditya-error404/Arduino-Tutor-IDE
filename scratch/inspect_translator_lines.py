# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find renderCodeTranslator and how lines are created
m = re.search(r'function renderCodeTranslator\(lesson\)\s*\{([\s\S]*?)\n  \}', text)
if m:
    print(m.group(0))
