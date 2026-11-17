import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Find lab cards or switchLab calls
print("switchLab occurrences:")
for m in re.finditer(r'switchLab\([\'"]([^\'"]+)[\'"]\)', app_js):
    print(" ", m.group(0))

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons_js = f.read()

# Find lessons definitions or keys
labs_in_lessons = re.findall(r'const\s+([A-Za-z0-9_]+Lessons)\s*=', lessons_js)
print("\nLessons objects in lessons.js:", labs_in_lessons)

# Look for allLabs in app.js
m = re.search(r'const\s+allLabs\s*=\s*\[(.*?)\];', app_js, re.DOTALL)
if m:
    print("\nallLabs in app.js:\n", m.group(1)[:500])
