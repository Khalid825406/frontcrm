'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusTimeline from '../../components/StatusTimeline';
import '../staff-reject/staff-rej.css'

export default function AdminRejectedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login again.');
      return;
    }

    axios
      .get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const rejectedJobs = res.data.filter((job) => {
          const latestStatus = job.statusTimeline[job.statusTimeline.length - 1]?.status;
          return latestStatus === 'Rejected';
        });
        setJobs(rejectedJobs);
      })
      .catch((err) => {
        console.error('Error fetching rejected jobs:', err);
        setError('Failed to load jobs. Please try again.');
      });
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="staff" />
      <main className='created' style={{ marginLeft: 240, padding: 20, flexGrow: 1, marginTop: 40 }}>
        <Topbar username="newstaff" />
        <h2>Rejected Jobs by Technician</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {jobs.length === 0 && !error && <p>No rejected jobs found.</p>}
        {jobs.map((j) => (
          <div
            key={j._id}
            className="job-card-status"
            style={{ marginBottom: 20, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}
          >
            <div>
              {j.images?.[0] && (
                <img src={j.images[0]} alt="Job" style={{ width: '100%',height:300 }} />
              )}
              <h4>Customer Name: {j.customerName}</h4>
              <p>Number: {j.customerPhone}</p>
              <p>Work Type: {j.workType}</p>
              <p>Department: {j.Department}</p>
              <p>Reason: {j.reason}</p>
              <p>Date & Time: {new Date(j.datetime).toLocaleString()}</p>
              <p>Location: {j.location}</p>
              <p>Priority: {j.priority}</p>
              <p>Remark: {j.remarks}</p>
              <p><strong>Assigned To:</strong> {j.assignedTo?.username || 'Unassigned'}</p>
            </div>
            <StatusTimeline timeline={j.statusTimeline} job={j} />
          </div>
        ))}
      </main>
    </div>
  );
}