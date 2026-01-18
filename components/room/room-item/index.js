import RoomActions from 'components/room/room-action/index';
import { RentalAmenityOptions, RentalTypeLabels } from 'lib/constants/data';
import { formatArea, formatVnd } from 'lib/utils/index';
import { PageUrl } from 'lib/constants/tech';
import Link from 'next/link';
const { NEXT_PUBLIC_REACT_APP_API } = process.env;

const RoomItem = ({ room }) => {
    const { id, slug, title, price, area, rental, updatedAt, uploads, cover_index, amenities, floor, room_code } = room;

    const bkUrl = `${NEXT_PUBLIC_REACT_APP_API}/uploads`;
    const coverImage = uploads?.[cover_index];
    const subImages = uploads
        ?.filter((_, i) => i !== cover_index)
        ?.slice(0, 2);


    return (
        <div className="room-item">
            <Link href={`${PageUrl.Rental}/${slug}`}>
                <div className="room-main">
                    <div className="room-images">
                        {coverImage && (
                            <div
                                className="room-image img-0"
                                style={{
                                    backgroundImage: `url(${bkUrl}${coverImage.file_path})`,
                                }}
                            />
                        )}

                        {subImages?.map((img, idx) => (
                            <div
                                key={img.id}
                                className={`room-image img-${idx + 1}`}
                                style={{
                                    backgroundImage: `url(${bkUrl}${img.file_path})`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="room-description">
                        <a className="room-name">{title}</a>

                        <p className="room-address">
                            <span className="icon-location-adress">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 22s7-7.16 7-12a7 7 0 1 0-14 0c0 4.84 7 12 7 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </span>

                            <span className="address-text">
                                {rental?.address_detail_display}
                            </span>
                        </p>

                        <div className="room-price">
                            <span className='price'>{formatVnd(price)}</span>

                            {
                                rental.rental_type &&
                                <>
                                    <span className="point" />
                                    <span>{RentalTypeLabels[rental.rental_type]}</span>
                                </>
                            }

                            <>
                                <span className="point" />
                                <span>Tầng {floor ? floor : "Trệt"}</span>
                            </>

                            {area && <><span className="point" />
                                <span>{formatArea(area)}</span>
                            </>}

                        </div>

                        <div className="room-amenities">
                            {amenities?.slice(0, 6).map(item => (
                                <span key={item} className="amenity-chip">
                                    {RentalAmenityOptions[item]}
                                </span>
                            ))}
                            {amenities?.length > 6 && (
                                <span className="amenity-more">
                                    +{amenities.length - 6}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            <RoomActions
                roomId={id}
                rentalId={rental.id}
                roomCode={room_code}
                updatedAt={updatedAt}
            />
        </div>
    )
}

export default RoomItem