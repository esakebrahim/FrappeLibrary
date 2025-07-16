// src/pages/Member/MemberDashboard.tsx
import { Routes, Route, Link } from "react-router-dom";

import ViewMyLoans from "./ViewMyLoans";
import ViewReservations from "./ViewReservations";
import { logout } from "../logout";


export default function MemberDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", padding: "1rem", backgroundColor: "#eee" }}>
        <nav>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li><Link to="view-loans">📦 My Loans</Link></li>
            <li><Link to="view-reservations">🔖 My Reservations</Link></li>
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
         <Route path="view-loans" element={<ViewMyLoans />} />
         <Route path="view-reservations" element={<ViewReservations />} />
        
        </Routes>
      </main>
    </div>
  );
}
