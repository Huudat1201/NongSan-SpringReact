import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ApiService from './ApiService.js';


// Nếu người dùng đã đăng nhập, thì cho vào trang đó (Component).
// Nếu chưa đăng nhập, thì chuyển hướng (<Navigate />) sang trang /login.
export const ProtectedRoute = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAuthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};


// Nếu là admin, thì cho truy cập.
// Nếu không phải admin → bị chuyển về /login.
export const AdminRoute = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAdmin() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};
