import { useSelector, useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"
import { changePassword } from 'lib/api/user-service';
import { toast } from 'react-toastify'
import NProgress from 'nprogress';
import { removeAllLocalStorage } from 'lib/utils/index';
import { UPDATE_USER } from 'lib/store/type/user-type';
import { PageUrl } from 'lib/constants/tech';
import { useRouter } from 'next/router';
import { logout } from 'lib/api/user-service';

const ChangePassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, getValues, reset } = useForm();
    const { user } = useSelector(state => state.users);

    const onSubmit = async (data) => {
        try {
            if (!user || !user?.id) return;
            const { old_password, new_password, cf_password } = data;
            if (!old_password || !new_password || !cf_password || (new_password !== cf_password)) {
                return;
            }

            if (old_password === new_password) {
                toast.error("Mật khẩu mới trùng mật khẩu cũ");
                return;
            }

            const payload = {
                old_password: old_password,
                new_password: new_password
            }

            const res = await changePassword(payload);
            if (res && res.success) {
                NProgress.done();
                toast.success("Cập nhật mật khẩu thành công");
                logoutHandle();
            } else {
                NProgress.done();
                toast.error("Cập nhật mật khẩu thất bại");
            }
        }
        catch (error) {
            NProgress.done();
            toast.error("Cập nhật mật khẩu thất bại");
        }
    }

    const logoutHandle = async () => {
        try {
            const res = await logout();
            removeAllLocalStorage();
            dispatch({
                type: UPDATE_USER,
                payload: {}
            });
            router.push(PageUrl.Login);
        } catch (err) {
            removeAllLocalStorage();
            dispatch({
                type: UPDATE_USER,
                payload: {}
            });
            router.push(PageUrl.Login);
        }

    }

    const cancel = () => {
        reset({});
    }

    return (
        <section className="change-password">
            <div className='p-header'>
                <p className='p-title'>Đổi mật khẩu</p>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="form-row">
                    <div className="form-col">
                        <div className='form-input has-label'>
                            <label>Mật khẩu cũ<label className='required'>*</label></label>
                            <input
                                type="text"
                                autoComplete="off"
                                name="old_password"
                                placeholder="Nhập mật khẩu cũ"
                                ref={register({
                                    required: true,
                                })} />
                        </div>
                        {errors.old_password && errors.old_password.type === 'required' &&
                            <p className="message message-error">Vui lòng nhập thông tin</p>
                        }
                    </div>
                    <div className="form-col">
                        <div className='form-input has-label has-one-note'>
                            <label>Mật khẩu mới<label className='required'>*</label></label>
                            <label className='note'>Ít nhất 6 kí tự</label>
                            <input
                                type="text"
                                autoComplete="off"
                                name="new_password"
                                placeholder="Nhập mật khẩu mới"
                                ref={register({
                                    required: true,
                                    minLength: 6
                                })} />
                        </div>
                        {errors.new_password && errors.new_password.type === 'required' &&
                            <p className="message message-error">Vui lòng nhập thông tin</p>
                        }
                        {errors.new_password && errors.new_password.type === 'minLength' &&
                            <p className="message message-error">Mật khẩu quá ngắn</p>
                        }
                    </div>

                    <div className="form-col">
                        <div className='form-input has-label'>
                            <label>Xác nhận mật khẩu<label className='required'>*</label></label>
                            <input
                                type="text"
                                autoComplete="off"
                                name="cf_password"
                                placeholder="Nhập lại mật khẩu mới"
                                ref={register({
                                    required: true,
                                    validate: (val) => {
                                        const { new_password } = getValues();
                                        return new_password === val;
                                    },
                                })} />
                        </div>

                        {errors.cf_password && errors.cf_password.type === 'required' &&
                            <p className="message message-error">Vui lòng nhập thông tin</p>
                        }
                        {errors.cf_password && errors.cf_password.type === 'validate' &&
                            <p className="message message-error">Mật khẩu không khớp</p>
                        }
                    </div>

                    <div className="action-cancel-submit">
                        <button type="button" className="btn btn-border" onClick={cancel}>Huỷ</button>
                        <button type="submit" className="btn btn-green">Lưu</button>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default ChangePassword
