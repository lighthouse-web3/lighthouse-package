import { ethers } from 'ethers'

interface FetchOptions extends RequestInit {
  timeout?: number
  onProgress?: (progress: number) => void
}

interface DirectStreamOptions {
  method?: string
  headers?: Record<string, string>
  timeout?: number
  onProgress?: (progress: number) => void
}

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

async function fetchWithTimeout(
  endpointURL: string,
  options: FetchOptions
): Promise<Response> {
  const { timeout = 8000, onProgress, ...rest } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    if (onProgress && rest.body instanceof FormData) {
      return new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(rest.method || 'GET', endpointURL)

        if (rest.headers) {
          if (rest.headers instanceof Headers) {
            rest.headers.forEach((value, key) => {
              xhr.setRequestHeader(key, value)
            })
          } else if (typeof rest.headers === 'object') {
            for (const [key, value] of Object.entries(rest.headers)) {
              xhr.setRequestHeader(key, value as string)
            }
          }
        }

        xhr.timeout = timeout
        xhr.onload = () => {
          const headers = new Headers()
          xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/)
            .forEach((line) => {
              const parts = line.split(': ')
              const header = parts.shift()
              const value = parts.join(': ')
              if (header) headers.set(header, value)
            })

          resolve(
            new Response(xhr.response, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: headers,
            })
          )
        }
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.ontimeout = () => reject(new Error('Request timed out'))
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            onProgress(event.loaded / event.total)
          }
        }

        // Handle different body types
        if (rest.body instanceof FormData) {
          xhr.send(rest.body)
        } else if (rest.body instanceof ReadableStream) {
          // Convert ReadableStream to Blob and then send
          new Response(rest.body).blob().then((blob) => xhr.send(blob))
        } else if (
          typeof rest.body === 'string' ||
          rest.body instanceof Blob ||
          rest.body instanceof ArrayBuffer
        ) {
          xhr.send(rest.body)
        } else if (rest.body == null) {
          xhr.send()
        } else {
          reject(new Error('Unsupported body type'))
        }
      })
    } else {
      const response = await fetch(endpointURL, {
        ...rest,
        signal: controller.signal,
      })
      clearTimeout(id)
      return response
    }
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

async function fetchWithDirectStream(
  endpointURL: string,
  options: DirectStreamOptions,
  streamData: {
    boundary: string
    files: Array<{
      stream: any
      filename: string
    }>
  }
): Promise<{ data: any }> {
  const { method = 'POST', headers = {}, timeout = 7200000 } = options

  const http = eval(`require`)('http')
  const https = eval(`require`)('https')
  const url = eval(`require`)('url')

  const parsedUrl = url.parse(endpointURL)
  const isHttps = parsedUrl.protocol === 'https:'
  const client = isHttps ? https : http

  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.path,
      method,
      headers: {
        ...headers,
        'Content-Type': `multipart/form-data; boundary=${streamData.boundary}`,
      },
    }

    const req = client.request(requestOptions, (res: any) => {
      let data = ''
      res.on('data', (chunk: any) => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data)
            resolve({ data: responseData })
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`))
        }
      })
    })

    req.on('error', (error: any) => {
      reject(new Error(error.message))
    })

    // Handle timeout
    const timeoutId = setTimeout(() => {
      req.destroy()
      reject(new Error('Request timed out'))
    }, timeout)

    req.on('close', () => {
      clearTimeout(timeoutId)
    })

    // Stream files sequentially with backpressure handling and proper part delimiters
    const writeAsync = (data: string | Buffer): Promise<void> => {
      return new Promise((resolve) => {
        const canWrite = req.write(data)
        if (canWrite) {
          resolve()
        } else {
          req.once('drain', () => resolve())
        }
      })
    }

    const pumpStream = (stream: any): Promise<void> => {
      return new Promise((resolve, rejectPump) => {
        const onData = (chunk: any) => {
          const canWrite = req.write(chunk)
          if (!canWrite) {
            stream.pause()
            req.once('drain', () => stream.resume())
          }
        }
        const onEnd = () => {
          cleanup()
          resolve()
        }
        const onError = (err: any) => {
          cleanup()
          rejectPump(new Error(`File stream error: ${err?.message || err}`))
        }
        const cleanup = () => {
          stream.off('data', onData)
          stream.off('end', onEnd)
          stream.off('error', onError)
        }
        stream.on('data', onData)
        stream.on('end', onEnd)
        stream.on('error', onError)
      })
    }

    ;(async () => {
      try {
        for (let idx = 0; idx < streamData.files.length; idx++) {
          const file = streamData.files[idx]
          const headersPart =
            `--${streamData.boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="${file.filename}"\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n`

          await writeAsync(headersPart)
          await pumpStream(file.stream)
          await writeAsync(`\r\n`)
        }

        await writeAsync(`--${streamData.boundary}--\r\n`)
        req.end()
      } catch (err: any) {
        if (req && !req.destroyed) {
          req.destroy()
        }
        reject(new Error(err?.message || String(err)))
      }
    })()
  })
}

export {
  isCID,
  isPrivateKey,
  addressValidator,
  checkDuplicateFileNames,
  fetchWithTimeout,
  fetchWithDirectStream,
}
