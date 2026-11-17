# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="motor-circuit-view"')
if pos != -1:
    print(text[pos:pos+2500])
