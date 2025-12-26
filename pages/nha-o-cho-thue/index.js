import Breadcrumb from 'components/common/breadcrumb';
import LandFilter from 'components/land/land-filter';
import LandsContent from 'components/land/lands-content';
import { getRentals } from 'lib/api/rental.service';
import { PageUrl } from 'lib/constants/tech';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export async function getServerSideProps({ query }) {
    const payload = Object.keys(query) !== 0 ? query : {
        page: 0,
        size: 10
    };

    const res = await getRentals(payload);
    return {
        props: {
            lands: res?.data || [],
            meta: res?.meta || {}
        },
    }
}

const Rental = ({ lands, meta }) => {
    const router = useRouter();
    const [query, setQuery] = useState({});
    const dispatch = useDispatch()

    const searchRentalsHandle = (payload) => {
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
            <section className="container rentals-page">
                <Breadcrumb title={`Tất cả ${meta?.itemCount} nhà ở cho thuê`} />

                <div className='lands-main'>
                    <div className='section-filter'>
                        <LandFilter searchLands={searchRentalsHandle} query={router.query} />
                    </div>
                    <div className='section-content'>
                        <LandsContent lands={lands} meta={meta} changePage={changePageHandle} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Rental
