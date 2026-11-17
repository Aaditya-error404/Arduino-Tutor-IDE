# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('<!-- LAB 16: MQ-2')
print("idx:", idx)
# find the next LAB comment
next_lab = html.find('<!-- LAB', idx + 10)
print("next_lab:", next_lab)
if next_lab != -1:
    print(html[next_lab:next_lab+120])
else:
    print("End of labs section:", html.find('</svg>', idx))
