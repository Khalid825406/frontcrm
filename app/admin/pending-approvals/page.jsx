'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './PendingApprovals.css';

export default function PendingApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchPendingUsers(); }, []);

  async function fetchPendingUsers() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingUsers(Array.isArray(data) ? data.filter(u => !u.approved && !u.rejected) : []);
    } catch {
      setMessage('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function actionUser(id, action) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/${action}-user/${id}`,
        { method: action === 'approve' ? 'PUT' : 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      setMessage(`User ${action}d successfully`);
      fetchPendingUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage(`Error ${action}ing user`);
    }
  }

  return (
    <AdminLayout>
      
      <section className="pa-container">
        <header className="pj-header">
          <h1 className="pj-title">Pending Users Approvals</h1>
          <p className="pj-subtitle">Review and approve Users before they go live.</p>
        </header>
        {message && <div className="pa-toast">{message}</div>}

        {loading ? (
          <Skeleton />
        ) : pendingUsers.length === 0 ? (
          <Empty />
        ) : (
          <Table data={pendingUsers} onAction={actionUser} />
        )}
      </section>
    </AdminLayout>
  );
}

function Table({ data, onAction }) {
  return (
    <div className="pa-table-wrap">
      <table className="pa-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Password</th>
            <th className="pa-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr key={u._id}>
              <td data-label="User"><span className="pa-username">{u.username}</span></td>
              <td data-label="Role"><span className="pa-role">{u.role}</span></td>
              <td data-label="Phone"><span className="pa-username">{u.phone}</span></td>
              <td>*****</td>
              <td data-label="Actions" className="pa-right">
                <div className="pa-actions">
                  <button className="pa-btn pa-approve" onClick={() => onAction(u._id, 'approve')}>Approve</button>
                  <button className="pa-btn pa-reject" onClick={() => onAction(u._id, 'reject')}>Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="pa-skeleton">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="pa-skel-row" />)}
    </div>
  );
}

function Empty() {
  return (
    <div className="pa-empty">
      <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
        <path stroke="#cbd5e1" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3>Nothing pending</h3>
      <p>All users have been reviewed. Check back later.</p>
    </div>
  );
}