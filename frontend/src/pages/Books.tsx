import { useEffect, useState } from 'react';
import { getBooks } from '../api/frappe';

export default function BookList() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBooks()
      .then((res: any) => {
        setBooks(res.data.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch books", err);
        setError("Could not load books.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📚 Library Books</h2>

      {loading && <p>Loading books...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && books.length === 0 && <p>No books available in the library.</p>}

      <ul>
        {books.map(book => (
          <li key={book.name}><strong>{book.title}</strong> by {book.author}</li>
        ))}
      </ul>
    </div>
  );
}
