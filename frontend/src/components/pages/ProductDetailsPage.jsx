import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/productDetailsPage.css';

const ProductDetailsPage = () => {

    // Lấy `productId` từ URL thông qua `useParams`
    const { productId } = useParams();

    // Lấy `cart` (danh sách sản phẩm trong giỏ) và `dispatch` (để thay đổi state) từ CartContext
    const { cart, dispatch } = useCart();

    // Khởi tạo state để lưu trữ thông tin sản phẩm
    const [product, setProduct] = useState(null);

    // Gọi `fetchProduct` mỗi khi `productId` thay đổi
    useEffect(() => {
        fetchProduct();
    }, [productId]);

    // Hàm gọi API để lấy thông tin sản phẩm theo `productId`
    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId); // Gọi API lấy sản phẩm
            setProduct(response.product); // Lưu dữ liệu sản phẩm vào state
        } catch (error) {
            console.log(error.message || error); // In lỗi nếu có
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = () => {
        if (product) {
            dispatch({ type: 'ADD_ITEM', payload: product }); // Gửi action để thêm sản phẩm
        }
    };

    // Hàm tăng số lượng sản phẩm trong giỏ
    const incrementItem = () => {
        if (product) {
            dispatch({ type: 'INCREMENT_ITEM', payload: product }); // Gửi action tăng số lượng
        }
    };

    // Hàm giảm số lượng sản phẩm trong giỏ
    const decrementItem = () => {
        if (product) {
            // Tìm sản phẩm trong giỏ hàng
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({ type: 'DECREMENT_ITEM', payload: product }); // Nếu số lượng > 1 thì giảm
            } else {
                dispatch({ type: 'REMOVE_ITEM', payload: product }); // Nếu chỉ còn 1 thì xóa khỏi giỏ
            }
        }
    };

    // Nếu sản phẩm chưa được tải, hiển thị thông báo loading
    if (!product) {
        return <p>Loading product details ...</p>;
    }

    // Kiểm tra xem sản phẩm này có trong giỏ hàng không
    const cartItem = cart.find(item => item.id === product.id);

    return (
        <div className="product-detail">
            <img src={product?.imageUrl} alt={product?.name} />

            <h1>{product?.name}</h1>

            <p>{product?.description}</p>

            <span>${product.price.toFixed(2)}</span>

            {/* Nếu sản phẩm đã có trong giỏ hàng thì hiển thị điều khiển số lượng */}
            {cartItem ? (
                <div className="quantity-controls">
                    <button onClick={decrementItem}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={incrementItem}>+</button>
                </div>
            ) : (
                // Nếu chưa có thì hiển thị nút "Add To Cart"
                <button onClick={addToCart}>Add To Cart</button>
            )}
        </div>
    );
};

export default ProductDetailsPage;