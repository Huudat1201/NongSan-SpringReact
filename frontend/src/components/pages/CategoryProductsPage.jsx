import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import '../../style/home.css'

const CategoryProductsPage = () => {

    // Lấy categoryId từ URL, ví dụ: /category/3
    const { categoryId } = useParams();

    // State lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);

    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // State lưu tổng số trang
    const [totalPages, setTotalPages] = useState(0);

    // State lưu thông báo lỗi nếu có
    const [error, setError] = useState(null);

    // Số sản phẩm hiển thị trên mỗi trang
    const itemsPerPage = 2;


    // Gọi API mỗi khi categoryId hoặc currentPage thay đổi
    useEffect(() => {
        fetchProducts(); // Gọi hàm fetchProducts khi component mount hoặc khi categoryId/currentPage thay đổi
    }, [categoryId, currentPage]);


    // Hàm gọi API để lấy danh sách sản phẩm theo categoryId
    const fetchProducts = async () => {
        try {
            // Gọi API
            const response = await ApiService.getAllProductsByCategoryId(categoryId);

            // Lấy danh sách sản phẩm từ phản hồi
            const allProducts = response.productList || [];

            // Tính tổng số trang
            setTotalPages(Math.ceil(allProducts.length / itemsPerPage));

            // Cắt danh sách sản phẩm theo trang hiện tại
            setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            // Ghi lại lỗi nếu có
            setError(error.response?.data?.message || error.message || 'unable to fetch products by category id');
        }
    }


    return(
        <div className="home">
            {error ? (
                // Nếu có lỗi, hiển thị thông báo lỗi
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    {/* Hiển thị danh sách sản phẩm */}
                    <ProductList products={products} />

                    {/* Hiển thị phân trang */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    )
}

export default CategoryProductsPage;
