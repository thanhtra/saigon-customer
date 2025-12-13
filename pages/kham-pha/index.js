import Breadcrumb from 'components/common/breadcrumb';
import DiscoveriesContent from 'components/discovery/discoveries-content';
import DiscoveryFilter from 'components/discovery/discovery-filter';
import { getDiscoveries } from 'lib/api/discovery-service';
import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps({ query }) {
    const payload = Object.keys(query) !== 0 ? query : {
        page: 0,
        size: 10
    };

    const res = await getDiscoveries(payload);
    return {
        props: {
            discoveries: res?.data || [],
            meta: res?.meta || {}
        },
    }
}

const Discover = ({ discoveries, meta }) => {
    const router = useRouter();
    const [query, setQuery] = useState({});

    const searchDiscoveriesHandle = (payload) => {
        const newQuery = { ...payload, page: 0 };

        setQuery(newQuery);
        router.query = newQuery;
        router.push(router);
    }

    const changePageHandle = (pageNumber) => {
        const page = pageNumber < 0 ? 0 : pageNumber;
        const newQuery = { ...query, page: page };
        setQuery(newQuery);
        router.query = newQuery;
        router.push(router);
    }

    return (
        <>
            <section className="container discoveries-page">
                <Breadcrumb title={`Tất cả ${meta?.itemCount} bài viết`} />

                <div className='discoveries-main'>
                    <div className='section-filter'>
                        <DiscoveryFilter searchDiscoveries={searchDiscoveriesHandle} query={router.query} />
                    </div>
                    <div className='section-content'>
                        <DiscoveriesContent discoveries={discoveries} meta={meta} changePage={changePageHandle} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Discover
