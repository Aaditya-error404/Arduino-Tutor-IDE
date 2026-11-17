import re

with open("js/app.js", "r", encoding="utf-8") as f:
    app_text = f.read()

# Find all standalone function definitions: function foo(...) or const/let/var foo = (...) => or function(...)
defined_funcs = set(re.findall(r'function\s+([a-zA-Z0-9_$]+)\s*\(', app_text))
defined_funcs.update(re.findall(r'(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>', app_text))
defined_funcs.update(re.findall(r'(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function', app_text))

# Standard JS built-ins
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

# Find all standalone function calls: foo(...) NOT preceded by a dot '.'
# E.g. (?<!\.)([a-zA-Z0-9_$]+)\s*\(
raw_calls = re.findall(r'(?<![.\w$])([a-zA-Z0-9_$]+)\s*\(', app_text)
call_counts = {}
for c in raw_calls:
    if c in {'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'throw', 'new', 'delete'}:
        continue
    call_counts[c] = call_counts.get(c, 0) + 1

undefined_calls = []
for fname, count in call_counts.items():
    if fname not in defined_funcs and fname not in builtins:
        undefined_calls.append((fname, count))

print(f"Total defined standalone functions: {len(defined_funcs)}")
print(f"Standalone function calls with unknown definition: {len(undefined_calls)}")
for u, cnt in sorted(undefined_calls, key=lambda x: -x[1]):
    print(f"  * {u} (called {cnt} times)")
