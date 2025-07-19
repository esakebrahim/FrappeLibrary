// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import React from "react";
import { logout } from "../pages/logout";
import "./index.css";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/users" className="sidebar-link">
            👤 View Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/reports" className="sidebar-link">
            📊 Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/books" className="sidebar-link">
            📚 View Books
          </NavLink>
        </li>
       
        <li>
          <NavLink to="/admin/manage-roles" className="sidebar-link">
            🛠️ Manage Roles
          </NavLink>
        </li>
 <li>
          <NavLink to="/admin/change-password" className="sidebar-link">
            🛠️ Change Password
          </NavLink>
        </li>
        <li>
          <button className="sidebar-link logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
