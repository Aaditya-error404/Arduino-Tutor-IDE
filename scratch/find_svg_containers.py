import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find main hardware container
print("All major divs in middle/right workspace:")
for m in re.finditer(r'<div[^>]*id=["\']([^"\']+)["\'][^>]*class=["\']([^"\']+)["\']', html):
    div_id, div_cls = m.groups()
    if any(k in div_id.lower() or k in div_cls.lower() for k in ['circuit', 'hardware', 'desk', 'workspace', 'board', 'canvas']):
        print(f"  id='{div_id}', class='{div_cls}'")

# Look for SVG tags that are breadboards or circuits
print("\nCircuit SVGs:")
for m in re.finditer(r'<svg[^>]*id=["\']([^"\']+)["\']', html):
    svg_id = m.group(1)
    print(f"  svg id='{svg_id}'")
