import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect, useCallback } from 'react';

const RoomGallery = ({ images = [], room }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (images.length) {
            const coverImageIndex = images.findIndex(img => img.is_cover);
            setActiveIndex(coverImageIndex !== -1 ? coverImageIndex : 0);
        }
    }, [images]);

    const imageUrl = useCallback(
        (path) => `${process.env.NEXT_PUBLIC_API_URL}/uploads${path}`,
        []
    );

    if (!images.length) return null;

    return (
        <section className="room-gallery">
            <div className="room-gallery-main">
                <img
                    src={imageUrl(images[activeIndex].file_path)}
                    alt={room?.title || 'room'}
                    loading="eager"
                    draggable={false}
                />
            </div>

            <Swiper
                slidesPerView={4.5}
                spaceBetween={8}
                observer={false}
                observeParents={false}
                resizeObserver={false}

                watchOverflow
                breakpoints={{
                    768: { slidesPerView: 5 },
                    1024: { slidesPerView: 6 },
                }}
                className="room-gallery-thumbs"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={img.id}>
                        <button
                            type="button"
                            className={`thumb ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label="Xem ảnh"
                        >
                            <img
                                src={imageUrl(img.file_path)}
                                alt="thumbnail"
                                loading="lazy"
                                draggable={false}
                            />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default RoomGallery;
