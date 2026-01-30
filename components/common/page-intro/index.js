import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

import { SLIDES } from 'lib/constants/data';

const PageIntro = () => {
    return (
        <section className="page-intro">
            <Swiper
                modules={[Autoplay, EffectFade]}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                speed={800}
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
