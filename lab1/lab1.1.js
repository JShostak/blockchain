const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash +
            this.nonce
        ).digest('hex');
    }

    mineBlock(difficulty) {
        console.time(`Mining block ${this.index}`);
        const target = "0".repeat(difficulty);
        let iterations = 0;

        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
            iterations++;
        }

        console.log(`Block Mined: ${this.hash}`);
        console.timeEnd(`Mining block ${this.index}`);
        console.log(`Nonce iterations: ${iterations}\n`);
    }
}

class Blockchain {
    constructor(difficulty = 3) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(
            latestBlock.index + 1,
            Date.now(),
            data,
            latestBlock.hash
        );

        console.log(`Mining block ${newBlock.index} with data: '${data}'...`);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    addBlockAlternative(data) {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(
            latestBlock.index + 1,
            Date.now(),
            data,
            latestBlock.hash
        );

        console.log(`Mining block ${newBlock.index} (Alternative)...`);
        console.time(`Mining block ${newBlock.index}`);
        let iterations = 0;

        while (newBlock.hash.charAt(2) !== '3') {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
            iterations++;
        }

        console.log(`Block Mined (Alternative): ${newBlock.hash}`);
        console.timeEnd(`Mining block ${newBlock.index}`);
        console.log(`Nonce iterations: ${iterations}\n`);
        this.chain.push(newBlock);
    }


    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Validation Error: Recalculated hash mismatch at block ${currentBlock.index}`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Validation Error: Previous hash mismatch at block ${currentBlock.index}`);
                return false;
            }

            const target = "0".repeat(this.difficulty);
            if (currentBlock.hash.substring(0, this.difficulty) !== target) {
                 console.log(`Validation Error: Hash does not meet difficulty at block ${currentBlock.index}`);
                return false;
            }
        }
        return true;
    }
}

console.log("--- Starting PoW Blockchain Demo ---");
const myBlockchain = new Blockchain(3); // Cкладність = 3

myBlockchain.addBlock("Transaction 1");
myBlockchain.addBlock("Transaction 2");
myBlockchain.addBlock("Transaction 3");

console.log(`Is chain valid? ${myBlockchain.isChainValid()}\n`);

console.log("--- Tampering with Block 1 ---");
myBlockchain.chain[1].data = "Hacked!";

console.log(`Is chain valid after tampering? ${myBlockchain.isChainValid()}\n`);