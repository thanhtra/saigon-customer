import Document, { Head, Main, NextScript, Html } from 'next/document';

export default class CustomDocument extends Document {

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="https://www.daknong.info/images/mountain.ico" />
          <meta name="description" itemProp="description" content="Đăk Nông là một tỉnh thuộc vùng Tây Nguyên, địa hình đồi núi có nhiều cảnh quan thiên nhiên đẹp và độc đáo. Có nền văn hóa, ẩm thực đa dạng phong phú của đồng bào được xây dựng qua hàng nghàn năm." />
          <meta name="robots" content="index, follow" />
          <meta name="google-site-verification" content="0pbwFdOPJdOBZ6b4q-Yqa__ad3DsqLx6RyOR_RB0lVg" />
          <meta name="keywords" content="Bất động sản Đăk Nông, bất động sản Tây Nguyên, đất nền, đất vườn, view đồi, view hồ, bất động sản nghỉ dưỡng, bất động sản phân lô, đất rẫy, bất động sản đầu tư khu vực Đăk Nông, Tà Đùng, Thác 5 tầng, thác Lưu Ly, thác Đăk Nông, du lịch Đăk Nông, khám phá Đăk Nông, thác Tây Nguyên, Đặc sản Đăk Nông, đặc sản Tây Nguyên, món ngon Đăk Nông, đọt mây rừng, cà phê Đăk Nông, Mật ong rừng, rựu cần Tây Nguyên" />
          <meta name="news_keywords" content="Bất động sản Đăk Nông, bất động sản Tây Nguyên, đất nền, đất vườn, view đồi, view hồ, bất động sản nghỉ dưỡng, bất động sản phân lô, đất rẫy, bất động sản đầu tư khu vực Đăk Nông, Tà Đùng, Thác 5 tầng, thác Lưu Ly, thác Đăk Nông, du lịch Đăk Nông, khám phá Đăk Nông, thác Tây Nguyên, Đặc sản Đăk Nông, đặc sản Tây Nguyên, món ngon Đăk Nông, đọt mây rừng, cà phê Đăk Nông, Mật ong rừng, rựu cần Tây Nguyên" />
          <meta property="og:type" content="article" />
          <meta property="og:image" content="https://www.daknong.info/images/ta_dung.jpeg" />
          <meta property="og:locale" content="vi_VN" />
          <meta property="og:url" content="https://www.daknong.info/" />
          <meta property="og:site_name" content="Khám phá Đăk Nông" />
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8"></meta>
        </Head>


        <body>
          <h1 hidden>Bất động sản Đăk Nông</h1>
          <h2 hidden>View đồi, View hồ</h2>
          <h3 hidden>Bất động sản nghỉ dưỡng</h3>
          <h4 hidden>Đặc sản Đăk Nông, ẩm thực Đăk Nông, món ngon Đăk Nông</h4>
          <h5 hidden>Du lịch Đăk Nông, Khám phá Đăk Nông</h5>
          <h6 hidden>Văn hoá ẩm thực Đăk Nông</h6>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}