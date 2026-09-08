package inventory.controller;

import inventory.model.Order;
import inventory.model.Product;
import inventory.repository.OrderRepository;
import inventory.repository.ProductRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;

        public ReportController(
                        OrderRepository orderRepository,
                        ProductRepository productRepository) {

                this.orderRepository = orderRepository;
                this.productRepository = productRepository;
        }

        @GetMapping("/summary")
        public Map<String, Object> getSummary() {

                List<Order> orders = orderRepository.findAll();
                List<Product> products = productRepository.findAll();

                BigDecimal totalRevenue = orders.stream()
                                .filter(order -> !"CANCELLED".equalsIgnoreCase(order.getStatus()))
                                .map(Order::getTotalAmount)
                                .filter(total -> total != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                long placedOrders = orders.stream()
                                .filter(order -> "PLACED".equalsIgnoreCase(order.getStatus()))
                                .count();

                long processingOrders = orders.stream()
                                .filter(order -> "PROCESSING".equalsIgnoreCase(order.getStatus()))
                                .count();

                long shippedOrders = orders.stream()
                                .filter(order -> "SHIPPED".equalsIgnoreCase(order.getStatus()))
                                .count();

                long completedOrders = orders.stream()
                                .filter(order -> "COMPLETED".equalsIgnoreCase(order.getStatus()))
                                .count();

                long cancelledOrders = orders.stream()
                                .filter(order -> "CANCELLED".equalsIgnoreCase(order.getStatus()))
                                .count();

                long lowStockCount = products.stream()
                                .filter(product -> product.getQuantityInStock() <= product.getReorderLevel())
                                .count();

                Map<String, Object> summary = new HashMap<>();

                summary.put("totalRevenue", totalRevenue);
                summary.put("totalOrders", orders.size());
                summary.put("totalProducts", products.size());
                summary.put("lowStockCount", lowStockCount);

                summary.put("placedOrders", placedOrders);
                summary.put("processingOrders", processingOrders);
                summary.put("shippedOrders", shippedOrders);
                summary.put("completedOrders", completedOrders);
                summary.put("cancelledOrders", cancelledOrders);

                return summary;
        }

        @GetMapping("/top-selling-products")
        public List<Map<String, Object>> getTopSellingProducts() {

                return orderRepository
                                .findTopSellingProducts()
                                .stream()
                                .map(row -> {
                                        Map<String, Object> result = new HashMap<>();

                                        result.put("productName", row[0]);
                                        result.put("sku", row[1]);
                                        result.put("unitsSold", row[2]);
                                        result.put("revenue", row[3]);

                                        return result;
                                })
                                .toList();
        }

        @GetMapping("/customers/{customerId}/orders")
        public List<Map<String, Object>> getCustomerOrderHistory(
                        @PathVariable Long customerId) {

                return orderRepository
                                .findByCustomerId(customerId)
                                .stream()
                                .map(order -> {
                                        Map<String, Object> result = new HashMap<>();

                                        result.put("orderId", order.getId());
                                        result.put("orderDate", order.getOrderDate());
                                        result.put("status", order.getStatus());
                                        result.put("totalAmount", order.getTotalAmount());
                                        result.put(
                                                        "itemCount",
                                                        order.getItems() == null
                                                                        ? 0
                                                                        : order.getItems().size());

                                        return result;
                                })
                                .toList();
        }

        @GetMapping("/sales-by-customer")
        public List<Map<String, Object>> getSalesByCustomer() {

                return orderRepository
                                .findSalesByCustomer()
                                .stream()
                                .map(row -> {
                                        Map<String, Object> result = new HashMap<>();

                                        result.put("customerId", row[0]);
                                        result.put("firstName", row[1]);
                                        result.put("lastName", row[2]);
                                        result.put("orderCount", row[3]);
                                        result.put("itemsPurchased", row[4]);
                                        result.put("totalSpent", row[5]);

                                        return result;
                                })
                                .toList();
        }
}
