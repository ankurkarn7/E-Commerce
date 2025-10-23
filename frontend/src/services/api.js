import axios from 'axios';

const api = axios.create({
    baseURL : 'http://localhost:3000/',         // backend url
    withCredentials : true                      // to send cookies
})

export default api;