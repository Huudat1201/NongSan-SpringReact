import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminOrderPage.css';
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

// Danh sách các trạng thái đơn hàng
const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrdersPage = () => {
    // State quản lý tất cả đơn hàng
    const [orders, setOrders] = useState([]);

    // State chứa danh sách đơn hàng sau khi lọc (để hiển thị trên UI)
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Trạng thái lọc (theo trạng thái đơn hàng)
    const [statusFilter, setStatusFilter] = useState('');

    // Trang hiện tại (phục vụ phân trang)
    const [currentPage, setCurrentPage] = useState(1);

    // Tổng số trang sau khi lọc
    const [totalPages, setTotalPages] = useState(0);

    // Lỗi khi gọi API
    const [error, setError] = useState(null);

    // Số lượng đơn hàng trên mỗi trang
    const itemsPerPage = 4;

    // Điều hướng sang trang chi tiết đơn hàng
    const navigate = useNavigate();

    // Khi component mount lần đầu, gọi API lấy tất cả đơn hàng
    useEffect(() => {
        fetchOrders();
    }, []);

    // Mỗi khi đơn hàng, trạng thái lọc, hoặc trang hiện tại thay đổi → cập nhật danh sách hiển thị
    useEffect(() => {
        applyFilter();
    }, [statusFilter, orders, currentPage]);

    // Gọi API lấy toàn bộ danh sách đơn hàng
    const fetchOrders = async () => {
        try {
            const response = await ApiService.getAllOrders();
            const orderList = response.orderItemList || [];
            setOrders(orderList);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch orders');
            setTimeout(() => setError(''), 3000); // Ẩn lỗi sau 3 giây
        }
    };

    // Áp dụng bộ lọc theo trạng thái và phân trang
    const applyFilter = () => {
        // Nếu có trạng thái lọc → lọc theo trạng thái; nếu không → dùng toàn bộ đơn hàng
        let filtered = statusFilter
            ? orders.filter(order => order.status === statusFilter)
            : orders;

        // Cập nhật tổng số trang và danh sách đơn hàng hiển thị
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setFilteredOrders(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    };

    // Khi người dùng chọn trạng thái lọc khác
    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset về trang đầu tiên
    };

    // Xử lý điều hướng sang trang chi tiết đơn hàng
    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`);
    };

    return (
        <div className="admin-orders-page">
            <h2>Orders</h2>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}

            {/* Bộ lọc trạng thái đơn hàng */}
            <div className="filter-container">
                <div className="statusFilter">
                    <label>Filter By Status</label>
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng hiển thị danh sách đơn hàng */}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Date Ordered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user.name}</td>
                            <td>{order.status}</td>
                            <td>${order.price.toFixed(2)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleOrderDetails(order.id)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Component phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminOrdersPage;
