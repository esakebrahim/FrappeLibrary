import { useState } from "react";
import axios from "axios";
import './index.css';

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    membership_id: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  try {
   const res = await axios.post<{ message: { message: string } }>(
  "http://library.local:8000/api/method/library_app.library_app.api.librarian.add_new_member",
  JSON.stringify(formData),
  {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
);


    setMessage(`✅ ${res.data.message.message}`);
    setFormData({ name: "", membership_id: "", email: "", phone: "" });
  } catch (err: any) {
    console.error("❌ Failed to add member:", err);
    setMessage("❌ Could not add member.");
  }
};


  return (
    <div>
      <h2>➕ Add Member</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="membership_id"
          placeholder="Membership ID"
          value={formData.membership_id}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default AddMember;
