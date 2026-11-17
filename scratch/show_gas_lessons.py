import re

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

def show_all_lessons(lab_id):
    pattern = r'\{\s*"id":\s*"' + lab_id + r'",\s*"name":\s*"([^"]+)".*?"lessons":\s*\[(.*?)\]\s*\}'
    m = re.search(pattern, text, re.DOTALL)
    if m:
        block = m.group(2)
        lessons = re.findall(r'\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)".*?"cpp":\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block, re.DOTALL)
        for lid, title, cpp in lessons:
            cpp_clean = cpp.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
            print(f"=== {lab_id.upper()} Lesson {lid}: {title} ===")
            print(cpp_clean.strip())
            print()

show_all_lessons('gas')
