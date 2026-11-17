# -*- coding: utf-8 -*-
"""
Ensure cad_renderers_code and grade_filter_code are added to app.js.
"""

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Check if function renderCadLesson1 exists
if "function renderCadLesson1" not in app_content:
    from build_cad_lab import *
    # read patch_app_cad to extract cad_renderers_code and grade_filter_code
    with open('scratch/patch_app_cad.py', 'r', encoding='utf-8') as pf:
        ptext = pf.read()
    
    start_r = ptext.find("cad_renderers_code = '''") + len("cad_renderers_code = '''")
    end_r = ptext.find("'''\n\n# Dynamic lab switcher")
    cad_renderers = ptext[start_r:end_r]

    start_g = ptext.find("grade_filter_code = '''") + len("grade_filter_code = '''")
    end_g = ptext.rfind("'''")
    grade_filter = ptext[start_g:end_g]

    target_boot = "// --- Initial App Boot with Direct URL Parameter Support ---"
    app_content = app_content.replace(
        target_boot,
        cad_renderers + "\n" + grade_filter + "\n\n  " + target_boot
    )

    # Also update requestedLab array check if needed
    if "'cad'" not in app_content:
        app_content = app_content.replace(
            "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'led']",
            "['servo', 'pot', 'button', 'buzzer', 'ldr', 'rgb', 'temp', 'sonar', 'ir', 'lcd', 'led', 'cad']"
        )

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_content)
    print("Added renderCadLesson1-4 and initGradeBandAndLabSwitcher to app.js!")
else:
    print("function renderCadLesson1 already defined in app.js!")
