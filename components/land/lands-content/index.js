import React from "react"
import LandItem from '../land-item';
import Pagination from 'components/common/pagination';

const LandsContent = ({ lands, meta, changePage }) => {
    return (
        <>
            {lands && lands.map((item) => (
                <LandItem key={item.id} land={item} />
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

export default LandsContent