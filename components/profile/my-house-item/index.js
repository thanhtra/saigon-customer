'use client';

import RoomStatusModal from 'components/room/room-status-modal';
import { RentalTypeLabels, RoomStatusLabels } from 'lib/constants/data';
import { PageUrl } from 'lib/constants/tech';
import { formatDateTime, formatVnd } from 'lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const MyHouseItem = ({ house }) => {
    if (!house) return null;

    const [openStatusModal, setOpenStatusModal] = useState(false);

    const {
        title,
        slug,
        room_code,
        room_number,
        price,
        area,
        status,
        createdAt,
        cover_index = 0,
        rental,
        uploads = [],
    } = house;

    const { NEXT_PUBLIC_REACT_APP_API } = process.env;
    const bkUrl = `${NEXT_PUBLIC_REACT_APP_API}/uploads`;

    const coverImage = uploads?.[cover_index] || uploads?.[0];
    const subImages = (uploads || []).filter((_, i) => i !== cover_index)?.slice(0, 2);


    const handleChangeStatus = (newStatus) => {
        console.log('Change status room:', id, newStatus);

        // TODO: call API update status
        // await roomService.updateStatus(id, newStatus);

        setOpenStatusModal(false);
    };

    return (
        <>
            <div className="house-item">
                <Link
                    href={`${PageUrl.Rental}/${slug}`}
                >
                    <div className="house-images">
                        {coverImage && (
                            <div
                                className="house-image img-main"
                                style={{
                                    backgroundImage: `url(${bkUrl}${coverImage.file_path})`,
                                }}
                            />
                        )}

                        {subImages?.map((img, idx) => (
                            <div
                                key={img.id}
                                className={`house-image img-sub img-${idx}`}
                                style={{
                                    backgroundImage: `url(${bkUrl}${img.file_path})`,
                                }}
                            />
                        ))}

                        {house.rental?.rental_type && (
                            <span className="rental-type">
                                {RentalTypeLabels[house.rental.rental_type]}
                            </span>
                        )}
                    </div>
                </Link>


                <div className="house-content">
                    <div className="h-left">
                        <Link href={`${PageUrl.Rental}/${slug}`}>
                            <p className="house-title">
                                {title}
                            </p>
                        </Link>

                        <p className="house-address">
                            📍 {rental?.address_detail_display}
                        </p>

                        <div className="house-meta">
                            {room_code && (
                                <span className="meta-pill">
                                    🏷 {room_code}
                                </span>
                            )}

                            {room_number && (
                                <span className="meta-pill">
                                    🚪 Phòng {room_number}
                                </span>
                            )}

                            {area && (
                                <span className="meta-pill">
                                    📐 {area} m²
                                </span>
                            )}

                            {price && (
                                <span className="meta-pill price">
                                    💰 {formatVnd(price)}/tháng
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="h-right">
                        <button
                            type="button"
                            className={`status status-${status} status-action`}
                            onClick={() => setOpenStatusModal(true)}
                        >
                            {RoomStatusLabels[status]}
                            <span className="status-caret">▾</span>
                        </button>

                        <Link href={`${PageUrl.Rental}/${slug}/edit`}>
                            <a className="action-link">
                                ✏️ Chỉnh sửa
                            </a>
                        </Link>

                        <p className="updated-at">
                            🕒 Tạo lúc {formatDateTime(createdAt)}
                        </p>
                    </div>

                </div>
            </div>

            {
                openStatusModal && (
                    <RoomStatusModal
                        open={openStatusModal}
                        currentStatus={status}
                        onClose={() => setOpenStatusModal(false)}
                        onConfirm={handleChangeStatus}
                    />

                )
            }
        </>
    );
};

export default MyHouseItem;
