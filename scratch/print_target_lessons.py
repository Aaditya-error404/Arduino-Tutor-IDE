import re

with open('sparkbyte-v2/src/data/lessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

target_labs = ['temp', 'ir', 'gas', 'soil', 'rfid', 'iot', 'buzzer', 'dmm', 'imu', 'cad', 'slicer']

for lab_id in target_labs:
    m = re.search(r'\{\s*"id":\s*"' + lab_id + r'",\s*"name":\s*"([^"]+)".*?"lessons":\s*\[(.*?)\]\s*\}', text, re.DOTALL)
    if m:
        name = m.group(1)
        block = m.group(2)
        lessons = re.findall(r'\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)".*?"cpp":\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block, re.DOTALL)
        print(f"=== LAB: {lab_id} ({name}) ===")
        for lid, title, cpp in lessons:
            cpp_clean = cpp.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
            print(f"-- Lesson {lid}: {title} --")
            print(cpp_clean.strip())
            print()
