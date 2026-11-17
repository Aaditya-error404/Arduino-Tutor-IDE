# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

idx = app.find("function getLessonsForActiveLab")
print(app[idx:idx+400])
