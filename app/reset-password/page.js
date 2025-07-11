'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setIsLoading(true);
      const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/reset-password', {
        username,
        newPassword,
      });

      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 380,
      margin: '60px auto',
      padding: 30,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: 16,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 15,
          }}
        />
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: 16,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 15,
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: 20,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 16,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {msg && <p style={{ color: 'green', marginTop: 20, textAlign: 'center', fontWeight: 500 }}>{msg}</p>}
      {error && <p style={{ color: 'red', marginTop: 20, textAlign: 'center', fontWeight: 500 }}>{error}</p>}

      <div style={{ textAlign: 'center', marginTop: 25 }}>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontSize: 14 }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}