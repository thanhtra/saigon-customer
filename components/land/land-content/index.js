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
        address_detail_display
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
                        <strong>Kết cấu:</strong> {structure}
                    </div>
                )}

                {area && (
                    <div>
                        <strong>Diện tích:</strong> {formatArea(area)}
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
                    <li>Ngang trên: {Number(width_top)}m</li>
                    <li>Ngang dưới: {Number(width_bottom)}m</li>
                    <li>Dài trái: {Number(length_left)}m</li>
                    <li>Dài phải: {Number(length_right)}m</li>
                </ul>
            </div>

        </section>
    );
};

export default LandContent;
