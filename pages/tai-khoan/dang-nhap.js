import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import NProgress from 'nprogress'
import { PageUrl } from 'lib/constants/constant';
import Breadcrumb from 'components/common/breadcrumb';
import { login } from 'lib/api/user-service';
import { LOGIN_SUCCESS } from 'lib/store/type/user-type';
import { saveTokens, saveUser } from 'lib/utils/index';
import Link from 'next/link';

const LoginPage = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.carts || {});
    const { urlRedirectLogin } = useSelector(state => state.commons || {});
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            phone_value: '',
            password_value: ''
        }
    })

    const handleLogin = async data => {
        try {
            if (!data?.phone_value || !data?.password_value) return;

            NProgress.start();
            const payload = {
                username: data?.phone_value,
                password: data?.password_value
            }

            const res = await login(payload);
            if (res && res.success) {
                const { tokens, ...userData } = res?.result;
                saveTokens(tokens?.accessToken, tokens?.refreshToken);
                saveUser(userData);
                dispatch({ type: LOGIN_SUCCESS, payload: userData })

                NProgress.done();
                toast.success("Đăng nhập thành công!");

                switch (urlRedirectLogin) {
                    case PageUrl.PostLand:
                        router.push(PageUrl.PostLand);
                        break;
                    case PageUrl.PostProduct:
                        router.push(PageUrl.PostProduct);
                        break;
                    case PageUrl.Payment:
                        router.push(PageUrl.Payment);
                        break;
                    default:
                        router.push('/');
                }
            } else {
                NProgress.done();
                toast.error("Đăng nhập thất bại.")
            }
        } catch (error) {
            NProgress.done();
            toast.error("Đăng nhập thất bại.")
        }
    }

    return (
        <section className="container login-page">
            <Breadcrumb title='Đăng nhập' />

            <div className="form-block">
                <h2 className="form-title">Đăng nhập</h2>
                <p className="form-description">Bạn cần đăng nhập để quản lý thông tin</p>

                <form className="form" onSubmit={handleSubmit(handleLogin)} autoComplete="off">
                    <div className="form-row">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Số điện thoại<label className='required'>*</label></label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Nhập số điện thoại"
                                    name="phone_value"
                                    ref={register({
                                        required: true,
                                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    })}

                                />
                            </div>

                            {errors.phone_value && errors.phone_value.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }

                            {errors.phone_value && errors.phone_value.type === 'pattern' &&
                                <p className="message message-error">Số điện thoại chưa đúng</p>
                            }
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Mật khẩu<label className='required'>*</label></label>
                                <input
                                    className="form-input"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Nhập mật khẩu"
                                    name="password_value"
                                    ref={register({ required: true })}
                                />
                            </div>

                            {errors.password_value && errors.password_value.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>

                    <div className="form-row j-c-c pt-40">
                        <button type="submit" className="btn btn-green btn-submit btn-full">Đăng nhập</button>
                    </div>

                    <div className="form-row j-c-c pt-30">
                    </div>

                    <div className="form-row j-c-c pt-40">
                        <Link href={PageUrl.ForgotPassword}>
                            <button type="button" className="btn btn-border btn-full">Quên mật khẩu?</button>
                        </Link>
                    </div>

                    <div className="form-row j-c-c pt-30">
                        <Link href={PageUrl.Register}>
                            <button type="button" className="btn btn-border btn-full">Tạo tài khoản</button>
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default LoginPage
