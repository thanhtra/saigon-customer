
import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-room';
import RoomContent from 'components/room/room-content';
import Description from 'components/room/room-description';
import RoomGallery from 'components/room/room-gallery';
import { getContact, getRoomDetail } from 'lib/api/room.api';
import { PageUrl, UserRole } from 'lib/constants/tech';
import { formatOtherFee, formatVnd } from 'lib/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import RoomActionsDetail from 'components/common/room-actions-detail';

import { WaterUnitOptions } from 'lib/constants/data';

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
    const [copying, setCopying] = useState(false);

    const isAdmin = user?.role === UserRole.Admin;
    const isSales = user?.role === UserRole.Sale;

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

    const htmlToText = (html = '') => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const buildSalesContent = () => {
        const cleanDescription = htmlToText(room.description);

        const rental = room?.rental || {};

        const waterFee =
            rental.fee_water > 0
                ? `💧 Nước: ${formatVnd(rental.fee_water, { suffix: null })}${rental.water_unit
                    ? ` ${WaterUnitOptions[rental.water_unit] || ''}`
                    : ''
                }`
                : null;

        const lines = [
            `🏠 ${room.title} (${room.room_code})`,
            room.room_number ? `🆔 Phòng: ${room.room_number}` : null,

            '',
            `📍 ${rental.address_detail_display || ''}`,
            '',
            `💰 Giá: ${formatVnd(room.price)}/tháng`,

            room.max_people ? `👥 ${room.max_people} người` : null,
            room.area ? `📐 ${room.area} m²` : null,

            '',
            '------------------------------',
            '💵 CHI PHÍ',

            rental.fee_electric
                ? `⚡ Điện: ${formatVnd(rental.fee_electric)}`
                : null,

            waterFee,

            rental.fee_wifi
                ? `📶 Wifi: ${formatVnd(rental.fee_wifi)}`
                : null,

            rental.fee_parking
                ? `🛵 Giữ xe: ${formatVnd(rental.fee_parking)}`
                : null,

            rental.fee_service
                ? `🧹 Dịch vụ: ${formatVnd(rental.fee_service)}`
                : null,

            rental.fee_other
                ? `📦 Phí khác: ${formatOtherFee(rental.fee_other)}`
                : null,

            '',
            '------------------------------',
            '📝 MÔ TẢ',
            cleanDescription,


            '',
            '------------------------------',
            '📞 LIÊN HỆ',
            `👤 ${user?.name ?? ''}`,
            `📱 ${user?.phone ?? ''}`,
        ];

        return lines.filter(Boolean).join('\n');
    };

    const handleCopySalesInfo = async () => {
        try {
            setCopying(true);

            const content = buildSalesContent();
            await navigator.clipboard.writeText(content);

            toast.success('Đã copy nội dung đăng bài');
        } catch {
            toast.error('Copy thất bại');
        } finally {
            setCopying(false);
        }
    };

    const downloadImage = async (url, filename) => {
        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit',
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(blobUrl);
    };

    const downloadAllImages = async () => {
        try {
            const uploads = room?.uploads || [];

            if (!uploads.length) {
                toast.error('Không có hình');
                return;
            }

            const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;

            for (const [index, img] of uploads.entries()) {
                const url = `${baseUrl}${img.file_path}`;

                const filename =
                    `${room.room_code || 'room'}-${index + 1}.jpg`;

                await downloadImage(url, filename);

                // tránh browser block multi-download
                await new Promise((r) => setTimeout(r, 250));
            }

            toast.success('Đã tải toàn bộ hình');
        } catch (err) {
            console.error(err);
            toast.error('Tải hình thất bại');
        }
    };



    return (
        <>
            {/* <SeoHead
                title={title}
                description={description}
                image={ogImage}
                url={url}
                type="article"
            /> */}

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

                        {(isAdmin || isSales) && (
                            <div className="admin-contact-box">
                                <button
                                    type="button"
                                    className={`btn btn-contact-owner ${copying ? 'is-loading' : ''
                                        }`}
                                    onClick={handleCopySalesInfo}
                                    disabled={copying}
                                >
                                    {copying ? 'Đang copy...' : '📋 Copy thông tin'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-contact-owner"
                                    onClick={downloadAllImages}
                                >
                                    ⬇️ Tải hình
                                </button>
                            </div>
                        )}

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
