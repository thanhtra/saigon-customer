import Breadcrumb from 'components/common/breadcrumb';
import { useEffect } from 'react';
import { ProfileTab } from 'lib/constants/data';
import PostLandCreate from 'components/post-land/post-land-create';
import { PageUrl } from 'lib/constants/tech';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';

const Page = () => {
    const router = useRouter();
    const { user } = useSelector(state => state.users);
    const { slug = '' } = router.query || {};
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user || !user?.id) {
            router.push(PageUrl.Login);
        } else {
            dispatch({
                type: COMMON_URL_REDIRECT_LOGIN,
                payload: ''
            })
        }
    }, [user?.id]);

    const displayListHandle = () => {
        router.push(`${PageUrl.Profile}?tab=${ProfileTab.manage_post_land}`)
    }

    return (
        <>
            {user && user?.id && <section className="container post-land-page">
                <Breadcrumb menu={PageUrl.PostRentalRoom} title='Đăng tin phòng trọ' />

                <div className='post-land'>
                    <PostLandCreate slug={slug} displayList={displayListHandle} />
                </div>
            </section>}
        </>
    )
}

export default Page
