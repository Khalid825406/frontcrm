'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import './register.css'; // ✅ External CSS

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'staff',
    phone: ''
  });
  const [loading, setLoading] = useState(false); // 🔄

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const formattedPhone = `+968${form.phone}`;
      const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/register', {
        username: form.username,
        password: form.password,
        role: form.role,
        phone: formattedPhone
      });

      toast.success(res.data.message || 'Registered successfully. Awaiting admin approval.');
      setForm({ username: '', password: '', role: 'staff', phone: '' });

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <label>Username</label>
          <input
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="staff">Staff</option>
            <option value="technician">Technician</option>
          </select>

          <label>Mobile Number</label>
          <input
            name="phone"
            placeholder="8-digit number"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            required
          />

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
