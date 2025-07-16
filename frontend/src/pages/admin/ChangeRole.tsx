// src/pages/admin/ChangeRole.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const ChangeRole = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ✅ Fetch all users
    axios
      .get("http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_users", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data as {
          message: { users: { name: string }[] };
        };
        const fetchedUsers = data.message.users.map((u) => u.name);
        console.log("✅ Users:", fetchedUsers);
        setUsers(fetchedUsers);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch users:", err);
      });

    // ✅ Fetch all roles
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
console.log("✅ Roles:", filtered);
        setRoles(filtered);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch roles:", err);
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
    <div>
      <h3>🔧 Change User Role</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select User:
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Choose a user --</option>
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Role:
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- Choose a role --</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleSubmit}>✅ Change Role</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeRole;
