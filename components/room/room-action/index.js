'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    CopyIcon,
    ShareIcon,
    PhoneIcon,
    ZaloIcon,
    CalendarIcon,
} from 'lib/utils/icon';

import BookingModal from 'components/room/booking-model';
import RegisterAfterBookingModal from 'components/room/register-after-booking-modal';
import { toast } from 'react-toastify';
import RoomVideoModal from 'components/room/room-video-modal';

import { PageUrl } from 'lib/constants/tech';

const PHONE_NUMBER = '0968922006';

export default function RoomActions({
    roomId,
    rentalId,
    roomCode,
    updatedAt,
    slug,
    videoUrl,
    title = 'Thông tin phòng',
    address = 'Địa chỉ'
}) {
    const [copied, setCopied] = useState(false);
    const [openBooking, setOpenBooking] = useState(false);
    const [registerPrefill, setRegisterPrefill] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);


    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Không thể sao chép mã phòng');
        }
    }, [roomCode]);

    const handleShare = useCallback(async () => {
        try {
            const origin = window.location.origin;
            const detailUrl = `${origin}${PageUrl.Rental}/${slug}`;

            if (navigator.share) {
                await navigator.share({
                    title,
                    text: title,
                    url: detailUrl,
                });
            } else {
                await navigator.clipboard.writeText(detailUrl);
                toast.success('Đã sao chép link phòng');
            }
        } catch (error) {
            // toast.error('Không thể chia sẻ liên kết');
        }
    }, [slug, title]);


    return (
        <>
            <div className="room-actions">
                <div className="room-code" onClick={handleCopy}>
                    <span>Mã: {roomCode} </span>
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label="Sao chép mã phòng"
                    >
                        <CopyIcon />
                        {copied && <span className="tooltip">Đã sao chép</span>}
                    </button>
                </div>

                <button
                    type="button"
                    className="action-btn"
                    onClick={handleShare}
                >
                    <ShareIcon />
                    <span className="label">Chia sẻ</span>
                </button>

                {videoUrl && <button
                    type="button"
                    className="action-btn video"
                    onClick={() => setOpenVideo(true)}
                >
                    ▶️
                    <span className="label">Xem video</span>
                </button>}

                <div className='action-btn-inline'>
                    {isMobile &&
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            className="action-btn call"
                        >
                            <PhoneIcon />
                            <span className="label">Gọi</span>
                        </a>
                    }

                    <a
                        href={`https://zalo.me/${PHONE_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn zalo"
                    >
                        <ZaloIcon />
                        <span className="label">{isMobile ? 'Zalo' : PHONE_NUMBER}</span>
                    </a>
                </div>


                <button
                    type="button"
                    className="action-btn booking"
                    onClick={() => setOpenBooking(true)}
                >
                    <CalendarIcon />
                    <span className="label">Đặt lịch</span>
                </button>

            </div>

            <BookingModal
                open={openBooking}
                roomId={roomId}
                rentalId={rentalId}
                title={title}
                address={address}
                onClose={() => setOpenBooking(false)}
                onRequireRegister={(prefill) => {
                    setOpenBooking(false);
                    setRegisterPrefill(prefill);
                }}
            />

            <RegisterAfterBookingModal
                open={!!registerPrefill}
                prefill={registerPrefill}
                onClose={() => setRegisterPrefill(null)}
            />

            {videoUrl && <RoomVideoModal
                open={openVideo}
                onClose={() => setOpenVideo(false)}
                videoUrl={videoUrl}
            />}

        </>
    );
}
