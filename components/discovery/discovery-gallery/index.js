import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from 'react';

const DiscoveryGallery = ({ images }) => {
    return (
        <section className="discovery-gallery">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                parallax={true}
                observeParents={true}
                observer={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="swiper-wrapper"
            >

                {(images || []).map(image => (
                    <SwiperSlide key={image}
                        style={{
                            backgroundImage: "url(" + `${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/discovery/` + image?.name + ")"
                        }}
                        className="discovery-gallery-thumb"
                    >
                    </SwiperSlide>
                ))}
            </Swiper>
        </section >
    );
};

export default DiscoveryGallery;
