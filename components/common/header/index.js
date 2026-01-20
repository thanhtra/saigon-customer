import { PageUrl, ProfileTab } from 'lib/constants/tech'
import {
    POPUP_FILTER_HIDE, POPUP_HIDE, POPUP_OPEN,
    POPUP_ADD_ADDRESS_HIDE, POPUP_FILTER_OPEN, POPUP_POST_FREE_OPEN
} from 'lib/store/type/common-type'
import { UPDATE_USER } from 'lib/store/type/user-type'
import { removeAllLocalStorage } from 'lib/utils/index'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useOnClickOutside from 'use-onclickoutside';
import { useForm } from "react-hook-form";
import { logout } from 'lib/api/auth.api';
import { REMOVE_USER } from 'lib/store/type/user-type';



const Header = ({ showSearchIcon = false }) => {
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

    const isFilterPage =
        pathname.includes(PageUrl.Rental) ||
        pathname.includes(PageUrl.Lands);


    useEffect(() => {
        dispatch({ type: POPUP_HIDE });
        dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        dispatch({ type: POPUP_FILTER_HIDE });
    }, []);

    useEffect(() => {
        if (!isPopupOpen) {
            setMenuOpen(false);
        }
    }, [isPopupOpen]);

    const handleOpenPopup = () => {
        setMenuOpen(true);
        dispatch({ type: POPUP_OPEN });
    };

    const handleClosePopup = () => {
        setMenuOpen(false);

        if (isPopupOpen) {
            dispatch({ type: POPUP_HIDE });
        }
    };

    const closeSearch = () => {
        setSearchOpen(false)
    }

    const expandMenuAccount = () => {
        setOpenMenuAccount(!openMenuAccount);
    }

    const afterLogout = () => {
        dispatch({ type: POPUP_FILTER_HIDE });
        removeAllLocalStorage();
        dispatch({
            type: UPDATE_USER,
            payload: {}
        });
        router.push('/');
    }

    // const logoutHandle = async () => {
    //     try {
    //         handleClosePopup();
    //         NProgress.start();
    //         const res = await logout();
    //         afterLogout();
    //         NProgress.done();
    //     } catch (ex) {
    //         afterLogout();
    //         NProgress.done();
    //     }
    // }

    const logoutHandle = async () => {
        try {
            await logout();
        } catch (e) { }

        dispatch({ type: REMOVE_USER });

        window.location.href = '/';
    };


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

    // const openInputSearch = () => {
    //     reset({ search: router.query.keySearch || '' });
    //     setSearchOpen(!searchOpen);
    // }
    const openSearchOrFilter = () => {
        // Trang nhà thuê / BĐS → mở FILTER
        if (
            pathname.includes(PageUrl.Rental) ||
            pathname.includes(PageUrl.Lands)
        ) {
            dispatch({ type: POPUP_FILTER_OPEN });
            return;
        }

        // Trang khác → search text
        reset({ search: router.query.keySearch || '' });
        setSearchOpen(true);
    };

    useOnClickOutside(navRef, handleClosePopup)
    useOnClickOutside(searchRef, closeSearch)

    return (
        <header className={`site-header site-header--fixed`}>
            <div className="container">
                <Link href="/">
                    <a >
                        <div className="img-logo" style={{ backgroundImage: 'url(/images/logo.png)' }}></div>
                    </a>
                </Link>
                <nav ref={navRef} className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>

                    <div className="mobile-nav-header">
                        <span>Menu</span>
                        <i className="icon-cancel" onClick={handleClosePopup}></i>
                    </div>

                    <div className='nav-menu'>
                        <Link href={PageUrl.Rental}>
                            <a onClick={handleClosePopup} className={`${pathname.includes(PageUrl.Rental) ? 'active' : ''}`}>Nhà ở cho thuê</a>
                        </Link>

                        <a
                            href="https://zalo.me/0968922006"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClosePopup}
                            className="cursor-pointer"
                        >
                            Bất động sản
                        </a>

                        <a
                            href="https://collshp.com/dacsantaynguyen"
                            onClick={handleClosePopup}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${pathname.includes(PageUrl.Products) ? 'active' : ''}`}
                        >
                            Sản phẩm
                        </a>

                        {Object.keys(user || {}).length === 0 ? <Link href={PageUrl.Login}>
                            <a className={`site-nav-btn ${pathname.includes(PageUrl.Profile) ? 'active' : ''}`} onClick={handleClosePopup}>Tài khoản</a>
                        </Link> :
                            <div className='menu-item-account'>
                                <p className='site-nav-btn' onClick={expandMenuAccount}>Tài khoản <span className='icon-expand'>{openMenuAccount ? '-' : '+'}</span></p>

                                {openMenuAccount && <div className='menu-account'>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.Account } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.Account ? 'active' : ''}`}>Thông tin</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ManageBooking } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.ManageBooking ? 'active' : ''}`}>Lịch xem nhà</a>
                                    </Link>
                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ManagePostRental } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.ManagePostRental ? 'active' : ''}`}>Nhà của tôi</a>
                                    </Link>

                                    <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ChangePassword } }}>
                                        <a onClick={handleClosePopup} className={`${tab === ProfileTab.ChangePassword ? 'active' : ''}`}>Đổi mật khẩu</a>
                                    </Link>

                                    <p className='logout' onClick={logoutHandle}>Đăng xuất</p>
                                </div>}
                            </div>}
                    </div>
                </nav>

                <div className="site-header-actions" ref={searchRef}>
                    <button
                        className="site-header-btn-post"
                        onClick={() => dispatch({ type: POPUP_POST_FREE_OPEN })}
                    >
                        <i className="icon-plus-css"></i>
                        Đăng tin miễn phí
                    </button>

                    {showSearchIcon && (
                        <button className={`search-form-wrapper ${searchOpen && !isFilterPage ? 'search-active' : ''}`}>
                            <form className='search-form' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                <i className="icon-cancel" onClick={() => setSearchOpen(!searchOpen)}></i>
                                <input type="text"
                                    name="search"
                                    autoComplete="off"
                                    placeholder="Tìm kiếm sản phẩm"
                                    {...register('search')}
                                />
                            </form>
                            <i onClick={openSearchOrFilter} className="icon-search"></i>
                        </button>
                    )}

                    {/* <Link href={PageUrl.ShoppingCart}>
                        <button className="btn-cart">
                            <i className="icon-cart"></i>
                            {cartItems?.length > 0 &&
                                <span className="btn-cart-count">{cartItems.length}</span>
                            }
                        </button>
                    </Link> */}



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
                </div>
            </div >
        </header >
    )
}

export default Header
