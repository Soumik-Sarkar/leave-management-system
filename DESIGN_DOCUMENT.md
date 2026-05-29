# Leave Management System - Design Document

## Overview

The Leave Management System is a microservices-based backend application designed to manage employee leave workflows.

The system allows:

- Employees to apply for leaves
- Managers to approve/reject requests
- Notifications to be processed asynchronously

The architecture follows distributed microservices principles using Node.js, RabbitMQ, Docker, and MongoDB.

# Microservices

## API Gateway

Acts as the single entry point for all client requests.

Responsibilities:

- Request routing
- Centralized API access
- Security middleware

---

## Auth Service

Handles:

- User registration
- Login
- JWT generation
- Authentication & authorization

---

## Employee Service

Handles:

- Employee management
- Leave balance management
- Team management

---

## Leave Service

Handles:

- Leave application
- Leave approval/rejection
- Leave history
- Pagination/filtering

---

## Notification Service

Handles:

- RabbitMQ consumer
- Notification logging

# Database Design

MongoDB is used as the database.

Collections:

- users
- employees
- leaves

# Authentication Flow

1. User logs in
2. Auth Service validates credentials
3. JWT token is generated
4. Token is sent in Authorization header
5. Protected APIs validate token
6. Role-based authorization is enforced

# Inter-Service Communication

## Synchronous Communication

REST APIs are used between services.

Example:

- Leave Service → Employee Service

Purpose:

- Leave balance validation
- Leave deduction

---

## Asynchronous Communication

RabbitMQ is used for event-driven communication.

Events:

- LEAVE_APPLIED
- LEAVE_APPROVED
- LEAVE_REJECTED
- LEAVE_CANCELLED
- SYSTEM_ERROR

# Circuit Breaker Pattern

Circuit breaker is implemented using Opossum.

Purpose:

- Prevent cascading failures
- Improve fault tolerance
- Handle service downtime gracefully

Protected Calls:

- Leave Service → Employee Service

# Dockerization

Each microservice has:

- Dockerfile
- isolated container

Docker Compose is used to orchestrate:

- API Gateway
- Services
- MongoDB
- RabbitMQ
