# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    sim_js = f.read()

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons_js = f.read()

import re

# Find executeStep in simulation.js
exec_step_match = re.search(r'executeStep\(\)\s*\{([\s\S]*?)\n  \}', sim_js)
if exec_step_match:
    lines = exec_step_match.group(1).splitlines()
    for l in lines:
        if 'activeLab ===' in l or 'activeLine =' in l or 'onStepChange' in l:
            print(l.strip())
