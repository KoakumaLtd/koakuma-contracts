require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    bsc: {
      url: "https://bsc-dataseed1.defibit.io/",
      //accounts: {mnemonic: mnemonic},
    }
    //bsctestnet: {
    //  url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //  accounts: ["32ffd5be0ac8aac19c8214201d26b5ccd58d40c7d8943c26bc192ca9058b1b74"]
    //},
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    // apiKey: ""
  },
};
