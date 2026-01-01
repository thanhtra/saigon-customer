// lib/http/secret-http.js
import axios from 'axios';
import baseHttp from './base';

import {
    localStorageGet,
    saveTokens,
    removeAllLocalStorage,
} from 'lib/utils';

import { REMOVE_USER } from 'lib/store/type/user-type';
import { makeStore } from 'lib/store';

const store = makeStore();

/* ================= REQUEST INTERCEPTOR ================= */

baseHttp.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorageGet('access_token');
            if (accessToken) {
                config.headers.authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */

baseHttp.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            forceLogout();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshToken = localStorageGet('refresh_token');
            if (!refreshToken) throw new Error('No refresh token');

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_REACT_APP_API}/api/auth/refresh-token`,
                {
                    headers: {
                        authorization: `Bearer ${refreshToken}`,
                    },
                },
            );

            if (res?.data?.success) {
                const accessToken = res.data.result.accessToken;

                saveTokens(accessToken);

                baseHttp.defaults.headers.common.authorization =
                    `Bearer ${accessToken}`;

                originalRequest.headers.authorization =
                    `Bearer ${accessToken}`;

                return baseHttp(originalRequest);
            }

            throw new Error('Refresh token failed');
        } catch (err) {
            forceLogout();
            return Promise.reject(err);
        }
    },
);

/* ================= FORCE LOGOUT ================= */

function forceLogout() {
    removeAllLocalStorage();

    store.dispatch({
        type: REMOVE_USER,
        payload: {},
    });

    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }

}

const secretHttp = baseHttp;
export default secretHttp;
