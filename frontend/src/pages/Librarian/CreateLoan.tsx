import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './index.css';

interface Book {
  name: string;
  title: string;
}

interface Member {
  name: string;
  full_name: string;
}

interface BookResponse {
  message: {
    books: Book[];
  };
}

interface MemberResponse {
  message: {
    members: Member[];
  };
}

interface LoanResponse {
  message: string;
}

// ✨ Utility to extract CSRF token from cookies
function getCSRFToken(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

const CreateLoan: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [loanDate, setLoanDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
 const fetchBooks = async () => {
  try {
    const res = await axios.get<{ message: { books: Book[] } }>(
      "http://library.local:8000/api/method/library_app.library_app.api.librarian.get_books",
      { withCredentials: true }
    );
    setBooks(res.data.message.books);
  } catch (err) {
    console.error("❌ Failed to fetch books", err);
  }
};

    const fetchMembers = async () => {
      try {
        const res = await axios.get<MemberResponse>(
          "http://library.local:8000/api/method/library_app.library_app.api.librarian.get_members",
          { withCredentials: true }
        );
        setMembers(res.data.message.members);
      } catch (err) {
        console.error("❌ Failed to fetch members", err);
      }
    };

    fetchBooks();
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBook || !selectedMember || !loanDate || !returnDate) {
      setMessage("❌ Please fill in all fields.");
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      const csrfToken = getCSRFToken();

      const res = await axios.post<LoanResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.create_loan",
        {
          book: selectedBook.trim(),
          member: selectedMember.trim(),
          loan_date: loanDate.trim(),
          return_date: returnDate.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "X-Frappe-CSRF-Token": csrfToken || "",
          },
        }
      );

      setMessage(`✅ ${res.data.message}`);
      setSelectedBook("");
      setSelectedMember("");
      setLoanDate("");
      setReturnDate("");
    } catch (err: any) {
      let errorMsg = "❌ Loan creation failed.";
      if (err.response?.data?.exception) {
        errorMsg += ` ${err.response.data.exception}`;
      } else if (err.response?.data?.message) {
        errorMsg += ` ${err.response.data.message}`;
      }
      console.error("❌ Loan creation failed", err);
      setMessage(errorMsg);
    } finally {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Loan</h2>

      {message && (
        <div
          ref={messageRef}
          className={`mb-4 px-4 py-2 rounded ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Book</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.name} value={book.name}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Member</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            required
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.name} value={member.name}>
                {member.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Loan Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={loanDate}
            onChange={(e) => setLoanDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Return Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Loan
        </button>
      </form>
    </div>
  );
};

export default CreateLoan;
