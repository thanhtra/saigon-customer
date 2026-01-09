import { toast } from 'react-toastify';
import { ERROR_MESSAGE } from 'lib/constants/errorMessage';

export function handleApiError(error) {
    const statusCode = error?.response?.status;
    const message = error?.response?.data?.message;

    // ⛔ Throttler - Too many requests
    if (
        statusCode === 429 ||
        (typeof message === 'string' &&
            message.includes('ThrottlerException'))
    ) {
        toast.error(ERROR_MESSAGE.TOO_MANY_REQUESTS);
        return;
    }

    // ❌ Lỗi khác
    toast.error(ERROR_MESSAGE.DEFAULT);
}
