import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:8545');

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_newGreet", "type": "string" }],
    "name": "setGreet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = '0xbCea35806daFc2Df088f8C2F210D0e64D54af279';
const contract = new web3.eth.Contract(abi, contractAddress);

const main = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("✅ Акаунти:", accounts);

  const message = await contract.methods.greet().call();
  console.log("📩 Початкове повідомлення:", message);

  await contract.methods.setGreet("Hello from PyCharm via Web3 and Remix!")
        .send({ from: accounts[0] });

  const updated = await contract.methods.greet().call();
  console.log("🔁 Оновлене повідомлення:", updated);
};
main();
