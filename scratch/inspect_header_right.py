# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

m = re.search(r'<div class="header-right"[\s\S]*?</header>', html)
if m:
    print(m.group(0))
