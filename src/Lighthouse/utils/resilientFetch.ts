import { withRetry, RetryOptions, RetryableError } from './retry'
import { RateLimiter } from './rateLimiter'

export interface ResilientFetchOptions extends RequestInit {
  timeout?: number
  retryOptions?: RetryOptions
  rateLimiter?: RateLimiter
}

export class FetchError extends Error implements RetryableError {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

export async function resilientFetch(
  url: string,
  options: ResilientFetchOptions = {}
): Promise<Response> {
  const {
    timeout = 30000,
    retryOptions,
    rateLimiter,
    ...fetchOptions
  } = options

  const operation = async (): Promise<Response> => {
    if (rateLimiter) {
      await rateLimiter.waitForToken()
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new FetchError(
          `Request failed with status code ${response.status}`,
          response.status
        )
      }

      return response
    } catch (error: any) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new FetchError('Request timeout', undefined, 'ETIMEDOUT')
      }
      
      // Network errors
      if (error.code) {
        throw new FetchError(error.message, undefined, error.code)
      }
      
      throw error
    }
  }

  return withRetry(operation, retryOptions)
}