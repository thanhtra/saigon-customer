import { logout } from 'lib/api/user-service'
import { PageUrl, ProfileTab } from 'lib/constants/tech'
import { CART_HIDE_POPUP_REQUEST } from 'lib/store/type/cart-type'
import { COMMON_POPUP_FILTER_HIDE, COMMON_POPUP_HIDE, COMMON_POPUP_OPEN, POPUP_ADD_ADDRESS_HIDE } from 'lib/store/type/common-type'
import { UPDATE_USER } from 'lib/store/type/user-type'
import { removeAllLocalStorage } from 'lib/utils/index'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useOnClickOutside from 'use-onclickoutside';
import { useForm } from "react-hook-form"

const Header = () => {
    const router = useRouter()
    const pathname = router.pathname;
    const { tab } = router.query || {};
    const { register, handleSubmit, errors, reset } = useForm();
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.users)
    const { cartItems, showPopupCart } = useSelector(state => state.carts || {})
    const { isPopupOpen } = useSelector(state => state.commons)
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const navRef = useRef(null)
    const searchRef = useRef(null)
    const popupCartRef = useRef(null);
    const [openMenuAccount, setOpenMenuAccount] = useState(false);

    useEffect(() => {
        dispatch({ type: COMMON_POPUP_HIDE });
        dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        dispatch({ type: COMMON_POPUP_FILTER_HIDE });
    }, []);

    useEffect(() => {
        if (!isPopupOpen) {
            setMenuOpen(false);
        }
    }, [isPopupOpen]);

    const handleOpenPopup = () => {
        setMenuOpen(true);
        dispatch({ type: COMMON_POPUP_OPEN });
    };

    const handleClosePopup = () => {
        setMenuOpen(false);

        if (isPopupOpen) {
            dispatch({ type: COMMON_POPUP_HIDE });
        }
    };

    const closeSearch = () => {
        setSearchOpen(false)
    }

    const hidepopupCart = () => {
        dispatch({
            type: CART_HIDE_POPUP_REQUEST
        })
    }

    const expandMenuAccount = () => {
        setOpenMenuAccount(!openMenuAccount);
    }

    const afterLogout = () => {
        dispatch({ type: COMMON_POPUP_FILTER_HIDE });
        removeAllLocalStorage();
        dispatch({
            type: UPDATE_USER,
            payload: {}
        });
        router.push('/');
    }
    const logoutHandle = async () => {
        try {
            handleClosePopup();
            NProgress.start();
            const res = await logout();
            afterLogout();
            NProgress.done();
        } catch (ex) {
            afterLogout();
            NProgress.done();
        }

    }

    const onSubmit = (data) => {
        const { search = '' } = data || {};
        setSearchOpen(false);

        if (pathname.includes(PageUrl.Products)) {
            router.query.keySearch = search
            router.push(router)
        } else {
            router.push('/san-pham?keySearch=' + search);
        }
    }

    const openInputSearch = () => {
        reset({ search: router.query.keySearch || '' });
        setSearchOpen(!searchOpen);
    }

    useOnClickOutside(navRef, handleClosePopup)
    useOnClickOutside(searchRef, closeSearch)
    useOnClickOutside(popupCartRef, hidepopupCart)

    return (
        <header className={`site-header site-header--fixed`}>
            <div className="container">
                <Link href="/">
                    <a >
                        <div className="img-logo" style={{ backgroundImage: 'url(/images/virung.png)' }}></div>
                    </a>
                </Link>
                <nav ref={navRef} className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>
                    <div className='close'>
                        <i className="icon-cancel" onClick={handleClosePopup}></i>
                    </div>

                    <div className='nav-menu'>
                        <Link href={PageUrl.Rental}>
                            <a onClick={handleClosePopup} className={`${pathname.includes(PageUrl.Rental) ? 'active' : ''}`}>Nhà ở cho thuê</a>
                        </Link>

                        <Link href={PageUrl.Lands}>
                            <a onClick={handleClosePopup} className={`${pathname.includes(PageUrl.Lands) ? 'active' : ''}`}>Bất động sản</a>
                        </Link>

                        <Link href={PageUrl.Products}>
                            <a onClick={handleClosePopup} className={`${pathname.includes(PageUrl.Products) ? 'active' : ''}`}>Sản phẩm</a>
                        </Link>


                        {Object.keys(user || {}).length === 0 ? <Link href={PageUrl.Login}>
                            <a className={`site-nav-btn ${pathname.includes(PageUrl.Profile) ? 'active' : ''}`} onClick={handleClosePopup}>Tài khoản</a>
                        </Link> :
                            <div className='menu-item-account'>
                                <p className='site-nav-btn' onClick={expandMenuAccount}>Tài khoản <span className='icon-expand'>{openMenuAccount ? '-' : '+'}</span></p>

                                {openMenuAccount && <div className='menu-account'>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.account } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.account ? 'active' : ''}`}>Thông tin</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_booking } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.manage_booking ? 'active' : ''}`}>Đơn mua</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_post_land } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.manage_post_land ? 'active' : ''}`}>Bài đăng bất động sản</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_post_product } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.manage_post_product ? 'active' : ''}`}>Bài đăng sản phẩm</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.address } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.address ? 'active' : ''}`}>Địa chỉ</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.change_password } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.change_password ? 'active' : ''}`}>Đổi mật khẩu</a>
                                    </Link>

                                    <p className='logout' onClick={logoutHandle}>Đăng xuất</p>
                                </div>}
                            </div>}
                    </div>
                </nav>

                <div className="site-header-actions" ref={searchRef}>
                    <button className={`search-form-wrapper ${searchOpen ? 'search-active' : ''}`}>
                        <form className='search-form' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                            <i className="icon-cancel" onClick={() => setSearchOpen(!searchOpen)}></i>
                            <input type="text"
                                name="search"
                                autoComplete="off"
                                placeholder="Tìm kiếm sản phẩm"
                                ref={register({})}
                            />
                        </form>
                        <i onClick={openInputSearch} className="icon-search"></i>
                    </button>

                    <Link href={PageUrl.ShoppingCart}>
                        <button className="btn-cart">
                            <i className="icon-cart"></i>
                            {cartItems?.length > 0 &&
                                <span className="btn-cart-count">{cartItems.length}</span>
                            }
                        </button>
                    </Link>
                    {Object.keys(user || {}).length === 0 ? <Link href={PageUrl.Login}>
                        <button className="site-header-btn-avatar"><i className="icon-avatar"></i>
                            <p>Đăng nhập</p>
                        </button>
                    </Link> :
                        <Link href={PageUrl.Profile}>
                            <button className="site-header-btn-avatar"><i className="icon-avatar"></i>
                                <p>{user.name}</p>
                            </button>
                        </Link>}
                    <button
                        onClick={handleOpenPopup}
                        className="site-header-btn-menu">
                        <i className="btn-hamburger"><span></span></i>
                    </button>

                    {showPopupCart && <div className="popup-cart" ref={popupCartRef}>
                        <p className="txt">Thêm sản phẩm thành công</p>

                        <Link href={PageUrl.ShoppingCart}>
                            <button type="button" className="btn btn-green" onClick={hidepopupCart}>Xem giỏ hàng</button>
                        </Link>
                    </div>}
                </div>
            </div >
        </header >
    )
}

export default Header
