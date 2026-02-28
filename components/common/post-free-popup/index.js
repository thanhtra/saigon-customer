import { useDispatch, useSelector } from 'react-redux'
import { POPUP_POST_FREE_HIDE } from 'lib/store/type/common-type'
import { PageUrl } from 'lib/constants/tech'
import { useRouter } from 'next/router'

const PostFreePopup = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { isPopupPostFree } = useSelector(state => state.commons)

    if (!isPopupPostFree) return null

    const goTo = (url) => {
        dispatch({ type: POPUP_POST_FREE_HIDE })
        router.push(url)
    }


    return (
        <div className="post-free-popup-overlay">
            <div className="popup-post-free">
                <h3>Chọn lĩnh vực đăng tin</h3>

                <div className="post-options">
                    <button onClick={() => goTo(PageUrl.PostRental)}>
                        🏠 Nhà ở cho thuê
                    </button>

                    {/* <button onClick={() => goTo(PageUrl.PostLand)}>
                        🏢 Bất động sản
                    </button> */}
                </div>

                <button
                    className="btn-guide"
                    onClick={() => goTo(PageUrl.RentalGuide)}
                >
                    📘 Hướng dẫn đăng tin cho người mới
                </button>

                <button
                    className="btn-youtube"
                    onClick={() =>
                        window.open(
                            "https://www.youtube.com/watch?v=iggqJO7N9Q4&t=5s",
                            "_blank"
                        )
                    }
                >
                    ▶️ Xem video hướng dẫn đăng tin
                </button>

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
