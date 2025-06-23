'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../rejected-jobs/reject.css'

export default function RejectedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedJobs();
  }, []);

  async function fetchRejectedJobs() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const rejected = data.filter((job) => job.rejected === true);
      setJobs(rejected);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch rejected jobs');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role="admin" />
      <main className='mainrejede' style={{ flex: 1, backgroundColor: '#f9f9f9', marginLeft: 240, paddingTop: 60, padding: 20, overflowY: 'auto' }}>
        <Topbar username="Admin" />
        <div style={{ maxWidth: 1400, margin: '60px auto' }}>
          <h2 style={{ marginBottom: 20 }}>Rejected Jobs</h2>
          <JobTable jobs={jobs} loading={loading} />
        </div>
      </main>
    </div>
  );
}


function JobTable({ jobs, loading }) {
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (jobs.length === 0) {
    return <p style={{ padding: 20 }}>No rejected jobs found.</p>;
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Work Type</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Date/Time</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td style={tdStyle}>{job.customerName}</td>
              <td style={tdStyle}>{job.customerPhone}</td>
              <td style={tdStyle}>{job.workType}</td>
              <td style={tdStyle}>{job.location}</td>
              <td style={tdStyle}>{new Date(job.datetime).toLocaleString()}</td>
              <td style={{ ...tdStyle, color: '#f44336', fontWeight: 600 }}>Rejected</td>
            </tr>
          ))}
        </tbody>
      </table>
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
