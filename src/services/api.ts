import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default apiClient;
