import { useState } from "react";

export default function FormImageUpload({
    value = [],
    onChange,
    label = 'Upload hình ảnh',
}) {
    const images = Array.isArray(value) ? value : [];
    const [loading, setLoading] = useState(false);


    // const handleAddFiles = async (files) => {
    //     setLoading(true);

    //     const processed = [];

    //     for (const [index, file] of Array.from(files).entries()) {
    //         let finalFile = file;
    //         let previewUrl;

    //         const isHeic =
    //             file.type === "image/heic" ||
    //             file.type === "image/heif" ||
    //             file.name.toLowerCase().endsWith(".heic") ||
    //             file.name.toLowerCase().endsWith(".heif");

    //         try {
    //             if (isHeic) {
    //                 const heic2any = (await import("heic2any")).default;

    //                 const result = await heic2any({
    //                     blob: file,
    //                     toType: "image/jpeg",
    //                     quality: 0.9,
    //                 });

    //                 const blob = Array.isArray(result) ? result[0] : result;

    //                 finalFile = new File(
    //                     [blob],
    //                     file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    //                     { type: "image/jpeg" }
    //                 );

    //                 previewUrl = await new Promise((resolve) => {
    //                     const reader = new FileReader();
    //                     reader.onload = (e) => resolve(e.target.result);
    //                     reader.readAsDataURL(blob);
    //                 });

    //             } else {
    //                 previewUrl = await new Promise((resolve) => {
    //                     const reader = new FileReader();
    //                     reader.onload = (e) => resolve(e.target.result);
    //                     reader.readAsDataURL(file);
    //                 });
    //             }

    //         } catch (err) {
    //             console.error("Convert HEIC lỗi:", err);
    //         }

    //         processed.push({
    //             file: finalFile,
    //             preview: previewUrl,
    //             isCover: images.length === 0 && index === 0,
    //             client_id: crypto.randomUUID(),
    //         });
    //     }

    //     onChange([...images, ...processed]);

    //     setLoading(false);
    // };

    const handleAddFiles = async (files) => {
        setLoading(true);

        const fileArray = Array.from(files);

        const heic2any = (await import("heic2any")).default;

        const processed = await Promise.all(
            fileArray.map(async (file, index) => {
                let finalFile = file;

                const isHeic =
                    file.type === "image/heic" ||
                    file.type === "image/heif" ||
                    file.name.toLowerCase().endsWith(".heic") ||
                    file.name.toLowerCase().endsWith(".heif");

                try {
                    if (isHeic) {
                        const result = await heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.9,
                        });

                        const blob = Array.isArray(result) ? result[0] : result;

                        finalFile = new File(
                            [blob],
                            file.name.replace(/\.(heic|heif)$/i, ".jpg"),
                            { type: "image/jpeg" }
                        );
                    }
                } catch (err) {
                    console.error("Convert HEIC lỗi:", err);
                }

                return {
                    file: finalFile,
                    preview: URL.createObjectURL(finalFile),
                    isCover: images.length === 0 && index === 0,
                    client_id: crypto.randomUUID(),
                };
            })
        );

        onChange([...images, ...processed]);

        setLoading(false);
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
            {label && (
                <label className="upload-label">
                    {label}
                    <span className="required">*</span>
                </label>
            )}

            <label className={`image-upload__button ${loading ? "is-loading" : ""}`}>
                Tải lên
                <input
                    type="file"
                    multiple
                    // accept="image/*"
                    accept="image/*,.heic,.heif"
                    // capture="environment"
                    hidden
                    onChange={async (e) => {
                        if (e.target.files) {
                            await handleAddFiles(e.target.files);
                            e.target.value = '';
                        }
                    }}
                />
            </label>

            {loading && (
                <div className="image-upload__loading">
                    Đang xử lý ảnh...
                </div>
            )}

            {!!images.length && (
                <div className="image-upload__grid">
                    {images.map((img, idx) => (
                        <div
                            key={img.client_id || img.id || idx}
                            className={`image-upload__item ${img.isCover ? 'is-cover' : ''}`}
                        >
                            <img src={img.preview} alt="" loading="lazy" />

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
