import { NextResponse } from 'next/server'

import { fork } from 'child_process'

export async function POST(req) {
  const data = await req.json()

  return new Promise(resolve => {
    try {
      const script = fork('src/actions/sendMessage.js', [JSON.stringify(data)])

      script.on('error', error => {
        console.error('Error from script:', error)
        resolve(NextResponse.json({ error: 'Script Error' }, { status: 500 }))
      })

      script.on('exit', code => {
        if (code === 0) {
          resolve(NextResponse.json({ code: 0, message: 'run successfully' }))
        } else {
          resolve(NextResponse.json({ code: 1, error: 'Error running script.' }, { status: 500 }))
        }
      })
    } catch (error) {
      console.error('Error in handler function:', error)
      resolve(NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }))
    }
  })
}
