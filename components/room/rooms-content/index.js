import React from "react"
import RoomItem from '../room-item';
import Pagination from 'components/common/pagination';

const RoomsContent = ({ rooms, meta, changePage }) => {

    console.log('metameta', meta);

    return (
        <>
            {rooms && rooms.map((item) => (
                <RoomItem key={item.id} room={item} />
            ))}

            <Pagination
                currentPage={meta.page - 1}          // 👈 convert 1-based → 0-based
                totalCount={meta.itemCount}
                pageSize={meta.size}
                onPageChange={(pageIndex) => changePage(pageIndex + 1)} // 👈 trả lại BE
            />

        </>
    )
}

export default RoomsContent