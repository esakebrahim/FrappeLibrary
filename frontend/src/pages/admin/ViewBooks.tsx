import { useEffect, useState } from "react";
import axios from "axios";
import './index.css'; // make sure it contains your table styles

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
    <div className="table-container">
      <h3>📚 All Books</h3>
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.isbn}</td>
                <td>{b.publish_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;
