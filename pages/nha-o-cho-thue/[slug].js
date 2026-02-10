
import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-room';
import SeoHead from 'components/common/seo-head';
import RoomContent from 'components/room/room-content';
import Description from 'components/room/room-description';
import RoomGallery from 'components/room/room-gallery';
import { getContact, getRoomDetail } from 'lib/api/room.api';
import { PageUrl, UserRole } from 'lib/constants/tech';
import { formatVnd } from 'lib/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import RoomActionsDetail from 'components/common/room-actions-detail';

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

const RoomDetailPage = ({ room }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const [isContactOpen, setIsContactOpen] = useState(false);
    const [loadingContact, setLoadingContact] = useState(false);
    const [contact, setContact] = useState(null);

    const isAdmin = user?.role === UserRole.Admin

    const closeContactModal = useCallback(() => {
        setIsContactOpen(false);
    }, []);

    const openContactModal = useCallback(async () => {
        const rentalId = room?.rental?.id;
        if (!rentalId || loadingContact) return;

        try {
            setLoadingContact(true);

            const res = await getContact(rentalId);

            if (!res?.success) throw new Error();


            setContact(res.result);
            setIsContactOpen(true);
        } catch {
            toast.error('Không lấy được thông tin liên hệ');
        } finally {
            setLoadingContact(false);
        }
    }, [room?.id, loadingContact, contact, dispatch]);

    const coverImage = room?.uploads?.find(upload => upload.is_cover);
    const title = `${room.title} - ${formatVnd(room.price)}`;
    const description = `${room.title}, ${room?.rental?.address_detail_display}. Giá tốt, pháp lý rõ ràng.`;
    const bkUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;
    const filePath = coverImage?.file_path;
    const ogImage = filePath ? `${bkUrl}${filePath}` : 'https://tratimnha.com/og/room.jpg';
    const url = `https://tratimnha.com/nha-o-cho-thue/${room.slug}`;

    return (
        <>
            <SeoHead
                title={title}
                description={description}
                image={ogImage}
                url={url}
                type="article"
            />

            <section className="container room-detail-page">
                <Breadcrumb menu={PageUrl.Rental} title={room.title} />

                <div className="room-detail-grid">
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

                    <aside className="room-detail-right">
                        <RoomContent room={room} />

                        <RoomActionsDetail
                            roomId={room.id}
                            rentalId={room?.rental?.id}
                            roomCode={room?.room_code}
                            title={room?.title}
                            address={room?.rental?.address_detail_display}
                            updatedAt={room?.updatedAt}
                            videoUrl={room?.video_url}
                        />

                        {isAdmin && (
                            <div className="admin-contact-box">
                                <button
                                    type="button"
                                    className={`btn btn-contact-owner ${loadingContact ? 'is-loading' : ''}`}
                                    onClick={openContactModal}
                                    disabled={loadingContact}
                                >
                                    {loadingContact ? 'Đang tải...' : 'Thông tin'}
                                </button>
                            </div>
                        )}

                    </aside>
                </div>


                <PopupContact
                    isShow={isContactOpen}
                    hideModal={closeContactModal}
                    contact={contact}
                />
            </section>
        </>
    );
};

export default RoomDetailPage;
