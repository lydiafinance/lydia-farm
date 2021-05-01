const web3 = require("web3");
const inquirer = require("inquirer");

require("@nomiclabs/hardhat-ethers");

async function main() {

  const [deployer] = await ethers.getSigners();

  let LYD = "";
  let ELECTRUM = "";
  let DEV = "0x9209adf091dea173b4e8c47b9441275b9e423f59";
  let PER_SEC = "10000000000000000000";  // 10
  let START_TS = 1618941600;

  if (process.env.HARDHAT_NETWORK === "fuji") {
    LYD = "0xDe5D7A6484E885eDcCA237dFa93E970DA60F74Db";
    ELECTRUM = "0x4534211eB122cd8044F763bAeF20fB868c30f772";
  } else if (process.env.HARDHAT_NETWORK === "mainnet") {
    LYD = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084";
    ELECTRUM = "0x814409AbbC142fa5824C034d564D8D738b20cD51";
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
  const perSec = web3.utils.fromWei(PER_SEC);

  console.log("LYD: ", LYD)
  console.log("ELECTRUM: ", ELECTRUM)
  console.log("DEV: ", DEV)
  console.log("PER_BLOCK: ", PER_SEC, "(" + perSec + " secs)")
  console.log("START_TS: ", START_TS)
  console.log("Deploying MasterChef contract with the account:", deployer.address);
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")");

  async function deploy() {
    console.log("Deploying...");

    const MasterChef = await ethers.getContractFactory("Croesus");
    const masterChef = await MasterChef.deploy(LYD, ELECTRUM, DEV, PER_SEC, START_TS);
    console.log("MasterChef address:", masterChef.address);

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
