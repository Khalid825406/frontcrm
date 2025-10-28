'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Search } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ username = 'User', onSearch }) {
  const router = useRouter();
  const [term, setTerm] = useState('');

  // debounce emit
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(term);
    }, 300);
    return () => clearTimeout(t);
  }, [term, onSearch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <User size={20} className="topbar-icon" />
        <span>Welcome, <strong>{username}</strong></span>
      </div>

      {/* ---- search ---- */}
      <div className="topbar-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search anything..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <button className="topbar-logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </header>
  );
}