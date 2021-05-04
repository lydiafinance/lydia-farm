const web3 = require("web3");
const inquirer = require("inquirer");

require("@nomiclabs/hardhat-ethers");

async function main() {

  const [deployer] = await ethers.getSigners();

  let SYRUP = "0x12F81569Fe25657589628B4637d0F16095d87973"; // testnet lyd
  let REWARD_TOKEN = "0x6d3b5f42f625031304a86dfbc6bba506f6047088"; // testnet uni
  let REWARD_PER_BLOCK = "15000000000000000"; // 0,015
  let START_TS = "1620155100"
  let BONUS_END_TS = "1620327900"

  if (process.env.HARDHAT_NETWORK === "mainnet") {
    SYRUP = "";
    REWARD_TOKEN = "";
    REWARD_PER_BLOCK = "";
    START_TS = "";
    BONUS_END_TS = "";
  }

  console.log("Deploying to:", process.env.HARDHAT_NETWORK);

  if (!deployer) {
    console.error("No deployer account!");
    process.exit(1);
  }

  const balanceRaw = (await deployer.getBalance()).toString();
  const balance = web3.utils.fromWei(balanceRaw);


  console.log("SYRUP: ", SYRUP);
  console.log("REWARD_TOKEN: ", REWARD_TOKEN);
  console.log("REWARD_PER_BLOCK: ", REWARD_PER_BLOCK);
  console.log("START_TS: ", START_TS);
  console.log("BONUS_END_TS: ", BONUS_END_TS);

  console.log("Deploying Herodotus contract with the account:", deployer.address);
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")");

  async function deploy() {
    console.log("Deploying...");

    const Herodotus = await ethers.getContractFactory("Herodotus");
    const herodotus = await Herodotus.deploy(SYRUP, REWARD_TOKEN, REWARD_PER_BLOCK, START_TS, BONUS_END_TS);
    console.log("Herodotus address:", herodotus.address);

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
