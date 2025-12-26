import Breadcrumb from 'components/common/breadcrumb';
import PopupAddress from 'components/common/popup-address';
import CheckoutItems from 'components/order/checkout-item';
import CheckoutStatus from 'components/order/checkout-status';
import { createAddress, getAddresses } from 'lib/api/address-service';
import { createOrder } from 'lib/api/order-service';
import { PageUrl } from 'lib/constants/tech';
import { CART_REMOVE_ALL_ITEM } from 'lib/store/type/cart-type';
import { COMMON_URL_REDIRECT_LOGIN, POPUP_ADD_ADDRESS_HIDE, POPUP_ADD_ADDRESS_OPEN } from 'lib/store/type/common-type';
import { UPDATE_USER } from 'lib/store/type/user-type';
import { formatCurrency } from 'lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ProfileTab } from 'lib/constants/data';

const jsonProvince = require('lib/constants/address/tinh_tp.json');
const jsonDistrict = require('lib/constants/address/quan_huyen.json');
const jsonWards = require('lib/constants/address/xa_phuong.json');


const provincesData = Object.values(jsonProvince)
const districtsData = Object.values(jsonDistrict)
const wardsData = Object.values(jsonWards)


const CheckoutPage = () => {
    const { isPopupAddAddressOpen } = useSelector(state => state.commons)
    const router = useRouter()
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, clearErrors } = useForm()
    const { cartItems } = useSelector(state => state.carts)
    const { user } = useSelector(state => state.users)
    const [addresses, setAddresses] = useState([])
    const totalPrice = (cartItems || []).reduce((total, curr) => total + Number(curr.price) * Number(curr.quantity), 0)

    const [displayListAddress, setDisplayListAddress] = useState(false)
    const [currentAddress, setCurrentAddress] = useState({})
    const [openModal, setOpenModal] = useState(false)

    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            router.push(PageUrl.Products);
        }
        if (!user || !user?.id) {
            router.push(PageUrl.Login);
        } else {
            getListAddress();
            dispatch({
                type: COMMON_URL_REDIRECT_LOGIN,
                payload: ''
            })
        }
    }, [JSON.stringify(user)]);

    const getListAddress = async () => {
        NProgress.start();

        try {

            if (!user?.id) return;
            const query = { userId: user?.id }
            const res = await getAddresses(query);

            if (res && res?.success && res?.result?.data.length) {
                const listAddress = res?.result?.data;
                setAddresses(listAddress);
                if (user?.address_default && !Object.keys(currentAddress || {}).length) {
                    const currentAddress = listAddress.find(item => item.id === user?.address_default)
                    setCurrentAddress(currentAddress);
                }
            }

            NProgress.done();
        } catch (err) {
            router.push(PageUrl.Login)
            NProgress.done()
        }
    }

    const selectProvince = (e) => {
        const dis = districtsData.filter(x => x.parent_code === e.target.value)
        setProvince(e.target.value)
        setDistricts(dis)
        setDistrict('')
        setWards([])
    }

    const selectDistrict = (e) => {
        const was = wardsData.filter(x => x.parent_code === e.target.value)
        setDistrict(e.target.value)
        setWards(was)
    }

    const formatAddress = (obj) => {
        if (Object.keys(obj || {}).length === 0) return ''
        return `${obj?.name} ${obj?.phone} - ${obj?.address_detail}, ${obj?.ward}, ${obj?.district}, ${obj?.province}`
    }

    const displayListAddressFunc = () => {
        setDisplayListAddress(true)
    }

    const hideListAddressFunc = () => {
        setDisplayListAddress(false)
    }

    const openModalAddress = () => {
        setOpenModal(true);
        dispatch({ type: POPUP_ADD_ADDRESS_OPEN });
    }

    const closeModalAddAddress = (reload, newAddress) => {
        if (reload) {
            setCurrentAddress(newAddress);
            getListAddress();
        }

        setOpenModal(false)
        setDisplayListAddress(false);

        if (isPopupAddAddressOpen) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }

    const goToProfileEditAddress = () => {
        router.push({
            pathname: PageUrl.Profile,
            query: { tab: ProfileTab.address }
        })
    }

    const selectAddress = (address) => {
        setCurrentAddress(address)
        setDisplayListAddress(false)
    }

    const completeOrder = async (data) => {
        if (!cartItems?.length) return;

        try {
            NProgress.start()
            let addressTxt = ''

            if (Object.keys(currentAddress || {}).length === 0) {
                const province = provincesData.find(x => x.code == data?.province)?.name || '';
                const district = districtsData.find(x => x.code == data?.district)?.name || '';
                const ward = wardsData.find(x => x.code == data?.ward)?.name || '';
                if (!province || !district || !ward) return;

                const dataAddress = {
                    user_id: user?.id,
                    name: data?.name,
                    phone: data?.phone,
                    province,
                    district,
                    ward,
                    address_detail: data?.address
                }
                const resAddress = await createAddress(dataAddress)
                if (!resAddress?.success) {
                    toast.error("Đặt hàng không thành công.");
                    return;
                }

                if (user && !user?.address_default) {
                    const newUser = { ...user, address_default: resAddress?.result.id };

                    dispatch({
                        type: UPDATE_USER,
                        payload: newUser
                    });
                }

                addressTxt = formatAddress(resAddress?.result)
            } else {
                addressTxt = formatAddress(currentAddress)
            }

            const order = {
                order_detail: JSON.stringify(cartItems),
                user_id: user?.id,
                shipping_address: addressTxt,
                note: data?.note || '',
            }

            const resOrder = await createOrder(order)
            if (resOrder && resOrder?.success) {
                dispatch({
                    type: CART_REMOVE_ALL_ITEM,
                    payload: []
                });

                NProgress.done();
                router.push(PageUrl.CompleteOrder);
            } else {
                NProgress.done();
                toast.error("Đặt hàng không thành công.");
            }
        } catch (error) {
            NProgress.done();
            toast.error("Đặt hàng không thành công.");
        }
    }


    return (
        <section className="container checkout-page">
            <Breadcrumb title={'Giao hàng'} />

            <div className='checkout-main'>
                <PopupAddress isShow={openModal} hideModal={closeModalAddAddress} />

                <div className="cart-intro">
                    <h3 className="cart-title">Giao hàng và thanh toán</h3>
                    <CheckoutStatus step="checkout" />
                </div>

                <form className="form" onSubmit={handleSubmit(completeOrder)} autoComplete="off">
                    <div className="checkout-content">
                        <div className="checkout-col-6">
                            <div className="block">
                                <h3 className="block-title">Địa chỉ nhận hàng</h3>

                                {user?.address_default && Object.keys(currentAddress || {}).length > 0 &&
                                    <div className="gr-address">
                                        {displayListAddress ?
                                            <div className="list-address">
                                                {addresses.map((item, index) => (
                                                    <div className="form-info" key={index} onClick={() => selectAddress(item)}>
                                                        <div className="checkbox-wrapper">
                                                            <label htmlFor="check-signed-in" className={`checkbox checkbox--sm`}>
                                                                <input type="checkbox" checked={currentAddress?.id == item.id} readOnly />
                                                                <span className="checkbox-check"></span>
                                                                <p className="item-address"><span className="user-name">{item.name} - {item.phone} - </span>{item.address_detail}, {item.ward}, {item.district}, {item.province}</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="btn-add-new-address">
                                                    <p className="btn-tiny btn-cancel" onClick={hideListAddressFunc}>Huỷ</p>
                                                    <p className="btn-tiny btn-add" onClick={openModalAddress}>Thêm mới</p>
                                                </div>
                                            </div> :
                                            <div className="main-address">
                                                <div className="gr-des">
                                                    <p className="txt-description">{formatAddress(currentAddress)}</p>
                                                </div>
                                                <div className="gr-action">
                                                    {user?.address_default === currentAddress?.id && <div className="default">
                                                        <p className="txt-default">Mặc định</p>
                                                        <p className="btn-edit">(
                                                            <span onClick={goToProfileEditAddress} className="txt-edit">Sửa</span>)
                                                        </p>
                                                    </div>}

                                                    <p className="btn-tiny btn-change" onClick={displayListAddressFunc}>Thay đổi</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }

                                {(!Object.keys(currentAddress || {}).length && !user?.address_default) && <div className="gr-address">
                                    <div className='form'>
                                        <div className="form-row">
                                            <div className="form-col">
                                                <div className='form-input has-label'>
                                                    <label>Tên liên hệ<label className='required'>*</label></label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        name="name"
                                                        placeholder="Nhập tên liên hệ"
                                                        ref={register({
                                                            required: true,
                                                        })} />
                                                </div>

                                                {errors.name && errors.name.type === 'required' &&
                                                    <p className="message message-error">Vui lòng nhập thông tin</p>
                                                }
                                            </div>

                                            <div className="form-col">
                                                <div className='form-input has-label'>
                                                    <label>Số điện thoại<label className='required'>*</label></label>
                                                    <input
                                                        type="number"
                                                        autoComplete="off"
                                                        name="phone"
                                                        placeholder="Nhập số điện thoại"
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
                                        </div>

                                        <div className="form-row two">
                                            <div className="form-col">
                                                <div className="form-select has-label">
                                                    <label>Tỉnh, thành phố<label className='required'>*</label></label>
                                                    <select
                                                        onChange={selectProvince}
                                                        name="province"
                                                        ref={register({
                                                            pattern: /([1-9][0-9]*)|0/
                                                        })} >

                                                        <option>Chọn</option>
                                                        {provincesData.map((prov, index) => (
                                                            <option key={index} value={prov.code}>{prov.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {errors.province && errors.province.type === 'pattern' &&
                                                    <p className="message message-error">Vui lòng nhập thông tin</p>
                                                }
                                            </div>

                                            <div className="form-col">
                                                <div className="form-select has-label">
                                                    <label>Quận, huyện<label className='required'>*</label></label>
                                                    <select
                                                        onChange={selectDistrict}
                                                        name="district"
                                                        disabled={!province}
                                                        ref={register({
                                                            pattern: /([1-9][0-9]*)|0/
                                                        })}
                                                    >

                                                        <option>Chọn</option>
                                                        {districts.map((dis, index) => (
                                                            <option key={index} value={dis.code}>{dis.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.district && errors.district.type === 'pattern' &&
                                                    <p className="message message-error">Vui lòng nhập thông tin</p>
                                                }
                                            </div>
                                        </div>

                                        <div className="form-row two">
                                            <div className="form-col">
                                                <div className="form-select has-label">
                                                    <label>Xã, phường<label className='required'>*</label></label>
                                                    <select
                                                        name="ward"
                                                        disabled={!district}
                                                        ref={register({
                                                            pattern: /([1-9][0-9]*)|0/
                                                        })}
                                                    >
                                                        <option>Chọn</option>
                                                        {wards.map((ward, index) => (
                                                            <option key={index} value={ward.code}>{ward.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.ward && errors.ward.type === 'pattern' &&
                                                    <p className="message message-error">Vui lòng nhập thông tin</p>
                                                }
                                            </div>

                                            <div className="form-col">
                                                <div className='form-input has-label'>
                                                    <label>Địa chỉ chi tiết<label className='required'>*</label></label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        name='address'
                                                        placeholder="Tên đường, số nhà,..."
                                                        ref={register({
                                                            required: true,
                                                        })}
                                                    />
                                                </div>

                                                {errors.address && errors.address.type === 'required' &&
                                                    <p className="message message-error">Vui lòng nhập thông tin</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>

                            <div className="block">
                                <h3 className="block-title">Lời nhắn</h3>
                                <div className="form-row three">
                                    <div className="form-col" style={{ marginBottom: '0px' }}>
                                        <div className='form-input has-label'>
                                            <input
                                                type="text"
                                                autoComplete="off"
                                                name="note"
                                                placeholder="Lưu ý cho Vị Rừng..."
                                                ref={register({
                                                    required: false,
                                                })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-col-4">
                            <div className="block">
                                <h3 className="block-title">Phương thức thanh toán</h3>
                                <p className="txt-description">Kiểm tra hàng trước khi thanh toán hoặc thanh toán trước</p>
                            </div>

                            <div className="block">
                                <h3 className="block-title">Phương thức giao hàng</h3>
                                <p className="txt-description">Giao hàng nhanh toàn quốc qua ship COD hoặc giao hàng tiết kiệm</p>
                            </div>
                        </div>

                        <div className="checkout-col-2">
                            <div className="block">
                                <h3 className="block-title">Giỏ hàng của bạn</h3>
                                <CheckoutItems />

                                <div className="checkout-total">
                                    <p>Tổng tiền:</p>
                                    <h3>{formatCurrency.format(totalPrice)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-actions">
                        <button type="submit" className="btn btn-green">Hoàn tất đặt hàng</button>
                        <Link href="/san-pham">
                            <button type="button" className="btn btn-border">Tiếp tục chọn hàng</button>
                        </Link>
                    </div>
                </form>
            </div>

        </section >
    )
}

export default CheckoutPage