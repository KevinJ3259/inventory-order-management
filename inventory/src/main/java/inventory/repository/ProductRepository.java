package inventory.repository;

import inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByQuantityInStockLessThanEqual(Integer quantity);

    @Query("""
            SELECT p
            FROM Product p
            WHERE p.quantityInStock <= p.reorderLevel
            """)
    List<Product> findProductsAtOrBelowReorderLevel();
}
