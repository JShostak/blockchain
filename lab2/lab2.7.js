const { buildMerkleTree, getMerkleProof, verifyProof } = require('./merkle_lib');

const txs = [
  'tx#1: alice->bob:5',
  'tx#2: bob->carol:2',
  'tx#3: carol->dave:1',
  'tx#4: dave->alice:4',
  'tx#5: alice->carol:3',
];

const { root } = buildMerkleTree(txs);

const idx = 2; // 'tx#3...'
const proof = getMerkleProof(txs, idx);
const ok1 = verifyProof(txs[idx], proof, root);

const tamperedTx = 'tx#3: carol->dave:999';
const bad1 = verifyProof(tamperedTx, proof, root);

const badProof = proof.slice();
if (badProof.length > 0) {
  badProof[0] = { ...badProof[0], position: badProof[0].position === 'left' ? 'right' : 'left' };
}
const bad2 = verifyProof(txs[idx], badProof, root);

const notExists = 'tx#999: xxx->yyy:1';
const bad3 = verifyProof(notExists, proof, root);

console.log('merkleRoot:', root);
console.log('\n(1) Існуюча tx, коректний proof  →', ok1);
console.log('(2a) Змінена tx (дані)           →', bad1);
console.log('(2b) Підмінено напрямок у proof  →', bad2);
console.log('(3) Немає такої tx               →', bad3);
