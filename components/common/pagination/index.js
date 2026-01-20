import React from 'react';
import classNames from 'classnames';
import { usePagination, DOTS } from './usePagination';

const IconChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const IconChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage, // 0-based
    pageSize,
    className
}) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (!paginationRange || paginationRange.length < 2) return null;

    const lastPageNumber = paginationRange[paginationRange.length - 1];
    const lastPageIndex = lastPageNumber - 1;

    const handleNext = () => {
        if (currentPage < lastPageIndex) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <ul className={classNames('pagination-container', className)}>
            {/* PREVIOUS */}
            <li
                className={classNames('pagination-item', {
                    disabled: currentPage === 0
                })}
                onClick={handlePrevious}
                aria-disabled={currentPage === 0}
                aria-label="Previous page"
            >
                <IconChevronLeft />
            </li>

            {/* PAGE NUMBERS */}
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return (
                        <li
                            key={`dots-${index}`}
                            className="pagination-item dots"
                        >
                            &#8230;
                        </li>
                    );
                }

                const pageIndex = pageNumber - 1;
                const isSelected = pageIndex === currentPage;

                return (
                    <li
                        key={pageNumber}
                        className={classNames('pagination-item', {
                            selected: isSelected
                        })}
                        onClick={() => onPageChange(pageIndex)}
                        aria-current={isSelected ? 'page' : undefined}
                    >
                        {pageNumber}
                    </li>
                );
            })}

            {/* NEXT */}
            <li
                className={classNames('pagination-item', {
                    disabled: currentPage === lastPageIndex
                })}
                onClick={handleNext}
                aria-disabled={currentPage === lastPageIndex}
                aria-label="Next page"
            >
                <IconChevronRight />
            </li>
        </ul>
    );
};

export default Pagination;
