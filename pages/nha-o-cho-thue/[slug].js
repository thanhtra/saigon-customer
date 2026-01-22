'use client';

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-room';
import RoomContent from 'components/room/room-content';
import Description from 'components/room/room-description';
import RoomGallery from 'components/room/room-gallery';
import { getContact, getRoomDetail } from 'lib/api/room.api';
import { PageUrl, UserRole } from 'lib/constants/tech';
import { formatVnd } from 'lib/utils';
import Head from 'next/head';

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


    const title = `${room.title} - ${formatVnd(room.price) || ''}`;
    const description =
        room.description_short ||
        `Cho thuê ${room.title}, ${room?.rental?.address_detail_display}. Giá tốt, pháp lý rõ ràng.`;
    const bkUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;
    const filePath = room?.uploads?.[room.cover_index]?.file_path;

    const ogImage = filePath ?
        `${bkUrl}/${filePath}` :
        'https://tratimnha.com/images/intro/phong-tro-sai-gon.jpg';

    return (
        <>
            <Head>
                {/* ===== BASIC SEO ===== */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`https://tratimnha.com/nha-o-cho-thue/${room.slug}`} />

                {/* ===== OPEN GRAPH ===== */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:url" content={`https://tratimnha.com/nha-o-cho-thue/${room.slug}`} />
                <meta property="og:site_name" content="Thuê phòng giá tốt" />
            </Head>


            <section className="container room-detail-page">
                <Breadcrumb menu={PageUrl.Rooms} title={room.title} />

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
