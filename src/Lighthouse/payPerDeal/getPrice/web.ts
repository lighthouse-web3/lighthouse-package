/* istanbul ignore file */
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../../lighthouse.config'

const getTickerPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/get_ticker?symbol=${symbol}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = (await response.json()) as number
    return data
  } catch (error: any) {
    throw new Error(`Failed to get ticker price: ${error.message}`)
  }
}

const calculatePrice = async (
  size: number,
  network: string,
  token?: string
) => {
  const minFileSizeInBytes = 1048576 // 1MB
  const chargeableSizeInMB = Math.max(size, minFileSizeInBytes) / 1048576
  const dollarPricePerMB = 0.00390625
  const cost = dollarPricePerMB * chargeableSizeInMB
  if (token === 'usdc' || token === 'usdt' || token === 'dai') {
    const decimals = lighthouseConfig[network][`${token}_contract_decimal`]
    const priceTODecimals = cost.toFixed(decimals)
    const priceInSmallestUnits = ethers.parseUnits(
      priceTODecimals.toString(),
      decimals
    )
    return priceInSmallestUnits
  }
  const tokenPriceInUSD = await getTickerPrice(
    lighthouseConfig[network]['symbol']
  )
  const priceInToken = cost / tokenPriceInUSD
  const priceToDecimals = priceInToken.toFixed(
    lighthouseConfig[network].native_decimal
  )
  const priceInSmallestUnits = ethers.parseUnits(
    priceToDecimals.toString(),
    lighthouseConfig[network].native_decimal
  )
  return priceInSmallestUnits
}

export default async (
  pathOrSize: any | number,
  network: string,
  token?: string
): Promise<bigint> => {
  try {
    if (!network) {
      throw new Error('Token not provided!!!')
    }
    if (typeof pathOrSize === 'number') {
      const price = calculatePrice(
        pathOrSize,
        network.toLowerCase(),
        token?.toLowerCase()
      )
      return price
    } else {
      let totalSize = 0
      for (let i = 0; i < pathOrSize.length; i++) {
        totalSize = totalSize + pathOrSize[i]['size']
      }
      const price = calculatePrice(
        totalSize,
        network.toLowerCase(),
        token?.toLowerCase()
      )
      return price
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
