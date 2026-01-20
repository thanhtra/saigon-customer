import Link from 'next/link';
import { formatDate, formatVnd, formatArea } from 'lib/utils/index';
const { NEXT_PUBLIC_REACT_APP_API } = process.env

const LandItem = ({ land }) => {
    const { slug, title, price, area, rental, updatedAt, uploads, cover_index } = land;

    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/${uploads[cover_index].file_path}`

    return (
        <Link href={`/bat-dong-san/${slug}`}>
            <div className="land-item">
                <div className='land-image' style={{ backgroundImage: `url(${bkImage})` }}>
                </div>

                <div className="land-description">
                    <a className='land-name'>{title}</a>

                    <div className="land-price">
                        <span className='title'>{formatArea(area)}</span>
                        <span className='point'></span>
                        <span className='title'>{formatVnd(price)}</span>
                    </div>

                    <p className='land-address'>{rental?.address_detail_display}</p>
                    <p className='created-date'>Ngày cập nhật: {formatDate(updatedAt)}</p>
                </div>
            </div >
        </Link>
    )
}

export default LandItem