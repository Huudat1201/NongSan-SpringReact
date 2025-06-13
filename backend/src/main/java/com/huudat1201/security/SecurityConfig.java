package com.huudat1201.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // Đánh dấu class này là một class cấu hình Spring
@EnableWebSecurity // Bật bảo mật web cho ứng dụng
@EnableMethodSecurity // Cho phép sử dụng @PreAuthorize, @Secured ở mức method
@RequiredArgsConstructor // Tự động tạo constructor cho các field final
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter; // Filter xử lý JWT để xác thực request

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable) // Vô hiệu hóa CSRF vì sử dụng JWT (không dùng session)
                .cors(Customizer.withDefaults()) // Cho phép cấu hình CORS mặc định
                .authorizeHttpRequests(request -> request
                        // Cho phép truy cập không cần xác thực đến các endpoint sau:
                        .requestMatchers("/auth/**", "/category/**", "/product/**", "/order/**").permitAll()
                        // Các endpoint khác phải xác thực mới được truy cập
                        .anyRequest().authenticated()
                )
                // Không lưu trạng thái session, vì JWT là stateless
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Đăng ký filter JWT, chạy trước filter UsernamePasswordAuthenticationFilter mặc định
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build(); // Trả về cấu hình chuỗi filter bảo mật
    }

    // Bean để mã hóa mật khẩu với thuật toán BCrypt (rất phổ biến và bảo mật)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean cung cấp AuthenticationManager dùng cho việc xác thực
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}