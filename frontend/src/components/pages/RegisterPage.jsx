import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css';

const RegisterPage = () => {

    // State lưu trữ dữ liệu biểu mẫu đăng ký
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        password: ''
    });

    // State để hiển thị thông báo (thành công hoặc lỗi)
    const [message, setMessage] = useState(null);

    // Hook điều hướng
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Cập nhật giá trị của trường tương ứng trong formData
        setFormData({ ...formData, [name]: value });
    }

    // Hàm xử lý khi người dùng submit biểu mẫu
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn reload lại trang
        try {
            // Gửi dữ liệu đăng ký lên server
            const response = await ApiService.registerUser(formData);
            if (response.status === 200) {
                // Nếu thành công, hiển thị thông báo và chuyển hướng sau 4 giây
                setMessage("User Successfully Registered");
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
        } catch (error) {
            // Nếu lỗi, hiển thị thông báo lỗi
            setMessage(error.response?.data.message || error.message || "Unable to register a user");
        }
    }

    return (
        <div className="register-page">
            <h2>Register</h2>

            {message && <p className="message">{message}</p>}

            {/* Biểu mẫu đăng ký */}
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                <label>Name: </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required />
                <label>Phone Number: </label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required />
                <label>Password: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />
                <button type="submit">Register</button>

                {/* Liên kết chuyển đến trang đăng nhập nếu đã có tài khoản */}
                <p className="register-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
