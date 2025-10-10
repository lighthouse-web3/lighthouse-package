import { RetryOptions } from './retry'
import { RateLimiter } from './rateLimiter'

export interface ApiConfig {
  retryOptions: RetryOptions
  rateLimiter: RateLimiter
  timeout: number
}

// Default configuration for different operation types
export const defaultApiConfig: ApiConfig = {
  retryOptions: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  },
  rateLimiter: new RateLimiter(10, 20), // 10 requests per second, burst of 20
  timeout: 30000 // 30 seconds
}

export const uploadApiConfig: ApiConfig = {
  retryOptions: {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 30000
  },
  rateLimiter: new RateLimiter(5, 10), // 5 requests per second for uploads
  timeout: 7200000 // 2 hours for large uploads
}

export const quickApiConfig: ApiConfig = {
  retryOptions: {
    maxRetries: 2,
    baseDelay: 500,
    maxDelay: 5000
  },
  rateLimiter: new RateLimiter(20, 50), // 20 requests per second for quick operations
  timeout: 10000 // 10 seconds
}