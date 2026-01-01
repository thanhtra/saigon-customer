
import SwiperCore, { Autoplay, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SLIDES } from 'lib/constants/data';

SwiperCore.use([EffectFade, Autoplay]);

const PageIntro = () => {
    return (
        <section className="page-intro">
            <Swiper
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                effect="fade"
            >
                {SLIDES.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="page-intro-slide"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="container">
                                <div className="page-intro-slide-content">
                                    <h2 className="p-i-title">{item.title}</h2>
                                    <p className="p-i-desc">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default PageIntro;