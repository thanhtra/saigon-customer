import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { formatDate, getCateOption } from 'lib/utils/index';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        border: 'none',
        borderRadius: '10px',
        boxShadow: 'rgb(100 100 111 / 20%) 0px 7px 29px 0px',
        overflow: 'auto'
    },
}

const PopupContact = ({ isShow, hideModal, contact }) => {
    const [phone, setPhone] = useState('');
    const [zalo, setZalo] = useState('');
    const [phone_user, setPhoneUser] = useState('');
    const [zalo_user, setZaloUser] = useState('');

    const { collaborator, room, user } = contact || {};

    useEffect(() => {
        if (collaborator && collaborator?.phone) {
            setPhone('tel://' + collaborator.phone);
        }

        if (collaborator && collaborator?.zalo) {
            setZalo('https://zalo.me/' + collaborator.zalo);
        }
    }, [JSON.stringify(collaborator || {})]);

    useEffect(() => {
        if (user && user?.phone) {
            setPhoneUser('tel://' + user.phone);
        }

        if (user && user?.phone) {
            setZaloUser('https://zalo.me/' + user.phone);
        }
    }, [JSON.stringify(user || {})]);


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
            <div className="popup-contact">
                <p className='title'>Thông tin người bán</p>
                <div className='close'>
                    <i className="icon-cancel" onClick={closeModal}></i>
                </div>
                <div className='item name'><p className='c-label'>{collaborator?.gender ? (collaborator?.gender === "Nam" ? 'Anh' : 'Chị') : 'Anh, chị'}</p> {collaborator?.name} {collaborator?.age && <p className='age'>{collaborator?.age} tuổi</p>}</div>
                <div className='item'><p className='c-label'>Địa chỉ:</p><p className='c-value'>{collaborator?.address}</p></div>
                <div className='item'><p className='c-label'>Ngày tạo:</p>{formatDate(collaborator?.createdAt)}</div>
                <div className='item'><p className='c-label'>Lĩnh vực:</p>{getCateOption(collaborator?.field_cooperation)}</div>
                <div className='item'><p className='c-label'>Vị trí:</p>{collaborator?.position}</div>
                <div className='item'><p className='c-label'>Mô tả:</p>{collaborator?.description}</div>
                <div className='item commission'><p className='c-label'>Hoa hồng:</p>{room?.commission}</div>

                <div className='p-contact-action'>
                    {collaborator?.zalo && <a className="btn btn_call btn_zalo" target="_blank" href={zalo}>
                        Zalo
                    </a>}

                    {collaborator?.phone && <a className="btn btn-green btn_call" href={phone}>
                        Bấm gọi
                    </a>}

                    {collaborator?.link_facebook && <a className="btn btn-green btn_facebook" target="_blank" href={collaborator?.link_facebook}>
                        Xem facebook
                    </a>}
                </div>


                <p className='title'>Thông tin tài khoản đăng tin</p>
                <div className='p-contact-action infor-account'>
                    <div className='item name'><p className='c-label'>{user?.gender ? (user?.gender === "Nam" ? 'Anh' : 'Chị') : 'Anh, chị'}</p> {user?.name}</div>
                    {user?.phone && <a className="btn btn_call btn_zalo" target="_blank" href={zalo_user}>
                        Zalo
                    </a>}

                    {user?.phone && <a className="btn btn-green btn_call" href={phone_user}>
                        Bấm gọi
                    </a>}
                </div>
            </div >
        </Modal >
    )
}


export default PopupContact

