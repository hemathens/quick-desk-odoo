# QuickDesk Backend – API & Integration Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Environment Setup](#environment-setup)
4. [Authentication & Roles](#authentication--roles)
5. [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Questions](#questions)
    - [Dashboard](#dashboard)
    - [Admin](#admin)
6. [Realtime Events (Socket.IO)](#realtime-events-socketio)
7. [Testing](#testing)
8. [Admin Account Setup](#admin-account-setup)
9. [Project Structure](#project-structure)
10. [Contact & Contribution](#contact--contribution)

---

## Project Overview

QuickDesk is a modern support/ticketing and Q&A system.  
This backend provides all APIs for user management, questions, answers, voting, admin controls, and more.  
It is **secure, modular, and ready for production**.

---

## Tech Stack

- **Node.js** + **Express.js** (REST API)
- **MongoDB** (Mongoose ODM)
- **JWT** (Authentication)
- **Socket.IO** (Realtime events)
- **Nodemailer** (Email notifications)
- **Jest + Supertest** (Testing)

---

## Environment Setup

1. **Clone the repo and install dependencies:**
    ```bash
    cd backend
    npm install
    ```

2. **Configure environment variables:**
    - Copy `.env.example` to `.env` and fill in your values:
      ```
      MONGODB_URI=mongodb://localhost:27017/quickdesk
      JWT_SECRET=your_jwt_secret_here
      EMAIL_USER=your_email@example.com
      EMAIL_PASS=your_email_password
      ```

3. **Start the backend:**
    ```bash
    npm run dev
    ```
    The server runs at `http://localhost:5000`

---

## Authentication & Roles

- **Roles:** `user`, `agent`, `admin`
- **JWT** is used for authentication.  
  Pass the token in the `Authorization` header as `Bearer <token>` for all protected endpoints.

**Role Permissions:**

| Role    | Permissions                                                                 |
| ------- | ----------------------------------------------------------------------------|
| user    | Register, login, ask questions, view/reply to own tickets, edit profile     |
| agent   | All user permissions + view all tickets, comment, update status, assign self|
| admin   | All agent permissions + manage users, roles, tickets, questions, categories |

---

## API Endpoints

### Auth

| Method | Endpoint                       | Description                        | Auth Required | Role      |
|--------|------------------------------- |------------------------------------|--------------|-----------|
| POST   | `/auth/register`               | Register a new user                | No           | -         |
| POST   | `/auth/login`                  | Login and get JWT                  | No           | -         |
| GET    | `/auth/me`                     | Get current user profile           | Yes          | Any       |
| PUT    | `/auth/profile`                | Update user profile                | Yes          | Any       |
| POST   | `/auth/request-upgrade`        | Request upgrade to agent           | Yes          | user      |
| GET    | `/auth/upgrade-requests`       | List all upgrade requests          | Yes          | admin     |
| PUT    | `/auth/approve-upgrade/:id`    | Approve/reject upgrade request     | Yes          | admin     |

**Register Example:**
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Login Example:**
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```
Response:
```json
{
  "token": "JWT_TOKEN",
  "user": { ... }
}
```

---

### Questions

| Method | Endpoint                        | Description                        | Auth Required | Role      |
|--------|---------------------------------|------------------------------------|--------------|-----------|
| POST   | `/questions`                    | Ask a question                     | Yes          | Any       |
| GET    | `/questions`                    | List questions (filters/search)    | No           | -         |
| GET    | `/questions/:id`                | Get question details               | No           | -         |
| PUT    | `/questions/:id`                | Edit question (owner only)         | Yes          | user/agent|
| DELETE | `/questions/:id`                | Delete question (owner/admin)      | Yes          | user/admin|
| POST   | `/questions/:id/vote`           | Upvote/downvote a question         | Yes          | Any       |
| POST   | `/questions/:id/answer`         | Add an answer                      | Yes          | Any       |

**Ask Question Example:**
```json
POST /questions
{
  "title": "How to use QuickDesk?",
  "description": "Explain the main features.",
  "tags": ["help", "intro"]
}
```

**Vote Example:**
```json
POST /questions/QUESTION_ID/vote
{
  "type": "up" // or "down"
}
```

---

### Dashboard

| Method | Endpoint                        | Description                        | Auth Required | Role      |
|--------|---------------------------------|------------------------------------|--------------|-----------|
| GET    | `/dashboard/admin/overview`     | Admin stats overview               | Yes          | admin     |
| GET    | `/dashboard/user/stats`         | User-specific stats                | Yes          | Any       |

---

### Admin

| Method | Endpoint                        | Description                        | Auth Required | Role      |
|--------|---------------------------------|------------------------------------|--------------|-----------|
| POST   | `/admin/categories`             | Add category                       | Yes          | admin     |
| GET    | `/admin/categories`             | List categories                    | Yes          | admin     |
| PUT    | `/admin/categories/:id`         | Edit category                      | Yes          | admin     |
| DELETE | `/admin/categories/:id`         | Delete category                    | Yes          | admin     |
| GET    | `/admin/users`                  | List all users                     | Yes          | admin     |
| PUT    | `/admin/users/:id/role`         | Change user role                   | Yes          | admin     |
| DELETE | `/admin/users/:id`              | Delete user                        | Yes          | admin     |
| GET    | `/admin/tickets`                | List all tickets                   | Yes          | admin     |
| DELETE | `/admin/tickets/:id`            | Delete ticket                      | Yes          | admin     |
| GET    | `/admin/questions`              | List all questions                 | Yes          | admin     |
| DELETE | `/admin/questions/:id`          | Delete question                    | Yes          | admin     |

---

## Realtime Events (Socket.IO)

- **Socket.IO** is enabled at the backend.
- Connect to `ws://localhost:5000` using the Socket.IO client.
- Events you can listen for or emit (examples, you can extend as needed):
    - `ticketStatusChanged` – When a ticket status is updated
    - `newAnswer` – When a new answer is posted
    - `adminNotification` – For admin alerts

**Example (frontend JS):**
```js
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('ticketStatusChanged', data => { /* ... */ });
```

---

## Testing

- Run all backend tests:
    ```bash
    npm test
    ```
- Tests cover registration, login, question creation, and more.

---

## Admin Account Setup

- **No default admin is hardcoded for security.**
- To create an admin:
    1. Register a user via `/auth/register`:
        - Email: `admin@quickdesk.com`
        - Password: `Admin@12345`
    2. Promote this user to admin:
        - Via MongoDB:
            ```
            db.users.updateOne({ email: "admin@quickdesk.com" }, { $set: { role: "admin" } })
            ```
        - Or via the admin API:
            ```
            PUT /admin/users/:id/role
            Body: { "role": "admin" }
            ```
    3. Use these credentials to log in to the admin panel.

---

## Project Structure

```
backend/
  src/
    controllers/
    models/
    routes/
    middlewares/
    utils/
    app.js
  config/
  tests/
  .env.example
  package.json
  README.md
```

---

## Contact & Contribution

- For questions, contact the backend team or open an issue.
- To contribute, fork the repo, create a branch, and submit a pull request.
- Please write tests for new features.

---

**This document is designed for frontend integration. If you need more details on any endpoint, request/response shape, or want to add new features, just ask the backend team!**