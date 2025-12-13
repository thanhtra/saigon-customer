import PageIntro from 'components/common/page-intro';
import Subscribe from 'components/common/subscribe';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <>
      <PageIntro />

      <section className="container">
        <div className="featured">
          <div className="featured-item">
            <div className='col-4 left'>
              <Link href="/san-pham">
                <p className='des-title'>Ẩm thực - đặc sản</p>
              </Link>
              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Nguồn ẩm thực phong phú, đa dạng mang đậm bản sắc Tây Nguyên</p>
                </div>
              </div>
              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Nuôi trồng, khai thác từ thiên nhiên</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Chế biến và bảo quản cẩn thận, tỉ mỉ</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Chọn lọc nguyên liệu kỹ lưỡng, quy trình sản xuất hiện đại</p>
                </div>
              </div>
            </div>
            <div className='col-6' style={{ backgroundImage: 'url(/images/coffee.jpeg)' }}>
              <div className='h-content'>
                <p className='f-i-title'>Ẩm thực và đặc sản</p>
                <Link href="/san-pham">
                  <button className="btn">Xem sản phẩm</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="featured-item du-lich">
            <div className='col-6' style={{ backgroundImage: 'url(/images/ta_dung.jpeg)' }}>
              <div className='h-content'>
                <p className='f-i-title'>Văn hóa và du lịch</p>
                <Link href="/kham-pha">
                  <button className="btn">Xem bài viết</button>
                </Link>
              </div>
            </div>
            <div className='col-4 right'>
              <Link href="/kham-pha">
                <p className='des-title'>Văn hoá - du lịch</p>
              </Link>
              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Sắc thái văn hóa phong phú, đa dạng</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Nhiều danh lam thắng cảnh</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Khí hậu ôn hoà</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Con người thân thiện, là nơi lý tưởng để khám phá và nghỉ dưỡng</p>
                </div>
              </div>

            </div>
          </div>

          <div className="featured-item">
            <div className='col-4 left'>
              <Link href="/bat-dong-san">
                <p className='des-title'>Bất động sản</p>
              </Link>
              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Nguồn đất đa dạng</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Hỗ trợ, tư vấn khách hàng tìm kiếm bất động sản phù hợp</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Nắm rõ vị trí, tiềm năng bất động sản trong khu vực</p>
                </div>
              </div>

              <div className='item'>
                <div className='txt-des'>
                  <p className='txt-des-title'>Xây dựng thương hiệu, uy tín với khách hàng</p>
                </div>
              </div>
            </div>
            <div className='col-6' style={{ backgroundImage: 'url(/images/bds.jpeg)' }}>
              <div className='h-content'>
                <p className='f-i-title'>Bất động sản</p>
                <Link href="/bat-dong-san">
                  <button className="btn">Xem chi tiết</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container video-wrapper">
          <iframe height="300" width="560" src="https://www.youtube.com/embed/Pd77f5ZTdz4?&autoplay=1&rel=0&loop=1&showinfo=0&controls=0&mute=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section-intro">
            <h4>Tại sao bạn nên chọn chúng tôi?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item-content">
                <h4>Giao hàng miễn phí</h4>
                <p>Giao hàng miễn phí với hoá đơn trên 500.000đ</p>
              </div>
            </li>

            <li>
              <i className="icon-payment"></i>
              <div className="data-item-content">
                <h4>Dễ dàng thanh toán</h4>
                <p>Thanh toán khi nhận hàng hoặc chuyển khoản trước</p>
              </div>
            </li>

            <li>
              <i className="icon-cash"></i>
              <div className="data-item-content">
                <h4>Uy tín</h4>
                <p>Xây dựng lòng tin và uy tín với khách hàng</p>
              </div>
            </li>

            <li>
              <i className="icon-materials"></i>
              <div className="data-item-content">
                <h4>Chất lượng</h4>
                <p>Mang sản phẩm tốt nhất đến với khách hàng</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <Subscribe />
    </>
  )
}

export default IndexPage