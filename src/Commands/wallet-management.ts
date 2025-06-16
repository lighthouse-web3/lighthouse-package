import { cyan, green, red, yellow } from 'kleur'
import { ethers } from 'ethers'
import fs from 'fs-extra'
import path from 'path'
import { config } from './utils/getNetwork'
import lighthouse from '../Lighthouse'
import readInput from './utils/readInput'
import { getNetwork } from './utils/getNetwork'
import { lighthouseConfig } from '../lighthouse.config'

interface WalletBackup {
  encryptedWallet: string
  publicKey: string
  backupDate: string
  network: string
}

export async function walletBackup() {
  try {
    const encryptedWallet = config.get('LIGHTHOUSE_GLOBAL_WALLET') as string
    if (!encryptedWallet) {
      throw new Error('No wallet found. Please create or import a wallet first!')
    }

    const backupDir = path.join(process.cwd(), 'wallet-backups')
    await fs.ensureDir(backupDir)

    const backup: WalletBackup = {
      encryptedWallet,
      publicKey: config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string,
      backupDate: new Date().toISOString(),
      network: (config.get('LIGHTHOUSE_GLOBAL_NETWORK') as string) || 'mainnet'
    }

    const backupFileName = `wallet-backup-${backup.publicKey.slice(0, 8)}-${Date.now()}.json`
    const backupPath = path.join(backupDir, backupFileName)

    await fs.writeJson(backupPath, backup, { spaces: 2 })
    console.log(green(`Wallet backup created successfully at: ${backupPath}`))
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}

export async function walletRestore(backupPath: string) {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found!')
    }

    const backup: WalletBackup = await fs.readJson(backupPath)
    
    const options = {
      prompt: 'Enter wallet password to restore:',
      silent: true,
      timeout: 30000,
    }

    const password = await readInput(options) as string
    
    try {
      await ethers.Wallet.fromEncryptedJsonSync(backup.encryptedWallet, password.trim())
    } catch (error) {
      throw new Error('Invalid password or corrupted backup!')
    }

    config.set('LIGHTHOUSE_GLOBAL_WALLET', backup.encryptedWallet)
    config.set('LIGHTHOUSE_GLOBAL_PUBLICKEY', backup.publicKey)
    config.set('LIGHTHOUSE_GLOBAL_NETWORK', backup.network)

    console.log(green('Wallet restored successfully!'))
    console.log(cyan(`Public Key: ${backup.publicKey}`))
    console.log(yellow(`Network: ${backup.network}`))
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}

export async function walletInfo() {
  try {
    const encryptedWallet = config.get('LIGHTHOUSE_GLOBAL_WALLET') as string
    if (!encryptedWallet) {
      throw new Error('No wallet found. Please create or import a wallet first!')
    }

    const apiKey = config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    if (!apiKey) {
      console.log(yellow('API key not found. Please set up your API key first using:'));
      console.log(yellow('lighthouse-web3 api-key --new'));
      process.exit(0);
    }

    const publicKey = config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string
    const network = (config.get('LIGHTHOUSE_GLOBAL_NETWORK') as string) || 'mainnet'
    

    try {
      const balance = await lighthouse.getBalance(apiKey)
      
      console.log(yellow('\nWallet Information:'))
      console.log(cyan('Public Key:') + Array(4).fill('\xa0').join('') + publicKey)
      console.log(cyan('Network:') + Array(7).fill('\xa0').join('') + network)
      console.log(cyan('Data Limit:') + Array(4).fill('\xa0').join('') + `${balance.data.dataLimit} bytes`)
      console.log(cyan('Data Used:') + Array(5).fill('\xa0').join('') + `${balance.data.dataUsed} bytes`)
      console.log(cyan('Data Remaining:') + Array(2).fill('\xa0').join('') + `${balance.data.dataLimit - balance.data.dataUsed} bytes`)
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log(red('API key is invalid or expired. Please generate a new API key using:'));
        console.log(yellow('lighthouse-web3 api-key --new'));
        process.exit(0);
      }
      throw error;
    }
    
    const backupDir = path.join(process.cwd(), 'wallet-backups')
    if (fs.existsSync(backupDir)) {
      const backups = await fs.readdir(backupDir)
      const walletBackups = backups.filter(file => file.includes(publicKey.slice(0, 8)))
      console.log(cyan('Backups:') + Array(7).fill('\xa0').join('') + `${walletBackups.length} found`)
    }


    if (
      network === 'polygon' ||
      network === 'fantom' ||
      network === 'binance' ||
      network === 'optimism'
    ) {
      const provider = new ethers.JsonRpcProvider(
        lighthouseConfig[network]['rpc']
      )

      const contractABI = [
        {
          constant: true,
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ]

      const contractUSDT = new ethers.Contract(
        lighthouseConfig[network]['usdt_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('\r\nUSDT Balance: ') +
          Array(2).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractUSDT.balanceOf(publicKey),
            lighthouseConfig[network]['usd_contract_decimal']
          )
      )

      const contractUSDC = new ethers.Contract(
        lighthouseConfig[network]['usdc_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('USDC Balance: ') +
          Array(2).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractUSDC.balanceOf(publicKey),
            lighthouseConfig[network]['usd_contract_decimal']
          )
      )

    
      const contractDai = new ethers.Contract(
        lighthouseConfig[network]['dai_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('DAI Balance: ') +
          Array(3).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractDai.balanceOf(publicKey),
            lighthouseConfig[network]['dai_contract_decimal']
          )
      )

     
      console.log(
        yellow(network) +
          ':' +
          Array(15 - network.length)
            .fill('\xa0')
            .join('') +
          ethers.formatEther(
            await provider.getBalance(publicKey)
          )
      )
    }
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 