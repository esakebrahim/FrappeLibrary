import React, { useEffect, useState } from "react";
import axios from "axios";
import './index.css';

interface Loan {
  name: string;
  book_title: string;
  member_name: string;
  loan_date: string;
  return_date: string;
  status: string;
}

// 👇 Utility function to extract cookie value
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const ViewLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [message, setMessage] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await axios.get<{ message: { loans: Loan[] } }>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.get_loans",
        { withCredentials: true }
      );
      setLoans(res.data.message.loans);
    } catch (err) {
      console.error("❌ Failed to fetch loans", err);
    }
  };

  const handleReturn = async (loanName: string) => {
    try {
      const csrfToken = getCookie("csrf_token");

      const res = await axios.post<{ message: string }>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.return_book",
        { loan_id: loanName }, // ✅ must match backend param
        {
          withCredentials: true,
          headers: {
            "X-Frappe-CSRF-Token": csrfToken || "",
          },
        }
      );
      setMessage(`✅ ${res.data.message}`);
      fetchLoans(); // Refresh list
    } catch (err: any) {
      console.error("❌ Return failed", err);
      const errorMsg =
        err?.response?.data?.message || "❌ Failed to return book.";
      setMessage(errorMsg);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Loans</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {loans.length === 0 ? (
        <p>No active loans found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Book</th>
              <th className="py-2 px-4 border">Member</th>
              <th className="py-2 px-4 border">Loan Date</th>
              <th className="py-2 px-4 border">Return Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans
              .filter((loan) => loan.status.toLowerCase() === "loaned")
              .map((loan) => (
                <tr key={loan.name}>
                  <td className="py-2 px-4 border">{loan.book_title}</td>
                  <td className="py-2 px-4 border">{loan.member_name}</td>
                  <td className="py-2 px-4 border">{loan.loan_date}</td>
                  <td className="py-2 px-4 border">{loan.return_date}</td>
                  <td className="py-2 px-4 border">{loan.status}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleReturn(loan.name)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewLoans;
