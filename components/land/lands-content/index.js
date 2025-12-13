import React from "react"
import LandItem from '../land-item';
import Pagination from 'components/common/pagination';

const LandsContent = ({ lands, meta, changePage }) => {

    return (
        <>
            {lands && lands.map((item) => (
                <LandItem land={item} />
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

export default LandsContent