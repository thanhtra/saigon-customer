import clsx from 'clsx';
import Footer from 'components/common/footer';
import Header from 'components/common/header';
import PostFreePopup from 'components/common/post-free-popup';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
    const { pathname } = useRouter();

    const {
        isPopupOpen,
        isPopupFilterOpen,
        isPopupPostFree
    } = useSelector((state) => state.commons);

    const isPopupActive = useMemo(
        () => isPopupOpen || isPopupFilterOpen || isPopupPostFree,
        [isPopupOpen, isPopupFilterOpen, isPopupPostFree]
    );

    const showSearchIcon = pathname.startsWith('/nha-o-cho-thue') || pathname.startsWith('/bat-dong-san')
    const hideFooter = pathname.startsWith('/nha-o-cho-thue') || pathname.startsWith('/tai-khoan') || pathname.startsWith('/bat-dong-san');

    return (
        <div
            className={clsx('app-main', {
                'popup-open': isPopupActive
            })}
        >

            <Header showSearchIcon={showSearchIcon} />

            <PostFreePopup />

            <main className="main-page">
                {children}
            </main>

            {!hideFooter && <Footer />}
        </div>
    );
};

export default Layout;
