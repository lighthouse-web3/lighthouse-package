import node from './node'
import web from './web'

export default async (privateKey?: string) => {
    // Upload File to IPFS
    if (typeof window === "undefined") {
      return await node(privateKey )
    } else {
      return await web()
    }
}
