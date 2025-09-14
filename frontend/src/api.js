import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // or your backend URL
})

// Add JWT only to protected routes
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  // Skip attaching JWT for auth endpoints
  if (token && !config.url.includes('/auth/login/') && !config.url.includes('/auth/register/')) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Make sure JSON is sent
  config.headers['Content-Type'] = 'application/json'

  return config
})

export default API
