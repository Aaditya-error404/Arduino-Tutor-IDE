import re
import glob

ids = set()
classes = set()
for f in glob.glob('js/*.js'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
        for m in re.findall(r'getElementById\([\'"]([^\'"]+)[\'"]\)', content):
            ids.add(m)
        for m in re.findall(r'querySelector\([\'"]#([a-zA-Z0-9_\-]+)[\'"]\)', content):
            ids.add(m)
        for m in re.findall(r'querySelectorAll\([\'"]#([a-zA-Z0-9_\-]+)[\'"]\)', content):
            ids.add(m)
        for m in re.findall(r'querySelector\([\'"]\.([a-zA-Z0-9_\-]+)[\'"]\)', content):
            classes.add(m)
        for m in re.findall(r'querySelectorAll\([\'"]\.([a-zA-Z0-9_\-]+)[\'"]\)', content):
            classes.add(m)

print(f"Total IDs: {len(ids)}")
print("IDs used in JS:")
for i in sorted(ids):
    print(f"  #{i}")

print(f"\nTotal Classes: {len(classes)}")
print("Classes used in JS:")
for c in sorted(classes):
    print(f"  .{c}")
