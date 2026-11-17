# -*- coding: utf-8 -*-
with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find methods in CircuitSimulation class
methods = re.findall(r'^\s*([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{', text, re.MULTILINE)
print("CircuitSimulation methods:")
for m in methods:
    print(" ", m)

# Let's see how executeStep is implemented and what calls it
m_exec = re.search(r'executeStep\(\)\s*\{([\s\S]*?)\n  \}', text)
if m_exec:
    print("\nexecuteStep full implementation:")
    print(m_exec.group(0))
