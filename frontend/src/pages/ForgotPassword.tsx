import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


 interface VerifyOtpResponse {
      message: string;
    }

 interface SendOtpResponse {
      message: string;
    }

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
const handleSendOtp = async () => {
  try {
    setMsg("Sending OTP...");

   

    const res = await axios.post<SendOtpResponse>(
      "http://library.local:8000/api/method/library_app.library_app.api.api.send_otp",
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setOtpSent(true);
    setMsg(res.data.message); // ✅ Now properly typed
  } catch (err: any) {
    setMsg(`❌ Failed to send OTP: ${err.response?.data?.message || err.message}`);
  }
};


  const handleVerifyOtp = async () => {
    try {

      setVerifying(true);
      setMsg("Verifying OTP...");
      const res = await axios.post<VerifyOtpResponse >(
        "http://library.local:8000/api/method/library_app.library_app.api.api.verify_otp",
        { email, code: otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMsg("✅ OTP verified! You can now reset your password.");
      setTimeout(() => navigate(`/reset-password?email=${email}`), 1000);

      
    } catch (err: any) {
      setMsg(`❌ OTP verification failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>🔐 Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={otpSent}
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <button onClick={handleSendOtp} disabled={!email || otpSent} style={{ marginBottom: "1rem" }}>
        Send OTP
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
          />
          <button onClick={handleVerifyOtp} disabled={!otp || verifying}>
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

     <p
  style={{
    marginTop: "1rem",
    color: typeof msg === "string" && msg.startsWith("✅") ? "green" : "red",
  }}
>
  {String(msg)}
</p>

    </div>
  );
};

export default ForgotPassword;
