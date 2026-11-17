# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('id="gas-circuit-view"')
if idx != -1:
    end_idx = html.find('</g>', idx)
    print("Found gas-circuit-view from", idx, "to", end_idx)
    # find closing </g> of gas-circuit-view
    # let's find next circuit view or comment
    next_comment = html.find('<!--', idx + 10)
    print("Next comment at", next_comment)
    print(html[idx:idx+150])
    print("--- next comment text ---")
    print(html[next_comment:next_comment+100])
