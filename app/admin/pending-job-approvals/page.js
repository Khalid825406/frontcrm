'use client';
import { useEffect, useState } from 'react';
import '../pending-job-approvals/PendingJobsPage.css';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/app/components/AdminLayout';

export default function PendingJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data.filter((j) => !j.approved && !j.rejected));
      } else {
        setJobs([]);
      }
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleJobApproval(jobId, approve) {
    setActionLoading({ jobId, action: approve ? 'approve' : 'reject' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/jobs/${jobId}/${approve ? 'approve' : 'reject'}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      toast.success(`Job ${approve ? 'approved' : 'rejected'}`);
      fetchJobs();
    } catch {
      toast.error('Update failed');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AdminLayout>
      <section className="pj-container">
        <header className="pj-header">
          <h1 className="pj-title">Pending Job Approvals</h1>
          <p className="pj-subtitle">Review and approve jobs before they go live.</p>
        </header>

        {loading ? (
          <Skeleton />
        ) : jobs.length === 0 ? (
          <Empty />
        ) : (
          <Table data={jobs} actionLoading={actionLoading} onAction={handleJobApproval} />
        )}
      </section>
    </AdminLayout>
  );
}

/* ---------- sub-components ---------- */
function Table({ data, actionLoading, onAction }) {
  return (
    <div className="pj-table-wrap">
      <table className="pj-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Work Type</th>
            <th>Date / Time</th>
            <th>Priority</th>
            <th className="pj-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((j) => (
            <tr key={j._id}>
              <td data-label="Customer"><span className="pj-customer">{j.customerName}</span></td>
              <td data-label="Work Type"><span className="pj-worktype">{j.workType}</span></td>
              <td data-label="Date / Time">{new Date(j.datetime).toLocaleString()}</td>
              <td data-label="Priority"><PriorityBadge val={j.priority} /></td>
              <td data-label="Actions" className="pj-right">
                <div className="pj-actions">
                  <button
                    onClick={() => onAction(j._id, true)}
                    disabled={actionLoading?.jobId === j._id && actionLoading?.action === 'approve'}
                    className="pj-btn pj-approve"
                  >
                    {actionLoading?.jobId === j._id && actionLoading?.action === 'approve' ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => onAction(j._id, false)}
                    disabled={actionLoading?.jobId === j._id && actionLoading?.action === 'reject'}
                    className="pj-btn pj-reject"
                  >
                    {actionLoading?.jobId === j._id && actionLoading?.action === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriorityBadge({ val }) {
  const map = {
    low: { bg: '#dbeafe', color: '#1e40af' },
    medium: { bg: '#fef3c7', color: '#d97706' },
    high: { bg: '#fee2e2', color: '#dc2626' },
  };
  const style = map[val?.toLowerCase()] || map.medium;
  return (
    <span className="pj-badge" style={{ background: style.bg, color: style.color }}>
      {val}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="pj-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="pj-skel-row">
          <div className="pj-skel" style={{ width: '25%' }} />
          <div className="pj-skel" style={{ width: '20%' }} />
          <div className="pj-skel" style={{ width: '30%' }} />
          <div className="pj-skel" style={{ width: '10%' }} />
          <div className="pj-skel" style={{ width: '80px' }} />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="pj-empty">
      <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
        <path stroke="#cbd5e1" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3>All caught up</h3>
      <p>No pending jobs to review.</p>
    </div>
  );
}