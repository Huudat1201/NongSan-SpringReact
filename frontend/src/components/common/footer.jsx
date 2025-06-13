import React from "react";
import '../../style/footer.css';
import { NavLink } from "react-router-dom";

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer-links">
                <ul>
                    <NavLink to={"/"}>Về chúng tôi</NavLink>
                    <NavLink to={"/"}>Liên hệ</NavLink>
                    <NavLink to={"/"}>Điều khoản & Điều kiện</NavLink>
                    <NavLink to={"/"}>Chính sách bảo mật</NavLink>
                    <NavLink to={"/"}>Câu hỏi thường gặp</NavLink>
                </ul>
            </div>
            <div className="footer-info">
                <p>&copy; 2025 Đạt code Spring + React</p>
            </div>
        </footer>
    );

}
export default Footer;