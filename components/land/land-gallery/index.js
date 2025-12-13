import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect } from 'react'

const LandGallery = ({ images }) => {
    const [featImage, setFeatImage] = useState({});

    useEffect(() => {
        if (images && images.length) {
            setFeatImage(images[0])
        }
    }, [JSON.stringify(images)])

    const chooseImage = (image) => {
        setFeatImage(image)
    }

    return (
        <section className="land-gallery">
            <div className="land-gallery-thumbs">
                <div className='p-g-mobile'>
                    <Swiper
                        slidesPerView={4.5}
                        spaceBetween={3}
                        pagination={{
                            "clickable": true
                        }}
                        className="swiper-wrapper">

                        {(images || []).map(image => (
                            <SwiperSlide key={image?.id} className='land-gallery-thumb' onClick={() => chooseImage(image)}>
                                <img src={`${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/land/` + image?.name} alt="" className={image?.name === featImage?.name ? 'active' : ''} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='p-g-desktop'>
                    <Swiper
                        spaceBetween={5}
                        direction={'vertical'}
                        watchOverflow={true}
                        slidesPerView={4.5}
                        effect={'slide'}
                        pagination={true}
                        className="swiper-wrapper">

                        {(images || []).map(image => (
                            <SwiperSlide key={image?.id} className="land-gallery-thumb" onMouseEnter={() => chooseImage(image)} onClick={() => chooseImage(image)}>
                                <img src={`${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/land/` + image?.name} alt="" className={image?.name === featImage?.name ? 'active' : ''} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>

            <div className='land-gallery-image' style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/land/${featImage?.name})` }}></div>
        </section>
    );
};

export default LandGallery;
