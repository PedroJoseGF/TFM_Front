import axios from 'axios';
import Cookies from 'universal-cookie';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(async(config) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    config.withCredentials = true;
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        if(response.data.token) {
            const cookies = new Cookies();
            cookies.set('token', response.data.token);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;