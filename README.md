# InventoryPro

InventoryPro is a full-stack Inventory & Order Management System built with Java, Spring Boot, React, TypeScript, PostgreSQL, and REST APIs.

The application helps businesses manage products, customers, orders, inventory levels, and sales reporting through a responsive dashboard.

## Features

### Inventory Management

- Product inventory management
- Product CRUD operations
- Inventory quantity tracking
- Automatic inventory reduction when orders are placed
- Low-stock and reorder alerts
- Product search and filtering
- Inventory value tracking

### Customer Management

- Customer management
- Customer contact information
- Customer order history
- Sales totals by customer

### Order Management

- Multi-item order creation
- Order tracking
- Order status management
- Order totals and line-item calculations
- Customer-specific order history
- Automatic stock updates after orders are placed

### Reporting & Analytics

- Reporting dashboard
- Total revenue reporting
- Total order and product metrics
- Orders grouped by status
- Top-selling products
- Units-sold calculations
- Revenue by product
- Sales by customer
- Customer purchase history
- Low-stock reporting

### Database & API

- PostgreSQL relational database
- Spring Data JPA repositories
- Custom JPA/JPQL database queries
- Derived repository queries
- Aggregate queries using SUM and COUNT
- GROUP BY and ORDER BY reporting queries
- REST API architecture
- Input validation
- Spring Security configuration
- CORS configuration for React/Spring Boot integration

### User Interface

- Responsive React dashboard
- Product management interface
- Customer management interface
- Order management interface
- Reorder alert interface
- Reporting and analytics interface

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- PostgreSQL
- Maven
- REST APIs

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API

## Database Query Features

InventoryPro demonstrates database querying beyond basic CRUD operations.

Examples include:

- Finding orders by customer
- Filtering orders by status
- Calculating top-selling products
- Aggregating units sold
- Calculating revenue by product
- Calculating sales by customer
- Counting customer orders
- Calculating total items purchased
- Grouping and sorting sales data

The reporting system uses Spring Data JPA, derived repository methods, and custom JPQL queries with joins, `SUM`, `COUNT`, `GROUP BY`, and `ORDER BY`.

## Reporting Dashboard

The reporting dashboard provides business insights including:

- Total Revenue
- Total Orders
- Total Products
- Low Stock Products
- Orders by Status
- Top Selling Products
- Customer Order History
- Sales by Customer

## Project Structure

```text
inventory-order-management
├── inventory
│   └── Spring Boot backend
├── frontend
│   └── React + TypeScript frontend
└── README.md
```

## Architecture

InventoryPro follows a layered full-stack architecture:

```text
React + TypeScript Frontend
          ↓
       REST API
          ↓
Spring Boot Controllers
          ↓
      Services
          ↓
Spring Data JPA Repositories
          ↓
     PostgreSQL
```

## Purpose

InventoryPro was developed as a portfolio project demonstrating full-stack software engineering with Java and modern web technologies.

The project demonstrates experience with:

- Object-oriented Java development
- Spring Boot application development
- REST API design
- Relational database design
- Database querying and aggregation
- Spring Data JPA and Hibernate
- React and TypeScript development
- Frontend/backend integration
- Inventory and order-management business logic
- Reporting and analytics

## Screenshots

### Dashboard

![InventoryPro Dashboard](screenshots/dashboard.png)

### Products

![InventoryPro Products](screenshots/products.png)

### Orders

![InventoryPro Orders](screenshots/orders.png)

### Reports & Database Queries

![InventoryPro Reports](screenshots/reports.png)
