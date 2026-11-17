import sys

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Hardware callouts
target1 = """        </div>
      `;
    } else if (state.activeLab === 'temp') {"""

sonar_hc = """        </div>
      `;
    } else if (state.activeLab === 'sonar') {
      hardwareCalloutsContainer.innerHTML = `
        <div class="callout-pill" title="Transducer T emits 40kHz ultrasound acoustic burst">
          <span>🔊</span> <strong>Transmitter 'T':</strong> Miniature horn shoots 40kHz ultrasound pulses.
        </div>
        <div class="callout-pill" title="Transducer R listens for returning sound wave echo">
          <span>👂</span> <strong>Receiver 'R':</strong> Directional acoustic microphone detects returning sound.
        </div>
        <div class="callout-pill" title="Arduino Trigger Pin 12 sends 10 microsecond pulse">
          <span>⚡</span> <strong>Trig (Pin 12):</strong> Sends 10µs electrical trigger to fire sound ping.
        </div>
        <div class="callout-pill" title="Arduino Echo Pin 11 measures flight duration in microseconds">
          <span>⏱️</span> <strong>Echo (Pin 11):</strong> Held HIGH for exact duration sound is in flight.
        </div>
      `;
    } else if (state.activeLab === 'temp') {"""

if target1 in text and "state.activeLab === 'sonar'" not in text.split('function renderHardwareCallouts')[1][:800]:
    text = text.replace(target1, sonar_hc)
    print('Added sonar hardware callouts')

# 2. renderInteractiveTask
target2 = """      else if (lesson.id === 4) renderRgbLesson4(lesson);
    } else if (state.activeLab === 'temp') {"""

sonar_rit = """      else if (lesson.id === 4) renderRgbLesson4(lesson);
    } else if (state.activeLab === 'sonar') {
      if (lesson.id === 1) renderSonarLesson1(lesson);
      else if (lesson.id === 2) renderSonarLesson2(lesson);
      else if (lesson.id === 3) renderSonarLesson3(lesson);
      else if (lesson.id === 4) renderSonarLesson4(lesson);
    } else if (state.activeLab === 'temp') {"""

if target2 in text and 'renderSonarLesson1' not in text.split('function renderInteractiveTask')[1][:600]:
    text = text.replace(target2, sonar_rit)
    print('Added sonar renderInteractiveTask')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
