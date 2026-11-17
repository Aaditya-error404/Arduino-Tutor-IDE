# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[:50]):
    print(f"{i+1}: {l}", end="")
