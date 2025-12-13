import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form"
import { createAddress } from 'lib/api/address-service';
import { toast } from 'react-toastify'
import NProgress from 'nprogress';

const jsonProvince = require('lib/constants/address/tinh_tp.json');
const jsonDistrict = require('lib/constants/address/quan_huyen.json');
const jsonWards = require('lib/constants/address/xa_phuong.json')

const provincesData = Object.values(jsonProvince)
const districtsData = Object.values(jsonDistrict)
const wardsData = Object.values(jsonWards)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: '10px',
        boxShadow: 'rgb(100 100 111 / 20%) 0px 7px 29px 0px',
        overflow: 'auto',
        padding: '20px'
    },
}

const PopupAddress = ({ isShow, hideModal }) => {
    const { user } = useSelector(state => state.users)
    const { register, handleSubmit, errors, reset } = useForm()

    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')

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

    const onSubmit = async data => {
        const province = provincesData.find(x => x.code === data?.province)?.name || '';
        const district = districtsData.find(x => x.code === data?.district)?.name || '';
        const ward = wardsData.find(x => x.code === data?.ward)?.name || '';
        if (!province || !district || !ward) return;

        NProgress.start();

        const dataAddress = {
            name: data?.name,
            phone: data?.phone,
            province,
            district,
            ward,
            address_detail: data?.address,
            user_id: user.id
        }

        try {
            const res = await createAddress(dataAddress)

            if (res && res?.success) {
                toast.success("Tạo địa chỉ thành công!");

                if (hideModal) {
                    hideModal(true, res?.result)
                }
            } else {
                toast.error("Tạo địa chỉ thất bại.")
            }
            NProgress.done()
        } catch (err) {
            toast.error("Tạo địa chỉ thất bại.")
            NProgress.done()
        }
    }

    const closeModal = () => {
        if (hideModal) {
            hideModal()
        }
    }

    return (
        <Modal isOpen={isShow}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <div className="popup-address">
                <p className='title'>Địa chỉ mới</p>
                <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="form-row two">
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
                                    placeholder="Tên đường, hẻm, số nhà,..."
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

                    <div className="action-cancel-submit">
                        <button type="button" className="btn btn-border" onClick={closeModal}>Huỷ</button>
                        <button type="submit" className="btn btn-green">Lưu</button>
                    </div>
                </form>
            </div >
        </Modal >
    )
}


export default PopupAddress

