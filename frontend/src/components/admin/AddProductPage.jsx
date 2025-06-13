import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/addProduct.css'
import ApiService from "../../service/ApiService";

const AddProductPage = () => {

    // Các state lưu thông tin sản phẩm mới
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);  // danh sách category lấy từ API
    const [categoryId, setCategoryId] = useState('');  // category được chọn
    const [name, setName] = useState('');  // tên sản phẩm
    const [description, setDescription] = useState('');  // mô tả sản phẩm
    const [message, setMessage] = useState('');  // thông báo thành công hoặc lỗi
    const [price, setPrice] = useState('');  // giá sản phẩm

    const navigate = useNavigate();

    // Lấy danh sách category khi component mount
    useEffect(() => {
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));
    }, [])

    // Xử lý khi người dùng chọn file ảnh
    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    // Xử lý submit form thêm sản phẩm mới
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tạo formData để gửi file ảnh cùng các trường khác
            const formData = new FormData();
            formData.append('image', image);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            // Gọi API thêm sản phẩm
            const response = await ApiService.addProduct(formData);
            if (response.status === 200) {
                setMessage(response.message);  // hiện thông báo thành công
                setTimeout(() => {
                    setMessage('');  // xóa thông báo sau 3 giây
                    navigate('/admin/products');  // chuyển về trang danh sách sản phẩm
                }, 3000);
            }

        } catch (error) {
            // Hiện lỗi nếu có
            setMessage(error.response?.data?.message || error.message || 'unable to upload product');
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Add Product</h2>
                {/* Hiện thông báo lỗi hoặc thành công */}
                {message && <div className="message">{message}</div>}

                {/* Input chọn file ảnh */}
                <input type="file" onChange={handleImage} />

                {/* Select chọn category */}
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Input tên sản phẩm */}
                <input 
                    type="text" 
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                />

                {/* Textarea mô tả sản phẩm */}
                <textarea 
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Input giá sản phẩm */}
                <input 
                    type="number" 
                    placeholder="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} 
                />

                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default AddProductPage;
