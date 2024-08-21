/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  env: {
    ANON_ENV: process.env.NEXT_PUBLIC_ANON_ENV,
    ANON_SDKCLIENT_ID: process.env.NEXT_PUBLIC_ANON_SDKCLIENT_ID,
    ANON_APP_USER_ID_TOKEN: process.env.NEXT_PUBLIC_ANON_APP_USER_ID_TOKEN,
    ANON_COMPANY_NAME: process.env.NEXT_PUBLIC_ANON_COMPANY_NAME,
    ANON_COMPANY_LOGO: process.env.NEXT_PUBLIC_ANON_COMPANY_LOGO,
    ANON_CHROME_EXTENSION_ID: process.env.NEXT_PUBLIC_ANON_CHROME_EXTENSION_ID
  }
}

export default nextConfig
