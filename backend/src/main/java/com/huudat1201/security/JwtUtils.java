package com.huudat1201.security;

import com.huudat1201.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;


@Service
@Slf4j
public class JwtUtils {

    // Thời gian token hết hạn: 6 tháng
    private static final long EXPIRATION_TIME_IN_MILLISEC = 1000L * 60L * 60L * 24L * 30L * 6L;

    private SecretKey key; // Khóa bí mật dùng để ký và xác minh token

    @Value("${secreteJwtString}") // Giá trị cấu hình từ application.properties
    private String secreteJwtString; // Phải dài ít nhất 32 ký tự

    // Tạo khóa HmacSHA256 từ chuỗi cấu hình sau khi khởi tạo bean
    @PostConstruct
    private void init() {
        byte[] keyBytes = secreteJwtString.getBytes(StandardCharsets.UTF_8);
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    // Tạo token từ đối tượng User (lấy email làm username)
    public String generateToken(User user) {
        String username = user.getEmail();
        return generateToken(username);
    }

    // Tạo JWT từ username
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // Gán username làm subject của token
                .issuedAt(new Date(System.currentTimeMillis())) // Thời gian tạo token
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_IN_MILLISEC)) // Thời gian hết hạn
                .signWith(key) // Ký token với khóa bí mật
                .compact(); // Trả về chuỗi token
    }

    // Lấy username (subject) từ token
    public String getUsernameFromToken(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    // Hàm trích xuất thông tin từ claims với hàm xử lý cụ thể
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(
                Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()
        );
    }

    // Kiểm tra token có hợp lệ (đúng user và chưa hết hạn)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Kiểm tra token đã hết hạn hay chưa
    private boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

}
