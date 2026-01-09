import NProgress from 'nprogress';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import InputField from 'components/common/form/InputField';
import { updateUser } from 'lib/api/user.api';
import { UPDATE_USER } from 'lib/store/type/user-type';

const Account = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.users?.user);
    const [isEdit, setIsEdit] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            zalo: '',
            link_facebook: '',
            address: '',
        },
        mode: 'onSubmit',
        shouldUnregister: false
    });

    /* =====================
       Sync user data
    ===================== */
    useEffect(() => {
        if (!user) return;

        reset({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            zalo: user.zalo || '',
            link_facebook: user.link_facebook || '',
            address: user.address || '',
        });
    }, [user, reset]);

    /* =====================
       Submit
    ===================== */
    const onSubmit = useCallback(
        async (data) => {
            NProgress.start();
            try {
                const payload = {
                    name: data.name.trim(),
                    email: data.email || null,
                    zalo: data.zalo || null,
                    link_facebook: data.link_facebook || null,
                    address: data.address || null,
                };

                const res = await updateUser(payload);

                if (res?.success) {
                    toast.success('Cập nhật thành công');
                    dispatch({
                        type: UPDATE_USER,
                        payload: res.result,
                    });
                    setIsEdit(false);
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } catch {
                toast.error('Cập nhật thất bại');
            } finally {
                NProgress.done();
            }
        },
        [dispatch, user]
    );

    return (
        <section className="account">
            <div className="p-header">
                <p className="p-title">Thông tin của tôi</p>
                {!isEdit && (
                    <p className="btn-tiny" onClick={() => setIsEdit(true)}>
                        Chỉnh sửa
                    </p>
                )}
            </div>

            {!isEdit && (
                <div className="infor-user">
                    <div className="item">
                        <p className="label">Số điện thoại:</p>
                        <p className="val">{user?.phone || '—'}</p>
                    </div>
                    <div className="item">
                        <p className="label">Tên liên hệ:</p>
                        <p className="val">{user?.name || '—'}</p>
                    </div>
                    <div className="item">
                        <p className="label">Email:</p>
                        <p className="val">{user?.email || '—'}</p>
                    </div>
                    <div className="item">
                        <p className="label">Zalo:</p>
                        <p className="val">{user?.zalo || '—'}</p>
                    </div>
                    <div className="item">
                        <p className="label">Facebook:</p>
                        <p className="val">{user?.link_facebook || '—'}</p>
                    </div>
                    <div className="item">
                        <p className="label">Địa chỉ:</p>
                        <p className="val">{user?.address || '—'}</p>
                    </div>
                </div>
            )}

            {isEdit && (
                <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form-row">
                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            disabled
                            control={control}
                        />

                        <InputField
                            label="Tên liên hệ"
                            name="name"
                            required
                            placeholder="Nhập tên liên hệ"
                            control={control}
                            rules={{ required: 'Vui lòng nhập tên' }}
                            error={errors.name}
                        />
                    </div>

                    <div className="form-row">
                        <InputField
                            label="Email"
                            name="email"
                            placeholder="uocmotngoinha@gmail.com"
                            control={control}
                        />

                        <InputField
                            label="Zalo"
                            name="zalo"
                            placeholder="Số Zalo"
                            control={control}
                        />
                    </div>

                    <div className="form-row">
                        <InputField
                            label="Facebook"
                            name="link_facebook"
                            placeholder="Link Facebook"
                            control={control}
                        />

                        <InputField
                            label="Địa chỉ"
                            name="address"
                            placeholder="Nhập địa chỉ"
                            control={control}
                        />
                    </div>

                    <div className="form-row inline row-action">
                        <button
                            type="button"
                            className="btn btn-border mr-20"
                            onClick={() => setIsEdit(false)}
                            disabled={isSubmitting}
                        >
                            Huỷ
                        </button>

                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default Account;
