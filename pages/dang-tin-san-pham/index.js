import Breadcrumb from 'components/common/breadcrumb';
import { useEffect } from 'react';
import { ProfileTab } from 'lib/constants/constant';
import PostProduct from 'components/product/post-product';
import { PageUrl } from 'lib/constants/constant';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';

const PostProductPage = () => {
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
        router.push(`${PageUrl.Profile}?tab=${ProfileTab.manage_post_product}`)
    }

    return (
        <>
            {user && user?.id && <section className="container post-product-page">
                <Breadcrumb menu={PageUrl.Products} title='Đăng tin sản phẩm' />

                <div className='post-product'>
                    <PostProduct slug={slug} displayList={displayListHandle} />
                </div>
            </section>}
        </>
    )
}

export default PostProductPage
