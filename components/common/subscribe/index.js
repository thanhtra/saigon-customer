'use client'

import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateUser } from 'lib/api/user.api';
import NProgress from 'nprogress'
import { useState } from 'react'

const Subscribe = () => {
    const { user } = useSelector(state => state.users)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: ''
        }
    })

    const onSubmit = async (data) => {
        if (!user?.id) {
            toast.error('Vui lòng đăng nhập để đăng ký nhận tin.')
            return
        }

        setLoading(true)
        NProgress.start()

        try {
            const res = await updateUser({
                id: user.id,
                email: data.email
            })

            if (res?.success) {
                toast.success('🎉 Đăng ký nhận tin thành công!')
                reset()
            } else {
                toast.error('Đăng ký thất bại, vui lòng thử lại.')
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại.')
        } finally {
            setLoading(false)
            NProgress.done()
        }
    }

    return (
        <section className="subscribe-section">
            <div
                className="subscribe-box"
                style={{ backgroundImage: 'url(/images/subscribe.jpg)' }}
            >
                <div className="subscribe-content">
                    <h3>Nhận tin BĐS Gò Vấp sớm nhất</h3>
                    <p>
                        Nhà phố chính chủ • Phòng trọ mới • Tool & dịch vụ BĐS hữu ích
                    </p>

                    <form
                        className="subscribe-form"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                    >
                        <div className="input-group">
                            <i className="icon-send"></i>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                {...register('email', {
                                    required: 'Vui lòng nhập email',
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                                        message: 'Email không hợp lệ'
                                    }
                                })}
                                disabled={loading}
                            />
                        </div>

                        {errors.email && (
                            <p className="message-error">{errors.email.message}</p>
                        )}

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký nhận tin'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Subscribe
