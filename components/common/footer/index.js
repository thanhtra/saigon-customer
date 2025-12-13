import { useRouter } from 'next/router';
import { PageUrl } from 'lib/constants/constant';
import Link from 'next/link';

const Footer = () => {
    const router = useRouter();
    const pathname = router.pathname;


    return (
        <footer className={`site-footer ${pathname.includes('bat-dong-san') ? 'in-land' : ''}`}>
            <div className='container'>
                <div className="site-footer-description">
                    <h6>Vị Rừng</h6>
                    <p>Với mong muốn giới thiệu vẻ đẹp văn hoá, thiên nhiên cũng như đặc sản Đăk Nông đến với mọi người trên khắp đất nước. <span style={{ color: '#076836' }}>Vị Rừng</span> đã xây dựng cộng đồng để chia sẻ và giao lưu.</p>
                    <ul className="site-footer-social-networks">
                        <li>
                            <a href="https://www.facebook.com/profile.php?id=100090826103823" target="_blank">
                                <i className="icon-facebook"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/virung48" target="_blank">
                                <i className="icon-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/v%E1%BB%8B-r%E1%BB%ABng-a4643926a/" target="_blank">
                                <i className="icon-linkedin"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/virung48/" target="_blank">
                                <i className="icon-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/@virung48/featured" target="_blank">
                                <i className="icon-youtube-play"></i>
                            </a>
                        </li>

                        <li>
                            <a href="https://www.tiktok.com/@virung48" target="_blank">
                                <div style={{ backgroundImage: 'url(/images/tiktok-icon.svg)' }} className='icon-img'></div>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="site-footer-links">
                    <ul>
                        <li>Thông tin thêm</li>
                        <li><a href="#">Đặt hàng sản phẩm</a></li>
                        <li>
                            <Link href={PageUrl.Tour}>
                                <a href="#">Dịch vụ du lịch</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={PageUrl.InforLand}>
                                <a href="#">Tư vấn bất động sản</a>
                            </Link>
                        </li>
                    </ul>
                    <ul>
                        <li>Thiết kế phần mềm</li>
                        <li><a href="#">Ứng dụng</a></li>
                        <li><a href="#">Tool</a></li>
                        <li><a href="#">Website</a></li>
                    </ul>
                    <ul>
                        <li>Thông tin liên hệ</li>
                        <li><span className="labl">Mail:</span>
                            <a href="mailto:tra.it1095@gmail.com">tra.it1095@gmail.com</a>
                        </li>
                        <li><span className="labl">Điện thoại:</span>
                            <a href="tel://0968922006">0968 922 006</a>
                        </li>
                        <li><span className="labl">Zalo:</span>
                            <a target="_blank" href="https://zalo.me/0968922006">
                                0968 922 006
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer >
    )
};


export default Footer