import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { formatDate, getCateOption } from 'lib/utils/index';
import { formatCurrency } from 'lib/utils';


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

const PopupContactProduct = ({ isShow, hideModal, contact, product }) => {
    const [phone, setPhone] = useState('');
    const [zalo, setZalo] = useState('');
    const [packs, setPacks] = useState([]);

    useEffect(() => {
        if (contact && contact?.phone) {
            setPhone('tel://' + contact.phone);
        }

        if (contact && contact?.zalo) {
            setZalo('https://zalo.me/' + contact.zalo);
        }
    }, [JSON.stringify(contact || {})]);

    useEffect(() => {
        if (product && product?.packs) {
            const a = JSON.parse(product.packs) || [];
            setPacks(a);
        }
    }, [JSON.stringify(product || {})]);


    const closeModal = () => {
        if (hideModal) {
            hideModal();
        }
    }

    return (
        <Modal isOpen={isShow}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <div className="popup-contact">
                <p className='title'>Thông tin người bán sỉ</p>
                <div className='close'>
                    <i className="icon-cancel" onClick={closeModal}></i>
                </div>
                <div className='item name'><p className='c-label'>{contact?.gender ? (contact?.gender === "Nam" ? 'Anh' : 'Chị') : 'Anh, chị'}</p> {contact?.name} {contact?.age && <p className='age'>{contact?.age} tuổi</p>}</div>
                <div className='item'><p className='c-label'>Địa chỉ:</p><p className='c-value'>{contact?.address}</p></div>
                <div className='item'><p className='c-label'>Ngày tạo:</p>{formatDate(contact?.createdAt)}</div>
                <div className='item'><p className='c-label'>Lĩnh vực:</p>{getCateOption(contact?.field_cooperation)}</div>
                <div className='item'><p className='c-label'>Mô tả:</p>{contact?.description}</div>
                <div className='item'><p className='c-label'>Ngày tạo sản phẩm:</p>{formatDate(product?.createdAt)}</div>
                <div className='item'><p className='c-label'>Lưu ý:</p>{product?.note}</div>

                <div className='item commission'><p className='c-label'>Giá bán:</p>
                </div>
                <div className='item p-info'>
                    {packs && packs.map(item => <div className='p-item'>
                        {item.name}: <span className='p-i-p-o'>{formatCurrency.format(Number(item?.price_origin || 0))}</span> -  <span className='p-i-p'>{formatCurrency.format(Number(item?.price || 0))}</span>
                    </div>)}
                </div>

                <div className='p-contact-action'>
                    {contact?.zalo && <a className="btn btn_call btn_zalo" target="_blank" href={zalo}>
                        Zalo
                    </a>}

                    {contact?.phone && <a className="btn btn-green btn_call" href={phone}>
                        Bấm gọi
                    </a>}

                    {contact?.link_facebook && <a className="btn btn-green btn_facebook" target="_blank" href={contact?.link_facebook}>
                        Xem facebook
                    </a>}
                </div>
            </div >
        </Modal >
    )
}


export default PopupContactProduct

