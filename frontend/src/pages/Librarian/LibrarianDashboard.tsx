// src/pages/Librarian/LibrarianDashboard.tsx
import { Routes, Route } from "react-router-dom";
import AddBook from "./AddBook";
import ViewBooks from "./ViewBooks";
import AddMember from "./AddMember";
import ViewMembers from "./ViewMembers";
import CreateLoan from "./CreateLoan";
import ViewLoan from "./ViewLoan";
import { logout } from "../logout";
import './index.css';



export default function LibrarianDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", padding: "1rem", backgroundColor: "#eee" }}>
        <nav>
          <ul>
            <li><a href="/librarian/add-book">➕ Add Book</a></li>
            <li><a href="/librarian/view-books">📚 View Books</a></li>
            <li><a href="/librarian/add-members">➕ Add Member</a></li> 
            <li><a href="/librarian/view-members">📚 View Members</a></li>
             <li><a href="/librarian/create-loans">📦 Create Loan</a></li>
              <li><a href="/librarian/view-loans">📦 View Loan</a></li>
<li>
  <button
    onClick={logout}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      margin: 0,
      cursor: "pointer",
      color: "blue",
      textDecoration: "underline",
      font: "inherit",
    }}
  >
    🚪 Logout
  </button>
</li>


          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route path="add-book" element={<AddBook />} />
        
           <Route path="view-books" element={<ViewBooks />} />
            <Route path="add-members" element={<AddMember />} />
              <Route path="view-members" element={<ViewMembers />} />
                <Route path="create-loans" element={<CreateLoan />} />
                 <Route path="view-loans" element={<ViewLoan />} />
        </Routes>
      </main>
    </div>
  );
}
