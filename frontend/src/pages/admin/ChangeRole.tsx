import { useEffect, useState } from "react";
import axios from "axios";
import './index.css'; // Make sure this file includes styles for the classes used

const ChangeRole = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all users
    axios
      .get("http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_users", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data as {
          message: { users: { name: string }[] };
        };
        const fetchedUsers = data.message.users.map((u) => u.name);
        setUsers(fetchedUsers);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    // Fetch all roles
    axios
      .get("http://library.local:8000/api/method/library_app.library_app.api.auth.get_all_roles", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data as {
          message: { roles: string[] };
        };
        const filtered = data.message.roles.filter(
          (r) =>
            !["Administrator", "Guest", "All", "Desk User", "System Manager"].includes(r)
        );
        setRoles(filtered);
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedUser || !selectedRole) {
      setMessage("⚠️ Please select both user and role.");
      return;
    }

    axios
      .post(
        "http://library.local:8000/api/method/library_app.library_app.api.admin.change_user_role",
        {
          user: selectedUser,
          new_role: selectedRole,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const data = res.data as { message: string };
        setMessage(`✅ ${data.message}`);
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to change role.");
      });
  };

  return (
    <div className="change-role-container">
      <h3>🔧 Change User Role</h3>

      <div className="form-group">
        <label htmlFor="user-select">Select User:</label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="form-select"
        >
          <option value="">-- Choose a user --</option>
          {users.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="role-select">Select Role:</label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="form-select"
        >
          <option value="">-- Choose a role --</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary">
        ✅ Change Role
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangeRole;
