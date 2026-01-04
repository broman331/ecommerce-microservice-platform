# Project 005 - E-Commerce Microservices Platform

A modern, scalable e-commerce application built with a microservices architecture. This project demonstrates a decoupled system design where distinct business domains are handled by independent services, orchestrating a seamless shopping experience from product discovery to shipping. It is fully configured for multi-cloud deployment (AWS & GCP).

## 🚀 Overview

Project 005 is designed to simulate a real-world e-commerce ecosystem. It features a responsive Next.js frontend interacting with a suite of backend microservices via REST APIs. The platform supports key e-commerce flows including user authentication, product catalog browsing, cart management, checkout with promotions, order tracking, and shipping dispatch.

## 🏗 Architecture

The system is composed of the following microservices:

*   **Frontend (Dashboard-Admin)**: A Next.js application (React) with Tailwind CSS, acting as the user interface and API gateway aggregator.
*   **User Service**: Manages user authentication (JWT) and profiles.
*   **Product Service**: Aggregator service that enriches product data with order statistics.
*   **Order Service**: Manages order creation, lifecycle (Pending -> Delivered), and history.
*   **Cart Service**: persistent shopping cart management with support for promotions and shipping address association.
*   **Inventory Service**: Tracks stock levels and handles reservations/deductions.
*   **Shipping Service**: Manages shipping addresses, mock distributor integration, and shipment tracking.
*   **Promotions Service**: Logic for validating and applying discount codes.
*   **Wishlist Service**: Allows users to save products for later.
*   **Customer Service**: Aggregator layer ("BFF" pattern) for providing comprehensive customer views to the frontend.

## 🛠 Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express, TypeScript.
*   **Data Access Layer**: Repository Pattern (supporting Memory, DynamoDB, Firestore).
*   **Infrastructure**: Docker, Docker Compose, AWS Lambda (Serverless), Google Cloud Run.
*   **CI/CD**: GitHub Actions (Multi-cloud deployment).

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose

### 🐳 Docker Setup (Recommended)
The easiest way to run the entire system locally is via Docker Compose.

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
    *Note: Local development defaults to In-Memory repositories unless `DB_PROVIDER` environment variable is set.*

## ☁️ Deployment

This project supports multi-cloud deployment via **Serverless Framework (AWS)** and **Google Cloud Run (GCP)**.

### AWS Deployment (Serverless)
Deploy any microservice to AWS Lambda & DynamoDB:

1.  **Prerequisites**: AWS CLI configured, Serverless Framework (`npm i -g serverless`).
2.  **Deploy**:
    ```bash
    cd services/inventory
    sls deploy --stage dev
    ```
    *Resources (DynamoDB Tables, Lambdas) are auto-provisioned.*

### GCP Deployment (Cloud Run)
Deploy to Google Cloud Run with Firestore:

1.  **Prerequisites**: `gcloud` CLI installed & authenticated.
2.  **Deploy**:
    ```bash
    cd services/inventory
    gcloud builds submit --config cloudbuild.yaml .
    ```
    *Builds container artifact and deploys to Cloud Run.*

## 🚀 CI/CD Pipelines

The project includes a robust **GitHub Actions** workflow (`.github/workflows/deploy-release.yml`) for automated deployment.

*   **Trigger**: Manual `workflow_dispatch` event.
*   **Inputs**:
    *   `cloud_provider`: Select `aws` or `gcp`.
*   **Jobs**:
    *   **Backend**: Deploys all 9 microservices in parallel (or sequential optimized steps).
    *   **Frontend**: Deploys the Dashboard-Admin app after backend success.

## 📂 Project Structure

```
project-005/
├── services/               # Backend Microservices
│   ├── cart/               # Shopping Cart (Repo Pattern: Memory/Dynamo/Firestore)
│   ├── customer/           # Aggregator (Repo Pattern: Memory/Dynamo/Firestore)
│   ├── inventory/          # Inventory Management
│   ├── order/              # Order Processing
│   ├── product/            # Product Aggregator
│   ├── promotions/         # Discount Logic
│   ├── shipping/           # Shipping & Addresses
│   ├── user/               # Auth & Profile
│   └── wishlist/           # User Wishlists
├── Dashboard-Admin/        # Next.js Frontend
├── .github/workflows/      # CI/CD Workflows
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

### ✅ What is Tested?
- **Backend**: API endpoints, Business Logic, Repository implementations.
- **Frontend**: Component rendering, Client-side logic, E2E critical paths (Dashboard loading, Network Mocking).

For detailed testing instructions, refer to the `TestReports` directory or running `npm test` in specific service directories.
