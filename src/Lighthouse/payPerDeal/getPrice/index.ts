import node from './node'
import web from './web'

export default async (pathorprice: string|number|any, network: string, token?: string) => {
    // Upload File to IPFS
    if (typeof window === "undefined") {
      return await node(pathorprice, network, token)
    } else {
      return await web(pathorprice, network, token)
    }
}
