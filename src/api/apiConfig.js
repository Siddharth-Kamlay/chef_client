import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chef-server-kchf.onrender.com',
});

export default api;