import Breadcrumb from 'components/common/breadcrumb';
import LandFilter from 'components/land/land-filter';
import LandsContent from 'components/land/lands-content';
import { useLandRouter } from 'hooks/useLandRouter';
import { getLands } from 'lib/api/land.api';
import { normalizeLandQuery } from 'lib/utils/normalizeLandQuery';
import SeoHead from 'components/common/seo-head';

export async function getServerSideProps({ query }) {
    try {
        const payload = normalizeLandQuery(query);
        const res = await getLands(payload);

        if (!res?.success) {
            return {
                props: {
                    lands: [],
                    meta: {},
                },
            };
        }

        return {
            props: {
                lands: res.result?.data ?? [],
                meta: res.result?.meta ?? {},
            },
        };
    } catch {
        return {
            props: {
                lands: [],
                meta: {},
            },
        };
    }
}

const LandPage = ({ lands, meta }) => {
    const { query, search, paginate } = useLandRouter();

    return (
        <>
            <SeoHead
                title="Nhà ở cho thuê tại Sài Gòn | Phòng trọ, căn hộ, nhà nguyên căn"
                description="Tổng hợp nhà ở cho thuê tại Sài Gòn: phòng trọ, căn hộ, nhà nguyên căn chính chủ. Giá tốt, pháp lý rõ ràng, cập nhật liên tục."
                image="https://tratimnha.com/og/home.jpg"
                url="https://tratimnha.com/nha-o-cho-thue"
                type="website"
            />

            <section className="container lands-page">
                <Breadcrumb
                    title={`Tất cả ${meta?.itemCount ?? 0} bất động sản`}
                />

                <div className="lands-main">
                    <aside className="section-filter">
                        <LandFilter
                            query={query}
                            searchLands={search}
                        />
                    </aside>

                    <main className="section-content">
                        <LandsContent
                            lands={lands}
                            meta={meta}
                            changePage={paginate}
                        />
                    </main>
                </div>
            </section>
        </>
    );
};

export default LandPage;
