const web3 = require("web3");

const {Decimal} = require("decimal.js")

const toWei = (s) => `${s}000000000000000000`;

const bn2Num = bn => new Decimal(web3.utils.fromWei(bn.toString(), "ether")).toNumber();

module.exports = {toWei, bn2Num};
