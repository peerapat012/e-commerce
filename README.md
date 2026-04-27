# 🛒 Mini E-commerce Backend (Node.js + TypeORM + RabbitMQ)

## 📌 Overview

This project is a mini e-commerce backend built with Node.js, Express, TypeORM, and PostgreSQL.

It demonstrates:

* Authentication (JWT)
* Cart & Product management
* Order processing with transactional consistency
* Asynchronous processing using RabbitMQ

---

## Tech Stack

* Node.js + Express
* TypeScript
* PostgreSQL + TypeORM
* RabbitMQ (event-driven processing)
* Docker (optional)

---

## Features

### Auth

* Register / Login
* JWT (Access + Refresh Token)

### Cart

* Add / Update / Remove items
* Persistent cart per user

### Order

* Create order from cart (snapshot-based)
* Transactional safety (DB transaction)
* Order status lifecycle (PENDING → PAID / FAILED)

### RabbitMQ

* Publish `order_created` event
* Consumer processes:

  * Decrease product stock
  * Update order status

---

## System Flow

### 1. Create Order (API)

1. Fetch user cart
2. Validate cart & stock
3. Create Order + OrderItems (snapshot)
4. Clear cart
5. Commit transaction
6. Publish `order_created` event

---

### 2. Order Processing (Worker)

Consumer listens to `order_created`:

1. Load order + items
2. Check idempotency (status = PENDING)
3. Decrease stock (atomic update)
4. Update order status → PAID
5. Ack message

---

## Key Design Decisions

### 🔹 Snapshot OrderItem

Order items store:

* productId
* productName
* price

👉 Prevents data inconsistency when product changes

---

### 🔹 Transaction Handling

Order creation uses a DB transaction to ensure:

* Order + OrderItems + Cart clearing are consistent

---

### 🔹 Event-Driven Architecture

RabbitMQ is used to:

* Decouple order creation from heavy processing
* Improve API response time
* Simulate microservice-ready architecture

---

### 🔹 Idempotent Consumer

Consumer checks order status before processing to avoid:

* Duplicate message issues
* Stock corruption

---

### 🔹 Atomic Stock Update

Stock is updated using conditional query:

```sql
UPDATE product
SET stock = stock - ?
WHERE id = ? AND stock >= ?
```

👉 Prevents overselling in concurrent scenarios

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for local development, optional)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd e-commerce
```

### 2. Setup environment

Create a `.env.docker` file in the root directory:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=db

RABBITMQ_URL=amqp://admin:password123@rabbitmq:5672

ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
```

### 3. Run with Docker

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- RabbitMQ message broker
- Your Node.js application (API + Worker)

The API will be available at `http://localhost:3000`

### Alternative: Manual Setup

If you prefer running without Docker:

1. Install dependencies

```bash
npm install
```

2. Setup `.env` file (similar to `.env.docker` but adjust hosts to `localhost`)

3. Start services manually:

- Start PostgreSQL & RabbitMQ (via Docker or locally)
- Run API: `npm run dev`
- Run Worker: `npm run worker`

---

## 🧪 Testing Flow

1. Register / Login
2. Add product to cart
3. Create order
4. Check worker logs:

```text
Processing order: xxx
Order confirmed
```

---

## 📌 Future Improvements

* Payment integration
* Retry & Dead Letter Queue
* Outbox pattern (guaranteed delivery)
* Microservice separation (Order / Product / Auth)

---

## 👨‍💻 Author

Peerapat Srisarungkarn