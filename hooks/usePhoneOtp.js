import { useCallback, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from 'lib/firebase';

export const usePhoneOtp = () => {
    const confirmationRef = useRef(null);
    const recaptchaRef = useRef(null);

    const setupRecaptcha = useCallback(() => {
        if (typeof window === 'undefined') return null;

        if (recaptchaRef.current) {
            return recaptchaRef.current;
        }

        const container = document.getElementById('recaptcha-container');
        if (!container) {
            throw new Error('RECAPTCHA_CONTAINER_NOT_FOUND');
        }

        recaptchaRef.current = new RecaptchaVerifier(
            container,
            {
                size: 'normal',
            },
            auth
        );

        return recaptchaRef.current;
    }, []);

    const sendOtp = useCallback(
        async (phone) => {
            const appVerifier = setupRecaptcha();
            if (!appVerifier) return;

            const phoneNumber = `+84${phone.slice(1)}`;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                appVerifier
            );

            confirmationRef.current = confirmationResult;
            return true;
        },
        [setupRecaptcha]
    );

    const verifyOtp = useCallback(async (code) => {
        if (!confirmationRef.current) {
            throw new Error('OTP_NOT_SENT');
        }

        const result = await confirmationRef.current.confirm(code);
        return result?.user;
    }, []);

    return {
        sendOtp,
        verifyOtp,
    };
};
