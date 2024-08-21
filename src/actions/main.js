import { NetworkHelper } from './anon/index.js'

import { Client, executeRuntimeScript, setupAnonBrowserWithContext } from '@anon/sdk-typescript'
import dotenv from 'dotenv'
import { APP_URL, NETWORK_TIMEOUT_MS, DO_DELETE_SESSION } from './config.js'

console.log('Starting script execution...')
// Load environment variables from parent .env file
dotenv.config()

// Configuration
const APP_USER_ID = process.env.ANON_APP_USER_ID
const API_KEY = process.env.ANON_API_KEY
const ANON_ENV = process.env.ANON_ENV
const APP = 'linkedin'

// 1. create networkHelper
const networkHelper = new NetworkHelper(NETWORK_TIMEOUT_MS)

// 2. Validate environment variables
const envs = [
  { name: 'ANON_APP_USER_ID', value: APP_USER_ID },
  { name: 'ANON_API_KEY', value: API_KEY },
  { name: 'ANON_ENV', value: ANON_ENV }
]
envs.forEach(({ name, value }) => {
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

// 3. Create Anon client
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

// 4. Main function (runAction as a parameter of the main function.)

const main = async runAction => {
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
      initialUrl: APP_URL,
      cleanupOptions: { closePage: false, closeBrowserContext: false },
      run: page => runAction(page, process.argv.slice(2))
    })

    console.log('Runtime script execution completed.')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
