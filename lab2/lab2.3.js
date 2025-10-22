const crypto = require('crypto');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function sha3_256_Hex(input) {
  try {
    return crypto.createHash('sha3-256').update(input).digest('hex');
  } catch (e) {
    try {
      const { sha3_256 } = require('js-sha3');
      return sha3_256(typeof input === 'string' ? Buffer.from(input, 'utf8') : input);
    } catch (e2) {
      console.error('SHA3 недоступний: встановіть пакет js-sha3 -> npm i js-sha3');
      throw e2;
    }
  }
}

function hexToBuffer(hex) {
  return Buffer.from(hex, 'hex');
}

function countBitsDifferent(bufA, bufB) {
  const len = Math.min(bufA.length, bufB.length);
  let diff = 0;
  for (let i = 0; i < len; i++) {
    let x = bufA[i] ^ bufB[i];
    while (x) { diff++; x &= x - 1; }
  }
  for (let j = len; j < Math.max(bufA.length, bufB.length); j++) {
    let x = (bufA.length > bufB.length ? bufA[j] : bufB[j]);
    while (x) { diff++; x &= x - 1; }
  }
  return diff;
}

const n = Math.max(1, Math.min(5, parseInt(process.argv[2] || '3', 10)));
const base = 'student_test';
const seen = new Map();

let attempts = 0;
let nonce = 0;
let found = null;

while (!found) {
  const str = `${base}${nonce}`;
  const h = sha256Hex(str);
  const prefix = h.slice(0, n);
  attempts++;
  if (seen.has(prefix)) {
    const prev = seen.get(prefix);
    if (prev.str !== str) {
      found = {a: prev, b: {str, h, nonce}};
      break;
    }
  } else {
    seen.set(prefix, {str, h, nonce});
  }
  nonce++;
}

console.log(`n = ${n} hex-символів префікса`);
console.log(`Кількість спроб до колізії: ${attempts}`);
console.log('\nВаріант A:');
console.log('  Рядок:', found.a.str);
console.log('  Хеш  :', found.a.h);
console.log('\nВаріант B:');
console.log('  Рядок:', found.b.str);
console.log('  Хеш  :', found.b.h);
console.log('\nПояснення: ми порівнювали лише перші n символів, тож це псевдо-«колізія префікса», а не справжня повна колізія SHA-256.');
