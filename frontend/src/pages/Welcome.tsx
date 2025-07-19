import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>📚 Welcome to the Library System</h1>
      <p>This is a simple library management app built with React + Frappe.</p>
      <Link to="/login">
        <button style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
          Login to Continue
        </button>
      </Link>
    </div>
  );
}
