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

const input = process.argv.slice(2).join(' ') || 'Blockchain basics';
const h256 = sha256Hex(input);
const h3 = sha3_256_Hex(input);

console.log('Вхідний рядок:', input);
console.log('SHA-256 :', h256, `(len=${h256.length} hex)`);
console.log('SHA3-256:', h3,    `(len=${h3.length} hex)`);

console.log('\nВисновок:');
console.log('- Довжина обох хешів однакова: 256 біт = 64 hex.');
console.log('- На практиці SHA-256 зазвичай швидший у багатьох реалізаціях; SHA-3 вважають сучасним стандартом з іншим криптографічним підґрунтям (Keccak).');
