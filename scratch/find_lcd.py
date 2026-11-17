with open('sparkbyte-v2/src/data/lessons.ts', encoding='utf-8') as f:
    text = f.read()
idx = text.find('"id": "ldr"')
print(text[idx+2000:idx+4500])
