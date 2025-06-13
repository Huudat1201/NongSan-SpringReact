import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../style/addProduct.css'
import ApiService from "../../service/ApiService";

const EditProductPage = () => {
    // Lấy productId từ URL params
    const { productId } = useParams();

    // Các state lưu dữ liệu sản phẩm cần sửa
    const [image, setImage] = useState(null); // file ảnh mới upload
    const [categories, setCategories] = useState([]); // danh sách category
    const [categoryId, setCategoryId] = useState(''); // category được chọn
    const [name, setName] = useState(''); // tên sản phẩm
    const [description, setDescription] = useState(''); // mô tả sản phẩm
    const [message, setMessage] = useState(''); // thông báo lỗi hoặc thành công
    const [price, setPrice] = useState(''); // giá sản phẩm
    const [imageUrl, setImageUrl] = useState(null); // link ảnh để preview

    const navigate = useNavigate();

    // Khi component mount hoặc productId thay đổi, gọi API để lấy dữ liệu
    useEffect(() => {
        // Lấy danh sách category để fill vào dropdown
        ApiService.getAllCategory()
            .then((res) => setCategories(res.categoryList));

        // Nếu có productId thì lấy thông tin sản phẩm theo id
        if (productId) {
            ApiService.getProductById(productId)
                .then((response) => {
                    setName(response.product.name);
                    setDescription(response.product.description);
                    setPrice(response.product.price);
                    setCategoryId(response.product.categoryId);
                    setImageUrl(response.product.imageUrl);
                });
        }
    }, [productId]);

    // Xử lý khi chọn ảnh mới
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // lưu file ảnh mới
        setImageUrl(URL.createObjectURL(e.target.files[0])); // tạo preview ảnh mới
    };

    // Xử lý submit form cập nhật sản phẩm
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Nếu có ảnh mới thì thêm vào formData
            if (image) {
                formData.append('image', image);
            }
            formData.append('productId', productId);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            // Gọi API update sản phẩm
            const response = await ApiService.updateProduct(formData);

            if (response.status === 200) {
                setMessage(response.message);

                // Sau 3s, xoá message và điều hướng về trang danh sách sản phẩm
                setTimeout(() => {
                    setMessage('');
                    navigate('/admin/products');
                }, 3000);
            }

        } catch (error) {
            // Hiển thị lỗi nếu có
            setMessage(error.response?.data?.message || error.message || 'unable to update product');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2>Edit Product</h2>
            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {message && <div className="message">{message}</div>}

            {/* Input chọn file ảnh */}
            <input type="file" onChange={handleImageChange} />

            {/* Hiển thị preview ảnh */}
            {imageUrl && <img src={imageUrl} alt={name} />}

            {/* Dropdown chọn category */}
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
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
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            {/* Nút submit form */}
            <button type="submit">Update</button>
        </form>
    );
}

export default EditProductPage;
