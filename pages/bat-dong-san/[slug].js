
import Breadcrumb from 'components/common/breadcrumb';
import PopupContact from 'components/common/popup-contact-land';
import SeoHead from 'components/common/seo-head';
import LandContent from 'components/land/land-content';
import Description from 'components/land/land-description';
import LandGallery from 'components/land/land-gallery';
import { getContact, getLandDetail } from 'lib/api/land.api';
import { PageUrl, UserRole } from 'lib/constants/tech';
import { formatVnd } from 'lib/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import LandActionsDetail from 'components/common/land-actions-detail';

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

    const isAdmin = user?.role === UserRole.Admin

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

    const coverImage = land?.uploads?.find(upload => upload.is_cover);
    const title = `${land.title} - ${formatVnd(land.price)}`;
    const description = `${land.title}, ${land?.address_detail_display}. Giá tốt, pháp lý rõ ràng.`;
    const bkUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;
    const filePath = coverImage?.file_path;
    const ogImage = filePath ? `${bkUrl}${filePath}` : 'https://tratimnha.com/og/land.jpg';
    const url = `https://tratimnha.com/bat-dong-san/${land.slug}`;

    return (
        <>
            <SeoHead
                title={title}
                description={description}
                image={ogImage}
                url={url}
                type="article"
            />

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
