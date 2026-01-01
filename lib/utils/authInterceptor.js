let isRefreshing = false;
let queue = [];

const processQueue = () => {
    queue.forEach((cb) => cb());
    queue = [];
};

export function setupAuthInterceptor(apiClient) {
    apiClient.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config || {};
            const url = originalRequest.url || '';

            // ❌ không refresh với các api auth
            if (
                url.includes('/auth/me') ||
                url.includes('/auth/refresh-token')
            ) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // đang refresh → xếp hàng
                if (isRefreshing) {
                    return new Promise((resolve) => {
                        queue.push(() => resolve(apiClient(originalRequest)));
                    });
                }

                isRefreshing = true;

                try {
                    // 🔥 gọi refresh-token (cookie tự gửi)
                    await apiClient.get('/auth/refresh-token');

                    processQueue();
                    return apiClient(originalRequest);
                } catch (err) {
                    // refresh fail → logout
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
}
