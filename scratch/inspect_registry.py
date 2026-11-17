# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

idx = app.find("const allCircuitViews = [")
print(app[idx:idx+300])
