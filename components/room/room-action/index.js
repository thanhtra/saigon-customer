'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDate } from 'lib/utils';
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

const PHONE_NUMBER = '0968922006';

export default function RoomActions({
    roomId,
    roomCode,
    updatedAt,
    title = 'Thông tin phòng',
}) {
    const [copied, setCopied] = useState(false);
    const [openBooking, setOpenBooking] = useState(false);
    const [registerPrefill, setRegisterPrefill] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    /* ===== DETECT MOBILE ===== */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    /* ===== COPY ROOM CODE ===== */
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Không thể sao chép mã phòng');
        }
    }, [roomCode]);

    /* ===== SHARE ===== */
    const handleShare = useCallback(async () => {
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({ title, text: title, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Đã sao chép link phòng');
            }
        } catch {
            toast.error('Không thể chia sẻ liên kết');
        }
    }, [title]);

    return (
        <>
            <div className="room-actions">
                <span className="room-updated">
                    Cập nhật: {formatDate(updatedAt)}
                </span>

                {/* ===== ROOM CODE ===== */}
                <div className="room-code" onClick={handleCopy}>
                    <span>Mã phòng:</span>
                    <b>{roomCode}</b>

                    <button
                        type="button"
                        className="icon-btn"
                        aria-label="Sao chép mã phòng"
                    >
                        <CopyIcon />
                        {copied && <span className="tooltip">Đã sao chép</span>}
                    </button>
                </div>

                {/* ===== SHARE ===== */}
                <button
                    type="button"
                    className="action-btn"
                    onClick={handleShare}
                >
                    <ShareIcon />
                    <span className="label">Chia sẻ</span>
                </button>

                {/* ===== CALL ===== */}
                {isMobile ? (
                    <a
                        href={`tel:${PHONE_NUMBER}`}
                        className="action-btn call"
                    >
                        <PhoneIcon />
                        <span className="label">Gọi</span>
                    </a>
                ) : (
                    <div className="action-btn call disabled">
                        <PhoneIcon />
                        <span className="label">{PHONE_NUMBER}</span>
                    </div>
                )}

                {/* ===== ZALO ===== */}
                <a
                    href={`https://zalo.me/${PHONE_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn zalo"
                >
                    <ZaloIcon />
                    <span className="label">Zalo</span>
                </a>

                {/* ===== BOOKING ===== */}
                <button
                    type="button"
                    className="action-btn booking"
                    onClick={() => setOpenBooking(true)}
                >
                    <CalendarIcon />
                    <span className="label">Đặt lịch</span>
                </button>
            </div>

            {/* ===== BOOKING MODAL ===== */}
            <BookingModal
                open={openBooking}
                roomId={roomId}
                onClose={() => setOpenBooking(false)}
                onRequireRegister={(prefill) => {
                    setOpenBooking(false);
                    setRegisterPrefill(prefill);
                }}
            />

            {/* ===== REGISTER AFTER BOOKING ===== */}
            <RegisterAfterBookingModal
                open={!!registerPrefill}
                prefill={registerPrefill}
                onClose={() => setRegisterPrefill(null)}
            />
        </>
    );
}
