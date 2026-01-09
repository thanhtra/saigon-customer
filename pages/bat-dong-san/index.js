import Breadcrumb from 'components/common/breadcrumb';
import LandFilter from 'components/land/land-filter';
import LandsContent from 'components/land/lands-content';
import { getLands } from 'lib/api/land.service';
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

    const res = await getLands(payload);
    return {
        props: {
            lands: res?.data || [],
            meta: res?.meta || {}
        },
    }
}

const Lands = ({ lands, meta }) => {
    const router = useRouter();
    const [query, setQuery] = useState({});
    const dispatch = useDispatch()

    const searchLandsHandle = (payload) => {
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

    const postLand = () => {
        dispatch({
            type: COMMON_URL_REDIRECT_LOGIN,
            payload: PageUrl.PostLand
        })
    }

    return (
        <>
            <section className="container lands-page">
                <Breadcrumb title={`Tất cả ${meta?.itemCount} bất động sản`} />

                <div className='lands-main'>
                    <div className='section-filter'>
                        <LandFilter searchLands={searchLandsHandle} query={router.query} />
                    </div>
                    <div className='section-content'>
                        <div className='btn-head'>
                            <Link href={PageUrl.PostLand}>
                                <button type='button' className="btn" onClick={postLand}>
                                    Đăng tin miễn phí
                                </button>
                            </Link>
                        </div>
                        <LandsContent lands={lands} meta={meta} changePage={changePageHandle} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Lands
