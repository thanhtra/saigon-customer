import PageIntro from 'components/common/page-intro';
import Subscribe from 'components/common/subscribe';
import Link from 'next/link';
import { PageUrl } from 'lib/constants/tech';

const IndexPage = () => {
  const handleScrollContact = () => {
    document
      .querySelector('.subscribe-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }


  return (
    <>
      <PageIntro />

      <section className="container">
        <div className="featured">

          <div className="featured-item">
            <div className="col-4 left">
              <Link href={PageUrl.Lands}>
                <p className="des-title">Nhà phố Sài Gòn</p>
              </Link>

              <div className="item"><p className="txt-des-title">Vị trí đẹp – khu dân cư hiện hữu</p></div>
              <div className="item"><p className="txt-des-title">Pháp lý rõ ràng – sổ hồng riêng</p></div>
              <div className="item"><p className="txt-des-title">Giá phù hợp – hỗ trợ thương lượng</p></div>
              <div className="item"><p className="txt-des-title">Tư vấn minh bạch – tận tâm</p></div>
            </div>

            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/nha-pho-sai-gon.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Nhà phố Sài Gòn</p>
                <Link href={PageUrl.Lands}>
                  <button className="btn">Xem nhà bán</button>
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
                <p className="f-i-title">Phòng trọ Sài Gòn</p>
                <Link href={PageUrl.Rental}>
                  <button className="btn">Xem phòng trọ</button>
                </Link>
              </div>
            </div>

            <div className="col-4 right">
              <Link href={PageUrl.Rental}>
                <p className="des-title">Phòng trọ Sài Gòn</p>
              </Link>

              <div className="item"><p className="txt-des-title">Phòng sạch đẹp – mới xây</p></div>
              <div className="item"><p className="txt-des-title">An ninh – giờ giấc tự do</p></div>
              <div className="item"><p className="txt-des-title">Giá rõ ràng – không phát sinh</p></div>
              <div className="item"><p className="txt-des-title">Gần chợ – trường – bến xe</p></div>
            </div>
          </div>

          {/* ===== Tool & Phần mềm ===== */}
          <div className="featured-item">
            <div className="col-4 left">
              <p className="des-title">Tool & Phần mềm</p>

              <div className="item"><p className="txt-des-title">Tool hỗ trợ đăng tin BĐS</p></div>
              <div className="item"><p className="txt-des-title">Phần mềm quản lý phòng trọ</p></div>
              <div className="item"><p className="txt-des-title">Tiết kiệm thời gian – dễ dùng</p></div>
              <div className="item"><p className="txt-des-title">Hướng dẫn chi tiết – hỗ trợ lâu dài</p></div>
            </div>

            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/tool-phan-mem.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Tool & Phần mềm</p>
                <button className="btn">Khám phá</button>
              </div>
            </div>
          </div>

          {/* ===== Website & Dịch vụ ===== */}
          <div className="featured-item col">
            <div className="col-6">
              <div
                className="bg-image"
                style={{ backgroundImage: "url(/images/intro/website-dich-vu.jpg)" }}
              />
              <div className="overlay" />

              <div className="h-content">
                <p className="f-i-title">Website & Dịch vụ</p>
                <button className="btn">Tư vấn ngay</button>
              </div>
            </div>

            <div className="col-4 right">
              <p className="des-title">Dịch vụ uy tín</p>

              <div className="item"><p className="txt-des-title">Thiết kế website BĐS</p></div>
              <div className="item"><p className="txt-des-title">SEO – quảng bá hiệu quả</p></div>
              <div className="item"><p className="txt-des-title">Hỗ trợ kỹ thuật nhanh chóng</p></div>
              <div className="item"><p className="txt-des-title">Đồng hành lâu dài</p></div>
            </div>
          </div>

        </div>
      </section >

      <section className="section section-video">
        <div className="container">
          <div className="video-card">
            <div className="video-content">
              <h2>
                Giải pháp bất động sản <br />
                <span>Uy tín – Minh bạch – Hiệu quả</span>
              </h2>

              <p>
                Đồng hành cùng khách hàng trong mua bán nhà phố,
                phòng trọ và giải pháp công nghệ hỗ trợ kinh doanh.
              </p>

              <div className="trust-badge">
                ✔ Đã hỗ trợ hơn 500+ giao dịch
              </div>

              <div className="video-actions">
                <button className="btn-primary" onClick={handleScrollContact}>
                  Liên hệ tư vấn
                </button>
                <button className="btn-outline">Xem dự án</button>
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
            <h4>Tại sao khách hàng tin chọn chúng tôi?</h4>
            <p>
              Không chỉ là nền tảng đăng tin – chúng tôi đồng hành lâu dài cùng bạn
              trong mua bán, cho thuê và quản lý bất động sản.
            </p>
          </header>

          <ul className="why-us-grid">
            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-home"></i>
              </div>
              <h4>Pháp lý minh bạch</h4>
              <p>
                Nhà phố – phòng trọ rõ ràng pháp lý,
                hỗ trợ kiểm tra sổ và thông tin quy hoạch.
              </p>
            </li>

            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-location"></i>
              </div>
              <h4>Hiểu rõ thị trường</h4>
              <p>
                Am hiểu khu vực Sài Gòn – Gò Vấp,
                tư vấn đúng giá – đúng nhu cầu – đúng thời điểm.
              </p>
            </li>

            <li className="why-card">
              <div className="icon-wrap">
                <i className="icon-support"></i>
              </div>
              <h4>Hỗ trợ tận tâm</h4>
              <p>
                Tư vấn nhanh, trung thực, đồng hành
                trước – trong – sau giao dịch.
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
              <p>Kinh nghiệm thị trường</p>
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
              <p>Đề xuất giải pháp</p>
            </div>
            <div className="process-step">
              <span>03</span>
              <p>Dẫn xem & tư vấn</p>
            </div>
            <div className="process-step">
              <span>04</span>
              <p>Hoàn tất pháp lý</p>
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
          <h3>Bạn đang tìm giải pháp phù hợp?</h3>
          <p>Để lại thông tin – chúng tôi sẽ liên hệ trong 15 phút</p>
          <button className="btn">Nhận tư vấn miễn phí</button>
        </div>
      </section>

      <section className="section faq">
        <div className="container">
          <h2 className="section-title">Câu hỏi thường gặp</h2>

          <div className="faq-item">
            <h4>Có hỗ trợ pháp lý không?</h4>
            <p>Có, hỗ trợ từ đặt cọc đến sang tên.</p>
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