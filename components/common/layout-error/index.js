import Header from 'components/common/header';
import Head from 'next/head';
import { useRouter } from 'next/router';

const LayoutError = ({ children, title = 'Vị Rừng' }) => {
    const router = useRouter();
    const pathname = router.pathname;

    return (
        <div className="app-main">
            <Head>
                <title>Không tìm thấy trang &mdash; {title}</title>
            </Head>

            <Header />

            <main className={(pathname !== '/' ? 'main-page' : '')}>
                {children}
            </main>
        </div>
    )
}

export default LayoutError