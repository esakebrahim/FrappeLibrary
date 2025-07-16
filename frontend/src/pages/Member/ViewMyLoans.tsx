// src/pages/Member/ViewMyLoans.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Loan {
  name: string;
  book_title: string;
  loan_date: string;
  return_date: string;
  status: string;
}

interface LoanResponse {
  message: {
    loans: Loan[];
  };
}

const ViewMyLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchLoans = async () => {
    try {
      const res = await axios.get<LoanResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.member.get_my_loans",
        {
          withCredentials: true, // 🛡️ Important for session-based auth
        }
      );
      setLoans(res.data.message.loans);
    } catch (err) {
      console.error("❌ Failed to fetch loans", err);
      setError("Failed to fetch loans. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) return <p>🔄 Loading loans...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (loans.length === 0) return <p>📭 You have no active loans.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📚 My Active Loans</h2>
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">📘 Book</th>
            <th className="py-2 px-4 border">📅 Loan Date</th>
            <th className="py-2 px-4 border">📆 Return Date</th>
            <th className="py-2 px-4 border">📌 Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.name}>
              <td className="py-2 px-4 border">{loan.book_title}</td>
              <td className="py-2 px-4 border">{loan.loan_date}</td>
              <td className="py-2 px-4 border">{loan.return_date}</td>
              <td className="py-2 px-4 border">{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMyLoans;
