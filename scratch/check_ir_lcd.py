# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for var in ['IR_LESSONS_DATA', 'LCD_LESSONS_DATA']:
    m = re.search(rf'const\s+{var}\s*=\s*\[([\s\S]*?)\n\];', text)
    if m:
        first_lesson = m.group(1)
        print(f"=== {var} keys ===")
        keys = re.findall(r'^\s*(\w+)\s*:', first_lesson, re.MULTILINE)
        print(sorted(set(keys)))
