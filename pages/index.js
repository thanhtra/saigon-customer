import PageIntro from 'components/common/page-intro';
import Subscribe from 'components/common/subscribe';
import Link from 'next/link';
import { PageUrl } from 'lib/constants/tech';
// import SeoHead from 'components/common/seo-head';

const IndexPage = () => {
  const handleScrollContact = () => {
    document
      .querySelector('.subscribe-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }


  return (
    <>
      {/* <SeoHead
        title="Bất động sản Sài Gòn - Nhà phố & Phòng trọ"
        description="Nền tảng mua bán, cho thuê nhà phố và phòng trọ tại Sài Gòn. Minh bạch - Uy tín - Hiệu quả."
        image="https://tratimnha.com/og/home.jpg"
        url="https://tratimnha.com/"
      /> */}

      <PageIntro />

      <section className="container">
        <div className="featured">

          <div className="featured-item">
            <div className="col-4 left">
              <Link href={PageUrl.Land}>
                <p className="des-title">Nhà phố Sài Gòn - Thông tin minh bạch, giá trị thực</p>
              </Link>

              <div className="item"><p className="txt-des-title">Vị trí rõ ràng - khu dân cư hiện hữu</p></div>
              <div className="item"><p className="txt-des-title">Pháp lý đầy đủ - hỗ trợ kiểm tra thông tin</p></div>
              <div className="item"><p className="txt-des-title">Giá tham khảo sát thị trường</p></div>
              <div className="item"><p className="txt-des-title">Tư vấn trung thực - hỗ trợ giao dịch</p></div>
            </div>

            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/nha-pho-sai-gon.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Nhà phố Sài Gòn</p>
                <Link href={PageUrl.Land}>
                  <button className="btn">Xem nhà</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="featured-item col">
            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/phong-tro-sai-gon.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Nhà ở cho thuê</p>
                <Link href={PageUrl.Rental}>
                  <button className="btn">Xem ngay</button>
                </Link>
              </div>
            </div>

            <div className="col-4 right">
              <Link href={PageUrl.Rental}>
                <p className="des-title">Nhà ở cho thuê - Dễ tìm, dễ thuê</p>
              </Link>

              <div className="item"><p className="txt-des-title">Nhà sạch sẽ - thông tin rõ ràng</p></div>
              <div className="item"><p className="txt-des-title">Khu vực an ninh - sinh hoạt thuận tiện</p></div>
              <div className="item"><p className="txt-des-title">Giá công khai - hạn chế phát sinh</p></div>
              <div className="item"><p className="txt-des-title">Gần chợ - trường - khu dân cư</p></div>
            </div>
          </div>

          <div className="featured-item">
            <div className="col-4 left">
              <p className="des-title">Tool - Website</p>

              <div className="item"><p className="txt-des-title">Thiết kế website theo nhu cầu thực tế</p></div>
              <div className="item"><p className="txt-des-title">Tool đăng bài tự động lên mạng xã hội</p></div>
              <div className="item"><p className="txt-des-title">Phần mềm quản lý - doanh nghiệp - khách hàng</p></div>
              <div className="item"><p className="txt-des-title">Tối ưu thao tác - tiết kiệm thời gian vận hành</p></div>
              <div className="item"><p className="txt-des-title">Hướng dẫn sử dụng - hỗ trợ kỹ thuật lâu dài</p></div>
            </div>

            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/tool-phan-mem.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Tool - Website</p>
                <button
                  className="btn"
                  onClick={() => {
                    window.open('https://zalo.me/0968922006', '_blank');
                  }}
                >
                  Tư vấn miễn phí
                </button>
              </div>
            </div>
          </div>

          <div className="featured-item col">
            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/website-dich-vu.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Dịch vụ đề xuất</p>
                <button className="btn">Khám phá ngay</button>
              </div>
            </div>

            <div className="col-4 right">
              <p className="des-title">Giới thiệu website & dịch vụ chất lượng</p>

              <div className="item"><p className="txt-des-title">Chọn lọc và giới thiệu các nền tảng uy tín</p></div>
              <div className="item"><p className="txt-des-title">Phù hợp cho cá nhân, doanh nghiệp và người kinh doanh</p></div>
              <div className="item"><p className="txt-des-title">Dễ sử dụng - thông tin rõ ràng - triển khai nhanh</p></div>
              <div className="item"><p className="txt-des-title">Giúp tiết kiệm thời gian tìm hiểu và lựa chọn</p></div>
            </div>
          </div>

        </div>
      </section >

      <section className="section section-video">
        <div className="container">
          <div className="video-card">
            <div className="video-content">
              <h2>
                Giải pháp đa lĩnh vực <br />
                <span>Bất động sản - Công nghệ - Sản phẩm chất lượng</span>
              </h2>

              <p>
                Chúng tôi xây dựng nền tảng cho thuê, môi giới bất động sản,
                phát triển website - phần mềm - tool tự động,
                và cung cấp các sản phẩm được chọn lọc kỹ,
                hướng đến giá trị sử dụng thực tế và hiệu quả lâu dài.
              </p>

              <div className="trust-badge">
                ✔ Hơn 500+ khách hàng & dự án đã đồng hành
              </div>

              <div className="video-actions">
                <button className="btn-primary" onClick={handleScrollContact}>
                  Liên hệ tư vấn
                </button>
                <button className="btn-outline">Xem giải pháp</button>
              </div>
            </div>

            <div className="video-wrapper">
              <iframe
                loading="lazy"
                src="https://www.youtube.com/embed/2Xepq4XEI8g"
                title="Giới thiệu dịch vụ"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-why-us">
        <div className="container">
          <header className="section-intro">
            <h4>Vì sao khách hàng chọn chúng tôi?</h4>
            <p>
              Không chỉ cung cấp dịch vụ,
              chúng tôi tập trung xây dựng giải pháp phù hợp,
              minh bạch và có thể sử dụng lâu dài.
            </p>
          </header>

          <ul className="why-us-grid">
            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-home"></i>
              </div>
              <h4>Giải pháp thực tế</h4>
              <p>
                Tập trung đúng nhu cầu,
                không dư thừa tính năng, không làm màu.
              </p>
            </li>

            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-location"></i>
              </div>
              <h4>Minh bạch & rõ ràng</h4>
              <p>
                Thông tin rõ ràng từ bất động sản,
                phần mềm đến sản phẩm cung cấp.
              </p>
            </li>

            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-support"></i>
              </div>
              <h4>Hỗ trợ lâu dài</h4>
              <p>
                Không chỉ bàn giao,
                chúng tôi đồng hành trong quá trình sử dụng.
              </p>
            </li>

            {/* <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-tool"></i>
              </div>
              <h4>Giải pháp công nghệ</h4>
              <p>
                Tool & phần mềm giúp đăng tin, quản lý phòng trọ
                và tối ưu hiệu quả kinh doanh.
              </p>
            </li> */}

            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-tool"></i>
              </div>
              <h4>8+ năm</h4>
              <p>Kinh nghiệm thực tế nhiều lĩnh vực</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section work-process">
        <div className="container">
          <h2 className="section-title">Quy trình làm việc</h2>

          <div className="process-grid">
            <div className="process-step">
              <span>01</span>
              <p>Tiếp nhận nhu cầu</p>
            </div>
            <div className="process-step">
              <span>02</span>
              <p>Đề xuất giải pháp phù hợp</p>
            </div>
            <div className="process-step">
              <span>03</span>
              <p>Triển khai & hỗ trợ</p>
            </div>
            <div className="process-step">
              <span>04</span>
              <p>Bàn giao - đồng hành lâu dài</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">Khách hàng nói gì?</h2>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>“Tư vấn rất thật, hỗ trợ từ đầu đến cuối.”</p>
              <strong>— Anh Minh, Gò Vấp</strong>
            </div>

            <div className="testimonial-card">
              <p>“Pháp lý rõ ràng, làm việc rất chuyên nghiệp.”</p>
              <strong>— Chị Lan, Quận 12</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h3>Bạn đang cần giải pháp cho nhà ở, kinh doanh hoặc công nghệ?</h3>
          <p>Để lại thông tin - chúng tôi sẽ liên hệ và tư vấn phù hợp nhất</p>
          <button className="btn">Nhận tư vấn miễn phí</button>
        </div>
      </section>

      <section className="section faq">
        <div className="container">
          <h2 className="section-title">Câu hỏi thường gặp</h2>

          <div className="faq-item">
            <h4>Có nhận làm website & tool theo yêu cầu không?</h4>
            <p>Có, chúng tôi phát triển website, phần mềm
              và công cụ tự động theo nhu cầu thực tế.
            </p>
          </div>

          <div className="faq-item">
            <h4>Chi phí môi giới thế nào?</h4>
            <p>Minh bạch, thỏa thuận rõ ràng ngay từ đầu.</p>
          </div>
        </div>
      </section>

      <Subscribe />
    </>
  )
}

export default IndexPage