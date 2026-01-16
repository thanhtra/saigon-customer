import NProgress from 'nprogress';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import InputField from 'components/common/form/InputField';

import { logout } from 'lib/api/auth.api';
import { PageUrl } from 'lib/constants/tech';
import { REMOVE_USER } from 'lib/store/type/user-type';
import { changePassword } from 'lib/api/auth.api';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.users?.user);

    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            old_password: '',
            new_password: '',
            cf_password: '',
        },
        mode: 'onSubmit',
        shouldUnregister: false,
    });

    const logoutHandle = async () => {
        try {
            await logout();
        } finally {
            dispatch({ type: REMOVE_USER });

            // HARD reload để clear memory + cookie
            window.location.replace(PageUrl.Login);
        }
    };

    const validatePassword = (data) => {
        if (!user?.id) {
            toast.error('Phiên đăng nhập đã hết hạn');
            return false;
        }

        if (data.old_password === data.new_password) {
            toast.error('Mật khẩu mới trùng mật khẩu cũ');
            return false;
        }

        return true;
    };

    const onSubmit = useCallback(
        async (data) => {
            if (!validatePassword(data)) return;

            NProgress.start();
            try {
                const res = await changePassword({
                    old_password: data.old_password,
                    new_password: data.new_password,
                });

                if (res.success) {
                    toast.success('Cập nhật mật khẩu thành công!');
                    logoutHandle();
                } else {
                    toast.error('Cập nhật mật khẩu thất bại');
                }

            } catch {
                toast.error('Cập nhật mật khẩu thất bại');
            } finally {
                NProgress.done();
            }
        },
        [user]
    );

    return (
        <section className="change-password">
            <div className="p-header">
                <p className="p-title">Đổi mật khẩu</p>
            </div>

            <form
                className="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
            >
                <div className="form-row">
                    <InputField
                        label="Mật khẩu hiện tại"
                        name="old_password"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                        control={control}
                        rules={{ required: 'Vui lòng nhập mật khẩu hiện tại' }}
                        error={errors.old_password}
                    />
                </div>

                <div className="form-row">
                    <InputField
                        label="Mật khẩu mới"
                        name="new_password"
                        type="password"
                        placeholder="Ít nhất 6 ký tự"
                        required
                        control={control}
                        rules={{
                            required: 'Vui lòng nhập mật khẩu mới',
                            minLength: {
                                value: 6,
                                message: 'Mật khẩu phải có ít nhất 6 ký tự',
                            },
                        }}
                        error={errors.new_password}
                    />

                    <InputField
                        label="Xác nhận mật khẩu mới"
                        name="cf_password"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        control={control}
                        rules={{
                            required: 'Vui lòng xác nhận mật khẩu',
                            validate: (value) =>
                                value === getValues('new_password') ||
                                'Mật khẩu không khớp',
                        }}
                        error={errors.cf_password}
                    />
                </div>

                <div className="form-row inline row-action">
                    <button
                        type="button"
                        className="btn btn-border mr-20"
                        onClick={() => reset()}
                        disabled={isSubmitting}
                    >
                        Huỷ
                    </button>

                    <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ChangePassword;
