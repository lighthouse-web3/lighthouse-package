/* istanbul ignore file */
import axios from 'axios'
import FormData from 'form-data'
import { generate, saveShards } from '@lighthouse-web3/kavach'

import { encryptFile } from '../../encryptionBrowser'
import { lighthouseConfig } from '../../../../lighthouse.config'
declare const FileReader: any

const readFileAsync = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      reader.result && resolve(reader.result)
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file)
  })
}

export default async (
  e: any,
  publicKey: string,
  accessToken: string,
  signedMessage: string,
  uploadProgressCallback = (data: any) => {}
) => {
  try {
    // Generate fileEncryptionKey
    const { masterKey: fileEncryptionKey, keyShards } = await generate()

    // Upload file
    e.persist()
    let mimeType = null
    if (e.target.files.length === 1) {
      mimeType = e.target.files[0].type
    }
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'
    const token = 'Bearer ' + accessToken

    const fileArr = []
    for (let i = 0; i < e.target.files.length; i++) {
      fileArr.push(e.target.files[i])
    }

    const formData = new FormData()
    const boundary = Symbol()
    const filesParam = await Promise.all(
      fileArr.map(async (f) => {
        const fileData = await readFileAsync(f)
        const encryptedData = await encryptFile(fileData, fileEncryptionKey)
        return {
          data: new Blob([encryptedData], { type: f.type }),
          fileName: f.name,
        }
      })
    )
    filesParam.forEach(function (item_) {
      return formData.append(
        'file',
        item_.data,
        item_.fileName ? item_.fileName : 'file'
      )
    })

    const response = await axios.post(endpoint, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
        Encryption: `${true}`,
        'Mime-Type': mimeType,
        Authorization: token,
      },
      onUploadProgress: function (progressEvent) {
        const _progress = Math.round(progressEvent.loaded / progressEvent.total)
        uploadProgressCallback({
          progress: _progress,
          total: progressEvent.total,
          uploaded: progressEvent.loaded,
        })
      },
    })

    const { isSuccess, error } = await saveShards(
      publicKey,
      response.data.Hash,
      signedMessage,
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
  } catch (error: any) {
    return error.message
  }
}
