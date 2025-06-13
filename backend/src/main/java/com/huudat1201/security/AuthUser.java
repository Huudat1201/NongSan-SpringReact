package com.huudat1201.security;

import com.huudat1201.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


/**
 * Lớp ánh xạ User sang UserDetails để tích hợp với Spring Security.
 */
@Data
@Builder
public class AuthUser implements UserDetails {

    private User user;

    /**
     * Trả về quyền của người dùng dựa trên role.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    /**
     * Trả về mật khẩu của người dùng.
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * Trả về tên đăng nhập (ở đây là email).
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * Tài khoản không hết hạn.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Tài khoản không bị khóa.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Mật khẩu không hết hạn.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Tài khoản đang hoạt động.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}