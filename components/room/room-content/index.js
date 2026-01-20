import { formatVnd, formatArea } from 'lib/utils';
import { RentalAmenityOptions } from 'lib/constants/data';

const RoomContent = ({ room }) => {
    const {
        title,
        price,
        deposit,
        area,
        max_people,
        amenities = [],
        rental,
    } = room;

    return (
        <section className="room-summary-card">
            <h1 className="room-title">{title}</h1>

            <div className="room-price">
                {formatVnd(price)}
                <span>/tháng</span>
            </div>

            <div className="room-meta">
                <div><strong>Diện tích:</strong> {formatArea(area)}</div>
                <div><strong>Đặt cọc giữ phòng:</strong> {formatVnd(deposit)}</div>
                <div><strong>Sức chứa:</strong> {max_people} người</div>
            </div>

            <div className="room-address">
                📍 {rental?.address_detail_display}
            </div>

            <div className="room-fees">
                <h4>Chi phí khác</h4>
                <ul>
                    <li>Điện: {formatVnd(rental.fee_electric)}</li>
                    <li>Nước: {formatVnd(rental.fee_water)}</li>
                    <li>Wifi: {formatVnd(rental.fee_wifi)}</li>
                    <li>Giữ xe: {formatVnd(rental.fee_parking)}</li>
                </ul>
            </div>

            {!!amenities.length && (
                <div className="room-amenities">
                    <h4>Tiện ích</h4>
                    <div className="amenities-grid">
                        {amenities.map((item) => (
                            <span key={item} className="amenity-tag">
                                {RentalAmenityOptions[item]}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default RoomContent;
