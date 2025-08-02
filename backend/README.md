# QuickDesk Backend

## Overview
This is the advanced backend for the QuickDesk system, featuring:
- Role-based authentication (user, agent, admin)
- Admin panel controls
- Ticketing, Q&A, voting, answers, categories
- Role upgrade workflow
- Advanced search, filter, sort
- Email notifications (Nodemailer)
- Realtime updates (Socket.IO, ready for use)
- Comprehensive API test suite (Jest + Supertest)

---

## Tech Stack
- Node.js, Express.js
- MongoDB (Mongoose ODM)
- JWT for authentication
- Socket.IO for realtime
- Nodemailer for email
- Jest & Supertest for testing

---

## Getting Started

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend root:
```
MONGODB_URI=mongodb://localhost:27017/quickdesk
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 3. Create Initial Admin User
By default, you must register an admin manually:
1. Register a user via `/auth/register` (POST) with your desired admin email.
2. In the database, update this user's `role` to `admin` (or use the admin API if you have another admin).

**Example MongoDB command:**
```
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

Or use the admin API:
```
PUT /admin/users/:id/role
Body: { "role": "admin" }
```

### 4. Run the Server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

---

## Admin Credentials
- **Default:** No hardcoded admin. You must create one as above for security.
- **Tip:** Use a strong password and change the JWT secret in production.

---

## Example Admin Credentials (for First Login)
- **Email:** admin@quickdesk.com
- **Password:** Admin@12345

> Register this user via `/auth/register` and then update their role to `admin` in the database or via the admin API as described above. For production, change these credentials immediately after first login.

---

## API Overview
- **Auth:** Register, login, profile, role upgrade, admin approval
- **Questions:** CRUD, upvote/downvote, answer, search/filter/sort
- **Dashboard:** Admin stats, user stats
- **Admin:** Manage users, roles, tickets, questions, categories
- **Tickets:** (Extendable for support workflows)

All endpoints are protected by JWT and role-based middleware as appropriate.

---

## Testing
- Run all tests:
```bash
npm test
```
- Tests cover registration, login, question creation, and more.

---

## Advanced Features
- **Socket.IO:** Ready for realtime events (e.g., ticket status, new answers, notifications)
- **Nodemailer:** Email notifications for role upgrades and ticket status
- **Modular codebase:** Easy to extend with new features
- **Security:** Passwords hashed, JWT, role checks, input validation recommended

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

## Contributing
- Fork, branch, and PR as usual.
- Please write tests for new features.

---

## License
MIT 