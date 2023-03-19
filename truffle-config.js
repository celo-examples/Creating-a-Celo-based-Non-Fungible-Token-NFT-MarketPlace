require('dotenv').config();

const ContractKit = require('@celo/contractkit');
const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org');
const privateKey = process.env.PRIVATE_KEY.replace('0x', '');
const account = kit.web3.eth.accounts.privateKeyToAccount(privateKey);
kit.defaultAccount = account.address;
kit.web3.eth.accounts.wallet.add(account);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    alfajores: {
      provider: kit.web3.currentProvider,
      network_id: 44787,
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
};