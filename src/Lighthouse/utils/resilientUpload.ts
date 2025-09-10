import { resilientFetch, ResilientFetchOptions } from './resilientFetch'
import { uploadApiConfig } from './apiConfig'

interface UploadProgressCallback {
  (progress: number): void
}

interface ResilientUploadOptions extends ResilientFetchOptions {
  onProgress?: UploadProgressCallback
}

export async function resilientUpload(
  url: string,
  options: ResilientUploadOptions = {}
): Promise<Response> {
  const {
    onProgress,
    retryOptions = uploadApiConfig.retryOptions,
    rateLimiter = uploadApiConfig.rateLimiter,
    timeout = uploadApiConfig.timeout,
    ...fetchOptions
  } = options

  // For uploads with progress tracking, we need special handling
  if (onProgress && fetchOptions.body instanceof FormData) {
    // Use XMLHttpRequest for progress tracking with retry logic
    const operation = async (): Promise<Response> => {
      if (rateLimiter) {
        await rateLimiter.waitForToken()
      }

      return new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(fetchOptions.method || 'POST', url)

        // Set headers
        if (fetchOptions.headers) {
          if (fetchOptions.headers instanceof Headers) {
            fetchOptions.headers.forEach((value, key) => {
              xhr.setRequestHeader(key, value)
            })
          } else if (typeof fetchOptions.headers === 'object') {
            for (const [key, value] of Object.entries(fetchOptions.headers)) {
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

          const response = new Response(xhr.response, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: headers,
          })

          if (!response.ok) {
            const error = new Error(`Request failed with status code ${xhr.status}`)
            ;(error as any).status = xhr.status
            reject(error)
          } else {
            resolve(response)
          }
        }

        xhr.onerror = () => {
          const error = new Error('Network error')
          ;(error as any).code = 'NETWORK_ERROR'
          reject(error)
        }

        xhr.ontimeout = () => {
          const error = new Error('Request timed out')
          ;(error as any).code = 'ETIMEDOUT'
          reject(error)
        }

        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable && onProgress) {
            onProgress(event.loaded / event.total)
          }
        }

        xhr.send(fetchOptions.body)
      })
    }

    // Apply retry logic to the upload operation
    const { withRetry } = await import('./retry')
    return withRetry(operation, retryOptions)
  }

  // For regular uploads without progress tracking, use resilientFetch
  return resilientFetch(url, {
    ...fetchOptions,
    retryOptions,
    rateLimiter,
    timeout,
  })
}