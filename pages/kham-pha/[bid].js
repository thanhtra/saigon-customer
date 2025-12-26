import Breadcrumb from 'components/common/breadcrumb';
import DiscoveryContent from 'components/discovery/discovery-content';
import DiscoveryDescription from 'components/discovery/discovery-description';
import DiscoveryGallery from 'components/discovery/discovery-gallery';
import { getDiscoveryDetail } from 'lib/api/discovery-service';
import { PageUrl } from 'lib/constants/tech';
import Link from 'next/link';

export async function getServerSideProps({ params }) {
    const { bid } = params;
    const res = await getDiscoveryDetail(bid);

    return {
        props: {
            data: res?.result || {}
        },
    }
}

const DiscoverDetail = (props) => {
    return (
        <>
            <section className="container discovery-detail-page">
                <Breadcrumb menu={PageUrl.Discoveries} title={props?.data?.title} />

                <div className="discovery-single-content">
                    <DiscoveryGallery images={props?.data?.images} />
                    <DiscoveryContent discovery={props?.data} />
                </div>

                <div className="discovery-single-info">
                    <DiscoveryDescription discovery={props?.data} />
                </div>

                <div className="group-btn">
                    <Link href="/thong-tin/du-lich">
                        <button type="button" className="btn btn-border">Dịch vụ du lịch</button>
                    </Link>
                </div>
            </section>

        </>
    )
}

export default DiscoverDetail
