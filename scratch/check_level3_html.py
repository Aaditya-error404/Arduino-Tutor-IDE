# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

labs = ['oled', 'soil', 'motor', 'imu', 'rfid', 'iot']
for lab in labs:
    print(f"=== {lab} ===")
    print(f"  btn: {'data-lab=\"' + lab + '\"' in html}")
    print(f"  circuit view: {'id=\"' + lab + '-circuit-view\"' in html}")
