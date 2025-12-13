import Link from 'next/link';
import { formatDate, getStatusLand } from 'lib/utils/index';
import clsx from 'clsx';
const { NEXT_PUBLIC_REACT_APP_API } = process.env;

const PostProductItem = ({ product, editProduct, deleteProduct }) => {
    const { image, slug, name, packs, status, updatedAt, status_post, id } = product;
    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/product/${image}`

    return (

        <div className='land-item-my-post'>
            <Link href={`/san-pham/${slug}`}>
                <div className="land-item">
                    <div className='land-image' style={{ backgroundImage: `url(${bkImage})` }}>
                    </div>

                    <div className="land-description">
                        <a className='land-name'>{name}</a>

                        {(JSON.parse(packs || {}) || []).map(item => (
                            <div className="land-price">
                                <span className='title'>{item?.name}</span>
                                <span className='point'></span>
                                <span className='title'>{item?.price_origin}</span>
                            </div>
                        ))}

                        <p className='created-date'>Cập nhật: {formatDate(updatedAt)}</p>
                    </div>
                </div >
            </Link>
            <div className='land-action'>
                <p className={clsx({
                    'status-land': true,
                    'new': status_post === 'new' || status_post === 'update',
                    'pending': status_post === 'pending',
                    'confirmed': status_post === 'confirmed'
                })}>{getStatusLand(status_post)}</p>

                <div className='l-a-action'>
                    <p className='edit' onClick={() => editProduct(slug)}>Cập nhật</p>
                    <p className='delete' onClick={() => deleteProduct(id)}>Xóa tin</p>
                </div>
            </div>
        </div>
    )
}

export default PostProductItem