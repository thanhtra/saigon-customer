import { formatVnd, formatArea } from 'lib/utils';
import { RentalAmenityOptions, WaterUnitOptions } from 'lib/constants/data';

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

    const renderWaterFee = () => {
        if (!rental?.fee_water || rental.fee_water <= 0) {
            return null; // Không hiển thị nếu không có phí nước hoặc phí là 0
        }

        const waterUnit = rental.water_unit && WaterUnitOptions[rental.water_unit];

        const formattedWaterUnit = waterUnit ? ` ${waterUnit}` : '';

        return (
            <li>
                Nước: {formatVnd(rental.fee_water, { suffix: null })}{formattedWaterUnit}
            </li>
        );
    };

    return (
        <section className="room-summary-card">
            <h1 className="room-title">{title}</h1>

            <div className="room-price">
                {formatVnd(price)}
                <span>/tháng</span>
            </div>

            <div className="room-meta">
                {area && <div><strong>Diện tích:</strong> {formatArea(area)}</div>}
                {deposit && <div><strong>Cọc giữ phòng:</strong> {formatVnd(deposit)}</div>}
                {max_people && <div><strong>Ở tối đa:</strong> {max_people} người</div>}
            </div>

            <div className="room-address">
                📍 {rental?.address_detail_display}
            </div>

            <div className="room-fees">
                <h4>Chi phí khác</h4>
                <ul>
                    <li>Điện: {formatVnd(rental.fee_electric)}</li>
                    {renderWaterFee()}
                    <li>Wifi: {formatVnd(rental.fee_wifi)}</li>
                    <li>Giữ xe: {formatVnd(rental.fee_parking)}</li>
                    <li>Phí khác: {rental.fee_other || "Miễn phí"}</li>
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
