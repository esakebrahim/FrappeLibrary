import React, { useState } from "react";
import axios from "axios";

import './index.css';

// Define the nested response shape
//https://youtu.be/N0JLs-RsIDE
interface AddBookResponse {
  message: {
    message: string;
  };
}

const AddBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publish_date, setPublish_Date] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<AddBookResponse>(
        "http://library.local:8000/api/method/library_app.library_app.api.librarian.add_new_book",
        { title, author, isbn, publish_date },
        { withCredentials: true,
          headers: {
      "Content-Type": "application/json",
    },        
 }
      );

      // now i want view book it should display title,author,isbn.publish_year and add action column which have delete and update button
      setMessage(res.data.message.message);

      // Clear form
      setTitle("");
      setAuthor("");
      setIsbn("");
      setPublish_Date("");
    } catch (err) {
      console.error("Add Book Error:", err);
      setMessage("❌ Failed to add book.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add New Book</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Published Date:</label>
          <input
            type="date"
            value={publish_date}
            onChange={(e) => setPublish_Date(e.target.value)}
            required
          />
        </div>
        <button type="submit">➕ Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
