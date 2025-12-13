import React from "react"
import DiscoveryItem from '../discovery-item';
import Pagination from 'components/common/pagination';

const DiscoveriesContent = ({ discoveries, meta, changePage }) => {

    return (
        <>
            {discoveries && discoveries.map((item) => (
                <DiscoveryItem discovery={item} />
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

export default DiscoveriesContent