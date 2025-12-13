import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { updateUser } from 'lib/api/user-service';
import NProgress from 'nprogress'

const Subscribe = () => {
    const { user } = useSelector(state => state.users)
    const { register, handleSubmit, errors, reset } = useForm()

    const onSubmit = (data) => {
        if (!user?.id || !data.email) {
            toast.error("Đăng kí thất bại.")
            return
        }
        const userInfor = {
            id: user?.id,
            email: data.email
        }

        NProgress.start()
        updateUser(userInfor)
            .then(res => {
                if (res && res.success) {
                    NProgress.done()
                    toast.success("Đăng kí thành công!")
                    reset({});
                }
            })
            .catch(err => {
                reset({});
                NProgress.done()
                toast.error("Đăng kí thất bại.")
            })
    }

    return (
        <section className="container subscribe">
            <div style={{ backgroundImage: 'url(/images/subscribe.jpg)' }} className="subscribe-content">
                <p className="txt">Đăng ký để nhận thông tin mới nhất về văn hoá, ẩm thực và du lịch Đăk Nông</p>

                <form className="form subscribe-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="form-row">
                        <div className="form-input">
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="Địa chỉ email"
                                name="email"
                                ref={register({
                                    required: true,
                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                })}
                            />
                        </div>


                        {errors.email && errors.email.type === 'required' &&
                            <p className="message message-error">Vui lòng nhập thông tin</p>
                        }

                        {errors.email && errors.email.type === 'pattern' &&
                            <p className="message message-error">Địa chỉ email chưa đúng</p>
                        }
                    </div>

                    <button type="submit" className="btn btn-green">Đăng ký</button>
                </form>
            </div>
        </section>
    )
}

export default Subscribe