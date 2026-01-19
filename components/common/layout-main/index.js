import Header from 'components/common/header';
import Footer from 'components/common/footer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import clsx from 'clsx';
import PostFreePopup from 'components/common/post-free-popup';

const Layout = ({ children }) => {
    const { pathname } = useRouter();

    const {
        isPopupOpen,
        isPopupFilterOpen,
        isPopupAddAddressOpen,
        isPopupPostFree
    } = useSelector((state) => state.commons);

    const isPopupActive = useMemo(
        () => isPopupOpen || isPopupFilterOpen || isPopupAddAddressOpen || isPopupPostFree,
        [isPopupOpen, isPopupFilterOpen, isPopupAddAddressOpen, isPopupPostFree]
    );

    const isShowContact = useMemo(
        () =>
            pathname.includes('bat-dong-san') &&
            !pathname.includes('dang-tin-bat-dong-san'),
        [pathname]
    );

    const showSearchIcon = pathname.startsWith('/nha-o-cho-thue')
    const hideFooter = pathname.startsWith('/nha-o-cho-thue') || pathname.startsWith('/tai-khoan');

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

            <div
                className={clsx('contact-action', {
                    hide: !isShowContact
                })}
            >
                <a
                    className="btn btn_call zalo"
                    href="https://zalo.me/0968922006"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Zalo
                </a>

                <a
                    className="btn btn_call"
                    href="tel:0968922006"
                >
                    Bấm gọi
                </a>
            </div>
        </div>
    );
};

export default Layout;
