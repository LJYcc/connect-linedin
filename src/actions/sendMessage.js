import main from './main.js'
import { NETWORK_TIMEOUT_MS } from './config.js'
import { LinkedIn, NetworkHelper } from './anon/index.js'
const networkHelper = new NetworkHelper(NETWORK_TIMEOUT_MS)

const sendMessageAction = async (page, argv) => {
  try {
    console.log('argv', argv)
    const { profileUrl, message } = JSON.parse(argv[0])
    await networkHelper.waitForPageLoad(page)
    await networkHelper.waitForNetworkIdle(page)

    await page.goto(profileUrl)
    await networkHelper.waitForPageLoad(page)

    await LinkedIn.sendMessageOnProfilePage(networkHelper, message, page)

    await page.waitForTimeout(5000) // 5 second delay
  } catch (error) {
    throw new Error(`Send Message Action: ${error}`)
  }
}

main(sendMessageAction)
