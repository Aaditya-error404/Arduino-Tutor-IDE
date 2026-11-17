# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- LAB 15: DHT11/DHT22 Digital Climate Station (dht) -->"
pos = html.find(target)
print("pos of target:", pos)

# Find the end of the main circuit svg container
svg_end = html.find("</svg>", pos)
print("pos of </svg>:", svg_end)
print("Snippet around </svg>:\n", html[svg_end-200:svg_end+50])
