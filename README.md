# Lydia Farming contracts 🦁

Feel free to read the code.

## Deployed Contracts

- Init code hash - `0x47cc4f3a5e7a237c464e09c6758ac645084f198b8f64eedc923317ac4481a10c`


|	Contract	    |	Testnet (Fuji)	                            |	Mainnet	                                    |
|	------------	|	------------	                            |	------------                                |
|   Factory     	|   [0xa7d1701752cE8693098370d47959cE2a59A605b7](https://cchain.explorer.avax-test.network/address/0xa7d1701752cE8693098370d47959cE2a59A605b7)  |   [0xe0C1bb6DF4851feEEdc3E14Bd509FEAF428f7655](https://cchain.explorer.avax.network/address/0xe0C1bb6DF4851feEEdc3E14Bd509FEAF428f7655)  |
|   Router       	|   [0x7791E98C3eC430eacd5B62843dA16Ff8bb462FB2](https://cchain.explorer.avax-test.network/address/0x7791E98C3eC430eacd5B62843dA16Ff8bb462FB2)  |   [0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27](https://cchain.explorer.avax.network/address/0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27)  |
|   LydToken     	|   [0xDe5D7A6484E885eDcCA237dFa93E970DA60F74Db](https://cchain.explorer.avax-test.network/address/0xDe5D7A6484E885eDcCA237dFa93E970DA60F74Db)  |   [0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084](https://cchain.explorer.avax.network/address/0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084)  |
|   Electrum        |   [0x4534211eB122cd8044F763bAeF20fB868c30f772](https://cchain.explorer.avax-test.network/address/0x4534211eB122cd8044F763bAeF20fB868c30f772)  |   [0x814409AbbC142fa5824C034d564D8D738b20cD51](https://cchain.explorer.avax.network/address/0x814409AbbC142fa5824C034d564D8D738b20cD51)  |
|   MasterChef     	|   [0x520b56F7C10364F2d56D9B380E0886dAcBde4e1c](https://cchain.explorer.avax-test.network/address/0x520b56F7C10364F2d56D9B380E0886dAcBde4e1c)  |   [0xFb26525B14048B7BB1F3794F6129176195Db7766](https://cchain.explorer.avax.network/address/0xFb26525B14048B7BB1F3794F6129176195Db7766)  |
|   MultiCall     	|   [0x99f986ff6DeE70f68C5791A3458EDb7aa4dbDb2a](https://cchain.explorer.avax-test.network/address/0x99f986ff6DeE70f68C5791A3458EDb7aa4dbDb2a)  |   [0x98e2060F672FD1656a07bc12D7253b5e41bF3876](https://cchain.explorer.avax.network/address/0x98e2060F672FD1656a07bc12D7253b5e41bF3876)  |
|   Airdrop     	|   [0xCB352441720a070A7C00C67AbD02447514A7173A](https://cchain.explorer.avax-test.network/address/0xCB352441720a070A7C00C67AbD02447514A7173A)  |   [0x2e00De8fa96056486eDf668136dC9dD50E1Dc4a7](https://cchain.explorer.avax.network/address/0x2e00De8fa96056486eDf668136dC9dD50E1Dc4a7)  |

## Development

Install dependencies.

> yarn

## Test

> yarn test

## Deploy

Set the ACCOUNT environment variable with the private key of the account you want to deploy with.

> export ACCOUNT=0x13123213213123213213123123

Deploy scripts can be found separately inside the `scripts` directory.

For example, the following code is to deploy the MasterChef contract.

> npx hardhat --network fuji run scripts/deploy-master-chef.js

(Use `fuji` for testnet, `mainnet` for production)
