# 📚 Simple Library Management System

This is my submission for the 360Ground Full-Stack Coding Challenge. The system is built using **Frappe Framework 15** (backend) and a fully custom **React 18 + TypeScript** frontend with role-based authentication and CRUD functionality.

## ✅ Setup Instructions

### 🔧 Backend (Frappe)

1. Clone the repository and switch into the Frappe bench:
   ```bash
   cd library-bench

2. Install requirements:
   bench get-app library_app
   bench --site library.local install-app library_app

3.   Start the server:
    bench start

4.  Access the backend:
http://library.local:8000

  Frontend (React)
1.  Navigate to the frontend folder:
    cd frontend

2.  Install dependencies:
    npm install

Start the development server:
    npm run dev

Access the frontend:
http://localhost:3000



⚙️ Tech Stack
Backend: Frappe Framework 15

Frontend: React 18 + TypeScript

Database: MariaDB (via Frappe)

Auth: Frappe Sessions (via cookies)

Email: SMTP for overdue notifications

UI Styling: Custom CSS + Tailwind (partially used)

📚 Features Implemented
ID	User Story
US-01	✅ Book CRUD (create, view, edit, delete) from custom UI
US-02	✅ Member CRUD (create, view, edit, delete) from custom UI
US-03	✅ Loan creation with loan/return dates
US-04	✅ Availability check prevents double-loaning the same book
US-05	✅ Reservation queue system (pending when book is already on loan)
US-06	✅ Overdue email notifications to members (on return or overdue detection)
US-07	✅ Reports
US-08	✅ REST API for all operations (books, members, loans, reservations)
US-09	✅ Role-based access (Admin, Librarian, Member)
US-10	✅ Fully custom React frontend (no Frappe Desk used)

🧪 Known Issues / Trade-Offs


⚠️ No test coverage (due to short time window).

📩 Emails are sent via default SMTP and may require config depending on environment.

📆 Validation could be improved for return dates (future enhancement).
