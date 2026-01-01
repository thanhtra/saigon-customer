import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor';

const apiClient = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true, // 🔥 cookie tự gửi (access + refresh)
});

// request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // FormData → để axios tự set header
        if (config.data instanceof FormData) {
            if (config.headers?.delete) {
                config.headers.delete('Content-Type');
            }
        } else {
            if (config.headers?.set) {
                config.headers.set('Content-Type', 'application/json');
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// response interceptor (refresh token)
setupAuthInterceptor(apiClient);

export default apiClient;
