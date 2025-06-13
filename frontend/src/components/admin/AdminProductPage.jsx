import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminProduct.css'
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();

    // State lưu danh sách sản phẩm hiện trang
    const [products, setProducts] = useState([]);
    // State lưu trang hiện tại của pagination
    const [currentPage, setCurrentPage] = useState(1);
    // Tổng số trang pagination
    const [totalPages, setTotalPages] = useState(0);
    // State lưu lỗi (nếu có)
    const [error, setError] = useState(null);
    // Số sản phẩm mỗi trang
    const itemsPerPage = 4;

    // Hàm lấy dữ liệu sản phẩm từ API
    const fetchProducts = async () => {
        try {
            // Gọi API lấy toàn bộ sản phẩm
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];

            // Tính tổng số trang = tổng sản phẩm / số sản phẩm mỗi trang
            setTotalPages(Math.ceil(productList.length / itemsPerPage));

            // Lấy ra sản phẩm tương ứng trang hiện tại
            setProducts(productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            // Nếu lỗi, hiển thị lỗi lên giao diện
            setError(error.response?.data?.message || error.message || 'unable to fetch products')
        }
    }

    // useEffect chạy khi component mount và mỗi khi currentPage thay đổi
    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    // Hàm xử lý nút chỉnh sửa, điều hướng sang trang chỉnh sửa sản phẩm theo id
    const handleEdit = (id) => {
        navigate(`/admin/edit-product/${id}`)
    }

    // Hàm xử lý xóa sản phẩm theo id
    const handleDelete = async (id) => {
        // Hiện confirm yêu cầu xác nhận người dùng
        const confirmed = window.confirm("Are your sure you want to delete this product? ")
        if (confirmed) {
            try {
                // Gọi API xóa sản phẩm
                await ApiService.deleteProduct(id);
                // Sau khi xóa, gọi lại API lấy lại danh sách sản phẩm
                fetchProducts();
            } catch (error) {
                // Nếu lỗi, hiển thị lỗi lên giao diện
                setError(error.response?.data?.message || error.message || 'unable to delete product')
            }
        }
    }

    return (
        <div className="admin-product-list">
            {error ? (
                // Nếu có lỗi thì hiển thị lỗi
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <h2>Products</h2>
                    {/* Nút thêm sản phẩm mới */}
                    <button className="product-btn" onClick={() => { navigate('/admin/add-product'); }}>Add product</button>
                    <ul>
                        {/* Render danh sách sản phẩm */}
                        {products.map((product) => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                {/* Nút chỉnh sửa sản phẩm */}
                                <button className="product-btn" onClick={() => handleEdit(product.id)}>Edit</button>
                                {/* Nút xóa sản phẩm */}
                                <button className="product-btn-delete" onClick={() => handleDelete(product.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {/* Component phân trang */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)} />
                </div>
            )}
        </div>
    )
}

export default AdminProductPage;
