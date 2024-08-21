// import { Client } from '@anon/sdk-typescript'

const { Client } = require('@anon/sdk-typescript')
// import dotenv from 'dotenv'

const dotenv = require('dotenv')

// Load environment variables from parent .env file
dotenv.config()

// Configuration
const APP_USER_ID = process.env.ANON_APP_USER_ID
const API_KEY = process.env.ANON_API_KEY
const ANON_ENV = process.env.ANON_ENV
const APP = 'linkedin'

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

const account = {
  app: APP,
  userId: APP_USER_ID
}

const sessionStatus = async () => {
  try {
    const status = await client.getSessionStatus({ account: accountInfo })
    console.log(555, status)
    return status
  } catch (error) {
    return error
  }
}

const deleteSession = async () => {
  const client = new Client({
    environment: ANON_ENV,
    apiKey: API_KEY
  })

  const accountInfo = { ownerId: APP_USER_ID, domain: account.app }
  try {
    const status = await client.deleteSession({ account: accountInfo })
    return status
  } catch (error) {
    return error
  }
}

export { sessionStatus, deleteSession }
