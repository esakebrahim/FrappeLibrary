// src/pages/AdminDashboard.tsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { logout } from "./logout";


const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h2>📋 Admin Dashboard</h2>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
