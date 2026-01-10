# Inventory Management System (Backend)

This is a **Node.js + Express + MySQL** backend project where I’m building an **Inventory Management System from scratch**, focusing on real-world backend logic, data consistency, and security.

This project is part of my **#SundayCodingJourney**, where I consistently build and improve backend systems step by step.

---

## 🚀 Features

### Products
- Full Product CRUD (create, read, update, delete)
- Stock management
- Soft delete support (deleted_at)
- Soft-deleted products are excluded from reads and updates
- Admin-only access for create/update/delete

### Users
- User CRUD
- Password hashing with bcrypt
- Role system (`admin`, `user`)
- JWT-based authentication

### Orders
- Create orders with multiple items
- MySQL transactions to ensure data consistency
- Row-level locking (SELECT ... FOR UPDATE) to prevent race conditions
- Atomic stock updates
- Order listing with pagination
- User-specific orders (`My Orders`)
- Order details with permission control (admin vs user)
- Order cancellation with automatic stock rollback
- Order completion (admin only)
- Order status history (audit log)

### Security
- JWT authentication middleware
- Role-based authorization middleware
- Protected routes for sensitive operations

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- bcryptjs
- JSON Web Tokens (JWT)
- dotenv

---

## 🧩 Architecture

- MVC pattern (Controllers, Routes, Models)
- Clear separation of concerns
- Service-oriented business logic
- Secure SQL queries (prepared statements)
- Transaction-based operations for critical flows

---

## 📌 API Highlights

- `POST /api/orders` → Create order (transactional)
- `GET /api/orders` → Get all orders (admin only, paginated)
- `GET /api/orders/my` → Get logged-in user orders
- `GET /api/orders/:id` → Get order details with permission checks
- `POST /api/products` → Admin only
- `PUT /api/products/:id` → Admin only
- `DELETE /api/products/:id` → Admin only

---
## 🧠 Key Design Decisions

- Soft delete is used for products to preserve historical data and avoid breaking existing orders
- Orders use transactions and row-level locks to ensure consistency under concurrent requests
- Order status changes are fully audited via an order_history table
- Explicit endpoints (/cancel, /complete) were chosen over generic status updates for clarity and maintainability

---

## 📈 Project Goals

- Practice real backend development patterns
- Handle concurrency and data consistency
- Build a solid, production-like REST API
- Prepare a strong backend portfolio project

---

## ✅ Project Status

This project is considered feature-complete and stable.
Future improvements (testing, deployment, monitoring) may be added separately, but the core system is finished.

---

## 📎 Notes

This repository focuses exclusively on backend logic.
No frontend is included.

---