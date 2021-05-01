const web3 = require("web3");
const inquirer = require("inquirer");

require("@nomiclabs/hardhat-ethers");

async function main() {

  const [deployer] = await ethers.getSigners();

  let LYD = "";

  if (process.env.HARDHAT_NETWORK === "fuji") {
    LYD = "0xDe5D7A6484E885eDcCA237dFa93E970DA60F74Db";
  } else if (process.env.HARDHAT_NETWORK === "mainnet") {
    LYD = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084";
  } else {
    console.error("Not a valid network!");
    process.exit(1);
  }

  console.log("Deploying to:", process.env.HARDHAT_NETWORK);

  if (!deployer) {
    console.error("No deployer account!");
    process.exit(1);
  }

  const balanceRaw = (await deployer.getBalance()).toString();
  const balance = web3.utils.fromWei(balanceRaw);

  console.log("LydToken: ", LYD)
  console.log("Deploying ElectrumBar contract with the account:", deployer.address);
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")");

  async function deploy() {
    console.log("Deploying...");

    const ElectrumBar = await ethers.getContractFactory("ElectrumBar");
    const electrumBar = await ElectrumBar.deploy(LYD);
    console.log("ElectrumBar address:", electrumBar.address);

    console.log("Done 🎉");
  }

  async function cancel() {
    console.log("Cancelled");
  }

  return inquirer
    .prompt([
      {
        "name": "confirm",
        "message": "Continue? (y/n)",
        "validate": (a) => {
          return a === "y" || a === "n";
        }
      }
    ])
    .then(answers => {
      if (answers.confirm === "y") {
        return deploy();
      }

      if (answers.confirm === "n") {
        return cancel();
      }
    });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
