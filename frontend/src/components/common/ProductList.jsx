import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext.js';
import '../../style/productList.css';

const ProductList = ({ products }) => {
    const { cart, dispatch } = useCart();

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (product) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    }

    // Tăng số lượng sản phẩm trong giỏ
    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    // Giảm số lượng sản phẩm trong giỏ
    // Nếu số lượng > 1 thì giảm, nếu = 1 thì xóa sản phẩm khỏi giỏ
    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    return (
        <div className="product-list">
            {/* Duyệt qua danh sách sản phẩm */}
            {products.map((product, index) => {
                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                const cartItem = cart.find(item => item.id === product.id);

                return (
                    <div className="product-item" key={index}>
                        {/* Link tới trang chi tiết sản phẩm */}
                        <Link to={`/product/${product.id}`}>
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <span>${product.price.toFixed(2)}</span>
                        </Link>

                        {/* Nếu sản phẩm đã có trong giỏ, hiện controls tăng giảm số lượng */}
                        {cartItem ? (
                            <div className="quantity-controls">
                                <button onClick={() => decrementItem(product)}> - </button>
                                <span>{cartItem.quantity}</span>
                                <button onClick={() => incrementItem(product)}> + </button>
                            </div>
                        ) : (
                            // Nếu chưa có, hiện nút thêm vào giỏ
                            <button onClick={() => addToCart(product)}>Add To Cart</button>
                        )}
                    </div>
                )
            })}
        </div>
    )
};

export default ProductList;
