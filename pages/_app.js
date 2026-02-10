
import 'assets/css/main.scss';
import Layout from 'components/common/layout-main';
import { wrapper } from 'lib/store';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import AuthInitializer from 'components/auth/AuthInitializer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

NProgress.configure({ easing: 'ease', showSpinner: false });



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
                >
                    <AuthInitializer>
                        <Layout>
                            <ToastContainer autoClose={2000} />
                            <Component {...pageProps} />
                        </Layout>
                    </AuthInitializer>
                </PersistGate>
            </Provider>
        </>
    );
}

export default MyApp;
