import re

with open("js/lessons.js", "r", encoding="utf-8") as f:
    lessons_raw = f.read()

with open("js/app.js", "r", encoding="utf-8") as f:
    app_raw = f.read()

# Extract checkVerification definition in app.js
cv_match = re.search(r'function checkVerification\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\s*\}', app_raw)
cv_body = cv_match.group(2) if cv_match else ""

verify_conditions = re.findall(r'verifyCondition:\s*["\']([^"\']+)["\']', lessons_raw)
print(f"Total verifyConditions in lessons.js: {len(verify_conditions)}")

missing_in_cv = []
for vc in set(verify_conditions):
    if vc not in cv_body:
        missing_in_cv.append(vc)

print(f"\nConditions not handled in checkVerification(): {len(missing_in_cv)}")
for m in sorted(missing_in_cv):
    print("  *", m)
