import json
from collections import Counter

with open('scratch/scan_report.json', 'r', encoding='utf-8') as f:
    issues = json.load(f)

print(f"Total issues recorded: {len(issues)}")
cat_counts = Counter(i['category'] for i in issues)
for c, cnt in cat_counts.most_common():
    print(f"  {c}: {cnt}")

print("\n--- Non-Audio/Non-Console Issues ---")
for i in issues:
    if i['category'] != 'Console Error':
        print(f"  [{i['severity']}] [{i['category']}] {i['item']}: {i['message']}")

print("\n--- Unique Console Errors / Warnings ---")
unique_console = set(i['message'] for i in issues if i['category'] == 'Console Error')
for ce in unique_console:
    print(f"  * {ce[:120]}")
