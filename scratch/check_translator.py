# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

idx = app.find("function getDynamicHumanCode")
idx2 = app.find("function getDynamicCppCode")
print(app[idx2-500:idx2])
