'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function AllOtherJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(jobId) {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`https://new-crm-sdcn.onrender.com/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Job deleted successfully');
        fetchJobs();
      } else {
        alert(data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Error deleting job');
    }
  }

  function getStatus(job) {
    if (job.approved) return 'Approved';
    if (job.rejected) return 'Rejected';
    return 'Pending';
  }

  function getStatusColor(status) {
    if (status === 'Approved') return '#4CAF50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role="admin" />
      <main
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          marginLeft: 240,
          paddingTop: 60,
          padding: 20,
          overflowY: 'auto',
        }}
      >
        <Topbar username="Admin" />
        <div style={{ maxWidth: 1400, margin: '60px auto' }}>
          <h2 style={{ marginBottom: 20 }}>All Jobs</h2>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Work Type</th>
                  <th style={thStyle}>Reason</th>
                  <th style={thStyle}>Date/Time</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Remarks</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle}>Images</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created At</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="13" style={{ textAlign: 'center', padding: 20 }}>
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id}>
                      <td style={tdStyle}>{job.customerName}</td>
                      <td style={tdStyle}>{job.customerPhone}</td>
                      <td style={tdStyle}>{job.workType}</td>
                      <td style={tdStyle}>{job.reason}</td>
                      <td style={tdStyle}>{new Date(job.datetime).toLocaleString()}</td>
                      <td style={tdStyle}>{job.location}</td>
                      <td style={tdStyle}>{job.priority}</td>
                      <td style={tdStyle}>{job.remarks}</td>
                      <td style={tdStyle}>
                        {job.createdBy?.username ? `${job.createdBy.username} (${job.createdBy.role})` : 'N/A'}
                      </td>

                      <td style={tdStyle}>
                        {Array.isArray(job.images) && job.images.length > 0
                          ? `${job.images.length} image(s)`
                          : 'No images'}
                      </td>
                      <td style={{ ...tdStyle, color: getStatusColor(getStatus(job)), fontWeight: 600 }}>
                        {getStatus(job)}
                      </td>
                      <td style={tdStyle}>{new Date(job.createdAt).toLocaleString()}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(job._id)}
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            borderRadius: 4,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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