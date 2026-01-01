import React from "react"
import RoomItem from '../room-item';
import Pagination from 'components/common/pagination';

const RoomsContent = ({ rooms, meta, changePage }) => {

    return (
        <>
            {rooms && rooms.map((item) => (
                <RoomItem room={item} />
            ))}

            <Pagination
                className="pagination-bar"
                currentPage={meta?.page}
                totalCount={meta?.itemCount}
                pageSize={meta?.size}
                onPageChange={page => changePage(page)}
            />

        </>
    )
}

export default RoomsContent