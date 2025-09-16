import axios from 'axios'
const base = import.meta.env.VITE_API_BASE || ''
const api = axios.create({ baseURL: base })
export default api
