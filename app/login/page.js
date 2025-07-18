'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { requestForToken } from '../firebase-messaging';
import { Eye, EyeOff } from 'lucide-react';
import '../login/login.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const role = decoded.role;

        if (role === 'admin') router.replace('/admin/dashboard');
        else if (role === 'staff') router.replace('/staff/dashboard');
        else if (role === 'technician') router.replace('/technician/dashboard');
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'https://new-crm-sdcn.onrender.com/api/auth/login',
        { username, password }
      );

      const { token } = res.data;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      localStorage.setItem('token', token);
      await requestForToken();

      if (role === 'admin') router.replace('/admin/dashboard');
      else if (role === 'staff') router.replace('/staff/dashboard');
      else if (role === 'technician') router.replace('/technician/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="links">
        <Link href="/register">Register</Link>
        <Link href="/reset-password">Forgot Password?</Link>
      </div>
    </div>
  );
}