import Header from 'components/common/header';
import Footer from 'components/common/footer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const router = useRouter();
    const pathname = router.pathname;
    const { isPopupOpen, isPopupFilterOpen, isPopupAddAddressOpen } = useSelector(state => state.commons);
    const isShow = pathname.includes('bat-dong-san') && !pathname.includes('dang-tin-bat-dong-san');

    return (
        <div className={clsx({
            'app-main': true,
            'popup-open': isPopupOpen || isPopupFilterOpen || isPopupAddAddressOpen
        })}>
            <Header />

            <main className='main-page'>
                {children}
            </main>

            <Footer />

            <div className={`contact-action ${isShow ? '' : 'hide'}`}>
                <a className="btn btn_call zalo" target="_blank" href="https://zalo.me/0968922006">
                    Zalo
                </a>

                <a className="btn btn-green btn_call" href="tel://0968922006">
                    Bấm gọi
                </a>
            </div>
        </div>
    )
}

export default Layout