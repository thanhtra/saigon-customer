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
 * ROUTE PUBLIC FE
 */
const PUBLIC_ROUTES = ['/dang-nhap', '/dang-ky', '/quen-mat-khau'];

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

            // ❌ Không phải 401 → bỏ qua
            if (status !== 401) {
                return Promise.reject(error);
            }

            // ✅ API public → không xử lý auth
            if (PUBLIC_API_URLS.some(path => url.includes(path))) {
                return Promise.reject(error);
            }

            // ✅ Đang ở public page → không redirect
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (PUBLIC_ROUTES.includes(currentPath)) {
                    return Promise.reject(error);
                }
            }

            // 🔁 Đã retry rồi → logout
            if (originalRequest._retry) {
                hardLogout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // ⏳ Đang refresh → đợi
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
 * 🔥 Logout cứng - CHỈ redirect nếu không phải public page
 */
function hardLogout() {
    if (typeof window === 'undefined') return;
    if (isRedirecting) return;

    const currentPath = window.location.pathname;

    // ❗ Đang ở trang public → KHÔNG redirect
    if (PUBLIC_ROUTES.includes(currentPath)) return;

    isRedirecting = true;
    window.location.href = '/dang-nhap';
}
