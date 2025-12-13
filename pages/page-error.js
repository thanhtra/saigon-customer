import LayoutError from 'components/common/layout-error';

const ErrorPage = () => (
    <LayoutError>
        <section className="error-page">
            <div className="container">
                <h1>Lỗi</h1>
                <p>Trang không tồn tại</p>
                <a href="/" className="btn btn-green">Trở lại trang chủ</a>
            </div>
        </section>
    </LayoutError>
)

export default ErrorPage