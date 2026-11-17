# -*- coding: utf-8 -*-
with open('scratch/build_dht_lab.py', 'r', encoding='utf-8') as f:
    text = f.read()

start_s = text.find("dht_svg = '''") + len("dht_svg = '''")
end_s = text.find("'''\n\nwith open('index.html'")
dht_svg_content = text[start_s:end_s].strip()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 14: 3D Slicing & G-Code Studio (slicer) -->"
if "dht-circuit-view" not in html:
    html = html.replace(target, dht_svg_content + "\n\n              " + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("dht-circuit-view SVG inserted successfully!")
else:
    print("dht-circuit-view already in index.html!")
