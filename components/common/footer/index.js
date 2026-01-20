import { useRouter } from 'next/router';
import { PageUrl } from 'lib/constants/tech';
import Link from 'next/link';

const Footer = () => {
    const router = useRouter();
    const pathname = router.pathname;

    return (
        <footer className={`site-footer ${pathname.includes('bat-dong-san') ? 'in-land' : ''}`}>
            <div className="container">

                {/* ===== GIỚI THIỆU ===== */}
                <div className="site-footer-description">
                    <h6>Nền tảng giải pháp & dịch vụ</h6>
                    <p>
                        Chúng tôi xây dựng nền tảng nhằm giới thiệu các giải pháp bất động sản,
                        phòng trọ cho thuê, cùng các website và dịch vụ công nghệ
                        đã được chọn lọc kỹ lưỡng, giúp người dùng dễ dàng tiếp cận
                        những lựa chọn phù hợp và hiệu quả.
                    </p>

                    <ul className="site-footer-social-networks">
                        <li>
                            <a href="https://www.facebook.com/profile.php?id=61585703846804" target="_blank" rel="noreferrer">
                                <i className="icon-facebook"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/virung48" target="_blank" rel="noreferrer">
                                <i className="icon-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/v%E1%BB%8B-r%E1%BB%ABng-a4643926a/" target="_blank" rel="noreferrer">
                                <i className="icon-linkedin"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/virung48/" target="_blank" rel="noreferrer">
                                <i className="icon-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/@virung48/featured" target="_blank" rel="noreferrer">
                                <i className="icon-youtube-play"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/@virung48" target="_blank" rel="noreferrer">
                                <div
                                    className="icon-img"
                                    style={{ backgroundImage: 'url(/images/tiktok-icon.svg)' }}
                                />
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ===== LINKS ===== */}
                <div className="site-footer-links">
                    <ul>
                        <li>Lĩnh vực hoạt động</li>
                        <li>
                            <Link href={PageUrl.Rental}>Phòng trọ cho thuê</Link>
                        </li>
                        <li>
                            <Link href={''}>Môi giới bất động sản</Link>
                        </li>
                        <li>
                            <Link href={''}>Thông tin thị trường</Link>
                        </li>
                    </ul>

                    <ul>
                        <li>Giải pháp & công nghệ</li>
                        <li><a href="#">Website & nền tảng trực tuyến</a></li>
                        <li><a href="#">Công cụ hỗ trợ kinh doanh</a></li>
                        <li><a href="#">Dịch vụ & giải pháp số</a></li>
                    </ul>

                    <ul>
                        <li>Liên hệ</li>
                        <li>
                            <span className="labl">Email:</span>{' '}
                            <a href="mailto:tra.it1095@gmail.com">tra.it1095@gmail.com</a>
                        </li>
                        <li>
                            <span className="labl">Điện thoại:</span>{' '}
                            <a href="tel:0968922006">0968 922 006</a>
                        </li>
                        <li>
                            <span className="labl">Zalo:</span>{' '}
                            <a href="https://zalo.me/0968922006" target="_blank" rel="noreferrer">
                                0968 922 006
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
