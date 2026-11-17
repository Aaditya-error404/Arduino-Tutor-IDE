import re

with open("js/lessons.js", "r", encoding="utf-8") as f:
    lessons_raw = f.read()

# Match unescaped double quotes on the SAME LINE: line:\s*"[^\n"]*"[^\n"]*"
suspicious_quotes = re.findall(r'line:\s*"[^\n"]*"[^\n"]*"', lessons_raw)
print(f"Actual unescaped quotes on line definitions: {len(suspicious_quotes)}")
for sq in suspicious_quotes:
    print("  *", sq)
