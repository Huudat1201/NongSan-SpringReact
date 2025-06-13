import React, {createContext, useReducer, useContext, useEffect} from "react";

// Tạo một điểm tập trung để lưu trữ và chia sẻ trạng thái giỏ hàng.
const CartContext = createContext();

// Khởi tạo giỏ hàng rỗng nếu chưa có dữ liệu giỏ hàng nào được lưu trữ trước đó.
// Tải lại (khôi phục) giỏ hàng từ localStorage nếu dữ liệu đã tồn tại.
const initialState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
}


const cartReducer = (state, action) =>{
    switch(action.type){
        //Thêm sản phẩm
        case 'ADD_ITEM': {
            // Tìm kiếm trong giỏ hàng hiện tại xem sản phẩm bạn muốn thêm đã có chưa.
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            let newCart;

            // Nếu sp có thì tăng số lượng lên 1, không thì số lượng sp mới là 1. 
            if(existingItem){
                newCart = state.cart.map(item =>
                    item.id === action.payload.id
                    ? {...item, quantity: item.quantity + 1}
                    : item
                );
            }else {
                newCart = [...state.cart, {...action.payload, quantity: 1 }];
            }

            // Cập nhật lại sp trong giỏ hàng.
            localStorage.setItem('cart', JSON.stringify(newCart));
            return {...state, cart:newCart};
        }

        // Xóa một sp khỏi giỏ hàng.
        case 'REMOVE_ITEM':{
            // Cái sp nào trùng thì xóa ra.
            const newCart = state.cart.filter(item=> item.id !== action.payload.id);
            // Cập nhật sp trong giỏ hàng.
            localStorage.setItem('cart', JSON.stringify(newCart));
            return {...state, cart:newCart};
        }

        // Giảm số lượng sp.
        case 'DECREMENT_ITEM': {
            const newCart = state.cart.map(item =>
                item.id === action.payload.id && item.quantity > 1
                ? {...item, quantity: item.quantity -1}
                :item
            )
            localStorage.setItem('cart', JSON.stringify(newCart));
            return {...state, cart:newCart};
        }

        // Tăng số lượng sp.
        case 'INCREMENT_ITEM': {
            const newCart = state.cart.map(item=>
                item.id === action.payload.id
                ? {...item, quantity: item.quantity + 1}
                :item
            );
            localStorage.setItem('cart', JSON.stringify(newCart));
            return {...state, cart:newCart};
        }

        // Reset cart 
        case 'CLEAR_CART': {
            localStorage.removeItem('cart');
            return {...state, cart:[]};
        }
        default:
            return state;
    }
};


export const CartProvider = ({children}) => {

    const [state, dispatch] = useReducer(cartReducer, initialState);


    useEffect(() =>{
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    return (
        <CartContext.Provider value={{cart: state.cart, dispatch}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);