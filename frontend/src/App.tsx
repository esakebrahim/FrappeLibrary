
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import BookList from './pages/Books';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './api/frappe';
import { ReactNode } from 'react';
import React, { ReactElement } from 'react';
import LoginPage from './pages/Login';
import LibrarianDashboard from "./pages/Librarian/LibrarianDashboard";
import MemberDashboard from './pages/Member/MemberDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import ViewBooks from "./pages/admin/ViewBooks";
import ChangeRole from "./pages/admin/ChangeRole";
import AssignRole from "./pages/admin/AssignRole";
import ManageRoles from "./pages/admin/ManageRoles";
import ForgotPassword from "./pages/ForgotPassword";



function ProtectedRoute({ children }: { children: ReactElement }): ReactElement | null{
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (!res.data.message) {
          navigate('/login');
        } else {
          setChecking(false);
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (checking) return <p>Checking session...</p>;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/librarian/*" element={<LibrarianDashboard />} />
        <Route path="/member/*" element={<MemberDashboard />} />
  <Route path="/admin" element={<AdminDashboard />}>
    <Route path="users" element={<Users />} />
     <Route path="/admin/books" element={<ViewBooks />} />
    <Route path="reports" element={<Reports />} />
<Route path="/admin/change-role" element={<ChangeRole />} />
<Route path="/admin/assign-role" element={<AssignRole />} />
<Route path="/admin/manage-roles" element={<ManageRoles />} />


  </Route>
<Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
