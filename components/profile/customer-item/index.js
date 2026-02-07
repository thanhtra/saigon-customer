import { BookingStatusLabels, BookingStatus } from 'lib/constants/data';
import { PageUrl } from 'lib/constants/tech';
import { formatVnd } from 'lib/utils';
import { formatDateTimeString } from 'lib/utils/date';
import Link from 'next/link';

const CustomerItem = ({ customer }) => {
    if (!customer) return null;

    const {
        customer_name,
        customer_phone,
        viewing_at,
        status,
        is_paid_commission,
        room = {},
    } = customer;

    const {
        slug,
        title,
        room_code,
        price,
        rental,
        uploads = [],
    } = room;

    const { NEXT_PUBLIC_API_URL } = process.env;
    const uploadBaseUrl = `${NEXT_PUBLIC_API_URL}/uploads`;

    const coverImage = uploads.find(img => img.is_cover) || uploads[0];

    const roomHref = slug
        ? `${PageUrl.Rental}/${slug}`
        : '#';

    const hasCommission = status === BookingStatus.MOVED_IN;

    return (
        <div className="customer-item">

            <div className="image-wrapper">
                <Link href={roomHref}>
                    {coverImage ? (
                        <div
                            className="customer-image"
                            style={{
                                backgroundImage: `url(${uploadBaseUrl}${coverImage.file_path})`,
                            }}
                        />
                    ) : (
                        <div className="customer-image placeholder">
                            No Image
                        </div>
                    )}
                </Link>

                <div className="customer-header">
                    <span className="customer-name">{customer_name}</span>

                    <a
                        href={`https://zalo.me/${customer_phone}`}
                        className="customer-phone"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        💬 Zalo
                    </a>
                </div>
            </div>

            <div className="customer-content">
                <div className="c-left">

                    <Link href={roomHref} className="room-title">
                        <> 🏠 {title}</>
                    </Link>

                    <p className="room-address">
                        📍 {rental?.address_detail_display}
                    </p>

                    <div className="room-meta">
                        {room_code && (
                            <span className="meta-pill">
                                🏷 {room_code}
                            </span>
                        )}

                        {price && (
                            <span className="meta-pill price">
                                💰 {formatVnd(price)}
                            </span>
                        )}
                    </div>

                    <p className="viewing-time">
                        ⏰ Lịch xem:
                        <strong> {formatDateTimeString(viewing_at)}</strong>
                    </p>
                </div>

                <div className="c-right">
                    <span className={`status status-${status}`}>
                        {BookingStatusLabels[status]}
                    </span>

                    {hasCommission && (
                        <span
                            className={`commission ${is_paid_commission ? 'paid' : 'unpaid'
                                }`}
                        >
                            {is_paid_commission
                                ? '💸 Đã chi hoa hồng'
                                : '⏳ Chưa chi hoa hồng'}
                        </span>
                    )}
                </div>
            </div>
        </div>

    );
};

export default CustomerItem;
