import { NextResponse } from 'next/server'
const { Client } = require('@anon/sdk-typescript')

export async function GET(req) {
  const status = await getSessionStatus()

  return NextResponse.json(status)
}

const getSessionStatus = async () => {
  const client = new Client({
    environment: process.env.ANON_ENV,
    apiKey: process.env.ANON_API_KEY
  })

  const accountInfo = { ownerId: process.env.ANON_APP_USER_ID, domain: 'linkedin' }
  const status = await client.getSessionStatus({ account: accountInfo })

  return new Promise((resolve, reject) => {
    try {
      resolve(status)
    } catch (error) {
      reject(error)
    }
  })
}
