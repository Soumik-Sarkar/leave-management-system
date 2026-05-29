# Leave Management System - Microservices Backend

A backend-based Leave Management System built using Node.js microservices architecture with JWT authentication, API Gateway, RabbitMQ messaging, Docker, and MongoDB.

## Features

- JWT-based Authentication & Authorization
- Role-Based Access Control (Employee / Manager)
- Leave Application Workflow
- Leave Approval / Rejection
- Leave Balance Management
- Leave History with Filtering & Pagination
- RabbitMQ-based Notification System
- API Gateway
- Swagger API Documentation
- Dockerized Microservices
- Centralized Error Handling
- Health Check Endpoints

## Project Demo

- Google Drive: https://drive.google.com/file/d/1tJU7GTE0UE9P9Kt-xf_xDdbYQrUCwWzK/view?usp=drive_link

## Source Code

- Github: https://github.com/Soumik-Sarkar/leave-management-system

## Architecture Diagram

```text
Client
   ↓
API Gateway
   ↓
------------------------------------------------
| Auth Service | Employee Service | Leave Service |
------------------------------------------------
                    ↓
           Notification Service
                    ↓
               RabbitMQ

Shared Infrastructure:
- MongoDB
- Docker
```

## Tech Stack

| Technology     | Purpose               |
| -------------- | --------------------- |
| Node.js        | Backend Runtime       |
| Express.js     | REST APIs             |
| MongoDB        | Database              |
| RabbitMQ       | Async Messaging       |
| JWT            | Authentication        |
| Swagger        | API Documentation     |
| Docker         | Containerization      |
| Docker Compose | Service Orchestration |

## Microservices

### Auth Service

Handles:

- User Registration
- Login
- JWT Token Generation
- Role-based Authentication

### Employee Service

Handles:

- Employee Management
- Leave Balance Management
- Team Member APIs

### Leave Service

Handles:

- Leave Application
- Leave Approval / Rejection
- Leave History
- Pagination & Filtering

### Notification Service

Handles:

- RabbitMQ Consumer
- Notification Logging

### API Gateway

Handles:

- Centralized Routing
- Request Forwarding
- Security Middleware

## Environment Variables

### Auth Service

PORT=3001

MONGO_URI=mongodb://mongo:27017/auth-service

JWT_SECRET=your_secret_key

### Employee Service

PORT=3002

MONGO_URI=mongodb://mongo:27017/employee-service

### Leave Service

PORT=3003

MONGO_URI=mongodb://mongo:27017/leave-service

EMPLOYEE_SERVICE_URL=http://employee-service:3002

### Gateway

PORT=8080

AUTH_SERVICE_URL=http://auth-service:3001

EMPLOYEE_SERVICE_URL=http://employee-service:3002

LEAVE_SERVICE_URL=http://leave-service:3003

## Running with Docker

### Build Containers

```bash
docker-compose build
```

### Start Application

```bash
docker-compose up
```

### Stop Application

```bash
docker-compose down
```

## Swagger Documentation

| Service          | Swagger URL                    |
| ---------------- | ------------------------------ |
| Auth Service     | http://localhost:3001/api-docs |
| Employee Service | http://localhost:3002/api-docs |
| Leave Service    | http://localhost:3003/api-docs |

## API Testing Flow

1. Register User
2. Login to get JWT Token
3. Use Bearer Token for protected APIs
4. Create Employee
5. Apply Leave
6. Approve / Reject Leave
7. View Leave History
8. Verify Notifications

## Health Check Endpoints

| Service          | Endpoint |
| ---------------- | -------- |
| Gateway          | /health  |
| Auth Service     | /health  |
| Employee Service | /health  |
| Leave Service    | /health  |
