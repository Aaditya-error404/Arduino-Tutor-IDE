import re

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Split into labs
# Find each lab block
lab_chunks = re.findall(r'\{\s*"id":\s*"([a-z0-9-]+)",\s*"name":\s*"([^"]+)",.*?"lessons":\s*\[(.*?)\]\s*\}', text, re.DOTALL)

print(f"Matched {len(lab_chunks)} labs.")
for lab_id, lab_name, lessons_block in lab_chunks:
    lessons = re.findall(r'\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)".*?"cpp":\s*"([^"\\]*(?:\\.[^"\\]*)*)"', lessons_block, re.DOTALL)
    print(f"\n==================== LAB: {lab_id} ({lab_name}) ====================")
    for lid, ltitle, cpp in lessons:
        cpp_unescaped = cpp.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
        print(f"--- Lesson {lid}: {ltitle} ---")
        print(cpp_unescaped.strip()[:180] + ("..." if len(cpp_unescaped.strip()) > 180 else ""))
