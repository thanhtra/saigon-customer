import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import NProgress from 'nprogress';

import { logout } from 'lib/api/auth.api';
import { ProfileTab, PageUrl } from 'lib/constants/tech';
import { REMOVE_USER } from 'lib/store/type/user-type';

const PROFILE_MENUS = [
    { tab: ProfileTab.account, label: 'Thông tin' },
    { tab: ProfileTab.manage_booking, label: 'Lịch xem nhà' },
    { tab: ProfileTab.manage_post_land, label: 'Nhà của tôi' },
    // { tab: ProfileTab.manage_post_product, label: 'Bài đăng sản phẩm' },
    // { tab: ProfileTab.address, label: 'Địa chỉ' },
    { tab: ProfileTab.change_password, label: 'Đổi mật khẩu' },
    { tab: 'logout', label: 'Đăng xuất', danger: true },
];

const ProfileFilter = ({ tab }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const logoutHandle = useCallback(async () => {
        NProgress.start();
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: REMOVE_USER });
            // router.replace('/');
            window.location.href = '/';
            NProgress.done();
        }
    }, [dispatch, router]);


    return (
        <div className="profiles-menu-desktop">
            {/* <p className="filter-title">Tài khoản</p> */}

            {PROFILE_MENUS.map(({ tab: menuTab, label, danger }) => {
                // ===== Logout tab =====
                if (menuTab === 'logout') {
                    return (
                        <button
                            key="logout"
                            type="button"
                            onClick={logoutHandle}
                            className="profile-item btn-logout"
                        >
                            {label}
                        </button>
                    );
                }

                // ===== Normal tabs =====
                return (
                    <Link
                        key={menuTab}
                        href={{ pathname: PageUrl.Profile, query: { tab: menuTab } }}
                    >
                        <a
                            className={clsx('profile-item', {
                                active:
                                    tab === menuTab ||
                                    (!tab && menuTab === ProfileTab.account),
                            })}
                        >
                            {label}
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default ProfileFilter;
