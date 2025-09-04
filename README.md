# Lighthouse <img src="https://img.shields.io/badge/v0.4.2-green"/>

Lighthouse is a permanent decentralized file storage protocol that allows the ability to pay once and store forever. While traditionally, users need to repeatedly keep track and pay for their storage after every fixed amount of time, Lighthouse manages this for them and makes sure that user files are stored forever. The aim is to move users from a rent-based cost model where they are renting their own files on cloud storage to a permanent ownership model. It is built on top of IPFS, Filecoin, and Polygon. It uses the existing miner network and storage capacity of the filecoin network.

## Installation

```bash
npm install -g @lighthouse-web3/sdk
```

## CLI Usage

```bash
# Wallet management
lighthouse-web3 create-wallet                   # Create a new wallet
lighthouse-web3 import-wallet --key <private_key> # Import an existing wallet
lighthouse-web3 wallet-forget                   # Remove previously saved wallet
lighthouse-web3 reset-password                  # Change password of your wallet
lighthouse-web3 wallet                          # Returns wallet public address

# API Key management
lighthouse-web3 api-key --new                   # Generate a new API key
lighthouse-web3 api-key --import <key>          # Import an existing API key

# Storage and uploads
lighthouse-web3 upload <path>                   # Upload a file
lighthouse-web3 upload-encrypted <path>         # Upload a file encrypted
lighthouse-web3 decrypt-file <cid>              # Decrypt and download a file

# Data usage and balance
lighthouse-web3 balance                         # Get your data usage

# File and deal status
lighthouse-web3 deal-status <cid>               # Get filecoin deal status of a CID

# File management
lighthouse-web3 get-uploads                     # Get details of files uploaded
lighthouse-web3 delete-file <fileID>            # Delete a file

# Sharing and access control
lighthouse-web3 share-file <cid> <address>      # Share access to another user
lighthouse-web3 revoke-access <cid> <address>   # Revoke access on a file

# IPNS (InterPlanetary Naming System)
lighthouse-web3 ipns --generate-key             # Generate IPNS Key
lighthouse-web3 ipns --publish --cid <cid> --key <key> # Publish CID to IPNS
lighthouse-web3 ipns --list                     # List all IPNS keys
lighthouse-web3 ipns --remove <key>             # Remove an IPNS key

# Proof of Data Segment Inclusion (PODSI)
lighthouse-web3 podsi <cid>                     # Show Proof of Data Segment Inclusion for a CID
```

## NodeJs Example

```javascript
import lighthouse from '@lighthouse-web3/sdk'

// Create wallet
const wallet = await lighthouse.createWallet('Password for wallet encryption')

// Get wallet balance
const balance = await lighthouse.getBalance(wallet.data.publicKey)

// Upload File
const uploadResponse = await lighthouse.upload(
  '/home/cosmos/Desktop/wow.jpg',
  'YOUR_API_KEY'
)

> Refer [GitBook](https://docs.lighthouse.storage/lighthouse-1/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

This project is tested with [BrowserStack](https://www.browserstack.com/).

## License

[MIT](https://choosealicense.com/licenses/mit/)
```
