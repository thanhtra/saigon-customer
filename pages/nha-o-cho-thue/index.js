import Breadcrumb from 'components/common/breadcrumb';
import RoomFilter from 'components/room/room-filter';
import RoomsContent from 'components/room/rooms-content';
import { useRoomRouter } from 'hooks/useRoomRouter';
import { getRooms } from 'lib/api/room.api';
import { normalizeRoomQuery } from 'lib/utils/normalizeRoomQuery';
import SeoHead from 'components/common/seo-head';

export async function getServerSideProps({ query }) {
    try {
        const payload = normalizeRoomQuery(query);
        const res = await getRooms(payload);

        if (!res?.success) {
            return {
                props: {
                    rooms: [],
                    meta: {},
                },
            };
        }

        return {
            props: {
                rooms: res.result?.data ?? [],
                meta: res.result?.meta ?? {},
            },
        };
    } catch {
        return {
            props: {
                rooms: [],
                meta: {},
            },
        };
    }
}

const RentalPage = ({ rooms, meta }) => {
    const { query, search, paginate } = useRoomRouter();

    return (
        <>
            <SeoHead
                title="Nhà ở cho thuê tại Sài Gòn | Phòng trọ, căn hộ, nhà nguyên căn"
                description="Tổng hợp nhà ở cho thuê tại Sài Gòn: phòng trọ, căn hộ, nhà nguyên căn chính chủ. Giá tốt, pháp lý rõ ràng, cập nhật liên tục."
                image="https://tratimnha.com/og/home.jpg"
                url="https://tratimnha.com/nha-o-cho-thue"
                type="website"
            />

            <section className="container rooms-page">
                <Breadcrumb
                    title={`Tất cả ${meta?.itemCount ?? 0} nhà ở cho thuê`}
                />

                <div className="rooms-main">
                    <aside className="section-filter">
                        <RoomFilter
                            query={query}
                            searchRooms={search}
                        />
                    </aside>

                    <main className="section-content">
                        <RoomsContent
                            rooms={rooms}
                            meta={meta}
                            changePage={paginate}
                        />
                    </main>
                </div>
            </section>
        </>
    );
};

export default RentalPage;
