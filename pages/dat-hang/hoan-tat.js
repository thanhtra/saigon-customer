import React from 'react'
import Link from 'next/link';
import Breadcrumb from 'components/common/breadcrumb';

const CompleteOrderPage = () => {
    return (
        <section className="container complete-order-page">
            <Breadcrumb title='Hoàn tất đặt hàng' />

            <div className="complete-order">
                <p className="mesage-complete">Đơn hàng được tạo thành công!</p>
                <p className="mesage-complete-detail">Cảm ơn bạn đã tin tưởng và chọn lựa, chúng tôi sẽ liên hệ sớm nhất để xác nhận đơn hàng.</p>

                <div className="group-btn">
                    <Link href="/san-pham">
                        <button type="button" className="btn btn-border">Đặc sản</button>
                    </Link>

                    <Link href="/kham-pha">
                        <button type="button" className="btn btn-border">Đặc sản - Khám phá - Bất động sản Đăk Nông</button>
                    </Link>

                    <Link href="/bat-dong-san">
                        <button type="button" className="btn btn-border">Bất động sản</button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CompleteOrderPage