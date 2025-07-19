// src/pages/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
interface ResetResponse {
  message: string;
}
const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query string
  const email = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    // Real-time validation
    const isLongEnough = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const matches = newPassword === confirmPassword;
    setValid(isLongEnough && hasUppercase && hasNumber && matches);
  }, [newPassword, confirmPassword]);

  const handleReset = async () => {
    try {
      if (!email) {
        setMessage("Missing email.");
        return;
      }

      setSubmitting(true);
      setMessage("Resetting password...");

      const res = await axios.post<ResetResponse >(
        "http://library.local:8000/api/method/library_app.library_app.api.api.reset_password",
        {
          email,
          new_password: newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage("✅ " + res.data.message);

      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>🔑 Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
        <li style={{ color: newPassword.length >= 8 ? "green" : "red" }}>At least 8 characters</li>
        <li style={{ color: /[A-Z]/.test(newPassword) ? "green" : "red" }}>At least one uppercase letter</li>
        <li style={{ color: /\d/.test(newPassword) ? "green" : "red" }}>At least one number</li>
        <li style={{ color: newPassword === confirmPassword ? "green" : "red" }}>Passwords match</li>
      </ul>

      <button onClick={handleReset} disabled={!valid || submitting}>
        {submitting ? "Resetting..." : "Reset Password"}
      </button>

      {message && (
        <p style={{ marginTop: "1rem", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
