const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const message = 'Підпис';
const signature = crypto.sign('sha256', Buffer.from(message, 'utf8'), privateKey);
const signatureB64 = signature.toString('base64');

const okOriginal = crypto.verify('sha256', Buffer.from(message, 'utf8'), publicKey, signature);
const okModified = crypto.verify('sha256', Buffer.from(message + ' (modified)', 'utf8'), publicKey, signature);

console.log('Публічний ключ:');
console.log(publicKey.split('\n').slice(0,4).join('\n') + '\n...');
console.log('\nПідпис (Base64):', signatureB64);
console.log('\nПеревірка:');
console.log('- Оригінальне повідомлення  :', okOriginal);
console.log('- Змінене повідомлення      :', okModified);
console.log('\nПояснення: приватний ключ ніколи не передають іншим, бо він надає можливість створювати дійсні підписи від вашого імені.');
