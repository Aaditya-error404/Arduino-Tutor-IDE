import json, re

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match labs
lab_matches = re.finditer(r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', text)
labs = [(m.group(1), m.group(2), m.start()) for m in lab_matches]

print(f"Total labs found: {len(labs)}")
for idx, (lid, name, pos) in enumerate(labs):
    print(f"{idx+1}. ID: {lid} | Name: {name}")
