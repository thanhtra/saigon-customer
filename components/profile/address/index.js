import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AddressItem from '../address-item'
// import { getAddresses } from 'lib/api/address-service';
import PopupAddress from 'components/common/popup-address';
import NProgress from 'nprogress';
import { POPUP_ADD_ADDRESS_OPEN, POPUP_ADD_ADDRESS_HIDE } from 'lib/store/type/common-type';


const Address = () => {
    const { user } = useSelector(state => state.users);
    const { isPopupAddAddressOpen } = useSelector(state => state.commons);
    const [addresses, setAddresses] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        getListAddressHandle();
    }, [])

    const getListAddressHandle = async () => {
        NProgress.start();
        const query = { userId: user?.id };

        try {
            // const res = await getAddresses(query);

            // if (res && res.success) {
            //     setAddresses(res.result.data);
            // }

            NProgress.done();
        } catch (err) {
            NProgress.done();
        }
    }

    const openModalAddAddress = () => {
        setOpenModal(true);
        dispatch({ type: POPUP_ADD_ADDRESS_OPEN });
    }

    const closeModalAddAddress = (reload) => {
        if (reload) {
            getListAddressHandle();
        }

        if (isPopupAddAddressOpen) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
        setOpenModal(false);
    }

    return (
        <section className="address">
            <PopupAddress isShow={openModal} hideModal={closeModalAddAddress} />

            <div className='p-header'>
                <p className='p-title'>Địa chỉ nhận hàng</p>
                <button type="button" className="btn-tiny" onClick={openModalAddAddress}>Thêm địa chỉ mới</button>
            </div>

            <div className='content'>
                {addresses && addresses.length > 0 ?
                    (addresses.map((item, index) => <AddressItem
                        key={index}
                        id={item.id}
                        user_id={user?.id}
                        address_detail={item.address_detail}
                        ward={item.ward}
                        district={item.district}
                        province={item.province}
                        phone={item.phone}
                        name={item.name}
                        isDefault={user?.address_default === item.id}
                        reload={getListAddressHandle}
                    />)) : <div>
                        Chưa có địa chỉ giao hàng
                    </div>}
            </div>
        </section>
    );
};


export default Address
