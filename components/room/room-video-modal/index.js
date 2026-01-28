import { useEffect, useMemo, useState } from 'react';
import Portal from 'components/common/portal';
import { getEmbedUrl } from 'lib/utils';

export default function RoomVideoModal({ open, onClose, videoUrl }) {
    const [loading, setLoading] = useState(true);
    const [embedHtml, setEmbedHtml] = useState(null);

    const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);
    const isTikTok = videoUrl && videoUrl.includes('tiktok.com');

    /* ================= LOCK SCROLL ================= */
    useEffect(() => {
        if (!open) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setLoading(true);

        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    /* ================= ESC CLOSE ================= */
    useEffect(() => {
        if (!open) return;

        const onEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onClose]);

    /* ================= LOAD TIKTOK OEMBED ================= */
    useEffect(() => {
        if (!open || !videoUrl) return;

        if (!isTikTok) {
            setEmbedHtml(null);
            return;
        }

        const loadTikTok = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
                );
                const data = await res.json();

                setEmbedHtml(data.html);
            } catch (err) {
                console.error('TikTok embed error:', err);
                setEmbedHtml(null);
            } finally {
                setLoading(false);
            }
        };

        loadTikTok();
    }, [open, videoUrl, isTikTok]);

    if (!open) return null;

    return (
        <Portal>
            <div className="video-modal-backdrop" onClick={onClose}>
                <div
                    className="video-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="video-close"
                        onClick={onClose}
                        aria-label="Đóng"
                        type="button"
                    >
                        ✕
                    </button>

                    <div className="video-wrapper">
                        {loading && (
                            <div className="video-loading">
                                <div className="video-loading-spinner" />
                                <p>Đang tải video...</p>
                            </div>
                        )}

                        {/* ===== TIKTOK ===== */}
                        {embedHtml ? (
                            <div
                                className="tiktok-embed-wrapper"
                                dangerouslySetInnerHTML={{ __html: embedHtml }}
                            />
                        ) : (
                            /* ===== OTHER (YouTube, etc) ===== */
                            <iframe
                                src={embedUrl}
                                title="Video phòng"
                                frameBorder="0"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setLoading(false)}
                            />
                        )}

                        <div className="iframe-click-shield" />
                    </div>
                </div>
            </div>
        </Portal>
    );
}
