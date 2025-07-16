import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
}

interface RolesResponse {
  message: {
    all_roles: string[];
    assigned_roles: string[];
  };
}

interface UsersResponse {
  message: {
    users: User[];
    current_user: string;
  };
}

interface UpdateResponse {
  message: string;
}

const ManageRoles: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Fetch users on load
  useEffect(() => {
    axios.get<UsersResponse>(
      'http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_users',
      { withCredentials: true }
    )
    .then((res) => {
      setUsers(res.data.message.users);
      setCurrentUser(res.data.message.current_user);
    })
    .catch((err) => {
      console.error(err);
      setMessage('❌ Failed to fetch users');
    });
  }, []);

  // Fetch roles when a user is selected
  useEffect(() => {
    if (!selectedUser) return;
    axios.get<RolesResponse>(
      `http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_roles_and_user_roles?user=${selectedUser}`,
      { withCredentials: true }
    )
    .then((res) => {
      const data = res.data.message;
      setRoles(data.all_roles);
      setAssigned(data.assigned_roles);
    })
    .catch((err) => {
      console.error(err);
      setMessage('❌ Failed to fetch roles');
    });
  }, [selectedUser]);

  const handleRoleChange = (role: string) => {
    if (role === 'Administrator' && selectedUser === currentUser) {
      alert("⚠️ You can't remove the Administrator role from yourself.");
      return;
    }

    if (assigned.includes(role)) {
      setAssigned((prev) => prev.filter((r) => r !== role));
    } else {
      setAssigned((prev) => [...prev, role]);
    }
  };

  const handleUpdate = () => {
    if (!selectedUser) return;

    axios.post<UpdateResponse>(
      'http://library.local:8000/api/method/library_app.library_app.api.admin.update_user_roles',
      {
        user: selectedUser,
        roles: assigned,
      },
      { withCredentials: true }
    )
    .then((res) => {
      setMessage(`✅ ${res.data.message}`);
    })
    .catch((err) => {
      console.error(err);
      setMessage('❌ Failed to update roles.');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔐 Manage User Roles</h2>

      <div style={{ margin: '10px 0' }}>
        <label>Select a user: </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select --</option>
          {users.map((user) => (
            <option key={user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {roles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>🛠 Assign/Unassign Roles</h4>
          <ul>
            {roles.map((role) => (
              <li key={role}>
                <label>
                  <input
                    type="checkbox"
                    checked={assigned.includes(role)}
                    onChange={() => handleRoleChange(role)}
                    disabled={
                      selectedUser === currentUser && role === 'Administrator'
                    }
                  />
                  {role}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleUpdate}>💾 Update Roles</button>
        </div>
      )}

      {message && (
        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</div>
      )}
    </div>
  );
};

export default ManageRoles;
