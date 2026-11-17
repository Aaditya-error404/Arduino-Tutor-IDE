# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

app = app.replace('taskInteractiveContainer.innerHTML =', 'if (!lessonInteractiveArea) return;\n    lessonInteractiveArea.innerHTML =')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print("Replaced taskInteractiveContainer with lessonInteractiveArea in app.js")
