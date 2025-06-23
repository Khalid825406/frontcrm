'use client';

import { useRouter } from 'next/navigation';
import '../components/AssignedJobs.css';

const Topbar = ({ username = 'Loading...' }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        Welcome, <b>{username}</b>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Topbar;