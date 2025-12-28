'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import './reject.css';

export default function RejectedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedJobs();
  }, []);

  const fetchRejectedJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // ✅ Same condition as All Jobs page
      const rejectedJobs = data
        .filter((job) => job.rejected === true) // <-- sirf rejected true
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setJobs(rejectedJobs);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch rejected jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="rj-shell">
        <header className="rj-header">
          <h1 className="rj-title">Rejected Jobs</h1>
          <p className="rj-subtitle">All jobs that were rejected</p>
        </header>

        {loading ? <Skeleton /> : jobs.length === 0 ? <Empty /> : <Table data={jobs} />}
      </div>
    </AdminLayout>
  );
}

/* ---------- Table Component ---------- */
function Table({ data }) {
  return (
    <div className="rj-table-wrap">
      <table className="rj-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Work Type</th>
            <th>Location</th>
            <th>Date / Time</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((j) => {
            const img = j.images?.[0]
              ? j.images[0].startsWith('http')
                ? j.images[0]
                : `https://new-crm-sdcn.onrender.com${j.images[0]}`
              : '/placeholder.jpg';

            // ✅ same status logic as All Jobs
            const status = j.approved
              ? 'Approved'
              : j.rejected
              ? 'Rejected'
              : 'Pending';

            return (
              <tr key={j._id}>
                <td><img src={img} alt="job" className="rj-thumb" /></td>
                <td>{j.customerName}</td>
                <td>{j.customerPhone}</td>
                <td>{j.workType}</td>
                <td>{j.location}</td>
                <td>{new Date(j.datetime).toLocaleString()}</td>
                <td><PriorityBadge val={j.priority} /></td>
                <td>
                  <span
                    className={`rj-status ${
                      status === 'Rejected'
                        ? 'rj-status-rejected'
                        : status === 'Approved'
                        ? 'rj-status-approved'
                        : 'rj-status-pending'
                    }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Priority Badge ---------- */
function PriorityBadge({ val }) {
  const map = {
    low: { bg: '#dbeafe', color: '#1e40af' },
    medium: { bg: '#fef3c7', color: '#d97706' },
    high: { bg: '#fee2e2', color: '#dc2626' },
  };
  const style = map[val?.toLowerCase()] || map.medium;
  return (
    <span className="rj-badge" style={{ background: style.bg, color: style.color }}>
      {val}
    </span>
  );
}

/* ---------- Skeleton Loader ---------- */
function Skeleton() {
  return (
    <div className="rj-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rj-skel-row">
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j} className="rj-skel" style={{ width: `${10 + j * 10}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Empty State ---------- */
function Empty() {
  return (
    <div className="rj-empty">
      <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
        <path stroke="#cbd5e1" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3>No Rejected Jobs</h3>
      <p>Great news – nothing rejected right now.</p>
    </div>
  );
}
