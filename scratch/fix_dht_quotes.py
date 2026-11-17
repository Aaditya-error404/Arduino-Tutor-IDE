# -*- coding: utf-8 -*-
with open('js/lessons.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix unescaped quotes in DHT section
text = text.replace(
    'Serial.println("Failed to read from DHT sensor!");',
    'Serial.println(\\"Failed to read from DHT sensor!\\");'
)
text = text.replace(
    'Serial.print("Humidity: ");',
    'Serial.print(\\"Humidity: \\");'
)
text = text.replace(
    'Serial.println(" %");',
    'Serial.println(\\" %\\");'
)

with open('js/lessons.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("DHT quotes fixed successfully!")
