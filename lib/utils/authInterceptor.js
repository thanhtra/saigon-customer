let isRefreshing = false;
let isRedirecting = false;
let queue = [];

const processQueue = () => {
    queue.forEach((resolve) => resolve());
    queue = [];
};

export function setupAuthInterceptor(apiClient) {
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config || {};
            const status = error.response?.status;
            const url = originalRequest.url || '';

            const EXCLUDED_URLS = [
                '/auth/login',
                // '/auth/logout',
                '/auth/refresh-token',
                '/users/register',
                '/users/register-after-booking',
            ];

            if (
                status !== 401 ||
                EXCLUDED_URLS.some((path) => url.includes(path))
            ) {
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                redirectToLogin();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    queue.push(() => resolve(apiClient(originalRequest)));
                });
            }

            isRefreshing = true;

            try {
                await apiClient.get('/auth/refresh-token');

                processQueue();

                return apiClient(originalRequest);
            } catch (refreshError) {
                redirectToLogin();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
}


/**
 * Redirect về trang login FE
 */
function redirectToLogin() {
    if (typeof window === 'undefined') return;
    if (isRedirecting) return;

    // Kiểm tra nếu đang ở trang login hoặc register thì không redirect
    const publicPaths = ['/dang-nhap', '/dang-ky', '/quen-mat-khau'];
    const currentPath = window.location.pathname;

    if (publicPaths.includes(currentPath)) return;

    isRedirecting = true;

    // 🔥 FE URL (ví dụ http://localhost:3005)
    const FE_URL =
        process.env.NEXT_PUBLIC_FE_URL || window.location.origin;

    window.location.href = `${FE_URL}/dang-nhap`;
}
