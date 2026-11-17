import re

with open("js/app.js", "r", encoding="utf-8") as f:
    app_text = f.read()

with open("js/simulation.js", "r", encoding="utf-8") as f:
    sim_text = f.read()

with open("js/audio.js", "r", encoding="utf-8") as f:
    audio_text = f.read()

sound_calls = set(re.findall(r'(?:window\.)?soundEngine\.([a-zA-Z0-9_$]+)\s*\(', app_text + sim_text))
print(f"Total distinct methods called on soundEngine: {len(sound_calls)}")

missing_audio = []
for m in sorted(sound_calls):
    if not re.search(r'\b' + m + r'\s*\(', audio_text):
        missing_audio.append(m)

print(f"Audio methods NOT defined in audio.js: {len(missing_audio)}")
for ma in missing_audio:
    print("  *", ma)
