import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { LOGIN_SUCCESS, REMOVE_USER } from 'lib/store/type/user-type';
import { getMe } from 'lib/api/auth.api';

const PRIVATE_ROUTES = [
    '/tai-khoan',
    '/dang-tin-nha-o-cho-thue',
];

export const useAuthInit = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user?.user);

    const checkingRef = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;

        const path = router.asPath.split('?')[0];
        const isPrivateRoute = PRIVATE_ROUTES.some((p) =>
            path === p || path.startsWith(p + '/')
        );

        // ===== PUBLIC ROUTE =====
        if (!isPrivateRoute) {
            if (!user && !checkingRef.current) {
                checkingRef.current = true;

                getMe()
                    .then((res) => {
                        if (res?.success && res.result) {
                            dispatch({
                                type: LOGIN_SUCCESS,
                                payload: res.result,
                            });
                        }
                    })
                    .catch(() => {
                        // ✅ NUỐT 401 - hoàn toàn bình thường ở public page
                    })
                    .finally(() => {
                        checkingRef.current = false;
                    });
            }
            return;
        }

        // ===== PRIVATE ROUTE =====
        if (user) return;
        if (checkingRef.current) return;

        checkingRef.current = true;

        getMe()
            .then((res) => {
                if (res?.success && res.result) {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: res.result,
                    });
                } else {
                    throw new Error('UNAUTHORIZED');
                }
            })
            .catch(() => {
                dispatch({ type: REMOVE_USER });
                router.replace('/dang-nhap');
            })
            .finally(() => {
                checkingRef.current = false;
            });
    }, [router.isReady, router.asPath, user]);
};
