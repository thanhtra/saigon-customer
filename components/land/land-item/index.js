import Link from 'next/link';
import { formatDate } from 'lib/utils/index';
const { NEXT_PUBLIC_REACT_APP_API } = process.env

const LandItem = ({ land }) => {
    const { image, slug, title, price, acreage, district, ward, updatedAt } = land
    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/land/${image}`

    return (
        <Link href={`/bat-dong-san/${slug}`}>
            <div className="land-item">
                <div className='land-image' style={{ backgroundImage: `url(${bkImage})` }}>
                </div>

                <div className="land-description">
                    <a className='land-name'>{title}</a>

                    <div className="land-price">
                        <span className='title'>{acreage}</span>
                        <span className='point'></span>
                        <span className='title'>{price}</span>
                    </div>

                    <p className='land-address'> {ward} - {district} - Đăk Nông </p>
                    <p className='created-date'>Ngày cập nhật: {formatDate(updatedAt)}</p>
                </div>
            </div >
        </Link>
    )
}

export default LandItem