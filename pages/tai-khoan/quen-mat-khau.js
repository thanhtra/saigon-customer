import { useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"
import { auth } from '../../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { updatePassword } from 'lib/api/user-service';
import { toast } from 'react-toastify'
import NProgress from 'nprogress'
import { useRouter } from 'next/router';
import { useState } from 'react';
import Breadcrumb from 'components/common/breadcrumb';
import clsx from 'clsx';
import { removeAllLocalStorage } from 'lib/utils/index';
import { UPDATE_USER } from 'lib/store/type/user-type';
import { PageUrl } from 'lib/constants/tech';

const ForgotPassword = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { register, handleSubmit, errors, getValues, reset } = useForm();
    const [showConfirmInput, setShowConfirmInput] = useState(false);
    const [confirmCode, setConfirmCode] = useState('');

    const sendCodeToPhone = (phone) => {
        try {
            if (!phone) return;
            const phoneNumber = "+84" + phone.slice(1);
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'normal', }, auth);
            const appVerifier = window.recaptchaVerifier;

            signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    setShowConfirmInput(true);
                }).catch((error) => {
                    setShowConfirmInput(false);
                })
        } catch (error) {
            setShowConfirmInput(false);
        }
    }

    const onSubmit = async (data) => {
        const { password, cf_password, phone } = data;
        if (!password || !cf_password || (password !== cf_password)) {
            toast.error("Mật khẩu không khớp");
            return;
        }

        if (showConfirmInput) {
            if (!confirmCode) {
                toast.error("Vui lòng nhập mã xác nhận");
                return;
            }

            NProgress.start()
            window.confirmationResult.confirm(confirmCode)
                .then((result) => {
                    if (result?.user && result.user?.uid && result.user?.phoneNumber) {
                        const payload = {
                            phone: phone,
                            password: password.toString().trim()
                        }
                        updatePassword(payload)
                            .then(res => {
                                if (res && res.success) {
                                    NProgress.done()
                                    toast.success("Cập nhật mật khẩu thành công")
                                } else {
                                    NProgress.done();
                                    toast.error("Cập nhật thất bại")
                                }
                            })
                            .catch(err => {
                                NProgress.done();
                                toast.error("Cập nhật thất bại")
                            })
                            .finally(() => {
                                logoutHandle();
                            })

                        setShowConfirmInput(false);
                        setConfirmCode('');
                    } else {
                        NProgress.done();
                        toast.error("Mã xác nhận chưa đúng")
                    }
                }).catch((error) => {
                    NProgress.done();
                    toast.error("Mã xác nhận chưa đúng")
                })
        } else {
            sendCodeToPhone(phone);
        }
    }

    const inputConfirmCode = (e) => {
        setConfirmCode(e.target.value);
    }

    const logoutHandle = async () => {
        removeAllLocalStorage();
        dispatch({
            type: UPDATE_USER,
            payload: {}
        });
        router.push(PageUrl.Login);
    }

    const cancel = () => {
        reset({});
    }

    return (
        <section className="container forgot-password-page">
            <Breadcrumb title='Quên mật khẩu' />

            <div className="form-block">
                <h2 className="form-title">Quên mật khẩu</h2>
                <p className="form-description">Cập nhật mật khẩu mới cho tài khoản</p>

                <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="form-row">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Số điện thoại<label className='required'>*</label></label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    ref={register({
                                        required: true,
                                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    })} />
                            </div>

                            {errors.phone && errors.phone.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }

                            {errors.phone && errors.phone.type === 'pattern' &&
                                <p className="message message-error">Số điện thoại chưa đúng</p>
                            }
                        </div>

                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Mật khẩu mới<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Nhập mật khẩu mới"
                                    ref={register({
                                        required: true,
                                        minLength: 6
                                    })} />
                            </div>
                            {errors.password && errors.password.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                            {errors.password && errors.password.type === 'minLength' &&
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
                                    placeholder="Nhập lại mật khẩu"
                                    ref={register({
                                        required: true,
                                        validate: (val) => {
                                            const { password } = getValues();
                                            return password === val;
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

                        {showConfirmInput && <div className="form-col confirm-code">
                            <div className='form-input has-label'>
                                <label>Mã xác nhận<label className='required'>*</label></label>
                                <label className='note'>Nhập mã xác nhận đã được gửi đến số điện thoại của bạn</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Nhập mã xác nhận"
                                    value={confirmCode}
                                    onChange={inputConfirmCode}
                                />
                            </div>
                            {errors.cf_code && errors.cf_code.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>}

                        <div id="recaptcha-container" className={clsx({
                            'hidden': showConfirmInput || confirmCode,
                        })}></div>

                        <div className="action-cancel-submit">
                            <button type="button" className="btn btn-border" onClick={cancel}>Huỷ</button>
                            <button type="submit" className="btn btn-green">Lưu</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ForgotPassword