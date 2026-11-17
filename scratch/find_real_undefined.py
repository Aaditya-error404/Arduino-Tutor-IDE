import re

with open("js/app.js", "r", encoding="utf-8") as f:
    code = f.read()

# Strip template literals `...` and standard strings "..." and '...'
clean_code = re.sub(r'`(?:\\`|[^`])*`', '""', code)
clean_code = re.sub(r'"(?:\\"|[^"])*"', '""', clean_code)
clean_code = re.sub(r"'(?:\\'|[^'])*'", "''", clean_code)
# Strip comments
clean_code = re.sub(r'//.*', '', clean_code)
clean_code = re.sub(r'/\*[\s\S]*?\*/', '', clean_code)

defined_funcs = set(re.findall(r'function\s+([a-zA-Z0-9_$]+)\s*\(', clean_code))
defined_funcs.update(re.findall(r'(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>', clean_code))
defined_funcs.update(re.findall(r'(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function', clean_code))

builtins = {
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'alert', 'confirm', 'prompt',
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame',
    'cancelAnimationFrame', 'encodeURIComponent', 'decodeURIComponent', 'fetch',
    'btoa', 'atob', 'Boolean', 'Number', 'String', 'Array', 'Object', 'Function',
    'Math', 'Date', 'RegExp', 'Error', 'TypeError', 'RangeError', 'Set', 'Map',
    'WeakSet', 'WeakMap', 'Promise', 'Symbol', 'JSON', 'console', 'window', 'document',
    'addEventListener', 'removeEventListener', 'dispatchEvent', 'postMessage', 'URL', 'URLSearchParams',
    'eval', 'typeof', 'sizeof', 'instanceof'
}

raw_calls = re.findall(r'(?<![.\w$])([a-zA-Z0-9_$]+)\s*\(', clean_code)
call_counts = {}
for c in raw_calls:
    if c in {'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'throw', 'new', 'delete'}:
        continue
    call_counts[c] = call_counts.get(c, 0) + 1

real_undefined = []
for fname, count in call_counts.items():
    if fname not in defined_funcs and fname not in builtins:
        real_undefined.append((fname, count))

print(f"REAL undefined function calls in executable JS:")
for u, cnt in sorted(real_undefined, key=lambda x: -x[1]):
    print(f"  * {u} (called {cnt} times)")
