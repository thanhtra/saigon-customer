import React from "react"
import RoomItem from '../room-item';
import Pagination from 'components/common/pagination';

const RoomsContent = ({ rooms, meta, changePage }) => {
    return (
        <>
            {rooms && rooms.map((item) => (
                <RoomItem key={item.id} room={item} />
            ))}

            <Pagination
                currentPage={meta.page - 1}
                totalCount={meta.itemCount}
                pageSize={meta.size}
                onPageChange={(pageIndex) => changePage(pageIndex + 1)}
            />

        </>
    )
}

export default RoomsContent