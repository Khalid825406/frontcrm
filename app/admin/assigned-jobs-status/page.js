'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import StatusTimeline from '../../components/StatusTimeline';

export default function AdminAssignedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      setError('No token found. Please login again.');
      return;
    }

    axios
      .get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      });
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: 240, padding: 20, flexGrow: 1 }}>
        <h2>Job Tracker</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {jobs.length === 0 && !error && <p>No assigned jobs found.</p>}
        {jobs.map((j) => (
          <div key={j._id} className="job-card-status" style={{ marginBottom: 20, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}>
            <h4>{j.customerName}</h4>
            <p><strong>Assigned To:</strong> {j.assignedTo?.username || 'Unassigned'}</p>
            <StatusTimeline timeline={j.statusTimeline} job={j}  />
          </div>
        ))}
      </main>
    </div>
  );
}