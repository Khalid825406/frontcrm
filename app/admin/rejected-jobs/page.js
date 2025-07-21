'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import './reject.css'; // 🟢 Import CSS file

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
    <div className="rejected-container">
      <Sidebar role="admin" />
      <main className="rejected-main">
        <Topbar username="Admin" />
        <div className="rejected-content">
          <JobTable jobs={jobs} loading={loading} />
        </div>
      </main>
    </div>
  );
}

function JobTable({ jobs, loading }) {
  if (loading) return <p className="rejected-loading">Loading...</p>;
  if (jobs.length === 0) return <p className="rejected-empty">No rejected jobs found.</p>;

  return (
    <div className="rejected-table-wrapper">
      <table className="rejected-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Work Type</th>
            <th>Location</th>
            <th>Date/Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.customerName}</td>
              <td>{job.customerPhone}</td>
              <td>{job.workType}</td>
              <td>{job.location}</td>
              <td>{new Date(job.datetime).toLocaleString()}</td>
              <td className="status-rejected">Rejected</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}