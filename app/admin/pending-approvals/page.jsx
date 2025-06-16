'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function PendingApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPendingUsers(Array.isArray(data) ? data.filter(u => !u.approved && !u.rejected) : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function approveUser(id) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://new-crm-sdcn.onrender.com/api/admin/approve-user/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessage(data.message || 'User approved successfully');
      fetchPendingUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Error approving user.');
    }
  }

  async function rejectUser(id) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://new-crm-sdcn.onrender.com/api/admin/reject-user/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessage(data.message || 'User rejected successfully');
      fetchPendingUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Error rejecting user.');
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading pending approvals...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar role="admin" />

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
        <Topbar username="Admin" />

        <div style={{
          maxWidth: 900,
          margin: '20px auto',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ marginBottom: 20 }}>Pending Approvals</h1>

          {message && (
            <p style={{
              backgroundColor: '#e0f7fa',
              color: '#00796b',
              padding: '10px 15px',
              borderRadius: 6,
              marginBottom: 20,
              fontWeight: 500
            }}>
              {message}
            </p>
          )}

          {pendingUsers.length === 0 ? (
            <p>No users pending approval.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={tdStyle}>{user.username}</td>
                      <td style={tdStyle}>{user.role}</td>
                      <td style={tdStyle}>
                        <button
                          style={approveBtnStyle}
                          onClick={() => approveUser(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          style={rejectBtnStyle}
                          onClick={() => rejectUser(user._id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  fontWeight: 600,
  fontSize: 14,
  backgroundColor: '#f8f8f8',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: 14,
  whiteSpace: 'nowrap',
};

const approveBtnStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  padding: '6px 12px',
  marginRight: 8,
  cursor: 'pointer',
};

const rejectBtnStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  padding: '6px 12px',
  cursor: 'pointer',
};
