# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for var in ['IR_LESSONS_DATA', 'LCD_LESSONS_DATA', 'OLED_LESSONS_DATA', 'SOIL_LESSONS_DATA', 'MOTOR_LESSONS_DATA', 'IMU_LESSONS_DATA', 'RFID_LESSONS_DATA', 'IOT_LESSONS_DATA']:
    m = re.search(rf'const\s+{var}\s*=\s*\[([\s\S]*?)\n\];', text)
    if m:
        first_lesson = m.group(1)
        # find defaultCode in first lesson
        def_code = re.search(r'defaultCode:\s*\{([\s\S]*?)\n\s*\},', first_lesson)
        code_prop = re.search(r'code:\s*`([\s\S]*?)`,', first_lesson)
        print(f"=== {var} ===")
        if def_code:
            print("  defaultCode found:", def_code.group(0)[:150].replace('\n', ' '))
        elif code_prop:
            print("  code found:", code_prop.group(0)[:150].replace('\n', ' '))
        else:
            print("  NO defaultCode or code property found!")
