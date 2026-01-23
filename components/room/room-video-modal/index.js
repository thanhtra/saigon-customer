'use client';

import { useEffect, useMemo, useState } from 'react';
import Portal from 'components/common/portal';
import { getEmbedUrl } from 'lib/utils/index';

export default function RoomVideoModal({ open, onClose, videoUrl }) {
    const [loading, setLoading] = useState(true);

    const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

    useEffect(() => {
        if (!open) return;

        // lock scroll body
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        setLoading(true);

        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <Portal>
            <div className="video-modal-backdrop" onClick={onClose}>
                <div className="video-modal" onClick={(e) => e.stopPropagation()}>

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

                        <iframe
                            src={embedUrl}
                            title="Video phòng"
                            frameBorder="0"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setLoading(false)}
                        />

                        {/* 🔥 CLICK SHIELD */}
                        <div className="iframe-click-shield" />
                    </div>

                </div>
            </div>

        </Portal>
    );
}
