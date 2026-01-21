import axios from 'axios';
import { setupAuthInterceptor } from 'lib/utils/authInterceptor';

const url = process.env.NEXT_PUBLIC_REACT_APP_API;

const http = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true,
    timeout: 30000,
});

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
