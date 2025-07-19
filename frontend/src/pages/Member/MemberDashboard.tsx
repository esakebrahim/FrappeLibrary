import { Routes, Route, Link } from "react-router-dom";
import ViewMyLoans from "./ViewMyLoans";
import ViewReservations from "./ViewReservations";
import ReserveBook from "./ReserveBook";
import { logout } from "../logout";
import { useEffect, useState } from "react";
import "./index.css";

const quotes = [
  "📖 A room without books is like a body without a soul.",
  "📘 The more that you read, the more things you will know.",
  "📚 Reading gives us someplace to go when we have to stay where we are.",
  "🧠 Knowledge is power. Keep learning!",
  "🌟 A book is a dream that you hold in your hands.",
];

export default function MemberDashboard() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="member-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">📚 Member Panel</h2>

        <div className="sidebar-wrapper">
          <ul className="sidebar-menu">
            <li>
              <Link to="view-loans">📦 My Loans</Link>
            </li>
            <li>
              <Link to="reserve-book">📚 Reserve Book</Link>
            </li>
            <li>
              <Link to="view-reservations">🔖 My Reservations</Link>
            </li>
          </ul>

          <button className="logout-button" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="welcome-card">
          <h1>👋 Welcome to Your Library Dashboard</h1>
          <p>You can manage your loans, track reservations, and explore our collection.</p>
          <blockquote>{quote}</blockquote>
        </div>

        <Routes>
          <Route path="view-loans" element={<ViewMyLoans />} />
          <Route path="reserve-book" element={<ReserveBook />} />
          <Route path="view-reservations" element={<ViewReservations />} />
        </Routes>
      </main>
    </div>
  );
}
