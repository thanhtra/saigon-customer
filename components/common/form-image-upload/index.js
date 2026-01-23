
export default function FormImageUpload({
    value = [],
    onChange,
    label = 'Upload hình ảnh',
}) {
    const images = Array.isArray(value) ? value : [];

    const handleAddFiles = (files) => {
        const newFiles = Array.from(files).map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            isCover: images.length === 0 && index === 0,
            client_id: crypto.randomUUID(),
        }));

        onChange([...images, ...newFiles]);
    };

    const handleRemove = (idx) => {
        const removed = images[idx];

        if (removed?.file && removed.preview?.startsWith('blob:')) {
            URL.revokeObjectURL(removed.preview);
        }

        const next = images.filter((_, i) => i !== idx);

        // luôn đảm bảo có cover
        if (next.length && !next.some((i) => i.isCover)) {
            next[0] = { ...next[0], isCover: true };
        }

        onChange(next);
    };

    const setCover = (idx) => {
        onChange(
            images.map((img, i) => ({
                ...img,
                isCover: i === idx,
            })),
        );
    };

    return (
        <div className="image-upload">
            <label className="image-upload__button">
                {label}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        if (e.target.files) {
                            handleAddFiles(e.target.files);
                            e.target.value = '';
                        }
                    }}
                />
            </label>

            {!!images.length && (
                <div className="image-upload__grid">
                    {images.map((img, idx) => (
                        <div
                            key={img.client_id || img.id || idx}
                            className={`image-upload__item ${img.isCover ? 'is-cover' : ''}`}
                        >
                            <img src={img.preview} alt="" />

                            {/* remove */}
                            <button
                                type="button"
                                className="image-upload__remove"
                                onClick={() => handleRemove(idx)}
                                aria-label="Xoá ảnh"
                            >
                                ✕
                            </button>

                            {/* cover */}
                            <div
                                className="image-upload__cover"
                                onClick={() => setCover(idx)}
                            >
                                {img.isCover ? '★ Ảnh chính' : '☆ Đặt làm ảnh chính'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
