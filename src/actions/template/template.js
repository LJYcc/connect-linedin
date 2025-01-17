import { LinkedIn, NetworkHelper } from '@anon/actions'
import { Client, executeRuntimeScript, setupAnonBrowserWithContext } from '@anon/sdk-typescript'
import dotenv from 'dotenv'

const APP_URLS = {
  amazon: 'https://www.amazon.com',
  instagram: 'https://www.instagram.com',
  linkedin: 'https://www.linkedin.com'
}

const NETWORK_TIMEOUT_MS = 5000 // 5 seconds
const DO_DELETE_SESSION = false

console.log('Starting script execution...')

// Load environment variables from parent .env file
dotenv.config()
console.log(18, process.env)
console.log('Environment variables loaded.')

// Configuration
const APP_USER_ID = process.env.ANON_APP_USER_ID
const API_KEY = process.env.ANON_API_KEY
const ANON_ENV = process.env.ANON_ENV
const APP = 'linkedin'

// Choose your the action you want to run based on the app selected
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
const networkHelper = new NetworkHelper(NETWORK_TIMEOUT_MS)
let runAction = LinkedIn.createPost(
  networkHelper,
  `I'm testing Anon.com and automatically generated this post in < 5 minutes.
   Find out more about using Anon to automate your agent automations at Anon.com.`
)

// You can even write your own custom action and use the Anon actions to help you write it
const sendMessageToConnections = (messageText, n) => async page => {
  await networkHelper.waitForPageLoad(page)
  await networkHelper.waitForNetworkIdle(page)
  // Get all connections
  const connections = await LinkedIn.getConnections(networkHelper)(page)
  console.log(`Found ${connections.length} connections`)

  for (const engineer of connections.slice(0, n)) {
    try {
      // Navigate to the engineer's profile
      process.send({ message: `111Navigating to ${engineer.name}'s profile...` })
      console.log(11, engineer)
      await page.goto(engineer.profileUrl)
      await networkHelper.waitForPageLoad(page)

      // Send the message
      await LinkedIn.sendMessageOnProfilePage(networkHelper, messageText, page)
      // const sendButton = await page.waitForSelector('.msg-form__send-button artdeco-button artdeco-button--1')
      // await sendButton.click()

      console.log(1111, `Message sent to ${engineer.name}`)
      // process.send({ message: `Message sent to ${engineer.name}` })
    } catch (error) {
      console.error(222, `Failed to send message to ${engineer.name}:`, error)
    }

    // Add a delay between messages to avoid rate limiting
    await page.waitForTimeout(5000) // 5 second delay
  }
}

/**
 * Uncomment the code to try out your custom action
 */
runAction = sendMessageToConnections(`just test. please ignore`, 1)

// Validate environment variables

const ABC = [
  { name: 'ANON_APP_USER_ID', value: APP_USER_ID },
  { name: 'ANON_API_KEY', value: API_KEY },
  { name: 'ANON_ENV', value: ANON_ENV }
]
ABC.forEach(({ name, value }) => {
  if (!value) {
    console.error(`Error: Please set the ${name} environment variable.`)
    process.exit(1)
  }
})

console.log('Configuration set:')
console.log(`APP_USER_ID: ${APP_USER_ID ? 'Set' : 'Not set'}`)
console.log(`API_KEY: ${API_KEY ? 'Set' : 'Not set'}`)
console.log(`ANON_ENV: ${ANON_ENV}`)
console.log(`APP: ${APP}`)

const account = {
  app: APP,
  userId: APP_USER_ID
}

console.log('Creating Anon client...')
const client = new Client({
  environment: ANON_ENV,
  apiKey: API_KEY
})

console.log('Anon client created.')

const accountInfo = { ownerId: APP_USER_ID, domain: account.app }

const main = async () => {
  console.log(`Requesting ${account.app} session for app user id "${APP_USER_ID}"...`)
  try {
    console.log('Setting up Anon browser with context...')
    const { browser, browserContext } = await setupAnonBrowserWithContext(client, account, {
      type: 'local',
      input: { headless: false }
    })
    console.log('Anon browser setup complete.')

    console.log('Executing runtime script...')
    await executeRuntimeScript({
      client,
      account,
      target: { browserContext },
      initialUrl: APP_URLS[APP],
      cleanupOptions: { closePage: true, closeBrowserContext: true },
      run: runAction
    })
    console.log('Runtime script execution completed.')

    // Demo `getSessionStatus`
    let sessionStatus = await client.getSessionStatus({ account: accountInfo })
    console.log(`Client session status: ${JSON.stringify(sessionStatus)}`)

    if (DO_DELETE_SESSION) {
      await demoDeleteSession(accountInfo)
    }
    console.log('Script execution finished successfully.')
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

const demoDeleteSession = async accountInfo => {
  // Demo `deleteSession`
  await client.deleteSession({ account: accountInfo })
  console.log(`Session deleted for ${JSON.stringify(accountInfo)}`)

  const sessionStatus = await client.getSessionStatus({ account: accountInfo })
  console.log(`After deleting session, client session status: ${JSON.stringify(sessionStatus)}`)
}

console.log('Starting main function...')
main()
  .then(() => console.log('Script execution completed.'))
  .catch(error => console.error('Unhandled error in main:', error))
