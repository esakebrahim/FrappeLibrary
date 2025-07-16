// src/pages/Member/ViewReservations.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Reservation {
  name: string;
  book: string;
  reserved_on: string;
  status: string;
  book_title: string;
}

interface ReservationListResponse {
  message: {
    reservations: Reservation[];
  };
}

interface CreateReservationResponse {
  message: string;
}

interface LoanedBook {
  name: string;
  title: string;
}

interface LoanedBooksResponse {
  message: {
    books: LoanedBook[];
  };
}

const ViewReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availableLoanedBooks, setAvailableLoanedBooks] = useState<LoanedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await axios.get<ReservationListResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.member.get_my_reservations",
        { withCredentials: true }
      );
      setReservations(res.data.message.reservations);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
      setError("Failed to load reservations.");
    }
  };

  const fetchLoanedBooks = async () => {
    try {
      const res = await axios.get<LoanedBooksResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.member.get_loaned_books",
        { withCredentials: true }
      );
      setAvailableLoanedBooks(res.data.message.books);
    } catch (err) {
      console.error("Failed to fetch loaned books", err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchLoanedBooks();
  }, []);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      setError("Please select a book to reserve.");
      return;
    }
    try {
      const res = await axios.post<CreateReservationResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.member.create_reservation",
        { book: selectedBook },
        { withCredentials: true }
      );
      setMessage(res.data.message); // ✅ message is a string
      setError("");
      setSelectedBook("");
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create reservation.");
      setMessage("");
      console.error("Reservation error", err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">My Reservations</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleReserve} className="mb-6">
        <label className="block mb-1 font-medium">Reserve a Loaned Book</label>
        <select
          className="w-full border p-2 rounded mb-2"
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          required
        >
          <option value="">Select a book</option>
          {availableLoanedBooks.map((book) => (
            <option key={book.name} value={book.name}>
              {book.title}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Reserve
        </button>
      </form>

      {reservations.length === 0 ? (
        <p>You have no current reservations.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Book</th>
              <th className="py-2 px-4 border">Reserved On</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.name}>
                <td className="py-2 px-4 border">{r.book_title}</td>
                <td className="py-2 px-4 border">{new Date(r.reserved_on).toLocaleString()}</td>
                <td className="py-2 px-4 border">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewReservations;
