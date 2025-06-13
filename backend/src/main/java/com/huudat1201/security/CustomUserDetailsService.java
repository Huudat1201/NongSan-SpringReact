package com.huudat1201.security;

import com.huudat1201.entity.User;
import com.huudat1201.exception.NotFoundException;
import com.huudat1201.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Triển khai UserDetailsService để tùy chỉnh cách lấy thông tin người dùng từ cơ sở dữ liệu.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    /**
     * Tải thông tin người dùng theo email (username).
     * Ném NotFoundException nếu không tìm thấy.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepo.findByEmail(username)
                .orElseThrow(()-> new NotFoundException("User/ Email Not found"));

        return AuthUser.builder()
                .user(user)
                .build();
    }
}
