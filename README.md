# Inventory Management System (Backend)

This is a **Node.js + Express + MySQL** backend project where I’m building an **Inventory Management System from scratch**, focusing on real-world backend logic, data consistency, and security.

This project is part of my **#SundayCodingJourney**, where I consistently build and improve backend systems step by step.

---

## 🚀 Features

### Products
- Full Product CRUD (create, read, update, delete)
- Stock management
- Admin-only access for create/update/delete

### Users
- User CRUD
- Password hashing with bcrypt
- Role system (`admin`, `user`)
- JWT-based authentication

### Orders
- Create orders with multiple items
- MySQL transactions to ensure data consistency
- Atomic stock updates to avoid race conditions
- Order listing with pagination
- User-specific orders (`My Orders`)
- Order details with permission control
- Role-based access (admin vs user)

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

## 📈 Project Goals

- Practice real backend development patterns
- Handle concurrency and data consistency
- Build a solid, production-like REST API
- Prepare a strong backend portfolio project

---

## 🚧 Upcoming Features

- Order cancellation and stock rollback
- Order status history (audit log)
- Deployment
- Automated testing

---
