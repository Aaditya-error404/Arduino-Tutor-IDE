with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'led']"
replacement = "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'led']"

if target in text:
    text = text.replace(target, replacement)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated valid requested labs list!')
else:
    print('Target not found')
