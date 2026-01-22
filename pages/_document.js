import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          {/* ===== BASIC SEO ===== */}
          <meta
            name="description"
            content="Mua bán, cho thuê nhà phố, phòng trọ tại Sài Gòn. Pháp lý rõ ràng, giá hợp lý, hỗ trợ tận tâm."
          />
          <meta name="keywords" content="
            bất động sản sài gòn,
            nhà phố sài gòn,
            phòng trọ sài gòn,
            thuê nhà sài gòn,
            mua bán nhà đất,
            bất động sản cho thuê,
            nhà cho thuê giá rẻ,
            phòng trọ chính chủ
          " />
          <meta name="robots" content="index, follow" />

          {/* ===== OPEN GRAPH ===== */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Bất động sản Sài Gòn - Nhà phố & Phòng trọ" />
          <meta
            property="og:description"
            content="Nền tảng mua bán, cho thuê nhà phố và phòng trọ tại Sài Gòn. Minh bạch - Uy tín - Hiệu quả."
          />

          <meta property="og:image" content="https://tratimnha.com/og/home.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />

          <meta property="og:url" content="https://tratimnha.com/" />
          <meta property="og:site_name" content="Bất động sản Sài Gòn" />
          <meta property="og:locale" content="vi_VN" />

          {/* ===== TECH ===== */}
          <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta property="fb:app_id" content="1234567890" />

          {/* Optional: favicon */}
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <body>
          {/* ===== SEO HEADING (hidden) ===== */}
          <h1 hidden>Bất động sản Sài Gòn</h1>
          <h2 hidden>Mua bán - Cho thuê nhà phố và phòng trọ</h2>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
