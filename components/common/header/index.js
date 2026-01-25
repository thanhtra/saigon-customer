import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState, startTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { PageUrl, ProfileTab } from 'lib/constants/tech';
import {
    POPUP_FILTER_HIDE,
    POPUP_HIDE,
    POPUP_OPEN,
    POPUP_ADD_ADDRESS_HIDE,
    POPUP_FILTER_OPEN,
    POPUP_POST_FREE_OPEN,
} from 'lib/store/type/common-type';

import { logout } from 'lib/api/auth.api';
import { REMOVE_USER } from 'lib/store/type/user-type';

const PHONE_ZALO = '0968922006';

const Header = ({ showSearchIcon = false }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const pathname = router.pathname;
    const { tab } = router.query || {};

    const { user } = useSelector((state) => state.users);
    const { isPopupOpen } = useSelector((state) => state.commons);

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [openMenuAccount, setOpenMenuAccount] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    const isFilterPage = useMemo(() => {
        return pathname.includes(PageUrl.Rental) || pathname.includes(PageUrl.Lands);
    }, [pathname]);

    const isLoggedIn = useMemo(() => {
        return !!user && Object.keys(user).length > 0;
    }, [user]);

    /* =========================================
     * INIT: reset popup state on mount (optional)
     * ========================================= */
    useEffect(() => {
        // ✅ defer để tránh block render
        const t = setTimeout(() => {
            dispatch({ type: POPUP_HIDE });
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
            dispatch({ type: POPUP_FILTER_HIDE });
        }, 0);

        return () => clearTimeout(t);
    }, [dispatch]);

    /* =========================================
     * SYNC: if global popup closed => close menu
     * ========================================= */
    useEffect(() => {
        if (!isPopupOpen) setMenuOpen(false);
    }, [isPopupOpen]);

    /* =========================================
     * LOCK SCROLL when menu open
     * ========================================= */
    useEffect(() => {
        if (!menuOpen) return;

        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');

        return () => {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        };
    }, [menuOpen]);

    /* =========================================
     * HANDLERS (FAST)
     * ========================================= */
    const openMenu = useCallback(() => {
        // ✅ open UI first (instant)
        setOpenMenuAccount(false);
        setMenuOpen(true);

        // ✅ redux dispatch after UI open
        startTransition(() => {
            dispatch({ type: POPUP_OPEN });
        });
    }, [dispatch]);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);

        startTransition(() => {
            dispatch({ type: POPUP_HIDE });
        });
    }, [dispatch]);

    const toggleMenuAccount = useCallback(() => {
        if (!isLoggedIn) {
            router.push(PageUrl.Login);
            return;
        }

        setOpenMenuAccount((prev) => !prev);
    }, [isLoggedIn, router]);


    const closeSearch = useCallback(() => {
        setSearchOpen(false);
    }, []);

    const openSearchOrFilter = useCallback(() => {
        // Trang nhà thuê / đất => mở filter
        if (pathname.includes(PageUrl.Rental) || pathname.includes(PageUrl.Lands)) {
            dispatch({ type: POPUP_FILTER_OPEN });
            return;
        }

        // Trang khác => mở input search
        reset({ search: router.query.keySearch || '' });
        setSearchOpen(true);
    }, [dispatch, pathname, reset, router.query.keySearch]);

    const logoutHandle = useCallback(async () => {
        try {
            await logout();
        } catch (e) { }

        dispatch({ type: REMOVE_USER });

        // ✅ hard reload to clean state nhanh + chắc
        window.location.href = '/';
    }, [dispatch]);

    const onSubmit = useCallback(
        (data) => {
            const search = data?.search?.trim() || '';
            closeSearch();

            if (pathname.includes(PageUrl.Products)) {
                router.push({
                    pathname: router.pathname,
                    query: { ...router.query, keySearch: search },
                });
            } else {
                router.push(`/san-pham?keySearch=${encodeURIComponent(search)}`);
            }
        },
        [closeSearch, pathname, router]
    );

    const onClickNavItem = useCallback(() => {
        closeMenu();
    }, [closeMenu]);

    return (
        <header className="site-header site-header--fixed">
            <div className="container">
                {/* LOGO */}
                <Link href="/">
                    <a className="site-logo" aria-label="Trang chủ">
                        <div className="img-logo" style={{ backgroundImage: 'url(/images/logo.png)' }} />
                    </a>
                </Link>

                {/* ✅ Overlay click outside (FAST) */}
                {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}

                {/* NAV */}
                <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>
                    <div className="mobile-nav-header">
                        <span>Menu</span>
                        <i className="icon-cancel" onClick={closeMenu} />
                    </div>

                    <div className="nav-menu">
                        <Link href={PageUrl.Rental}>
                            <a onClick={onClickNavItem} className={pathname.includes(PageUrl.Rental) ? 'active' : ''}>
                                Nhà ở cho thuê
                            </a>
                        </Link>

                        <a
                            href={`https://zalo.me/${PHONE_ZALO}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClickNavItem}
                            className="cursor-pointer"
                        >
                            Bất động sản
                        </a>

                        <Link href={PageUrl.Products}>
                            <a onClick={onClickNavItem} className={pathname.includes(PageUrl.Products) ? 'active' : ''}>
                                Sản phẩm
                            </a>
                        </Link>


                        <div className="menu-item-account">
                            <button type="button" className="site-nav-btn btn-account" onClick={toggleMenuAccount}>
                                Tài khoản <span className="icon-expand">{openMenuAccount ? '-' : '+'}</span>
                            </button>

                            <div className={`menu-account ${openMenuAccount ? 'open' : ''}`}>
                                <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.Account } }}>
                                    <a onClick={onClickNavItem} className={tab === ProfileTab.Account ? 'active' : ''}>
                                        Thông tin
                                    </a>
                                </Link>

                                <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ManageBooking } }}>
                                    <a onClick={onClickNavItem} className={tab === ProfileTab.ManageBooking ? 'active' : ''}>
                                        Lịch xem nhà
                                    </a>
                                </Link>

                                <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ManagePostRental } }}>
                                    <a
                                        onClick={onClickNavItem}
                                        className={tab === ProfileTab.ManagePostRental ? 'active' : ''}
                                    >
                                        Nhà của tôi
                                    </a>
                                </Link>

                                <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.ChangePassword } }}>
                                    <a onClick={onClickNavItem} className={tab === ProfileTab.ChangePassword ? 'active' : ''}>
                                        Đổi mật khẩu
                                    </a>
                                </Link>

                                <button type="button" className="logout" onClick={logoutHandle}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* ACTIONS */}
                <div className="site-header-actions">
                    <button
                        className="site-header-btn-post"
                        onClick={() => dispatch({ type: POPUP_POST_FREE_OPEN })}
                        type="button"
                    >
                        <i className="icon-plus-css" />
                        Đăng tin miễn phí
                    </button>

                    {showSearchIcon && (
                        <div className={`search-form-wrapper ${searchOpen && !isFilterPage ? 'search-active' : ''}`}>
                            <form className="search-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                <i className="icon-cancel" onClick={closeSearch} />
                                <input type="text" name="search" autoComplete="off" placeholder="Tìm kiếm sản phẩm" {...register('search')} />
                            </form>

                            <i onClick={openSearchOrFilter} className="icon-search" />
                        </div>
                    )}

                    {!isLoggedIn ? (
                        <Link href={PageUrl.Login}>
                            <button className="site-header-btn-avatar" type="button">
                                <i className="icon-avatar" />
                                <p>Đăng nhập</p>
                            </button>
                        </Link>
                    ) : (
                        <Link href={PageUrl.Profile}>
                            <button className="site-header-btn-avatar" type="button">
                                <i className="icon-avatar" />
                                <p>{user.name}</p>
                            </button>
                        </Link>
                    )}

                    <button onClick={openMenu} className="site-header-btn-menu" type="button">
                        <i className="btn-hamburger">
                            <span />
                        </i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
