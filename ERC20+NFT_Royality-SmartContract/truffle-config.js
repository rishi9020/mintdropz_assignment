
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "twin almost smooth sorry cycle guide rain castle math book whisper organ";

// let provider = new HDWalletProvider({
//   mnemonic: {
//     phrase: mnemonicPhrase
//   },
//   providerOrUrl: "https://goerli.infura.io/v3/9fced4d7b6d341a5b5ba8167612d8e94"
// });

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" 
    },
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, "wss://rinkeby.infura.io/ws/v3/9fced4d7b6d341a5b5ba8167612d8e94");
       },
       network_id: 4,
       gas: 4500000,
       gasPrice: 10000000000,
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '0.6.6',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
