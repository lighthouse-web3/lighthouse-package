import node from './node'
import web from './web'

export default async (privateKey?: string) => {
    // Upload File to IPFS
    //@ts-ignore
    if (typeof window === "undefined") {
      return await node(privateKey )
    } else {
      return await web()
    }
}
