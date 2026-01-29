import { formatVnd, formatArea, formatOtherFee } from 'lib/utils';
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
        floor,
        room_number,
    } = room;

    const renderWaterFee = () => {
        if (!rental?.fee_water || rental.fee_water <= 0) return null;

        const unit = rental.water_unit
            ? ` ${WaterUnitOptions[rental.water_unit] || ''}`
            : '';

        return (
            <li>
                Nước: {formatVnd(rental.fee_water, { suffix: null })}{unit}
            </li>
        );
    };

    return (
        <section className="room-summary-card">
            {/* ===== TITLE & PRICE ===== */}
            <h1 className="room-title">{title}</h1>

            <div className="room-price">
                {formatVnd(price)}
                <span>/tháng</span>
            </div>

            {/* ===== META INFO ===== */}
            <div className="room-meta">
                {deposit != null && (
                    <div>
                        <strong>Giữ phòng:</strong> {formatVnd(deposit)}
                    </div>
                )}

                {floor != null && (
                    <div>
                        <strong>Tầng:</strong> {Number(floor) === 0 ? 'Trệt' : floor}
                    </div>
                )}

                {area && (
                    <div>
                        <strong>Diện tích:</strong> {formatArea(area)}
                    </div>
                )}

                {max_people && (
                    <div>
                        <strong>Số người:</strong> {max_people}
                    </div>
                )}

                {room_number && (
                    <div>
                        <strong>Phòng:</strong> {room_number}
                    </div>
                )}
            </div>

            {/* ===== ADDRESS ===== */}
            {rental?.address_detail_display && (
                <div className="room-address">
                    📍 {rental.address_detail_display}
                </div>
            )}

            {/* ===== FEES ===== */}
            <div className="room-fees">
                <h4>Chi phí khác</h4>
                <ul>
                    <li>Điện: {formatVnd(rental?.fee_electric)}</li>
                    {renderWaterFee()}
                    <li>Wifi: {formatVnd(rental?.fee_wifi)}</li>
                    <li>Giữ xe: {formatVnd(rental?.fee_parking)}</li>
                    <li>Dịch vụ: {formatVnd(rental?.fee_service)}</li>
                    <li>Phí khác: {formatOtherFee(rental?.fee_other)}</li>
                </ul>
            </div>

            {/* ===== AMENITIES ===== */}
            {!!amenities.length && (
                <div className="room-amenities">
                    <h4>Tiện ích</h4>
                    <div className="amenities-grid">
                        {amenities.map((key) => (
                            <span key={key} className="amenity-tag">
                                {RentalAmenityOptions[key]}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default RoomContent;
