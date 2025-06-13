import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/cart.css';

const CartPage = () => {
    // Lấy dữ liệu giỏ hàng và hàm dispatch để xử lý hành động từ context
    const { cart, dispatch } = useCart();

    // Biến state để hiển thị thông báo (ví dụ: khi checkout thành công hoặc lỗi)
    const [message, setMessage] = useState(null);

    // Hook dùng để chuyển trang
    const navigate = useNavigate();

    // Hàm tăng số lượng sản phẩm trong giỏ
    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    // Hàm giảm số lượng sản phẩm, nếu chỉ còn 1 thì xóa luôn khỏi giỏ
    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    // Tính tổng tiền của toàn bộ sản phẩm trong giỏ
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Hàm xử lý khi người dùng nhấn nút "Checkout"
    const handleCheckout = async () => {
        // Nếu chưa đăng nhập thì chuyển hướng sang trang login
        if (!ApiService.isAuthenticated()) {
            setMessage("Bạn cần đăng nhập trước khi đặt hàng");
            setTimeout(() => {
                setMessage('');
                navigate("/login");
            }, 3000);
            return;
        }

        // Tạo danh sách sản phẩm gửi lên server để đặt hàng
        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        // Tạo object chứa thông tin đơn hàng
        const orderRequest = {
            totalPrice,
            items: orderItems,
        }

        try {
            // Gửi request tạo đơn hàng
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message);

            // Sau vài giây thì ẩn thông báo
            setTimeout(() => {
                setMessage('');
            }, 5000);

            // Nếu tạo đơn thành công thì xóa giỏ hàng
            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' });
            }

        } catch (error) {
            // Bắt lỗi và hiển thị thông báo
            setMessage(error.response?.data?.message || error.message || 'Đặt hàng thất bại');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="cart-page">
            <h1>Giỏ hàng</h1>
            {/* Hiển thị thông báo nếu có */}
            {message && <p className="response-message">{message}</p>}

            {/* Nếu giỏ hàng rỗng thì hiển thị thông báo */}
            {cart.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống</p>
            ) : (
                <div>
                    <ul>
                        {/* Duyệt qua từng sản phẩm trong giỏ để hiển thị */}
                        {cart.map(item => (
                            <li key={item.id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div>
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <div className="quantity-controls">
                                        {/* Nút giảm số lượng */}
                                        <button onClick={() => decrementItem(item)}>-</button>
                                        {/* Số lượng hiện tại */}
                                        <span>{item.quantity}</span>
                                        {/* Nút tăng số lượng */}
                                        <button onClick={() => incrementItem(item)}>+</button>
                                    </div>
                                    {/* Hiển thị giá sản phẩm */}
                                    <span>${item.price.toFixed()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Hiển thị tổng tiền và nút đặt hàng */}
                    <h2>Tổng cộng: ${totalPrice.toFixed(2)}</h2>
                    <button className="checkout-button" onClick={handleCheckout}>Đặt hàng</button>
                </div>
            )}
        </div>
    )
}

export default CartPage;
