const {expect} = require("chai");

const {LYD_PER_SEC} = require("./constants");

const START_TS = Math.floor(Date.now() / 1000);

const {toWei, bn2Num} = require("./util");

describe("MasterChef", function () {
  let DEPLOYER;
  let ATYS;
  let LYDUS;
  let MANES;

  let lyd;
  let electrum;
  let masterChef;

  const mintLyd = (account, amount) => {
    return lyd.functions["mint(address,uint256)"](account, toWei(amount));
  }

  const mine = async (plusTs) => {
    await ethers.provider.send("evm_increaseTime", [plusTs]);
    await ethers.provider.send("evm_mine");
  }

  it("0- Setup accounts", async function () {
    const accounts = await ethers.getSigners();
    DEPLOYER = accounts[0];
    ATYS = accounts[1];
    LYDUS = accounts[2];
    MANES = accounts[3];
  });

  it("1- Deploy LYD", async function () {
    const LydToken = await ethers.getContractFactory("LydToken");
    lyd = await LydToken.connect(DEPLOYER).deploy();
    await lyd.deployed();
    console.log("Lyd address:", lyd.address);
  });

  it("2- Mint LYD", async function () {
    await mintLyd(ATYS.address, 1000);
    await mintLyd(LYDUS.address, 2000);
    await mintLyd(MANES.address, 4000);

    expect((await lyd.balanceOf(ATYS.address)).toString()).to.equal(toWei(1000));
    expect((await lyd.balanceOf(LYDUS.address)).toString()).to.equal(toWei(2000));
    expect((await lyd.balanceOf(MANES.address)).toString()).to.equal(toWei(4000));
  });

  it("3- Deploy Electrum", async function () {
    const Electrum = await ethers.getContractFactory("ElectrumBar");
    electrum = await Electrum.connect(DEPLOYER).deploy(lyd.address);

    console.log("Electrum address:", electrum.address);
  });

  it("4- Deploy MasterChef", async function () {
    const MasterChef = await ethers.getContractFactory("Croesus");
    masterChef = await MasterChef.connect(DEPLOYER).deploy(lyd.address, electrum.address, DEPLOYER.address, LYD_PER_SEC, START_TS);

    console.log("MasterChef address:", masterChef.address);
  });

  it("5- Transfer Ownership of LYD&Electrum", async function () {
    await lyd.connect(DEPLOYER).transferOwnership(masterChef.address);
    await electrum.connect(DEPLOYER).transferOwnership(masterChef.address);

    expect(await lyd.getOwner()).to.equal(masterChef.address);
    expect(await electrum.getOwner()).to.equal(masterChef.address);
  });

  it("6- Enter Staking", async function () {
    await lyd.connect(ATYS).approve(masterChef.address, toWei(400));
    await masterChef.connect(ATYS).enterStaking(toWei(400));
    expect((await electrum.balanceOf(ATYS.address)).toString()).to.equal(toWei(400));
    expect((await lyd.balanceOf(ATYS.address)).toString()).to.equal(toWei(600));

    await lyd.connect(LYDUS).approve(masterChef.address, toWei(1000));
    await masterChef.connect(LYDUS).enterStaking(toWei(1000));
    expect((await electrum.balanceOf(LYDUS.address)).toString()).to.equal(toWei(1000));
    expect((await lyd.balanceOf(LYDUS.address)).toString()).to.equal(toWei(1000));

    await lyd.connect(MANES).approve(masterChef.address, toWei(1400));
    await masterChef.connect(MANES).enterStaking(toWei(1400));
    expect((await electrum.balanceOf(MANES.address)).toString()).to.equal(toWei(1400));
    expect((await lyd.balanceOf(MANES.address)).toString()).to.equal(toWei(2600));
  });

  it("7- pendingLyd", async function () {
    await mine(100);
    const rewards1 = bn2Num(await masterChef.pendingLyd(0, ATYS.address));
    expect(rewards1).to.greaterThan(165); //  ~ 168.5714285708

    const rewards2 = bn2Num(await masterChef.pendingLyd(0, LYDUS.address));
    expect(rewards2).to.greaterThan(369); //  ~ 371.428571427

    const rewards3 = bn2Num(await masterChef.pendingLyd(0, MANES.address));
    expect(rewards3).to.greaterThan(497); //  ~ 499.9999999988
  });

  it("7- leaveStaking", async function () {
    const userInfo1 = await masterChef.userInfo(0, LYDUS.address);

    await masterChef.connect(LYDUS).leaveStaking(userInfo1.amount.toString());

    const userInfo2 = await masterChef.userInfo(0, LYDUS.address);
    expect(userInfo2.amount.toString()).to.equal("0");

    const balance = bn2Num(await lyd.balanceOf(LYDUS.address));
    expect(balance).to.greaterThan(2370); // ~ 2374.999999999

    expect((await electrum.balanceOf(LYDUS.address)).toString()).to.equal("0");
  });
});
