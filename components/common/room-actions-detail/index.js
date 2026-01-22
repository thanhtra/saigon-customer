'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import BookingModal from 'components/room/booking-model';
import RegisterAfterBookingModal from 'components/room/register-after-booking-modal';
import RoomVideoModal from 'components/room/room-video-modal';

const PHONE_NUMBER = '0968922006';
const ZALO_NUMBER = '0968922006';

const RoomActionsDetail = ({
    roomId,
    rentalId,
    roomCode,
    title,
    address,
    updatedAt,
    videoUrl,
}) => {
    const [copied, setCopied] = useState(false);
    const [openBooking, setOpenBooking] = useState(false);
    const [registerPrefill, setRegisterPrefill] = useState(null);
    const [openVideo, setOpenVideo] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    /* ===============================
     * HANDLERS
     * =============================== */
    const copyRoomCode = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Không thể sao chép mã phòng');
        }
    }, [roomCode]);

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
            // toast.error('Không thể chia sẻ liên kết');
        }
    }, [title]);

    return (
        <>
            <section className="room-actions-detail">
                {/* ===== ROOM CODE ===== */}
                <div className="room-code-box">
                    <span className="label">Mã phòng</span>
                    <button
                        type="button"
                        className="room-code"
                        onClick={copyRoomCode}
                    >
                        {roomCode}
                    </button>
                    {copied && <span className="copied">Đã copy</span>}
                </div>

                {/* ===== ACTIONS ===== */}
                <div className="actions">
                    {/* SHARE */}
                    <button
                        type="button"
                        className="action-btn share"
                        onClick={handleShare}
                    >
                        🔗 Chia sẻ
                    </button>

                    {/* VIDEO */}
                    {videoUrl && (
                        <button
                            type="button"
                            className="action-btn video"
                            onClick={() => setOpenVideo(true)}
                        >
                            ▶️ Xem video
                        </button>
                    )}

                    {/* CALL */}
                    {isMobile ? (
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            className="action-btn call"
                        >
                            📞 Gọi ngay
                        </a>
                    ) : (
                        <div className="action-btn call disabled">
                            📞 {PHONE_NUMBER}
                        </div>
                    )}

                    {/* ZALO */}
                    <a
                        href={`https://zalo.me/${ZALO_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn zalo"
                    >
                        💬 Zalo
                    </a>

                    {/* BOOKING */}
                    <button
                        type="button"
                        className="action-btn booking"
                        onClick={() => setOpenBooking(true)}
                    >
                        📅 Đặt lịch
                    </button>

                    {/* SAVE */}
                    {/* <button
                        type="button"
                        className="action-btn save"
                    >
                        ❤️ Lưu phòng
                    </button> */}
                </div>
            </section>

            {/* ===== MODALS ===== */}
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

            {videoUrl && (
                <RoomVideoModal
                    open={openVideo}
                    onClose={() => setOpenVideo(false)}
                    videoUrl={videoUrl}
                />
            )}
        </>
    );
};

export default RoomActionsDetail;
