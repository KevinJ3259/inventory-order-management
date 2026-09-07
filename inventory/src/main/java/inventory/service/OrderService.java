package inventory.service;

import inventory.model.Customer;
import inventory.model.Order;
import inventory.model.OrderItem;
import inventory.model.Product;
import inventory.repository.CustomerRepository;
import inventory.repository.OrderRepository;
import inventory.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of(
            "PLACED",
            "PROCESSING",
            "SHIPPED",
            "COMPLETED",
            "CANCELLED");

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status.toUpperCase());
    }

    @Transactional
    public Order createOrder(Order order) {

        if (order.getCustomer() == null || order.getCustomer().getId() == null) {
            throw new RuntimeException("Customer id is required");
        }

        Customer customer = customerRepository
                .findById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException(
                        "Customer not found with id: "
                                + order.getCustomer().getId()));

        order.setCustomer(customer);

        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException(
                    "Order must contain at least one item");
        }

        BigDecimal orderTotal = BigDecimal.ZERO;

        for (OrderItem item : order.getItems()) {

            if (item.getProduct() == null
                    || item.getProduct().getId() == null) {
                throw new RuntimeException("Product id is required");
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Order item quantity must be greater than zero");
            }

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found with id: "
                                    + item.getProduct().getId()));

            if (product.getQuantityInStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName());
            }

            BigDecimal lineTotal = product.getPrice().multiply(
                    BigDecimal.valueOf(item.getQuantity()));

            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            item.setLineTotal(lineTotal);
            item.setOrder(order);

            product.setQuantityInStock(
                    product.getQuantityInStock() - item.getQuantity());

            productRepository.save(product);

            orderTotal = orderTotal.add(lineTotal);
        }

        order.setTotalAmount(orderTotal);
        order.setStatus("PLACED");

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {

        Order order = getOrderById(id);

        if (status == null || status.isBlank()) {
            throw new RuntimeException("Order status is required");
        }

        String normalizedStatus = status.trim().toUpperCase();

        if (!VALID_STATUSES.contains(normalizedStatus)) {
            throw new RuntimeException(
                    "Invalid order status: " + status);
        }

        order.setStatus(normalizedStatus);

        return orderRepository.save(order);
    }
}