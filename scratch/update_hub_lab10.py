path = r'C:\Users\aadit\.gemini\antigravity\brain\7c593edc-5489-4914-aec8-cdb11ff00310\atl_curriculum_hub.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('36 of 44 Lessons Built (9 Labs Live)', '40 of 44 Lessons Built (10 Labs Live)')
text = text.replace('width: 81.8%', 'width: 90.9%')
text = text.replace('81.8% Live', '90.9% Live')

# Mark Lab 10 LIVE
text = text.replace(
    'Lab 10: TCRT5000 / IR Line & Obstacle Sensor (Autonomous Rover)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold animate-pulse">BUILDING NOW (NEXT)',
    'Lab 10: TCRT5000 / IR Line & Obstacle Sensor (Autonomous Rover)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">● LIVE IN LABS (VERIFIED)'
)

# Mark Lab 11 NEXT
text = text.replace(
    'Lab 11: 16x2 I2C Character LCD Display (Multi-Sensor Command Station)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">QUEUED',
    'Lab 11: 16x2 I2C Character LCD Display (Multi-Sensor Command Station)</h4>\n          </div>\n          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold animate-pulse">BUILDING NOW (NEXT)'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated atl_curriculum_hub.html for Lab 10!')
