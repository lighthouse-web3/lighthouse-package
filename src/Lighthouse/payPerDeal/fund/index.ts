import node from './node'
import browser from './browser'

export default async (amount: number, network: string, token: string, privateKey?: string) => {
    // Upload File to IPFS
    //@ts-ignore
    if (typeof window === "undefined") {
      return await node(amount, network, token, privateKey)
    } else {
      return await browser(amount, network, token)
    }
}
