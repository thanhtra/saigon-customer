import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { LOGIN_SUCCESS, REMOVE_USER } from 'lib/store/type/user-type';
import { getMe } from 'lib/api/auth.api';

export const useAuthInit = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user?.user);

    const initialized = useRef(false);

    useEffect(() => {
        // ❌ Không chạy nhiều lần
        if (initialized.current) return;

        // ❌ Không gọi ở trang login
        if (router.pathname === '/dang-nhap') return;

        // ❌ Nếu đã có user → khỏi gọi
        if (user) {
            initialized.current = true;
            return;
        }

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
                }
            } catch {
                dispatch({ type: REMOVE_USER });
            } finally {
                initialized.current = true;
            }
        };

        initAuth();
    }, [dispatch, router.pathname, user]);
};
