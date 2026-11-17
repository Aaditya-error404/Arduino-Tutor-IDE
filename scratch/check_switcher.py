with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

switcher_start = None
switcher_end = None
for i, line in enumerate(lines):
    if '<div class="lab-switcher"' in line:
        switcher_start = i
    if switcher_start is not None and switcher_end is None and '</div>' in line and i > switcher_start + 10:
        switcher_end = i

print(f'lab-switcher starts at {switcher_start+1}: {lines[switcher_start].strip()}')
print(f'lab-switcher ends at {switcher_end+1}: {lines[switcher_end].strip()}')
count_btns = sum(1 for l in lines[switcher_start:switcher_end+1] if 'lab-switch-btn' in l)
print(f'Count of lab-switch-btn: {count_btns}')
