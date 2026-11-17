import re

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

bad_lines = []
for idx, l in enumerate(lines, 1):
    stripped = l.strip()
    if stripped.startswith('line:'):
        # Count non-escaped double quotes
        quotes = [m.start() for m in re.finditer(r'(?<!\\)"', stripped)]
        if len(quotes) > 2:
            bad_lines.append((idx, stripped))

print(f"Lines with >2 unescaped double quotes in 'line:': {len(bad_lines)}")
for b in bad_lines:
    print(f"  Line {b[0]}: {b[1]}")
