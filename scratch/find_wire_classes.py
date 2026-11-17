# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

wire_classes = re.findall(r'class="circuit-wire\s+([^"]+)"', html)
print("Unique wire classes used:", sorted(set(wire_classes)))
