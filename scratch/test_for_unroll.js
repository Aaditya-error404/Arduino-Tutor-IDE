const forRegex = /for\s*\(\s*(?:(?:int|var|float|byte)\s+)?(\w+)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\)\s*\{?/;

const tests = [
  "for (pos = 0; pos <= 180; pos += 1) {",
  "for (pos = 180; pos >= 0; pos -= 1) {",
  "for (int i = 0; i < 8; i++) {",
  "for (int b = 0; b <= 255; b++) {",
  "for (int pwm = 0; pwm <= 255; pwm += 15) {"
];

for (const t of tests) {
  const m = t.match(forRegex);
  if (!m) {
    console.log("FAIL:", t);
    continue;
  }
  const varName = m[1];
  const startVal = parseFloat(m[2]) || 0;
  const condStr = m[3].trim();
  const stepStr = m[4].trim();

  // Determine endVal and direction
  let endVal = startVal;
  const numMatch = condStr.match(/(-?\d+)/);
  if (numMatch) endVal = parseFloat(numMatch[1]);

  let isAscending = endVal >= startVal;
  let rawStep = 1;
  const stepNum = stepStr.match(/(\d+)/);
  if (stepNum) rawStep = parseFloat(stepNum[1]) || 1;
  if (stepStr.includes('--') || stepStr.includes('-=')) rawStep = -Math.abs(rawStep);

  // If range is large (> 30 steps), pick a sensible stride for simulation smoothness (e.g. 10 to 20 steps total)
  const range = Math.abs(endVal - startVal);
  let effectiveStep = rawStep;
  if (range > 20 && Math.abs(rawStep) <= 2) {
    effectiveStep = isAscending ? Math.ceil(range / 12) : -Math.ceil(range / 12);
  }

  const values = [];
  let cur = startVal;
  for (let it = 0; it < 50; it++) {
    values.push(cur);
    if ((isAscending && cur >= endVal) || (!isAscending && cur <= endVal)) break;
    cur += effectiveStep;
    if (isAscending && cur > endVal) { values.push(endVal); break; }
    if (!isAscending && cur < endVal) { values.push(endVal); break; }
  }

  console.log(`[${t}] -> var=${varName}, values=${values.join(", ")}`);
}
