# Project 005 - E-Commerce Microservices Platform

A modern, scalable e-commerce application built with a microservices architecture. This project demonstrates a decoupled system design where distinct business domains are handled by independent services, orchestrating a seamless shopping experience from product discovery to shipping.


## 🚀 Overview

Project 005 is designed to simulate a real-world e-commerce ecosystem. It features a responsive Next.js frontend interacting with a suite of backend microservices via REST APIs. The platform supports key e-commerce flows including user authentication, product catalog browsing, cart management, checkout with promotions, order tracking, and shipping dispatch.

## 🏗 Architecture

The system is composed of the following microservices:

*   **Frontend (Dashboard-Admin)**: A Next.js application (React) with Tailwind CSS, acting as the user interface and API gateway aggregator.
*   **User Service**: Manages user authentication (JWT) and profiles.
*   **Product Service**: Handles product catalog, details, and enriched data (aggregated from Inventory).
*   **Order Service**: Manages order creation, lifecycle (Pending -> Delivered), and history.
*   **Cart Service**: persistent shopping cart management with support for promotions and shipping address association.
*   **Inventory Service**: Tracks stock levels and handles reservations/deductions.
*   **Shipping Service**: Manages shipping addresses, mock distributor integration, and shipment tracking.
*   **Promotions Service**: specific logic for validating and applying discount codes.
*   **Wishlist Service**: Allows users to save products for later.
*   **Customer Service**: An aggregation layer ("BFF" pattern) for providing comprehensive customer views to the frontend (e.g., Admin Customer Details).

## 🛠 Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express, TypeScript.
*   **Infrastructure**: Docker, Docker Compose for orchestration.
*   **Communication**: REST over HTTP.
*   **Data**: In-memory mock databases (for demonstration simplicity) with persistent patterns.

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose

### 🐳 Docker Setup (Recommended)
The easiest way to run the entire system is via Docker Compose.

1.  **Build and Start Services**:
    ```bash
    docker-compose up -d --build
    ```
2.  **Access the Application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

    *Services will be running on ports 3001-3009 mapping to host localhost.*

3.  **Stop Services**:
    ```bash
    docker-compose down
    ```

### 🔧 Local Development Setup
If you prefer running services individually (e.g., for debugging):

1.  **Frontend**:
    ```bash
    cd Dashboard-Admin
    npm install
    npm run dev
    ```
    Access at `http://localhost:3000`.

2.  **Backend Services**:
    Each service in the `/services` directory needs to be started separately.
    ```bash
    cd services/cart # (or any other service)
    npm install
    npm run dev
    ```

## ✨ Key Features

*   **Storefront**: Browse products with "New Arrival" badges and rich details.
*   **Shopping Cart**: Real-time cart updates, promo code application, and shipping address selection.
*   **User Accounts**: Login/Register validation and profile management.
*   **Order Management**: Detailed order history, status tracking, and dispatch simulation.
*   **Admin Dashboard**:
    *   **Promotions**: Create and toggle discount codes.
    *   **Customers**: View customer details, order history, and addresses.
    *   **Shipping**: Dispatch orders to mock distributors.
*   **Responsive Design**: Fully optimized for mobile and desktop experiences.

## 📂 Project Structure

```
project-005/
├── services/               # Backend Microservices
│   ├── cart/
│   ├── customer/
│   ├── inventory/
│   ├── order/
│   ├── product/
│   ├── promotions/
│   ├── shipping/
│   ├── user/
│   └── wishlist/
├── Dashboard-Admin/        # Next.js Frontend
├── docs/                   # Documentation (Architecture, OpenAPI Specs)
├── scripts/                # Utility and test scripts
├── docker-compose.yml      # Orchestration config
└── README.md               # This file
```

## 📜 Workspace Rule: Strict-API-Contract

To ensure stability across the microservice ecosystem, all changes must strictly adhere to the [OpenAPI specification](./docs/openapi.yaml).

### Constraints
1.  **Backend Services**:
    *   Must NOT change port numbers (3001, 3002, 3003, etc.).
    *   Must NOT change route signatures without explicit approval.
2.  **Frontend (Dashboard-Admin)**:
    *   Must use the exact endpoints defined in the OpenAPI spec.

