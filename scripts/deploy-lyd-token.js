const web3 = require("web3")
const inquirer = require("inquirer")

require("@nomiclabs/hardhat-ethers")

async function main() {

  const [deployer] = await ethers.getSigners()

  if (!process.env.HARDHAT_NETWORK) {
    console.error("Not a valid network!")
    process.exit(1)
  }

  console.log("Deploying to:", process.env.HARDHAT_NETWORK)

  if (!deployer) {
    console.error("No deployer account!")
    process.exit(1)
  }

  const balanceRaw = (await deployer.getBalance()).toString()
  const balance = web3.utils.fromWei(balanceRaw)

  console.log("Deploying LydToken contract with the account:", deployer.address)
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")")

  async function deploy() {
    console.log("Deploying...")

    const LydToken = await ethers.getContractFactory("LydToken")
    const lydToken = await LydToken.deploy()
    console.log("Lyd address:", lydToken.address)

    console.log("Done 🎉")
  }

  async function cancel() {
    console.log("Cancelled")
  }

  return inquirer
    .prompt([
      {
        "name": "confirm",
        "message": "Continue? (y/n)",
        "validate": (a) => {
          return a === "y" || a === "n"
        }
      }
    ])
    .then(answers => {
      if (answers.confirm === "y") {
        return deploy()
      }

      if (answers.confirm === "n") {
        return cancel()
      }
    })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
