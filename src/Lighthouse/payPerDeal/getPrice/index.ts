import node from './node'
import web from './web'

export default async (pathOrSize: string|number|any, network: string, token?: string) => {
    // Upload File to IPFS
    if (typeof window === "undefined") {
      return await node(pathOrSize, network, token)
    } else {
      return await web(pathOrSize, network, token)
    }
}
