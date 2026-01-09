import axios from 'axios';
import { setupAuthInterceptor } from 'lib/utils/authInterceptor';

const http = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true, // ⭐ cookie access + refresh
    timeout: 30000,
});

/* ================= REQUEST ================= */

http.interceptors.request.use(
    (config) => {
        // FormData → để axios tự set header
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ================= RESPONSE (REFRESH COOKIE) ================= */

setupAuthInterceptor(http);

export default http;
