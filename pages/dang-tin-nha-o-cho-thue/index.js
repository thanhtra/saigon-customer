import Breadcrumb from 'components/common/breadcrumb';
import { useEffect } from 'react';
import { ProfileTab } from 'lib/constants/tech';
import PostRoomCreate from 'components/post-room/post-room-create';
import { PageUrl } from 'lib/constants/tech';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';

const PostRoomPage = () => {
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
        router.push(`${PageUrl.Profile}?tab=${ProfileTab.ManagePostRental}`)
    }

    return (
        <>
            {user && user?.id && <section className="container post-room-page">
                <Breadcrumb menu={PageUrl.Rooms} title='Đăng tin nhà ở cho thuê' />

                <div className='post-room'>
                    <PostRoomCreate slug={slug} displayList={displayListHandle} />
                </div>
            </section>}
        </>
    )
}

export default PostRoomPage
