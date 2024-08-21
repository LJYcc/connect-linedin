import main from './main.js'
import { NETWORK_TIMEOUT_MS } from './config.js'
import { LinkedIn, NetworkHelper } from './anon/index.js'
const networkHelper = new NetworkHelper(NETWORK_TIMEOUT_MS)

let params = {}
process.on('message', res => {
  console.log('message', res)
  params = res
})

const sendConnectionRequest = () => async page => {
  await networkHelper.waitForPageLoad(page)
  await networkHelper.waitForNetworkIdle(page)
  console.log(1111, res)
  // await LinkedIn.sendConnectionRequest()
}

let runAction = sendConnectionRequest()

main(runAction)
