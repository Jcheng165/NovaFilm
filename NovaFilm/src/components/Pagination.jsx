import React, { useEffect, useState } from 'react'

/**
 * Pagination — Prev/Next + jump-to-page input. Clamps input to 1..totalPages.
 *
 * @param {number} props.currentPage - Active page (1-indexed)
 * @param {number} props.totalPages - Max pages
 * @param {Function} props.onPageChange - Callback(newPage)
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    /* Local state for jump input - syncs with currentPage on button clicks */
    const [pageInput, setPageInput] = useState(currentPage);

    /* Keep input in sync when user clicks Prev/Next */
    useEffect(() => {
        setPageInput(currentPage);
    }, [currentPage]);

    /* Validate: clamp to 1..totalPages, fallback invalid input to 1 */
    const handleInputSubmit = (e) => {
        e.preventDefault();

        let pageNum = parseInt(pageInput);

    // Clamping logic:
    // 1. Fallback to page 1 if input is NaN or less than 1
        if(isNaN(pageNum) || pageNum <1) pageNum =1;
    // 2. Cap at max pages if input exceeds limit
        if(pageNum > totalPages) pageNum = totalPages;

        onPageChange(pageNum);
        setPageInput(pageNum);
    };

    return(
        <div className='pagination'>

            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage -1)}
                disabled={currentPage ===1}
                className='page-btn'
            >
                Previous
            </button>

            {/* Direct Page Input Form */}
            <form onSubmit={handleInputSubmit} className='jump-form'>
                <span>Page</span>
                <input
                    type='number'
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    className='page-input'
                    min="1"
                    max={totalPages}
                />
                <span> of <span className='total-number'>{totalPages}</span></span>
            </form>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage +1)}
                disabled={currentPage >= totalPages}
                className="page-btn"
            >
                Next
            </button>

        </div>
    );
};

export default Pagination;
