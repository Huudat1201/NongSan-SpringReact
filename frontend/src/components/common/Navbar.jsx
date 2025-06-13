import React, { useState } from 'react';
import '../../style/navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';

const Navbar = () => {
    // Lưu giá trị tìm kiếm trong ô input
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    // Kiểm tra xem user có phải admin không
    const isAdmin = ApiService.isAdmin();
    // Kiểm tra xem user đã đăng nhập chưa
    const isAuthenticated = ApiService.isAuthenticated();

    // Khi người dùng gõ tìm kiếm thì cập nhật giá trị
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    }

    // Khi submit form tìm kiếm thì chuyển trang kèm query tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`)
    }

    // Xử lý đăng xuất, hỏi người dùng có chắc không, rồi logout và chuyển trang login
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            ApiService.logout();
            setTimeout(() => {
                navigate('/login')
            }, 500);
        }
    }

    return (
        <nav className='navbar'>
            {/* Logo, click sẽ về trang chủ */}
            <div className="navbar-link">
                <NavLink to="/" >Đạt FullStack
                </NavLink>
            </div>

            {/* Form tìm kiếm sản phẩm */}
            <form className='navbar-search' onSubmit={handleSearchSubmit}>
                <input
                    type='text'
                    placeholder='Search product'
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <button type='submit'>Search</button>
            </form>

            {/* Các link điều hướng */}
            <div className='navbar-link'>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/categories'>Categories</NavLink>

                {/* Nếu đã đăng nhập thì hiện link My Account */}
                {isAuthenticated && <NavLink to='/profile'>My Account</NavLink>}

                {/* Nếu là admin thì hiện link Admin */}
                {isAdmin && <NavLink to='/admin'>Admin</NavLink>}

                {/* Nếu chưa đăng nhập thì hiện Login */}
                {!isAuthenticated && <NavLink to='/login'>Login</NavLink>}

                {/* Nếu đã đăng nhập thì hiện Logout, nhấn logout sẽ gọi hàm xử lý */}
                {isAuthenticated && <NavLink onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</NavLink>}

                {/* Link giỏ hàng */}
                <NavLink to='/cart'>Cart</NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
