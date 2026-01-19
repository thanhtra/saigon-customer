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
    { tab: ProfileTab.Account, label: 'Thông tin' },
    { tab: ProfileTab.ManageBooking, label: 'Lịch xem nhà' },
    { tab: ProfileTab.ManagePostRental, label: 'Nhà ở cho thuê' },
    // { tab: ProfileTab.ManagePostProduct, label: 'Bài đăng sản phẩm' },
    // { tab: ProfileTab.address, label: 'Địa chỉ' },
    { tab: ProfileTab.ChangePassword, label: 'Đổi mật khẩu' },
    { tab: ProfileTab.Logout, label: 'Đăng xuất', danger: true },
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
            {PROFILE_MENUS.map(({ tab: menuTab, label, danger }) => {
                if (menuTab === ProfileTab.Logout) {
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

                return (
                    <Link
                        key={menuTab}
                        href={{ pathname: PageUrl.Profile, query: { tab: menuTab } }}
                    >
                        <a
                            className={clsx('profile-item', {
                                active:
                                    tab === menuTab ||
                                    (!tab && menuTab === ProfileTab.Account),
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
