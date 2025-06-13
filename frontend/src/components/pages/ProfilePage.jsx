import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/profile.css';
import Pagination from "../common/Pagination";

const ProfilePage = () => {

    // State lưu thông tin người dùng
    const [userInfo, setUserInfo] = useState(null);

    // State lưu lỗi nếu gọi API thất bại
    const [error, setError] = useState(null);

    // State quản lý trang hiện tại trong danh sách đơn hàng
    const [currentPage, setCurrentPage] = useState(1);

    // Số lượng đơn hàng hiển thị trên mỗi trang
    const itemsPerPage = 5;

    // Hook điều hướng
    const navigate = useNavigate();

    // Gọi API lấy thông tin người dùng sau khi component được mount
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Hàm gọi API để lấy thông tin người dùng đã đăng nhập
    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo(); // Gọi API
            setUserInfo(response.user); // Lưu thông tin người dùng vào state
        } catch (error) {
            // Nếu lỗi, lưu thông báo lỗi vào state
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        }
    };

    // Nếu thông tin người dùng chưa được tải, hiển thị thông báo loading
    if (!userInfo) {
        return <div>Loading...</div>;
    }

    // Hàm xử lý khi người dùng nhấn vào nút Thêm/Sửa địa chỉ
    const handleAddressClick = () => {
        // Nếu đã có địa chỉ thì điều hướng đến trang sửa, ngược lại đến trang thêm mới
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    };

    // Danh sách đơn hàng từ thông tin người dùng (có thể rỗng)
    const orderItemList = userInfo.orderItemList || [];

    // Tổng số trang = tổng đơn hàng chia cho số đơn trên mỗi trang
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);

    // Lấy danh sách đơn hàng của trang hiện tại
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="profile-page">
            <h2>Welcome {userInfo.name}</h2>

            {error ? (
                // Nếu có lỗi, hiển thị thông báo lỗi
                <p className="error-message">{error}</p>
            ) : (
                // Nếu không có lỗi, hiển thị thông tin người dùng và lịch sử đơn hàng
                <div>
                    {/* Thông tin cơ bản */}
                    <p><strong>Name: </strong>{userInfo.name}</p>
                    <p><strong>Email: </strong>{userInfo.email}</p>
                    <p><strong>Phone Number: </strong>{userInfo.phoneNumber}</p>

                    {/* Địa chỉ */}
                    <div>
                        <h3>Address</h3>
                        {userInfo.address ? (
                            // Nếu có địa chỉ thì hiển thị
                            <div>
                                <p><strong>Street: </strong>{userInfo.address.street}</p>
                                <p><strong>City: </strong>{userInfo.address.city}</p>
                                <p><strong>State: </strong>{userInfo.address.state}</p>
                                <p><strong>Zip Code: </strong>{userInfo.address.zipCode}</p>
                                <p><strong>Country: </strong>{userInfo.address.country}</p>
                            </div>
                        ) : (
                            // Nếu chưa có địa chỉ
                            <p>No Address information available</p>
                        )}

                        <button className="profile-button" onClick={handleAddressClick}>
                            {userInfo.address ? "Edit Address" : "Add Address"}
                        </button>
                    </div>

                    {/* Lịch sử đơn hàng */}
                    <h3>Order History</h3>
                    <ul>
                        {paginatedOrders.map(order => (
                            <li key={order.id}>
                                <img src={order.product?.imageUrl} alt={order.product.name} />
                                <div>
                                    <p><strong>Name: </strong>{order.product.name}</p>
                                    <p><strong>Status: </strong>{order.status}</p>
                                    <p><strong>Quantity: </strong>{order.quantity}</p>
                                    <p><strong>Price: </strong>{order.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Phân trang */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
