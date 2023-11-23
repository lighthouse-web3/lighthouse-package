import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../../lighthouse.config'

const getTickerPrice = async (symbol: string): Promise<number> => {
  try {
    return(await axios.get(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/get_ticker?symbol=${symbol}`
    )).data
  } catch (error: any) {
    throw new Error(`Failed to get ticker price: ${error.message}`)
  }
}

const calculatePrice = async(size: number, network: string, token?: string) => {
	const minFileSizeInBytes = 1048576 // 1MB
	const chargeableSizeInMB = Math.max(size, minFileSizeInBytes)/1048576
	const dollarPricePerMB = 0.00390625
	const cost = dollarPricePerMB * chargeableSizeInMB
	if(token === 'usdc' || token === 'usdt' || token === 'dai') {
		const decimals = lighthouseConfig[network][`${token}_contract_decimal`]
		const priceTODecimals = cost.toFixed(decimals)
		const priceInSmallestUnits = ethers.parseUnits(
			priceTODecimals.toString(),
			decimals
		);
		return priceInSmallestUnits
	}
	const tokenPriceInUSD = await getTickerPrice(lighthouseConfig[network]['symbol'])
	const priceInToken = cost/tokenPriceInUSD
	const priceToDecimals = priceInToken.toFixed(lighthouseConfig[network].native_decimal)
	const priceInSmallestUnits = ethers.parseUnits(
		priceToDecimals.toString(),
		lighthouseConfig[network].native_decimal
	)
	return priceInSmallestUnits
}

export default async (pathorprice: any|number, network: string, token?: string): Promise<bigint> => {
	try {
		if(!network) {
			throw new Error("Token not provided!!!")
		}
		if(typeof pathorprice === 'number') {
            const price = calculatePrice(pathorprice, network.toLowerCase(), token?.toLowerCase())
			return price
		} else {
            let totalSize = 0
            for(let i=0; i<pathorprice.length; i++){
                totalSize = totalSize + pathorprice[i]['size']
            }
            const price = calculatePrice(totalSize, network.toLowerCase(), token?.toLowerCase())
			return price
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
