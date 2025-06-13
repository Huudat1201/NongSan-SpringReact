import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import '../../style/addCategory.css'

const EditCategory = () => {
    // Lấy categoryId từ params url
    const { categoryId } = useParams();

    // State lưu tên category đang chỉnh sửa
    const [name, setName] = useState('');
    // State để hiển thị thông báo lỗi hoặc thành công
    const [message, setMessage] = useState('');
    // Hook để điều hướng trang
    const navigate = useNavigate();

    // Khi component mount hoặc categoryId thay đổi thì gọi API lấy thông tin category
    useEffect(() => {
        fetchCategory(categoryId);
    }, [categoryId])

    // Hàm gọi API lấy category theo id
    const fetchCategory = async () => {
        try {
            const response = await ApiService.getCategoryById(categoryId);
            // Gán tên category trả về vào state để hiển thị lên input
            setName(response.category.name);

        } catch (error) {
            // Hiển thị lỗi nếu không lấy được category
            setMessage(error.response?.data?.message || error.message || "Failed to get a category by id")
            // 3 giây sau xoá thông báo lỗi
            setTimeout(() => {
                setMessage('');
            }, 3000)
        }
    }

    // Hàm xử lý submit form cập nhật category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API cập nhật category với dữ liệu mới
            const response = await ApiService.updateCategory(categoryId, { name });
            // Nếu thành công, hiển thị thông báo
            if (response.status === 200) {
                setMessage(response.message);
                // 3 giây sau, xoá thông báo và chuyển về trang danh sách category
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            // Nếu lỗi, hiển thị lỗi
            setMessage(error.response?.data?.message || error.message || "Failed to save a category")
        }
    }

    return (
        <div className="add-category-page">
            {/* Hiển thị thông báo nếu có */}
            {message && <p className="message">{message}</p>}

            {/* Form sửa category */}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Edit Category</h2>

                {/* Input nhập tên category */}
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Nút submit form */}
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default EditCategory;
