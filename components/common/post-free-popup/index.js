import { useDispatch, useSelector } from 'react-redux'
import { POPUP_POST_FREE_HIDE } from 'lib/store/type/common-type'
import { PageUrl } from 'lib/constants/tech'
import { useRouter } from 'next/router'

const PostFreePopup = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { isPopupPostFree } = useSelector(state => state.commons)

    if (!isPopupPostFree) return null

    const goToPost = (url) => {
        dispatch({ type: POPUP_POST_FREE_HIDE })
        router.push(url)
    }

    return (
        <div className="post-free-popup-overlay">
            <div className="popup-post-free">
                <h3>Chọn lĩnh vực đăng tin</h3>

                <div className="post-options">
                    <button onClick={() => goToPost(PageUrl.PostRental)}>
                        🏠 Nhà ở cho thuê
                    </button>

                    {/* <button onClick={() => goToPost(PageUrl.PostLand)}>
                        🏢 Bất động sản
                    </button> */}
                </div>

                <span
                    className="popup-close"
                    onClick={() => dispatch({ type: POPUP_POST_FREE_HIDE })}
                >
                    ✕
                </span>
            </div>
        </div>
    )
}

export default PostFreePopup
