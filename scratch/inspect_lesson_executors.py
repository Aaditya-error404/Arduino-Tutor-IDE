# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'executeServoLesson3\(\)\s*\{([\s\S]*?)\n  \}', text)
if m:
    print("executeServoLesson3 implementation:")
    print(m.group(0))

m_led = re.search(r'executeLedLesson3\(\)\s*\{([\s\S]*?)\n  \}', text)
if m_led:
    print("\nexecuteLedLesson3 implementation:")
    print(m_led.group(0))
