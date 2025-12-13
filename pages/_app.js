import { makeStore, wrapper } from 'lib/store/index';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from '../components/common/layout-main';
import Head from 'next/head';
import 'assets/css/main.scss';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';


NProgress.configure({
    easing: 'ease',
    showSpinner: false,
});

Router.events.on('routeChangeStart', () => {
    NProgress.start();
    NProgress.set(0.9);
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())


const MyApp = ({ Component, pageProps }) => {
    const store = makeStore();

    return (
        <>
            <Head>
                <title>Đặc sản - Khám phá - Bất động sản Đăk Nông</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Layout>
                <PersistGate persistor={store.__persistor} loading={<div style={{ textAlign: 'center', paddingTop: '300px' }}>Đang tải...</div>}>
                    <Fragment>
                        <ToastContainer autoClose={2500} hideProgressBar={true} />
                        <Component {...pageProps} />
                    </Fragment>
                </PersistGate>
            </Layout>
        </>

    );
}

export default wrapper.withRedux(MyApp)