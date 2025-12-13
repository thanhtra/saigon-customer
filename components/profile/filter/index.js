import { logout } from 'lib/api/user-service';
import { ProfileTab } from 'lib/constants/constant';
import { removeAllLocalStorage } from 'lib/utils/index';
import { useDispatch } from 'react-redux';
import { UPDATE_USER } from 'lib/store/type/user-type';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { PageUrl } from 'lib/constants/constant';
import Link from 'next/link';

const ProfileFilter = ({ tab }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const afterLogout = () => {
        removeAllLocalStorage();
        dispatch({
            type: UPDATE_USER,
            payload: {}
        });
        router.push('/');
    }
    const logoutHandle = async () => {
        try {
            NProgress.start();
            const res = await logout();
            afterLogout();

            NProgress.done();
        } catch (ex) {
            afterLogout();
            NProgress.done();
        }

    }

    return (
        <div className='profiles-menu-desktop'>
            <p className='filter-title'>Tài khoản</p>

            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.account } }}>
                <a className={`${tab === ProfileTab.account || !tab ? 'active' : ''}`}>Thông tin</a>
            </Link>
            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_booking } }}>
                <a className={`${tab === ProfileTab.manage_booking ? 'active' : ''}`}>Đơn mua</a>
            </Link>
            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_post_land } }}>
                <a className={`${tab === ProfileTab.manage_post_land ? 'active' : ''}`}>Bài đăng bất động sản</a>
            </Link>
            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.manage_post_product } }}>
                <a className={`${tab === ProfileTab.manage_post_product ? 'active' : ''}`}>Bài đăng sản phẩm</a>
            </Link>
            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.address } }}>
                <a className={`${tab === ProfileTab.address ? 'active' : ''}`}>Địa chỉ</a>
            </Link>
            <Link href={{ pathname: PageUrl.Profile, query: { tab: ProfileTab.change_password } }}>
                <a className={`${tab === ProfileTab.change_password ? 'active' : ''}`}>Đổi mật khẩu</a>
            </Link>

            <p onClick={logoutHandle}>Đăng xuất</p>
        </div>
    )
}

export default ProfileFilter
