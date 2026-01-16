import Link from 'next/link';
import { formatDate, getStatusRoom } from 'lib/utils/index';
import clsx from 'clsx';
const { NEXT_PUBLIC_REACT_APP_API } = process.env;

const RoomItem = ({ room, editRoom, deleteRoom }) => {
    const { image, slug, title, price, acreage, district, ward, updatedAt, status, id } = room;
    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/room/${image}`

    return (

        <div className='room-item-my-post'>
            <Link href={`/bat-dong-san/${slug}`}>
                <div className="room-item">
                    <div className='room-image' style={{ backgroundImage: `url(${bkImage})` }}>
                    </div>

                    <div className="room-description">
                        <a className='room-name'>{title}</a>

                        <div className="room-price">
                            <span className='title'>{acreage}</span>
                            <span className='point'></span>
                            <span className='title'>{price}</span>
                        </div>

                        <p className='room-address'> {ward} - {district} - Đăk Nông </p>
                        <p className='created-date'>Cập nhật: {formatDate(updatedAt)}</p>


                    </div>
                </div >
            </Link>
            <div className='room-action'>
                <p className={clsx({
                    'status-room': true,
                    'new': status === 'new' || status === 'update',
                    'pending': status === 'pending',
                    'confirmed': status === 'confirmed'
                })}>{getStatusRoom(status)}</p>

                <div className='l-a-action'>
                    <p className='edit' onClick={() => editRoom(slug)}>Cập nhật</p>
                    <p className='delete' onClick={() => deleteRoom(id)}>Xóa tin</p>
                </div>
            </div>
        </div>
    )
}

export default RoomItem