const web3 = require("web3");
const inquirer = require("inquirer");

require("@nomiclabs/hardhat-ethers");

async function main() {

  const [deployer] = await ethers.getSigners();

  let SYRUP = "";
  let REWARD_TOKEN = "";
  let REWARD_PER_BLOCK = ""
  let START_BLOCK = ""
  let BONUS_END_BLOCK = ""

  if (process.env.HARDHAT_NETWORK === "fuji") {
    SYRUP = "0x12F81569Fe25657589628B4637d0F16095d87973"; // lyd
    REWARD_TOKEN = "0x6d3b5f42f625031304a86dfbc6bba506f6047088"; // uni
    REWARD_PER_BLOCK = "1";
    START_BLOCK = "178377";
    BONUS_END_BLOCK = "278377";
  } else if (process.env.HARDHAT_NETWORK === "mainnet") {
    SYRUP = "";
    REWARD_TOKEN = "";
    REWARD_PER_BLOCK = "";
    START_BLOCK = "";
    BONUS_END_BLOCK = "";
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


  console.log("SYRUP: ", SYRUP);
  console.log("REWARD_TOKEN: ", REWARD_TOKEN);
  console.log("REWARD_PER_BLOCK: ", REWARD_PER_BLOCK);
  console.log("START_BLOCK: ", START_BLOCK);
  console.log("BONUS_END_BLOCK: ", BONUS_END_BLOCK);

  console.log("Deploying Herodotus contract with the account:", deployer.address);
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")");

  async function deploy() {
    console.log("Deploying...");

    const Herodotus = await ethers.getContractFactory("Herodotus");
    const herodotus = await Herodotus.deploy(SYRUP, REWARD_TOKEN, REWARD_PER_BLOCK, START_BLOCK, BONUS_END_BLOCK);
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
