# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

idx = app.find("GAS_LESSONS_DATA")
print(app[idx-100:idx+200])
