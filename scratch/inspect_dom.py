import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print('Select elements:', re.findall(r'<select[^>]*id=["\'](.*?)["\']', html))
print('Modals:', re.findall(r'id=["\']([^"\']*modal[^"\']*)["\']', html, re.I))
print('Canvas:', re.findall(r'<canvas[^>]*id=["\'](.*?)["\']', html))
print('Cycle/Counter:', re.findall(r'id=["\']([^"\']*(?:cycle|counter|step|loop)[^"\']*)["\']', html, re.I))
print('Serial:', re.findall(r'id=["\']([^"\']*serial[^"\']*)["\']', html, re.I))
print('Audio:', re.findall(r'id=["\']([^"\']*(?:audio|sound)[^"\']*)["\']', html, re.I))
print('Guide/Help:', re.findall(r'id=["\']([^"\']*(?:guide|help|teacher)[^"\']*)["\']', html, re.I))

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

print('\nIn app.js: allLabIds or LABS:')
print('LABS defined:', 'const LABS' in app_js or 'window.LABS' in app_js)
print('LAB_CONFIGS defined:', 'LAB_CONFIGS' in app_js)
for m in re.finditer(r'(?:const|let|var)\s+([A-Za-z0-9_]+Labs?|[A-Za-z0-9_]+CONFIGS?)\s*=', app_js):
    print('  Found match:', m.group(0))

with open('js/audio.js', 'r', encoding='utf-8') as f:
    audio_js = f.read()
print('\nIn audio.js: exports / globals:')
for m in re.finditer(r'(?:window\.[A-Za-z0-9_]+|class\s+[A-Za-z0-9_]+|const\s+[A-Za-z0-9_]+\s*=)', audio_js):
    print('  Found:', m.group(0))
