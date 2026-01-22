import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getMe } from 'lib/api/auth.api';
import { LOGIN_SUCCESS, REMOVE_USER } from 'lib/store/type/user-type';


export const useAuthInit = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthInitialized } = useSelector((s) => s.users);

    const checkingRef = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;
        if (isAuthInitialized) return; // 👈 CHỈ CHẠY 1 LẦN
        if (checkingRef.current) return;

        checkingRef.current = true;

        getMe()
            .then((res) => {
                if (res?.success) {
                    dispatch({ type: LOGIN_SUCCESS, payload: res.result });
                } else {
                    dispatch({ type: REMOVE_USER });
                }
            })
            .catch(() => {
                dispatch({ type: REMOVE_USER });
            })
            .finally(() => {
                checkingRef.current = false;
            });
    }, [router.isReady, isAuthInitialized]);
};
