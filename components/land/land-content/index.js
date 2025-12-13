import { formatDate } from 'lib/utils/index';


const LandContent = ({ land = {} }) => {
    const { title, price, acreage, district, ward, address_detail, updatedAt } = land

    return (
        <section className="brief-content">
            <h2 className="brief-content-name">{title}</h2>

            <div className="brief-content-detail">
                <div className="infor">
                    <span className='title'>Giá bán: </span>
                    <span>{price}</span>
                </div>

                <div className="infor">
                    <span className='title'>Diện tích: </span>
                    <span>{acreage}</span>
                </div>

                <div className="infor">
                    <span className='title'>Địa chỉ: </span>
                    <span>{address_detail ? address_detail + ' - ' : ''}{ward} - {district} - Đăk Nông</span>
                </div>

                <div className="infor">
                    <span className='title'>Ngày cập nhật: </span>
                    <span>{formatDate(updatedAt)}</span>
                </div>

                <div className="contact-area">
                    <p className="contact-area-title">Liên hệ:</p>

                    <p className="infor"><span className='title'>Số điện thoại: </span>0968 922 006</p>
                    <p className="infor"><span className='title'>Zalo: </span>0968 922 006</p>
                </div>
            </div>
        </section >
    );
};

export default LandContent
