'use client';

import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { wrapper } from 'lib/store';
import Layout from 'components/common/layout-main';
import { useAuthInit } from 'hooks/useAuthInit';

import 'assets/css/main.scss';
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


NProgress.configure({ easing: 'ease', showSpinner: false });

/* =====================
   Auth Initializer
===================== */
function AuthInitializer({ children }) {
    useAuthInit(); // ✅ BÂY GIỜ ĐÃ CÓ PROVIDER
    return children;
}

function MyApp({ Component, ...rest }) {
    const { store, props } = wrapper.useWrappedStore(rest);
    const { pageProps } = props;

    useEffect(() => {
        const start = () => NProgress.start();
        const done = () => NProgress.done();

        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', done);
        Router.events.on('routeChangeError', done);

        return () => {
            Router.events.off('routeChangeStart', start);
            Router.events.off('routeChangeComplete', done);
            Router.events.off('routeChangeError', done);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Tìm một nơi ở tốt</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Provider store={store}>
                <PersistGate
                    persistor={store.__persistor}
                    loading={<div style={{ paddingTop: 300, textAlign: 'center' }}>Đang tải...</div>}
                >
                    <AuthInitializer>
                        <Layout>
                            <ToastContainer
                                position="top-right"
                                autoClose={2000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                            <Component {...pageProps} />
                        </Layout>
                    </AuthInitializer>
                </PersistGate>
            </Provider>
        </>
    );
}

export default MyApp;
