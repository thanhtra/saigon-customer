import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-room';
import RoomContent from 'components/room/room-content';
import Description from 'components/room/room-description';
import RoomGallery from 'components/room/room-gallery';
import { getContact } from 'lib/api/room.service';
import { getRoomDetail } from 'lib/api/room.service';
import { PageUrl } from 'lib/constants/tech';
import { POPUP_ADD_ADDRESS_HIDE, POPUP_ADD_ADDRESS_OPEN } from 'lib/store/type/common-type';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const res = await getRoomDetail(slug);

    return {
        props: {
            room: res?.result || {}
        },
    }
}

const Room = ({ room }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { isPopupAddAddressOpen } = useSelector(state => state.commons)
    const [openModal, setOpenModal] = useState(false);
    const [contact, setContact] = useState({});


    useEffect(() => {
        if (!openModal) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }, openModal);

    const openModalHandle = async () => {
        try {
            if (room && room?.id) {
                const res = await getContact(room.id);
                if (res && res?.success) {
                    setContact(res.result);
                    setOpenModal(true);
                    dispatch({ type: POPUP_ADD_ADDRESS_OPEN });
                } else {
                    toast.error('Lấy thông tin thất bại')
                }
            }
        } catch (error) {
            toast.error('Lấy thông tin thất bại')
        }

    }

    const closeModalContact = () => {
        setOpenModal(false);

        if (isPopupAddAddressOpen) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }

    return (
        <>
            <section className="container room-detail-page">
                <Breadcrumb menu={PageUrl.Rooms} title={room?.title} />

                <div className="room-single-content">
                    <RoomGallery images={room?.uploads} />
                    <RoomContent room={room} />
                </div>

                <div className="room-single-info">
                    <p className='title-description-detail'>Mô tả chi tiết</p>

                    <Description room={room} />

                    {user && user?.role === 'Admin_ViRung_DakNong' && room?.collaborator_id && < div className="group-btn infor-contact">
                        <button type="button" className="btn btn-border" onClick={openModalHandle}>Thông tin</button>
                    </div>}
                </div>

                <PopupContact isShow={openModal} hideModal={closeModalContact} contact={contact} />
            </section >
        </>
    )
}

export default Room
