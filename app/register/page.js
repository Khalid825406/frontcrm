'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'staff',
    assignedJobs: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const jobsArray = form.assignedJobs
      .split(',')
      .map(job => job.trim())
      .filter(job => job);

    const res = await fetch('https://new-crm-sdcn.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, assignedJobs: jobsArray })
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      setForm({ username: '', password: '', role: 'staff', assignedJobs: '' });

      // ✅ Redirect to login page after 2.5 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);
    } else {
      setError(data.message);
    }
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 400px;
          margin: 60px auto;
          padding: 30px 25px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input, select {
          padding: 12px 15px;
          margin-bottom: 18px;
          border: 1.5px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          transition: border-color 0.3s ease;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 6px rgba(0,102,204,0.3);
        }
        button {
          padding: 12px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #004999;
        }
        p.message {
          text-align: center;
          margin-top: 15px;
          font-weight: 600;
        }
        p.error {
          color: #d93025;
        }
        p.success {
          color: #188038;
        }
      `}</style>

      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="staff">Office Staff</option>
            <option value="technician">Technician</option>
          </select>

          <button type="submit">Register</button>
        </form>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
      </div>
    </>
  );
}
