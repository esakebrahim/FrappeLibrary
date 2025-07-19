import React, { useState, useEffect } from "react";
import axios from "axios";

interface BackendMessage {
  message: string;
}

interface ApiResponse {
  message: BackendMessage | string;
}

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Real-time validation for password strength and matching
  useEffect(() => {
    const isLongEnough = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const matches = newPassword === confirmPassword;
    const currentPasswordEntered = currentPassword.length > 0;

    setValid(isLongEnough && hasUppercase && hasNumber && matches && currentPasswordEntered);
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!valid) {
      setMessage("❌ Please fix validation errors before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("Changing password...");

      const res = await axios.post<ApiResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.auth.change_password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        { withCredentials: true }
      );

      // Handle response message
      const responseMessage =
        typeof res.data.message === "string"
          ? res.data.message
          : res.data.message.message;

      setMessage(`✅ ${responseMessage}`);

      // Clear inputs after successful change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      const errMsg =
        error.response?.data?.message?.message ||
        error.response?.data?.message ||
        "Failed to change password.";
      setMessage(`❌ ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h2>🔐 Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ display: "block", marginBottom: 16, padding: 8, width: "100%" }}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ display: "block", marginBottom: 16, padding: 8, width: "100%" }}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ display: "block", marginBottom: 16, padding: 8, width: "100%" }}
      />

      <ul style={{ fontSize: 14, marginBottom: 16 }}>
        <li style={{ color: newPassword.length >= 8 ? "green" : "red" }}>
          At least 8 characters
        </li>
        <li style={{ color: /[A-Z]/.test(newPassword) ? "green" : "red" }}>
          At least one uppercase letter
        </li>
        <li style={{ color: /\d/.test(newPassword) ? "green" : "red" }}>
          At least one number
        </li>
        <li style={{ color: newPassword === confirmPassword ? "green" : "red" }}>
          Passwords match
        </li>
        <li style={{ color: currentPassword.length > 0 ? "green" : "red" }}>
          Current password entered
        </li>
      </ul>

      <button
        onClick={handleChangePassword}
        disabled={!valid || submitting}
        style={{
          padding: "0.5rem 1rem",
          cursor: valid && !submitting ? "pointer" : "not-allowed",
          backgroundColor: valid ? "#2563eb" : "#94a3b8",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        {submitting ? "Changing..." : "Change Password"}
      </button>

      {message && (
        <p style={{ marginTop: 16, color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ChangePassword;
