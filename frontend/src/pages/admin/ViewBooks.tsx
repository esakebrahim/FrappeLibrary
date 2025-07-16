import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  name: string;
  title: string;
  author: string;
  isbn: string;
  publish_date: string;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://library.local:8000/api/method/library_app.library_app.api.admin.get_all_books", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data as { message: { books: Book[] } };
        setBooks(data.message.books);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch books:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h3>📚 All Books</h3>
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Author</th>
              <th style={thStyle}>ISBN</th>
              <th style={thStyle}>Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i}>
                <td style={tdStyle}>{b.title}</td>
                <td style={tdStyle}>{b.author}</td>
                <td style={tdStyle}>{b.isbn}</td>
                <td style={tdStyle}>{b.publish_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  background: "#f2f2f2",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default Books;
