import { ethers } from 'ethers'

const isCID = (cid: string) => {
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})*$/.test(
    cid
  )
}

const isPrivateKey = (key: string) => {
  return /^([0-9a-f]{64})$/i.test(key)
}

const addressValidator = (value: string) => {
  if (ethers.isAddress(value?.toLowerCase())) {
    return value.toLowerCase()
  } else if (/^[A-HJ-NP-Za-km-z1-9]*$/.test(value) && value.length == 44) {
    return value
  }
  return ''
}

function checkDuplicateFileNames(files: any[]) {
  const fileNames = new Set()

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i].name

    if (fileNames.has(fileName)) {
      throw new Error(`Duplicate file name found: ${fileName}`)
    }

    fileNames.add(fileName)
  }
}

export { isCID, isPrivateKey, addressValidator, checkDuplicateFileNames }
