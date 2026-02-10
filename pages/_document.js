// import Document, { Html, Head, Main, NextScript } from 'next/document';

// export default class CustomDocument extends Document {
//   render() {
//     return (
//       <Html lang="vi">
//         <Head>
//           <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
//           <meta name="viewport" content="width=device-width, initial-scale=1" />
//           <meta name="robots" content="index, follow" />
//           <meta property="fb:app_id" content="588186160811740" />
//           <link rel="icon" href="/favicon.ico" />

//           <meta property="og:type" content="website" />
//           <meta property="og:title" content="Bất động sản Sài Gòn - Nhà phố & Phòng trọ" />
//           <meta
//             property="og:description"
//             content="Nền tảng mua bán, cho thuê nhà phố và phòng trọ tại Sài Gòn. Minh bạch - Uy tín - Hiệu quả."
//           />
//           <meta property="og:image" content="https://tratimnha.com/og/home.jpg" />
//           <meta property="og:image:width" content="1200" />
//           <meta property="og:image:height" content="630" />
//           <meta property="og:image:type" content="image/jpeg" />
//           <meta property="og:url" content="https://tratimnha.com/" />
//           <meta property="og:site_name" content="Bất động sản Sài Gòn" />
//           <meta property="og:locale" content="vi_VN" />

//         </Head>

//         <body>
//           {/* ===== SEO HEADING (hidden) ===== */}
//           <h1 hidden>Bất động sản Sài Gòn</h1>
//           <h2 hidden>Mua bán - Cho thuê nhà phố và phòng trọ</h2>

//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }


import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <link rel="icon" href="/favicon.ico" />

          <meta property="fb:app_id" content="588186160811740" />
        </Head>

        <body>
          <h1 hidden>Bất động sản Sài Gòn</h1>
          <h2 hidden>Mua bán & Cho thuê nhà phố, phòng trọ</h2>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
