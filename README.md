# AssignFlow Hub

**AssignFlow Hub** is a backend-heavy, workflow-driven educational management system designed to demonstrate **production-grade backend engineering**, not just CRUD operations.

The project models the **complete assignment lifecycle** — from classroom creation to submissions, grading, deadline enforcement, auditability, and system observability — with a strong emphasis on **security, correctness, and scalability**.

This repository intentionally prioritizes **architecture, data integrity, and backend systems design** over UI polish.

---

## 🎯 Project Purpose

Most classroom management demos stop at:
- basic CRUD
- role flags
- UI-driven logic

AssignFlow Hub was built to go further by answering questions like:
- How are deadlines enforced when no user is active?
- How do we audit **system actions** vs **user actions**?
- How do we observe background jobs in production?
- How do we design admin dashboards for **system health**, not control?

This project exists to demonstrate those answers.

---

## 🧠 Core Concepts Demonstrated

### 1. Role-Based Access Control (RBAC)
- Roles: **STUDENT**, **TEACHER**, **ADMIN**
- Authorization enforced **entirely on the backend**
- Admin users are provisioned out-of-band (no public signup)

### 2. Workflow-Driven Domain Design
- Classrooms → Assignments → Submissions → Grades
- Explicit state machines:
  - Submissions: `DRAFT → SUBMITTED → LOCKED`
  - Grades: `DRAFT → PUBLISHED`
- State transitions are validated server-side

### 3. Background Job Processing (BullMQ + Redis)
- Deadline enforcement is **not request-based**
- A dedicated worker process auto-locks expired submissions
- Jobs are:
  - repeatable
  - idempotent
  - resilient to restarts

### 4. Audit Logging (System & User Actions)
- Append-only audit logs
- Separate tracking for:
  - **SYSTEM actions** (background jobs)
  - **USER actions** (login, submission, grading)
- No public API exists to write audit logs (tamper-proof)

### 5. Admin Observability (Not CRUD)
The admin panel is **read-only** and focused on:
- system health
- operational metrics
- audit trails
- background job visibility

Admins **observe**, they do not modify business data.

---

## 🏗️ Key Features

### 👩‍🏫 Teacher Capabilities
- Create and manage classrooms
- Publish assignments with optional deadlines
- View student submissions
- Grade and publish results

### 👨‍🎓 Student Capabilities
- Join classrooms
- Upload and submit assignments
- View submission status
- View published grades

### ⚙️ System-Level Capabilities
- Automatic submission locking after deadlines
- Backend-enforced validation (no UI trust)
- Secure file handling via cloud storage
- Background job monitoring

---

## 📊 Admin Dashboard (Observability-Focused)

The admin dashboard exposes **analytics and health indicators**, including:

### Lifetime & Recent Metrics
- Total users / new users (24h, 7d)
- Classrooms created
- Student enrollments
- Assignments created
- Submissions (draft / submitted / locked)
- Grades published

### Health Ratios
- Submission completion rate
- Deadline miss rate
- Grading completion rate

### Alert Flags
- High deadline miss rate
- Low submission completion
- Grading backlog

### Operational Visibility
- Recent audit log events
- Background job execution health
- BullMQ dashboard (secured separately)

---

## 🔐 Security & Design Decisions

- **JWT-based authentication** (stateless)
- **Backend-only authorization** (no frontend trust)
- **Admin creation via seed script**, not UI
- **Background jobs separated from API server**
- **Audit logs written internally only**
- **BullMQ dashboard secured with Basic Auth**
- Defense-in-depth (RBAC + route guards)

---

## 🛠️ Tools & Technologies Used

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication

### Background Processing
- BullMQ
- Redis
- Dedicated worker process

### Cloud & Infrastructure
- AWS S3 (file storage)
- Docker (Redis container for local dev)

### Frontend
- React
- TypeScript
- Tailwind CSS

### Observability
- Audit logging (custom)
- BullMQ Dashboard (bull-board)

---

## 🧩 Why This Project Is Different

AssignFlow Hub is **not** a feature checklist project.

It focuses on:
- correctness over convenience
- backend truth over UI assumptions
- system behavior over happy paths
- observability over silent failures

It is designed to answer **“how would this behave in production?”**, not just **“does it work?”**.

---

## 🚀 Future Scope (Intentionally Planned)

- Time-series analytics (growth over time)
- Admin-only system alerts
- Audit log filtering & pagination
- Background job failure notifications
- Horizontal worker scaling

These are intentionally scoped as **future enhancements**, not rushed features.

---

## 👤 Author

Built as a **backend-centric portfolio project** to demonstrate:
- system design
- asynchronous processing
- operational thinking
- real-world backend patterns

---

## 📌 Final Note

If you’re reviewing this project:
- Focus on **architecture and data flow**
- Look at **how edge cases are handled**
- Observe how **system actions are audited**
- Notice what is **not** trusted to the frontend

That’s where the real learning lives.
