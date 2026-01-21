import RoomActions from 'components/room/room-action/index';
import { RentalAmenityOptions, RentalTypeLabels } from 'lib/constants/data';
import { PageUrl } from 'lib/constants/tech';
import { formatArea, formatVnd } from 'lib/utils/index';
import Link from 'next/link';
const { NEXT_PUBLIC_API_URL } = process.env;

const RoomItem = ({ room }) => {
    const { id, slug, title, price, area, rental, updatedAt, uploads, cover_index, amenities, floor, room_code } = room;

    const bkUrl = `${NEXT_PUBLIC_API_URL}/uploads`;
    const coverImage = uploads?.[cover_index];
    const subImages = uploads
        ?.filter((_, i) => i !== cover_index)
        ?.slice(0, 2);

    return (
        <div className="room-item">

            <div className="room-main">
                <Link href={`${PageUrl.Rental}/${slug}`}>
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
                </Link>

                <RoomActions
                    roomId={id}
                    rentalId={rental.id}
                    roomCode={room_code}
                    title={title}
                    address={rental?.address_detail_display}
                    updatedAt={updatedAt}
                />
            </div>

            <Link href={`${PageUrl.Rental}/${slug}`}>
                <div className="room-description">
                    <a className="room-name">{title}</a>

                    <p className="room-address">
                        <span className="icon-location-adress">
                            <svg
                                width="12"
                                height="12"
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
                        <span className="icon-price">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2v20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M16 6.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5
               1.8 3.5 4 3.5
               4 1.5 4 3.5
               -1.8 3.5-4 3.5
               -2.2 0-4-1.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>

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
                        <span className="icon-amenity">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 11L12 3l9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9 11l2 2 4-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>


                        {amenities?.slice(0, 20).map(item => (
                            <span key={item} className="amenity-chip">
                                {RentalAmenityOptions[item]}
                            </span>
                        ))}
                        {amenities?.length > 20 && (
                            <span className="amenity-more">
                                +{amenities.length - 20}
                            </span>
                        )}
                    </div>

                    {/* <span className="room-updated">
                        Cập nhật: {formatDate(updatedAt)}
                    </span> */}
                </div>
            </Link>
        </div>
    )
}

export default RoomItem