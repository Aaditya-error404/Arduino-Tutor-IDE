path = r'C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\atl_curriculum_hub.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('32 of 44 Lessons Built (8 Labs Live)', '36 of 44 Lessons Built (9 Labs Live)')
text = text.replace('width: 72.7%', 'width: 81.8%')
text = text.replace('72.7% Live', '81.8% Live')

text = text.replace(
    'BUILDING NOW (NEXT)</span>\n        </div>\n        <p class="text-xs text-slate-400 mb-3',
    '● LIVE IN LABS (VERIFIED)</span>\n        </div>\n        <p class="text-xs text-slate-400 mb-3'
)

text = text.replace(
    'Lab 9: HC-SR04 Ultrasonic Distance Sensor & Reverse Parking Radar</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold animate-pulse">BUILDING NOW (NEXT)',
    'Lab 9: HC-SR04 Ultrasonic Distance Sensor & Reverse Parking Radar</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">● LIVE IN LABS (VERIFIED)'
)

text = text.replace(
    'Lab 10: TCRT5000 / IR Line & Obstacle Sensor (Autonomous Rover)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">QUEUED',
    'Lab 10: TCRT5000 / IR Line & Obstacle Sensor (Autonomous Rover)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold animate-pulse">BUILDING NOW (NEXT)'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated atl_curriculum_hub.html!')
