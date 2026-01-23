
import NProgress from 'nprogress';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import InputField from 'components/common/form/InputField';
import { registerAfterBooking } from 'lib/api/user.api';
import { PHONE_REGEX } from 'lib/constants/tech';
import { handleApiError } from 'lib/utils/handleApiError';

export default function RegisterAfterBookingModal({
    open,
    onClose,
    prefill,
}) {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            password: '',
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        if (prefill?.name && prefill?.phone) {
            reset({
                name: prefill.name,
                phone: prefill.phone,
                password: '',
            });
        }
    }, [prefill, reset]);

    const onSubmit = useCallback(
        async (data) => {
            NProgress.start();
            try {
                const res = await registerAfterBooking({
                    name: data.name,
                    phone: data.phone,
                    password: data.password,
                });

                if (res?.success) {
                    toast.success(
                        'Tạo tài khoản thành công!'
                    );
                    onClose();
                } else {
                    toast.error('Tạo tài khoản thất bại');
                }
            } catch (error) {
                handleApiError(error);
            } finally {
                NProgress.done();
            }
        },
        [onClose]
    );

    if (!open || !prefill) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal register-after-booking-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="modal-title">
                    Đặt lịch thành công
                </h3>

                <p className="modal-desc">
                    Bạn có muốn tạo tài khoản để quản lý lịch hẹn và nhận nhắc lịch tự động không?
                </p>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <InputField
                            label="Tên liên hệ"
                            name="name"
                            control={control}
                            required
                            rules={{
                                required: 'Tên không được để trống',
                            }}
                        />

                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            control={control}
                            disabled
                            rules={{
                                required: 'Số điện thoại không hợp lệ',
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                        />
                    </div>

                    <div className="form-row">
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            placeholder="Tối thiểu 6 ký tự"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập mật khẩu',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu tối thiểu 6 ký tự',
                                },
                            }}
                            error={errors.password}
                        />
                    </div>

                    <div className="form-row inline m-action">
                        <button
                            type="button"
                            className="btn btn-border mr-20"
                            onClick={onClose}
                        >
                            Bỏ qua
                        </button>

                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
