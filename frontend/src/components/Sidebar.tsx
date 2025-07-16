// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import React from "react";
import { logout } from "../pages/logout";

const Sidebar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff", height: "100vh", width: "200px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1rem" }}>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            👤 View Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            📊 Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/books"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            📚 View Books
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/change-role"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            🔄 Change User Role
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/manage-roles"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            🛠️ Manage Roles
          </NavLink>
        </li>
      </ul>

      <div style={{ paddingTop: "1rem", borderTop: "1px solid #444" }}>
        <button
          onClick={logout}
          style={{
            background: "none",
            border: "none",
            color: "#f55",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
            fontSize: "1rem",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
