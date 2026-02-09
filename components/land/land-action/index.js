
import {
    CopyIcon,
    PhoneIcon,
    ShareIcon,
    ZaloIcon
} from 'lib/utils/icon';
import { useCallback, useEffect, useState } from 'react';

import LandVideoModal from 'components/land/land-video-modal';
import { toast } from 'react-toastify';

import { PageUrl } from 'lib/constants/tech';

const PHONE_NUMBER = '0968922006';

export default function LandActions({
    landId,
    landCode,
    slug,
    videoUrl,
    title = 'Thông tin nhà',
    address = 'Địa chỉ'
}) {
    const [copied, setCopied] = useState(false);
    const [registerPrefill, setRegisterPrefill] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);


    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(landCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Không thể sao chép mã phòng');
        }
    }, [landCode]);

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
            <div className="land-actions">
                <div className="land-code" onClick={handleCopy}>
                    <span>Mã: {landCode} </span>
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
            </div>

            {videoUrl && <LandVideoModal
                open={openVideo}
                onClose={() => setOpenVideo(false)}
                videoUrl={videoUrl}
                title={title}
            />}

        </>
    );
}
