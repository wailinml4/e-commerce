import axios from 'axios'
import env from './env.js'

const axiosInstance = axios.create({
  baseURL: `${env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
})

export default axiosInstance
