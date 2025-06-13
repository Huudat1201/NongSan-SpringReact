import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import '../../style/adminCategory.css'

const AdminCategoryPage = () => {

    // state lưu danh sách category
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // gọi API lấy danh sách category khi component mount
    useEffect(() => {
        fetchCategories();
    }, [])

    // hàm lấy danh sách category từ API
    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (error) {
            console.log("Error fetching category list", error);
        }
    }

    // chuyển sang trang sửa category theo id
    const handleEdit = (id) => {
        navigate(`/admin/edit-category/${id}`);
    }

    // xóa category, hỏi xác nhận trước khi xóa
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (confirmed) {
            try {
                await ApiService.deleteCategory(id);
                fetchCategories();  // tải lại danh sách sau khi xóa
            } catch (error) {
                console.log("Error deleting category by id");
            }
        }
    }

    return (
        <div className="admin-category-page">
            <div className="admin-category-list">
                <h2>Categories</h2>
                {/* Nút chuyển sang trang thêm category */}
                <button onClick={() => navigate('/admin/add-category')}>Add Category</button>

                {/* Hiện danh sách category */}
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <span>{category.name}</span>
                            <div className="admin-bt">
                                {/* Nút sửa category */}
                                <button className="admin-btn-edit" onClick={() => handleEdit(category.id)}>Edit</button>
                                {/* Nút xóa category */}
                                <button onClick={() => handleDelete(category.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AdminCategoryPage;
