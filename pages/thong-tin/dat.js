import React from 'react'
import Breadcrumb from 'components/common/breadcrumb';
import Contact from 'components/common/contact';

const InforLand = () => {
    return (
        <section className="container information-land">
            <Breadcrumb title='Dịch vụ bất động sản' />

            <div className='brief-description'>
                <p className='b-title'>Ký gửi nhà đất uy tín tại Đăk Nông</p>
                <p className='b-description'>Với kinh nghiệm hơn 5 năm hoạt động chuyên nghiệp ở mảng Môi giới Bất động sản tại Đăk Nông.
                    Bất động sản Vị Rừng luôn là địa chỉ uy tín để khách hàng ký gửi thông tin nhà đất.
                    Với phương châm <span style={{ color: '#ef4136', fontWeight: '700' }}>Uy tín làm nên thương hiệu</span> đã giúp Vị Rừng tạo ra nhiều giao dịch thành công mang lại sự hài lòng cho cả bên bán và bên mua. </p>
            </div>

            <div className="service">
                <div className="col-service">
                    <div className='col-s-image' style={{ backgroundImage: 'url(/images/land/2.jpg)' }}>
                    </div>

                    <div className='col-s-text'>
                        <p className='t-title'>Hỗ trợ khách hàng tìm kiếm bất động sản phù hợp</p>
                        <p className='t-des'>Nắm rõ nguồn bất động sản, vị trí địa lý, thời tiết, khả năng sử dụng và phát triển của bất động sản trong tương lai,...
                            Vị Rừng luôn mong muốn hỗ trợ khách hàng tìm kiếm những bất động sản phù hợp với nhu cầu sử dụng.</p>
                    </div>
                </div>
                <div className="col-service">
                    <div className='col-s-image' style={{ backgroundImage: 'url(/images/land/3.jpg)' }}>
                    </div>

                    <div className='col-s-text'>
                        <p className='t-title'>
                            Hỗ trợ khách hàng các thủ tục pháp lý
                        </p>
                        <p className='t-des'>Nắm rõ các thủ tục pháp lý giao dịch bất động sản, Vị Rừng luôn hỗ trợ, hướng dẫn khách hàng đảm bảo quy trình mua bán được diễn ra suôn sẻ, các bên đều hài lòng và tin tưởng lẫn nhau.</p>
                    </div>
                </div>
                <div className="col-service">
                    <div className='col-s-image' style={{ backgroundImage: 'url(/images/land/3.jpg)' }}>
                    </div>

                    <div className='col-s-text'>
                        <p className='t-title'>
                            Bảo mật thông tin ký gửi mua bán nhà đất
                        </p>
                        <p className='t-des'>Trong suốt quá trình ký gửi chúng tôi luôn đảm bảo thông tin khách hàng luôn bảo mật tuyệt đối, không gây ảnh hưởng đến đời tư, công việc của khách hàng.</p>
                    </div>
                </div>
                <div className="col-service">
                    <div className='col-s-image' style={{ backgroundImage: 'url(/images/land/3.jpg)' }}>
                    </div>

                    <div className='col-s-text'>
                        <p className='t-title'> Tiết kiệm chi phí tối đa, chỉ nhận hoa hồng</p>
                        <p className='t-des'>Nói KHÔNG với việc kê giá bán, chúng tôi chỉ nhận % hoa hồng theo cam kết sau khi giao dịch thành công, mang lại sự hài lòng và hợp tác lâu dài.</p>
                    </div>
                </div>
            </div>


            <Contact />

        </section>
    )
}

export default InforLand