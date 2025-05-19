'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

const thStyle = { padding: '8px 12px', borderBottom: '1px solid #ddd', textAlign: 'left' };
const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #eee' };

export default function StaffJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffJobs();
  }, []);

  async function fetchStaffJobs() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-sdcn.onrender.com/api/jobs/staff/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch your jobs');
    } finally {
      setLoading(false);
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
      <Sidebar role="staff" />
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
        <Topbar username="Khalid" />
        <div style={{ maxWidth: 1400, margin: '60px auto' }}>
          <h2 style={{ marginBottom: 20 }}>My Jobs</h2>
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
                  <th style={thStyle}>Images</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: 20 }}>
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
                        {Array.isArray(job.images) && job.images.length > 0
                          ? `${job.images.length} image(s)`
                          : 'No images'}
                      </td>
                      <td style={{ ...tdStyle, color: getStatusColor(getStatus(job)), fontWeight: 600 }}>
                        {getStatus(job)}
                      </td>
                      <td style={tdStyle}>{new Date(job.createdAt).toLocaleString()}</td>
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
