import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay } from 'swiper';
import Link from 'next/link';
SwiperCore.use([EffectFade, Autoplay]);

const PageIntro = () => {

    return (
        <section className="page-intro">
            <Swiper autoplay={{
                "delay": 3500,
                "disableOnInteraction": false
            }}
                effect="fade"
                className="swiper-wrapper"
            >
                <SwiperSlide>
                    <div className="page-intro-slide" style={{ backgroundImage: "url('/images/ta_dung.jpeg')" }}>
                        <div className="container">
                            <div className="page-intro-slide-content">
                                <p className='p-i-title'>Văn hóa - du lịch</p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="page-intro-slide" style={{ backgroundImage: "url('/images/dstn.jpeg')" }}>
                        <div className="container">
                            <div className="page-intro-slide-content">
                                <p className='p-i-title'>Ẩm thực - đặc sản</p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="page-intro-slide" style={{ backgroundImage: "url('/images/bds.jpeg')" }}>
                        <div className="container">
                            <div className="page-intro-slide-content">
                                <p className='p-i-title'>Bất động sản Đăk Nông</p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
};

export default PageIntro