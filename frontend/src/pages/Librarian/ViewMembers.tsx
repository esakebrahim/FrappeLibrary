import { useEffect, useState } from "react";
import axios from "axios";
import './index.css';

interface UpdateMemberResponse {
  message: string;
}
interface DeleteMemberResponse {
  message: string;
}

type FrappeResponse<T> = {
  message: T;
};


interface Member {
  name: string;
  full_name: string;
  membership_id: string;
  email: string;
  phone: string;
}

const ViewMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    membership_id: "",
    email: "",
    phone: "",
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://library.local:8000/api/method/library_app.library_app.api.librarian.get_all_members", {
        withCredentials: true,
      });
      const data = res.data as { message: { members: Member[] } };
      if (data && data.message && Array.isArray(data.message.members)) {
        setMembers(data.message.members);
      } else {
        console.error("📛 Invalid response format:", data);
        setMembers([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch members:", err);
      setMembers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const startEdit = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      full_name: member.full_name,
      membership_id: member.membership_id,
      email: member.email,
      phone: member.phone,
    });
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    try {
      const res = await axios.post<UpdateMemberResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.update_member",
        {
          name: editingMember.name,
          full_name: editForm.full_name,
          membership_id: editForm.membership_id,
          email: editForm.email,
          phone: editForm.phone,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setMessage(`✅ ${res.data.message}`);
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      console.error("❌ Failed to update member:", err);
      setMessage("❌ Could not update the member.");
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await axios.post<DeleteMemberResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.delete_member",
        { name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setMessage(`🗑️ ${res.data.message}`);
      fetchMembers();
    } catch (err) {
      console.error("❌ Failed to delete member:", err);
      setMessage("❌ Could not delete the member.");
    }
  };

  return (
    <div>
      <h3>👥 All Members</h3>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading members...</p>
      ) : members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Membership ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.name}>
                <td>{member.full_name}</td>
                <td>{member.membership_id}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <button onClick={() => startEdit(member)}>✏️ Update</button>{" "}
                  <button onClick={() => handleDelete(member.name)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingMember && (
        <div style={{ border: "1px solid gray", padding: "1em", marginTop: "1em" }}>
          <h4>✏️ Editing Member: {editingMember.full_name}</h4>
          <label>
            Full Name:
            <input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
            />
          </label>
          <br />
          <label>
            Membership ID:
            <input
              value={editForm.membership_id}
              onChange={(e) => setEditForm({ ...editForm, membership_id: e.target.value })}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </label>
          <br />
          <button onClick={handleUpdate}>💾 Save</button>
          <button onClick={() => setEditingMember(null)}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewMembers;
