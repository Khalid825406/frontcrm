'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import '../pending-job-approvals/PendingJobsPage.css';
import {toast} from 'react-hot-toast'

export default function PendingJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const pending = data.filter((job) => !job.approved && !job.rejected);
        setJobs(pending);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleJobApproval(jobId, approve) {
    setActionLoading({ jobId, action: approve ? 'approve' : 'reject' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `https://new-crm-sdcn.onrender.com/api/admin/jobs/${jobId}/${approve ? 'approve' : 'reject'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error updating job');
      } else {
        toast.success(`Job ${approve ? 'approved' : 'rejected'} successfully`)
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error')
    } finally {
      setActionLoading(null);
    }
  }


  return (
    <div className="pending-layout">
      <Sidebar role="admin" />

      <main className="pending-main">
        <Topbar username="Admin" />

        <div className="pending-card">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton skeleton-text" style={{ width: '20%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '20%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '25%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '15%' }}></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <p>No pending jobs found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="pending-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Work Type</th>
                    <th>Date/Time</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.customerName}</td>
                      <td>{job.workType}</td>
                      <td>{new Date(job.datetime).toLocaleString()}</td>
                      <td>{job.priority}</td>
                      <td>
                        <button
                          onClick={() => handleJobApproval(job._id, true)}
                          disabled={actionLoading?.jobId === job._id && actionLoading?.action === 'approve'}
                          className="btn-approve"
                        >
                          {actionLoading?.jobId === job._id && actionLoading?.action === 'approve' ? 'Approving...' : 'Approve'}
                        </button>

                        <button
                          onClick={() => handleJobApproval(job._id, false)}
                          disabled={actionLoading?.jobId === job._id && actionLoading?.action === 'reject'}
                          className="btn-reject"
                        >
                          {actionLoading?.jobId === job._id && actionLoading?.action === 'reject' ? 'Rejecting...' : 'Reject'}
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
