package com.huudat1201.specification;

import com.huudat1201.entity.OrderItem;
import com.huudat1201.enums.OrderStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class OrderItemSpecification {

    /**
     * Tạo Specification để lọc theo trạng thái đơn hàng.
     *
     * @param status trạng thái đơn hàng cần lọc
     * @return Specification cho trạng thái, hoặc null nếu không truyền vào
     */
    public static Specification<OrderItem> hasStatus(OrderStatus status){
        return (root, query, criteriaBuilder) ->
                status != null ? criteriaBuilder.equal(root.get("status"), status) : null;
    }

    /**
     * Tạo Specification để lọc các đơn hàng được tạo trong khoảng thời gian.
     *
     * @param startDate thời điểm bắt đầu (có thể null)
     * @param endDate thời điểm kết thúc (có thể null)
     * @return Specification theo khoảng ngày tạo
     */
    public static Specification<OrderItem> createdBetween(LocalDateTime startDate, LocalDateTime endDate){
        return (root, query, criteriaBuilder) -> {
            if (startDate != null && endDate != null){
                return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            } else if (endDate != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
            } else {
                return null; // không áp dụng filter nếu cả 2 đều null
            }
        };
    }

    /**
     * Tạo Specification để lọc theo ID của OrderItem.
     *
     * @param itemId ID của order item
     * @return Specification cho ID, hoặc null nếu không truyền
     */
    public static Specification<OrderItem> hasItemId(Long itemId){
        return (root, query, criteriaBuilder) ->
                itemId != null ? criteriaBuilder.equal(root.get("id"), itemId) : null;
    }
}