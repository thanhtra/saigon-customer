'use client';

import { useCallback, useMemo, useState } from 'react';
import { formatDate } from 'lib/utils/index';
import { CopyIcon, ShareIcon, PhoneIcon, ZaloIcon } from 'lib/utils/icon';

const PHONE_NUMBER = '0968922006';

const isMobileDevice = () =>
    typeof window !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function RoomActions({
    roomCode,
    updatedAt,
    title = 'Thông tin phòng',
}) {
    const [copied, setCopied] = useState(false);
    const isMobile = useMemo(isMobileDevice, []);

    /* ===== COPY ROOM CODE ===== */
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [roomCode]);

    /* ===== SHARE ===== */
    const handleShare = useCallback(() => {
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title,
                text: title,
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Đã sao chép link phòng');
        }
    }, [title]);

    return (
        <div className="room-actions">
            <span className="room-updated">
                Cập nhật: {formatDate(updatedAt)}
            </span>

            {/* ===== ROOM CODE ===== */}
            <div className="room-code">
                <span>Mã phòng:</span>
                <b>{roomCode}</b>

                <button
                    className="icon-btn"
                    onClick={handleCopy}
                    aria-label="Sao chép mã phòng"
                >
                    <CopyIcon />
                    {copied && <span className="tooltip">Đã sao chép</span>}
                </button>
            </div>

            {/* ===== SHARE ===== */}
            <button className="action-btn" onClick={handleShare}>
                <ShareIcon />
                <span className="label">Chia sẻ</span>
            </button>

            {/* ===== CALL ===== */}
            {isMobile ? (
                <a href={`tel:${PHONE_NUMBER}`} className="action-btn call">
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
        </div>
    );
}
