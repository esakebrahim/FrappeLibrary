import { useEffect, useState } from "react";
import axios from "axios";
import './index.css'; // Make sure this contains the table styles

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

  return (
    <div className="table-container">
      <h3>👤 All Registered Users</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Enabled</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.full_name}</td>
                <td>{u.enabled ? "✅" : "❌"}</td>
                <td>{u.last_login ?? "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
