with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if '<div class="circuit-stage">' in line:
        start_idx = i
    if '</section>' in line and start_idx is not None and end_idx is None and i > start_idx:
        end_idx = i

print(f'circuit-stage starts at line {start_idx+1}: {lines[start_idx].strip()}')
print(f'section ends at line {end_idx+1}: {lines[end_idx].strip()}')
print(f'Total lines in circuit stage: {end_idx - start_idx}')
