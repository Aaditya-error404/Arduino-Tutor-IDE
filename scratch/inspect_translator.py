
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

import re
print("getDynamicHumanCode:")
m = re.search(r'function getDynamicHumanCode\([^\)]*\)\s*\{([\s\S]*?)
  \}', app_js)
if m:
    print(m.group(1)[:600])

print("
getDynamicCppCode:")
m2 = re.search(r'function getDynamicCppCode\([^\)]*\)\s*\{([\s\S]*?)
  \}', app_js)
if m2:
    print(m2.group(1)[:600])
