'use client';

export default function RoomVideoModal({ open, onClose, videoUrl }) {
    if (!open) return null;

    return (
        <div className="video-modal-backdrop" onClick={onClose}>
            <div
                className="video-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="video-close" onClick={onClose}>
                    ✕
                </button>

                <div className="video-wrapper">
                    <iframe
                        src={videoUrl}
                        title="Video phòng"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
