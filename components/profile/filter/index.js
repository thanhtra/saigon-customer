import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { logout } from 'lib/api/auth.api';
import { PageUrl, ProfileTab } from 'lib/constants/tech';
import { REMOVE_USER } from 'lib/store/type/user-type';
import { UserRole } from 'lib/constants/tech';
import { useSelector } from 'react-redux';

const PROFILE_MENUS = [
    { tab: ProfileTab.Account, label: 'Thông tin' },

    { tab: ProfileTab.ManageBooking, label: 'Lịch xem nhà' },

    {
        tab: ProfileTab.ManageCustomers,
        label: 'Khách của tôi',
        roles: [
            UserRole.Admin,
            UserRole.Sale,
        ],
    },

    {
        tab: ProfileTab.ManagePostRental,
        label: 'Nhà ở cho thuê',
        roles: [
            UserRole.Admin,
            UserRole.Sale,
            UserRole.Owner,
            UserRole.Broker,
        ],
    },

    { tab: ProfileTab.ChangePassword, label: 'Đổi mật khẩu' },

    { tab: ProfileTab.Logout, label: 'Đăng xuất', danger: true },
];


const ProfileFilter = ({ tab }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector(state => state.users)

    const logoutHandle = useCallback(async () => {
        NProgress.start();
        try {
            await logout();
        } catch (error) {
            // console.error('Logout error:', error);
        } finally {
            dispatch({ type: REMOVE_USER });
            window.location.href = '/';
            NProgress.done();
        }
    }, [dispatch, router]);


    return (
        <div className="profiles-menu-desktop">
            {PROFILE_MENUS
                .filter(({ roles }) => {
                    if (!roles) return true;
                    return roles.includes(user?.role);
                })
                .map(({ tab: menuTab, label, danger }) => {
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
