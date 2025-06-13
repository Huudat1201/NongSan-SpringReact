import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css';

// Định nghĩa component functional có tên LoginPage.
const LoginPage = () => {

    // Khai báo biến trạng thái 'formData' để lưu trữ dữ liệu từ các trường nhập liệu (email, password).
    // setFormData là hàm để cập nhật trạng thái này.
    const [formData, setFormData] = useState({
        email: '',    // Giá trị email ban đầu là chuỗi rỗng.
        password: ''  // Giá trị password ban đầu là chuỗi rỗng.
    });

    // Khai báo biến trạng thái 'message' để hiển thị các thông báo cho người dùng (thành công/thất bại).
    // setMessage là hàm để cập nhật thông báo này.
    const [message, setMessage] = useState(null);

    // Khởi tạo hàm 'navigate' từ hook useNavigate để có thể chuyển hướng người dùng.
    const navigate = useNavigate();

    // Hàm xử lý khi giá trị của các trường input thay đổi (người dùng gõ phím).
    const handleChange = (e) => {
        // Lấy thuộc tính 'name' (ví dụ: "email", "password") và 'value' (giá trị hiện tại của input)
        // từ phần tử input đã gây ra sự kiện.
        const { name, value } = e.target;
        // Cập nhật trạng thái 'formData':
        // - ...formData: Tạo một bản sao của đối tượng formData hiện có.
        // - [name]: value: Cập nhật giá trị cho thuộc tính có tên tương ứng (email hoặc password).
        setFormData({ ...formData, [name]: value });
    }

    // Hàm xử lý khi biểu mẫu được gửi (người dùng nhấn nút "Login").
    // Đây là một hàm bất đồng bộ vì nó sẽ gọi API.
    const handleSubmit = async (e) => {
        // Ngăn chặn hành vi mặc định của trình duyệt là tải lại trang khi submit form.
        e.preventDefault();
        try {
            // Gọi hàm loginUser từ ApiService và truyền dữ liệu form (email, password).
            // await: Đợi cho đến khi yêu cầu API hoàn tất và nhận được phản hồi.
            const response = await ApiService.loginUser(formData);
            // Kiểm tra nếu phản hồi API có trạng thái thành công (HTTP 200 OK).
            if (response.status === 200) {
                // Đặt thông báo thành công cho người dùng.
                setMessage("User Successfully Loged in");
                // Lưu token xác thực vào localStorage. Token này dùng để xác thực các yêu cầu API sau này.
                localStorage.setItem('token', response.token);
                // Lưu vai trò của người dùng (ví dụ: "admin", "user") vào localStorage.
                localStorage.setItem('role', response.role);
                // Đặt một hẹn giờ để chuyển hướng người dùng sau 4 giây.
                setTimeout(() => {
                    navigate("/profile") // Chuyển hướng đến trang /profile.
                }, 4000) // 4000 mili giây = 4 giây.
            }
        } catch (error) {
            // - || error.message: Nếu không có thông báo cụ thể từ API, lấy thông báo lỗi chung của JavaScript.
            // - || "unable to Login a user": Nếu cả hai đều không có, dùng thông báo mặc định.
            setMessage(error.response?.data.message || error.message || "unable to Login a user");
        }
    }

    return (
        <div className="register-page">
            <h2>Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email: </label>

                {/* Nhãn và trường nhập liệu cho Email */}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />

                {/* Nhãn và trường nhập liệu cho Password */}
                <label>Password: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password} 
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>

                <p className="register-link">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    )
}

export default LoginPage;