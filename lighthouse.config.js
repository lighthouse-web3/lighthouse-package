// Configuration Object
/** @type {import("./Lighthouse/types").DefaultConfig} */

const defaultConfig = {
  URL: "https://api.lighthouse.storage",
  node: "https://node.lighthouse.storage/api/v0/add",
  network: "polygon",
  gbInBytes: 1073741824,
  costPerGB: 5,
  fantom: {
    symbol: "FTM",
    rpc: "https://speedy-nodes-nyc.moralis.io/8fcbf40af9af2844774d0ea2/fantom/mainnet",
    scan: "https://ftmscan.com/tx/",
    chain_id: "250",
    lighthouse_contract_address: "0xf468602B34C482f34ca498D9a0DE7957539961d3",
  },
  polygon: {
    symbol: "MATIC",
    rpc: "https://speedy-nodes-nyc.moralis.io/8fcbf40af9af2844774d0ea2/polygon/mainnet",
    scan: "https://polygonscan.com/tx/",
    chain_id: "137",
    lighthouse_contract_address: "0xaD13C488b01DbcE976B67e552Bd352e824E53E1D",
  },
  binance: {
    symbol: "BNB",
    rpc: "https://speedy-nodes-nyc.moralis.io/8fcbf40af9af2844774d0ea2/bsc/mainnet",
    scan: "https://bscscan.com/tx/",
    chain_id: "56",
    lighthouse_contract_address: "0x340ff23c060626644e55fc10298c5e995b1f41c1",
  },
  optimism: {
    symbol: "ETH",
    rpc: "https://mainnet.optimism.io",
    scan: "https://optimistic.etherscan.io/tx/",
    chain_id: "10",
    lighthouse_contract_address: "0x61e296fdc8c498ed183a2d19fd5927736e46e3b6",
  },
  "fantom-testnet": {
    symbol: "FTM",
    rpc: "https://rpc.testnet.fantom.network/",
    scan: "https://testnet.ftmscan.com/tx/",
    chain_id: "0xfa2",
    lighthouse_contract_address: "0x61E296FDc8c498Ed183a2D19FD5927736E46E3B6",
  },
  "polygon-testnet": {
    symbol: "MATIC",
    rpc: "https://speedy-nodes-nyc.moralis.io/8fcbf40af9af2844774d0ea2/polygon/mumbai",
    scan: "https://mumbai.polygonscan.com/tx/",
    chain_id: "80001",
    lighthouse_contract_address: "0xEe24a604d86fC158798031c70C4Cf9EB291aDdad",
  },
  "binance-testnet": {
    symbol: "BNB",
    rpc: "https://speedy-nodes-nyc.moralis.io/8fcbf40af9af2844774d0ea2/bsc/testnet",
    scan: "https://testnet.bscscan.com/tx/",
    chain_id: "97",
    lighthouse_contract_address: "0x53f4a7d35AcDc5024587c5fA1E3bEcC6233888E9",
  },
  "optimism-testnet": {
    symbol: "ETH",
    rpc: "https://kovan.optimism.io/",
    scan: "https://kovan-optimistic.etherscan.io/tx/",
    chain_id: "69",
    lighthouse_contract_address: "0x61e296fdc8c498ed183a2d19fd5927736e46e3b6",
  },
};

module.exports = defaultConfig;
