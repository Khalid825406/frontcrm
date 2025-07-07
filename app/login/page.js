

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { requestForToken } from '../firebase-messaging'; 

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/login', {
        username,
        password,
      });

      const { token } = res.data;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      localStorage.setItem('token', token);

      // 🔔 Send FCM Token to backend
      await requestForToken();


      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'staff') router.push('/staff/dashboard');
      else if (role === 'technician') router.push('/technician/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 380px;
          margin: 70px auto;
          padding: 30px 25px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 25px rgba(0,0,0,0.12);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #222;
          font-weight: 700;
          font-size: 28px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input {
          padding: 12px 15px;
          margin-bottom: 18px;
          font-size: 16px;
          border: 1.8px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.3s ease;
        }
        input:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 6px rgba(0,112,243,0.3);
        }
        button {
          background-color: #0070f3;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 17px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        button[disabled] {
          background-color: #999;
          cursor: not-allowed;
        }
        button:hover:not([disabled]) {
          background-color: #005bb5;
        }
        p.error {
          color: #d32f2f;
          margin-top: 15px;
          text-align: center;
          font-weight: 600;
        }
          .mana{
            color: #736767;
          }
            .mana a{
            color:blue;
            text-decoration:none;
            }
      `}</style>

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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
         <p className="mana">
          Don’t have an account?{" "}
          <Link href="/register" >Register</Link>
        </p>
      </div>
    </>
  );
}
