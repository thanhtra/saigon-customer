import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { LOGIN_SUCCESS, REMOVE_USER } from 'lib/store/type/user-type';
import { getMe } from 'lib/api/auth.api';

// Public pages, không cần gọi /auth/me
const PUBLIC_ROUTES = [
    '/dang-nhap',
    '/dang-ky',
    '/quen-mat-khau',
];

export const useAuthInit = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user?.user);

    const initialized = useRef(false);

    useEffect(() => {
        // Chỉ chạy 1 lần
        if (initialized.current) return;
        initialized.current = true;

        // ❌ Nếu đang ở public page → không gọi
        if (PUBLIC_ROUTES.includes(router.pathname)) return;

        // ❌ Nếu đã có user → khỏi gọi
        if (user) return;

        const initAuth = async () => {
            try {
                const res = await getMe();

                if (res?.success && res.result) {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: res.result,
                    });
                } else {
                    dispatch({ type: REMOVE_USER });
                    // Redirect login nếu user không tồn tại
                    router.replace('/dang-nhap');
                }
            } catch {
                dispatch({ type: REMOVE_USER });
                router.replace('/dang-nhap');
            }
        };

        initAuth();
    }, [dispatch, router]);
};
