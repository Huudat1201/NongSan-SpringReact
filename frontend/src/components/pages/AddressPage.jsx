import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/address.css';

const AddressPage = () => {

    // State lưu thông tin địa chỉ
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // State để hiển thị lỗi nếu có
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // dùng để chuyển trang
    const location = useLocation(); // lấy thông tin đường dẫn hiện tại

    // Nếu đường dẫn là /edit-address thì lấy thông tin người dùng
    useEffect(() => {
        if (location.pathname === '/edit-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);

    // Gọi API để lấy thông tin người dùng, trong đó có địa chỉ
    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.user.address) {
                setAddress(response.user.address); // nếu có địa chỉ thì set vào form
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Không thể lấy thông tin người dùng");
        }
    };

    // Xử lý khi người dùng thay đổi nội dung trong ô input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value // cập nhật theo tên trường
        }));
    };

    // Hàm xử lý khi submit form
    const handSubmit = async (e) => {
        e.preventDefault(); // chặn reload trang

        try {
            await ApiService.saveAddress(address); // gọi API lưu địa chỉ
            navigate("/profile"); // chuyển hướng về trang hồ sơ
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Lưu địa chỉ thất bại");
        }
    };

    return (
        <div className="address-page">
            {/* Tiêu đề thay đổi tùy theo chế độ thêm mới hay chỉnh sửa */}
            <h2>{location.pathname === '/edit-address' ? 'Chỉnh sửa địa chỉ' : "Thêm địa chỉ"}</h2>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}

            {/* Form nhập thông tin địa chỉ */}
            <form onSubmit={handSubmit}>
                <label>
                    Street:
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    City:
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    State:
                    <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Zip Code:
                    <input
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        required
                    />
                </label>
                
                {/* Nút submit form */}
                <button type="submit">
                    {location.pathname === '/edit-address' ? 'Cập nhật địa chỉ' : "Lưu địa chỉ"}
                </button>
            </form>
        </div>
    );
};

export default AddressPage;