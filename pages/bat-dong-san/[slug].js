
import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-land';
import SeoHead from 'components/common/seo-head';
import LandContent from 'components/land/land-content';
import Description from 'components/land/land-description';
import LandGallery from 'components/land/land-gallery';
import { getContact, getLandDetail } from 'lib/api/land.api';
import { PageUrl, UserRole } from 'lib/constants/tech';
import { formatVnd, formatArea } from 'lib/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import LandActionsDetail from 'components/common/land-actions-detail';

import {
    FurnitureStatusLabels,
    HouseDirectionLabels,
    LandAmenityLabels,
    LegalStatusLabels,
} from 'lib/constants/data';



export async function getServerSideProps({ params }) {
    try {
        const { slug } = params;
        const res = await getLandDetail(slug);

        if (!res?.success || !res?.result) {
            return { notFound: true };
        }

        return {
            props: {
                land: res.result,
            },
        };
    } catch {
        return { notFound: true };
    }
}

const LandDetailPage = ({ land }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const [isContactOpen, setIsContactOpen] = useState(false);
    const [loadingContact, setLoadingContact] = useState(false);
    const [contact, setContact] = useState(null);
    const [copying, setCopying] = useState(false);

    const isAdmin = user?.role === UserRole.Admin;
    const isSales = user?.role === UserRole.Sale;

    const closeContactModal = useCallback(() => {
        setIsContactOpen(false);
    }, []);

    const openContactModal = useCallback(async () => {
        const landId = land?.id;
        if (!landId || loadingContact) return;

        try {
            setLoadingContact(true);

            const res = await getContact(landId);

            if (!res?.success) throw new Error();


            setContact(res.result);
            setIsContactOpen(true);
        } catch {
            toast.error('Không lấy được thông tin liên hệ');
        } finally {
            setLoadingContact(false);
        }
    }, [land?.id, loadingContact, contact, dispatch]);


    const htmlToText = (html = '') => {
        if (typeof document === 'undefined') {
            return html
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
        }

        const div = document.createElement('div');
        div.innerHTML = html;

        return div.textContent || div.innerText || '';
    };

    const buildSalesContent = () => {
        if (!land) return '';

        const {
            area,
            price,
            title,
            land_code,
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

            description,
        } = land;

        const cleanDescription = htmlToText(description);

        const lines = [
            title
                ? `${title}${land_code ? ` (${land_code})` : ''}`
                : null,

            '',

            address_detail_display
                ? `Địa chỉ: ${address_detail_display}`
                : null,

            '----------------',

            price
                ? `Giá: ${Number(price)} tỷ`
                : null,

            legal_status
                ? `Pháp lý: ${LegalStatusLabels[legal_status] || legal_status}`
                : null,

            amenities?.length
                ? `Tiện ích: ${amenities
                    .map((key) => LandAmenityLabels[key] || key)
                    .join(' - ')}`
                : null,

            '',

            // house_direction
            //     ? `Hướng nhà: ${HouseDirectionLabels[house_direction] || house_direction}`
            //     : null,

            (bedrooms || toilets)
                ? `Phòng: ${[
                    bedrooms ? `${bedrooms} PN` : null,
                    toilets ? `${toilets} WC` : null,
                ]
                    .filter(Boolean)
                    .join(' • ')}`
                : null,

            furniture_status
                ? `Nội thất: ${FurnitureStatusLabels[furniture_status] || furniture_status}`
                : null,

            '',

            structure
                ? `Kết cấu: ${structure}`
                : null,

            area
                ? `Diện tích: ${formatArea(area)}`
                : null,

            'Kích thước:',

            width_top
                ? `- Ngang trên: ${Number(width_top)} m`
                : null,

            width_bottom
                ? `- Ngang dưới: ${Number(width_bottom)} m`
                : null,

            length_left
                ? `- Dài trái: ${Number(length_left)} m`
                : null,

            length_right
                ? `- Dài phải: ${Number(length_right)} m`
                : null,

            '',

            cleanDescription
                ? cleanDescription.trim()
                : null,

            '',

            '----------------',

            `Liên hệ: ${user?.name ?? ''} - Gọi/Zalo: ${user?.phone ?? ''}`,
        ];

        return lines
            .filter((line) => line !== null && line !== undefined && line !== '')
            .join('\n');
    };

    const copyText = async (text) => {
        // Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (e) {
                console.log("Clipboard API failed:", e);
            }
        }

        // Fallback cho Safari/iPhone
        const textarea = document.createElement("textarea");
        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const success = document.execCommand("copy");

        textarea.remove();

        if (!success) {
            throw new Error("Copy failed");
        }
    };

    const handleCopySalesInfo = async () => {
        try {

            const content = buildSalesContent();
            // await navigator.clipboard.writeText(content);
            await copyText(content);

            setCopying(true);
            toast.success('Đã copy');
        } catch {
            toast.error('Copy thất bại');
        } finally {
            setCopying(false);
        }
    };

    const downloadAllImages = async () => {
        const uploads = (land?.uploads || [])
            .filter((image) => image?.file_path)
            .sort((a, b) => {
                if (a.is_cover && !b.is_cover) return -1;
                if (!a.is_cover && b.is_cover) return 1;
                return 0;
            });

        if (!uploads.length) {
            toast.error('Không có hình nhà');
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            toast.error('Chưa cấu hình API URL');
            return;
        }

        try {
            for (let i = 0; i < uploads.length; i++) {
                const image = uploads[i];

                const imageUrl = `${apiUrl}/uploads${image.file_path}`;

                try {
                    const response = await fetch(imageUrl);

                    if (!response.ok) {
                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }

                    const blob = await response.blob();

                    const objectUrl = URL.createObjectURL(blob);

                    const extension =
                        image.file_path
                            ?.split('.')
                            ?.pop()
                            ?.split('?')[0] || 'jpg';

                    const fileName = image.is_cover
                        ? `${land?.land_code || 'nha'}-cover.${extension}`
                        : `${land?.land_code || 'nha'}-${String(i + 1).padStart(2, '0')}.${extension}`;

                    const link = document.createElement('a');

                    link.href = objectUrl;
                    link.download = fileName;

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    URL.revokeObjectURL(objectUrl);

                    // Delay để browser không chặn multiple downloads
                    await new Promise((resolve) =>
                        setTimeout(resolve, 700)
                    );
                } catch (error) {
                    console.error(
                        'Không tải được hình:',
                        imageUrl,
                        error
                    );
                }
            }

            toast.success(`Đã tải ${uploads.length} hình`);
        } catch (error) {
            console.error('Download images error:', error);
            toast.error('Tải hình thất bại');
        }
    };


    const coverImage = land?.uploads?.find(upload => upload.is_cover);
    const title = `${land.title} - ${formatVnd(land.price)}`;
    const description = `${land.title}, ${land?.address_detail_display}. Giá tốt, pháp lý rõ ràng.`;
    const bkUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;
    const filePath = coverImage?.file_path;
    const ogImage = filePath ? `${bkUrl}${filePath}` : 'https://tratimnha.com/og/land.jpg';
    const url = `https://tratimnha.com/bat-dong-san/${land.slug}`;

    return (
        <>
            {/* <SeoHead
                title={title}
                description={description}
                image={ogImage}
                url={url}
                type="article"
            /> */}

            <section className="container land-detail-page">
                <Breadcrumb menu={PageUrl.Land} title={land.title} />

                <div className="land-detail-grid">
                    <div className="land-detail-left">
                        <LandGallery
                            images={land.uploads || []}
                            land
                        />

                        <div className="land-section">
                            <h3 className="section-title">Mô tả chi tiết</h3>
                            <Description land={land} />
                        </div>
                    </div>

                    <aside className="land-detail-right">
                        <LandContent land={land} />

                        <LandActionsDetail
                            landId={land.id}
                            landCode={land?.land_code}
                            title={land?.title}
                            address={land?.address_detail_display}
                            videoUrl={land?.video_url}
                        />

                        {isAdmin && (
                            <div className="admin-contact-box">
                                <button
                                    type="button"
                                    className={`btn btn-contact-owner ${loadingContact ? 'is-loading' : ''}`}
                                    onClick={openContactModal}
                                    disabled={loadingContact}
                                >
                                    {loadingContact ? 'Đang tải...' : 'Thông tin'}
                                </button>
                            </div>
                        )}

                        {(isAdmin || isSales) && (
                            <div className="admin-contact-box">
                                <button
                                    type="button"
                                    className={`btn btn-contact-owner ${copying ? 'is-loading' : ''
                                        }`}
                                    onClick={handleCopySalesInfo}
                                    disabled={copying}
                                >
                                    {copying ? 'Đang copy...' : '📋 Copy thông tin'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-contact-owner"
                                    onClick={downloadAllImages}
                                >
                                    ⬇️ Tải hình
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                <PopupContact
                    isShow={isContactOpen}
                    hideModal={closeContactModal}
                    contact={contact}
                />
            </section>
        </>
    );
};

export default LandDetailPage;
