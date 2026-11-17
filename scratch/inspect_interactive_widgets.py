import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Search for task cards or challenge divs
task_cards = re.findall(r'<div class="([^"]*task[^"]*|[^"]*challenge[^"]*|[^"]*interactive[^"]*)"', text)
print('Task/interactive classes found:', set(task_cards))

# Let's check how the Motor / H-Bridge challenge is constructed in app.js
hbridge_pos = text.find('box-q1')
if hbridge_pos != -1:
    print("\n--- H-Bridge Markup in app.js ---")
    start = text.rfind('container.innerHTML', 0, hbridge_pos)
    end = text.find(';', hbridge_pos + 1000)
    print(text[start:start+1200])
