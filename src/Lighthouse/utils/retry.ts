export interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryCondition?: (error: any) => boolean
}

export interface RetryableError extends Error {
  status?: number
  code?: string
}

const defaultRetryCondition = (error: RetryableError): boolean => {
  // Network errors
  if (error.code && ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'].includes(error.code)) {
    return true
  }
  
  // HTTP status codes that should be retried
  if (error.status) {
    return error.status === 429 || // Too Many Requests
           error.status === 502 || // Bad Gateway
           error.status === 503 || // Service Unavailable
           error.status === 504    // Gateway Timeout
  }
  
  return false
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  }
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, retryCondition = defaultRetryCondition } = options
  
  let lastError: RetryableError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Don't retry on last attempt or if retry condition fails
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}