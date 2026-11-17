# -*- coding: utf-8 -*-
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

for term in ['.grade-filter-bar', '.lab-switcher', '.lab-switch-btn', '.header-nav-container']:
    idx = css.find(term)
    if idx != -1:
        print(f"Found {term} at {idx}:")
        print(css[idx:idx+350])
        print("="*40)
