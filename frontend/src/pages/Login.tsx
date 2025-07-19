import { useState } from 'react';
import { login, getCurrentUser } from '../api/frappe';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';  // import styles

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && pwd.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setMsg('');

    try {
      // Your existing login logic
      const res = await login(email, pwd);
      const userRes = await getCurrentUser();
      const userId = (userRes.data as any).message;

      const roleResponse = await axios.get(
        'http://library.local:8000/api/method/library_app.library_app.api.auth.get_user_roles',
        {
          withCredentials: true
         
        }
      );

      interface RoleResponse {
        message: { roles: string[] };
      }

      const roleResponseTyped = roleResponse.data as RoleResponse;

      const roles = roleResponseTyped.message.roles.map((r) => r.toLowerCase());

      if (roles.includes('system manager') || roles.includes('administrator')) {
        navigate('/admin');
      } else if (roles.includes('librarian')) {
        navigate('/librarian');
      } else if (roles.includes('member')) {
        navigate('/member');
      } else {
        setMsg('⚠️ Unknown role. Contact admin.');
      }
    } catch (error: any) {
      setMsg('❌ Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleLogin();
    }
  };

  // Placeholder social login handlers (customize with your social auth)
  const handleGoogleLogin = () => alert('Google login not implemented yet');
  const handleFacebookLogin = () => alert('Facebook login not implemented yet');
  const handleTwitterLogin = () => alert('Twitter login not implemented yet');

  return (
    <div className="login-container" role="main" aria-label="Login Form">
      <h2>🔐 Login</h2>

      <input
        className="login-input"
        placeholder="Email or Username"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
        aria-label="Email or Username"
      />

      <input
        className="login-input"
        placeholder="Password"
        type={showPassword ? 'text' : 'password'}
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        onKeyDown={handleKeyPress}
        aria-label="Password"
      />

      <label className="checkbox-label" htmlFor="showPassword">
        <input
          id="showPassword"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Show Password
      </label>

      <label className="checkbox-label" htmlFor="rememberMe">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        Remember me
      </label>

      <button
        className="login-button"
        onClick={handleLogin}
        disabled={loading || !isFormValid}
        aria-disabled={loading || !isFormValid}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="links" role="navigation" aria-label="Authentication links">
        <a href="/forgot-password" tabIndex={0}>Forgot password?</a>
      </div>

      <p
        className={`message ${
          msg.startsWith('❌') ? 'error' : msg.startsWith('✅') ? 'success' : 'warning'
        }`}
        role="alert"
        aria-live="assertive"
      >
        {msg}
      </p>
    </div>
  );
}
