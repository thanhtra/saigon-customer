import SeoHead from 'components/common/seo-head';
import { shopeeCategories } from 'lib/constants/affiliate';
import Breadcrumb from 'components/common/breadcrumb';


export default function ProductCategoryPage() {
    return (
        <>
            <SeoHead
                title="Danh mục sản phẩm Shopee | Deal ngon mỗi ngày"
                description="Danh sách danh mục sản phẩm Shopee Affiliate: đặc sản, thời trang, gia dụng. Click xem ưu đãi mới nhất."
                image="https://tratimnha.com/og/san-pham.jpg"
                url="https://tratimnha.com/san-pham"
            />

            <section className="container category-page">
                <Breadcrumb
                    title="Danh mục sản phẩm"
                />

                <div className="category-grid">
                    {shopeeCategories.map(cat => (
                        <a
                            key={cat.id}
                            href={cat.url}
                            target="_blank"
                            rel="nofollow sponsored noopener noreferrer"
                            className="category-card"
                        >
                            <span className="category-badge">HOT</span>

                            <img src={cat.image} alt={cat.name} />
                            <div className="category-overlay" />

                            <div className="category-card-content">
                                <h3>{cat.name}</h3>
                                {cat.description && <p>{cat.description}</p>}
                                <span className="cta">Xem ưu đãi</span>
                            </div>
                        </a>

                    ))}
                </div>
            </section>
        </>
    );
}
