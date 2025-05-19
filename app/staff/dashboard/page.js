'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function StaffDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    axios.get('https://new-crm-sdcn.onrender.com/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      console.log('API Response:', res.data);

      const { role, user: username } = res.data;

      if (role !== 'staff') {
        router.push(`/${role}/dashboard`);
      } else {
        // Wrap user string into object with username key
        setUser({ username, role });
      }
    })
    .catch(() => router.push('/login'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <Sidebar role="staff" />

      <main
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          marginLeft: 240,
          paddingTop: 60,
          overflowY: 'auto',
          height: '100vh'
        }}
      >
        {user && <Topbar username={user.username} />}

        <div style={{
          maxWidth: 900,
          margin: '20px auto',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: 10 }}>Staff Dashboard</h1>
          {user ? (
            <p>Welcome, <b>{user.username}</b></p>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
      </main>
    </div>
  );
}