import os, sys, json, time, urllib.request, subprocess

# Inspect why chips click didn't populate text in browser
with open("scratch/ai_coach_verification_summary.json", encoding="utf-8") as f:
    data = json.load(f)
print(json.dumps(data, indent=2))
