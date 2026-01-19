'use client';

import NProgress from 'nprogress';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import InputField from 'components/common/form/InputField';
import { createBookingPublic } from 'lib/api/booking.api';
import { PHONE_REGEX } from 'lib/constants/tech';
import { handleApiError } from 'lib/utils/handleApiError';
import { validateMinMinutesFromNow, getDatetimeLocalPlusMinutes, toDatetimeLocal } from 'lib/utils/date';

export default function BookingModal({ open, onClose, roomId, rentalId, title, address, onRequireRegister }) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            customer_name: '',
            customer_phone: '',
            viewing_at: '',
            customer_note: '',
            referrer_phone: ''
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        if (open) {
            reset({
                customer_name: '',
                customer_phone: '',
                viewing_at: getDatetimeLocalPlusMinutes(60),
                customer_note: '',
                referrer_phone: ''
            });
        }
    }, [open, reset]);

    const onSubmit = useCallback(
        async (data) => {
            NProgress.start();
            try {
                const res = await createBookingPublic({
                    rental_id: rentalId,
                    room_id: roomId,
                    customer_name: data.customer_name,
                    customer_note: data.customer_note,
                    customer_phone: data.customer_phone,
                    viewing_at: toDatetimeLocal(data.viewing_at),
                    ...(data.referrer_phone && { referrer_phone: data.referrer_phone })
                });

                if (res?.success) {
                    toast.success('Đặt lịch xem phòng thành công!');
                    reset();
                    onClose();

                    if (!res.result.user_exists) {
                        onRequireRegister?.(res.result.prefill);
                    }
                } else {
                    toast.error('Đặt lịch thất bại');
                }
            } catch (error) {
                handleApiError(error);
            } finally {
                NProgress.done();
            }
        },
        [roomId, onClose, onRequireRegister, reset]
    );

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Đặt lịch xem phòng</h3>

                {(title || address) && (
                    <div className="modal-room-info">
                        {title && <div className="room-title">{title}</div>}
                        {address && <div className="room-address">{address}</div>}
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <InputField
                            label="Tên liên hệ"
                            name="customer_name"
                            required
                            placeholder="Nhập tên"
                            control={control}
                            rules={{ required: 'Vui lòng nhập tên' }}
                            error={errors.customer_name}
                        />

                        <InputField
                            label="Số điện thoại"
                            name="customer_phone"
                            required
                            placeholder="Nhập số điện thoại"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: 'Số điện thoại chưa đúng',
                                },
                            }}
                            error={errors.customer_phone}
                        />
                    </div>

                    <div className="form-row">
                        <InputField
                            label="Thời gian xem phòng"
                            name="viewing_at"
                            type="datetime-local"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng chọn thời gian',
                                validate: (value) => validateMinMinutesFromNow(value, 30),
                            }}
                            error={errors.viewing_at}
                        />

                        <InputField
                            label="SĐT người giới thiệu (nếu có)"
                            name="referrer_phone"
                            placeholder="VD: 0909xxxxxx"
                            control={control}
                            rules={{
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: 'Số điện thoại chưa đúng',
                                },
                            }}
                            error={errors.referrer_phone}
                        />
                    </div>

                    <div className="form-row inline textarea-input">
                        <InputField
                            label="Ghi chú"
                            name="customer_note"
                            type="textarea"
                            placeholder="VD: Tôi muốn xem phòng buổi tối, khoảng 19h - 20h"
                            control={control}
                        />
                    </div>

                    <div className="form-row inline m-action">
                        <button
                            type="button"
                            className="btn btn-border mr-20"
                            onClick={onClose}
                        >
                            Huỷ
                        </button>

                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