## 🧪 Quality Assurance (QA)

### Types of Tests
We employ a multi-layered testing strategy to ensure reliability across the microservices and frontend hierarchy.

### 🛠 Tech Stack
- **Backend (Unit & Integration)**: Jest, Supertest, ts-jest
- **Frontend (Unit)**: Vitest, React Testing Library
- **Frontend (E2E)**: Playwright

### 🚦 Running Tests

To run tests, you must first install dependencies in the respective directories:

**1. Backend Services:**
Navigate to any service (e.g., `services/cart`) and run:
```bash
cd services/cart
npm install       # Installing dependencies
npm test          # Runs Jest unit and API tests
```

**2. Frontend Unit Tests:**
```bash
cd Dashboard-Admin
npm install       # Installing dependencies
npm test          # Runs Vitest unit tests
```

**3. Frontend E2E Tests (Playwright):**
For E2E tests, you need to install Playwright browsers first:
```bash
cd Dashboard-Admin
npm install
npx playwright install chromium --with-deps # Isolate browser binary installation
npm run test:e2e  # Runs Playwright E2E tests
```

### ✅ What is Tested?

The test suite covers the following areas:

#### 1. Backend API & Unit Tests
Each microservice is tested independently using `Supertest` and `Jest`.
- **Customer Service**:
  - `GET /customers/me/orders`: Fetching user order history.
  - `GET /customers/me/wishlist`: Retrieving user wishlist items.
  - Unit tests for `CustomerController` logic.
- **Product Service**:
  - `GET /store/products`: Aggregating product data with inventory status.
  - Logic for calculating order statistics (e.g., "Total Orders").
- **Order Service**:
  - `POST /orders`: Order creation flow, including stock deduction via Inventory service mocks.
  - `GET /orders`: Retrieving order details.
- **Cart Service**:
  - `POST /cart/:id/items`: Adding items, validating stock availability.
  - `POST /cart/:id/checkout`: Converting cart to order.
- **Inventory Service**:
  - `POST /products`: Creating new inventory items.
  - `POST /products/:id/deduct`: Handling stock reservations and insufficient stock errors.
- **Shipping Service**:
  - `POST /shipping/dispatch`: Generating tracking numbers and shipments.
  - Address management endpoints.
- **Promotions Service**:
  - `POST /promotions/apply`: Validating codes (percentage/fixed) and minimum order values.
- **User Service**:
  - `POST /auth/register`: User creation and duplicate checks.
  - `POST /auth/login`: Credential validation and token generation.
- **Wishlist Service**:
  - CRUD operations for managing user wishlists.

#### 2. Frontend Tests
- **Unit Tests (Vitest)**:
  - **Dashboard**: Verifies rendering of "Recent Orders" and "Active Carts" components.
  - Validation of client-side logic for data fetching hooks.
- **E2E Tests (Playwright)**:
  - **Dashboard Loading**: Verifies the application loads and displays critical information.
  - **Network Mocking**: Demonstrates how to intercept calls to backend services (Cart, Customer, Promotions) to ensure UI tests are not flaky due to backend state.

### 🚧 Limitations & Future Work

While the current strategy ensures code quality and isolation, the following areas are planned for future improvements:

- **Database Integration**: Currently, services use in-memory mock databases. Future tests will integrate **Testcontainers** (Postgres/MongoDB) to validate actual SQL/NoSQL queries and transactions.
- **Contract Testing**: Implementing **Pact** to ensure API contracts between microservices (e.g., Order -> Inventory) are strictly accepted, preventing regression when API schemas change.
- **Full E2E Integration**: Adding a suite of "Live System" tests that run against the actual Dockerized environment (no mocks) to verify network connectivity and service discovery in a production-like setting.
- **Error Scenarios**: Expanding test coverage to simulate timeout/500 errors from dependent services (e.g., how Order Service handles Inventory downtime).
- **Authentication**: Implementing more rigorous JWT validation tests across all protected endpoints.
- **Complex Promotions**: Adding tests for edge cases like conflicting promotion rules or expiration dates.
- **Frontend Flows**: Expanding Playwright coverage to include the full "Checkout" wizard and "Product Details" interactions.
