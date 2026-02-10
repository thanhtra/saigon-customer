import {
    FurnitureStatusLabels,
    HouseDirectionLabels,
    LandAmenityLabels,
    LegalStatusLabels
} from 'lib/constants/data';
import { formatArea } from 'lib/utils';

const LandContent = ({ land }) => {
    const {
        area,
        price,
        title,
        structure,
        width_top,
        width_bottom,
        length_left,
        length_right,
        address_detail_display,

        bedrooms,
        toilets,
        amenities,
        legal_status,
        furniture_status,
        house_direction,
    } = land;

    return (
        <section className="land-summary-card">
            <h1 className="land-title">{title}</h1>

            <div className="land-price">
                {Number(price)}
                <span>tỷ</span>
            </div>

            <div className="land-meta">
                {structure && (
                    <div>
                        <strong>Kết cấu:</strong><span className='land-value'> {structure}</span>
                    </div>
                )}

                {area && (
                    <div>
                        <strong>Diện tích:</strong><span className='land-value'> {formatArea(area)}</span>
                    </div>
                )}

                {(bedrooms || toilets) && (
                    <div>
                        <strong>Phòng:</strong>{' '}
                        <span className='land-value'>{bedrooms && `${bedrooms} PN`}</span>
                        {bedrooms && toilets && ' • '}
                        <span className='land-value'>{toilets && `${toilets} WC`}</span>
                    </div>
                )}

                {house_direction && (
                    <div>
                        <strong>Hướng nhà:</strong><span className='land-value'> {HouseDirectionLabels[house_direction]}</span>
                    </div>
                )}

                {legal_status && (
                    <div>
                        <strong>Pháp lý:</strong><span className='land-value'> {LegalStatusLabels[legal_status]}</span>
                    </div>
                )}

                {furniture_status && (
                    <div>
                        <strong>Nội thất:</strong><span className='land-value'> {FurnitureStatusLabels[furniture_status]}</span>
                    </div>
                )}
            </div>

            {address_detail_display && (
                <div className="land-address">
                    📍 {address_detail_display}
                </div>
            )}

            <div className="land-fees">
                <h4>Kích thước</h4>
                <ul>
                    <li>Ngang trên: <span className='land-value'>{Number(width_top)} m</span></li>
                    <li>Ngang dưới: <span className='land-value'>{Number(width_bottom)} m</span></li>
                    <li>Dài trái: <span className='land-value'>{Number(length_left)} m</span></li>
                    <li>Dài phải: <span className='land-value'>{Number(length_right)} m</span></li>
                </ul>
            </div>

            {!!amenities.length && (
                <div className="land-amenities">
                    <h4>Tiện ích</h4>
                    <div className="amenities-grid">
                        {amenities.map((key) => (
                            <span key={key} className="amenity-tag">
                                {LandAmenityLabels[key]}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </section>
    );
};

export default LandContent;
