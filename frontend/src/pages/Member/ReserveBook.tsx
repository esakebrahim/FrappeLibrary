import React, { useEffect, useState } from "react";
import axios from "axios";

interface ReserveResponse {
  message: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  loan_date?: string;
  return_date?: string;
  member?: string;
}

export default function ReserveBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

useEffect(() => {
  async function fetchBooks() {
    setFetching(true);
    setError("");
    try {
      const res = await axios.get<{ message: Book[] }>(
        "http://library.local:8000/api/method/library_app.library_app.api.auth.get_loaned_books",
        { withCredentials: true }
      );
      const booksData = res.data.message;
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      setError("Failed to load books");
    } finally {
      setFetching(false);
    }
  }
  fetchBooks();
}, []);


  async function handleReserve(bookId: string) {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await axios.post<ReserveResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.auth.reserve_book",
        { book_id: bookId },
        { withCredentials: true }
      );

      if (res.data.message === "Success") {
        setSuccessMessage("Book reserved successfully!");
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } else {
        setError("Failed to reserve book");
      }
    } catch (err: any) {
      // ✅ Fixed Error Parsing
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data._server_messages === "string"
      ) {
        try {
          const serverMessages = JSON.parse(err.response.data._server_messages);
          if (Array.isArray(serverMessages) && serverMessages.length > 0) {
            const parsed = JSON.parse(serverMessages[0]);
            setError(parsed.message || "An error occurred while reserving the book");
          } else {
            setError("An error occurred while reserving the book");
          }
        } catch {
          setError("An error occurred while reserving the book");
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while reserving the book");
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <p>Loading loaned books...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>Reserve a Loaned Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!books.length && <p>No loaned books available for reservation.</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {books.map((book) => (
          <li
            key={book.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{book.title}</strong> by {book.author}{" "}
              {book.loan_date && ` | Loaned: ${book.loan_date}`}
              {book.return_date && ` | Return: ${book.return_date}`}
            </span>
            <button
              disabled={loading}
              onClick={() => handleReserve(book.id)}
              style={{
                backgroundColor: "#1e40af",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {loading ? "Reserving..." : "Reserve"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
