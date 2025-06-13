import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // thêm useNavigate để điều hướng sau khi cập nhật
import '../../style/adminOrderDetails.css';
import ApiService from "../../service/ApiService";

// Danh sách các trạng thái đơn hàng có thể chọn
const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams(); // Lấy order item ID từ URL
    const navigate = useNavigate(); // Hook để điều hướng
    const [orderItems, setOrderItems] = useState([]); // Danh sách order item
    const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
    const [selectedStatus, setSelectedStatus] = useState({}); // Trạng thái được chọn cho từng item

    // Khi component mount hoặc itemId thay đổi thì gọi API lấy chi tiết đơn hàng
    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    // Gọi API lấy thông tin chi tiết của order item
    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList); // Lưu danh sách order item vào state
        } catch (error) {
            console.log(error.message || error);
        }
    };

    // Khi admin thay đổi trạng thái đơn hàng trong dropdown
    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    };

    // Gửi trạng thái mới đến server và chuyển về trang danh sách đơn hàng
    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            alert("Cập nhật trạng thái thành công"); // ✅ Thông báo bằng alert
            navigate('/admin/orders'); // ✅ Điều hướng về danh sách đơn hàng
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    };

    return (
        <div className="order-details-page">
            {message && <div className="message">{message}</div>}
            <h2>Order Details</h2>

            {orderItems.length ? (
                orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="order-item-details">
                        {/* Thông tin đơn hàng */}
                        <div className="info">
                            <h3>Order Information</h3>
                            <p><strong>Order Item ID:</strong> {orderItem.id}</p>
                            <p><strong>Quantity:</strong> {orderItem.quantity}</p>
                            <p><strong>Total Price:</strong> {orderItem.price}</p>
                            <p><strong>Order Status:</strong> {orderItem.status}</p>
                            <p><strong>Date Ordered:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* Thông tin người dùng */}
                        <div className="info">
                            <h3>User Information</h3>
                            <p><strong>Name:</strong> {orderItem.user.name}</p>
                            <p><strong>Email:</strong> {orderItem.user.email}</p>
                            <p><strong>Phone:</strong> {orderItem.user.phoneNumber}</p>
                            <p><strong>Role:</strong> {orderItem.user.role}</p>

                            {/* Thông tin địa chỉ giao hàng */}
                            <div className="info">
                                <h3>Delivery Address</h3>
                                <p><strong>Country:</strong> {orderItem.user.address?.country}</p>
                                <p><strong>State:</strong> {orderItem.user.address?.state}</p>
                                <p><strong>City:</strong> {orderItem.user.address?.city}</p>
                                <p><strong>Street:</strong> {orderItem.user.address?.street}</p>
                                <p><strong>Zip Code:</strong> {orderItem.user.address?.zipcode}</p>
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div>
                            <h2>Product Information</h2>
                            <img className="product-admin-info" src={orderItem.product.imageUrl} alt={orderItem.product.name} />
                            <p><strong>Name:</strong> {orderItem.product.name}</p>
                            <p><strong>Description:</strong> {orderItem.product.description}</p>
                            <p><strong>Price:</strong> {orderItem.product.price}</p>
                        </div>



                        {/* Thay đổi trạng thái đơn hàng */}
                        <div className="status-change">
                            <h4>Change Status</h4>
                            <select
                                className="status-option"
                                value={selectedStatus[orderItem.id] || orderItem.status}
                                onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
                            >
                                {OrderStatus.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button
                                className="update-status-button"
                                onClick={() => handleSubmitStatusChange(orderItem.id)}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading order details ...</p>
            )}
        </div>
    );
};

export default AdminOrderDetailsPage;
