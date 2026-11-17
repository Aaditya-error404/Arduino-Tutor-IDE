# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'const\s+MOTOR_LESSONS_DATA\s*=\s*\[([\s\S]*?)\n\];', text)
if m:
    def_code = re.search(r'defaultCode:\s*\{([\s\S]*?)\n\s*\},', m.group(1))
    if def_code:
        print("MOTOR defaultCode snippet:")
        print(def_code.group(1)[:400])
