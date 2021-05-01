require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')

if (!process.env.FUJI_ACCOUNT || !process.env.MAIN_ACCOUNT) {
  console.error("Both FUJI_ACCOUNT and MAIN_ACCOUNT env variables are required!");
  process.exit(1);
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      gasPrice: 470000000000,
      chainId: 43112,
      initialDate: '2020-10-10'
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 470000000000,
      chainId: 43113,
      accounts: [process.env.FUJI_ACCOUNT]
    },
    mainnet: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 470000000000,
      chainId: 43114,
      accounts: [process.env.MAIN_ACCOUNT]
    }
  }
}
