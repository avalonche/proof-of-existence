require('dotenv').config();
module.exports = {
    mnemonic: process.env["MNEMONIC"],
    infuraKey: process.env["INFURA_KEY"],
}