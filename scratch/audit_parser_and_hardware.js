const fs = require('fs');

// We can import or mirror compiler.ts sanitizeCpp and compileProgram logic
function sanitizeCpp(code) {
  if (!code) return '';
  return code
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<;/g, '<=')
    .replace(/<([^a-zA-Z0-9_\s])/g, '<=')
    .replace(/\r\n/g, '\n');
}

function parseInstruction(lineIndex, phase, rawCpp) {
  const trimmed = rawCpp.trim();
  const lower = trimmed.toLowerCase();

  const pinMatch = trimmed.match(/pinMode\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/i);
  if (pinMatch) {
    const pin = isNaN(Number(pinMatch[1])) ? pinMatch[1] : Number(pinMatch[1]);
    return { type: 'pinMode', pin, param: pinMatch[2].toUpperCase(), rawCpp };
  }

  const dwMatch = trimmed.match(/digitalWrite\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/i);
  if (dwMatch) {
    const pin = isNaN(Number(dwMatch[1])) ? dwMatch[1] : Number(dwMatch[1]);
    const val = dwMatch[2].toUpperCase() === 'HIGH' || dwMatch[2] === '1';
    return { type: 'digitalWrite', pin, value: val, rawCpp };
  }

  const awMatch = trimmed.match(/analogWrite\s*\(\s*(\w+)\s*,\s*(\d+|\w+)\s*\)/i);
  if (awMatch) {
    const pin = isNaN(Number(awMatch[1])) ? awMatch[1] : Number(awMatch[1]);
    const val = parseInt(awMatch[2], 10) || 0;
    return { type: 'analogWrite', pin, value: val, rawCpp };
  }

  const swMatch = trimmed.match(/\.write\s*\(\s*(\d+|\w+)\s*\)/i);
  if (swMatch && !lower.includes('serial.')) {
    const angle = parseInt(swMatch[1], 10);
    return { type: 'servoWrite', value: isNaN(angle) ? 90 : angle, rawCpp };
  }

  const saMatch = trimmed.match(/\.attach\s*\(\s*(\w+)\s*\)/i);
  if (saMatch) {
    const pin = isNaN(Number(saMatch[1])) ? saMatch[1] : Number(saMatch[1]);
    return { type: 'servoAttach', pin, rawCpp };
  }

  const toneMatch = trimmed.match(/tone\s*\(\s*(\w+)\s*,\s*(\d+)(?:,\s*(\d+))?\s*\)/i);
  if (toneMatch) {
    const pin = isNaN(Number(toneMatch[1])) ? toneMatch[1] : Number(toneMatch[1]);
    const freq = parseInt(toneMatch[2], 10) || 440;
    return { type: 'tone', pin, value: freq, rawCpp };
  }

  if (lower.includes('notone')) {
    return { type: 'noTone', rawCpp };
  }

  const delMatch = trimmed.match(/delay\s*\(\s*(\d+)\s*\)/i);
  if (delMatch) {
    const ms = parseInt(delMatch[1], 10) || 1000;
    return { type: 'delay', durationMs: ms, rawCpp };
  }

  if (lower.includes('serial.print')) {
    return { type: 'serial', rawCpp };
  }

  const lcdMatch = trimmed.match(/lcd\.print\s*\(\s*(?:"([^"]*)"|([^)]+))\s*\)/i);
  if (lcdMatch) {
    return { type: 'lcd', value: lcdMatch[1] ?? lcdMatch[2], rawCpp };
  }

  return { type: 'other', rawCpp };
}

function compileProgram(rawCpp) {
  const sanitizedCpp = sanitizeCpp(rawCpp);
  const lines = sanitizedCpp.split('\n');
  const setupSteps = [];
  const loopSteps = [];
  let phase = 'global';

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx];
    const trimmed = raw.trim();
    if (trimmed.includes('void setup()')) {
      phase = 'setup';
      setupSteps.push({ type: 'header', rawCpp: raw });
      continue;
    }
    if (trimmed.includes('void loop()')) {
      phase = 'loop';
      loopSteps.push({ type: 'header', rawCpp: raw });
      continue;
    }
    if (!trimmed || trimmed.startsWith('//') || trimmed === '{' || trimmed === '}') continue;
    const node = parseInstruction(idx, phase === 'setup' ? 'setup' : 'loop', raw);
    if (phase === 'setup') setupSteps.push(node);
    else loopSteps.push(node);
  }
  return { setupSteps, loopSteps };
}

const labs = JSON.parse(fs.readFileSync('scratch/all_labs_extracted.json', 'utf8'));

const auditResults = [];

for (const lab of labs) {
  const labAudit = {
    id: lab.id,
    name: lab.name,
    lessons: []
  };

  for (const lesson of lab.lessons) {
    const compiled = compileProgram(lesson.cpp);
    const parsedTypes = [...compiled.setupSteps, ...compiled.loopSteps].map(s => s.type);
    const hasDelay = parsedTypes.includes('delay');
    const hasDigitalWrite = parsedTypes.includes('digitalWrite');
    const hasAnalogWrite = parsedTypes.includes('analogWrite');
    const hasServoWrite = parsedTypes.includes('servoWrite');
    const hasTone = parsedTypes.includes('tone');
    const hasSerial = parsedTypes.includes('serial');
    const hasLcd = parsedTypes.includes('lcd');
    const hasOtherOnly = parsedTypes.every(t => t === 'other' || t === 'header');

    labAudit.lessons.push({
      lessonId: lesson.id,
      title: lesson.title,
      rawCppLines: lesson.cpp.split('\n').filter(l => l.trim().length > 0).length,
      setupCount: compiled.setupSteps.length,
      loopCount: compiled.loopSteps.length,
      parsedTypes: Array.from(new Set(parsedTypes)),
      hasExecutableHardwareAction: hasDigitalWrite || hasAnalogWrite || hasServoWrite || hasTone || hasLcd,
      rawCppSample: lesson.cpp.slice(0, 120).replace(/\n/g, ' ')
    });
  }
  auditResults.push(labAudit);
}

fs.writeFileSync('scratch/parsed_hardware_audit.json', JSON.stringify(auditResults, null, 2), 'utf8');
console.log("Saved scratch/parsed_hardware_audit.json");
