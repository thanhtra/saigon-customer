import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"
import { updateUser } from 'lib/api/user-service';
import { toast } from 'react-toastify'
import NProgress from 'nprogress';
import { UPDATE_USER } from 'lib/store/type/user-type';

const Account = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.users)
    const [isEdit, setIsEdit] = useState(false)
    const { register, handleSubmit, errors, reset } = useForm()

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [JSON.stringify(user)]);

    const openEdit = () => {
        setIsEdit(true)
    }

    const onSubmit = async data => {
        try {
            NProgress.start();

            const payload = {
                id: user.id,
                full_name: data.full_name
            }

            const res = await updateUser(payload);

            if (res && res.success) {
                NProgress.done();
                toast.success("Cập nhật thành công!");
                setIsEdit(false);

                dispatch({
                    type: UPDATE_USER,
                    payload: res.result
                });
            } else {
                NProgress.done();
                toast.error("Cập nhật thất bại.")
            }
        } catch (ex) {
            NProgress.done();
            toast.error("Cập nhật thất bại.")
        }
    }

    return (
        <section className="account">
            <div className='p-header'>
                <p className='p-title'>Thông tin của tôi</p>
                <p className="btn-tiny" onClick={openEdit}>Chỉnh sửa</p>
            </div>

            {!isEdit ? <div className="infor-user">
                <div className="item">
                    <p className="label">Tên liên hệ:</p>
                    <p className="val">{user.full_name}</p>
                </div>
                <div className="item">
                    <p className="label">Số điện thoại:</p>
                    <p className="val">{user.phone}</p>
                </div>
            </div>
                :
                <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="form-row">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Tên liên hệ<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name="full_name"
                                    ref={register({
                                        required: true,
                                    })} />
                            </div>

                            {errors.full_name && errors.full_name.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>

                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Số điện thoại<label className='required'>*</label></label>
                                <input className="form-input"
                                    type="number"
                                    autoComplete="off"
                                    name="phone"
                                    disabled={true}
                                    ref={register()}
                                />
                            </div>
                        </div>

                        <div className="form-col action-cancel-submit">
                            <button type="button" className="btn btn-border" onClick={() => setIsEdit(false)}>Huỷ</button>
                            <button type="submit" className="btn btn-green">Lưu</button>
                        </div>
                    </div>
                </form>
            }
        </section>
    )
}

export default Account
