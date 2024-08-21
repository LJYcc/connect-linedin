export default class NetworkHelper {
  networkTimeout
  maxRetries

  constructor(networkTimeout = 30000, maxRetries = 3) {
    this.networkTimeout = networkTimeout
    this.maxRetries = maxRetries
  }

  async waitForNetworkIdle(page, timeout = this.networkTimeout) {
    console.log('Waiting for network to become idle...')
    try {
      await page.waitForLoadState('networkidle', { timeout })
      console.log('Network is idle.')
    } catch (error) {
      console.warn('Network did not reach idle state within timeout, continuing...')
    }
  }

  async waitForPageLoad(page) {
    console.log('Waiting for page to load...')
    try {
      await page.waitForLoadState('load')
      console.log('Page loaded.')
    } catch (error) {
      console.warn('Page did not load within timeout, continuing...')
    }
  }

  async waitForSelector(page, selector, state, timeout = this.networkTimeout) {
    console.log(`Waiting for selector: ${selector}...`)
    try {
      const result = await page.waitForSelector(selector, { state, timeout })
      console.log(`Selector found: ${selector}`)
      return result
    } catch (error) {
      console.warn(`Selector not found: ${selector}`)
    }
  }

  async retryWithBackoff(action, maxRetries = this.maxRetries, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action()
      } catch (error) {
        if (attempt === maxRetries) throw error
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Max retries reached')
  }

  async takeScreenshot(page, prefix, name) {
    await page.screenshot({
      path: `screenshot-${prefix}-${name}-${Date.now()}.png`,
      fullPage: true
    })
    console.log(`Screenshot taken: ${name}`)
  }
}
