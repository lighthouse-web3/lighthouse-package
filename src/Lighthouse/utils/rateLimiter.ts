export class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly refillRate: number // tokens per second
  private readonly capacity: number

  constructor(
    private requestsPerSecond: number,
    private burstSize: number = requestsPerSecond
  ) {
    this.capacity = burstSize
    this.tokens = burstSize
    this.lastRefill = Date.now()
    this.refillRate = requestsPerSecond
  }

  async waitForToken(): Promise<void> {
    this.refillTokens()
    
    if (this.tokens >= 1) {
      this.tokens -= 1
      return
    }
    
    // Calculate wait time for next token
    const waitTime = (1 / this.refillRate) * 1000
    await new Promise(resolve => setTimeout(resolve, waitTime))
    
    // Recursively wait if still no tokens available
    return this.waitForToken()
  }

  private refillTokens(): void {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  getAvailableTokens(): number {
    this.refillTokens()
    return Math.floor(this.tokens)
  }
}