import re

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

def show_lesson(lab_id, lesson_id):
    pattern = r'\{\s*"id":\s*"' + lab_id + r'",.*?\{\s*"id":\s*' + str(lesson_id) + r',\s*"title":\s*"([^"]+)".*?"cpp":\s*"([^"\\]*(?:\\.[^"\\]*)*)"'
    m = re.search(pattern, text, re.DOTALL)
    if m:
        title = m.group(1)
        cpp = m.group(2).replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
        print(f"=== {lab_id.upper()} LESSON {lesson_id}: {title} ===")
        print(cpp)
        print()

show_lesson('rfid', 3)
show_lesson('gas', 4)
show_lesson('soil', 4)
