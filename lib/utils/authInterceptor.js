let isRefreshing = false;
let isRedirecting = false;
let queue = [];

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
 * ROUTE PRIVATE FE (CHỈ 2 ROUTE)
 */
const PRIVATE_ROUTES = [
    '/tai-khoan',
    '/dang-tin-nha-o-cho-thue',
];

const isPrivateRoute = (pathname) =>
    PRIVATE_ROUTES.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

const processQueue = () => {
    queue.forEach(resolve => resolve());
    queue = [];
};

export function setupAuthInterceptor(apiClient) {
    apiClient.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config || {};
            const status = error.response?.status;
            const url = originalRequest.url || '';

            // ❌ Không phải 401
            if (status !== 401) {
                return Promise.reject(error);
            }

            // ✅ API public
            if (PUBLIC_API_URLS.some(path => url.includes(path))) {
                return Promise.reject(error);
            }

            if (typeof window === 'undefined') {
                return Promise.reject(error);
            }

            const currentPath = window.location.pathname;

            // 🟢 PUBLIC PAGE → TUYỆT ĐỐI KHÔNG REDIRECT
            if (!isPrivateRoute(currentPath)) {
                return Promise.reject(error);
            }

            // 🔁 Retry rồi mà vẫn 401 → logout
            if (originalRequest._retry) {
                hardLogout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // ⏳ Đang refresh → xếp hàng
            if (isRefreshing) {
                return new Promise(resolve => {
                    queue.push(() => resolve(apiClient(originalRequest)));
                });
            }

            isRefreshing = true;

            try {
                await apiClient.get('/auth/refresh-token');

                processQueue();
                return apiClient(originalRequest);
            } catch (refreshError) {
                hardLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
}

/**
 * 🔥 Logout cứng - CHỈ áp dụng cho PRIVATE ROUTE
 */
function hardLogout() {
    if (typeof window === 'undefined') return;
    if (isRedirecting) return;

    const currentPath = window.location.pathname;

    if (!isPrivateRoute(currentPath)) return;

    isRedirecting = true;
    window.location.href = '/dang-nhap';
}
