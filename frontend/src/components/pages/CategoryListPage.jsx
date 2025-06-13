import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/categoryListPage.css';

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]); // lưu danh sách danh mục sản phẩm
    const [error, setError] = useState(null); // lưu thông báo lỗi nếu có
    const navigate = useNavigate(); // hook để chuyển hướng trang

    useEffect(() => {
        fetchCategories(); // gọi hàm lấy dữ liệu khi component mount
    }, []); // chỉ chạy 1 lần khi component được render lần đầu


    // Hàm bất đồng bộ để lấy danh sách các danh mục từ API
    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory(); // gọi API lấy danh sách danh mục
            setCategories(response.categoryList || []); // cập nhật danh sách danh mục vào state
        } catch (err) {
            // Nếu có lỗi, lưu thông báo lỗi vào state
            setError(err.response?.data?.message || err.message || 'Unable to fetch categories');
        }
    }

    // Hàm xử lý khi người dùng bấm vào 1 danh mục
    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`); // điều hướng đến trang hiển thị sản phẩm của danh mục đó
    }

    return (
        <div className="category-list">
            {error ? (
                // Nếu có lỗi, hiển thị thông báo lỗi
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <h2>Categories</h2>
                    <ul>
                        {/* Lặp qua danh sách danh mục và hiển thị */}
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button onClick={() => handleCategoryClick(category.id)}>
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CategoryListPage;
