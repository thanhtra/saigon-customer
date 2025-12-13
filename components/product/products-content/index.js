import React from "react";
import ProductItem from '../product-item';
import Pagination from 'components/common/pagination';

const ProductsContent = ({ products, meta, changePage }) => {
    return (<>
        {products && products.map((item) => (
            <ProductItem key={item?.id} product={item} />
        ))}

        <Pagination
            className="pagination-bar"
            currentPage={meta?.page}
            totalCount={meta?.itemCount}
            pageSize={meta?.size}
            onPageChange={page => changePage(page)}
        />
    </>);
}

export default ProductsContent

