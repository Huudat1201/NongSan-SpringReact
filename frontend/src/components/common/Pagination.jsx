import React from "react";
import '../../style/pagination.css'; 

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Tạo mảng số trang từ 1 đến tổng số trang
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {/* Duyệt mảng số trang và tạo button cho từng trang */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)} // Khi click gọi hàm thay đổi trang
                    className={number === currentPage ? 'active' : ''} // Trang hiện tại sẽ có class active
                >
                    {number}
                </button>
            ))}
        </div>
    )
}

export default Pagination;
