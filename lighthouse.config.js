// Configuration Object
/** @type {import("./Lighthouse/types").DefaultConfig} */

const defaultConfig = {
  URL: "http://52.66.209.251:8000",
  fantom: {
    symbol: "FTM",
    rpc: "https://rpc.ftm.tools/",
    scan: "https://ftmscan.com/tx/",
    chain_id: "250",
    lighthouse_contract_address: "0xf468602B34C482f34ca498D9a0DE7957539961d3",
  },
  polygon: {
    symbol: "MATIC",
    rpc: "https://polygon-rpc.com/",
    scan: "https://polygonscan.com/tx/",
    chain_id: "137",
    lighthouse_contract_address: "0xaD13C488b01DbcE976B67e552Bd352e824E53E1D",
  },
  binance: {
    symbol: "BNB",
    rpc: "https://bsc-dataseed.binance.org/",
    scan: "https://bscscan.com/tx/",
    chain_id: "56",
    lighthouse_contract_address: "0xf81f7df9e0b2953e2666b208645a8cd5d2d9e845",
  },
  "fantom-testnet": {
    symbol: "FTM",
    rpc: "https://rpc.testnet.fantom.network/",
    scan: "https://testnet.ftmscan.com/",
    chain_id: "0xfa2",
    lighthouse_contract_address: "0x61E296FDc8c498Ed183a2D19FD5927736E46E3B6",
  },
  "polygon-testnet": {
    symbol: "MATIC",
    rpc: "https://rpc-mumbai.maticvigil.com/",
    scan: "https://mumbai.polygonscan.com/",
    chain_id: "80001",
    lighthouse_contract_address: "0xEe24a604d86fC158798031c70C4Cf9EB291aDdad",
  },
  "binance-testnet": {
    symbol: "BNB",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    scan: "https://testnet.bscscan.com/",
    chain_id: "97",
    lighthouse_contract_address: "0xbCEe1a1f22F316569951e8F833f61a6ffCeee535",
  },
};

module.exports = defaultConfig;
