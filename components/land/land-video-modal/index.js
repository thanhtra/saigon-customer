import { useEffect, useMemo } from 'react';
import Portal from 'components/common/portal';

/* ================= HELPERS ================= */
function getYouTubeEmbedUrl(url) {
    if (!url) return null;

    // Shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
    if (shortsMatch) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // Watch + youtu.be
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/,
    );

    return match
        ? `https://www.youtube.com/embed/${match[1]}`
        : null;
}

/* ================= COMPONENT ================= */
export default function LandVideoModal({
    open,
    onClose,
    videoUrl,
    title,
}) {
    const youtubeEmbedUrl = useMemo(
        () => getYouTubeEmbedUrl(videoUrl),
        [videoUrl],
    );

    /* Lock scroll */
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    /* ESC close */
    useEffect(() => {
        if (!open) return;
        const onEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <Portal>
            <div
                className="video-modal-backdrop"
                onMouseDown={(e) =>
                    e.target === e.currentTarget && onClose()
                }
            >
                <div
                    className="video-modal"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {/* ===== HEADER ===== */}
                    <div className="video-modal-header">
                        <h3 className="video-modal-title" title={title}>
                            {title}
                        </h3>
                        <button
                            className="video-close"
                            onClick={onClose}
                            aria-label="Đóng"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>

                    {/* ===== VIDEO ===== */}
                    <div className="video-modal-body">
                        {youtubeEmbedUrl && (
                            <iframe
                                src={`${youtubeEmbedUrl}?playsinline=1&rel=0`}
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
