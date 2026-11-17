import re
from collections import Counter

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ids = re.findall(r'\bid=["\'](.*?)["\']', html)
c = Counter(ids)
dups = {k: v for k, v in c.items() if v > 1}
print(f"Total IDs: {len(ids)}, Unique IDs: {len(c)}")
print(f"Duplicate IDs: {len(dups)}")
for k, v in sorted(dups.items()):
    print(f"  {k}: {v} times")
