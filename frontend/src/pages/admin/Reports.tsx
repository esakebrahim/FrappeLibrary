import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Loan {
  name: string;
  book: string;
  member: string;
  loan_date: string;
  return_date: string;
  status: string;
}

interface Reservation {
  name: string;
  book: string;
  member: string;
  reservation_date: string;
  status: string;
}

interface ApiResponse {
  message?: {
    message: Array<Loan | Reservation>;
  };
}

const Reports: React.FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<Loan[]>([]);
  const [reservedBooks, setReservedBooks] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const borrowedRes = await axios.get<ApiResponse>(
          "http://library.local:8000/api/method/library_app.library_app.api.auth.get_borrowed_books",
          { withCredentials: true }
        );
        const reservedRes = await axios.get<ApiResponse>(
          "http://library.local:8000/api/method/library_app.library_app.api.auth.get_reserved_books",
          { withCredentials: true }
        );

        const borrowedMessage = borrowedRes.data.message;
        const reservedMessage = reservedRes.data.message;

        const borrowedData: Loan[] =
          borrowedMessage && Array.isArray(borrowedMessage.message)
            ? borrowedMessage.message.filter(
                (item): item is Loan =>
                  'loan_date' in item && 'return_date' in item
              )
            : [];

        const reservedData: Reservation[] =
          reservedMessage && Array.isArray(reservedMessage.message)
            ? reservedMessage.message.filter(
                (item): item is Reservation =>
                  'reservation_date' in item
              )
            : [];

        setBorrowedBooks(borrowedData);
        setReservedBooks(reservedData);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const generateBorrowedPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const JsPdf = jsPDFModule.default;
      const doc = new JsPdf();
      doc.text("Borrowed Books Report", 10, 10);
      borrowedBooks.forEach((b, index) => {
        doc.text(
          `${index + 1}. ${b.name} - ${b.book} - ${b.member} - ${b.loan_date} - ${b.return_date} - ${b.status}`,
          10,
          20 + index * 10
        );
      });
      doc.save("borrowed_books.pdf");
    });
  };

  const generateReservedPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const JsPdf = jsPDFModule.default;
      const doc = new JsPdf();
      doc.text("Reserved Books Report", 10, 10);
      reservedBooks.forEach((r, index) => {
        doc.text(
          `${index + 1}. ${r.name} - ${r.book} - ${r.member} - ${r.reservation_date} - ${r.status}`,
          10,
          20 + index * 10
        );
      });
      doc.save("reserved_books.pdf");
    });
  };

  const downloadBorrowedCSV = () => {
    const headers = ['Name', 'Book', 'Member', 'Loan Date', 'Return Date', 'Status'];
    const rows = borrowedBooks.map(b => [
      b.name,
      b.book,
      b.member,
      b.loan_date,
      b.return_date,
      b.status,
    ]);
    const csvContent =
      [headers, ...rows]
        .map(e => e.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'borrowed_books.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadReservedCSV = () => {
    const headers = ['Name', 'Book', 'Member', 'Reservation Date', 'Status'];
    const rows = reservedBooks.map(r => [
      r.name,
      r.book,
      r.member,
      r.reservation_date,
      r.status,
    ]);
    const csvContent =
      [headers, ...rows]
        .map(e => e.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reserved_books.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* Borrowed Books Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Borrowed Books</h2>
        <div style={styles.buttonsContainer}>
          <button onClick={generateBorrowedPDF} style={styles.button}>Download Borrowed PDF</button>
          <button onClick={downloadBorrowedCSV} style={styles.button}>Download Borrowed CSV</button>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Book</th>
                <th style={styles.th}>Member</th>
                <th style={styles.th}>Loan Date</th>
                <th style={styles.th}>Return Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((b, index) => (
                <tr key={index}>
                  <td style={styles.td}>{b.name}</td>
                  <td style={styles.td}>{b.book}</td>
                  <td style={styles.td}>{b.member}</td>
                  <td style={styles.td}>{b.loan_date}</td>
                  <td style={styles.td}>{b.return_date}</td>
                  <td style={styles.td}>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Reserved Books Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Reserved Books</h2>
        <div style={styles.buttonsContainer}>
          <button onClick={generateReservedPDF} style={styles.button}>Download Reserved PDF</button>
          <button onClick={downloadReservedCSV} style={styles.button}>Download Reserved CSV</button>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Book</th>
                <th style={styles.th}>Member</th>
                <th style={styles.th}>Reservation Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservedBooks.map((r, index) => (
                <tr key={index}>
                  <td style={styles.td}>{r.name}</td>
                  <td style={styles.td}>{r.book}</td>
                  <td style={styles.td}>{r.member}</td>
                  <td style={styles.td}>{r.reservation_date}</td>
                  <td style={styles.td}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Basic inline styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: '3rem',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #ddd',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.5rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.5rem',
    color: 'red',
  },
};

export default Reports;
