import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Breadcrumb from 'components/common/breadcrumb';
import InputField from 'components/common/form/InputField';
import RadioGroupCheckbox from 'components/common/form/RadioGroupCheckbox';
import { CustomerTypeOptions } from 'lib/constants/data';
import { PageUrl, PHONE_REGEX } from 'lib/constants/tech';
import { convertObjectToOptions } from 'lib/utils';

import { registerUser } from 'lib/api/user.api';

const RegisterPage = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        getValues,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            phone_number: '',
            password: '',
            cf_password: '',
            customer_type: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = useCallback(
        async (data) => {
            NProgress.start();
            try {
                const res = await registerUser({
                    name: data.name.trim(),
                    phone: data.phone_number,
                    password: data.password,
                    customer_type: data.customer_type,
                });

                if (res?.success) {
                    toast.success('Đăng ký thành công!');
                    router.push(PageUrl.Login);
                } else {
                    if (res?.message === 'PHONE_IS_EXISTED') {
                        setError('phone_number', {
                            type: 'server',
                            message: 'Số điện thoại đã được đăng ký',
                        });
                        return;
                    }

                    toast.error('Đăng ký thất bại');
                }

            } catch (error) {
                toast.error('Đăng ký thất bại');
            } finally {
                NProgress.done();
            }
        },
        [router]
    );

    return (
        <section className="container register-page">
            <Breadcrumb title="Tạo tài khoản" />

            <div className="auth-content">
                <h2 className="auth-title">Tạo tài khoản</h2>
                <p className="auth-desc">
                    Tạo tài khoản để đăng tin, đặt lịch xem nhà
                </p>

                <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form-row">
                        <InputField
                            label="Tên liên hệ"
                            name="name"
                            placeholder="Nhập tên liên hệ"
                            required
                            control={control}
                            rules={{ required: 'Vui lòng nhập tên' }}
                            error={errors.name}
                        />

                        <InputField
                            label="Số điện thoại"
                            name="phone_number"
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
                            error={errors.phone_number}
                        />
                    </div>

                    <div className="form-row">
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập mật khẩu',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                },
                            }}
                            error={errors.password}
                        />

                        <InputField
                            label="Xác nhận mật khẩu"
                            name="cf_password"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng xác nhận mật khẩu',
                                validate: (value) =>
                                    value === getValues('password') || 'Mật khẩu không khớp',
                            }}
                            error={errors.cf_password}
                        />
                    </div>

                    <div className="form-row inline">
                        <RadioGroupCheckbox
                            label="Bạn là"
                            name="customer_type"
                            required
                            options={convertObjectToOptions(CustomerTypeOptions)}
                            control={control}
                            rules={{ required: 'Vui lòng chọn loại tài khoản' }}
                            error={errors.customer_type}
                            inline
                        />
                    </div>

                    <div className="form-row auth-action">
                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>

                <div className="auth-link">
                    <a href={PageUrl.Login} className="link-text">
                        Bạn đã có tài khoản?
                    </a>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
