# AssignFlow Hub — System Overview (MVP)

**AssignFlow Hub** is a workflow-based assignment management system designed for a single educational institute.  
The system enforces strict backend-driven authorization, ownership-based data access, and controlled file handling.

This document defines the **core system behavior** and **rules** for the MVP, inspired by real-world platforms like Google Classroom (conceptually, not functionally copied).

---

## 1. Roles (MVP Scope)

### Included Roles
- **STUDENT**
- **TEACHER**

### Explicitly Excluded (Future)
- **ADMIN**

> Admin functionality will be introduced as a **separate, dedicated panel** in a future version to avoid privilege shortcuts in the MVP.

---

## 2. Core System Entities

The system revolves around **four core entities**:

1. **Classroom**
2. **Membership**
3. **Assignment**
4. **Submission**

Each entity follows strict ownership and visibility rules enforced **on the backend**.

---

## 3. Classroom

### Description
A classroom represents a subject-specific space (e.g. *Maths*, *English*) created and owned by a teacher.

### Rules
- A classroom:
  - is created by exactly **one teacher**
  - has a **unique join code**
- Teachers:
  - can only view classrooms created by their own account
- Students:
  - cannot see a classroom unless they join it
  - join classrooms **only via join code**

### States
- `ACTIVE`
- `ARCHIVED` (read-only)

---

## 4. Membership (Student ↔ Classroom)

### Description
Membership represents the relationship between a student and a classroom.

### Rules
- A student:
  - cannot join the same classroom more than once
  - can leave a classroom
  - can rejoin later using the same join code
- Membership is required for:
  - viewing assignments
  - submitting work
  - receiving grades

> Membership is modeled as a **separate entity** to prevent duplicate joins and ensure strict access control.

---

## 5. Assignment

### Description
Assignments are created by teachers within a classroom.  
They may represent graded work or permanent study material.

### Properties
- Belongs to **one classroom**
- Created by the classroom’s teacher
- Allowed file types: `PDF`, `DOCX`
- Due date: optional

### Types
- `GRADED`
- `MATERIAL` (non-graded, permanent)

### States
- `DRAFT`
- `PUBLISHED`

### Visibility Rules
- Students can only see assignments that:
  - belong to classrooms they have joined
  - are in `PUBLISHED` state
- Teachers can only manage assignments they created

---

## 6. Submission

### Description
A submission represents a student’s response to a specific assignment.

### Rules
- One submission per student per assignment
- Allowed file types: `PDF`, `DOCX`
- Submission must occur **before the due date** (if defined)

### States
- `DRAFT`
- `SUBMITTED`
- `LOCKED`

### Behavior
- `DRAFT`
  - editable
  - files can be replaced
- `SUBMITTED`
  - final
  - no further edits allowed
- `LOCKED`
  - automatically enforced after deadline (backend-driven)

> Deadline enforcement is handled **entirely on the backend**.  
Frontend confirmations are UX-only.

---

## 7. Grades

### Description
Grades are assigned by teachers to student submissions.

### Rules
- Teachers:
  - can grade submissions **only for assignments they created**
- Students:
  - can view **only their own grades**
  - can view grades **only after they are published**

### Visibility
- Grades are hidden until explicitly published by the teacher
- No student can see another student’s grade under any condition

---

## 8. Public vs Protected Access

### Public (No Authentication Required)
- Home page
- About page
- Roles & feature overview
- Policy pages (privacy, terms)
- Health check endpoint

### Protected (Authentication Required)
- Dashboards
- Classrooms
- Assignments
- Submissions
- Grades

---

## 9. Authorization Model (High Level)

- Authorization is **action-based**, not page-based
- Role alone is **not sufficient**
- Ownership is always verified on the backend

**Example:**
- Being a teacher does not automatically grant grading permission  
- The teacher must **own the assignment** being graded

---

## 10. Security Principles (Non-Negotiable)

- No frontend-trusted authorization
- Ownership-based database queries
- Private cloud file storage
- Strict role and state validation on every action

---

## 11. Out of Scope (MVP)

- Admin panel
- Multi-institute support
- Teaching assistants
- Plagiarism detection
- Advanced analytics

These will be considered in future iterations.

---

## 12. Purpose of This Document

This document exists to:
- lock system rules before implementation
- prevent scope creep
- guide backend architecture
- serve as a reference during development and review