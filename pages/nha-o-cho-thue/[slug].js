'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-room';
import RoomContent from 'components/room/room-content';
import Description from 'components/room/room-description';
import RoomGallery from 'components/room/room-gallery';

import { getRoomDetail, getContact } from 'lib/api/room.api';
import { PageUrl } from 'lib/constants/tech';
import { UserRole } from 'lib/constants/tech';
import {
    POPUP_ADD_ADDRESS_HIDE,
    POPUP_ADD_ADDRESS_OPEN,
} from 'lib/store/type/common-type';

import RoomActionsDetail from 'components/common/room-actions-detail';

/* ======================================================
 * SSR
 * ====================================================== */
export async function getServerSideProps({ params }) {
    try {
        const { slug } = params;
        const res = await getRoomDetail(slug);

        if (!res?.success || !res?.result) {
            return { notFound: true };
        }

        return {
            props: {
                room: res.result,
            },
        };
    } catch {
        return { notFound: true };
    }
}

/* ======================================================
 * PAGE
 * ====================================================== */
const RoomDetailPage = ({ room }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const [isContactOpen, setIsContactOpen] = useState(false);
    const [loadingContact, setLoadingContact] = useState(false);
    const [contact, setContact] = useState(null);

    const isAdmin = user?.role === UserRole.Admin


    /* ===============================
     * SIDE EFFECT
     * =============================== */
    useEffect(() => {
        if (!isContactOpen) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }, [isContactOpen, dispatch]);

    /* ===============================
     * HANDLERS
     * =============================== */
    const openContactModal = useCallback(async () => {
        if (!room?.id || loadingContact) return;

        try {
            setLoadingContact(true);

            const res = await getContact(room.id);
            if (!res?.success) throw new Error();

            setContact(res.result);
            setIsContactOpen(true);
            dispatch({ type: POPUP_ADD_ADDRESS_OPEN });
        } catch {
            toast.error('Không lấy được thông tin liên hệ');
        } finally {
            setLoadingContact(false);
        }
    }, [room?.id, loadingContact, dispatch]);

    const closeContactModal = useCallback(() => {
        setIsContactOpen(false);
        dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
    }, [dispatch]);

    /* ===============================
     * RENDER
     * =============================== */
    return (
        <section className="container room-detail-page">
            <Breadcrumb menu={PageUrl.Rooms} title={room.title} />

            {/* ===== MAIN GRID ===== */}
            <div className="room-detail-grid">
                {/* LEFT */}
                <div className="room-detail-left">
                    <RoomGallery
                        images={room.uploads || []}
                        room
                    />

                    <div className="room-section">
                        <h3 className="section-title">Mô tả chi tiết</h3>
                        <Description room={room} />
                    </div>
                </div>

                {/* RIGHT */}
                <aside className="room-detail-right">
                    <RoomContent room={room} />

                    <RoomActionsDetail
                        roomId={room.id}
                        rentalId={room?.rental?.id}
                        roomCode={room?.room_code}
                        title={room?.title}
                        address={room?.rental?.address_detail_display}
                        updatedAt={room?.updatedAt}
                    />
                </aside>
            </div>


            <PopupContact
                isShow={isContactOpen}
                hideModal={closeContactModal}
                contact={contact}
            />
        </section>

    );
};

export default RoomDetailPage;
