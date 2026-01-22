/**
 * ================================
 * AUTH INTERCEPTOR – PRODUCTION (JS)
 * ================================
 */

let isRefreshing = false;
let isRedirecting = false;

/**
 * Queue các request đang chờ refresh token
 */
let queue = [];

/**
 * ================================
 * CONFIG
 * ================================
 */

/**
 * API KHÔNG CẦN AUTH
 */
const PUBLIC_API_URLS = [
    '/auth/login',
    '/auth/refresh-token',
    '/users/register',
    '/users/register-after-booking',
];

/**
 * FE PRIVATE ROUTES
 */
const PRIVATE_ROUTES = [
    '/tai-khoan',
    '/dang-tin-nha-o-cho-thue',
];

/**
 * ================================
 * HELPERS
 * ================================
 */

const isPrivateRoute = (pathname) =>
    PRIVATE_ROUTES.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

/**
 * Resolve / Reject toàn bộ queue
 */
const processQueue = (error = null) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    queue = [];
};

/**
 * ================================
 * INTERCEPTOR
 * ================================
 */

export function setupAuthInterceptor(apiClient) {
    apiClient.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config || {};
            const status = error.response?.status;
            const url = originalRequest.url || '';

            /**
             * ❌ Không phải 401
             */
            if (status !== 401) {
                return Promise.reject(error);
            }

            /**
             * ✅ API public → bỏ qua
             */
            if (PUBLIC_API_URLS.some((path) => url.includes(path))) {
                return Promise.reject(error);
            }

            /**
             * ❌ SSR
             */
            if (typeof window === 'undefined') {
                return Promise.reject(error);
            }

            const currentPath = window.location.pathname;

            /**
             * 🟢 PUBLIC FE PAGE → tuyệt đối không redirect / refresh
             */
            if (!isPrivateRoute(currentPath)) {
                return Promise.reject(error);
            }

            /**
             * 🔁 Retry rồi mà vẫn 401 → logout cứng
             */
            if (originalRequest._retry) {
                hardLogout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            /**
             * ⏳ Đang refresh → xếp hàng
             */
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: () => resolve(apiClient(originalRequest)),
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                /**
                 * 🔄 Refresh token
                 * (NÊN dùng refreshClient riêng nếu có)
                 */
                await apiClient.get('/auth/refresh-token');

                processQueue();
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                hardLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
}

/**
 * ================================
 * HARD LOGOUT
 * ================================
 * Chỉ áp dụng cho PRIVATE ROUTE
 */
function hardLogout() {
    if (typeof window === 'undefined') return;
    if (isRedirecting) return;

    const currentPath = window.location.pathname;

    if (!isPrivateRoute(currentPath)) return;

    isRedirecting = true;

    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) { }

    window.location.replace('/dang-nhap');
}
