with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

hc = "state.activeLab === 'lcd'" in text
hw = "hw.activeLab === 'lcd'" in text
rit = "renderLcdLesson1" in text

print('LCD in callouts/activeLab:', hc)
print('LCD in onHardwareChange:', hw)
print('LCD in renderLcdLesson1:', rit)
