import Breadcrumb from 'components/common/breadcrumb';
import RoomFilter from 'components/room/room-filter';
import RoomsContent from 'components/room/rooms-content';

import { getRooms } from 'lib/api/room.api';
import { normalizeRoomQuery } from 'lib/utils/normalizeRoomQuery';
import { useRoomRouter } from 'hooks/useRoomRouter';

/* ================= SSR ================= */

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

/* ================= PAGE ================= */

const RentalPage = ({ rooms, meta }) => {
    const { query, search, paginate } = useRoomRouter();

    return (
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
    );
};

export default RentalPage;
