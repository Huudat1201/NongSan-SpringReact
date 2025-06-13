import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import '../../style/addCategory.css'

const AddCategory = () => {
    const [name, setName] = useState('');  // state lưu tên category mới
    const [message, setMessage] = useState('');  // state để hiện thông báo thành công hoặc lỗi
    const navigate = useNavigate();  // dùng để chuyển trang

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API tạo category mới
            const response = await ApiService.createCategory({name});
            if (response.status === 200) {
                setMessage(response.message);  // hiện thông báo thành công
                setTimeout(() => {
                    setMessage('');  // xóa thông báo sau 3 giây
                    navigate("/admin/categories");  // chuyển về trang danh sách category
                }, 3000);
            }
        } catch (error) {
            // Hiện lỗi nếu có
            setMessage(error.response?.data?.message || error.message || "Failed to save a category");
        }
    }

    return(
        <div className="add-category-page">
            {/* Hiện thông báo lỗi hoặc thành công */}
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="category-form">
                <h2>Add Category</h2>

                {/* Input nhập tên category */}
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddCategory;
