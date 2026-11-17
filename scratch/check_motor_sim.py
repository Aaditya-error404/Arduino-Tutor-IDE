# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'hw\.activeLab === [\'"]motor[\'"][\s\S]*?(?=\} else if|\n  \};)', text)
if m:
    print(m.group(0)[:1200])
else:
    print("No motor block found in onHardwareChange!")

# Check if there are other motor animations in app.js
motor_matches = [l.strip() for l in text.splitlines() if 'motor-wheel' in l or 'wheel' in l.lower() and 'rotate' in l]
print("Motor wheel animation lines:", motor_matches[:10])
