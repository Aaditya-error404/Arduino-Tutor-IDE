# -*- coding: utf-8 -*-
"""
Audit Code-to-Simulation Logic across all 22 labs in sparkbyte-v2
"""
import re, json, sys

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract the LABS array or LAB_MAP
# We can extract each lab object
lab_blocks = re.findall(r'(\w+):\s*\{[\s\S]*?id:\s*[\'\"](\w+)[\'\"],[\s\S]*?name:\s*[\'\"]([^\'\"]+)[\'\"][\s\S]*?lessons:\s*\[([\s\S]*?)\]\s*\}', text)
print(f"Matched lab blocks: {len(lab_blocks)}")

# Let's extract all lessons for each lab
for key, lid, lname, lessons_raw in lab_blocks:
    # find all cpp code blocks
    cpps = re.findall(r'cpp:\s*`([\s\S]*?)`', lessons_raw)
    print(f"\n==========================================")
    print(f"LAB {lid} ({lname}) - Lessons: {len(cpps)}")
    print(f"==========================================")
    for i, c in enumerate(cpps, 1):
        lines = [l.strip() for l in c.strip().split('\n') if l.strip() and not l.strip().startswith('//')]
        summary = "; ".join(lines[:3])
        print(f"  Lesson {i}: {summary[:75]}...")
