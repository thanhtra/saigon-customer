import Link from 'next/link';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Breadcrumb from 'components/common/breadcrumb';
import InputField from 'components/common/form/InputField';
import { login } from 'lib/api/auth.api';
import { PageUrl, PHONE_REGEX } from 'lib/constants/tech';
import { LOGIN_SUCCESS } from 'lib/store/type/user-type';
import { ERROR_MESSAGE } from 'lib/constants/errorMessage';

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { urlRedirectLogin } = useSelector(
        (state) => state.commons || {}
    );

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            phone: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = useCallback(
        async (data) => {
            NProgress.start();
            try {
                const res = await login({
                    phone: data.phone,
                    password: data.password,
                });

                const user = res?.result;
                if (!user) {
                    toast.error('Đăng nhập thất bại');
                    return;
                }

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user,
                });

                toast.success('Đăng nhập thành công!');
                router.push(urlRedirectLogin || PageUrl.Home);
            } catch (error) {
                if (error.response?.status === 429) {
                    toast.error(ERROR_MESSAGE.TOO_MANY_REQUESTS);
                } else if (error.response?.status === 401) {
                    setError('phone', { type: 'server', message: 'Số điện thoại hoặc mật khẩu không đúng' });
                } else {
                    toast.error('Đăng nhập thất bại');
                }
            } finally {
                NProgress.done();
            }
        },
        [dispatch, router, setError, urlRedirectLogin],
    );

    return (
        <section className="container login-page">
            <Breadcrumb title="Đăng nhập" />

            <div className="auth-content">
                <h2 className="auth-title">Đăng nhập</h2>
                <p className="auth-desc">
                    Bạn cần đăng nhập để quản lý thông tin
                </p>

                <form
                    className="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="form-row inline">
                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: 'Số điện thoại chưa đúng',
                                },
                            }}
                            error={errors.phone}
                        />
                    </div>

                    <div className="form-row inline">
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập mật khẩu',
                            }}
                            error={errors.password}
                        />
                    </div>

                    <div className="form-row auth-action">
                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>

                <div className="auth-link">
                    <Link href={PageUrl.ForgotPassword}>
                        <a className="link-text">Quên mật khẩu?</a>
                    </Link>
                </div>

                <div className="auth-link">
                    <Link href={PageUrl.Register}>
                        <a className="link-text">Tạo tài khoản</a>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
