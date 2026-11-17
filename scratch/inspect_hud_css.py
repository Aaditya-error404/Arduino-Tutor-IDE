# -*- coding: utf-8 -*-
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

matches = re.findall(r'([^{}]*(?:hud|telemetry)[^{}]*\{[^{}]*\})', css)
print(f"HUD/Telemetry CSS rules ({len(matches)}):")
for m in matches:
    print("---")
    print(m.strip())
