with open('js/simulation.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if "'ir'" in l or "'lcd'" in l:
        print(i+1, repr(l))
