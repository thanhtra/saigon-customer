import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

import { PageUrl } from 'lib/constants/tech'

const GUIDE_IMAGES = {
    register: '/images/guide-rental/register.jpg',
    login: '/images/guide-rental/login.jpg',
    selectType: '/images/guide-rental/select-rental-type.jpg',
    createHouse: '/images/guide-rental/create-house.jpg',
    selectExisting: '/images/guide-rental/select-existing-house.jpg',
    createNew: '/images/guide-rental/create-new-house.jpg',
    createRoom: '/images/guide-rental/create-room.jpg',
    finish: '/images/guide-rental/finish-post.jpg',
    manageHouse: '/images/guide-rental/manage-house.jpg',
    manageRoom: '/images/guide-rental/manage-room.jpg',
}

export default function PostRentalGuide() {
    const router = useRouter()

    const goToPostRental = useCallback(() => {
        router.push(PageUrl.PostRental)
    }, [router])

    return (
        <>
            {/* ===== SEO ===== */}
            <Head>
                <title>Hướng dẫn đăng tin nhà cho thuê | Đăng tin miễn phí</title>
                <meta
                    name="description"
                    content="Hướng dẫn chi tiết từng bước cách đăng tin nhà ở cho thuê, nhà trọ, chung cư nhanh chóng và miễn phí."
                />
            </Head>

            <div className="post-guide-page">
                <h1>Hướng dẫn đăng tin nhà ở cho thuê</h1>

                {/* STEP 1 */}
                <GuideSection title="1️⃣ Tạo tài khoản">
                    <p>Bạn cần có tài khoản để đăng tin.</p>
                    <ul>
                        <li>Nhấn <b>Menu</b> ở góc phải màn hình</li>
                        <li>Chọn <b>Tài khoản</b></li>
                        <li>Chưa đăng nhập → hệ thống tự chuyển sang trang đăng nhập</li>
                        <li>Đã đăng nhập → bấm <b>Đăng tin miễn phí</b></li>
                        <li>Chưa có tài khoản → chọn <b>Tạo tài khoản</b></li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.register} alt="Hướng dẫn đăng ký tài khoản" />
                </GuideSection>

                {/* STEP 2 */}
                <GuideSection title="2️⃣ Đăng nhập hệ thống">
                    <p>Đăng nhập bằng số điện thoại đã đăng ký.</p>
                    <GuideImage src={GUIDE_IMAGES.login} alt="Hướng dẫn đăng nhập" />
                </GuideSection>

                {/* STEP 3 */}
                <GuideSection title="3️⃣ Chọn loại nhà cho thuê">
                    <ul>
                        <li>Bấm <b>Đăng tin miễn phí</b></li>
                        <li>Chọn <b>Loại hình cho thuê</b></li>
                        <li>Chung cư, nhà nguyên căn, mặt bằng, nhà trọ…</li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.selectType} alt="Chọn loại nhà cho thuê" />
                </GuideSection>

                {/* STEP 4 */}
                <GuideSection title="4️⃣ Điền thông tin nhà">
                    <ul>
                        <li>Tiêu đề & giá thuê</li>
                        <li>Tiện ích & hình ảnh</li>
                        <li>Mô tả & địa chỉ</li>
                        <li>Các khoản phí</li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.createHouse} alt="Điền thông tin nhà" />
                </GuideSection>

                {/* STEP 5 */}
                <GuideSection title="5️⃣ Trường hợp nhà trọ">
                    <h3>✅ Đã có nhà</h3>
                    <ul>
                        <li>Chọn nhà trọ có sẵn</li>
                        <li>Tạo phòng cho nhà đó</li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.selectExisting} alt="Chọn nhà trọ đã có" />

                    <h3>➕ Chưa có nhà</h3>
                    <ul>
                        <li>Bấm <b>Tạo nhà trọ mới</b></li>
                        <li>Nhập thông tin và lưu lại</li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.createNew} alt="Tạo nhà trọ mới" />
                </GuideSection>

                {/* STEP 6 */}
                <GuideSection title="6️⃣ Tạo phòng">
                    <ul>
                        <li>Chọn nhà trọ</li>
                        <li>Nhập giá, diện tích, hình ảnh,...</li>
                    </ul>

                    <GuideImage src={GUIDE_IMAGES.createRoom} alt="Tạo phòng" />
                </GuideSection>

                {/* STEP 7 */}
                <GuideSection title="7️⃣ Hoàn tất & đăng tin">
                    <p>
                        Hệ thống tự tạo tin đăng sau khi hoàn tất.
                        Nhấn <b>Đăng tin</b> để hoàn thành.
                    </p>

                    <GuideImage src={GUIDE_IMAGES.finish} alt="Hoàn tất đăng tin" />
                </GuideSection>

                {/* CTA */}
                <div className="guide-actions">
                    <button onClick={goToPostRental}>
                        👉 Bắt đầu đăng tin ngay
                    </button>
                </div>


                {/* STEP 8 */}
                <GuideSection title="Quản lý nhà của tôi & cập nhật trạng thái phòng">
                    <p>
                        Sau khi đăng tin thành công, bạn có thể dễ dàng quản lý nhà và phòng của mình
                        thông qua mục <b>Nhà của tôi</b>.
                    </p>

                    <ul>
                        <li>Nhấn <b>Menu</b> ở góc phải màn hình</li>
                        <li>Chọn <b>Tài khoản</b></li>
                        <li>Chọn <b>Nhà của tôi</b></li>
                    </ul>

                    <p>
                        Tại đây, hệ thống hiển thị danh sách tất cả các nhà và phòng bạn đã tạo.
                    </p>

                    {GUIDE_IMAGES.manageHouse && (
                        <GuideImage
                            src={GUIDE_IMAGES.manageHouse}
                            alt="Danh sách nhà của tôi"
                        />
                    )}

                    <h3>🔧 Quản lý phòng</h3>
                    <ul>
                        <li>Xem danh sách các phòng thuộc từng nhà</li>
                        <li>Cập nhật <b>trạng thái phòng</b>: Còn trống / Đã cho thuê</li>
                        <li>Chỉnh sửa thông tin phòng khi cần</li>
                    </ul>

                    {GUIDE_IMAGES.manageRoom && (
                        <GuideImage
                            src={GUIDE_IMAGES.manageRoom}
                            alt="Quản lý và cập nhật trạng thái phòng"
                        />
                    )}

                    <p className='guild-note'>
                        Việc cập nhật trạng thái phòng giúp người thuê dễ dàng biết được
                        phòng còn trống hay đã được cho thuê.
                    </p>

                </GuideSection>

                <div className="guide-actions" style={{ marginBottom: "0px" }}>
                    <button onClick={() => router.push(PageUrl.AccountMyHouse)}>
                        👉 Đi tới Nhà của tôi
                    </button>
                </div>

            </div>
        </>
    )
}

/* =====================
   SUB COMPONENTS
===================== */

function GuideSection({ title, children }) {
    return (
        <section>
            <h2>{title}</h2>
            {children}
        </section>
    )
}

function GuideImage({ src, alt, priority = false }) {
    return (
        <div className="guide-image">
            <Image
                src={src}
                alt={alt}
                width={1200}
                height={700}
                priority={priority}
                quality={65}
                loading={priority ? 'eager' : 'lazy'}
            />
        </div>
    )
}
