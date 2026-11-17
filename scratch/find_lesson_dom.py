# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for term in ['lesson-nav', 'lessons-list', 'lesson-step', 'lesson-card']:
    idx = 0
    while True:
        idx = html.find(term, idx)
        if idx == -1:
            break
        print(f"Found {term}:", html[max(0, idx-20):min(len(html), idx+60)])
        idx += len(term)
