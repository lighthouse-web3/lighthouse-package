import axios from 'axios'
import { lighthouseConfig } from '../../../../lighthouse.config'
import { generate, saveShards } from '@lighthouse-web3/kavach'
import { encryptFile } from '../../encryptionNode'

export default async (
  sourcePath: any,
  apiKey: string,
  publicKey: string,
  signed_message: string
) => {
  try {
    const FormData = eval('require')('form-data')
    const mime = eval('require')('mime-types')
    const fs = eval('require')('fs-extra')
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'
    const stats = fs.lstatSync(sourcePath)

    if (stats.isFile()) {
      // Upload file
      const formDdata = new FormData()
      const mimeType = mime.lookup(sourcePath)

      const { masterKey: fileEncryptionKey, keyShards } = await generate()

      const fileData = fs.readFileSync(sourcePath)
      const encryptedData = await encryptFile(fileData, fileEncryptionKey)
      formDdata.append(
        'file',
        Buffer.from(encryptedData),
        sourcePath.replace(/^.*[\\/]/, '')
      )

      const response = await axios.post(endpoint, formDdata, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: Infinity,
        headers: {
          'Content-type': `multipart/form-data; boundary= ${formDdata.getBoundary()}`,
          Encryption: 'true',
          'Mime-Type': mimeType ? mimeType : '',
          Authorization: token,
        },
      })

      const { error } = await saveShards(
        publicKey,
        response.data.Hash,
        signed_message,
        keyShards
      )
      if (error) {
        throw new Error('Error encrypting file')
      }

      // return response
      /*
        {
          data: {
            Name: 'flow1.png',
            Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
            Size: '31735'
          }
        }
      */
      return { data: response.data }
    } else {
      throw new Error('Directory currently not supported!!!')
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
