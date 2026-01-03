# Project 005 - E-Commerce Microservices Platform

A modern, scalable e-commerce application built with a microservices architecture. This project demonstrates a decoupled system design where distinct business domains are handled by independent services, orchestrating a seamless shopping experience from product discovery to shipping.


## 🚀 Overview

Project 005 is designed to simulate a real-world e-commerce ecosystem. It features a responsive Next.js frontend interacting with a suite of backend microservices via REST APIs. The platform supports key e-commerce flows including user authentication, product catalog browsing, cart management, checkout with promotions, order tracking, and shipping dispatch.

## 🏗 Architecture

The system is composed of the following microservices:

*   **Frontend (Web)**: A Next.js application (React) with Tailwind CSS, acting as the user interface and API gateway aggregator.
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
    cd web
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
├── web/                    # Next.js Frontend
├── docker-compose.yml      # Orchestration config
└── README.md               # This file
```

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
cd web
npm install       # Installing dependencies
npm test          # Runs Vitest unit tests
```

**3. Frontend E2E Tests (Playwright):**
For E2E tests, you need to install Playwright browsers first:
```bash
cd web
npm install
npx playwright install chromium --with-deps # Isolate browser binary installation
npm run test:e2e  # Runs Playwright E2E tests
```

### ✅ What is Tested?
- **Backend Unit Tests**: Validation of critical business logic within Controllers and Services (e.g., price calculations, stock deduction, promotion rules).
- **Backend API Tests**: Integration tests for all REST endpoints using `supertest`. These tests mock downstream HTTP dependencies (via `axios` mocks) to test each service in isolation without requiring the full microservice mesh to be running.
- **Frontend Unit Tests**: Verification of component rendering, user interactions, and specific state logic for key pages (e.g., Dashboard).
- **End-to-End (E2E) Tests**: Critical user flows (e.g., Dashboard loading, data presentation) are verified against a running frontend instance. Network interception is used to mock backend responses, ensuring deterministic and fast UI tests.

### 🚧 Limitations & Future Work
- **Database Integration**: Currently, the system uses in-memory mock databases. Real database integration tests (e.g., with Postgres or MongoDB testcontainers) are not currently covered.
- **Contract Testing**: Formal consumer-driven contract testing (e.g., Pact) between microservices is not implemented.
- **Full E2E Integration**: While key flows are tested with mocks, full, live integration tests running against all real containerized services simultaneously are not part of the standard CI test suite to maintain speed and isolation.
