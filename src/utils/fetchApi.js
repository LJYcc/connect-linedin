import { message } from 'antd'

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

async function fetchRequest(url, options = {}) {
  const config = { ...defaultOptions, ...options }
  const response = await fetch(url, config)
  const res = await response.json()

  return new Promise((resolve, reject) => {
    try {
      if (!response.ok) {
        console.log(444, res)
        message.error(res.error || '网络响应失败')
        reject(res)
      }

      resolve(res)
    } catch (error) {
      console.error('Fetch Error:', error.message)
      reject(error)
    }
  })
}

export default fetchRequest
