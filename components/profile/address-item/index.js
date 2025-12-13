import { toast } from 'react-toastify'
import { removeAddress } from 'lib/api/address-service';
import { updateUser } from 'lib/api/user-service';
import { useDispatch } from 'react-redux'
import NProgress from 'nprogress';
import { UPDATE_USER } from 'lib/store/type/user-type';

const AddressItem = ({ id, user_id, address_detail, ward, district, province, phone, name, isDefault, reload }) => {
    const dispatch = useDispatch()

    const removeAddressFunc = async () => {
        try {
            NProgress.start();

            const res = await removeAddress(id);
            if (res && res.success) {

                NProgress.done()
                toast.success("Xoá địa chỉ thành công!");

                if (reload) {
                    reload(true)
                }
            } else {
                NProgress.done()
                toast.error("Xoá địa chỉ thất bại.")
            }
        } catch (err) {
            NProgress.done()
            toast.error("Xoá địa chỉ thất bại.")
        }
    }

    const setDefault = async () => {
        try {
            if (!user_id || !id) {
                toast.error("Cập nhật thất bại.")
                return;
            }

            NProgress.start()
            const res = await updateUser({ id: user_id, address_default: id });

            if (res && res.success) {
                dispatch({
                    type: UPDATE_USER,
                    payload: res?.result
                });

                NProgress.done();
                toast.success("Thiết lập thành công!")
            } else {
                NProgress.done()
                toast.error("Thiết lập thất bại.")
            }
        } catch (error) {
            NProgress.done()
            toast.error("Thiết lập thất bại.")
        }
    }

    return (
        <div className="address-item">
            <div className="a-i-content">
                <div className="item">
                    <p>Tên liên hệ:</p>
                    <p>{name}</p>
                </div>
                <div className="item">
                    <p>Sđt:</p>
                    <p>{phone}</p>
                </div>
                <div className="item">
                    <p>Địa chỉ:</p>
                    <p>{`${address_detail} - ${ward} - ${district} - ${province}`}</p>
                </div>
            </div>
            <div className="a-i-action">
                {!isDefault ? <p onClick={setDefault} className={"btn-tiny"}>Thiết lập mặc định</p> :
                    <p onClick={setDefault} className={'btn-tiny btn-disable'}>Mặc định</p>
                }

                {!isDefault && <p className='btn-tiny' onClick={removeAddressFunc}>Xoá</p>}
            </div>
        </div>
    )
}

export default AddressItem