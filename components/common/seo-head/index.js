// components/common/seo-head.tsx
import Head from 'next/head';

const SeoHead = ({
    title,
    description,
    image,
    url,
    type = 'website',
}) => {
    return (
        <Head>
            {/* ===== BASIC SEO ===== */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* ===== OPEN GRAPH ===== */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:secure_url" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Bất động sản Sài Gòn" />
            <meta property="og:locale" content="vi_VN" />

            {/* ===== TWITTER ===== */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
};

export default SeoHead;
