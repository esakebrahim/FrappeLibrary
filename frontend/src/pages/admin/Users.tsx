// src/pages/admin/Users.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  full_name: string;
  enabled: number;
  last_login: string | null;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_users", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data as { message: { users: User[] } };
        setUsers(data.message.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  const thStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px",
    background: "#f2f2f2",
    textAlign: "left" as const,
  };

  const tdStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>👤 All Registered Users</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Enabled</th>
              <th style={thStyle}>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.full_name}</td>
                <td style={tdStyle}>{u.enabled ? "✅" : "❌"}</td>
                <td style={tdStyle}>{u.last_login ?? "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
