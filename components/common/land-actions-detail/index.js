
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import LandVideoModal from 'components/land/land-video-modal';

const PHONE_NUMBER = '0968922006';
const ZALO_NUMBER = '0968922006';

const LandActionsDetail = ({
    landId,
    rentalId,
    landCode,
    title,
    address,
    videoUrl,
}) => {
    const [copied, setCopied] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    const copyLandCode = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(landCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Không thể sao chép mã phòng');
        }
    }, [landCode]);

    const handleShare = useCallback(async () => {
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({ title, text: title, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Đã sao chép link nhà');
            }
        } catch {
            // toast.error('Không thể chia sẻ liên kết');
        }
    }, [title]);

    return (
        <>
            <section className="land-actions-detail">
                <div className="land-code-box">
                    <span className="label">Mã động sản</span>
                    <button
                        type="button"
                        className="land-code"
                        onClick={copyLandCode}
                    >
                        {landCode}
                    </button>
                    {copied && <span className="copied">Đã copy</span>}
                </div>

                <div className="actions">
                    <button
                        type="button"
                        className="action-btn share"
                        onClick={handleShare}
                    >
                        🔗 Chia sẻ
                    </button>

                    {videoUrl && (
                        <button
                            type="button"
                            className="action-btn video"
                            onClick={() => setOpenVideo(true)}
                        >
                            ▶️ Xem video
                        </button>
                    )}

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

                    <a
                        href={`https://zalo.me/${ZALO_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn zalo"
                    >
                        💬 Zalo
                    </a>
                </div>
            </section>

            {videoUrl && (
                <LandVideoModal
                    open={openVideo}
                    onClose={() => setOpenVideo(false)}
                    videoUrl={videoUrl}
                    title={title}
                />
            )}
        </>
    );
};

export default LandActionsDetail;
