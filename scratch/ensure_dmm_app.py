# -*- coding: utf-8 -*-
with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

if "function renderDmmLesson1" not in text:
    with open('scratch/patch_app_dmm.py', 'r', encoding='utf-8') as pf:
        ptext = pf.read()
    start_r = ptext.find("dmm_renderers_code = '''") + len("dmm_renderers_code = '''")
    end_r = ptext.rfind("'''")
    dmm_code = ptext[start_r:end_r]

    target = "// --- Initial App Boot with Direct URL Parameter Support ---"
    text = text.replace(target, dmm_code + "\n\n  " + target)

    if "'dmm'" not in text:
        text = text.replace("'cad']", "'cad', 'dmm']")

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("DMM functions successfully inserted into app.js!")
else:
    print("function renderDmmLesson1 already defined!")
