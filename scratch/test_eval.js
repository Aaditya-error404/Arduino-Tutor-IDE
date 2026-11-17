const hw = { buttonPressed: true, potVal: 512, temperatureC: 32.5, distanceCm: 25.0, activeLab: 'button' };
const vars = { angle: 90, val: 512, ledState: false, melody: [262, 294, 330, 349, 392, 440, 494, 523] };

function evaluateExpr(expr, vars, hw) {
  const digitalRead = (p) => {
    if (hw.activeLab === 'button') return hw.buttonPressed ? 0 : 1;
    if (hw.activeLab === 'ir') return hw.irReflectRaw > 500 ? 1 : 0;
    return hw.pinStates && hw.pinStates[p] ? 1 : 0;
  };
  const analogRead = (p) => {
    const pinStr = String(p).toUpperCase();
    if (pinStr === 'A0' || pinStr === '0' || pinStr === '14') {
      if (hw.activeLab === 'pot') return hw.potVal;
      if (hw.activeLab === 'gas') return Math.round((hw.gasPpm / 800) * 1023);
      if (hw.activeLab === 'temp') return Math.round(((hw.temperatureC * 0.01 + 0.5) / 5.0) * 1023);
      return hw.potVal;
    }
    if (pinStr === 'A1' || pinStr === '1' || pinStr === '15') {
      if (hw.activeLab === 'ldr') return hw.ldrRaw;
      if (hw.activeLab === 'soil') return Math.round((hw.soilMoisturePct / 100) * 1023);
      return hw.ldrRaw;
    }
    if (pinStr === 'A2' || pinStr === '2' || pinStr === '16') {
      return Math.round(((hw.temperatureC * 0.01 + 0.5) / 5.0) * 1023);
    }
    return 512;
  };
  const map = (v, a, b, c, d) => Math.round((v - a) * (d - c) / (b - a) + c);
  const constrain = (v, min, max) => Math.max(min, Math.min(max, v));
  const pulseIn = (p, val) => Math.round(hw.distanceCm * 58.2);
  const isnan = (v) => isNaN(v);
  const pow = Math.pow;

  const dht = {
    readTemperature: () => hw.temperatureC,
    readHumidity: () => hw.humidityPct
  };
  const rfid = {
    PICC_IsNewCardPresent: () => hw.rfidScannedUid !== null,
    PICC_ReadCardSerial: () => hw.rfidScannedUid !== null
  };

  // Clean C++ types if any remain
  let clean = expr.trim().replace(/;\s*$/, '');
  clean = clean.replace(/\bfloat\b|\bint\b|\bbool\b|\bbyte\b/g, '');
  clean = clean.replace(/\bHIGH\b/g, '1');
  clean = clean.replace(/\bLOW\b/g, '0');
  clean = clean.replace(/F\(([^)]+)\)/g, '$1');

  try {
    const fn = new Function(
      'vars', 'hw', 'digitalRead', 'analogRead', 'map', 'constrain', 'pulseIn', 'isnan', 'pow', 'dht', 'rfid',
      `with(vars) { return (${clean}); }`
    );
    return fn(vars, hw, digitalRead, analogRead, map, constrain, pulseIn, isnan, pow, dht, rfid);
  } catch (err) {
    console.error("Eval error for expr:", expr, err.message);
    return 0;
  }
}

console.log('digitalRead(2) == LOW:', evaluateExpr('digitalRead(2) == LOW', vars, hw));
console.log('map(val, 0, 1023, 0, 180):', evaluateExpr('map(val, 0, 1023, 0, 180)', vars, hw));
console.log('melody[2]:', evaluateExpr('melody[2]', vars, hw));
console.log('tempC calculation:', evaluateExpr('((analogRead(A2) * 5.0 / 1024.0) - 0.5) * 100.0', vars, hw));
