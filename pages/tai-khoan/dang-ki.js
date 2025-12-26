import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';

import Breadcrumb from 'components/common/breadcrumb';
import { userRegister } from 'lib/api/user-service';
import { PageUrl } from 'lib/constants/tech';
import { PHONE_REGEX } from 'lib/constants/tech';
import InputField from 'components/common/form/InputField';
import RadioGroupCheckbox from 'components/common/form/RadioGroupCheckbox';
import { CustomerTypeOptions } from 'lib/constants/data';
import { convertObjectToOptions } from 'lib/utils';


const RegisterPage = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            phone_number: '',
            password: '',
            cf_password: '',
            customer_type: '',
        },
    });


    const onSubmit = async (data) => {
        NProgress.start();

        try {
            const res = await userRegister({
                name: data.name,
                phone: data.phone_number,
                password: data.password,
                customer_type: data.customer_type
            });

            if (res?.success) {
                toast.success('Đăng kí thành công!');
                router.push(PageUrl.Login);
            } else {
                toast.error('Đăng kí thất bại.');
            }
        } catch (error) {
            toast.error('Đăng kí thất bại.');
        } finally {
            NProgress.done();
        }
    };

    return (
        <section className="container register-page">
            <Breadcrumb title="Tạo tài khoản" />

            <div className="form-block">
                <h2 className="form-title">Tạo tài khoản</h2>
                <p className="form-description">
                    Tạo tài khoản để đăng tin, đặt lịch xem nhà,...
                </p>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-row two">
                        <InputField
                            label="Tên liên hệ"
                            name="name"
                            placeholder="Nhập tên liên hệ"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập thông tin',
                            }}
                            error={errors.name}
                        />

                        <InputField
                            label="Số điện thoại"
                            name="phone_number"
                            placeholder="Nhập số điện thoại"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập thông tin',
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: 'Số điện thoại chưa đúng',
                                },
                            }}
                            error={errors.phone_number}
                        />
                    </div>

                    <div className="form-row two">
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            // type="password"
                            placeholder="Nhập mật khẩu"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập thông tin',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 kí tự',
                                },
                            }}
                            error={errors.password}
                        />

                        <InputField
                            label="Xác nhận mật khẩu"
                            name="cf_password"
                            // type="password"
                            placeholder="Nhập lại mật khẩu"
                            required
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập thông tin',
                                validate: (val) =>
                                    val === getValues('password') || 'Mật khẩu không khớp',
                            }}
                            error={errors.cf_password}
                        />

                    </div>

                    <div className="form-row three">
                        <RadioGroupCheckbox
                            label="Bạn là"
                            required
                            name="customer_type"
                            options={convertObjectToOptions(CustomerTypeOptions)}
                            control={control}
                            rules={{ required: 'Vui lòng chọn 1 loại khách' }}
                            error={errors.customer_type}
                            inline
                        />
                    </div>


                    <div className="form-row j-c-c pt-40">
                        <button type="submit" className="btn btn-green btn-full">
                            Đăng ký
                        </button>
                    </div>

                    <div className="form-row j-c-c pt-30">
                        <a href={PageUrl.Login} className="link-text">
                            Bạn đã có tài khoản?
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
