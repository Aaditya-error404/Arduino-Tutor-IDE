# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for var in ['OLED_LESSONS_DATA', 'SOIL_LESSONS_DATA', 'MOTOR_LESSONS_DATA', 'IMU_LESSONS_DATA', 'RFID_LESSONS_DATA', 'IOT_LESSONS_DATA']:
    m = re.search(rf'const\s+{var}\s*=\s*\[([\s\S]*?)\n\];', text)
    if m:
        first_lesson = m.group(1)
        def_code = re.search(r'defaultCode:\s*\{([\s\S]*?)\n\s*\},', first_lesson)
        if def_code:
            keys = re.findall(r'(\w+)\s*:', def_code.group(1))
            print(f"{var} defaultCode keys:", keys)
