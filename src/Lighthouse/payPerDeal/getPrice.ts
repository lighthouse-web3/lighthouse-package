import fs from 'fs'
import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../lighthouse.config'

const getTickerPrice = async (symbol: string): Promise<number> => {
  try {
    return(await axios.get(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/get_ticker?symbol=${symbol}`
    )).data
  } catch (error: any) {
    throw new Error(`Failed to get ticker price: ${error.message}`)
  }
}

const calculatePrice = async(size: number, token: string) => {
	const minFileSizeInBytes = 1048576 // 1MB
	const chargeableSizeInMB = Math.max(size, minFileSizeInBytes)/1048576
	const dollarPricePerMB = 0.00390625
	const cost = dollarPricePerMB * chargeableSizeInMB
	if(token === 'usdc' || token === 'usdt' || token === 'dai') {
		const decimals = lighthouseConfig['polygon'][`${token}_contract_decimal`]
		const priceInDecimal = cost.toFixed(decimals)
		const priceInSmallestUnits = ethers.parseUnits(
			priceInDecimal.toString(),
			decimals
		);
		return priceInSmallestUnits
	}
	const tokenPriceInUSD = await getTickerPrice(lighthouseConfig[token]['symbol'])
	const priceInToken = cost/tokenPriceInUSD
	const priceToDecimals = priceInToken.toFixed(lighthouseConfig[token].native_decimal)
	const priceInSmallestUnits = ethers.parseUnits(
		priceToDecimals.toString(),
		lighthouseConfig[token].native_decimal
	)
	return priceInSmallestUnits
}

export default async (pathorprice: string|number, token: string): Promise<bigint> => {
	try {
		if(!token) {
			throw new Error("Token not provided!!!")
		}
		if(typeof pathorprice === 'string') {
			const { size } = await fs.promises.stat(pathorprice)
			const price = calculatePrice(size, token.toLowerCase())
			return price
		} else {
			const price = calculatePrice(pathorprice, token.toLowerCase())
			return price
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
