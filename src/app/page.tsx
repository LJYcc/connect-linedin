'use client'

import AnonLink from '@anon/sdk-web-link-typescript'
import Home from '@/components/Home/Home'

export default function RootPage() {
  const onSuccess = () => {
    console.log('success')
  }

  const onExit = () => {
    anonLinkInstance.destroy()
  }

  console.log(process.env.ANON_ENV)

  const config = {
    app: 'linkedin',
    environment: (process.env.ANON_ENV as any) || 'sandbox',
    clientId: process.env.ANON_SDKCLIENT_ID!,
    appUserIdToken: process.env.ANON_APP_USER_ID_TOKEN!,
    company: process.env.ANON_COMPANY_NAME!,
    companyLogo: process.env.ANON_COMPANY_LOGO!,
    chromeExtensionId: process.env.ANON_CHROME_EXTENSION_ID!
  }

  const anonLinkInstance = AnonLink.init({
    config,
    onSuccess, // Callback function to handle success events.
    onExit // Callback function to handle exit or failure events.
  })

  return <Home anonLinkInstance={anonLinkInstance} />
}
