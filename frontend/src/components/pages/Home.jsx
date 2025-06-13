import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../common/ProductList.jsx";
import Pagination from "../common/Pagination.jsx";
import ApiService from "../../service/ApiService.js";
import '../../style/home.css';

const Home = () => {

    // Hook lấy thông tin truy cập URL (để lấy query string như search)
    const location = useLocation();

    // State lưu danh sách sản phẩm đang hiển thị
    const [products, setProducts] = useState([]);

    // State lưu số trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // State lưu tổng số trang
    const [totalPages, setTotalPages] = useState(0);

    // State lưu thông báo lỗi nếu có
    const [error, setError] = useState(null);

    // Số sản phẩm mỗi trang
    const itemsPerPage = 2;

    // useEffect để gọi API khi trang mới được tải hoặc khi thay đổi query string hoặc trang
    useEffect(() => {

        // Hàm bất đồng bộ để lấy danh sách sản phẩm từ API
        const fetchProducts = async () => {
            try {
                let allProducts = [];

                // Lấy query parameter từ URL (ví dụ ?search=apple)
                const queryparams = new URLSearchParams(location.search);
                const searchItem = queryparams.get('search');

                // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
                if (searchItem) {
                    const response = await ApiService.searchProducts(searchItem);
                    allProducts = response.productList || [];
                } else {
                    // Nếu không có từ khóa tìm kiếm, gọi API lấy toàn bộ sản phẩm
                    const response = await ApiService.getAllProducts();
                    allProducts = response.productList || [];
                }

                // Tính tổng số trang dựa trên tổng số sản phẩm
                setTotalPages(Math.ceil(allProducts.length / itemsPerPage));

                // Cắt danh sách sản phẩm theo trang hiện tại
                setProducts(
                    allProducts.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                );

            } catch (error) {
                // Nếu xảy ra lỗi, lưu thông báo lỗi vào state
                setError(error.response?.data?.message || error.message || 'unable to fetch products');
            }
        };

        // Gọi hàm fetchProducts khi component mount hoặc khi query/search hoặc currentPage thay đổi
        fetchProducts();

    }, [location.search, currentPage]); // Phụ thuộc vào location.search và currentPage

    return (
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
    );
};

export default Home;
