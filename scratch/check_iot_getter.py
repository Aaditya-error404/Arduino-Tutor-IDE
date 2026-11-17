# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

idx = app.find("RFID_LESSONS_DATA")
print(app[idx-50:idx+250])
