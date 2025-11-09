import api from './api'

export const subscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/subscribe', { email })
  return response.data
}

export const sendContactMessage = async (formData) => {
  const response = await api.post('/contact/send', formData)
  return response.data
}
