'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

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
    setActionLoading(jobId);
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
        alert(`Job ${approve ? 'approved' : 'rejected'} successfully`);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setActionLoading(null);
    }
  }

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
          height: '100vh',
          padding: '20px',
        }}
      >
        <Topbar username="Admin" />

        <h2 style={{ marginBottom: 20, marginTop: 60 }}>Pending Job Approvals</h2>

        <div
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p>No pending jobs found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Work Type</th>
                  <th style={thStyle}>Date/Time</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td style={tdStyle}>{job.customerName}</td>
                    <td style={tdStyle}>{job.workType}</td>
                    <td style={tdStyle}>{new Date(job.datetime).toLocaleString()}</td>
                    <td style={tdStyle}>{job.priority}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleJobApproval(job._id, true)}
                        disabled={actionLoading === job._id}
                        style={buttonApproveStyle}
                      >
                        {actionLoading === job._id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleJobApproval(job._id, false)}
                        disabled={actionLoading === job._id}
                        style={buttonRejectStyle}
                      >
                        {actionLoading === job._id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: 14,
  whiteSpace: 'nowrap',
};

const buttonApproveStyle = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '6px 12px',
  marginRight: 8,
  borderRadius: 4,
  cursor: 'pointer',
};

const buttonRejectStyle = {
  backgroundColor: '#f44336',
  border: 'none',
  color: 'white',
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
};