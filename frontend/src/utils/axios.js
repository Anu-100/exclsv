import axios from 'axios'

const apiInstance = axios.create({
    baseURL: 'https://multivendor-ecommerce-backend.up.railway.app/api/v1/',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

export default apiInstance