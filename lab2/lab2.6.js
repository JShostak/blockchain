const { sha256Hex, buildMerkleTree } = require('./merkle_lib');

function blockHash({ prevHash, timestamp, merkleRoot, nonce=0 }) {
  const header = Buffer.concat([
    Buffer.from(prevHash || '', 'hex'),
    Buffer.from(String(timestamp), 'utf8'),
    Buffer.from(merkleRoot || '', 'hex'),
    Buffer.from(String(nonce), 'utf8'),
  ]);
  return sha256Hex(header);
}

const genesisTx = [
  JSON.stringify({ from: 'bank', to: 'alice', amount: 50 }),
  JSON.stringify({ from: 'bank', to: 'bob', amount: 50 }),
  JSON.stringify({ from: 'alice', to: 'bob', amount: 10 }),
];
const gMerkle = buildMerkleTree(genesisTx);
const genesis = {
  index: 0,
  prevHash: ''.padStart(64,'0'),
  timestamp: Date.now(),
  merkleRoot: gMerkle.root,
  nonce: 0,
};
genesis.hash = blockHash(genesis);

console.log('--- Блок #0 (genesis) ---');
console.log('tx:', genesisTx);
console.log('merkleRoot:', genesis.merkleRoot);
console.log('blockHash :', genesis.hash);

const tx1 = [
  JSON.stringify({ from: 'bob', to: 'carol', amount: 5 }),
  JSON.stringify({ from: 'alice', to: 'dave', amount: 7 }),
  JSON.stringify({ from: 'dave', to: 'bob', amount: 3 }),
];
const m1 = buildMerkleTree(tx1);
const block1 = {
  index: 1,
  prevHash: genesis.hash,
  timestamp: Date.now(),
  merkleRoot: m1.root,
  nonce: 0,
};
block1.hash = blockHash(block1);

console.log('\n--- Блок #1 ---');
console.log('tx:', tx1);
console.log('merkleRoot:', block1.merkleRoot);
console.log('blockHash :', block1.hash);

const tx1_mut = tx1.slice();
tx1_mut[1] = JSON.stringify({ from: 'alice', to: 'dave', amount: 8 }); // +1
const m1_mut = buildMerkleTree(tx1_mut);
const block1_mut = { ...block1, merkleRoot: m1_mut.root };
block1_mut.hash = blockHash(block1_mut);

console.log('\n--- Зміна однієї транзакції в блоці #1 ---');
console.log('tx (mut):', tx1_mut);
console.log('merkleRoot (старий):', block1.merkleRoot);
console.log('merkleRoot (новий):', block1_mut.merkleRoot);
console.log('blockHash  (старий):', block1.hash);
console.log('blockHash  (новий):', block1_mut.hash);

console.log('\nВисновок: мінімальна зміна tx → інший merkleRoot → інший hash блоку. Якщо є наступні блоки, ланцюг стає невалідним без перемайнінгу.');
