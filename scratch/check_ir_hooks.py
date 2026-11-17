with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

hc = "state.activeLab === 'ir'" in text
hw = "hw.activeLab === 'ir'" in text
rit = "renderIrLesson1" in text

print('IR in callouts/activeLab:', hc)
print('IR in onHardwareChange:', hw)
print('IR in renderIrLesson1:', rit)
