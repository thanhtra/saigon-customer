'use client';

import Breadcrumb from 'components/common/breadcrumb';

import {
    ZaloIconBtn
} from 'lib/utils/icon';

const ForgotPasswordPage = () => {

    return (
        <section className="container forgot-password-page">
            <Breadcrumb title="Quên mật khẩu" />

            <div className="auth-content">
                <h2 className="auth-title">Quên mật khẩu</h2>

                <p className="auth-desc">
                    Vì lý do bảo mật, vui lòng liên hệ quản trị viên
                    để được cấp lại mật khẩu mới.
                </p>

                <div className='auth-action auth-action--zalo'>
                    <a
                        href="https://zalo.me/0909123456"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-zalo btn-zalo--auth"
                    >
                        <ZaloIconBtn size={20} />
                        Liên hệ Admin
                    </a>
                </div>

                <p class="auth-hint">
                    Không cần OTP – Admin hỗ trợ nhanh qua Zalo
                </p>

            </div>
        </section>
    );
};

export default ForgotPasswordPage;










// 'use client';

// import { useCallback, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/router';
// import { useDispatch } from 'react-redux';
// import NProgress from 'nprogress';
// import { toast } from 'react-toastify';

// import Breadcrumb from 'components/common/breadcrumb';
// import InputField from 'components/common/form/InputField';

// import { PHONE_REGEX, PageUrl } from 'lib/constants/tech';
// import { updatePassword } from 'lib/api/user.api';
// import { removeAllLocalStorage } from 'lib/utils';
// import { UPDATE_USER } from 'lib/store/type/user-type';
// import { usePhoneOtp } from 'hooks/usePhoneOtp';

// const STEP = {
//     FORM: 'FORM',
//     OTP: 'OTP',
// };

// const ForgotPasswordPage = () => {
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const { sendOtp, verifyOtp } = usePhoneOtp();

//     const [step, setStep] = useState(STEP.FORM);

//     const {
//         control,
//         handleSubmit,
//         getValues,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         mode: 'onBlur',
//         defaultValues: {
//             phone: '',
//             password: '',
//             cf_password: '',
//             otp: '',
//         },
//     });

//     /* ================= SUBMIT ================= */
//     const onSubmit = useCallback(
//         async (data) => {
//             try {
//                 NProgress.start();

//                 // STEP 1: gửi OTP
//                 if (step === STEP.FORM) {
//                     await sendOtp(data.phone);
//                     toast.success('Mã xác nhận đã được gửi');
//                     setStep(STEP.OTP);
//                     return;
//                 }

//                 // STEP 2: verify OTP
//                 await verifyOtp(data.otp);

//                 const res = await updatePassword({
//                     phone: data.phone,
//                     password: data.password.trim(),
//                 });

//                 if (res?.success) {
//                     toast.success('Cập nhật mật khẩu thành công');
//                     logoutAndRedirect();
//                 } else {
//                     toast.error(res?.message || 'Cập nhật thất bại');
//                 }
//             } catch (error) {
//                 console.log('xxxx', error);
//                 toast.error('Mã xác nhận không đúng hoặc đã hết hạn');
//             } finally {
//                 NProgress.done();
//             }
//         },
//         [step, sendOtp, verifyOtp]
//     );

//     const logoutAndRedirect = () => {
//         removeAllLocalStorage();
//         dispatch({ type: UPDATE_USER, payload: {} });
//         router.push(PageUrl.Login);
//     };

//     /* ================= UI ================= */
//     return (
//         <section className="container forgot-password-page">
//             <Breadcrumb title="Quên mật khẩu" />

//             <div className="auth-content">
//                 <h2 className="auth-title">Quên mật khẩu</h2>
//                 <p className="auth-desc">
//                     Xác thực số điện thoại để đặt lại mật khẩu
//                 </p>

//                 <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//                     <div className="form-row">
//                         <InputField
//                             label="Số điện thoại"
//                             name="phone"
//                             placeholder="Nhập số điện thoại"
//                             required
//                             disabled={step === STEP.OTP}
//                             control={control}
//                             rules={{
//                                 required: 'Vui lòng nhập số điện thoại',
//                                 pattern: {
//                                     value: PHONE_REGEX,
//                                     message: 'Số điện thoại không hợp lệ',
//                                 },
//                             }}
//                             error={errors.phone}
//                         />
//                     </div>

//                     <div className="form-row">
//                         <InputField
//                             label="Mật khẩu mới"
//                             name="password"
//                             type="password"
//                             placeholder="Ít nhất 6 ký tự"
//                             required
//                             control={control}
//                             rules={{
//                                 required: 'Vui lòng nhập mật khẩu',
//                                 minLength: {
//                                     value: 6,
//                                     message: 'Mật khẩu tối thiểu 6 ký tự',
//                                 },
//                             }}
//                             error={errors.password}
//                         />

//                         <InputField
//                             label="Xác nhận mật khẩu"
//                             name="cf_password"
//                             type="password"
//                             placeholder="Nhập lại mật khẩu"
//                             required
//                             control={control}
//                             rules={{
//                                 required: 'Vui lòng xác nhận mật khẩu',
//                                 validate: (value) =>
//                                     value === getValues('password') ||
//                                     'Mật khẩu không khớp',
//                             }}
//                             error={errors.cf_password}
//                         />
//                     </div>

//                     {step === STEP.OTP && (
//                         <div className="form-row">
//                             <InputField
//                                 label="Mã xác nhận"
//                                 name="otp"
//                                 placeholder="Nhập mã OTP"
//                                 required
//                                 control={control}
//                                 rules={{
//                                     required: 'Vui lòng nhập mã OTP',
//                                     minLength: {
//                                         value: 6,
//                                         message: 'Mã OTP gồm 6 số',
//                                     },
//                                 }}
//                                 error={errors.otp}
//                             />
//                         </div>
//                     )}

//                     {/* Firebase reCAPTCHA */}
//                     <div id="recaptcha-container" />

//                     <div className="form-row auth-action">
//                         <button
//                             type="submit"
//                             className="btn"
//                             disabled={isSubmitting}
//                         >
//                             {step === STEP.FORM
//                                 ? 'Gửi mã xác nhận'
//                                 : 'Xác nhận'}
//                         </button>
//                     </div>
//                 </form>

//                 <div className="auth-link">
//                     <a href={PageUrl.Login} className="link-text">
//                         Quay lại đăng nhập
//                     </a>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default ForgotPasswordPage;
