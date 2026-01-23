'use client';

import { BookingStatusLabels } from 'lib/constants/data';
import { formatVnd } from 'lib/utils';
import { formatDateTime, formatDateTimeString } from 'lib/utils/date';
import { PageUrl } from 'lib/constants/tech';
import Link from 'next/link';

const BookingItem = ({ booking }) => {
    const room = booking?.room || {};

    return (
        <div className="booking-item">
            <div className="b-left">
                <Link href={`${PageUrl.Rental}/${room.slug}`}>
                    <p className="room-title">
                        {room.title || 'Phòng không xác định'}
                    </p>
                </Link>

                <p className="room-address">
                    📍 {room.rental?.address_detail_display}
                </p>

                <div className="room-meta">
                    {room.room_code && (
                        <span className="meta-pill">
                            🏷 {room.room_code}
                        </span>
                    )}

                    {room.room_number && (
                        <span className="meta-pill">
                            🚪 Phòng {room.room_number}
                        </span>
                    )}

                    {room.area && (
                        <span className="meta-pill">
                            📐 {room.area} m²
                        </span>
                    )}

                    {room.price && (
                        <span className="meta-pill price">
                            💰 {formatVnd(room.price)}/tháng
                        </span>
                    )}
                </div>

                <p className="viewing-time">
                    ⏰ Lịch xem:{' '}
                    <strong>
                        {formatDateTimeString(booking.viewing_at)}
                    </strong>
                </p>
            </div>

            <div className="b-right">
                <span
                    className={`status status-${booking.status}`}
                >
                    {BookingStatusLabels[booking.status]}
                </span>

                <p className="updated-at">
                    🕒 Đặt lúc {formatDateTime(booking.updatedAt)}
                </p>
            </div>
        </div>

    );
};

export default BookingItem;
