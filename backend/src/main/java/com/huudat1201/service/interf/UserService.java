package com.huudat1201.service.interf;

import com.huudat1201.dto.LoginRequest;
import com.huudat1201.dto.Response;
import com.huudat1201.dto.UserDto;
import com.huudat1201.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getLoginUser();
    Response getUserInfoAndOrderHistory();
}
