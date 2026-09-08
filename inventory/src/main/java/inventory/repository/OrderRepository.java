package inventory.repository;

import inventory.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByStatus(String status);

    @Query("""
            SELECT oi.product.name,
                   oi.product.sku,
                   SUM(oi.quantity),
                   SUM(oi.lineTotal)
            FROM OrderItem oi
            GROUP BY oi.product.id,
                     oi.product.name,
                     oi.product.sku
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<Object[]> findTopSellingProducts();

    @Query("""
            SELECT o.customer.id,
                   o.customer.firstName,
                   o.customer.lastName,
                   COUNT(DISTINCT o.id),
                   SUM(oi.quantity),
                   SUM(oi.lineTotal)
            FROM Order o
            JOIN o.items oi
            WHERE UPPER(o.status) <> 'CANCELLED'
            GROUP BY o.customer.id,
                     o.customer.firstName,
                     o.customer.lastName
            ORDER BY SUM(oi.lineTotal) DESC
            """)
    List<Object[]> findSalesByCustomer();
}