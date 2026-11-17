# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

bad = 'text: "  Serial.print("Measured Potential: "); Serial.println(voltage);"'
good = 'text: "  Serial.print(\\"Measured Potential: \\"); Serial.println(voltage);"'

if bad in text:
    text = text.replace(bad, good)
    print("Replaced unescaped quote successfully!")
else:
    idx = text.find('Measured Potential')
    print("Not found exact, here is slice:", repr(text[idx-40:idx+60]))
    target = text[idx-30:idx+55]
    print("Target:", repr(target))

with open('js/lessons.js', 'w', encoding='utf-8') as f:
    f.write(text)
