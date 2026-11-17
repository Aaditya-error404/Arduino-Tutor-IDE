# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="rover-chassis-group"')
if pos != -1:
    print(text[pos:pos+2500])
