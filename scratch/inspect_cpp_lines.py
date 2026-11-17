# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

import re

# Find getDynamicCppCode
m = re.search(r'function getDynamicCppCode\(lesson\)\s*\{([\s\S]*?)\n  \}', app_js)
if m:
    print(m.group(0)[:1500])
