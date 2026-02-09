import LandActions from 'components/land/land-action/index';
import { LandTypeLabels } from 'lib/constants/data';
import { PageUrl } from 'lib/constants/tech';
import { formatArea } from 'lib/utils/index';
import Link from 'next/link';
const { NEXT_PUBLIC_API_URL } = process.env;

const LandItem = ({ land }) => {
    const {
        address_detail_display,
        area,
        id,
        land_code,
        land_type,
        price,
        slug,
        title,
        uploads,
        structure,
        width_top,
        width_bottom,
        length_left,
        length_right,
        video_url
    } = land;


    const bkUrl = `${NEXT_PUBLIC_API_URL}/uploads`;
    const coverImage = uploads?.find(upload => upload.is_cover);
    const subImages = uploads
        ?.filter(upload => !upload.is_cover)
        ?.slice(0, 2);

    return (
        <div className="land-item">

            <div className="land-main">
                <Link href={`${PageUrl.Land}/${slug}`}>
                    <div className="land-images">
                        {coverImage && (
                            <div
                                className="land-image img-0"
                                style={{
                                    backgroundImage: `url(${bkUrl}${coverImage.file_path})`,
                                }}
                            />
                        )}

                        {subImages?.map((img, idx) => (
                            <div
                                key={img.id}
                                className={`land-image img-${idx + 1}`}
                                style={{
                                    backgroundImage: `url(${bkUrl}${img.file_path})`,
                                }}
                            />
                        ))}

                        {land_type && (
                            <div className="land-badges">
                                <span className="badge">
                                    {LandTypeLabels[land_type]}
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                <LandActions
                    landId={id}
                    landCode={land_code}
                    title={title}
                    slug={slug}
                    address={address_detail_display}
                    videoUrl={video_url}
                />
            </div>

            <Link href={`${PageUrl.Land}/${slug}`}>
                <div className="land-description">
                    <a className="land-name">{title}</a>

                    <p className="land-address">
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
                            {address_detail_display}
                        </span>
                    </p>

                    <div className="land-price">
                        <span className="icon icon-price">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                        <span className="price">{Number(price)} tỷ</span>

                        <span className="meta">
                            <span className="icon icon-floor">

                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M4 21h16M6 21V7l6-4 6 4v14M9 21v-6h6v6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span>{structure}</span>
                        </span>

                        {area && (
                            <>
                                <span className="meta">
                                    <span className="icon icon-area">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <rect
                                                x="4"
                                                y="4"
                                                width="16"
                                                height="16"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M9 9h6v6H9z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </span>
                                    <span>{formatArea(area)}</span>
                                </span>
                            </>
                        )}

                        {(width_top || width_bottom || length_left || length_right) && (
                            <>
                                <span className="meta-dimension">
                                    <span className="icon icon-dimension">
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M9 9h6v6H9z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </span>

                                    <span className="land-dimension">
                                        {[
                                            width_top && `Ngang trước ${Number(width_top)}m`,
                                            width_bottom && `Ngang sau ${Number(width_bottom)}m`,
                                            length_left && `Dài trái ${Number(length_left)}m`,
                                            length_right && `Dài phải ${Number(length_right)}m`,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default LandItem