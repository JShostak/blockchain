const crypto = require('crypto');

class Validator {
    constructor(name, stake) {
        this.name = name;
        this.stake = stake;
    }
}

class PoSBlock {
    constructor(index, timestamp, data, previousHash, validator) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.validator = validator;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash +
            this.validator
        ).digest('hex');
    }
}

class PoSBlockchain {
    constructor(validators) {
        this.chain = [this.createGenesisBlock()];
        this.validators = validators;
    }

    createGenesisBlock() {
        return new PoSBlock(0, Date.now(), "Genesis Block", "0", "Genesis");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    selectValidator() {
        const totalStake = this.validators.reduce((sum, v) => sum + v.stake, 0);
        const pick = Math.random() * totalStake;

        let current = 0;
        for (const validator of this.validators) {
            current += validator.stake;
            if (current > pick) {
                return validator;
            }
        }
    }

    addBlock(data) {
        const validator = this.selectValidator();
        const latestBlock = this.getLatestBlock();

        const newBlock = new PoSBlock(
            latestBlock.index + 1,
            Date.now(),
            data,
            latestBlock.hash,
            validator.name
        );

        this.chain.push(newBlock);
        console.log(`Block ${newBlock.index} validated by ${validator.name} (stake=${validator.stake}) [Hash: ...${newBlock.hash.slice(-6)}]`);
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
        }
        return true;
    }
}

console.log("\n--- Starting PoS Blockchain Demo ---");

const validators = [
    new Validator("Alice", 5),
    new Validator("Bob", 10),
    new Validator("Charlie", 1)
];
const totalStakeDemo = validators.reduce((sum, v) => sum + v.stake, 0);

console.log("Validators:");
validators.forEach(v => {
    console.log(`- ${v.name}: stake=${v.stake} (${(v.stake / totalStakeDemo * 100).toFixed(1)}%)`);
});

const posBlockchain = new PoSBlockchain(validators);

console.log("\nAdding 5 blocks:");
for (let i = 0; i < 5; i++) {
    posBlockchain.addBlock(`Transaction data ${i + 1}`);
}

console.log("\n--- Tampering with Block 2 ---");
posBlockchain.chain[2].data = "Hacked PoS Data";
console.log(`Is chain valid after tampering? ${posBlockchain.isChainValid()}\n`);

console.log("--- Running 100-block simulation to check validator frequency ---");
const posBlockchainSim = new PoSBlockchain(validators);
const wins = { "Alice": 0, "Bob": 0, "Charlie": 0 };
const numBlocksSim = 100;

for (let i = 0; i < numBlocksSim; i++) {
    const validator = posBlockchainSim.selectValidator();
    const latestBlock = posBlockchainSim.getLatestBlock();
    const newBlock = new PoSBlock(
        latestBlock.index + 1,
        Date.now(),
        `Sim Block ${i}`,
        latestBlock.hash,
        validator.name
    );
    posBlockchainSim.chain.push(newBlock);
    wins[validator.name]++;
}

console.log(`Results after ${numBlocksSim} blocks:`);
validators.forEach(validator => {
    const winPercentage = (wins[validator.name] / numBlocksSim) * 100;
    const stakePercentage = (validator.stake / totalStakeDemo) * 100;
    console.log(`${validator.name}:`);
    console.log(`  Stake share: ${stakePercentage.toFixed(1)}%`);
    console.log(`  Validation wins: ${winPercentage.toFixed(1)}% (Count: ${wins[validator.name]})`);
});