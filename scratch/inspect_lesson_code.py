# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for var in ['IR_LESSONS_DATA', 'LCD_LESSONS_DATA', 'OLED_LESSONS_DATA', 'SOIL_LESSONS_DATA', 'MOTOR_LESSONS_DATA']:
    m = re.search(rf'const\s+{var}\s*=\s*\[\s*\{{', text)
    if m:
        snippet = text[m.start():m.start()+1200]
        # find defaultCode
        print(f"=== {var} Lesson 1 ===")
        for line in snippet.splitlines()[:25]:
            print(" ", line)
