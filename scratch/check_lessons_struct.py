# -*- coding: utf-8 -*-
import json

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons_text = f.read()

# Let's inspect the lessons data for ir, lcd, oled, soil, motor, imu, rfid, iot
labs = ['ir', 'lcd', 'oled', 'soil', 'motor', 'imu', 'rfid', 'iot']
for lab in labs:
    pos = lessons_text.find(f"{lab}Lessons = [")
    if pos == -1:
        pos = lessons_text.find(f"const {lab}Lessons")
    print(f"Lab {lab} pos in lessons.js: {pos}")
