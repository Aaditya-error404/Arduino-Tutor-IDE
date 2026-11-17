# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

old_human = """    if (lesson.defaultCode && lesson.defaultCode.human) {
      return lesson.defaultCode.human;
    }"""

new_human = """    if (lesson.defaultCode && lesson.defaultCode.human) {
      if (Array.isArray(lesson.defaultCode.human)) {
        return lesson.defaultCode.human;
      }
      if (typeof lesson.defaultCode.human === 'string') {
        return lesson.defaultCode.human.split('\\n').map((line, idx) => ({
          id: `h${idx+1}`,
          line: idx + 1,
          text: line,
          indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
          tag: 'code'
        }));
      }
    }"""

old_cpp = """    if (lesson.defaultCode && lesson.defaultCode.cplusplus) {
      return lesson.defaultCode.cplusplus;
    }"""

new_cpp = """    if (lesson.defaultCode && lesson.defaultCode.cplusplus) {
      if (Array.isArray(lesson.defaultCode.cplusplus)) {
        return lesson.defaultCode.cplusplus;
      }
      if (typeof lesson.defaultCode.cplusplus === 'string') {
        return lesson.defaultCode.cplusplus.split('\\n').map((line, idx) => ({
          id: `c${idx+1}`,
          line: idx + 1,
          text: line,
          indent: line.startsWith('    ') ? 2 : (line.startsWith('  ') ? 1 : 0),
          tag: 'code'
        }));
      }
    }"""

app = app.replace(old_human, new_human)
app = app.replace(old_cpp, new_cpp)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print("Dynamic code string parsing added to app.js!")
