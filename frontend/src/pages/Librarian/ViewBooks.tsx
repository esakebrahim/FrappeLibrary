import { useEffect, useState } from "react";
import axios from "axios";
import './index.css';


interface Book {
  name: string;
  title: string;
  author: string;
  isbn: string;
  publish_date: string;
}

const ViewBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({ title: "", author: "", isbn: "", publish_date: "" });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://library.local:8000/api/method/library_app.library_app.api.librarian.get_all_books", {
        withCredentials: true,
      });
      const data = res.data as { message: { books: Book[] } };
      if (data && data.message && Array.isArray(data.message.books)) {
        setBooks(data.message.books);
      } else {
        console.error("📛 Invalid response format:", data);
        setBooks([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch books:", err);
      setBooks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookName: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await axios.post<{ message: string }>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.delete_book",
        { name: bookName },
        { withCredentials: true }
      );
      setMessage(`✅ ${res.data.message}`);
      fetchBooks();
    } catch (err) {
      console.error("❌ Failed to delete book:", err);
      setMessage("❌ Could not delete the book.");
    }
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publish_date: book.publish_date,
    });
  };

  const handleUpdate = async () => {
    if (!editingBook) return;
    try {
     const res = await axios.post<{ message: string }>(
  "http://library.local:8000/api/method/library_app.library_app.api.librarian.update_book",
  {
    name: editingBook.name,
    ...editForm,
  },
  { withCredentials: true }
);

      setMessage(`✅ ${res.data.message}`);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("❌ Failed to update book:", err);
      setMessage("❌ Could not update the book.");
    }
  };

  return (
    <div>
      <h3>📚 All Books</h3>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Published Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.name}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.publish_date}</td>
                <td>
                  <button onClick={() => startEdit(book)}>✏️ Update</button>{" "}
                  <button onClick={() => handleDelete(book.name)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div style={{ border: "1px solid gray", padding: "1em", marginTop: "1em" }}>
          <h4>✏️ Editing Book: {editingBook.title}</h4>
          <label>Title: <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} /></label><br />
          <label>Author: <input value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} /></label><br />
          <label>ISBN: <input value={editForm.isbn} onChange={e => setEditForm({ ...editForm, isbn: e.target.value })} /></label><br />
          <label>Publish Date: <input type="date" value={editForm.publish_date} onChange={e => setEditForm({ ...editForm, publish_date: e.target.value })} /></label><br />
          <button onClick={handleUpdate}>💾 Save</button>
          <button onClick={() => setEditingBook(null)}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewBooks;
