import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-land';
import LandContent from 'components/land/land-content';
import Description from 'components/land/land-description';
import LandGallery from 'components/land/land-gallery';
import { getContact, getLandDetail } from 'lib/api/land.service';
import { PageUrl } from 'lib/constants/tech';
import { POPUP_ADD_ADDRESS_HIDE, POPUP_ADD_ADDRESS_OPEN } from 'lib/store/type/common-type';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export async function getServerSideProps({ params }) {
    const { bid } = params;
    const res = await getLandDetail(bid);

    return {
        props: {
            land: res?.result || {}
        },
    }
}

const Land = ({ land }) => {
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
            if (land && land?.id) {
                const res = await getContact(land.id);
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
            <section className="container land-detail-page">
                <Breadcrumb menu={PageUrl.Lands} title={land?.title} />

                <div className="land-single-content">
                    <LandGallery images={land?.images} />
                    <LandContent land={land} />
                </div>

                <div className="land-single-info">
                    <p className='title-description-detail'>Mô tả chi tiết</p>

                    <Description land={land} />

                    {user && user?.role === 'Admin_ViRung_DakNong' && land?.collaborator_id && < div className="group-btn infor-contact">
                        <button type="button" className="btn btn-border" onClick={openModalHandle}>Thông tin</button>
                    </div>}
                </div>

                <PopupContact isShow={openModal} hideModal={closeModalContact} contact={contact} />
            </section >
        </>
    )
}

export default Land
