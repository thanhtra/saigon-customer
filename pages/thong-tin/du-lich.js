import React from 'react'
import Breadcrumb from 'components/common/breadcrumb';
import Contact from 'components/common/contact';

const InforTour = () => {
    return (
        <section className="container information-tour">
            <Breadcrumb title='Dịch vụ du lịch' />

            <div className='brief-description'>
                <p className='b-title'>Dịch vụ du lịch tại Đăk Nông</p>
                <p>Là người dân bản địa, chúng tôi nắm rõ thông tin địa điểm du lịch văn hóa, đặc sản cũng như thời tiết khu vực Đăk Nông.
                    Nhằm đáp ứng nhu cầu khám phá, trải nghiệm của bạn bè khắp nơi, chúng tôi đã xây dựng đội ngũ sẵn sàng
                    hỗ trợ du khách nhiệt tình, cẩn thận và chu đáo.</p>
            </div>

            <div className="service">
                <p className="tour-title">Hỗ trợ đưa đón khách tham quan du lịch bằng ô tô</p>
                <p className="tour-des">Du khách khi đến với Đăk Nông có thể đặt, thuê đưa đón khám phá du lịch, đặc sản bằng ô tô (5 chỗ hoặc 7 chỗ).</p>
            </div>

            <Contact />

        </section>
    )
}

export default InforTour