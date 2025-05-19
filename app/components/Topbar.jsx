'use client';

import { useRouter } from 'next/navigation';

const Topbar = ({ username }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header
      style={{
        height: 60,
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 260, // Adjust based on sidebar width
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <div style={{ fontSize: 16, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        Welcome, <b>{username ? username : 'Loading...'}</b>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ef4444',
          border: 'none',
          padding: '8px 15px',
          borderRadius: 5,
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14,
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#dc2626')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;