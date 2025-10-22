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

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randString(n=16) {
  let s = '';
  for (let i=0; i<n; i++) {
    const idx = crypto.randomInt(0, alphabet.length);
    s += alphabet[idx];
  }
  return s;
}

function mutateOneChar(s) {
  const pos = crypto.randomInt(0, s.length);
  let newChar = s[pos];
  while (newChar === s[pos]) {
    newChar = alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return s.slice(0, pos) + newChar + s.slice(pos+1);
}

const s1 = randString(16);
const h1 = sha256Hex(s1);
const s2 = mutateOneChar(s1);
const h2 = sha256Hex(s2);

const b1 = hexToBuffer(h1);
const b2 = hexToBuffer(h2);
const bitDiff = countBitsDifferent(b1, b2);

console.log('Оригінал:', s1);
console.log('Хеш    :', h1);
console.log('Мутація:', s2);
console.log('Хеш    :', h2);
console.log(`Бітова різниця між хешами: ${bitDiff} біт із 256 (~${(bitDiff/256*100).toFixed(1)}%)`);
console.log('\nКоментар: «Ефект лавини» означає, що мінімальна зміна вхідних даних радикально змінює хеш — критично для незворотності та цілісності у блокчейні.');
