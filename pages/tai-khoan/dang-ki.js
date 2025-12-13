import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import { userRegister } from 'lib/api/user-service';
import Breadcrumb from 'components/common/breadcrumb';
import { PageUrl } from 'lib/constants/constant';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';


const RegisterPage = () => {
    const router = useRouter();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm({
        defaultValues: {
            full_name: '',
            phone_number: '',
            password: '',
            cf_password: ''
        }
    });

    const onSubmit = async (data) => {
        NProgress.start();

        const payload = {
            full_name: data.full_name,
            phone: data.phone_number,
            password: data.password
        }

        try {
            const res = await userRegister(payload);

            if (res && res.success) {
                NProgress.done();
                toast.success("Đăng kí thành công!");
                router.push(PageUrl.Login)
            } else {
                NProgress.done();
                toast.error("Đăng kí thất bại.");
            }

        } catch (ex) {
            NProgress.done();
            toast.error("Đăng kí thất bại.");
        }
    }

    return (
        <section className="container register-page">
            <Breadcrumb title='Tạo tài khoản' />

            <div className="form-block">
                <h2 className="form-title">Tạo tài khoản</h2>
                <p className="form-description">Tạo tài khoản để quản lý thông tin như đặt hàng, đăng tin bất động sản,...</p>

                <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="form-row two">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Tên liên hệ<label className='required'>*</label></label>
                                <input
                                    placeholder="Nhập tên liên hệ"
                                    type="text"
                                    autoComplete="off"
                                    name="full_name"
                                    ref={register({ required: true })}
                                />
                            </div>

                            {errors.full_name && errors.full_name.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Số điện thoại<label className='required'>*</label></label>
                                <input
                                    placeholder="Nhập số điện thoại"
                                    type="number"
                                    autoComplete="off"
                                    name="phone_number"
                                    ref={register({
                                        required: true,
                                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    })}
                                />
                            </div>

                            {errors.phone_number && errors.phone_number.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }

                            {errors.phone_number && errors.phone_number.type === 'pattern' &&
                                <p className="message message-error">Số điện thoại chưa đúng</p>
                            }
                        </div>
                    </div>
                    <div className="form-row two">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Mật khẩu<label className='required'>*</label></label>
                                <input
                                    placeholder="Nhập mật khẩu"
                                    type="text"
                                    autoComplete="off"
                                    name="password"
                                    ref={register({
                                        required: true,
                                        minLength: 6
                                    })}
                                />
                            </div>

                            {errors.password && errors.password.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                            {errors.password && errors.password.type === 'minLength' &&
                                <p className="message message-error">Mật khẩu phải có ít nhất 6 kí tự</p>
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
                    </div>

                    <div className="form-row j-c-c pt-40">
                        <button type="submit" className="btn btn-green btn-full">Đăng ký</button>
                    </div>
                    <div className="form-row j-c-c pt-30">
                        <a href={PageUrl.Login} className="link-text">Bạn đã có tài khoản?</a>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default RegisterPage
