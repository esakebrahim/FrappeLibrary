import { Routes, Route, NavLink } from "react-router-dom";
import AddBook from "./AddBook";
import ViewBooks from "./ViewBooks";
import AddMember from "./AddMember";
import ViewMembers from "./ViewMembers";
import CreateLoan from "./CreateLoan";
import ViewLoan from "./ViewLoan";
import { logout } from "../logout";
import './index.css'; // Import CSS styles

export default function LibrarianDashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside className="sidebar">
        <h2 className="sidebar-title">📚 Librarian Panel</h2>

        <div className="sidebar-nav-wrapper">
          <nav>
            <ul className="sidebar-menu">
              <li>
                <NavLink to="/librarian/add-book">➕ Add Book</NavLink>
              </li>
              <li>
                <NavLink to="/librarian/view-books">📘 View Books</NavLink>
              </li>
              <li>
                <NavLink to="/librarian/add-members">👤 Add Member</NavLink>
              </li>
              <li>
                <NavLink to="/librarian/view-members">👥 View Members</NavLink>
              </li>
              <li>
                <NavLink to="/librarian/create-loans">📦 Create Loan</NavLink>
              </li>
              <li>
                <NavLink to="/librarian/view-loans">📄 View Loans</NavLink>
              </li>
           
<li>
          <button className="logout-button" onClick={logout}>
            🚪 Logout
          </button>
 </li>
          </ul>
          </nav>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
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
