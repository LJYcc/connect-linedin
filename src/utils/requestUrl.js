import fetchRequest from '@/utils/fetchApi'

export const sendMessage = params => {
  return fetchRequest('/sendMessage', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export const login = () => {
  return fetchRequest('/login')
}
