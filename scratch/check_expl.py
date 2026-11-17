# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for var in ['IR_LESSONS_DATA', 'LCD_LESSONS_DATA']:
    m = re.search(rf'const\s+{var}\s*=\s*\[([\s\S]*?)\n\];', text)
    if m:
        first_lesson = m.group(1)
        expl = re.search(r'explanation:\s*\[([\s\S]*?)\]\s*,', first_lesson)
        if expl:
            items = re.findall(r'plainEnglish:\s*["\']([^"\']+)["\']', expl.group(1))
            print(f"{var} explanation items ({len(items)}):")
            for it in items:
                print("  ", it)
