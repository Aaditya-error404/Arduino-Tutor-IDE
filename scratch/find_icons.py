# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

for line in html.splitlines():
    if any(icon in line for icon in ['⚡', '🔋', '💡', '🛡️']):
        print(line.strip())
