const crypto = require('crypto');

function canonicalJson(obj) { return JSON.stringify(obj); }

function signDoc(doc, privateKey) {
  const data = canonicalJson(doc);
  return crypto.sign('sha256', Buffer.from(data, 'utf8'), privateKey);
}

function verifyDoc(doc, signature, publicKey) {
  const data = canonicalJson(doc);
  return crypto.verify('sha256', Buffer.from(data, 'utf8'), publicKey, signature);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const doc = { id: 'DOC-123', content: 'Зміст тестового документу.' };
const sig = signDoc(doc, privateKey);

const a_ok = verifyDoc(doc, sig, publicKey);

const tampered = { ...doc, content: 'Змінений зміст.' };
const b_ok = verifyDoc(tampered, sig, publicKey);

const pair2 = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
const wrongSig = signDoc(doc, pair2.privateKey);
const c_ok = verifyDoc(doc, wrongSig, publicKey);

console.log('Публічний ключ:');
console.log(publicKey.split('\n').slice(0,4).join('\n') + '\n...');
console.log('\n(a) Справжній документ →', a_ok);
console.log('(b) Документ змінено   →', b_ok);
console.log('(c) Підпис підмінено   →', c_ok);
