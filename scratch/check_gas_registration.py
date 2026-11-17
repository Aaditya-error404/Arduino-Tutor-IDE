# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("LESSONS_REGISTRY has gas:", "'gas': GAS_LESSONS_DATA" in lessons or "gas: GAS_LESSONS_DATA" in lessons)
print("allCircuitViews has gasCircuitView:", "gasCircuitView" in app)
print("allLabs has 'gas':", "'gas'" in app)
print("index.html has lab-btn for gas:", 'data-lab="gas"' in html)
