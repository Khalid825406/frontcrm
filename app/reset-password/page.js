'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './ResetPassword.css';

export default function ResetPasswordPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setIsLoading(true);
      const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/reset-password', {
        username,
        newPassword,
      });

      toast.success(res.data.message || 'Password reset successful');
      setUsername('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
    <div className="reset-container">
      <h2 className="reset-title">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="reset-input"
        />

        <div className="password-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="reset-input"
          />
          <span onClick={() => setShowNewPassword(!showNewPassword)} className="eye-icon">
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="reset-input"
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button type="submit" disabled={isLoading} className="reset-button">
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="back-link">
        <Link href="/">← Back to Login</Link>
      </div>
    </div>
    </div>
  );
}