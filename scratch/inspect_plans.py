# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

import re

# Let's see what getDynamicCppCode produces for servo and led
print("Inspecting getDynamicCppCode in app.js...")
m = re.search(r'function getDynamicCppCode\(lesson\) \{([\s\S]*?)\n  \}', app_js)
if m:
    print(m.group(0)[:800])
