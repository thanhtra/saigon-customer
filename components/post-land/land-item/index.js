import Link from 'next/link';
import { formatDate, getStatusLand } from 'lib/utils/index';
import clsx from 'clsx';
const { NEXT_PUBLIC_REACT_APP_API } = process.env;

const LandItem = ({ land, editLand, deleteLand }) => {
    const { image, slug, title, price, acreage, district, ward, updatedAt, status, id } = land;
    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/land/${image}`

    return (

        <div className='land-item-my-post'>
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
                        <p className='created-date'>Cập nhật: {formatDate(updatedAt)}</p>


                    </div>
                </div >
            </Link>
            <div className='land-action'>
                <p className={clsx({
                    'status-land': true,
                    'new': status === 'new' || status === 'update',
                    'pending': status === 'pending',
                    'confirmed': status === 'confirmed'
                })}>{getStatusLand(status)}</p>

                <div className='l-a-action'>
                    <p className='edit' onClick={() => editLand(slug)}>Cập nhật</p>
                    <p className='delete' onClick={() => deleteLand(id)}>Xóa tin</p>
                </div>
            </div>
        </div>
    )
}

export default LandItem